#!/bin/bash
mkdir /cypress
chown -R 1000:1000 /cypress
export CYPRESS_CACHE_FOLDER=/cypress/.cache
/app/cypress-runtime/node_modules/.bin/cypress install
# chown -R root.root /root/.cache/Cypress

tail -f /dev/null