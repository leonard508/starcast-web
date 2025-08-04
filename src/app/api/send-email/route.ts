import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, rateLimit, securityHeaders, corsHeaders } from '@/lib/auth/middleware'
import * as Brevo from '@getbrevo/brevo'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Rate limiting for email sending - 5 emails per minute per admin
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(`admin_email_${clientIp}`, 5, 60000);
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

    const body = await request.json();
    const { to, subject, message, customerName } = body;

    // Validate required fields
    if (!to || !subject || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          required: ['to', 'subject', 'message']
        },
        { status: 400, headers }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email address'
        },
        { status: 400, headers }
      );
    }

    // Determine email provider
    const emailProvider = process.env.EMAIL_PROVIDER || 'smtp';
    
    if (emailProvider === 'brevo') {
      if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY === 'your-brevo-api-key-here') {
        throw new Error('Brevo API key not configured');
      }
    } else if (emailProvider === 'smtp') {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error('SMTP credentials not configured');
      }
    } else {
      throw new Error('Invalid email provider specified');
    }

    // Create email content with professional template
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message from Starcast</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              Starcast ISP
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Your Internet Service Provider
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px;">
              Message from Starcast Admin
            </h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Dear ${customerName || 'Valued Customer'},
            </p>
            
            <div style="background: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <div style="color: #2d3748; font-size: 16px; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
              Best regards,<br>
              <strong>Starcast Support Team</strong>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #edf2f7; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px; margin: 0;">
              This email was sent from Starcast ISP Admin Dashboard
            </p>
            <p style="color: #718096; font-size: 14px; margin: 5px 0 0 0;">
              <strong>Email:</strong> ${process.env.FROM_EMAIL || 'info@starcast.co.za'} | 
              <strong>Admin:</strong> ${process.env.ADMIN_EMAIL || 'starcast.tech@gmail.com'}
            </p>
          </div>
        </div>
      </body>
    </html>`;

    const textContent = `
Message from Starcast Admin

Dear ${customerName || 'Customer'},

${message}

Best regards,
Starcast Support Team

---
This email was sent from Starcast ISP Admin Dashboard
Email: ${process.env.FROM_EMAIL || 'info@starcast.co.za'}
Admin: ${process.env.ADMIN_EMAIL || 'starcast.tech@gmail.com'}
    `.trim();

    let result: any = {};

    // Try Brevo first, fallback to SMTP if it fails
    let emailSent = false;
    
    if (emailProvider === 'brevo') {
      // Send via Brevo
      try {
        const apiInstance = new Brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.sender = {
          name: process.env.FROM_NAME || 'Starcast',
          email: process.env.FROM_EMAIL || 'info@starcast.co.za'
        };
        sendSmtpEmail.to = [{ email: to, name: customerName || 'Customer' }];
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = htmlContent;
        sendSmtpEmail.textContent = textContent;

        const brevoResult = await apiInstance.sendTransacEmail(sendSmtpEmail);
        result = {
          messageId: brevoResult.body?.messageId || 'unknown',
          provider: 'Brevo'
        };

        console.log('Email sent successfully via Brevo:', {
          messageId: brevoResult.body?.messageId || 'unknown',
          to: to,
          subject: subject
        });
        emailSent = true;
      } catch (brevoError) {
        console.error('Brevo API error, trying SMTP fallback:', brevoError);
        // Don't throw error here, try SMTP instead
      }
    }

    // If Brevo failed or SMTP was requested, try SMTP
    if (!emailSent && (emailProvider === 'smtp' || emailProvider === 'brevo')) {
      // Send via SMTP (GoDaddy)
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true', // false for 587, true for 465
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          },
          tls: {
            ciphers: 'SSLv3'
          }
        });

        const mailOptions = {
          from: `"${process.env.FROM_NAME || 'Starcast'}" <${process.env.FROM_EMAIL || 'info@starcast.co.za'}>`,
          to: to,
          subject: subject,
          text: textContent,
          html: htmlContent
        };

        const smtpResult = await transporter.sendMail(mailOptions);
        
        result = {
          messageId: smtpResult.messageId,
          provider: 'GoDaddy SMTP'
        };

        console.log('Email sent successfully via GoDaddy SMTP:', {
          messageId: smtpResult.messageId,
          to: to,
          subject: subject
        });
        emailSent = true;
      } catch (smtpError) {
        console.error('SMTP error:', smtpError);
        throw new Error(`SMTP email sending failed: ${smtpError instanceof Error ? smtpError.message : 'Unknown error'}`);
      }
    }

    // If neither method worked
    if (!emailSent) {
      throw new Error('No email provider configured or all providers failed');
    }

    return NextResponse.json({
      success: true,
      message: `Email sent successfully via ${result.provider}`,
      data: {
        messageId: result.messageId,
        to,
        subject,
        sentAt: new Date().toISOString(),
        provider: result.provider
      }
    }, { headers });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send email'
      },
      { 
        status: 500,
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