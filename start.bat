@echo off
echo Starting NEXUS Store...
echo.
echo [1/2] Starting Backend (port 5000)...
start "NEXUS Backend" cmd /k "cd backend && npm install && npm run dev"
timeout /t 3 >nul
echo [2/2] Starting Frontend (port 5173)...
start "NEXUS Frontend" cmd /k "cd frontend && npm install && npm run dev"
echo.
echo Store running at: http://localhost:5173
echo Admin panel at:   http://localhost:5173/admin
echo.
pause
