@echo off
echo 🐳 Setting up Docker Desktop to auto-start with Windows...

echo.
echo 📋 Current Docker Desktop settings will be updated to:
echo    ✅ Start Docker Desktop when you log in
echo    ✅ Open Docker Desktop dashboard on startup (optional)
echo.

echo 🔍 Checking if Docker Desktop is installed...
where "Docker Desktop.exe" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop executable not found in PATH
    echo 💡 Please make sure Docker Desktop is properly installed
    pause
    exit /b 1
)

echo ✅ Docker Desktop found!
echo.

echo 📝 To enable Docker auto-start:
echo.
echo 1️⃣ Open Docker Desktop
echo 2️⃣ Click the Settings gear icon (⚙️)
echo 3️⃣ Go to "General" tab
echo 4️⃣ Check "Start Docker Desktop when you log in"
echo 5️⃣ Optionally uncheck "Open Docker Dashboard at startup" for faster boot
echo 6️⃣ Click "Apply & Restart"
echo.

echo 🚀 Alternative: Using Registry (Advanced)
echo Would you like me to set this via Windows Registry? (Y/N)
set /p choice="Enter choice: "

if /i "%choice%"=="Y" (
    echo 📝 Adding Docker Desktop to Windows startup...
    
    REM Get Docker Desktop installation path
    for /f "delims=" %%i in ('where "Docker Desktop.exe" 2^>nul') do set DOCKER_PATH=%%i
    
    if defined DOCKER_PATH (
        echo 📋 Found Docker at: %DOCKER_PATH%
        
        REM Add to Windows startup registry
        reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run" /v "Docker Desktop" /t REG_SZ /d "\"%DOCKER_PATH%\"" /f >nul 2>&1
        
        if %errorlevel% equ 0 (
            echo ✅ Docker Desktop added to Windows startup!
            echo 🔄 Docker will now start automatically when you log in
        ) else (
            echo ❌ Failed to add Docker to startup registry
            echo 🔧 Please use the manual method described above
        )
    ) else (
        echo ❌ Could not determine Docker Desktop path
        echo 🔧 Please use the manual method described above
    )
) else (
    echo 📋 Please follow the manual steps above to enable auto-start
)

echo.
echo 🎯 Next: Your promotional badge system is ready!
echo 🌐 Start development: npm run dev
echo 🏷️ Admin dashboard: http://localhost:3000/admin

pause