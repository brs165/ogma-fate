// ui-primitives.js — React aliases, TIMING, icons, theme, FD primitives
// Loaded first. Defines h, useState, useEffect, useRef, Fragment, FD components.
// core/ui.js
// React UI layer: primitive components, result renderers, modals,
// LandingApp, TableManagerModal, CampaignApp.
// Depends on core/engine.js (pick, pickN, fillTemplate, generate, toMarkdown, etc.)
// and data globals (CAMPAIGNS, GENERATORS, HELP_CONTENT, HELP_ENTRIES, UNIVERSAL).
// ─────────────────────────────────────────────────────────────────────────────

// ── React aliases ─────────────────────────────────────────────────────────
const h            = React.createElement;
const useState = React.useState;
const useCallback = React.useCallback;
const useEffect = React.useEffect;
const useRef = React.useRef;
const Fragment = React.Fragment;

// ── Icon map ─────────────────────────────────────────────────────────────
// Maps generator IDs and UI keys to emoji icons. Zero font dependencies.
// Usage: h(RaIcon, {n:'encounter'}) renders the mapped emoji icon
const RA_ICONS = {
  // ── Generators ────────────────────────────────────────────────────────────
  npc_minor:    '👤',
  npc_major:    '👑',
  scene:        '🔥',
  campaign:     '🏰',
  encounter:    '⚔',
  seed:         '🌱',
  compel:       '↩',
  challenge:    '🎯',
  contest:      '🏆',
  consequence:  '💔',
  faction:      '🏴',
  complication: '⚠',
  backstory:    '✒',
  obstacle:     '🛡',
  countdown:    '⏳',
  constraint:   '🔒',
  // ── UI chrome ─────────────────────────────────────────────────────────────
  pin:          '📌',
  gm_mode:      '👑',
  fp_tracker:   '💎',
  history:      '📜',
  play_intro:   '🕯',
  guide:        '📖',
  rules:        '❓',
  dnd_guide:    '⚔',
  home:         '🏠',
  customize:    '⚙',
  settings:     '⚙',
  theme_light:  '☀️',
  theme_dark:   '🌙',
  inspire:      '🔮',
  learn:        '💡',
  // ── Generator groups ──────────────────────────────────────────────────────
  characters:   '👤',
  scenes:       '🔥',
  pacing:       '⏳',
  world:        '🌍',
};

// RaIcon: renders an icon span. n = RA_ICONS key or direct emoji string.
function RaIcon(props) {
  const icon = RA_ICONS[props.n] || props.n || '';
  return h('span', {
    className: 'icon-emoji',
    'aria-hidden': 'true',
    style: {fontSize: props.size === '2x' ? '1.6em' : 'inherit', lineHeight: 1},
  }, icon);
}

// ── Inline SVG icons (FA-equivalent, offline-safe, no CDN) ─────────────────
// FaShareIcon — arrow-up-from-bracket (FA fa-arrow-up-from-bracket)
function FaShareIcon(props) {
  var sz = props.size || 14;
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512',
    width: sz, height: sz, fill: 'currentColor',
    'aria-hidden': 'true', style: {display:'inline-block',verticalAlign:'middle',flexShrink:0},
  },
    h('path', {d: 'M0 448c0 17.7 14.3 32 32 32l416 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32zm265-393c-9.4-9.4-24.6-9.4-33.9 0l-128 128c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l87-87L184 360c0 13.3 10.7 24 24 24s24-10.7 24-24l0-231 87 87c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L265 55z'})
  );
}

// FaCartPlusIcon — cart-plus (FA fa-cart-plus)
function FaCartPlusIcon(props) {
  var sz = props.size || 14;
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 576 512',
    width: sz, height: sz, fill: 'currentColor',
    'aria-hidden': 'true', style: {display:'inline-block',verticalAlign:'middle',flexShrink:0},
  },
    h('path', {d: 'M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM384 128l0-32c0-13.3 10.7-24 24-24s24 10.7 24 24l0 32 32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0 0 32c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-32-32 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l32 0z'})
  );
}

// ── UI timing constants ────────────────────────────────────────────────────
const TIMING = {
  COPY_CONFIRM_MS:  2200,  // "Copied!" badge display duration
  TOAST_MS:         2500,  // Toast notification auto-dismiss
  INTRO_REPLAY_MS:  150,   // Delay before replaying intro (let sidebar close first)
};

// ── Theme init (runs immediately, before React render) ───────────────────
(function initTheme() {
  var saved = LS.get('theme');
  if (!saved) {
    // Respect system appearance on first load (HIG requirement)
    saved = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', saved);
})();

function applyTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  LS.set('theme', mode);
}
function getTheme() {
  var saved = LS.get('theme');
  if (saved) return saved;
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}

