import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Test packages table access
    console.log('Testing packages table access...')
    
    const packageCount = await db.package.count()
    console.log('Package count:', packageCount)
    
    const providerCount = await db.provider.count()
    console.log('Provider count:', providerCount)
    
    // Get first few packages
    const samplePackages = await db.package.findMany({
      take: 3,
      include: {
        provider: true
      }
    })
    console.log('Sample packages:', samplePackages.length)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Packages table accessed successfully',
      stats: {
        packages: packageCount,
        providers: providerCount,
        samplePackages: samplePackages.length
      }
    })
  } catch (error) {
    console.error('Packages test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Packages test failed',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}