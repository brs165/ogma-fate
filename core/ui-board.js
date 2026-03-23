// ui-board.js — Ogma Board: spatial GM workspace
// Sprint 1: canvas + left panel + card generation + drag + IDB persistence
// Parallel to ui.js — zero overlap, zero shared state except pinnedCards IDB key
// Architecture: BoardApp > BoardCanvas + BoardLeftPanel + BoardTopbar

// h, useState, useEffect, useRef, useCallback, Fragment all declared in ui-primitives.js (loaded before this file)

// ── Constants ────────────────────────────────────────────────────────────────

var BOARD_CANVAS_PREP_KEY = 'board_canvas_v1';
var BOARD_CANVAS_PLAY_KEY = 'board_play_v1';
var BOARD_FP_KEY = 'board_fp_v1';
var BOARD_SYNC_HOST = (typeof OGMA_CONFIG !== 'undefined' ? OGMA_CONFIG.DEFAULT_SYNC_HOST : 'ogma-sync.brs165.workers.dev');

// Generator groups for left panel — matches screenshot order
var BOARD_GEN_GROUPS = [
  {
    id: 'characters', label: 'Characters',
    gens: [
      {id: 'npc_minor',   label: 'Minor NPC',            icon: '🧑'},
      {id: 'npc_major',   label: 'Major NPC',            icon: '👑'},
      {id: 'backstory',   label: 'PC Backstory',         icon: '🎭'},
    ]
  },
  {
    id: 'scenes', label: 'Scenes',
    gens: [
      {id: 'scene',       label: 'Scene Setup',          icon: '🔥'},
      {id: 'encounter',   label: 'Encounter',            icon: '⚔'},
      {id: 'complication',label: 'Complication',         icon: '⚠'},
    ]
  },
  {
    id: 'pacing', label: 'Pacing',
    gens: [
      {id: 'challenge',   label: 'Challenge',            icon: '🎯'},
      {id: 'contest',     label: 'Contest',              icon: '🏆'},
      {id: 'obstacle',    label: 'Obstacle',             icon: '🛡'},
      {id: 'countdown',   label: 'Countdown',            icon: '⏳'},
      {id: 'constraint',  label: 'Constraint',           icon: '🔒'},
    ]
  },
  {
    id: 'world', label: 'World',
    gens: [
      {id: 'campaign',    label: 'Campaign Frame',       icon: '🏰'},
      {id: 'seed',        label: 'Quick Adventure Start',icon: '🌿'},
      {id: 'faction',     label: 'Faction',              icon: '🚩'},
      {id: 'compel',      label: 'Compel',               icon: '↩'},
      {id: 'consequence', label: 'Consequence',          icon: '❤'},
    ]
  },
  {
    id: 'tools', label: 'Tools',
    gens: [
      {id: 'sticky',      label: 'Aspect Sticky',        icon: '📝'},
      {id: 'label',       label: 'Section Label',        icon: '🔖'},
    ]
  },
];

// Color map per generator type
var BOARD_TYPE_COLOR = {
  npc_minor:    {stripe: '#e8b83a', tc: '#b8860b', bg: '#fffbee', tagBg: '#fffbee', tagTc: '#9a6f00'},
  npc_major:    {stripe: '#e8793a', tc: '#c4581a', bg: '#fff3ee', tagBg: '#fff3ee', tagTc: '#c4581a'},
  backstory:    {stripe: '#4a90d9', tc: '#2a70b9', bg: '#eef4fd', tagBg: '#eef4fd', tagTc: '#1a5090'},
  scene:        {stripe: '#3aaa7a', tc: '#2a8a5a', bg: '#eefaf4', tagBg: '#eefaf4', tagTc: '#1a6a44'},
  encounter:    {stripe: '#d04a6a', tc: '#b03050', bg: '#fef0f3', tagBg: '#fef0f3', tagTc: '#902040'},
  complication: {stripe: '#d04a6a', tc: '#b03050', bg: '#fef0f3', tagBg: '#fef0f3', tagTc: '#902040'},
  challenge:    {stripe: '#4a90d9', tc: '#2a70b9', bg: '#eef4fd', tagBg: '#eef4fd', tagTc: '#1a5090'},
  contest:      {stripe: '#6a7dd4', tc: '#5a6db8', bg: '#f0f1fc', tagBg: '#f0f1fc', tagTc: '#4a5aa0'},
  obstacle:     {stripe: '#888',    tc: '#555',    bg: '#f5f4f1', tagBg: '#f5f4f1', tagTc: '#444'},
  countdown:    {stripe: '#e8793a', tc: '#c4581a', bg: '#fff3ee', tagBg: '#fff3ee', tagTc: '#c4581a'},
  constraint:   {stripe: '#888',    tc: '#555',    bg: '#f5f4f1', tagBg: '#f5f4f1', tagTc: '#444'},
  campaign:     {stripe: '#6a7dd4', tc: '#5a6db8', bg: '#f0f1fc', tagBg: '#f0f1fc', tagTc: '#4a5aa0'},
  seed:         {stripe: '#e8b83a', tc: '#b8860b', bg: '#fffbee', tagBg: '#fffbee', tagTc: '#9a6f00'},
  faction:      {stripe: '#6a7dd4', tc: '#5a6db8', bg: '#f0f1fc', tagBg: '#f0f1fc', tagTc: '#4a5aa0'},
  compel:       {stripe: '#3aaa7a', tc: '#2a8a5a', bg: '#eefaf4', tagBg: '#eefaf4', tagTc: '#1a6a44'},
  consequence:  {stripe: '#e8793a', tc: '#c4581a', bg: '#fff3ee', tagBg: '#fff3ee', tagTc: '#c4581a'},
};

var STICKY_COLORS = [
  {bg: '#fff9c4', text: '#5a4e00', label: '#8a7800'},
  {bg: '#d4f5e4', text: '#0d4d2a', label: '#0d6e3a'},
  {bg: '#fde8d8', text: '#6a2a00', label: '#b84a1a'},
  {bg: '#e8e4fc', text: '#2a2060', label: '#5a50b0'},
];

// ── Utilities ─────────────────────────────────────────────────────────────────

// Room code generator (4 chars, unambiguous alphabet)
function generateBoardRoomCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code = '';
  for (var i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}


function boardUid() {
  return 'b' + Date.now() + Math.random().toString(36).slice(2, 6);
}

function getWorldTables(campId) {
  if (typeof CAMPAIGNS !== 'undefined' && CAMPAIGNS[campId]) {
    return CAMPAIGNS[campId].tables || {};
  }
  return {};
}

function getWorldMeta(campId) {
  if (typeof CAMPAIGNS !== 'undefined' && CAMPAIGNS[campId]) {
    return CAMPAIGNS[campId].meta || {name: campId, icon: '◈'};
  }
  return {name: campId, icon: '◈'};
}

function extractCardTitle(genId, data) {
  if (!data) return genId;
  return data.name || data.location || data.situation || data.title ||
         (data.aspects && data.aspects.high_concept) || genId;
}

function extractCardSummary(genId, data) {
  if (!data) return '';
  var lines = [];
  if (genId === 'npc_minor' || genId === 'npc_major') {
    var hc = (data.aspects && data.aspects.high_concept) || '';
    var tr = (data.aspects && data.aspects.trouble) || '';
    if (hc) lines.push(hc);
    if (tr) lines.push('\u25BA ' + tr);
  } else if (genId === 'scene') {
    if (data.situation) lines.push(data.situation);
    if (data.threat) lines.push('Threat: ' + data.threat);
  } else if (genId === 'encounter') {
    if (data.opposition) lines.push(data.opposition);
    if (data.twist) lines.push('Twist: ' + data.twist);
  } else if (genId === 'seed') {
    if (data.hook) lines.push(data.hook);
    else if (data.premise) lines.push(data.premise);
  } else if (genId === 'compel') {
    if (data.situation) lines.push(data.situation);
  } else if (genId === 'consequence') {
    if (data.mild) lines.push('Mild: ' + data.mild);
    else if (data.moderate) lines.push('Moderate: ' + data.moderate);
  } else if (genId === 'faction') {
    if (data.goal) lines.push('Goal: ' + data.goal);
  } else if (genId === 'challenge') {
    if (data.obstacle) lines.push(data.obstacle);
  } else if (genId === 'campaign') {
    if (data.current_issue) lines.push(data.current_issue);
  } else if (genId === 'countdown') {
    if (data.track_name) lines.push(data.track_name);
    if (data.trigger) lines.push('Trigger: ' + data.trigger);
  } else {
    var keys = ['description', 'text', 'body', 'summary'];
    for (var k = 0; k < keys.length; k++) {
      if (data[keys[k]]) { lines.push(data[keys[k]]); break; }
    }
  }
  return lines.slice(0, 2).join('\n');
}

function extractCardTags(genId, data) {
  var tags = [];
  if (!data) return tags;
  if (genId === 'npc_minor' || genId === 'npc_major') {
    var skills = data.skills || [];
    skills.slice(0, 2).forEach(function(s) {
      tags.push('+' + s.r + ' ' + s.name);
    });
  } else if (genId === 'scene') {
    if (data.zone) tags.push(data.zone);
  } else if (genId === 'challenge' || genId === 'contest') {
    if (data.skills_needed) tags.push(data.skills_needed.slice(0, 2).join(' · '));
  } else if (genId === 'countdown') {
    if (typeof data.boxes === 'number') tags.push(data.boxes + ' Boxes');
  } else if (genId === 'consequence') {
    if (data.moderate) tags.push('Moderate');
    else if (data.severe) tags.push('Severe');
    else if (data.mild) tags.push('Mild');
  }
  return tags;
}


// ── BoardLabel — section header on canvas ────────────────────────────────────────

