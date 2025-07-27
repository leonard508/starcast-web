# Starcast NextJS Project - Claude Development Notes

## 🚨 **CRITICAL SECURITY PROTOCOLS - MANDATORY BEFORE ALL COMMITS**

### **🔒 SECURITY-FIRST DEVELOPMENT METHODOLOGY**

#### **MANDATORY PRE-COMMIT SECURITY CHECKLIST**
```
EVERY COMMIT MUST PASS ALL SECURITY CHECKS:

1. 🔍 **CREDENTIAL SCAN**: 
   ❌ NO API keys, tokens, passwords, or secrets in ANY file
   ❌ NO hardcoded credentials in code, docs, or configs
   ❌ NO database URLs with passwords
   ❌ NO auth tokens or access keys

2. 🔐 **ENVIRONMENT VARIABLE AUDIT**:
   ✅ All secrets in .env files ONLY
   ✅ .env files in .gitignore
   ✅ Documentation uses placeholders (xxx-placeholder-xxx)
   ✅ No sensitive values in any tracked files

3. 🛡️ **CODE SECURITY SCAN**:
   ✅ No SQL injection vulnerabilities
   ✅ Proper input validation and sanitization
   ✅ Authentication required for protected endpoints
   ✅ Rate limiting on all public APIs
   ✅ CORS properly configured

4. 📋 **CODE QUALITY GATES**:
   ✅ TypeScript compilation: npm run type-check
   ✅ ESLint validation: npm run lint:check
   ✅ Build success: npm run build
   ✅ No console.log in production code paths

5. 🧹 **HOUSEKEEPING STANDARDS**:
   ✅ No unused variables or imports
   ✅ Proper error handling everywhere
   ✅ Clean, readable, documented code
   ✅ Consistent naming conventions
```

#### **🚫 ABSOLUTELY PROHIBITED IN COMMITS**
- API keys, tokens, secrets of ANY kind
- Database connection strings with credentials
- Password or authentication information
- Third-party service credentials
- Personal identifiable information (PII)
- Temporary test data with real credentials

#### **✅ REQUIRED SECURITY PRACTICES**
- Use placeholder values in documentation
- Store ALL secrets in environment variables
- Validate ALL user inputs
- Require authentication for admin endpoints
- Implement proper error handling without exposing internals
- Use HTTPS for all external communications

### **🔄 MANDATORY WORKFLOW FOR ALL COMMITS**

```bash
# STEP 1: Security Audit
grep -r "TWILIO_" --exclude-dir=node_modules --include="*.ts" --include="*.tsx" --include="*.js" --include="*.md" .
grep -r "BREVO_" --exclude-dir=node_modules --include="*.ts" --include="*.tsx" --include="*.js" --include="*.md" .
grep -r "sk-" --exclude-dir=node_modules --include="*.ts" --include="*.tsx" --include="*.js" --include="*.md" .
grep -r "pk-" --exclude-dir=node_modules --include="*.ts" --include="*.tsx" --include="*.js" --include="*.md" .

# STEP 2: Code Quality Check
npm run type-check
npm run lint:check
npm run build

# STEP 3: Only THEN commit if ALL checks pass
git add [files]
git commit -m "commit message"
```

#### **⚠️ SECURITY INCIDENT PROTOCOL**
If credentials are accidentally committed:
1. **IMMEDIATELY** revoke/regenerate all exposed credentials
2. **IMMEDIATELY** remove from git history: `git filter-branch` or BFG
3. **IMMEDIATELY** update all affected services
4. **DOCUMENT** incident and prevention measures

---

## Project Overview
NextJS 15.4.2 application with TypeScript, PostgreSQL (Prisma), BetterAuth authentication, and comprehensive messaging system.

## Current Status ✅

### Core Features Implemented
- **Signup System**: Fixed broken signup to create real applications in database
- **Admin Dashboard**: Full admin interface with user management and messaging
- **Messaging System**: Comprehensive email and WhatsApp messaging dashboard
- **Authentication**: BetterAuth system with admin role protection

