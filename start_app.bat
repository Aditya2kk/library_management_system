@echo off
echo Starting Library Management System...

echo Starting Spring Boot Backend Server (Port 8080)...
start "Library Backend (8080)" cmd /k "cd /d %~dp0library_management_system && mvn spring-boot:run"

echo Starting React Frontend Server (Port 5173)...
start "Library Frontend (5173)" cmd /k "cd /d %~dp0library-management-frontend && set PATH=%~dp0node-env\node-v20.18.0-win-x64;%%PATH%% && npm run dev"

echo Application launched! You can view it at http://localhost:5173