function BoardLabel(props) {
  var card = props.card;
  var onDelete = props.onDelete;
  var onUpdate = props.onUpdate;
  var onDragStart = props.onDragStart;
  var _ed = useState(false); var editing = _ed[0]; var setEditing = _ed[1];
  var _dr = useState(card.text || 'Section'); var draft = _dr[0]; var setDraft = _dr[1];
  var S = LABEL_STYLES[card.styleIdx || 0] || LABEL_STYLES[0];

  function commit() {
    setEditing(false);
    if (draft.trim() && draft !== card.text) onUpdate(card.id, {text: draft.trim()});
  }

  return h('div', {
    className: 'board-label' + (editing ? ' editing' : ''),
    style: {left: card.x + 'px', top: card.y + 'px', zIndex: card.z || 1},
    tabIndex: editing ? -1 : 0,
    role: 'heading',
    'aria-level': '2',
    'aria-label': 'Section: ' + (card.text || 'Section'),
    onMouseDown: function(e) {
      if (editing || e.target.closest('.bc-actions')) return;
      onDragStart(e, card.id);
    },
    onDoubleClick: function(e) { e.stopPropagation(); setDraft(card.text || 'Section'); setEditing(true); },
    onKeyDown: function(e) {
      if (!editing && (e.key === 'Enter' || e.key === 'F2')) { e.preventDefault(); setDraft(card.text || 'Section'); setEditing(true); }
      if (!editing && (e.key === 'Delete' || e.key === 'Backspace')) { e.preventDefault(); onDelete(card.id); }
    },
  },
    h('div', {className: 'bc-actions'},
      h('button', {className: 'bc-btn', title: 'Change colour',
        onClick: function(e) { e.stopPropagation(); onUpdate(card.id, {styleIdx: ((card.styleIdx || 0) + 1) % LABEL_STYLES.length}); }
      }, '🎨'),
      h('button', {className: 'bc-btn', title: 'Delete', onClick: function(e) { e.stopPropagation(); onDelete(card.id); }}, '✕')
    ),
    h('div', {className: 'board-label-inner', style: {background: S.bg, borderColor: S.border, color: S.text}},
      editing
        ? h('input', {
            type: 'text', className: 'board-label-input', value: draft, autoFocus: true,
            style: {background: 'transparent', color: S.text, border: 'none', outline: 'none',
                    fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', width: '100%'},
            onChange: function(e) { setDraft(e.target.value); },
            onBlur: commit,
            onKeyDown: function(e) {
              if (e.key === 'Enter') { e.preventDefault(); commit(); }
              if (e.key === 'Escape') { setEditing(false); }
            },
            onClick: function(e) { e.stopPropagation(); },
          })
        : h('span', {title: 'Double-click to rename'}, card.text || 'Section')
    )
  );
}

// ── BoardCard — individual card on canvas ────────────────────────────────────

function BoardCard(props) {
  var card = props.card;
  var onDelete = props.onDelete;
  var onReroll = props.onReroll;
  var onPin = props.onPin;
  var onOpen = props.onOpen;
  var onDragStart = props.onDragStart;
  var onUpdate = props.onUpdate || function() {};

  var C = BOARD_TYPE_COLOR[card.genId] || {stripe: '#888', tc: '#555'};
  var isSticky = card.genId === 'sticky';

  if (isSticky) {
    var sc = STICKY_COLORS[card.colorIdx || 0];
    var _editing = useState(false); var editing = _editing[0]; var setEditing = _editing[1];
    var _draft = useState(card.text || ''); var draft = _draft[0]; var setDraft = _draft[1];
    function commitEdit() {
      setEditing(false);
      if (draft !== card.text) props.onUpdate(card.id, {text: draft || 'New Aspect'});
    }
    return h('div', {
      className: 'board-sticky' + (editing ? ' editing' : ''),
      style: {
        left: card.x + 'px',
        top: card.y + 'px',
        background: sc.bg,
        color: sc.text,
        transform: editing ? 'rotate(0deg)' : 'rotate(' + (card.rotation || 0) + 'deg)',
        zIndex: card.z || 1,
      },
      onMouseDown: function(e) {
        if (editing) return;
        if (!e.target.closest('.bc-actions')) onDragStart(e, card.id);
      },
      tabIndex: editing ? -1 : 0,
      role: 'note',
      'aria-label': 'Aspect sticky: ' + (card.text || 'New Aspect') + (editing ? '' : '. Press Enter to edit.'),
      onDoubleClick: function(e) {
        e.stopPropagation();
        setDraft(card.text || '');
        setEditing(true);
      },
      onKeyDown: function(e) {
        if (!editing && (e.key === 'Enter' || e.key === 'F2')) { e.preventDefault(); setDraft(card.text || ''); setEditing(true); }
        if (!editing && (e.key === 'Delete' || e.key === 'Backspace')) { e.preventDefault(); onDelete(card.id); }
      },
    },
      h('div', {className: 'bc-actions'},
        h('button', {className: 'bc-btn', title: 'Delete', onClick: function(e) { e.stopPropagation(); onDelete(card.id); }}, '\u2715')
      ),
      h('div', {className: 'board-sticky-label', style: {color: sc.label}}, 'Aspect'),
      editing
        ? h('textarea', {
            className: 'board-sticky-input',
            value: draft,
            autoFocus: true,
            rows: 3,
            style: {background: 'transparent', color: sc.text, border: 'none', borderBottom: '2px solid ' + sc.label,
                    outline: 'none', width: '100%', resize: 'none', fontFamily: 'inherit', fontSize: 12,
                    padding: 0, lineHeight: 1.5},
            onChange: function(e) { setDraft(e.target.value); },
            onBlur: commitEdit,
            onKeyDown: function(e) {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
              if (e.key === 'Escape') { setEditing(false); }
            },
            onClick: function(e) { e.stopPropagation(); },
          })
        : h('div', {className: 'board-sticky-text', title: 'Double-click to edit'}, card.text || '\u201CNew Aspect\u201D')
    );
  }

  var title = card.title || '';
  var summary = card.summary || '';
  var tags = card.tags || [];
  var genLabel = (GENERATORS || []).find(function(g) { return g.id === card.genId; });
  var typeLabel = (genLabel ? genLabel.icon + ' ' + genLabel.label : card.genId);

  return h('div', {
    className: 'board-card',
    style: {left: card.x + 'px', top: card.y + 'px', zIndex: card.z || 1},
    tabIndex: 0,
    role: 'region',
    'aria-label': (genLabel ? genLabel.label : card.genId) + ': ' + title,
    onMouseDown: function(e) {
      if (e.target.closest('.bc-actions')) return;
      onDragStart(e, card.id);
    },
    onClick: function(e) {
      if (e.target.closest('.bc-actions')) return;
      onOpen(card);
    },
    onKeyDown: function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(card); }
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); onDelete(card.id); }
      var step = e.shiftKey ? 50 : 10;
      if (e.key === 'ArrowRight') { e.preventDefault(); onUpdate(card.id, {x: card.x + step}); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); onUpdate(card.id, {x: card.x - step}); }
      if (e.key === 'ArrowDown')  { e.preventDefault(); onUpdate(card.id, {y: card.y + step}); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); onUpdate(card.id, {y: card.y - step}); }
    },
  },
    h('div', {className: 'bc-actions'},
      h('button', {className: 'bc-btn', title: 'Reroll', onClick: function(e) { e.stopPropagation(); onReroll(card.id); }}, '\u21BB'),
      h('button', {className: 'bc-btn', title: 'Pin to Table', onClick: function(e) { e.stopPropagation(); onPin(card); }}, '\uD83D\uDCCC'),
      h('button', {className: 'bc-btn', title: 'Delete', onClick: function(e) { e.stopPropagation(); onDelete(card.id); }}, '\u2715')
    ),
    h('div', {className: 'bc-stripe', style: {background: C.stripe}}),
    h('div', {className: 'bc-inner'},
      h('div', {className: 'bc-type', style: {color: C.tc}}, typeLabel),
      h('div', {className: 'bc-title'}, title),
      summary && h('div', {className: 'bc-body'}, summary.split('\n').map(function(ln, i) {
        return h('span', {key: i}, ln, i < summary.split('\n').length - 1 ? h('br', null) : null);
      })),
      tags.length > 0 && h('div', {className: 'bc-tags'},
        tags.map(function(t, i) {
          return h('span', {key: i, className: 'bc-tag', style: {background: C.bg, color: C.tc}}, t);
        })
      )
    ),
    h('div', {className: 'bc-hint'}, 'Click to open dossier')
  );
}

// ── BoardPlayerRow — player card for Play mode ───────────────────────────────
function BoardPlayerRow(props) {
  var p = props.player;
  var sel = props.sel;
  var onUpd = props.onUpd;
  var onSel = props.onSel;
  var _exp = useState(false); var expanded = _exp[0]; var setExpanded = _exp[1];
  var fpCol = p.fp === 0 ? 'var(--c-red)' : p.fp < p.ref ? 'var(--c-amber,#f4b942)' : 'var(--c-green)';
  var conseq = p.conseq || ['', '', ''];
  function setConseq(i, val) { var n = conseq.slice(); n[i] = val; onUpd({conseq: n}); }
  return h('div', {className: 'rs-player' + (sel ? ' selected' : ''),
    style: {borderLeftColor: p.color || 'var(--accent)', borderLeftWidth: 3}},
    h('div', {className: 'rs-player-top',
      role: 'button', tabIndex: 0,
      'aria-expanded': String(!!sel),
      'aria-label': (sel ? 'Collapse ' : 'Expand ') + p.name,
      onClick: function() { onSel(sel ? null : p.id); },
      onKeyDown: function(e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onSel(sel ? null : p.id); } }
    },
      h('div', {className: 'rs-player-dot', style: {background: p.color || 'var(--accent)'}}),
      h('div', {className: 'rs-player-name'}, p.name),
      sel && h('button', {style: {background: 'none', border: 'none', cursor: 'pointer', fontSize: 10,
        color: 'var(--text-muted)', padding: '0 2px', flexShrink: 0},
        onClick: function(e) { e.stopPropagation(); setExpanded(!expanded); }
      }, expanded ? '▲' : '▼'),
      h('button', {style: {background: 'none', border: 'none', cursor: 'pointer', fontSize: 12,
        color: p.acted ? 'var(--c-green)' : 'var(--border-mid)', padding: '0 2px', flexShrink: 0, lineHeight: 1},
        onClick: function(e) { e.stopPropagation(); onUpd({acted: !p.acted}); },
        'aria-label': p.acted ? 'Mark unacted' : 'Mark acted'
      }, p.acted ? '●' : '○')
    ),
    p.hc && h('div', {className: 'rs-player-hc'}, p.hc),
    h('div', {className: 'rs-fp-row'},
      h('span', {className: 'rs-fp-label'}, 'FP'),
      h('button', {className: 'rs-fp-btn', onClick: function() { onUpd({fp: Math.max(0, p.fp - 1)}); }, 'aria-label': 'Spend FP'}, '−'),
      h('span', {className: 'rs-fp-num', style: {color: fpCol}}, p.fp),
      h('button', {className: 'rs-fp-btn', onClick: function() { onUpd({fp: p.fp + 1}); }, 'aria-label': 'Gain FP'}, '+')
    ),
    h('div', {className: 'rs-stress-row'},
      h('span', {className: 'rs-fp-label'}, 'PHY'),
      h('div', {style: {display: 'flex', gap: 2}},
        p.phy.map(function(v, i) {
          return h('div', {key: i, className: 'rs-stress-box' + (v ? ' filled' : ''),
            role: 'checkbox', 'aria-checked': String(!!v), 'aria-label': 'Physical stress ' + (i + 1),
            tabIndex: 0,
            onClick: function() { var a = p.phy.slice(); a[i] = !a[i]; onUpd({phy: a}); },
            onKeyDown: function(e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); var a = p.phy.slice(); a[i] = !a[i]; onUpd({phy: a}); } }
          });
        })
      ),
      h('span', {className: 'rs-fp-label', style: {marginLeft: 4}}, 'MEN'),
      h('div', {style: {display: 'flex', gap: 2}},
        p.men.map(function(v, i) {
          return h('div', {key: i, className: 'rs-stress-box' + (v ? ' filled' : ''),
            style: {borderColor: 'var(--c-purple)'},
            role: 'checkbox', 'aria-checked': String(!!v), 'aria-label': 'Mental stress ' + (i + 1),
            tabIndex: 0,
            onClick: function() { var a = p.men.slice(); a[i] = !a[i]; onUpd({men: a}); },
            onKeyDown: function(e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); var a = p.men.slice(); a[i] = !a[i]; onUpd({men: a}); } }
          });
        })
      )
    ),
    expanded && h('div', {style: {padding: '0 8px 7px'}},
      h('div', {style: {fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
        color: 'var(--text-muted)', marginBottom: 3}}, 'Consequences'),
      ['Mild', 'Moderate', 'Severe'].map(function(sev, i) {
        return h('div', {key: i, style: {display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3}},
          h('span', {style: {fontSize: 11, color: 'var(--text-muted)', width: 46, flexShrink: 0}}, sev),
          h('input', {type: 'text', value: conseq[i] || '', placeholder: 'empty',
            onChange: function(e) { setConseq(i, e.target.value); },
            style: {flex: 1, background: 'var(--inset)',
              border: '1px solid ' + (conseq[i] ? 'var(--c-amber,#f4b942)' : 'var(--border)'),
              borderRadius: 4, padding: '2px 5px', fontSize: 10, color: 'var(--text)',
              fontFamily: 'var(--font-ui)', outline: 'none'}})
        );
      })
    )
  );
}

// ── BoardTurnBar — turn order strip for Play mode ─────────────────────────────
function BoardTurnBar(props) {
  var players = props.players;
  var order = props.order;
  var setOrder = props.setOrder;
  var onToggleActed = props.onToggleActed;
  var round = props.round;
  var onNewRound = props.onNewRound;
  var onPrevRound = props.onPrevRound;
  var roundFlash = props.roundFlash;
  var _drag = useState(null); var dragId = _drag[0]; var setDragId = _drag[1];
  var _over = useState(null); var overId = _over[0]; var setOverId = _over[1];
  var allActed = players.length > 0 && players.every(function(p) { return p.acted; });
  var orderedPlayers = order.map(function(id) {
    return players.find(function(p) { return p.id === id; });
  }).filter(Boolean);
  players.forEach(function(p) { if (order.indexOf(p.id) < 0) orderedPlayers.push(p); });

  return h('div', {className: 'board-turn-bar'},
    h('div', {className: 'rs-round-pill' + (roundFlash ? ' rs-round-flash' : ''),
      style: {flexShrink: 0}},
      h('button', {className: 'rs-round-btn',
        onClick: onPrevRound, 'aria-label': 'Prev round'}, '−'),
      h('span', {style: {fontSize: 11, color: 'var(--text-muted)', marginRight: 2}}, 'Rnd'),
      h('span', {className: 'rs-round-num', 'aria-live': 'polite', 'aria-atomic': 'true',
        'aria-label': 'Round ' + round}, round),
      h('button', {className: 'rs-round-btn',
        onClick: onNewRound, 'aria-label': 'New round'}, '+')
    ),
    h('span', {className: 'rs-turn-label', style: {flexShrink: 0}}, 'Turn:'),
    orderedPlayers.map(function(p) {
      return h('div', {key: p.id,
        className: 'rs-turn-pill' + (p.acted ? ' acted' : '') +
          (dragId === p.id ? ' dragging' : '') + (overId === p.id ? ' drag-over' : ''),
        draggable: true,
        onDragStart: function(e) { setDragId(p.id); e.dataTransfer.effectAllowed = 'move'; },
        onDragOver: function(e) { e.preventDefault(); if (p.id !== dragId) setOverId(p.id); },
        onDrop: function(e) {
          e.preventDefault();
          if (dragId && dragId !== p.id) {
            setOrder(function(o) {
              var a = o.slice();
              var fi = a.indexOf(dragId); var ti = a.indexOf(p.id);
              if (fi < 0 || ti < 0) return o;
              a.splice(fi, 1); a.splice(ti, 0, dragId); return a;
            });
          }
          setDragId(null); setOverId(null);
        },
        onDragEnd: function() { setDragId(null); setOverId(null); },
        onClick: function() { onToggleActed(p.id); },
      },
        h('div', {className: 'rs-turn-dot', style: {background: p.color || 'var(--accent)'}}),
        h('span', {style: {fontSize: 10, fontWeight: 700,
          color: p.acted ? 'var(--c-green)' : 'var(--text)'}}, p.name),
        p.acted && h('span', {style: {fontSize: 10, color: 'var(--c-green)'}}, ' ✓')
      );
    }),
    allActed && h('div', {className: 'rs-all-acted'}, '✦ All acted — new round?')
  );
}

// ── BoardPlayPanel — left panel content in Play mode ─────────────────────────
function BoardPlayPanel(props) {
  var players = props.players;
  var selPlayer = props.selPlayer;
  var onSel = props.onSel;
  var onUpd = props.onUpd;
  var onAdd = props.onAdd;

  return h('div', {className: 'blp'},
    h('div', {className: 'blp-tabs'},
      h('span', {className: 'blp-tab active', style: {pointerEvents: 'none', color: 'var(--c-green,#30d158)'}}, '▶ Play Mode')
    ),
    h('div', {className: 'blp-body'},
      players.length === 0 && h('div', {style: {padding: '16px 8px', textAlign: 'center',
        color: 'var(--text-muted)', fontSize: 12}},
        h('div', {style: {marginBottom: 8}}, '👥'),
        h('div', null, 'No players yet.'),
        h('div', {style: {fontSize: 11, marginTop: 4}}, 'Add players to track FP and stress.')
      ),
      players.map(function(p) {
        return h(BoardPlayerRow, {
          key: p.id,
          player: p,
          sel: selPlayer === p.id,
          onSel: onSel,
          onUpd: function(patch) { onUpd(p.id, patch); },
        });
      }),
      h('button', {className: 'rs-add-player', 'aria-label': 'Add player',
        onClick: onAdd}, '+ Add Player')
    )
  );
}

