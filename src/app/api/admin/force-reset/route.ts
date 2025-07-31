import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

/**
 * POST /api/admin/force-reset
 * EMERGENCY admin reset - bypasses existing admin check
 * Only works with correct environment variables
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, emergencyKey } = body

    // Security: Check emergency key from environment
    const validKey = process.env.ADMIN_SETUP_KEY
    if (!validKey || emergencyKey !== validKey) {
      return NextResponse.json(
        { error: 'Invalid emergency key' },
        { status: 401 }
      )
    }

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    console.log('🚨 EMERGENCY: Clearing all users and creating new admin...')

    // Delete all users and related data
    await db.session.deleteMany({})
    await db.account.deleteMany({})
    await db.application.deleteMany({})
    await db.user.deleteMany({})

    console.log('✅ All users cleared')

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new admin user directly
    const adminUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        emailVerified: true,
        active: true,
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    console.log('✅ New admin created:', email)

    return NextResponse.json({
      success: true,
      message: 'Emergency admin reset completed',
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      },
      instructions: {
        loginUrl: 'https://starcast-web-production.up.railway.app/login',
        adminUrl: 'https://starcast-web-production.up.railway.app/admin',
        email: adminUser.email,
        note: 'All previous users have been cleared'
      }
    })

  } catch (error) {
    console.error('Emergency admin reset error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to reset admin user', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}