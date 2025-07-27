import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    // Test that auth configuration is working
    const authHandler = auth.handler
    
    if (!authHandler) {
      return NextResponse.json(
        { error: 'BetterAuth handler not initialized' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'BetterAuth configured successfully',
      endpoints: [
        '/api/auth/sign-in',
        '/api/auth/sign-up', 
        '/api/auth/sign-out',
        '/api/auth/session'
      ],
      message: 'BetterAuth is ready for use'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'BetterAuth configuration test failed', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}