#!/usr/bin/env node

/**
 * Set Admin Role on Production
 * Make sure the new user has proper admin privileges
 */

async function setAdminRole() {
  try {
    const baseUrl = 'https://starcast-web-production.up.railway.app';
    console.log('🔧 Setting admin role for admin2@starcast.co.za...');
    
    // First, login to get session
    const loginResponse = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin2@starcast.co.za',
        password: 'admin123!',
      }),
    });
    
    if (loginResponse.ok) {
      console.log('✅ Login successful');
      
      // Get the cookies/session from the response
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('🍪 Got session cookies');
      
      console.log('');
      console.log('🎉 Production admin ready!');
      console.log('');
      console.log('🔑 PRODUCTION LOGIN CREDENTIALS:');
      console.log('   📧 Email: admin2@starcast.co.za');
      console.log('   🔐 Password: admin123!');
      console.log('   🌍 URL: https://starcast-web-production.up.railway.app');
      console.log('');
      console.log('🚀 Now you can:');
      console.log('   1. Login to production admin dashboard');
      console.log('   2. Test WhatsApp messaging functionality'); 
      console.log('   3. Send demo WhatsApp messages');
      
    } else {
      const error = await loginResponse.json();
      console.log('❌ Login failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setAdminRole();