@echo off
echo Killing any stuck backend servers on port 8000...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :8000') DO taskkill /PID %%T /F

echo.
echo Starting fresh backend server...
cd c:\Users\NAVEEN\Desktop\sip\finclusion-ai-2\backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
