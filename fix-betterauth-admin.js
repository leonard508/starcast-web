#!/usr/bin/env node

/**
 * Fix Admin User for BetterAuth
 * Creates/updates admin user to work with BetterAuth system
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixBetterAuthAdmin() {
  try {
    console.log('🔧 Fixing admin user for BetterAuth...');
    
    const email = 'test@starcast.co.za';
    const password = 'password123';
    
    // Delete existing user and accounts to start fresh
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true }
    });

    if (existingUser) {
      console.log('🗑️ Removing existing user and accounts...');
      await prisma.account.deleteMany({
        where: { userId: existingUser.id }
      });
    }

    // Create or update user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        firstName: 'Test',
        lastName: 'Admin',
        role: 'ADMIN',
        emailVerified: true,
        active: true
      },
      create: {
        email,
        firstName: 'Test',
        lastName: 'Admin',
        role: 'ADMIN',
        emailVerified: true,
        active: true
      }
    });

    console.log('✅ User created/updated:', user.email);

    // Create BetterAuth password hash (64-byte hash like BetterAuth expects)
    const crypto = await import('crypto');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
    const betterAuthPassword = `${salt}:${hash}`;

    // Create BetterAuth account
    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.id, // Use user ID as accountId for BetterAuth
        providerId: 'credential',
        password: betterAuthPassword
      }
    });

    console.log('✅ BetterAuth account created');
    console.log('');
    console.log('🎉 Admin user fixed for BetterAuth!');
    console.log('');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('   📧 Email: test@starcast.co.za');
    console.log('   🔐 Password: password123');
    console.log('');
    console.log('💡 The user now works with BetterAuth authentication!');
    
  } catch (error) {
    console.error('❌ Error fixing admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBetterAuthAdmin();