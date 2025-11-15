#!/bin/bash
# Script to dump the Dicta database from Docker container
# Usage: ./dump-database.sh

echo "======================================"
echo "Dicta Database Dump Script"
echo "======================================"
echo ""

# Set the output filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="dicta_backup_${TIMESTAMP}.sql"

echo "Creating database backup..."
echo "Output file: ${BACKUP_FILE}"
echo ""

# Run pg_dump inside the Docker container
docker exec -t dicta-db pg_dump -U dicta -d dicta --clean --if-exists > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "SUCCESS: Database dumped successfully!"
    echo "======================================"
    echo "File location: $(pwd)/${BACKUP_FILE}"
    echo ""
    echo "To restore this backup on another machine:"
    echo "1. Copy ${BACKUP_FILE} to the new machine"
    echo "2. Ensure Docker containers are running"
    echo "3. Run: ./restore-database.sh ${BACKUP_FILE}"
else
    echo ""
    echo "======================================"
    echo "ERROR: Failed to dump database"
    echo "======================================"
    echo "Please make sure:"
    echo "- Docker is running"
    echo "- The dicta-db container is running"
    echo "- You have the correct permissions"
    exit 1
fi

echo ""
