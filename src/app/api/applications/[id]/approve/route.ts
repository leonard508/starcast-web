import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { emailService } from '../../../../../lib/email/service';
import { requireAdmin, rateLimit, securityHeaders, corsHeaders } from '../../../../../lib/auth/middleware';
import { approveApplicationSchema, idSchema } from '../../../../../lib/validation/schemas';

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

    // Rate limiting - 5 requests per minute for admin actions
    const rateLimitResult = rateLimit(5, 60000, (req) => `admin_approve_${req.headers.get('x-forwarded-for') || 'unknown'}`)(request);
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
    const validatedBody = approveApplicationSchema.parse({
      ...body,
      reviewedBy: user.id // Use authenticated user ID
    });

    // Update application status
    const application = await prisma.application.update({
      where: { id: validatedParams },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy: validatedBody.reviewedBy,
        approvalReason: validatedBody.approvalReason,
        estimatedInstallDate: validatedBody.estimatedInstallDate ? new Date(validatedBody.estimatedInstallDate) : undefined,
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

    // Update user status to APPROVED
    await prisma.user.update({
      where: { id: application.userId },
      data: {
        applicationStatus: 'APPROVED',
        serviceStatus: 'PENDING_INSTALLATION',
        packageId: application.packageId,
      },
    });

    // Send approval email to customer
    try {
      await emailService.sendApprovalEmail({
        to: application.user.email,
        customerName: `${application.user.firstName} ${application.user.lastName}`,
        packageName: application.package.name,
        activationDate: 'within 1-2 business days',
        installationContact: '087 550 0000',
        accountNumber: `ACC-${application.user.id.slice(-6).toUpperCase()}`,
      });
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: application.id,
        applicationNumber: application.applicationNumber,
        status: application.status,
        reviewedAt: application.reviewedAt,
        reviewedBy: application.reviewedBy
      },
      message: 'Application approved successfully',
    }, { headers });
  } catch (error) {
    console.error('Failed to approve application:', error);
    
    // Don't expose internal error details
    const errorMessage = error instanceof Error && error.message.includes('validation') 
      ? error.message 
      : 'Failed to approve application';
      
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