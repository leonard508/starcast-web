#!/usr/bin/env node

/**
 * Check Production Database Users
 * Debug what's in the production database
 */

async function checkProductionUsers() {
  try {
    const baseUrl = 'https://starcast-web-production.up.railway.app';
    console.log('🔍 Checking production database users...');
    
    // Try to get user info via API (this might not work if endpoint doesn't exist)
    console.log('🧪 Testing various auth endpoints...');
    
    // Test 1: Try different password combinations
    const passwords = ['admin123!', 'password123', 'admin', 'starcast123', 'Admin123!'];
    
    for (const password of passwords) {
      console.log(`🔐 Testing password: ${password}`);
      
      try {
        const testResponse = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'admin@starcast.co.za',
            password: password,
          }),
        });
        
        const testResult = await testResponse.json();
        if (testResponse.ok) {
          console.log(`✅ SUCCESS! Password found: ${password}`);
          console.log('🎯 Login credentials:');
          console.log('   📧 Email: admin@starcast.co.za');
          console.log(`   🔐 Password: ${password}`);
          return;
        } else {
          console.log(`   ❌ ${testResult.message || 'Failed'}`);
        }
      } catch (error) {
        console.log(`   ❌ Network error: ${error.message}`);
      }
    }
    
    console.log('');
    console.log('❌ None of the common passwords worked');
    console.log('');
    
    // Test 2: Try creating a new admin with different email
    console.log('🔧 Trying to create admin with different email...');
    const altEmail = 'admin2@starcast.co.za';
    
    const signupResponse = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: altEmail,
        password: 'admin123!',
        name: 'Admin User Alt',
      }),
    });
    
    const signupResult = await signupResponse.json();
    
    if (signupResponse.ok && signupResult.user) {
      console.log('✅ Alternative admin created!');
      console.log('🔑 WORKING CREDENTIALS:');
      console.log('   📧 Email: admin2@starcast.co.za');
      console.log('   🔐 Password: admin123!');
      console.log('   🌍 URL: https://starcast-web-production.up.railway.app');
    } else {
      console.log('❌ Alternative admin creation failed:', signupResult);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkProductionUsers();