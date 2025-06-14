# Timetable Application

This app uses a Ruby Sinatra backend with PostgreSQL for data storage and a React frontend served from the same server.

## Running locally

Use Docker Compose to run the app and database:

```bash
docker-compose up --build
```

The web server will be accessible on `http://localhost:4567`.

## Importing CSV Data

To add events from a CSV file, run the import script inside the web service container:

```bash
docker-compose run web ruby bin/import_csv.rb path/to/events.csv
```

The CSV should contain the headers `name`, `date`, `time`, and `stage`.
