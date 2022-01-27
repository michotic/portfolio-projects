@echo off

:main
set NODE_ENV=production
node --max_old_space_size=4096 server.js
echo Server Closed
pause >nul
echo Press any key to reboot server...
goto main