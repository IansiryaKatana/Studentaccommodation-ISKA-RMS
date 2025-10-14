@echo off
echo Adding files...
git add .

echo Committing changes...
git commit -m "feat: Add skeleton loaders to login and dashboard pages, configure Netlify secrets scanning"

echo Pushing to GitHub...
git push origin master

echo.
echo Done!
pause

