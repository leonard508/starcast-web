import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const AdminResetSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  resetKey: z.string().min(1, 'Reset key is required')
})

/**
 * POST /api/admin/reset
 * Reset admin user - deletes all users and creates new admin
 * Requires special reset key for security
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = AdminResetSchema.parse(body)

    // Security: Check reset key
    const validResetKey = process.env.ADMIN_SETUP_KEY || 'STARCAST_ADMIN_SETUP_2025_SECURE'
    if (validatedData.resetKey !== validResetKey) {
      return NextResponse.json(
        { error: 'Invalid reset key' },
        { status: 401 }
      )
    }

    console.log('🗑️  Clearing all existing users...')

    // Delete all users and related data in correct order
    await db.session.deleteMany({})
    console.log('  ✅ Sessions cleared')
    
    await db.account.deleteMany({})
    console.log('  ✅ Accounts cleared')
    
    await db.application.deleteMany({})
    console.log('  ✅ Applications cleared')
    
    await db.user.deleteMany({})
    console.log('  ✅ Users cleared')

    console.log('👤 Creating new admin user...')

    // Create admin user using BetterAuth
    const adminUser = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      }
    })

    if (!adminUser) {
      throw new Error('Failed to create user account')
    }

    // Update user role to ADMIN
    const updatedUser = await db.user.update({
      where: { email: validatedData.email },
      data: {
        role: 'ADMIN',
        emailVerified: true,
        active: true,
        mustChangePassword: false, // Admin set their own password
      }
    })

    console.log('✅ Admin user reset successfully:', validatedData.email)

    return NextResponse.json({
      success: true,
      message: 'Admin user reset successfully - all previous users deleted',
      admin: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      },
      instructions: {
        loginUrl: 'https://starcast-web-production.up.railway.app/login',
        adminUrl: 'https://starcast-web-production.up.railway.app/admin',
        email: updatedUser.email,
        password: '(as provided in request)'
      }
    })

  } catch (error) {
    console.error('Admin reset error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to reset admin user', details: error.message },
      { status: 500 }
    )
  }
}