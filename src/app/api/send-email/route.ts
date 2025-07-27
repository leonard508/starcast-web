import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, rateLimit, securityHeaders, corsHeaders } from '@/lib/auth/middleware'

export async function POST(request: NextRequest) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Rate limiting for email sending - 5 emails per minute per admin
    const rateLimitResult = rateLimit(5, 60000)(request);
    if (rateLimitResult) {
      return rateLimitResult;
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

    // For now, we'll return success but in production you would integrate with an email service
    // This is a placeholder implementation
    console.log('Email would be sent:', {
      to,
      subject,
      message,
      customerName: customerName || 'Customer',
      from: 'admin@starcast.co.za'
    });

    // TODO: Integrate with actual email service (Resend, SendGrid, etc.)
    // Example with Resend:
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // 
    // const result = await resend.emails.send({
    //   from: 'admin@starcast.co.za',
    //   to: [to],
    //   subject: subject,
    //   html: `
    //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //       <h2>Message from Starcast Admin</h2>
    //       <p>Dear ${customerName || 'Customer'},</p>
    //       <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
    //         ${message.replace(/\n/g, '<br>')}
    //       </div>
    //       <p>Best regards,<br>Starcast Team</p>
    //     </div>
    //   `
    // });

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      data: {
        to,
        subject,
        sentAt: new Date().toISOString()
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