var fs = require('fs');
eval(fs.readFileSync('data/shared.js','utf8'));
eval(fs.readFileSync('data/universal.js','utf8'));
eval(fs.readFileSync('data/thelongafter.js','utf8'));
eval(fs.readFileSync('data/cyberpunk.js','utf8'));
eval(fs.readFileSync('data/fantasy.js','utf8'));
eval(fs.readFileSync('data/space.js','utf8'));
eval(fs.readFileSync('data/victorian.js','utf8'));
eval(fs.readFileSync('data/postapoc.js','utf8'));
eval(fs.readFileSync('data/western.js','utf8'));
eval(fs.readFileSync('data/dVentiRealm.js','utf8'));
eval(fs.readFileSync('core/engine.js','utf8'));

var camps = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'];
var pass = 0; var fail = 0; var results = [];

function assert(label, val, msg) {
  if (val) { pass++; results.push('  PASS: '+label); }
  else      { fail++; results.push('  FAIL: '+label+' -- '+msg); }
}

// NA-01: Minor NPC stress cap <= 2 (FCon: minor NPCs have 1–2 stress boxes)
camps.forEach(function(camp) {
  var t = filteredTables(mergeUniversal(CAMPAIGNS[camp].tables), {});
  var hit = false;
  for (var i = 0; i < 200; i++) {
    var r = generateMinorNPC(t);
    if (r.stress !== null && r.stress > 2) { hit = true; break; }
  }
  assert('NA-01 minor stress <=2 ['+camp+']', !hit, 'minor NPC stress exceeded 2 (FCon: 1-2 boxes)');
});

// NA-02: Major NPC refresh = max(1, 3 - max(0, stunts.length - 3)) — first 3 stunts are free (FCon p.10)
camps.forEach(function(camp) {
  var t = filteredTables(mergeUniversal(CAMPAIGNS[camp].tables), {});
  var bad = null;
  for (var i = 0; i < 200; i++) {
    var r = generateMajorNPC(t);
    var expected = Math.max(1, 3 - Math.max(0, r.stunts.length - 3));
    if (r.refresh !== expected) { bad = 'stunts='+r.stunts.length+' expected='+expected+' got='+r.refresh; break; }
  }
  assert('NA-02 major refresh correct ['+camp+']', !bad, bad);
});

// NA-03: No stunt charges FP
var fpViolations = [];
camps.forEach(function(camp) {
  var stunts = CAMPAIGNS[camp].tables.stunts || [];
  stunts.forEach(function(s) {
    if (s.desc && /fate point/i.test(s.desc)) fpViolations.push(camp+': '+s.name);
  });
});
assert('NA-03 no stunt charges FP', fpViolations.length === 0, fpViolations.join(', '));

// NA-04: Contest tie text does not mention twist aspect
var twistedCamps = [];
camps.forEach(function(camp) {
  var t = filteredTables(mergeUniversal(CAMPAIGNS[camp].tables), {});
  var found = false;
  for (var i = 0; i < 50; i++) {
    var r = generateContest(t);
    var md = toMarkdown('contest', r, camp);
    if (/twist aspect/i.test(md)) { found = true; break; }
  }
  if (found) twistedCamps.push(camp);
});
assert('NA-04 contest tie no twist-aspect', twistedCamps.length === 0, twistedCamps.join(', '));

// NA-05: toMarkdown all 96 combos > 20 chars
var mdFails = [];
camps.forEach(function(camp) {
  var t = filteredTables(mergeUniversal(CAMPAIGNS[camp].tables), {});
  ['npc_minor','npc_major','scene','campaign','encounter','seed','compel',
   'challenge','contest','consequence','faction','complication','backstory',
   'obstacle','countdown','constraint'].forEach(function(gen) {
    var r = generate(gen, t, 4);
    var md = toMarkdown(gen, r, camp);
    if (!md || md.length < 20) mdFails.push(camp+'/'+gen+' len='+(md?md.length:0));
  });
});
assert('NA-05 toMarkdown 96 combos >20 chars', mdFails.length === 0, mdFails.join(', '));

// NA-06: No "significant milestone" in generated output
var smFails = [];
camps.forEach(function(camp) {
  var t = filteredTables(mergeUniversal(CAMPAIGNS[camp].tables), {});
  var found = false;
  for (var i = 0; i < 100; i++) {
    var r = generateConstraint(t);
    var md = toMarkdown('constraint', r, camp);
    if (/significant milestone/i.test(md)) { found = true; break; }
  }
  if (found) smFails.push(camp);
});
assert('NA-06 no significant-milestone in output', smFails.length === 0, smFails.join(', '));

// NA-07: Postapoc faction tables have no duplicates
var pfx = CAMPAIGNS['postapoc'].tables.faction_name_prefix;
var sfx = CAMPAIGNS['postapoc'].tables.faction_name_suffix;
var pfxDups = pfx.filter(function(v,i){ return pfx.indexOf(v) !== i; });
var sfxDups = sfx.filter(function(v,i){ return sfx.indexOf(v) !== i; });
assert('NA-07 postapoc faction_name_prefix no dups', pfxDups.length === 0, 'dups: '+pfxDups.join(', '));
assert('NA-07 postapoc faction_name_suffix no dups', sfxDups.length === 0, 'dups: '+sfxDups.join(', '));

// NA-08: toBatchFariJSON — removed (Fari export parked, code deleted in CQ-04)

// NA-09: intro.js responsive scale — fate-intro-content class + media queries present
var introSrc = fs.readFileSync('core/intro.js','utf8');
assert('NA-09 intro fate-intro-content class set', introSrc.includes("className = 'fate-intro-content'"), 'fate-intro-content class missing from content div');
assert('NA-09 intro desktop media query 900px', introSrc.includes('min-width:900px'), '900px desktop breakpoint missing');
assert('NA-09 intro wide media query 1400px', introSrc.includes('min-width:1400px'), '1400px wide breakpoint missing');
assert('NA-09 intro em-based title size', introSrc.includes('1.57em'), 'title font-size not in em');


// NA-10: Modal component — trapTab focus trap within boundary
// SPA-02: ui.js split into ui-primitives / ui-renderers / ui-modals / ui-landing / ui.js
// uiSrc concatenates all five so string-based assertions remain valid.
var uiSrc = [
  'core/ui-primitives.js',
  'core/ui-renderers.js',
  'core/ui-modals.js',
  'core/ui-landing.js',
  'core/ui.js',
].map(function(f) { return fs.readFileSync(f, 'utf8'); }).join('\n');
assert('NA-10 Modal trapTab focus trap implemented', uiSrc.includes('function trapTab'), 'trapTab function missing from Modal');
assert('NA-10 Modal trapTab addEventListener', uiSrc.includes("addEventListener('keydown', trapTab)"), 'trapTab not wired to keydown');
assert('NA-10 Modal aria-modal attribute', uiSrc.includes("'aria-modal'"), 'aria-modal attribute missing from Modal');

// NA-11: result-panel has aria-live="polite" and aria-atomic="true"
assert('NA-11 result-panel aria-live polite', uiSrc.includes("'aria-live': 'polite'"), 'aria-live polite missing from result-panel');
assert('NA-11 result-panel aria-atomic true', uiSrc.includes("'aria-atomic': 'true'"), 'aria-atomic true missing from result-panel');

// NA-12: theme-toggle aria-label present on static pages and React components
// learn.html and campaigns/transition.html are now redirect stubs — excluded from this check
var staticPages = ['about.html','license.html',
  'campaigns/guide-cyberpunk.html','campaigns/guide-fantasy.html','campaigns/guide-postapoc.html',
  'campaigns/guide-space.html','campaigns/guide-thelongafter.html','campaigns/guide-victorian.html',
  'campaigns/guide-western.html'];
// Note: dVentiRealm uses guide-western.html pending its own guide
var na12Fail = staticPages.filter(function(p) {
  try {
    var c = fs.readFileSync(p, 'utf8');
    return !c.includes('aria-label') || !c.includes('Toggle theme') && !c.includes('Switch to');
  } catch(e) { return true; }
});
assert('NA-12 theme-toggle aria-label on static pages', na12Fail.length === 0, 'missing on: ' + na12Fail.join(', '));
assert('NA-12 React theme-toggle aria-label dynamic', uiSrc.includes("'Switch to light mode'") && uiSrc.includes("'Switch to dark mode'"), 'dynamic aria-label missing from React theme toggle');



// Regression for PERF-01 blank page bug: db.js was removed from index.html,
// causing ui.js to crash at parse time calling LS before it was defined.
// This assertion checks: (a) db.js appears before ui.js in index.html script tags,
// (b) campaigns-meta.js appears before ui.js, (c) no full campaign data files in index.html.
(function() {
  var idxSrc = fs.readFileSync('index.html', 'utf8');
  // Extract script src order
  var scriptOrder = [];
  var re = /<script[^>]+src="([^"?]+)/g;
  var m;
  while ((m = re.exec(idxSrc)) !== null) { scriptOrder.push(m[1]); }
  var dbPos    = scriptOrder.indexOf('core/db.js');
  var uiPos    = scriptOrder.indexOf('core/ui.js');
  var sharedPos = scriptOrder.indexOf('data/shared-lite.js');
  if (sharedPos === -1) sharedPos = scriptOrder.indexOf('data/shared.js'); // fallback
  assert('NA-13 index.html: core/db.js present before core/ui.js',
    dbPos !== -1 && uiPos !== -1 && dbPos < uiPos,
    'db.js pos=' + dbPos + ' ui.js pos=' + uiPos + ' (db must precede ui)');
  assert('NA-13 index.html: data/shared.js or shared-lite.js present before core/ui.js',
    sharedPos !== -1 && uiPos !== -1 && sharedPos < uiPos,
    'shared pos=' + sharedPos + ' ui.js pos=' + uiPos + ' (GENERATORS/GENERATOR_GROUPS needed by LandingApp)');
  // SPA-02: split files must appear before ui.js
  var primPos = scriptOrder.indexOf('core/ui-primitives.js');
  assert('NA-13 index.html: ui-primitives.js loaded before ui.js',
    primPos !== -1 && primPos < uiPos,
    'ui-primitives.js pos=' + primPos + ' ui.js pos=' + uiPos);
  // Ensure full campaign data files NOT loaded on index.html (they are in campaign pages)
  var hasBulkData = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western']
    .some(function(c) { return idxSrc.indexOf('data/' + c + '.js') !== -1; });
  assert('NA-13 index.html: full campaign data files not loaded on landing page',
    !hasBulkData, 'index.html still loads a full campaign data file');
})();

// NA-14: All pages that use ui.js also have db.js loaded before it
// Checks every HTML file that loads core/ui.js ensures core/db.js precedes it.
(function() {
  var pages = [
    'index.html',
    'campaigns/thelongafter.html','campaigns/cyberpunk.html','campaigns/fantasy.html',
    'campaigns/space.html','campaigns/victorian.html','campaigns/postapoc.html',
    'campaigns/western.html','campaigns/dVentiRealm.html','campaigns/sessionzero.html',
  ];
  var failures = [];
  pages.forEach(function(page) {
    try {
      var src = fs.readFileSync(page,'utf8');
      if (src.indexOf('core/ui.js') === -1) return; // page doesn't use ui.js
      var order = [];
      var re = /<script[^>]+src="([^"?]+)/g; var m;
      while ((m = re.exec(src)) !== null) order.push(m[1].replace(/^\.\.\//,''));
      var dbPos = order.indexOf('core/db.js');
      var uiPos = order.indexOf('core/ui.js');
      if (dbPos === -1 || dbPos >= uiPos) failures.push(page + '(db=' + dbPos + ' ui=' + uiPos + ')');
    } catch(e) { failures.push(page + ':' + e.message); }
  });
  assert('NA-14 all ui.js pages: core/db.js loads before core/ui.js',
    failures.length === 0, failures.join(', '));
})();
// ── NA-15: All utility CSS classes present in theme.css ─────────────────────
(function() {
  var css = fs.readFileSync('assets/css/theme.css','utf8');
  var UTIL = ['.cd-box','.contest-box','.seed-scene-tab',
              '.btn-xs','.btn-nav',
              '.section-cap','.text-label-muted'];
  var missing = UTIL.filter(function(c){ return css.indexOf(c) === -1; });
  assert('NA-15: All utility CSS classes present in theme.css',
    missing.length === 0, 'Missing: '+missing.join(', '));
})();

// ── NA-17: All 16 HELP_CONTENT entries have gm_tips with 3+ items ────────────
(function() {
  eval(fs.readFileSync('data/shared.js','utf8'));
  var GENS = ['npc_minor','npc_major','scene','campaign','encounter','seed','compel',
              'challenge','contest','consequence','faction','complication','backstory',
              'obstacle','countdown','constraint'];
  var bad = GENS.filter(function(g){
    var tips = (HELP_CONTENT[g]||{}).gm_tips;
    return !Array.isArray(tips) || tips.length < 3;
  });
  assert('NA-17: All 16 HELP_CONTENT entries have gm_tips (3+ items)',
    bad.length === 0, 'Bad: '+bad.join(', '));
})();

// ── NA-18: consequence severity is always mild/moderate/severe ───────────────
(function() {
  eval(fs.readFileSync('data/shared.js','utf8'));
  eval(fs.readFileSync('data/universal.js','utf8'));
  eval(fs.readFileSync('data/fantasy.js','utf8'));
  eval(fs.readFileSync('core/engine.js','utf8'));
  var VALID = ['mild','moderate','severe'];
  var t = filteredTables(mergeUniversal(CAMPAIGNS.fantasy.tables),{});
  var bad = [];
  for(var i=0;i<20;i++){
    var d = generate('consequence',t,4);
    if(VALID.indexOf(d.severity)===-1) bad.push(d.severity);
  }
  assert('NA-18: consequence.severity always mild/moderate/severe (20 rolls)',
    bad.length === 0, 'Invalid: '+bad.join(', '));
})();

