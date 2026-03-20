// core/engine.js
// Pure logic layer: utilities, all generate* functions, table prefs, markdown export.
// No React. No DOM references. Safe to unit-test in Node (with global mocks for
// CAMPAIGNS, UNIVERSAL, ALL_SKILLS, SKILL_LABEL).
// Depends on globals from: data/shared.js, data/universal.js, data/[campaign].js
// Must be loaded before core/ui.js.
// ─────────────────────────────────────────────────────────────────────────────

// ── Seeded PRNG — mulberry32 ──────────────────────────────────────────────
// Usage: var rng = mulberry32(seed); rng() returns float in [0,1).
// When seed is 0 / falsy, falls back to Math.random() — preserving normal rolls.
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Active RNG — replaced by seeded PRNG during seeded generation, restored after.
var _rng = Math.random.bind(Math);

// ── Random utilities ──────────────────────────────────────────────────────
function pick(arr) {
  if (!arr || arr.length === 0) return '';
  return arr[Math.floor(_rng() * arr.length)];
}
function pickN(arr, n) {
  var copy = arr.slice(); var out = [];
  for (var i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(_rng() * copy.length), 1)[0]);
  }
  return out;
}
function rand(a, b) { return Math.floor(_rng() * (b - a + 1)) + a; }

// Variety Matrix engine: pick a random template, substitute {Var} tokens from v arrays
function fillTemplate(tblObj) {
  if (!tblObj) return '';
  if (!tblObj.t) return Array.isArray(tblObj) ? pick(tblObj) : '';
  var tmpl = pick(tblObj.t);
  if (!tmpl) return '';
  return tmpl.replace(/\{(\w+)\}/g, function(match, key) {
    // TD-07: fall back to empty string, not raw key name, when token is missing
    if (!tblObj.v || !tblObj.v[key] || !tblObj.v[key].length) return '';
    return pick(tblObj.v[key]);
  });
}

// ════════════════════════════════════════════════════════════════════════
// GENERATOR FUNCTIONS
// ════════════════════════════════════════════════════════════════════════

function generateMinorNPC(t) {
  var name = pick(t.names_first) + ' ' + pick(t.names_last);
  // NA-58: capitalise first character — Variety Matrix components are lowercase by design
  var aspect1 = fillTemplate(t.minor_concepts);
  aspect1 = aspect1.charAt(0).toUpperCase() + aspect1.slice(1);
  var hasWeak = _rng() > 0.4;
  var weak = hasWeak ? pick(t.minor_weaknesses) : null;
  if (weak) weak = weak.charAt(0).toUpperCase() + weak.slice(1);
  var aspects = weak ? [aspect1, weak] : [aspect1];
  var numSkills = rand(1, 2);
  var chosenSkills = pickN(ALL_SKILLS, numSkills);
  var rating = rand(2, 3);
  var skills = chosenSkills.map(function(s, i) { return {name: s, r: Math.max(1, rating - i)}; });
  var hasStunt = _rng() > 0.5;
  var bonusStunts = (t.stunts || []).filter(function(s) { return s.type === 'bonus'; });
  var stunt = hasStunt && bonusStunts.length > 0 ? pick(bonusStunts) : null;
  var stress = rand(1, 3);
  return {name: name, aspects: aspects, skills: skills, stunt: stunt, stress: stress};
}

// Fate Condensed stress box calculation from skill rating (p.12)
// +0: 3 boxes, +1/+2: 4 boxes, +3/+4: 6 boxes.
// Note: FCon p.12 also grants Superb(+5)+ a second mild consequence slot,
// but we never generate skills above +4 so that path is not implemented.
// FCon p.35: default 3 boxes. Physique/Will 1–2 → 4 boxes. Physique/Will 3+ → 5 boxes. Cap: 5.
function stressFromRating(r) {
  if (r >= 3) return 5;
  if (r >= 1) return 4;
  return 3;
}

function generateMajorNPC(t) {
  var name = pick(t.names_first) + ' ' + pick(t.names_last);
  var high_concept = fillTemplate(t.major_concepts);
  var trouble = pick(t.troubles || t.major_trouble); // major_trouble is legacy alias
  // NA-57: generate others[], retrying fills to avoid duplicates
  var others = [];
  var othersSeen = {};
  var maxTries = 20;
  while (others.length < 3 && maxTries-- > 0) {
    var candidate = fillTemplate(t.other_aspects);
    var key = candidate.toLowerCase().trim();
    if (!othersSeen[key]) {
      othersSeen[key] = true;
      others.push(candidate);
    }
  }
  var peak = rand(3, 4);
  var chosen = pickN(ALL_SKILLS, 6);
  // Proper pyramid: 1 at peak, 2 at peak-1, 3 at peak-2
  var skills = [
    {name: chosen[0], r: peak},
    {name: chosen[1], r: peak - 1}, {name: chosen[2], r: peak - 1},
    {name: chosen[3], r: peak - 2}, {name: chosen[4], r: peak - 2}, {name: chosen[5], r: peak - 2},
  ].filter(function(s) { return s.r > 0; });
  var stunts = pickN(t.stunts || [], 2);
  // Calculate stress from assigned Physique/Will ratings (default +0 if not assigned)
  var physR = 0, willR = 0;
  skills.forEach(function(s) {
    if (s.name === 'Physique') physR = s.r;
    if (s.name === 'Will') willR = s.r;
  });
  return {
    name: name,
    aspects: {high_concept: high_concept, trouble: trouble, others: others},
    skills: skills, stunts: stunts,
    physical_stress: stressFromRating(physR), mental_stress: stressFromRating(willR),
    // FCon p.10: 3 free stunt slots. Each stunt beyond 3 costs 1 Refresh. Minimum 1.
    refresh: Math.max(1, 3 - Math.max(0, stunts.length - 3)),
  };
}

function generateScene(t) {
  // WS-10: sensory tag weights per category
  // [sight, sound, smell, touch, taste] — weights sum to 10, bias toward most evocative sense per category
  var SENSE_WEIGHTS = {
    tone:     ['smell','sound','smell','touch','sound','sight','smell','sound','touch','smell'],
    movement: ['sound','sight','touch','sound','sight','sound','sight','touch','sound','sight'],
    cover:    ['sight','sight','touch','sight','smell','sight','touch','sight','sound','sight'],
    danger:   ['sound','sight','smell','touch','sound','sight','smell','sound','sight','sound'],
    usable:   ['touch','sight','touch','sight','touch','touch','smell','touch','sight','touch'],
  };
  var cats = ['scene_tone', 'scene_movement', 'scene_cover', 'scene_danger', 'scene_usable'];
  var chosen = pickN(cats, rand(3, 5));
  var aspects = chosen.map(function(cat) {
    if (!t[cat]) return null;
    var catKey = cat.replace('scene_', '');
    var weights = SENSE_WEIGHTS[catKey] || SENSE_WEIGHTS.tone;
    var sense = weights[Math.floor(_rng() * weights.length)];
    var aspectName = fillTemplate(t[cat]);
    aspectName = aspectName.charAt(0).toUpperCase() + aspectName.slice(1);
    if (!aspectName || aspectName === 'Undefined') return null;
    return {name: aspectName, category: catKey, sense: sense, free_invoke: _rng() > 0.6};
  }).filter(Boolean);
  var zones = pickN(t.zones || [], rand(2, 4)).map(function(z) {
    return {name: z[0], aspect: z[1], description: z[2]};
  });
  // Scene framing questions - injected via mergeUniversal when toggle is on
  var framing = t.scene_framing_questions || [];
  return {aspects: aspects, zones: zones, framing_questions: framing};
}

function generateCampaign(t) {
  return {current: pick(t.current_issues), impending: pick(t.impending_issues), setting: [fillTemplate(t.setting_aspects), fillTemplate(t.setting_aspects), fillTemplate(t.setting_aspects)]};
}

function generateEncounter(t, partySize) {
  // Pick 3-4 from all 5 scene aspect categories for tactical variety
  var allCats = ['scene_tone', 'scene_movement', 'scene_cover', 'scene_danger', 'scene_usable'];
  var chosenCats = pickN(allCats, rand(3, 4));
  var aspects = chosenCats.map(function(cat) { return fillTemplate(t[cat]); });
  var zones = pickN(t.zones || [], rand(2, 3)).map(function(z) { return {name: z[0], aspect: z[1]}; });
  var minors = (t.opposition || []).filter(function(o) { return o.type === 'minor'; });
  var majors = (t.opposition || []).filter(function(o) { return o.type === 'major'; });
  // NA-60: pick minor without replacement to prevent duplicate names in one encounter
  var usedMinorNames = {};
  function pickUniqueMinor() {
    var shuffled = minors.slice().sort(function() { return _rng() - 0.5; });
    for (var i = 0; i < shuffled.length; i++) {
      if (!usedMinorNames[shuffled[i].name]) {
        usedMinorNames[shuffled[i].name] = true;
        return shuffled[i];
      }
    }
    return pick(minors); // fallback if pool exhausted
  }
  var opp = [pickUniqueMinor()];
  if (_rng() > 0.4 && majors.length) opp.push(pick(majors));
  opp = opp.filter(Boolean);
  return {
    aspects: aspects, zones: zones, opposition: opp,
    twist: pick(t.twists), victory: pick(t.victory), defeat: pick(t.defeat),
    gm_fate_points: partySize,
  };
}

function generateSeed(t) {
  var location     = pick(t.seed_locations);
  var objective    = pick(t.seed_objectives);
  var complication = pick(t.seed_complications);
  var issueRaw     = pick(t.current_issues);
  var issue        = issueRaw && typeof issueRaw === 'object'
                     ? issueRaw.name + (issueRaw.desc ? ' - ' + issueRaw.desc : '')
                     : String(issueRaw);
  var setting_asp  = fillTemplate(t.setting_aspects);
  var victory      = pick(t.victory);
  var defeat       = pick(t.defeat);
  var twist        = pick(t.twists);

  // Opposition - same logic as encounter
  var minors = (t.opposition || []).filter(function(o) { return o.type === 'minor'; });
  var majors = (t.opposition || []).filter(function(o) { return o.type === 'major'; });
  var opp = [pick(minors)];
  if (_rng() > 0.4 && majors.length) opp.push(pick(majors));
  opp = opp.filter(Boolean); // guard: pick([]) returns ''

  // Three scene sketch - constructed from generated elements
  var scenes = [
    {
      num: 1, type: 'OPENING',
      brief: 'The party reaches ' + location + '. The objective is clear: ' + objective + '. ' +
             'The setting aspect in play: “' + setting_asp + '”.',
    },
    {
      num: 2, type: 'COMPLICATIONS',
      brief: complication + '. The campaign issue - ' + issue + ' - surfaces here. ' +
             'This is the point to introduce the opposition and the first major roll.',
    },
    {
      num: 3, type: 'CLIMAX',
      brief: 'Full confrontation. Everything is on the table. ' +
             'Victory requires: ' + victory + '. ' +
             'Failure means: ' + defeat + '.',
    },
  ];

  return {
    location: location, objective: objective, complication: complication,
    issue: issue, setting_asp: setting_asp,
    opposition: opp, scenes: scenes,
    twist: twist,
    victory: victory, defeat: defeat,
  };
}

function generateCompel(t) {
  var situation   = pick(t.compel_situations);
  var consequence = pick(t.compel_consequences);
  // Compel framing templates - injected via mergeUniversal when toggle is on
  var isEvent = _rng() > 0.5;
  var templates = isEvent ? (t.compel_event_templates || []) : (t.compel_decision_templates || []);
  var template = templates.length > 0 ? pick(templates) : null;
  return {
    situation: situation, consequence: consequence,
    template_type: isEvent ? 'event' : 'decision',
    template: template,
  };
}

function generateChallenge(t) {
  var ch = pick(t.challenge_types);
  if (!ch || typeof ch !== 'object') ch = {name:'Overcome', desc:'A difficult obstacle.', primary:'Appropriate skill', opposing:'Passive opposition', success:'Goal achieved.', failure:'Complication introduced.'};
  var stakes_good = pick(t.victory);
  var stakes_bad  = pick(t.defeat);
  return {
    name: ch.name, desc: ch.desc, primary: ch.primary,
    opposing: ch.opposing, success: ch.success, failure: ch.failure,
    stakes_good: stakes_good, stakes_bad: stakes_bad,
  };
}

function generateContest(t) {
  // Contest types and twists - injected via mergeUniversal when toggle is on
  var ct = pick(t.contest_types || [{name:"Generic Contest",desc:"Two sides compete.",side_a:"Side A",side_b:"Side B",skills_a:"Athletics",skills_b:"Athletics"}]);
  var twists = pickN(t.contest_twists || ["Something unexpected happens."], 3);
  // Use campaign scene data for flavour
  var aspect = fillTemplate(t.scene_tone);
  var stakes_good = pick(t.victory);
  var stakes_bad  = pick(t.defeat);
  // Victory track visual: first to 3
  var victories = 3;
  var track_a = Array.from({length: victories}).map(function() { return '☐'; }).join(' ');
  var track_b = track_a;
  return {
    contest_type: ct.name,
    desc: ct.desc,
    side_a: ct.side_a, side_b: ct.side_b,
    skills_a: ct.skills_a, skills_b: ct.skills_b,
    aspect: aspect,
    victories_needed: victories,
    track_a: track_a, track_b: track_b,
    twists: twists,
    stakes_good: stakes_good, stakes_bad: stakes_bad,
  };
}

// ════════════════════════════════════════════════════════════════════════
// UNIVERSAL DATA MERGE
// Concatenates setting-agnostic entries from UNIVERSAL into campaign tables.
// Called when the universal merge toggle is on (default).
// ════════════════════════════════════════════════════════════════════════

var UNIVERSAL_MERGE_KEYS = [
  'stunts',
  'consequence_mild', 'consequence_moderate', 'consequence_severe', 'consequence_contexts',
  'compel_situations', 'compel_consequences',
];

