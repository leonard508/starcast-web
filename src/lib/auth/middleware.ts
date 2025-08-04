import { NextRequest, NextResponse } from 'next/server'
import { verifySupabaseToken } from '@/lib/auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: { id: string; email: string; role: string }
}

/**
 * Middleware to verify authentication and extract user information
 */
export async function withAuth(request: NextRequest): Promise<{
  user: { id: string; email: string; role: string } | null;
  error?: string;
}> {
  try {
    // Extract auth token from Authorization header
    const authHeader = request.headers.get('authorization')
    
    console.log('🔍 Auth middleware - checking request:', request.url)
    console.log('🔐 Auth header present:', !!authHeader)
    console.log('🔑 Auth header format:', authHeader?.slice(0, 20) + '...')
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header found')
      return { user: null, error: 'No authorization header found' }
    }
    
    const authToken = authHeader.slice(7)
    console.log('🧪 Verifying token...')
    
    // Verify token and get user
    const { data: { user }, error } = await verifySupabaseToken(authToken)
    
    if (error || !user) {
      console.log('❌ Token verification failed:', error?.message)
      return { user: null, error: error?.message || 'No valid session found' }
    }

    // Get role from user metadata (stored in Supabase Auth)
    const role = user.user_metadata?.role || 'USER'
    
    console.log('✅ Token verification successful!')
    console.log('👤 User:', user.email)
    console.log('🔑 Role:', role)

    return {
      user: {
        id: user.id,
        email: user.email || '',
        role: role
      }
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return { user: null, error: 'Authentication failed' }
  }
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(request: NextRequest) {
  const { user, error } = await withAuth(request)

  if (!user) {
    return NextResponse.json(
      { 
        success: false, 
        error: error || 'Authentication required',
        message: 'Please log in to access this resource'
      },
      { status: 401 }
    )
  }

  return { user }
}

/**
 * Middleware to require admin role
 */
export async function requireAdmin(request: NextRequest) {
  const authResult = await requireAuth(request)
  
  if (authResult instanceof NextResponse) {
    return authResult // Return the error response
  }

  const { user } = authResult

  if (user.role !== 'ADMIN') {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Admin access required',
        message: 'You do not have permission to access this resource'
      },
      { status: 403 }
    )
  }

  return { user }
}

/**
 * Rate limiting store (in-memory for development)
 * In production, use Redis or similar
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate limiting middleware
 */
export function rateLimit(identifier: string, limit: number, windowMs: number) {
  const now = Date.now()
  const key = `${identifier}:${Math.floor(now / windowMs)}`
  
  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }
  
  if (current.count >= limit) {
    return { success: false, remaining: 0 }
  }
  
  current.count++
  return { success: true, remaining: limit - current.count }
}

/**
 * Input validation middleware
 */
export function validateInput(schema: any) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json()
      const validatedData = schema.parse(body)
      return { validatedData }
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input',
          message: error instanceof Error ? error.message : 'Validation failed'
        },
        { status: 400 }
      )
    }
  }
}

/**
 * CORS middleware
 */
export function corsHeaders(origin?: string) {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    // Add your production domain here
  ].filter(Boolean)

  const corsOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0]

  return {
    'Access-Control-Allow-Origin': corsOrigin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin'
  }
}

/**
 * Security headers middleware
 */
export function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  }
}