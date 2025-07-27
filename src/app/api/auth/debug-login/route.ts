import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🔍 Debug Login Attempt:', { email, passwordLength: password?.length })

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        debug: { userExists: false }
      })
    }

    console.log('👤 User found:', { id: user.id, email: user.email })

    // Check account record
    const account = await db.account.findFirst({
      where: {
        userId: user.id,
        providerId: 'credential'
      }
    })

    if (!account) {
      return NextResponse.json({
        success: false,
        error: 'No credential account found',
        debug: { userExists: true, accountExists: false }
      })
    }

    console.log('🔐 Account found:', { 
      accountId: account.accountId, 
      hasPassword: !!account.password,
      passwordLength: account.password?.length
    })

    if (!account.password) {
      return NextResponse.json({
        success: false,
        error: 'No password set for account',
        debug: { userExists: true, accountExists: true, passwordSet: false }
      })
    }

    // Test password comparison
    const isPasswordValid = await bcrypt.compare(password, account.password)
    console.log('🔑 Password comparison:', { isValid: isPasswordValid })

    return NextResponse.json({
      success: isPasswordValid,
      message: isPasswordValid ? 'Password is correct' : 'Password is incorrect',
      debug: {
        userExists: true,
        accountExists: true,
        passwordSet: true,
        passwordValid: isPasswordValid,
        passwordHash: account.password.substring(0, 20) + '...' // Show first 20 chars for debugging
      }
    })

  } catch (error) {
    console.error('❌ Debug login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Debug failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}