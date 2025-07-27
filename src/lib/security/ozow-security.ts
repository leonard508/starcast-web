/**
 * Ozow Security Compliance Module
 * 
 * Implements security measures required for Ozow payment gateway approval
 * including fraud detection, rate limiting, and transaction security
 */

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'
import { RateLimiterRedis } from 'rate-limiter-flexible'

// Security event types for audit logging
export enum SecurityEventType {
  LOGIN_ATTEMPT = 'login_attempt',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  PASSWORD_CHANGE = 'password_change',
  PAYMENT_ATTEMPT = 'payment_attempt',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILURE = 'payment_failure',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  DATA_ACCESS = 'data_access',
  ADMIN_ACTION = 'admin_action'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * Enhanced Rate Limiting for Ozow Compliance
 */
export class OzowRateLimiter {
  private static loginLimiter = new RateLimiterRedis({
    storeClient: undefined, // Redis client would go here in production
    keyPrefix: 'login_fail_ip',
    points: 5, // Number of attempts
    duration: 900, // Per 15 minutes
    blockDuration: 900, // Block for 15 minutes
  })

  private static paymentLimiter = new RateLimiterRedis({
    storeClient: undefined,
    keyPrefix: 'payment_attempt',
    points: 3, // 3 payment attempts
    duration: 300, // Per 5 minutes
    blockDuration: 1800, // Block for 30 minutes
  })

  /**
   * Check login rate limits
   */
  static async checkLoginRateLimit(ipAddress: string): Promise<{
    allowed: boolean
    remainingPoints: number
    resetTime: Date
  }> {
    try {
      const result = await this.loginLimiter.get(ipAddress)
      
      if (result && result.remainingPoints <= 0) {
        await this.logSecurityEvent({
          eventType: SecurityEventType.RATE_LIMIT_EXCEEDED,
          ipAddress,
          riskLevel: RiskLevel.HIGH,
          details: { type: 'login_rate_limit' }
        })

        return {
          allowed: false,
          remainingPoints: 0,
          resetTime: new Date(Date.now() + result.msBeforeNext)
        }
      }

      return {
        allowed: true,
        remainingPoints: result ? result.remainingPoints : 5,
        resetTime: new Date()
      }
    } catch (error) {
      // Allow request if rate limiter fails
      console.error('Rate limiter error:', error)
      return {
        allowed: true,
        remainingPoints: 5,
        resetTime: new Date()
      }
    }
  }

  /**
   * Record failed login attempt
   */
  static async recordFailedLogin(ipAddress: string): Promise<void> {
    try {
      await this.loginLimiter.consume(ipAddress)
    } catch (error) {
      console.error('Failed to record login attempt:', error)
    }
  }

  /**
   * Check payment rate limits
   */
  static async checkPaymentRateLimit(ipAddress: string, userId: string): Promise<{
    allowed: boolean
    reason?: string
  }> {
    try {
      // Check IP-based rate limiting
      const ipResult = await this.paymentLimiter.get(ipAddress)
      if (ipResult && ipResult.remainingPoints <= 0) {
        await this.logSecurityEvent({
          eventType: SecurityEventType.RATE_LIMIT_EXCEEDED,
          ipAddress,
          userId,
          riskLevel: RiskLevel.CRITICAL,
          details: { type: 'payment_rate_limit_ip' }
        })

        return {
          allowed: false,
          reason: 'Too many payment attempts from this location'
        }
      }

      // Check user-based rate limiting (separate logic)
      const userPaymentCount = await db.securityAuditLog.count({
        where: {
          userId,
          eventType: SecurityEventType.PAYMENT_ATTEMPT,
          timestamp: {
            gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
          }
        }
      })

      if (userPaymentCount >= 3) {
        await this.logSecurityEvent({
          eventType: SecurityEventType.RATE_LIMIT_EXCEEDED,
          ipAddress,
          userId,
          riskLevel: RiskLevel.CRITICAL,
          details: { type: 'payment_rate_limit_user' }
        })

        return {
          allowed: false,
          reason: 'Too many payment attempts on this account'
        }
      }

      return { allowed: true }
    } catch (error) {
      console.error('Payment rate limit error:', error)
      return { allowed: true }
    }
  }

