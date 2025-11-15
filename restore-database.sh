#!/bin/bash
# Script to restore the Dicta database to Docker container
# Usage: ./restore-database.sh <backup_file.sql>

echo "======================================"
echo "Dicta Database Restore Script"
echo "======================================"
echo ""

# Check if backup file was provided
if [ -z "$1" ]; then
    echo "ERROR: No backup file specified"
    echo "Usage: ./restore-database.sh <backup_file.sql>"
    echo ""
    echo "Example: ./restore-database.sh dicta_backup_20250115_143000.sql"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
    echo "ERROR: Backup file not found: ${BACKUP_FILE}"
    exit 1
fi

echo "Backup file: ${BACKUP_FILE}"
echo ""
echo "WARNING: This will replace all data in the database!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "${CONFIRM}" != "yes" ]; then
    echo ""
    echo "Restore cancelled."
    exit 0
fi

echo ""
echo "Restoring database..."
echo ""

# Restore the database by piping the SQL file into the container
cat "${BACKUP_FILE}" | docker exec -i dicta-db psql -U dicta -d dicta

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "SUCCESS: Database restored successfully!"
    echo "======================================"
    echo "The database has been restored from: ${BACKUP_FILE}"
else
    echo ""
    echo "======================================"
    echo "ERROR: Failed to restore database"
    echo "======================================"
    echo "Please make sure:"
    echo "- Docker is running"
    echo "- The dicta-db container is running"
    echo "- The backup file is valid"
    echo "- You have the correct permissions"
    exit 1
fi

echo ""
