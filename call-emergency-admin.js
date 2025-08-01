#!/usr/bin/env node

/**
 * Call Emergency Admin Reset API
 */

const RAILWAY_URL = 'https://starcast-web-production.up.railway.app';
const LOCAL_URL = 'http://localhost:3001';

// Use Railway by default, or local if specified
const BASE_URL = process.argv.includes('--local') ? LOCAL_URL : RAILWAY_URL;

async function callEmergencyAdminReset() {
  try {
    console.log('🚨 Calling Emergency Admin Reset API');
    console.log('🎯 Target:', BASE_URL);
    console.log('');
    
    const response = await fetch(`${BASE_URL}/api/emergency-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emergencySecret: 'starcast-emergency-2024'
      }),
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Emergency admin reset successful!');
      console.log('');
      console.log('🔑 ADMIN LOGIN CREDENTIALS:');
      console.log('   🌐 URL: ' + BASE_URL + result.credentials.url);
      console.log('   📧 Email:', result.credentials.email);
      console.log('   🔐 Password:', result.credentials.password);
      console.log('');
      console.log('👤 Admin User Created:');
      console.log('   ID:', result.admin.id);
      console.log('   Email:', result.admin.email);
      console.log('   Role:', result.admin.role);
      console.log('');
      console.log('⚠️  SECURITY: Change password after first login!');
      
    } else {
      console.log('❌ Emergency admin reset failed');
      console.log('Response status:', response.status);
      console.log('Response:', result);
    }
    
  } catch (error) {
    console.error('❌ Error calling emergency admin API:', error.message);
  }
}

callEmergencyAdminReset().catch(console.error);