  /**
   * Log security events for audit
   */
  private static async logSecurityEvent(event: {
    eventType: SecurityEventType
    ipAddress: string
    userId?: string
    riskLevel: RiskLevel
    details?: any
  }): Promise<void> {
    try {
      await db.securityAuditLog.create({
        data: {
          eventType: event.eventType,
          userId: event.userId || null,
          ipAddress: event.ipAddress,
          userAgent: 'security_system',
          success: false,
          details: event.details || {},
          riskLevel: event.riskLevel
        }
      })
    } catch (error) {
      console.error('Failed to log security event:', error)
    }
  }
}

/**
 * Fraud Detection for Ozow Compliance
 */
export class FraudDetection {
  /**
   * Analyze transaction for fraud indicators
   */
  static async analyzeFraudRisk(
    userId: string,
    amount: number,
    ipAddress: string,
    userAgent: string
  ): Promise<{
    riskScore: number
    riskLevel: RiskLevel
    flags: string[]
    approved: boolean
  }> {
    const flags: string[] = []
    let riskScore = 0

    // Check for unusual amount patterns
    const userAvgAmount = await this.getUserAverageTransactionAmount(userId)
    if (amount > userAvgAmount * 3) {
      flags.push('Amount significantly higher than user average')
      riskScore += 30
    }

    // Check for rapid succession payments
    const recentPayments = await db.securityAuditLog.count({
      where: {
        userId,
        eventType: SecurityEventType.PAYMENT_ATTEMPT,
        timestamp: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        }
      }
    })

    if (recentPayments > 2) {
      flags.push('Multiple payment attempts in short time')
      riskScore += 40
    }

    // Check for IP address changes
    const userLastIp = await this.getUserLastKnownIp(userId)
    if (userLastIp && userLastIp !== ipAddress) {
      flags.push('Payment from new IP address')
      riskScore += 20
    }

    // Check for suspicious user agent patterns
    if (this.isSuspiciousUserAgent(userAgent)) {
      flags.push('Suspicious browser/device signature')
      riskScore += 25
    }

    // Determine risk level
    let riskLevel: RiskLevel
    if (riskScore >= 80) {
      riskLevel = RiskLevel.CRITICAL
    } else if (riskScore >= 60) {
      riskLevel = RiskLevel.HIGH
    } else if (riskScore >= 30) {
      riskLevel = RiskLevel.MEDIUM
    } else {
      riskLevel = RiskLevel.LOW
    }

    const approved = riskScore < 70 // Threshold for automatic approval

    // Log fraud analysis
    await db.securityAuditLog.create({
      data: {
        eventType: SecurityEventType.PAYMENT_ATTEMPT,
        userId,
        ipAddress,
        userAgent,
        success: approved,
        details: {
          amount,
          riskScore,
          flags,
          fraudAnalysis: true
        },
        riskLevel
      }
    })

    return {
      riskScore,
      riskLevel,
      flags,
      approved
    }
  }

  private static async getUserAverageTransactionAmount(userId: string): Promise<number> {
    try {
      const bills = await db.bill.findMany({
        where: { userId },
        select: { totalAmount: true },
        take: 10,
        orderBy: { dueDate: 'desc' }
      })

      if (bills.length === 0) return 500 // Default amount for new users

      const total = bills.reduce((sum, bill) => sum + Number(bill.totalAmount), 0)
      return total / bills.length
    } catch (error) {
      return 500 // Default fallback
    }
  }

  private static async getUserLastKnownIp(userId: string): Promise<string | null> {
    try {
      const lastSession = await db.session.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { ipAddress: true }
      })

      return lastSession?.ipAddress || null
    } catch (error) {
      return null
    }
  }

  private static isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /automated/i,
      /script/i
    ]

    return suspiciousPatterns.some(pattern => pattern.test(userAgent))
  }
}

/**
 * Transaction Security for Ozow Integration
 */
export class TransactionSecurity {
  /**
   * Generate secure transaction reference
   */
  static generateSecureTransactionRef(): string {
    const timestamp = Date.now().toString()
    const random = crypto.randomBytes(8).toString('hex')
    return `SC${timestamp}${random}`.toUpperCase()
  }

