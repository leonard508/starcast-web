import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { emailService } from '../../../../../lib/email/service';
import { requireAdmin, rateLimit, securityHeaders, corsHeaders } from '../../../../../lib/auth/middleware';
import { rejectApplicationSchema, idSchema } from '../../../../../lib/validation/schemas';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Rate limiting
    const rateLimitResult = rateLimit(5, 60000, (req) => `admin_reject_${req.headers.get('x-forwarded-for') || 'unknown'}`)(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Require admin authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    // Validate application ID
    const validatedParams = idSchema.parse(params.id);

    // Validate request body
    const body = await request.json();
    const validatedBody = rejectApplicationSchema.parse({
      ...body,
      reviewedBy: user.id // Use authenticated user ID
    });

    // Update application status
    const application = await prisma.application.update({
      where: { id: validatedParams },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy: validatedBody.reviewedBy,
        rejectionReason: validatedBody.rejectionReason,
        adminComments: validatedBody.adminComments,
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

    // Update user status to REJECTED
    await prisma.user.update({
      where: { id: application.userId },
      data: {
        applicationStatus: 'REJECTED',
        serviceStatus: 'NOT_ACTIVE',
      },
    });

    // Send rejection email to customer
    try {
      await emailService.sendRejectionEmail({
        to: application.user.email,
        customerName: `${application.user.firstName} ${application.user.lastName}`,
        packageName: application.package.name,
        applicationId: application.applicationNumber || application.id,
        rejectionReason: validatedBody.rejectionReason,
        alternativeOptions: 'We are continuously expanding our coverage areas and will notify you when service becomes available.',
        contactPhone: '087 550 0000',
      });
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: application.id,
        applicationNumber: application.applicationNumber,
        status: application.status,
        reviewedAt: application.reviewedAt,
        reviewedBy: application.reviewedBy,
        rejectionReason: application.rejectionReason
      },
      message: 'Application rejected successfully',
    }, { headers });
  } catch (error) {
    console.error('Failed to reject application:', error);
    
    // Don't expose internal error details
    const errorMessage = error instanceof Error && error.message.includes('validation') 
      ? error.message 
      : 'Failed to reject application';
      
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