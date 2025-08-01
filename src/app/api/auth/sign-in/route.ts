import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    console.log('🔍 Looking for user:', email)

    // Find user
    const user = await db.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { providerId: 'credential' }
        }
      }
    })

    if (!user) {
      console.log('❌ User not found')
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    console.log('✅ User found:', user.email, 'Role:', user.role)
    console.log('📝 Accounts:', user.accounts.length)

    if (!user.accounts.length) {
      console.log('❌ No credential account found')
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const account = user.accounts[0]
    const storedPassword = account.password

    if (!storedPassword) {
      console.log('❌ No password stored')
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    console.log('🔐 Stored password format:', storedPassword.substring(0, 20) + '...')

    // Check password (BetterAuth format: salt:hash)
    let isValid = false
    
    if (storedPassword.includes(':')) {
      // BetterAuth format
      const [salt, hash] = storedPassword.split(':')
      const testHash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex')
      isValid = testHash === hash
      console.log('🧪 Testing BetterAuth format:', isValid)
    } else {
      // Fallback to bcrypt
      try {
        isValid = await bcrypt.compare(password, storedPassword)
        console.log('🧪 Testing bcrypt format:', isValid)
      } catch (error) {
        console.log('❌ Bcrypt comparison failed:', error)
      }
    }

    if (!isValid) {
      console.log('❌ Password verification failed')
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    console.log('✅ Password verified successfully')

    // Create session token
    const token = sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.BETTER_AUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    console.log('🎉 Login successful!')
    return response

  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}