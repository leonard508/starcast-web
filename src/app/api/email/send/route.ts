import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

// Production email sending endpoint
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // Example: Check if user is admin or has proper permissions
    
    const body = await request.json();
    const { type, ...emailData } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Email type is required' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    let result;

    switch (type) {
      case 'welcome':
        if (!emailData.to || !emailData.customerName || !emailData.packageName) {
          return NextResponse.json(
            { error: 'Missing required fields: to, customerName, packageName' },
            { status: 400 }
          );
        }
        result = await emailService.sendWelcomeEmail(emailData);
        break;

      case 'approval':
        if (!emailData.to || !emailData.customerName || !emailData.packageName || !emailData.activationDate) {
          return NextResponse.json(
            { error: 'Missing required fields: to, customerName, packageName, activationDate' },
            { status: 400 }
          );
        }
        result = await emailService.sendApprovalEmail(emailData);
        break;

      case 'invoice':
        if (!emailData.to || !emailData.customerName || !emailData.invoiceNumber || 
            !emailData.dueDate || !emailData.amount || !emailData.packageName || !emailData.billingPeriod) {
          return NextResponse.json(
            { error: 'Missing required fields: to, customerName, invoiceNumber, dueDate, amount, packageName, billingPeriod' },
            { status: 400 }
          );
        }
        result = await emailService.sendInvoiceEmail(emailData);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type. Supported types: welcome, approval, invoice' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `${type} email sent successfully`,
        emailId: result.data?.id
      });
    } else {
      console.error('Email sending failed:', result.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email sending endpoint',
    method: 'POST',
    authentication: 'Required (TODO: implement)',
    supportedTypes: ['welcome', 'approval', 'invoice'],
    status: process.env.BREVO_API_KEY ? 'configured' : 'not configured'
  });
}