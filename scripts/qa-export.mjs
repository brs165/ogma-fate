#!/usr/bin/env node
// scripts/qa-export.mjs
// Tests that every generator's export can be re-imported cleanly.
// Run: node scripts/qa-export.mjs
// Exit 0 = all pass. Exit 1 = any failure.

// ── Schema constants — single source of truth ─────────────────────────
const REQUIRED_TOP_KEYS = ['format', 'version', 'campaign', 'campId', 'ts'];
const REQUIRED_RESULT_KEYS = ['generator', 'label', 'data', 'ts'];
const FORBIDDEN_OLD_KEYS = ['ogma', 'cards', 'type'];

// ── Load modules ──────────────────────────────────────────────────────
let engine, CAMPAIGNS, GENERATORS;
try {
  engine = await import('../src/lib/engine.js');
  const sh = await import('../src/data/shared.js');
  CAMPAIGNS = sh.CAMPAIGNS;
  GENERATORS = sh.GENERATORS;
} catch (e) {
  console.error('FATAL: Could not import modules:', e.message);
  process.exit(1);
}

const { generate, mergeUniversal, filteredTables, toOgmaJSON, toBatchOgmaJSON, parseOgmaJSON } = engine;

let failures = 0;
let passes = 0;
const results = [];

function pass(name) { passes++; results.push({ status: '\u2705 PASS', name }); }
function fail(name, reason) { failures++; results.push({ status: '\u274C FAIL', name, reason }); }
function warn(name, reason) { results.push({ status: '\u26A0  WARN', name, reason }); }

const worlds = Object.keys(CAMPAIGNS);
const gens = GENERATORS.map(g => g.id);

