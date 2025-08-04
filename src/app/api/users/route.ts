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

    // Rate limiting for admin data access
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(`admin_users_${clientIp}`, 30, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers }
      );
    }

    // Require admin authentication to view users
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const active = searchParams.get('active');

    // Build filter conditions
    const where: any = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      where.role = role;
    }

    if (active !== null) {
      where.active = active === 'true';
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await db.user.count({ where });

    // Fetch users with pagination
    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        active: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            applications: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, { headers });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users'
      },
      { 
        status: 500,
        headers: {
          ...securityHeaders(),
          ...corsHeaders()
        }
      }
    );
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