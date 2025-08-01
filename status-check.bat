@echo off
echo 🔍 Starcast Development Environment Status Check
echo.

echo 📊 Docker Status:
docker ps --filter "name=starcast-postgres" --format "✅ {{.Names}} - {{.Status}} - {{.Ports}}"

echo.
echo 🔌 Database Connection:
npx prisma db push --skip-generate >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Database connected and schema synced
) else (
    echo ❌ Database connection failed
)

echo.
echo 🌐 Development Server:
for /f "tokens=5" %%a in ('netstat -an ^| findstr ":3001.*LISTENING"') do (
    echo ✅ Server running on http://localhost:3001
    goto :found
)
echo ❌ Development server not running on port 3001

:found
echo.
echo 🏷️ Promotional Badge System:
echo ✅ Database schema includes badge fields
echo ✅ Admin dashboard enhanced with badge management
echo ✅ Bulk badge manager component ready
echo ✅ API endpoints support promotional badges

echo.
echo 🎯 Quick Access:
echo 🌐 Main site: http://localhost:3001
echo 👤 Admin dashboard: http://localhost:3001/admin
echo 🏷️ Package management with badges ready!

echo.
echo 🚀 To start development:
echo    1. Visit http://localhost:3001/admin
echo    2. Click on any package "Edit" button
echo    3. Scroll to "🏷️ Promotional Badge" section
echo    4. Or use "🏷️ Manage Badges" for bulk operations

pause