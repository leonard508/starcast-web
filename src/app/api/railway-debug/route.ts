import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        HOST: process.env.HOST,
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
      },
      auth: {
        BETTER_AUTH_SECRET_EXISTS: !!process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_SECRET_LENGTH: process.env.BETTER_AUTH_SECRET?.length || 0,
        BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      },
      request: {
        host: request.headers.get('host'),
        origin: request.headers.get('origin'),
        userAgent: request.headers.get('user-agent'),
        protocol: request.url.startsWith('https') ? 'https' : 'http',
      },
      database: null as any,
      betterAuth: null as any
    };

    // Test database connection
    try {
      await db.$queryRaw`SELECT 1 as test`;
      const userCount = await db.user.count();
      const adminCount = await db.user.count({ where: { role: 'ADMIN' } });
      
      debugInfo.database = {
        connected: true,
        totalUsers: userCount,
        adminUsers: adminCount,
      };
    } catch (dbError) {
      debugInfo.database = {
        connected: false,
        error: dbError instanceof Error ? dbError.message : 'Unknown database error'
      };
    }

    // Test BetterAuth session
    try {
      const session = await auth.api.getSession({
        headers: request.headers
      });
      
      debugInfo.betterAuth = {
        sessionWorks: true,
        hasUser: !!session?.user,
        userId: session?.user?.id || null,
      };
    } catch (authError) {
      debugInfo.betterAuth = {
        sessionWorks: false,
        error: authError instanceof Error ? authError.message : 'Unknown auth error'
      };
    }

    return NextResponse.json(debugInfo, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}