// ── BoardLeftPanel ────────────────────────────────────────────────────────────

function BoardLeftPanel(props) {
  var activeGen = props.activeGen;
  var onSelectGen = props.onSelectGen;
  var campId = props.campId;
  var activeTab = props.activeTab;
  var onTabChange = props.onTabChange;
  var campName = props.campName;

  return h('div', {className: 'blp'},
    h('div', {className: 'blp-tabs'},
      h('button', {
        className: 'blp-tab' + (activeTab === 'gen' ? ' active' : ''),
        onClick: function() { onTabChange('gen'); },
      }, 'Generate'),
      h('button', {
        className: 'blp-tab' + (activeTab === 'stunts' ? ' active' : ''),
        onClick: function() { onTabChange('stunts'); },
      }, 'Stunts'),
      h('button', {
        className: 'blp-tab' + (activeTab === 'help' ? ' active' : ''),
        onClick: function() { onTabChange('help'); },
      }, 'Help')
    ),

    // Generate panel
    activeTab === 'gen' && h('div', {className: 'blp-body'},
      BOARD_GEN_GROUPS.map(function(group) {
        return h(Fragment, {key: group.id},
          h('div', {className: 'blp-group'}, group.label),
          group.gens.map(function(gen) {
            return h('button', {
              key: gen.id,
              className: 'blp-item' + (activeGen === gen.id ? ' active' : ''),
              onClick: function() { onSelectGen(gen.id); },
            },
              h('span', {className: 'blp-icon'}, gen.icon),
              h('span', {className: 'blp-label'}, gen.label)
            );
          })
        );
      })
    ),

    // Stunts panel
    activeTab === 'stunts' && h(BoardStuntPanel, {
      campId: props.campId,
    }),

    // Help panel
    activeTab === 'help' && h(BoardHelpPanel, null)
  );
}

// ── BoardStuntPanel — BL-05 stunt browser ──────────────────────────────────
// Shows world + universal stunts. Filter by skill or tag. Click to copy.
function BoardStuntPanel(props) {
  var campId = props.campId;

  var _filter  = useState('');    var filter  = _filter[0];  var setFilter  = _filter[1];
  var _skill   = useState('all'); var skill   = _skill[0];   var setSkill   = _skill[1];
  var _tag     = useState('all'); var tag     = _tag[0];     var setTag     = _tag[1];
  var _copied  = useState(null);  var copied  = _copied[0];  var setCopied  = _copied[1];
  var copyTimer = useRef(null);

  // Gather stunts: world pool + universal pool
  var worldStunts = (typeof CAMPAIGNS !== 'undefined' && CAMPAIGNS[campId] &&
    CAMPAIGNS[campId].tables && CAMPAIGNS[campId].tables.stunts)
    ? CAMPAIGNS[campId].tables.stunts : [];
  var uniStunts = (typeof UNIVERSAL !== 'undefined' && UNIVERSAL.stunts) ? UNIVERSAL.stunts : [];
  var allStunts = worldStunts.concat(uniStunts);

  // Collect unique skills and tags for filter dropdowns
  var skills = ['all'].concat(
    allStunts.map(function(s){return s.skill;})
    .filter(function(v,i,a){return a.indexOf(v)===i && v && v !== 'varies';})
    .sort()
  );
  var tags = ['all'].concat(
    allStunts.reduce(function(acc,s){
      (s.tags||[]).forEach(function(t){ if(acc.indexOf(t)===-1) acc.push(t); });
      return acc;
    },[]).sort()
  );

  // Apply filters
  var filtered = allStunts.filter(function(s) {
    if (skill !== 'all' && s.skill !== skill) return false;
    if (tag !== 'all' && (s.tags||[]).indexOf(tag) === -1) return false;
    if (filter) {
      var q = filter.toLowerCase();
      return (s.name||'').toLowerCase().includes(q) ||
             (s.skill||'').toLowerCase().includes(q) ||
             (s.desc||'').toLowerCase().includes(q);
    }
    return true;
  });

  function copyStunt(s) {
    var text = s.name + ' (' + s.skill + '): ' + s.desc;
    function confirm() {
      setCopied(s.name);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(function() { setCopied(null); }, 1500);
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(confirm).catch(function() {
        fallbackCopy(text); confirm();
      });
    } else { fallbackCopy(text); confirm(); }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
  }

  var SKILL_COLOR = 'var(--accent)';
  var TYPE_COLOR = {'bonus':'var(--c-blue,#60a5fa)', 'special':'var(--c-purple,#a78bfa)'};

  return h('div', {className: 'blp-body blp-stunts'},

    // ── Search + filters ──────────────────────────────────────────────────
    h('div', {className: 'bs-filters'},
      h('input', {
        type: 'text',
        className: 'bs-search',
        placeholder: 'Search stunts…',
        value: filter,
        onChange: function(e) { setFilter(e.target.value); },
        'aria-label': 'Search stunts',
      }),
      h('div', {className: 'bs-selects'},
        h('select', {
          className: 'bs-select',
          value: skill,
          onChange: function(e) { setSkill(e.target.value); },
          'aria-label': 'Filter by skill',
        }, skills.map(function(sk) {
          return h('option', {key: sk, value: sk}, sk === 'all' ? 'All skills' : sk);
        })),
        h('select', {
          className: 'bs-select',
          value: tag,
          onChange: function(e) { setTag(e.target.value); },
          'aria-label': 'Filter by tag',
        }, tags.map(function(tg) {
          return h('option', {key: tg, value: tg}, tg === 'all' ? 'All tags' : tg);
        }))
      ),
      h('div', {className: 'bs-count', 'aria-live': 'polite'},
        filtered.length + ' of ' + allStunts.length + ' stunts'
        + (worldStunts.length ? ' \u00b7 ' + worldStunts.length + ' world' : '')
      )
    ),

    // ── Stunt list ────────────────────────────────────────────────────────
    filtered.length === 0
      ? h('div', {className: 'bs-empty'}, 'No stunts match your filters.')
      : h('div', {className: 'bs-list'},
          filtered.map(function(s, i) {
            var isCopied = copied === s.name;
            var typeCol = TYPE_COLOR[s.type] || TYPE_COLOR.bonus;
            return h('div', {
              key: (s.name || i),
              className: 'bs-card' + (isCopied ? ' bs-copied' : ''),
              role: 'button',
              tabIndex: 0,
              'aria-label': 'Copy stunt: ' + s.name,
              onClick: function() { copyStunt(s); },
              onKeyDown: function(e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyStunt(s); }
              },
            },
              h('div', {className: 'bs-card-header'},
                h('span', {className: 'bs-name'}, s.name),
                h('span', {
                  className: 'bs-type',
                  style: {color: typeCol, borderColor: typeCol + '55'},
                }, s.type === 'special' ? 'ONCE/SCENE' : '+2')
              ),
              h('div', {className: 'bs-skill', style: {color: SKILL_COLOR}}, s.skill),
              h('p', {className: 'bs-desc'}, s.desc),
              h('div', {className: 'bs-footer'},
                (s.tags||[]).map(function(tg) {
                  return h('span', {key: tg, className: 'bs-tag'}, tg);
                }),
                h('span', {className: 'bs-copy-hint'},
                  isCopied ? '\u2713 Copied' : '\u2398 Copy'
                )
              )
            );
          })
        )
  );
}

// ── BoardHelpPanel ────────────────────────────────────────────────────────────

function BoardHelpPanel(props) {
  var _open = useState(null);
  var openSection = _open[0];
  var setOpenSection = _open[1];

  var sections = [
    {
      id: 'basics', title: 'Fate Basics',
      content: [
        {head: 'Golden Rule', body: 'Decide what you want to happen fictionally first, then figure out the mechanics.'},
        {head: 'Silver Rule', body: 'Never let mechanics trump the fiction. If it makes no fictional sense, it doesn\u2019t happen.'},
        {head: 'Fate Points', body: 'Start each session at your refresh value. Spend to invoke aspects (+2 or reroll). Earn when compelled.'},
        {head: 'The Ladder', body: '\u22122 Terrible \xb7 \u22121 Poor \xb7 0 Mediocre \xb7 +1 Average \xb7 +2 Fair \xb7 +3 Good \xb7 +4 Great \xb7 +5 Superb \xb7 +6 Fantastic'},
      ]
    },
    {
      id: 'aspects', title: 'Aspects & Invokes',
      content: [
        {head: 'Invoke', body: 'Spend 1 FP for +2 or a reroll. Must be narratively relevant.'},
        {head: 'Compel', body: 'GM offers 1 FP to complicate life via an aspect. Player can refuse for 1 FP.'},
        {head: 'Free invokes', body: 'From Create Advantage. Don\u2019t cost FP. Stack them.'},
        {head: 'Boost', body: 'Temporary aspect with 1 free invoke, then gone.'},
      ]
    },
    {
      id: 'actions', title: 'The Four Actions',
      content: [
        {head: 'Overcome', body: 'Remove an obstacle. Can succeed, succeed with cost, tie, or fail.'},
        {head: 'Create Advantage', body: 'Add a situational aspect with free invokes.'},
        {head: 'Attack', body: 'Deal stress or consequences. Defender rolls to oppose.'},
        {head: 'Defend', body: 'Oppose attacks, creates advantages, or overcomes against you.'},
      ]
    },
    {
      id: 'stress', title: 'Stress & Consequences',
      content: [
        {head: 'Stress', body: 'Absorbs hits. Check boxes equal to or greater than the hit. Clears after conflict ends.'},
        {head: 'Consequences', body: 'Aspects that absorb hits. Mild \u22122, Moderate \u22124, Severe \u22126. Takes time to recover.'},
        {head: 'Taken Out', body: 'Can\u2019t absorb a hit \u2014 opponent decides what happens to you.'},
        {head: 'Concede', body: 'Before a roll, exit the conflict. Take a consequence but narrate your exit.'},
      ]
    },
    {
      id: 'npcs', title: 'Minor vs Major NPCs',
      content: [
        {head: 'Minor NPC', body: '1\u20132 aspects, one skill at +1\u2013+3, 1\u20132 stress boxes. One solid hit takes them out. No consequence slots.'},
        {head: 'Major NPC', body: 'Full character. 3\u20135 aspects, skill pyramid, stress track, all consequence slots. Treat like a PC.'},
        {head: 'Boss tip', body: 'Give bosses a unique stunt, an extra stress box, or a secret aspect revealed mid-fight.'},
      ]
    },
    {
      id: 'conflict', title: 'Challenges & Contests',
      content: [
        {head: 'Challenge', body: 'Series of overcome rolls. Each can succeed or fail independently. No active opposition.'},
        {head: 'Contest', body: 'Two sides race to 3 victories. Each exchange both roll \u2014 3+ shifts margin = victory. Tie = boost.'},
        {head: 'Conflict', body: 'Full structure. Exchange = everyone acts once. Use zones, aspects, terrain.'},
      ]
    },
  ];

  return h('div', {className: 'blp-body blp-help'},
    sections.map(function(sec) {
      var isOpen = openSection === sec.id;
      return h('div', {key: sec.id, className: 'bh-section'},
        h('button', {
          className: 'bh-head' + (isOpen ? ' open' : ''),
          onClick: function() { setOpenSection(isOpen ? null : sec.id); },
        },
          h('span', null, sec.title),
          h('span', {className: 'bh-arrow'}, '\u203a')
        ),
        isOpen && h('div', {className: 'bh-body'},
          sec.content.map(function(item, i) {
            return h('div', {key: i, className: 'bh-rule'},
              h('strong', null, item.head + ': '),
              item.body
            );
          })
        )
      );
    })
  );
}

// ── BoardDossier — Sprint 2 placeholder ──────────────────────────────────────

function BoardDossier(props) {
  var card = props.card;
  var onClose = props.onClose;
  var onReroll = props.onReroll;
  var onPin = props.onPin;
  var campName = props.campName;
  var campId = props.campId || '';
  var modalRef = useRef(null);

  // C-01: Focus trap + focus-on-open (WCAG 2.1.2)
  useEffect(function() {
    if (!modalRef.current) return;
    var el = modalRef.current;
    var closeBtn = el.querySelector('.bd-close');
    if (closeBtn) setTimeout(function() { closeBtn.focus(); }, 30);
    function getFocusable() {
      return Array.from(el.querySelectorAll('button:not([disabled]),a[href],input,textarea,select,[tabindex]:not([tabindex="-1"])'));
    }
    function trap(e) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      var els = getFocusable(); if (!els.length) return;
      if (e.shiftKey) { if (document.activeElement === els[0]) { e.preventDefault(); els[els.length-1].focus(); } }
      else { if (document.activeElement === els[els.length-1]) { e.preventDefault(); els[0].focus(); } }
    }
    el.addEventListener('keydown', trap);
    return function() { el.removeEventListener('keydown', trap); };
  }, [card]);

  if (!card) return null;

  var C = BOARD_TYPE_COLOR[card.genId] || {stripe: '#888', tc: '#555', bg: '#f5f4f1'};
  var genMeta = (GENERATORS || []).find(function(g) { return g.id === card.genId; }) || {};

  return h('div', {className: 'bd-backdrop', onClick: function(e) { if (e.target.className === 'bd-backdrop') onClose(); }},
    h('div', {className: 'bd-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'bd-title-' + card.id, ref: modalRef},
      // Close
      h('button', {className: 'bd-close', onClick: onClose, 'aria-label': 'Close dossier'}, '\u2715'),

      // Top
      h('div', {className: 'bd-top'},
        h('div', {className: 'bd-title', id: 'bd-title-' + card.id}, card.title),
        h('div', {
          className: 'bd-badge',
          style: {color: C.tc, borderColor: C.tc, background: C.bg}
        }, genMeta.icon + ' ' + (genMeta.label || card.genId))
      ),

      // Body — new card design
      h('div', {className: 'bd-body bd-card-body'},
        card.data && h('div', {style: {display:'flex', justifyContent:'center', padding:'12px 0 4px'}},
          renderCard(card.genId, card.data, campId || campName, null, [], null)
        )
      ),

      // Footer
      h('div', {className: 'bd-footer'},
        h('span', {className: 'bd-rules-link', onClick: props.onOpenHelp}, 'Tap for rules \u2192'),
        h('button', {className: 'bd-chain', onClick: function() { onReroll(card.id); onClose(); }}, '\u21BB\u00a0Chain'),
        h('button', {
          className: 'bd-pin',
          title: 'Pin to Table',
          onClick: function() { onPin(card); onClose(); }
        }, '\uD83D\uDCCC')
      )
    )
  );
}

