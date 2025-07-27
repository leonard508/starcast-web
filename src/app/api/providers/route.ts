import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const includePackages = searchParams.get('include_packages') === 'true'

    const where = active !== null ? { active: active === 'true' } : {}

    const providers = await db.provider.findMany({
      where,
      include: {
        packages: includePackages ? {
          where: { active: true },
          orderBy: { currentPrice: 'asc' }
        } : false,
        _count: {
          select: { packages: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: providers,
      count: providers.length
    })

  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch providers',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, logo, active = true } = body

    if (!name || !slug) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          required: ['name', 'slug']
        },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProvider = await db.provider.findUnique({
      where: { slug }
    })

    if (existingProvider) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Provider slug already exists'
        },
        { status: 409 }
      )
    }

    const provider = await db.provider.create({
      data: {
        name,
        slug,
        logo,
        active
      }
    })

    return NextResponse.json({
      success: true,
      data: provider,
      message: 'Provider created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating provider:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create provider',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}