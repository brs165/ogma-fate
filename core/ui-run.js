// ui-run.js — REMOVED v2026.03.330
// run.html is a JS redirect to board.html?mode=play (v306).
// RunApp, RunCanvas, createSync, and all run-session components
// were never loaded after v306. Dead code confirmed by grep:
//   grep -r 'ui-run.js' campaigns/ sw.js  → no results
//   grep -r 'createSync' core/ → only self-references within this file
// createTableSync() in ui.js is the live equivalent.
// If restoring: git checkout core/ui-run.js

