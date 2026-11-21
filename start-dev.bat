@echo off
title OpenDoor Development Server
echo ====================================================
echo Starting OpenDoor Local Development Server...
echo URL: http://localhost:3000
echo ====================================================
cd /d "%~dp0"
call npm run dev
pause
