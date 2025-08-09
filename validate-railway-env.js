#!/usr/bin/env node

/**
 * Validate Railway Environment Configuration
 */

console.log('🚂 Railway Environment Validation');
console.log('='.repeat(40));

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
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

// Validate NEXT_PUBLIC_SUPABASE_URL format
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.startsWith('https://')) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL: Valid HTTPS URL');
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL: Must be HTTPS URL');
  hasAllRequired = false;
}

// Validate NEXT_PUBLIC_SUPABASE_ANON_KEY format
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (supabaseKey && supabaseKey.startsWith('eyJ')) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: Valid JWT format');
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY: Must be valid JWT token');
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