// Emergency Admin Creation - Run this to get immediate access
// Instructions: Copy this script and run it directly on Railway

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

console.log('🚨 EMERGENCY ADMIN SETUP STARTING...');
console.log('📋 This will create: starcast.tech@gmail.com / M@ndal0r1&n');

const prisma = new PrismaClient();

async function emergencyAdmin() {
  try {
    // Clear existing users
    console.log('🗑️ Clearing existing users...');
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.application.deleteMany({});
    await prisma.user.deleteMany({});
    
    // Create your admin
    console.log('👤 Creating your admin user...');
    const hashedPassword = await bcrypt.hash('M@ndal0r1&n', 12);
    
    const admin = await prisma.user.create({
      data: {
        email: 'starcast.tech@gmail.com',
        password: hashedPassword,
        name: 'Starcast Admin',
        role: 'ADMIN',
        emailVerified: true,
        active: true,
        mustChangePassword: false
      }
    });
    
    console.log('✅ SUCCESS! Admin created:');
    console.log('📧 Email: starcast.tech@gmail.com');
    console.log('🔑 Password: M@ndal0r1&n');
    console.log('🌐 Login: https://starcast-web-production.up.railway.app/login');
    console.log('👑 Admin Dashboard: https://starcast-web-production.up.railway.app/admin');
    
    return admin;
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

emergencyAdmin();