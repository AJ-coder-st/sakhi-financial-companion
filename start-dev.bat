@echo off
cd /d e:\sakhi-financial-companion
echo Installing dependencies...
call npm install
echo.
echo Starting development server...
call npm run dev
pause
