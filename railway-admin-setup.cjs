#!/usr/bin/env node

// Railway Admin Setup Script
// Run with: railway run node railway-admin-setup.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

console.log('🚀 Railway Admin Setup Starting...');
console.log('📋 Target: starcast.tech@gmail.com / M@ndal0r1&n');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    console.log('🔌 Connecting to Railway database...');
    await prisma.$connect();
    console.log('✅ Connected to Railway database');

    // Check current admin status
    console.log('🔍 Checking for existing admin users...');
    const existingAdmins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, name: true, role: true }
    });

    if (existingAdmins.length > 0) {
      console.log('⚠️  Existing admin users found:');
      existingAdmins.forEach(admin => {
        console.log(`   - ${admin.email} (${admin.name})`);
      });
      console.log('🗑️  Clearing existing users...');
    }

    // Clear all existing data
    console.log('🧹 Clearing database...');
    await prisma.session.deleteMany({});
    console.log('  ✅ Sessions cleared');
    
    await prisma.account.deleteMany({});
    console.log('  ✅ Accounts cleared');
    
    await prisma.application.deleteMany({});
    console.log('  ✅ Applications cleared');
    
    await prisma.user.deleteMany({});
    console.log('  ✅ Users cleared');

    // Create new admin user
    console.log('👤 Creating new admin user...');
    const hashedPassword = await bcrypt.hash('M@ndal0r1&n', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'starcast.tech@gmail.com',
        password: hashedPassword,
        name: 'Starcast Admin',
        role: 'ADMIN',
        emailVerified: true,
        active: true,
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('🎉 SUCCESS! Admin user created:');
    console.log('📧 Email: starcast.tech@gmail.com');
    console.log('🔑 Password: M@ndal0r1&n');
    console.log('👑 Role: ADMIN');
    console.log(`🆔 ID: ${adminUser.id}`);
    
    console.log('\n🌐 ACCESS URLs:');
    console.log('🔐 Login: https://starcast-web-production.up.railway.app/login');
    console.log('📊 Admin Dashboard: https://starcast-web-production.up.railway.app/admin');
    
    console.log('\n✅ Setup completed successfully!');
    
    // Verify the user was created
    const verifyUser = await prisma.user.findUnique({
      where: { email: 'starcast.tech@gmail.com' },
      select: { id: true, email: true, name: true, role: true, active: true, emailVerified: true }
    });
    
    if (verifyUser) {
      console.log('✅ Verification: User exists in database');
      console.log(`   Email: ${verifyUser.email}`);
      console.log(`   Role: ${verifyUser.role}`);
      console.log(`   Active: ${verifyUser.active}`);
      console.log(`   Email Verified: ${verifyUser.emailVerified}`);
    } else {
      console.log('❌ Verification failed: User not found');
    }

  } catch (error) {
    console.error('💥 Error during setup:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  }
}

// Run the setup
setupAdmin()
  .then(() => {
    console.log('\n🎯 READY TO USE:');
    console.log('1. Go to: https://starcast-web-production.up.railway.app/login');
    console.log('2. Email: starcast.tech@gmail.com');
    console.log('3. Password: M@ndal0r1&n');
    console.log('4. Access admin dashboard for business management');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Setup failed:', error.message);
    process.exit(1);
  });