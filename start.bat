@echo off
setlocal enabledelayedexpansion

:: Colors (works in Windows 10 and later)
set "GREEN=[92m"
set "BLUE=[94m"
set "YELLOW=[93m"
set "NC=[0m"

:: Check if silent mode is requested
set SILENT_MODE=false
if "%1"=="--silent" (
    set SILENT_MODE=true
    echo %YELLOW%Running in silent mode. Only essential messages will be displayed.%NC%
)

echo %GREEN%Starting app...%NC%

:: Create temporary files for filtered output
set "TEMP_CLIENT_OUTPUT=%TEMP%\angular_output.txt"
set "TEMP_SERVER_OUTPUT=%TEMP%\node_output.txt"
set "TEMP_MAILDEV_OUTPUT=%TEMP%\maildev_output.txt"
set "FILTER_CLIENT=%TEMP%\filter_client.bat"
set "FILTER_SERVER=%TEMP%\filter_server.bat"
set "FILTER_MAILDEV=%TEMP%\filter_maildev.bat"

:: Create the filter scripts
if "%SILENT_MODE%"=="true" (
    :: Client filter script
    echo @echo off > "%FILTER_CLIENT%"
    echo setlocal enabledelayedexpansion >> "%FILTER_CLIENT%"
    echo for /f "tokens=*" %%%%a in ('findstr /i "Compiled successfully Error" "%%TEMP%%\angular_output.txt"') do ( >> "%FILTER_CLIENT%"
    echo   echo %%%%a >> "%FILTER_CLIENT%"
    echo ) >> "%FILTER_CLIENT%"

    :: Server filter script
    echo @echo off > "%FILTER_SERVER%"
    echo setlocal enabledelayedexpansion >> "%FILTER_SERVER%"
    echo for /f "tokens=*" %%%%a in ('findstr /i "listening on port Error Exception" "%%TEMP%%\node_output.txt"') do ( >> "%FILTER_SERVER%"
    echo   echo %%%%a >> "%FILTER_SERVER%"
    echo ) >> "%FILTER_SERVER%"
    
    :: MailDev filter script
    echo @echo off > "%FILTER_MAILDEV%"
    echo setlocal enabledelayedexpansion >> "%FILTER_MAILDEV%"
    echo for /f "tokens=*" %%%%a in ('findstr /i "MailDev starting listening Error" "%%TEMP%%\maildev_output.txt"') do ( >> "%FILTER_MAILDEV%"
    echo   echo %%%%a >> "%FILTER_MAILDEV%"
    echo ) >> "%FILTER_MAILDEV%"
)

:: Start MailDev first
echo %BLUE%Starting MailDev...%NC%
if "%SILENT_MODE%"=="true" (
    start cmd /c "maildev --web 1080 --smtp 1025 --ip 127.0.0.1 > "%TEMP_MAILDEV_OUTPUT%" 2>&1 & call "%FILTER_MAILDEV%""
) else (
    start cmd /c "maildev --web 1080 --smtp 1025 --ip 127.0.0.1 & echo MailDev is running. Close this window to stop."
)

:: Wait for MailDev to start properly
echo %BLUE%Waiting for MailDev to start (5 seconds)...%NC%
timeout /t 5 /nobreak > nul

:: Start Angular client
echo %BLUE%Starting Angular client...%NC%
if "%SILENT_MODE%"=="true" (
    start cmd /c "cd client && ng serve > "%TEMP_CLIENT_OUTPUT%" 2>&1 & call "%FILTER_CLIENT%""
) else (
    start cmd /c "cd client && ng serve & echo Angular client is running. Close this window to stop."
)

:: Start Node.js server with NODE_ENV explicitly set to development
echo %BLUE%Starting Node.js server...%NC%
if "%SILENT_MODE%"=="true" (
    start cmd /c "cd server && set NODE_ENV=development && node --watch src/server.js > "%TEMP_SERVER_OUTPUT%" 2>&1 & call "%FILTER_SERVER%""
) else (
    start cmd /c "cd server && set NODE_ENV=development && node --watch src/server.js & echo Node.js server is running. Close this window to stop."
)

echo %GREEN%The 3 services are up and running...%NC%
echo %YELLOW%MailDev Web UI: http://localhost:1080%NC%
echo %YELLOW%Angular Client: http://localhost:4200%NC%
echo %YELLOW%Node.js Server: http://localhost:8000%NC%
echo %GREEN%Close the terminal windows to stop the services.%NC%

:: Clean up temporary files when the main script exits
del "%TEMP_CLIENT_OUTPUT%" 2>nul
del "%TEMP_SERVER_OUTPUT%" 2>nul
del "%TEMP_MAILDEV_OUTPUT%" 2>nul
del "%FILTER_CLIENT%" 2>nul
del "%FILTER_SERVER%" 2>nul
del "%FILTER_MAILDEV%" 2>nul