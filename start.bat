@echo off
cd /d "%~dp0"
echo ========================================
echo    Serein Blog Dev Server
echo    Open in browser: http://localhost:3000
echo ========================================
echo.
pnpm exec astro dev --host 0.0.0.0
pause
