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
    const { reviewedBy } = body;

    // Update application status
    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy,
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
      data: application,
      message: 'Application approved successfully',
    });
  } catch (error) {
    console.error('Failed to approve application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to approve application' },
      { status: 500 }
    );
  }
}