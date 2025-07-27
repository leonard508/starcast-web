import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get user session from BetterAuth
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized - Please log in'
        },
        { status: 401 }
      )
    }

    // Fetch user's orders with complete package information
    const orders = await db.order.findMany({
      where: {
        userId: session.user.id
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