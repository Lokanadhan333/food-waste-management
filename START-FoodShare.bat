@echo off
title FoodShare - Starting...
cd /d "%~dp0"

echo ============================================
echo            FoodShare  ^|  Starting up
echo ============================================
echo.

REM ---- locate Node.js (checks PATH + the default install folder) ----
set "NODE_EXE="
set "NPM_CMD="

where node >nul 2>nul && set "NODE_EXE=node"
where npm  >nul 2>nul && set "NPM_CMD=npm"

if not defined NODE_EXE if exist "C:\Program Files\nodejs\node.exe" set "NODE_EXE=C:\Program Files\nodejs\node.exe"
if not defined NPM_CMD  if exist "C:\Program Files\nodejs\npm.cmd"  set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"

if not defined NODE_EXE (
  echo [ERROR] Node.js was not found on this computer.
  echo.
  echo Please install it from https://nodejs.org  ^(choose the LTS version^),
  echo then run this file again.
  echo.
  pause
  exit /b 1
)

if not defined NPM_CMD (
  echo [ERROR] npm was not found on this computer.
  echo Please reinstall Node.js from https://nodejs.org
  echo.
  pause
  exit /b 1
)

REM ---- first-time setup: install dependencies if missing ----
if not exist "server\node_modules" (
  echo [1/3] Installing backend dependencies. This happens only once...
  pushd server
  call "%NPM_CMD%" install --no-audit --no-fund
  popd
) else (
  echo [1/3] Backend dependencies already installed. Skipping.
)

if not exist "client\node_modules" (
  echo [2/3] Installing frontend dependencies. This happens only once...
  pushd client
  call "%NPM_CMD%" install --no-audit --no-fund
  popd
) else (
  echo [2/3] Frontend dependencies already installed. Skipping.
)

REM ---- stop anything already using our ports, so restarts are clean ----
for %%P in (5000 5173) do (
  for /f "tokens=5" %%A in ('netstat -ano ^| findstr /r /c:":%%P .*LISTENING"') do (
    taskkill /f /pid %%A >nul 2>nul
  )
)

echo.
echo [3/3] Starting the backend and the website...
echo.

REM ---- start the backend API (port 5000) ----
pushd server
start "FoodShare Backend (port 5000)" "%NODE_EXE%" src/index.js
popd

REM ---- start the website (port 5173) ----
start "FoodShare Website (port 5173)" cmd /k "%~dp0run-client.bat"

echo Waiting for the website to be ready...

set /a tries=0
:waitloop
set /a tries+=1
timeout /t 2 /nobreak >nul
powershell -NoProfile -Command "try { (Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 2).StatusCode } catch { exit 1 }" >nul 2>nul
if errorlevel 1 (
  if %tries% lss 25 goto waitloop
)

echo Opening your browser...
start "" "http://localhost:5173"

echo.
echo ============================================
echo   FoodShare is running!
echo.
echo   Website : http://localhost:5173
echo   API     : http://localhost:5000/api/health
echo.
echo   Two windows opened in the background.
echo   To stop the site, double-click STOP-FoodShare.bat
echo ============================================
echo.
pause
