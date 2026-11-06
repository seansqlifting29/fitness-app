#!/bin/sh
# Rebuild public/cloud.js from the Firebase SDK. Only needed when updating Firebase.
set -e
cd "$(dirname "$0")"
[ -d node_modules ] || npm install --no-save firebase@13 esbuild
npx esbuild entry.js --bundle --minify --format=iife --target=es2019 --legal-comments=none --outfile=../../public/firebase.js
