// tests/engine.test.js — unit tests for core/engine.js
// Run: node tests/engine.test.js
// No test runner needed — plain Node.js assertions.
// engine.js is pure JS (no React/DOM) so it runs fine in Node.

var fs = require('fs');
var assert = require('assert');

// ── Bootstrap: load data globals then engine ─────────────────────────────
// eval() runs in a fresh scope each call — concatenate into one eval so all
// globals (CAMPAIGNS, UNIVERSAL, etc.) share the same scope as this test file.
eval(fs.readFileSync('data/shared.js','utf8'));
eval(fs.readFileSync('data/universal.js','utf8'));
eval(fs.readFileSync('data/western.js','utf8'));
eval(fs.readFileSync('data/thelongafter.js','utf8'));
eval(fs.readFileSync('core/engine.js','utf8'));

var pass = 0, fail = 0;

function test(name, fn) {
  try {
    fn();
    console.log('  \u2713 ' + name);
    pass++;
  } catch(e) {
    console.error('  \u2717 ' + name);
    console.error('    ' + e.message);
    fail++;
  }
}

var t = filteredTables(mergeUniversal(CAMPAIGNS['western'].tables), {});

// ════════════════════════════════════════════════════════════════════════
console.log('\nfillTemplate()');

test('returns empty string for null input', function() {
  assert.strictEqual(fillTemplate(null), '');
});
test('returns empty string for undefined input', function() {
  assert.strictEqual(fillTemplate(undefined), '');
});
test('returns empty string for bare object with no .t', function() {
  assert.strictEqual(fillTemplate({}), '');
});
test('picks from array when given plain array', function() {
  var result = fillTemplate(['alpha', 'beta', 'gamma']);
  assert(['alpha', 'beta', 'gamma'].indexOf(result) >= 0, 'Expected one of the array values, got: ' + result);
});
test('substitutes {Token} from v pool', function() {
  var tblObj = { t: ['Hello {Name}'], v: { Name: ['World'] } };
  assert.strictEqual(fillTemplate(tblObj), 'Hello World');
});
test('missing token resolves to empty string not raw token', function() {
  var tblObj = { t: ['{Missing} text'], v: {} };
  assert.strictEqual(fillTemplate(tblObj), ' text');
});
test('returns string from template pick', function() {
  var result = fillTemplate(t.minor_concepts);
  assert.strictEqual(typeof result, 'string');
  assert(result.length > 0, 'Expected non-empty result');
});

// ════════════════════════════════════════════════════════════════════════
console.log('\nstressFromRating()');

test('rating 0 → 3 boxes (FCon default)', function() {
  assert.strictEqual(stressFromRating(0), 3);
});
test('rating 1 → 4 boxes', function() {
  assert.strictEqual(stressFromRating(1), 4);
});
test('rating 2 → 4 boxes', function() {
  assert.strictEqual(stressFromRating(2), 4);
});
test('rating 3 → 5 boxes', function() {
  assert.strictEqual(stressFromRating(3), 5);
});
test('rating 4 → 5 boxes (cap)', function() {
  assert.strictEqual(stressFromRating(4), 5);
});
test('rating 5 → 5 boxes (cap enforced)', function() {
  assert.strictEqual(stressFromRating(5), 5);
});

// ════════════════════════════════════════════════════════════════════════
console.log('\nmergeUniversal()');

test('returns empty object for null input', function() {
  var result = mergeUniversal(null);
  assert.deepStrictEqual(result, {});
});
test('injects contest_types from universal', function() {
  var result = mergeUniversal(CAMPAIGNS['western'].tables);
  assert(Array.isArray(result.contest_types), 'contest_types should be injected');
  assert(result.contest_types.length > 0);
});
test('merges stunts (appends universal to campaign)', function() {
  var raw = CAMPAIGNS['western'].tables;
  var merged = mergeUniversal(raw);
  assert(merged.stunts.length >= raw.stunts.length, 'Merged stunts should be >= campaign stunts');
});
test('campaign values are not overwritten by universal', function() {
  var raw = CAMPAIGNS['western'].tables;
  var merged = mergeUniversal(raw);
  // troubles are campaign-only (not in UNIVERSAL_MERGE_KEYS)
  assert.deepStrictEqual(merged.troubles, raw.troubles);
});

// ════════════════════════════════════════════════════════════════════════
console.log('\nfilteredTables()');

test('null prefs returns tables unchanged', function() {
  var result = filteredTables(t, null);
  assert.strictEqual(result, t);
});
test('empty prefs returns tables unchanged', function() {
  var result = filteredTables(t, {});
  assert.strictEqual(result, t);
});
test('excluded index removes entry', function() {
  var prefs = { excluded: { names_first: [0] }, locked: {}, custom: {} };
  var result = filteredTables(t, prefs);
  assert.strictEqual(result.names_first.length, t.names_first.length - 1);
  assert.strictEqual(result.names_first[0], t.names_first[1]);
});
test('locked indices restrict pool', function() {
  var prefs = { excluded: {}, locked: { names_first: [0, 1] }, custom: {} };
  var result = filteredTables(t, prefs);
  assert.strictEqual(result.names_first.length, 2);
  assert.strictEqual(result.names_first[0], t.names_first[0]);
});
test('custom strings appended to string pool', function() {
  var custom = 'ZZTestEntry';
  var prefs = { excluded: {}, locked: {}, custom: { names_first: [custom] } };
  var result = filteredTables(t, prefs);
  assert(result.names_first.indexOf(custom) >= 0, 'Custom entry should be in pool');
});
test('out-of-range locked index falls back to full pool', function() {
  var prefs = { excluded: {}, locked: { names_first: [99999] }, custom: {} };
  var result = filteredTables(t, prefs);
  // pool of [undefined].filter(Boolean) = [], so falls back to original
  assert.strictEqual(result.names_first, t.names_first);
});

