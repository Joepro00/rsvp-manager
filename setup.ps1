Write-Host "========================================" -ForegroundColor Green
Write-Host "RSVP Manager Setup Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check for Node.js
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js found! Version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Choose the LTS version for best compatibility." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installing Node.js, run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Install server dependencies
Write-Host "Installing server dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "Server dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to install server dependencies!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Install client dependencies
Write-Host "Installing client dependencies..." -ForegroundColor Yellow
try {
    Set-Location client
    npm install
    Set-Location ..
    Write-Host "Client dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to install client dependencies!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Open: http://localhost:3000" -ForegroundColor White
Write-Host "3. Login with master code: tamar123" -ForegroundColor White
Write-Host ""

$startApp = Read-Host "Press Enter to start the application (or 'n' to exit)"
if ($startApp -ne 'n') {
    Write-Host "Starting RSVP Manager..." -ForegroundColor Green
    npm run dev
} 