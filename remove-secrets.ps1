# Remove files with secrets from Git tracking

# Individual files
$files = @(
    "env.sample",
    "database_dump_data.sql",
    "CONSOLE_ERRORS_FIXED.md",
    "WEBHOOK_SETUP_GUIDE.md",
    "check-users.js",
    "create-admin-user.js",
    "create-admin.js",
    "create-auth-users.js",
    "create-storage-buckets-with-service-role.js",
    "fix-admin-user.js",
    "fix-user-profile.js",
    "quick-fix.js",
    "simple-auth-fix.js",
    "sync-users-to-auth.js",
    "wordpress-webhook.html",
    "final-wpforms-webhook.php",
    "student-booking-webhook.php",
    "viewing-booking-webhook.php",
    "wordpress-webhook.php"
)

# Directories
$directories = @(
    "backups",
    "dist",
    "public/api"
)

Write-Host "Removing files from Git tracking..." -ForegroundColor Yellow

foreach ($file in $files) {
    if (Test-Path $file) {
        git rm --cached $file 2>$null
        if ($?) {
            Write-Host "✓ Removed: $file" -ForegroundColor Green
        }
    }
}

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        git rm --cached -r $dir 2>$null
        if ($?) {
            Write-Host "✓ Removed: $dir" -ForegroundColor Green
        }
    }
}

Write-Host "`nDone! Files removed from Git tracking." -ForegroundColor Cyan
Write-Host "They will remain on your local filesystem but won't be pushed to GitHub." -ForegroundColor Cyan

