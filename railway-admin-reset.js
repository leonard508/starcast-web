#!/usr/bin/env node

/**
 * RAILWAY PRODUCTION ADMIN RESET 
 * This script will:
 * 1. Connect to Railway production database
 * 2. Clear all existing users
 * 3. Create fresh admin account
 */

import { PrismaClient } from '@prisma/client';

// Use Railway production database URL
const RAILWAY_DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:VxqKeoIHzxWJITYMzPOQRRAKMHtORehK@localhost:5432/railway";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: RAILWAY_DATABASE_URL
    }
  }
});

async function railwayAdminReset() {
  try {
    console.log('🚀 RAILWAY ADMIN RESET');
    console.log('💾 Database URL:', RAILWAY_DATABASE_URL.substring(0, 50) + '...');
    console.log('');
    
    console.log('🗑️ Step 1: Clearing ALL existing users...');
    
    // Clear all users and related data in correct order
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('✅ All users cleared from database');
    console.log('');
    
    console.log('🔧 Step 2: Creating admin user directly...');
    
    const adminEmail = 'admin@starcast.co.za';
    
    // Create admin directly in database (bypass BetterAuth for now)
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
    
    console.log('✅ Admin user created directly in database');
    console.log('   User ID:', adminUser.id);
    console.log('   Email:', adminUser.email);
    console.log('   Role:', adminUser.role);
    console.log('');
    
    console.log('🔐 Step 3: Creating BetterAuth account...');
    
    // Create account record for BetterAuth email/password
    const account = await prisma.account.create({
      data: {
        userId: adminUser.id,
        accountId: adminUser.email,
        providerId: 'credential',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // This is "password" hashed
      }
    });
    
    console.log('✅ BetterAuth account created');
    console.log('   Account ID:', account.id);
    console.log('');
    
    console.log('🎉 RAILWAY ADMIN RESET COMPLETE!');
    console.log('');
    console.log('🔑 ADMIN LOGIN CREDENTIALS:');
    console.log('   🌐 URL: https://starcast-web-production.up.railway.app/admin');
    console.log('   📧 Email: admin@starcast.co.za');
    console.log('   🔐 Password: password');
    console.log('');
    console.log('⚠️  CRITICAL: Change this password immediately after login!');
    console.log('');
    
    // Test database connection
    const userCount = await prisma.user.count();
    console.log('📊 Database Status:');
    console.log('   Total Users:', userCount);
    console.log('   Admin Users:', await prisma.user.count({ where: { role: 'ADMIN' } }));
    console.log('');
    
  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
railwayAdminReset().catch(console.error);