#!/usr/bin/env node

/**
 * Fix Test Account
 * Create/fix test@starcast.co.za with BetterAuth
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixTestAccount() {
  try {
    console.log('🔧 Fixing test@starcast.co.za account...');
    
    const email = 'test@starcast.co.za';
    const password = 'password123';
    
    // Remove existing test user and accounts
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true }
    });
    
    if (existingUser) {
      console.log('🗑️ Removing existing test user...');
      
      // Delete accounts first
      await prisma.account.deleteMany({
        where: { userId: existingUser.id }
      });
      
      // Delete user
      await prisma.user.delete({
        where: { id: existingUser.id }
      });
      
      console.log('✅ Existing test user removed');
    }
    
    console.log('🔧 Creating fresh test account with BetterAuth...');
    
    // Create via BetterAuth API
    const signupResponse = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name: 'Test Admin',
      }),
    });
    
    const signupResult = await signupResponse.json();
    
    if (signupResponse.ok && signupResult.user) {
      console.log('✅ Test user created via BetterAuth');
      
      // Update to admin role
      await prisma.user.update({
        where: { id: signupResult.user.id },
        data: {
          role: 'ADMIN',
          firstName: 'Test',
          lastName: 'Admin',
          emailVerified: true,
          active: true
        }
      });
      
      console.log('✅ Updated to admin role');
      console.log('');
      console.log('🎉 Test account fixed!');
      console.log('');
      console.log('🔑 LOGIN CREDENTIALS:');
      console.log('   📧 Email: test@starcast.co.za');
      console.log('   🔐 Password: password123');
      console.log('');
      
      // Test the login
      console.log('🧪 Testing login...');
      const testResponse = await fetch('http://localhost:3000/api/auth/sign-in/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      const testResult = await testResponse.json();
      if (testResponse.ok) {
        console.log('✅ Login test successful!');
        console.log('🎯 You can now use either account:');
        console.log('   • admin@starcast.co.za / admin123!');
        console.log('   • test@starcast.co.za / password123');
      } else {
        console.log('❌ Login test failed:', testResult);
      }
      
    } else {
      console.log('❌ Signup failed:', signupResult);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTestAccount();