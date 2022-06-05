@echo off
cls

echo Installing dependencies
call npm install

echo Installing data...
node install_onlycollections.js