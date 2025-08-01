#!/usr/bin/env node

/**
 * Database Migration Script for Railway
 * This script applies Prisma schema changes to the Railway database
 */

import { execSync } from 'child_process';

console.log('🚀 Starting database migration to Railway...');

// Use Railway environment with Prisma
try {
  console.log('📋 Applying Prisma schema changes...');
  
  // Run Prisma db push through Railway environment
  execSync('railway run npx prisma db push', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Database migration completed successfully!');
  console.log('🏷️ Promotional badge fields have been added to the Package model');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.log('\n💡 Alternative: Try running this command manually:');
  console.log('   railway run npx prisma db push');
  process.exit(1);
}

console.log('\n🎉 Your promotional badge system is now ready!');
console.log('📝 New fields added to Package model:');
console.log('   - promoBadge (text)');
console.log('   - promoBadgeColor (color)');
console.log('   - promoBadgeExpiryDate (datetime)');
console.log('   - promoBadgeTimer (boolean)');