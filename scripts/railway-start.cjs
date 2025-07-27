#!/usr/bin/env node

/**
 * Railway Safe Startup Script
 * 
 * This script ensures a safe startup process for Railway deployment
 * without hanging on database operations
 */

const { execSync, spawn } = require('child_process');

function logWithTimestamp(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function runCommandSync(command, description, options = {}) {
  logWithTimestamp(`📋 ${description}...`);
  try {
    const result = execSync(command, { 
      stdio: 'inherit', 
      timeout: 180000, // 3 minute timeout
      ...options 
    });
    logWithTimestamp(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    logWithTimestamp(`❌ ${description} failed: ${error.message}`);
    return false;
  }
}

async function validateEnvironment() {
  logWithTimestamp('🔍 Validating environment...');
  
  const required = ['DATABASE_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    logWithTimestamp(`❌ Missing environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  logWithTimestamp('✅ Environment validation passed');
  return true;
}

async function setupDatabase() {
  logWithTimestamp('🚀 Setting up database...');
  
  // Generate Prisma client
  if (!runCommandSync('npx prisma generate', 'Generating Prisma client')) {
    return false;
  }
  
  // Deploy schema (non-destructive)
  if (!runCommandSync('npx prisma db push', 'Deploying database schema')) {
    return false;
  }
  
  // Try to seed (allow failure)
  logWithTimestamp('📦 Attempting to seed database...');
  const seedSuccess = runCommandSync('npx prisma db seed', 'Seeding database', { timeout: 60000 });
  
  if (!seedSuccess) {
    logWithTimestamp('⚠️ Seeding failed - this is normal if data already exists');
  }
  
  return true;
}

function startApplication() {
  logWithTimestamp('🚀 Starting Next.js application...');
  
  // Start the Next.js application
  const child = spawn('npm', ['start'], {
    stdio: 'inherit',
    env: process.env
  });
  
  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    logWithTimestamp('📴 Received SIGTERM, shutting down gracefully...');
    child.kill('SIGTERM');
  });
  
  process.on('SIGINT', () => {
    logWithTimestamp('📴 Received SIGINT, shutting down gracefully...');
    child.kill('SIGINT');
  });
  
  child.on('error', (error) => {
    logWithTimestamp(`❌ Application error: ${error.message}`);
    process.exit(1);
  });
  
  child.on('exit', (code) => {
    logWithTimestamp(`📴 Application exited with code ${code}`);
    process.exit(code);
  });
}

async function main() {
  logWithTimestamp('🛡️ Starcast Railway Startup - POPI/RICA Compliant');
  logWithTimestamp(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logWithTimestamp(`Railway Environment: ${process.env.RAILWAY_ENVIRONMENT || 'not-detected'}`);
  
  try {
    // Validate environment
    if (!await validateEnvironment()) {
      process.exit(1);
    }
    
    // Setup database
    if (!await setupDatabase()) {
      logWithTimestamp('❌ Database setup failed, but continuing anyway...');
      // Don't exit - let the app try to start
    }
    
    // Start the application
    startApplication();
    
  } catch (error) {
    logWithTimestamp(`💥 Startup failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logWithTimestamp(`💥 Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logWithTimestamp(`💥 Unhandled rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

main();