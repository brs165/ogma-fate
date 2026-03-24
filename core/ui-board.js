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
      {id: 'npc_minor',   label: 'Minor NPC',      sub: 'name · aspect · weakness',     icon: '🧑'},
      {id: 'npc_major',   label: 'Major NPC',      sub: '5 aspects · skills · stunts',  icon: '👑'},
      {id: 'backstory',   label: 'PC Backstory',   sub: 'hook · secret · connection',   icon: '🎭'},
    ]
  },
  {
    id: 'scenes', label: 'Scenes',
    gens: [
      {id: 'scene',       label: 'Scene Setup',    sub: 'aspects · zones · framing',    icon: '🔥'},
      {id: 'encounter',   label: 'Encounter',      sub: 'opposition · aspects · stakes',icon: '⚔'},
      {id: 'complication',label: 'Complication',   sub: 'aspect that makes things harder',icon: '⚠'},
    ]
  },
  {
    id: 'pacing', label: 'Pacing',
    gens: [
      {id: 'challenge',   label: 'Challenge',      sub: 'sequence of overcome rolls',   icon: '🎯'},
      {id: 'contest',     label: 'Contest',        sub: 'race to 3 victories',           icon: '🏆'},
      {id: 'obstacle',    label: 'Obstacle',       sub: 'passive opposition · disable',  icon: '🛡'},
      {id: 'countdown',   label: 'Countdown',      sub: 'ticking clock · trigger',       icon: '⏳'},
      {id: 'constraint',  label: 'Constraint',     sub: 'rule that limits the scene',    icon: '🔒'},
    ]
  },
  {
    id: 'world', label: 'World',
    gens: [
      {id: 'campaign',    label: 'Campaign Frame', sub: 'issues · factions · themes',   icon: '🏰'},
      {id: 'seed',        label: 'Adventure Seed', sub: '3-scene sketch · opposition',  icon: '🌿'},
      {id: 'faction',     label: 'Faction',        sub: 'goal · method · weakness',     icon: '🚩'},
      {id: 'compel',      label: 'Compel',         sub: 'make an aspect cause trouble',  icon: '↩'},
      {id: 'consequence', label: 'Consequence',    sub: 'named lasting harm aspect',     icon: '❤'},
    ]
  },
  {
    id: 'tools', label: 'Canvas Tools',
    separator: true,  // UX-13: visual break — these add canvas elements, not generated content
    gens: [
      {id: 'custom',  label: 'Custom Card',   sub: 'blank — fill in as you play',    icon: '✏️'},
      {id: 'sticky',  label: 'Aspect Sticky', sub: 'free-text aspect note',          icon: '📝'},
      {id: 'boost',   label: 'Boost',         sub: 'temp aspect — 1 invoke then gone', icon: '⚡'},
      {id: 'label',   label: 'Section Label', sub: 'organise your canvas',           icon: '🔖'},
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
  custom:       {stripe: '#888',    tc: '#555',    bg: '#f5f4f1', tagBg: '#f5f4f1', tagTc: '#444'},
  boost:        {stripe: '#f4b942', tc: '#b8860b', bg: '#fffbee', tagBg: '#fffbee', tagTc: '#9a6f00'},
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
  if (genId === 'custom') return data.title || 'Custom Card';
  return data.name || data.location || data.situation || data.title ||
         (data.aspects && data.aspects.high_concept) || genId;
}

function extractCardSummary(genId, data) {
  if (!data) return '';
  if (genId === 'custom') return data.body || '';
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
  if (genId === 'custom') {
    var typeLabel = {aspect:'Aspect',npc:'NPC',location:'Location',clue:'Clue',other:'Other'}[data.type] || 'Custom';
    return [typeLabel];
  }
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
            'aria-label': 'Edit label text',
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
  var onSendToTable = props.onSendToTable;
  var onRemoveFromTable = props.onRemoveFromTable;
  var onOpen = props.onOpen;
  var onDragStart = props.onDragStart;
  var onUpdate = props.onUpdate || function() {};
  var isOnTable = props.isOnTable || false;
  var mode = props.mode || 'prep';
  var campId = props.campId || '';

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
        : h('div', {className: 'board-sticky-text', title: 'Double-click to edit'}, card.text || '\u201CNew Aspect\u201D'),
      // INV-01: Free invoke pips (FCon p.24 — Create Advantage grants free invokes)
      h('div', {className: 'sticky-invokes', onClick: function(e){ e.stopPropagation(); }},
        h('span', {className: 'sticky-inv-label', style:{color: sc.label}}, 'Invokes'),
        [0,1,2,3].map(function(i) {
          var fi = card.freeInvokes || 0;
          var filled = i < fi;
          return h('button', {
            key: i,
            className: 'sticky-inv-pip' + (filled ? ' filled' : ''),
            style: {
              background: filled ? sc.label : 'transparent',
              borderColor: sc.label,
            },
            title: filled ? 'Use free invoke' : 'Empty',
            'aria-label': filled ? 'Use free invoke ' + (i+1) : 'Empty invoke slot ' + (i+1),
            onClick: function(e) {
              e.stopPropagation();
              if (filled) {
                onUpdate(card.id, {freeInvokes: Math.max(0, fi - 1)});
              }
            },
          });
        }),
        h('button', {
          className: 'sticky-inv-add',
          style: {color: sc.label, borderColor: sc.label},
          title: 'Add free invoke',
          'aria-label': 'Add free invoke',
          onClick: function(e) {
            e.stopPropagation();
            var fi = card.freeInvokes || 0;
            if (fi < 4) onUpdate(card.id, {freeInvokes: fi + 1});
          },
        }, '+')
      )
    );
  }

  // BST-01: Boost card — ephemeral, 1 free invoke, auto-expires
  var isBoost = card.genId === 'boost';
  if (isBoost) {
    var boostExpired = card.expired || false;
    var _bEditing = useState(false); var bEditing = _bEditing[0]; var setBEditing = _bEditing[1];
    var _bDraft = useState(card.text || ''); var bDraft = _bDraft[0]; var setBDraft = _bDraft[1];
    function commitBoostEdit() {
      setBEditing(false);
      if (bDraft !== card.text) onUpdate(card.id, {text: bDraft || 'New Boost'});
    }
    function useBoostInvoke(e) {
      e.stopPropagation();
      onUpdate(card.id, {freeInvokes: 0, expired: true});
    }
    return h('div', {
      className: 'board-boost' + (boostExpired ? ' boost-expired' : '') + (bEditing ? ' editing' : ''),
      style: {
        left: card.x + 'px', top: card.y + 'px',
        transform: bEditing ? 'rotate(0deg)' : 'rotate(' + (card.rotation || 0) + 'deg)',
        zIndex: card.z || 1,
      },
      onMouseDown: function(e) {
        if (bEditing) return;
        if (!e.target.closest('.bc-actions')) onDragStart(e, card.id);
      },
      tabIndex: bEditing ? -1 : 0,
      role: 'note',
      'aria-label': 'Boost: ' + (card.text || 'New Boost') + (boostExpired ? ' (expired)' : ''),
      onDoubleClick: function(e) { e.stopPropagation(); setBDraft(card.text || ''); setBEditing(true); },
      onKeyDown: function(e) {
        if (!bEditing && (e.key === 'Enter' || e.key === 'F2')) { e.preventDefault(); setBDraft(card.text || ''); setBEditing(true); }
        if (!bEditing && (e.key === 'Delete' || e.key === 'Backspace')) { e.preventDefault(); onDelete(card.id); }
      },
    },
      h('div', {className: 'bc-actions'},
        h('button', {className: 'bc-btn', title: 'Delete', onClick: function(e) { e.stopPropagation(); onDelete(card.id); }}, '\u2715')
      ),
      h('div', {className: 'boost-header'},
        h('span', {className: 'boost-icon'}, '\u26A1'),
        h('span', {className: 'boost-label'}, 'Boost')
      ),
      bEditing
        ? h('textarea', {
            className: 'board-sticky-input',
            value: bDraft, autoFocus: true, rows: 2,
            style: {background: 'transparent', color: '#5a4e00', border: 'none',
              borderBottom: '2px solid #f4b942', outline: 'none', width: '100%',
              resize: 'none', fontFamily: 'inherit', fontSize: 12, padding: 0, lineHeight: 1.5},
            onChange: function(e) { setBDraft(e.target.value); },
            onBlur: commitBoostEdit,
            onKeyDown: function(e) {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitBoostEdit(); }
              if (e.key === 'Escape') { setBEditing(false); }
            },
            onClick: function(e) { e.stopPropagation(); },
          })
        : h('div', {className: 'boost-text'}, card.text || '\u201CNew Boost\u201D'),
      h('div', {className: 'boost-invoke-row', onClick: function(e){ e.stopPropagation(); }},
        boostExpired
          ? h('span', {className: 'boost-expired-label'}, 'Expired \u2014 used')
          : h('button', {
              className: 'boost-use-btn',
              onClick: useBoostInvoke,
              title: 'Use free invoke \u2014 boost expires after use',
              'aria-label': 'Use boost free invoke',
            }, '\u25CF Use Invoke')
      )
    );
  }

  var title = card.title || '';
  var summary = card.summary || '';
  var tags = card.tags || [];
  var genLabel = (GENERATORS || []).find(function(g) { return g.id === card.genId; });

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
      card.genId !== 'custom' && h('button', {className: 'bc-btn', title: 'Reroll', onClick: function(e) { e.stopPropagation(); onReroll(card.id); }}, '\u21BB'),
      h('button', {className: 'bc-btn', title: 'Pin to Table', onClick: function(e) { e.stopPropagation(); onSendToTable(card); }}, '\uD83D\uDCCC'),
      h('button', {className: 'bc-btn', title: 'Delete', onClick: function(e) { e.stopPropagation(); onDelete(card.id); }}, '\u2715')
    ),
    // GM Screen: cv4Card inline at 65% scale
    h('div', {
      className: 'bc-cv4-wrap',
      // Custom cards: clicks inside the cv4 card are for editing, not opening dossier or dragging
      onMouseDown: card.genId === 'custom' ? function(e) { e.stopPropagation(); } : undefined,
      onClick:     card.genId === 'custom' ? function(e) { e.stopPropagation(); } : undefined,
    },
      card.data
        ? h('div', {className: 'bc-cv4-scaler'},
            renderCard(
              card.genId, card.data, campId,
              // Custom cards get a live onUpdate so inline edits persist immediately
              card.genId === 'custom'
                ? function(newData) {
                    var merged = Object.assign({}, card.data, newData);
                    onUpdate(card.id, {
                      data: merged,
                      title:   extractCardTitle('custom', merged),
                      summary: extractCardSummary('custom', merged),
                      tags:    extractCardTags('custom', merged),
                    });
                  }
                : null,
              [], null
            )
          )
        : h('div', {className: 'bc-inner'},
            h('div', {className: 'bc-type', style: {color: C.tc}},
              (GENERATORS || []).find(function(g){ return g.id === card.genId; }) ?
                ((GENERATORS || []).find(function(g){ return g.id === card.genId; }).icon + ' ' +
                 (GENERATORS || []).find(function(g){ return g.id === card.genId; }).label) : card.genId),
            h('div', {className: 'bc-title'}, card.title || '')
          )
    ),
    // GM Screen: "Put on table" / "On table" strip (PREP mode only)
    mode === 'prep' && h('div', {className: 'bc-table-strip'},
      isOnTable
        ? h(Fragment, null,
            h('span', {className: 'bc-on-table'}, '\u25CF\u00a0On table'),
            onRemoveFromTable && h('button', {
              className: 'bc-remove-table',
              onClick: function(e) { e.stopPropagation(); onRemoveFromTable(card.id); },
              'aria-label': 'Remove ' + (card.title || 'card') + ' from table',
              title: 'Remove from table',
            }, '\u2715')
          )
        : h('button', {
            className: 'bc-send-table',
            onClick: function(e) { e.stopPropagation(); onSendToTable(card); },
            'aria-label': 'Put ' + (card.title || 'card') + ' on table',
          }, '\u2192 Table')
    )
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
            'aria-label': sev + ' consequence',
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
  var onEndScene = props.onEndScene;
  var _drag = useState(null); var dragId = _drag[0]; var setDragId = _drag[1];
  var _over = useState(null); var overId = _over[0]; var setOverId = _over[1];
  var allActed = players.length > 0 && players.every(function(p) { return p.acted; });
  var orderedPlayers = order.map(function(id) {
    return players.find(function(p) { return p.id === id; });
  }).filter(Boolean);
  players.forEach(function(p) { if (order.indexOf(p.id) < 0) orderedPlayers.push(p); });
  var stressedCount = players.filter(function(p) { return (p.phy||[]).some(Boolean)||(p.men||[]).some(Boolean); }).length;

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
    allActed && h('div', {className: 'rs-all-acted'}, '✦ All acted — new round?'),
    // SCN-01: End Scene — clears stress per FCon p.30
    onEndScene && h('button', {className: 'board-scene-end', onClick: function() {
      if (!confirm('End scene?\nAll stress boxes cleared. Consequences and FP preserved.')) return;
      onEndScene();
    }, title: 'End scene \u2014 clears all stress (FCon p.30)', 'aria-label': 'End scene'},
      stressedCount > 0 ? '\u23F9 End Scene (' + stressedCount + ' stressed)' : '\u23F9 End Scene')
  );
}

