#!/usr/bin/env node

/**
 * Create admin user through BetterAuth signup API (THE CORRECT WAY)
 * This will create the user properly so BetterAuth can authenticate them
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createBetterAuthAdmin() {
  try {
    console.log('🔧 Creating admin through BetterAuth API (correct method)');
    
    const PRODUCTION_URL = 'https://starcast-web-production.up.railway.app';
    const adminEmail = 'admin@starcast.co.za';
    const adminPassword = 'Admin123!';
    
    console.log('🎯 Target URL:', PRODUCTION_URL);
    console.log('📧 Admin Email:', adminEmail);
    console.log('');
    
    // Step 1: Create user through BetterAuth signup API
    console.log('Step 1: Creating user through BetterAuth signup API...');
    
    const signupResponse = await fetch(`${PRODUCTION_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
        name: 'Starcast Admin',
      }),
    });
    
    let signupResult;
    try {
      signupResult = await signupResponse.json();
    } catch (e) {
      console.log('❌ Failed to parse signup response');
      console.log('Response status:', signupResponse.status);
      const responseText = await signupResponse.text();
      console.log('Response text:', responseText.substring(0, 500));
      return;
    }
    
    if (signupResponse.ok && signupResult.user) {
      console.log('✅ User created through BetterAuth!');
      console.log('User ID:', signupResult.user.id);
      
      // Step 2: Update user to admin role in database
      console.log('Step 2: Updating user to admin role...');
      
      const updatedUser = await prisma.user.update({
        where: { id: signupResult.user.id },
        data: {
          role: 'ADMIN',
          firstName: 'Starcast',
          lastName: 'Admin',
          emailVerified: true,
          active: true,
          mustChangePassword: false
        }
      });
      
      console.log('✅ User updated to admin role');
      
      // Step 3: Test login immediately
      console.log('Step 3: Testing login...');
      
      const loginResponse = await fetch(`${PRODUCTION_URL}/api/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      });
      
      const loginResult = await loginResponse.json();
      
      if (loginResponse.ok && !loginResult.error) {
        console.log('✅ LOGIN TEST SUCCESSFUL!');
        console.log('');
        console.log('🎉 BETTERAUTH ADMIN SETUP COMPLETE!');
        console.log('');
        console.log('🔑 ADMIN LOGIN CREDENTIALS:');
        console.log('   🌐 URL: ' + PRODUCTION_URL + '/login');
        console.log('   📧 Email: ' + adminEmail);
        console.log('   🔐 Password: ' + adminPassword);
        console.log('');
        console.log('✅ Authentication is now working correctly!');
        
      } else {
        console.log('❌ Login test failed:', loginResult);
      }
      
      // Verify database state
      const finalCheck = await prisma.user.findUnique({
        where: { email: adminEmail },
        include: { accounts: true }
      });
      
      console.log('');
      console.log('📊 Final Database State:');
      console.log('   User ID:', finalCheck?.id);
      console.log('   Email:', finalCheck?.email);
      console.log('   Role:', finalCheck?.role);
      console.log('   Accounts:', finalCheck?.accounts?.length || 0);
      console.log('   Email Verified:', finalCheck?.emailVerified);
      
    } else {
      console.log('❌ BetterAuth signup failed');
      console.log('Response status:', signupResponse.status);
      console.log('Response:', signupResult);
      
      // Check if user already exists
      if (signupResult.error && signupResult.error.includes('already exists')) {
        console.log('');
        console.log('ℹ️  User already exists, trying to find and update...');
        
        const existingUser = await prisma.user.findUnique({
          where: { email: adminEmail }
        });
        
        if (existingUser) {
          console.log('Found existing user:', existingUser.id);
          
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { role: 'ADMIN', active: true, emailVerified: true }
          });
          
          console.log('✅ Updated existing user to admin');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

createBetterAuthAdmin().catch(console.error);