#!/usr/bin/env node
// scripts/qa-unit.mjs — Unit tests for engine.js pure functions
// Run: node scripts/qa-unit.mjs
// Exit 0 = all pass, Exit 1 = any failure.
//
// Covers logic areas not exercised by qa-hard.mjs / qa-export.mjs:
//   - stressFromRating() boundary values
//   - generateConsequence() severity validation (Bug 2 regression)
//   - filteredTables() exclusion, lock, fallback, custom-entry paths
//   - mergeUniversal() idempotency (Bug 3 regression)
//   - generate() seeded determinism + unknown genId contract

import {
  stressFromRating,
  generate,
  mergeUniversal,
  filteredTables,
} from '../src/lib/engine.js';
import { CAMPAIGNS } from '../src/data/index.js';

let passed = 0;
let failed = 0;
const failures = [];

function assert(label, actual, expected) {
  if (actual === expected) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    const msg = `${label}\n       expected: ${JSON.stringify(expected)}\n       received: ${JSON.stringify(actual)}`;
    failures.push(msg);
    console.log(`  ❌ ${msg}`);
  }
}

// ── Grab one campaign's tables for tests that need real data ──────────────
const campData = Object.values(CAMPAIGNS)[0];
const t = filteredTables(mergeUniversal(campData.tables), {});

// ══════════════════════════════════════════════════════════════════════════
// SUITE 1 — stressFromRating()
// FCon p.12: Mediocre(+0)→3 boxes, Avg/Fair(+1/+2)→4, Good+(+3+)→6
// ══════════════════════════════════════════════════════════════════════════
console.log('\n── Suite 1: stressFromRating() ─────────────────────────────────────');

assert('r=0 (Mediocre)  → 3 boxes', stressFromRating(0), 3);
assert('r=1 (Average)   → 4 boxes', stressFromRating(1), 4);
assert('r=2 (Fair)      → 4 boxes', stressFromRating(2), 4);
assert('r=3 (Good)      → 6 boxes', stressFromRating(3), 6);
assert('r=4 (Great)     → 6 boxes', stressFromRating(4), 6);
assert('r=5 (Superb)    → 6 boxes (extra slot is a consequence, not stress)', stressFromRating(5), 6);
assert('r=-1 (invalid)  → 3 boxes (floor at Mediocre)', stressFromRating(-1), 3);
assert('+0/+1 boundary: step exists', stressFromRating(1) > stressFromRating(0), true);
assert('+2/+3 boundary: step exists', stressFromRating(3) > stressFromRating(2), true);
assert('+4/+5: no stress step (same 6 boxes)', stressFromRating(5) === stressFromRating(4), true);

// ══════════════════════════════════════════════════════════════════════════
// SUITE 2 — generateConsequence() severity validation (Bug 2 regression)
// ══════════════════════════════════════════════════════════════════════════
console.log('\n── Suite 2: generateConsequence() — severity validation ─────────────');

const mild     = generate('consequence', t, 4, { severity: 'mild' });
const moderate = generate('consequence', t, 4, { severity: 'moderate' });
const severe   = generate('consequence', t, 4, { severity: 'severe' });

assert('forced mild     → severity field is "mild"',     mild.severity,     'mild');
assert('forced moderate → severity field is "moderate"', moderate.severity, 'moderate');
assert('forced severe   → severity field is "severe"',   severe.severity,   'severe');

assert('forced mild     → aspect is non-empty',
  typeof mild.aspect === 'string' && mild.aspect.length > 0, true);
assert('forced severe   → aspect is non-empty',
  typeof severe.aspect === 'string' && severe.aspect.length > 0, true);

// Bug 2 regression: invalid severity must no longer produce empty aspect
const invalid = generate('consequence', t, 4, { severity: 'legendary' });
const VALID_SEV = new Set(['mild', 'moderate', 'severe']);
assert('[Bug 2 fix] invalid severity falls back to valid random severity',
  VALID_SEV.has(invalid.severity), true);
assert('[Bug 2 fix] invalid severity produces non-empty aspect',
  typeof invalid.aspect === 'string' && invalid.aspect.length > 0, true);

// Random severity (no opts) is always one of the three valid values across many rolls
const randoms = Array.from({ length: 30 }, () => generate('consequence', t, 4, {}));
assert('random severity always in {mild, moderate, severe}',
  randoms.every(r => VALID_SEV.has(r.severity)), true);

// ══════════════════════════════════════════════════════════════════════════
// SUITE 3 — filteredTables() — exclusion, lock, fallback, custom entries
// ══════════════════════════════════════════════════════════════════════════
console.log('\n── Suite 3: filteredTables() — prefs application ───────────────────');

const mockTables = {
  troubles: ['In Debt to Everyone', 'Haunted by the Past', 'Too Curious for Safety', 'Marked for Death'],
  zones:    ['Open Field', 'Narrow Alley', 'Rooftop', 'Warehouse Interior'],
  stunts:   [{ name: 'Quick Draw', skill: 'Shoot', type: 'bonus', desc: '+2', tags: ['combat'] }],
};

// Exclusion
const withExclude = filteredTables(mockTables, { excluded: { troubles: [0, 1] } });
assert('excluded indices removed from pool', withExclude.troubles.length, 2);
assert('excluded entry not present', withExclude.troubles.includes('In Debt to Everyone'), false);

