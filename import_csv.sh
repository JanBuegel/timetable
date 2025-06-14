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

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is required but not installed." >&2
  exit 1
fi

WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT
CSV_TMP="$WORK_DIR/$(basename "$CSV_FILE")"

# mongoimport expects comma-separated CSV. Convert if necessary
sed 's/;/,/g' "$CSV_FILE" > "$CSV_TMP"

docker cp "$CSV_TMP" "$CONTAINER:/tmp/events.csv"
docker exec "$CONTAINER" mongoimport \
  --db open-flair \
  --collection events \
  --drop \
  --type csv \
  --file /tmp/events.csv \
  --headerline

echo "CSV import completed."
