import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearUsersAndSetupAdmin() {
  try {
    console.log('🔄 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connected');
    
    console.log('🗑️  Clearing all existing users...');
    
    // Delete in correct order due to foreign key constraints
    await prisma.session.deleteMany({});
    console.log('  ✅ Sessions cleared');
    
    await prisma.account.deleteMany({});
    console.log('  ✅ Accounts cleared');
    
    await prisma.application.deleteMany({});
    console.log('  ✅ Applications cleared');
    
    await prisma.user.deleteMany({});
    console.log('  ✅ Users cleared');
    
    console.log('🧹 Database cleaned successfully');
    
    // Now call the admin setup API
    console.log('🔄 Creating admin user via API...');
    
    const setupUrl = 'https://starcast-web-production.up.railway.app/api/admin/setup';
    const setupData = {
      email: 'starcast.tech@gmail.com',
      password: 'M@ndal0r1&n',
      name: 'Starcast Admin',
      setupKey: 'STARCAST_ADMIN_SETUP_2025_SECURE'
    };
    
    const response = await fetch(setupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(setupData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Admin user created successfully via API!');
      console.log('📋 Admin Details:', result.admin);
      
      console.log('\n🎯 ADMIN DASHBOARD ACCESS:');
      console.log('🌐 Dashboard URL: https://starcast-web-production.up.railway.app/admin');
      console.log('🔐 Login URL: https://starcast-web-production.up.railway.app/login');
      console.log('📧 Email: starcast.tech@gmail.com');
      console.log('🔑 Password: M@ndal0r1&n');
      
    } else {
      console.error('❌ API Error:', result);
      throw new Error(`API call failed: ${result.error}`);
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

clearUsersAndSetupAdmin()
  .then(() => {
    console.log('🎉 Setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });