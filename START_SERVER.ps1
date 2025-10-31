Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Mood Based Book Recommendor" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
Write-Host ""
Write-Host "Starting server..." -ForegroundColor Green
Write-Host "Server will run on http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
npm start

