#!/usr/bin/env node

/**
 * Check Admin Account
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@starcast.co.za' },
      include: {
        accounts: true
      }
    });

    if (adminUser) {
      console.log('✅ Found admin user:');
      console.log('📧 Email:', adminUser.email);
      console.log('👤 Name:', adminUser.firstName, adminUser.lastName);
      console.log('🎭 Role:', adminUser.role);
      console.log('✅ Active:', adminUser.active);
      console.log('📧 Email Verified:', adminUser.emailVerified);
      console.log('🔑 Accounts:', adminUser.accounts.length);
      
      adminUser.accounts.forEach((account, i) => {
        console.log(`  Account ${i + 1}:`);
        console.log(`    Provider: ${account.providerId}`);
        console.log(`    Account ID: ${account.accountId}`);
        console.log(`    Has Password: ${!!account.password}`);
      });
    } else {
      console.log('❌ No admin user found');
    }

    // Also check test user
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@starcast.co.za' },
      include: {
        accounts: true
      }
    });

    if (testUser) {
      console.log('\n✅ Found test user:');
      console.log('📧 Email:', testUser.email);
      console.log('👤 Name:', testUser.firstName, testUser.lastName);
      console.log('🎭 Role:', testUser.role);
      console.log('✅ Active:', testUser.active);
      console.log('📧 Email Verified:', testUser.emailVerified);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();