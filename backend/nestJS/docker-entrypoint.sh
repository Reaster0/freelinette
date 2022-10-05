#!/bin/bash
cd /app/nestJS
chmod -R 777 /root
echo "install dependencies"
npm install
./node_modules/.bin/cypress install
echo "dependencies installed"
chmod -R 777 /root
npm run start
#tail -f /dev/null