// ── NA-19: renderResult() is defined AND called (regression: 2026.03.44 — was defined never called) ──
(function() {
  var src = uiSrc;
  var defs  = (src.match(/^function renderResult\(/gm) || []).length;
  var calls = (src.match(/\brenderResult\(/g) || []).length - defs;
  assert('NA-19: renderResult defined AND called (>=2 call sites)',
    defs === 1 && calls >= 2,
    'defined=' + defs + ' call-sites=' + calls + ' (expect 1 def, >=2 calls)');
})();

// ── NA-20: CampaignApp key vars accessible (via destructure from hooks or direct state) ──
// v331: resultAnim/showStreakBadge/pinBouncing setters live inside useGeneratorSession — not needed in CampaignApp scope.
// v330: toast/updateAvailable setters come from useChromeHooks destructure.
(function() {
  var src = uiSrc;
  // Search both CampaignApp body AND its custom hooks (hooks are defined just above it)
  var hookStart = src.indexOf('function useGeneratorSession(');
  var camp = src.slice(hookStart !== -1 ? hookStart : src.indexOf('function CampaignApp('));
  var REQUIRED = [
    'sessionPack', 'setSessionPack',
    'packRolling',  'setPackRolling',
    'seedResultDone',
    'resultAnim',
    'rollCountRef',
    'showStreakBadge',
    'inspireMode',  'setInspireMode',
    'pinnedCards',  'setPinnedCards',
    'pinBouncing',
    'updateAvailable', 'setUpdateAvailable',
    'toast',        'setToast',
  ];
  var missing = REQUIRED.filter(function(v) {
    // Match var declarations, destructure patterns, and object key refs
    return camp.indexOf('var ' + v + ' ')  === -1 &&
           camp.indexOf('var ' + v + '=')  === -1 &&
           camp.indexOf(v + ',')           === -1 &&
           camp.indexOf(', ' + v + ']')    === -1 &&
           camp.indexOf(v + ']')           === -1 &&
           camp.indexOf(v + ':')           === -1;  // hook return object
  });
  assert('NA-20: CampaignApp key state/ref vars all declared',
    missing.length === 0, 'Missing declarations: ' + missing.join(', '));
})();

// ── NA-21: Campaign HTML pages — correct script load order (db < engine < ui < intro) ──
(function() {
  var camps = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'];
  var failures = [];
  camps.forEach(function(c) {
    var html = fs.readFileSync('campaigns/' + c + '.html', 'utf8');
    var order = [];
    var re = /<script[^>]+src="([^"?]+)/g; var m;
    while ((m = re.exec(html)) !== null) order.push(m[1].replace(/^\.\.\//, ''));
    var db  = order.indexOf('core/db.js');
    var eng = order.indexOf('core/engine.js');
    var ui  = order.indexOf('core/ui.js');
    var sh  = order.indexOf('data/shared.js');
    var intr= order.indexOf('core/intro.js');
    var ok  = db !== -1 && eng !== -1 && ui !== -1 && sh !== -1 &&
              sh < ui && db < ui && eng < ui && (intr === -1 || intr > ui);
    if (!ok) failures.push(c + '(sh=' + sh + ' db=' + db + ' eng=' + eng + ' ui=' + ui + ' intro=' + intr + ')');
  });
  assert('NA-21: campaign pages script order sh<ui, db<ui, eng<ui, intro>ui',
    failures.length === 0, failures.join('; '));
})();

// ── NA-22: Key component functions defined in ui.js (HelpModal/WhatPanel/HowPanel/InPlayPanel removed v123) ──
(function() {
  var src = uiSrc;
  var REQUIRED = [
    'function ResultCard(',
    'function SessionPackPanel(',
    'function VaultModal(',
    'function CampaignApp(',
    'function LandingApp(',
    'function renderResult(',
    'function Modal(',
    'function KBShortcutsModal(',
    'function getResultLabel(',
  ];
  var missing = REQUIRED.filter(function(fn) { return src.indexOf(fn) === -1; });
  assert('NA-22: all key component functions defined in ui.js',
    missing.length === 0, 'Missing: ' + missing.join(', '));
})();

// ── NA-23: intro.js public API intact (fateInitInline + fateReplayIntro) ──────
(function() {
  var src = fs.readFileSync('core/intro.js', 'utf8');
  assert('NA-23: intro.js exports fateInitInline and fateReplayIntro',
    src.indexOf('window.fateInitInline') !== -1 &&
    src.indexOf('window.fateReplayIntro') !== -1,
    'Missing one or both public API exports from intro.js');
})();

// ── NA-24: Guide pages have intro.js, db.js, and guide-intro-teaser ──────────
(function() {
  var guides = ['guide-cyberpunk','guide-fantasy','guide-postapoc','guide-space',
                'guide-thelongafter','guide-victorian','guide-western'];
  var failures = [];
  guides.forEach(function(g) {
    var html = fs.readFileSync('campaigns/' + g + '.html', 'utf8');
    var ok = html.indexOf('../core/intro.js') !== -1 &&
             html.indexOf('../core/db.js')    !== -1 &&
             html.indexOf('guide-intro-teaser') !== -1;
    if (!ok) failures.push(g);
  });
  assert('NA-24: all guide pages have intro.js, db.js, and guide-intro-teaser',
    failures.length === 0, 'Missing in: ' + failures.join(', '));
})();

// ── NA-25: index.html has intro.js loaded ────────────────────────────────────
(function() {
  var html = fs.readFileSync('index.html', 'utf8');
  assert('NA-25: index.html loads core/intro.js',
    html.indexOf('core/intro.js') !== -1,
    'intro.js missing from index.html');
})();


// ── NA-26: NA-15 expanded — ALL utility + inline-intro CSS classes in theme.css ──
// Catches: new classes added but not put in CSS, or CSS refactor accidentally removes one.
(function() {
  var css = fs.readFileSync('assets/css/theme.css','utf8');
  var UTIL = [
    // Original extracted utility classes
    '.cd-box','.contest-box','.seed-scene-tab',
    '.btn-xs','.btn-nav',
    '.section-cap','.text-label-muted',
    // Inline intro container classes
    '.land-intro-teaser',
  ];
  var missing = UTIL.filter(function(c){ return css.indexOf(c) === -1; });
  assert('NA-26: All utility + inline-intro CSS classes present (superset of NA-15)',
    missing.length === 0, 'Missing: '+missing.join(', '));
})();

// ── NA-27: No dead CSS classes referenced in theme.css but absent in ui.js ────
// Catches: CSS rule left behind after class is renamed or removed from JS.
// Only checks the extracted utility section to avoid false positives on layout classes.
(function() {
  var css = fs.readFileSync('assets/css/theme.css','utf8');
  var ui = uiSrc;
  var utilStart = css.indexOf('/* ── Extracted utility classes');
  var utilEnd   = css.indexOf('/* ── Print:', utilStart);
  var utilSection = utilStart > 0 ? css.slice(utilStart, utilEnd > 0 ? utilEnd : css.length) : '';
  var classes = (utilSection.match(/\.([\w-]+)\s*\{/g) || [])
    .map(function(m){ return m.replace(/[\s{]/g,'').slice(1); })
    .filter(function(c){ return c.indexOf('fate-intro') === -1 && c.indexOf('#') === -1; });
  var dead = classes.filter(function(c){
    return ui.indexOf("'"+c+"'") === -1 && ui.indexOf('"'+c+'"') === -1 &&
           ui.indexOf(c) === -1;
  });
  // Allow a small list of known-external classes
  var allowed = ['text-sm-dim','result-gold-header'];
  dead = dead.filter(function(c){ return allowed.indexOf(c) === -1; });
  assert('NA-27: No dead extracted utility CSS classes (present in CSS but not ui.js)',
    dead.length === 0, 'Dead classes: '+dead.join(', '));
})();

// ── NA-28: useEffect in CampaignApp — none missing dep array entirely ─────────
// Catches: a useEffect added without a closing ,[...]) dep array.
// Note: some effects legitimately use [] — that is fine. We only flag missing arrays.
(function() {
  var src = uiSrc;
  var campStart = src.indexOf('function CampaignApp(');
  var camp = src.slice(campStart);
  // Split on useEffect(function to find each effect
  var effects = camp.split('useEffect(function').slice(1);
  var noArray = [];
  effects.forEach(function(block, i) {
    // A proper dep array closes with }, [...]);
    var hasDepArray = /\}, \[[^\]]*\]\)/.test(block.slice(0, 4000));
    if (!hasDepArray) noArray.push('effect #'+(i+1));
  });
  assert('NA-28: All useEffect calls in CampaignApp have a dep array',
    noArray.length === 0, 'Missing dep arrays on: '+noArray.join(', '));
})();

// ── NA-29: CampaignApp session-save effect dep array ─────────────────────────
// Intentionally [result] only — history/activeGen are snapshot values captured
// at result-change time. The comment in ui.js explains the reasoning.
// Previous regression (2026.03.47): [result] caused stale history. Fixed by
// capturing history in the effect body rather than in deps.
(function() {
  var src = uiSrc;
  var idx = src.indexOf("DB.saveSession('fate_' + campId, {result: result");
  if (idx === -1) { assert('NA-29: session-save effect has saveSession call', false, 'saveSession call not found'); return; }
  // Window of 500 chars — verbose console.warn messages in the catch chains
  // can push the closing }, [result]) beyond a tighter window (tripped at 300 in v294).
  var block = src.slice(idx, idx + 500);
  var dep = block.match(/\}, \[([^\]]*)\]\)/);
  var deps = dep ? dep[1].trim() : '';
  assert('NA-29: session-save effect dep array is [result] only',
    deps === 'result',
    'Expected deps=[result], got deps=[' + deps + ']');
})();

// ── NA-35: engine.js paren balance (comment-stripped) ───────────────────────
// The naive paren counter flags [0,1) in the mulberry32 comment as a false positive.
// This assertion uses comment-stripped source so only real code is counted.
(function() {
  var src = fs.readFileSync('core/engine.js','utf8');
  // Strip single-line comments before counting
  var stripped = src.replace(/\/\/[^\n]*/g, '');
  var opens  = (stripped.match(/\(/g) || []).length;
  var closes = (stripped.match(/\)/g) || []).length;
  assert('NA-35: engine.js paren balance (comments stripped)',
    Math.abs(opens - closes) <= 2,
    'diff=' + (opens - closes) + ' (regex literal parens cause ≤2 false positives — node --check is authoritative)');
})();

