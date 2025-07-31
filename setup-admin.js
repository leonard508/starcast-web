import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function setupAdmin() {
  try {
    console.log('🔄 Connecting to database...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    const email = 'starcast.tech@gmail.com';
    const password = 'M@ndal0r1&n';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    console.log('🗑️  Cleaning up existing users...');
    
    // Delete in correct order
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.application.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('✅ Existing users cleaned up');
    
    console.log('👤 Creating admin user...');
    
    const adminUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Starcast Admin',
        role: 'ADMIN',
        emailVerified: true,
        active: true,
        mustChangePassword: false
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📋 Details:');
    console.log('  📧 Email:', email);
    console.log('  🔑 Password: M@ndal0r1&n');
    console.log('  👑 Role: ADMIN');
    console.log('  🆔 ID:', adminUser.id);
    
    console.log('\n🌐 Admin Dashboard Access:');
    console.log('  URL: https://starcast-web-production.up.railway.app/admin');
    console.log('  Login URL: https://starcast-web-production.up.railway.app/login');
    
    return adminUser;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin()
  .then(() => {
    console.log('🎉 Admin setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });