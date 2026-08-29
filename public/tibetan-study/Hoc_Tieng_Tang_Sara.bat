@echo off
chcp 65001 > nul
cd /d "%~dp0"
start /b python server.py 8769 > nul 2>&1
ping 127.0.0.1 -n 2 > nul
start http://localhost:8769
exit
