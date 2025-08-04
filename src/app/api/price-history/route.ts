import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin, rateLimit, securityHeaders, corsHeaders } from '@/lib/auth/middleware'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Require admin authentication for viewing price history
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Rate limiting for admin access
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(`admin_price_history_${clientIp}`, 60, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers }
      );
    }
    const { searchParams } = new URL(request.url)
    const packageId = searchParams.get('packageId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = packageId ? { packageId } : {}

    const priceHistory = await prisma.priceHistory.findMany({
      where,
      include: {
        package: {
          include: {
            provider: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return NextResponse.json({
      success: true,
      data: priceHistory,
      count: priceHistory.length
    }, { headers })
  } catch (error) {
    console.error('Error fetching price history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch price history' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication for creating price history
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json()
    const { packageId, oldPrice, newPrice, changedBy, reason } = body

    // Validate required fields
    if (!packageId || oldPrice === undefined || newPrice === undefined || !changedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate prices
    if (oldPrice < 0 || newPrice < 0) {
      return NextResponse.json(
        { success: false, error: 'Prices cannot be negative' },
        { status: 400 }
      )
    }

    // Check if package exists
    const packageData = await prisma.package.findUnique({
      where: { id: packageId }
    })

    if (!packageData) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      )
    }

    // Create price history entry
    const priceHistory = await prisma.priceHistory.create({
      data: {
        packageId,
        oldPrice: parseFloat(oldPrice),
        newPrice: parseFloat(newPrice),
        changedBy,
        reason: reason || null
      },
      include: {
        package: {
          include: {
            provider: true
          }
        }
      }
    })

    // Update package current price
    await prisma.package.update({
      where: { id: packageId },
      data: { currentPrice: parseFloat(newPrice) }
    })

    return NextResponse.json({
      success: true,
      data: priceHistory,
      message: 'Price history recorded successfully'
    })
  } catch (error) {
    console.error('Error creating price history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record price history' },
      { status: 500 }
    )
  }
} 