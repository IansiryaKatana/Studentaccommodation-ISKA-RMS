@echo off
REM Complete System Backup Script for iska-RMS
REM This script performs both codebase and database backups

setlocal enabledelayedexpansion

REM Configuration
set BACKUP_PATH=.\backups
set PROJECT_NAME=iska-RMS
set TIMESTAMP=%date:~-4,4%-%date:~-10,2%-%date:~-7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set COMPLETE_BACKUP_FOLDER=%BACKUP_PATH%\%PROJECT_NAME%-complete-backup-%TIMESTAMP%

echo 🚀 Starting complete system backup for %PROJECT_NAME%...
echo 📅 Backup timestamp: %TIMESTAMP%
echo 📁 Complete backup location: %COMPLETE_BACKUP_FOLDER%

REM Create main backup directory
if not exist "%COMPLETE_BACKUP_FOLDER%" mkdir "%COMPLETE_BACKUP_FOLDER%"
echo ✅ Created complete backup directory

REM Initialize backup tracking
set CODEBASE_SUCCESS=false
set DATABASE_SUCCESS=false
set START_TIME=%time%

echo.
echo 📁 === CODEBASE BACKUP ===

REM Run codebase backup
powershell -ExecutionPolicy Bypass -File ".\backup-scripts\backup-codebase.ps1" -BackupPath "%BACKUP_PATH%\codebase" -ProjectName "%PROJECT_NAME%"
if %ERRORLEVEL% equ 0 (
    echo ✅ Codebase backup completed successfully
    set CODEBASE_SUCCESS=true
    
    REM Find and copy latest codebase backup
    for /f "delims=" %%i in ('dir /b /od "%BACKUP_PATH%\codebase\%PROJECT_NAME%-backup-*.zip" 2^>nul') do set LATEST_CODEBASE=%%i
    if defined LATEST_CODEBASE (
        copy "%BACKUP_PATH%\codebase\%LATEST_CODEBASE%" "%COMPLETE_BACKUP_FOLDER%\codebase-backup.zip" >nul
        echo ✅ Codebase backup copied to complete backup folder
    )
) else (
    echo ❌ Codebase backup failed
)

echo.
echo 🗄️  === DATABASE BACKUP ===

REM Check if Node.js is available
node --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Node.js found
    node --version
    
    REM Check if dependencies are installed
    if not exist "node_modules" (
        echo 📦 Installing required dependencies...
        npm install
        if %ERRORLEVEL% equ 0 (
            echo ✅ Dependencies installed successfully
        ) else (
            echo ❌ Failed to install dependencies
            goto :end
        )
    )
    
    REM Run database backup
    node ".\backup-scripts\backup-database.js"
    if %ERRORLEVEL% equ 0 (
        echo ✅ Database backup completed successfully
        set DATABASE_SUCCESS=true
        
        REM Find and copy latest database backup
        for /f "delims=" %%i in ('dir /b /od "%BACKUP_PATH%\database\%PROJECT_NAME%-db-backup-*" 2^>nul') do set LATEST_DATABASE=%%i
        if defined LATEST_DATABASE (
            xcopy "%BACKUP_PATH%\database\%LATEST_DATABASE%" "%COMPLETE_BACKUP_FOLDER%\database-backup\" /E /I /Y >nul
            echo ✅ Database backup copied to complete backup folder
        )
    ) else (
        echo ❌ Database backup failed
    )
) else (
    echo ❌ Node.js is required for database backup but not found
    echo    Please install Node.js and try again
)

:end

REM Create compressed complete backup
echo.
echo 🗜️  Creating compressed complete backup...
set COMPRESSED_BACKUP=%BACKUP_PATH%\%PROJECT_NAME%-complete-backup-%TIMESTAMP%.zip

powershell -Command "Compress-Archive -Path '%COMPLETE_BACKUP_FOLDER%' -DestinationPath '%COMPRESSED_BACKUP%' -Force"
if %ERRORLEVEL% equ 0 (
    echo ✅ Compressed complete backup created: %COMPRESSED_BACKUP%
    
    REM Clean up uncompressed folder
    rmdir /s /q "%COMPLETE_BACKUP_FOLDER%" >nul 2>&1
    echo ✅ Cleaned up uncompressed backup folder
    
    set FINAL_BACKUP_PATH=%COMPRESSED_BACKUP%
) else (
    echo ❌ Error creating compressed backup
    echo Uncompressed backup remains at: %COMPLETE_BACKUP_FOLDER%
    set FINAL_BACKUP_PATH=%COMPLETE_BACKUP_FOLDER%
)

REM Final summary
echo.
echo 🎉 === COMPLETE BACKUP SUMMARY ===
echo 📁 Final backup location: %FINAL_BACKUP_PATH%

if "%CODEBASE_SUCCESS%"=="true" (
    echo ✅ Codebase backup: SUCCESS
) else (
    echo ❌ Codebase backup: FAILED
)

if "%DATABASE_SUCCESS%"=="true" (
    echo ✅ Database backup: SUCCESS
) else (
    echo ❌ Database backup: FAILED
)

REM Clean up individual backup folders
if exist "%COMPRESSED_BACKUP%" (
    echo.
    echo 🧹 Cleaning up individual backup folders...
    if exist "%BACKUP_PATH%\codebase" rmdir /s /q "%BACKUP_PATH%\codebase" >nul 2>&1
    if exist "%BACKUP_PATH%\database" rmdir /s /q "%BACKUP_PATH%\database" >nul 2>&1
    echo ✅ Cleaned up individual backup folders
)

echo.
echo 🎯 Backup process completed!
pause
