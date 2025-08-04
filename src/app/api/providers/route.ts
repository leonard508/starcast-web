import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, rateLimit, securityHeaders, corsHeaders } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Check if this is an admin request (has auth header)
    const authHeader = request.headers.get('authorization');
    const isAdminRequest = authHeader && authHeader.startsWith('Bearer ');
    
    if (isAdminRequest) {
      // Admin access - require authentication
      const authResult = await requireAdmin(request);
      if (authResult instanceof NextResponse) {
        return authResult;
      }
      
      // Rate limiting for admin access
      const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
      const rateLimitResult = rateLimit(`admin_providers_${clientIp}`, 60, 60000);
      if (!rateLimitResult.success) {
        return NextResponse.json(
          { success: false, error: 'Too many requests' },
          { status: 429, headers }
        );
      }
    }
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const includePackages = searchParams.get('include_packages') === 'true'

    const where = active !== null ? { active: active === 'true' } : {}

    const providers = await db.provider.findMany({
      where,
      include: {
        packages: includePackages ? {
          where: { active: true },
          orderBy: { currentPrice: 'asc' }
        } : false,
        _count: {
          select: { packages: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: providers,
      count: providers.length
    }, { headers: isAdminRequest ? headers : undefined })

  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch providers',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication for creating providers
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json()
    const { name, slug, logo, active = true } = body

    if (!name || !slug) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          required: ['name', 'slug']
        },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProvider = await db.provider.findUnique({
      where: { slug }
    })

    if (existingProvider) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Provider slug already exists'
        },
        { status: 409 }
      )
    }

    const provider = await db.provider.create({
      data: {
        name,
        slug,
        logo,
        active
      }
    })

    return NextResponse.json({
      success: true,
      data: provider,
      message: 'Provider created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating provider:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create provider',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}