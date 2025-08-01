#!/usr/bin/env node

/**
 * Test BetterAuth Registration
 * Try to register a user to see how BetterAuth creates accounts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testBetterAuth() {
  try {
    console.log('🧪 Testing BetterAuth...');
    
    // Check current accounts table structure
    const accounts = await prisma.account.findMany({
      include: {
        user: true
      }
    });
    
    console.log('📋 Current accounts:');
    accounts.forEach(account => {
      console.log(`  - User: ${account.user.email}`);
      console.log(`  - Provider ID: ${account.providerId}`);
      console.log(`  - Account ID: ${account.accountId}`);
      console.log(`  - Has Password: ${!!account.password}`);
      console.log('');
    });

    // Let's try to use BetterAuth to create a user properly
    console.log('🔧 Testing password creation...');
    
    const crypto = await import('crypto');
    const testPassword = 'password123';
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(testPassword, salt, 1000, 64, 'sha256').toString('hex');
    const betterAuthPassword = `${salt}:${hash}`;
    
    console.log('🔐 Password format:', betterAuthPassword.substring(0, 20) + '...');
    
    // Test password verification
    const [testSalt, testHash] = betterAuthPassword.split(':');
    const verifyHash = crypto.pbkdf2Sync(testPassword, testSalt, 1000, 64, 'sha256').toString('hex');
    console.log('✅ Password verification:', verifyHash === testHash);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBetterAuth();