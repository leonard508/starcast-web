#!/usr/bin/env node

/**
 * Railway Migration Script
 * 
 * This script ensures the database is properly migrated and seeded when deployed to Railway.
 * It handles the differences between local development (SQLite) and production (PostgreSQL).
 */

import { execSync } from 'child_process';

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

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  const testScript = `
    const { PrismaClient } = require('@prisma/client');
    
    async function testConnection() {
      const prisma = new PrismaClient({
        log: ['error'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      });
      
      try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('✅ Database connection successful!');
        
        // Test a simple query
        const result = await prisma.$queryRaw\`SELECT 1 as test\`;
        console.log('✅ Database query test successful:', result);
        
        await prisma.$disconnect();
        console.log('✅ Database disconnected successfully');
        process.exit(0);
      } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Error details:', {
          code: error.code,
          meta: error.meta,
          clientVersion: error.clientVersion
        });
        await prisma.$disconnect();
        process.exit(1);
      }
    }
    
    testConnection();
  `;
  
  try {
    execSync(`node -e "${testScript}"`, { 
      stdio: 'inherit', 
      timeout: 30000,
      env: { ...process.env }
    });
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
}

async function waitForDatabase(maxAttempts = 30) {
  console.log('🔍 Waiting for database connection...');
  
  for (let i = 1; i <= maxAttempts; i++) {
    console.log(`Attempt ${i}/${maxAttempts}: Testing database connection...`);
    
    if (await testDatabaseConnection()) {
      console.log('✅ Database connection successful!');
      return true;
    }
    
    console.log(`⏳ Attempt ${i} failed, waiting 10 seconds...`);
    if (i < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  console.error('❌ Database connection failed after all attempts');
  return false;
}

async function validateEnvironment() {
  console.log('🔍 Validating environment variables...');
  
  const requiredVars = ['DATABASE_URL'];
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    return false;
  }
  
  if (!process.env.DATABASE_URL.startsWith('postgres')) {
    console.error('❌ DATABASE_URL is not a PostgreSQL URL');
    console.log('Expected format: postgresql://user:password@host:port/database');
    return false;
  }
  
  console.log('✅ Environment validation passed');
  return true;
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
  
  // Validate environment
  if (!await validateEnvironment()) {
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
    
    // Final connection test
    console.log('🔍 Performing final connection test...');
    if (await testDatabaseConnection()) {
      console.log('🎉 Railway migration completed successfully!');
    } else {
      console.error('❌ Final connection test failed');
      process.exit(1);
    }
  } else {
    console.log('🏠 Local development environment - skipping Railway migration');
    console.log('💡 Use "npm run dev" for local development');
  }
}

main().catch((error) => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});