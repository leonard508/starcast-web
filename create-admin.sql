-- Delete all existing users and related data
DELETE FROM sessions;
DELETE FROM accounts; 
DELETE FROM applications;
DELETE FROM users;

-- Create new admin user
-- Password hash for 'M@ndal0r1&n' using bcrypt with 12 rounds
INSERT INTO users (
    id,
    email, 
    password,
    name,
    role,
    "emailVerified",
    active,
    "mustChangePassword",
    "createdAt",
    "updatedAt"
) VALUES (
    'admin_' || substr(md5(random()::text), 1, 20),
    'starcast.tech@gmail.com',
    '$2a$12$LKzGwbU6yXZiuK1qy6.rUOHBVZX4K6FcQQbYfU4rRNJvT3QmKvP5.',
    'Starcast Admin',
    'ADMIN',
    true,
    true,
    false,
    NOW(),
    NOW()
);

-- Verify the user was created
SELECT id, email, name, role, "emailVerified", active FROM users WHERE email = 'starcast.tech@gmail.com';