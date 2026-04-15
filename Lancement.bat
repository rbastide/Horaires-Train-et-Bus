@echo off
title Lancement du site
setlocal

REM Racine du projet = dossier où se trouve ce fichier .bat
set "ROOT=%~dp0"
set "HOURS=%ROOT%src/"
set "FRONT_PORT=5500"
set "FRONT_FILE=Hours.html"

REM ===== BACKEND =====
start "Backend" cmd /k "cd /d "%ROOT%src\BackEnd" && node server.js"

REM Petite pause pour laisser le back démarrer
timeout /t 2 /nobreak >nul

REM ===== FRONTEND =====
start "Frontend" cmd /k "cd /d "%HOURS%" && npx live-server --port=%FRONT_PORT% --open=%FRONT_FILE%"

exit
