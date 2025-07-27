import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    console.log('Test signup attempt:', { email, name })

    // Try to create user using BetterAuth
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: name || email.split('@')[0]
      }
    })

    console.log('Signup result:', result)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: result
    })

  } catch (error) {
    console.error('Test signup error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}