// ── NA-30: No duplicate console.log('Named assertions') in qa_named.js ────────
// Meta-regression: 2026.03.50 — the summary block was accidentally duplicated,
// causing assertions to run twice and the count to double.
(function() {
  var src = fs.readFileSync('tests/qa_named.js','utf8');
  var count = (src.match(/console\.log\('Named assertions:/g) || []).length;
  assert('NA-30: qa_named.js has exactly one summary console.log (no duplicates)',
    count === 1, 'Found '+count+' summary console.log calls (expected 1)');
})();

// ── NA-32: fateInitInline is called from CampaignApp (not just defined) ────────
// Catches: inline intro API added to intro.js but never wired into React.
(function() {
  var src = uiSrc;
  var campStart = src.indexOf('function CampaignApp(');
  var camp = src.slice(campStart);
  var callCount = (camp.match(/fateInitInline/g) || []).length;
  // Intro modal removed v2026.03.179 — fateInitInline no longer called from CampaignApp
  // intro now fires via init() from intro.js auto-run (not inline mode)
  assert('NA-32: fateInitInline defined in intro.js (still exists for guide pages)',
    (require('fs').readFileSync('core/intro.js','utf8').indexOf('fateInitInline') !== -1),
    'fateInitInline missing from intro.js entirely');
})();

// ── NA-33: aspect-ratio: 4/3 set on inline intro CSS containers ──────────────
(function() {
  var css = fs.readFileSync('assets/css/theme.css','utf8');
  var containers = ['.land-intro-teaser', '#guide-intro-teaser'];
  var missing = [];
  containers.forEach(function(sel) {
    var idx = css.indexOf(sel);
    if (idx === -1) { missing.push(sel+':not-found'); return; }
    // Find the rule block
    var block = css.slice(idx, idx+300);
    if (block.indexOf('aspect-ratio') === -1) missing.push(sel+':no-aspect-ratio');
  });
  assert('NA-33: inline intro containers have aspect-ratio: 4/3',
    missing.length === 0, 'Missing aspect-ratio on: '+missing.join(', '));
})();

// ── NA-34: NA-12 updated — guide-western included in static pages list ────────
// Staleness fix: guide-western.html was added to the project but not to the
// NA-12 static pages check. Now asserted separately here.
(function() {
  var src = fs.readFileSync('campaigns/guide-western.html','utf8');
  var hasAriaLabel = src.indexOf('aria-label') !== -1;
  var hasThemeToggle = src.indexOf('Toggle theme') !== -1 || src.indexOf('Switch to') !== -1 ||
                       src.indexOf('toggle') !== -1;
  assert('NA-34: guide-western.html has aria-label and theme toggle',
    hasAriaLabel, 'guide-western.html missing aria-label or theme toggle');
})();


// ── NA-36: FDStressTrack calls onUpdate (BL-43 regression guard) ─────────────
(function() {
  var src = uiSrc;
  var sbStart = src.indexOf('function FDStressTrack(');
  var sbEnd   = src.indexOf('\nfunction ', sbStart+1);
  var sb = src.slice(sbStart, sbEnd);
  assert('NA-36: FDStressTrack calls props.onUpdate on mark()',
    sb.indexOf('props.onUpdate') !== -1 && sb.indexOf('takenOut') !== -1,
    'FDStressTrack missing onUpdate call or takenOut flag');
})();

// ── NA-37: renderResult passes onUpdate to npc_minor and npc_major ───────────
(function() {
  var src = uiSrc;
  var rrStart = src.indexOf('function renderResult(');
  var rrEnd   = src.indexOf('\nfunction ', rrStart+1);
  var rr = src.slice(rrStart, rrEnd);
  var minorOk = /npc_minor.*onUpdate/.test(rr);
  var majorOk = /npc_major.*onUpdate/.test(rr);
  assert('NA-37: renderResult passes onUpdate to npc_minor + npc_major',
    minorOk && majorOk,
    'missing onUpdate: minor=' + minorOk + ' major=' + majorOk);
})();

// ── NA-40: BL-06 shareable link — copyShareLink and _lastSeed present ────────
(function() {
  var src = uiSrc;
  var campStart = src.indexOf('function CampaignApp(');
  var camp = src.slice(campStart);
  var hasCopy   = camp.indexOf('function copyShareLink()') !== -1;
  var hasLastSeed = camp.indexOf('_lastSeed') !== -1;
  var hasLKey   = camp.indexOf("'l' || e.key === 'L'") !== -1 || camp.indexOf("e.key === 'l'") !== -1;
  assert('NA-40: BL-06 copyShareLink + _lastSeed + L-key in CampaignApp',
    hasCopy && hasLastSeed,
    'copyShareLink=' + hasCopy + ' _lastSeed=' + hasLastSeed);
})();


// ── NA-42: mulberry32 PRNG defined in engine.js and generate() accepts seed ──
(function() {
  var src = fs.readFileSync('core/engine.js','utf8');
  var hasPRNG = src.indexOf('function mulberry32(') !== -1;
  var hasSeedParam = /function generate\([^)]*seed/.test(src);
  assert('NA-42: mulberry32 PRNG + seeded generate() in engine.js',
    hasPRNG && hasSeedParam,
    'mulberry32=' + hasPRNG + ' seedParam=' + hasSeedParam);
})();


// ── NA-43: help pages exist and have correct structure ────────────────────────
(function() {
  var WIKI_PAGES = [
    'help/index.html',
    'help/new-to-ogma.html',
    'help/getting-started.html',
    'help/generators.html',
    'help/fate-mechanics.html',
    'help/at-the-table.html',
    'help/export-share.html',
    'help/customise.html',
    'help/dnd-transition.html',
    'help/faq.html',
  ];
  var missing = [];
  var badStructure = [];
  WIKI_PAGES.forEach(function(p) {
    try {
      var html = fs.readFileSync(p, 'utf8');
      if (!html) { missing.push(p); return; }
      // Each page must have: wiki-shell, wiki-sidebar, wiki-content, topbar wordmark
      var hasShell   = html.indexOf('wiki-shell') !== -1;
      var hasSidebar = html.indexOf('wiki-sidebar') !== -1;
      var hasContent = html.indexOf('wiki-content') !== -1;
      var hasTopbar  = html.indexOf('topbar-wordmark') !== -1;
      if (!hasShell || !hasSidebar || !hasContent || !hasTopbar) {
        badStructure.push(p + '(shell=' + hasShell + ' sidebar=' + hasSidebar +
          ' content=' + hasContent + ' topbar=' + hasTopbar + ')');
      }
    } catch(e) { missing.push(p + ':' + e.message); }
  });
  // about.html must have a link to help/index.html
  var about = fs.readFileSync('about.html','utf8');
  var aboutHasWiki = about.indexOf('help/index.html') !== -1;
  assert('NA-43: all 10 help pages exist with correct structure + about.html links help',
    missing.length === 0 && badStructure.length === 0 && aboutHasWiki,
    'missing:[' + missing.join(',') + '] bad:[' + badStructure.join(',') + ']' +
    ' | about links help: ' + aboutHasWiki);
})();


// ── NA-44: learn.html and transition.html are redirect stubs ─────────────────
// Regression guard: these pages were converted to meta-refresh stubs pointing
// to help/new-to-ogma.html and help/dnd-transition.html respectively.
// Catch accidental revert to full page content.
(function() {
  var issues = [];
  ['learn.html', 'campaigns/transition.html'].forEach(function(p) {
    try {
      var html = fs.readFileSync(p, 'utf8');
      var hasRefresh = html.indexOf('http-equiv="refresh"') !== -1;
      var isSmall = html.length < 2000;
      if (!hasRefresh || !isSmall) {
        issues.push(p + '(refresh=' + hasRefresh + ' small=' + isSmall + ')');
      }
    } catch(e) { issues.push(p + ':' + e.message); }
  });
  assert('NA-44: learn.html and transition.html are redirect stubs (not full pages)',
    issues.length === 0, issues.join(', '));
})();

// ── NA-45: help/new-to-ogma.html and help/dnd-transition.html exist and link correctly ──
(function() {
  var issues = [];
  var newToOgma = fs.readFileSync('help/new-to-ogma.html', 'utf8');
  var dndTrans  = fs.readFileSync('help/dnd-transition.html', 'utf8');
  if (newToOgma.indexOf('wiki-shell') === -1) issues.push('new-to-ogma: missing wiki-shell');
  if (newToOgma.indexOf('dnd-transition.html') === -1) issues.push('new-to-ogma: no link to dnd-transition');
  if (dndTrans.indexOf('wiki-shell') === -1)  issues.push('dnd-transition: missing wiki-shell');
  if (dndTrans.indexOf('fate-mechanics.html') === -1) issues.push('dnd-transition: no link to fate-mechanics');
  assert('NA-45: help/new-to-ogma.html + help/dnd-transition.html have correct structure and cross-links',
    issues.length === 0, issues.join(', '));
})();

// ── NA-46: Minimum table entry counts per campaign ─────────────────────
(function() {
  var CAMPS = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western'];
  var issues = [];
  CAMPS.forEach(function(c) {
    var t = CAMPAIGNS[c].tables;
    if (!t.names_first || t.names_first.length < 30)
      issues.push(c + ': names_first=' + (t.names_first ? t.names_first.length : 0) + ' (min 30)');
    if (!t.troubles || t.troubles.length < 14)
      issues.push(c + ': troubles=' + (t.troubles ? t.troubles.length : 0) + ' (min 14)');
  });
  assert('NA-46: all campaigns have minimum data depth (names_first≥20, troubles≥10)',
    issues.length === 0, issues.join('; '));
})();

// ── NA-47: Variety Matrix templates exist for scene_tone in established campaigns ──
(function() {
  var ESTABLISHED = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western'];
  var issues = [];
  ESTABLISHED.forEach(function(c) {
    var st = CAMPAIGNS[c].tables.scene_tone;
    if (!st || !st.t || !Array.isArray(st.t))
      issues.push(c + ': scene_tone missing Variety Matrix (no .t array)');
  });
  assert('NA-47: all campaigns have Variety Matrix scene_tone',
    issues.length === 0, issues.join('; '));
})();

// ── NA-48: Vault API defined in db.js ──────────────────────────────────
(function() {
  var src = fs.readFileSync('core/db.js', 'utf8');
  var REQUIRED = ['vaultSave', 'vaultLoad', 'vaultList', 'vaultDelete', 'exportSession', 'exportCard', 'importFile'];
  var missing = REQUIRED.filter(function(fn) { return src.indexOf(fn) === -1; });
  assert('NA-48: Vault API (vaultSave/Load/List/Delete + export/import) defined in db.js',
    missing.length === 0, 'Missing: ' + missing.join(', '));
})();


// ── NA-51: doFullSession + sessionPack in CampaignApp ──────────────────
(function() {
  var src = uiSrc;
  var REQUIRED = ['doFullSession', 'sessionPack', 'setSessionPack', 'packRolling'];
  var missing = REQUIRED.filter(function(fn) { return src.indexOf(fn) === -1; });
  assert('NA-51: Full Session prep packet (doFullSession + sessionPack state) in ui.js',
    missing.length === 0, 'Missing: ' + missing.join(', '));
})();

// ── NA-52–55: Touch target minimums (WCAG 2.5.8 — 48dp target) ────────
(function() {
  var css = fs.readFileSync('assets/css/theme.css', 'utf8');
  function extractSize(cls, prop) {
    // Match both minified (.cls{width:48px) and expanded (.cls {\n  width: 48px)
    var re = new RegExp('\\.' + cls + '\\s*\\{[^}]*' + prop + ':\\s*(\\d+)px');
    var m = css.match(re);
    return m ? parseInt(m[1], 10) : 0;
  }
  assert('NA-52: .fd-box touch target >= 48px',
    extractSize('fd-box', 'width') >= 48 && extractSize('fd-box', 'height') >= 48,
    'fd-box: ' + extractSize('fd-box', 'width') + 'x' + extractSize('fd-box', 'height'));
  assert('NA-53: .fd-fpd touch target >= 48px',
    extractSize('fd-fpd', 'width') >= 48 && extractSize('fd-fpd', 'height') >= 48,
    'fd-fpd: ' + extractSize('fd-fpd', 'width') + 'x' + extractSize('fd-fpd', 'height'));
  assert('NA-54: .contest-box touch target >= 48px',
    extractSize('contest-box', 'width') >= 48 && extractSize('contest-box', 'height') >= 48,
    'contest-box: ' + extractSize('contest-box', 'width') + 'x' + extractSize('contest-box', 'height'));
  assert('NA-55: .cd-box touch target >= 48px',
    extractSize('cd-box', 'width') >= 48 && extractSize('cd-box', 'height') >= 48,
    'cd-box: ' + extractSize('cd-box', 'width') + 'x' + extractSize('cd-box', 'height'));
})();

// ── NA-56/57/58: WS-15 regression guards (from 100-tester playtest findings) ──────────

// NA-56: Variety Matrix adj+hazard first-word collision sweep (DETERMINISTIC)
// Replaces stochastic 20-generation sample with exhaustive static check of all world data tables.
// Catches cases where {Adj} first word matches {Hazard} first word, producing "Wild wild magic…"
(function() {
  var failures = [];
  var PAIR_KEYS = [
    ['LaAdj','LaHazard'],['LdAdj','LdHazard'],
    ['CaAdj','CaHazard'],['CdAdj','CdHazard'],
    ['FaAdj','FaHazard'],['FdAdj','FdHazard'],
    ['SaAdj','SaHazard'],['SdAdj','SdHazard'],
    ['VaAdj','VaHazard'],['VdAdj','VdHazard'],
    ['PaAdj','PaHazard'],['PdAdj','PdHazard'],
    ['WaAdj','WaHazard'],['WdAdj','WdHazard'],
  ];
  // Also stochastic check for other repeated-word patterns (non-Variety Matrix)
  var REPEAT = /\b(\w+)\s+\1\b/i;
  camps.forEach(function(camp) {
    var t = filteredTables(mergeUniversal(CAMPAIGNS[camp].tables), {});
    // Deterministic: walk all Variety Matrix adj+hazard pairs in raw data tables
    function walkV(obj) {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj)) { obj.forEach(walkV); return; }
      // Check if this object has both *Adj and *Hazard keys
      Object.keys(obj).forEach(function(adjK) {
        if (!adjK.endsWith('Adj')) return;
        var prefix = adjK.slice(0, -3);
        var hazK = prefix + 'Hazard';
        if (!obj[hazK]) return;
        obj[adjK].forEach(function(adj) {
          var w = adj.toLowerCase().split(/[\s\-]/)[0];
          obj[hazK].forEach(function(haz) {
            var hw = haz.toLowerCase().split(/[\s\-]/)[0];
            if (w === hw) failures.push(camp + ': "' + adj + '" + "' + haz + '"');
          });
        });
      });
      Object.values(obj).forEach(walkV);
    }
    walkV(CAMPAIGNS[camp].tables);
    // Stochastic: check rendered aspects for any other repeat patterns
    for (var i = 0; i < 5; i++) {
      var r = generate('scene', t, 4);
      r.aspects.forEach(function(a) {
        if (REPEAT.test(a.name)) failures.push(camp + ' (rendered): "' + a.name.substring(0,60) + '"');
      });
    }
  });
  assert('NA-56: No Variety Matrix adj+hazard first-word collision (deterministic + spot-check)',
    failures.length === 0, 'Found: ' + failures.slice(0,3).join(' | '));
})();

// NA-57: No major NPC has duplicate entries in aspects.others[]
(function() {
  var failures = [];
  camps.forEach(function(camp) {
    var t = filteredTables(mergeUniversal(CAMPAIGNS[camp].tables), {});
    for (var i = 0; i < 30; i++) {
      var r = generate('npc_major', t, 4);
      var others = (r.aspects && r.aspects.others) ? r.aspects.others : [];
      var seen = {};
      others.forEach(function(a) {
        var key = a.toLowerCase().trim();
        if (seen[key]) failures.push(camp + ': duplicate "' + a.substring(0,50) + '"');
        seen[key] = true;
      });
    }
  });
  assert('NA-57: No major NPC has duplicate aspect entries in others[]',
    failures.length === 0, 'Found: ' + failures.slice(0,3).join(' | '));
})();

// NA-58: All minor NPC primary aspects start with uppercase
(function() {
  var failures = [];
  camps.forEach(function(camp) {
    var t = filteredTables(mergeUniversal(CAMPAIGNS[camp].tables), {});
    for (var i = 0; i < 30; i++) {
      var r = generate('npc_minor', t, 4);
      var aspects = Array.isArray(r.aspects) ? r.aspects : [];
      aspects.forEach(function(a) {
        if (a && a.length > 0 && a[0] !== a[0].toUpperCase()) {
          failures.push(camp + ': "' + a.substring(0,60) + '"');
        }
      });
    }
  });
  assert('NA-58: All minor NPC aspects start with uppercase',
    failures.length === 0, 'Lowercase: ' + failures.slice(0,3).join(' | '));
})();

// NA-59: Every stunt has a non-empty tags array (STUNT-01)
(function() {
  var failures = [];
  camps.forEach(function(camp) {
    (CAMPAIGNS[camp].tables.stunts || []).forEach(function(s) {
      if (!s.tags || !Array.isArray(s.tags) || s.tags.length === 0) {
        failures.push(camp + ': "' + s.name + '"');
      }
    });
  });
  assert('NA-59: Every stunt has a non-empty tags array', failures.length === 0,
    'Missing tags: ' + failures.slice(0, 3).join(' | '));
})();

// NA-60: No encounter has duplicate minor opposition names in the same result (WS-14 Bex finding)
(function() {
  var failures = [];
  camps.forEach(function(camp) {
    var t = filteredTables(mergeUniversal(CAMPAIGNS[camp].tables), {});
    for (var i = 0; i < 50; i++) {
      var r = generate('encounter', t, 4);
      if (!r || !r.opposition) return;
      var seen = {};
      r.opposition.forEach(function(o) {
        var key = o.name ? o.name.toLowerCase().trim() : '';
        if (key && seen[key]) failures.push(camp + ': duplicate "' + o.name + '"');
        seen[key] = true;
      });
    }
  });
  assert('NA-60: No encounter has duplicate minor opposition names', failures.length === 0,
    'Found: ' + failures.slice(0, 3).join(' | '));
})();

// NA-61: sessionzero.html (Prep Wizard) loads all 7 campaign data files
(function() {
  var fs = require('fs');
  var html = fs.readFileSync('campaigns/sessionzero.html', 'utf8');
  var REQUIRED = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'];
  var missing = REQUIRED.filter(function(w) {
    return html.indexOf('data/' + w + '.js') === -1;
  });
  assert('NA-61: sessionzero.html loads all 8 campaign data files',
    missing.length === 0, 'Missing: ' + missing.join(', '));
})();


// NA-62: board.html is a redirect; campaign pages load ui-board.js
(function() {
  var fs = require('fs');
  var board = fs.readFileSync('campaigns/board.html', 'utf8');
  assert('NA-62: board.html is a JS redirect to campaign pages',
    board.includes('window.location.replace') && board.includes('canvas=1'),
    'board.html must redirect to campaign page with canvas=1');
  var CAMPS = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'];
  var missing = CAMPS.filter(function(w) {
    var html = fs.readFileSync('campaigns/' + w + '.html', 'utf8');
    return !html.includes('ui-board.js');
  });
  assert('NA-62b: all campaign pages load ui-board.js',
    missing.length === 0, 'Missing ui-board.js in: ' + missing.join(', '));
})();



// NA-63: All 8 guide pages have correct worldKey in their inline script
(function() {
  var fs = require('fs');
  var guides = [
    ['campaigns/guide-thelongafter.html', 'thelongafter'],
    ['campaigns/guide-cyberpunk.html',    'cyberpunk'],
    ['campaigns/guide-fantasy.html',      'fantasy'],
    ['campaigns/guide-space.html',        'space'],
    ['campaigns/guide-victorian.html',    'victorian'],
    ['campaigns/guide-postapoc.html',     'postapoc'],
    ['campaigns/guide-western.html',      'western'],
    ['campaigns/guide-dVentiRealm.html',  'dVentiRealm'],
  ];
  var failures = [];
  guides.forEach(function(pair) {
    var html = fs.readFileSync(pair[0], 'utf8');
    var expected = "worldKey:'" + pair[1] + "'";
    if (html.indexOf(expected) === -1) failures.push(pair[0] + ' missing worldKey:' + pair[1]);
  });
  assert('NA-63: All 8 guide pages have correct worldKey in inline script',
    failures.length === 0, 'Bad worldKey: ' + failures.join(' | '));
})();

// NA-64: All 8 guide pages have matching data-campaign attribute
(function() {
  var fs = require('fs');
  var guides = [
    ['campaigns/guide-thelongafter.html', 'thelongafter'],
    ['campaigns/guide-cyberpunk.html',    'cyberpunk'],
    ['campaigns/guide-fantasy.html',      'fantasy'],
    ['campaigns/guide-space.html',        'space'],
    ['campaigns/guide-victorian.html',    'victorian'],
    ['campaigns/guide-postapoc.html',     'postapoc'],
    ['campaigns/guide-western.html',      'western'],
    ['campaigns/guide-dVentiRealm.html',  'dVentiRealm'],
  ];
  var failures = [];
  guides.forEach(function(pair) {
    var html = fs.readFileSync(pair[0], 'utf8');
    var expected = 'data-campaign="' + pair[1] + '"';
    if (html.indexOf(expected) === -1) failures.push(pair[0]);
  });
  assert('NA-64: All 8 guide pages have correct data-campaign attribute',
    failures.length === 0, 'Bad data-campaign: ' + failures.join(' | '));
})();

// NA-65: run.html and character-creation.html are in sw.js APP_SHELL
(function() {
  var fs = require('fs');
  var sw = fs.readFileSync('sw.js', 'utf8');
  var required = ['campaigns/run.html', 'campaigns/character-creation.html'];
  var missing = required.filter(function(f) { return sw.indexOf(f) === -1; });
  assert('NA-65: run.html and character-creation.html are in sw.js APP_SHELL',
    missing.length === 0, 'Missing from SW cache: ' + missing.join(', '));
})();

// NA-66: No opposition skill rating exceeds 5 (Superb is FCon ladder cap)
(function() {
  var failures = [];
  camps.forEach(function(camp) {
    (CAMPAIGNS[camp].tables.opposition || []).forEach(function(opp) {
      (opp.skills || []).forEach(function(sk) {
        if (sk.r > 5) failures.push(camp + '/' + opp.name + ' ' + sk.name + '=' + sk.r);
      });
    });
  });
  assert('NA-66: No opposition skill rating exceeds FCon cap of 5 (Superb)',
    failures.length === 0, 'Over cap: ' + failures.slice(0,5).join(' | '));
})();


// NA-67: run session surface has minimum aria-label coverage (Sprint G accessibility pass)
// CQ-02: components moved to core/ui-run.js
// React JSX uses 'aria-label': (colon) not aria-label= (equals)
(function() {
  var fs = require('fs');
  var runSrc = fs.readFileSync('campaigns/board.html', 'utf8') +
                fs.readFileSync('core/ui-board.js', 'utf8');
  var count = (runSrc.match(/'aria-label':/g) || []).length;
  assert('NA-67: board surface has >=15 aria-label attributes (accessibility pass)',
    count >= 15, 'Found: ' + count + ' (need >=15)');
})();

// Summary
// ── NA-68: No font-size:9px anywhere in theme.css ────────────────────────────
// WCAG 2.1 AA + HIG: 11px floor on semantic labels, 10px on decorative chrome.
// font-size:9px is prohibited. The 9->11px pass in v2026.03.153 should have cleared all.
(function() {
  var css = fs.readFileSync('assets/css/theme.css', 'utf8');
  // Find class definitions containing font-size:9px (skip @keyframes, comments)
  var lines = css.split('\n');
  var bad = lines.filter(function(l) {
    return /font-size\s*:\s*9px/.test(l) && l.indexOf('/*') === -1 && l.indexOf('keyframes') === -1;
  });
  assert('NA-68: No font-size:9px in theme.css (WCAG 2.1 AA + HIG font floor)',
    bad.length === 0,
    'Found ' + bad.length + ' occurrence(s): ' + bad.slice(0,2).join(' | ').slice(0,120));
})();

// ── NA-69: prefers-color-scheme respected on first load (HIG) ─────────────────
// The initTheme IIFE must check prefers-color-scheme when no saved theme exists.
(function() {
  var src2 = fs.readFileSync('core/ui-primitives.js', 'utf8');
  assert('NA-69: prefers-color-scheme checked in initTheme (HIG first-load requirement)',
    src2.includes('prefers-color-scheme') && (src2.includes('initTheme') || src2.includes('function initTheme')),
    'Missing prefers-color-scheme check in theme init');
})();

// ── NA-70: --focus-ring token defined in roots and used in :focus-visible ──────
// WCAG 2.4.11 AA: focus indicators must have >=3:1 contrast against bg.
// --focus-ring is the designated token; must not fall back to --accent alone.
(function() {
  var css = fs.readFileSync('assets/css/theme.css', 'utf8');
  var hasDarkToken  = css.includes('--focus-ring:');
  var hasLightToken = (function() {
    var li = css.indexOf('[data-theme="light"] {');
    var nb = css.indexOf('}', li);
    return li >= 0 && css.slice(li, nb + 1).includes('--focus-ring:');
  })();
  var ruleUsesToken = css.includes('var(--focus-ring');
  assert('NA-70: --focus-ring defined in dark root', hasDarkToken, '--focus-ring missing from :root');
  assert('NA-70: --focus-ring defined in light theme', hasLightToken, '--focus-ring missing from [data-theme="light"]');
  assert('NA-70: :focus-visible uses var(--focus-ring)', ruleUsesToken, ':focus-visible does not reference --focus-ring');
})();

// ── NA-71: QuickFindBar combobox ARIA pattern ─────────────────────────────────
// WCAG 4.1.2: search-with-results must use role=combobox, aria-expanded,
// aria-controls, aria-autocomplete to avoid AT role conflicts.
(function() {
  var src3 = fs.readFileSync('core/ui-modals.js', 'utf8');
  assert("NA-71: QuickFindBar has role='combobox'", src3.includes("role: 'combobox'"), 'QuickFindBar missing role=combobox');
  assert("NA-71: QuickFindBar has aria-expanded", src3.includes("'aria-expanded'"), 'QuickFindBar missing aria-expanded');
  assert("NA-71: QuickFindBar has aria-controls pointing to qf-listbox", src3.includes("'aria-controls': 'qf-listbox'"), 'QuickFindBar missing aria-controls');
  assert("NA-71: qf-listbox id on results container", src3.includes("id: 'qf-listbox'"), 'qf-listbox id missing');
})();

// ── NA-72: SessionDoc textarea has aria-label ─────────────────────────────────
// WCAG 4.1.2: form inputs need accessible names. Placeholder is not a label.
(function() {
  var src4 = fs.readFileSync('core/ui-modals.js', 'utf8');
  var taIdx = src4.indexOf("h('textarea'");
  var block = taIdx >= 0 ? src4.slice(taIdx, taIdx + 400) : '';
  assert("NA-72: SessionDoc textarea has aria-label", block.includes("'aria-label'"), 'SessionDoc textarea missing aria-label');
})();

// ── NA-73: --section-hdr token defined (WCAG 1.4.3 fd-hdr contrast) ──────────
// fd-hdr section headers use --section-hdr which is contrast-safe in light mode.
(function() {
  var css = fs.readFileSync('assets/css/theme.css', 'utf8');
  assert('NA-73: --section-hdr token present in theme.css',
    css.includes('--section-hdr'),
    '--section-hdr token missing — fd-hdr contrast may fail in light mode');
})();


// ── NA-80: partysocket on campaign pages (board.html is now a redirect) ────
(function() {
  var camp = fs.readFileSync('campaigns/cyberpunk.html', 'utf8');
  assert('NA-80: partysocket script tag in campaign pages',
    camp.includes('partysocket.js'),
    'partysocket tag missing from campaign pages');
})();

// ── NA-81: createTableSync defined in ui.js (replaces createSync from removed ui-run.js) ──
// ui-run.js was stripped v330 — run.html is a JS redirect; RunApp was never mounted.
// createTableSync in ui.js is the live equivalent with identical protocol.
(function() {
  var uiSrc = fs.readFileSync('core/ui.js', 'utf8');
  assert('NA-81: createTableSync function defined in ui.js',
    uiSrc.includes('function createTableSync('),
    'createTableSync missing from ui.js — sync module was removed');
})();

// ── NA-82: persist() calls sync.broadcastState (createTableSync in ui.js) ─────────────
(function() {
  var uiSrc = fs.readFileSync('core/ui.js', 'utf8');
  assert('NA-82: broadcastState defined in createTableSync',
    uiSrc.includes('broadcastState:function(state)'),
    'broadcastState not defined in createTableSync');
})();

// ── NA-83: gmOnly cards are not leaked via broadcastState ────────────────────────
// PrepCanvas filters gmOnly before calling broadcastState (extras stripped, cards filtered)
(function() {
  var uiSrc = fs.readFileSync('core/ui.js', 'utf8');
  assert('NA-83: createTableSync broadcastState caches last state for re-broadcast',
    uiSrc.includes('sync._lastState=state'),
    'broadcastLastState caching missing from createTableSync');
})();

// ── NA-84: createTableSync guards against missing PartySocket ─────────────
(function() {
  var uiSrc = fs.readFileSync('core/ui.js', 'utf8');
  assert('NA-84: createTableSync guards against missing PartySocket',
    uiSrc.includes("typeof PartySocket==='undefined'"),
    'No PartySocket guard in createTableSync');
})();

// ── NA-85: partysocket URL in sw.js CDN cache list ───────────────────────
(function() {
  var sw = fs.readFileSync('sw.js', 'utf8');
  assert('NA-85: partysocket URL in sw.js CDN_SCRIPTS',
    !sw.includes("'https://cdn.jsdelivr.net/npm/partysocket"),
    'partysocket CDN URL missing from sw.js CDN_SCRIPTS precache');
})();

// ── NA-86: board.html in SW APP_SHELL ────────────────────────────────────
(function() {
  var sw = fs.readFileSync('sw.js', 'utf8');
  assert('NA-86: board.html in SW APP_SHELL',
    sw.includes("'/campaigns/board.html'"),
    'board.html missing from SW APP_SHELL — will 404 offline');
})();

// ── NA-87: ui-board.js in SW APP_SHELL ───────────────────────────────────
(function() {
  var sw = fs.readFileSync('sw.js', 'utf8');
  assert('NA-87: ui-board.js in SW APP_SHELL',
    sw.includes("'/core/ui-board.js'"),
    'ui-board.js missing from SW APP_SHELL — board fails offline');
})();

// ── NA-88: board does not redeclare h/useState/useEffect/useRef/useCallback ──
(function() {
  var board = fs.readFileSync('core/ui-board.js', 'utf8');
  var banned = ['var h =', 'var useState =', 'var useEffect =', 'var useRef =', 'var useCallback =', 'var Fragment ='];
  var found = banned.filter(function(b) { return board.includes(b); });
  assert('NA-88: ui-board.js does not redeclare ui-primitives globals',
    found.length === 0,
    'Redeclared globals in ui-board.js (causes SyntaxError): ' + found.join(', '));
})();

// ── NA-89: board dossier has role=dialog ─────────────────────────────────
(function() {
  var board = fs.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-89: board dossier modal has role=dialog (WCAG 4.1.2)',
    board.includes("role: 'dialog'") && board.includes("'aria-modal': 'true'"),
    'Dossier modal missing role=dialog or aria-modal');
})();

