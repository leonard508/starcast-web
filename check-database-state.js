#!/usr/bin/env node

/**
 * Check what's actually in the database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseState() {
  try {
    console.log('🔍 Checking database state...');
    
    const users = await prisma.user.findMany({
      include: { accounts: true }
    });
    
    console.log('👥 Users in database:', users.length);
    
    users.forEach((user, index) => {
      console.log(`\n[${index + 1}] User:`);
      console.log('   ID:', user.id);
      console.log('   Email:', user.email);
      console.log('   Role:', user.role);
      console.log('   Active:', user.active);
      console.log('   Email Verified:', user.emailVerified);
      console.log('   Accounts:', user.accounts.length);
      
      user.accounts.forEach((account, i) => {
        console.log(`   Account [${i + 1}]:`);
        console.log('      Provider:', account.providerId);
        console.log('      Account ID:', account.accountId);
        console.log('      Has Password:', !!account.password);
      });
    });
    
    const sessions = await prisma.session.count();
    console.log('\n📊 Sessions:', sessions);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseState().catch(console.error);