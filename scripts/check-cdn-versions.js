#!/usr/bin/env node
// check-cdn-versions.js
// Detects if CDN versions in HTML files have drifted from cdn-dependencies.json.
// Run automatically as part of QA. Exits 1 if drift detected.
//
// WHEN DOES THIS FIRE?
//   If someone manually edits a CDN version in an HTML file without also
//   updating cdn-dependencies.json and recomputing the SRI hash.
//
// WHAT TO DO IF IT FIRES:
//   See docs/sri-update.md for the step-by-step process.

'use strict';
var fs   = require('fs');
var path = require('path');

var root     = path.join(__dirname, '..');
var manifest = JSON.parse(fs.readFileSync(path.join(root, 'cdn-dependencies.json'), 'utf8'));
var deps     = manifest.dependencies;

// Build a map of expected URLs from cdn-dependencies.json
var expected = {};
Object.keys(deps).forEach(function(name) {
  expected[deps[name].url] = { name: name, version: deps[name].version, integrity: deps[name].integrity };
});

// Walk all HTML files and extract CDN script src + integrity values
var htmlFiles = [];
function walk(dir) {
  fs.readdirSync(dir).forEach(function(f) {
    var full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (f.endsWith('.html')) htmlFiles.push(full);
  });
}
walk(root);

var errors = 0;
var warnings = 0;
var cdnPattern = /src="(https:\/\/cdnjs\.cloudflare\.com[^"]+)"\s*(?:integrity="([^"]*)")?\s*(?:crossorigin="[^"]*")?/g;

htmlFiles.forEach(function(f) {
  var rel = path.relative(root, f);
  var src = fs.readFileSync(f, 'utf8');
  var match;
  while ((match = cdnPattern.exec(src)) !== null) {
    var url       = match[1];
    var integrity = match[2] || '';
    var dep       = expected[url];

    if (!dep) {
      // URL not in cdn-dependencies.json — drift or unknown dependency
      console.warn('UNKNOWN CDN URL in ' + rel + ':\n  ' + url);
      console.warn('  Add it to cdn-dependencies.json and compute its SRI hash.');
      warnings++;
      continue;
    }

    if (!integrity) {
      console.error('MISSING integrity on ' + dep.name + ' in ' + rel);
      errors++;
      continue;
    }

    if (integrity !== dep.integrity) {
      console.error('HASH MISMATCH: ' + dep.name + ' in ' + rel);
      console.error('  HTML has:    ' + integrity);
      console.error('  Manifest has:' + dep.integrity);
      console.error('  → Run: node scripts/verify-cdn-deps.js for diagnosis');
      errors++;
    }
  }
});

if (errors === 0 && warnings === 0) {
  console.log('CDN version check: all ' + htmlFiles.length + ' HTML files consistent with cdn-dependencies.json');
} else {
  if (warnings > 0) console.warn(warnings + ' warning(s)');
  if (errors   > 0) {
    console.error('\n' + errors + ' error(s) — see docs/sri-update.md for how to fix');
    process.exit(1);
  }
}
