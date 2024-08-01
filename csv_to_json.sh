#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <input_csv_file> <output_json_file>"
    exit 1
fi

INPUT_CSV=$1
OUTPUT_JSON=$2

# Überprüfen, ob csvkit installiert ist
if ! command -v csvjson &> /dev/null; then
    echo "csvkit is not installed. Installing csvkit..."
    pip install csvkit
fi

# Konvertiere CSV in JSON
TEMP_JSON=$(mktemp)
csvjson $INPUT_CSV > $TEMP_JSON

# Korrigiere das Zeitformat in JSON
jq 'map(.time |= sub("^0:"; ""))' $TEMP_JSON > $OUTPUT_JSON

# Entferne die temporäre Datei
rm $TEMP_JSON

echo "JSON file has been created at $OUTPUT_JSON"