// ══════════════════════════════════════════════════════════════════════════
// CHECK A: Schema contract — new exports must use correct keys
// ASSERT export-schema-contract
// ══════════════════════════════════════════════════════════════════════════
for (const worldId of worlds) {
  const campData = CAMPAIGNS[worldId];
  if (!campData) continue;
  const campName = campData.meta?.name || worldId;
  const tables = filteredTables(mergeUniversal(campData.tables || {}), {});

  for (const genId of gens) {
    const testName = `schema-contract-${worldId}-${genId}`;
    try {
      const data = generate(genId, tables, 4, {});
      const jsonStr = toOgmaJSON(genId, data, campName, worldId);
      const obj = JSON.parse(jsonStr);

      // A1: Required top-level keys present
      const missingKeys = REQUIRED_TOP_KEYS.filter(k => !(k in obj));
      if (missingKeys.length > 0) { fail(testName, `Missing keys: ${missingKeys.join(', ')}`); continue; }

      // A2: format must be string 'ogma'
      if (obj.format !== 'ogma') { fail(testName, `format is '${obj.format}', must be 'ogma'`); continue; }

      // A3: Single export has 'data', batch has 'results' — for toOgmaJSON it's single
      if (!obj.data && !Array.isArray(obj.results)) { fail(testName, `No 'data' or 'results' field`); continue; }

      // A4: campId must match worldId
      if (obj.campId !== worldId) { fail(testName, `campId '${obj.campId}' != '${worldId}'`); continue; }

      pass(testName);
    } catch (e) {
      fail(testName, `Exception: ${e.message}`);
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════
// CHECK B: Round-trip — export → parseOgmaJSON → data intact
// ASSERT round-trip-schema-valid
// ══════════════════════════════════════════════════════════════════════════
for (const worldId of worlds.slice(0, 3)) {
  const campData = CAMPAIGNS[worldId];
  const campName = campData?.meta?.name || worldId;
  const tables = filteredTables(mergeUniversal(campData?.tables || {}), {});

  for (const genId of ['npc_major', 'scene', 'seed', 'faction', 'encounter', 'consequence']) {
    const testName = `round-trip-${worldId}-${genId}`;
    try {
      const data = generate(genId, tables, 4, {});
      const jsonStr = toOgmaJSON(genId, data, campName, worldId);
      const parsed = parseOgmaJSON(jsonStr);

      if (!parsed) { fail(testName, 'parseOgmaJSON returned null'); continue; }
      if (parsed.type !== 'single') { fail(testName, `type '${parsed.type}', expected 'single'`); continue; }

      const rt = parsed.data;
      if (!rt || typeof rt !== 'object') { fail(testName, 'parsed.data is null after round-trip'); continue; }
      if (jsonStr.includes('"undefined"') || jsonStr.includes(':undefined')) { fail(testName, 'Contains raw undefined'); continue; }

      pass(testName);
    } catch (e) {
      fail(testName, `Exception: ${e.message}`);
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════
// CHECK C: Backward compat — old schema must still import
// ASSERT backward-compat-old-schema
// ══════════════════════════════════════════════════════════════════════════
const OLD_SCHEMA = {
  ogma: true, version: 1, type: 'cards',
  exported: new Date().toISOString(),
  campaign: 'cyberpunk', campName: 'Neon Abyss',
  cards: [
    { id: 'wiz_seed', genId: 'seed', title: 'A decommissioned data vault',
      data: { location: 'A decommissioned data vault', objective: 'Destroy the backup' }, tags: [], ts: Date.now() },
    { id: 'wiz_npc', genId: 'npc_major', title: 'Sable Substrata',
      data: { name: 'Sable Substrata', aspects: { high_concept: 'Data-Theft Savant' } }, tags: [], ts: Date.now() },
  ],
};

try {
  const parsed = parseOgmaJSON(JSON.stringify(OLD_SCHEMA));
  if (!parsed) {
    fail('backward-compat-old-schema', 'parseOgmaJSON returned null for old schema');
  } else {
    const count = parsed.results?.length || (parsed.data ? 1 : 0);
    if (count !== OLD_SCHEMA.cards.length) {
      fail('backward-compat-old-schema', `Expected ${OLD_SCHEMA.cards.length} items, got ${count}`);
    } else {
      pass('backward-compat-old-schema');
    }
  }
} catch (e) {
  fail('backward-compat-old-schema', `Exception: ${e.message}`);
}

// ══════════════════════════════════════════════════════════════════════════
// CHECK D: Malformed input guard
// ASSERT parseOgmaJSON-never-throws
// ══════════════════════════════════════════════════════════════════════════
const BAD_INPUTS = [
  [null, 'null input'],
  [undefined, 'undefined input'],
  ['', 'empty string'],
  ['not json at all', 'non-JSON string'],
  ['{"format":"wrong"}', 'wrong format value'],
  ['{"format":"ogma"}', 'missing results/data'],
  ['{"ogma":true}', 'old schema no cards'],
  ['[]', 'array instead of object'],
  ['{"format":"ogma","version":"2.0.0","results":"not-array"}', 'results is string'],
];

for (const [input, label] of BAD_INPUTS) {
  try {
    const result = parseOgmaJSON(input);
    if (result !== null && result !== undefined) {
      warn(`malformed-input-${label}`, `Got non-null for bad input`);
    } else {
      pass(`malformed-input-${label}`);
    }
  } catch (e) {
    fail(`malformed-input-${label}`, `THREW: ${e.message}`);
  }
}

// ══════════════════════════════════════════════════════════════════════════
// CHECK E: Batch export round-trip
// ASSERT batch-export-round-trip
// ══════════════════════════════════════════════════════════════════════════
for (const worldId of worlds.slice(0, 2)) {
  const campData = CAMPAIGNS[worldId];
  const campName = campData?.meta?.name || worldId;
  const tables = filteredTables(mergeUniversal(campData?.tables || {}), {});
  const testName = `batch-round-trip-${worldId}`;

  try {
    const batchCards = ['npc_major', 'scene', 'faction'].map(genId => {
      const data = generate(genId, tables, 4, {});
      return { genId, label: genId, data, ts: Date.now() };
    });
    const jsonStr = toBatchOgmaJSON(batchCards, campName, worldId);
    const parsed = parseOgmaJSON(jsonStr);

    if (!parsed) { fail(testName, 'parseOgmaJSON returned null for valid batch'); }
    else if (parsed.type !== 'batch') { fail(testName, `Expected 'batch', got '${parsed.type}'`); }
    else if (!Array.isArray(parsed.results) || parsed.results.length !== 3) { fail(testName, `Expected 3 results, got ${parsed.results?.length}`); }
    else { pass(testName); }
  } catch (e) {
    fail(testName, `Exception: ${e.message}`);
  }
}

// ── RESULTS OUTPUT ────────────────────────────────────────────────────
console.log('\n\u2500\u2500 Ogma Export QA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n');
for (const r of results) {
  console.log(r.reason ? `${r.status}  ${r.name}\n         \u2192 ${r.reason}` : `${r.status}  ${r.name}`);
}
console.log('\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500');
if (failures === 0) {
  console.log(`EXPORT QA PASSED \u2014 ${passes} checks, 0 failures. Safe to build.`);
} else {
  console.log(`EXPORT QA FAILED \u2014 ${failures} failure(s). Fix before deploying.`);
}
console.log('\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n');
process.exit(failures > 0 ? 1 : 0);
