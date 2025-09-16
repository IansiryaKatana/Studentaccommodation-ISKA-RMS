@echo off
REM Final Complete Backup Script for iska-RMS
REM This script creates a comprehensive backup of both codebase and database

setlocal enabledelayedexpansion

REM Configuration
set BACKUP_PATH=.\backups
set PROJECT_NAME=iska-RMS
set TIMESTAMP=%date:~-4,4%-%date:~-10,2%-%date:~-7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set COMPLETE_BACKUP_FOLDER=%BACKUP_PATH%\%PROJECT_NAME%-complete-backup-%TIMESTAMP%

echo 🚀 Starting complete backup for %PROJECT_NAME%...
echo 📅 Backup timestamp: %TIMESTAMP%
echo 📁 Backup location: %COMPLETE_BACKUP_FOLDER%

REM Create backup directory
if not exist "%COMPLETE_BACKUP_FOLDER%" mkdir "%COMPLETE_BACKUP_FOLDER%"
echo ✅ Created backup directory

REM Initialize backup tracking
set CODEBASE_SUCCESS=false
set DATABASE_SUCCESS=false

echo.
echo 📁 === CODEBASE BACKUP ===

REM Create codebase backup folder
set CODEBASE_BACKUP_FOLDER=%COMPLETE_BACKUP_FOLDER%\codebase
if not exist "%CODEBASE_BACKUP_FOLDER%" mkdir "%CODEBASE_BACKUP_FOLDER%"

REM Backup source code
if exist "src" (
    xcopy "src" "%CODEBASE_BACKUP_FOLDER%\src\" /E /I /Y >nul
    echo ✅ Backed up source code
)

REM Backup configuration
if exist "config" (
    xcopy "config" "%CODEBASE_BACKUP_FOLDER%\config\" /E /I /Y >nul
    echo ✅ Backed up configuration
)

REM Backup Supabase
if exist "supabase" (
    xcopy "supabase" "%CODEBASE_BACKUP_FOLDER%\supabase\" /E /I /Y >nul
    echo ✅ Backed up Supabase configuration
)

REM Backup public assets
if exist "public" (
    xcopy "public" "%CODEBASE_BACKUP_FOLDER%\public\" /E /I /Y >nul
    echo ✅ Backed up public assets
)

REM Backup important files
copy "package.json" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy "package-lock.json" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy "vite.config.ts" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy "tailwind.config.ts" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy "tsconfig.json" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy "tsconfig.app.json" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy "tsconfig.node.json" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy "postcss.config.js" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy "eslint.config.js" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy "components.json" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy "index.html" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy ".gitignore" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy "README.md" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy "env.example" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
copy "env.sample" "%CODEBASE_BACKUP_FOLDER%\" >nul 2>&1
echo ✅ Backed up configuration files

REM Backup documentation files using improved PowerShell command
echo 📄 Backing up documentation files...
powershell -Command "Get-ChildItem -Path '.' -Recurse -Filter '*.md' | Where-Object { $_.FullName -notlike '*node_modules*' -and $_.FullName -notlike '*.git*' -and $_.FullName -notlike '*backups*' } | ForEach-Object { $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1); $targetPath = Join-Path '%CODEBASE_BACKUP_FOLDER%' $relativePath; $targetDir = Split-Path -Parent $targetPath; if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }; Copy-Item $_.FullName $targetPath -Force -ErrorAction SilentlyContinue }"
echo ✅ Backed up documentation files

REM Backup utility scripts using improved PowerShell command
echo 🔧 Backing up utility scripts...
powershell -Command "Get-ChildItem -Path '.' -Recurse -Filter '*.js' | Where-Object { $_.FullName -notlike '*node_modules*' -and $_.FullName -notlike '*.git*' -and $_.FullName -notlike '*backups*' } | ForEach-Object { $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1); $targetPath = Join-Path '%CODEBASE_BACKUP_FOLDER%' $relativePath; $targetDir = Split-Path -Parent $targetPath; if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }; Copy-Item $_.FullName $targetPath -Force -ErrorAction SilentlyContinue }"
echo ✅ Backed up utility scripts

REM Backup other important file types
echo 📋 Backing up other important files...
powershell -Command "Get-ChildItem -Path '.' -Recurse -Filter '*.cjs' | Where-Object { $_.FullName -notlike '*node_modules*' -and $_.FullName -notlike '*.git*' -and $_.FullName -notlike '*backups*' } | ForEach-Object { $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1); $targetPath = Join-Path '%CODEBASE_BACKUP_FOLDER%' $relativePath; $targetDir = Split-Path -Parent $targetPath; if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }; Copy-Item $_.FullName $targetPath -Force -ErrorAction SilentlyContinue }"
powershell -Command "Get-ChildItem -Path '.' -Recurse -Filter '*.bat' | Where-Object { $_.FullName -notlike '*node_modules*' -and $_.FullName -notlike '*.git*' -and $_.FullName -notlike '*backups*' } | ForEach-Object { $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1); $targetPath = Join-Path '%CODEBASE_BACKUP_FOLDER%' $relativePath; $targetDir = Split-Path -Parent $targetPath; if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }; Copy-Item $_.FullName $targetPath -Force -ErrorAction SilentlyContinue }"
powershell -Command "Get-ChildItem -Path '.' -Recurse -Filter '*.ps1' | Where-Object { $_.FullName -notlike '*node_modules*' -and $_.FullName -notlike '*.git*' -and $_.FullName -notlike '*backups*' } | ForEach-Object { $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1); $targetPath = Join-Path '%CODEBASE_BACKUP_FOLDER%' $relativePath; $targetDir = Split-Path -Parent $targetPath; if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }; Copy-Item $_.FullName $targetPath -Force -ErrorAction SilentlyContinue }"
echo ✅ Backed up other important files

