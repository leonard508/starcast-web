/**
 * POPI Act (Protection of Personal Information Act) Compliance Module
 * South Africa - Act No. 4 of 2013
 * 
 * This module ensures compliance with South African data protection laws
 * and implements security measures for Ozow payment gateway approval
 */

import { db } from '@/lib/db'
import crypto from 'crypto'

// POPI Act Data Categories
export enum DataCategory {
  PERSONAL_IDENTIFIER = 'personal_identifier', // Name, ID number
  CONTACT_INFO = 'contact_info',              // Phone, email, address
  FINANCIAL_DATA = 'financial_data',          // Payment information
  COMMUNICATION_DATA = 'communication_data',   // Messages, call logs
  SERVICE_DATA = 'service_data'               // Package preferences, usage
}

// POPI Act Processing Purposes
export enum ProcessingPurpose {
  SERVICE_PROVISION = 'service_provision',
  BILLING_PAYMENT = 'billing_payment',
  CUSTOMER_SUPPORT = 'customer_support',
  LEGAL_COMPLIANCE = 'legal_compliance',
  MARKETING = 'marketing'
}

// POPI Act Legal Basis for Processing
export enum LegalBasis {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  VITAL_INTERESTS = 'vital_interests',
  LEGITIMATE_INTERESTS = 'legitimate_interests'
}

export interface ConsentRecord {
  userId: string
  dataCategory: DataCategory
  processingPurpose: ProcessingPurpose
  legalBasis: LegalBasis
  consentGiven: boolean
  consentDate: Date
  ipAddress: string
  userAgent: string
  withdrawnAt?: Date
  version: string // Terms version
}

export interface DataProcessingLog {
  id: string
  userId: string
  dataCategory: DataCategory
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXPORT'
  purpose: ProcessingPurpose
  adminUser?: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  dataFields: string[] // Which fields were accessed
}

/**
 * POPI Act Data Encryption
 * Encrypts sensitive personal information using AES-256-GCM
 */
export class POPIDataProtection {
  private static readonly ALGORITHM = 'aes-256-gcm'
  private static readonly IV_LENGTH = 16
  private static readonly TAG_LENGTH = 16
  
  private static getEncryptionKey(): Buffer {
    const key = process.env.POPI_ENCRYPTION_KEY
    if (!key) {
      throw new Error('POPI_ENCRYPTION_KEY environment variable is required')
    }
    return Buffer.from(key, 'hex')
  }

  /**
   * Encrypt sensitive personal data
   */
  static encryptPersonalData(data: string): string {
    const key = this.getEncryptionKey()
    const iv = crypto.randomBytes(this.IV_LENGTH)
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv)
    cipher.setAAD(Buffer.from('POPI_PROTECTED', 'utf8'))
    
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const tag = cipher.getAuthTag()
    
    // Combine IV + tag + encrypted data
    return iv.toString('hex') + tag.toString('hex') + encrypted
  }

  /**
   * Decrypt sensitive personal data
   */
  static decryptPersonalData(encryptedData: string): string {
    const key = this.getEncryptionKey()
    
    // Extract IV, tag, and encrypted data
    const iv = Buffer.from(encryptedData.slice(0, this.IV_LENGTH * 2), 'hex')
    const tag = Buffer.from(encryptedData.slice(this.IV_LENGTH * 2, (this.IV_LENGTH + this.TAG_LENGTH) * 2), 'hex')
    const encrypted = encryptedData.slice((this.IV_LENGTH + this.TAG_LENGTH) * 2)
    
    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv)
    decipher.setAAD(Buffer.from('POPI_PROTECTED', 'utf8'))
    decipher.setAuthTag(tag)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  /**
   * Hash phone numbers for RICA compliance
   * Creates non-reversible hash for storage while maintaining searchability
   */
  static hashPhoneNumber(phoneNumber: string): string {
    const salt = process.env.RICA_PHONE_SALT || 'rica_sa_phone_salt_2024'
    return crypto.createHash('sha256').update(phoneNumber + salt).digest('hex')
  }

  /**
   * Generate secure ID number hash for POPI compliance
   */
  static hashIdNumber(idNumber: string): string {
    const salt = process.env.POPI_ID_SALT || 'popi_sa_id_salt_2024'
    return crypto.createHash('sha256').update(idNumber + salt).digest('hex')
  }
}

/**
 * POPI Act Consent Management
 */
