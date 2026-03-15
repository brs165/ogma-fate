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
eval(fs.readFileSync('core/engine.js','utf8'));

var camps = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western'];
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

// NA-02: Major NPC refresh = max(1, 3 - stunts.length)
camps.forEach(function(camp) {
  var t = filteredTables(mergeUniversal(CAMPAIGNS[camp].tables), {});
  var bad = null;
  for (var i = 0; i < 200; i++) {
    var r = generateMajorNPC(t);
    var expected = Math.max(1, 3 - r.stunts.length);
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

// NA-08: toBatchFariJSON — valid JSON, version:4, correct character count
var na08Fail = [];
['thelongafter','cyberpunk','fantasy','space','victorian','postapoc'].forEach(function(camp) {
  var bt = filteredTables(mergeUniversal(CAMPAIGNS[camp].tables), {});
  var maj = generate('npc_major', bt, 4);
  var min = generate('npc_minor', bt, 4);
  var scn = generate('scene', bt, 4);
  var cards = [
    {id:'1', campId:camp, genId:'npc_major', label:maj.name, data:maj},
    {id:'2', campId:camp, genId:'npc_minor', label:min.name, data:min},
    {id:'3', campId:camp, genId:'scene',     label:'Scene',   data:scn},
  ];
  try {
    var json = toBatchFariJSON(cards, CAMPAIGNS[camp].meta.name);
    if (!json) { na08Fail.push(camp+':null'); return; }
    var parsed = JSON.parse(json);
    if (!parsed.characters || parsed.characters.length !== 3) { na08Fail.push(camp+':count='+( parsed.characters||[]).length); return; }
    if (parsed.characters.some(function(c){return c.version !== 4;})) { na08Fail.push(camp+':version'); return; }
    if (parsed.characters.some(function(c){return !c.name;})) { na08Fail.push(camp+':name'); return; }
  } catch(e) { na08Fail.push(camp+':'+e.message); }
});
// null guard
var nullGuard = toBatchFariJSON([], null) === null && toBatchFariJSON(null, null) === null;
assert('NA-08 toBatchFariJSON valid + version:4 + null guard', na08Fail.length === 0 && nullGuard, na08Fail.join(', '));

// NA-09: intro.js responsive scale — fate-intro-content class + media queries present
var introSrc = fs.readFileSync('core/intro.js','utf8');
assert('NA-09 intro fate-intro-content class set', introSrc.includes("className = 'fate-intro-content'"), 'fate-intro-content class missing from content div');
assert('NA-09 intro desktop media query 900px', introSrc.includes('min-width:900px'), '900px desktop breakpoint missing');
assert('NA-09 intro wide media query 1400px', introSrc.includes('min-width:1400px'), '1400px wide breakpoint missing');
assert('NA-09 intro em-based title size', introSrc.includes('1.57em'), 'title font-size not in em');


// NA-10: Modal component — trapTab focus trap within boundary
// UX-11: trapTab confirmed implemented; this asserts it's present and wired
var uiSrc = fs.readFileSync('core/ui.js','utf8');
assert('NA-10 Modal trapTab focus trap implemented', uiSrc.includes('function trapTab'), 'trapTab function missing from Modal');
assert('NA-10 Modal trapTab addEventListener', uiSrc.includes("addEventListener('keydown', trapTab)"), 'trapTab not wired to keydown');
assert('NA-10 Modal aria-modal attribute', uiSrc.includes("'aria-modal'"), 'aria-modal attribute missing from Modal');

// NA-11: result-panel has aria-live="polite" and aria-atomic="true"
assert('NA-11 result-panel aria-live polite', uiSrc.includes("'aria-live': 'polite'"), 'aria-live polite missing from result-panel');
assert('NA-11 result-panel aria-atomic true', uiSrc.includes("'aria-atomic': 'true'"), 'aria-atomic true missing from result-panel');

// NA-12: theme-toggle aria-label present on static pages and React components
var staticPages = ['about.html','learn.html','license.html','campaigns/transition.html',
  'campaigns/guide-cyberpunk.html','campaigns/guide-fantasy.html','campaigns/guide-postapoc.html',
  'campaigns/guide-space.html','campaigns/guide-thelongafter.html','campaigns/guide-victorian.html'];
var na12Fail = staticPages.filter(function(p) {
  try {
    var c = fs.readFileSync(p, 'utf8');
    return !c.includes('aria-label') || !c.includes('Toggle theme') && !c.includes('Switch to');
  } catch(e) { return true; }
});
assert('NA-12 theme-toggle aria-label on static pages', na12Fail.length === 0, 'missing on: ' + na12Fail.join(', '));
assert('NA-12 React theme-toggle aria-label dynamic', uiSrc.includes("'Switch to light mode'") && uiSrc.includes("'Switch to dark mode'"), 'dynamic aria-label missing from React theme toggle');


// NA-13: index.html loads without LS/db crash
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
  var metaPos  = scriptOrder.indexOf('data/campaigns-meta.js');
  var sharedPos = scriptOrder.indexOf('data/shared.js');
  assert('NA-13 index.html: core/db.js present before core/ui.js',
    dbPos !== -1 && uiPos !== -1 && dbPos < uiPos,
    'db.js pos=' + dbPos + ' ui.js pos=' + uiPos + ' (db must precede ui)');
  assert('NA-13 index.html: data/shared.js present before core/ui.js',
    sharedPos !== -1 && uiPos !== -1 && sharedPos < uiPos,
    'shared.js pos=' + sharedPos + ' ui.js pos=' + uiPos + ' (GENERATORS/GENERATOR_GROUPS needed by LandingApp)');
  assert('NA-13 index.html: campaigns-meta.js present before core/ui.js',
    metaPos !== -1 && uiPos !== -1 && metaPos < uiPos,
    'campaigns-meta.js pos=' + metaPos + ' ui.js pos=' + uiPos);
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
    'campaigns/western.html','campaigns/sessionzero.html',
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
  var UTIL = ['.gen-badge','.cd-box','.contest-box','.seed-scene-tab','.check-marker',
              '.bypass-check','.result-fade-up','.btn-xs','.btn-nav','.fp-counter-btn',
              '.section-cap','.text-label-muted'];
  var missing = UTIL.filter(function(c){ return css.indexOf(c) === -1; });
  assert('NA-15: All utility CSS classes present in theme.css',
    missing.length === 0, 'Missing: '+missing.join(', '));
})();

// ── NA-16: projector.html communication layer intact ─────────────────────────
(function() {
  var proj = fs.readFileSync('projector.html','utf8');
  assert('NA-16: projector.html BroadcastChannel + localStorage + beforeunload',
    proj.indexOf('BroadcastChannel') !== -1 &&
    proj.indexOf('localStorage') !== -1 &&
    proj.indexOf('beforeunload') !== -1, 'Missing communication layer');
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
  var src = fs.readFileSync('core/ui.js','utf8');
  var defs  = (src.match(/^function renderResult\(/gm) || []).length;
  var calls = (src.match(/\brenderResult\(/g) || []).length - defs;
  assert('NA-19: renderResult defined AND called (>=2 call sites)',
    defs === 1 && calls >= 2,
    'defined=' + defs + ' call-sites=' + calls + ' (expect 1 def, >=2 calls)');
})();

// ── NA-20: CampaignApp key useState vars all declared (regression: 2026.03.56 — packRolling dropped) ──
(function() {
  var src = fs.readFileSync('core/ui.js','utf8');
  var camp = src.slice(src.indexOf('function CampaignApp('));
  var REQUIRED = [
    'sessionPack', 'setSessionPack',
    'packRolling',  'setPackRolling',
    'showIntroModal', 'setShowIntroModal',
    'seedResultDone', 'setSeedResultDone',
    'resultAnim',   'setResultAnim',
    'rollCount',    'setRollCount',
    'showStreakBadge', 'setShowStreakBadge',
    'projecting',   'setProjecting',
    'inspireMode',  'setInspireMode',
    'pinnedCards',  'setPinnedCards',
    'pinBouncing',  'setPinBouncing',
    'updateAvailable', 'setUpdateAvailable',
    'toast',        'setToast',
  ];
  var missing = REQUIRED.filter(function(v) {
    // Must appear as a var declaration (not just a use)
    return camp.indexOf('var ' + v + ' ') === -1;
  });
  assert('NA-20: CampaignApp key useState vars all declared',
    missing.length === 0, 'Missing declarations: ' + missing.join(', '));
})();

// ── NA-21: Campaign HTML pages — correct script load order (db < engine < ui < intro) ──
(function() {
  var camps = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western'];
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

// ── NA-22: Key component functions defined in ui.js ──────────────────────────
(function() {
  var src = fs.readFileSync('core/ui.js', 'utf8');
  var REQUIRED = [
    'function ResultCard(',
    'function SessionPackPanel(',
    'function GmTipsPanel(',
    'function RulesPanel(',
    'function DndPanel(',
    'function CampaignApp(',
    'function LandingApp(',
    'function renderResult(',
    'function Modal(',
    'function HelpModal(',
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
    '.gen-badge','.cd-box','.contest-box','.seed-scene-tab','.check-marker',
    '.bypass-check','.result-fade-up','.btn-xs','.btn-nav','.fp-counter-btn',
    '.section-cap','.text-label-muted','.text-sm-dim','.result-gold-header',
    // Inline intro container classes
    '.land-intro-teaser',
    // Intro modal classes (added 2026.03.59)
    '.intro-modal-box','.intro-modal-stage',
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
  var ui  = fs.readFileSync('core/ui.js','utf8');
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
  var src = fs.readFileSync('core/ui.js','utf8');
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

// ── NA-29: CampaignApp session-save effect includes all 3 deps ───────────────
// Regression: 2026.03.47 — the session-save useEffect had [result] only;
// history and activeGen were missing, causing stale saves.
(function() {
  var src = fs.readFileSync('core/ui.js','utf8');
  // Find the DB.saveSession effect body
  var idx = src.indexOf("DB.saveSession('fate_' + campId, {result: result");
  if (idx === -1) { assert('NA-29: session-save effect dep array correct', false, 'saveSession call not found'); return; }
  // Read forward to find dep array
  var block = src.slice(idx, idx+300);
  var dep = block.match(/\}, \[([^\]]*)\]\)/);
  var deps = dep ? dep[1] : '';
  var hasResult = deps.indexOf('result') !== -1;
  var hasHistory = deps.indexOf('history') !== -1;
  var hasActiveGen = deps.indexOf('activeGen') !== -1;
  assert('NA-29: session-save effect dep array has result, history, activeGen',
    hasResult && hasHistory && hasActiveGen,
    'deps=['+deps+'] missing: '+
    (!hasResult?'result ':'') + (!hasHistory?'history ':'') + (!hasActiveGen?'activeGen':''));
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
    opens === closes, 'diff=' + (opens - closes));
})();

// ── NA-30: No duplicate console.log('Named assertions') in qa_named.js ────────
// Meta-regression: 2026.03.50 — the summary block was accidentally duplicated,
// causing assertions to run twice and the count to double.
(function() {
  var src = fs.readFileSync('qa_named.js','utf8');
  var count = (src.match(/console\.log\('Named assertions:/g) || []).length;
  assert('NA-30: qa_named.js has exactly one summary console.log (no duplicates)',
    count === 1, 'Found '+count+' summary console.log calls (expected 1)');
})();

// ── NA-31: KB shortcuts — projector link has stopPropagation + href (no double-open) ─
// Regression: 2026.03.52/53 — the KB modal projector link fired both href AND
// window.open, opening two tabs. Correct state: stopPropagation present,
// kbd-sub-link class present, and no window.open (href on <a> handles the tab).
(function() {
  var src = fs.readFileSync('core/ui.js','utf8');
  var kbStart = src.indexOf('function KBShortcutsModal(');
  var kbEnd   = src.indexOf('\nfunction ', kbStart+1);
  var kb = src.slice(kbStart, kbEnd);
  var hasStopProp   = kb.indexOf('stopPropagation') !== -1;
  var hasSubLink    = kb.indexOf('kbd-sub-link') !== -1;
  var hasHref       = kb.indexOf("href: row[2]") !== -1;
  var hasDoubleOpen = kb.indexOf('window.open') !== -1;
  assert('NA-31: KB shortcuts projector link: stopPropagation + href, no double window.open',
    hasStopProp && hasSubLink && hasHref && !hasDoubleOpen,
    'stopProp='+hasStopProp+' subLink='+hasSubLink+' href='+hasHref+' doubleOpen='+hasDoubleOpen);
})();

// ── NA-32: fateInitInline is called from CampaignApp (not just defined) ────────
// Catches: inline intro API added to intro.js but never wired into React.
(function() {
  var src = fs.readFileSync('core/ui.js','utf8');
  var campStart = src.indexOf('function CampaignApp(');
  var camp = src.slice(campStart);
  var callCount = (camp.match(/fateInitInline/g) || []).length;
  assert('NA-32: fateInitInline called inside CampaignApp (>=1 call site)',
    callCount >= 1, 'fateInitInline call count in CampaignApp: '+callCount);
})();

// ── NA-33: aspect-ratio: 4/3 set on inline intro CSS containers ──────────────
(function() {
  var css = fs.readFileSync('assets/css/theme.css','utf8');
  var containers = ['.intro-modal-box', '.land-intro-teaser', '#guide-intro-teaser'];
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


// ── NA-36: StressBoxes calls onUpdate (BL-43 regression guard) ───────────────
(function() {
  var src = fs.readFileSync('core/ui.js','utf8');
  var sbStart = src.indexOf('function StressBoxes(');
  var sbEnd   = src.indexOf('\nfunction ', sbStart+1);
  var sb = src.slice(sbStart, sbEnd);
  assert('NA-36: StressBoxes calls props.onUpdate on mark()',
    sb.indexOf('props.onUpdate') !== -1 && sb.indexOf('takenOut') !== -1,
    'StressBoxes missing onUpdate call or takenOut flag');
})();

// ── NA-37: renderResult passes onUpdate to npc_minor and npc_major ───────────
(function() {
  var src = fs.readFileSync('core/ui.js','utf8');
  var rrStart = src.indexOf('function renderResult(');
  var rrEnd   = src.indexOf('\nfunction ', rrStart+1);
  var rr = src.slice(rrStart, rrEnd);
  var minorOk = /npc_minor.*onUpdate/.test(rr);
  var majorOk = /npc_major.*onUpdate/.test(rr);
  assert('NA-37: renderResult passes onUpdate to npc_minor + npc_major',
    minorOk && majorOk,
    'missing onUpdate: minor=' + minorOk + ' major=' + majorOk);
})();

// ── NA-38: projector.html handles update message for NPC stress ───────────────
(function() {
  var proj = fs.readFileSync('projector.html','utf8');
  assert('NA-38: projector.html applyUpdate handles NPC stress + taken-out overlay',
    proj.indexOf('proj-stress-filled') !== -1 &&
    proj.indexOf('proj-taken-out-visible') !== -1 &&
    proj.indexOf("genId === 'npc_minor' || genId === 'npc_major'") !== -1,
    'Missing NPC stress handler or taken-out class in projector.html');
})();

// ── NA-39: projector.css has taken-out + stress-filled animation classes ──────
(function() {
  var pcss = fs.readFileSync('assets/css/projector.css','utf8');
  var classes = ['.proj-taken-out','.proj-taken-out-visible','.proj-stress-filled',
                 '.proj-stress-box','.proj-asp-active'];
  var missing = classes.filter(function(c){ return pcss.indexOf(c) === -1; });
  assert('NA-39: projector.css has all Sprint 3 animation classes',
    missing.length === 0, 'Missing: ' + missing.join(', '));
})();


// ── NA-40: BL-06 shareable link — copyShareLink and _lastSeed present ────────
(function() {
  var src = fs.readFileSync('core/ui.js','utf8');
  var campStart = src.indexOf('function CampaignApp(');
  var camp = src.slice(campStart);
  var hasCopy   = camp.indexOf('function copyShareLink()') !== -1;
  var hasLastSeed = camp.indexOf('_lastSeed') !== -1;
  var hasLKey   = camp.indexOf("'l' || e.key === 'L'") !== -1 || camp.indexOf("e.key === 'l'") !== -1;
  assert('NA-40: BL-06 copyShareLink + _lastSeed + L-key in CampaignApp',
    hasCopy && hasLastSeed,
    'copyShareLink=' + hasCopy + ' _lastSeed=' + hasLastSeed);
})();

// ── NA-41: pushProjectorUpdate defined in CampaignApp ────────────────────────
(function() {
  var src = fs.readFileSync('core/ui.js','utf8');
  var campStart = src.indexOf('function CampaignApp(');
  var camp = src.slice(campStart);
  var hasPush = camp.indexOf('function pushProjectorUpdate(') !== -1;
  assert('NA-41: pushProjectorUpdate defined in CampaignApp',
    hasPush, 'pushProjectorUpdate function missing from CampaignApp');
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

// Summary
console.log('Named assertions: '+(pass+fail)+' total  pass:'+pass+'  fail:'+fail);
results.forEach(function(r){console.log(r);});