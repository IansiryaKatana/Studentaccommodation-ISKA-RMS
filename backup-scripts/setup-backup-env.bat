@echo off
REM Backup Environment Setup Script for iska-RMS
REM This script checks and sets up required dependencies for the backup system

echo 🔧 Setting up backup environment for iska-RMS...
echo.

REM Check PowerShell
echo 📋 Checking PowerShell...
powershell -Command "Write-Host 'PowerShell is available'"
if %ERRORLEVEL% equ 0 (
    echo ✅ PowerShell is available
) else (
    echo ❌ PowerShell is not available
    echo    Please ensure PowerShell is installed and accessible
    pause
    exit /b 1
)

REM Check Node.js
echo.
echo 📋 Checking Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Node.js is available
    node --version
) else (
    echo ❌ Node.js is not available
    echo    Please install Node.js from https://nodejs.org/
    echo    After installation, restart this script
    pause
    exit /b 1
)

REM Check npm
echo.
echo 📋 Checking npm...
npm --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ npm is available
    npm --version
) else (
    echo ❌ npm is not available
    echo    Please ensure npm is properly installed with Node.js
    pause
    exit /b 1
)

REM Check environment variables
echo.
echo 📋 Checking environment variables...
set MISSING_VARS=0

if "%VITE_SUPABASE_URL%"=="" (
    echo ❌ VITE_SUPABASE_URL is not set
    set MISSING_VARS=1
) else (
    echo ✅ VITE_SUPABASE_URL is set
)

if "%SUPABASE_SERVICE_ROLE_KEY%"=="" (
    echo ❌ SUPABASE_SERVICE_ROLE_KEY is not set
    set MISSING_VARS=1
) else (
    echo ✅ SUPABASE_SERVICE_ROLE_KEY is set
)

if %MISSING_VARS% equ 1 (
    echo.
    echo ⚠️  Some environment variables are missing
    echo    Please set the following variables:
    echo    - VITE_SUPABASE_URL
    echo    - SUPABASE_SERVICE_ROLE_KEY
    echo.
    echo    You can set them in your .env file or system environment
    pause
    exit /b 1
)

REM Check if project dependencies are installed
echo.
echo 📋 Checking project dependencies...
if not exist "node_modules" (
    echo ⚠️  Project dependencies not found
    echo    Installing dependencies...
    npm install
    if %ERRORLEVEL% equ 0 (
        echo ✅ Dependencies installed successfully
    ) else (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Project dependencies found
)

REM Create backup directories
echo.
echo 📋 Creating backup directories...
if not exist "backups" mkdir backups
if not exist "backups\codebase" mkdir backups\codebase
if not exist "backups\database" mkdir backups\database
echo ✅ Backup directories created

REM Test Supabase connection
echo.
echo 📋 Testing Supabase connection...
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

supabase.from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .limit(1)
    .then(({ data, error }) => {
        if (error) {
            console.log('❌ Supabase connection failed:', error.message);
            process.exit(1);
        } else {
            console.log('✅ Supabase connection successful');
            process.exit(0);
        }
    })
    .catch(err => {
        console.log('❌ Supabase connection error:', err.message);
        process.exit(1);
    });
"

if %ERRORLEVEL% equ 0 (
    echo ✅ Supabase connection test passed
) else (
    echo ❌ Supabase connection test failed
    echo    Please check your Supabase credentials
    pause
    exit /b 1
)

REM Check PowerShell execution policy
echo.
echo 📋 Checking PowerShell execution policy...
powershell -Command "Get-ExecutionPolicy -Scope CurrentUser" > temp_execution_policy.txt
set /p EXECUTION_POLICY=<temp_execution_policy.txt
del temp_execution_policy.txt

echo Current execution policy: %EXECUTION_POLICY%
if "%EXECUTION_POLICY%"=="Restricted" (
    echo ⚠️  PowerShell execution policy is restricted
    echo    Setting execution policy to RemoteSigned...
    powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"
    echo ✅ Execution policy updated
) else (
    echo ✅ Execution policy is acceptable
)

echo.
echo 🎉 === BACKUP ENVIRONMENT SETUP COMPLETE ===
echo.
echo ✅ All required components are ready:
echo    - PowerShell is available
echo    - Node.js and npm are installed
echo    - Environment variables are set
echo    - Project dependencies are installed
echo    - Backup directories are created
echo    - Supabase connection is working
echo    - PowerShell execution policy is configured
echo.
echo 🚀 You can now run the backup scripts:
echo    - Double-click: backup-all.bat
echo    - Or run: .\backup-scripts\backup-all.bat
echo.
pause
