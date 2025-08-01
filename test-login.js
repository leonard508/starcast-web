#!/usr/bin/env node

/**
 * Test Login Credentials Script
 * Tests the admin login functionality
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🧪 Testing Admin Login Credentials...');
    console.log('');

    // Check admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@starcast.co.za' },
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

    console.log('✅ Admin user found:');
    console.log(`   📧 Email: ${adminUser.email}`);
    console.log(`   👤 Role: ${adminUser.role}`);
    console.log(`   ✉️  Email Verified: ${adminUser.emailVerified}`);
    console.log(`   🟢 Active: ${adminUser.active}`);
    console.log(`   🔑 Has Password: ${adminUser.accounts.length > 0 ? 'Yes' : 'No'}`);
    console.log('');

    if (adminUser.accounts.length === 0) {
      console.log('❌ No credential account found');
      console.log('💡 Creating credential account...');
      
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123!', 12);
      
      await prisma.account.create({
        data: {
          userId: adminUser.id,
          accountId: adminUser.id,
          providerId: 'credential',
          password: hashedPassword
        }
      });
      
      console.log('✅ Credential account created');
    }

    console.log('🌐 Login Information:');
    console.log('   URL: http://localhost:3001/login');
    console.log('   Email: admin@starcast.co.za');
    console.log('   Password: admin123!');
    console.log('');
    console.log('🎯 After login, visit: http://localhost:3001/admin');
    console.log('');
    
    // Test direct database authentication
    const bcrypt = await import('bcryptjs');
    const account = adminUser.accounts[0];
    if (account && account.password) {
      const isPasswordValid = await bcrypt.compare('admin123!', account.password);
      console.log(`🔐 Password verification: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
      
      if (!isPasswordValid) {
        console.log('🔄 Resetting password...');
        const newHashedPassword = await bcrypt.hash('admin123!', 12);
        await prisma.account.update({
          where: { id: account.id },
          data: { password: newHashedPassword }
        });
        console.log('✅ Password reset completed');
      }
    }

  } catch (error) {
    console.error('❌ Error testing login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();