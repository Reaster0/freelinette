#!/bin/bash
cd /app/nestJS
chmod -R 777 /root
npm install
./node_modules/.bin/cypress install
chmod -R 777 /root
npm run start:dev
#tail -f /dev/null