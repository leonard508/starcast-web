import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../auth'
import { db } from '../db'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    role: string
  }
}

/**
 * Middleware to verify authentication and extract user information
 */
export async function withAuth(request: NextRequest): Promise<{
  user: { id: string; email: string; role: string } | null;
  error?: string;
}> {
  try {
    // Get session from BetterAuth
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return { user: null, error: 'No valid session found' }
    }

    // Get user details with role from database
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        active: true,
        emailVerified: true
      }
    })

    if (!user) {
      return { user: null, error: 'User not found' }
    }

    if (!user.active) {
      return { user: null, error: 'Account is disabled' }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
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
        error: 'Authentication required',
        message: error || 'Please log in to access this resource'
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
 * Simple rate limiting middleware
 */
export function rateLimit(
  maxRequests: number = 10,
  windowMs: number = 60000, // 1 minute
  keyGenerator?: (request: NextRequest) => string
) {
  return (request: NextRequest) => {
    const key = keyGenerator ? keyGenerator(request) : 
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Clean old entries
    for (const [k, v] of rateLimitStore) {
      if (v.resetTime < windowStart) {
        rateLimitStore.delete(k)
      }
    }
    
    const current = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs }
    
    if (current.count >= maxRequests && current.resetTime > now) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${Math.ceil((current.resetTime - now) / 1000)} seconds.`
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((current.resetTime - now) / 1000))
          }
        }
      )
    }
    
    // Update or create rate limit entry
    if (current.resetTime <= now) {
      current.count = 1
      current.resetTime = now + windowMs
    } else {
      current.count++
    }
    
    rateLimitStore.set(key, current)
    
    return null // No rate limit hit
  }
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