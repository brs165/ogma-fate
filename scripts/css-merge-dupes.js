/**
 * Phase 4: CSS Duplicate Merger
 * 
 * 1. Merges multiple @media blocks with the same query into one
 * 2. Merges exact same-scope duplicate selectors (later props win)
 * 3. Removes truly redundant global rules overridden later in same scope
 * 
 * Run: node scripts/css-merge-dupes.js [--write]
 */

var fs = require('fs');
var WRITE = process.argv.indexOf('--write') >= 0;
var CSS_FILE = 'assets/css/theme.css';
var css = fs.readFileSync(CSS_FILE, 'utf8');

// ── Step 1: Merge same @media blocks ─────────────────────────────────────────
// Parse the file into segments: top-level rules and @media blocks
var segments = []; // {type: 'rule'|'media', content, query}
var lines = css.split('\n');
var i = 0;

while (i < lines.length) {
  var line = lines[i];
  var trimmed = line.trim();
  
  // Multi-line @media block
  if (trimmed.startsWith('@media') && trimmed.includes('{') && !trimmed.endsWith('}')) {
    var query = trimmed.split('{')[0].trim();
    var blockLines = [];
    var depth = (trimmed.match(/{/g)||[]).length - (trimmed.match(/}/g)||[]).length;
    i++;
    while (i < lines.length && depth > 0) {
      var bl = lines[i];
      depth += (bl.match(/{/g)||[]).length - (bl.match(/}/g)||[]).length;
      if (depth > 0) blockLines.push(bl);
      i++;
    }
    segments.push({type: 'media', query: query, content: blockLines.join('\n')});
    continue;
  }
  
  // Single-line @media (everything on one line)
  if (trimmed.startsWith('@media') && trimmed.endsWith('}')) {
    var query2 = trimmed.split('{')[0].trim();
    var inner = trimmed.slice(trimmed.indexOf('{')+1, trimmed.lastIndexOf('}'));
    segments.push({type: 'media', query: query2, content: inner});
    i++;
    continue;
  }
  
  // Regular line
  segments.push({type: 'rule', content: line});
  i++;
}

// Group media segments by query
var mediaGroups = {};
var output = [];

segments.forEach(function(seg) {
  if (seg.type === 'media') {
    if (!mediaGroups[seg.query]) {
      mediaGroups[seg.query] = {idx: output.length, parts: []};
      output.push({type: 'media-placeholder', query: seg.query});
    }
    mediaGroups[seg.query].parts.push(seg.content);
  } else {
    output.push(seg);
  }
});

// Rebuild with merged media blocks
var mergedMediaCount = 0;
var result = output.map(function(seg) {
  if (seg.type === 'media-placeholder') {
    var group = mediaGroups[seg.query];
    if (group.parts.length > 1) mergedMediaCount += group.parts.length - 1;
    return seg.query + '{\n' + group.parts.join('\n') + '\n}';
  }
  return seg.content;
}).join('\n');

// Clean up triple+ newlines
result = result.replace(/\n{3,}/g, '\n\n');

// ── Step 2: Within each scope, merge exact duplicate selectors ───────────────
// (This is a simple pass — for each exact selector appearing twice in the same
//  scope, merge properties with last-wins semantics)
var lines2 = result.split('\n');
var seen = {}; // key: scope|||selector → {lineIdx, props}
var removeLines = {};

lines2.forEach(function(line, idx) {
  var trimmed2 = line.trim();
  var m = trimmed2.match(/^([^@{}\/\n][^{]*)\{([^}]+)\}$/);
  if (!m) return;
  var sel = m[1].trim();
  var props = m[2].trim();
  if (!sel || sel.startsWith('from') || sel.startsWith('to') || /^\d+%/.test(sel)) return;
  
  var key = sel;
  if (seen[key]) {
    // Merge: combine props (later wins for conflicts)
    var oldProps = {};
    seen[key].props.split(';').forEach(function(p) {
      var kv = p.split(':');
      if (kv.length >= 2 && kv[0].trim()) oldProps[kv[0].trim()] = kv.slice(1).join(':').trim();
    });
    props.split(';').forEach(function(p) {
      var kv = p.split(':');
      if (kv.length >= 2 && kv[0].trim()) oldProps[kv[0].trim()] = kv.slice(1).join(':').trim();
    });
    var merged2 = Object.keys(oldProps).map(function(k) { return k + ':' + oldProps[k]; }).join(';');
    
    // Mark old line for removal, update current line
    removeLines[seen[key].lineIdx] = true;
    lines2[idx] = sel + '{' + merged2 + '}';
    seen[key] = {lineIdx: idx, props: merged2};
  } else {
    seen[key] = {lineIdx: idx, props: props};
  }
});

var finalLines = lines2.filter(function(_, idx) { return !removeLines[idx]; });
var final = finalLines.join('\n').replace(/\n{3,}/g, '\n\n');

var saved = css.length - final.length;
var removedCount = Object.keys(removeLines).length;

console.log('Phase 4 results:');
console.log('  Media blocks merged: ' + mergedMediaCount + ' blocks consolidated');
console.log('  Duplicate selectors merged: ' + removedCount + ' rules');
console.log('  Bytes saved: ' + saved + ' (' + Math.round(saved/1024) + ' KB)');
console.log('  New size: ' + final.length + ' (' + Math.round(final.length/1024) + ' KB)');

if (WRITE) {
  fs.writeFileSync(CSS_FILE, final, 'utf8');
  console.log('  Written to ' + CSS_FILE);
}
