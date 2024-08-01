#!/bin/bash

# Überprüfen, ob die Container-ID und der CSV-Dateiname als Argumente übergeben wurden
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <docker-container-id> <csv-file>"
  exit 1
fi

DOCKER_CONTAINER_ID=$1
CSV_FILE=$2
CONTAINER_PATH="/data/$CSV_FILE"

# Überprüfen, ob die CSV-Datei existiert
if [ ! -f "$CSV_FILE" ]; then
  echo "CSV file $CSV_FILE does not exist."
  exit 1
fi

# CSV-Datei in den Docker-Container kopieren
docker cp $CSV_FILE $DOCKER_CONTAINER_ID:$CONTAINER_PATH

# CSV-Datei in die MongoDB in Docker importieren
docker exec -i $DOCKER_CONTAINER_ID mongoimport --db open-flair --collection events --drop --type csv --headerline --file $CONTAINER_PATH --columnsHaveTypes

echo "Import completed."

# Überprüfen, ob der Import erfolgreich war
IMPORT_COUNT=$(docker exec -i $DOCKER_CONTAINER_ID mongosh --quiet --eval "db.getSiblingDB('open-flair').events.countDocuments()")

if [ "$IMPORT_COUNT" -gt 0 ]; then
  echo "Import verification successful: $IMPORT_COUNT records imported."
else
  echo "Import verification failed: No records found in the database."
fi

# Beispiel für das Abrufen und Anzeigen von Daten
docker exec -i $DOCKER_CONTAINER_ID mongosh --quiet --eval "db.getSiblingDB('open-flair').events.find().limit(5).pretty()"
