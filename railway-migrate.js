#!/usr/bin/env node

/**
 * Railway Migration Script
 * 
 * This script ensures the database is properly migrated and seeded when deployed to Railway.
 * It handles the differences between local development (SQLite) and production (PostgreSQL).
 */

const { execSync } = require('child_process');

function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Starting Railway database migration...');
  
  // Check if we're in Railway environment
  const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_NAME;
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isRailway || isProduction) {
    console.log('🚂 Railway environment detected');
    
    // Generate Prisma client for PostgreSQL
    runCommand('npx prisma generate', 'Generating Prisma client');
    
    // Deploy database schema (creates tables if they don't exist)
    runCommand('npx prisma db push', 'Deploying database schema');
    
    // Seed the database with packages
    runCommand('npx prisma db seed', 'Seeding database with packages');
    
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