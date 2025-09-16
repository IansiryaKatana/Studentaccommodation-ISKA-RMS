@echo off
setlocal enabledelayedexpansion

REM 🚀 ISKA RMS Deployment Script for Windows
REM This script automates the deployment process for different platforms

echo 🚀 ISKA RMS Deployment Script
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo [SUCCESS] Dependencies check passed

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies installed

REM Check environment file
echo [INFO] Checking environment variables...
if not exist ".env" (
    echo [WARNING] .env file not found. Creating from template...
    copy env.example .env
    echo [WARNING] Please update .env file with your actual values before deploying.
) else (
    echo [SUCCESS] Environment file found
)

REM Run migrations
echo [INFO] Running database migrations...
echo [WARNING] Please run the file storage migration manually in your Supabase SQL Editor:
echo supabase/migrations/20250802230000_add_file_storage.sql

REM Build project
echo [INFO] Building project for production...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [SUCCESS] Project built successfully

REM Show deployment options
echo.
echo ISKA RMS Deployment Options:
echo 1. Vercel (Recommended for React apps)
echo 2. Netlify
echo 3. Railway
echo 4. Build only (no deployment)
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto deploy_vercel
if "%choice%"=="2" goto deploy_netlify
if "%choice%"=="3" goto deploy_railway
if "%choice%"=="4" goto build_only
if "%choice%"=="5" goto exit_script
echo [ERROR] Invalid choice. Please try again.
goto show_options

:deploy_vercel
echo [INFO] Deploying to Vercel...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing Vercel CLI...
    call npm install -g vercel
)
echo [INFO] Starting Vercel deployment...
call vercel --prod
if %errorlevel% neq 0 (
    echo [ERROR] Vercel deployment failed
    pause
    exit /b 1
)
echo [SUCCESS] Deployment to Vercel completed!
goto post_deployment

:deploy_netlify
echo [INFO] Preparing for Netlify deployment...
where netlify >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing Netlify CLI...
    call npm install -g netlify-cli
)
echo [INFO] Starting Netlify deployment...
call netlify deploy --prod --dir=dist
if %errorlevel% neq 0 (
    echo [ERROR] Netlify deployment failed
    pause
    exit /b 1
)
echo [SUCCESS] Deployment to Netlify completed!
goto post_deployment

:deploy_railway
echo [INFO] Deploying to Railway...
where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing Railway CLI...
    call npm install -g @railway/cli
)
echo [INFO] Starting Railway deployment...
call railway login
call railway init
call railway up
if %errorlevel% neq 0 (
    echo [ERROR] Railway deployment failed
    pause
    exit /b 1
)
echo [SUCCESS] Deployment to Railway completed!
goto post_deployment

:build_only
echo [INFO] Building project only...
echo [SUCCESS] Build completed. Check the dist/ folder.
goto exit_script

:post_deployment
echo.
echo 🎉 Deployment completed!
echo.
echo Next steps:
echo 1. Configure environment variables in your deployment platform
echo 2. Run the file storage migration in Supabase SQL Editor
echo 3. Test file upload/download functionality
echo 4. Set up monitoring and analytics
echo.
echo Useful commands:
echo - View logs: Check your deployment platform dashboard
echo - Update deployment: Run this script again
echo - Local development: npm run dev
echo.
echo Documentation:
echo - Deployment Guide: DEPLOYMENT_GUIDE.md
echo - File Storage: src/services/fileStorage.ts
echo - Supabase Setup: https://supabase.com/docs

:exit_script
echo.
echo [INFO] Exiting...
pause 