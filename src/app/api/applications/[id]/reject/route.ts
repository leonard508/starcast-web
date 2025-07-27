import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { emailService } from '../../../../../lib/email/service';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { rejectionReason, reviewedBy } = body;

    // Update application status
    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        applicationStatus: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy,
        rejectionReason,
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
        applicationId: application.applicationNumber,
        rejectionReason: rejectionReason || 'service not available in your area',
        alternativeOptions: 'We are continuously expanding our coverage areas and will notify you when service becomes available.',
        contactPhone: '087 550 0000',
      });
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      data: application,
      message: 'Application rejected successfully',
    });
  } catch (error) {
    console.error('Failed to reject application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reject application' },
      { status: 500 }
    );
  }
}