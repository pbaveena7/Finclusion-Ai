@echo off
title Finclusion AI - Python Backend Setup
color 0A

echo.
echo ============================================================
echo   FINCLUSION AI 2.0 - PYTHON BACKEND AUTO-INSTALLER
echo ============================================================
echo.

REM Try to find python in common locations
SET PYTHON_CMD=
IF EXIST "C:\Python312\python.exe" SET PYTHON_CMD=C:\Python312\python.exe
IF EXIST "C:\Python311\python.exe" SET PYTHON_CMD=C:\Python311\python.exe
IF EXIST "C:\Python310\python.exe" SET PYTHON_CMD=C:\Python310\python.exe
IF EXIST "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" SET PYTHON_CMD=%LOCALAPPDATA%\Programs\Python\Python312\python.exe
IF EXIST "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" SET PYTHON_CMD=%LOCALAPPDATA%\Programs\Python\Python311\python.exe

IF "%PYTHON_CMD%"=="" (
    echo [ERROR] Python not found in common locations.
    echo.
    echo Please download Python from: https://www.python.org/downloads/
    echo IMPORTANT: Check "Add Python to PATH" during installation!
    echo.
    pause
    exit /b 1
)

echo [OK] Found Python at: %PYTHON_CMD%
echo.

REM Navigate to backend folder
cd /d "%~dp0"
echo [INFO] Working directory: %CD%
echo.

REM Upgrade pip
echo [1/4] Upgrading pip...
"%PYTHON_CMD%" -m pip install --upgrade pip --quiet
echo [OK] pip upgraded.
echo.

REM Install requirements
echo [2/4] Installing backend dependencies from requirements.txt...
"%PYTHON_CMD%" -m pip install -r requirements.txt --quiet
IF ERRORLEVEL 1 (
    echo [ERROR] Failed to install requirements. Check requirements.txt
    pause
    exit /b 1
)
echo [OK] Dependencies installed.
echo.

REM Verify FastAPI installed
echo [3/4] Verifying FastAPI and Uvicorn...
"%PYTHON_CMD%" -c "import fastapi; import uvicorn; print('[OK] FastAPI', fastapi.__version__, 'and Uvicorn ready!')"
echo.

REM Start the server
echo [4/4] Starting Finclusion AI Backend Server on http://127.0.0.1:8000 ...
echo.
echo ============================================================
echo   Backend API: http://127.0.0.1:8000
echo   API Docs:    http://127.0.0.1:8000/docs
echo   Frontend:    http://localhost:5173
echo ============================================================
echo.
echo Press CTRL+C to stop the server.
echo.

"%PYTHON_CMD%" -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

pause
