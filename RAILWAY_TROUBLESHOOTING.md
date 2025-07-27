# Railway PostgreSQL Connection Troubleshooting

## 🚨 Current Issue: DATABASE_URL Wrong Type

**Problem:** Railway health check shows `"DATABASE_URL_TYPE":"file"` instead of `"postgresql"`

**Root Cause:** Railway is using the local SQLite connection string instead of PostgreSQL.

## 🔧 IMMEDIATE FIX STEPS

### Step 1: Check Railway Database Service
1. Go to your Railway project dashboard
2. Look for a **PostgreSQL service** in your services list
3. If missing, click **"+ New"** → **"Database"** → **"PostgreSQL"**
4. Wait for the PostgreSQL service to deploy (2-3 minutes)

### Step 2: Connect PostgreSQL to Your App
1. In your **app service** (not the database), go to **"Variables"** tab
2. Look for `DATABASE_URL` variable
3. If it shows `file:./dev.db`, **DELETE** this variable
4. Click **"+ New Variable"** → **"Reference"**
5. Select your **PostgreSQL service**
6. Choose **`DATABASE_URL`** from the dropdown
7. Click **"Add"**

### Step 3: Verify Connection String
The DATABASE_URL should look like:
```
postgresql://postgres:password@host.railway.internal:5432/railway
```

NOT like:
```
file:./dev.db
```

### Step 4: Redeploy
1. Go to **"Deployments"** tab
2. Click **"Deploy Latest"**
3. Wait for deployment to complete
4. Check health at: `https://your-app.railway.app/api/health`

## 🔍 DEBUGGING COMMANDS

### Check Current Status
```bash
# Run locally to check Railway variables
npm run railway:fix-db

# Or check online
curl https://your-app.railway.app/api/debug
```

### Expected Healthy Response
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "packages": 127,
    "providers": 19,
    "seeded": true
  },
  "debug": {
    "DATABASE_URL_TYPE": "postgresql"
  }
}
```

## 🚨 COMMON ISSUES & FIXES

### Issue 1: No PostgreSQL Service
**Symptoms:** No database service in Railway dashboard
**Fix:** Add PostgreSQL service as described in Step 1

### Issue 2: Wrong DATABASE_URL Variable
**Symptoms:** `DATABASE_URL_TYPE: "file"`
**Fix:** Delete the wrong variable and add reference as described in Step 2

### Issue 3: Connection Timeout
**Symptoms:** Health check times out
**Fix:** Wait for PostgreSQL service to fully deploy (can take 5+ minutes)

### Issue 4: Schema Not Created
**Symptoms:** "Table doesn't exist" errors
**Fix:** The app will automatically create schema on first connection

## 📞 NEED HELP?

### Quick Check URLs
- Health: `https://your-app.railway.app/api/health`
- Debug: `https://your-app.railway.app/api/debug`
- Packages: `https://your-app.railway.app/api/packages`

### Railway Dashboard Links
- Project: `https://railway.app/project/your-project-id`
- PostgreSQL Service: `https://railway.app/project/your-project-id/service/postgres-service-id`
- App Service Variables: `https://railway.app/project/your-project-id/service/app-service-id/variables`

### Support
- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app/databases/postgresql
- This project issues: Check SECURITY.md for contact info

## ✅ SUCCESS CHECKLIST

- [ ] PostgreSQL service exists in Railway project
- [ ] DATABASE_URL references PostgreSQL service (not file:./dev.db)
- [ ] Health check returns status: "healthy"
- [ ] Database shows packages > 0 and providers > 0
- [ ] Fibre and LTE pages load packages properly
- [ ] No "Database connection failed" errors

---

**Last Updated:** July 27, 2025  
**Status:** Troubleshooting active Railway deployment issue