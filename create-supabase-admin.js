#!/usr/bin/env node

/**
 * CREATE SUPABASE ADMIN
 * Instructions for setting up admin user in Supabase
 */

console.log('🔧 SUPABASE ADMIN SETUP INSTRUCTIONS');
console.log('');
console.log('📋 To set up Supabase admin:');
console.log('');
console.log('1. 🏗️  Create Supabase Project:');
console.log('   - Go to https://supabase.com');
console.log('   - Create new project');
console.log('   - Get your project URL and anon key');
console.log('');
console.log('2. 🔧 Update Environment Variables:');
console.log('   - Replace in .env.local:');
console.log('     NEXT_PUBLIC_SUPABASE_URL=your-actual-project-url');
console.log('     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key');
console.log('');
console.log('3. 🗄️  Create Database Tables:');
console.log('   - In Supabase SQL Editor, run:');
console.log('');
console.log(`
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'SUPPORT')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'USER');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
`);
console.log('');
console.log('4. 👤 Create Admin User:');
console.log('   - Go to Authentication > Users in Supabase');
console.log('   - Click "Add User"');
console.log('   - Email: admin@starcast.co.za');
console.log('   - Password: M@ndaL0r1&n_1987(@_@)');
console.log('');
console.log('5. 🔐 Set Admin Role:');
console.log('   - Go to SQL Editor');
console.log('   - Run: UPDATE profiles SET role = \'ADMIN\' WHERE email = \'admin@starcast.co.za\';');
console.log('');
console.log('6. 🚀 Test Login:');
console.log('   - Start server: npm run dev');
console.log('   - Go to: http://localhost:3000/login');
console.log('   - Login with admin credentials');
console.log('');
console.log('✅ Done! Admin should now work with Supabase.'); 