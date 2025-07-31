import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

/**
 * POST /api/admin/emergency
 * Emergency admin reset - clears all users and creates specific admin
 * Uses ADMIN_SETUP_KEY for security
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emergencyKey } = body

    // Security: Check emergency key
    const validKey = process.env.ADMIN_SETUP_KEY
    if (!validKey || emergencyKey !== validKey) {
      return NextResponse.json(
        { error: 'Invalid emergency key' },
        { status: 401 }
      )
    }

    console.log('🚨 EMERGENCY: Clearing all data and creating new admin...')

    // Delete all data in correct order
    await db.session.deleteMany({})
    await db.account.deleteMany({})
    await db.application.deleteMany({})
    await db.user.deleteMany({})

    console.log('✅ All data cleared')

    // Hash password
    const hashedPassword = await bcrypt.hash('M@ndal0r1&n', 12)

    // Create admin user directly
    const adminUser = await db.user.create({
      data: {
        email: 'starcast.tech@gmail.com',
        password: hashedPassword,
        name: 'Starcast Admin',
        role: 'ADMIN',
        emailVerified: true,
        active: true,
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    console.log('✅ Emergency admin created:', adminUser.email)

    return NextResponse.json({
      success: true,
      message: 'Emergency admin reset completed successfully',
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      },
      instructions: {
        loginUrl: 'https://starcast-web-production.up.railway.app/login',
        adminUrl: 'https://starcast-web-production.up.railway.app/admin',
        email: 'starcast.tech@gmail.com',
        password: 'M@ndal0r1&n',
        note: 'All previous users and data have been cleared'
      }
    })

  } catch (error) {
    console.error('Emergency admin reset error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create emergency admin', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}