function BoardDossierContent(props) {
  var card = props.card;
  var data = card.data || {};
  var genId = card.genId;

  // Always use structured display so we control exactly what shows here vs right stress panel
  // (renderResult includes its own stress boxes which duplicates BoardDossierStress)

  var aspects = data.aspects || {};
  var skills = data.skills || [];
  var aspItems = [];

  if (aspects.high_concept) aspItems.push({label: 'HC', text: aspects.high_concept, color: 'var(--c-blue,#378add)'});
  if (aspects.trouble)       aspItems.push({label: 'TR', text: aspects.trouble,       color: 'var(--c-red,#e24b4a)'});
  if (aspects.aspect_1)      aspItems.push({label: 'A1', text: aspects.aspect_1,      color: 'var(--text)'});
  if (aspects.aspect_2)      aspItems.push({label: 'A2', text: aspects.aspect_2,      color: 'var(--text)'});
  if (aspects.aspect_3)      aspItems.push({label: 'A3', text: aspects.aspect_3,      color: 'var(--text)'});

  // Non-NPC fields — strings only, skip objects/numbers that aren't meaningful
  var fieldDefs = [
    ['situation','Situation'],['threat','Threat'],['zone','Zone'],
    ['opposition','Opposition'],['stakes','Stakes'],['twist','Twist'],
    ['hook','Hook'],['premise','Premise'],['goal','Goal'],
    ['method','Method'],['weakness','Weakness'],
    ['current_issue','Current Issue'],['impending_issue','Impending Issue'],
    ['obstacle','Obstacle'],['track_name','Track'],['trigger','Trigger'],
    ['mild','Mild'],['moderate','Moderate'],['severe','Severe'],
  ];
  var fields = fieldDefs.reduce(function(acc, fd) {
    var v = data[fd[0]];
    if (v && typeof v === 'string') acc.push({label: fd[1], text: v});
    return acc;
  }, []);

  // GM note — from data or synthesised per type
  var gmNote = data.gm_note || (function(){
    if (genId === 'npc_minor')   return 'No consequence slots. One solid hit takes them out. Compel the trouble for drama.';
    if (genId === 'npc_major')   return 'Full PC sheet. Use the trouble to drive compels. A unique stunt makes them memorable.';
    if (genId === 'scene')       return 'Place the situation aspect on the table — it\u2019s free to invoke on the first roll. The threat drives the clock. Ask: what happens if nobody acts?';
    if (genId === 'encounter')   return 'Set the stakes before the first roll. Let players invoke the opposition\u2019s aspects against it. Twist on a tie or cost.';
    if (genId === 'compel')      return 'Offer 1 FP and frame the complication. Player can refuse for 1 FP. The consequence hook is the next compel seed.';
    if (genId === 'challenge')   return 'Each overcome roll is independent — partial success on one doesn\u2019t carry over. Call for a cost on a tie. Failure = new aspect, not dead end.';
    if (genId === 'contest')     return 'First to 3 victories wins. Tie = boost for one side. Each exchange both sides roll — 3+ margin on the winner\u2019s shift counts as a victory.';
    if (genId === 'consequence') return 'Consequences are aspects — invoke and compel them. Recovery requires a treatment overcome roll first, then the scene/session/breakthrough clock.';
    if (genId === 'faction')     return 'The face NPC is the human handle on this faction. Method = how they act when threatened. Weakness = what a clever PC can exploit.';
    if (genId === 'seed')        return 'Hook drops into scene 1. Opposition is the central antagonist. Stakes tell the players what matters. Twist ready for act 3.';
    if (genId === 'complication') return 'A complication is a new aspect. Place it immediately. It\u2019s invocable by anyone — including enemies — until it\u2019s overcome.';
    if (genId === 'backstory')   return 'Let the player narrate. Your job is to say \u201Cyes, and\u2014\u201D and note which relationship might be a compel hook later.';
    if (genId === 'obstacle')    return 'Hazard = aspect that attacks. Block = passive opposition. Distraction = compel bait. Name it as an aspect and put it on the table.';
    if (genId === 'countdown')   return 'Show the track to the players. Tick it visibly. When it fills, trigger immediately — delays kill tension.';
    if (genId === 'constraint')  return 'A constraint limits what\u2019s possible, not what\u2019s allowed. Frame it as \u201Cthe only path forward requires\u2026\u201D';
    if (genId === 'campaign')    return 'Current issue = what\u2019s already on fire. Impending = what will catch fire if nobody acts. Setting aspects = what\u2019s always true here.';
    return null;
  })();

  return h('div', {className: 'bd-fallback'},
    aspItems.length > 0 && h('div', null,
      h('div', {className: 'bdf-section'}, 'Aspects'),
      aspItems.map(function(it, i) {
        return h('div', {key: i, className: 'bdf-aspect'},
          h('span', {className: 'bdf-label'}, it.label),
          h('span', {style: {color: it.color, fontSize: '12px', lineHeight: 1.45}}, it.text)
        );
      })
    ),
    skills.length > 0 && h('div', {style: {marginTop: 12}},
      h('div', {className: 'bdf-section'}, 'Skills'),
      skills.slice(0, 6).map(function(s, i) {
        return h('div', {key: i, className: 'bdf-skill'},
          h('span', {className: 'bdf-skill-badge'}, '+' + s.r),
          h('span', {className: 'bdf-skill-name'}, s.name)
        );
      })
    ),
    data.stunt && h('div', {style: {marginTop: 12}},
      h('div', {className: 'bdf-section'}, 'Stunt'),
      h('div', {className: 'bdf-field', style: {border: 'none', paddingTop: 4}}, data.stunt)
    ),
    fields.length > 0 && h('div', {style: {marginTop: 12}},
      fields.map(function(f, i) {
        return h('div', {key: i, className: 'bdf-field'},
          h('strong', null, f.label + ': '),
          f.text
        );
      })
    ),
    gmNote && h('div', {className: 'bdf-gm-note', style: {marginTop: 14}},
      h('div', {style: {fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 5}}, 'GM Note'),
      gmNote
    )
  );
}

