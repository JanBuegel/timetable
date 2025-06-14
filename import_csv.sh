#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: $0 <csv-file> [mongo-container]" >&2
  exit 1
fi

CSV_FILE="$1"
CONTAINER="${2:-mongo}"

if [[ ! -f "$CSV_FILE" ]]; then
  echo "CSV file $CSV_FILE does not exist." >&2
  exit 1
fi

for cmd in csvjson jq docker; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Error: $cmd is required but not installed." >&2
    exit 1
  fi
done

WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT
JSON_FILE="$WORK_DIR/events.json"

# Convert CSV (semicolon separated) to JSON and fix time field
csvjson -d ';' "$CSV_FILE" > "$JSON_FILE"
jq 'map(.time |= sub("^0:"; ""))' "$JSON_FILE" > "$JSON_FILE.tmp" && mv "$JSON_FILE.tmp" "$JSON_FILE"

# Copy file into container and import

docker cp "$JSON_FILE" "$CONTAINER:/tmp/events.json"
docker exec "$CONTAINER" mongoimport --db open-flair --collection events --drop --file /tmp/events.json --jsonArray

echo "Import completed successfully."
