import { supabase } from '@/lib/auth-client'

export async function authedFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const { data: sessionData } = await supabase.auth.getSession()
  const accessToken = sessionData.session?.access_token
  const headers = new Headers(init.headers || {})
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  return fetch(input, { ...init, headers })
}

export async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: sessionData } = await supabase.auth.getSession()
  const accessToken = sessionData.session?.access_token
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
}