function BoardDossierStress(props) {
  var card = props.card;
  var C = props.C;
  var data = card.data || {};
  var _hits = useState({phy: {}, men: {}});
  var hits = _hits[0];
  var setHits = _hits[1];

  var phyMax = typeof data.physical_stress === 'number' ? data.physical_stress :
               (typeof data.stress === 'number' ? data.stress : 0);
  var menMax = typeof data.mental_stress === 'number' ? data.mental_stress : 0;

  if (phyMax === 0 && menMax === 0) return h('div', {style: {fontSize: 11, color: '#aaa'}}, 'No stress track');

  function toggle(track, i) {
    setHits(function(prev) {
      var next = Object.assign({}, prev);
      next[track] = Object.assign({}, prev[track]);
      next[track][i] = !prev[track][i];
      return next;
    });
  }

  return h('div', null,
    phyMax > 0 && h('div', {style: {marginBottom: 12}},
      h('div', {className: 'bdf-section'}, 'Stress'),
      h('div', {style: {fontSize: 9, color: '#aaa', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em'}}, 'Physical'),
      h('div', {className: 'bds-boxes'},
        Array.from({length: phyMax}).map(function(_, i) {
          var checked = !!hits.phy[i];
          return h('div', {
            key: i,
            className: 'bds-box' + (checked ? ' checked' : ''),
            style: {borderColor: C.stripe, color: checked ? '#fff' : C.tc, background: checked ? C.stripe : '#fff'},
            onClick: function() { toggle('phy', i); },
          }, i + 1);
        })
      )
    ),
    menMax > 0 && h('div', null,
      h('div', {style: {fontSize: 9, color: '#aaa', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em'}}, 'Mental'),
      h('div', {className: 'bds-boxes'},
        Array.from({length: menMax}).map(function(_, i) {
          var checked = !!hits.men[i];
          return h('div', {
            key: i,
            className: 'bds-box' + (checked ? ' checked' : ''),
            style: {borderColor: '#6a7dd4', color: checked ? '#fff' : '#5a6db8', background: checked ? '#6a7dd4' : '#fff'},
            onClick: function() { toggle('men', i); },
          }, i + 1);
        })
      )
    ),
    (data.mild !== undefined || data.moderate !== undefined || data.severe !== undefined ||
     (card.genId === 'npc_major')) && h('div', {style: {marginTop: 14}},
      h('div', {className: 'bdf-section'}, 'Consequences'),
      ['Mild (−2)', 'Moderate (−4)', 'Severe (−6)'].map(function(s, i) {
        return h('div', {key: i, className: 'bds-conseq'}, s);
      })
    )
  );
}

// ── BoardTopbar ───────────────────────────────────────────────────────────────

// ── BoardExportMenu — export dropdown for Board topbar ──────────────────────
function BoardExportMenu(props) {
  var cards          = props.cards || [];
  var campName       = props.campName || '';
  var onExportCanvas = props.onExportCanvas;
  var onImportCanvas = props.onImportCanvas;
  var onPrint        = props.onPrint;
  var mode           = props.mode || 'prep';
  var hasCards       = cards.filter(function(c){ return c.genId && c.genId !== 'sticky' && c.genId !== 'label'; }).length > 0;

  var _open = useState(false); var open = _open[0]; var setOpen = _open[1];
  var _pos = useState({top: 0, right: 0}); var menuPos = _pos[0]; var setMenuPos = _pos[1];
  var menuRef = useRef(null);
  var btnRef  = useRef(null);

  useEffect(function() {
    if (!open) return;
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current  && !btnRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return function() { document.removeEventListener('mousedown', handler); };
  }, [open]);

  function close() { setOpen(false); }

  function toggle() {
    if (!open && btnRef.current) {
      var r = btnRef.current.getBoundingClientRect();
      setMenuPos({top: r.bottom + 6, right: window.innerWidth - r.right});
    }
    setOpen(function(v) { return !v; });
  }

  function doImagePack() {
    close();
    if (!hasCards) return;
    var printable = cards.filter(function(c){ return c.genId && c.genId !== 'sticky' && c.genId !== 'label' && c.data; });
    if (typeof DB === 'undefined' || !DB.exportCardsAsPng) return;
    DB.exportCardsAsPng(printable, campName);
  }

  function doPrint() { close(); if (onPrint) onPrint(); }
  function doExportCanvas() { close(); if (onExportCanvas) onExportCanvas(); }
  function doImportCanvas() { close(); if (onImportCanvas) onImportCanvas(); }

  return h('div', {style: {position: 'relative', display: 'inline-flex'}},
    h('button', {
      ref: btnRef,
      className: 'bt-icon-btn' + (open ? ' active' : ''),
      onClick: toggle,
      title: 'Export / Import',
      'aria-label': 'Export and import options',
      'aria-expanded': String(open),
      'aria-haspopup': 'menu',
    }, h(FaFileArrowDownIcon, {size: 14})),
    open && h('div', {
      ref: menuRef,
      role: 'menu',
      'aria-label': 'Export options',
      style: {
        position: 'fixed',
        top: menuPos.top,
        right: menuPos.right,
        background: 'var(--panel-raised)',
        border: '1.5px solid var(--border-mid)',
        borderRadius: 3, padding: '4px 0', minWidth: 200,
        boxShadow: '4px 4px 0 rgba(0,0,0,.22)',
        zIndex: 9000, animation: 'fadeDown .14s ease',
      },
    },
      h('div', {style: {padding: '6px 14px 5px', fontSize: 10, fontWeight: 800,
        letterSpacing: '.2em', color: 'var(--text-muted)', textTransform: 'uppercase',
        fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)'}}, 'Export'),

      // ── JSON (Board canvas) ────────────────────────────────────────
      h('button', {role: 'menuitem', onClick: doExportCanvas, className: 'export-menu-item', 'aria-label': 'Export board canvas as JSON'},
        h('div', {className: 'export-menu-item-icon'}, '{ }'),
        h('div', {className: 'export-menu-item-body'},
          h('div', {className: 'export-menu-item-label'}, 'JSON'),
          h('div', {className: 'export-menu-item-sub'}, 'Canvas state \u2014 re-importable')
        )
      ),

      // ── Image Pack ────────────────────────────────────────────────
      hasCards && h('button', {role: 'menuitem', onClick: doImagePack, className: 'export-menu-item', 'aria-label': 'Export cards as PNG image pack'},
        h('div', {className: 'export-menu-item-icon'}, '\u25a3'),
        h('div', {className: 'export-menu-item-body'},
          h('div', {className: 'export-menu-item-label'}, 'Image Pack'),
          h('div', {className: 'export-menu-item-sub'}, 'PNG zip for Miro / Figma')
        )
      ),

      // ── Print ─────────────────────────────────────────────────────
      mode !== 'play' && hasCards && h('button', {role: 'menuitem', onClick: doPrint, className: 'export-menu-item', 'aria-label': 'Print cards'},
        h('div', {className: 'export-menu-item-icon'}, '\u2399'),
        h('div', {className: 'export-menu-item-body'},
          h('div', {className: 'export-menu-item-label'}, 'Print'),
          h('div', {className: 'export-menu-item-sub'}, 'Printable A4 layout')
        )
      ),

      // ── Divider ───────────────────────────────────────────────────
      h('div', {role: 'separator', style: {height: 1, background: 'var(--border)', margin: '4px 0'}}),

      // ── Import ────────────────────────────────────────────────────
      h('button', {role: 'menuitem', onClick: doImportCanvas, className: 'export-menu-item', 'aria-label': 'Import board from JSON file'},
        h('div', {className: 'export-menu-item-icon'}, '\u2191'),
        h('div', {className: 'export-menu-item-body'},
          h('div', {className: 'export-menu-item-label'}, 'Import'),
          h('div', {className: 'export-menu-item-sub'}, 'Restore from .json file')
        )
      )
    )
  );
}


function BoardTopbar(props) {
  var campMeta = props.campMeta;
  var mode = props.mode;
  var onModeChange = props.onModeChange;
  var pinCount = props.pinCount;
  var theme = props.theme;
  var onToggleTheme = props.onToggleTheme;
  var campId = props.campId;
  var onCampChange = props.onCampChange;
  var isOnline = props.isOnline;
  var showDice = props.showDice;
  var onToggleDice = props.onToggleDice;
  var showFP = props.showFP;
  var onToggleFP = props.onToggleFP;
  var syncStatus = props.syncStatus;
  var roomCode = props.roomCode;
  var onHost = props.onHost;
  var onDisconnect = props.onDisconnect;
  var onExportCanvas = props.onExportCanvas;
  var cards = props.cards || [];
  var campName = props.campName || (props.campMeta && props.campMeta.name) || '';
  var mobileListView = props.mobileListView || false;
  var leftOpen = props.leftOpen;
  var onToggleLeft = props.onToggleLeft;

  var worlds = typeof CAMPAIGNS !== 'undefined'
    ? Object.keys(CAMPAIGNS).map(function(id) { return {id: id, name: (CAMPAIGNS[id].meta || {}).name || id}; })
    : [{id: campId, name: campMeta.name || campId}];

  return h('div', {className: 'bt-bar'},
    // Logo + world picker
    h('div', {className: 'bt-world'},
      h('a', {href: 'campaigns/' + campId + '.html', className: 'bt-back', title: 'Back to generator'}, '\u2190'),
      h('span', {className: 'bt-world-icon'}, campMeta.icon || '\u25C8'),
      h('select', {
        className: 'bt-world-select',
        value: campId,
        onChange: function(e) { onCampChange(e.target.value); },
        title: 'Switch world',
        'aria-label': 'Switch world',
      },
        worlds.map(function(w) { return h('option', {key: w.id, value: w.id}, w.name); })
      )
    ),

    // Mode toggle
    // MOB-02: Left panel toggle (visible on mobile only)
    h('button', {
      className: 'bt-icon-btn bt-panel-toggle',
      onClick: onToggleLeft,
      title: leftOpen ? 'Hide generators' : 'Show generators',
      'aria-label': leftOpen ? 'Hide generator panel' : 'Show generator panel',
      'aria-expanded': String(!!leftOpen),
    }, leftOpen ? '\u25C0' : '\u25B6'),
    h('div', {className: 'bt-mode'},
      h('button', {
        className: 'bt-mode-btn' + (mode === 'prep' ? ' active' : ''),
        onClick: function() { onModeChange('prep'); },
        title: 'Prep mode — generate and arrange cards',
        'aria-pressed': String(mode === 'prep'),
      }, 'Prep'),
      h('button', {
        className: 'bt-mode-btn' + (mode === 'play' ? ' active' : ''),
        onClick: function() { onModeChange('play'); },
        title: 'Play mode — live session, players connected',
        'aria-pressed': String(mode === 'play'),
      }, 'Play')
    ),

    // Right nav
    h('div', {className: 'bt-right'},
      mode === 'play' && syncStatus === 'connected' && h('span', {className: 'bt-chip bt-play-chip'}, '\u25B6 Live'),
      mode === 'play' && syncStatus === 'connecting' && h('span', {className: 'bt-chip bt-offline'}, '\u29D7 Connecting…'),
      !isOnline && h('span', {className: 'bt-chip bt-offline'}, '\u26A1 Offline'),

    // BRD-02: Dice floater toggle
      h('button', {
        className: 'bt-icon-btn' + (showDice ? ' active' : ''),
        onClick: onToggleDice,
        title: 'Dice roller',
        'aria-label': showDice ? 'Close dice roller' : 'Open dice roller',
        'aria-pressed': String(showDice),
      }, '\uD83C\uDFB2'),
      // BRD-03: FP tracker toggle
      h('button', {
        className: 'bt-icon-btn' + (showFP ? ' active' : ''),
        onClick: onToggleFP,
        title: 'Fate Point tracker',
        'aria-label': showFP ? 'Close Fate Point tracker' : 'Open Fate Point tracker',
        'aria-pressed': String(showFP),
      }, '\u25CE'),
      // BRD-05: Host button (Play mode only)
      mode === 'play' && syncStatus === 'offline' && h('button', {
        className: 'bt-nav',
        onClick: onHost,
        title: 'Host a live session — share room code with players',
      }, '\uD83C\uDF10 Host'),
      mode === 'play' && syncStatus === 'connected' && h('button', {
        className: 'bt-nav',
        onClick: onDisconnect,
        title: 'Disconnect from live session',
        style: {color: 'var(--c-green,#30d158)', borderColor: 'var(--c-green,#30d158)'},
      }, String(roomCode)),
      h('a', {href: 'index.html', className: 'bt-nav bt-nav-hide-xs', 'aria-label': 'Worlds'},
        h('span', {'aria-hidden': 'true'}, '\uD83C\uDF0D'),
        h('span', {className: 'bt-nav-text'}, '\u00a0Worlds')),
      h('a', {href: 'help/index.html', className: 'bt-nav bt-nav-hide-xs', 'aria-label': 'Help'},
        h('span', {'aria-hidden': 'true'}, '\u2753'),
        h('span', {className: 'bt-nav-text'}, '\u00a0Help')),
      h('a', {href: 'campaigns/board.html?mode=play', className: 'bt-nav bt-table', 'aria-label': 'Play mode' + (pinCount > 0 ? ' (' + pinCount + ' cards)' : '')},
        h('span', {'aria-hidden': 'true'}, '\uD83D\uDED2'),
        h('span', {className: 'bt-nav-text'}, '\u00a0Table'),
        pinCount > 0 && h('span', {className: 'bt-count'}, String(pinCount))
      ),
      // EXP-06: Export menu (Image Pack / Print / JSON canvas export)
      h(BoardExportMenu, {
        cards: props.cards || [],
        campName: props.campName || '',
        onExportCanvas: props.onExportCanvas,
        onImportCanvas: props.onImportCanvas,
        onPrint: props.onPrint,
        mode: props.mode,
      }),
      // MOB-15: canvas/list toggle (mobile only)
      props.onToggleMobileList && h('button', {
        className: 'bt-icon-btn bt-mob-view-toggle',
        onClick: props.onToggleMobileList,
        title: props.mobileListView ? 'Switch to canvas' : 'Switch to card list',
        'aria-label': props.mobileListView ? 'Canvas view' : 'List view',
        'aria-pressed': String(!!props.mobileListView),
      }, props.mobileListView ? '\u25A6' : '\u2261'),

      h('button', {
        className: 'bt-icon-btn',
        onClick: onToggleTheme,
        title: theme === 'dark' ? 'Light mode' : 'Dark mode',
        'aria-label': theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
      }, theme === 'dark' ? '\u2600' : '\u263D')
    )
  );
}

// ── BoardApp — root component ─────────────────────────────────────────────────

// ── useBoardPlayState — play-mode player roster, rounds, turn order ─────────
// Extracted from BoardApp. Call inside BoardApp; destructure returned values.
function useBoardPlayState(campId, mode, loaded) {
  var _players    = useState([]); var players = _players[0]; var setPlayers = _players[1];
  var _round      = useState(1);  var round   = _round[0];   var setRound   = _round[1];
  var _order      = useState([]); var order   = _order[0];   var setOrder   = _order[1];
  var _selPlayer  = useState(null); var selPlayer = _selPlayer[0]; var setSelPlayer = _selPlayer[1];
  var _roundFlash = useState(false); var roundFlash = _roundFlash[0]; var setRoundFlash = _roundFlash[1];
  var roundFlashTimer = useRef(null);

  function persistPlayState(pl, rnd, ord) {
    if (!DB) return;
    var key = 'board_play_session_' + campId;
    DB.saveSession(key, {
      players: pl  !== null ? pl  : players,
      round:   rnd !== null ? rnd : round,
      order:   ord !== null ? ord : order,
    }).catch(function(err) { console.warn('[Ogma] board play state save failed:', err); });
  }

  function newRound() {
    var next = round + 1;
    setRound(next);
    setPlayers(function(ps) {
      var cleared = ps.map(function(p) { return Object.assign({}, p, {acted: false}); });
      persistPlayState(cleared, next, null);
      return cleared;
    });
    setRoundFlash(true);
    if (roundFlashTimer.current) clearTimeout(roundFlashTimer.current);
    roundFlashTimer.current = setTimeout(function() { setRoundFlash(false); }, 600);
  }

  function prevRound() {
    if (round <= 1) return;
    var next = round - 1;
    setRound(next);
    persistPlayState(null, next, null);
  }

  function toggleActed(playerId) {
    setPlayers(function(ps) {
      var next = ps.map(function(p) { return p.id === playerId ? Object.assign({}, p, {acted: !p.acted}) : p; });
      persistPlayState(next, null, null);
      return next;
    });
  }

  function updPlayer(id, patch) {
    setPlayers(function(ps) {
      var next = ps.map(function(p) { return p.id === id ? Object.assign({}, p, patch) : p; });
      persistPlayState(next, null, null);
      return next;
    });
  }

  function addPlayer(nameArg) {
    var name = nameArg || prompt('Player name:');
    if (!name) return;
    var COLORS = ['var(--accent)', 'var(--c-purple)', 'var(--c-blue)', 'var(--c-green)', 'var(--c-red)'];
    var np = {
      id: 'bp' + Date.now() + Math.random().toString(36).slice(2, 5),
      name: name, hc: '', fp: 3, ref: 3,
      phy: [false, false, false], men: [false, false],
      color: COLORS[players.length % COLORS.length],
      acted: false, conseq: ['', '', '']
    };
    var nextP = players.concat([np]);
    var nextO = order.concat([np.id]);
    setPlayers(nextP); setOrder(nextO);
    persistPlayState(nextP, null, nextO);
  }

  function removePlayer(id) {
    var nextP = players.filter(function(p) { return p.id !== id; });
    var nextO = order.filter(function(oid) { return oid !== id; });
    setPlayers(nextP); setOrder(nextO);
    persistPlayState(nextP, null, nextO);
    if (selPlayer === id) setSelPlayer(null);
  }

  // Load play state on mount and when entering play mode
  useEffect(function() {
    if (!DB || !loaded) return;
    DB.loadSession('board_play_session_' + campId).then(function(saved) {
      if (!saved) return;
      if (Array.isArray(saved.players) && saved.players.length > 0) setPlayers(saved.players);
      if (typeof saved.round === 'number') setRound(saved.round);
      if (Array.isArray(saved.order) && saved.order.length > 0) setOrder(saved.order);
    }).catch(function() {});
  }, [campId, mode, loaded]);

  return {
    players: players, setPlayers: setPlayers,
    round: round,
    order: order, setOrder: setOrder,
    selPlayer: selPlayer, setSelPlayer: setSelPlayer,
    roundFlash: roundFlash,
    newRound: newRound, prevRound: prevRound,
    toggleActed: toggleActed,
    updPlayer: updPlayer, addPlayer: addPlayer, removePlayer: removePlayer,
    persistPlayState: persistPlayState,
  };
}

// ── useBoardSync — multiplayer sync state for BoardApp ──────────────────────
function useBoardSync(showToast) {
  var _syncObj    = useState(null);       var syncObj    = _syncObj[0];    var setSyncObj    = _syncObj[1];
  var _syncStatus = useState('offline');  var syncStatus = _syncStatus[0]; var setSyncStatus = _syncStatus[1];
  var _roomCode   = useState(function() {
    try { return new URLSearchParams(location.search).get('room') || ''; } catch(e) { return ''; }
  });
  var roomCode = _roomCode[0]; var setRoomCode = _roomCode[1];
  var _showJoin  = useState(false); var showJoin  = _showJoin[0];  var setShowJoin  = _showJoin[1];
  var _joinInput = useState('');    var joinInput = _joinInput[0]; var setJoinInput = _joinInput[1];

  function connectAsHost() {
    if (typeof createTableSync === 'undefined') { showToast('\u26a0 Sync not available offline'); return; }
    var code = roomCode && roomCode.length === 4 ? roomCode : generateBoardRoomCode();
    setRoomCode(code);
    var s = createTableSync(code, 'gm',
      function() {},
      function(roll) { showToast(roll.who + ' \u00b7 ' + (roll.total >= 0 ? '+' : '') + roll.total); },
      function(msg) { showToast(msg); },
      function() {}
    );
    if (!s) { showToast('\u26a0 Could not connect'); return; }
    setSyncObj(s);
    setSyncStatus('connecting');
    s.ws.addEventListener('open', function() { setSyncStatus('connected'); showToast('\u2705 Live \u2014 room: ' + code); });
    s.ws.addEventListener('close', function() { setSyncStatus('offline'); });
  }


  return {
    syncObj: syncObj, setSyncObj: setSyncObj,
    syncStatus: syncStatus, setSyncStatus: setSyncStatus,
    roomCode: roomCode, setRoomCode: setRoomCode,
    showJoin: showJoin, setShowJoin: setShowJoin,
    joinInput: joinInput, setJoinInput: setJoinInput,
    connectAsHost: connectAsHost,
    disconnectSync: disconnectSync,
  };
}

// ── BoardMobileList — MOB-15: card list view for mobile ──────────────────────
// Renders board cards as a scrollable list instead of the drag canvas.
// Shown on ≤640px when user taps the list/canvas toggle.
function BoardMobileList(props) {
  var cards    = props.cards || [];
  var campId   = props.campId;
  var onOpen   = props.onOpen || function(){};
  var onRemove = props.onRemove || function(){};

  var genCards = cards.filter(function(c) {
    return c.genId && c.genId !== 'sticky' && c.genId !== 'label' && c.data;
  });
  var stickyCards = cards.filter(function(c) { return c.genId === 'sticky'; });
  var labelCards  = cards.filter(function(c) { return c.genId === 'label'; });

  if (cards.length === 0) {
    return h('div', {className: 'bml-empty'},
      h('div', {style:{fontSize:32,marginBottom:10}}, '\uD83C\uDFB2'),
      h('div', {style:{fontSize:14,fontWeight:700,color:'var(--text)'}}, 'Canvas is empty'),
      h('div', {style:{fontSize:12,color:'var(--text-muted)',marginTop:4}}, 'Use Generate tab to add cards.')
    );
  }

  function cardTypeLabel(genId) {
    var map = {npc_minor:'Minor NPC',npc_major:'Major NPC',scene:'Scene',campaign:'Campaign',
      encounter:'Encounter',seed:'Seed',compel:'Compel',challenge:'Challenge',
      contest:'Contest',consequence:'Consequence',faction:'Faction',complication:'Complication',
      backstory:'Backstory',obstacle:'Obstacle',countdown:'Countdown',constraint:'Constraint'};
    return map[genId] || genId;
  }

  function cardTitle(card) {
    var d = card.data || {};
    return card.title || d.name || d.location || d.situation || d.track_name || card.genId || '—';
  }

  var CAT_COLOR = {
    npc_minor:'var(--c-blue,#60a5fa)', npc_major:'var(--c-blue,#60a5fa)', faction:'var(--c-blue,#60a5fa)',
    scene:'var(--gold,#fbbf24)', campaign:'var(--gold,#fbbf24)', encounter:'var(--gold,#fbbf24)', seed:'var(--gold,#fbbf24)',
    compel:'var(--c-red,#f87171)', challenge:'var(--c-red,#f87171)', contest:'var(--c-red,#f87171)', consequence:'var(--c-red,#f87171)',
    complication:'var(--c-purple,#a78bfa)', backstory:'var(--c-purple,#a78bfa)',
    obstacle:'var(--c-green,#34d399)', countdown:'var(--c-green,#34d399)', constraint:'var(--c-green,#34d399)',
  };

  return h('div', {className: 'bml-list'},
    genCards.map(function(card) {
      var col = CAT_COLOR[card.genId] || 'var(--accent)';
      return h('div', {
        key: card.id,
        className: 'bml-card',
        style: {borderLeft: '3px solid ' + col},
        role: 'button',
        tabIndex: 0,
        'aria-label': cardTypeLabel(card.genId) + ': ' + cardTitle(card),
        onClick: function() { onOpen(card); },
        onKeyDown: function(e) { if(e.key==='Enter'||e.key===' '){e.preventDefault();onOpen(card);} },
      },
        h('div', {className: 'bml-card-type', style:{color:col}}, cardTypeLabel(card.genId)),
        h('div', {className: 'bml-card-title'}, cardTitle(card)),
        h('button', {
          className: 'bml-remove',
          onClick: function(e) { e.stopPropagation(); onRemove(card.id); },
          'aria-label': 'Remove ' + cardTitle(card),
        }, '\u2715')
      );
    }),
    stickyCards.length > 0 && h('div', {className: 'bml-section'}, '\uD83D\uDCCC Sticky notes (' + stickyCards.length + ')'),
    labelCards.length > 0 && h('div', {className: 'bml-section'}, '\uD83C\uDFF7 Labels (' + labelCards.length + ')')
  );
}

function BoardApp(props) {
  var campId       = props.campId || 'fantasy';
  var initialMode  = props.initialMode || 'prep';
  var initialRoom  = props.initialRoom || null;

  // ── State ──────────────────────────────────────────────────────────────────
  var _cards = useState([]);
  var cards = _cards[0];
  var setCards = _cards[1];

  var _activeGen = useState('npc_minor');
  var activeGen = _activeGen[0];
  var setActiveGen = _activeGen[1];

  var _leftTab = useState('gen');
  var leftTab = _leftTab[0];
  var setLeftTab = _leftTab[1];

  var _mode = useState(initialMode);
  var mode = _mode[0];
  var setMode = _mode[1];

  var _theme = useState('dark');
  var theme = _theme[0];
  var setTheme = _theme[1];

  var _isOnline = useState(navigator.onLine);
  var isOnline = _isOnline[0];
  var setIsOnline = _isOnline[1];

  var _toast = useState(null);
  var toast = _toast[0];
  var setToast = _toast[1];

  var _dossierCard = useState(null);
  var dossierCard = _dossierCard[0];
  var setDossierCard = _dossierCard[1];

  var _pinCount = useState(0);
  var pinCount = _pinCount[0];
  var setPinCount = _pinCount[1];

  var _loaded = useState(false);
  var loaded = _loaded[0];
  var setLoaded = _loaded[1];

  var _zoom = useState(1);
  var zoom = _zoom[0];
  var setZoom = _zoom[1];

  // MOB-02: left panel collapsed state (default open on desktop, closed on mobile)
  var _leftOpen = useState(function() { return window.innerWidth > 520; });
  var leftOpen = _leftOpen[0]; var setLeftOpen = _leftOpen[1];

  // ── Play mode: player roster, round tracker, turn order (useBoardPlayState) ──
  var _play = useBoardPlayState(campId, mode, loaded);
  var players = _play.players; var setPlayers = _play.setPlayers;
  var round = _play.round;
  var order = _play.order; var setOrder = _play.setOrder;
  var selPlayer = _play.selPlayer; var setSelPlayer = _play.setSelPlayer;
  var roundFlash = _play.roundFlash;
  var newRound = _play.newRound; var prevRound = _play.prevRound;
  var toggleActed = _play.toggleActed;
  var updPlayer = _play.updPlayer; var addPlayer = _play.addPlayer; var removePlayer = _play.removePlayer;
  var persistPlayState = _play.persistPlayState;

  // ── BRD-02/03: Dice floater + FP floater visibility ──────────────────────
  var _showDice = useState(false); var showDice = _showDice[0]; var setShowDice = _showDice[1];
  var _showFP = useState(false); var showFP = _showFP[0]; var setShowFP = _showFP[1];

  // Toast — declared before useBoardSync so showToast can be passed as a callback
  var toastTimerRef = useRef(null);
  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(function() { setToast(null); }, 1800);
  }

  // ── BRD-05: Multiplayer sync state ───────────────────────────────────────
  // Sync state extracted to useBoardSync
  var _sync = useBoardSync(showToast);
  var syncObj = _sync.syncObj; var setSyncObj = _sync.setSyncObj;
  var syncStatus = _sync.syncStatus; var setSyncStatus = _sync.setSyncStatus;
  var roomCode = _sync.roomCode; var setRoomCode = _sync.setRoomCode;
  var showJoin = _sync.showJoin; var setShowJoin = _sync.setShowJoin;
  var joinInput = _sync.joinInput; var setJoinInput = _sync.setJoinInput;
  var connectAsHost = _sync.connectAsHost;
  var disconnectSync = _sync.disconnectSync;

  // TBL-01: GM handles player_hello — auto-create player slot with incoming name
  // Effect placed here so syncObj, addPlayer, showToast are all declared above
  useEffect(function() {
    if (!syncObj || !syncObj.ws || syncObj.role !== 'gm') return;
    function onMessage(event) {
      var data; try { data = JSON.parse(event.data); } catch(e) { return; }
      if (data.type === 'player_hello' && data.name) {
        var name = String(data.name).slice(0, 30);
        addPlayer(name);
        showToast('\uD83D\uDC4B ' + name + ' joined');
      }
    }
    syncObj.ws.addEventListener('message', onMessage);
    return function() { syncObj.ws.removeEventListener('message', onMessage); };
  }, [syncObj]);

  // MOB-15: mobile list view toggle
  var _mob = useState(false); var mobileListView = _mob[0]; var setMobileListView = _mob[1];

  // TBL-01: player-side name for waiting banner
  var _pjn = useState(''); var playerJoinName = _pjn[0]; var setPlayerJoinName = _pjn[1];
  var _pjSent = useState(false); var playerJoinSent = _pjSent[0]; var setPlayerJoinSent = _pjSent[1];

  // ── BRD-03: FP tracker state (loaded from IDB) ────────────────────────────
  var _fpState = useState(null); var fpState = _fpState[0]; var setFpState = _fpState[1];

  // ── BRD-02: Dice floater — players list from FP state for skill rolling ──
  var boardPlayers = fpState ? (fpState.pcs || []).map(function(pc) {
    return {id: pc.id, name: pc.name, skills: pc.skills || []};
  }) : [];
  var _boardSelPlayer = useState(null); var boardSelPlayer = _boardSelPlayer[0]; var setBoardSelPlayer = _boardSelPlayer[1];

  var _pan = useState({x: 0, y: 0});
  var pan = _pan[0];
  var setPan = _pan[1];

  // Drag state — refs to avoid stale closures
  var dragRef = useRef(null);
  var panRef = useRef(null);   // canvas pan state
  var canvasRef = useRef(null);
  var lastRemovedRef = useRef(null);
  var lastRerolledRef = useRef(null); // {id, prev} — undo last reroll
  var lastPlacedRef = useRef({x: 60, y: 60, col: 0}); // cascade placement
  var cardsRef = useRef(cards);
  cardsRef.current = cards;

  // ── Derived ────────────────────────────────────────────────────────────────
  var campMeta = getWorldMeta(campId);
  var tables = getWorldTables(campId);
  var canvasKey = mode === 'prep' ? BOARD_CANVAS_PREP_KEY : BOARD_CANVAS_PLAY_KEY;
  var campCanvasKey = canvasKey + '_' + campId;

  // ── Effects ────────────────────────────────────────────────────────────────

  // Set data-campaign so world CSS vars apply to the card components
  useEffect(function() {
    if (campId) document.documentElement.setAttribute('data-campaign', campId);
    return function() { document.documentElement.removeAttribute('data-campaign'); };
  }, [campId]);

  // Theme restore
  useEffect(function() {
    try {
      var p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      var t = p.theme || localStorage.getItem('fate_theme') || 'dark';
      setTheme(t);
      document.documentElement.setAttribute('data-theme', t);
    } catch(e) {}
  }, []);

  // Online/offline
  useEffect(function() {
    function goOnline()  { setIsOnline(true); }
    function goOffline() { setIsOnline(false); }
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return function() {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Load canvas from IDB
  useEffect(function() {
    if (typeof DB === 'undefined') { setLoaded(true); return; }
    DB.loadSession(campCanvasKey).then(function(saved) {
      if (saved && Array.isArray(saved.cards)) {
        setCards(saved.cards);
      }
      setLoaded(true);
    }).catch(function() { setLoaded(true); });
  }, [campCanvasKey]);

  // Load pin count from IDB
  useEffect(function() {
    if (typeof DB === 'undefined') return;
    DB.loadSession('pinned_board_' + campId).then(function(saved) {
      if (saved && typeof saved.count === 'number') setPinCount(saved.count);
    }).catch(function() {});
  }, [campId]);

  // ── Load FP state from IDB on mount ──────────────────────────────────────────
  useEffect(function() {
    if (typeof DB === 'undefined') return;
    DB.loadSession(BOARD_FP_KEY + '_' + campId).then(function(saved) {
      if (saved && saved.pcs) setFpState(saved);
    }).catch(function() {});
  }, [campId]);

  // ── Persist FP to IDB ───────────────────────────────────────────────────────
  function persistFP(next) {
    if (typeof DB === 'undefined' || !DB) return;
    DB.saveSession(BOARD_FP_KEY + '_' + campId, next).catch(function() {});
  }


  // ── Persist canvas to IDB ─────────────────────────────────────────────────
  function persistCanvas(nextCards) {
    if (typeof DB === 'undefined') return;
    DB.saveSession(campCanvasKey, {cards: nextCards, ts: Date.now()}).catch(function() {});
  }


  // ── Theme toggle ──────────────────────────────────────────────────────────
  function toggleTheme() {
    var next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      var p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      p.theme = next;
      localStorage.setItem('fate_prefs_v1', JSON.stringify(p));
    } catch(e) {}
  }

  // ── BRD-05: Multiplayer sync ───────────────────────────────────────────────

  // EXP-04: Export board canvas as JSON file
  function exportCanvas() {
    if (typeof DB === 'undefined' || !DB.exportCanvasState) { showToast('Export unavailable'); return; }
    var fname = campMeta.name.replace(/\s+/g,'-').toLowerCase() + '-' + mode + '-board';
    DB.exportCanvasState(campCanvasKey, fname).then(function() {
      showToast('Board exported');
    }).catch(function(err) {
      showToast(err && err.message ? err.message : 'Export failed');
    });
  }

  function importCanvas() {
    if (typeof DB === 'undefined' || !DB.importCanvasState) { showToast('Import unavailable'); return; }
    DB.importCanvasState().then(function(data) {
      if (!data || !data.state || !Array.isArray(data.state.cards)) {
        showToast('Invalid board file');
        return;
      }
      setCards(data.state.cards);
      persistCanvas(data.state.cards);
      showToast('Board imported \u2014 ' + data.state.cards.length + ' cards loaded');
    }).catch(function(err) {
      if (err && err.message && err.message !== 'No file selected') {
        showToast('Import failed: ' + err.message);
      }
    });
  }


  // ── Generate card ─────────────────────────────────────────────────────────
  function generateCard(genId, x, y) {
        if (genId === 'label') {
      var lp2 = lastPlacedRef.current;
      var newLabel = {
        id: boardUid(), genId: 'label', text: 'Section',
        x: x !== undefined ? x : lp2.x,
        y: y !== undefined ? y : Math.max(0, lp2.y - 24),
        z: Date.now(), ts: Date.now(), styleIdx: 0,
      };
      setCards(function(prev) { var next = prev.concat([newLabel]); persistCanvas(next); return next; });
      showToast('Section label added — double-click to rename');
      return;
    }
if (genId === 'sticky') {
      var sc = STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];
      var colorIdx = STICKY_COLORS.indexOf(sc);
      var card = {
        id: boardUid(),
        genId: 'sticky',
        text: '\u201CNew Aspect\u201D',
        colorIdx: colorIdx,
        rotation: (Math.random() * 6 - 3),
        x: x !== undefined ? x : (80 + Math.random() * 400),
        y: y !== undefined ? y : (80 + Math.random() * 300),
        z: Date.now(),
        ts: Date.now(),
      };
      setCards(function(prev) {
        var next = prev.concat([card]);
        persistCanvas(next);
        return next;
      });
      showToast('Aspect sticky added');
      return;
    }

    var t = tables;
    var partySize = 4;
    try {
      if (typeof mergeUniversal === 'function' && typeof UNIVERSAL_TABLES !== 'undefined') {
        t = mergeUniversal(t);
      }
    } catch(e) {}

    var data = null;
    try {
      if (typeof generate === 'function') {
        data = generate(genId, t, partySize);
      }
    } catch(e) {
      console.warn('[Board] generate failed:', e);
    }
    if (!data) { showToast('Generation failed'); return; }

    var genMeta = (GENERATORS || []).find(function(g) { return g.id === genId; }) || {};
    // Cascade placement — grid layout unless position explicitly given
    var cardX, cardY;
    if (x !== undefined) {
      cardX = x; cardY = y;
    } else {
      var lp = lastPlacedRef.current;
      cardX = lp.x;
      cardY = lp.y;
      // Advance: 4 columns of 220px, then wrap row at 200px height
      lp.col = (lp.col + 1) % 4;
      if (lp.col === 0) { lp.x = 60; lp.y += 200; }
      else { lp.x += 220; }
    }
    var card = {
      id: boardUid(),
      genId: genId,
      title: extractCardTitle(genId, data),
      summary: extractCardSummary(genId, data),
      tags: extractCardTags(genId, data),
      data: data,
      x: cardX,
      y: cardY,
      z: Date.now(),
      ts: Date.now(),
      gmOnly: false,
    };

    setCards(function(prev) {
      var next = prev.concat([card]);
      persistCanvas(next);
      return next;
    });
    showToast('Generated: ' + (genMeta.icon || '') + ' ' + (genMeta.label || genId));
  }

  // ── Select generator (left panel click = generate immediately) ────────────
  function selectGen(genId) {
    setActiveGen(genId);
    generateCard(genId);
  }

  // ── Update card fields (used by sticky edit) ────────────────────────────
  function updateCard(id, patch) {
    setCards(function(prev) {
      var next = prev.map(function(c) { return c.id === id ? Object.assign({}, c, patch) : c; });
      persistCanvas(next);
      return next;
    });
  }

  // ── Delete card ───────────────────────────────────────────────────────────
  function deleteCard(id) {
    setCards(function(prev) {
      var removing = prev.find(function(c) { return c.id === id; });
      if (removing) lastRemovedRef.current = removing;
      var next = prev.filter(function(c) { return c.id !== id; });
      persistCanvas(next);
      return next;
    });
    showToast('Deleted \u2014 Ctrl+Z to undo');
  }

  // ── Reroll card ───────────────────────────────────────────────────────────
  function rerollCard(id) {
    var existing = cardsRef.current.find(function(c) { return c.id === id; });
    if (!existing || existing.genId === 'sticky') return;
    var t = tables;
    try {
      if (typeof mergeUniversal === 'function' && typeof UNIVERSAL_TABLES !== 'undefined') {
        t = mergeUniversal(t);
      }
    } catch(e) {}
    var data = null;
    try {
      if (typeof generate === 'function') data = generate(existing.genId, t, 4);
    } catch(e) {}
    if (!data) return;
    // Save prev for undo
    lastRerolledRef.current = {id: id, prev: existing};
    setCards(function(prev) {
      var next = prev.map(function(c) {
        if (c.id !== id) return c;
        return Object.assign({}, c, {
          title: extractCardTitle(existing.genId, data),
          summary: extractCardSummary(existing.genId, data),
          tags: extractCardTags(existing.genId, data),
          data: data,
          ts: Date.now(),
        });
      });
      persistCanvas(next);
      return next;
    });
    showToast('Rerolled — Ctrl+Z to undo');
  }

  // ── Pin card to Table (shared IDB) ────────────────────────────────────────
  function pinCard(card) {
    if (typeof DB === 'undefined') { showToast('Pinned (no DB)'); return; }
    // Load existing pinned cards, append, save back
    DB.loadSession('prep_table_pinned_' + campId).then(function(saved) {
      var current = (saved && Array.isArray(saved)) ? saved : [];
      var alreadyPinned = current.some(function(c) { return c.id === card.id; });
      if (alreadyPinned) { showToast('Already pinned'); return; }
      var pinned = current.concat([{
        id: card.id,
        genId: card.genId,
        title: card.title,
        data: card.data,
        ts: card.ts,
      }]);
      DB.saveSession('prep_table_pinned_' + campId, pinned).catch(function() {});
      var newCount = pinned.length;
      setPinCount(newCount);
      DB.saveSession('pinned_board_' + campId, {count: newCount}).catch(function() {});
      showToast('\uD83D\uDCCC Pinned to Table');
    }).catch(function() {
      showToast('Pinned (could not save)');
    });
  }

  // ── Drag ─────────────────────────────────────────────────────────────────
  function onDragStart(e, cardId) {
    if (e.button !== 0) return;
    var canvas = canvasRef.current;
    var r = canvas.getBoundingClientRect();
    var card = cardsRef.current.find(function(c) { return c.id === cardId; });
    if (!card) return;

    // Bring to front
    var topZ = Date.now();
    setCards(function(prev) {
      return prev.map(function(c) { return c.id === cardId ? Object.assign({}, c, {z: topZ}) : c; });
    });

    dragRef.current = {
      cardId: cardId,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startCardX: card.x,
      startCardY: card.y,
      moved: false,
    };
    e.preventDefault();
  }

  useEffect(function() {
    function onMouseMove(e) {
      // Card drag
      if (dragRef.current) {
        var dx = e.clientX - dragRef.current.startMouseX;
        var dy = e.clientY - dragRef.current.startMouseY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true;
        var newX = dragRef.current.startCardX + dx / zoom;
        var newY = dragRef.current.startCardY + dy / zoom;
        var id = dragRef.current.cardId;
        setCards(function(prev) {
          return prev.map(function(c) {
            return c.id === id ? Object.assign({}, c, {x: newX, y: newY}) : c;
          });
        });
      }
      // Canvas pan
      if (panRef.current) {
        var pdx = e.clientX - panRef.current.startX;
        var pdy = e.clientY - panRef.current.startY;
        setPan({x: panRef.current.origX + pdx, y: panRef.current.origY + pdy});
      }
    }
    function onMouseUp() {
      if (dragRef.current) {
        var moved = dragRef.current.moved;
        dragRef.current = null;
        if (moved) persistCanvas(cardsRef.current);
      }
      panRef.current = null;
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return function() {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [zoom]);

  // ── Zoom ─────────────────────────────────────────────────────────────────
  function changeZoom(delta) {
    setZoom(function(z) { return Math.min(2, Math.max(0.25, Math.round((z + delta) * 100) / 100)); });
  }

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(function() {
    function onKey(e) {
      var tag = (e.target || {}).tagName || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (dossierCard) {
        if (e.key === 'Escape') setDossierCard(null);
        return;
      }
      if (e.key === 'Escape') return;
      if (e.code === 'Space' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        generateCard(activeGen);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (lastRemovedRef.current) {
          var restored = lastRemovedRef.current;
          lastRemovedRef.current = null;
          setCards(function(prev) {
            var next = prev.concat([restored]);
            persistCanvas(next);
            return next;
          });
          showToast('Delete undone');
        } else if (lastRerolledRef.current) {
          var rerollUndo = lastRerolledRef.current;
          lastRerolledRef.current = null;
          setCards(function(prev) {
            var next = prev.map(function(c) { return c.id === rerollUndo.id ? rerollUndo.prev : c; });
            persistCanvas(next);
            return next;
          });
          showToast('Reroll undone');
        }
      } else if (e.key === 'g' || e.key === 'G') {
        var allGens = BOARD_GEN_GROUPS.reduce(function(acc, g) { return acc.concat(g.gens); }, []);
        var idx = allGens.findIndex(function(g) { return g.id === activeGen; });
        var next = allGens[(idx + 1) % allGens.length];
        setActiveGen(next.id);
        showToast('Generator: ' + next.label);
      }
    }
    document.addEventListener('keydown', onKey);
    return function() { document.removeEventListener('keydown', onKey); };
  }, [activeGen, dossierCard, zoom]);

  // ── Context menu (right-click on canvas) ─────────────────────────────────
  var _ctx = useState(null);
  var ctx = _ctx[0];
  var setCtx = _ctx[1];

  function onCanvasContextMenu(e) {
    if (e.target.closest('.board-card') || e.target.closest('.board-sticky')) return;
    e.preventDefault();
    var canvas = canvasRef.current;
    var r = canvas.getBoundingClientRect();
    setCtx({
      screenX: e.clientX - r.left,
      screenY: e.clientY - r.top,
      canvasX: (e.clientX - r.left - pan.x) / zoom,
      canvasY: (e.clientY - r.top - pan.y) / zoom,
    });
  }

  function ctxGenerate(genId) {
    if (!ctx) return;
    generateCard(genId, ctx.canvasX, ctx.canvasY);
    setCtx(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return h('div', {
    className: 'board-app',
    'data-theme': theme,
    'data-mode': mode,
    onClick: function() { setCtx(null); },
  },
    // Topbar
    h(BoardTopbar, {
      campMeta: campMeta,
      mode: mode,
      onModeChange: function(m) {
        persistCanvas(cards);
        setMode(m);
      },
      pinCount: pinCount,
      theme: theme,
      onToggleTheme: toggleTheme,
      campId: campId,
      onCampChange: function(newId) {
        persistCanvas(cards);
        window.location.href = 'campaigns/board.html?world=' + newId;
      },
      isOnline: isOnline,
      leftOpen: leftOpen,
      onToggleLeft: function() { setLeftOpen(function(v) { return !v; }); },
      showDice: showDice,
      onToggleDice: function() { setShowDice(function(v) { return !v; }); },
      showFP: showFP,
      onToggleFP: function() { setShowFP(function(v) { return !v; }); },
      syncStatus: syncStatus,
      roomCode: roomCode,
      onHost: connectAsHost,
      onDisconnect: disconnectSync,
      onExportCanvas: exportCanvas,
      onImportCanvas: importCanvas,
      cards: cards,
      campName: campMeta.name,
      mobileListView: mobileListView,
      onToggleMobileList: function() { setMobileListView(function(v) { return !v; }); },
      onPrint: function() {
        if (typeof DB === 'undefined' || !DB.printCards) return;
        var printable = cards.filter(function(card) {
          return card.genId && card.genId !== 'sticky' && card.genId !== 'label' && card.data;
        }).map(function(card) {
          return {genId: card.genId, title: card.title, summary: card.summary, tags: card.tags || [], data: card.data};
        });
        if (!printable.length) { showToast('No cards to print'); return; }
        DB.printCards(printable, campMeta.name);
        showToast('Opening print view…');
      },
    }),

    h('div', {className: 'board-body'},

      // MOB-02: Mobile close is handled by canvas onMouseDown (MOB-06)
      // MOB-02: Left panel — hidden on mobile when leftOpen is false
      h('div', {className: 'blp-wrap' + (leftOpen ? '' : ' blp-hidden')},
        mode === 'play'
          ? h(BoardPlayPanel, {
              players: players,
              selPlayer: selPlayer,
              onSel: setSelPlayer,
              onUpd: updPlayer,
              onAdd: addPlayer,
            })
          : h(BoardLeftPanel, {
              activeGen: activeGen,
              onSelectGen: selectGen,
              campId: campId,
              activeTab: leftTab,
              onTabChange: setLeftTab,
              campName: campMeta.name,
            })
      ),

      // Right column: TurnBar (play mode) + canvas
      h('div', {className: 'board-canvas-col' + (mobileListView ? ' bcol-list-mode' : '')},

        // MOB-15: mobile list view
        mobileListView && h(BoardMobileList, {
          cards: cards,
          campId: campId,
          onOpen: function(card) { setDossierCard(card); },
          onRemove: deleteCard,
        }),

        // Play mode turn bar
        mode === 'play' && players.length > 0 && h(BoardTurnBar, {
          players: players,
          order: order,
          setOrder: function(fn) {
            var next = typeof fn === 'function' ? fn(order) : fn;
            setOrder(next);
            persistPlayState(null, null, next);
          },
          onToggleActed: toggleActed,
          round: round,
          onNewRound: newRound,
          onPrevRound: prevRound,
          roundFlash: roundFlash,
        }),

      // Canvas area
      h('div', {
        id: 'board-canvas',
        className: 'board-canvas-wrap' + (panRef.current ? ' board-panning' : ''),
        ref: canvasRef,
        onContextMenu: onCanvasContextMenu,
        onMouseDown: function(e) {
          // MOB-06: tapping canvas while panel open on mobile closes the panel
          if (leftOpen && window.matchMedia('(max-width:640px)').matches) {
            setLeftOpen(false);
            return; // let the close animate before further interaction
          }
          // Only pan on direct canvas click (not card), middle mouse or left on background
          if (e.target.closest('.board-card') || e.target.closest('.board-sticky')) return;
          if (e.target.closest('.board-ctx') || e.target.closest('.board-zoom')) return;
          if (e.button !== 0 && e.button !== 1) return;
          panRef.current = {startX: e.clientX, startY: e.clientY, origX: pan.x, origY: pan.y};
          e.preventDefault();
        },
        // Wheel zoom centred on cursor
        onWheel: function(e) {
          e.preventDefault();
          var canvas = canvasRef.current;
          if (!canvas) return;
          var r = canvas.getBoundingClientRect();
          var mx = e.clientX - r.left;
          var my = e.clientY - r.top;
          var delta = e.deltaY < 0 ? 1.1 : 0.9;
          setZoom(function(z) {
            var nz = Math.min(2, Math.max(0.25, Math.round(z * delta * 100) / 100));
            // Adjust pan so zoom centres on cursor
            setPan(function(p) { return {x: mx - (mx - p.x) * (nz / z), y: my - (my - p.y) * (nz / z)}; });
            return nz;
          });
        },
      },
        // Dot grid
        h('div', {className: 'board-dot-grid'}),

        // Zoomable canvas layer
        h('div', {
          className: 'board-canvas-layer',
          style: {
            transform: 'translate(' + pan.x + 'px,' + pan.y + 'px) scale(' + zoom + ')',
            transformOrigin: '0 0',
          },
        },
          cards.map(function(card) {
            if (card.genId === 'label') {
              return h(BoardLabel, {
                key: card.id, card: card,
                onDelete: deleteCard, onUpdate: updateCard, onDragStart: onDragStart,
              });
            }
            return h(BoardCard, {
              key: card.id,
              card: card,
              onDelete: deleteCard,
              onReroll: rerollCard,
              onPin: pinCard,
              onOpen: setDossierCard,
              onDragStart: onDragStart,
              onUpdate: updateCard,
            });
          })
        ),

        // Empty state
        // TBL-01: Waiting banner for player who just joined
        syncObj && syncObj.role === 'player' && syncStatus === 'connected' && !playerJoinSent &&
          h('div', {className: 'board-waiting-banner'},
            h('div', {className: 'bwb-icon'}, '\uD83C\uDF10'),
            h('div', {className: 'bwb-title'}, 'Connected to GM'),
            h('div', {className: 'bwb-sub'}, 'Enter your name so the GM can add you to the tracker:'),
            h('div', {className: 'bwb-row'},
              h('input', {
                type: 'text',
                className: 'bwb-input',
                placeholder: 'Your name\u2026',
                value: playerJoinName,
                'aria-label': 'Your player name',
                autoFocus: true,
                maxLength: 30,
                onChange: function(e) { setPlayerJoinName(e.target.value); },
                onKeyDown: function(e) {
                  if (e.key === 'Enter' && playerJoinName.trim()) {
                    syncObj.ws.send(JSON.stringify({type:'player_hello',name:playerJoinName.trim()}));
                    setPlayerJoinSent(true);
                    showToast('\uD83D\uDC4B Sent your name to the GM');
                  }
                },
              }),
              h('button', {
                className: 'bwb-btn',
                disabled: !playerJoinName.trim(),
                onClick: function() {
                  if (!playerJoinName.trim()) return;
                  syncObj.ws.send(JSON.stringify({type:'player_hello',name:playerJoinName.trim()}));
                  setPlayerJoinSent(true);
                  showToast('\uD83D\uDC4B Sent your name to the GM');
                },
              }, 'Join')
            )
          ),

        syncObj && syncObj.role === 'player' && syncStatus === 'connected' && playerJoinSent &&
          h('div', {className: 'board-waiting-banner board-waiting-sent'},
            h('div', {className: 'bwb-icon'}, '\u23F3'),
            h('div', {className: 'bwb-title'}, 'Waiting for GM\u2026'),
            h('div', {className: 'bwb-sub'}, 'The GM will add you to the tracker shortly.')
          ),

        cards.length === 0 && loaded && h('div', {className: 'board-empty'},
          h('div', {className: 'board-empty-icon'}, '\uD83C\uDFB2'),
          h('div', {className: 'board-empty-title'}, 'Canvas is empty'),
          h('div', {className: 'board-empty-desc'},
            'Click any generator in the left panel to place a card.',
            h('br', null),
            'Right-click anywhere to generate in place.'
          )
        ),

        // Context menu
        // Context menu
        ctx && h('div', {
          className: 'board-ctx',
          role: 'menu',
          'aria-label': 'Generate card',
          style: {left: ctx.screenX + 'px', top: ctx.screenY + 'px'},
          onClick: function(e) { e.stopPropagation(); },
          onKeyDown: function(e) {
            if (e.key === 'Escape') { setCtx(null); return; }
            var items = Array.from(e.currentTarget.querySelectorAll('[role="menuitem"]'));
            var idx = items.indexOf(document.activeElement);
            if (e.key === 'ArrowDown') { e.preventDefault(); if (idx < items.length-1) items[idx+1].focus(); }
            if (e.key === 'ArrowUp')   { e.preventDefault(); if (idx > 0) items[idx-1].focus(); }
          },
        },
          h('div', {className: 'board-ctx-section', role: 'none'}, 'Generate here'),
          [
            {id: 'npc_minor', icon: '\uD83E\uDDD1', label: 'Minor NPC'},
            {id: 'npc_major', icon: '\uD83D\uDC51', label: 'Major NPC'},
            {id: 'scene',     icon: '\uD83D\uDD25', label: 'Scene Setup'},
            {id: 'encounter', icon: '\u2694',        label: 'Encounter'},
            {id: 'compel',    icon: '\u21A9',        label: 'Compel'},
            {id: 'sticky',    icon: '\uD83D\uDCDD', label: 'Aspect Sticky'},
            {id: 'label',     icon: '🔖', label: 'Section Label'},
          ].map(function(g) {
            return h('div', {key: g.id, className: 'board-ctx-item', role: 'menuitem', tabIndex: 0,
              onClick: function() { ctxGenerate(g.id); },
              onKeyDown: function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ctxGenerate(g.id); } }
            },
              h('span', {className: 'board-ctx-icon', 'aria-hidden': 'true'}, g.icon),
              g.label
            );
          }),
          h('div', {className: 'board-ctx-sep', role: 'separator'}),
          h('div', {className: 'board-ctx-item', role: 'menuitem', tabIndex: 0,
            onClick: function() { setCtx(null); },
            onKeyDown: function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCtx(null); } }
          },
            h('span', {className: 'board-ctx-icon', 'aria-hidden': 'true'}, '\u2715'), 'Cancel'
          )
        ),


        // Zoom controls
        h('div', {className: 'board-zoom'},
          h('button', {className: 'board-zoom-btn', onClick: function() { changeZoom(-0.1); }, 'aria-label': 'Zoom out'}, '\u2212'),
          h('div', {className: 'board-zoom-pct'}, Math.round(zoom * 100) + '%'),
          h('button', {className: 'board-zoom-btn', onClick: function() { changeZoom(0.1); }, 'aria-label': 'Zoom in'}, '+')
        ),

        // Toast
        toast && h('div', {className: 'board-toast', key: toast}, toast)
      )
      ) // end board-canvas-col
    ),

    // BRD-02: Dice floater
    showDice && h('div', {
      className: 'board-floater board-dice-floater',
      onClick: function(e) { e.stopPropagation(); },
    },
      h('div', {className: 'board-floater-hdr'},
        h('span', {className: 'board-floater-title'}, '\uD83C\uDFB2 Dice'),
        h('button', {
          className: 'board-floater-close',
          onClick: function() { setShowDice(false); },
          'aria-label': 'Close dice roller',
        }, '\u2715')
      ),
      h(TpDicePanel, {
        players: boardPlayers,
        selId: boardSelPlayer,
        spendFP: function(id) {
          // Deduct 1 FP from the selected player in FP state
          if (!fpState) return;
          var updated = Object.assign({}, fpState, {
            pcs: fpState.pcs.map(function(pc) {
              return pc.id === id ? Object.assign({}, pc, {current: Math.max(0, pc.current - 1)}) : pc;
            })
          });
          setFpState(updated);
          persistFP(updated);
        },
        onRoll: function(r) {
          showToast(r.who + ' \u00b7 ' + r.skill + ' \u2192 ' + (r.total >= 0 ? '+' : '') + r.total);
          if (syncObj && syncObj.connected) syncObj.broadcastRoll(r);
        },
      })
    ),

    // BRD-03: FP tracker floater
    showFP && h('div', {
      className: 'board-floater board-fp-floater',
      onClick: function(e) { e.stopPropagation(); },
    },
      h('div', {className: 'board-floater-hdr'},
        h('span', {className: 'board-floater-title'}, '\u25CE Fate Points'),
        h('button', {
          className: 'board-floater-close',
          onClick: function() { setShowFP(false); },
          'aria-label': 'Close Fate Point tracker',
        }, '\u2715')
      ),
      fpState && h(FatePointTracker, {
        state: fpState,
        onUpdate: function(next) {
          setFpState(next);
          persistFP(next);
        },
      })
    ),

    // BRD-05: Join modal (Play mode)
    showJoin && h('div', {
      className: 'bd-backdrop',
      onClick: function(e) { if (e.target === e.currentTarget) setShowJoin(false); },
    },
      h('div', {
        className: 'bd-modal',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': 'Join live session',
        style: {maxWidth: 360},
      },
        h('button', {className: 'bd-close', onClick: function() { setShowJoin(false); }, 'aria-label': 'Close'}, '\u2715'),
        h('div', {style: {padding: '16px 20px 20px'}},
          h('div', {style: {fontSize: 18, fontWeight: 800, marginBottom: 8}}, '\uD83C\uDF10 Join Session'),
          h('div', {style: {fontSize: 12, color: 'var(--text-muted)', marginBottom: 14}},
            'Enter the room code from your GM.'
          ),
          h('input', {
            type: 'text',
            value: joinInput,
            onChange: function(e) { setJoinInput(e.target.value.toUpperCase().slice(0, 4)); },
            placeholder: 'XXXX',
            autoFocus: true,
            style: {
              width: '100%', padding: '10px 14px', borderRadius: 8,
              background: 'var(--inset)', border: '1px solid var(--border)',
              color: 'var(--text)', fontSize: 24, fontWeight: 800,
              letterSpacing: '0.2em', textAlign: 'center', fontFamily: 'monospace',
            },
            onKeyDown: function(e) {
              if (e.key === 'Enter' && joinInput.length === 4) {
                if (typeof createTableSync === 'undefined') { showToast('⚠ Offline'); return; }
                var s = createTableSync(joinInput, 'player',
                  function() {},
                  function() {},
                  function(msg) { showToast(msg); },
                  function() {}
                );
                setRoomCode(joinInput);
                setRoomCode(joinInput);
                if (s) { setSyncObj(s); setSyncStatus('connecting'); setShowJoin(false);
                  s.ws.addEventListener('open', function() { setSyncStatus('connected'); showToast('✅ Joined room ' + joinInput); });
                  s.ws.addEventListener('close', function() { setSyncStatus('offline'); });
                }
              }
            },
          }),
          h('button', {
            style: {marginTop: 14, width: '100%', height: 44, borderRadius: 8, border: 'none',
              background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'var(--font-ui)'},
            disabled: joinInput.length !== 4,
            onClick: function() {
              if (typeof createTableSync === 'undefined' || joinInput.length !== 4) return;
              var s = createTableSync(joinInput, 'player',
                function() {},
                function() {},
                function(msg) { showToast(msg); },
                function() {}
              );
              if (s) { setSyncObj(s); setSyncStatus('connecting'); setShowJoin(false);
                s.ws.addEventListener('open', function() { setSyncStatus('connected'); showToast('✅ Joined room ' + joinInput); });
                s.ws.addEventListener('close', function() { setSyncStatus('offline'); });
              }
            },
          }, 'Join'),
        )
      )
    ),

    // Dossier modal
    dossierCard && h(BoardDossier, {
      card: dossierCard,
      onClose: function() { setDossierCard(null); },
      onReroll: rerollCard,
      onPin: pinCard,
      onOpenHelp: function() { setLeftTab('help'); setDossierCard(null); },
      campName: campMeta.name,
      campId: campId,
    })
  );
}
