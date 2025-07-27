import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { emailService } from '../../../lib/email/service';
import { requireAdmin, withAuth, rateLimit, securityHeaders, corsHeaders } from '../../../lib/auth/middleware';
import { applicationFilterSchema, createApplicationSchema } from '../../../lib/validation/schemas';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Rate limiting for data access
    const rateLimitResult = rateLimit(20, 60000)(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Require admin authentication to view applications
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    
    // Validate query parameters
    const filterParams = {
      status: searchParams.get('status') || undefined,
      packageType: searchParams.get('packageType') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || 'desc',
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined
    };

    const validatedFilters = applicationFilterSchema.parse(filterParams);

    // Build where clause with validated filters
    const where: any = {};
    if (validatedFilters.status) {
      where.status = validatedFilters.status;
    }
    if (validatedFilters.packageType) {
      where.package = { type: validatedFilters.packageType };
    }
    if (validatedFilters.dateFrom || validatedFilters.dateTo) {
      where.submittedAt = {};
      if (validatedFilters.dateFrom) {
        where.submittedAt.gte = new Date(validatedFilters.dateFrom);
      }
      if (validatedFilters.dateTo) {
        where.submittedAt.lte = new Date(validatedFilters.dateTo);
      }
    }

    // Calculate pagination
    const skip = (validatedFilters.page - 1) * validatedFilters.limit;
    const take = validatedFilters.limit;

    // Get total count for pagination
    const totalCount = await prisma.application.count({ where });

    const applications = await prisma.application.findMany({
      where,
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        package: {
          include: {
            provider: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        [validatedFilters.sortBy || 'submittedAt']: validatedFilters.sortOrder,
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / validatedFilters.limit);

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page: validatedFilters.page,
        limit: validatedFilters.limit,
        totalCount,
        totalPages,
        hasNext: validatedFilters.page < totalPages,
        hasPrev: validatedFilters.page > 1
      }
    }, { headers });
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    
    const errorMessage = error instanceof Error && error.message.includes('validation') 
      ? error.message 
      : 'Failed to fetch applications';
      
    return NextResponse.json(
      { success: false, error: errorMessage },
      { 
        status: error instanceof Error && error.message.includes('validation') ? 400 : 500,
        headers: {
          ...securityHeaders(),
          ...corsHeaders()
        }
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Rate limiting for application creation - 3 per hour per IP
    const rateLimitResult = rateLimit(3, 3600000, (req) => `create_app_${req.headers.get('x-forwarded-for') || 'unknown'}`)(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // For application creation, we can allow authenticated users (not just admin)
    // But we still need authentication to prevent spam
    const authResult = await withAuth(request);
    if (!authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to submit application' },
        { status: 401, headers }
      );
    }

    const body = await request.json();
    const validatedBody = createApplicationSchema.parse({
      ...body,
      userId: authResult.user.id // Use authenticated user ID
    });

    // Generate application number
    const applicationNumber = `APP-${Date.now()}`;

    const application = await prisma.application.create({
      data: {
        applicationNumber,
        userId: validatedBody.userId,
        packageId: validatedBody.packageId,
        serviceAddress: validatedBody.serviceAddress,
        contactNumber: validatedBody.contactNumber,
        specialRequirements: validatedBody.specialRequirements,
        preferredInstallDate: validatedBody.preferredInstallDate ? new Date(validatedBody.preferredInstallDate) : undefined,
        status: 'PENDING_APPROVAL',
        submittedAt: new Date(),
      },
      include: {
        user: true,
        package: {
          include: {
            provider: true,
          },
        },
      },
    });

    // Send welcome email to customer and admin notification
    try {
      await emailService.sendWelcomeEmail({
        to: application.user.email,
        customerName: `${application.user.firstName} ${application.user.lastName}`,
        packageName: application.package.name,
        applicationId: application.applicationNumber,
      });
      
      await emailService.sendAdminNotification({
        customerName: `${application.user.firstName} ${application.user.lastName}`,
        customerEmail: application.user.email,
        customerPhone: application.user.phone || '',
        packageName: application.package.name,
        applicationId: application.applicationNumber,
        serviceAddress: application.serviceAddress,
        submittedAt: application.submittedAt.toISOString(),
        specialRequirements: application.specialRequirements || '',
      });
    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: application.id,
        applicationNumber: application.applicationNumber,
        status: application.status,
        submittedAt: application.submittedAt
      },
      message: 'Application submitted successfully'
    }, { headers });
  } catch (error) {
    console.error('Failed to create application:', error);
    
    const errorMessage = error instanceof Error && error.message.includes('validation') 
      ? error.message 
      : 'Failed to create application';
      
    return NextResponse.json(
      { success: false, error: errorMessage },
      { 
        status: error instanceof Error && error.message.includes('validation') ? 400 : 500,
        headers: {
          ...securityHeaders(),
          ...corsHeaders()
        }
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...corsHeaders(request.headers.get('origin') || undefined),
      ...securityHeaders()
    }
  });
}