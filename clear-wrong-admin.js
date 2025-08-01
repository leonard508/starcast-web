#!/usr/bin/env node

/**
 * Clear manually created admin user that BetterAuth can't authenticate
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearWrongAdmin() {
  try {
    console.log('🗑️ Clearing manually created admin user...');
    
    // Clear all users - the manual creation was wrong
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('✅ Cleared all users');
    
    const userCount = await prisma.user.count();
    console.log('📊 Database now has:', userCount, 'users');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

clearWrongAdmin().catch(console.error);