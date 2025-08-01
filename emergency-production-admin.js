#!/usr/bin/env node

/**
 * EMERGENCY PRODUCTION ADMIN SETUP
 * FOR RAILWAY DEPLOYMENT ONLY
 * 
 * This script will:
 * 1. Clear all existing users (DANGEROUS!)
 * 2. Create a fresh admin account via BetterAuth
 * 3. Test the login works
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Production Railway URL - HARDCODED FOR EMERGENCY USE
const PRODUCTION_URL = 'https://starcast-web-production.up.railway.app';

async function emergencyProductionAdminSetup() {
  try {
    console.log('🚨 EMERGENCY PRODUCTION ADMIN SETUP');
    console.log('⚠️  WARNING: This will DELETE ALL USERS!');
    console.log('');
    
    // Double check we're running against production
    if (!PRODUCTION_URL.includes('railway.app')) {
      console.log('❌ Error: This script is for Railway production only');
      console.log('   Current URL:', PRODUCTION_URL);
      return;
    }
    
    console.log('🎯 Target URL:', PRODUCTION_URL);
    console.log('');
    
    console.log('🗑️ Step 1: Clearing ALL existing users...');
    
    // Clear all users and related data
    await prisma.account.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('✅ All users cleared from database');
    console.log('');
    
    console.log('🔧 Step 2: Creating production admin via BetterAuth...');
    
    const adminEmail = 'admin@starcast.co.za';
    const adminPassword = 'StarcastAdmin2024!';
    
    // Create admin via BetterAuth API
    const signupResponse = await fetch(`${PRODUCTION_URL}/api/auth/sign-up/email`, {
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
      console.log('Response text:', await signupResponse.text());
      return;
    }
    
    if (signupResponse.ok && signupResult.user) {
      console.log('✅ Admin user created via BetterAuth');
      
      // Update to admin role and verify email
      await prisma.user.update({
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
      
      console.log('✅ User updated to ADMIN role');
      console.log('');
      
      console.log('🧪 Step 3: Testing admin login...');
      
      const loginResponse = await fetch(`${PRODUCTION_URL}/api/auth/sign-in/email`, {
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
      
      if (loginResponse.ok) {
        console.log('✅ Admin login test successful!');
        console.log('');
        console.log('🎉 PRODUCTION ADMIN SETUP COMPLETE!');
        console.log('');
        console.log('🔑 ADMIN LOGIN CREDENTIALS:');
        console.log('   🌐 URL: ' + PRODUCTION_URL + '/admin');
        console.log('   📧 Email: admin@starcast.co.za');
        console.log('   🔐 Password: StarcastAdmin2024!');
        console.log('');
        console.log('⚠️  SECURITY: Change this password after first login!');
        console.log('');
        
        // Verify admin role in database
        const adminUser = await prisma.user.findUnique({
          where: { email: adminEmail },
          select: { id: true, email: true, role: true, active: true, emailVerified: true }
        });
        
        console.log('📊 Admin User Verification:');
        console.log('   ID:', adminUser?.id);
        console.log('   Email:', adminUser?.email);
        console.log('   Role:', adminUser?.role);
        console.log('   Active:', adminUser?.active);
        console.log('   Email Verified:', adminUser?.emailVerified);
        
      } else {
        console.log('❌ Admin login test failed:', loginResult);
        console.log('Response status:', loginResponse.status);
      }
      
    } else {
      console.log('❌ Admin user creation failed');
      console.log('Response status:', signupResponse.status);
      console.log('Response:', signupResult);
    }
    
  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
emergencyProductionAdminSetup().catch(console.error);