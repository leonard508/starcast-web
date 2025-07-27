import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test environment variables are present
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { 
          error: 'Missing Supabase environment variables',
          missing: {
            url: !supabaseUrl,
            anonKey: !supabaseAnonKey
          }
        },
        { status: 500 }
      )
    }

    // Validate URL format
    const urlPattern = /^https:\/\/.*\.supabase\.co$/
    const isValidUrl = urlPattern.test(supabaseUrl)

    return NextResponse.json({
      status: 'Configuration ready',
      supabaseUrl: supabaseUrl,
      validUrl: isValidUrl,
      message: isValidUrl 
        ? 'Ready for Supabase connection' 
        : 'Please update with actual Supabase project URL'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Configuration test failed', details: error },
      { status: 500 }
    )
  }
}