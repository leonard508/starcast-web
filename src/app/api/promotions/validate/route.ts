import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, packageId, userId } = body

    if (!code) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Promotion code is required'
        },
        { status: 400 }
      )
    }

    // Find the promotion
    const promotion = await db.promotion.findUnique({
      where: { code },
      include: {
        package: {
          include: {
            provider: true
          }
        }
      }
    })

    if (!promotion) {
      return NextResponse.json({
        success: false,
        error: 'Invalid promotion code',
        valid: false
      })
    }

    // Check if promotion is active
    if (!promotion.active) {
      return NextResponse.json({
        success: false,
        error: 'Promotion is no longer active',
        valid: false
      })
    }

    // Check date validity
    const now = new Date()
    if (now < promotion.startDate || now > promotion.endDate) {
      return NextResponse.json({
        success: false,
        error: 'Promotion has expired or not yet started',
        valid: false
      })
    }

    // Check usage limit
    if (promotion.usageLimit > 0 && promotion.timesUsed >= promotion.usageLimit) {
      return NextResponse.json({
        success: false,
        error: 'Promotion usage limit exceeded',
        valid: false
      })
    }

    // Check if package-specific promotion matches the requested package
    if (promotion.packageId && packageId && promotion.packageId !== packageId) {
      return NextResponse.json({
        success: false,
        error: 'Promotion not valid for this package',
        valid: false
      })
    }

    // Check user-specific promotions
    if (promotion.userSpecific && promotion.userSpecific.length > 0 && userId) {
      if (!promotion.userSpecific.includes(userId)) {
        return NextResponse.json({
          success: false,
          error: 'Promotion not available for this user',
          valid: false
        })
      }
    }

    // Calculate discount amount
    let discountAmount = 0
    let finalPrice = 0

    if (packageId) {
      const packageData = await db.package.findUnique({
        where: { id: packageId }
      })

      if (packageData) {
        const basePrice = packageData.currentPrice
        
        switch (promotion.discountType) {
          case 'PERCENTAGE':
            discountAmount = basePrice * (promotion.discountValue / 100)
            finalPrice = basePrice - discountAmount
            break
          case 'FIXED_AMOUNT':
            discountAmount = promotion.discountValue
            finalPrice = Math.max(0, basePrice - discountAmount)
            break
          case 'OVERRIDE_PRICE':
            finalPrice = promotion.discountValue
            discountAmount = basePrice - finalPrice
            break
          default:
            discountAmount = 0
            finalPrice = basePrice
        }
      }
    }

    return NextResponse.json({
      success: true,
      valid: true,
      data: {
        promotion: {
          id: promotion.id,
          code: promotion.code,
          name: promotion.name,
          description: promotion.description,
          discountType: promotion.discountType,
          discountValue: promotion.discountValue,
          packageSpecific: !!promotion.packageId,
          package: promotion.package
        },
        pricing: packageId ? {
          discountAmount: Math.round(discountAmount * 100) / 100,
          finalPrice: Math.round(finalPrice * 100) / 100,
          savings: Math.round(discountAmount * 100) / 100
        } : null
      },
      message: 'Promotion is valid'
    })

  } catch (error) {
    console.error('Error validating promotion:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to validate promotion',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}