@echo off
title ChanceDeck Production Build
echo ====================================================
echo Generating Production Build...
echo ====================================================
cd /d "%~dp0"
call npm run build
pause
