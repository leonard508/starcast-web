import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { securityHeaders, corsHeaders } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  try {
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Test database connection
    const packageCount = await db.package.count();
    const providerCount = await db.provider.count();
    
    // Check if we have seed data
    const hasData = packageCount > 0 && providerCount > 0;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        connected: true,
        packages: packageCount,
        providers: providerCount,
        seeded: hasData
      },
      version: process.env.npm_package_version || '1.0.0'
    }, { 
      status: 200,
      headers 
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      environment: process.env.NODE_ENV
    }, { 
      status: 503,
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