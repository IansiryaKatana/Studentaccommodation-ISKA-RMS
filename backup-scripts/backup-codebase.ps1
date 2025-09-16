# Complete Codebase Backup Script for iska-RMS
# This script creates a comprehensive backup of the entire codebase

param(
    [string]$BackupPath = ".\backups\codebase",
    [string]$ProjectName = "iska-RMS"
)

# Create timestamp for backup
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupFolder = "$BackupPath\$ProjectName-backup-$Timestamp"

Write-Host "Starting complete codebase backup..." -ForegroundColor Green
Write-Host "Backup location: $BackupFolder" -ForegroundColor Yellow

# Create backup directory
if (!(Test-Path $BackupFolder)) {
    New-Item -ItemType Directory -Path $BackupFolder -Force | Out-Null
    Write-Host "Created backup directory: $BackupFolder" -ForegroundColor Green
}

# Function to copy files with progress
function Copy-FilesWithProgress {
    param(
        [string]$Source,
        [string]$Destination,
        [string]$Description
    )
    
    Write-Host "Backing up $Description..." -ForegroundColor Cyan
    
    if (Test-Path $Source) {
        try {
            Copy-Item -Path $Source -Destination $Destination -Recurse -Force -ErrorAction Stop
            Write-Host "✓ $Description backed up successfully" -ForegroundColor Green
        }
        catch {
            Write-Host "✗ Error backing up $Description : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "⚠ $Description not found, skipping..." -ForegroundColor Yellow
    }
}

# Backup main source code
Copy-FilesWithProgress -Source ".\src" -Destination "$BackupFolder\src" -Description "Source code"

# Backup configuration files
Copy-FilesWithProgress -Source ".\config" -Destination "$BackupFolder\config" -Description "Configuration files"

# Backup Supabase configuration and migrations
Copy-FilesWithProgress -Source ".\supabase" -Destination "$BackupFolder\supabase" -Description "Supabase configuration and migrations"

# Backup public assets
Copy-FilesWithProgress -Source ".\public" -Destination "$BackupFolder\public" -Description "Public assets"

# Backup individual important files
$ImportantFiles = @(
    "package.json",
    "package-lock.json",
    "bun.lockb",
    "vite.config.ts",
    "tailwind.config.ts",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "postcss.config.js",
    "eslint.config.js",
    "components.json",
    "index.html",
    ".gitignore",
    "README.md",
    "env.example",
    "env.sample"
)

foreach ($file in $ImportantFiles) {
    if (Test-Path ".\$file") {
        Copy-Item -Path ".\$file" -Destination "$BackupFolder\" -Force
        Write-Host "✓ Backed up $file" -ForegroundColor Green
    }
}

# Backup documentation files
$DocFiles = Get-ChildItem -Path "." -Filter "*.md" -Recurse | Where-Object { $_.Directory.Name -notmatch "node_modules|\.git|backups" }
foreach ($doc in $DocFiles) {
    $relativePath = $doc.FullName.Substring((Get-Location).Path.Length + 1)
    $backupPath = Join-Path $BackupFolder $relativePath
    $backupDir = Split-Path $backupPath -Parent
    
    if (!(Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    }
    
    Copy-Item -Path $doc.FullName -Destination $backupPath -Force
    Write-Host "✓ Backed up documentation: $relativePath" -ForegroundColor Green
}

# Backup utility scripts
$ScriptFiles = Get-ChildItem -Path "." -Filter "*.js" -Recurse | Where-Object { $_.Directory.Name -notmatch "node_modules|\.git|backups" }
foreach ($script in $ScriptFiles) {
    $relativePath = $script.FullName.Substring((Get-Location).Path.Length + 1)
    $backupPath = Join-Path $BackupFolder $relativePath
    $backupDir = Split-Path $backupPath -Parent
    
    if (!(Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    }
    
    Copy-Item -Path $script.FullName -Destination $backupPath -Force
    Write-Host "✓ Backed up script: $relativePath" -ForegroundColor Green
}

# Create backup manifest
$Manifest = @{
    ProjectName = $ProjectName
    BackupTimestamp = $Timestamp
    BackupLocation = $BackupFolder
    FilesBackedUp = @()
    ExcludedDirectories = @("node_modules", ".git", "dist", ".cursor", "backups", ".temp")
    SystemInfo = @{
        OS = $env:OS
        PowerShellVersion = $PSVersionTable.PSVersion.ToString()
        BackupDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
}

# Get file count
$FileCount = (Get-ChildItem -Path $BackupFolder -Recurse -File).Count
$Manifest.FileCount = $FileCount

# Save manifest
$ManifestPath = Join-Path $BackupFolder "backup-manifest.json"
$Manifest | ConvertTo-Json -Depth 10 | Out-File -FilePath $ManifestPath -Encoding UTF8

Write-Host "`n=== BACKUP COMPLETE ===" -ForegroundColor Green
Write-Host "Backup location: $BackupFolder" -ForegroundColor Yellow
Write-Host "Total files backed up: $FileCount" -ForegroundColor Yellow
Write-Host "Manifest saved to: $ManifestPath" -ForegroundColor Yellow
Write-Host "Backup size: $([math]::Round((Get-ChildItem -Path $BackupFolder -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB, 2)) MB" -ForegroundColor Yellow

# Create a compressed backup
$CompressedBackup = "$BackupPath\$ProjectName-backup-$Timestamp.zip"
Write-Host "`nCreating compressed backup..." -ForegroundColor Cyan

try {
    Compress-Archive -Path $BackupFolder -DestinationPath $CompressedBackup -Force
    Write-Host "✓ Compressed backup created: $CompressedBackup" -ForegroundColor Green
    
    # Clean up uncompressed folder
    Remove-Item -Path $BackupFolder -Recurse -Force
    Write-Host "✓ Cleaned up uncompressed backup folder" -ForegroundColor Green
    
    Write-Host "`n=== FINAL BACKUP SUMMARY ===" -ForegroundColor Green
    Write-Host "Compressed backup: $CompressedBackup" -ForegroundColor Yellow
    Write-Host "Compressed size: $([math]::Round((Get-Item $CompressedBackup).Length / 1MB, 2)) MB" -ForegroundColor Yellow
}
catch {
    Write-Host "✗ Error creating compressed backup: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Uncompressed backup remains at: $BackupFolder" -ForegroundColor Yellow
}
