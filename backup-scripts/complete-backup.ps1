# Complete System Backup Script for iska-RMS
# This script performs both codebase and database backups

param(
    [string]$BackupPath = ".\backups",
    [string]$ProjectName = "iska-RMS",
    [switch]$CodebaseOnly,
    [switch]$DatabaseOnly,
    [switch]$SkipCompression
)

# Create timestamp for backup
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$CompleteBackupFolder = "$BackupPath\$ProjectName-complete-backup-$Timestamp"

Write-Host "🚀 Starting complete system backup for $ProjectName..." -ForegroundColor Green
Write-Host "📅 Backup timestamp: $Timestamp" -ForegroundColor Yellow
Write-Host "📁 Complete backup location: $CompleteBackupFolder" -ForegroundColor Yellow

# Create main backup directory
if (!(Test-Path $CompleteBackupFolder)) {
    New-Item -ItemType Directory -Path $CompleteBackupFolder -Force | Out-Null
    Write-Host "✅ Created complete backup directory" -ForegroundColor Green
}

# Function to run backup with error handling
function Invoke-BackupWithErrorHandling {
    param(
        [string]$BackupType,
        [string]$ScriptPath,
        [string]$Arguments
    )
    
    Write-Host "`n🔄 Starting $BackupType backup..." -ForegroundColor Cyan
    
    try {
        if ($ScriptPath -like "*.ps1") {
            $result = & powershell -ExecutionPolicy Bypass -File $ScriptPath $Arguments
        } else {
            $result = & node $ScriptPath
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $BackupType backup completed successfully" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $BackupType backup failed with exit code: $LASTEXITCODE" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Error running $BackupType backup: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to copy backup results
function Copy-BackupResults {
    param(
        [string]$SourcePath,
        [string]$DestinationPath,
        [string]$BackupType
    )
    
    if (Test-Path $SourcePath) {
        try {
            Copy-Item -Path $SourcePath -Destination $DestinationPath -Recurse -Force
            Write-Host "✅ $BackupType backup copied to complete backup folder" -ForegroundColor Green
            return $true
        }
        catch {
            Write-Host "❌ Error copying $BackupType backup: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
    else {
        Write-Host "⚠️  $BackupType backup not found at: $SourcePath" -ForegroundColor Yellow
        return $false
    }
}

# Initialize backup tracking
$BackupResults = @{
    CodebaseBackup = $false
    DatabaseBackup = $false
    StartTime = Get-Date
    EndTime = $null
    Errors = @()
}

# Perform codebase backup
if (!$DatabaseOnly) {
    Write-Host "`n📁 === CODEBASE BACKUP ===" -ForegroundColor Magenta
    
    $CodebaseBackupArgs = "-BackupPath `"$BackupPath\codebase`" -ProjectName `"$ProjectName`""
    if ($SkipCompression) {
        $CodebaseBackupArgs += " -SkipCompression"
    }
    
    $CodebaseSuccess = Invoke-BackupWithErrorHandling -BackupType "Codebase" -ScriptPath ".\backup-scripts\backup-codebase.ps1" -Arguments $CodebaseBackupArgs
    
    if ($CodebaseSuccess) {
        # Find the latest codebase backup
        $CodebaseBackups = Get-ChildItem -Path "$BackupPath\codebase" -Filter "$ProjectName-backup-*.zip" | Sort-Object LastWriteTime -Descending
        if ($CodebaseBackups.Count -gt 0) {
            $LatestCodebaseBackup = $CodebaseBackups[0].FullName
            $CodebaseBackupResults = Copy-BackupResults -SourcePath $LatestCodebaseBackup -Destination "$CompleteBackupFolder\codebase-backup.zip" -BackupType "Codebase"
            $BackupResults.CodebaseBackup = $CodebaseBackupResults
        }
    } else {
        $BackupResults.Errors += "Codebase backup failed"
    }
}

# Perform database backup
if (!$CodebaseOnly) {
    Write-Host "`n🗄️  === DATABASE BACKUP ===" -ForegroundColor Magenta
    
    # Check if Node.js is available
    try {
        $nodeVersion = & node --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
        } else {
            throw "Node.js not found"
        }
    }
    catch {
        Write-Host "❌ Node.js is required for database backup but not found" -ForegroundColor Red
        Write-Host "   Please install Node.js and try again" -ForegroundColor Yellow
        $BackupResults.Errors += "Node.js not available for database backup"
    }
    
    if ($BackupResults.Errors -notcontains "Node.js not available for database backup") {
        # Check if required dependencies are installed
        if (!(Test-Path "node_modules")) {
            Write-Host "📦 Installing required dependencies..." -ForegroundColor Yellow
            try {
                & npm install
                if ($LASTEXITCODE -ne 0) {
                    throw "Failed to install dependencies"
                }
                Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
            }
            catch {
                Write-Host "❌ Error installing dependencies: $($_.Exception.Message)" -ForegroundColor Red
                $BackupResults.Errors += "Failed to install dependencies"
            }
        }
        
        if ($BackupResults.Errors -notcontains "Failed to install dependencies") {
            $DatabaseSuccess = Invoke-BackupWithErrorHandling -BackupType "Database" -ScriptPath ".\backup-scripts\backup-database.js" -Arguments ""
            
            if ($DatabaseSuccess) {
                # Find the latest database backup
                $DatabaseBackups = Get-ChildItem -Path "$BackupPath\database" -Filter "$ProjectName-db-backup-*" | Sort-Object LastWriteTime -Descending
                if ($DatabaseBackups.Count -gt 0) {
                    $LatestDatabaseBackup = $DatabaseBackups[0].FullName
                    $DatabaseBackupResults = Copy-BackupResults -SourcePath $LatestDatabaseBackup -Destination "$CompleteBackupFolder\database-backup" -BackupType "Database"
                    $BackupResults.DatabaseBackup = $DatabaseBackupResults
                }
            } else {
                $BackupResults.Errors += "Database backup failed"
            }
        }
    }
}

# Create complete backup manifest
$BackupResults.EndTime = Get-Date
$BackupDuration = $BackupResults.EndTime - $BackupResults.StartTime

$CompleteManifest = @{
    ProjectName = $ProjectName
    BackupTimestamp = $Timestamp
    CompleteBackupLocation = $CompleteBackupFolder
    BackupDuration = $BackupDuration.TotalSeconds
    BackupResults = $BackupResults
    SystemInfo = @{
        OS = $env:OS
        PowerShellVersion = $PSVersionTable.PSVersion.ToString()
        NodeVersion = (try { & node --version 2>$null } catch { "Not available" })
        BackupDate = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        DatabaseOnly = $DatabaseOnly
        SkipCompression = $SkipCompression
    }
}

# Save complete manifest
$CompleteManifestPath = Join-Path $CompleteBackupFolder "complete-backup-manifest.json"
$CompleteManifest | ConvertTo-Json -Depth 10 | Out-File -FilePath $CompleteManifestPath -Encoding UTF8

# Create compressed complete backup
if (!$SkipCompression) {
    Write-Host "`n🗜️  Creating compressed complete backup..." -ForegroundColor Cyan
    
    $CompressedCompleteBackup = "$BackupPath\$ProjectName-complete-backup-$Timestamp.zip"
    
    try {
        Compress-Archive -Path $CompleteBackupFolder -DestinationPath $CompressedCompleteBackup -Force
        Write-Host "✅ Compressed complete backup created: $CompressedCompleteBackup" -ForegroundColor Green
        
        # Clean up uncompressed folder
        Remove-Item -Path $CompleteBackupFolder -Recurse -Force
        Write-Host "✅ Cleaned up uncompressed backup folder" -ForegroundColor Green
        
        $FinalBackupPath = $CompressedCompleteBackup
    }
    catch {
        Write-Host "❌ Error creating compressed backup: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Uncompressed backup remains at: $CompleteBackupFolder" -ForegroundColor Yellow
        $FinalBackupPath = $CompleteBackupFolder
    }
} else {
    $FinalBackupPath = $CompleteBackupFolder
}

# Final summary
Write-Host "`n🎉 === COMPLETE BACKUP SUMMARY ===" -ForegroundColor Green
Write-Host "📁 Final backup location: $FinalBackupPath" -ForegroundColor Yellow
Write-Host "⏱️  Total backup duration: $([math]::Round($BackupDuration.TotalMinutes, 2)) minutes" -ForegroundColor Yellow

if ($BackupResults.CodebaseBackup) {
    Write-Host "✅ Codebase backup: SUCCESS" -ForegroundColor Green
} else {
    Write-Host "❌ Codebase backup: FAILED" -ForegroundColor Red
}

if ($BackupResults.DatabaseBackup) {
    Write-Host "✅ Database backup: SUCCESS" -ForegroundColor Green
} else {
    Write-Host "❌ Database backup: FAILED" -ForegroundColor Red
}

if ($BackupResults.Errors.Count -gt 0) {
    Write-Host "`n⚠️  Errors encountered:" -ForegroundColor Yellow
    foreach ($err in $BackupResults.Errors) {
        Write-Host "   • $err" -ForegroundColor Red
    }
}

# Calculate final backup size
if (Test-Path $FinalBackupPath) {
    $BackupSize = (Get-ChildItem -Path $FinalBackupPath -Recurse | Measure-Object -Property Length -Sum).Sum
    $BackupSizeMB = [math]::Round($BackupSize / 1MB, 2)
    Write-Host "💾 Final backup size: $BackupSizeMB MB" -ForegroundColor Yellow
}

Write-Host "`n📋 Backup manifest saved to: $CompleteManifestPath" -ForegroundColor Cyan

# Clean up individual backup folders (keep only the complete backup)
if (!$SkipCompression) {
    Write-Host "`n🧹 Cleaning up individual backup folders..." -ForegroundColor Cyan
    
    $IndividualBackupFolders = @("$BackupPath\codebase", "$BackupPath\database")
    foreach ($folder in $IndividualBackupFolders) {
        if (Test-Path $folder) {
            try {
                Remove-Item -Path $folder -Recurse -Force
                Write-Host "✅ Cleaned up: $folder" -ForegroundColor Green
            }
            catch {
                Write-Host "⚠️  Could not clean up: $folder" -ForegroundColor Yellow
            }
        }
    }
}

Write-Host "`n🎯 Backup process completed!" -ForegroundColor Green
