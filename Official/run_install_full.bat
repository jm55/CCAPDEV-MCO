@echo off
cls

echo Installing dependencies
call npm install

echo Installing data...
node install_data.js

echo Copying public images: post
ROBOCOPY "%~dp0\.installation\img\post" "%~dp0\public\img\post"
echo Copying public images: dp
ROBOCOPY "%~dp0\.installation\img\dp" "%~dp0\public\img\dp"