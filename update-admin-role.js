#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

async function updateAdminRole(email) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    // List users and find by email
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`Found user: ${user.id}`);

    // Update metadata
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: { ...user.user_metadata, role: 'ADMIN' } }
    );

    if (error) throw error;

    console.log('Successfully updated role to ADMIN');
    console.log('Updated user:', data.user.id, data.user.email);
  } catch (error) {
    console.error('Error updating role:', error.message);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: node update-admin-role.js <email>');
  process.exit(1);
}

updateAdminRole(email); 