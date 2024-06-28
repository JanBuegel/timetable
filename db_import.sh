#!/bin/bash

# Überprüfen, ob die Container-ID als Argument übergeben wurde
if [ -z "$1" ]; then
  echo "Usage: $0 <docker-container-id>"
  exit 1
fi

DOCKER_CONTAINER_ID=$1
JSON_FILE="of_artists.json"

# Überprüfen, ob die JSON-Datei existiert
if [ ! -f "$JSON_FILE" ]; then
  echo "JSON file $JSON_FILE does not exist."
  exit 1
fi

# JSON-Datei in die MongoDB in Docker importieren
docker exec -i $DOCKER_CONTAINER_ID mongoimport --db open-flair --collection artists --drop --file /data/$JSON_FILE --jsonArray

echo "Import completed."
