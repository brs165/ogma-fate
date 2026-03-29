#!/bin/bash
set -e
YEAR=$(date +%Y)
MONTH=$(date +%m)
# Read current build number, increment
CURRENT=$(grep -oP "'\d+\.\d+\.\d+'" src/lib/version.js | tr -d "'")
if [ -z "$CURRENT" ]; then
  echo "ERROR: Could not read version from src/lib/version.js" >&2
  exit 1
fi
BUILD=$(echo "$CURRENT" | cut -d. -f3)
NEXT=$((BUILD + 1))
NEW="${YEAR}.${MONTH}.${NEXT}"
# Update version.js
sed -i "s/export const VERSION = .*/export const VERSION = '${NEW}';/" src/lib/version.js
# Update sw.js cache name
sed -i "s/const CACHE_NAME = .*/const CACHE_NAME = 'ogma-${NEW}';/" static/sw.js
# Update package.json (npm normalises leading-zero month, that's fine)
npm version "${YEAR}.${MONTH}.${NEXT}" --no-git-tag-version --allow-same-version 2>/dev/null
echo "Bumped: ${CURRENT} → ${NEW}"
# Commit so the bump is never lost to a later git checkout/reset
git add src/lib/version.js static/sw.js package.json
git commit -m "Bump version ${CURRENT} → ${NEW}"
