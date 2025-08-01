@echo off
echo 🐘 Starting local PostgreSQL database...

echo 📦 Starting PostgreSQL container...
docker-compose up -d postgres

echo ⏳ Waiting for PostgreSQL to be ready...
ping 127.0.0.1 -n 15 >nul

echo 🔄 Pushing database schema with promotional badges...
npx prisma db push

echo 🌱 Seeding database (optional)...
npx prisma db seed

echo ✅ Local database with promotional badge system is ready!
echo 🌐 Database: postgresql://postgres:***@localhost:5432/railway
echo 🎯 Admin dashboard: http://localhost:3000/admin
echo 🏷️ Promotional badges are now available!

pause