function getTextSize() {
  try { return LS.get('textsize') || 0; } catch(e) { return 0; }
}
function applyTextSize(n) {
  try { LS.set('textsize', n); } catch(e) {}
  if (n === 0) { document.documentElement.removeAttribute('data-textsize'); }
  else         { document.documentElement.setAttribute('data-textsize', String(n)); }
}
// Apply saved text size immediately on script load (prevents flash)
(function() { var ts = getTextSize(); if (ts > 0) applyTextSize(ts); })();

// ════════════════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS (all use CSS classes from theme.css)
// ════════════════════════════════════════════════════════════════════════

// ── Field Dossier card primitives ─────────────────────────────────────
function FDCard(props) { return h('div', {className: 'fd-card' + (props.className ? ' ' + props.className : '')}, props.children); }
function FDId(props) {
  // NPC names type themselves character-by-character on first render
  var isNpc = props.type === 'Minor NPC' || props.type === 'Major NPC';
  const [typed, setTyped] = useState(isNpc ? '' : props.name);
  const [typeDone, setTypeDone] = useState(!isNpc);

  useEffect(function() {
    if (!isNpc || !props.name) return;
    var i = 0; var full = props.name;
    var iv = setInterval(function() {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) { clearInterval(iv); setTypeDone(true); }
    }, 48);
    return function() { clearInterval(iv); };
  }, [props.name]);

  return h('div', {className: 'fd-id'},
    h('div', {className: 'fd-name'},
      isNpc ? typed : props.name,
      isNpc && !typeDone && h('span', {className: 'npc-name-cursor', 'aria-hidden': 'true'})
    ),
    props.type && h('span', {className: 'fd-pill fd-pill-type'}, props.type),
    props.refresh != null && h('span', {className: 'fd-pill fd-pill-ref'}, 'Refresh ' + props.refresh),
    props.extra
  );
}
function FDHdr(props) { return h('div', {className: 'fd-hdr', title: props.tip || null}, props.children); }
function FDSect(props) { return h('div', {className: 'fd-sect'}, props.children); }
function FDGm(props) { return h('div', {className: 'fd-gm'}, h('b', null, 'GM: '), props.text); }
function FDTwist(props) { return h('div', {className: 'fd-twist'}, props.text); }
// ── ASPECT QUALITY HEURISTIC ─────────────────────────────────────────────
// Returns {tier:'strong'|'ok'|'weak', reason:string} based on FCon SRD guidance.
// Tests: bidirectionality proxy (can-invoke + can-compel signals), word count,
// evocativeness (proper nouns, action verbs), stat-smell (bare adjectives).
// Deliberately lightweight — not AI, not a judgment, just a nudge.
function scoreAspect(text) {
  if (!text || text.length < 3) return null; // don't score blanks
  var t = text.trim();
  var words = t.split(/\s+/).filter(function(w){return w.length>0;});
  if (words.length < 2) return {tier:'weak', reason:'Too short — aspects need at least 2 words to be invokable and compellable'};

  // Stat smell: single bare adjective or bare noun (e.g. "Strong", "Fighter", "Smart")
  if (words.length === 1) return {tier:'weak', reason:'Single-word aspects read as stats, not story — try adding a qualifier or context'};

  // Bare adjective pairs without nouns are still weak ("Very Strong", "Really Fast")
  var QUALIFIERS = /^(very|really|quite|extremely|incredibly|super|somewhat|fairly|pretty|rather|highly)$/i;
  if (words.length === 2 && QUALIFIERS.test(words[0])) {
    return {tier:'weak', reason:'Adjective pairs without a noun or context tend to work only one way — add what makes it specific'};
  }

  // Positive signals — things that suggest bidirectionality
  var score = 0;
  // Proper noun signal (capitalised word not at sentence start)
  var hasProperNoun = words.slice(1).some(function(w){ return /^[A-Z][a-z]/.test(w); });
  if (hasProperNoun) score += 2;
  // Relationship / tension words
  var TENSION = /\b(but|yet|never|always|despite|until|haunted|bound|sworn|owes|debt|secret|afraid|would rather|can't|won't|last|only|former|once|used to|still|no longer)\b/i;
  if (TENSION.test(t)) score += 2;
  // Action or state with object
  if (words.length >= 3) score += 1;
  if (words.length >= 4) score += 1;
  // Possession/relationship structure ("X of Y", "X's Y", "My X")
  if (/\b(of|'s|my|her|his|their|our)\b/i.test(t)) score += 1;

  // Negative signals — stat smell: only penalise when aspect is just an adjective (no noun context)
  var STAT_WORDS = /^(strong|fast|smart|tough|quick|skilled|powerful|dangerous|deadly|clever|brave|wise|agile|stealthy|charismatic|lucky|sneaky|aggressive|protective|loyal|cunning|ruthless|fearless)$/i;
  var allBareStats = words.every(function(w){ return STAT_WORDS.test(w) || QUALIFIERS.test(w); });
  if (allBareStats) score -= 3;

  if (score >= 3) return {tier:'strong', reason:'Has specific detail, tension, or relationship — invokable and compellable'};
  if (score >= 1) return {tier:'ok',     reason:'Workable — consider adding tension or a proper noun to sharpen it'};
  return          {tier:'weak',          reason:'May only work one way — test it: can you invoke it for +2? Can it cause a complication?'};
}

function FDAsp(props) {
  var quality = props.showQuality && props.text ? scoreAspect(props.text) : null;
  return h('div', {className: 'fd-asp'},
    props.label && h('span', {className: 'fd-asp-lbl', title: props.tip || null}, props.label),
    h('span', {className: props.hc ? 'fd-hc' : props.tr ? 'fd-tr' : ''}, props.text),
    quality && h('span', {
      className: 'fd-asp-quality fd-aq-' + quality.tier,
      title: quality.reason,
      'aria-label': quality.tier + ': ' + quality.reason,
    }, quality.tier === 'strong' ? '◆' : quality.tier === 'ok' ? '◇' : '△'),
    props.badge && h('span', {className: 'fd-badge ' + props.badge}, props.badgeLabel || props.badge)
  );
}
function FDSkill(props) {
  return h('div', {className: 'fd-sk'},
    h('span', {className: 'fd-skr'}, '+' + props.r),
    h('span', {className: 'fd-skn'}, props.name),
    h('span', {className: 'fd-skl'}, SKILL_LABEL[props.r] || '')
  );
}
function FDStunt(props) {
  const s = props.stunt;
  // UX-11: annotate +2 in stunt descriptions with a contextual tooltip
  const desc = s.desc || '';
  const hasBonus = desc.includes('+2');
  return h('div', {className: 'fd-st'},
    h('span', {className: 'fd-stn'}, s.name + ': '),
    h('span', {className: 'fd-std'}, desc),
    hasBonus && h('span', {
      className: 'fd-stunt-tip',
      title: '+2 on the Fate ladder means roughly 25% better chance of success — the difference between Fair (+2) and Good (+3) difficulty.',
      'aria-label': '+2 explanation',
    }, '?')
  );
}
function FDZone(props) {
  return h('div', {className: 'fd-zone'},
    h('div', {className: 'fd-zn'}, props.name),
    props.aspect && h('div', {className: 'fd-za'}, props.aspect),
    props.desc && h('div', {className: 'fd-zd'}, props.desc)
  );
}
function FDInfoBox(props) {
  const col = props.color || 'var(--accent)';
  return h('div', {className: 'fd-infobox', title: props.tip || null, style: {borderColor: col + '44', backgroundColor: col + '11'}},
    h('div', {className: 'fd-infobox-label', style: {color: col}}, props.label),
    h('div', {className: 'fd-infobox-text'}, props.text)
  );
}
function FDCon(props) {
  return h('div', {className: 'fd-con'},
    h('span', {className: 'fd-con-num', title: props.tip || null}, props.shifts),
    h('span', {className: 'fd-con-sev'}, props.sev),
    h('span', {className: 'fd-con-slot'})
  );
}
function FDStressTrack(props) {
  const [hits, setHits] = useState(0);
  const n = props.n || 0;
  const takenOut = hits >= n && n > 0;
  // Animation driven by CSS .taken-out class — no JS timer needed
  function mark(i) {
    const next = hits === i + 1 ? i : i + 1;
    setHits(next);
    const toNow = next >= n && n > 0;
    if (props.onUpdate) props.onUpdate({label: props.label || 'Stress', hits: next, total: n, takenOut: toNow});
    if (toNow && navigator.vibrate) navigator.vibrate([40, 60, 80]);
  }
  return h('div', {className: 'fd-str' + (takenOut ? ' taken-out' : '')},
    h('span', {className: 'fd-strl'}, props.label || 'Stress'),
    Array.from({length: n}, function(_, i) {
      let marked = i < hits;
      return h('div', {
        key: i, className: 'fd-box' + (marked ? ' on' : ''),
        onClick: function() { mark(i); },
        role: 'checkbox', 'aria-checked': String(marked),
        'aria-label': (props.label||'Stress')+' box '+(i+1), tabIndex: 0,
        title: marked ? 'Click to clear' : 'Click to mark',
      }, marked ? '✕' : '1');
    }),
    takenOut && h('span', {className: 'fd-taken-out-label'}, '⚔ TAKEN OUT')
  );
}

// ════════════════════════════════════════════════════════════════════════
