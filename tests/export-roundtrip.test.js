#!/usr/bin/env node
// tests/export-roundtrip.test.js
// Generates one card from every generator (16 total) across every world,
// assembles them into an Ogma export JSON, parses it back, and verifies
// every card survives the round-trip intact.
//
// Run: node tests/export-roundtrip.test.js

var fs   = require('fs');
var path = require('path');

var pass = 0;
var fail = 0;
var errors = [];

function assert(label, ok, msg) {
  if (ok) {
    pass++;
  } else {
    fail++;
    errors.push('  FAIL: ' + label + (msg ? ' -- ' + msg : ''));
  }
}

// ── Load engine ───────────────────────────────────────────────────────────
eval(fs.readFileSync('data/shared.js',   'utf8'));
eval(fs.readFileSync('data/universal.js','utf8'));
[
  'thelongafter','cyberpunk','fantasy','space',
  'victorian','postapoc','western','dVentiRealm'
].forEach(function(w) {
  eval(fs.readFileSync('data/' + w + '.js', 'utf8'));
});
eval(fs.readFileSync('core/engine.js', 'utf8'));

var ALL_GENS = [
  'npc_minor','npc_major','scene','campaign','encounter','seed',
  'compel','challenge','contest','consequence','faction','complication',
  'backstory','obstacle','countdown','constraint'
];

var ALL_WORLDS = [
  'thelongafter','cyberpunk','fantasy','space',
  'victorian','postapoc','western','dVentiRealm'
];

// ── Step 1: Generate one card per generator (using postapoc world) ────────
var campId   = 'postapoc';
var campMeta = CAMPAIGNS[campId];
var tables   = filteredTables(mergeUniversal(campMeta.tables), {});
var campName = campMeta.meta.name;

var generated = [];

ALL_GENS.forEach(function(genId) {
  var data;
  try {
    data = generate(genId, tables, 4);
  } catch(e) {
    assert('RT-GEN: generate(' + genId + ') throws', false, e.message);
    return;
  }
  assert('RT-GEN: generate(' + genId + ') returns object',
    data !== null && typeof data === 'object',
    'Expected object, got ' + typeof data);

  var card = {
    id:      'test_' + genId + '_001',
    genId:   genId,
    title:   data.name || data.location || data.situation || data.contest_type || genId,
    summary: '',
    tags:    [],
    ts:      1700000000000,
    data:    data,
  };
  generated.push(card);
});

assert('RT-GEN: all 16 generators produced a card', generated.length === 16,
  'Expected 16 cards, got ' + generated.length);

// ── Step 2: Assemble Ogma export JSON (same format as DB.exportCards) ─────
var exportObj = {
  ogma:     true,
  version:  1,
  type:     'cards',
  exported: new Date(1700000000000).toISOString(),
  campaign: campId,
  campName: campName,
  cards:    generated,
};

var jsonStr;
try {
  jsonStr = JSON.stringify(exportObj, null, 2);
} catch(e) {
  assert('RT-SERIALIZE: JSON.stringify succeeds', false, e.message);
  process.exit(1);
}

assert('RT-SERIALIZE: JSON string is non-empty', jsonStr.length > 100, 'Got ' + jsonStr.length + ' chars');
assert('RT-SERIALIZE: JSON contains ogma flag', jsonStr.includes('"ogma": true'));
assert('RT-SERIALIZE: JSON contains all 16 genIds', ALL_GENS.every(function(g) {
  return jsonStr.includes('"' + g + '"');
}), 'One or more genIds missing from serialized JSON');

// ── Step 3: Parse back (simulates what DB.importFile + importCards does) ──
var parsed;
try {
  parsed = JSON.parse(jsonStr);
} catch(e) {
  assert('RT-PARSE: JSON.parse succeeds', false, e.message);
  process.exit(1);
}

assert('RT-PARSE: parsed.ogma is true',        parsed.ogma === true);
assert('RT-PARSE: parsed.version is 1',        parsed.version === 1);
assert('RT-PARSE: parsed.type is cards',       parsed.type === 'cards');
assert('RT-PARSE: parsed.campaign matches',    parsed.campaign === campId);
assert('RT-PARSE: parsed.campName matches',    parsed.campName === campName);
assert('RT-PARSE: parsed.cards is array',      Array.isArray(parsed.cards));
assert('RT-PARSE: parsed.cards.length === 16', parsed.cards.length === 16,
  'Expected 16, got ' + (parsed.cards ? parsed.cards.length : 'undefined'));

