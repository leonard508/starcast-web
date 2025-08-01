#!/usr/bin/env node

/**
 * Reset Admin Password Script
 * Creates a new admin user or resets existing admin password
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    console.log('🔐 Resetting Admin Password...');
    console.log('');

    const email = 'admin@starcast.co.za';
    const password = 'admin123!'; // Simple password for development
    
    // Find existing admin user
    let adminUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!adminUser) {
      console.log('👤 Creating new admin user...');
      
      // Create admin user
      adminUser = await prisma.user.create({
        data: {
          email,
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          emailVerified: true,
          active: true
        }
      });
    }

    // Check if credential account exists
    let account = await prisma.account.findFirst({
      where: {
        userId: adminUser.id,
        providerId: 'credential'
      }
    });

    // Import betterAuth to handle password properly
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    if (account) {
      // Update existing account
      await prisma.account.update({
        where: { id: account.id },
        data: { password: hashedPassword }
      });
    } else {
      // Create new credential account
      await prisma.account.create({
        data: {
          userId: adminUser.id,
          accountId: adminUser.id,
          providerId: 'credential',
          password: hashedPassword
        }
      });
    }

    console.log('✅ Admin password reset successfully!');
    console.log('');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('   📧 Email: admin@starcast.co.za');
    console.log('   🔐 Password: admin123!');
    console.log('');
    console.log('🌐 Login at: http://localhost:3001/login');
    console.log('🎯 Admin Dashboard: http://localhost:3001/admin');
    console.log('');
    console.log('🏷️ Your promotional badge system is ready!');
    
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    
    if (error.message.includes('bcryptjs')) {
      console.log('');
      console.log('💡 Installing required dependency...');
      console.log('   npm install bcryptjs');
    }
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();