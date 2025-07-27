import { NextRequest, NextResponse } from 'next/server'
import { securityHeaders, corsHeaders } from '@/lib/auth/middleware'
import { isDevelopment } from '@/lib/env'

export async function GET(request: NextRequest) {
  // Only allow in development or show limited info in production
  const showFullDebug = isDevelopment();
  
  try {
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
        RAILWAY_PROJECT_NAME: process.env.RAILWAY_PROJECT_NAME,
        VERCEL_ENV: process.env.VERCEL_ENV,
      },
      database: {
        DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
        DATABASE_URL_TYPE: process.env.DATABASE_URL?.split(':')[0] || 'unknown',
        ...(showFullDebug && {
          DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 30) + '...',
        })
      },
      prisma: {
        version: require('@prisma/client').Prisma.prismaVersion?.client || 'unknown',
      },
      auth: {
        BETTER_AUTH_SECRET_EXISTS: !!process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      },
      email: {
        BREVO_API_KEY_EXISTS: !!process.env.BREVO_API_KEY,
        FROM_EMAIL: process.env.FROM_EMAIL,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      }
    };

    return NextResponse.json({
      status: 'debug_info',
      showFullDebug,
      ...debugInfo
    }, { 
      status: 200,
      headers 
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'debug_error',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV
    }, { 
      status: 500,
      headers: {
        ...securityHeaders(),
        ...corsHeaders()
      }
    });
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