// ── Step 4: Verify every card round-tripped intact ────────────────────────
ALL_GENS.forEach(function(genId) {
  var orig    = generated.find(function(c){ return c.genId === genId; });
  var restored = parsed.cards.find(function(c){ return c.genId === genId; });

  assert('RT-CARD: ' + genId + ' present in import',
    !!restored, genId + ' card missing after import');

  if (!restored) return;

  assert('RT-CARD: ' + genId + ' id matches',
    restored.id === orig.id, 'id: ' + restored.id + ' vs ' + orig.id);

  assert('RT-CARD: ' + genId + ' data is object',
    restored.data !== null && typeof restored.data === 'object',
    'data is ' + typeof restored.data);

  // Verify key fields survived serialisation for NPC types
  if (genId === 'npc_minor') {
    assert('RT-CARD: npc_minor has name after import',
      typeof restored.data.name === 'string' && restored.data.name.length > 0,
      'name: ' + restored.data.name);
    assert('RT-CARD: npc_minor has stress after import',
      typeof restored.data.stress === 'number',
      'stress: ' + restored.data.stress);
  }

  if (genId === 'npc_major') {
    assert('RT-CARD: npc_major has name after import',
      typeof restored.data.name === 'string' && restored.data.name.length > 0);
    assert('RT-CARD: npc_major aspects survived',
      restored.data.aspects && typeof restored.data.aspects === 'object');
    assert('RT-CARD: npc_major physical_stress survived',
      typeof restored.data.physical_stress === 'number');
  }

  if (genId === 'countdown') {
    assert('RT-CARD: countdown boxes survived',
      typeof restored.data.boxes === 'number' && restored.data.boxes >= 1);
    assert('RT-CARD: countdown outcome survived',
      typeof restored.data.outcome === 'string' && restored.data.outcome.length > 0);
  }

  if (genId === 'campaign') {
    assert('RT-CARD: campaign.current survived',
      restored.data.current && typeof restored.data.current.name === 'string');
    assert('RT-CARD: campaign.impending survived',
      restored.data.impending && typeof restored.data.impending.name === 'string');
  }

  if (genId === 'encounter') {
    assert('RT-CARD: encounter.opposition is array',
      Array.isArray(restored.data.opposition) && restored.data.opposition.length > 0);
  }

  if (genId === 'seed') {
    assert('RT-CARD: seed.objective survived',
      typeof restored.data.objective === 'string' && restored.data.objective.length > 0);
  }
});

// ── Step 5: Verify JSON is stable (double round-trip) ────────────────────
var json2 = JSON.stringify(parsed, null, 2);
assert('RT-STABILITY: double round-trip produces identical JSON',
  json2 === jsonStr, 'JSON changed on second serialisation');

// ── Step 6: Simulate the importCards validation (what ui.js does) ─────────
// ui.js: data.type must be 'cards', data.cards must be array
function simulateImportCards(data) {
  if (!data || !data.ogma) return {ok: false, reason: 'not an Ogma file'};
  // type can be 'cards' or 'canvas' — we handle 'cards' here
  if (data.type === 'cards') {
    if (!Array.isArray(data.cards)) return {ok: false, reason: 'cards not an array'};
    return {ok: true, cards: data.cards};
  }
  if (data.type === 'canvas') {
    if (!data.state || !Array.isArray(data.state.cards)) return {ok: false, reason: 'invalid canvas'};
    return {ok: true, cards: data.state.cards};
  }
  return {ok: false, reason: 'unknown type: ' + data.type};
}

var importResult = simulateImportCards(parsed);
assert('RT-IMPORT: simulateImportCards succeeds', importResult.ok, importResult.reason);
assert('RT-IMPORT: importResult.cards has 16 items',
  importResult.ok && importResult.cards.length === 16,
  'got ' + (importResult.cards ? importResult.cards.length : 'undefined'));

// ── Summary ───────────────────────────────────────────────────────────────
console.log('\nExport round-trip: ' + (pass + fail) + ' total  pass:' + pass + '  fail:' + fail);
if (errors.length) {
  errors.forEach(function(e){ console.error(e); });
  process.exit(1);
}
console.log('All ' + pass + ' assertions passed. Export → serialise → parse → import round-trip: OK');