// Keys that exist ONLY in UNIVERSAL (not in campaign tables) - injected when toggle is on
var UNIVERSAL_INJECT_KEYS = [
  'contest_types', 'contest_twists',
  'scene_framing_questions',
  'compel_event_templates', 'compel_decision_templates',
  'hazards', 'blocks', 'distractions', 'countdowns', 'limitations', 'resistances',
];

// Merge universal tables into campaign tables (campaign values win on conflict).
function mergeUniversal(tables) {
  if (!tables) return {};
  var u = (typeof UNIVERSAL !== 'undefined') ? UNIVERSAL : {};
  if (!u) return tables;
  var merged = {};
  Object.keys(tables).forEach(function(key) { merged[key] = tables[key]; });
  // Concatenate shared keys
  UNIVERSAL_MERGE_KEYS.forEach(function(key) {
    if (u[key] && Array.isArray(u[key]) && merged[key] && Array.isArray(merged[key])) {
      merged[key] = merged[key].concat(u[key]);
    }
  });
  // Inject universal-only keys
  UNIVERSAL_INJECT_KEYS.forEach(function(key) {
    if (u[key]) merged[key] = u[key];
  });
  return merged;
}

// ════════════════════════════════════════════════════════════════════════
// TABLE PREFS: EXCLUDE / LOCK / CUSTOM ENTRIES
// ════════════════════════════════════════════════════════════════════════

var TABLE_META = {
  names_first:'First Names', names_last:'Last Names / Epithets',
  minor_weaknesses:'Minor NPC Weaknesses', troubles:'Troubles',
  scene_tone:'Scene Tone', scene_movement:'Scene Movement', scene_danger:'Scene Danger',
  scene_cover:'Scene Cover', scene_usable:'Scene Usable Elements',
  zones:'Zones', current_issues:'Current Issues', impending_issues:'Impending Issues',
  setting_aspects:'Setting Aspects', stunts:'Stunts',
  opposition:'Opposition', twists:'Encounter Twists',
  victory:'Victory Conditions', defeat:'Defeat Conditions',
  seed_locations:'Seed Locations', seed_objectives:'Seed Objectives',
  seed_complications:'Seed Complications',
  compel_situations:'Compel Situations', compel_consequences:'Compel Consequences',
  challenge_types:'Challenge Types',
  consequence_mild:'Mild Consequences', consequence_moderate:'Moderate Consequences',
  consequence_severe:'Severe Consequences', consequence_contexts:'Consequence Contexts',
  faction_name_prefix:'Faction Name Prefixes', faction_name_suffix:'Faction Name Suffixes',
  faction_goals:'Faction Goals', faction_methods:'Faction Methods',
  faction_weaknesses:'Faction Weaknesses', faction_face_roles:'Faction Face Roles',
  complication_types:'Complication Types',
  complication_aspects:'Complication Aspects', complication_arrivals:'Complication Arrivals',
  complication_env:'Environment Shifts',
  backstory_questions:'Backstory Questions', backstory_hooks:'Adventure Hooks',
  // Universal / Adversary Toolkit tables
  hazards:'Hazards', blocks:'Blocks', distractions:'Distractions',
  countdowns:'Countdowns', limitations:'Limitations', resistances:'Resistances',
  compel_event_templates:'Compel Event Templates', compel_decision_templates:'Compel Decision Templates',
  scene_framing_questions:'Scene Framing Questions',
  contest_types:'Contest Types', contest_twists:'Contest Twists',
};

var TABLE_GROUPS = [
  {label:'NPC',          keys:['names_first','names_last','minor_weaknesses','troubles','stunts']},
  {label:'Scene',        keys:['scene_tone','scene_movement','scene_cover','scene_danger','scene_usable','zones']},
  {label:'Campaign',     keys:['current_issues','impending_issues','setting_aspects']},
  {label:'Encounter',    keys:['opposition','twists','victory','defeat']},
  {label:'Seed',         keys:['seed_locations','seed_objectives','seed_complications']},
  {label:'Compel',       keys:['compel_situations','compel_consequences']},
  {label:'Challenge',    keys:['challenge_types']},
  {label:'Consequence',  keys:['consequence_mild','consequence_moderate','consequence_severe','consequence_contexts']},
  {label:'Faction',      keys:['faction_name_prefix','faction_name_suffix','faction_goals','faction_methods','faction_weaknesses','faction_face_roles']},
  {label:'Complication', keys:['complication_types','complication_aspects','complication_arrivals','complication_env']},
  {label:'Backstory',    keys:['backstory_questions','backstory_hooks']},
];

function entryLabel(entry) {
  if (typeof entry === 'string') return entry;
  if (Array.isArray(entry)) {
    return entry[0] + (entry[1] ? ' - ' + entry[1] : '') + (entry[2] ? ' · ' + entry[2] : '');
  }
  if (entry && typeof entry === 'object') {
    if (entry.name && entry.bond)  return entry.name + ': ' + entry.bond;
    if (entry.bond)                return entry.bond;
    if (entry.name && entry.skill && entry.desc) return entry.name + ' [' + entry.skill + '] - ' + entry.desc;
    if (entry.name && entry.desc)  return entry.name + ': ' + entry.desc;
    if (entry.name)                return entry.name;
    if (entry.primary)             return (entry.name || '') + ' - ' + entry.primary;
  }
  return String(entry).slice(0, 100);
}

// Build effective tables applying user prefs.
// prefs = { excluded:{key:[idx,...]}, locked:{key:[idx,...]}, custom:{key:['str',...]} }
// - locked: ONLY those entries roll (+ custom strings)
// - excluded: removed from pool
// - custom: appended (string tables only)
// Apply user table preferences (excluded, locked, custom) to a table set.
function filteredTables(t, prefs) {
  if (!prefs) return t;
  var excl   = prefs.excluded || {};
  var locked = prefs.locked   || {};
  var custom = prefs.custom   || {};
  if (!Object.keys(excl).length && !Object.keys(locked).length && !Object.keys(custom).length) return t;
  var result = {};
  Object.keys(t).forEach(function(key) {
    var entries = t[key];
    if (!Array.isArray(entries)) { result[key] = entries; return; }
    var exclArr = excl[key]   || [];
    var lockArr = locked[key] || [];
    var custArr = custom[key] || [];
    var isStr   = entries.length > 0 && typeof entries[0] === 'string';
    if (lockArr.length > 0) {
      var pool = lockArr.map(function(i) { return entries[i]; }).filter(Boolean);
      if (isStr) pool = pool.concat(custArr);
      result[key] = pool.length > 0 ? pool : entries;
      return;
    }
    var filtered = entries.filter(function(_, i) { return exclArr.indexOf(i) === -1; });
    if (isStr && custArr.length > 0) filtered = filtered.concat(custArr);
    result[key] = filtered.length > 0 ? filtered : entries;
  });
  return result;
}