// Lock: only locked indices remain
const withLock = filteredTables(mockTables, { locked: { zones: [2] } });
assert('locked pool contains only locked entry', withLock.zones.length, 1);
assert('locked entry is correct', withLock.zones[0], 'Rooftop');

// Fallback: all entries excluded → returns original (never empty)
const allExcluded = filteredTables(mockTables, { excluded: { troubles: [0, 1, 2, 3] } });
assert('all-excluded fallback returns original array', allExcluded.troubles.length, 4);

// Out-of-bounds lock index → filter(Boolean) removes undefined → fallback to original
const outOfBounds = filteredTables(mockTables, { locked: { zones: [99] } });
assert('out-of-bounds lock index falls back to original', outOfBounds.zones.length, 4);

// Custom entries appended to string tables
const withCustom = filteredTables(mockTables, { custom: { troubles: ['My Custom Trouble'] } });
assert('custom entry appended', withCustom.troubles.includes('My Custom Trouble'), true);
assert('custom entry does not replace originals', withCustom.troubles.length, 5);

// Non-array keys (template objects) pass through unchanged
const withTemplate = { ...mockTables, scene_tone: { t: ['{Adj}'], v: { Adj: ['Tense'] } } };
const filtered = filteredTables(withTemplate, { excluded: { scene_tone: [0] } });
assert('non-array table key passes through unchanged',
  typeof filtered.scene_tone === 'object' && !Array.isArray(filtered.scene_tone), true);

// null prefs → returns t unchanged
assert('null prefs returns tables unchanged', filteredTables(mockTables, null) === mockTables, true);

// ══════════════════════════════════════════════════════════════════════════
// SUITE 4 — mergeUniversal() — idempotency (Bug 3 regression)
// ══════════════════════════════════════════════════════════════════════════
console.log('\n── Suite 4: mergeUniversal() — idempotency ─────────────────────────');

const originalStuntCount = campData.tables.stunts?.length ?? 0;
const onceMerged  = mergeUniversal(campData.tables);
const twiceMerged = mergeUniversal(onceMerged);  // should be idempotent now

const onceLen  = onceMerged.stunts?.length  ?? 0;
const twiceLen = twiceMerged.stunts?.length ?? 0;

assert('[Bug 3 fix] double-merge does NOT double stunts array', twiceLen, onceLen);
assert('single merge grows stunt pool vs raw campaign tables', onceLen > originalStuntCount, true);
assert('single merge grows consequence_mild pool',
  onceMerged.consequence_mild.length >= campData.tables.consequence_mild.length, true);

// Calling three times is also safe
const thriceLen = mergeUniversal(twiceMerged).stunts?.length ?? 0;
assert('triple-merge is also idempotent', thriceLen, onceLen);

// null input returns empty object (no throw)
assert('mergeUniversal(null) returns {}', JSON.stringify(mergeUniversal(null)), '{}');

// ══════════════════════════════════════════════════════════════════════════
// SUITE 5 — generate() — seeded PRNG determinism + dispatch contract
// ══════════════════════════════════════════════════════════════════════════
console.log('\n── Suite 5: generate() — seeded PRNG + dispatch contract ───────────');

const SEED = 0xC0FFEE42;
const r1 = generate('npc_major', t, 4, {}, SEED);
const r2 = generate('npc_major', t, 4, {}, SEED);

assert('same seed → same name',          r1.name,                   r2.name);
assert('same seed → same high_concept',  r1.aspects.high_concept,   r2.aspects.high_concept);
assert('same seed → same skill count',   r1.skills.length,          r2.skills.length);

// Different seeds → different results (probabilistic — collision chance ~1/100k)
const rA = generate('npc_major', t, 4, {}, 1);
const rB = generate('npc_major', t, 4, {}, 2);
assert('different seeds → different names', rA.name !== rB.name, true);

// seed=0 → unseeded (Math.random), still returns valid structure
const r0 = generate('npc_major', t, 4, {}, 0);
assert('seed=0 returns valid name', typeof r0.name === 'string' && r0.name.length > 0, true);

// Unknown genId → returns {} and never throws
let threw = false;
let unknown;
try { unknown = generate('not_a_real_generator', t, 4, {}); } catch (e) { threw = true; }
assert('unknown genId never throws',        threw,   false);
assert('unknown genId returns empty object',
  unknown !== null && typeof unknown === 'object' && Object.keys(unknown).length === 0, true);

// PC extra-mild: session-zero pyramid caps at +4, so condition physR/willR>=5 is never met
// This is intentional — documents the known scope of the generator
const pcSample = Array.from({ length: 30 }, () => generate('pc', t, 4, {}));
assert('session-zero PCs never receive extra-mild consequence (max skill +4 < Superb +5)',
  pcSample.filter(pc => pc.consequences?.length === 4).length, 0);
assert('all generated PCs have standard 3-slot consequences',
  pcSample.every(pc => pc.consequences?.length === 3), true);

// ── Summary ───────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(60));
console.log(`  UNIT QA: ${passed} passed, ${failed} failed`);
if (failures.length) {
  failures.forEach(f => console.log(`\n  ● ${f}`));
  console.log('');
}
console.log('═'.repeat(60));
process.exit(failed > 0 ? 1 : 0);
