import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ user: null })
    }
    
    // Get user role from auth metadata (Supabase Auth)
    const role = user.user_metadata?.role || 'USER'
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: role
      }
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ user: null })
  }
}