// Main dispatch — returns a result object for the given generator ID.
function generate(genId, t, partySize, opts, seed) {
  // If a seed is provided, swap in the seeded PRNG for this call then restore
  var prevRng = _rng;
  if (seed !== undefined && seed !== null) {
    _rng = mulberry32(seed >>> 0);
  }
  var result = _generate(genId, t, partySize, opts);
  _rng = prevRng;
  return result;
}
function _generate(genId, t, partySize, opts) {
  switch (genId) {
    case 'npc_minor':    return generateMinorNPC(t);
    case 'npc_major':    return generateMajorNPC(t);
    case 'scene':        return generateScene(t);
    case 'campaign':     return generateCampaign(t);
    case 'encounter':    return generateEncounter(t, partySize);
    case 'seed':         return generateSeed(t);
    case 'compel':       return generateCompel(t);
    case 'challenge':    return generateChallenge(t);
    case 'contest':      return generateContest(t);
    case 'consequence':  return generateConsequence(t, opts);
    case 'faction':      return generateFaction(t);
    case 'complication': return generateComplication(t);
    case 'backstory':    return generateBackstory(t);
    case 'obstacle':     return generateObstacle(t);
    case 'countdown':    return generateCountdown(t);
    case 'constraint':   return generateConstraint(t);
    default: return {};
  }
}

// ════════════════════════════════════════════════════════════════════════
// ADDITIONAL GENERATORS
// ════════════════════════════════════════════════════════════════════════

function generateConsequence(t, opts) {
  var o = opts || {};
  // F4: severity can be forced via opts.severity ('mild','moderate','severe') or random
  var severity = o.severity || pick(['mild', 'mild', 'moderate', 'severe']);
  var aspect = pick(t['consequence_' + severity]);
  var context = pick(t.consequence_contexts);
  var compel_hook = pick(t.compel_situations);
  return {
    severity: severity,
    aspect: aspect,
    context: context,
    compel_hook: compel_hook,
  };
}

function generateFaction(t) {
  var name = pick(t.faction_name_prefix) + ' ' + pick(t.faction_name_suffix);
  var goal = pick(t.faction_goals);
  var method = pick(t.faction_methods);
  var weakness = pick(t.faction_weaknesses);
  var face_role = pick(t.faction_face_roles);
  var face_name = pick(t.names_first) + ' ' + pick(t.names_last);
  return {
    name: name,
    goal: goal,
    method: method,
    weakness: weakness,
    face: { name: face_name, role: face_role },
  };
}

function generateComplication(t) {
  var type = pick(t.complication_types);
  var new_aspect = pick(t.complication_aspects);
  var arrival = pick(t.complication_arrivals);
  var env = pick(t.complication_env);
  // pick which of the three to spotlight
  var spotlight = pick(['aspect','arrival','env']);
  return {
    type: type,
    new_aspect: new_aspect,
    arrival: arrival,
    env: env,
    spotlight: spotlight,
  };
}

function generateBackstory(t) {
  if (!t.backstory_questions || !t.backstory_questions.length) return {questions: [], hooks: []};
  // Pick 3 distinct questions
  var pool = t.backstory_questions.slice();
  var q1 = pool.splice(Math.floor(_rng() * pool.length), 1)[0];
  var q2 = pool.splice(Math.floor(_rng() * pool.length), 1)[0];
  var q3 = pool.splice(Math.floor(_rng() * pool.length), 1)[0];
  var hook = pick(t.backstory_hooks);
  var relationship = t.backstory_relationship;
  return {
    questions: [q1, q2, q3],
    relationship: relationship,
    hook: hook,
  };
}

// ════════════════════════════════════════════════════════════════════════
// UNIVERSAL GENERATORS (data injected via mergeUniversal when toggle is on)
// ════════════════════════════════════════════════════════════════════════

function generateObstacle(t) {
  var obstacleType = pick(['hazard', 'hazard', 'block', 'block', 'distraction']);
  if (obstacleType === 'hazard') {
    var h = pick(t.hazards || [{name:"Generic Hazard", rating:3, weapon:2, aspect:"Dangerous", disable:"Overcome at +5"}]);
    return {
      obstacle_type: 'hazard',
      name: h.name,
      rating: h.rating,
      rating_label: SKILL_LABEL[h.rating] || ('+' + h.rating),
      weapon: h.weapon,
      aspect: h.aspect,
      disable: h.disable,
      gm_note: 'Hazards act in initiative. They attack or create advantages. They cannot be attacked - only overcome or disabled.',
    };
  } else if (obstacleType === 'block') {
    var b = pick(t.blocks || [{name:"Generic Block", rating:3, weapon:0, aspect:"In the Way", disable:"Overcome at +5"}]);
    return {
      obstacle_type: 'block',
      name: b.name,
      rating: b.rating,
      rating_label: SKILL_LABEL[b.rating] || ('+' + b.rating),
      weapon: b.weapon,
      aspect: b.aspect,
      disable: b.disable,
      gm_note: 'Blocks don\'t act in initiative. They provide passive opposition = their rating. Disable difficulty = rating + 2.',
    };
  } else {
    var d = pick(t.distractions || [{name:"Generic Distraction", choice:"Handle it or ignore it?", repercussion_leave:"Bad things happen.", repercussion_deal:"You lose time.", opposition:3}]);
    return {
      obstacle_type: 'distraction',
      name: d.name,
      choice: d.choice,
      repercussion_leave: d.repercussion_leave,
      repercussion_deal: d.repercussion_deal,
      opposition: d.opposition,
      opposition_label: SKILL_LABEL[d.opposition] || ('+' + d.opposition),
      gm_note: 'Distractions force choices. Both options have consequences. The drama is in the decision.',
    };
  }
}

function generateCountdown(t) {
  var cd = pick(t.countdowns || [{name:"Generic Countdown", boxes:4, unit:"exchanges", trigger:"One box per exchange", outcome:"Something bad happens"}]);
  var track = '';
  for (var i = 0; i < cd.boxes; i++) track += '☐ ';
  return {
    name: cd.name,
    boxes: cd.boxes,
    track: track.trim(),
    unit: cd.unit,
    trigger: cd.trigger,
    outcome: cd.outcome,
    gm_note: 'Place the track where players can see it. Check boxes visibly. When the last box fills, the outcome fires - no negotiation.',
  };
}

function generateConstraint(t) {
  var constraintType = pick(['limitation', 'resistance']);
  if (constraintType === 'limitation') {
    var lim = pick(t.limitations || [{name:"Generic Limitation", restricted_action:"A specific action", consequence:"Something bad happens if you do it anyway"}]);
    return {
      constraint_type: 'limitation',
      name: lim.name,
      restricted_action: lim.restricted_action,
      consequence: lim.consequence,
      gm_note: 'Limitations don\'t forbid actions - they impose consequences. Players should always be free to act; the question is whether the cost is worth it.',
    };
  } else {
    var res = pick(t.resistances || [{name:"Generic Resistance", what_resists:"All standard attacks", bypass:"Find the weakness"}]);
    return {
      constraint_type: 'resistance',
      name: res.name,
      what_resists: res.what_resists,
      bypass: res.bypass,
      gm_note: 'Resistances force Plan B. The party discovers the resistance, researches the bypass, and then executes the plan. A good resistance drives most of a session.',
    };
  }
}

// ════════════════════════════════════════════════════════════════════════
// MARKDOWN EXPORT
// ════════════════════════════════════════════════════════════════════════

