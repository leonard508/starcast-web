import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Test basic database connection
    await db.$queryRaw`SELECT 1 as test`
    
    // Test user table access
    const userCount = await db.user.count()
    
    // Test account table access
    const accountCount = await db.account.count()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully',
      stats: {
        users: userCount,
        accounts: accountCount
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT || 'not-set'
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Database connection failed',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}