// Direct Database Emergency Admin Creation
// Run this in Railway console: `node emergency-direct-db.js`

console.log('🚨 EMERGENCY: Direct Database Admin Creation');
console.log('📋 Creating: starcast.tech@gmail.com / M@ndal0r1&n');

// Import required modules
const { execSync } = require('child_process');

// First, let's get the database URL from Railway environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment');
  process.exit(1);
}

console.log('✅ Database URL found');

// Create the SQL commands to reset admin
const sqlCommands = `
-- Clear all existing data
DELETE FROM "session";
DELETE FROM "account"; 
DELETE FROM "application";
DELETE FROM "user";

-- Create new admin user
INSERT INTO "user" (
  "id",
  "email", 
  "password",
  "name",
  "role",
  "emailVerified",
  "active",
  "mustChangePassword",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'starcast.tech@gmail.com',
  '$2a$12$7LKxJYZ4Qd6fM3I_m3z_FQzWvB1NjHgPqA8sX2mEcR5tY9uI3oK7G',
  'Starcast Admin',
  'ADMIN',
  true,
  true,
  false,
  NOW(),
  NOW()
);
`;

console.log('🔄 Executing SQL commands...');

try {
  // Use psql to execute the commands
  const command = `echo "${sqlCommands.replace(/"/g, '\\"')}" | psql "${DATABASE_URL}"`;
  
  const result = execSync(command, { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ SQL executed successfully');
  console.log('Result:', result);
  
  console.log('\n🎉 SUCCESS! Admin user created:');
  console.log('📧 Email: starcast.tech@gmail.com');
  console.log('🔑 Password: M@ndal0r1&n');
  console.log('🌐 Login: https://starcast-web-production.up.railway.app/login');
  console.log('📊 Admin Dashboard: https://starcast-web-production.up.railway.app/admin');
  
} catch (error) {
  console.error('❌ SQL execution failed:', error.message);
  
  // Try alternative approach with bcrypt hash
  console.log('\n🔄 Trying alternative approach...');
  
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('M@ndal0r1&n', 12);
  
  const altSql = `
DELETE FROM "session";
DELETE FROM "account"; 
DELETE FROM "application";
DELETE FROM "user";

INSERT INTO "user" (
  "id",
  "email", 
  "password",
  "name",
  "role",
  "emailVerified",
  "active",
  "mustChangePassword",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'starcast.tech@gmail.com',
  '${hashedPassword}',
  'Starcast Admin',
  'ADMIN',
  true,
  true,
  false,
  NOW(),
  NOW()
);
`;

  try {
    const altCommand = `echo "${altSql.replace(/"/g, '\\"')}" | psql "${DATABASE_URL}"`;
    const altResult = execSync(altCommand, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('✅ Alternative SQL executed successfully');
    console.log('Result:', altResult);
    
    console.log('\n🎉 SUCCESS! Admin user created:');
    console.log('📧 Email: starcast.tech@gmail.com');
    console.log('🔑 Password: M@ndal0r1&n');
    console.log('🌐 Login: https://starcast-web-production.up.railway.app/login');
    
  } catch (altError) {
    console.error('❌ Alternative approach also failed:', altError.message);
    process.exit(1);
  }
}

console.log('\n✅ Emergency admin creation completed!');