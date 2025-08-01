#!/usr/bin/env node

/**
 * Create Simple Admin User
 * Creates a backup admin user with simple credentials
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSimpleAdmin() {
  try {
    console.log('👤 Creating backup admin user...');
    
    const email = 'test@starcast.co.za';
    const password = 'password123';
    
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create user
      user = await prisma.user.create({
        data: {
          email,
          firstName: 'Test',
          lastName: 'Admin',
          role: 'ADMIN',
          emailVerified: true,
          active: true
        }
      });
      console.log('✅ Backup admin user created');
    } else {
      // Update existing user to admin
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: 'ADMIN',
          emailVerified: true,
          active: true
        }
      });
      console.log('✅ Existing user updated to admin');
    }

    // Create password using crypto
    const crypto = await import('crypto');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
    const betterAuthPassword = `${salt}:${hash}`;

    // Check if account exists
    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: 'credential'
      }
    });

    if (existingAccount) {
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: { password: betterAuthPassword }
      });
    } else {
      await prisma.account.create({
        data: {
          userId: user.id,
          accountId: user.id,
          providerId: 'credential',
          password: betterAuthPassword
        }
      });
    }

    console.log('');
    console.log('🎉 Backup admin created!');
    console.log('');
    console.log('🔑 BACKUP LOGIN CREDENTIALS:');
    console.log('   📧 Email: test@starcast.co.za');
    console.log('   🔐 Password: password123');
    console.log('');
    console.log('💡 You now have TWO admin accounts to try!');
    
  } catch (error) {
    console.error('❌ Error creating backup admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSimpleAdmin();