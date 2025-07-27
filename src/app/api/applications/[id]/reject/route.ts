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
    if (!params.id) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
        { status: 400, headers }
      );
    }

    // Get request body
    const body = await request.json();
    const rejectionReason = body.rejectionReason || 'Application rejected by admin';

    // Update application status
    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy: user.id,
        rejectionReason: rejectionReason,
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
    await sendRejectionEmail(application, rejectionReason);

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

// Helper function to send rejection email
async function sendRejectionEmail(application: any, rejectionReason: string) {
  try {
    const emailProvider = process.env.EMAIL_PROVIDER || 'brevo';
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Update - Starcast ISP</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              Application Update
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Starcast ISP
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px;">
              Dear ${application.user.firstName},
            </h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for your interest in Starcast ISP services. After reviewing your application, we regret to inform you that we are unable to proceed at this time.
            </p>
            
            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">Application Details</h3>
              <div style="color: #4a5568; font-size: 16px; line-height: 1.8;">
                <strong>Package:</strong> ${application.package.name}<br>
                <strong>Provider:</strong> ${application.package.provider.name}<br>
                <strong>Application ID:</strong> ${application.applicationNumber}<br>
                <strong>Status:</strong> Not Approved
              </div>
            </div>
            
            <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 16px;">Reason</h3>
              <div style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                ${rejectionReason}
              </div>
            </div>
            
            <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">Next Steps</h3>
              <div style="color: #4a5568; font-size: 16px; line-height: 1.8;">
                • We are continuously expanding our coverage areas<br>
                • You can reapply when service becomes available in your area<br>
                • Contact us for alternative package options<br>
                • Follow us for updates on service expansion
              </div>
            </div>
            
            <div style="background: #f3f4f6; border-left: 4px solid #6b7280; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 16px;">Contact Information</h3>
              <div style="color: #4a5568; font-size: 14px; line-height: 1.6;">
                <strong>Customer Support:</strong> 087 550 0000<br>
                <strong>Email:</strong> ${process.env.FROM_EMAIL || 'info@starcast.co.za'}<br>
                <strong>Office Hours:</strong> Monday - Friday, 8AM - 5PM
              </div>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
              We appreciate your interest in our services and apologize for any inconvenience.<br><br>
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
Application Update - Starcast ISP

Dear ${application.user.firstName},

Thank you for your interest in Starcast ISP services. After reviewing your application, we regret to inform you that we are unable to proceed at this time.

Application Details:
- Package: ${application.package.name}
- Provider: ${application.package.provider.name}
- Application ID: ${application.applicationNumber}
- Status: Not Approved

Reason: ${rejectionReason}

Next Steps:
• We are continuously expanding our coverage areas
• You can reapply when service becomes available in your area
• Contact us for alternative package options
• Follow us for updates on service expansion

Contact Information:
- Customer Support: 087 550 0000
- Email: ${process.env.FROM_EMAIL || 'info@starcast.co.za'}
- Office Hours: Monday - Friday, 8AM - 5PM

We appreciate your interest in our services and apologize for any inconvenience.

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
      sendSmtpEmail.subject = 'Application Update - Starcast ISP';
      sendSmtpEmail.htmlContent = htmlContent;
      sendSmtpEmail.textContent = textContent;

      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Rejection email sent via Brevo');

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
        subject: 'Application Update - Starcast ISP',
        text: textContent,
        html: htmlContent
      });

      console.log('Rejection email sent via SMTP');
    }

  } catch (error) {
    console.error('Error sending rejection email:', error);
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