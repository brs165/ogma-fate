#!/usr/bin/env node
// scripts/qa-hard.mjs — Hardened pre-build QA for Ogma
// Run: node scripts/qa-hard.mjs
// Exit 0 = all pass, Exit 1 = failures found
//
// ASSERT play-canvas-never-shows-prep-cards (MANUAL TEST)
// Cards with sourceCanvas:'prep' must be filtered out of any canvas
// store initialised with a play key. This is the Session Zero play
// isolation guarantee.
//
// VERIFY manually:
//   1. Run Session Zero → character creation → Send to Table Prep
//   2. Navigate to /campaigns/[world] (play board)
//   3. Confirm zero Session Zero cards appear on play canvas
//   4. GM clicks "→ Table" on a prep card
//   5. Confirm card NOW appears on play canvas with sourceCanvas:'play'

const results = [];
const warnings = [];
let failures = 0;

function pass(name) { results.push({ status: 'PASS', name }); }
function fail(name, detail) { results.push({ status: 'FAIL', name, detail }); failures++; }
function warn(name, detail) { warnings.push({ name, detail }); }

// ── Load modules ──────────────────────────────────────────────────────────
const { CAMPAIGNS } = await import('../src/data/index.js');
const { generate, mergeUniversal, filteredTables } = await import('../src/lib/engine.js');
const { ALL_SKILLS, GENERATORS } = await import('../src/data/shared.js');

const WORLDS = ['thelongafter', 'cyberpunk', 'fantasy', 'space', 'victorian', 'postapoc', 'western', 'dVentiRealm'];
const GEN_IDS = GENERATORS.map(g => g.id);

