import { supabase } from './auth-client'

// Map usernames to emails for authentication
const USERNAME_EMAIL_MAP: Record<string, string> = {
  'starcastadmin': 'starcast.tech@gmail.com',
  'admin': 'admin@starcast.co.za'
}

/**
 * Authenticate user with username/password
 * Maps username to email for Supabase authentication
 */
export async function signInWithUsername(username: string, password: string) {
  // Check if it's a known username
  const email = USERNAME_EMAIL_MAP[username.toLowerCase()]
  
  if (!email) {
    return {
      data: null,
      error: { message: 'Invalid username or password' }
    }
  }
  
  // Use Supabase email authentication
  const result = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  return result
}

/**
 * Get user role from user metadata
 */
export function getUserRole(user: any): string {
  return user?.user_metadata?.role || 'USER'
}

/**
 * Check if user is admin
 */
export function isAdmin(user: any): boolean {
  return getUserRole(user) === 'ADMIN'
}