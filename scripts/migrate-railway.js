#!/usr/bin/env node

/**
 * Simple Railway Migration Script
 * Creates database schema and seeds data
 */

import { execSync } from 'child_process';

console.log('🚀 Starting Railway migration...');

try {
  // Generate Prisma client
  console.log('📋 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');

  // Push schema to database
  console.log('📋 Pushing database schema...');
  execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
  console.log('✅ Database schema created');

  // Seed the database
  console.log('📋 Seeding database...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  console.log('✅ Database seeded');

  console.log('🎉 Migration completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
} 