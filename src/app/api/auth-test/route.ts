import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test if we can import BetterAuth
    const { auth } = await import('@/lib/auth')
    
    return NextResponse.json({
      status: 'success',
      message: 'BetterAuth configuration loaded successfully',
      hasHandler: !!auth.handler,
      secret: !!process.env.BETTER_AUTH_SECRET,
      dbUrl: !!process.env.DATABASE_URL
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to load BetterAuth',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}