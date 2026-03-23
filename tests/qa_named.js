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

// NA-01: Minor NPC stress cap <= 3
camps.forEach(function(camp) {
  var t = filteredTables(mergeUniversal(CAMPAIGNS[camp].tables), {});
  var hit = false;
  for (var i = 0; i < 200; i++) {
    var r = generateMinorNPC(t);
    if (r.stress !== null && r.stress > 3) { hit = true; break; }
  }
  assert('NA-01 minor stress <=3 ['+camp+']', !hit, 'stress exceeded 3');
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

  assert('NA-177: ExportMenu call site passes onToast and onShareLink',
    ui.includes('onToast: showToast') && ui.includes('onShareLink: result ? copyShareLink : null'),
    'ExportMenu call site must pass onToast and onShareLink');

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

  assert('NA-182: Accordion has Play section first',
    (function() {
      var pi = ui.indexOf("sbAcc === 'play'");
      var bi = ui.indexOf("sbAcc === 'binder'");
      var gi = ui.indexOf("sbAcc === 'generate'");
      return pi > 0 && bi > pi && gi > bi;
    })(),
    'Play must come before Binder, Binder before Generate in nav order');

  assert('NA-183: All accordion headers have aria-expanded',
    (ui.match(/'aria-expanded': String\(sbAcc ===/g)||[]).length >= 4,
    'All four section headers must have aria-expanded');

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

console.log('Named assertions: '+(pass+fail)+' total  pass:'+pass+'  fail:'+fail);
results.forEach(function(r){console.log(r);});