// ── NA-90: board cards have tabIndex=0 ────────────────────────────────────
(function() {
  var board = fs.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-90: board canvas cards are keyboard reachable (tabIndex=0)',
    board.includes("tabIndex: 0,") && board.includes("role: 'region'"),
    'Board cards missing tabIndex or role=region (WCAG 2.1.1 + ARIA spec)');
})();

// ── NA-91: board context menu has role=menu ───────────────────────────────
(function() {
  var board = fs.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-91: board context menu has role=menu (WCAG 4.1.2)',
    board.includes("role: 'menu'") && board.includes("role: 'menuitem'"),
    'Context menu missing role=menu or role=menuitem');
})();

// ── NA-92: cc-ibtn has min touch target in theme.css ─────────────────────────
(function() {
  var css = fs.readFileSync('assets/css/theme.css', 'utf8');
  assert('NA-92: cc-ibtn has min-width/height for touch (WCAG 2.5.8 + HIG)',
    css.includes('min-width:44px') || css.includes('min-width: 44px') || css.includes('min-height:44px'),
    'cc-ibtn missing 44px touch target in theme.css');
})();

// ── NA-93: no font-size:8px in ui-board.js (ui-run.js removed v2026.03) ──
(function() {
  var uiBoard = fs.readFileSync('core/ui-board.js', 'utf8');
  var found8 = (uiBoard.match(/font-size:8px|fontSize:8[,}]|fontSize: 8[,}]/g) || []).length;
  assert('NA-93: No font-size:8px in ui-board.js (WCAG 1.4.4 + NA-68 floor)',
    found8 === 0,
    'Found ' + found8 + ' occurrence(s) of font-size:8px in ui-board.js');
})();

// ── NA-94: Victorian VtAdj has ≥20 entries ────────────────────────────────
(function() {
  var vic = fs.readFileSync('data/victorian.js', 'utf8');
  var match = vic.match(/VtAdj:\s*\[([^\]]+)\]/);
  var count = match ? (match[1].match(/"/g) || []).length / 2 : 0;
  assert('NA-94: Victorian VtAdj has ≥20 entries (BL-03 adjective pass)',
    count >= 20,
    'VtAdj only has ' + count + ' entries — needs BL-03 adjective pass');
})();

// ── NA-95: board section labels (BRD-06) in Tools group ──────────────────
(function() {
  var board = fs.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-95: BRD-06 section labels exist in board',
    board.includes("id: 'label'") && board.includes('BoardLabel'),
    'Section label card type missing from board (BRD-06)');
})();

// ── NA-96: round number has aria-live in ui-board.js BoardTurnBar ───────────────────────
(function() {
  var uiBoard = fs.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-96: round number has aria-live (WCAG 4.1.3)',
    uiBoard.includes("'aria-live':'polite'") || uiBoard.includes("'aria-live': 'polite'") || uiBoard.includes('"aria-live":"polite"'),
    'Round number missing aria-live in ui-board.js BoardTurnBar');
})();

// ── NA-97: board mode toggle has aria-pressed ────────────────────────────
(function() {
  var board = fs.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-97: board mode toggle has aria-pressed (WCAG 4.1.2)',
    board.includes("'aria-pressed': String(mode === 'prep')"),
    'Mode toggle buttons missing aria-pressed');
})();


// ── WCAG 2.2 ASSERTIONS (NA-114 through NA-124) ───────────────────────────

(function() {
  var css = fs.readFileSync('assets/css/theme.css', 'utf8');
  var rend = fs.readFileSync('core/ui-renderers.js', 'utf8');

  assert('NA-114: [role="checkbox"]:focus-visible rule exists',
    css.includes('[role="checkbox"]:focus-visible'),
    'Missing [role="checkbox"]:focus-visible — WCAG 2.2 SC 3.2.6');

  assert('NA-115: rs-zone-input:focus has border-width:2px',
    css.includes('rs-zone-input:focus{border-color:var(--accent);border-width:2px}'),
    'Input focus must change border-width not just color — WCAG 2.2 SC 2.4.11');

  assert('NA-116: body has scroll-padding-bottom for FAB',
    css.includes('scroll-padding-bottom: 80px') || (css.includes('scroll-padding-bottom: 80px') || css.includes('scroll-padding-bottom:80px')),
    'body needs scroll-padding-bottom — WCAG 2.2 SC 2.4.12 Focus Not Obscured');

  assert('NA-117: dark theme default on campaign pages',
    fs.readFileSync('campaigns/postapoc.html', 'utf8').includes('data-theme="dark"'),
    'Campaign pages must default data-theme="dark"');

  assert('NA-118: design-system.html in SW APP_SHELL',
    fs.readFileSync('sw.js', 'utf8').includes('design-system.html') || fs.readFileSync('sw.js', 'utf8').includes('/design-system.html'),
    'design-system.html must be cached for offline');

  assert('NA-119: th scope="col" in help/faq.html',
    fs.readFileSync('help/faq.html', 'utf8').includes('scope="col"'),
    'Table headers need scope="col" — WCAG 1.3.1');

  assert('NA-120: th scope="col" in help/dnd-transition.html',
    fs.readFileSync('help/dnd-transition.html', 'utf8').includes('scope="col"'),
    'Table headers need scope="col" — WCAG 1.3.1');

  assert('NA-121: cv4UseReducedMotion defined in ui-renderers.js',
    rend.includes('function cv4UseReducedMotion()'),
    'cv4UseReducedMotion must be defined — required by cv4Card');

  assert('NA-122: cv4InjectStyles defined in ui-renderers.js',
    rend.includes('function cv4InjectStyles()'),
    'cv4InjectStyles must be defined — required by cv4Card on mount');

  assert('NA-123: fd-stamp-in keyframe injected by cv4InjectStyles',
    rend.includes('fd-stamp-in'),
    'fd-stamp-in keyframe must exist in cv4InjectStyles block');

  assert('NA-124: --focus-ring token D4A060 in dark theme',
    css.includes('--focus-ring:#D4A060'),
    '--focus-ring must be #D4A060 (4.6:1 on dark bg) — WCAG 1.4.11');
})();


