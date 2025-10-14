# Disable git pager
$env:GIT_PAGER = 'cat'

Write-Host "Adding files..." -ForegroundColor Cyan
git add .

Write-Host "Committing..." -ForegroundColor Cyan
git commit -m "feat: Add skeleton loaders and disable Netlify secrets scanning"

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push origin master

Write-Host "Done!" -ForegroundColor Green

