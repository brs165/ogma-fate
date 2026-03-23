#!/usr/bin/env node
/**
 * Ogma build pipeline — 3 tiers, auto-detected.
 *
 * Tier 3 (no deps, always available):
 *   Concatenates 8 core JS files → dist/ogma.core.min.js
 *   Rewrites campaign HTML: 12 core script tags → 1 bundle tag
 *   ~14% savings from eliminating per-request overhead
 *
 * Tier 2 (esbuild available):
 *   Tier 3 output piped through esbuild minify → dist/ogma.core.min.js
 *   ~40% savings
 *
 * Tier 1 (terser available):
 *   Tier 3 concat piped through terser → dist/ogma.core.min.js
 *   ~55% savings
 *
 * Usage:
 *   node scripts/build.js          # auto-detect tier
 *   node scripts/build.js --tier 3 # force tier 3
 *
 * Install deps for Tier 1/2:
 *   npm install
 */

'use strict';

var fs   = require('fs');
var path = require('path');
var root = path.resolve(__dirname, '..');

// ── Core JS files in load order ───────────────────────────────────────────────
var CORE_FILES = [
  'core/config.js',
  'core/engine.js',
  'core/ui-primitives.js',
  'core/ui-renderers.js',
  'core/ui-table.js',
  'core/ui-modals.js',
  'core/ui-landing.js',
  'core/ui.js',
];

// Script tags replaced by a single bundle tag in campaign HTML
// (data files, CDN, and intro are kept as-is)
var BUNDLE_REPLACES = [
  /core\/config\.js/,
  /core\/engine\.js/,
  /core\/ui-primitives\.js/,
  /core\/ui-renderers\.js/,
  /core\/ui-table\.js/,
  /core\/ui-modals\.js/,
  /core\/ui-landing\.js/,
  /core\/ui\.js/,
  /core\/db\.js/,
];

var CAMPAIGN_PAGES = [
  'campaigns/thelongafter.html',
  'campaigns/cyberpunk.html',
  'campaigns/fantasy.html',
  'campaigns/space.html',
  'campaigns/victorian.html',
  'campaigns/postapoc.html',
  'campaigns/western.html',
  'campaigns/dVentiRealm.html',
  'campaigns/character-creation.html',
];

// ── Detect tier ───────────────────────────────────────────────────────────────
function detectTier(forceTier) {
  if (forceTier) return parseInt(forceTier, 10);
  try { require.resolve('terser');  return 1; } catch (e) { /* no terser */ }
  try { require.resolve('esbuild'); return 2; } catch (e) { /* no esbuild */ }
  return 3;
}

// ── Concat ────────────────────────────────────────────────────────────────────
function concat() {
  return CORE_FILES.map(function(f) {
    var src = fs.readFileSync(path.join(root, f), 'utf8');
    return '/* === ' + f + ' === */\n' + src;
  }).join('\n\n');
}

// ── Minify ────────────────────────────────────────────────────────────────────
async function minifyTier1(src) {
  var terser = require('terser');
  var result = await terser.minify(src, {
    compress: { passes: 2 },
    mangle: true,
    format: { comments: false },
  });
  return result.code;
}

async function minifyTier2(src) {
  var esbuild = require('esbuild');
  var result = await esbuild.transform(src, {
    minify: true,
    target: 'es2017',
  });
  return result.code;
}

// ── HTML rewrite ──────────────────────────────────────────────────────────────
// Removes individual core script tags and inserts one bundle tag before </body>
function rewriteHtml(html, versionStr) {
  var lines = html.split('\n');
  var kept = [];
  var bundleInserted = false;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var isCoreLine = BUNDLE_REPLACES.some(function(re) { return re.test(line); });

    if (isCoreLine) {
      // Insert bundle tag on the first core script we encounter
      if (!bundleInserted) {
        kept.push('  <script src="../ogma.core.min.js?' + versionStr + '"></script>');
        bundleInserted = true;
      }
      // Drop the individual core tag
    } else {
      kept.push(line);
    }
  }

  return kept.join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  var args = process.argv.slice(2);
  var forceTier = null;
  for (var i = 0; i < args.length; i++) {
    if (args[i] === '--tier' && args[i + 1]) forceTier = args[i + 1];
  }

  var tier = detectTier(forceTier);
  console.log('Build tier:', tier);

  // Read current version from sw.js CACHE_NAME
  var swSrc  = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  var verMatch = swSrc.match(/CACHE_NAME\s*=\s*['"]([^'"]+)['"]/);
  var versionStr = verMatch ? verMatch[1].replace('fate-generator-', '') : 'dev';

  // Ensure dist/ exists
  var distDir = path.join(root, 'dist');
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

  var raw = concat();
  var sizeBefore = Buffer.byteLength(raw, 'utf8');

  var output;
  if (tier === 1) {
    output = await minifyTier1(raw);
  } else if (tier === 2) {
    output = await minifyTier2(raw);
  } else {
    // Tier 3: strip single-line comments and collapse blank lines only
    output = raw
      .split('\n')
      .filter(function(l) { return !/^\s*\/\//.test(l); })
      .filter(function(l, idx, arr) { return l.trim() !== '' || (arr[idx - 1] && arr[idx - 1].trim() !== ''); })
      .join('\n');
  }

  var sizeAfter = Buffer.byteLength(output, 'utf8');
  var savings   = (((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(1);

  var outFile = path.join(distDir, 'ogma.core.min.js');
  fs.writeFileSync(outFile, output, 'utf8');
  console.log('Bundle written:', outFile);
  console.log('Before:', (sizeBefore / 1024).toFixed(1) + 'KB  After:', (sizeAfter / 1024).toFixed(1) + 'KB  Savings:', savings + '%');

  // HTML rewrite — only when dist/ is the deploy target
  // Skipped in source mode (no --rewrite-html flag)
  if (args.indexOf('--rewrite-html') !== -1) {
    var rewritten = 0;
    CAMPAIGN_PAGES.forEach(function(page) {
      var htmlPath = path.join(root, page);
      if (!fs.existsSync(htmlPath)) return;
      var original = fs.readFileSync(htmlPath, 'utf8');
      var updated  = rewriteHtml(original, versionStr);
      if (updated !== original) {
        fs.writeFileSync(htmlPath, updated, 'utf8');
        rewritten++;
        console.log('  Rewrote', page);
      }
    });
    console.log('HTML rewrite:', rewritten, 'pages updated');
  }

  console.log('Done.');
}

main().catch(function(err) {
  console.error('Build failed:', err.message);
  process.exit(1);
});
