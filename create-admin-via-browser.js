#!/usr/bin/env node

/**
 * Create admin by mimicking the browser registration process
 * This uses the same method as the register page
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdminViaBrowser() {
  try {
    console.log('🔧 Creating admin via browser registration method');
    
    const PRODUCTION_URL = 'https://starcast-web-production.up.railway.app';
    const adminEmail = 'admin@starcast.co.za';
    const adminPassword = 'Admin123!';
    
    console.log('🎯 Target URL:', PRODUCTION_URL);
    console.log('📧 Admin Email:', adminEmail);
    console.log('');
    
    // Step 1: First clear any existing users to start fresh
    console.log('Step 1: Clearing database...');
    
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('✅ Database cleared');
    
    // Step 2: Make the signup request directly to BetterAuth endpoint
    console.log('Step 2: Creating user via direct BetterAuth API...');
    
    // Try different BetterAuth API paths
    const possiblePaths = [
      '/api/auth/sign-up',
      '/api/auth/signup',
      '/api/auth/register',
      '/api/auth/sign-up/email'
    ];
    
    let signupSuccess = false;
    let createdUserId = null;
    
    for (const path of possiblePaths) {
      try {
        console.log(`Trying: ${path}`);
        
        const response = await fetch(`${PRODUCTION_URL}${path}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          body: JSON.stringify({
            email: adminEmail,
            password: adminPassword,
            name: 'Starcast Admin',
          }),
        });
        
        console.log(`Response status: ${response.status}`);
        
        if (response.status === 200 || response.status === 201) {
          const result = await response.json();
          console.log('✅ Signup successful!');
          console.log('Result:', result);
          
          if (result.user && result.user.id) {
            createdUserId = result.user.id;
            signupSuccess = true;
            break;
          }
        }
        
      } catch (error) {
        console.log(`Failed: ${error.message}`);
      }
    }
    
    if (!signupSuccess) {
      console.log('❌ All signup paths failed');
      console.log('');
      console.log('🔧 Alternative: Manual admin creation...');
      
      // Alternative: Create user directly but with proper BetterAuth structure
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
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
      
      console.log('✅ User created:', adminUser.id);
      
      // Create proper BetterAuth account
      await prisma.account.create({
        data: {
          userId: adminUser.id,
          accountId: adminUser.email,
          providerId: 'credential',
          password: hashedPassword
        }
      });
      
      console.log('✅ BetterAuth account created');
      
      createdUserId = adminUser.id;
      signupSuccess = true;
    }
    
    if (signupSuccess && createdUserId) {
      // Step 3: Update user to admin role
      console.log('Step 3: Setting admin role...');
      
      await prisma.user.update({
        where: { id: createdUserId },
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
      
      // Step 4: Test the account exists properly
      console.log('Step 4: Verifying account...');
      
      const finalUser = await prisma.user.findUnique({
        where: { email: adminEmail },
        include: { accounts: true }
      });
      
      if (finalUser && finalUser.accounts.length > 0) {
        console.log('');
        console.log('🎉 ADMIN ACCOUNT CREATED SUCCESSFULLY!');
        console.log('');
        console.log('🔑 LOGIN CREDENTIALS:');
        console.log('   🌐 URL: ' + PRODUCTION_URL + '/login');
        console.log('   📧 Email: ' + adminEmail);
        console.log('   🔐 Password: ' + adminPassword);
        console.log('');
        console.log('📊 Account Details:');
        console.log('   User ID:', finalUser.id);
        console.log('   Role:', finalUser.role);
        console.log('   Email Verified:', finalUser.emailVerified);
        console.log('   Accounts:', finalUser.accounts.length);
        console.log('');
        console.log('✅ Ready to test login!');
        
      } else {
        console.log('❌ Account verification failed');
      }
    }
    
  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminViaBrowser().catch(console.error);