set CODEBASE_SUCCESS=true
echo ✅ Codebase backup completed

echo.
echo 🗄️  === DATABASE BACKUP ===

REM Check if Node.js is available
node --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Node.js found
    
    REM Check if .env file exists
    if exist ".env" (
        echo ✅ Environment file found
        
        REM Check if service role key is configured
        findstr /C:"SUPABASE_SERVICE_ROLE_KEY=" .env | findstr /V /C:"your_service_role_key_here" >nul
        if %ERRORLEVEL% equ 0 (
            echo ✅ Service role key configured
            
            REM Create database backup folder
            set DATABASE_BACKUP_FOLDER=%COMPLETE_BACKUP_FOLDER%\database
            if not exist "%DATABASE_BACKUP_FOLDER%" mkdir "%DATABASE_BACKUP_FOLDER%"
            
            REM Run database backup
            node ".\backup-scripts\backup-database.cjs"
            if %ERRORLEVEL% equ 0 (
                echo ✅ Database backup completed
                set DATABASE_SUCCESS=true
            ) else (
                echo ❌ Database backup failed
            )
        ) else (
            echo ⚠️  Service role key not configured - skipping database backup
            echo    Update your .env file with the actual SUPABASE_SERVICE_ROLE_KEY
        )
    ) else (
        echo ⚠️  No .env file found - skipping database backup
        echo    Create a .env file with VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
    )
) else (
    echo ❌ Node.js not found - skipping database backup
)

echo.
echo 🗜️  === CREATING COMPRESSED BACKUP ===

REM Create compressed backup
set COMPRESSED_BACKUP=%BACKUP_PATH%\%PROJECT_NAME%-complete-backup-%TIMESTAMP%.zip

powershell -Command "Compress-Archive -Path '%COMPLETE_BACKUP_FOLDER%' -DestinationPath '%COMPRESSED_BACKUP%' -Force"
if %ERRORLEVEL% equ 0 (
    echo ✅ Compressed backup created: %COMPRESSED_BACKUP%
    
    REM Clean up uncompressed folder
    rmdir /s /q "%COMPLETE_BACKUP_FOLDER%" >nul 2>&1
    echo ✅ Cleaned up uncompressed backup folder
    
    set FINAL_BACKUP_PATH=%COMPRESSED_BACKUP%
) else (
    echo ❌ Error creating compressed backup
    echo Uncompressed backup remains at: %COMPLETE_BACKUP_FOLDER%
    set FINAL_BACKUP_PATH=%COMPLETE_BACKUP_FOLDER%
)

REM Create backup manifest
echo Creating backup manifest...
(
echo {
echo   "projectName": "%PROJECT_NAME%",
echo   "backupTimestamp": "%TIMESTAMP%",
echo   "backupLocation": "%FINAL_BACKUP_PATH%",
echo   "backupDate": "%date% %time%",
echo   "codebaseBackup": "%CODEBASE_SUCCESS%",
echo   "databaseBackup": "%DATABASE_SUCCESS%",
echo   "systemInfo": {
echo     "os": "Windows",
echo     "backupScript": "final-backup.bat"
echo   }
echo }
) > "%BACKUP_PATH%\backup-manifest-%TIMESTAMP%.json"

echo.
echo 🎉 === BACKUP SUMMARY ===
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

REM Calculate backup size using PowerShell for better accuracy
if exist "%FINAL_BACKUP_PATH%" (
    for /f "tokens=*" %%i in ('powershell -Command "(Get-Item '%FINAL_BACKUP_PATH%').Length / 1MB"') do set BACKUP_SIZE_MB=%%i
    echo 💾 Backup size: %BACKUP_SIZE_MB% MB
)

echo.
echo 🎯 Backup process completed!
echo 📋 Manifest saved to: %BACKUP_PATH%\backup-manifest-%TIMESTAMP%.json

REM Show backup contents summary
echo.
echo 📊 === BACKUP CONTENTS SUMMARY ===
if exist "%FINAL_BACKUP_PATH%" (
    if "%FINAL_BACKUP_PATH:~-4%"==".zip" (
        echo 📦 Compressed backup contains:
        powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip = [System.IO.Compression.ZipFile]::OpenRead('%FINAL_BACKUP_PATH%'); $zip.Entries | Group-Object Directory | ForEach-Object { Write-Host ('  ' + $_.Name + ': ' + $_.Count + ' files') }; $zip.Dispose()"
    ) else (
        echo 📁 Uncompressed backup contains:
        dir "%FINAL_BACKUP_PATH%" /B
    )
)

echo.
echo 🎯 Ready to use! Your backup is complete and ready for restoration.
pause
