import { z } from 'zod'

// Environment variable validation schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // Authentication
  BETTER_AUTH_SECRET: z.string().min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url('NEXT_PUBLIC_BETTER_AUTH_URL must be a valid URL'),
  
  // Email Service
  BREVO_API_KEY: z.string().min(1, 'BREVO_API_KEY is required'),
  FROM_EMAIL: z.string().email('FROM_EMAIL must be a valid email'),
  FROM_NAME: z.string().min(1, 'FROM_NAME is required'),
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email'),
  
  // Application URLs
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL').optional(),
  VERCEL_URL: z.string().optional(),
  
  // Security
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Payment (optional for now)
  OZOW_API_KEY: z.string().optional(),
  OZOW_SITE_CODE: z.string().optional(),
  OZOW_PRIVATE_KEY: z.string().optional(),
  OZOW_IS_TEST: z.string().optional(),
})

// Validate environment variables at startup
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('\n')
      
      console.error('❌ Invalid environment variables:')
      console.error(missingVars)
      console.error('\n💡 Please check your .env file and ensure all required variables are set correctly.')
      
      // In production, fail hard
      if (process.env.NODE_ENV === 'production') {
        process.exit(1)
      }
      
      // In development, warn but continue
      console.warn('⚠️  Continuing in development mode with invalid environment variables')
      return process.env as any
    }
    throw error
  }
}

// Validated environment variables
export const env = validateEnv()

// Type-safe environment access
export function getEnvVar(key: keyof typeof env, fallback?: string): string {
  const value = env[key]
  if (!value && !fallback) {
    throw new Error(`Environment variable ${String(key)} is not set`)
  }
  return value || fallback || ''
}

// Security helpers
export function isProduction(): boolean {
  return env.NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development'
}

export function isTest(): boolean {
  return env.NODE_ENV === 'test'
}

// Get secure app URL
export function getAppUrl(): string {
  if (env.NEXT_PUBLIC_APP_URL) {
    return env.NEXT_PUBLIC_APP_URL
  }
  
  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`
  }
  
  // Fallback for development
  return env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000'
}

// Get allowed origins for CORS
export function getAllowedOrigins(): string[] {
  const origins = [
    getAppUrl(),
    env.NEXT_PUBLIC_BETTER_AUTH_URL,
  ]
  
  // Add development origins
  if (isDevelopment()) {
    origins.push(
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3000'
    )
  }
  
  return origins.filter(Boolean)
}

// Security constants
export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT_MAX: isProduction() ? 100 : 1000, // requests per window
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  
  // Session
  SESSION_MAX_AGE: 7 * 24 * 60 * 60, // 7 days
  
  // File uploads
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
  
  // Password requirements
  MIN_PASSWORD_LENGTH: 8,
  
  // Admin actions rate limiting
  ADMIN_RATE_LIMIT: isProduction() ? 10 : 100, // per hour
  
  // Application submission rate limiting
  APPLICATION_RATE_LIMIT: 3, // per hour per user
} as const

export type SecurityConfig = typeof SECURITY_CONFIG