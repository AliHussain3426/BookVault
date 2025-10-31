@echo off
echo ========================================
echo   Mood Based Book Recommendor
echo ========================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting server...
echo Server will run on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
call npm start
pause

