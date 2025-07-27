#!/usr/bin/env node

/**
 * Security Configuration Generator Script
 * 
 * This script generates secure configuration for POPI/RICA/Ozow compliance
 * Usage: node scripts/generate-security-config.js
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

function generateSecrets() {
  return {
    POPI_ENCRYPTION_KEY: crypto.randomBytes(32).toString('hex'),
    RICA_PHONE_SALT: `rica_sa_phone_${crypto.randomBytes(16).toString('hex')}_${Date.now()}`,
    POPI_ID_SALT: `popi_sa_id_${crypto.randomBytes(16).toString('hex')}_${Date.now()}`,
    TRANSACTION_HASH_SECRET: crypto.randomBytes(64).toString('hex'),
    PAYMENT_ENCRYPTION_KEY: crypto.randomBytes(32).toString('hex'),
    SECURITY_SESSION_SECRET: crypto.randomBytes(32).toString('hex'),
    CSRF_SECRET: crypto.randomBytes(32).toString('hex'),
    BETTER_AUTH_SECRET: crypto.randomBytes(32).toString('hex')
  }
}

function generateProductionEnv() {
  const secrets = generateSecrets()
  
  return `# Production Environment Variables - KEEP SECURE!
# Generated on ${new Date().toISOString()}

# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# BetterAuth Configuration
BETTER_AUTH_SECRET="${secrets.BETTER_AUTH_SECRET}"
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

function main() {
  console.log('🛡️  Starcast Security Configuration Generator')
  console.log('   POPI Act & RICA Compliance | Ozow Security Audit Ready')
  console.log('')

  // Generate production environment template
  const prodEnv = generateProductionEnv()
  const prodEnvPath = path.join(process.cwd(), '.env.production.template')
  
  fs.writeFileSync(prodEnvPath, prodEnv)
  console.log(`✅ Generated: ${prodEnvPath}`)
  
  // Generate development secrets for current .env
  const secrets = generateSecrets()
  const currentEnvPath = path.join(process.cwd(), '.env')
  
  if (fs.existsSync(currentEnvPath)) {
    let currentEnv = fs.readFileSync(currentEnvPath, 'utf8')
    
    // Update or add security secrets
    Object.entries(secrets).forEach(([key, value]) => {
      const regex = new RegExp(`^${key}=.*$`, 'm')
      if (regex.test(currentEnv)) {
        currentEnv = currentEnv.replace(regex, `${key}="${value}"`)
      } else {
        currentEnv += `\n${key}="${value}"`
      }
    })
    
    fs.writeFileSync(currentEnvPath, currentEnv)
    console.log(`✅ Updated: ${currentEnvPath}`)
  }

  // Display security checklist
  console.log('')
  console.log('🔒 SECURITY CHECKLIST:')
  console.log('   ✓ Encryption keys generated (AES-256-GCM)')
  console.log('   ✓ POPI Act compliance keys ready')
  console.log('   ✓ RICA communication hashing salts created')
  console.log('   ✓ Ozow payment security secrets generated')
  console.log('   ✓ Session and CSRF protection enabled')
  console.log('')
  console.log('⚠️  IMPORTANT SECURITY NOTES:')
  console.log('   • Never commit .env.production to version control')
  console.log('   • Use secure deployment practices (Railway secrets, etc.)')
  console.log('   • Regularly rotate encryption keys')
  console.log('   • Monitor security audit logs')
  console.log('   • Keep backups of encryption keys in secure vault')
  console.log('')
  console.log('🚀 DEPLOYMENT READY:')
  console.log('   • Copy .env.production.template to your deployment environment')
  console.log('   • Replace placeholder values with real credentials')
  console.log('   • Run security audit before going live')
  console.log('')
}

if (require.main === module) {
  main()
}

module.exports = { generateSecrets, generateProductionEnv }