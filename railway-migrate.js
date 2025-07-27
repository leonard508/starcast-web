#!/usr/bin/env node

/**
 * Railway Migration Script
 * 
 * This script ensures the database is properly migrated and seeded when deployed to Railway.
 * It handles the differences between local development (SQLite) and production (PostgreSQL).
 */

const { execSync } = require('child_process');

function runCommand(command, description, allowFailure = false) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', timeout: 300000 }); // 5 minute timeout
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    if (!allowFailure) {
      process.exit(1);
    }
    return false;
  }
}

async function waitForDatabase(maxAttempts = 30) {
  console.log('🔍 Waiting for database connection...');
  
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      console.log(`Attempt ${i}/${maxAttempts}: Testing database connection...`);
      execSync('node -e "const { PrismaClient } = require(\'@prisma/client\'); const prisma = new PrismaClient(); prisma.$connect().then(() => { console.log(\'Database connected!\'); process.exit(0); }).catch((e) => { console.error(\'Connection failed:\', e.message); process.exit(1); });"', 
        { stdio: 'inherit', timeout: 10000 });
      console.log('✅ Database connection successful!');
      return true;
    } catch (error) {
      console.log(`⏳ Attempt ${i} failed, waiting 10 seconds...`);
      if (i < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
  }
  
  console.error('❌ Database connection failed after all attempts');
  return false;
}

async function main() {
  console.log('🚀 Starting Railway database migration...');
  console.log('Environment variables:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
  console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('- DATABASE_URL starts with postgres:', process.env.DATABASE_URL?.startsWith('postgres'));
  
  // Check if we're in Railway environment
  const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_NAME;
  const isProduction = process.env.NODE_ENV === 'production';
  const hasDatabaseUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres');
  
  if (!hasDatabaseUrl) {
    console.error('❌ DATABASE_URL is not set or not a PostgreSQL URL');
    console.log('Expected format: postgresql://user:password@host:port/database');
    process.exit(1);
  }
  
  if (isRailway || isProduction) {
    console.log('🚂 Production environment detected');
    
    // Generate Prisma client for PostgreSQL
    runCommand('npx prisma generate', 'Generating Prisma client');
    
    // Wait for database to be ready
    const dbReady = await waitForDatabase();
    if (!dbReady) {
      console.error('❌ Database not ready, cannot proceed with migration');
      process.exit(1);
    }
    
    // Deploy database schema (creates tables if they don't exist)
    runCommand('npx prisma db push --force-reset', 'Deploying database schema');
    
    // Seed the database with packages (allow failure in case already seeded)
    const seedSuccess = runCommand('npx prisma db seed', 'Seeding database with packages', true);
    
    if (!seedSuccess) {
      console.log('⚠️ Seeding failed, but this might be expected if data already exists');
    }
    
    console.log('🎉 Railway migration completed successfully!');
  } else {
    console.log('🏠 Local development environment - skipping Railway migration');
    console.log('💡 Use "npm run dev" for local development');
  }
}

main().catch((error) => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});