// ── BoardPlayPanel — left panel content in Play mode (UNI-05: also shown in PREP as collapsed) ──
function BoardPlayPanel(props) {
  var players   = props.players;
  var selPlayer = props.selPlayer;
  var onSel     = props.onSel;
  var onUpd     = props.onUpd;
  var onAdd     = props.onAdd;
  var collapsed = props.collapsed; // UNI-05: true in PREP mode → compact accordion
  var _open = useState(false); var open = _open[0]; var setOpen = _open[1];

  // In PREP mode render as a compact accordion at the bottom of the left panel
  if (collapsed) {
    return h('div', {className: 'blp-roster-acc'},
      h('button', {
        className: 'blp-roster-hdr',
        onClick: function() { setOpen(function(v){ return !v; }); },
        'aria-expanded': String(open),
      },
        h('span', null, '\u{1F465}\u00a0Players'),
        players.length > 0 && h('span', {className: 'blp-roster-badge'}, String(players.length)),
        h('span', {className: 'blp-roster-chev', style: {
          display:'inline-block',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition:'transform .18s cubic-bezier(.34,1.56,.64,1)',
          fontSize: 10,
        }}, '\u203a')
      ),
      open && h('div', {className: 'blp-body blp-roster-body'},
        players.length === 0 && h('div', {style:{padding:'10px 8px',textAlign:'center',color:'var(--text-muted)',fontSize:11}},
          'No players yet. Add before session start.'
        ),
        players.map(function(p) {
          return h(BoardPlayerRow, {key:p.id, player:p, sel:selPlayer===p.id, onSel:onSel,
            onUpd:function(patch){onUpd(p.id,patch);}});
        }),
        h('button', {className:'rs-add-player','aria-label':'Add player',onClick:onAdd}, '+ Add Player')
      )
    );
  }

  // PLAY mode — full panel
  return h('div', {className: 'blp'},
    h('div', {className: 'blp-tabs'},
      h('span', {className: 'blp-tab active', style: {pointerEvents: 'none', color: 'var(--c-green,#30d158)'}}, '\u25B6 Play Mode')
    ),
    h('div', {className: 'blp-body'},
      players.length === 0 && h('div', {style: {padding: '16px 8px', textAlign: 'center',
        color: 'var(--text-muted)', fontSize: 12}},
        h('div', {style: {marginBottom: 8}}, '\uD83D\uDC65'),
        h('div', null, 'No players yet.'),
        h('div', {style: {fontSize: 11, marginTop: 4}}, 'Add players to track FP and stress.')
      ),
      players.map(function(p) {
        return h(BoardPlayerRow, {
          key: p.id, player: p, sel: selPlayer === p.id, onSel: onSel,
          onUpd: function(patch) { onUpd(p.id, patch); },
        });
      }),
      h('button', {className: 'rs-add-player', 'aria-label': 'Add player', onClick: onAdd}, '+ Add Player')
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
          group.separator
            ? h('div', {className: 'blp-separator'}, group.label)
            : h('div', {className: 'blp-group'}, group.label),
          group.gens.map(function(gen) {
            return h('button', {
              key: gen.id,
              className: 'blp-item' + (activeGen === gen.id ? ' active' : ''),
              onClick: function() { onSelectGen(gen.id); },
              title: gen.label + (gen.sub ? ' — ' + gen.sub : ''),
            },
              h('span', {className: 'blp-icon'}, gen.icon),
              h('div', {className: 'blp-label-wrap'},
                h('span', {className: 'blp-label'}, gen.label),
                gen.sub && h('span', {className: 'blp-sub'}, gen.sub)
              )
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
        {head: 'Major NPC', body: 'Full character. 5 aspects (High Concept, Trouble, 3 others), skill pyramid, stress tracks, all consequence slots. Treat like a PC.'},
        {head: 'Boss tip', body: 'Give bosses a unique stunt, an extra stress box, or a secret aspect revealed mid-fight.'},
      ]
    },
    {
      id: 'conflict', title: 'Challenges & Contests',
      content: [
        {head: 'Challenge', body: 'Series of overcome rolls. Each can succeed or fail independently. No active opposition.'},
        {head: 'Contest', body: 'Two sides race to 3 victories. Each exchange both roll \u2014 highest effort marks a victory; succeed with style (no one else did) = 2 victories. Tie = no victory + GM introduces a new situation aspect (unexpected twist, FCon p.33).'},
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

// ── BoardBinderPanel — UNI-02: Binder library inside BoardApp ────────────────
// Right panel in PREP mode. Shows Binder cards (from IDB) with filter strip and
// Drafting Tray. Mirrors the Binder panel in CampaignApp but lives in BoardApp.

var BINDER_FILTER_GROUPS = {
  people:    ['npc_minor','npc_major','pc','backstory'],
  scene:     ['scene','encounter','complication','seed'],
  story:     ['campaign','faction','compel','consequence'],
  mechanics: ['challenge','contest','obstacle','countdown','constraint'],
};

function BoardBinderPanel(props) {
  var campId      = props.campId;
  var campName    = props.campName || campId;
  var binderCards = props.binderCards || [];
  var trayCards   = props.trayCards  || [];
  var onAddToTray    = props.onAddToTray    || function(){};
  var onRemoveFromTray = props.onRemoveFromTray || function(){};
  var onSendTrayToCanvas = props.onSendTrayToCanvas || function(){};
  var onSendToCanvas = props.onSendToCanvas || function(){};
  var onExportCard   = props.onExportCard   || function(){};
  var onUnpin        = props.onUnpin        || function(){};

  var _filter = useState('all'); var filter = _filter[0]; var setFilter = _filter[1];

  var filters = [
    {id:'all',    label:'All'},
    {id:'people', label:'People'},
    {id:'scene',  label:'Scene'},
    {id:'story',  label:'Story'},
    {id:'mechanics', label:'Mech'},
  ];

  var visible = binderCards.filter(function(card) {
    if (filter === 'all') return true;
    return (BINDER_FILTER_GROUPS[filter] || []).indexOf(card.genId) !== -1;
  });

  return h('div', {className: 'bbp'},

    // Header
    h('div', {className: 'bbp-header'},
      h('span', {className: 'bbp-title'}, '\uD83D\uDCCB Binder'),
      binderCards.length > 0 && h('span', {className: 'bbp-count'}, String(binderCards.length))
    ),

    // Filter strip
    binderCards.length > 0 && h('div', {className: 'bbp-filters', role: 'group', 'aria-label': 'Filter by type'},
      filters.map(function(f) {
        var active = filter === f.id;
        return h('button', {
          key: f.id,
          className: 'bbp-filter-btn' + (active ? ' active' : ''),
          onClick: function() { setFilter(f.id); },
          'aria-pressed': String(active),
        }, f.label);
      })
    ),

    // Card list
    h('div', {className: 'bbp-list'},
      visible.length === 0 && h('div', {className: 'bbp-empty'},
        binderCards.length === 0
          ? 'Save cards from the generator to build your Binder.'
          : 'No cards match this filter.'
      ),
      visible.map(function(card) {
        var inTray = trayCards.some(function(c) { return c.id === card.id; });
        var d = card.data || {};
        var title = d.name || d.location || d.situation ||
                    (d.aspects && d.aspects.high_concept) || card.label || card.genId;
        var genMeta = (typeof GENERATORS !== 'undefined' ? GENERATORS : []).find(function(g){ return g.id === card.genId; }) || {};
        return h('div', {key: card.id, className: 'bbp-card'},
          // Mini identity row
          h('div', {className: 'bbp-card-id'},
            h('span', {className: 'bbp-card-icon', 'aria-hidden': 'true'}, genMeta.icon || '\u25C8'),
            h('span', {className: 'bbp-card-title'}, title)
          ),
          // Action row
          h('div', {className: 'bbp-card-actions'},
            h('button', {
              className: 'bbp-action' + (inTray ? ' in-tray' : ''),
              onClick: function() { inTray ? onRemoveFromTray(card.id) : onAddToTray(card); },
              title: inTray ? 'Remove from Tray' : 'Add to Drafting Tray',
              'aria-pressed': String(inTray),
            }, inTray ? '\u2605' : '\u2606'),
            h('button', {
              className: 'bbp-action bbp-action-canvas',
              onClick: function() { onSendToCanvas(card); },
              title: 'Place on canvas now',
            }, '\u2192'),
            h('button', {
              className: 'bbp-action',
              onClick: function() { onExportCard(card); },
              title: 'Export as JSON',
            }, '\u2193'),
            h('button', {
              className: 'bbp-action bbp-action-remove',
              onClick: function() { onUnpin(card.id); },
              title: 'Remove from Binder',
            }, '\u2715')
          )
        );
      })
    ),

    // Drafting Tray
    h('div', {className: 'bbp-tray'},
      h('div', {className: 'bbp-tray-header'},
        h('span', {className: 'bbp-tray-title'}, '\uD83D\uDDC2 Tray'),
        trayCards.length > 0 && h('span', {className: 'bbp-tray-count'}, String(trayCards.length)),
        trayCards.length > 0 && h('button', {
          className: 'bbp-tray-send',
          onClick: onSendTrayToCanvas,
          title: 'Place all Tray cards on canvas',
        }, '\u2192 All to canvas')
      ),
      trayCards.length === 0
        ? h('div', {className: 'bbp-tray-empty'}, 'Stage cards here before play.')
        : h('div', {className: 'bbp-tray-list'},
            trayCards.map(function(card) {
              var d = card.data || {};
              var title = d.name || d.location || d.situation ||
                          (d.aspects && d.aspects.high_concept) || card.label || card.genId;
              var genMeta = (typeof GENERATORS !== 'undefined' ? GENERATORS : []).find(function(g){ return g.id === card.genId; }) || {};
              return h('div', {key: card.id, className: 'bbp-tray-row'},
                h('span', {className: 'bbp-tray-icon', 'aria-hidden': 'true'}, genMeta.icon || '\u25C8'),
                h('span', {className: 'bbp-tray-name'}, title),
                h('button', {
                  className: 'bbp-tray-remove',
                  onClick: function() { onRemoveFromTray(card.id); },
                  'aria-label': 'Remove from tray',
                }, '\u2715')
              );
            })
          )
    )
  );
}

// ── BoardDossier — GM Guidance + actions panel (cv4Card shown inline on canvas) ─
// Since cv4Cards are now visible inline, the dossier shows only:
//   • GM Guidance footer (rules, invoke/compel examples)
//   • Chain / Send to table / Delete actions

function BoardDossier(props) {
  var card = props.card;
  var onClose = props.onClose;
  var onReroll = props.onReroll;
  var onSendToTable = props.onSendToTable;
  var onRemoveFromTable = props.onRemoveFromTable;
  var onDelete = props.onDelete;
  var isOnTable = props.isOnTable || false;
  var campName = props.campName;
  var campId = props.campId || '';
  var mode = props.mode || 'prep';
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
  // Get GM guidance content from CV4_HELP
  var hc = (typeof HELP_CONTENT !== 'undefined' && HELP_CONTENT[card.genId]) || null;

  return h('div', {className: 'bd-backdrop', role: 'presentation', 'aria-hidden': 'false',
                   onClick: function(e) { if (e.target.className === 'bd-backdrop') onClose(); }},
    h('div', {className: 'bd-modal bd-modal-compact', role: 'dialog', 'aria-modal': 'true',
              'aria-labelledby': 'bd-title-' + card.id, ref: modalRef},

      h('button', {className: 'bd-close', onClick: onClose, 'aria-label': 'Close'}, '\u2715'),

      // Header strip
      h('div', {className: 'bd-top'},
        h('div', {className: 'bd-title', id: 'bd-title-' + card.id}, card.title),
        h('div', {className: 'bd-badge', style: {color: C.tc, borderColor: C.tc, background: C.bg}},
          genMeta.icon + '\u00a0' + (genMeta.label || card.genId))
      ),

      // GM Guidance body — rules, invoke, compel
      h('div', {className: 'bd-guidance'},
        hc && hc.what && h('div', {className: 'bd-guidance-what'}, hc.what),
        hc && (hc.invoke_example || hc.compel_example) && h('div', {className: 'bd-guidance-examples'},
          hc.invoke_example && h('div', {className: 'bd-ex-invoke'},
            h('span', {className: 'bd-ex-lbl'}, '\u2746 Invoke'),
            h('span', null, hc.invoke_example)
          ),
          hc.compel_example && h('div', {className: 'bd-ex-compel'},
            h('span', {className: 'bd-ex-lbl'}, '\u2297 Compel'),
            h('span', null, hc.compel_example)
          )
        ),
        hc && Array.isArray(hc.rules) && hc.rules.length > 0 && h('div', {className: 'bd-guidance-rules'},
          hc.rules.map(function(rule, i) {
            return h('div', {key: i, className: 'bd-rule-row'},
              h('span', {className: 'bd-rule-pip'}, '\u25C8'),
              h('span', null, rule)
            );
          })
        ),
        (!hc || (!hc.what && !hc.invoke_example && !hc.compel_example)) && h('div', {
          style: {color: 'var(--text-muted)', fontSize: 12, padding: '8px 0', fontStyle: 'italic'}
        }, 'No GM guidance for this generator yet.'),
        hc && hc.srd_url && h('a', {
          href: hc.srd_url, target: '_blank', rel: 'noopener noreferrer',
          className: 'bd-srd-link'
        }, 'Fate Condensed SRD \u2197')
      ),

      // Footer actions
      h('div', {className: 'bd-footer'},
        h('button', {className: 'bd-chain', onClick: function() { onReroll(card.id); onClose(); },
                     title: 'Generate a new card of this type'}, '\u21BB\u00a0Chain'),
        mode === 'prep' && (isOnTable
          ? h(Fragment, null,
              h('span', {className: 'bd-on-table-badge'}, '\u25CF\u00a0On table'),
              onRemoveFromTable && h('button', {
                className: 'bd-remove-table',
                onClick: function() { onRemoveFromTable(card.id); onClose(); },
                title: 'Remove from play table',
              }, '\u25CB\u00a0Remove')
            )
          : h('button', {
              className: 'bd-send-table',
              onClick: function() { onSendToTable(card); onClose(); },
              title: 'Put this card on the play table',
            }, '\u2192 Table')
        ),
        h('button', {
          className: 'bd-delete',
          onClick: function() { onDelete(card.id); onClose(); },
          title: 'Remove card from canvas',
        }, '\u2715')
      )
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
  var hasCards       = cards.filter(function(c){ return c.genId && c.genId !== 'sticky' && c.genId !== 'boost' && c.genId !== 'label'; }).length > 0;

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
    var printable = cards.filter(function(c){ return c.genId && c.genId !== 'sticky' && c.genId !== 'boost' && c.genId !== 'label' && c.data; });
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
  var campMeta     = props.campMeta;
  var mode         = props.mode;
  var onModeChange = props.onModeChange;
  var campId       = props.campId;
  var onCampChange = props.onCampChange;
  var isOnline     = props.isOnline;

  // Grouped prop objects
  var sync         = props.sync         || {};
  var panels       = props.panels       || {};
  var counts       = props.counts       || {};
  var exp          = props.exportActions || {};

  // Destructure sync
  var syncStatus  = sync.status   || 'offline';
  var roomCode    = sync.roomCode || '';
  var syncRole    = sync.role     || null;
  var onHost      = sync.onHost;
  var onDisconnect = sync.onDisconnect;
  var showToast   = sync.onToast  || function() {};

  // Destructure panels
  var leftOpen         = panels.leftOpen;
  var onToggleLeft     = panels.onToggleLeft;
  var showDice         = panels.showDice;
  var onToggleDice     = panels.onToggleDice;
  var showFP           = panels.showFP;
  var onToggleFP       = panels.onToggleFP;
  var binderOpen       = panels.binderOpen;
  var onToggleBinder   = panels.onToggleBinder;
  var mobileListView   = panels.mobileListView || false;
  var onToggleMobileList = panels.onToggleMobileList;

  // Destructure counts
  var onTableCount = counts.onTable || 0;
  var binderCount  = counts.binder  || 0;
  var trayCount    = counts.tray    || 0;
  var pinCount     = counts.pin     || 0;

  // Destructure export actions
  var cards            = exp.cards        || [];
  var campName         = exp.campName     || (campMeta && campMeta.name) || '';
  var theme            = exp.theme        || 'dark';
  var onToggleTheme    = exp.onToggleTheme;
  var onExportCanvas   = exp.onExportCanvas;
  var onImportCanvas   = exp.onImportCanvas;
  var onPrint          = exp.onPrint;

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

    // GM Screen: panel toggle only in PLAY (panel is always open in PREP)
    mode === 'play' && h('button', {
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
        title: 'Prep — generate and arrange cards privately. Players cannot see this canvas.',
        'aria-pressed': String(mode === 'prep'),
      }, 'Prep'),
      h('button', {
        className: 'bt-mode-btn' + (mode === 'play' ? ' active' : ''),
        onClick: function() { onModeChange('play'); },
        title: 'Play — live session view. Cards you send to table are visible to connected players.',
        'aria-pressed': String(mode === 'play'),
      }, 'Play')
    ),

    // Right nav
    h('div', {className: 'bt-right'},
      mode === 'play' && syncStatus === 'connected' && syncRole === 'gm' && h('span', {className: 'bt-chip bt-play-chip'}, '\u25B6 Live'),
      mode === 'play' && syncStatus === 'connecting' && h('span', {className: 'bt-chip bt-offline'}, '\u29D7 Connecting\u2026'),
      // UX-04: Player-side persistent room chip — anchors players to their session
      syncRole === 'player' && syncStatus === 'connected' && roomCode && h('span', {
        className: 'bt-chip bt-room-chip',
        title: 'Connected to Room ' + roomCode + ' \u2014 waiting for GM to add you',
      }, '\uD83D\uDD17\u00a0Room\u00a0' + roomCode),
      !isOnline && h('span', {className: 'bt-chip bt-offline'}, '\u26A1 Offline'),

      // UNI: "N on table" chip — PREP mode only, shows how many cards are on the play canvas
      mode === 'prep' && onTableCount > 0 && h('span', {
        className: 'bt-chip bt-ontable-chip',
        title: onTableCount + ' card' + (onTableCount === 1 ? '' : 's') + ' on the play table',
      }, '\u25CF\u00a0' + onTableCount + ' on table'),
      // UNI-02: Binder toggle (Prep mode only)
      mode === 'prep' && h('button', {
        className: 'bt-icon-btn' + (binderOpen ? ' active' : ''),
        onClick: onToggleBinder,
        title: binderOpen ? 'Hide Binder' : 'Show Binder' + (binderCount > 0 ? ' (' + binderCount + ' cards)' : ''),
        'aria-label': binderOpen ? 'Hide Binder' : 'Open Binder',
        'aria-pressed': String(binderOpen),
        style: {position: 'relative'},
      },
        '\uD83D\uDCCB',
        (binderCount > 0 || trayCount > 0) && h('span', {
          className: 'bt-count',
          style: {position:'absolute', top:-4, right:-4},
        }, String(trayCount > 0 ? trayCount : binderCount))
      ),
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
      mode === 'play' && syncStatus === 'connected' && h('span', {style:{display:'flex',alignItems:'center',gap:3}},
        h('button', {
          className: 'bt-nav',
          style: {color: 'var(--c-green,#30d158)', borderColor: 'var(--c-green,#30d158)', fontVariantNumeric:'tabular-nums'},
          title: 'Click to copy player join link',
          onClick: function() {
            var joinUrl = window.location.origin + '/campaigns/board.html?mode=play&room=' + roomCode;
            try {
              navigator.clipboard.writeText(joinUrl).then(function() {
                showToast('\uD83D\uDD17 Join link copied \u2014 ' + roomCode);
              });
            } catch(e) {
              // Fallback for browsers without clipboard API
              showToast('Room ' + roomCode + ' \u2014 share: ?' + 'room=' + roomCode);
            }
          },
        }, '\uD83D\uDD17\u00a0' + String(roomCode)),
        h('button', {
          className: 'bt-icon-btn',
          style: {fontSize:12, opacity:0.6, width:22, height:22, minWidth:0},
          title: 'Disconnect from live session',
          onClick: onDisconnect,
          'aria-label': 'Disconnect',
        }, '\u2715')
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

  // SCN-01: End Scene — clear all stress, preserve consequences/FP (FCon p.30: stress clears at end of scene)
  function endScene() {
    setPlayers(function(ps) {
      var cleared = ps.map(function(p) {
        return Object.assign({}, p, {
          phy: p.phy.map(function() { return false; }),
          men: p.men.map(function() { return false; }),
          acted: false,
        });
      });
      persistPlayState(cleared, null, null);
      return cleared;
    });
  }

  function addPlayer(nameArg, pcArg) {
    var name = nameArg || prompt('Player name:');
    if (!name) return;
    var COLORS = ['var(--accent)', 'var(--c-purple)', 'var(--c-blue)', 'var(--c-green)', 'var(--c-red)'];
    // PL-03: derive stress from skills if pc data provided (FCon p.12)
    var pc = pcArg || {};
    var skills = Array.isArray(pc.skills) ? pc.skills : [];
    var physique = (skills.find(function(s){ return s.name==='Physique'; })||{}).r||0;
    var will     = (skills.find(function(s){ return s.name==='Will'; })    ||{}).r||0;
    var phy = physique >= 3 ? [false,false,false,false,false,false]
            : physique >= 1 ? [false,false,false,false]
            : [false,false,false];
    var men = will >= 3 ? [false,false,false,false,false,false]
            : will >= 1 ? [false,false,false,false]
            : [false,false,false];
    var np = {
      id: 'bp' + Date.now() + Math.random().toString(36).slice(2, 5),
      name: name,
      hc: pc.hc || '',
      fp: 3, ref: 3,
      phy: phy, men: men,
      color: COLORS[players.length % COLORS.length],
      acted: false, conseq: ['', '', ''],
      aspects: pc.aspects || [],
      skills: skills,
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

  // Load play state on mount only — guard prevents reload on every PREP↔PLAY toggle
  var _hasLoadedPlay = useRef(false);
  useEffect(function() {
    if (!DB || !loaded || _hasLoadedPlay.current) return;
    _hasLoadedPlay.current = true;
    DB.loadSession('board_play_session_' + campId).then(function(saved) {
      if (!saved) return;
      if (Array.isArray(saved.players) && saved.players.length > 0) setPlayers(saved.players);
      if (typeof saved.round === 'number') setRound(saved.round);
      if (Array.isArray(saved.order) && saved.order.length > 0) setOrder(saved.order);
    }).catch(function() {});
  }, [campId, loaded]);

  return {
    players: players, setPlayers: setPlayers,
    round: round,
    order: order, setOrder: setOrder,
    selPlayer: selPlayer, setSelPlayer: setSelPlayer,
    roundFlash: roundFlash,
    newRound: newRound, prevRound: prevRound,
    toggleActed: toggleActed,
    updPlayer: updPlayer, addPlayer: addPlayer, removePlayer: removePlayer,
    endScene: endScene,
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

  function disconnectSync() {
    if (syncObj && syncObj.ws) {
      try { syncObj.ws.close(); } catch(e) {}
    }
    setSyncObj(null);
    setSyncStatus('offline');
    setRoomCode('');
    showToast('Disconnected');
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
    return c.genId && c.genId !== 'sticky' && c.genId !== 'boost' && c.genId !== 'label' && c.data;
  });
  var stickyCards = cards.filter(function(c) { return c.genId === 'sticky'; });
  var boostCards  = cards.filter(function(c) { return c.genId === 'boost'; });
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
    boostCards.length > 0 && h('div', {className: 'bml-section'}, '\u26A1 Boosts (' + boostCards.length + ')'),
    labelCards.length > 0 && h('div', {className: 'bml-section'}, '\uD83C\uDFF7 Labels (' + labelCards.length + ')')
  );
}

// ── useBoardCards — card CRUD, persistence, generate, export ─────────────────
// Extracted from BoardApp. Owns the cards array, its IDB load/save lifecycle,
// and every mutation: generate, update, delete, reroll, export, import.
// Drag/zoom/pan/context-menu stay in BoardApp (need direct canvas DOM refs).
//
// Parameters:
//   campCanvasKey — current IDB key (changes with mode + campId)
//   campId, campMetaName — for export filename and data lookup
//   tables — merged world tables (from getWorldTables + mergeUniversal)
//   showToast — stable useCallback from BoardApp
//   onCardsChange — optional callback fired after any mutation (wires useBoardCards → useBoardBinder via _bcOnChange ref)

function useBoardCards(campCanvasKey, campId, campMetaName, tables, showToast, onCardsChange) {
  var _cards = useState([]); var cards = _cards[0]; var setCards = _cards[1];
  var _loaded = useState(false); var loaded = _loaded[0]; var setLoaded = _loaded[1];

  var cardsRef       = useRef(cards);
  var lastRemovedRef  = useRef(null);
  var lastRerolledRef = useRef(null);
  var lastPlacedRef   = useRef({x: 60, y: 60, col: 0});

  cardsRef.current = cards;

  // Load canvas from IDB when key changes (mode or campId switch)
  useEffect(function() {
    if (typeof DB === 'undefined') { setLoaded(true); return; }
    DB.loadSession(campCanvasKey).then(function(saved) {
      if (saved && Array.isArray(saved.cards)) setCards(saved.cards);
      setLoaded(true);
    }).catch(function() { setLoaded(true); });
  }, [campCanvasKey]);

  function persistCanvas(nextCards) {
    if (typeof DB === 'undefined') return;
    DB.saveSession(campCanvasKey, {cards: nextCards, ts: Date.now()}).catch(function() {});
    if (onCardsChange) onCardsChange(nextCards);
  }

  function mutate(fn) {
    // Shared mutation wrapper: apply fn to prev cards, persist, return next
    setCards(function(prev) {
      var next = fn(prev);
      persistCanvas(next);
      return next;
    });
  }

  function generateCard(genId, x, y) {
    if (genId === 'label') {
      var lp2 = lastPlacedRef.current;
      var newLabel = {
        id: boardUid(), genId: 'label', text: 'Section',
        x: x !== undefined ? x : lp2.x,
        y: y !== undefined ? y : Math.max(0, lp2.y - 24),
        z: Date.now(), ts: Date.now(), styleIdx: 0,
      };
      mutate(function(prev) { return prev.concat([newLabel]); });
      showToast('Section label added \u2014 double-click to rename');
      return;
    }
    if (genId === 'sticky') {
      var sc = STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];
      var sticky = {
        id: boardUid(), genId: 'sticky', text: '\u201CNew Aspect\u201D',
        colorIdx: STICKY_COLORS.indexOf(sc),
        rotation: (Math.random() * 6 - 3),
        x: x !== undefined ? x : (80 + Math.random() * 400),
        y: y !== undefined ? y : (80 + Math.random() * 300),
        z: Date.now(), ts: Date.now(),
      };
      mutate(function(prev) { return prev.concat([sticky]); });
      showToast('Aspect sticky added');
      return;
    }
    // BST-01: Boost — temporary aspect with 1 free invoke, auto-expires (FCon p.24)
    if (genId === 'boost') {
      var boostCard = {
        id: boardUid(), genId: 'boost', text: '\u201CNew Boost\u201D',
        freeInvokes: 1, expired: false,
        rotation: (Math.random() * 4 - 2),
        x: x !== undefined ? x : (80 + Math.random() * 400),
        y: y !== undefined ? y : (80 + Math.random() * 300),
        z: Date.now(), ts: Date.now(),
      };
      mutate(function(prev) { return prev.concat([boostCard]); });
      showToast('\u26A1 Boost added \u2014 1 free invoke');
      return;
    }
    if (genId === 'custom') {
      // Custom card — blank, fully editable. No engine call.
      var lpc = lastPlacedRef.current;
      var customCard = {
        id: boardUid(), genId: 'custom',
        title: 'Custom Card',
        summary: '',
        tags: ['Aspect'],
        data: {title: 'Custom Card', body: '', type: 'aspect'},
        x: x !== undefined ? x : lpc.x,
        y: y !== undefined ? y : lpc.y,
        z: Date.now(), ts: Date.now(), gmOnly: false,
      };
      lpc.col = (lpc.col + 1) % 4;
      if (lpc.col === 0) { lpc.x = 60; lpc.y += 200; } else { lpc.x += 220; }
      mutate(function(prev) { return prev.concat([customCard]); });
      showToast('\u270e Custom Card added \u2014 click title or notes to edit');
      return;
    }
    var t = tables;
    try { if (typeof mergeUniversal === 'function' && typeof UNIVERSAL_TABLES !== 'undefined') t = mergeUniversal(t); } catch(e) {}
    var data = null;
    try { if (typeof generate === 'function') data = generate(genId, t, 4); } catch(e) { console.warn('[Board] generate failed:', e); }
    if (!data) { showToast('Generation failed'); return; }
    var genMeta = (GENERATORS || []).find(function(g) { return g.id === genId; }) || {};
    var cardX, cardY;
    if (x !== undefined) {
      cardX = x; cardY = y;
    } else {
      var lp = lastPlacedRef.current;
      cardX = lp.x; cardY = lp.y;
      lp.col = (lp.col + 1) % 4;
      if (lp.col === 0) { lp.x = 60; lp.y += 200; } else { lp.x += 220; }
    }
    var card = {
      id: boardUid(), genId: genId,
      title: extractCardTitle(genId, data),
      summary: extractCardSummary(genId, data),
      tags: extractCardTags(genId, data),
      data: data, x: cardX, y: cardY,
      z: Date.now(), ts: Date.now(), gmOnly: false,
    };
    mutate(function(prev) { return prev.concat([card]); });
    showToast('Generated: ' + (genMeta.icon || '') + ' ' + (genMeta.label || genId));
  }

  function updateCard(id, patch) {
    mutate(function(prev) {
      return prev.map(function(c) { return c.id === id ? Object.assign({}, c, patch) : c; });
    });
  }

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

  function rerollCard(id) {
    var existing = cardsRef.current.find(function(c) { return c.id === id; });
    if (!existing || existing.genId === 'sticky' || existing.genId === 'custom') return;
    var t = tables;
    try { if (typeof mergeUniversal === 'function' && typeof UNIVERSAL_TABLES !== 'undefined') t = mergeUniversal(t); } catch(e) {}
    var data = null;
    try { if (typeof generate === 'function') data = generate(existing.genId, t, 4); } catch(e) {}
    if (!data) return;
    lastRerolledRef.current = {id: id, prev: existing};
    mutate(function(prev) {
      return prev.map(function(c) {
        if (c.id !== id) return c;
        return Object.assign({}, c, {
          title: extractCardTitle(existing.genId, data),
          summary: extractCardSummary(existing.genId, data),
          tags: extractCardTags(existing.genId, data),
          data: data, ts: Date.now(),
        });
      });
    });
    showToast('Rerolled \u2014 Ctrl+Z to undo');
  }

  function undoLast() {
    if (lastRemovedRef.current) {
      var restored = lastRemovedRef.current;
      lastRemovedRef.current = null;
      mutate(function(prev) { return prev.concat([restored]); });
      showToast('Delete undone');
    } else if (lastRerolledRef.current) {
      var undo = lastRerolledRef.current;
      lastRerolledRef.current = null;
      mutate(function(prev) { return prev.map(function(c) { return c.id === undo.id ? undo.prev : c; }); });
      showToast('Reroll undone');
    }
  }

  function exportCanvas(canvasKey, fname) {
    if (typeof DB === 'undefined' || !DB.exportCanvasState) { showToast('Export unavailable'); return; }
    DB.exportCanvasState(canvasKey, fname).then(function() {
      showToast('Board exported');
    }).catch(function(err) {
      showToast(err && err.message ? err.message : 'Export failed');
    });
  }

  function importCanvas() {
    if (typeof DB === 'undefined' || !DB.importCanvasState) { showToast('Import unavailable'); return; }
    DB.importCanvasState().then(function(data) {
      if (!data || !data.state || !Array.isArray(data.state.cards)) { showToast('Invalid board file'); return; }
      setCards(data.state.cards);
      persistCanvas(data.state.cards);
      showToast('Board imported \u2014 ' + data.state.cards.length + ' cards loaded');
    }).catch(function(err) {
      if (err && err.message && err.message !== 'No file selected') showToast('Import failed: ' + err.message);
    });
  }

  return {
    cards: cards, setCards: setCards, loaded: loaded,
    cardsRef: cardsRef, lastRemovedRef: lastRemovedRef,
    lastRerolledRef: lastRerolledRef, lastPlacedRef: lastPlacedRef,
    persistCanvas: persistCanvas,
    generateCard: generateCard, updateCard: updateCard,
    deleteCard: deleteCard, rerollCard: rerollCard,
    undoLast: undoLast, exportCanvas: exportCanvas, importCanvas: importCanvas,
  };
}

function useBoardBinder(campId, campMetaName, playCanvasKey, showToast, getCanvasCards, persistCanvas, onTableChange) {
  var _binderCards = useState([]); var binderCards = _binderCards[0]; var setBinderCards = _binderCards[1];
  var _trayCards   = useState([]); var trayCards   = _trayCards[0];   var setTrayCards   = _trayCards[1];
  var _binderOpen  = useState(false); var binderOpen = _binderOpen[0]; var setBinderOpen  = _binderOpen[1];
  var _playCardIds = useState(new Set()); var playCardIds = _playCardIds[0]; var setPlayCardIds = _playCardIds[1];

  // Load Binder cards + Tray + play canvas IDs from IDB on mount
  useEffect(function() {
    if (typeof DB === 'undefined') return;
    DB.loadCards(campId).then(function(cards) {
      if (cards && cards.length) setBinderCards(cards.sort(function(a,b){ return b.ts - a.ts; }));
    }).catch(function() {});
    DB.loadSession('binder_tray_' + campId).then(function(saved) {
      if (saved && Array.isArray(saved.cards) && saved.cards.length) setTrayCards(saved.cards);
    }).catch(function() {});
    DB.loadSession(playCanvasKey).then(function(saved) {
      if (saved && Array.isArray(saved.cards)) {
        setPlayCardIds(new Set(saved.cards.map(function(c) { return c.sourceId || c.id; })));
      }
    }).catch(function() {});
  }, [campId]);

  function addToTray(card) {
    var already = trayCards.some(function(c) { return c.id === card.id; });
    if (already) { showToast('Already in Tray'); return; }
    var next = trayCards.concat([Object.assign({}, card, {trayTs: Date.now()})]);
    setTrayCards(next);
    if (typeof DB !== 'undefined') DB.saveSession('binder_tray_' + campId, {cards: next}).catch(function(){});
    showToast('\u2713 Added to Tray');
  }

  function removeFromTray(cardId) {
    setTrayCards(function(prev) {
      var next = prev.filter(function(c) { return c.id !== cardId; });
      if (typeof DB !== 'undefined') DB.saveSession('binder_tray_' + campId, {cards: next}).catch(function(){});
      return next;
    });
  }

  function sendTrayToCanvas() {
    if (!trayCards.length) { showToast('Tray is empty'); return; }
    var currentCards = getCanvasCards();
    var newCards = trayCards.map(function(card, i) {
      var d = card.data || {};
      var title = d.name || d.location || d.situation || (d.aspects && d.aspects.high_concept) || card.genId;
      return {
        id: 'b' + Date.now() + i + Math.random().toString(36).slice(2,5),
        genId: card.genId, title: title, summary: card.label || title, tags: [],
        data: d, x: 60 + (i % 4) * 220, y: 60 + Math.floor(i / 4) * 210,
        z: Date.now() + i, ts: Date.now(), gmOnly: false,
      };
    });
    persistCanvas(currentCards.concat(newCards));
    var count = trayCards.length;
    setTrayCards([]);
    if (typeof DB !== 'undefined') DB.saveSession('binder_tray_' + campId, {cards: []}).catch(function(){});
    showToast('\u2713 ' + count + ' card' + (count === 1 ? '' : 's') + ' placed on canvas');
  }

  function sendToCanvas(card, setCards) {
    var d = card.data || {};
    var title = d.name || d.location || d.situation || (d.aspects && d.aspects.high_concept) || card.genId;
    var placed = {
      id: 'b' + Date.now() + Math.random().toString(36).slice(2,6),
      genId: card.genId, title: title, summary: card.label || title, tags: [],
      data: d, x: 60 + Math.floor(Math.random() * 3) * 220,
      y: 60 + Math.floor(Math.random() * 2) * 200,
      z: Date.now(), ts: Date.now(), gmOnly: false,
    };
    setCards(function(prev) {
      var next = prev.concat([placed]);
      persistCanvas(next);
      return next;
    });
    showToast('\u2713 Placed on canvas');
  }

  function unpinCard(cardId) {
    setBinderCards(function(prev) { return prev.filter(function(c) { return c.id !== cardId; }); });
    if (typeof DB !== 'undefined') DB.deleteCard(campId, cardId).catch(function(){});
  }

  function exportCard(card) {
    if (typeof DB !== 'undefined' && DB.exportCard) {
      DB.exportCard({genId:card.genId,label:card.label,data:card.data,state:card.state||null,ts:card.ts}, campMetaName);
    }
  }

  function sendToTable(card) {
    if (typeof DB === 'undefined') { showToast('\u26a0 Storage unavailable'); return; }
    var tableCard = Object.assign({}, card, {
      id: 'tbl_' + Date.now() + Math.random().toString(36).slice(2, 5),
      sourceId: card.id, ts: Date.now(),
    });
    DB.loadSession(playCanvasKey).then(function(saved) {
      var existing = (saved && Array.isArray(saved.cards)) ? saved.cards : [];
      var alreadySent = existing.some(function(c) { return c.sourceId === card.id; });
      if (alreadySent) { showToast('Already on table'); return; }
      var next = existing.concat([tableCard]);
      return DB.saveSession(playCanvasKey, {cards: next, ts: Date.now()}).then(function() {
        setPlayCardIds(function(prev) { var ns = new Set(prev); ns.add(card.id); return ns; });
        showToast('\u25CF Put on table');
        // Broadcast updated play cards to connected players
        if (onTableChange) onTableChange(next.filter(function(c) { return !c.gmOnly; }));
      });
    }).catch(function() { showToast('\u26a0 Could not put on table'); });
  }

  // SCN-02: Remove from table — pull card back to prep-only visibility
  function removeFromTable(sourceId) {
    if (typeof DB === 'undefined') { showToast('\u26a0 Storage unavailable'); return; }
    DB.loadSession(playCanvasKey).then(function(saved) {
      var existing = (saved && Array.isArray(saved.cards)) ? saved.cards : [];
      var next = existing.filter(function(c) { return c.sourceId !== sourceId; });
      if (next.length === existing.length) { showToast('Not on table'); return; }
      return DB.saveSession(playCanvasKey, {cards: next, ts: Date.now()}).then(function() {
        setPlayCardIds(function(prev) { var ns = new Set(prev); ns.delete(sourceId); return ns; });
        showToast('\u25CB Removed from table');
        if (onTableChange) onTableChange(next.filter(function(c) { return !c.gmOnly; }));
      });
    }).catch(function() { showToast('\u26a0 Could not remove from table'); });
  }

  return {
    binderCards: binderCards, setBinderCards: setBinderCards,
    trayCards: trayCards,
    binderOpen: binderOpen, setBinderOpen: setBinderOpen,
    playCardIds: playCardIds,
    addToTray: addToTray, removeFromTray: removeFromTray,
    sendTrayToCanvas: sendTrayToCanvas, sendToCanvas: sendToCanvas,
    unpinCard: unpinCard, exportCard: exportCard, sendToTable: sendToTable,
    removeFromTable: removeFromTable,
  };
}

// ── PlayerSurface ─────────────────────────────────────────────────────────────
// Focused play-mode view for remote players. Replaces the full GM canvas once
// the player has completed the join wizard and the GM broadcasts state.
// Props: syncState {cards, fp, players}, playerName, roomCode, syncObj, syncStatus
function PlayerSurface(props) {
  var syncState   = props.syncState || {};
  var playerName  = props.playerName || 'Player';
  var roomCode    = props.roomCode || '';
  var syncObj     = props.syncObj;
  var syncStatus  = props.syncStatus || 'offline';
  var campId      = props.campId || '';

  var sceneCards  = syncState.cards   || [];
  var fp          = syncState.fp      || {pcs: [], pool: 0};
  var allPlayers  = syncState.players || fp.pcs || [];

  // Find this player's own row by name match
  var myPlayer = allPlayers.find(function(p) {
    return p.name && p.name.toLowerCase() === playerName.toLowerCase();
  }) || null;

  // Local editable copies of own stress/conseq — sent back to GM on change
  var _myPhy = useState(myPlayer ? (myPlayer.phy || []) : []);
  var myPhy = _myPhy[0]; var setMyPhy = _myPhy[1];
  var _myMen = useState(myPlayer ? (myPlayer.men || []) : []);
  var myMen = _myMen[0]; var setMyMen = _myMen[1];
  var _myConseq = useState(myPlayer ? (myPlayer.conseq || ['','','']) : ['','','']);
  var myConseq = _myConseq[0]; var setMyConseq = _myConseq[1];

  // Sync local state when GM broadcasts an updated player row
  useEffect(function() {
    var updated = allPlayers.find(function(p) {
      return p.name && p.name.toLowerCase() === playerName.toLowerCase();
    });
    if (updated) {
      setMyPhy(updated.phy || []);
      setMyMen(updated.men || []);
      setMyConseq(updated.conseq || ['','','']);
    }
  }, [allPlayers.length, playerName]);

  function sendPlayerAction(patch) {
    if (!syncObj || !syncObj.connected) return;
    if (syncObj.sendAction) syncObj.sendAction(playerName, 'stress_update', patch);
  }

  function toggleStress(type, i) {
    var cur = type === 'phy' ? myPhy.slice() : myMen.slice();
    cur[i] = !cur[i];
    if (type === 'phy') { setMyPhy(cur); sendPlayerAction({phy: cur}); }
    else               { setMyMen(cur); sendPlayerAction({men: cur}); }
  }

  function updateConseq(i, val) {
    var next = myConseq.slice(); next[i] = val;
    setMyConseq(next);
    sendPlayerAction({conseq: next});
  }

  // ── Render ────────────────────────────────────────────────────────────────
  var _sheetOpen = useState(false); var sheetOpen = _sheetOpen[0]; var setSheetOpen = _sheetOpen[1];

  // Derive aspects and skills from myPlayer for character sheet
  var myAspects = myPlayer ? (myPlayer.aspects || []) : [];
  var myHc      = myPlayer ? (myPlayer.hc || '') : '';
  var mySkills  = myPlayer ? (myPlayer.skills || []) : [];

  return h('div', {className: 'ps-surface'},

    // ── Top bar ─────────────────────────────────────────────────────────────
    h('div', {className: 'ps-topbar'},
      h('span', {className: 'ps-room-chip'}, '\uD83D\uDD17\u00a0' + roomCode),
      h('span', {className: 'ps-name'}, playerName),
      h('span', {
        className: 'ps-status' + (syncStatus === 'connected' ? ' ps-online' : ''),
      }, syncStatus === 'connected' ? '\u25CF\u00a0Live' : '\u25CB\u00a0Offline')
    ),

    // ── CHR-01: My Character sheet (expandable) ─────────────────────────────
    myPlayer && h('div', {className: 'ps-sheet'},
      h('button', {
        className: 'ps-sheet-toggle',
        onClick: function() { setSheetOpen(function(v){ return !v; }); },
        'aria-expanded': String(sheetOpen),
      },
        h('span', {className: 'ps-sheet-chev', style:{
          transform: sheetOpen ? 'rotate(90deg)' : 'rotate(0deg)',
        }}, '\u25ba'),
        '\uD83D\uDCCB My Character'
      ),
      sheetOpen && h('div', {className: 'ps-sheet-body'},
        // High Concept
        myHc && h('div', {className: 'ps-sheet-aspect ps-sheet-hc'},
          h('span', {className: 'ps-sheet-asp-label'}, 'High Concept'),
          h('span', {className: 'ps-sheet-asp-val'}, myHc)
        ),
        // All aspects
        myAspects.length > 0 && h('div', {className: 'ps-sheet-aspects'},
          myAspects.map(function(asp, i) {
            // Skip HC if it's the first item and matches myHc
            if (i === 0 && asp === myHc) return null;
            var label = i === 1 ? 'Trouble' : 'Aspect';
            return h('div', {key: i, className: 'ps-sheet-aspect'},
              h('span', {className: 'ps-sheet-asp-label'}, label),
              h('span', {className: 'ps-sheet-asp-val'}, asp)
            );
          })
        ),
        // Skills (sorted by rating)
        mySkills.length > 0 && h('div', {className: 'ps-sheet-skills'},
          h('span', {className: 'ps-sheet-sk-title'}, 'Skills'),
          [4,3,2,1].map(function(rating) {
            var atRating = mySkills.filter(function(s) { return (s.r || 0) === rating; });
            if (atRating.length === 0) return null;
            var lbl = rating === 4 ? 'Great' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Average';
            return h('div', {key: rating, className: 'ps-sheet-sk-row'},
              h('span', {className: 'ps-sheet-sk-rating'}, '+' + rating + ' ' + lbl),
              atRating.map(function(s) {
                return h('span', {key: s.name, className: 'ps-sheet-sk-pill'}, s.name);
              })
            );
          })
        ),
        // Refresh
        h('div', {className: 'ps-sheet-refresh'},
          'Refresh: ', h('strong', null, String(myPlayer.ref || 3))
        )
      )
    ),

    // ── Scene cards ─────────────────────────────────────────────────────────
    h('div', {className: 'ps-body'},
      h('div', {className: 'ps-section-label'}, 'Scene'),
      sceneCards.length === 0
        ? h('div', {className: 'ps-empty'}, 'Waiting for GM to set the scene\u2026')
        : h('div', {className: 'ps-cards'},
            sceneCards.map(function(card, i) {
              return h('div', {key: card.id || i, className: 'ps-card-wrap'},
                card.data
                  ? h('div', {className: 'ps-card-scaler'},
                      renderCard(card.genId, card.data, campId, null, [], null)
                    )
                  : h('div', {className: 'ps-card-plain'},
                      h('div', {className: 'ps-card-title'}, card.title || card.genId),
                      card.summary && h('div', {className: 'ps-card-summary'}, card.summary)
                    )
              );
            })
          ),

      // ── Party strip ─────────────────────────────────────────────────────
      h('div', {className: 'ps-section-label', style:{marginTop:18}}, 'Party'),
      allPlayers.length === 0
        ? h('div', {className: 'ps-empty'}, 'No players added yet.')
        : allPlayers.map(function(p, pi) {
            var isMe = p.name && p.name.toLowerCase() === playerName.toLowerCase();
            var phy  = isMe ? myPhy  : (p.phy  || []);
            var men  = isMe ? myMen  : (p.men  || []);
            var csq  = isMe ? myConseq : (p.conseq || ['','','']);
            return h('div', {key: p.id || pi, className: 'ps-player' + (isMe ? ' ps-player-me' : '')},
              h('div', {className: 'ps-player-header'},
                h('span', {className: 'ps-player-dot', style:{background: p.color || 'var(--accent)'}}),
                h('span', {className: 'ps-player-name'}, p.name + (isMe ? ' (you)' : '')),
                h('span', {className: 'ps-player-hc'}, p.hc || '')
              ),
              // FP dots
              h('div', {className: 'ps-player-row'},
                h('span', {className: 'ps-row-label'}, 'FP'),
                h('div', {className: 'ps-fp-dots'},
                  [0,1,2,3,4,5].map(function(di) {
                    return h('div', {
                      key: di,
                      className: 'ps-fp-dot' + (di < (p.fp || 0) ? ' filled' : ''),
                    });
                  })
                ),
                h('span', {className: 'ps-fp-count'}, String(p.fp || 0))
              ),
              // Physical stress
              phy.length > 0 && h('div', {className: 'ps-player-row'},
                h('span', {className: 'ps-row-label'}, 'Phys'),
                phy.map(function(v, si) {
                  return h('div', {
                    key: si,
                    className: 'ps-stress-box' + (v ? ' hit' : '') + (isMe ? ' editable' : ''),
                    onClick: isMe ? function() { toggleStress('phy', si); } : undefined,
                    role: isMe ? 'checkbox' : undefined,
                    'aria-checked': isMe ? String(v) : undefined,
                    tabIndex: isMe ? 0 : undefined,
                    onKeyDown: isMe ? function(e) { if(e.key===' '||e.key==='Enter'){e.preventDefault();toggleStress('phy',si);} } : undefined,
                  }, v ? '\u00d7' : '');
                })
              ),
              // Mental stress
              men.length > 0 && h('div', {className: 'ps-player-row'},
                h('span', {className: 'ps-row-label'}, 'Ment'),
                men.map(function(v, si) {
                  return h('div', {
                    key: si,
                    className: 'ps-stress-box' + (v ? ' hit' : '') + (isMe ? ' editable' : ''),
                    onClick: isMe ? function() { toggleStress('men', si); } : undefined,
                    role: isMe ? 'checkbox' : undefined,
                    'aria-checked': isMe ? String(v) : undefined,
                    tabIndex: isMe ? 0 : undefined,
                    onKeyDown: isMe ? function(e) { if(e.key===' '||e.key==='Enter'){e.preventDefault();toggleStress('men',si);} } : undefined,
                  }, v ? '\u00d7' : '');
                })
              ),
              // Consequences (editable only for self)
              isMe && h('div', {className: 'ps-conseq'},
                [['Mild','2'],['Moderate','4'],['Severe','6']].map(function(row, ci) {
                  return h('div', {key: ci, className: 'ps-conseq-row'},
                    h('span', {className: 'ps-conseq-label'}, row[0]),
                    h('span', {className: 'ps-conseq-shifts'}, row[1]),
                    h('input', {
                      className: 'ps-conseq-input',
                      type: 'text',
                      value: csq[ci] || '',
                      placeholder: 'empty',
                      maxLength: 60,
                      'aria-label': row[0] + ' consequence',
                      onChange: function(e) { updateConseq(ci, e.target.value); },
                    })
                  );
                })
              )
            );
          })
    )
  );
}

function BoardApp(props) {
  var campId       = props.campId || 'fantasy';
  var initialMode  = props.initialMode || 'prep';
  var initialRoom  = props.initialRoom || null;

  // ── Derived early — needed before hooks ───────────────────────────────────
  // campMeta must be available before useBoardBinder is called (L1919)
  var campMeta = getWorldMeta(campId);

  // ── State ──────────────────────────────────────────────────────────────────
  // cards, cardsRef, loaded — owned by useBoardCards (wired below after campCanvasKey derived)

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

  var _zoom = useState(0.75); // cv4Cards are larger — 75% default gives a readable canvas
  var zoom = _zoom[0];
  var setZoom = _zoom[1];

  // ── Coach marks — first-run orientation (UX-01, UX-05) ───────────────────
  // Each shown once per browser profile; dismissed permanently via localStorage.
  var _coachCanvas = useState(false); var coachCanvas = _coachCanvas[0]; var setCoachCanvas = _coachCanvas[1];
  var _coachPlay   = useState(false); var coachPlay   = _coachPlay[0];   var setCoachPlay   = _coachPlay[1];

  // MOB-02: left panel collapsed state (default open on desktop, closed on mobile)
  var _leftOpen = useState(function() { return window.innerWidth > 520; });
  var leftOpen = _leftOpen[0]; var setLeftOpen = _leftOpen[1];

  // GM Screen: left panel is always open in PREP mode (it's reference material, not a feature)
  useEffect(function() {
    if (mode === 'prep') setLeftOpen(true);
  }, [mode]);

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
  var endScene = _play.endScene;
  var persistPlayState = _play.persistPlayState;

  // ── BRD-02/03: Dice floater + FP floater visibility ──────────────────────
  var _showDice = useState(false); var showDice = _showDice[0]; var setShowDice = _showDice[1];
  var _showFP = useState(false); var showFP = _showFP[0]; var setShowFP = _showFP[1];

  // Toast — declared before useBoardSync so showToast can be passed as a callback
  var toastTimerRef = useRef(null);
  var showToast = useCallback(function(msg) {
    setToast(msg);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(function() { setToast(null); }, 1800);
  }, []);

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
        addPlayer(name, data.pc || null);
        showToast('\uD83D\uDC4B ' + name + ' joined' + (data.pc && data.pc.hc ? ' \u2014 ' + data.pc.hc : ''));
      }
      // Player sends back stress/consequence updates — apply to their roster row
      if (data.type === 'player_action' && data.action === 'stress_update' && data.playerId) {
        updPlayer(data.playerId, data.patch || {});
        // Re-broadcast updated state so all players see the change
        if (broadcastRef.current) broadcastRef.current(null, null);
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

  // UNI-02: Binder — extracted to useBoardBinder hook
  var binder = useBoardBinder(
    campId, campMeta.name,
    BOARD_CANVAS_PLAY_KEY + '_' + campId,
    showToast,
    function() { return cardsRef.current; },
    function(next) { setCards(next); persistCanvas(next); },
    function(playCards) { broadcastPlayState(null, playCards); }
  );
  var binderCards   = binder.binderCards;
  var trayCards     = binder.trayCards;
  var binderOpen    = binder.binderOpen;
  var setBinderOpen = binder.setBinderOpen;
  var playCardIds   = binder.playCardIds;
  // PL-03: pre-join character builder — step 0=name, 1=aspects, 2=skills
  var _pcStep = useState(0); var pcStep = _pcStep[0]; var setPcStep = _pcStep[1];
  var _pcDraft = useState({hc:'',trouble:'',aspect3:'',skills:{}}); var pcDraft = _pcDraft[0]; var setPcDraft = _pcDraft[1];
  function updDraft(patch) { setPcDraft(function(d){ return Object.assign({},d,patch); }); }
  // FCon skill pyramid: 1×+4, 2×+3, 3×+2, 4×+1 — total 10 rated skills (FCon p.10)
  var PC_SKILL_LADDER = [{r:4,n:1},{r:3,n:2},{r:2,n:3},{r:1,n:4}];
  var PC_SKILLS = typeof ALL_SKILLS !== 'undefined' ? ALL_SKILLS :
    ['Academics','Athletics','Burglary','Contacts','Crafts','Deceive','Drive',
     'Empathy','Fight','Investigate','Lore','Notice','Physique','Provoke',
     'Rapport','Resources','Shoot','Stealth','Will'];
  function pcSkillRating(skillName) { return pcDraft.skills[skillName] || 0; }
  function pcSkillSlots() {
    // How many at each rating are still available
    var used = {};
    Object.values(pcDraft.skills).forEach(function(r){ used[r]=(used[r]||0)+1; });
    var avail = {};
    PC_SKILL_LADDER.forEach(function(row){ avail[row.r] = row.n - (used[row.r]||0); });
    return avail;
  }
  function togglePcSkill(skillName) {
    var cur = pcDraft.skills[skillName] || 0;
    if (cur > 0) {
      // deselect — remove
      var next = Object.assign({}, pcDraft.skills);
      delete next[skillName];
      updDraft({skills: next});
    } else {
      // select — assign lowest available rating
      var avail = pcSkillSlots();
      var ratings = [4,3,2,1];
      var assign = null;
      for (var i = 0; i < ratings.length; i++) {
        if ((avail[ratings[i]]||0) > 0) { assign = ratings[i]; break; }
      }
      if (assign === null) { showToast('All skill slots filled'); return; }
      var next2 = Object.assign({}, pcDraft.skills);
      next2[skillName] = assign;
      updDraft({skills: next2});
    }
  }
  function pcTotalSkills() { return Object.keys(pcDraft.skills).length; }
  function submitPcJoin() {
    if (!playerJoinName.trim()) return;
    var skills = Object.keys(pcDraft.skills).map(function(name){
      return {name: name, r: pcDraft.skills[name]};
    }).sort(function(a,b){ return b.r - a.r; });
    var aspects = [];
    if (pcDraft.hc) aspects.push(pcDraft.hc);
    if (pcDraft.trouble) aspects.push(pcDraft.trouble);
    if (pcDraft.aspect3) aspects.push(pcDraft.aspect3);
    var payload = {
      type: 'player_hello',
      name: playerJoinName.trim(),
      pc: { hc: pcDraft.hc, trouble: pcDraft.trouble, aspects: aspects, skills: skills }
    };
    syncObj.ws.send(JSON.stringify(payload));
    setPlayerJoinSent(true);
    showToast('\uD83D\uDC4B Sent your character to the GM');
  }

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

  // ── Derived ────────────────────────────────────────────────────────────────
  // campMeta declared early above (before hooks)
  var tables = getWorldTables(campId);
  var canvasKey = mode === 'prep' ? BOARD_CANVAS_PREP_KEY : BOARD_CANVAS_PLAY_KEY;
  var campCanvasKey = canvasKey + '_' + campId;

  // ── useBoardCards — card CRUD, IDB persistence, generate, reroll, undo ────
  // onCardsChange wires back to useBoardBinder so Binder always has a fresh
  // cardsRef snapshot; the ref pattern avoids a circular hook dependency.
  var _bcOnChange = useRef(null);
  var bc = useBoardCards(
    campCanvasKey, campId, campMeta.name, tables, showToast,
    function(next) { if (_bcOnChange.current) _bcOnChange.current(next); }
  );
  var cards            = bc.cards;
  var setCards         = bc.setCards;
  var loaded           = bc.loaded;
  var cardsRef         = bc.cardsRef;
  var lastRemovedRef   = bc.lastRemovedRef;
  var lastRerolledRef  = bc.lastRerolledRef;
  var lastPlacedRef    = bc.lastPlacedRef;
  var persistCanvas    = bc.persistCanvas;
  var generateCard     = bc.generateCard;
  var updateCard       = bc.updateCard;
  var deleteCard       = bc.deleteCard;
  var rerollCard       = bc.rerollCard;
  var undoLast         = bc.undoLast;
  var exportCanvas     = bc.exportCanvas;
  var importCanvas     = bc.importCanvas;

  // Wire _bcOnChange so useBoardBinder receives fresh card snapshots on every mutation
  _bcOnChange.current = function(next) { setCards(next); };

  // ── Coach mark dismiss helpers ────────────────────────────────────────────
  function dismissCoachCanvas() {
    setCoachCanvas(false);
    try { var p=JSON.parse(localStorage.getItem('fate_prefs_v1')||'{}'); p.coach_canvas_dismissed=true; localStorage.setItem('fate_prefs_v1',JSON.stringify(p)); } catch(e) {}
  }
  function dismissCoachPlay() {
    setCoachPlay(false);
    try { var p=JSON.parse(localStorage.getItem('fate_prefs_v1')||'{}'); p.coach_play_dismissed=true; localStorage.setItem('fate_prefs_v1',JSON.stringify(p)); } catch(e) {}
  }

  // ── Select generator (left panel click = generate immediately) ────────────
  function selectGen(genId) {
    setActiveGen(genId);
    generateCard(genId);
  }

  // ── Effects ────────────────────────────────────────────────────────────────

  // ── syncState — received from GM via broadcastState ─────────────────────────
  // Shape: { cards: [...], fp: {...pcs,pool}, players: [...] }
  var _syncState = useState(null); var syncState = _syncState[0]; var setSyncState = _syncState[1];

  // AUTO-JOIN: If ?room=XXXX in URL, connect as player automatically on mount.
  useEffect(function() {
    if (!roomCode || roomCode.length !== 4) return;
    if (typeof createTableSync === 'undefined') return;
    var s = createTableSync(roomCode, 'player',
      function(state) {
        // onStateUpdate — receives full GM broadcast; ignore cursor/action sub-messages
        if (state && state.cards !== undefined) setSyncState(state);
      },
      function() {},
      function(msg) { showToast(msg); },
      function() {}
    );
    if (!s) { showToast('\u26a0 Could not connect'); return; }
    setSyncObj(s);
    setSyncStatus('connecting');
    s.ws.addEventListener('open', function() {
      setSyncStatus('connected');
      showToast('\u2705 Joined room ' + roomCode);
    });
    s.ws.addEventListener('close', function() { setSyncStatus('offline'); });
  }, []); // run once on mount — roomCode is read from URL param

  // Set data-campaign so world CSS vars apply to the card components
  useEffect(function() {
    if (campId) document.documentElement.setAttribute('data-campaign', campId);
    return function() { document.documentElement.removeAttribute('data-campaign'); };
  }, [campId]);

  // UX-01: First-visit empty-canvas coach mark
  // Show once when canvas is loaded and empty and this is a new user (no dismissed flag).
  useEffect(function() {
    if (!loaded) return;
    try {
      var p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      if (!p.coach_canvas_dismissed) setCoachCanvas(true);
    } catch(e) {}
  }, [loaded]);

  // UX-05: First PLAY mode entry coach mark — "Send to Table" explanation
  useEffect(function() {
    if (mode !== 'play') return;
    try {
      var p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      if (!p.coach_play_dismissed) setCoachPlay(true);
    } catch(e) {}
  }, [mode]);

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
      if (saved && saved.pcs) {
        setFpState(saved);
        return;
      }
      // UX-06: Session Zero handoff — pre-populate FP tracker on first board open after Session Zero
      try {
        var raw = sessionStorage.getItem('ogma_sz_handoff');
        if (raw) {
          var handoff = JSON.parse(raw);
          // Only consume if from session_zero and within 10 minutes (avoid stale handoffs)
          if (handoff.from === 'session_zero' && handoff.world === campId &&
              Date.now() - handoff.ts < 10 * 60 * 1000) {
            var n = handoff.partySize || 4;
            var pcs = [];
            for (var _i = 0; _i < n; _i++) {
              pcs.push({id: 'pc_' + (_i + 1), name: 'Player ' + (_i + 1), current: 3, refresh: 3});
            }
            var initial = {pcs: pcs, pool: n};
            setFpState(initial);
            sessionStorage.removeItem('ogma_sz_handoff'); // consume once
            // Show coach mark pointing to FP tracker
            showToast('\u2713 Session Zero loaded \u2014 open FP tracker to name your players');
          }
        }
      } catch(e) {}
    }).catch(function() {});
  }, [campId]);

  // ── Persist FP to IDB ───────────────────────────────────────────────────────
  function persistFP(next) {
    if (typeof DB === 'undefined' || !DB) return;
    DB.saveSession(BOARD_FP_KEY + '_' + campId, next).catch(function() {});
    // Broadcast FP change to players immediately
    broadcastPlayState(next, null);
  }

  // ── Broadcast ref — swapped in when GM is connected, no-op otherwise ─────────
  // broadcastPlayState(fpOverride, playCardsOverride) — either arg can be null to use current state
  var broadcastRef = useRef(null);
  function broadcastPlayState(fpOverride, playCardsOverride) {
    if (broadcastRef.current) broadcastRef.current(fpOverride, playCardsOverride);
  }

  // Wire up broadcastRef when syncObj is connected as GM
  useEffect(function() {
    if (!syncObj || !syncObj.connected || syncObj.role !== 'gm') {
      broadcastRef.current = null;
      return;
    }
    broadcastRef.current = function(fpOverride, playCardsOverride) {
      if (playCardsOverride !== null && playCardsOverride !== undefined) {
        var state = {
          cards: playCardsOverride,
          fp: fpOverride !== null && fpOverride !== undefined ? fpOverride : fpState,
          players: players,
        };
        syncObj.broadcastState(state);
      } else {
        if (typeof DB === 'undefined') return;
        DB.loadSession(BOARD_CANVAS_PLAY_KEY + '_' + campId).then(function(saved) {
          var playCards = (saved && Array.isArray(saved.cards))
            ? saved.cards.filter(function(c) { return !c.gmOnly; })
            : [];
          var state = {
            cards: playCards,
            fp: fpOverride !== null && fpOverride !== undefined ? fpOverride : fpState,
            players: players,
          };
          syncObj.broadcastState(state);
        }).catch(function() {});
      }
    };
  }, [syncObj, fpState, players]);

  // Broadcast when player roster changes (someone joins)
  useEffect(function() {
    if (broadcastRef.current) broadcastRef.current(null, null);
  }, [players.length]);



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

  // EXP-04: Export/import — thin wrappers that supply campCanvasKey + fname to hook
  function exportCanvasBoard() {
    var fname = campMeta.name.replace(/\s+/g,'-').toLowerCase() + '-' + mode + '-board';
    exportCanvas(campCanvasKey, fname);
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
        undoLast();
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
  }, [activeGen, dossierCard]);

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
    // Topbar — grouped props pattern reduces call site from 38 → 8 top-level props
    h(BoardTopbar, {
      campMeta: campMeta,
      mode: mode,
      onModeChange: function(m) { persistCanvas(cards); setMode(m); },
      campId: campId,
      onCampChange: function(newId) { persistCanvas(cards); window.location.href = 'campaigns/board.html?world=' + newId; },
      isOnline: isOnline,
      sync: {
        status: syncStatus,
        roomCode: roomCode,
        role: syncObj ? syncObj.role : null,
        onHost: connectAsHost,
        onDisconnect: disconnectSync,
        onToast: showToast,
      },
      panels: {
        leftOpen: leftOpen,
        onToggleLeft: function() { setLeftOpen(function(v) { return !v; }); },
        showDice: showDice,
        onToggleDice: function() { setShowDice(function(v) { return !v; }); },
        showFP: showFP,
        onToggleFP: function() { setShowFP(function(v) { return !v; }); },
        binderOpen: binderOpen,
        onToggleBinder: function() { binder.setBinderOpen(function(v) { return !v; }); },
        mobileListView: mobileListView,
        onToggleMobileList: function() { setMobileListView(function(v) { return !v; }); },
      },
      counts: {
        onTable: playCardIds.size,
        binder: binderCards.length,
        tray: trayCards.length,
        pin: pinCount,
      },
      exportActions: {
        cards: cards,
        campName: campMeta.name,
        theme: theme,
        onToggleTheme: toggleTheme,
        onExportCanvas: exportCanvas,
        onImportCanvas: importCanvas,
        onPrint: function() {
          if (typeof DB === 'undefined' || !DB.printCards) return;
          var printable = cards.filter(function(card) {
            return card.genId && card.genId !== 'sticky' && card.genId !== 'boost' && card.genId !== 'label' && card.data;
          }).map(function(card) {
            return {genId: card.genId, title: card.title, summary: card.summary, tags: card.tags || [], data: card.data};
          });
          if (!printable.length) { showToast('No cards to print'); return; }
          DB.printCards(printable, campMeta.name);
          showToast('Opening print view\u2026');
        },
      },
    }),

    h('div', {className: 'board-body'},

      // UNI-04: Left panel — Generate/Stunts/Help always visible.
      // In PLAY mode the player roster appears below the generator list.
      h('div', {className: 'blp-wrap' + (leftOpen ? '' : ' blp-hidden')},
        h(BoardLeftPanel, {
          activeGen: activeGen,
          onSelectGen: selectGen,
          campId: campId,
          activeTab: leftTab,
          onTabChange: setLeftTab,
          campName: campMeta.name,
        }),
        // UNI-05: Player roster visible in both modes as a panel beneath the generator
        h(BoardPlayPanel, {
          players: players,
          selPlayer: selPlayer,
          onSel: setSelPlayer,
          onUpd: updPlayer,
          onAdd: addPlayer,
          collapsed: mode === 'prep',
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
          onEndScene: function() { endScene(); showToast('Scene ended \u2014 stress cleared'); broadcastPlayState(null, null); },
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
              onSendToTable: binder.sendToTable,
              onRemoveFromTable: binder.removeFromTable,
              onOpen: setDossierCard,
              onDragStart: onDragStart,
              onUpdate: updateCard,
              mode: mode,
              campId: campId,
              isOnTable: playCardIds.has(card.id),
            });
          })
        ),

        // Empty state
        // PL-03: Pre-join character builder (3 steps)
        syncObj && syncObj.role === 'player' && syncStatus === 'connected' && !playerJoinSent &&
          h('div', {className: 'board-waiting-banner bwb-wizard', role:'dialog', 'aria-label':'Join session'},

            // Step progress dots
            h('div', {className:'bwb-steps', 'aria-label':'Step ' + (pcStep+1) + ' of 3'},
              [0,1,2].map(function(i){
                return h('div', {key:i, className:'bwb-step-dot' + (i===pcStep?' active':i<pcStep?' done':'')});
              })
            ),

            // ── STEP 0: Name ──────────────────────────────────────────────
            pcStep === 0 && h('div', null,
              h('div', {className:'bwb-icon'}, '\uD83C\uDF10'),
              h('div', {className:'bwb-title'}, 'Join Session'),
              h('div', {className:'bwb-sub'}, 'What should the GM call you?'),
              h('input', {
                type:'text', className:'bwb-input', style:{marginBottom:10},
                placeholder:'Your name\u2026', value:playerJoinName,
                'aria-label':'Your player name', autoFocus:true, maxLength:30,
                onChange: function(e){ setPlayerJoinName(e.target.value); },
                onKeyDown: function(e){ if(e.key==='Enter'&&playerJoinName.trim()) setPcStep(1); },
              }),
              h('div', {className:'bwb-row', style:{justifyContent:'flex-end'}},
                h('button', {
                  className:'bwb-btn', disabled:!playerJoinName.trim(),
                  onClick: function(){ if(playerJoinName.trim()) setPcStep(1); },
                }, 'Next \u2192')
              )
            ),

            // ── STEP 1: Aspects ───────────────────────────────────────────
            pcStep === 1 && h('div', null,
              h('div', {className:'bwb-title', style:{marginBottom:4}}, playerJoinName),
              h('div', {className:'bwb-sub', style:{marginBottom:12}}, 'Give your character a High Concept and Trouble. Both optional — you can fill in at the table.'),
              h('div', {className:'bwb-field'},
                h('label', {className:'bwb-lbl', htmlFor:'bwb-hc'}, 'High Concept'),
                h('input', {
                  id:'bwb-hc', type:'text', className:'bwb-input',
                  placeholder:'e.g. Burned Ex-Corporate Fixer\u2026', maxLength:60,
                  value:pcDraft.hc, autoFocus:true,
                  onChange:function(e){updDraft({hc:e.target.value});},
                })
              ),
              h('div', {className:'bwb-field'},
                h('label', {className:'bwb-lbl', htmlFor:'bwb-tr'}, 'Trouble'),
                h('input', {
                  id:'bwb-tr', type:'text', className:'bwb-input',
                  placeholder:'e.g. Debts That Never Disappear\u2026', maxLength:60,
                  value:pcDraft.trouble,
                  onChange:function(e){updDraft({trouble:e.target.value});},
                })
              ),
              h('div', {className:'bwb-field'},
                h('label', {className:'bwb-lbl', htmlFor:'bwb-a3'}, 'Free Aspect (optional)'),
                h('input', {
                  id:'bwb-a3', type:'text', className:'bwb-input',
                  placeholder:'Another aspect\u2026', maxLength:60,
                  value:pcDraft.aspect3,
                  onChange:function(e){updDraft({aspect3:e.target.value});},
                })
              ),
              h('div', {className:'bwb-row', style:{justifyContent:'space-between',marginTop:10}},
                h('button', {className:'bwb-btn bwb-back', onClick:function(){setPcStep(0);}}, '\u2190 Back'),
                h('button', {className:'bwb-btn', onClick:function(){setPcStep(2);}}, 'Next \u2192')
              )
            ),

            // ── STEP 2: Skills ────────────────────────────────────────────
            pcStep === 2 && h('div', null,
              h('div', {className:'bwb-title', style:{marginBottom:2}}, playerJoinName),
              h('div', {className:'bwb-sub', style:{marginBottom:8}},
                'Pick skills to assign ratings. ' +
                'Tap a skill to add it at the next available slot (\u00b14 \u00b13\u00d72 \u00b12\u00d72 \u00b11\u00d74). ' +
                'Tap again to remove. Skip and finish at the table.'
              ),
              // Ladder summary
              h('div', {className:'bwb-ladder'},
                PC_SKILL_LADDER.map(function(row){
                  var used = Object.values(pcDraft.skills).filter(function(r){return r===row.r;}).length;
                  return h('div', {key:row.r, className:'bwb-ladder-row'},
                    h('span', {className:'bwb-ladder-rating', style:{color: used===row.n?'var(--c-green)':'var(--accent)'}},
                      '+' + row.r),
                    Array.from({length:row.n}).map(function(_,i){
                      return h('div', {key:i, className:'bwb-ladder-pip'+(i<used?' filled':'')});
                    })
                  );
                })
              ),
              // Skill grid
              h('div', {className:'bwb-skill-grid'},
                PC_SKILLS.map(function(sk){
                  var r = pcSkillRating(sk);
                  return h('button', {
                    key:sk,
                    className:'bwb-skill-btn' + (r>0?' selected':''),
                    onClick:function(){togglePcSkill(sk);},
                    'aria-pressed': String(r>0),
                    title: r>0 ? '+'+r+' '+sk : sk,
                  },
                    r>0 && h('span', {className:'bwb-skill-r'}, '+'+r),
                    sk
                  );
                })
              ),
              h('div', {className:'bwb-row', style:{justifyContent:'space-between',marginTop:10}},
                h('button', {className:'bwb-btn bwb-back', onClick:function(){setPcStep(1);}}, '\u2190 Back'),
                h('button', {
                  className:'bwb-btn',
                  onClick: submitPcJoin,
                }, '\u2713 Join Session')
              )
            )
          ),

        syncObj && syncObj.role === 'player' && syncStatus === 'connected' && playerJoinSent &&
          (syncState
            ? h(PlayerSurface, {
                syncState:  syncState,
                playerName: playerJoinName,
                roomCode:   roomCode,
                syncObj:    syncObj,
                syncStatus: syncStatus,
                campId:     campId,
              })
            : h('div', {className: 'board-waiting-banner board-waiting-sent'},
                h('div', {className: 'bwb-icon'}, '\u23F3'),
                h('div', {className: 'bwb-title'}, 'Waiting for GM\u2026'),
                h('div', {className: 'bwb-sub'}, 'The GM will add you to the tracker and set the scene.')
              )
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

        // UX-01: First-visit canvas coach mark — shown once, dismissed permanently
        coachCanvas && cards.length === 0 && loaded && mode === 'prep' &&
          h('div', {className: 'board-coach board-coach-canvas', role: 'dialog', 'aria-label': 'Getting started tip'},
            h('div', {className: 'bc-coach-body'},
              h('div', {className: 'bc-coach-icon'}, '\uD83C\uDFB2'),
              h('div', {className: 'bc-coach-text'},
                h('strong', null, 'This is your GM canvas'),
                h('span', null, ' \u2014 generate cards from the left panel, arrange them here. Switch to ',
                  h('strong', null, 'Play'),
                  ' and click ',
                  h('strong', null, 'Host'),
                  ' when your players are ready.'
                )
              ),
              h('button', {
                className: 'bc-coach-dismiss',
                onClick: dismissCoachCanvas,
                'aria-label': 'Dismiss tip',
              }, '\u00D7')
            )
          ),

        // UX-05: First PLAY mode entry coach mark — "Send to Table" explanation
        coachPlay && mode === 'play' &&
          h('div', {className: 'board-coach board-coach-play', role: 'dialog', 'aria-label': 'Play mode tip'},
            h('div', {className: 'bc-coach-body'},
              h('div', {className: 'bc-coach-icon'}, '\u25CF'),
              h('div', {className: 'bc-coach-text'},
                h('strong', null, 'Prep cards are private.'),
                h('span', null, ' Use ',
                  h('strong', null, '\u25CF Send to Table'),
                  ' on any Prep card to share it with connected players. Players see the Play canvas \u2014 not your Prep canvas.'
                )
              ),
              h('button', {
                className: 'bc-coach-dismiss',
                onClick: dismissCoachPlay,
                'aria-label': 'Dismiss tip',
              }, '\u00D7')
            )
          ),

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
            {id: 'custom',    icon: '\u270E',        label: 'Custom Card'},
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

    // UNI-02: Binder right panel — PREP mode only, toggleable
    mode === 'prep' && binderOpen && h('div', {className: 'bbp-wrap'},
      h(BoardBinderPanel, {
        campId: campId,
        campName: campMeta.name,
        binderCards: binderCards,
        trayCards: trayCards,
        onAddToTray: binder.addToTray,
        onRemoveFromTray: binder.removeFromTray,
        onSendTrayToCanvas: binder.sendTrayToCanvas,
        onSendToCanvas: binder.sendToCanvas,
        onExportCard: binder.exportCard,
        onUnpin: binder.unpinCard,
      })
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
            'aria-label': '4-character room code',
            maxLength: 4,
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

    // Dossier modal — GM Guidance + actions (cv4Card visible inline on canvas)
    dossierCard && h(BoardDossier, {
      card: dossierCard,
      onClose: function() { setDossierCard(null); },
      onReroll: rerollCard,
      onSendToTable: binder.sendToTable,
      onRemoveFromTable: binder.removeFromTable,
      onDelete: deleteCard,
      isOnTable: playCardIds.has(dossierCard.id),
      mode: mode,
      campName: campMeta.name,
      campId: campId,
    })
  );
}
