import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations
export const createServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Manually verify JWT token and get user
export async function verifySupabaseToken(authToken: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      }
    })
    
    if (response.ok) {
      const user = await response.json()
      return { data: { user }, error: null }
    } else {
      return { data: { user: null }, error: { message: 'Invalid token' } }
    }
  } catch (error) {
    return { data: { user: null }, error: { message: 'Token verification failed' } }
  }
}