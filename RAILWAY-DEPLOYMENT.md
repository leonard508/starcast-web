# 🚂 Railway Deployment Guide

## 🚨 DEPLOYMENT HANGING ISSUE - SOLUTION

### Quick Fix Steps

1. **Remove Complex Database Operations from Startup**
   - Simplified `railway.toml` to use just `npm start`
   - Removed health checks and complex migration scripts

2. **Set Environment Variables in Railway Dashboard**
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   NODE_ENV=production
   BETTER_AUTH_SECRET=your-secret-here
   ```

3. **Manual Database Setup (One-time)**
   ```bash
   # Connect to Railway project
   railway login
   railway link

   # Push database schema manually
   railway run npx prisma db push
   
   # Seed database (if needed)
   railway run npx prisma db seed
   ```

## 🔧 Deployment Configuration

### Current Railway Configuration (`railway.toml`)
```toml
[build]
  command = "npm install && npx prisma generate && npm run build"

[deploy]
  startCommand = "npm start"

[environments.production]
  variables = { NODE_ENV = "production" }
```

### Required Environment Variables
Set these in Railway Dashboard → Variables:

```bash
# Database (Auto-provided by Railway PostgreSQL plugin)
DATABASE_URL=postgresql://...

# Authentication
BETTER_AUTH_SECRET=your-32-byte-hex-secret
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-app.railway.app

# Email Service
BREVO_API_KEY=your-brevo-api-key
FROM_EMAIL=noreply@starcast.co.za
FROM_NAME=Starcast Technologies

# Security Compliance (POPI/RICA/Ozow)
POPI_ENCRYPTION_KEY=your-32-byte-hex-key
RICA_PHONE_SALT=your-unique-salt
POPI_ID_SALT=your-unique-salt
TRANSACTION_HASH_SECRET=your-transaction-secret
PAYMENT_ENCRYPTION_KEY=your-payment-key
SECURITY_SESSION_SECRET=your-session-secret
CSRF_SECRET=your-csrf-secret

# WhatsApp Business API
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+27xxxxxxxxx
```

## 🔍 Debugging Deployment Issues

### Step 1: Check Railway Logs
```bash
railway logs --follow
```

### Step 2: Run Diagnostic Script
Add this to your Railway environment:
```bash
railway run npm run railway:debug
```

### Step 3: Manual Database Check
```bash
# Test database connection
railway run node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect().then(() => {
  console.log('✅ Database connected');
  return prisma.\$disconnect();
}).catch(console.error);
"
```

## 🛠️ Common Issues & Solutions

### 1. **App Hanging on Startup**
**Cause**: Database operations blocking startup
**Solution**: 
- Use simplified `railway.toml` (no health checks)
- Move database setup to manual process
- Remove `--force-reset` flags

### 2. **Database Connection Failed**
**Cause**: DATABASE_URL not set or incorrect
**Solution**:
- Check Railway Variables dashboard
- Ensure PostgreSQL plugin is attached
- Verify connection string format

### 3. **Build Timeout**
**Cause**: Long build process or dependency issues
**Solution**:
- Simplify build command
- Check for problematic dependencies
- Use `npm ci` instead of `npm install`

### 4. **Environment Variables Missing**
**Cause**: Variables not set in Railway dashboard
**Solution**:
- Go to Railway → Project → Variables
- Add all required environment variables
- Redeploy after adding variables

## 🚀 Deployment Steps

### Manual Deployment Process

1. **Prepare Local Environment**
   ```bash
   # Generate security keys
   npm run security:generate
   
   # Test build locally
   npm run build
   ```

2. **Set Up Railway Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and link project
   railway login
   railway link
   ```

3. **Configure Environment Variables**
   - Copy values from `.env.production.template`
   - Set in Railway Dashboard → Variables
   - Include all POPI/RICA compliance keys

4. **Deploy Application**
   ```bash
   # Push code
   git push origin main
   
   # Or manual deploy
   railway up
   ```

5. **Setup Database Schema**
   ```bash
   # Push schema to production database
   railway run npx prisma db push
   
   # Seed with initial data
   railway run npx prisma db seed
   ```

6. **Verify Deployment**
   ```bash
   # Check logs
   railway logs --follow
   
   # Test API
   curl https://your-app.railway.app/api/health
   
   # Run diagnostics
   railway run npm run railway:debug
   ```

## 🔒 Security Considerations

### POPI/RICA Compliance
- All encryption keys must be set in Railway environment
- Never commit `.env.production` to git
- Use Railway's secret management for sensitive data

### Production Security
- Enable HTTPS (automatic on Railway)
- Set secure session secrets
- Configure CORS properly
- Monitor security audit logs

## 📞 Troubleshooting Support

If deployment is still hanging:

1. **Check Railway Status**: https://railway.app/status
2. **Review Logs**: `railway logs --follow`
3. **Simplify Further**: Remove all non-essential startup operations
4. **Contact Support**: Railway Discord or GitHub issues

---

## 🎯 Current Status

**Issue**: Deployment hanging during startup
**Cause**: Complex database operations and health checks
**Solution**: Simplified configuration + manual database setup
**Status**: Ready for redeployment