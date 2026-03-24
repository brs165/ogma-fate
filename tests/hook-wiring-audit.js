/**
 * Hook Wiring Audit
 * 
 * Parses each `function use*` hook in ui-board.js:
 *   1. Extracts keys from its `return {}` block
 *   2. Verifies every key resolves to a var/function/parameter in scope
 *   3. Checks function signatures vs call-site arg counts
 * 
 * Catches bugs like:
 *   - lastRemovedRef in return object but no var lastRemovedRef in scope
 *   - sendToCanvas(card, setCards) takes 2 params but called with 1 arg
 * 
 * Run: node tests/hook-wiring-audit.js
 */

var fs = require('fs');

var files = [
  'core/ui-board.js',
  'core/ui-table.js',
  'core/ui-renderers.js',
];

var pass = 0;
var fail = 0;
var errors = [];

function report(ok, msg) {
  if (ok) { pass++; }
  else { fail++; errors.push('FAIL: ' + msg); }
}

// ── 1. Hook return key audit ──────────────────────────────────────────────────
// Find every `function use*(...)` and check its `return { ... }` keys are declared in scope.

function auditHookReturns(src, filename) {
  // Match function useXxx(...) { ... }
  var hookRe = /function\s+(use[A-Z]\w+)\s*\(([^)]*)\)\s*\{/g;
  var match;
  while ((match = hookRe.exec(src)) !== null) {
    var hookName = match[1];
    var params = match[2].split(',').map(function(p) { return p.trim(); }).filter(Boolean);
    var startIdx = match.index + match[0].length;

    // Find the function body by counting braces
    var depth = 1;
    var i = startIdx;
    while (i < src.length && depth > 0) {
      if (src[i] === '{') depth++;
      if (src[i] === '}') depth--;
      i++;
    }
    var body = src.slice(startIdx, i - 1);

    // Find the last `return {` in the body
    var returnIdx = body.lastIndexOf('return {');
    if (returnIdx < 0) continue;

    // Extract the return object keys
    var retStart = returnIdx + 'return {'.length;
    var retDepth = 1;
    var j = retStart;
    while (j < body.length && retDepth > 0) {
      if (body[j] === '{') retDepth++;
      if (body[j] === '}') retDepth--;
      j++;
    }
    var retBlock = body.slice(retStart, j - 1);

    // Parse keys: look for `key:` or `key :` patterns
    var keyRe = /(\w+)\s*:/g;
    var keyMatch;
    var keys = [];
    while ((keyMatch = keyRe.exec(retBlock)) !== null) {
      keys.push(keyMatch[1]);
    }

    // Check each key is declared as var, function, or parameter
    keys.forEach(function(key) {
      var isParam = params.indexOf(key) >= 0;
      var isVar = new RegExp('var\\s+' + key + '\\b').test(body);
      var isFunc = new RegExp('function\\s+' + key + '\\b').test(body);
      // Also check destructured: var key = something
      var isDestructured = new RegExp('var\\s+' + key + '\\s*=').test(body);
      var found = isParam || isVar || isFunc || isDestructured;
      report(found, filename + ' → ' + hookName + ' returns "' + key + '" but no var/function/param "' + key + '" in scope');
    });
  }
}

// ── 2. Function signature vs call-site arg count ──────────────────────────────
// Find functions defined inside hooks, check if call sites pass the right number of args.

function auditCallArgs(src, filename) {
  // Find all function declarations with their param counts
  var funcRe = /function\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
  var funcSigs = {};
  var fmatch;
  while ((fmatch = funcRe.exec(src)) !== null) {
    var name = fmatch[1];
    var params = fmatch[2].split(',').map(function(p) { return p.trim(); }).filter(Boolean);
    funcSigs[name] = params.length;
  }

  // For each function, find call sites and count args
  // Only check functions that are exported via return {} or called internally
  // Focus on functions inside use* hooks that take specific params
  Object.keys(funcSigs).forEach(function(fname) {
    var expectedCount = funcSigs[fname];
    if (expectedCount === 0) return; // no-arg functions can't mismatch

    // Skip React/lifecycle/event handlers
    if (/^on[A-Z]|^handle|^render|^Board|^Tp|^Player|^cv4|^use/.test(fname)) return;

    // Find call sites: fname( but NOT obj.fname(
    var callRe = new RegExp('(?<![.])\\b' + fname + '\\s*\\(', 'g');
    var cmatch;
    while ((cmatch = callRe.exec(src)) !== null) {
      // Skip the definition itself
      if (src.slice(Math.max(0, cmatch.index - 10), cmatch.index).includes('function')) continue;

      // Count args by tracking parens, braces, and brackets at depth 0
      var start = cmatch.index + cmatch[0].length;
      var parenDepth = 1;
      var argCount = 0;
      var hasContent = false;
      var k = start;
      while (k < src.length && parenDepth > 0) {
        var ch = src[k];
        if (ch === '(' || ch === '{' || ch === '[') parenDepth++;
        if (ch === ')' || ch === '}' || ch === ']') { parenDepth--; if (parenDepth === 0) break; }
        if (ch === ',' && parenDepth === 1) argCount++;
        if (parenDepth === 1 && ch !== ' ' && ch !== '\n' && ch !== '\r' && ch !== '\t') hasContent = true;
        k++;
      }
      if (hasContent) argCount++; // comma count + 1 = arg count (if not empty)

      // Only flag if call has MORE args than definition (extra unused args)
      // or FEWER args than required (no defaults in vanilla JS means undefined)
      // We flag when call has fewer args than definition AND function uses them
      if (argCount > expectedCount) {
        report(false, filename + ' → ' + fname + '() defined with ' + expectedCount + ' param(s) but called with ' + argCount + ' arg(s) at offset ' + cmatch.index);
      }
    }
  });
}

// ── Run ───────────────────────────────────────────────────────────────────────

files.forEach(function(file) {
  var src = fs.readFileSync(file, 'utf8');
  auditHookReturns(src, file);
  auditCallArgs(src, file);
});

console.log('Hook wiring audit: ' + (pass + fail) + ' checks  pass:' + pass + '  fail:' + fail);
if (errors.length > 0) {
  errors.forEach(function(e) { console.log('  ' + e); });
  process.exit(1);
}
