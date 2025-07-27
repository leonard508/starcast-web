import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get('provider')
    const active = searchParams.get('active')
    const includePromotions = searchParams.get('include_promotions') === 'true'
    const includePricing = searchParams.get('include_pricing') === 'true'

    // Build filter conditions - specifically for fibre packages
    const where: Prisma.PackageWhereInput = {
      type: 'FIBRE'
    }
    
    if (provider && provider !== 'all') {
      where.provider = {
        slug: provider
      }
    }
    
    if (active !== null) {
      where.active = active === 'true'
    }

    // Fetch fibre packages with related data
    const packages = await db.package.findMany({
      where,
      include: {
        provider: true,
        promotions: includePromotions ? {
          where: {
            active: true,
            startDate: {
              lte: new Date()
            },
            endDate: {
              gte: new Date()
            }
          }
        } : false,
        specialRates: includePricing,
        priceHistory: includePricing ? {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          }
        } : false
      },
      orderBy: [
        { provider: { name: 'asc' } },
        { currentPrice: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: packages,
      count: packages.length,
      type: 'FIBRE'
    })

  } catch (error) {
    console.error('Error fetching fibre packages:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch fibre packages',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      providerId, 
      type, 
      speed, 
      data, 
      // Legacy fields (backward compatibility)
      aup, 
      throttle, 
      // New FUP fields
      fupLimit,
      throttleSpeed,
      secondaryThrottleSpeed,
      fupDescription,
      specialTerms,
      // Fibre specific fields
      technology,
      coverage,
      installation,
      // Pricing
      basePrice,
      currentPrice,
      featured = false,
      active = true 
    } = body

    // Validate required fields
    if (!name || !providerId || !type || !basePrice) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          required: ['name', 'providerId', 'type', 'basePrice']
        },
        { status: 400 }
      )
    }

    // Validate that type is FIBRE
    if (type !== 'FIBRE') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid package type. Only fibre packages are allowed in this endpoint.',
          allowedTypes: ['FIBRE']
        },
        { status: 400 }
      )
    }

    // Validate provider exists
    const providerData = await db.provider.findUnique({
      where: { id: providerId }
    })

    if (!providerData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Provider not found'
        },
        { status: 404 }
      )
    }

    // Create fibre package
    const packageData = await db.package.create({
      data: {
        name,
        providerId,
        type,
        speed,
        data,
        // Legacy fields
        aup,
        throttle,
        // New FUP fields
        fupLimit,
        throttleSpeed,
        secondaryThrottleSpeed,
        fupDescription,
        specialTerms,
        // Fibre specific fields
        technology,
        coverage,
        installation,
        // Pricing
        basePrice: parseFloat(basePrice),
        currentPrice: currentPrice ? parseFloat(currentPrice) : parseFloat(basePrice),
        featured,
        active
      },
      include: {
        provider: true,
        promotions: true
      }
    })

    // Create initial price history entry
    await db.priceHistory.create({
      data: {
        packageId: packageData.id,
        oldPrice: 0,
        newPrice: packageData.basePrice,
        changedBy: 'system',
        reason: 'Initial fibre package creation'
      }
    })

    return NextResponse.json({
      success: true,
      data: packageData,
      message: 'Fibre package created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating fibre package:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create fibre package',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 