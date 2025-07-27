/**
 * Security Configuration Generator for POPI/RICA/Ozow Compliance
 * 
 * This utility helps generate secure configuration for production deployment
 */

import crypto from 'crypto'

export class SecurityConfig {
  /**
   * Generate a 32-byte hex encryption key for POPI compliance
   */
  static generatePOPIEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Generate a secure salt for phone number hashing (RICA compliance)
   */
  static generateRICAPhoneSalt(): string {
    return `rica_sa_phone_${crypto.randomBytes(16).toString('hex')}_${Date.now()}`
  }

  /**
   * Generate a secure salt for ID number hashing (POPI compliance)
   */
  static generatePOPIIdSalt(): string {
    return `popi_sa_id_${crypto.randomBytes(16).toString('hex')}_${Date.now()}`
  }

  /**
   * Generate transaction hash secret for Ozow compliance
   */
  static generateTransactionHashSecret(): string {
    return crypto.randomBytes(64).toString('hex')
  }

  /**
   * Generate payment encryption key for Ozow compliance
   */
  static generatePaymentEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Generate session security secret
   */
  static generateSessionSecret(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Generate CSRF protection secret
   */
  static generateCSRFSecret(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Generate all production secrets at once
   */
  static generateAllSecrets(): Record<string, string> {
    return {
      POPI_ENCRYPTION_KEY: this.generatePOPIEncryptionKey(),
      RICA_PHONE_SALT: this.generateRICAPhoneSalt(),
      POPI_ID_SALT: this.generatePOPIIdSalt(),
      TRANSACTION_HASH_SECRET: this.generateTransactionHashSecret(),
      PAYMENT_ENCRYPTION_KEY: this.generatePaymentEncryptionKey(),
      SECURITY_SESSION_SECRET: this.generateSessionSecret(),
      CSRF_SECRET: this.generateCSRFSecret()
    }
  }

  /**
   * Validate that all required security environment variables are set
   */
  static validateSecurityConfig(): { valid: boolean; missing: string[] } {
    const required = [
      'POPI_ENCRYPTION_KEY',
      'RICA_PHONE_SALT',
      'POPI_ID_SALT',
      'TRANSACTION_HASH_SECRET',
      'PAYMENT_ENCRYPTION_KEY',
      'SECURITY_SESSION_SECRET',
      'CSRF_SECRET'
    ]

    const missing = required.filter(key => !process.env[key])

    return {
      valid: missing.length === 0,
      missing
    }
  }

  /**
   * Generate a production-ready .env.production template
   */
  static generateProductionEnvTemplate(): string {
    const secrets = this.generateAllSecrets()
    
    return `# Production Environment Variables - KEEP SECURE!
# Generated on ${new Date().toISOString()}

# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# BetterAuth Configuration
BETTER_AUTH_SECRET="${crypto.randomBytes(32).toString('hex')}"
NEXT_PUBLIC_BETTER_AUTH_URL="https://your-domain.com"

# Email Configuration
BREVO_API_KEY="your-brevo-api-key"
FROM_EMAIL="noreply@your-domain.com"
FROM_NAME="Your Company Name"

# POPI Act & RICA Compliance (Required for South Africa)
POPI_ENCRYPTION_KEY="${secrets.POPI_ENCRYPTION_KEY}"
RICA_PHONE_SALT="${secrets.RICA_PHONE_SALT}"
POPI_ID_SALT="${secrets.POPI_ID_SALT}"

# Ozow Security Compliance (Required for Payment Gateway)
TRANSACTION_HASH_SECRET="${secrets.TRANSACTION_HASH_SECRET}"
PAYMENT_ENCRYPTION_KEY="${secrets.PAYMENT_ENCRYPTION_KEY}"

# Security Configuration
SECURITY_SESSION_SECRET="${secrets.SECURITY_SESSION_SECRET}"
CSRF_SECRET="${secrets.CSRF_SECRET}"

# Data Retention Configuration
DATA_RETENTION_ENABLED="true"
AUTO_CLEANUP_ENABLED="true"

# WhatsApp Business API Configuration
META_ACCESS_TOKEN="your-meta-access-token"
META_PHONE_NUMBER_ID="your-phone-number-id"
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_WHATSAPP_NUMBER="whatsapp:+27xxxxxxxxx"

# WARNING: Keep these values secure and never commit to version control!
# Add this file to .gitignore and use secure deployment practices.
`
  }
}

/**
 * Security Audit Report Generator
 */
export class SecurityAudit {
  /**
   * Run a comprehensive security audit
   */
  static async runSecurityAudit(): Promise<{
    passed: boolean
    score: number
    issues: Array<{ severity: 'low' | 'medium' | 'high' | 'critical'; message: string }>
    recommendations: string[]
  }> {
    const issues: Array<{ severity: 'low' | 'medium' | 'high' | 'critical'; message: string }> = []
    const recommendations: string[] = []
    let score = 100

    // Check encryption keys
    const configValidation = SecurityConfig.validateSecurityConfig()
    if (!configValidation.valid) {
      issues.push({
        severity: 'critical',
        message: `Missing security configuration: ${configValidation.missing.join(', ')}`
      })
      score -= 30
    }

    // Check HTTPS enforcement
    const authUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    if (!authUrl?.startsWith('https://')) {
      issues.push({
        severity: 'high',
        message: 'HTTPS not enforced for authentication URL'
      })
      score -= 15
    }

    // Check database URL security
    const dbUrl = process.env.DATABASE_URL
    if (dbUrl?.includes('localhost') || dbUrl?.includes('127.0.0.1')) {
      issues.push({
        severity: 'medium',
        message: 'Database appears to be running locally - ensure production uses secure remote database'
      })
      score -= 10
    }

    // Check for weak secrets
    const secrets = [
      process.env.BETTER_AUTH_SECRET,
      process.env.POPI_ENCRYPTION_KEY,
      process.env.TRANSACTION_HASH_SECRET
    ]

    for (const secret of secrets) {
      if (secret && secret.length < 32) {
        issues.push({
          severity: 'high',
          message: 'Weak security secret detected - should be at least 32 characters'
        })
        score -= 10
        break
      }
    }

    // Generate recommendations
    recommendations.push(
      'Enable database encryption at rest',
      'Implement automated security scanning',
      'Set up Web Application Firewall (WAF)',
      'Enable rate limiting on all endpoints',
      'Implement automated backup and disaster recovery',
      'Set up security monitoring and alerting',
      'Regular security penetration testing',
      'Implement Content Security Policy (CSP) headers',
      'Enable audit logging for all administrative actions'
    )

    return {
      passed: score >= 80,
      score,
      issues,
      recommendations
    }
  }
}