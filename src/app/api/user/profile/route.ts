import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  try {
    // Get user session from Supabase
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult // Return error response
    }
    const { user } = authResult

    // Fetch user profile information
    const userProfile = await db.user.findUnique({
      where: {
        id: user.id
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
        createdAt: true,
        active: true,
        orders: {
          select: {
            id: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    })

    if (!userProfile) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: userProfile
    })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch profile',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}