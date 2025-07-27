import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, securityHeaders, corsHeaders } from '@/lib/auth/middleware'
import { env, isDevelopment } from '@/lib/env'

export async function GET(request: NextRequest) {
  // Only allow in development or with admin authentication
  if (!isDevelopment()) {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
  }

  try {
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Test BetterAuth configuration instead of Supabase
    const betterAuthSecret = env.BETTER_AUTH_SECRET
    const betterAuthUrl = env.NEXT_PUBLIC_BETTER_AUTH_URL
    
    if (!betterAuthSecret || !betterAuthUrl) {
      return NextResponse.json(
        { 
          error: 'Missing BetterAuth environment variables',
          missing: {
            secret: !betterAuthSecret,
            url: !betterAuthUrl
          }
        },
        { status: 500, headers }
      )
    }

    return NextResponse.json({
      status: 'BetterAuth configuration ready',
      url: betterAuthUrl,
      hasSecret: !!betterAuthSecret,
      environment: env.NODE_ENV,
      message: 'Authentication system configured'
    }, { headers })
  } catch (error) {
    return NextResponse.json(
      { error: 'Configuration test failed' },
      { status: 500, headers: securityHeaders() }
    )
  }
}