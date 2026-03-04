@echo off
setlocal enabledelayedexpansion

rem === CONFIGURE THIS PATH IF NEEDED ===
set PROJECT_DIR=D:\PROJECTS\sakhi-financial-companion

:menu
cls
echo ================================
echo   SAKHI Dev Environment
echo ================================
echo  1) Start project  (API + Frontend)
echo  2) Stop project   (kill servers and close)
echo  3) Restart project
echo  4) Exit
echo.
set /p CHOICE=Select an option (1-4): 

if "%CHOICE%"=="1" goto start
if "%CHOICE%"=="2" goto stop_exit
if "%CHOICE%"=="3" goto restart
if "%CHOICE%"=="4" goto quit

goto menu

:start
echo Starting API server on port 3001...
start "SAKHI API" cmd /k "cd /d %PROJECT_DIR% && npm run api"

echo Starting Vite dev server on port 8080...
start "SAKHI FRONTEND" cmd /k "cd /d %PROJECT_DIR% && npm run dev"

echo.
echo Servers started. Press any key to return to menu.
pause >nul
goto menu

:stop_exit
echo Stopping servers...
call :killwindows
call :killnode
call :killports
echo Done. Closing this window...
endlocal
exit

:restart
echo Restarting project...
call :killwindows
call :killnode
call :killports
echo Servers stopped.
echo.
echo Starting again...
start "SAKHI API" cmd /k "cd /d %PROJECT_DIR% && npm run api"
start "SAKHI FRONTEND" cmd /k "cd /d %PROJECT_DIR% && npm run dev"
echo.
echo Restart complete. Press any key to return to menu.
pause >nul
goto menu

:killwindows
rem Kill the cmd windows we started by title (recursive /T)
taskkill /FI "WINDOWTITLE eq SAKHI API*" /F /T >nul 2>&1
taskkill /FI "WINDOWTITLE eq SAKHI FRONTEND*" /F /T >nul 2>&1
goto :eof

:killnode
rem Kill all Node/NPM processes (dev servers) as a hard reset
taskkill /IM node.exe /F >nul 2>&1
taskkill /IM npm.exe /F >nul 2>&1
goto :eof

:killports
rem Extra safety: kill any process listening on these ports
call :killport 3001
call :killport 8080
call :killport 8081
call :killport 8082
goto :eof

:killport
rem Usage: call :killport PORT
set PORT=%1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":%PORT% " ^| findstr LISTENING') do (
    if not "%%p"=="0" (
        echo  Killing process on port %PORT% (PID %%p)...
        taskkill /PID %%p /F >nul 2>&1
    )
)
goto :eof

:quit
endlocal
exit