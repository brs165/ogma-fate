#!/usr/bin/env bash
# bump-version.sh — Ogma Fate Condensed Generator Suite
# BL-17: CalVer — YYYY.MM.B  (no argument needed)
#
# What it does:
#   1. Auto-detects today's date (YYYY.MM)
#   2. Reads current version from sw.js — increments build counter
#      within same month, or resets to 1 on a new month
#   3. Stamps all HTML asset refs with ?v=B (short build integer)
#   4. Updates sw.js CACHE_NAME to fate-generator-YYYY.MM.B
#   5. Updates about.html version badge and cache label
#   6. Prints summary and recommended zip filename
#
# Usage:
#   bash bump-version.sh
#
# Optional — update OG meta URLs at the same time:
#   bash bump-version.sh username repo-name

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# ── Determine CalVer ─────────────────────────────────────────────────────
YEAR=$(date +%Y)
MONTH=$(date +%m)
YM="${YEAR}.${MONTH}"

CURRENT=$(grep 'var CACHE_NAME' "$ROOT/sw.js" | grep -o "fate-generator-[^'\"]*" | head -1)
CURRENT_YM=$(echo "$CURRENT" | grep -oE '[0-9]{4}\.[0-9]{2}' | head -1)
CURRENT_B=$(echo "$CURRENT" | grep -oE '[0-9]{4}\.[0-9]{2}\.([0-9]+)' | sed 's/.*\.//')

if [ "$CURRENT_YM" = "$YM" ] && [ -n "$CURRENT_B" ]; then
  NEW_B=$(( CURRENT_B + 1 ))
else
  NEW_B=1
fi

NEW_VER="${YM}.${NEW_B}"
CACHE_NAME="fate-generator-${NEW_VER}"

echo "=== Ogma CalVer bump ==="
echo "    Previous : ${CURRENT:-unknown}"
echo "    New      : ${CACHE_NAME}"
echo ""

# ── Stamp ?v= in all HTML files ──────────────────────────────────────────
HTML_FILES=$(find "$ROOT" -name "*.html" -not -path "*/node_modules/*")

echo "=== Stamping assets with ?v=${NEW_B} ==="
for f in $HTML_FILES; do
  sed -i \
    -e 's|\(href="\.\./assets/css/theme\.css\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(href="assets/css/theme\.css\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./core/engine\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./core/ui-primitives\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./core/ui-renderers\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./core/ui-table\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./core/ui-run\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./core/ui-modals\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./core/ui-landing\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./core/ui\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./core/ui-board\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./core/db\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./core/intro\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="core/engine\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="core/ui-primitives\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="core/ui-renderers\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="core/ui-table\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="core/ui-modals\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="core/ui-landing\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="core/ui\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="core/db\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="core/intro\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="core/assets/js/dice-roller\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./assets/js/dice-roller\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./data/[a-zA-Z0-9_-]*\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="data/[a-zA-Z0-9_-]*\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(href="\.\./assets/css/campaigns/theme-[a-zA-Z0-9_-]*\.css\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(src="\.\./assets/js/help-shared\.js\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    -e 's|\(href="\.\./assets/css/help-shared\.css\)\(?v=[^"]*\)\?"|\1?v='"${NEW_B}"'"|g' \
    "$f"
  # Stamp SPA router inline var v — prevents campaign links loading stale scripts
  sed -i "s|var v = '?v=[^']*'; // stamped by bump-version.sh|var v = '?v=${NEW_B}'; // stamped by bump-version.sh|g" "$f"
  echo "  ✓ $(basename $f)"
done

echo ""
echo "=== Updating sw.js CACHE_NAME to ${CACHE_NAME} ==="
sed -i "s|var CACHE_NAME = '[^']*'|var CACHE_NAME = '${CACHE_NAME}'|g" "$ROOT/sw.js"
echo "  ✓ sw.js"

echo ""
echo "=== Updating config.js VERSION to ${NEW_VER} ==="
sed -i "s|VERSION: '[^']*'|VERSION: '${NEW_VER}'|g" "$ROOT/core/config.js"
echo "  ✓ config.js"

echo ""
echo "=== Updating about.html version block to ${NEW_VER} ==="
sed -i \
  -e 's|<span class="about-version-badge">[^<]*</span>|<span class="about-version-badge">'"${NEW_VER}"'</span>|g' \
  -e 's|Cache: <code>fate-generator-[^<]*</code>|Cache: <code>'"${CACHE_NAME}"'</code>|g' \
  "$ROOT/about.html"
echo "  ✓ about.html"

echo "=== Updating index.html title version to ${NEW_VER} ==="
sed -i 's|<title>Ogma v[0-9.]*|<title>Ogma v'"${NEW_VER}"'|' "$ROOT/index.html"
echo "  ✓ index.html title"

# ── OG meta URLs — canonical domain is ogma.net (migrated from github.io) ───
# No update needed. All og:url and canonical refs point to https://ogma.net.
# If you need to override for a fork, manually update the HTML files.

# ── about.html download link — now points to GitHub, not a zip filename ─────────
# about.html download button uses href="https://github.com/brs165/ogma-fate"
# and label "Visit GitHub Repo". Do NOT overwrite with zip filename.
# The bump-version.sh no longer mutates this button.
echo ""
echo "(about.html download link: GitHub repo — no update needed)"

echo ""
echo "=== Done ==="
echo "    Version : ${NEW_VER}"
echo "    Cache   : ${CACHE_NAME}"
echo "    Zip as  : fate-generator-${NEW_VER}.zip"
