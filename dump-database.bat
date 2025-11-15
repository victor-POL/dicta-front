@echo off
REM Script to dump the Dicta database from Docker container
REM Usage: dump-database.bat

echo ======================================
echo Dicta Database Dump Script
echo ======================================
echo.

REM Set the output filename with timestamp
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_FILE=dicta_backup_%TIMESTAMP%.sql

echo Creating database backup...
echo Output file: %BACKUP_FILE%
echo.

REM Run pg_dump inside the Docker container
docker exec -t dicta-db pg_dump -U dicta -d dicta --clean --if-exists > %BACKUP_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================
    echo SUCCESS: Database dumped successfully!
    echo ======================================
    echo File location: %cd%\%BACKUP_FILE%
    echo.
    echo To restore this backup on another machine:
    echo 1. Copy %BACKUP_FILE% to the new machine
    echo 2. Ensure Docker containers are running
    echo 3. Run: restore-database.bat %BACKUP_FILE%
) else (
    echo.
    echo ======================================
    echo ERROR: Failed to dump database
    echo ======================================
    echo Please make sure:
    echo - Docker is running
    echo - The dicta-db container is running
    echo - You have the correct permissions
)

echo.
pause
