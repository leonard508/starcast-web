import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const packageId = searchParams.get('packageId')
    const active = searchParams.get('active')

    const where: any = {}

    if (packageId) {
      where.packageId = packageId
    }

    if (active !== null) {
      where.active = active === 'true'
    }

    const promotions = await prisma.promotion.findMany({
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
      }
    })

    return NextResponse.json({
      success: true,
      data: promotions,
      count: promotions.length
    })
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      code,
      name,
      description,
      packageId,
      discountType,
      discountValue,
      startDate,
      endDate,
      usageLimit = 1,
      targetAudience,
      userSpecific,
      minimumOrders,
      stackable = false,
      autoApply = false,
      active = true
    } = body

    // Validate required fields
    if (!code || !name || !discountType || !discountValue || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate discount type
    const validDiscountTypes = ['PERCENTAGE', 'FIXED_AMOUNT', 'OVERRIDE_PRICE']
    if (!validDiscountTypes.includes(discountType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid discount type' },
        { status: 400 }
      )
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (start >= end) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Check if promotion code already exists
    const existingPromotion = await prisma.promotion.findUnique({
      where: { code }
    })

    if (existingPromotion) {
      return NextResponse.json(
        { success: false, error: 'Promotion code already exists' },
        { status: 400 }
      )
    }

    // Create promotion
    const promotion = await prisma.promotion.create({
      data: {
        code,
        name,
        description,
        packageId: packageId || null,
        discountType,
        discountValue: parseFloat(discountValue),
        startDate: start,
        endDate: end,
        usageLimit: parseInt(usageLimit),
        targetAudience: targetAudience || null,
        userSpecific: userSpecific || null,
        minimumOrders: minimumOrders ? parseInt(minimumOrders) : null,
        stackable,
        autoApply,
        active
      },
      include: {
        package: {
          include: {
            provider: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: promotion,
      message: 'Promotion created successfully'
    })
  } catch (error) {
    console.error('Error creating promotion:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create promotion' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Promotion ID is required' },
        { status: 400 }
      )
    }

    // Validate discount type if provided
    if (updateData.discountType) {
      const validDiscountTypes = ['PERCENTAGE', 'FIXED_AMOUNT', 'OVERRIDE_PRICE']
      if (!validDiscountTypes.includes(updateData.discountType)) {
        return NextResponse.json(
          { success: false, error: 'Invalid discount type' },
          { status: 400 }
        )
      }
    }

    // Validate dates if provided
    if (updateData.startDate && updateData.endDate) {
      const start = new Date(updateData.startDate)
      const end = new Date(updateData.endDate)
      if (start >= end) {
        return NextResponse.json(
          { success: false, error: 'End date must be after start date' },
          { status: 400 }
        )
      }
    }

    // Check if promotion exists
    const existingPromotion = await prisma.promotion.findUnique({
      where: { id }
    })

    if (!existingPromotion) {
      return NextResponse.json(
        { success: false, error: 'Promotion not found' },
        { status: 404 }
      )
    }

    // Update promotion
    const promotion = await prisma.promotion.update({
      where: { id },
      data: updateData,
      include: {
        package: {
          include: {
            provider: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: promotion,
      message: 'Promotion updated successfully'
    })
  } catch (error) {
    console.error('Error updating promotion:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update promotion' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Promotion ID is required' },
        { status: 400 }
      )
    }

    // Check if promotion exists
    const existingPromotion = await prisma.promotion.findUnique({
      where: { id }
    })

    if (!existingPromotion) {
      return NextResponse.json(
        { success: false, error: 'Promotion not found' },
        { status: 404 }
      )
    }

    // Delete promotion
    await prisma.promotion.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Promotion deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting promotion:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete promotion' },
      { status: 500 }
    )
  }
}