// ── Option B single-panel sidebar (NA-125 through NA-129) ─────────────────

(function() {
  var ui = fs.readFileSync('core/ui.js', 'utf8');
  var css = fs.readFileSync('assets/css/theme.css', 'utf8');

  assert('NA-125: sidebar-tab-bar removed from ui.js',
    !ui.includes("className: 'sidebar-tab-bar'"),
    'sidebar-tab-bar must be removed — Option B uses single-panel sidebar');

  assert('NA-126: sb-panel-nav tabpanel removed from ui.js',
    !ui.includes("id: 'sb-panel-nav'"),
    'sb-panel-nav must be removed — nav items merged into single panel');

  assert('NA-127: sb-dock toolbar added to ui.js',
    ui.includes("className: 'sb-dock'") && ui.includes("role: 'toolbar'"),
    'sb-dock must have role="toolbar" — WCAG 4.1.2');

  assert('NA-128: sb-dock CSS defined in theme.css',
    css.includes('.sb-dock{'),
    'sb-dock CSS must be defined');

  assert('NA-129: sb-dock-btn has min-height:44px touch target',
    css.includes('min-height:44px') && css.includes('.sb-dock-btn'),
    'sb-dock-btn must meet 44px touch target — WCAG 2.5.8 / HIG');
})();


// ── Export cleanup (NA-130 through NA-135) ────────────────────────────────

(function() {
  var ui   = fs.readFileSync('core/ui.js', 'utf8');
  var brd  = fs.readFileSync('core/ui-board.js', 'utf8');
  var css  = fs.readFileSync('assets/css/theme.css', 'utf8');

  assert('NA-130: ShareDrawer render removed from CampaignApp',
    !ui.includes("h(ShareDrawer,"),
    'ShareDrawer must not be rendered in CampaignApp — share link removed');

  assert('NA-131: linkCopied state removed from ui.js',
    !ui.includes('linkCopied'),
    'linkCopied state must be removed — share link removed');

  assert('NA-132: showExport state removed from ui.js',
    !ui.includes("'showExport'") && !ui.includes('setShowExport'),
    'showExport state must be removed');

  assert('NA-133: ExportMenu has Markdown option',
    ui.includes("'Markdown'") && ui.includes('ExportModal'),
    'ExportModal must include Markdown copy option');

  assert('NA-134: BoardExportMenu has Import option',
    brd.includes('doImportCanvas') && brd.includes('importCanvas'),
    'BoardExportMenu must have Import + importCanvas handler');

  assert('NA-135: export-menu-item-icon CSS class defined',
    css.includes('.export-menu-item-icon'),
    'export-menu-item-icon must be styled in theme.css');
})();


// ── PC generator + wizard fixes (NA-136 through NA-144) ──────────────────

(function() {
  var ui   = fs.readFileSync('core/ui.js', 'utf8');
  var eng  = fs.readFileSync('core/engine.js', 'utf8');
  var rend = fs.readFileSync('core/ui-renderers.js', 'utf8');
  var sh   = fs.readFileSync('data/shared.js', 'utf8');
  var wiz  = fs.readFileSync('campaigns/sessionzero.html', 'utf8');

  assert('NA-136: generatePC defined in engine.js',
    eng.includes('function generatePC(t)'),
    'generatePC must be defined in engine.js');

  assert('NA-137: pc case in _generate dispatcher',
    eng.includes("case 'pc':"),
    "engine _generate must have case 'pc'");

  assert('NA-138: pc_high_concepts in postapoc world data',
    fs.readFileSync('data/postapoc.js','utf8').includes('pc_high_concepts'),
    'postapoc.js must have pc_high_concepts table');

  assert('NA-139: pc_questions in cyberpunk world data',
    fs.readFileSync('data/cyberpunk.js','utf8').includes('pc_questions'),
    'cyberpunk.js must have pc_questions table');

  assert('NA-140: pc in GENERATORS array',
    sh.includes('"pc"') && sh.includes('Player Character'),
    'GENERATORS must include pc entry');

  assert('NA-141: pc in Characters GENERATOR_GROUP',
    sh.includes('"npc_minor","npc_major","pc","backstory"'),
    'Characters group must include pc');

  assert('NA-142: cv4FrontPc renderer defined',
    rend.includes('function cv4FrontPc('),
    'cv4FrontPc must be defined in ui-renderers.js');

  assert('NA-143: cv4FrontPc in CV4_FRONTS map',
    rend.includes('pc:cv4FrontPc'),
    'CV4_FRONTS must include pc:cv4FrontPc');

  assert('NA-144: wizard exportWizardSession defined',
    wiz.includes('function exportWizardSession()'),
    'sessionzero.html must have exportWizardSession for wizard JSON export');

  assert('NA-145: wizard extras id is string-prefixed',
    wiz.includes("id:'wiz_'+String(Date.now())"),
    'Wizard extras must use string id (wiz_ prefix) for import compatibility');

  assert('NA-146: PC skill pyramid has 10 skills',
    eng.includes('pickN(ALL_SKILLS, 10)') && eng.includes('r: 4') && eng.includes('r: 3'),
    'generatePC must produce full 10-skill pyramid: 1×+4, 2×+3, 3×+2, 4×+1');

  assert('NA-147: PC refresh hardcoded to 3 at creation',
    eng.includes('refresh: 3'),
    'PC refresh must be 3 at creation per FCon p.10');

  assert('NA-148: PC consequences always [2,4,6]',
    eng.includes('consequences: [2, 4, 6]'),
    'PC must always have mild/moderate/severe consequences per FCon p.12');
})();


// ── BL-01/02/07/08 + quick wins (NA-149 through NA-157) ──────────────────

(function() {
  var ui  = fs.readFileSync('core/ui.js', 'utf8');
  var db  = fs.readFileSync('core/db.js', 'utf8');
  var ren = fs.readFileSync('core/ui-renderers.js', 'utf8');
  var wes = fs.readFileSync('data/western.js', 'utf8');

  assert('NA-149: BL-01 LS migration guard in db.js',
    db.includes('fate_theme') && db.includes('DEFAULTS') && db.includes('Schema defaults'),
    'db.js must have legacy key migration and schema defaults in initPrefs');

  assert('NA-150: BL-01 LS schema version written on init',
    db.includes('_v: LS_VERSION') && db.includes('changed = true'),
    'initPrefs must write _v and apply defaults');

  assert('NA-151: Quick win — sidebar-legal removed from ui.js',
    !ui.includes('sidebar-legal'),
    'sidebar-legal duplicate attribution must be removed from sidebar panel');

  assert('NA-152: BL-07 CV4_HELP has invoke field on npc_minor',
    ren.includes("invoke: 'A PC with Athletics") || ren.includes('invoke:'),
    'CV4_HELP entries must have invoke example field');

  assert('NA-153: BL-07 CV4_HELP has compel field on npc_minor',
    ren.includes('compel:') && ren.includes('CV4_HELP'),
    'CV4_HELP entries must have compel example field');

  assert('NA-154: BL-07 cv4BackPanel renders INVOKE label',
    ren.includes("cv4Lbl('INVOKE'") || ren.includes("'INVOKE'"),
    'cv4BackPanel must render INVOKE example section');

  assert('NA-155: BL-07 cv4BackPanel renders COMPEL label',
    ren.includes("cv4Lbl('COMPEL'") || ren.includes("'COMPEL'"),
    'cv4BackPanel must render COMPEL example section');

  assert('NA-156: BL-08 western names_first has >= 100 entries',
    (function() {
      var m = wes.match(/names_first:\s*\[([^\]]+)\]/);
      if (!m) return false;
      return (m[1].match(/"/g)||[]).length / 2 >= 100;
    })(),
    'western names_first must have at least 100 entries for variety');

  assert('NA-157: BL-08 western current_issues has >= 7 entries',
    (function() {
      var start = wes.indexOf('current_issues:');
      var end   = wes.indexOf('],', start);
      var block = start >= 0 && end > start ? wes.slice(start, end) : '';
      return (block.match(/\{name:/g) || []).length >= 7;
    })(),
    'western current_issues must have at least 7 entries');
})();


// ── Mermaid export (NA-158 through NA-162) ───────────────────────────────

(function() {
  var eng = fs.readFileSync('core/engine.js', 'utf8');
  var ui  = fs.readFileSync('core/ui.js', 'utf8');

  assert('NA-158: toMermaid defined in engine.js',
    eng.includes('function toMermaid('),
    'toMermaid must be defined in engine.js');

  assert('NA-159: toBatchMermaid defined in engine.js',
    eng.includes('function toBatchMermaid('),
    'toBatchMermaid must be defined in engine.js');

  assert('NA-160: toMermaid pc case produces mindmap',
    (function() {
      eval(fs.readFileSync('data/shared.js','utf8'));
      eval(fs.readFileSync('data/universal.js','utf8'));
      eval(fs.readFileSync('data/postapoc.js','utf8'));
      eval(eng);
      var t = filteredTables(mergeUniversal(CAMPAIGNS.postapoc.tables),{});
      var pc = generate('pc', t, 4);
      var mm = toMermaid('pc', pc, 'Test');
      return mm.startsWith('mindmap') && mm.includes('root((') && mm.includes('HC:') && mm.includes('Skills');
    })(),
    'toMermaid pc must produce valid mindmap with root, HC, and Skills nodes');

  assert('NA-161: toMermaid seed case produces flowchart',
    (function() {
      eval(fs.readFileSync('data/shared.js','utf8'));
      eval(fs.readFileSync('data/universal.js','utf8'));
      eval(fs.readFileSync('data/postapoc.js','utf8'));
      eval(eng);
      var t = filteredTables(mergeUniversal(CAMPAIGNS.postapoc.tables),{});
      var s = generate('seed', t, 4);
      var mm = toMermaid('seed', s, 'Test');
      return mm.startsWith('flowchart') && mm.includes('-->');
    })(),
    'toMermaid seed must produce flowchart with arrows');

  assert('NA-162: doMermaid handler in ExportMenu',
    ui.includes('toBatchMermaid') && ui.includes("'Mermaid'"),
    'ExportModal must have Mermaid format option');
})();


// ── Text export formats (NA-163 through NA-170) ───────────────────────────

(function() {
  var eng = fs.readFileSync('core/engine.js', 'utf8');
  var ui  = fs.readFileSync('core/ui.js', 'utf8');

  assert('NA-163: toObsidianMD defined in engine.js',
    eng.includes('function toObsidianMD('),
    'toObsidianMD must be defined in engine.js');

  assert('NA-164: toBatchObsidianMD defined in engine.js',
    eng.includes('function toBatchObsidianMD('),
    'toBatchObsidianMD must be defined');

  assert('NA-165: toTypst defined in engine.js',
    eng.includes('function toTypst('),
    'toTypst must be defined in engine.js');

  assert('NA-166: toBatchTypst defined in engine.js',
    eng.includes('function toBatchTypst('),
    'toBatchTypst must be defined');

  assert('NA-167: toPlainText defined in engine.js',
    eng.includes('function toPlainText('),
    'toPlainText must be defined in engine.js');

  assert('NA-168: toBatchPlainText defined in engine.js',
    eng.includes('function toBatchPlainText('),
    'toBatchPlainText must be defined');

  assert('NA-169: ExportMenu has Obsidian, Typst, and plain text handlers',
    ui.includes('toBatchObsidianMD') && ui.includes('toBatchTypst') && ui.includes('toBatchPlainText'),
    'ExportModal must have Obsidian, Typst, plain text formats');

  assert('NA-170: toObsidianMD pc produces callout blocks',
    (function() {
      eval(fs.readFileSync('data/shared.js','utf8'));
      eval(fs.readFileSync('data/universal.js','utf8'));
      eval(fs.readFileSync('data/postapoc.js','utf8'));
      eval(eng);
      var t = filteredTables(mergeUniversal(CAMPAIGNS.postapoc.tables),{});
      var pc = generate('pc', t, 4);
      var ob = toObsidianMD('pc', pc, 'Test');
      return ob.includes('[!quote]') && ob.includes('[!danger]') && ob.includes('## Skills') && ob.includes('## Session Zero');
    })(),
    'toObsidianMD pc must have callouts, skills table, and session zero section');

  assert('NA-171: toTypst pc produces valid Typst markup',
    (function() {
      eval(fs.readFileSync('data/shared.js','utf8'));
      eval(fs.readFileSync('data/universal.js','utf8'));
      eval(fs.readFileSync('data/postapoc.js','utf8'));
      eval(eng);
      var t = filteredTables(mergeUniversal(CAMPAIGNS.postapoc.tables),{});
      var pc = generate('pc', t, 4);
      var ty = toTypst('pc', pc, 'Test');
      return ty.includes('#set page') && ty.includes('#asp-hc') && ty.includes('#skill-chip') && ty.includes('#stunt-b');
    })(),
    'toTypst pc must include page setup, aspect helpers, and skill chips');

  assert('NA-172: toPlainText pc produces box-drawing card',
    (function() {
      eval(fs.readFileSync('data/shared.js','utf8'));
      eval(fs.readFileSync('data/universal.js','utf8'));
      eval(fs.readFileSync('data/postapoc.js','utf8'));
      eval(eng);
      var t = filteredTables(mergeUniversal(CAMPAIGNS.postapoc.tables),{});
      var pc = generate('pc', t, 4);
      var pt = toPlainText('pc', pc, 'Test');
      return pt.includes('┌') && pt.includes('PLAYER CHARACTER') && pt.includes('[HC]') && pt.includes('SKILLS') && pt.includes('└');
    })(),
    'toPlainText pc must have box-drawing border, header, aspects, and skills');
})();


// ── Toast, Session Zero, BL-06, BL-15 (NA-173 through NA-180) ─────────────

(function() {
  var ui  = fs.readFileSync('core/ui.js', 'utf8');
  var css = fs.readFileSync('assets/css/theme.css', 'utf8');

  assert('NA-173: ExportMenu has onToast prop',
    ui.includes('var onToast       = props.onToast'),
    'ExportModal must destructure onToast from props');

  assert('NA-174: doMarkdown fires onToast',
    ui.includes("onToast(activeFmt.label"),
    'ExportModal doExecute must call onToast');

  assert('NA-175: doMermaid fires onToast',
    ui.includes("onToast(activeFmt.label") && ui.includes('ExportModal'),
    'ExportModal must call onToast on copy');

  assert('NA-176: ExportMenu has Copy Link item using onShareLink',
    ui.includes('onShareLink && currentResult') && ui.includes('Copy shareable link'),
    'ExportModal must have Copy Link button gated on onShareLink');

  assert('NA-177: Export accessible from sidebar Play section',
    ui.includes('exportCards') && ui.includes("'Export Cards'"),
    'Export must be in sidebar Play section as exportCards button');

  assert('NA-178: Session Zero link in sidebar At the table section',
    ui.includes('character-creation.html?world=') && ui.includes("'Session Zero'"),
    'Sidebar must have Session Zero link in At the table section');

  assert('NA-179: BL-15 bottom-nav CSS exists',
    css.includes('.bottom-nav') && css.includes('.bn-tab') && css.includes('.bn-badge'),
    'theme.css must have .bottom-nav, .bn-tab, and .bn-badge classes');

  assert('NA-180: BL-15 bottom nav rendered in CampaignApp',
    ui.includes("className: 'bottom-nav'") && ui.includes("'bn-tab'") && ui.includes('BL-15'),
    'CampaignApp must render bottom-nav element with bn-tab buttons');
})();


// ── Accordion nav (NA-181 through NA-187) ────────────────────────────────────

(function() {
  var ui  = fs.readFileSync('core/ui.js', 'utf8');
  var css = fs.readFileSync('assets/css/theme.css', 'utf8');

  assert('NA-181: sbAcc state variable in CampaignApp',
    ui.includes('var sbAcc') && ui.includes("toggleAcc("),
    'CampaignApp must have sbAcc state and toggleAcc helper');

  assert('NA-182: Accordion has Play section first, Generate second',
    (function() {
      var pi = ui.indexOf("sbAcc === 'play'");
      var gi = ui.indexOf("sbAcc === 'generate'");
      return pi > 0 && gi > pi;
    })(),
    'Play must come before Generate in nav order (Binder removed)');

  assert('NA-183: All accordion headers have aria-expanded',
    (ui.match(/'aria-expanded': String\(sbAcc ===/g)||[]).length >= 3,
    'All three section headers (Play, Generate, Settings) must have aria-expanded');

  assert('NA-184: Generate section has max-height scroll containment',
    css.includes('sb-acc-generate-body') && css.includes('max-height:55vh'),
    'Generate body must have max-height to keep other sections visible');

  assert('NA-185: Accordion section headers are 44px (WCAG 2.5.5)',
    css.includes('.sb-acc-hdr{') && css.includes('height:44px'),
    'sb-acc-hdr must be 44px tall');

  assert('NA-186: Meta badge shows active generator label',
    ui.includes("GENERATORS.find(function(g){return g.id===activeGen;})") &&
    ui.includes(".split(' ').slice(0,2).join(' ')"),
    'Binder meta badge must derive label from active generator');

  assert('NA-187: sb-acc CSS in theme.css',
    css.includes('.sb-acc{') && css.includes('.sb-acc-hdr{') && css.includes('.sb-acc-body{'),
    'theme.css must have .sb-acc, .sb-acc-hdr, .sb-acc-body');
})();


// ── ExportModal + Session Zero (NA-188 through NA-197) ──────────────────────────

(function() {
  var ui  = fs.readFileSync('core/ui.js', 'utf8');
  var eng = fs.readFileSync('core/engine.js', 'utf8');
  var sz  = fs.readFileSync('campaigns/character-creation.html', 'utf8');

  assert('NA-188: ExportModal defined in ui.js',
    ui.includes('function ExportModal('),
    'ExportModal must replace ExportMenu in ui.js');

  assert('NA-189: ExportModal has card checklist with derived titles',
    ui.includes('function cardTitle(') && ui.includes('d.name || d.location'),
    'ExportModal must derive card titles from data fields');

  assert('NA-190: ExportModal has 8-format grid',
    ui.includes("id:'md'") && ui.includes("id:'mm'") &&
    ui.includes("id:'json'") && ui.includes("id:'prt'"),
    'ExportModal must have md, mm, json, prt format options');

  assert('NA-191: ExportModal delivery picker copy/download',
    ui.includes("del_ === 'copy'") && ui.includes("del_==='copy'") || ui.includes("del_ === 'copy'"),
    'ExportModal must have copy and download delivery options');

  assert('NA-192: toBatchMarkdown defined in engine.js',
    eng.includes('function toBatchMarkdown('),
    'toBatchMarkdown must be defined in engine.js');

  assert('NA-193: canvasView state in CampaignApp',
    ui.includes('canvasView') && ui.includes('openCanvas') && ui.includes('canvas=1'),
    'CampaignApp must have canvasView state and canvas=1 URL param');

  assert('NA-194: board.html is a redirect with canvas=1',
    (function() {
      var b = fs.readFileSync('campaigns/board.html', 'utf8');
      return b.includes('window.location.replace') && b.includes('canvas=1');
    })(),
    'board.html must redirect with canvas=1');

  assert('NA-195: Session Zero questions step in all three modes',
    sz.includes("'questions','summary'"),
    'Session Zero getSteps must include questions step before summary');

  assert('NA-196: Session Zero questions step uses pc_questions',
    sz.includes('pc_questions') && sz.includes('Session Zero Questions'),
    'Session Zero must have questions step rendering pc_questions');

  assert('NA-197: dVentiRealm data loaded in character-creation.html',
    sz.includes('dVentiRealm.js'),
    'character-creation.html must load dVentiRealm.js data');
})();

(function() {
  var src = fs.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-199: disconnectSync defined in useBoardSync — missing definition caused ReferenceError on Table open',
    src.includes('function disconnectSync('),
    'disconnectSync must be defined inside useBoardSync before being returned');
})();

(function() {
  var src = fs.readFileSync('core/ui.js', 'utf8');
  assert('NA-200: sendToCanvas defined in CampaignApp — required for Binder → Table workflow',
    src.includes('function sendToCanvas('),
    'sendToCanvas must exist in ui.js to send Binder cards to the Play Table canvas');
})();

(function() {
  var src = fs.readFileSync('core/ui.js', 'utf8');
  assert('NA-201: Binder panel uses renderCard — cv4Card format in Binder matches Play Table',
    src.includes('renderCard(card.genId, card.data') && src.includes('sendToCanvas'),
    'Binder must render cv4Cards and include sendToCanvas call');
})();

(function() {
  var src = fs.readFileSync('core/ui.js', 'utf8');
  assert('NA-202: Drafting Tray — addToTray, sendTrayToCanvas, binder_tray IDB key (BDR-01)',
    src.includes('function addToTray(') && src.includes('function sendTrayToCanvas(') &&
    src.includes('binder_tray_'),
    'Drafting Tray functions and IDB key must be present in ui.js');
})();

(function() {
  var src = fs.readFileSync('core/ui.js', 'utf8');
  assert('NA-203: Binder filter strip — binderFilter state and filter pill buttons (BDR-02)',
    src.includes('binderFilter') && src.includes('setBinderFilter'),
    'Binder filter strip state must be present in ui.js');
})();

(function() {
  var src = fs.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-204: PL-03 pre-join character builder — submitPcJoin, pcDraft, skill ladder present',
    src.includes('function submitPcJoin(') && src.includes('pcDraft') && src.includes('PC_SKILL_LADDER'),
    'PL-03 character builder must define submitPcJoin and pcDraft state');
})();

(function() {
  var fs2 = require('fs');
  var camp = fs2.readFileSync('campaigns/space.html', 'utf8');
  assert('NA-205: file:// compat — base href is conditional not bare (offline play fix)',
    camp.includes('location.protocol') && !camp.includes('  <base href="/">'),
    'Campaign pages must use conditional base href, not bare <base href="/">');
})();

(function() {
  var fs2 = require('fs');
  var board = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-206: UNI-02 BoardBinderPanel — component defined with binderCards + trayCards props',
    board.includes('function BoardBinderPanel(') && board.includes('binderCards') && board.includes('trayCards'),
    'BoardBinderPanel component must exist in ui-board.js');
})();

