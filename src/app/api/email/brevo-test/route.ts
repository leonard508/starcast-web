import { NextRequest, NextResponse } from 'next/server';
import { testBrevoConnection } from '@/lib/email/providers';

export async function GET() {
  try {
    const result = await testBrevoConnection();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Brevo connection successful',
        account: result.accountInfo
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: result.error 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Brevo connection test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Connection test failed' 
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({
    message: 'Use GET method to test Brevo connection'
  });
}