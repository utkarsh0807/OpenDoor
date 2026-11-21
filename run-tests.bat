@echo off
title OpenDoor Automated Test Suite
echo ====================================================
echo Running OpenDoor Vitest Test Suites...
echo ====================================================
cd /d "%~dp0"
call npm run test
pause
