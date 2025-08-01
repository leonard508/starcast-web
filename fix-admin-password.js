#!/usr/bin/env node

/**
 * Fix Admin Password for BetterAuth
 * Ensures the password is properly formatted for BetterAuth authentication
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAdminPassword() {
  try {
    console.log('🔧 Fixing Admin Password for BetterAuth...');
    console.log('');

    const email = 'admin@starcast.co.za';
    const password = 'admin123!';
    
    // Find admin user
    const adminUser = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { providerId: 'credential' }
        }
      }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user found:', adminUser.email);

    // BetterAuth uses a different password format
    // Let's use the crypto module to create a proper hash
    const crypto = await import('crypto');
    
    // Create salt and hash (BetterAuth format)
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
    const betterAuthPassword = `${salt}:${hash}`;

    console.log('🔐 Creating BetterAuth compatible password...');

    if (adminUser.accounts.length > 0) {
      // Update existing account
      await prisma.account.update({
        where: { id: adminUser.accounts[0].id },
        data: { password: betterAuthPassword }
      });
      console.log('✅ Password updated in existing account');
    } else {
      // Create new credential account
      await prisma.account.create({
        data: {
          userId: adminUser.id,
          accountId: adminUser.id,
          providerId: 'credential',
          password: betterAuthPassword
        }
      });
      console.log('✅ New credential account created');
    }

    // Also ensure user is active and verified
    await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        emailVerified: true,
        active: true,
        role: 'ADMIN'
      }
    });

    console.log('');
    console.log('🎉 Admin password fixed!');
    console.log('');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('   📧 Email: admin@starcast.co.za');
    console.log('   🔐 Password: admin123!');
    console.log('');
    console.log('🌐 Login URL: http://localhost:3002/login');
    console.log('🎯 Admin Dashboard: http://localhost:3002/admin');
    console.log('');
    console.log('💡 Try logging in now!');
    
  } catch (error) {
    console.error('❌ Error fixing password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminPassword();