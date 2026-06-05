@echo off
cd /d "%~dp0"
start "" "C:\Users\62588\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "%~dp0server.js"
timeout /t 1 >nul
start "" "http://127.0.0.1:8769/index.html"
