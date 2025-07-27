import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const AdminSetupSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  setupKey: z.string().min(1, 'Setup key is required')
})

/**
 * POST /api/admin/setup
 * One-time admin user creation endpoint
 * Requires special setup key for security
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = AdminSetupSchema.parse(body)

    // Security: Check setup key
    const validSetupKey = process.env.ADMIN_SETUP_KEY || 'STARCAST_ADMIN_SETUP_2025'
    if (validatedData.setupKey !== validSetupKey) {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 401 }
      )
    }

    // Check if any admin already exists
    const existingAdmin = await db.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user already exists. This endpoint can only be used once.' },
        { status: 409 }
      )
    }

    // Check if email is already taken
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      )
    }

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

    console.log('Admin user created:', validatedData.email)

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      }
    })

  } catch (error) {
    console.error('Admin setup error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/setup
 * Check if admin setup is needed
 */
export async function GET() {
  try {
    const existingAdmin = await db.user.findFirst({
      where: { role: 'ADMIN' }
    })

    return NextResponse.json({
      setupNeeded: !existingAdmin,
      hasAdmin: !!existingAdmin
    })

  } catch (error) {
    console.error('Admin setup check error:', error)
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    )
  }
}