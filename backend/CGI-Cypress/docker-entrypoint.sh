#!/bin/bash
chown -R www-data:www-data /app/cypress
chown -R www-data:www-data /app/.cache
source /etc/apache2/envvars

echo "Starting Apache"
apache2 -D FOREGROUND
#tail -f /dev/null