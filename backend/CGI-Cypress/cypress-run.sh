#!/bin/bash
printf "Content-type: text/html\n\n"

cd /app
export CYPRESS_CACHE_FOLDER=/app/.cache
./node_modules/.bin/cypress run