export class ConsentManager {
  /**
   * Record user consent for data processing
   */
  static async recordConsent(
    userId: string,
    consents: Omit<ConsentRecord, 'userId'>[],
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    try {
      for (const consent of consents) {
        await db.dataConsent.create({
          data: {
            userId,
            dataCategory: consent.dataCategory,
            processingPurpose: consent.processingPurpose,
            legalBasis: consent.legalBasis,
            consentGiven: consent.consentGiven,
            consentDate: consent.consentDate,
            ipAddress,
            userAgent,
            version: consent.version
          }
        })
      }
    } catch (error) {
      console.error('Failed to record consent:', error)
      throw new Error('Failed to record data processing consent')
    }
  }

  /**
   * Check if user has given consent for specific data processing
   */
  static async hasConsent(
    userId: string,
    dataCategory: DataCategory,
    purpose: ProcessingPurpose
  ): Promise<boolean> {
    try {
      const consent = await db.dataConsent.findFirst({
        where: {
          userId,
          dataCategory,
          processingPurpose: purpose,
          consentGiven: true,
          withdrawnAt: null
        }
      })
      return !!consent
    } catch (error) {
      console.error('Failed to check consent:', error)
      return false
    }
  }

  /**
   * Withdraw consent (POPI Act Right to Object)
   */
  static async withdrawConsent(
    userId: string,
    dataCategory: DataCategory,
    purpose: ProcessingPurpose
  ): Promise<void> {
    try {
      await db.dataConsent.updateMany({
        where: {
          userId,
          dataCategory,
          processingPurpose: purpose,
          withdrawnAt: null
        },
        data: {
          withdrawnAt: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to withdraw consent:', error)
      throw new Error('Failed to withdraw consent')
    }
  }
}

/**
 * POPI Act Data Processing Audit Trail
 */
export class DataProcessingLogger {
  /**
   * Log data access for POPI Act compliance
   */
  static async logDataAccess(
    userId: string,
    action: DataProcessingLog['action'],
    dataCategory: DataCategory,
    purpose: ProcessingPurpose,
    dataFields: string[],
    ipAddress: string,
    userAgent: string,
    adminUser?: string
  ): Promise<void> {
    try {
      await db.dataProcessingLog.create({
        data: {
          userId,
          action,
          dataCategory,
          purpose,
          adminUser,
          ipAddress,
          userAgent,
          dataFields: JSON.stringify(dataFields),
          timestamp: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to log data processing:', error)
      // Don't throw error as this could break user operations
    }
  }

  /**
   * Generate data processing report for POPI Act compliance
   */
  static async generateProcessingReport(userId: string): Promise<DataProcessingLog[]> {
    try {
      const logs = await db.dataProcessingLog.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 1000 // Last 1000 activities
      })

      return logs.map((log: any) => ({
        id: log.id,
        userId: log.userId,
        dataCategory: log.dataCategory as DataCategory,
        action: log.action as DataProcessingLog['action'],
        purpose: log.purpose as ProcessingPurpose,
        adminUser: log.adminUser,
        timestamp: log.timestamp,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        dataFields: JSON.parse(log.dataFields)
      }))
    } catch (error) {
      console.error('Failed to generate processing report:', error)
      throw new Error('Failed to generate data processing report')
    }
  }
}

/**
 * POPI Act Data Subject Rights Implementation
 */
export class DataSubjectRights {
  /**
   * Right to Access - Export all user data
   */
  static async exportUserData(userId: string): Promise<any> {
    try {
      // Log the data export
      await DataProcessingLogger.logDataAccess(
        userId,
        'EXPORT',
        DataCategory.PERSONAL_IDENTIFIER,
        ProcessingPurpose.LEGAL_COMPLIANCE,
        ['all_user_data'],
        'system',
        'popi_export_system'
      )

      // Get all user data across all tables
      const userData = await db.user.findUnique({
        where: { id: userId },
        include: {
          applications: true,
          bills: true,
          orders: true,
          whatsappMessages: {
            select: {
              messageBody: true,
              direction: true,
              createdAt: true,
              isAutoResponse: true
            }
          },
          sessions: {
            select: {
              createdAt: true,
              ipAddress: true,
              userAgent: true
            }
          }
        }
      })

      if (!userData) {
        throw new Error('User not found')
      }

      // Decrypt encrypted fields for export
      const decryptedData = {
        ...userData,
        phone: userData.phone ? POPIDataProtection.decryptPersonalData(userData.phone) : null,
        idNumber: userData.idNumber ? POPIDataProtection.decryptPersonalData(userData.idNumber) : null,
        exportDate: new Date().toISOString(),
        dataRetentionPeriod: '7 years from account closure',
        legalBasis: 'POPI Act Section 23 - Right to Access'
      }

      return decryptedData
    } catch (error) {
      console.error('Failed to export user data:', error)
      throw new Error('Failed to export user data')
    }
  }

  /**
   * Right to Erasure - Delete user data (with legal compliance)
   */
  static async deleteUserData(userId: string, reason: string): Promise<void> {
    try {
      // Check if user has legal obligation to retain data (e.g., billing records)
      const hasLegalObligation = await this.checkDataRetentionObligation(userId)
      
      if (hasLegalObligation) {
        // Anonymize instead of delete
        await this.anonymizeUserData(userId, reason)
      } else {
        // Complete deletion
        await db.user.delete({
          where: { id: userId }
        })
      }

      // Log the deletion/anonymization
      await DataProcessingLogger.logDataAccess(
        userId,
        'DELETE',
        DataCategory.PERSONAL_IDENTIFIER,
        ProcessingPurpose.LEGAL_COMPLIANCE,
        ['user_deletion'],
        'system',
        'popi_deletion_system'
      )
    } catch (error) {
      console.error('Failed to delete user data:', error)
      throw new Error('Failed to delete user data')
    }
  }

  /**
   * Check if user data must be retained for legal obligations
   */
  private static async checkDataRetentionObligation(userId: string): Promise<boolean> {
    // Check for unpaid bills, ongoing legal matters, etc.
    const unpaidBills = await db.bill.findFirst({
      where: {
        userId,
        status: { in: ['PENDING', 'OVERDUE'] }
      }
    })

    // RICA requires communication records to be kept for specific periods
    const recentCommunications = await db.whatsAppMessage.findFirst({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000) // 3 years
        }
      }
    })

    return !!(unpaidBills || recentCommunications)
  }

  /**
   * Anonymize user data while retaining necessary records
   */
  private static async anonymizeUserData(userId: string, reason: string): Promise<void> {
    const anonymizedEmail = `anonymized_${Date.now()}@deleted.starcast.local`
    
    await db.user.update({
      where: { id: userId },
      data: {
        email: anonymizedEmail,
        firstName: 'ANONYMIZED',
        lastName: 'USER',
        phone: null,
        address: null,
        city: null,
        province: null,
        postalCode: null,
        idNumber: null,
        active: false,
        // Keep service-related data for legal compliance
        updatedAt: new Date()
      }
    })
  }
}

/**
 * RICA Act Communication Compliance
 */
export class RICACompliance {
  /**
   * Log communication for RICA compliance
   */
  static async logCommunication(
    fromNumber: string,
    toNumber: string,
    messageContent: string,
    communicationType: 'SMS' | 'WHATSAPP' | 'EMAIL',
    direction: 'INBOUND' | 'OUTBOUND'
  ): Promise<void> {
    try {
      // Hash phone numbers for privacy while maintaining audit trail
      const hashedFromNumber = POPIDataProtection.hashPhoneNumber(fromNumber)
      const hashedToNumber = POPIDataProtection.hashPhoneNumber(toNumber)
      
      await db.ricaCommunicationLog.create({
        data: {
          hashedFromNumber,
          hashedToNumber,
          messageHash: crypto.createHash('sha256').update(messageContent).digest('hex'),
          communicationType,
          direction,
          timestamp: new Date(),
          messageLength: messageContent.length,
          retentionPeriod: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000) // 3 years
        }
      })
    } catch (error) {
      console.error('Failed to log RICA communication:', error)
      // Don't throw error as this could break communication flow
    }
  }

