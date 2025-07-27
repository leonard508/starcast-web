import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const packageId = searchParams.get('packageId')
    const limit = parseInt(searchParams.get('limit') || '50')

    let where: any = {}

    if (packageId) {
      where.packageId = packageId
    }

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
    })
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