@echo off
echo ========================================
echo RSVP Manager Setup Script
echo ========================================
echo.

echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Choose the LTS version for best compatibility.
    echo.
    echo After installing Node.js, run this script again.
    pause
    exit /b 1
)

echo Node.js found! Version:
node --version
echo.

echo Installing server dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies!
    pause
    exit /b 1
)

echo.
echo Installing client dependencies...
cd client
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies!
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the application:
echo 1. Run: npm run dev
echo 2. Open: http://localhost:3000
echo 3. Login with master code: tamar123
echo.
echo Press any key to start the application...
pause

echo Starting RSVP Manager...
npm run dev 