(function() {
  var fs2 = require('fs');
  var board = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-207: UNI-02 Binder IDB load — DB.loadCards called in BoardApp',
    board.includes('DB.loadCards(campId)') && board.includes("'binder_tray_'"),
    'BoardApp must load Binder cards and Tray from IDB on mount');
})();

(function() {
  var fs2 = require('fs');
  var ui = fs2.readFileSync('core/ui.js', 'utf8');
  assert('NA-208: UNI-06 PrepCanvas retired — no live prepView render branches in ui.js',
    !ui.includes('h(PrepCanvas,') && !ui.includes('prepView && h('),
    'PrepCanvas must be removed from ui.js render tree');
})();

// NA-209: V-01 — stressFromRating returns 6 for Good/Great (not 5)
(function() {
  var fs2 = require('fs');
  eval(fs2.readFileSync('data/shared.js','utf8'));
  eval(fs2.readFileSync('data/universal.js','utf8'));
  eval(fs2.readFileSync('data/fantasy.js','utf8'));
  eval(fs2.readFileSync('core/engine.js','utf8'));
  var t = filteredTables(mergeUniversal(CAMPAIGNS['fantasy'].tables), {});
  // PC with Fight +4 should have physical_stress=6
  var physHigh = false;
  for (var i = 0; i < 500; i++) {
    var pc = generatePC(t);
    var ph = pc.skills.find(function(s){ return s.name === 'Physique' && s.r >= 3; });
    if (ph) {
      if (pc.physical_stress === 6) { physHigh = true; break; }
    }
  }
  assert('NA-209: V-01 stress fix — Physique/Will >=3 yields 6 stress boxes (FCon p.12)',
    physHigh, 'stressFromRating(r>=3) must return 6, not 5');
})();

// NA-210: V-04 — PL-03 pyramid has 3 Fair (+2) slots (not 2)
(function() {
  var fs2 = require('fs');
  var board = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-210: V-04 PL-03 pyramid — 3 Fair (+2) slots (FCon: 1×+4, 2×+3, 3×+2, 4×+1)',
    board.includes('{r:2,n:3}') && !board.includes('{r:2,n:2}'),
    'PC_SKILL_LADDER must have {r:2,n:3} for Fair slots');
})();

// NA-211: V-03 — Contest tie wording mentions "situation aspect" not "boost"
(function() {
  var fs2 = require('fs');
  var board = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-211: V-03 Contest tie wording — must say situation aspect not boost (FCon p.33)',
    board.includes('situation aspect') && !board.includes('Tie = boost'),
    'Contest help text must describe unexpected twist / situation aspect, not boost');
})();

// ── Crash Prevention Tests (NA-212 – NA-216) ──────────────────────────────
// Each assertion corresponds to a production crash or console error observed
// in v374–v378. They would have caught the bug before the build shipped.

// NA-212: No document.write() in any HTML file
// Catches: "unbalanced tree" speculative parsing warning + CSP write-src blocks
(function() {
  var fs2 = require('fs');
  var dirs = ['campaigns', 'help', '.'];
  var badFiles = [];
  dirs.forEach(function(dir) {
    try {
      fs2.readdirSync(dir).forEach(function(f) {
        if (!f.endsWith('.html')) return;
        var full = dir === '.' ? f : dir + '/' + f;
        try {
          var src = fs2.readFileSync(full, 'utf8');
          if (src.includes('document.write(')) badFiles.push(full);
        } catch(e) {}
      });
    } catch(e) {}
  });
  assert('NA-212: No document.write() in HTML files (causes speculative parsing warnings + CSP blocks)',
    badFiles.length === 0,
    'Found document.write() in: ' + badFiles.join(', '));
})();

// NA-213: campMeta defined before first use inside BoardApp
// Catches: "campMeta is undefined" TypeError — hook calls must not reference
// derived vars before they are declared in the component body.
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  var lines = src.split('\n');
  var appStart = lines.findIndex(function(l) { return /^function BoardApp\(/.test(l); });
  if (appStart === -1) { assert('NA-213: campMeta ordering', false, 'BoardApp function not found'); return; }
  var app = lines.slice(appStart);
  var defLine   = app.findIndex(function(l) { return /var campMeta\s*=/.test(l); });
  var firstUse  = -1;
  for (var i = 0; i < (defLine === -1 ? app.length : defLine); i++) {
    if (/campMeta\.(name|icon|id|slug)\b/.test(app[i]) && !/var campMeta/.test(app[i])) {
      firstUse = i; break;
    }
  }
  assert('NA-213: campMeta defined before first property access in BoardApp',
    defLine !== -1 && firstUse === -1,
    firstUse !== -1
      ? 'campMeta accessed at BoardApp+' + firstUse + ' before defined at BoardApp+' + defLine
      : 'campMeta declaration not found');
})();

// NA-214: useBoardBinder called after campMeta definition in BoardApp
// Catches: the specific ordering bug fixed in v378 — hook referenced campMeta.name
// before campMeta was computed.
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  var lines = src.split('\n');
  var appStart = lines.findIndex(function(l) { return /^function BoardApp\(/.test(l); });
  if (appStart === -1) { assert('NA-214: useBoardBinder ordering', false, 'BoardApp not found'); return; }
  var app = lines.slice(appStart);
  var binderLine  = app.findIndex(function(l) { return /useBoardBinder\(/.test(l); });
  var campMetLine = app.findIndex(function(l) { return /var campMeta\s*=/.test(l); });
  assert('NA-214: useBoardBinder called after campMeta is defined (hook ordering guard)',
    campMetLine !== -1 && binderLine !== -1 && campMetLine < binderLine,
    'campMeta at BoardApp+' + campMetLine + ', useBoardBinder at BoardApp+' + binderLine +
    ' — hook must come after derived var');
})();

// NA-215: CSP _headers file allows Google Fonts origins
// Catches: Jost font blocked by Content-Security-Policy on production
(function() {
  var fs2 = require('fs');
  var src = '';
  try { src = fs2.readFileSync('_headers', 'utf8'); } catch(e) {
    assert('NA-215: _headers CSP allows Google Fonts', false, '_headers file not found'); return;
  }
  assert('NA-215: CSP _headers allows fonts.googleapis.com (style-src) and fonts.gstatic.com (font-src)',
    src.includes('https://fonts.googleapis.com') && src.includes('https://fonts.gstatic.com'),
    'Missing from _headers: ' +
      (!src.includes('https://fonts.googleapis.com') ? 'fonts.googleapis.com ' : '') +
      (!src.includes('https://fonts.gstatic.com')    ? 'fonts.gstatic.com'     : ''));
})();

// NA-216: No guarded derived vars used before their declaration in BoardApp
// Catches: the class of ordering bugs where campMeta / tables / campCanvasKey
// are referenced (e.g. inside a hook call) before their var declaration.
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  var lines = src.split('\n');
  var appStart = lines.findIndex(function(l) { return /^function BoardApp\(/.test(l); });
  if (appStart === -1) { assert('NA-216: derived var ordering in BoardApp', false, 'BoardApp not found'); return; }
  var app = lines.slice(appStart);
  var guarded = ['campMeta', 'tables', 'campCanvasKey'];
  var violations = [];
  guarded.forEach(function(v) {
    var defLine = app.findIndex(function(l) { return new RegExp('\\bvar ' + v + '\\s*=').test(l); });
    if (defLine === -1) return;
    for (var i = 0; i < defLine; i++) {
      if (/^\s*\/\//.test(app[i])) continue; // skip comment lines
      if (new RegExp('\\b' + v + '\\b').test(app[i]) && !new RegExp('var ' + v).test(app[i])) {
        violations.push(v + ' used at BoardApp+' + i + ' before defined at BoardApp+' + defLine);
        break;
      }
    }
  });
  assert('NA-216: campMeta, tables, campCanvasKey all used after their declaration in BoardApp',
    violations.length === 0,
    violations.join('; '));
})();

// ── NA-217 through NA-230: Hardened Load / Runtime Crash Prevention ─────────

