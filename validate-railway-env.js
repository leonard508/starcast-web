#!/usr/bin/env node

/**
 * Validate Railway Environment Configuration
 */

console.log('🚂 Railway Environment Validation');
console.log('='.repeat(40));

const requiredEnvVars = [
  'DATABASE_URL',
  'BETTER_AUTH_SECRET',
  'NEXT_PUBLIC_BETTER_AUTH_URL'
];

const optionalEnvVars = [
  'NODE_ENV',
  'PORT',
  'RAILWAY_ENVIRONMENT',
  'BREVO_API_KEY'
];

console.log('\n🔍 Required Environment Variables:');
let hasAllRequired = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    hasAllRequired = false;
  }
});

console.log('\n📊 Optional Environment Variables:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚠️  ${varName}: Not set`);
  }
});

console.log('\n🧪 Configuration Validation:');

// Validate BETTER_AUTH_SECRET length
const authSecret = process.env.BETTER_AUTH_SECRET;
if (authSecret && authSecret.length >= 32) {
  console.log('✅ BETTER_AUTH_SECRET: Sufficient length');
} else {
  console.log('❌ BETTER_AUTH_SECRET: Too short (needs 32+ characters)');
  hasAllRequired = false;
}

// Validate NEXT_PUBLIC_BETTER_AUTH_URL format
const authUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
if (authUrl && authUrl.startsWith('https://')) {
  console.log('✅ NEXT_PUBLIC_BETTER_AUTH_URL: Valid HTTPS URL');
} else {
  console.log('❌ NEXT_PUBLIC_BETTER_AUTH_URL: Must be HTTPS URL');
  hasAllRequired = false;
}

// Validate DATABASE_URL format
const dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.startsWith('postgresql://')) {
  console.log('✅ DATABASE_URL: Valid PostgreSQL URL');
} else {
  console.log('❌ DATABASE_URL: Must be PostgreSQL URL');
  hasAllRequired = false;
}

console.log('\n' + '='.repeat(40));
if (hasAllRequired) {
  console.log('🎉 All required environment variables are configured!');
  console.log('✅ Ready for Railway deployment');
} else {
  console.log('❌ Missing required environment variables');
  console.log('🔧 Fix these issues before deploying to Railway');
}
console.log('='.repeat(40));