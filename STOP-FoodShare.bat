@echo off
setlocal enabledelayedexpansion
title FoodShare - Stopping...
cd /d "%~dp0"

echo ============================================
echo            FoodShare  ^|  Shutting down
echo ============================================
echo.

set "FOUND=0"
for %%P in (5000 5173) do (
  set "STOPPED_THIS=0"
  for /f "tokens=5" %%A in ('netstat -ano ^| findstr /r /c:":%%P .*LISTENING"') do (
    if "!STOPPED_THIS!"=="0" (
      taskkill /f /pid %%A >nul 2>nul
      echo Stopped the service on port %%P.
      set "STOPPED_THIS=1"
      set "FOUND=1"
    ) else (
      taskkill /f /pid %%A >nul 2>nul
    )
  )
)

if "%FOUND%"=="0" (
  echo FoodShare was not running, so there was nothing to stop.
) else (
  echo.
  echo FoodShare has been stopped.
)

echo.
pause