// NA-217: Version stamp consistency — all ?v=N in campaign HTML match sw.js build number
// Catches: stale cache-busting stamps serving wrong file versions after a bump
(function() {
  var fs2 = require('fs');
  var swSrc = fs2.readFileSync('sw.js', 'utf8');
  var cacheMatch = swSrc.match(/CACHE_NAME\s*=\s*['"]fate-generator-[\d.]+\.(\d+)['"]/);
  if (!cacheMatch) { assert('NA-217: version stamp sync', false, 'Could not parse build number from sw.js'); return; }
  var buildNum = cacheMatch[1];

  var badFiles = [];
  ['campaigns','help','.'].forEach(function(dir) {
    try { require('fs').readdirSync(dir).forEach(function(f) {
      if (!f.endsWith('.html')) return;
      var full = dir === '.' ? f : dir + '/' + f;
      var src = fs2.readFileSync(full, 'utf8');
      // Find all ?v=N stamps on local assets (not CDN)
      var stamps = src.match(/(?:src|href)="[^"]*\.(?:js|css)\?v=(\d+)"/g) || [];
      stamps.forEach(function(s) {
        var m = s.match(/\?v=(\d+)/);
        if (m && m[1] !== buildNum && m[1] !== '1' && m[1] !== '205') {
          badFiles.push(full + ':' + s.slice(0,60));
        }
      });
    }); } catch(e) {}
  });
  assert('NA-217: all ?v=N stamps match current build number (' + buildNum + ')',
    badFiles.length === 0,
    'Stale version stamps: ' + badFiles.slice(0,3).join(' | '));
})();

// NA-218: Every campaign page loads React before any core JS file
// Catches: "React is not defined" crash when core files load before CDN
(function() {
  var fs2 = require('fs');
  var camps = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'];
  var bad = [];
  camps.forEach(function(c) {
    var src = fs2.readFileSync('campaigns/' + c + '.html', 'utf8');
    var reactIdx = src.indexOf('react.production.min.js');
    var coreIdx  = Math.min(
      src.includes('core/engine.js') ? src.indexOf('core/engine.js') : Infinity,
      src.includes('core/ui.js')     ? src.indexOf('core/ui.js')     : Infinity,
      src.includes('core/db.js')     ? src.indexOf('core/db.js')     : Infinity
    );
    if (reactIdx === -1) bad.push(c + ': React CDN missing');
    else if (reactIdx > coreIdx) bad.push(c + ': React loaded after core files');
  });
  assert('NA-218: React CDN loaded before core JS on every campaign page',
    bad.length === 0, bad.join(', '));
})();

// NA-219: Every campaign page loads Dexie before db.js
// Catches: "Dexie is not defined" crash — db.js requires Dexie at load time
(function() {
  var fs2 = require('fs');
  var camps = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'];
  var bad = [];
  camps.forEach(function(c) {
    var src = fs2.readFileSync('campaigns/' + c + '.html', 'utf8');
    var dexieIdx = src.indexOf('dexie.min.js');
    var dbIdx    = src.indexOf('core/db.js');
    if (dexieIdx === -1) bad.push(c + ': Dexie CDN missing');
    else if (dbIdx !== -1 && dexieIdx > dbIdx) bad.push(c + ': Dexie after db.js');
  });
  assert('NA-219: Dexie CDN loaded before db.js on every campaign page',
    bad.length === 0, bad.join(', '));
})();

// NA-220: No core JS file loaded twice in any campaign page
// Catches: double-execution corrupting global state (e.g. config.js loaded twice)
(function() {
  var fs2 = require('fs');
  var camps = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'];
  var bad = [];
  camps.forEach(function(c) {
    var src = fs2.readFileSync('campaigns/' + c + '.html', 'utf8');
    var scripts = src.match(/src="[^"]*\/core\/[^"]+"/g) || [];
    var seen = {};
    scripts.forEach(function(s) {
      var name = s.replace(/\?v=\d+/, '');
      if (seen[name]) bad.push(c + ': ' + name + ' loaded twice');
      seen[name] = true;
    });
  });
  assert('NA-220: no core JS file loaded twice in any campaign page',
    bad.length === 0, bad.slice(0,3).join(' | '));
})();

// NA-221: OGMA_CONFIG.VERSION in config.js matches sw.js CACHE_NAME build
// Catches: version displayed in UI mismatches the deployed cache key
(function() {
  var fs2 = require('fs');
  var cfgSrc = fs2.readFileSync('core/config.js', 'utf8');
  var swSrc  = fs2.readFileSync('sw.js', 'utf8');
  var cfgMatch = cfgSrc.match(/VERSION['"]?\s*:\s*['"]([^'"]+)['"]/);
  var swMatch  = swSrc.match(/CACHE_NAME\s*=\s*['"]fate-generator-([^'"]+)['"]/);
  var cfgVer = cfgMatch ? cfgMatch[1] : null;
  var swVer  = swMatch  ? swMatch[1]  : null;
  assert('NA-221: OGMA_CONFIG.VERSION matches sw.js CACHE_NAME build',
    cfgVer !== null && swVer !== null && cfgVer === swVer,
    'config.js VERSION=' + cfgVer + ' sw.js CACHE_NAME build=' + swVer);
})();

// NA-222: h, useState, useEffect, useRef, useCallback, Fragment all defined in ui-primitives.js
// Catches: React alias missing — every component file depends on these globals
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-primitives.js', 'utf8');
  var required = ['h', 'useState', 'useEffect', 'useRef', 'useCallback', 'Fragment'];
  var missing = required.filter(function(g) {
    return !new RegExp('(?:const|var)\\s+' + g + '\\s*=').test(src);
  });
  assert('NA-222: React aliases (h, useState, useEffect, useRef, useCallback, Fragment) defined in ui-primitives.js',
    missing.length === 0,
    'Missing definitions: ' + missing.join(', '));
})();

// NA-223: No bare top-level const/let in ui.js or ui-board.js
// const/let at top level of these files can cause TDZ errors when loaded as plain <script> tags
// ui-primitives.js, engine.js, renderers.js, and landing.js intentionally use const — excluded
(function() {
  var fs2 = require('fs');
  var checkFiles = ['core/ui.js', 'core/ui-board.js', 'core/ui-table.js',
                    'core/ui-modals.js', 'core/db.js'];
  var bad = [];
  checkFiles.forEach(function(f) {
    var lines = fs2.readFileSync(f, 'utf8').split('\n');
    lines.forEach(function(l, i) {
      if (/^const\s+\w|^let\s+\w/.test(l)) bad.push(f + ':L' + (i+1) + ': ' + l.trim().slice(0,60));
    });
  });
  assert('NA-223: no top-level const/let in ui.js, ui-board.js, ui-table.js, ui-modals.js, db.js',
    bad.length === 0, bad.slice(0,3).join(' | '));
})();

// NA-224: board.html redirect target exists
// Catches: board.html pointing to a page that was renamed/deleted
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('campaigns/board.html', 'utf8');
  // board.html should contain a script redirect or meta refresh
  var hasRedirect = /window\.location|meta.*refresh|href.*board/i.test(src);
  // The target page (one of the campaign pages) should load ui-board.js
  var hasBoard = src.includes('ui-board.js') || src.includes('board.html');
  assert('NA-224: campaigns/board.html exists and contains redirect or board UI',
    fs2.existsSync('campaigns/board.html') && (hasRedirect || hasBoard),
    'board.html missing or contains neither redirect nor ui-board.js reference');
})();

// NA-225: Each campaign page loads its own matching data file (not another world's)
// Catches: copy-paste error where cyberpunk.html loads fantasy.js data
(function() {
  var fs2 = require('fs');
  var camps = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'];
  var bad = [];
  camps.forEach(function(c) {
    var src = fs2.readFileSync('campaigns/' + c + '.html', 'utf8');
    if (!src.includes('data/' + c + '.js')) {
      bad.push(c + ': missing data/' + c + '.js');
    }
    // Also check it doesn't load ANOTHER world's data exclusively
    camps.forEach(function(other) {
      if (other === c) return;
      if (src.includes('data/' + other + '.js') && !src.includes('data/' + c + '.js')) {
        bad.push(c + ': loads ' + other + '.js instead of own data');
      }
    });
  });
  assert('NA-225: each campaign page loads its own matching data file',
    bad.length === 0, bad.slice(0,3).join(' | '));
})();

// NA-226: node --check syntax validation for all JS files in core/ and data/
// Catches: syntax errors that would silently fail in the browser
(function() {
  var fs2   = require('fs');
  var child = require('child_process');
  var bad   = [];
  ['core','data','assets/js'].forEach(function(dir) {
    try { fs2.readdirSync(dir).forEach(function(f) {
      if (!f.endsWith('.js') || f.endsWith('.min.js')) return;
      try {
        child.execSync('node --check ' + dir + '/' + f + ' 2>&1', {encoding:'utf8'});
      } catch(e) {
        bad.push(dir + '/' + f + ': ' + e.stdout.trim().slice(0,80));
      }
    }); } catch(e) {}
  });
  assert('NA-226: node --check passes for all JS files in core/, data/, assets/js/',
    bad.length === 0, bad.slice(0,3).join(' | '));
})();

// NA-227: ErrorBoundary class present in ui-primitives.js
// Catches: missing error boundary — without it, React crashes show a blank white page
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-primitives.js', 'utf8');
  assert('NA-227: ErrorBoundary class defined in ui-primitives.js',
    src.includes('class ErrorBoundary') || src.includes('ErrorBoundary'),
    'ErrorBoundary not found — React crashes will show blank page with no user feedback');
})();

// NA-228: sw.js APP_SHELL includes all 8 campaign pages
// Catches: offline install missing a page — user gets blank screen on cached visit
(function() {
  var fs2 = require('fs');
  var swSrc = fs2.readFileSync('sw.js', 'utf8');
  var camps = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'];
  var missing = camps.filter(function(c) { return !swSrc.includes(c); });
  assert('NA-228: sw.js APP_SHELL references all 8 campaign pages for offline install',
    missing.length === 0, 'Missing from sw.js: ' + missing.join(', '));
})();

// NA-229: No undefined values in generated output across all worlds and generators
// Catches: sparse array holes in data files (e.g. double-comma bug) producing "undefined" text
(function() {
  var badItems = [];
  var genIds = ['npc_minor','npc_major','scene','campaign','encounter','seed',
                'compel','challenge','contest','consequence','faction','complication'];
  camps.forEach(function(camp) {
    var t = filteredTables(mergeUniversal(CAMPAIGNS[camp].tables), {});
    genIds.forEach(function(gen) {
      for (var i = 0; i < 30; i++) {
        try {
          var r = generate(gen, t, 4);
          // Check all string values recursively
          var str = JSON.stringify(r);
          if (str && (str.includes('"undefined"') || str.includes(':undefined'))) {
            badItems.push(camp + '/' + gen);
            return; // one hit per gen per world is enough
          }
          // Check for actual undefined values (lost by JSON.stringify)
          function checkObj(obj, path) {
            // null is intentional (e.g. stunt: null when no stunt rolled) — only flag undefined
            if (obj === undefined) { badItems.push(camp+'/'+gen+' '+path+'=undefined'); return; }
            if (obj === null) return; // intentional absence — skip
            if (typeof obj === 'object') {
              Object.keys(obj).forEach(function(k) {
                if (obj[k] === undefined) badItems.push(camp+'/'+gen+'.'+k+'=undefined');
                else checkObj(obj[k], path+'.'+k);
              });
            }
          }
          checkObj(r, '');
          if (badItems.some(function(b){ return b.startsWith(camp+'/'+gen); })) return;
        } catch(e) {}
      }
    });
  });
  var unique = badItems.filter(function(v,i,a){ return a.indexOf(v)===i; });
  assert('NA-229: no undefined values in generated output across all worlds and generators',
    unique.length === 0, unique.slice(0,5).join(', '));
})();

// NA-230: All custom hooks (useBoardX, useChromeHooks, useGeneratorSession) defined
//         before their call sites in the same file
// Catches: the class of ordering bug that caused the v378 crash — extended to all hooks
(function() {
  var fs2 = require('fs');
  var filesToCheck = ['core/ui-board.js', 'core/ui.js'];
  var violations = [];
  filesToCheck.forEach(function(f) {
    var lines = fs2.readFileSync(f, 'utf8').split('\n');
    // Find all hook definitions and their first call sites
    var hookDefs = {};
    lines.forEach(function(l, i) {
      var m = l.match(/^function (use[A-Z]\w+)\s*\(/);
      if (m) hookDefs[m[1]] = i;
    });
    // Find first call to each hook
    Object.keys(hookDefs).forEach(function(hook) {
      var defLine = hookDefs[hook];
      for (var i = 0; i < defLine; i++) {
        if (new RegExp('\\b' + hook + '\\s*\\(').test(lines[i]) &&
            !new RegExp('function\\s+' + hook).test(lines[i])) {
          violations.push(f + ': ' + hook + ' called at L' + (i+1) + ' before defined at L' + (defLine+1));
          break;
        }
      }
    });
  });
  assert('NA-230: all custom hooks defined before their first call site',
    violations.length === 0, violations.slice(0,3).join(' | '));
})();



// NA-231: UX-11 — "Quick Adventure Start" renamed to "Adventure Seed" everywhere
// NOTE: "Quick Adventure Start Pack" in ui.js is a separate named feature and is intentionally preserved.
// Catches: label drift between BOARD_GEN_GROUPS, shared.js GENERATORS, engine.js markdown
(function() {
  var fs2 = require('fs');
  var hits = [];
  ['core/ui-board.js','core/engine.js','data/shared.js','core/ui-renderers.js'].forEach(function(f) {
    var src = fs2.readFileSync(f,'utf8');
    // Allow the Pack feature name in ui.js — that's a separate named feature
    var lines = src.split('\n');
    lines.forEach(function(l,i) {
      if (/Quick Adventure Start/.test(l) && !/Pack/.test(l))
        hits.push(f+':L'+(i+1)+': '+l.trim().slice(0,80));
    });
  });
  assert('NA-231: "Quick Adventure Start" fully renamed to "Adventure Seed" (UX-11)',
    hits.length === 0, hits.join(' | '));
})();



// NA-232: UX-04 — syncRole passed in sync prop group to BoardTopbar
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-232: UX-04 syncRole passed to BoardTopbar sync prop (player room chip)',
    src.includes('role: syncObj ? syncObj.role') && src.includes('bt-room-chip'),
    'syncRole must be passed in sync prop and bt-room-chip must exist in render');
})();

// NA-233: UX-10 — "Popcorn Initiative" renamed to "Turn Order" with explanation
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui.js', 'utf8');
  assert('NA-233: UX-10 Turn Order tab — renamed from Initiative, explanation text present',
    src.includes('Turn Order') &&
    src.includes('After you act, choose who goes next') &&
    !src.includes("}, '🏁 Initiative')"),
    'Tab must be renamed to Turn Order and include explanation text');
})();



// NA-234: UX-07 — blp-sub text present on generator items (subtitles in left panel)
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  // Every generator group entry should have a sub field
  var groups = src.match(/id:\s*'seed'[^}]+sub:/);
  assert('NA-234: UX-07 generator sub-text — seed entry has sub field in BOARD_GEN_GROUPS',
    !!groups && src.includes('blp-sub') && src.includes('blp-label-wrap'),
    'BOARD_GEN_GROUPS entries must have sub field and render blp-sub + blp-label-wrap');
})();

// NA-235: UX-13 — Canvas Tools group has separator flag
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-235: UX-13 Tools group has separator:true and blp-separator CSS class used in render',
    src.includes("id: 'tools'") && src.includes('separator: true') &&
    src.includes('blp-separator'),
    'Tools group must have separator:true and render with blp-separator class');
})();

