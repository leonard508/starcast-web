#!/usr/bin/env node

/**
 * Railway Deployment Debugging Script
 * 
 * This script helps diagnose Railway deployment issues
 */

function logEnvInfo() {
  console.log('🔍 RAILWAY DEPLOYMENT DIAGNOSTICS');
  console.log('================================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');
  
  console.log('📋 ENVIRONMENT VARIABLES:');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'undefined');
  console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT || 'undefined');
  console.log('- RAILWAY_PROJECT_NAME:', process.env.RAILWAY_PROJECT_NAME || 'undefined');
  console.log('- RAILWAY_SERVICE_NAME:', process.env.RAILWAY_SERVICE_NAME || 'undefined');
  console.log('- PORT:', process.env.PORT || 'undefined');
  console.log('');
  
  console.log('🗄️ DATABASE CONFIGURATION:');
  console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('- DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);
  console.log('- DATABASE_URL starts with postgresql:', process.env.DATABASE_URL?.startsWith('postgresql://') || false);
  
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      console.log('- Host:', url.hostname);
      console.log('- Port:', url.port);
      console.log('- Database:', url.pathname.substring(1));
      console.log('- Username:', url.username);
      console.log('- Has password:', !!url.password);
    } catch (error) {
      console.log('- URL parsing error:', error.message);
    }
  }
  console.log('');
  
  console.log('🔧 PRISMA CONFIGURATION:');
  try {
    const { PrismaClient } = require('@prisma/client');
    console.log('- Prisma Client available:', true);
    console.log('- Prisma version:', require('@prisma/client/package.json').version);
  } catch (error) {
    console.log('- Prisma Client error:', error.message);
  }
  console.log('');
  
  console.log('📦 PACKAGE INFORMATION:');
  try {
    const packageJson = require('../package.json');
    console.log('- App name:', packageJson.name);
    console.log('- App version:', packageJson.version);
    console.log('- Node version:', process.version);
  } catch (error) {
    console.log('- Package info error:', error.message);
  }
  console.log('');
  
  console.log('💾 MEMORY & SYSTEM:');
  const memUsage = process.memoryUsage();
  console.log('- RSS:', Math.round(memUsage.rss / 1024 / 1024) + 'MB');
  console.log('- Heap Used:', Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB');
  console.log('- Platform:', process.platform);
  console.log('- Architecture:', process.arch);
  console.log('');
}

async function testDatabaseConnection() {
  console.log('🔌 DATABASE CONNECTION TEST:');
  
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not found - cannot test connection');
    return false;
  }
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient({
      log: ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    
    console.log('⏳ Attempting database connection...');
    
    // Test connection with timeout
    const connectionPromise = prisma.$connect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000);
    });
    
    await Promise.race([connectionPromise, timeoutPromise]);
    console.log('✅ Database connection successful');
    
    // Test simple query
    console.log('⏳ Testing database query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query successful:', result);
    
    await prisma.$disconnect();
    console.log('✅ Database disconnection successful');
    return true;
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    if (error.code) console.log('  Error code:', error.code);
    if (error.meta) console.log('  Error meta:', error.meta);
    return false;
  }
}

async function main() {
  logEnvInfo();
  
  const dbConnected = await testDatabaseConnection();
  
  console.log('');
  console.log('📊 DIAGNOSTIC SUMMARY:');
  console.log('- Environment valid:', !!(process.env.NODE_ENV && process.env.DATABASE_URL));
  console.log('- Database connected:', dbConnected);
  console.log('- Railway detected:', !!(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_NAME));
  console.log('');
  
  if (!process.env.DATABASE_URL) {
    console.log('🚨 CRITICAL: DATABASE_URL not set in Railway environment variables');
    console.log('   Go to Railway dashboard → Project → Variables → Add DATABASE_URL');
  }
  
  console.log('🔚 Diagnostics complete');
}

main().catch(error => {
  console.error('💥 Diagnostic script failed:', error);
  process.exit(1);
});