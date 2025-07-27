# Railway PostgreSQL Connection Troubleshooting Guide

## Overview

This guide provides comprehensive solutions for Railway PostgreSQL connection issues in the Starcast Next.js application.

## Quick Diagnosis

### 1. Check Health Endpoint
```bash
curl https://your-app.railway.app/api/health
```

### 2. Check Debug Endpoint
```bash
curl https://your-app.railway.app/api/debug
```

### 3. Check Railway Logs
```bash
railway logs
```

## Common Issues & Solutions

### Issue 1: Database Connection Timeout

**Symptoms:**
- Health check returns 503 status
- Error: "Connection timeout" or "ECONNREFUSED"
- Railway logs show connection failures

**Solutions:**

1. **Check DATABASE_URL Format**
   ```bash
   # Correct format
   postgresql://username:password@host:port/database
   ```

2. **Verify Railway Environment Variables**
   ```bash
   railway variables list
   ```

3. **Check PostgreSQL Service Status**
   ```bash
   railway service list
   ```

4. **Restart PostgreSQL Service**
   ```bash
   railway service restart postgresql
   ```

### Issue 2: Migration Failures

**Symptoms:**
- Build succeeds but app fails to start
- Error: "Database schema not found"
- Tables missing in production

**Solutions:**

1. **Manual Migration**
   ```bash
   npm run start:railway
   ```

2. **Force Reset Database**
   ```bash
   npx prisma db push --force-reset
   ```

3. **Check Migration Status**
   ```bash
   npx prisma migrate status
   ```

### Issue 3: Environment Variable Issues

**Symptoms:**
- Debug endpoint shows missing variables
- DATABASE_URL not set or incorrect
- Authentication failures

**Solutions:**

1. **Set Required Variables**
   ```bash
   railway variables set DATABASE_URL="postgresql://..."
   railway variables set NODE_ENV="production"
   railway variables set BETTER_AUTH_SECRET="your-secret"
   ```

2. **Verify Variable Format**
   ```bash
   railway variables get DATABASE_URL
   ```

### Issue 4: Connection Pool Exhaustion

**Symptoms:**
- Intermittent connection failures
- Error: "Too many connections"
- Performance degradation

**Solutions:**

1. **Check Connection Limits**
   ```bash
   # In Railway PostgreSQL dashboard
   # Check connection count and limits
   ```

2. **Optimize Connection Usage**
   - Ensure proper `$disconnect()` calls
   - Use connection pooling if needed
   - Monitor connection usage

## Debugging Steps

### Step 1: Environment Validation
```bash
# Check if all required variables are set
railway variables list | grep -E "(DATABASE_URL|NODE_ENV|BETTER_AUTH_SECRET)"
```

### Step 2: Database Connection Test
```bash
# Test direct database connection
railway run npx prisma db push
```

### Step 3: Application Health Check
```bash
# Test application endpoints
curl -v https://your-app.railway.app/api/health
curl -v https://your-app.railway.app/api/debug
```

### Step 4: Railway Service Status
```bash
# Check all services
railway status
railway service list
```

## Railway Configuration

### railway.toml
```toml
[build]
  command = "npm install && npm run build"

[deploy]
  healthcheckPath = "/api/health"
  healthcheckTimeout = 600
  restartPolicyType = "ON_FAILURE"
  restartPolicyMaxRetries = 5

[environments.production]
  variables = { NODE_ENV = "production" }
```

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Application
NODE_ENV=production
BETTER_AUTH_SECRET=your-secret-key

# Email (optional)
BREVO_API_KEY=your-brevo-key
FROM_EMAIL=info@starcast.co.za
ADMIN_EMAIL=admin@starcast.co.za
```

## Migration Scripts

### Automatic Migration
The `railway-migrate.js` script handles:
- Environment validation
- Database connection testing
- Schema deployment
- Data seeding
- Connection retry logic

### Manual Migration Commands
```bash
# Generate Prisma client
npx prisma generate

# Deploy schema
npx prisma db push --force-reset

# Seed database
npx prisma db seed

# Check status
npx prisma migrate status
```

## Monitoring & Alerts

### Health Check Endpoints
- `/api/health` - Application and database health
- `/api/debug` - Environment and configuration info

### Railway Monitoring
- Railway dashboard shows service status
- Logs provide detailed error information
- Metrics show resource usage

### Custom Alerts
```bash
# Monitor health endpoint
curl -f https://your-app.railway.app/api/health || echo "Health check failed"

# Monitor database connection
railway run npx prisma db push --skip-generate
```

## Performance Optimization

### Database Connection
- Use connection pooling in production
- Implement proper connection cleanup
- Monitor connection usage

### Application Performance
- Enable Prisma query logging in development
- Monitor response times
- Optimize database queries

### Railway Resources
- Monitor CPU and memory usage
- Scale resources as needed
- Use appropriate instance types

## Emergency Procedures

### Database Recovery
```bash
# Reset database completely
railway run npx prisma migrate reset --force

# Restore from backup
railway run npx prisma db push --force-reset
railway run npx prisma db seed
```

### Application Recovery
```bash
# Restart application
railway service restart

# Redeploy application
railway up

# Check logs
railway logs
```

### Environment Recovery
```bash
# Reset environment variables
railway variables set DATABASE_URL="correct-url"
railway variables set NODE_ENV="production"

# Restart services
railway service restart
```

## Best Practices

### Development
1. **Local Testing**: Always test migrations locally first
2. **Environment Parity**: Keep local and production environments similar
3. **Version Control**: Commit all schema changes
4. **Backup Strategy**: Regular database backups

### Production
1. **Monitoring**: Set up health check monitoring
2. **Logging**: Enable comprehensive logging
3. **Security**: Use secure environment variables
4. **Backup**: Regular automated backups

### Deployment
1. **Staging**: Test in staging environment first
2. **Rollback Plan**: Have rollback procedures ready
3. **Health Checks**: Verify all endpoints after deployment
4. **Documentation**: Keep deployment procedures updated

## Support Resources

### Railway Documentation
- [Railway PostgreSQL](https://docs.railway.app/databases/postgresql)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Railway Health Checks](https://docs.railway.app/deploy/healthchecks)

### Prisma Documentation
- [Prisma PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)

### Next.js Documentation
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## Contact & Support

For additional support:
1. Check Railway logs for detailed error information
2. Use the debug endpoint for environment diagnosis
3. Review this troubleshooting guide
4. Contact Railway support if issues persist 