  /**
   * Create transaction hash for integrity verification
   */
  static createTransactionHash(
    transactionRef: string,
    amount: number,
    userId: string,
    timestamp: number
  ): string {
    const data = `${transactionRef}|${amount}|${userId}|${timestamp}`
    const secret = process.env.TRANSACTION_HASH_SECRET || 'default_secret'
    return crypto.createHmac('sha256', secret).update(data).digest('hex')
  }

  /**
   * Verify transaction integrity
   */
  static verifyTransactionHash(
    transactionRef: string,
    amount: number,
    userId: string,
    timestamp: number,
    providedHash: string
  ): boolean {
    const expectedHash = this.createTransactionHash(transactionRef, amount, userId, timestamp)
    return crypto.timingSafeEqual(Buffer.from(expectedHash), Buffer.from(providedHash))
  }

  /**
   * Encrypt sensitive payment data
   */
  static encryptPaymentData(data: string): string {
    const algorithm = 'aes-256-gcm'
    const key = Buffer.from(process.env.PAYMENT_ENCRYPTION_KEY || '', 'hex')
    const iv = crypto.randomBytes(16)
    
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const tag = cipher.getAuthTag()
    
    return iv.toString('hex') + tag.toString('hex') + encrypted
  }
}

/**
 * IP Geolocation Security Check
 */
export class GeolocationSecurity {
  /**
   * Check if IP address is from South Africa (for RICA compliance)
   */
  static async validateSouthAfricanIp(ipAddress: string): Promise<{
    isValid: boolean
    country?: string
    riskLevel: RiskLevel
  }> {
    try {
      // In production, use a proper IP geolocation service
      // For now, implement basic validation
      
      // Check for local/development IPs
      if (ipAddress === '::1' || ipAddress === '127.0.0.1' || ipAddress.startsWith('192.168.')) {
        return {
          isValid: true,
          country: 'ZA',
          riskLevel: RiskLevel.LOW
        }
      }

      // TODO: Implement actual geolocation checking
      // For production, integrate with MaxMind GeoIP2 or similar service
      
      return {
        isValid: true, // Default to allow for now
        country: 'Unknown',
        riskLevel: RiskLevel.MEDIUM
      }
    } catch (error) {
      console.error('Geolocation check failed:', error)
      return {
        isValid: true, // Default to allow if check fails
        riskLevel: RiskLevel.MEDIUM
      }
    }
  }
}

/**
 * Password Security for Ozow Compliance
 */
export class PasswordSecurity {
  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean
    score: number
    issues: string[]
  } {
    const issues: string[] = []
    let score = 0

    if (password.length >= 12) {
      score += 25
    } else if (password.length >= 8) {
      score += 15
    } else {
      issues.push('Password must be at least 8 characters long')
    }

    if (/[a-z]/.test(password)) score += 15
    else issues.push('Password must contain lowercase letters')

    if (/[A-Z]/.test(password)) score += 15
    else issues.push('Password must contain uppercase letters')

    if (/\d/.test(password)) score += 15
    else issues.push('Password must contain numbers')

    if (/[^a-zA-Z0-9]/.test(password)) score += 20
    else issues.push('Password must contain special characters')

    if (!/(.)\1{2,}/.test(password)) score += 10
    else issues.push('Password should not contain repeated characters')

    return {
      isValid: score >= 70 && issues.length === 0,
      score,
      issues
    }
  }

  /**
   * Generate secure temporary password
   */
  static generateSecureTemporaryPassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*'
    
    let password = ''
    
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]
    
    // Add remaining characters
    const allChars = uppercase + lowercase + numbers + symbols
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }
}

/**
 * Security Headers for Ozow Compliance
 */
export class SecurityHeaders {
  /**
   * Get comprehensive security headers
   */
  static getSecurityHeaders(): Record<string, string> {
    return {
      // HTTPS enforcement
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      
      // Content Security Policy
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.ozow.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' https://api.ozow.com",
        "frame-src https://checkout.ozow.com",
        "object-src 'none'",
        "base-uri 'self'"
      ].join('; '),
      
      // XSS Protection
      'X-XSS-Protection': '1; mode=block',
      
      // Content Type Protection
      'X-Content-Type-Options': 'nosniff',
      
      // Frame Protection
      'X-Frame-Options': 'DENY',
      
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Permission Policy
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      
      // Remove Server Information
      'Server': 'Starcast-Secure'
    }
  }
}