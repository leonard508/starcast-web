#!/usr/bin/env node

/**
 * Railway Database Environment Fix Script
 * 
 * This script helps diagnose and fix Railway PostgreSQL environment variable issues.
 */

const { execSync } = require('child_process');

function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    const result = execSync(command, { encoding: 'utf8', timeout: 30000 });
    console.log(`✅ ${description} completed successfully`);
    return result.trim();
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return null;
  }
}

function checkRailwayStatus() {
  console.log('🔍 Checking Railway project status...');
  
  try {
    const status = execSync('railway status', { encoding: 'utf8' });
    console.log('Railway Status:');
    console.log(status);
    return true;
  } catch (error) {
    console.error('❌ Railway CLI not available or not logged in');
    console.log('Please install Railway CLI: npm install -g @railway/cli');
    console.log('Then login: railway login');
    return false;
  }
}

function checkEnvironmentVariables() {
  console.log('\n🔍 Checking Railway environment variables...');
  
  try {
    const variables = execSync('railway variables list', { encoding: 'utf8' });
    console.log('Current Railway Variables:');
    console.log(variables);
    
    // Check for DATABASE_URL
    if (variables.includes('DATABASE_URL')) {
      console.log('✅ DATABASE_URL is set');
      
      // Get the actual value
      try {
        const dbUrl = execSync('railway variables get DATABASE_URL', { encoding: 'utf8' });
        console.log('DATABASE_URL value:', dbUrl.trim());
        
        if (dbUrl.trim().startsWith('postgresql://') || dbUrl.trim().startsWith('postgres://')) {
          console.log('✅ DATABASE_URL format is correct');
        } else {
          console.log('❌ DATABASE_URL format is incorrect');
          console.log('Expected format: postgresql://username:password@host:port/database');
        }
      } catch (error) {
        console.log('❌ Could not retrieve DATABASE_URL value');
      }
    } else {
      console.log('❌ DATABASE_URL is not set');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Could not check Railway variables:', error.message);
    return false;
  }
}

function checkRailwayServices() {
  console.log('\n🔍 Checking Railway services...');
  
  try {
    const services = execSync('railway service list', { encoding: 'utf8' });
    console.log('Railway Services:');
    console.log(services);
    
    // Check for PostgreSQL service
    if (services.includes('postgresql') || services.includes('postgres')) {
      console.log('✅ PostgreSQL service found');
    } else {
      console.log('❌ PostgreSQL service not found');
      console.log('You may need to add a PostgreSQL service to your Railway project');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Could not check Railway services:', error.message);
    return false;
  }
}

function provideFixInstructions() {
  console.log('\n🔧 Fix Instructions:');
  console.log('==================');
  
  console.log('\n1. Add PostgreSQL Service to Railway:');
  console.log('   - Go to your Railway project dashboard');
  console.log('   - Click "New Service"');
  console.log('   - Select "Database" → "PostgreSQL"');
  console.log('   - Wait for the service to be created');
  
  console.log('\n2. Connect Your App to PostgreSQL:');
  console.log('   - In your app service, go to "Variables" tab');
  console.log('   - Click "Reference Variable"');
  console.log('   - Select your PostgreSQL service');
  console.log('   - Choose "DATABASE_URL"');
  
  console.log('\n3. Alternative: Set DATABASE_URL Manually:');
  console.log('   - Get the connection string from your PostgreSQL service');
  console.log('   - Go to your app service variables');
  console.log('   - Add variable: DATABASE_URL');
  console.log('   - Value: postgresql://username:password@host:port/database');
  
  console.log('\n4. Verify the Fix:');
  console.log('   - Run: railway variables list');
  console.log('   - Check that DATABASE_URL starts with "postgresql://"');
  console.log('   - Redeploy your application');
  
  console.log('\n5. Test Connection:');
  console.log('   - Visit: https://your-app.railway.app/api/debug');
  console.log('   - Check that DATABASE_URL_TYPE shows "postgresql"');
}

function main() {
  console.log('🚂 Railway Database Environment Fix Script');
  console.log('==========================================\n');
  
  // Check Railway CLI
  if (!checkRailwayStatus()) {
    console.log('\n❌ Please install and configure Railway CLI first');
    return;
  }
  
  // Check environment variables
  checkEnvironmentVariables();
  
  // Check services
  checkRailwayServices();
  
  // Provide fix instructions
  provideFixInstructions();
  
  console.log('\n📚 Additional Resources:');
  console.log('- Railway PostgreSQL Docs: https://docs.railway.app/databases/postgresql');
  console.log('- Railway Variables Docs: https://docs.railway.app/develop/variables');
  console.log('- Troubleshooting Guide: RAILWAY_TROUBLESHOOTING.md');
}

main().catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
}); 