### Recent Implementations

#### 1. Messaging Dashboard (`/admin/messages`)
- **Location**: `src/app/admin/messages/page.tsx`
- **Features**: 
  - Email and WhatsApp message composition
  - Contact selection and management
  - Template system with variable substitution
  - Message history and analytics (placeholders)
  - Pre-built templates for welcome, approval, rejection messages

#### 2. WhatsApp Business API Integration
- **Endpoint**: `src/app/api/send-whatsapp/route.ts`
- **Providers Supported**:
  - Meta WhatsApp Cloud API (Primary)
  - Twilio WhatsApp API
  - Green API
  - Custom WhatsApp API
- **Features**: Rate limiting, phone validation, multiple provider fallback

#### 3. Email System
- **Provider**: Brevo API (`BREVO_API_KEY` configured)
- **Fallback**: SMTP via GoDaddy
- **Templates**: Welcome, approval, rejection emails with variable substitution

### Environment Variables Configured

```env
# Database (Local Development)
DATABASE_URL="postgresql://postgres:password@localhost:5432/railway"

# Auth
BETTER_AUTH_SECRET="your-better-auth-secret-key-here"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3003"

# Email (Brevo)
BREVO_API_KEY="xkeysib-your-brevo-api-key-here"
EMAIL_PROVIDER="brevo"
FROM_EMAIL="info@starcast.co.za"
FROM_NAME="Starcast"

# WhatsApp API (Ready for configuration)
META_ACCESS_TOKEN="your-meta-access-token-here"
META_PHONE_NUMBER_ID="your-phone-number-id-here"
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your-twilio-auth-token-here"
TWILIO_WHATSAPP_NUMBER="+27872502788"
GREEN_API_URL="https://api.green-api.com"
GREEN_API_INSTANCE="your-instance-id-here"
GREEN_API_TOKEN="your-api-token-here"
```

## Key Files Modified/Created

### Core API Endpoints
- `src/app/api/applications/route.ts` - Fixed signup to create real applications
- `src/app/api/send-email/route.ts` - Email sending via Brevo/SMTP
- `src/app/api/send-whatsapp/route.ts` - WhatsApp messaging with multiple providers
- `src/app/api/applications/[id]/approve/route.ts` - Application approval system

### Frontend Components
- `src/app/admin/messages/page.tsx` - Complete messaging dashboard
- `src/app/admin/page.tsx` - Updated admin dashboard with messaging integration
- `src/app/signup/page.tsx` - Fixed signup form to use real API

### Documentation
- `docs/WHATSAPP_SETUP.md` - Comprehensive WhatsApp setup guide for all providers

## Pending Configuration

### WhatsApp Provider Setup
Choose and configure one of:

1. **Meta WhatsApp Cloud API** (Recommended)
   - Create Facebook Business account
   - Get permanent access token and phone number ID
   - Update `META_ACCESS_TOKEN` and `META_PHONE_NUMBER_ID`

2. **Twilio WhatsApp API**
   - Create Twilio account
   - Get WhatsApp business approval
   - Update `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`

3. **Green API** (Simplest)
   - Create Green API account
   - Create WhatsApp instance
   - Update `GREEN_API_INSTANCE` and `GREEN_API_TOKEN`

## Testing Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run typecheck` - TypeScript validation

## Current Port
Application running on `localhost:3003`

## Next Steps
1. Configure preferred WhatsApp API provider using `docs/WHATSAPP_SETUP.md`
2. Test WhatsApp messaging functionality
3. Create additional custom templates as needed
4. Set up webhooks for delivery status (optional)
5. Implement message history storage in database (optional)

## Troubleshooting
- All signup and email functionality working
- Admin authentication properly configured
- Messaging dashboard fully functional
- WhatsApp ready for API configuration