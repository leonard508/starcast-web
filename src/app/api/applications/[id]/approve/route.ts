import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, rateLimit, securityHeaders, corsHeaders } from '../../../../../lib/auth/middleware';
import * as Brevo from '@getbrevo/brevo';
import nodemailer from 'nodemailer';

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
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(`admin_approve_${clientIp}`, 5, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers }
      );
    }

    // Require admin authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    // Validate application ID
    if (!params.id) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
        { status: 400, headers }
      );
    }

    // Get request body (optional for approval)
    await request.json().catch(() => ({}));

    // Update application status
    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy: user.id,
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
        serviceStatus: 'PENDING_PAYMENT',
        packageId: application.packageId,
      },
    });

    // Send approval email to customer
    await sendApprovalEmail(application);

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

// Helper function to send approval email
async function sendApprovalEmail(application: any) {
  try {
    const emailProvider = process.env.EMAIL_PROVIDER || 'brevo';
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Approved - Starcast ISP</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              🎉 Application Approved!
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Welcome to Starcast ISP
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px;">
              Congratulations ${application.user.firstName}!
            </h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Great news! Your internet service application has been approved and you're all set to get connected.
            </p>
            
            <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">Your Service Details</h3>
              <div style="color: #4a5568; font-size: 16px; line-height: 1.8;">
                <strong>Package:</strong> ${application.package.name}<br>
                <strong>Provider:</strong> ${application.package.provider.name}<br>
                <strong>Application ID:</strong> ${application.applicationNumber}<br>
                <strong>Account Number:</strong> ACC-${application.user.id.slice(-6).toUpperCase()}<br>
                <strong>Status:</strong> Approved - Ready for Installation
              </div>
            </div>
            
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">Next Steps</h3>
              <div style="color: #4a5568; font-size: 16px; line-height: 1.8;">
                1. Our installation team will contact you within 1-2 business days<br>
                2. Schedule your installation appointment<br>
                3. Prepare payment for your first month's service<br>
                4. Enjoy your new internet connection!
              </div>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 16px;">Important Contact Information</h3>
              <div style="color: #4a5568; font-size: 14px; line-height: 1.6;">
                <strong>Installation Queries:</strong> 087 550 0000<br>
                <strong>Email Support:</strong> ${process.env.FROM_EMAIL || 'info@starcast.co.za'}<br>
                <strong>Office Hours:</strong> Monday - Friday, 8AM - 5PM
              </div>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
              Thank you for choosing Starcast ISP. We're excited to have you as a customer!<br><br>
              Best regards,<br>
              <strong>The Starcast Team</strong>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #edf2f7; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px; margin: 0;">
              Questions? Contact us at ${process.env.FROM_EMAIL || 'info@starcast.co.za'}
            </p>
          </div>
        </div>
      </body>
    </html>`;

    const textContent = `
Application Approved - Starcast ISP

Congratulations ${application.user.firstName}!

Great news! Your internet service application has been approved and you're all set to get connected.

Your Service Details:
- Package: ${application.package.name}
- Provider: ${application.package.provider.name}
- Application ID: ${application.applicationNumber}
- Account Number: ACC-${application.user.id.slice(-6).toUpperCase()}
- Status: Approved - Ready for Installation

Next Steps:
1. Our installation team will contact you within 1-2 business days
2. Schedule your installation appointment
3. Prepare payment for your first month's service
4. Enjoy your new internet connection!

Important Contact Information:
- Installation Queries: 087 550 0000
- Email Support: ${process.env.FROM_EMAIL || 'info@starcast.co.za'}
- Office Hours: Monday - Friday, 8AM - 5PM

Thank you for choosing Starcast ISP. We're excited to have you as a customer!

Best regards,
The Starcast Team

Questions? Contact us at ${process.env.FROM_EMAIL || 'info@starcast.co.za'}
    `.trim();

    if (emailProvider === 'brevo' && process.env.BREVO_API_KEY && process.env.BREVO_API_KEY !== 'your-brevo-api-key-here') {
      // Send via Brevo
      const apiInstance = new Brevo.TransactionalEmailsApi();
      apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

      const sendSmtpEmail = new Brevo.SendSmtpEmail();
      sendSmtpEmail.sender = {
        name: process.env.FROM_NAME || 'Starcast',
        email: process.env.FROM_EMAIL || 'info@starcast.co.za'
      };
      sendSmtpEmail.to = [{ email: application.user.email, name: `${application.user.firstName} ${application.user.lastName}` }];
      sendSmtpEmail.subject = '🎉 Your Internet Application has been Approved - Starcast ISP';
      sendSmtpEmail.htmlContent = htmlContent;
      sendSmtpEmail.textContent = textContent;

      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Approval email sent via Brevo');

    } else if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Send via SMTP
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          ciphers: 'SSLv3'
        }
      });

      await transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'Starcast'}" <${process.env.FROM_EMAIL || 'info@starcast.co.za'}>`,
        to: application.user.email,
        subject: '🎉 Your Internet Application has been Approved - Starcast ISP',
        text: textContent,
        html: htmlContent
      });

      console.log('Approval email sent via SMTP');
    }

  } catch (error) {
    console.error('Error sending approval email:', error);
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