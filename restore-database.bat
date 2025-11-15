@echo off
REM Script to restore the Dicta database to Docker container
REM Usage: restore-database.bat <backup_file.sql>

echo ======================================
echo Dicta Database Restore Script
echo ======================================
echo.

REM Check if backup file was provided
if "%~1"=="" (
    echo ERROR: No backup file specified
    echo Usage: restore-database.bat ^<backup_file.sql^>
    echo.
    echo Example: restore-database.bat dicta_backup_20250115_143000.sql
    pause
    exit /b 1
)

set BACKUP_FILE=%~1

REM Check if backup file exists
if not exist "%BACKUP_FILE%" (
    echo ERROR: Backup file not found: %BACKUP_FILE%
    pause
    exit /b 1
)

echo Backup file: %BACKUP_FILE%
echo.
echo WARNING: This will replace all data in the database!
echo.
set /p CONFIRM="Are you sure you want to continue? (yes/no): "

if /i not "%CONFIRM%"=="yes" (
    echo.
    echo Restore cancelled.
    pause
    exit /b 0
)

echo.
echo Restoring database...
echo.

REM Restore the database by piping the SQL file into the container
type "%BACKUP_FILE%" | docker exec -i dicta-db psql -U dicta -d dicta

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================
    echo SUCCESS: Database restored successfully!
    echo ======================================
    echo The database has been restored from: %BACKUP_FILE%
) else (
    echo.
    echo ======================================
    echo ERROR: Failed to restore database
    echo ======================================
    echo Please make sure:
    echo - Docker is running
    echo - The dicta-db container is running
    echo - The backup file is valid
    echo - You have the correct permissions
)

echo.
pause
