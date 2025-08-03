@echo off
echo ========================================
echo Starting RSVP Manager...
echo ========================================
echo.

echo Installing dependencies...
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
echo Starting the application...
echo Server will run on: http://localhost:5000
echo Client will run on: http://localhost:3000
echo.
echo Master admin code: tamar123
echo.

npm run dev 