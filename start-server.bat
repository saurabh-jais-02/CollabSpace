@echo off
title CollabSpace Server
color 0A
echo.
echo  ==========================================
echo   CollabSpace - Backend + Frontend Server
echo  ==========================================
echo.
echo  Stopping any existing node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 >nul
echo.
echo  Starting server with auto-restart (nodemon)...
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:3000/api
echo.
echo  Press Ctrl+C to stop.
echo.

cd /d "%~dp0"

node node_modules\nodemon\bin\nodemon.js backend\server.js

pause
