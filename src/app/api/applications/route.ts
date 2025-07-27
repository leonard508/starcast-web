import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'all') {
      where.applicationStatus = status;
    }

    const applications = await prisma.application.findMany({
      where,
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
        submittedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      packageId,
      serviceAddress,
      specialRequirements,
    } = body;

    // Generate application number
    const applicationNumber = `APP-${Date.now()}`;

    const application = await prisma.application.create({
      data: {
        applicationNumber,
        userId,
        packageId,
        serviceAddress,
        specialRequirements,
        applicationStatus: 'PENDING_APPROVAL',
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
    // This will be integrated with our email service
    try {
      // TODO: Import and use email service
      // await emailService.sendWelcomeEmail({
      //   to: application.user.email,
      //   customerName: `${application.user.firstName} ${application.user.lastName}`,
      //   packageName: application.package.name,
      //   applicationId: application.applicationNumber,
      // });
      
      // await emailService.sendAdminNotification({
      //   customerName: `${application.user.firstName} ${application.user.lastName}`,
      //   customerEmail: application.user.email,
      //   customerPhone: application.user.phone,
      //   packageName: application.package.name,
      //   applicationId: application.applicationNumber,
      //   serviceAddress: application.serviceAddress,
      //   submittedAt: application.submittedAt.toISOString(),
      //   specialRequirements: application.specialRequirements,
      // });
    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error('Failed to create application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create application' },
      { status: 500 }
    );
  }
}