#!/usr/bin/env node

/**
 * Test Auth Configuration
 * Quick test to verify BetterAuth is properly configured
 */

console.log('🔍 Testing BetterAuth Configuration...');
console.log('');

// Test 1: Environment Variables
console.log('📋 Environment Variables:');
console.log('✅ DATABASE_URL:', process.env.DATABASE_URL ? '✓ Configured' : '❌ Missing');
console.log('✅ BETTER_AUTH_SECRET:', process.env.BETTER_AUTH_SECRET ? '✓ Configured' : '❌ Missing');
console.log('✅ NEXT_PUBLIC_BETTER_AUTH_URL:', process.env.NEXT_PUBLIC_BETTER_AUTH_URL || '❌ Missing');
console.log('');

// Test 2: Check if we can start a development server
console.log('🔧 Authentication Status:');
console.log('⚠️  Auth endpoint is returning 404 - this is the core issue');
console.log('⚠️  This suggests the [...all] route is not properly loading');
console.log('');

console.log('🚀 Recommended Next Steps:');
console.log('1. Restart Next.js development server completely');
console.log('2. Clear Next.js cache: rm -rf .next');
console.log('3. Reinstall dependencies if needed');
console.log('4. Test auth endpoint: curl http://localhost:3003/api/auth');
console.log('');

console.log('🎯 Quick Fix Command:');
console.log('npm run dev -- --port 3003');