  /**
   * Clean up expired RICA logs
   */
  static async cleanupExpiredLogs(): Promise<void> {
    try {
      await db.ricaCommunicationLog.deleteMany({
        where: {
          retentionPeriod: {
            lt: new Date()
          }
        }
      })
    } catch (error) {
      console.error('Failed to cleanup RICA logs:', error)
    }
  }
}

/**
 * Ozow Security Compliance Checker
 */
export class OzowSecurityCompliance {
  /**
   * Validate system meets Ozow security requirements
   */
  static async validateSecurityCompliance(): Promise<{
    compliant: boolean
    issues: string[]
    recommendations: string[]
  }> {
    const issues: string[] = []
    // Recommendations array removed as not used in this function

    // Check encryption keys
    if (!process.env.POPI_ENCRYPTION_KEY) {
      issues.push('POPI encryption key not configured')
    }

    // Check HTTPS enforcement
    if (!process.env.NEXT_PUBLIC_BETTER_AUTH_URL?.startsWith('https://')) {
      issues.push('HTTPS not enforced for authentication')
    }

    // Check password policies
    // TODO: Implement password strength validation

    // Check data retention policies
    // TODO: Implement automatic data cleanup

    return {
      compliant: issues.length === 0,
      issues,
      recommendations: [
        'Implement regular security audits',
        'Enable database encryption at rest',
        'Set up automated vulnerability scanning',
        'Implement rate limiting on all endpoints'
      ]
    }
  }
}