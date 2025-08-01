// Railway Admin Creation Script - ES Module
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

console.log('🚀 Creating admin user on Railway...');
console.log('📧 Email: starcast.tech@gmail.com');
console.log('🔑 Password: M@ndal0r1&n');

async function createAdmin() {
  try {
    console.log('🔌 Connecting to Railway database...');
    
    // Clear existing users
    console.log('🧹 Clearing existing data...');
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.application.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ All data cleared');
    
    // Create admin user
    console.log('👤 Creating admin user...');
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
    
    console.log('🎉 SUCCESS! Admin user created:');
    console.log(`🆔 ID: ${admin.id}`);
    console.log('📧 Email: starcast.tech@gmail.com');
    console.log('🔑 Password: M@ndal0r1&n');
    console.log('👑 Role: ADMIN');
    
    console.log('\n🌐 LOGIN URLs:');
    console.log('🔐 Login: https://starcast-web-production.up.railway.app/login');
    console.log('📊 Admin Dashboard: https://starcast-web-production.up.railway.app/admin');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin()
  .then(() => {
    console.log('\n✅ Setup complete! You can now login to manage your business.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed:', error.message);
    process.exit(1);
  });