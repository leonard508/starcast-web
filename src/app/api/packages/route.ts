import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { rateLimit, securityHeaders, corsHeaders } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Rate limiting for public package access
    const rateLimitResult = rateLimit(60, 60000)(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const provider = searchParams.get('provider')
    const active = searchParams.get('active')
    const includePromotions = searchParams.get('include_promotions') === 'true'
    const includePricing = searchParams.get('include_pricing') === 'true'

    // Build filter conditions
    const where: Prisma.PackageWhereInput = {}
    
    if (type) {
      // Handle multiple types for LTE/5G (LTE_FIXED,LTE_MOBILE,5G_FIXED)
      if (type.includes(',')) {
        const types = type.split(',').map(t => t.trim())
        where.type = {
          in: types
        }
      } else {
        where.type = type
      }
    }
    
    if (provider && provider !== 'all') {
      where.provider = {
        slug: provider
      }
    }
    
    if (active !== null) {
      where.active = active === 'true'
    }

    // Fetch packages with related data
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
      count: packages.length
    }, { headers })

  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch packages'
      },
      { 
        status: 500,
        headers: {
          ...securityHeaders(),
          ...corsHeaders()
        }
      }
    )
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
      // LTE/5G specific fields
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

    // Create package
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
        // LTE/5G specific fields
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
        reason: 'Initial package creation'
      }
    })

    return NextResponse.json({
      success: true,
      data: packageData,
      message: 'Package created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create package',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      id,
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
      // LTE/5G specific fields
      technology,
      coverage,
      installation,
      // Pricing
      basePrice,
      currentPrice,
      featured,
      active 
    } = body

    // Validate required fields
    if (!id || !name || !providerId || !type || !basePrice) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          required: ['id', 'name', 'providerId', 'type', 'basePrice']
        },
        { status: 400 }
      )
    }

    // Check if package exists
    const existingPackage = await db.package.findUnique({
      where: { id },
      include: { provider: true }
    })

    if (!existingPackage) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Package not found'
        },
        { status: 404 }
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

    // Track price changes for history
    const priceChanged = existingPackage.basePrice !== parseFloat(basePrice) || 
                        existingPackage.currentPrice !== parseFloat(currentPrice)

    // Update package
    const updatedPackage = await db.package.update({
      where: { id },
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
        // LTE/5G specific fields
        technology,
        coverage,
        installation,
        // Pricing
        basePrice: parseFloat(basePrice),
        currentPrice: parseFloat(currentPrice),
        featured,
        active
      },
      include: {
        provider: true,
        promotions: true
      }
    })

    // Record price changes in history
    if (priceChanged) {
      await db.priceHistory.create({
        data: {
          packageId: id,
          oldPrice: existingPackage.basePrice,
          newPrice: parseFloat(basePrice),
          changedBy: 'admin_update',
          reason: 'Package update via admin dashboard'
        }
      })

      if (existingPackage.currentPrice !== parseFloat(currentPrice)) {
        await db.priceHistory.create({
          data: {
            packageId: id,
            oldPrice: existingPackage.currentPrice,
            newPrice: parseFloat(currentPrice),
            changedBy: 'admin_update',
            reason: 'Retail price update via admin dashboard'
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedPackage,
      message: 'Package updated successfully'
    })

  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update package',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}