import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, rateLimit, securityHeaders, corsHeaders } from '@/lib/auth/middleware'

export async function POST(request: NextRequest) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Rate limiting for admin actions
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(`admin_toggle_${clientIp}`, 10, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers }
      );
    }

    // Require admin authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();
    const { userId, active } = body;

    // Validate required fields
    if (!userId || typeof active !== 'boolean') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          required: ['userId', 'active']
        },
        { status: 400, headers }
      );
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, active: true }
    });

    if (!existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found'
        },
        { status: 404, headers }
      );
    }

    // Prevent admin from deactivating themselves
    if (existingUser.role === 'ADMIN' && !active) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot deactivate admin users'
        },
        { status: 403, headers }
      );
    }

    // Update user status
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { active },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        active: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: `User ${active ? 'activated' : 'deactivated'} successfully`
    }, { headers });

  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update user status'
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