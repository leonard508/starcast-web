import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { securityHeaders, corsHeaders } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Detailed environment info for debugging
    const environmentInfo = {
      NODE_ENV: process.env.NODE_ENV,
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DATABASE_URL_TYPE: process.env.DATABASE_URL?.split(':')[0] || 'unknown',
      PRISMA_CLIENT_VERSION: require('@prisma/client').Prisma.prismaVersion?.client || 'unknown'
    };

    console.log('Health check starting with environment:', environmentInfo);

    // Test basic database connection first
    await db.$connect();
    console.log('✅ Database connection successful');

    // Test database queries
    const packageCount = await db.package.count();
    const providerCount = await db.provider.count();
    
    console.log(`📊 Package count: ${packageCount}, Provider count: ${providerCount}`);
    
    // Check if we have seed data
    const hasData = packageCount > 0 && providerCount > 0;
    
    const responseTime = Date.now() - startTime;
    
    const response = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      environment: environmentInfo,
      database: {
        connected: true,
        packages: packageCount,
        providers: providerCount,
        seeded: hasData,
        connectionTime: `${Date.now() - startTime}ms`
      },
      version: process.env.npm_package_version || '1.0.0'
    };
    
    console.log('✅ Health check passed:', response);
    
    return NextResponse.json(response, { 
      status: 200,
      headers 
    });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('❌ Health check failed:', {
      error: errorMessage,
      stack: errorStack,
      responseTime: `${responseTime}ms`,
      databaseUrl: process.env.DATABASE_URL ? 'set' : 'missing'
    });
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      error: 'Database connection failed',
      errorMessage: errorMessage,
      environment: process.env.NODE_ENV,
      debug: {
        DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
        DATABASE_URL_TYPE: process.env.DATABASE_URL?.split(':')[0] || 'unknown',
        NODE_ENV: process.env.NODE_ENV,
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT
      }
    }, { 
      status: 503,
      headers: {
        ...securityHeaders(),
        ...corsHeaders()
      }
    });
  } finally {
    try {
      await db.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
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