// Serialise a result to a Markdown string for clipboard/export.
function toMarkdown(genId, data, campName) {
  if (!genId || !data) return '';
  var boxes = function(n) { return Array.from({length: n || 0}).map(function() { return '☐'; }).join(' '); };
  switch (genId) {
    case 'npc_minor': {
      var d = data;
      return [
        '# Minor NPC - ' + d.name,
        '> *' + campName + '*\n',
        '## Aspects',
      ].concat(d.aspects.map(function(a, i) {
        return '- *' + a + '*' + (i === 0 ? ' - **High Concept**' : i === 1 ? ' - **Weakness**' : '');
      })).concat([
        '\n## Skills',
      ]).concat(d.skills.map(function(s) {
        return '- **+' + s.r + ' ' + (SKILL_LABEL[s.r] || '') + '** ' + s.name;
      })).concat([
        d.stunt ? '\n## Stunt\n**' + d.stunt.name + '** *(' + d.stunt.skill + ')* - `' + (d.stunt.type === 'special' ? 'ONCE/SCENE' : '+2 BONUS') + '`  \n' + d.stunt.desc : '',
        '\n## Stress\n' + boxes(d.stress),
        '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
      ]).filter(function(l) { return l !== ''; }).join('\n');
    }
    case 'npc_major': {
      var d = data;
      return [
        '# Major NPC - ' + d.name,
        '> *' + campName + '*\n',
        '## Aspects',
        '- **High Concept:** *' + d.aspects.high_concept + '*',
        '- **Trouble:** *' + d.aspects.trouble + '*',
      ].concat(d.aspects.others.map(function(a) { return '- *' + a + '*'; })).concat([
        '\n## Skills',
      ]).concat(d.skills.map(function(s) {
        return '- **+' + s.r + ' ' + (SKILL_LABEL[s.r] || '') + '** ' + s.name;
      })).concat(['\n## Stunts']).concat(d.stunts.map(function(s) {
        return '### ' + s.name + '\n**Skill:** ' + s.skill + ' · `' + (s.type === 'special' ? 'ONCE/SCENE' : '+2 BONUS') + '`  \n' + s.desc;
      })).concat([
        '\n## Stress & Consequences',
        '**Physical:** ' + boxes(d.physical_stress) + '  ',
        '**Mental:** ' + boxes(d.mental_stress) + '\n',
        '| Consequence | Shift Value |',
        '|-------------|-------------|',
        '| Mild        | −2          |',
        '| Moderate    | −4          |',
        '| Severe      | −6          |\n',
        '**Refresh:** ' + d.refresh,
        '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
      ]).join('\n');
    }
    case 'scene': {
      var d = data;
      var catEmoji = {tone:'🎭', movement:'🏃', cover:'🛡', danger:'⚠️', usable:'⚙️'};
      var lines = [
        '# Scene Setup',
        '> *' + campName + '*\n',
        '## Situation Aspects',
      ].concat(d.aspects.map(function(a) {
        return '- ' + (catEmoji[a.category] || '◈') + ' *' + a.name + '* - **' + a.category.toUpperCase() + '**' + (a.free_invoke ? ' 🎲 **FREE INVOKE**' : '');
      })).concat(['\n## Zones']).concat(d.zones.map(function(z) {
        return '### ' + z.name + (z.aspect ? ' - *' + z.aspect + '*' : '') + '\n' + (z.description || '');
      }));
      if (d.framing_questions && d.framing_questions.length > 0) {
        lines.push('\n## Scene Framing Questions');
        d.framing_questions.forEach(function(q) { lines.push('- ' + q); });
      }
      lines.push('\n> **GM Note:** Mark 1–2 situation aspects with a free invoke to reward creative play.');
      lines.push('\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*');
      return lines.join('\n');
    }
    case 'campaign': {
      var d = data;
      function issueSection(iss, label) {
        if (!iss) return '## ' + label + '\n*No data available*';
        var lines = ['## ' + label, '### ' + iss.name, iss.desc, ''];
        if (iss.faces && iss.faces.length) {
          lines.push('**Faces:** ' + iss.faces.map(function(f) { return f.name + ' *(' + f.role + ')*'; }).join(' · '));
        }
        if (iss.places && iss.places.length) {
          lines.push('**Places:** ' + iss.places.join(', '));
        }
        return lines.filter(function(l) { return l !== null && l !== undefined; }).join('\n');
      }
      var setting = d.setting||[];
      return [
        '# Campaign Frame',
        '> *' + campName + '*\n',
        issueSection(d.current, '\u26A1 Current Issue - happening NOW'), '',
        issueSection(d.impending, '\uD83C\uDF11 Impending Issue - brewing on the horizon'),
        '\n## Setting Aspects',
      ].concat(setting.map(function(a) { return '- *' + a + '*'; })).concat([
        '\n> **GM Note:** Current issues create immediate compel pressure. Impending issues become current if ignored.',
        '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
      ]).join('\n');
    }
    case 'encounter': {
      var d = data;
      var oppLines = [];
      d.opposition.forEach(function(o) {
        oppLines.push('### ' + o.name + (o.qty > 1 ? ' ×' + o.qty : '') + ' `' + o.type.toUpperCase() + '`');
        o.aspects.forEach(function(a) { oppLines.push('*' + a + '*'); });
        oppLines.push('**Skills:** ' + o.skills.map(function(s) { return '+' + s.r + ' ' + s.name; }).join(', '));
        if (o.stunt) oppLines.push('**Stunt:** ' + o.stunt);
        oppLines.push('**Stress:** ' + boxes(o.stress));
        oppLines.push('');
      });
      return [
        '# Encounter', '> *' + campName + '*\n',
        '## Situation Aspects',
      ].concat(d.aspects.map(function(a) { return '- *' + a + '*'; })).concat([
        '\n## Zones',
      ]).concat(d.zones.map(function(z) {
        return '- **' + z.name + '**' + (z.aspect ? ' - *' + z.aspect + '*' : '');
      })).concat(['\n## Opposition']).concat(oppLines).concat([
        '## GM Fate Points',
        '●'.repeat(d.gm_fate_points) + ' *(= number of PCs)*\n',
        '## Stakes',
        '| | Condition |',
        '|--|-----------|',
        '| **Victory** | ' + d.victory + ' |',
        '| **Defeat** | ' + d.defeat + ' |',
        '| **Twist** | *' + d.twist + '* |',
        '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
      ]).join('\n');
    }
    case 'seed': {
      var d = data;
      var sceneLines = d.scenes.map(function(s) {
        return '### Scene ' + s.num + ' - ' + s.type + '\n' + s.brief;
      }).join('\n\n');
      var oppLines = d.opposition.map(function(o) {
        return '- **' + o.name + '** (' + (o.type === 'major' ? 'Major NPC' : 'Mook') + (o.qty > 1 ? ' ×' + o.qty : '') + ') - *' + o.aspects.join(', ') + '*'
          + '\n  Skills: ' + o.skills.map(function(s) { return '+' + s.r + ' ' + s.name; }).join(', ')
          + ' · Stress: ' + o.stress;
      }).join('\n');
      return [
        '# Adventure Seed', '> *' + campName + '*\n',
        '## Premise',
        '**Location:** ' + d.location,
        '**Objective:** ' + d.objective,
        '**Complication:** ' + d.complication,
        '\n## Three Scene Sketch',
        sceneLines,
        '\n## Opposition',
        oppLines,
        '\n## Stakes',
        '| | Condition |',
        '|--|-----------|',
        '| **Victory** | ' + d.victory + ' |',
        '| **Defeat** | ' + d.defeat + ' |',
        '| **Twist** | *' + d.twist + '* |',
        '\n## Campaign Anchor',
        '**Setting Aspect:** *' + d.setting_asp + '*',
        '**Active Issue:** ' + d.issue,
        '\n> Prep Scene 1 in full. Scenes 2 and 3 are targets - follow the players. State victory/defeat before the first roll.',
        '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
      ].join('\n\n');
    }
    case 'compel': {
      var d = data;
      var lines = [
        '# Compel Offer', '> *' + campName + '*\n',
        '## Situation', d.situation,
        '## If Accepted', d.consequence,
      ];
      if (d.template) {
        lines.push('\n## Framing Template (' + (d.template_type === 'event' ? 'Event' : 'Decision') + ')');
        lines.push('> ' + d.template);
      }
      lines.push('\n## GM Note');
      lines.push('> Offer the fate point **before** stating the consequence. If the player pays 1 fp to refuse, accept it - that is the system working correctly.');
      lines.push('\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*');
      return lines.join('\n\n');
    }
    case 'challenge': {
      var d = data;
      return [
        '# Challenge: ' + d.name, '> *' + campName + '*\n',
        d.desc,
        '| | |',
        '|--|--|',
        '| **Primary Skill(s)** | ' + d.primary + ' |',
        '| **Opposing Force** | ' + d.opposing + ' |',
        '| **Success** | ' + d.success + ' |',
        '| **Failure** | ' + d.failure + ' |',
        '\n## Campaign Stakes',
        '| | |',
        '|--|--|',
        '| **If They Win** | ' + d.stakes_good + ' |',
        '| **If They Lose** | ' + d.stakes_bad + ' |',
        '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
      ].join('\n');
    }
    case 'contest': {
      var d = data;
      return [
        '# Contest: ' + d.contest_type, '> *' + campName + '*\n',
        d.desc,
        '\n## Situation Aspect',
        '*' + d.aspect + '*',
        '\n## Sides',
        '| Side | Skills |',
        '|------|--------|',
        '| **' + d.side_a + '** | ' + d.skills_a + ' |',
        '| **' + d.side_b + '** | ' + d.skills_b + ' |',
        '\n## Victory Track (first to ' + d.victories_needed + ')',
        '**' + d.side_a + ':** ' + d.track_a,
        '**' + d.side_b + ':** ' + d.track_b,
        '\n## Twists (on tied exchanges)',
        d.twists.map(function(tw, i) { return (i + 1) + '. ' + tw; }).join('\n'),
        '\n## Stakes',
        '| | Outcome |',
        '|--|---------|',
        '| **' + d.side_a + ' wins** | ' + d.stakes_good + ' |',
        '| **' + d.side_b + ' wins** | ' + d.stakes_bad + ' |',
        '\n> **Rules:** Each exchange, one overcome per side. Highest effort marks a victory; succeed with style (2+ shifts, no one else did) = 2 victories. First to ' + (d.victories_needed || 3) + ' wins. On a tie, neither side marks a victory — GM introduces a new situation aspect (FCon p.33).',
        '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
      ].join('\n');
    }
    case 'consequence': {
      var d = data;
      var sev = d.severity.charAt(0).toUpperCase() + d.severity.slice(1);
      return [
        '# ' + sev + ' Consequence', '> *' + campName + '*\n',
        '**Aspect:** *' + d.aspect + '*',
        '**Context:** ' + d.context,
        '\n## Compel Hook',
        d.compel_hook,
        '\n## Fate Condensed Rules',
        '- Write the consequence as an aspect on the character sheet',
        '- Recovery requires a successful overcome roll first: Academics (physical) or Empathy (mental). Difficulty +2 if self-treating.',
        '- Mild: overcome at Fair (+2), then clears after the next scene',
        '- Moderate: overcome at Great (+4), then clears after a full session',
        '- Severe: overcome at Fantastic (+6), then clears after a breakthrough (FCon p.39)',
        '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
      ].join('\n\n');
    }
    case 'faction': {
      var d = data;
      return [
        '# Faction: ' + d.name, '> *' + campName + '*\n',
        '**Goal:** ' + d.goal,
        '**Method:** ' + d.method,
        '**Weakness:** ' + d.weakness,
        '\n## Named Face',
        '**' + d.face.name + '** - ' + d.face.role,
        '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
      ].join('\n\n');
    }
    case 'complication': {
      var d = data;
      return [
        '# Complication: ' + d.type, '> *' + campName + '*\n',
        '**New Aspect:** *' + d.new_aspect + '*',
        '**Arrival:** ' + d.arrival,
        '**Environment Shift:** ' + d.env,
        '\n## GM Tip',
        'Introduce the spotlighted element first. If players Create Advantage against it they earn a free invoke - reward proactive play.',
        '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
      ].join('\n\n');
    }
    case 'backstory': {
      var d = data;
      return [
        '# PC Backstory Prompts', '> *' + campName + '*\n',
        '## Questions',
        d.questions.map(function(q,i){ return (i+1) + '. ' + q; }).join('\n'),
        '\n## Relationship Web',
        d.relationship,
        '\n## Opening Hook',
        d.hook,
        '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
      ].join('\n\n');
    }
    case 'obstacle': {
      var d = data;
      if (d.obstacle_type === 'hazard') {
        return [
          '# Hazard: ' + d.name, '> *' + campName + ' · Universal*\n',
          '**Type:** Hazard (attacks PCs - cannot be attacked)',
          '**Aspect:** *' + d.aspect + '*',
          '**Rating:** ' + d.rating_label + ' (+' + d.rating + ') · **Weapon:** ' + d.weapon,
          '\n## How to Disable',
          d.disable,
          '\n## GM Note',
          '> ' + d.gm_note,
          '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
        ].join('\n\n');
      } else if (d.obstacle_type === 'block') {
        return [
          '# Block: ' + d.name, '> *' + campName + ' · Universal*\n',
          '**Type:** Block (prevents actions - passive opposition)',
          '**Aspect:** *' + d.aspect + '*',
          '**Rating:** ' + d.rating_label + ' (+' + d.rating + ')' + (d.weapon > 0 ? ' · **Weapon:** ' + d.weapon : ''),
          '**Disable Difficulty:** +' + (d.rating + 2),
          '\n## How to Disable',
          d.disable,
          '\n## GM Note',
          '> ' + d.gm_note,
          '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
        ].join('\n\n');
      } else {
        return [
          '# Distraction: ' + d.name, '> *' + campName + ' · Universal*\n',
          '**Type:** Distraction (forces a choice)',
          '\n## The Choice',
          d.choice,
          '\n## Repercussions',
          '| Decision | Consequence |',
          '|----------|-------------|',
          '| **Leave it** | ' + d.repercussion_leave + ' |',
          '| **Deal with it** | ' + d.repercussion_deal + ' |',
          '\n**Opposition (if rolled):** ' + d.opposition_label + ' (+' + d.opposition + ')',
          '\n## GM Note',
          '> ' + d.gm_note,
          '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
        ].join('\n\n');
      }
    }
    case 'countdown': {
      var d = data;
      return [
        '# Countdown: ' + d.name, '> *' + campName + ' · Universal*\n',
        '## Track',
        '`' + d.track + '` (' + d.boxes + ' boxes · measured in ' + d.unit + ')',
        '\n## Trigger',
        d.trigger,
        '\n## When the Clock Hits Zero',
        d.outcome,
        '\n## GM Note',
        '> ' + d.gm_note,
        '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
      ].join('\n\n');
    }
    case 'constraint': {
      var d = data;
      if (d.constraint_type === 'limitation') {
        return [
          '# Limitation: ' + d.name, '> *' + campName + ' · Universal*\n',
          '**Type:** Limitation (restricts an action with consequences)',
          '\n## Restricted Action',
          d.restricted_action,
          '\n## Consequence If Taken Anyway',
          d.consequence,
          '\n## GM Note',
          '> ' + d.gm_note,
          '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
        ].join('\n\n');
      } else {
        return [
          '# Resistance: ' + d.name, '> *' + campName + ' · Universal*\n',
          '**Type:** Resistance (makes target immune until bypassed)',
          '\n## What It Resists',
          d.what_resists,
          '\n## How to Bypass',
          d.bypass,
          '\n## GM Note',
          '> ' + d.gm_note,
          '\n---\n*Generated by Ogma - On-demand Generator for Masterful Adventures*',
        ].join('\n\n');
      }
    }
    default: return '';
  }
}

