#!/usr/bin/env node

/**
 * Debug Authentication Issues
 * Tests various auth endpoints and configurations
 */

console.log('🔍 Authentication Debug Information');
console.log('=====================================');
console.log('');

// Check environment variables
console.log('🔧 Environment Configuration:');
console.log(`   BETTER_AUTH_SECRET: ${process.env.BETTER_AUTH_SECRET ? 'SET' : 'NOT SET'}`);
console.log(`   NEXT_PUBLIC_BETTER_AUTH_URL: ${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'NOT SET'}`);
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);
console.log('');

console.log('🌐 URLs to test:');
console.log('   Login page: http://localhost:3001/login');
console.log('   Auth API: http://localhost:3001/api/auth');
console.log('   Admin dashboard: http://localhost:3001/admin');
console.log('');

console.log('🔑 Login Credentials:');
console.log('   Email: admin@starcast.co.za');
console.log('   Password: admin123!');
console.log('');

console.log('🧪 Manual Test Steps:');
console.log('   1. Open http://localhost:3001/login in browser');
console.log('   2. Enter email: admin@starcast.co.za');  
console.log('   3. Enter password: admin123!');
console.log('   4. Click login button');
console.log('   5. Check browser console for errors (F12)');
console.log('   6. Check network tab for failed requests');
console.log('');

console.log('🚨 Common Issues to Check:');
console.log('   ❓ Is the dev server running on port 3001?');
console.log('   ❓ Are there any console errors in browser?');
console.log('   ❓ Does the login form submit properly?');
console.log('   ❓ Are cookies being set?');
console.log('');

console.log('🔄 If login still fails, try:');
console.log('   1. Clear browser cache and cookies');
console.log('   2. Try incognito/private browser window');
console.log('   3. Check browser developer tools for errors');
console.log('   4. Restart the development server');

// Test database connection
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testDbConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection: OK');
    await prisma.$disconnect();
  } catch (error) {
    console.log('❌ Database connection: FAILED');
    console.log(`   Error: ${error.message}`);
  }
}

testDbConnection();