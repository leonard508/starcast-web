#!/usr/bin/env node

/**
 * Create Fresh Admin Account
 * Delete existing and create new admin with BetterAuth
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createFreshAdmin() {
  try {
    console.log('🗑️ Removing existing admin accounts...');
    
    const email = 'admin@starcast.co.za';
    
    // Find and delete existing admin user
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true }
    });
    
    if (existingUser) {
      // Delete accounts first
      await prisma.account.deleteMany({
        where: { userId: existingUser.id }
      });
      
      // Delete user
      await prisma.user.delete({
        where: { id: existingUser.id }
      });
      
      console.log('✅ Existing admin removed');
    }
    
    console.log('🔧 Creating fresh admin with BetterAuth...');
    
    // Now create via BetterAuth API
    const signupResponse = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: 'admin123!',
        name: 'Admin User',
      }),
    });
    
    const signupResult = await signupResponse.json();
    
    if (signupResponse.ok && signupResult.user) {
      console.log('✅ User created via BetterAuth');
      
      // Update to admin role
      await prisma.user.update({
        where: { id: signupResult.user.id },
        data: {
          role: 'ADMIN',
          firstName: 'Admin',
          lastName: 'User',
          emailVerified: true,
          active: true
        }
      });
      
      console.log('✅ Updated to admin role');
      console.log('');
      console.log('🎉 Fresh admin account created!');
      console.log('');
      console.log('🔑 LOGIN CREDENTIALS:');
      console.log('   📧 Email: admin@starcast.co.za');
      console.log('   🔐 Password: admin123!');
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
          password: 'admin123!',
        }),
      });
      
      const testResult = await testResponse.json();
      if (testResponse.ok) {
        console.log('✅ Login test successful!');
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

createFreshAdmin();