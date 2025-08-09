import { supabase } from './auth-client'

// Map usernames to emails for authentication (expandable)
const USERNAME_EMAIL_MAP: Record<string, string> = {
  'starcastadmin': 'starcast.tech@gmail.com',
  'starcast.admin': 'starcast.tech@gmail.com',
  'admin': 'admin@starcast.co.za'
}

/**
 * Authenticate user with username/password
 * Maps username to email for Supabase authentication
 */
export async function signInWithUsername(username: string, password: string) {
  const normalized = username.trim().toLowerCase()
  // Map to known email, or accept direct email input
  const email = USERNAME_EMAIL_MAP[normalized] || (normalized.includes('@') ? username.trim() : undefined)

  if (!email) {
    return { data: null, error: { message: 'Invalid username or email' } }
  }

  // Use Supabase email authentication
  return supabase.auth.signInWithPassword({ email, password })
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