// ════════════════════════════════════════════════════════════════════════
console.log('\ngenerate() — return shape contracts');

var GENERATORS = [
  'npc_minor', 'npc_major', 'scene', 'campaign', 'encounter',
  'seed', 'compel', 'challenge', 'contest', 'consequence',
  'faction', 'complication', 'backstory', 'obstacle', 'countdown', 'constraint'
];

GENERATORS.forEach(function(gen) {
  test(gen + ' returns object', function() {
    var result = generate(gen, t, 4);
    assert(result !== null && typeof result === 'object', 'Expected object, got: ' + typeof result);
  });
});

test('npc_minor has name, aspects, skills, stress', function() {
  var npc = generate('npc_minor', t, 4);
  assert(typeof npc.name === 'string' && npc.name.length > 0, 'name missing');
  assert(Array.isArray(npc.aspects), 'aspects missing');
  assert(Array.isArray(npc.skills), 'skills missing');
  assert(typeof npc.stress === 'number', 'stress missing');
});

test('npc_major has high_concept, trouble, others, skills, stunts, refresh', function() {
  var npc = generate('npc_major', t, 4);
  assert(npc.aspects && typeof npc.aspects.high_concept === 'string', 'high_concept missing');
  assert(typeof npc.aspects.trouble === 'string', 'trouble missing');
  assert(Array.isArray(npc.aspects.others), 'others missing');
  assert(Array.isArray(npc.skills), 'skills missing');
  assert(Array.isArray(npc.stunts), 'stunts missing');
  assert(typeof npc.refresh === 'number', 'refresh missing');
});

test('npc_major refresh >= 1 (FCon minimum)', function() {
  for (var i = 0; i < 20; i++) {
    var npc = generate('npc_major', t, 4);
    assert(npc.refresh >= 1, 'refresh below 1: ' + npc.refresh);
  }
});

test('npc_major stress boxes 3-5 (FCon p.35)', function() {
  for (var i = 0; i < 20; i++) {
    var npc = generate('npc_major', t, 4);
    assert(npc.physical_stress >= 3 && npc.physical_stress <= 5,
      'physical_stress out of range: ' + npc.physical_stress);
    assert(npc.mental_stress >= 3 && npc.mental_stress <= 5,
      'mental_stress out of range: ' + npc.mental_stress);
  }
});

test('scene returns aspects array and zones array', function() {
  var scene = generate('scene', t, 4);
  assert(Array.isArray(scene.aspects), 'aspects missing');
  assert(Array.isArray(scene.zones), 'zones missing');
});

test('unknown genId returns empty object', function() {
  var result = generate('not_a_real_generator', t, 4);
  assert.deepStrictEqual(result, {});
});

// ════════════════════════════════════════════════════════════════════════
console.log('\ngenerate() — seeded PRNG');

test('same seed produces same output', function() {
  var a = generate('npc_minor', t, 4, null, 42);
  var b = generate('npc_minor', t, 4, null, 42);
  assert.strictEqual(a.name, b.name, 'Same seed should produce same name');
});

test('different seeds produce different output (usually)', function() {
  var results = new Set();
  for (var i = 0; i < 10; i++) {
    results.add(generate('npc_minor', t, 4, null, i).name);
  }
  assert(results.size > 1, 'Expected variation across seeds');
});

test('seeded call does not contaminate subsequent unseeded calls', function() {
  generate('npc_minor', t, 4, null, 999);
  // If _rng was not restored, all subsequent calls would be deterministic
  var names = new Set();
  for (var j = 0; j < 20; j++) names.add(generate('npc_minor', t, 4).name);
  assert(names.size > 1, 'RNG appears stuck after seeded call');
});

// ════════════════════════════════════════════════════════════════════════
console.log('\ngenerate() — empty/missing table resilience');

var emptyT = {};

['npc_minor','npc_major','scene','encounter','seed','backstory'].forEach(function(gen) {
  test(gen + ' survives empty tables (no crash)', function() {
    var result = generate(gen, emptyT, 4);
    assert(result !== null && typeof result === 'object');
  });
});

// ════════════════════════════════════════════════════════════════════════
console.log('\nentryLabel()');

test('string passthrough', function() {
  assert.strictEqual(entryLabel('Hello'), 'Hello');
});
test('array with two elements', function() {
  assert.strictEqual(entryLabel(['Zone Name', 'Zone Aspect']), 'Zone Name - Zone Aspect');
});
test('array with one element', function() {
  assert.strictEqual(entryLabel(['Solo']), 'Solo');
});
test('object with name and desc', function() {
  assert.strictEqual(entryLabel({ name: 'Vance', desc: 'The Sheriff' }), 'Vance: The Sheriff');
});
test('object with bond only', function() {
  assert.strictEqual(entryLabel({ bond: 'Owes a debt' }), 'Owes a debt');
});

// ════════════════════════════════════════════════════════════════════════
console.log('\n' + '─'.repeat(50));
console.log('Results: ' + pass + ' passed, ' + fail + ' failed');
if (fail > 0) process.exit(1);
