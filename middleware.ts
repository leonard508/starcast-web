import { NextRequest, NextResponse } from 'next/server'
import { securityHeaders, corsHeaders } from './src/lib/auth/middleware'

export function middleware(request: NextRequest) {
  // Apply security headers to all requests
  const response = NextResponse.next()
  
  // Get origin for CORS
  const origin = request.headers.get('origin')
  
  // Apply security headers
  const headers = {
    ...securityHeaders(),
    ...corsHeaders(origin || undefined)
  }
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Block access to sensitive files in production
  if (process.env.NODE_ENV === 'production') {
    const pathname = request.nextUrl.pathname
    
    // Block access to environment files
    if (pathname.includes('.env')) {
      return new NextResponse('Not Found', { status: 404 })
    }
    
    // Block access to source maps
    if (pathname.endsWith('.map')) {
      return new NextResponse('Not Found', { status: 404 })
    }
    
    // Block access to backup files
    if (pathname.includes('.bak') || pathname.includes('.backup')) {
      return new NextResponse('Not Found', { status: 404 })
    }
    
    // Block access to git files
    if (pathname.includes('.git')) {
      return new NextResponse('Not Found', { status: 404 })
    }
    
    // Block access to node_modules
    if (pathname.includes('node_modules')) {
      return new NextResponse('Not Found', { status: 404 })
    }
  }
  
  return response
}

export const config = {
  // Apply to all API routes and pages
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}