@echo off
title ChanceDeck Automated Test Suite
echo ====================================================
echo Running ChanceDeck Vitest Test Suites...
echo ====================================================
cd /d "%~dp0"
call npm run test
pause