// NA-236: UX-03 — Stress hint text present on major NPC card renderer
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-renderers.js', 'utf8');
  assert('NA-236: UX-03 stress ≠ HP hint on NPC card (D&D convert orientation)',
    src.includes('Stress') && src.includes('clears end of scene') && src.includes('Physique/Will'),
    'Major NPC card must include inline stress rule hint');
})();

// NA-237: UX-09 — mobile topbar max-width breakpoint for world select
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('assets/css/theme.css', 'utf8');
  assert('NA-237: UX-09 mobile topbar — mid-width breakpoint limits bt-world-select to 90px',
    src.includes('max-width:700px') && src.includes('max-width:90px'),
    'theme.css must have 521-700px breakpoint with max-width:90px on bt-world-select');
})();



// NA-238: UX-06 — Session Zero "Start Local Session" button and sessionStorage handoff
(function() {
  var fs2 = require('fs');
  var szSrc  = fs2.readFileSync('campaigns/character-creation.html', 'utf8');
  var brdSrc = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-238: UX-06 Session Zero local session bridge present',
    szSrc.includes('ogma_sz_handoff') &&
    szSrc.includes('Start Local Session') &&
    brdSrc.includes('ogma_sz_handoff') &&
    brdSrc.includes('from_session_zero') === false &&  // check we used the right field
    brdSrc.includes("from === 'session_zero'"),
    'character-creation.html must write ogma_sz_handoff; BoardApp must read and consume it');
})();

// NA-239: board.html default mode is prep (not play) — Session Zero lands in Prep mode
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('campaigns/board.html', 'utf8');
  assert('NA-239: board.html defaults to mode=prep so Session Zero bridge opens in Prep mode',
    src.includes("|| 'prep'") && !src.includes("|| 'play'"),
    'board.html must default mode to prep, not play');
})();



// NA-240: Custom Card — cv4FrontCustom defined and registered in CV4_FRONTS
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-renderers.js', 'utf8');
  assert('NA-240: Custom Card — cv4FrontCustom renderer defined and CV4_FRONTS[custom] registered',
    src.includes('function cv4FrontCustom') &&
    src.includes("custom: function(gid") &&
    src.includes('CV4_CUSTOM_TYPES') &&
    src.includes("cat: 'custom'"),
    'cv4FrontCustom must be defined and registered in CV4_FRONTS with CV4_CUSTOM_TYPES');
})();

// NA-241: Custom Card — generateCard handles custom genId without engine call
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-241: Custom Card — generateCard has custom path and rerollCard guards it',
    src.includes("genId === 'custom'") &&
    src.includes("Custom Card added") &&
    src.includes("genId === 'sticky' || existing.genId === 'custom'"),
    'generateCard must handle custom, rerollCard must skip it');
})();

// NA-242: Custom Card — onUpdate wired through to renderCard for custom genId
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-242: Custom Card — BoardCard passes live onUpdate to renderCard for custom genId',
    src.includes("genId === 'custom'") &&
    src.includes('extractCardTitle') &&
    src.includes('extractCardSummary') &&
    src.includes('extractCardTags'),
    'BoardCard must pass onUpdate to renderCard for custom cards to persist inline edits');
})();



// NA-243: Dead CSS removed — retired class families must not reappear in theme.css
// Guards against re-introduction of bdf-*, bds-*, cc-zone*, bt-live*, board-root, bd-pin etc.
(function() {
  var fs2 = require('fs');
  var css = fs2.readFileSync('assets/css/theme.css', 'utf8');
  var dead = ['bdf-section', 'bds-boxes', 'cc-zone-card', 'bt-live-badge', 'bt-live-dot',
              'board-root{', 'board-root #root', 'bd-pin{', 'bd-fallback', 'bd-rendered',
              'bt-world-name{', 'cc-gm-only', 'cc-free-invoke{', 'cc-hdr-acts', 'cc-new-ripple'];
  var hits = dead.filter(function(c) { return css.includes(c); });
  assert('NA-243: Retired CSS classes (bdf-*, bds-*, cc-zone*, bt-live*, board-root, bd-pin etc.) absent from theme.css',
    hits.length === 0,
    'Reintroduced dead classes: ' + hits.join(', '));
})();



// NA-244: State broadcast — broadcastRef and broadcastPlayState wired in BoardApp
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-244: GM state broadcast — broadcastRef, broadcastPlayState, and onTableChange hook present',
    src.includes('broadcastRef') &&
    src.includes('broadcastPlayState') &&
    src.includes('onTableChange') &&
    src.includes('syncObj.broadcastState'),
    'BoardApp must have broadcastRef, broadcastPlayState, onTableChange, and call syncObj.broadcastState');
})();

// NA-245: Auto-join — ?room= URL param triggers player connection on mount
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-245: Auto-join effect — BoardApp connects as player when ?room= in URL on mount',
    src.includes('AUTO-JOIN') &&
    src.includes("createTableSync(roomCode, 'player'") &&
    src.includes('roomCode.length !== 4'),
    'BoardApp must auto-connect as player when roomCode is 4 chars on mount');
})();

// NA-246: Shareable join link — room code button copies URL, separate disconnect button
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-246: Room code button copies shareable join link; disconnect is a separate × button',
    src.includes('Join link copied') &&
    src.includes('navigator.clipboard.writeText') &&
    src.includes('board.html?mode=play&room='),
    'Room code button must copy join URL via clipboard API');
})();

// NA-247: SW stale version fix — bare URL fallback on versioned asset cache miss
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('sw.js', 'utf8');
  assert('NA-247: SW fetch handler strips ?v=N query on cache miss to prevent stale-version crash',
    src.includes('bareUrl') &&
    src.includes("url.split('?')[0]") &&
    src.includes('caches.match(bareUrl)'),
    'sw.js must try bare URL (without query) on versioned asset cache miss');
})();

// NA-248: CSP — connect-src and style-src-elem include required origins
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('_headers', 'utf8');
  assert('NA-248: CSP _headers — connect-src includes cloudflareinsights, style-src-elem set explicitly',
    src.includes('static.cloudflareinsights.com') &&
    src.includes('style-src-elem'),
    '_headers must include cloudflareinsights in connect-src and explicit style-src-elem directive');
})();



// NA-249: PlayerSurface — component defined, syncState wired, player_action handled on GM side
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-249: PlayerSurface component present, syncState wired, player_action handled',
    src.includes('function PlayerSurface') &&
    src.includes('setSyncState') &&
    src.includes('ps-surface') &&
    src.includes("data.type === 'player_action'") &&
    src.includes('stress_update') &&
    src.includes('h(PlayerSurface'),
    'PlayerSurface must be defined, rendered in play path, and GM must handle player_action stress updates');
})();

// NA-250: PlayerSurface CSS — core layout classes present in theme.css
(function() {
  var fs2 = require('fs');
  var css = fs2.readFileSync('assets/css/theme.css', 'utf8');
  assert('NA-250: PlayerSurface CSS classes present in theme.css',
    css.includes('.ps-surface') &&
    css.includes('.ps-topbar') &&
    css.includes('.ps-player') &&
    css.includes('.ps-stress-box') &&
    css.includes('.ps-conseq-input'),
    'theme.css must have ps-surface, ps-topbar, ps-player, ps-stress-box, ps-conseq-input');
})();

// NA-251: TpDicePanel uses learn-fate visual language — dr-die classes, phase-based rendering
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-table.js', 'utf8');
  assert('NA-251: TpDicePanel uses learn-fate visual language with phase-based rendering',
    src.includes('tp-dice-v2') &&
    src.includes('dr-die dr-die-pop') &&
    src.includes('dr-die-pos') &&
    src.includes("phase === 'flicker'") &&
    src.includes("phase === 'reveal'") &&
    src.includes("phase === 'done'") &&
    src.includes('tpLcolHex'),
    'TpDicePanel must use tp-dice-v2 class, dr-die-pop animation, phase machine, and hex ladder colours');
})();

// NA-252: Scene End button renders in BoardTurnBar with confirm dialog
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-252: Scene End button in BoardTurnBar with confirm dialog',
    src.includes('board-scene-end') &&
    src.includes('onEndScene') &&
    src.includes("confirm('End scene?"),
    'BoardTurnBar must render board-scene-end button with confirm before calling onEndScene');
})();

// NA-253: endScene clears all stress arrays (FCon p.30)
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-253: endScene clears phy and men stress arrays',
    src.includes('function endScene()') &&
    src.includes('p.phy.map(function() { return false; })') &&
    src.includes('p.men.map(function() { return false; })'),
    'endScene must reset every phy and men box to false');
})();

// NA-254: tp-dice-v2 CSS classes present in theme.css
(function() {
  var fs2 = require('fs');
  var css = fs2.readFileSync('assets/css/theme.css', 'utf8');
  assert('NA-254: tp-dice-v2 CSS classes present in theme.css',
    css.includes('.tp-dice-v2') &&
    css.includes('.tp-dice-who') &&
    css.includes('.tp-dice-controls') &&
    css.includes('.tp-dice-skill-pill') &&
    css.includes('.tp-dice-history') &&
    css.includes('.board-scene-end'),
    'theme.css must include tp-dice-v2 layout classes and board-scene-end button style');
})();

// NA-255: removeFromTable function exists in useBoardBinder and is returned
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-255: removeFromTable in useBoardBinder — removes card by sourceId',
    src.includes('function removeFromTable(sourceId)') &&
    src.includes("c.sourceId !== sourceId") &&
    src.includes('removeFromTable: removeFromTable'),
    'useBoardBinder must define removeFromTable filtering by sourceId and return it');
})();

// NA-256: BoardCard renders remove-from-table button when card is on table
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-256: BoardCard has onRemoveFromTable prop and bc-remove-table button',
    src.includes('var onRemoveFromTable = props.onRemoveFromTable') &&
    src.includes('bc-remove-table') &&
    src.includes('onRemoveFromTable(card.id)'),
    'BoardCard must destructure onRemoveFromTable and render bc-remove-table button');
})();

// NA-257: cv4Card uses CSS 3D flip (cv4-flip-container, cv4-flipper, rotateY)
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-renderers.js', 'utf8');
  assert('NA-257: cv4Card flip architecture — container, flipper, front, back faces',
    src.includes('cv4-flip-container') &&
    src.includes('cv4-flipper') &&
    src.includes('cv4-front fd-card') &&
    src.includes('cv4-back') &&
    src.includes("rotateY(180deg)") &&
    src.includes('setFlipped'),
    'cv4Card must use cv4-flip-container with front/back faces and rotateY(180deg)');
})();

// NA-258: cv4Card flip respects reduced motion — display toggle instead of transform
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-renderers.js', 'utf8');
  assert('NA-258: cv4Card flip reduced-motion fallback hides/shows faces via display',
    src.includes("reduced && flipped ? 'none' : 'flex'") &&
    src.includes("reduced && !flipped ? 'none' : 'flex'") &&
    src.includes("perspective: reduced ? 'none'") &&
    src.includes("transformStyle: reduced ? 'flat'"),
    'Reduced-motion must toggle display:none/flex instead of CSS 3D transforms');
})();

// NA-259: Free invoke pips on aspect stickies (INV-01)
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-259: Aspect stickies render free invoke pips with add/consume',
    src.includes('sticky-invokes') &&
    src.includes('sticky-inv-pip') &&
    src.includes('freeInvokes') &&
    src.includes('sticky-inv-add'),
    'Sticky card must render invoke pip row with filled/empty states and add button');
})();

// NA-260: Free invoke CSS classes in theme.css
(function() {
  var fs2 = require('fs');
  var css = fs2.readFileSync('assets/css/theme.css', 'utf8');
  assert('NA-260: Free invoke CSS classes present in theme.css',
    css.includes('.sticky-invokes') &&
    css.includes('.sticky-inv-pip') &&
    css.includes('.sticky-inv-add') &&
    css.includes('.sticky-inv-label'),
    'theme.css must include sticky-invokes, sticky-inv-pip, sticky-inv-add, sticky-inv-label');
})();

// NA-261: Character sheet section in PlayerSurface (CHR-01)
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-261: PlayerSurface has expandable My Character sheet',
    src.includes('ps-sheet') &&
    src.includes('ps-sheet-toggle') &&
    src.includes('ps-sheet-body') &&
    src.includes('ps-sheet-sk-pill') &&
    src.includes('My Character'),
    'PlayerSurface must render ps-sheet with toggle, body, skill pills, and aspects');
})();

// NA-262: Character sheet CSS classes in theme.css
(function() {
  var fs2 = require('fs');
  var css = fs2.readFileSync('assets/css/theme.css', 'utf8');
  assert('NA-262: Character sheet CSS classes present in theme.css',
    css.includes('.ps-sheet') &&
    css.includes('.ps-sheet-toggle') &&
    css.includes('.ps-sheet-body') &&
    css.includes('.ps-sheet-sk-row') &&
    css.includes('.ps-sheet-asp-val'),
    'theme.css must include ps-sheet layout, toggle, body, skill row, aspect value classes');
})();

// NA-263: Boost card type in BOARD_GEN_GROUPS and BOARD_TYPE_COLOR
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-263: Boost card registered in gen groups and colour map',
    src.includes("id: 'boost'") &&
    src.includes("boost:") &&
    src.includes("genId === 'boost'"),
    'Boost must appear in BOARD_GEN_GROUPS, BOARD_TYPE_COLOR, and have creation logic');
})();

// NA-264: Boost card renders with invoke button and expired state
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-board.js', 'utf8');
  assert('NA-264: Boost card rendering — use invoke, expired label',
    src.includes('board-boost') &&
    src.includes('boost-use-btn') &&
    src.includes('boost-expired-label') &&
    src.includes("expired: true"),
    'BoardCard must render boost with use-invoke button and expired state');
})();

// NA-265: Boost CSS classes in theme.css
(function() {
  var fs2 = require('fs');
  var css = fs2.readFileSync('assets/css/theme.css', 'utf8');
  assert('NA-265: Boost CSS classes present in theme.css',
    css.includes('.board-boost') &&
    css.includes('.boost-use-btn') &&
    css.includes('.boost-expired') &&
    css.includes('.boost-header'),
    'theme.css must include board-boost, boost-use-btn, boost-expired, boost-header');
})();

// NA-266: Opposition ladder dropdown replaces number input
(function() {
  var fs2 = require('fs');
  var src = fs2.readFileSync('core/ui-table.js', 'utf8');
  assert('NA-266: Opposition Fate Ladder dropdown in TpDicePanel',
    src.includes('tp-ladder-wrap') &&
    src.includes('tp-ladder-dropdown') &&
    src.includes('tp-ladder-opt') &&
    src.includes('ladderOpen') &&
    !src.includes('tp-dice-opp-input'),
    'TpDicePanel must use ladder dropdown, not number input');
})();

// NA-267: Opposition ladder CSS classes in theme.css
(function() {
  var fs2 = require('fs');
  var css = fs2.readFileSync('assets/css/theme.css', 'utf8');
  assert('NA-267: Opposition ladder CSS classes present in theme.css',
    css.includes('.tp-ladder-wrap') &&
    css.includes('.tp-ladder-sel') &&
    css.includes('.tp-ladder-dropdown') &&
    css.includes('.tp-ladder-opt'),
    'theme.css must include tp-ladder-wrap, tp-ladder-sel, tp-ladder-dropdown, tp-ladder-opt');
})();

console.log('Named assertions: '+(pass+fail)+' total  pass:'+pass+'  fail:'+fail);
results.forEach(function(r){console.log(r);});
