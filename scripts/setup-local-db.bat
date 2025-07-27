@echo off
echo 🐘 Setting up local PostgreSQL database...

echo 📦 Starting PostgreSQL container...
docker-compose up -d postgres

echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 10 /nobreak >nul

echo 🔄 Pushing database schema...
npx prisma db push

echo 🌱 Seeding database...
npx prisma db seed

echo ✅ Local database setup complete!
echo 🌐 Database running at: postgresql://postgres:***@localhost:5432/railway
echo 🎯 You can now run: npm run dev