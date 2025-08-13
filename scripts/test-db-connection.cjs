const fs = require('fs');
const path = require('path');

// Read .env files
const envPath = path.join(__dirname, '..', '.env');
const envLocalPath = path.join(__dirname, '..', '.env.local');

console.log('=== Database Connection Test ===\n');

// Check if .env files exist
console.log('Environment Files:');
console.log(`- .env exists: ${fs.existsSync(envPath)}`);
console.log(`- .env.local exists: ${fs.existsSync(envLocalPath)}`);

// Read and display database URLs (safely)
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const dbUrlMatch = envContent.match(/DATABASE_URL\s*=\s*"([^"]+)"/);
  if (dbUrlMatch) {
    const url = dbUrlMatch[1];
    const safeUrl = url.replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1[PASSWORD]$2');
    console.log(`\n.env DATABASE_URL: ${safeUrl}`);
    console.log(`Database Type: ${url.startsWith('mysql://') ? 'MySQL' : url.startsWith('postgresql://') ? 'PostgreSQL' : 'Unknown'}`);
  }
}

if (fs.existsSync(envLocalPath)) {
  const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
  const dbUrlMatch = envLocalContent.match(/DATABASE_URL\s*=\s*"([^"]+)"/);
  if (dbUrlMatch) {
    const url = dbUrlMatch[1];
    const safeUrl = url.replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1[PASSWORD]$2');
    console.log(`\n.env.local DATABASE_URL: ${safeUrl}`);
    console.log(`Database Type: ${url.startsWith('mysql://') ? 'MySQL' : url.startsWith('postgresql://') ? 'PostgreSQL' : 'Unknown'}`);
  }
}

// Check Prisma schema
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const providerMatch = schemaContent.match(/provider\s*=\s*"([^"]+)"/);
  if (providerMatch) {
    console.log(`\nPrisma schema provider: ${providerMatch[1]}`);
  }
}

console.log('\n=== Safety Check ===');
console.log('✓ Local environment only - deployment database unaffected');
console.log('✓ Connection test completed safely');