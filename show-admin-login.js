#!/usr/bin/env node

/**
 * Admin Login Information Script
 * Shows current admin credentials and allows password reset
 */

import { execSync } from 'child_process';

console.log('🔐 Starcast Admin Login Information');
console.log('==================================');

try {
  // Check if admin user exists
  const userCheck = execSync(`echo "SELECT email, role, \\"emailVerified\\" FROM users WHERE role = 'ADMIN';" | docker exec -i starcast-postgres psql -U postgres -d railway`, { encoding: 'utf8' });
  
  if (userCheck.includes('admin@starcast.co.za')) {
    console.log('✅ Admin user found in database');
    console.log('');
    console.log('📧 Admin Login Details:');
    console.log('   Email: admin@starcast.co.za');
    console.log('   Password: [Encrypted in database]');
    console.log('');
    console.log('🌐 Login URL: http://localhost:3001/login');
    console.log('🎯 Admin Dashboard: http://localhost:3001/admin');
    console.log('');
    
    // Check if there's a known test password
    console.log('💡 If you don\'t know the password, here are your options:');
    console.log('');
    console.log('1️⃣ Check CLAUDE.md or project documentation for password');
    console.log('2️⃣ Use the admin setup endpoint: http://localhost:3001/admin/setup');
    console.log('3️⃣ Reset password using the script below');
    console.log('');
    console.log('🔄 To reset admin password, run:');
    console.log('   node reset-admin-password.js');
    
  } else {
    console.log('❌ No admin user found');
    console.log('');
    console.log('🛠️  To create admin user:');
    console.log('   1. Visit: http://localhost:3001/admin/setup');
    console.log('   2. Use setup key from .env file');
    console.log('   3. Create admin account');
  }
  
} catch (error) {
  console.error('❌ Error checking admin user:', error.message);
  console.log('');
  console.log('💡 Make sure PostgreSQL container is running:');
  console.log('   docker-compose up -d postgres');
}

console.log('');
console.log('🏷️ Once logged in, you can access the promotional badge system!');
console.log('   ✨ Individual package badge editing');
console.log('   🎯 Bulk badge management');
console.log('   🌈 8 color options with expiry dates');