// ════════════════════════════════════════════════════════════════════════
// ══ FARI JSON EXPORT — PARKED 2026.03 ══════════════════════════════════════
// Parked: 2026.03.154. Replaced by Ogma-native JSON (toOgmaJSON/toBatchOgmaJSON).
// Fari import/export revisit date: see BACKLOG.md parking lot.
// Code preserved below for future restoration.
// ════════════════════════════════════════════════════════════════════════════
/* FARI_PARKED_START */
// FARI JSON EXPORT  (BL-33a) — Fari App .fari.json v4 compliant
// Spec: FariEntity envelope → ICharacter → IPage → ISection → IBlock
// Block types: Text, Numeric, Skill, PointCounter, SlotTracker, Separator
// Only NPC generators produce character exports; all others return null.
// ════════════════════════════════════════════════════════════════════════

function _fariId() {
  // UUID v4 format — crypto.randomUUID where available, fallback for Node/old browsers
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ── Block factories ─────────────────────────────────────────────────────

function _fariTextBlock(label, value, helpText) {
  return {
    id: _fariId(), type: 'Text', label: label,
    value: value || '', helpText: helpText || '',
    meta: { hasToggle: false, isToggled: false }
  };
}

function _fariNumericBlock(label, value, helpText) {
  return {
    id: _fariId(), type: 'Numeric', label: label,
    value: String(value), helpText: helpText || '',
    meta: { hasToggle: false, isToggled: false }
  };
}

function _fariSkillBlock(label, value, helpText) {
  return {
    id: _fariId(), type: 'Skill', label: label,
    value: String(value), helpText: helpText || '',
    meta: { commands: ['4dF'], hideModifier: false, hasToggle: false, isToggled: false }
  };
}

function _fariPointCounter(label, current, max, isMain, helpText) {
  return {
    id: _fariId(), type: 'PointCounter', label: label,
    value: String(current), helpText: helpText || '',
    meta: { isMainCounter: !!isMain, hasMax: max != null, max: max != null ? max : undefined }
  };
}

function _fariSlotTracker(label, boxCount, helpText) {
  var boxes = [];
  for (var i = 0; i < boxCount; i++) {
    boxes.push({ label: '', checked: false });
  }
  return {
    id: _fariId(), type: 'SlotTracker', label: label,
    value: '', helpText: helpText || '',
    meta: { boxes: boxes }
  };
}

// ── Section factory ─────────────────────────────────────────────────────

function _fariSection(label, blocks, visibleOnCard) {
  return {
    id: _fariId(), label: label,
    visibleOnCard: !!visibleOnCard,
    blocks: blocks || []
  };
}

// ── Page factory (left/right column layout) ──────────────────────────────

function _fariPage(label, leftSections, rightSections) {
  return {
    id: _fariId(), label: label,
    sections: {
      left: leftSections || [],
      right: rightSections || []
    }
  };
}

// ── Envelope factory ────────────────────────────────────────────────────

function _fariEnvelope(character) {
  return {
    fariType: 'character',
    version: 4,
    entity: character
  };
}

function _fariCharacter(name, group, pages) {
  return {
    id: _fariId(),
    name: name || '',
    group: group || '',
    lastUpdated: Date.now(),
    playedAt: null,
    version: 4,
    wide: false,
    notes: '',
    pages: pages || []
  };
}

// ════════════════════════════════════════════════════════════════════════
// toFariJSON — single NPC export
// ════════════════════════════════════════════════════════════════════════

function toFariJSON(genId, data, campName) {
  if (!data) return '';
  if (genId !== 'npc_minor' && genId !== 'npc_major') return null;
  var d = data;
  var camp = campName || 'Fate Condensed';

  if (genId === 'npc_minor') {
    // ── Aspects (left, visible on card) ──
    var aspectBlocks = [
      _fariTextBlock('High Concept', d.aspects[0] || '', 'Core identity of this NPC.')
    ];
    if (d.aspects[1]) {
      aspectBlocks.push(_fariTextBlock('Trouble', d.aspects[1], 'Weakness — GM compel target.'));
    }

    // ── Skills (right) ──
    var skillBlocks = d.skills.map(function(s) {
      return _fariSkillBlock(s.name, s.r);
    });

    // ── Stress (right, visible on card) ──
    var stressBlocks = [
      _fariSlotTracker('Stress', d.stress, 'Mark boxes to absorb shifts. Cleared at end of conflict.')
    ];

    // ── Stunt (right) ──
    if (d.stunt) {
      stressBlocks.push(_fariTextBlock(
        d.stunt.name + ' (' + d.stunt.skill + ')',
        d.stunt.desc
      ));
    }

    var page = _fariPage('Character',
      [_fariSection('Aspects', aspectBlocks, true)],
      [
        _fariSection('Skills', skillBlocks, false),
        _fariSection('Stress', stressBlocks, true)
      ]
    );

    // ── GM Notes page ──
    var notesPage = _fariPage('GM Notes',
      [_fariSection('Notes', [
        _fariTextBlock('Campaign', camp),
        _fariTextBlock('GM Note', 'Minor NPC — no consequence slots, no fate points. One good hit takes them out. Weakness aspect is your primary compel lever.'),
      ], false)],
      []
    );

    var character = _fariCharacter(d.name, camp, [page, notesPage]);
    return JSON.stringify(_fariEnvelope(character), null, 2);
  }

  // ═══ MAJOR NPC ═══════════════════════════════════════════════════════

  // ── Aspects (left, visible on card) ──
  var aspectBlocks = [
    _fariTextBlock('High Concept', d.aspects.high_concept, 'Core identity.'),
    _fariTextBlock('Trouble', d.aspects.trouble, 'What gets them in trouble. Compel target.')
  ];
  d.aspects.others.forEach(function(a, i) {
    aspectBlocks.push(_fariTextBlock('Aspect ' + (i + 3), a));
  });

  // ── Stunts (left) ──
  var stuntBlocks = d.stunts.map(function(s) {
    var typeLabel = s.type === 'special' ? '[ONCE/SCENE]' : '[+2 BONUS]';
    return _fariTextBlock(s.name + ' · ' + s.skill + ' ' + typeLabel, s.desc);
  });

  // ── Vitals (right, visible on card) ──
  var vitalsBlocks = [
    _fariPointCounter('Fate Points', d.refresh, d.refresh, true,
      'Spend for bonuses; earn when compels are accepted.'),
    _fariNumericBlock('Refresh', d.refresh,
      'Fate Points received at start of each session (minimum 1).')
  ];

  // ── Skills (right) ──
  var skillBlocks = d.skills.map(function(s) {
    return _fariSkillBlock(s.name, s.r);
  });

  // ── Stress (right, visible on card) ──
  var stressBlocks = [
    _fariSlotTracker('Physical Stress', d.physical_stress,
      'Absorbs physical hits. Cleared at end of conflict.'),
    _fariSlotTracker('Mental Stress', d.mental_stress,
      'Absorbs mental hits. Cleared at end of conflict.')
  ];

  // ── Consequences (right, visible on card) ──
  var conseqBlocks = [
    _fariTextBlock('Mild (2)', '', 'Absorbs 2 shifts. Clears after one scene of recovery.'),
    _fariTextBlock('Moderate (4)', '', 'Absorbs 4 shifts. Requires full scene + recovery roll.'),
    _fariTextBlock('Severe (6)', '', 'Absorbs 6 shifts. Significant, long-lasting change.')
  ];

  var charPage = _fariPage('Character',
    [
      _fariSection('Aspects', aspectBlocks, true),
      _fariSection('Stunts', stuntBlocks, false)
    ],
    [
      _fariSection('Vitals', vitalsBlocks, true),
      _fariSection('Skills', skillBlocks, false)
    ]
  );

  var stressPage = _fariPage('Stress & Consequences',
    [_fariSection('Stress', stressBlocks, true)],
    [_fariSection('Consequences', conseqBlocks, true)]
  );

  var notesPage = _fariPage('GM Notes',
    [_fariSection('Notes', [
      _fariTextBlock('Campaign', camp),
      _fariTextBlock('GM Note',
        'Refresh: ' + d.refresh + '. GM fate point pool = 1 per PC (shared across all NPCs, FCon p.44). Can concede — let them escape dramatically for future scenes.'),
    ], false)],
    []
  );

  var character = _fariCharacter(d.name, camp, [charPage, stressPage, notesPage]);
  return JSON.stringify(_fariEnvelope(character), null, 2);
}

// ════════════════════════════════════════════════════════════════════════
// toBatchFariJSON — export all pinned cards as Fari characters
// NPCs become individual characters; non-NPC content becomes a
// "Session Notes" character with Text blocks.
// ════════════════════════════════════════════════════════════════════════

function toBatchFariJSON(pinnedCards, campName) {
  if (!pinnedCards || !pinnedCards.length) return null;
  var camp = campName || 'Fate Session';
  var results = [];
  var noteBlocks = [];

  pinnedCards.forEach(function(card) {
    var genId = card.genId;
    var data  = card.data;
    if (!data) return;

    if (genId === 'npc_minor' || genId === 'npc_major') {
      var json = toFariJSON(genId, data, camp);
      if (json) {
        try {
          var parsed = JSON.parse(json);
          results.push(parsed.entity);
        } catch(e) {}
      }
    } else {
      var md = toMarkdown(genId, data, camp);
      var label = data.name || data.title || data.type || genId;
      noteBlocks.push(_fariTextBlock(label, md || ''));
    }
  });

  // Bundle non-NPC content into a "Session Notes" character
  if (noteBlocks.length > 0) {
    var notesPage = _fariPage('Session Notes',
      [_fariSection('Generated Content', noteBlocks, false)],
      []
    );
    var notesChar = _fariCharacter(camp + ' — Session Notes', camp, [notesPage]);
    results.push(notesChar);
  }

  if (results.length === 0) return null;

  // Wrap each character in the Fari envelope
  var envelopes = results.map(function(c) {
    return _fariEnvelope(c);
  });

  // Return as JSON array (Fari handles single or batch)
  return JSON.stringify(envelopes.length === 1 ? envelopes[0] : envelopes, null, 2);
}
/* FARI_PARKED_END */


// ════════════════════════════════════════════════════════════════════════
// OGMA JSON EXPORT / IMPORT — native Ogma format
// Single:  {format,version,generator,campaign,campId,ts,data}
// Batch:   {format,version,campaign,campId,ts,results:[{generator,label,data,ts},...]}
// Import:  parseOgmaJSON(str) → {type:'single'|'batch', ...} or null
// ════════════════════════════════════════════════════════════════════════

var OGMA_FORMAT  = 'ogma';
var OGMA_VERSION = '1';

function toOgmaJSON(genId, data, campName, campId) {
  if (!genId || !data) return '';
  return JSON.stringify({
    format:    OGMA_FORMAT,
    version:   OGMA_VERSION,
    generator: genId,
    campaign:  campName  || '',
    campId:    campId    || '',
    ts:        Date.now(),
    data:      data,
  }, null, 2);
}

function toBatchOgmaJSON(pinnedCards, campName, campId) {
  if (!pinnedCards || !pinnedCards.length) return null;
  var results = pinnedCards.map(function(card) {
    return {
      generator: card.genId,
      label:     card.label || card.genId,
      data:      card.data,
      ts:        card.ts || Date.now(),
    };
  });
  return JSON.stringify({
    format:   OGMA_FORMAT,
    version:  OGMA_VERSION,
    campaign: campName || '',
    campId:   campId   || '',
    ts:       Date.now(),
    results:  results,
  }, null, 2);
}

function parseOgmaJSON(str) {
  if (!str) return null;
  try {
    var obj = JSON.parse(str);
    // Validate envelope
    if (!obj || obj.format !== OGMA_FORMAT) return null;
    // Single result
    if (obj.generator && obj.data && typeof obj.data === 'object') {
      return { type: 'single', generator: obj.generator, data: obj.data,
               campaign: obj.campaign || '', campId: obj.campId || '', ts: obj.ts };
    }
    // Batch result
    if (Array.isArray(obj.results) && obj.results.length > 0) {
      var valid = obj.results.filter(function(r) {
        return r && r.generator && r.data && typeof r.data === 'object';
      });
      if (!valid.length) return null;
      return { type: 'batch', results: valid,
               campaign: obj.campaign || '', campId: obj.campId || '', ts: obj.ts };
    }
    return null;
  } catch(e) { return null; }
}
