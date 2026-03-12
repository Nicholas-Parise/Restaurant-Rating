#!/bin/sh

# run forever
while true; do
  echo "$(date) Running scheduled SQL tasks..."

  # loop over all SQL files in /sql
  for sql_file in /sql/*.sql; do
    echo "Executing $sql_file"
    psql "$DATABASE_URL" -f "$sql_file"
  done

  echo "Done. Sleeping for 1 hour..."
  sleep 3600  # run every hour
done