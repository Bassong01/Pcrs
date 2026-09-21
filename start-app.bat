@echo off
setlocal
cd /d "%~dp0"

echo Starting National Criminal Records...
start "PCRS Server" /D "%~dp0server" cmd /k npm start
start "PCRS Client" /D "%~dp0server\client" cmd /k npm run dev -- --host 127.0.0.1 --port 5173
timeout /t 3 /nobreak >nul
start "" http://localhost:5173/

endlocal
