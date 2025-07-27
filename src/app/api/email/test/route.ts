import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { requireAdmin, securityHeaders, corsHeaders } from '@/lib/auth/middleware';
import { isDevelopment } from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // For development testing only or require admin
    if (!isDevelopment()) {
      const authResult = await requireAdmin(request);
      if (authResult instanceof NextResponse) {
        return authResult;
      }
    }

    const body = await request.json();
    const { type, ...emailData } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Email type is required' },
        { status: 400 }
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
        data: result.data
      }, { headers });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500, headers }
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
    message: 'Email test endpoint',
    environment: process.env.NODE_ENV,
    availableTypes: ['welcome', 'approval', 'invoice'],
    method: 'POST',
    examples: {
      welcome: {
        type: 'welcome',
        to: 'customer@example.com',
        customerName: 'John Doe',
        packageName: 'Fibre 100Mbps',
        activationDate: '2025-01-31'
      },
      approval: {
        type: 'approval',
        to: 'customer@example.com',
        customerName: 'John Doe',
        packageName: 'Fibre 100Mbps',
        activationDate: '2025-01-31',
        installationContact: 'Installation Team',
        accountNumber: 'ACC-123456'
      },
      invoice: {
        type: 'invoice',
        to: 'customer@example.com',
        customerName: 'John Doe',
        invoiceNumber: 'INV-2025-001',
        dueDate: '1st February 2025',
        amount: 899.00,
        packageName: 'Fibre 100Mbps',
        billingPeriod: 'January 2025',
        paymentUrl: 'https://pay.starcast.co.za/inv-123'
      }
    }
  });
}