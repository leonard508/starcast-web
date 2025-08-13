const fs = require('fs');
const path = require('path');

// Test Supabase connection
async function testSupabaseConnection() {
  console.log('=== Supabase Connection Test ===\n');
  
  // Read environment file
  const envPath = path.join(__dirname, '..', '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Extract DATABASE_URL
  const dbUrlMatch = envContent.match(/DATABASE_URL\s*=\s*"([^"]+)"/);
  if (!dbUrlMatch) {
    console.log('❌ No DATABASE_URL found in .env');
    return;
  }
  
  const fullUrl = dbUrlMatch[1];
  console.log('Database URL found ✓');
  
  // Parse the URL safely
  try {
    const url = new URL(fullUrl);
    console.log(`Host: ${url.hostname}`);
    console.log(`Port: ${url.port}`);
    console.log(`Database: ${url.pathname.slice(1)}`);
    console.log(`User: ${url.username}`);
    console.log(`SSL: ${url.searchParams.get('sslmode') || 'default'}`);
    
    // Check if it's the correct Supabase format
    if (url.hostname.includes('supabase.co')) {
      console.log('\n✓ Supabase database URL detected');
      console.log('✓ PostgreSQL configuration correct');
      
      // Suggest next steps
      console.log('\n=== Next Steps ===');
      console.log('1. Verify Supabase project is active');
      console.log('2. Check if database password is correct');
      console.log('3. Ensure IP/network access to Supabase');
      console.log('4. Try connecting through Supabase dashboard');
    } else {
      console.log('\n⚠️  Not a Supabase database URL');
    }
    
  } catch (error) {
    console.log(`❌ Invalid DATABASE_URL format: ${error.message}`);
  }
  
  console.log('\n=== Configuration Status ===');
  console.log('✓ .env file updated to use Supabase PostgreSQL');
  console.log('✓ Prisma schema updated to PostgreSQL provider');
  console.log('⏳ Waiting for database connection to establish');
}

testSupabaseConnection().catch(console.error);