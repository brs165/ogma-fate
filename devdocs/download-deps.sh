#!/usr/bin/env bash
# Run once on a local machine with internet access to download React locally.
# After running, you can serve the app without CDN dependency on first load.
# The service worker will cache CDN copies for offline use regardless.
# RPGAwesome has been REMOVED (v91). No font downloads required.

set -e
DEST=assets/js

echo 'Downloading React 18.2.0...'
curl -o $DEST/react.production.min.js \
  https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js

echo 'Downloading ReactDOM 18.2.0...'
curl -o $DEST/react-dom.production.min.js \
  https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js

echo 'Downloading Dexie 4 (IDB wrapper)...'
curl -o $DEST/dexie.min.js \
  https://cdnjs.cloudflare.com/ajax/libs/dexie/4.0.1/dexie.min.js

echo 'Done. All dependencies are now local.'
ls -lh $DEST/
