#!/bin/bash
chown -R www-data:www-data /app/cypress
chown -R www-data:www-data /app/.cache
source /etc/apache2/envvars
# /app/cypress-runtime/node_modules/.bin/cypress install

echo "Starting Apache"
apache2 -D FOREGROUND
# tail -f /dev/null