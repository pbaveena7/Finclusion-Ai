@echo off
title Finclusion AI Project Launcher
echo ======================================================
echo           Starting Finclusion AI Full Stack
echo ======================================================
echo.

echo [1/2] Starting Backend Server (Port 8000)...
start "Finclusion Backend (FastAPI)" cmd /k "cd /d c:\Users\NAVEEN\Desktop\sip\finclusion-ai-2\backend && FOR /F \"tokens=5\" %%T IN ('netstat -a -n -o ^| findstr :8000') DO taskkill /PID %%T /F >nul 2>&1 & .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"

echo [2/2] Starting Frontend Server (Port 5173)...
start "Finclusion Frontend (Vite)" cmd /k "cd /d c:\Users\NAVEEN\Desktop\sip\finclusion-ai-2\frontend && npm run dev"

echo.
echo ======================================================
echo Done! Both services are launching in dedicated windows.
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo ======================================================
echo You can keep this launcher or close it anytime.
ping 127.0.0.1 -n 4 >nul 2>&1
