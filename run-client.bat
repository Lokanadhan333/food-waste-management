@echo off
title FoodShare Website (port 5173)
cd /d "%~dp0client"
if exist "C:\Program Files\nodejs\npm.cmd" (
  "C:\Program Files\nodejs\npm.cmd" run dev
) else (
  npm run dev
)
