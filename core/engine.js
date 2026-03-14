// core/engine.js
// Pure logic layer: utilities, all generate* functions, table prefs, markdown export.
// No React. No DOM references. Safe to unit-test in Node (with global mocks for
// CAMPAIGNS, UNIVERSAL, ALL_SKILLS, SKILL_LABEL).
// Depends on globals from: data/shared.js, data/universal.js, data/[campaign].js
// Must be loaded before core/ui.js.
// ─────────────────────────────────────────────────────────────────────────────

// ── Random utilities ──────────────────────────────────────────────────────
function pick(arr) {
  if (!arr || arr.length === 0) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickN(arr, n) {
  var copy = arr.slice(); var out = [];
  for (var i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}
function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

// Variety Matrix engine: pick a random template, substitute {Var} tokens from v arrays
function fillTemplate(tblObj) {
  if (!tblObj || !tblObj.t) return pick(Array.isArray(tblObj) ? tblObj : [String(tblObj)]);
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
  var aspect1 = fillTemplate(t.minor_concepts);
  var hasWeak = Math.random() > 0.4;
  var aspects = hasWeak ? [aspect1, pick(t.minor_weaknesses)] : [aspect1];
  var numSkills = rand(1, 2);
  var chosenSkills = pickN(ALL_SKILLS, numSkills);
  var rating = rand(2, 3);
  var skills = chosenSkills.map(function(s, i) { return {name: s, r: Math.max(1, rating - i)}; });
  var hasStunt = Math.random() > 0.5;
  var bonusStunts = t.stunts.filter(function(s) { return s.type === 'bonus'; });
  var stunt = hasStunt && bonusStunts.length > 0 ? pick(bonusStunts) : null;
  var stress = rand(1, 3);
  return {name: name, aspects: aspects, skills: skills, stunt: stunt, stress: stress};
}

// Fate Condensed stress box calculation from skill rating (p.12)
// +0: 3 boxes, +1/+2: 4 boxes, +3+: 6 boxes. No extra consequence slots (that is Fate Core, not Condensed).
function stressFromRating(r) {
  if (r >= 3) return 6;
  if (r >= 1) return 4;
  return 3;
}

function generateMajorNPC(t) {
  var name = pick(t.names_first) + ' ' + pick(t.names_last);
  var high_concept = fillTemplate(t.major_concepts);
  var trouble = pick(t.troubles);
  var others = [fillTemplate(t.other_aspects), fillTemplate(t.other_aspects), fillTemplate(t.other_aspects)];
  var peak = rand(3, 4);
  var chosen = pickN(ALL_SKILLS, 6);
  // Proper pyramid: 1 at peak, 2 at peak-1, 3 at peak-2
  var skills = [
    {name: chosen[0], r: peak},
    {name: chosen[1], r: peak - 1}, {name: chosen[2], r: peak - 1},
    {name: chosen[3], r: peak - 2}, {name: chosen[4], r: peak - 2}, {name: chosen[5], r: peak - 2},
  ].filter(function(s) { return s.r > 0; });
  var stunts = pickN(t.stunts, 2);
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
    // FCon p.22: each stunt costs 1 refresh. Default refresh is 3, minimum 1.
    refresh: Math.max(1, 3 - stunts.length),
  };
}

function generateScene(t) {
  var cats = ['scene_tone', 'scene_movement', 'scene_cover', 'scene_danger', 'scene_usable'];
  var chosen = pickN(cats, rand(3, 5));
  var aspects = chosen.map(function(cat) {
    // ~40% of aspects get a pre-placed free invoke marker - a GM prep convenience
    // suggesting this aspect has a discoverable free invoke. In play, free invokes
    // are earned through Create Advantage actions (Condensed p.19).
    return {name: fillTemplate(t[cat]), category: cat.replace('scene_', ''), free_invoke: Math.random() > 0.6};
  });
  var zones = pickN(t.zones, rand(2, 4)).map(function(z) {
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
  var zones = pickN(t.zones, rand(2, 3)).map(function(z) { return {name: z[0], aspect: z[1]}; });
  var minors = t.opposition.filter(function(o) { return o.type === 'minor'; });
  var majors = t.opposition.filter(function(o) { return o.type === 'major'; });
  var opp = [pick(minors)];
  if (Math.random() > 0.4 && majors.length) opp.push(pick(majors));
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
  var minors = t.opposition.filter(function(o) { return o.type === 'minor'; });
  var majors = t.opposition.filter(function(o) { return o.type === 'major'; });
  var opp = [pick(minors)];
  if (Math.random() > 0.4 && majors.length) opp.push(pick(majors));

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
  var isEvent = Math.random() > 0.5;
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

function generate(genId, t, partySize, opts) {
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
  // Pick 3 distinct questions
  var pool = t.backstory_questions.slice();
  var q1 = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
  var q2 = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
  var q3 = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
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
        var lines = ['## ' + label, '### ' + iss.name, iss.desc, ''];
        if (iss.faces && iss.faces.length) {
          lines.push('**Faces:** ' + iss.faces.map(function(f) { return f.name + ' *(' + f.role + ')*'; }).join(' · '));
        }
        if (iss.places && iss.places.length) {
          lines.push('**Places:** ' + iss.places.join(', '));
        }
        return lines.filter(function(l) { return l !== null && l !== undefined; }).join('\n');
      }
      return [
        '# Campaign Issues',
        '> *' + campName + '*\n',
        issueSection(d.current, '⚡ Current Issue - happening NOW'), '',
        issueSection(d.impending, '🌑 Impending Issue - brewing on the horizon'),
        '\n## Setting Aspects',
      ].concat(d.setting.map(function(a) { return '- *' + a + '*'; })).concat([
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
        '\n> **Rules:** Each exchange, one overcome per side. Compare efforts - highest marks a victory. SWS = 2 victories. Tie = no victory + GM narrates an unexpected complication (FCon p.30).',
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
        '- Severe: overcome at Fantastic (+6), then clears after a major milestone (FCon p.39)',
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
        '# Scene Complication: ' + d.type, '> *' + campName + '*\n',
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
// FARI JSON EXPORT  (BL-33a)
// Generates a Fari App .fari.json character object.
// Also accepted by Foundry VTT "Fate Core Official" system importer.
// Only meaningful for npc_minor and npc_major - all other generators
// produce prep content (scenes, factions, etc.) that belong in notes,
// not character sheets.
// Fari schema: ICharacter { id, name, group, pages[], lastUpdated, version:4 }
//   page: { id, label, sections[] }
//   section: { id, label, blocks[], position:"left"|"right" }
//   block: { id, label, type, value, meta{} }
// Block types used: Text, Skill, SlotTracker, Number
// ════════════════════════════════════════════════════════════════════════

function _fariId() {
  // Simple random ID in Fari's expected format
  return Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
}

function _fariBlock(type, label, value, meta) {
  return { id: _fariId(), label: label, type: type, value: value, meta: meta || {}, commands: null };
}

function _fariSection(label, blocks, position) {
  return { id: _fariId(), label: label, blocks: blocks, position: position || 'left', visibleOnCard: false };
}

function _fariPage(label, sections) {
  return { id: _fariId(), label: label, sections: sections };
}

function toFariJSON(genId, data, campName) {
  if (!data) return '';
  var d = data;
  var camp = campName || 'Fate Condensed';
  var pages = [];

  if (genId === 'npc_minor') {
    // Page 1: Character
    var leftBlocks = [];
    // Aspects
    leftBlocks.push(_fariBlock('Text', 'High Concept', d.aspects[0] || ''));
    if (d.aspects[1]) leftBlocks.push(_fariBlock('Text', 'Weakness / Trouble', d.aspects[1]));
    // Skills
    var skillBlocks = d.skills.map(function(s) {
      return _fariBlock('Skill', s.name, s.r, { commands: ['4dF'] });
    });
    var rightBlocks = skillBlocks.slice();
    // Stress
    var stressBoxes = Array.from({ length: d.stress }, function() { return { checked: false, label: '' }; });
    rightBlocks.push(_fariBlock('SlotTracker', 'Stress', stressBoxes));
    // Stunt
    if (d.stunt) {
      rightBlocks.push(_fariBlock('Text', d.stunt.name + ' (' + d.stunt.skill + ')', d.stunt.desc));
    }
    pages.push(_fariPage('Character', [
      _fariSection('Aspects', leftBlocks, 'left'),
      _fariSection('Skills & Stress', rightBlocks, 'right'),
    ]));
    // Page 2: Notes (GM content, not shown in player view)
    pages.push(_fariPage('GM Notes', [
      _fariSection('Notes', [
        _fariBlock('Text', 'Campaign', camp),
        _fariBlock('Text', 'GM Note', 'Minor NPC - no consequence slots. One good hit takes them out. Weakness aspect is your primary compel lever.'),
      ], 'left'),
    ]));
  }

  else if (genId === 'npc_major') {
    // ── Page 1: Character ──
    // Aspects section (left)
    var aspectBlocks = [
      _fariBlock('Text', 'High Concept', d.aspects.high_concept),
      _fariBlock('Text', 'Trouble', d.aspects.trouble),
    ];
    d.aspects.others.forEach(function(a, i) {
      aspectBlocks.push(_fariBlock('Text', 'Aspect ' + (i + 3), a));
    });
    // Skills section (right)
    var skillBlocks = d.skills.map(function(s) {
      return _fariBlock('Skill', s.name, s.r, { commands: ['4dF'] });
    });
    // Stress + Consequences section (right, continued)
    var stressPhyBoxes = Array.from({ length: d.physical_stress }, function() { return { checked: false, label: '' }; });
    var stressMenBoxes = Array.from({ length: d.mental_stress }, function() { return { checked: false, label: '' }; });
    var stressBlocks = [
      _fariBlock('SlotTracker', 'Physical Stress', stressPhyBoxes),
      _fariBlock('SlotTracker', 'Mental Stress', stressMenBoxes),
      _fariBlock('Text', 'Mild Consequence (−2)', ''),
      _fariBlock('Text', 'Moderate Consequence (−4)', ''),
      _fariBlock('Text', 'Severe Consequence (−6)', ''),
      _fariBlock('Number', 'Refresh', d.refresh),
      _fariBlock('Number', 'Fate Points', d.refresh),
    ];
    pages.push(_fariPage('Character', [
      _fariSection('Aspects', aspectBlocks, 'left'),
      _fariSection('Skills', skillBlocks, 'right'),
    ]));
    // ── Page 2: Stress & Stunts ──
    var stuntBlocks = d.stunts.map(function(s) {
      var typeLabel = s.type === 'special' ? '[ONCE/SCENE]' : '[+2 BONUS]';
      return _fariBlock('Text', s.name + ' · ' + s.skill + ' ' + typeLabel, s.desc);
    });
    pages.push(_fariPage('Stress & Stunts', [
      _fariSection('Stress & Consequences', stressBlocks, 'left'),
      _fariSection('Stunts', stuntBlocks, 'right'),
    ]));
    // ── Page 3: GM Notes ──
    pages.push(_fariPage('GM Notes', [
      _fariSection('Notes', [
        _fariBlock('Text', 'Campaign', camp),
        _fariBlock('Text', 'GM Note', 'Starts each scene with Refresh (' + d.refresh + ') fate points. Can concede - let them escape dramatically for future scenes.'),
      ], 'left'),
    ]));
  }

  else {
    // Not a character generator - should not be called, but return null gracefully
    return null;
  }

  var character = {
    id: _fariId(),
    name: d.name,
    group: camp,
    lastUpdated: Date.now(),
    pages: pages,
    version: 4,
    playedDuringTurn: false,
    playerName: '',
    color: 'default',
  };

  // Fari wraps the character in a container with a type discriminator
  return JSON.stringify({ character: character }, null, 2);
}


// ════════════════════════════════════════════════════════════════════════
// ROLL20 JSON EXPORT  (BL-33b)
// Generates an attribute array for the "Fate by Evil Hat" sheet on Roll20.
// GM pastes this into the sheet's Developer Mode import box.
// Attribute key names verified against the Fate by Evil Hat sheet source
// (roll20-character-sheets/Fate%20Core%20v2) and community documentation.
// Repeating rows use Roll20 convention: repeating_<section>_<rowId>_<field>
// ════════════════════════════════════════════════════════════════════════

function _roll20Id() {
  // Roll20 row IDs are -<random alphanumeric 20 chars>
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var id = '-';
  for (var i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function toRoll20JSON(genId, data) {
  if (!data || (genId !== 'npc_minor' && genId !== 'npc_major')) return null;
  var d = data;
  var attribs = [];

  function attr(name, current, max) {
    attribs.push({ name: name, current: current !== undefined ? current : '', max: max !== undefined ? max : '' });
  }

  // ── Top-level fields ──
  attr('character_name', d.name);

  if (genId === 'npc_major') {
    attr('refresh', d.refresh);
    attr('fate_points', d.refresh);
    // Aspects - repeating section
    var aspectList = [
      { label: 'High Concept', value: d.aspects.high_concept },
      { label: 'Trouble', value: d.aspects.trouble },
    ];
    d.aspects.others.forEach(function(a, i) {
      aspectList.push({ label: 'Aspect ' + (i + 3), value: a });
    });
    aspectList.forEach(function(a) {
      var rowId = _roll20Id();
      attr('repeating_aspects_' + rowId + '_aspect-name', a.label);
      attr('repeating_aspects_' + rowId + '_aspect-value', a.value);
    });
    // Skills - repeating section, key format: skill-name / skill-value
    d.skills.forEach(function(s) {
      var rowId = _roll20Id();
      attr('repeating_skills_' + rowId + '_skill-name', s.name);
      attr('repeating_skills_' + rowId + '_skill-value', s.r);
    });
    // Stunts - repeating section
    d.stunts.forEach(function(s) {
      var rowId = _roll20Id();
      attr('repeating_stunts_' + rowId + '_stunt-name', s.name + ' (' + s.skill + ')');
      attr('repeating_stunts_' + rowId + '_stunt-description', s.desc);
      if (s.type !== 'special') {
        attr('repeating_stunts_' + rowId + '_stunt-skill', s.skill);
        attr('repeating_stunts_' + rowId + '_stunt-bonus', '2');
        attr('repeating_stunts_' + rowId + '_stunt-rollable', '1');
      }
    });
    // Stress tracks
    attr('physical_stress_count', d.physical_stress);
    attr('mental_stress_count', d.mental_stress);
    for (var i = 1; i <= d.physical_stress; i++) { attr('physical_' + i, '0', '1'); }
    for (var j = 1; j <= d.mental_stress; j++)   { attr('mental_'   + j, '0', '1'); }
    // Consequence slots - empty, ready to fill in play
    attr('MildPhyConsequence',    '');
    attr('MildMenConsequence',    '');
    attr('ModerateConsequence',   '');
    attr('SevereConsequence',     '');

  } else {
    // npc_minor - simpler
    attr('refresh', '1');
    attr('fate_points', '1');
    d.aspects.forEach(function(a, i) {
      var rowId = _roll20Id();
      attr('repeating_aspects_' + rowId + '_aspect-name', i === 0 ? 'High Concept' : 'Weakness');
      attr('repeating_aspects_' + rowId + '_aspect-value', a);
    });
    d.skills.forEach(function(s) {
      var rowId = _roll20Id();
      attr('repeating_skills_' + rowId + '_skill-name', s.name);
      attr('repeating_skills_' + rowId + '_skill-value', s.r);
    });
    if (d.stunt) {
      var rowId = _roll20Id();
      attr('repeating_stunts_' + rowId + '_stunt-name', d.stunt.name + ' (' + d.stunt.skill + ')');
      attr('repeating_stunts_' + rowId + '_stunt-description', d.stunt.desc);
    }
    attr('physical_stress_count', d.stress);
    for (var k = 1; k <= d.stress; k++) { attr('physical_' + k, '0', '1'); }
  }

  // Roll20 Developer Mode import format
  return JSON.stringify({ schema_version: 2, type: 'character', character: { name: d.name, bio: '', attribs: attribs, abilities: [] } }, null, 2);
}

// ════════════════════════════════════════════════════════════════════════
// BATCH FARI EXPORT  (BL-38)
// Converts all pinned session cards into a single .fari.json file.
// NPCs → individual Fari character objects (via toFariJSON)
// All other generators → one "Session Notes" character with Text blocks
// The file is importable via Fari App Characters → Import, and via
// Foundry VTT "Fate Core Official" character importer (paste JSON text).
// ════════════════════════════════════════════════════════════════════════

function toBatchFariJSON(pinnedCards, campName) {
  if (!pinnedCards || !pinnedCards.length) return null;
  var camp = campName || 'Fate Session';
  var characters = [];
  var noteBlocks = [];

  pinnedCards.forEach(function(card) {
    var genId = card.genId;
    var data  = card.data;
    if (!data) return;

    if (genId === 'npc_minor' || genId === 'npc_major') {
      // Full character export
      var json = toFariJSON(genId, data, camp);
      if (json) {
        try { characters.push(JSON.parse(json).character); } catch(e) {}
      }
    } else {
      // Non-actor content → Text block in Session Notes
      var md = toMarkdown(genId, data, camp);
      var label = card.label || genId;
      noteBlocks.push(_fariBlock('Text', label, md || ''));
    }
  });

  // If there are non-actor notes, bundle into one "Session Notes" character
  if (noteBlocks.length > 0) {
    var notesChar = {
      id: _fariId(),
      name: camp + ' - Session Notes',
      group: camp,
      lastUpdated: Date.now(),
      version: 4,
      playedDuringTurn: false,
      playerName: '',
      color: 'default',
      pages: [
        _fariPage('Session Notes', [
          _fariSection('Generated Content', noteBlocks, 'left'),
        ]),
      ],
    };
    characters.push(notesChar);
  }

  if (!characters.length) return null;

  // Fari batch export: array of character objects
  return JSON.stringify({ characters: characters }, null, 2);
}
