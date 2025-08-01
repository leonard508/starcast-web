@echo off
echo 🔍 Checking database status...

echo 📊 Docker container status:
docker ps --filter "name=starcast-postgres" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo 🔌 Testing database connection:
npx prisma db push --preview-feature

echo.
echo 📋 Database schema status:
npx prisma migrate status

pause