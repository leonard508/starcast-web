#!/usr/bin/env node

/**
 * Create Production Admin Account
 * Use this to create/reset admin account on Railway production
 */

async function createProductionAdmin() {
  try {
    const baseUrl = 'https://starcast-web-production.up.railway.app';
    console.log('🔧 Creating admin account on production...');
    
    const email = 'admin@starcast.co.za';
    const password = 'admin123!';
    const firstName = 'Admin';
    const lastName = 'User';
    
    // Try to sign up using BetterAuth API
    const signupResponse = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name: `${firstName} ${lastName}`,
      }),
    });
    
    const signupResult = await signupResponse.json();
    console.log('📝 Signup response:', signupResult);
    
    if (signupResponse.ok && signupResult.user) {
      console.log('✅ User created via BetterAuth API on production');
      console.log('   User ID:', signupResult.user.id);
      console.log('   Email:', signupResult.user.email);
      
      console.log('');
      console.log('🎉 Production admin account created successfully!');
      console.log('');
      console.log('🔑 LOGIN CREDENTIALS:');
      console.log('   📧 Email: admin@starcast.co.za');
      console.log('   🔐 Password: admin123!');
      console.log('   🌍 URL: https://starcast-web-production.up.railway.app');
      console.log('');
      
      // Test the login immediately
      console.log('🧪 Testing login on production...');
      const testResponse = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      const testResult = await testResponse.json();
      if (testResponse.ok) {
        console.log('✅ Login test successful on production!');
        console.log('🎯 Ready to use admin dashboard');
      } else {
        console.log('❌ Login test failed:', testResult);
      }
      
    } else {
      console.log('❌ Signup failed or user already exists:', signupResult);
      
      // If user already exists, try to sign in to test existing credentials
      console.log('🧪 Testing existing account...');
      const signinResponse = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      const signinResult = await signinResponse.json();
      if (signinResponse.ok) {
        console.log('✅ Existing account works!');
        console.log('🔑 Use: admin@starcast.co.za / admin123!');
      } else {
        console.log('❌ Existing account signin failed:', signinResult);
        console.log('');
        console.log('🔧 MANUAL RESET REQUIRED:');
        console.log('   1. Access Railway database directly');
        console.log('   2. Delete existing admin user record');
        console.log('   3. Re-run this script');
      }
    }
    
  } catch (error) {
    console.error('❌ Network or API Error:', error.message);
    console.log('');
    console.log('🔍 Troubleshooting:');
    console.log('   1. Check if Railway deployment is complete');
    console.log('   2. Verify production URL is accessible');
    console.log('   3. Check Railway logs for deployment issues');
  }
}

createProductionAdmin();