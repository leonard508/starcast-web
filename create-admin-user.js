#!/usr/bin/env node

/**
 * Create Admin User Script for Railway Production
 * 
 * This script will:
 * 1. Delete all existing users from the database
 * 2. Create a new admin user with specified credentials
 * 3. Ensure proper admin role and permissions
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🚀 Starting admin user creation process...');
    
    // Step 1: Delete all existing users
    console.log('🗑️  Deleting all existing users...');
    
    // Delete in correct order due to foreign key constraints
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.application.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('✅ All existing users deleted successfully');
    
    // Step 2: Create new admin user
    console.log('👤 Creating new admin user...');
    
    const email = 'starcast.tech@gmail.com';
    const password = 'M@ndal0r1&n';
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create the admin user
    const adminUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: 'Starcast Admin',
        role: 'ADMIN',
        emailVerified: true,
        active: true,
        mustChangePassword: false, // Set to false so admin can login immediately
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔐 Password: M@ndal0r1&n');
    console.log('👑 Role: ADMIN');
    console.log('🆔 User ID:', adminUser.id);
    
    // Step 3: Verify the user was created correctly
    const verifyUser = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        active: true,
        mustChangePassword: true
      }
    });
    
    console.log('🔍 User verification:', verifyUser);
    
    // Step 4: Provide admin dashboard access instructions
    console.log('\n🎯 ADMIN DASHBOARD ACCESS:');
    console.log('🌐 URL: https://starcast-web-production.up.railway.app/admin');
    console.log('📧 Email: starcast.tech@gmail.com');
    console.log('🔑 Password: M@ndal0r1&n');
    console.log('\n📋 INSTRUCTIONS:');
    console.log('1. Go to: https://starcast-web-production.up.railway.app/login');
    console.log('2. Enter the email and password above');
    console.log('3. After login, navigate to /admin for the dashboard');
    console.log('4. You should have full admin access');
    
    console.log('\n✅ Admin user setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    console.error('Error details:', error.message);
    
    if (error.code === 'P2002') {
      console.log('ℹ️  User might already exist. Trying to update instead...');
      
      try {
        const email = 'starcast.tech@gmail.com';
        const password = 'M@ndal0r1&n';
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const updatedUser = await prisma.user.update({
          where: { email: email },
          data: {
            password: hashedPassword,
            role: 'ADMIN',
            emailVerified: true,
            active: true,
            mustChangePassword: false,
            updatedAt: new Date()
          }
        });
        
        console.log('✅ Admin user updated successfully!');
        console.log('📧 Email:', email);
        console.log('🔐 Password: M@ndal0r1&n');
        console.log('👑 Role: ADMIN');
        
      } catch (updateError) {
        console.error('❌ Error updating user:', updateError);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the script
createAdminUser();