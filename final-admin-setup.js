#!/usr/bin/env node

/**
 * FINAL ADMIN SETUP FOR PRODUCTION
 * Creates admin user using BetterAuth compatible format
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function finalAdminSetup() {
  try {
    console.log('🔧 FINAL ADMIN SETUP FOR PRODUCTION');
    console.log('');
    
    const adminEmail = 'admin@starcast.co.za';
    const adminPassword = 'StarcastAdmin2024!';
    
    // Step 1: Clear all existing users
    console.log('🗑️ Step 1: Clearing existing users...');
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Users cleared');
    
    // Step 2: Create admin user
    console.log('🔧 Step 2: Creating admin user...');
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Starcast Admin',
        firstName: 'Starcast',
        lastName: 'Admin',
        role: 'ADMIN',
        emailVerified: true,
        active: true,
        mustChangePassword: false
      }
    });
    console.log('✅ Admin user created:', adminUser.id);
    
    // Step 3: Create BetterAuth account with proper password hash
    console.log('🔐 Step 3: Creating BetterAuth account...');
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    
    const account = await prisma.account.create({
      data: {
        userId: adminUser.id,
        accountId: adminUser.email,
        providerId: 'credential',
        password: passwordHash
      }
    });
    console.log('✅ BetterAuth account created:', account.id);
    
    // Step 4: Verify setup
    console.log('🧪 Step 4: Verifying setup...');
    const userCount = await prisma.user.count();
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    const accountCount = await prisma.account.count();
    
    console.log('📊 Database Status:');
    console.log('   Total Users:', userCount);
    console.log('   Admin Users:', adminCount);
    console.log('   Accounts:', accountCount);
    
    if (adminCount === 1 && accountCount === 1) {
      console.log('');
      console.log('🎉 SETUP COMPLETE!');
      console.log('');
      console.log('🔑 ADMIN LOGIN CREDENTIALS:');
      console.log('   🌐 URL: https://starcast-web-production.up.railway.app/admin');
      console.log('   📧 Email: admin@starcast.co.za');
      console.log('   🔐 Password: StarcastAdmin2024!');
      console.log('');
      console.log('⚠️  SECURITY: Change password after first login!');
      console.log('');
      console.log('🧪 TEST LOGIN:');
      console.log('   1. Go to: https://starcast-web-production.up.railway.app/login');
      console.log('   2. Enter credentials above');
      console.log('   3. Should redirect to /admin dashboard');
      console.log('');
    } else {
      console.log('❌ Setup verification failed');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

finalAdminSetup().catch(console.error);