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

    // Fetch user's orders with complete package information
    const orders = await db.order.findMany({
      where: {
        userId: user.id
      },
      include: {
        package: {
          include: {
            provider: true,
            promotions: {
              where: {
                active: true
              }
            }
          }
        },
        promotion: true,
        documents: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length
    })

  } catch (error) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch orders',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}