// ══════════════════════════════════════════════════════════════════════════
// 1. CAMPAIGN REGISTRY
// ══════════════════════════════════════════════════════════════════════════
{
  const keys = Object.keys(CAMPAIGNS);
  const missing = WORLDS.filter(w => !keys.includes(w));
  if (missing.length > 0 || keys.length === 0) {
    fail('campaign-registry-8-worlds', `Missing: ${missing.join(', ')} (found ${keys.length} keys)`);
  } else {
    pass('campaign-registry-8-worlds');
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 2. REQUIRED TABLE KEYS
// ══════════════════════════════════════════════════════════════════════════
// Keys that must be non-empty arrays
const REQUIRED_ARRAY_KEYS = [
  'names_first', 'names_last', 'troubles', 'stunts',
  'scene_movement', 'scene_cover', 'scene_usable',
  'zones', 'current_issues', 'impending_issues',
  'opposition', 'twists', 'victory', 'defeat',
  'seed_locations', 'seed_objectives', 'seed_complications',
  'compel_situations', 'compel_consequences',
  'consequence_mild', 'consequence_moderate', 'consequence_severe',
  'faction_name_prefix', 'faction_name_suffix', 'faction_goals',
  'faction_methods', 'faction_weaknesses', 'faction_face_roles',
  'complication_types', 'complication_aspects', 'complication_arrivals',
];
// Keys that can be arrays OR template objects {t, v}
const REQUIRED_ANY_KEYS = [
  'scene_tone', 'scene_danger', 'setting_aspects',
  'major_concepts', 'minor_concepts', 'other_aspects',
];

for (const world of WORLDS) {
  const tables = CAMPAIGNS[world]?.tables;
  if (!tables) { fail(`table-keys-complete-${world}`, 'tables is undefined'); continue; }
  const missingArr = REQUIRED_ARRAY_KEYS.filter(k => !Array.isArray(tables[k]) || tables[k].length === 0);
  const missingAny = REQUIRED_ANY_KEYS.filter(k => !tables[k] || (typeof tables[k] !== 'object'));
  const missing = [...missingArr, ...missingAny];
  if (missing.length > 0) {
    fail(`table-keys-complete-${world}`, `Missing/empty: ${missing.join(', ')}`);
  } else {
    pass(`table-keys-complete-${world}`);
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 3. SMOKE TEST — ALL COMBINATIONS
// ══════════════════════════════════════════════════════════════════════════
const smokeResults = {};
for (const world of WORLDS) {
  smokeResults[world] = {};
  const tables = CAMPAIGNS[world]?.tables;
  if (!tables) continue;
  const t = filteredTables(mergeUniversal(tables), {});
  for (const genId of GEN_IDS) {
    try {
      const result = generate(genId, t, 4, {});
      if (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {
        fail(`smoke-${world}-${genId}`, 'Result is null/empty');
      } else {
        smokeResults[world][genId] = result;
        pass(`smoke-${world}-${genId}`);
      }
    } catch (e) {
      fail(`smoke-${world}-${genId}`, `Threw: ${e.message}`);
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 4. FIELD VALIDATION — NPC MAJOR
// ══════════════════════════════════════════════════════════════════════════
for (const world of WORLDS) {
  const tables = CAMPAIGNS[world]?.tables;
  if (!tables) continue;
  const t = filteredTables(mergeUniversal(tables), {});
  let ok = true;
  for (let i = 0; i < 3; i++) {
    const r = generate('npc_major', t, 4, {});
    if (!r) { fail(`npc-major-fields-${world}`, 'generate returned null'); ok = false; break; }

    if (!r.name || typeof r.name !== 'string' || r.name === 'undefined undefined') {
      fail(`npc-major-fields-${world}`, `name was '${r.name}'`); ok = false; break;
    }
    if (!r.aspects?.high_concept) {
      fail(`npc-major-fields-${world}`, `high_concept empty`); ok = false; break;
    }
    if (!r.aspects?.trouble) {
      fail(`npc-major-fields-${world}`, `trouble empty`); ok = false; break;
    }
    if (!Array.isArray(r.aspects?.others) || r.aspects.others.length !== 3 || r.aspects.others.some(a => !a)) {
      fail(`npc-major-fields-${world}`, `others: ${JSON.stringify(r.aspects?.others)}`); ok = false; break;
    }
    if (!Array.isArray(r.skills) || r.skills.length < 4 || r.skills.length > 6) {
      fail(`npc-major-fields-${world}`, `skills length ${r.skills?.length}`); ok = false; break;
    }
    if (r.skills.some(s => s.r < 1 || s.r > 4 || !ALL_SKILLS.includes(s.name))) {
      const bad = r.skills.find(s => s.r < 1 || s.r > 4 || !ALL_SKILLS.includes(s.name));
      fail(`npc-major-fields-${world}`, `Bad skill: ${JSON.stringify(bad)}`); ok = false; break;
    }
    if (![3, 4, 6].includes(r.physical_stress)) {
      fail(`npc-major-fields-${world}`, `physical_stress was ${r.physical_stress}`); ok = false; break;
    }
    if (![3, 4, 6].includes(r.mental_stress)) {
      fail(`npc-major-fields-${world}`, `mental_stress was ${r.mental_stress}`); ok = false; break;
    }
    if (![1, 2, 3].includes(r.refresh)) {
      fail(`npc-major-fields-${world}`, `refresh was ${r.refresh}, expected 1–3`); ok = false; break;
    }
  }
  if (ok) pass(`npc-major-fields-${world}`);
}

// ══════════════════════════════════════════════════════════════════════════
// 5. FIELD VALIDATION — NPC MINOR
// ══════════════════════════════════════════════════════════════════════════
for (const world of WORLDS) {
  const tables = CAMPAIGNS[world]?.tables;
  if (!tables) continue;
  const t = filteredTables(mergeUniversal(tables), {});
  let ok = true;
  for (let i = 0; i < 3; i++) {
    const r = generate('npc_minor', t, 4, {});
    if (!r) { fail(`npc-minor-fields-${world}`, 'generate returned null'); ok = false; break; }
    if (!r.name || typeof r.name !== 'string' || r.name === 'undefined undefined') {
      fail(`npc-minor-fields-${world}`, `name was '${r.name}'`); ok = false; break;
    }
    if (!Array.isArray(r.aspects) || r.aspects.length < 1 || r.aspects.length > 2) {
      fail(`npc-minor-fields-${world}`, `aspects length ${r.aspects?.length}`); ok = false; break;
    }
    if (r.aspects.some(a => !a || typeof a !== 'string')) {
      fail(`npc-minor-fields-${world}`, `empty aspect in ${JSON.stringify(r.aspects)}`); ok = false; break;
    }
    if (![1, 2].includes(r.stress)) {
      fail(`npc-minor-fields-${world}`, `stress was ${r.stress}, expected 1–2`); ok = false; break;
    }
    if (!Array.isArray(r.skills) || r.skills.some(s => !ALL_SKILLS.includes(s.name) || s.r < 1)) {
      const bad = r.skills?.find(s => !ALL_SKILLS.includes(s.name) || s.r < 1);
      fail(`npc-minor-fields-${world}`, `Bad skill: ${JSON.stringify(bad)}`); ok = false; break;
    }
  }
  if (ok) pass(`npc-minor-fields-${world}`);
}

// ══════════════════════════════════════════════════════════════════════════
// 6. FIELD VALIDATION — PC
// ══════════════════════════════════════════════════════════════════════════
for (const world of WORLDS) {
  const tables = CAMPAIGNS[world]?.tables;
  if (!tables) continue;
  const t = filteredTables(mergeUniversal(tables), {});
  let ok = true;
  for (let i = 0; i < 2; i++) {
    const r = generate('pc', t, 4, {});
    if (!r) { fail(`pc-fields-${world}`, 'generate returned null'); ok = false; break; }
    if (!r.aspects?.high_concept) {
      fail(`pc-fields-${world}`, `high_concept empty`); ok = false; break;
    }
    if (!r.aspects?.trouble) {
      fail(`pc-fields-${world}`, `trouble empty`); ok = false; break;
    }
    if (!Array.isArray(r.skills) || r.skills.length !== 10) {
      fail(`pc-fields-${world}`, `skills length ${r.skills?.length}, expected 10`); ok = false; break;
    }
    // FCon pyramid: 1×+4, 2×+3, 3×+2, 4×+1
    const counts = { 4: 0, 3: 0, 2: 0, 1: 0 };
    r.skills.forEach(s => { if (counts[s.r] !== undefined) counts[s.r]++; });
    if (counts[4] !== 1 || counts[3] !== 2 || counts[2] !== 3 || counts[1] !== 4) {
      fail(`pc-fields-${world}`, `Pyramid wrong: +4×${counts[4]} +3×${counts[3]} +2×${counts[2]} +1×${counts[1]}`); ok = false; break;
    }
    if (r.refresh !== 3) {
      fail(`pc-fields-${world}`, `refresh was ${r.refresh}, expected 3`); ok = false; break;
    }
    if (![3, 4, 6].includes(r.physical_stress)) {
      fail(`pc-fields-${world}`, `physical_stress was ${r.physical_stress}`); ok = false; break;
    }
    if (![3, 4, 6].includes(r.mental_stress)) {
      fail(`pc-fields-${world}`, `mental_stress was ${r.mental_stress}`); ok = false; break;
    }
  }
  if (ok) pass(`pc-fields-${world}`);
}

// ══════════════════════════════════════════════════════════════════════════
// 7. ASPECT QUALITY GATE
// ══════════════════════════════════════════════════════════════════════════
for (const world of WORLDS) {
  const tables = CAMPAIGNS[world]?.tables;
  if (!tables) continue;
  const t = filteredTables(mergeUniversal(tables), {});
  let ok = true;
  for (let i = 0; i < 5; i++) {
    const r = generate('npc_major', t, 4, {});
    if (!r || !r.aspects) continue;
    const allAspects = [r.aspects.high_concept, r.aspects.trouble, ...(r.aspects.others || [])].filter(Boolean);
    for (const asp of allAspects) {
      if (asp === 'undefined' || asp === 'null' || asp === '' || asp === '[object Object]') {
        fail(`aspect-not-undefined-${world}`, `Aspect was '${asp}'`); ok = false; break;
      }
      const wc = asp.split(/\s+/).length;
      if (wc < 3 || wc > 15) {
        warn(`aspect-word-count-${world}`, `"${asp}" is ${wc} words (outside 3–15)`);
      } else if (wc < 3 || wc > 8) {
        warn(`aspect-word-count-${world}`, `"${asp}" is ${wc} words (outside ideal 3–8)`);
      }
    }
    if (!ok) break;
  }
  if (ok) pass(`aspect-not-undefined-${world}`);
}

// ══════════════════════════════════════════════════════════════════════════
// 8. SKILL VALIDITY
// ══════════════════════════════════════════════════════════════════════════
{
  let ok = true;
  for (const world of WORLDS) {
    for (const genId of GEN_IDS) {
      const r = smokeResults[world]?.[genId];
      if (!r) continue;
      const skills = Array.isArray(r.skills) ? r.skills : (Array.isArray(r.opposition) ? r.opposition.flatMap(o => o.skills || []) : []);
      for (const s of skills) {
        if (s && s.name && !ALL_SKILLS.includes(s.name)) {
          fail('skills-in-fcon-list', `${world}/${genId}: '${s.name}' not in ALL_SKILLS`);
          ok = false;
        }
      }
    }
  }
  if (ok) pass('skills-in-fcon-list');
}

// ══════════════════════════════════════════════════════════════════════════
// 9. PICK() EMPTY ARRAY GUARD
// ══════════════════════════════════════════════════════════════════════════
const PICK_TABLES = ['opposition', 'zones', 'stunts', 'names_first', 'names_last'];
for (const world of WORLDS) {
  const tables = CAMPAIGNS[world]?.tables;
  if (!tables) continue;
  const empty = PICK_TABLES.filter(k => !Array.isArray(tables[k]) || tables[k].length < 3);
  if (empty.length > 0) {
    fail(`pick-tables-nonempty-${world}`, `Too few entries: ${empty.join(', ')}`);
  } else {
    pass(`pick-tables-nonempty-${world}`);
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 10. NO RAW UNDEFINED IN OUTPUT
// ══════════════════════════════════════════════════════════════════════════
{
  let ok = true;
  for (const world of WORLDS) {
    for (const genId of GEN_IDS) {
      const r = smokeResults[world]?.[genId];
      if (!r) continue;
      const json = JSON.stringify(r);
      if (json.includes('"undefined"') || json.includes(':undefined') || json.includes('undefined undefined')) {
        fail(`no-raw-undefined-${world}-${genId}`, 'Found raw undefined in output');
        ok = false;
      }
    }
  }
  if (ok) pass('no-raw-undefined');
}

// ══════════════════════════════════════════════════════════════════════════
// STATIC ANALYSIS — Dangerous Svelte 5 Patterns
// ══════════════════════════════════════════════════════════════════════════
{
  const fs = await import('fs');
  const path = await import('path');

  function findSvelteFiles(dir) {
    let files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.name === 'node_modules' || entry.name === '.svelte-kit' || entry.name === 'build') continue;
      if (entry.isDirectory()) files = files.concat(findSvelteFiles(full));
      else if (entry.name.endsWith('.svelte')) files.push(full);
    }
    return files;
  }

  const svelteFiles = findSvelteFiles('src');
  let staticOk = true;

  // CHECK: $state() timer/timeout variables read inside $effect (infinite loop risk)
  for (const file of svelteFiles) {
    const src = fs.readFileSync(file, 'utf-8');
    const short = file.replace(/^src\//, '');

    // Find all $state timer-like variables
    const stateTimerRe = /let\s+(\w*[Tt]imer\w*|\w*[Tt]imeout\w*)\s*=\s*\$state\b/g;
    let match;
    while ((match = stateTimerRe.exec(src)) !== null) {
      const varName = match[1];
      // Check if this variable is read inside a $effect block
      const effectRe = /\$effect\s*\(\s*\(\)\s*=>\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/gs;
      let em;
      while ((em = effectRe.exec(src)) !== null) {
        const body = em[1];
        if (body.includes(varName)) {
          fail(`svelte5-state-timer-in-effect-${short}`,
            `'${varName}' is $state() AND read inside $effect — infinite loop risk. Use plain 'let' instead.`);
          staticOk = false;
        }
      }
    }

    // CHECK: $state() inside function body (invalid in Svelte 5)
    const lines = src.split('\n');
    let inScript = false;
    let braceDepth = 0;
    let inFunction = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('<script')) inScript = true;
      if (line.includes('</script')) { inScript = false; braceDepth = 0; inFunction = false; }
      if (!inScript) continue;

      // Track function depth (simplified — catches most cases)
      if (/\bfunction\b/.test(line) || /=>\s*\{/.test(line)) {
        if (braceDepth > 0) inFunction = true;
      }
      braceDepth += (line.match(/\{/g) || []).length;
      braceDepth -= (line.match(/\}/g) || []).length;
      if (braceDepth <= 0) { inFunction = false; braceDepth = 0; }

      if (inFunction && /\$state\s*\(/.test(line)) {
        fail(`svelte5-state-in-function-${short}:${i+1}`,
          `$state() inside function body at line ${i+1}. Move to component top level.`);
        staticOk = false;
      }
    }

    // CHECK: on:click= instead of onclick= (Svelte 4 syntax)
    if (/\bon:click\b/.test(src)) {
      fail(`svelte5-legacy-event-${short}`, `Found 'on:click' — use 'onclick=' (Svelte 5 syntax).`);
      staticOk = false;
    }

    // CHECK: export let (Svelte 4 props)
    if (/export\s+let\s/.test(src)) {
      fail(`svelte5-export-let-${short}`, `Found 'export let' — use '$props()' destructuring.`);
      staticOk = false;
    }

    // CHECK: <style> block in component
    if (/<style[\s>]/.test(src)) {
      fail(`no-style-block-${short}`, `Found <style> block — all CSS must be in theme.css.`);
      staticOk = false;
    }

    // CHECK: old --cv-card-* tokens in card fronts (should use --fs-* now)
    if (short.includes('cards/fronts/') && /--cv-card-/.test(src)) {
      warn(`stale-cv-token-${short}`, `Card front still uses --cv-card-* tokens — should use --fs-* fate-sheet tokens.`);
    }

    // CHECK: emoji HTML entities (should be FA icons)
    const emojiRe = /&#(?:127|128|129)\d{3};/g;
    if (emojiRe.test(src)) {
      fail(`emoji-entity-${short}`, `Found emoji HTML entity — should use Font Awesome icon.`);
      staticOk = false;
    }
  }

  if (staticOk) pass('svelte5-static-analysis');
}

// ══════════════════════════════════════════════════════════════════════════
// SUMMARY
// ══════════════════════════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(60));
console.log('  OGMA QA — Hardened Pre-Build Checks');
console.log('═'.repeat(60) + '\n');

for (const r of results) {
  if (r.status === 'PASS') {
    console.log(`  ✅ PASS  ${r.name}`);
  } else {
    console.log(`  ❌ FAIL  ${r.name} — ${r.detail}`);
  }
}
for (const w of warnings) {
  console.log(`  ⚠  WARN  ${w.name} — ${w.detail}`);
}

const total = results.length;
console.log(`\n${'─'.repeat(60)}`);
if (failures === 0) {
  console.log(`  QA PASSED — ${total} checks, 0 failures. Safe to build.`);
  if (warnings.length > 0) console.log(`  (${warnings.length} warnings — review recommended)`);
  process.exit(0);
} else {
  console.log(`  QA FAILED — ${failures} failures out of ${total} checks. Fix before npm run build.`);
  process.exit(1);
}
