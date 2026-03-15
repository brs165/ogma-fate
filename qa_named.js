var fs = require('fs');
eval(fs.readFileSync('data/shared.js','utf8'));
eval(fs.readFileSync('data/universal.js','utf8'));
eval(fs.readFileSync('data/thelongafter.js','utf8'));
eval(fs.readFileSync('data/cyberpunk.js','utf8'));
eval(fs.readFileSync('data/fantasy.js','utf8'));
eval(fs.readFileSync('data/space.js','utf8'));
eval(fs.readFileSync('data/victorian.js','utf8'));
eval(fs.readFileSync('data/postapoc.js','utf8'));
eval(fs.readFileSync('core/engine.js','utf8'));

var camps = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc'];
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

// Summary
console.log('Named assertions: '+(pass+fail)+' total  pass:'+pass+'  fail:'+fail);
results.forEach(function(r){console.log(r);});
