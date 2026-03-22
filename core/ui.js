// ui.js — TableManagerModal + CampaignApp (entry point for campaign pages)
// Load order: ui-primitives.js → ui-renderers.js → ui-modals.js → ui-landing.js → ui.js
// Depends on: all prior ui-*.js files, engine.js, db.js
// ════════════════════════════════════════════════════════════════════════
// FLOATER — draggable, minimisable, always-on-top tool panel wrapper
// Used by FatePointTracker, CountdownTracker, SessionDoc.
// Drag handle: the header bar. Minimise: collapses to header only.
// z-index: bumped to front on any pointer interaction.
// Position persisted per panel ID in IDB.
// ════════════════════════════════════════════════════════════════════════
var _floaterZ = 300; // global z-index counter — all floaters start here
var _appShell = null; // lazy cache for .app-shell singleton
function getAppShell() { return _appShell || (_appShell = document.querySelector('.app-shell')); }

function Floater(props) {
  var id         = props.id;
  var floaterId  = props.floaterId || ('floater-' + id);
  var triggerId  = props.triggerId || null; // sidebar btn to return focus to on close
  var title      = props.title;
  var icon       = props.icon || '';
  var onClose    = props.onClose;
  var defaultX   = props.defaultX !== undefined ? props.defaultX : (typeof window !== 'undefined' ? Math.max(8, window.innerWidth - 316) : 200);
  var defaultY   = props.defaultY !== undefined ? props.defaultY : 60;
  var width      = props.width || 300;

  const [pos, setPos] = useState(null);
  const [mini, setMini] = useState(false);
  const [z, setZ] = useState(_floaterZ);
  var floaterRef = useRef(null);
  var dragging   = useRef(false);
  var dragOffset = useRef({dx: 0, dy: 0});

  // Load saved position from IDB on mount; then focus first interactive element
  useEffect(function() {
    DB.loadSession('floater_pos_' + id).then(function(saved) {
      if (saved && typeof saved.x === 'number') {
        var maxX = Math.max(8, window.innerWidth  - width - 8);
        var maxY = Math.max(8, window.innerHeight - 48);
        setPos({x: Math.min(Math.max(8, saved.x), maxX),
                y: Math.min(Math.max(44, saved.y), maxY)});
      } else {
        setPos({x: defaultX, y: defaultY});
      }
    }).catch(function() { setPos({x: defaultX, y: defaultY}); });
  }, [id]);

  // Focus first interactive element once panel renders (a11y: focus-on-open)
  useEffect(function() {
    if (!pos) return; // not rendered yet
    var el = floaterRef.current;
    if (!el) return;
    var focusable = el.querySelector('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusable) return;
    var t = setTimeout(function() { focusable.focus(); }, 50);
    return function() { clearTimeout(t); };
  }, [!!pos]); // only fires when pos transitions null→value (mount)

  // Return focus to trigger button on unmount (a11y: focus-return-on-close)
  useEffect(function() {
    return function() {
      if (triggerId) {
        var trigger = document.getElementById(triggerId);
        if (trigger) trigger.focus();
      }
    };
  }, [triggerId]);

  function bringToFront() { _floaterZ += 1; setZ(_floaterZ); }

  function persistPos(p) {
    if (p) DB.saveSession('floater_pos_' + id, p).catch(function(err){ console.warn('[Ogma] floater pos save failed:', err); });
  }

  // ── Mouse/touch drag ──────────────────────────────────────────────
  function onHandlePointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    bringToFront();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragging.current = true;
    dragOffset.current = {
      dx: clientX - (pos ? pos.x : defaultX),
      dy: clientY - (pos ? pos.y : defaultY),
    };
    e.preventDefault();
  }

  useEffect(function() {
    function onMove(e) {
      if (!dragging.current) return;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      var nx = Math.max(8, Math.min(window.innerWidth  - width - 8, clientX - dragOffset.current.dx));
      var ny = Math.max(44, Math.min(window.innerHeight - 48,        clientY - dragOffset.current.dy));
      setPos({x: nx, y: ny});
    }
    function onUp() {
      if (!dragging.current) return;
      dragging.current = false;
      setPos(function(p) { persistPos(p); return p; });
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('touchmove', onMove, {passive: false});
    document.addEventListener('touchend',  onUp);
    return function() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend',  onUp);
    };
  }, [id, width]);

  // ── Keyboard repositioning (Alt+Arrow = 10px, WCAG 2.1.1) ─────────
  function onHandleKeyDown(e) {
    if (!e.altKey) return;
    var step = 10;
    var moved = false;
    var nx = pos ? pos.x : defaultX;
    var ny = pos ? pos.y : defaultY;
    if (e.key === 'ArrowLeft')  { nx = Math.max(8, nx - step); moved = true; }
    if (e.key === 'ArrowRight') { nx = Math.min(window.innerWidth  - width - 8, nx + step); moved = true; }
    if (e.key === 'ArrowUp')    { ny = Math.max(44, ny - step); moved = true; }
    if (e.key === 'ArrowDown')  { ny = Math.min(window.innerHeight - 48, ny + step); moved = true; }
    if (moved) {
      e.preventDefault();
      var newPos = {x: nx, y: ny};
      setPos(newPos);
      persistPos(newPos);
    }
  }

  if (!pos) return null;

  return h('div', {
    ref: floaterRef,
    id: floaterId,
    className: 'floater' + (mini ? ' floater-mini' : ''),
    role: 'region',
    'aria-label': title,
    style: { position: 'fixed', left: pos.x + 'px', top: pos.y + 'px', width: width + 'px', zIndex: z },
    onPointerDown: bringToFront,
  },
    // ── Drag handle / header ──────────────────────────────────────────
    h('div', {
      className: 'floater-handle',
      onMouseDown:  onHandlePointerDown,
      onTouchStart: onHandlePointerDown,
      onKeyDown:    onHandleKeyDown,
      title: 'Drag to reposition · Alt+Arrow keys to move',
      tabIndex: 0,
      'aria-label': 'Move ' + title + ' panel — drag or use Alt+Arrow keys',
    },
      h('span', {className: 'floater-handle-icon', 'aria-hidden': 'true'}, icon),
      h('span', {className: 'floater-handle-title'}, title),
      h('div', {className: 'floater-handle-actions'},
        // Conflict A-c: 44px on close/minimise buttons
        h('button', {
          className: 'floater-btn',
          onClick: function(e) { e.stopPropagation(); setMini(function(m) { return !m; }); },
          title: mini ? 'Expand' : 'Minimise',
          'aria-label': mini ? ('Expand ' + title + ' panel') : ('Minimise ' + title + ' panel'),
          'aria-pressed': String(mini),
          style: {width: 44, height: 44},
        }, mini ? '▢' : '─'),
        h('button', {
          className: 'floater-btn floater-btn-close',
          'aria-label': 'Close',
          onClick: function(e) { e.stopPropagation(); onClose(); },
          title: 'Close',
          'aria-label': 'Close ' + title,
          style: {width: 44, height: 44},
        }, '✕')
      )
    ),
    !mini && h('div', {className: 'floater-body'}, props.children)
  );
}

// TABLE MANAGER MODAL
// ════════════════════════════════════════════════════════════════════════

function TableManagerModal(props) {
  var t        = props.tables;  // original (unfiltered) tables
  var prefs    = props.prefs;
  var onChange = props.onPrefsChange;
  var activeGen = props.activeGen || '';

  // Map generators to their first relevant table group key
  var GEN_TO_GROUP = {
    npc_minor:'npc_names', npc_major:'npc_names', scene:'scene_tone',
    campaign:'current_issues', encounter:'opposition', seed:'seed_locations',
    compel:'compel_situations', challenge:'challenge_types',
    consequence:'consequence_mild', faction:'faction_goals',
    complication:'complication_aspects', backstory:'backstory_questions',
    obstacle:'opposition', countdown:'opposition', constraint:'opposition',
  };

  // Build flat ordered list of available table keys that exist in this campaign
  var allKeys = [];
  TABLE_GROUPS.forEach(function(g) {
    g.keys.forEach(function(k) {
      if (t[k] && Array.isArray(t[k]) && t[k].length > 0) allKeys.push(k);
    });
  });

  // Default selection: use the active generator's mapped key if available
  var defaultKey = GEN_TO_GROUP[activeGen] || allKeys[0] || '';
  if (allKeys.indexOf(defaultKey) === -1) defaultKey = allKeys[0] || '';

  const [selKey, setSelKey] = useState(defaultKey);
  const [custIn, setCustIn] = useState('');
  const [skillFilt, setSkillFilt] = useState('');

  // Resolve selected key - handle universal prefix (must be before allEntries)
  var isUniversalKey = selKey.indexOf('u_') === 0;
  var resolvedKey = isUniversalKey ? selKey.slice(2) : selKey;

  var allEntries = isUniversalKey ? (typeof UNIVERSAL !== 'undefined' ? UNIVERSAL[resolvedKey] || [] : []) : (t[selKey] || []);
  // For stunts table: extract unique skills for filter dropdown
  var isStuntTable = selKey === 'stunts';
  var stuntSkills = isStuntTable
    ? [''].concat(allEntries.reduce(function(acc, e) {
        if (e && e.skill && acc.indexOf(e.skill) === -1) acc.push(e.skill);
        return acc;
      }, []).sort())
    : [];
  // Apply skill filter (stunts only) - filter view only, indices still map to allEntries
  var visibleIndices = isStuntTable && skillFilt
    ? allEntries.reduce(function(acc, e, i) {
        if (e && e.skill === skillFilt) acc.push(i);
        return acc;
      }, [])
    : allEntries.map(function(_, i) { return i; });
  var entries = allEntries;
  var exclArr = ((prefs.excluded || {})[selKey]) || [];
  var lockArr = ((prefs.locked   || {})[selKey]) || [];
  var custArr = ((prefs.custom   || {})[selKey]) || [];
  var isStr   = entries.length > 0 && typeof entries[0] === 'string';
  var lockMode = lockArr.length > 0;
  var activeCount = lockMode
    ? lockArr.length + custArr.length
    : entries.filter(function(_, i) { return exclArr.indexOf(i) === -1; }).length + custArr.length;

  function setPrefs(patch) { onChange(Object.assign({}, prefs, patch)); }

  function toggleExclude(i) {
    var a = exclArr.slice();
    var l = lockArr.slice();
    var pos = a.indexOf(i);
    if (pos === -1) {
      a.push(i);
      // remove from locked if now excluded
      var lp = l.indexOf(i); if (lp !== -1) l.splice(lp, 1);
    } else { a.splice(pos, 1); }
    setPrefs({
      excluded: Object.assign({}, prefs.excluded, {[selKey]: a}),
      locked:   Object.assign({}, prefs.locked,   {[selKey]: l}),
    });
  }

  function toggleLock(i) {
    var l = lockArr.slice();
    var a = exclArr.slice();
    var pos = l.indexOf(i);
    if (pos === -1) {
      l.push(i);
      // remove from excluded if now locked
      var ap = a.indexOf(i); if (ap !== -1) a.splice(ap, 1);
    } else { l.splice(pos, 1); }
    setPrefs({
      locked:   Object.assign({}, prefs.locked,   {[selKey]: l}),
      excluded: Object.assign({}, prefs.excluded, {[selKey]: a}),
    });
  }

  function addCustom() {
    var val = custIn.trim(); if (!val) return;
    var arr = custArr.concat([val]);
    setCustIn('');
    setPrefs({ custom: Object.assign({}, prefs.custom, {[selKey]: arr}) });
  }

  function removeCustom(idx) {
    var arr = custArr.filter(function(_, i) { return i !== idx; });
    setPrefs({ custom: Object.assign({}, prefs.custom, {[selKey]: arr}) });
  }

  function resetTable() {
    var e = Object.assign({}, prefs.excluded); delete e[selKey];
    var l = Object.assign({}, prefs.locked);   delete l[selKey];
    var c = Object.assign({}, prefs.custom);   delete c[selKey];
    onChange({ excluded: e, locked: l, custom: c });
  }

  var hasChanges = exclArr.length > 0 || lockArr.length > 0 || custArr.length > 0;

  // Build <optgroup> select options
  var optGroups = TABLE_GROUPS.map(function(g) {
    var opts = g.keys
      .filter(function(k) { return t[k] && Array.isArray(t[k]) && t[k].length > 0; })
      .map(function(k) {
        var e2 = ((prefs.excluded || {})[k] || []).length;
        var l2 = ((prefs.locked   || {})[k] || []).length;
        var c2 = ((prefs.custom   || {})[k] || []).length;
        var badge = e2 ? ' [' + e2 + '✕]' : l2 ? ' [' + l2 + '🔒]' : c2 ? ' [+' + c2 + ']' : '';
        return h('option', {key: k, value: k}, (TABLE_META[k] || k) + badge);
      });
    if (!opts.length) return null;
    return h('optgroup', {key: g.label, label: g.label}, opts);
  }).filter(Boolean);

  // Add universal/generic tables as a browseable optgroup when merge is on
  var uKeys = typeof UNIVERSAL !== 'undefined' ? Object.keys(UNIVERSAL).filter(function(k) {
    return UNIVERSAL[k] && Array.isArray(UNIVERSAL[k]) && UNIVERSAL[k].length > 0;
  }) : [];
  if (props.universalMerge && uKeys.length > 0) {
    var uOpts = uKeys.map(function(k) {
      return h('option', {key: 'u_' + k, value: 'u_' + k}, (TABLE_META[k] || k) + ' (generic)');
    });
    optGroups.push(h('optgroup', {key: 'Generic Fate', label: 'Generic Fate Tables'}, uOpts));
  }

  return h(Modal, {onClose: props.onClose, label: 'Customize Tables'},
    h('div', {className: 'modal-box modal-box-wide', style: {maxHeight: '92vh', display: 'flex', flexDirection: 'column'}},

      // ── Header ────────────────────────────────────────────────────
      h('div', {className: 'modal-header'},
        h('div', {className: 'modal-title'}, '🎛 Customize Tables'),
        h('button', {className: 'btn btn-icon btn-ghost', onClick: props.onClose, 'aria-label': 'Close'}, '✕')
      ),

      // ── Intro ──────────────────────────────────────────────────────
      h('div', {style: {
        padding: '8px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0,
        fontSize: 'var(--text-label)', color: 'var(--text-muted)', lineHeight: 1.5,
      }}, 'Exclude entries you don\'t want, lock entries to force them, or add your own.' +
        (props.universalMerge ? ' Generic Fate tables are included - change in ⚙ Settings.' : ' Generic Fate tables are off - enable in ⚙ Settings.')),

      // ── Table selector bar ────────────────────────────────────────
      h('div', {style: {padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flexShrink: 0}},
        h('select', {
          className: 'tm-select',
          value: selKey,
          onChange: function(e) { setSelKey(e.target.value); setCustIn(''); setSkillFilt(''); },
          'aria-label': 'Select table',
        }, optGroups),
        isStuntTable && stuntSkills.length > 1 && h('select', {
          className: 'tm-select',
          value: skillFilt,
          onChange: function(e) { setSkillFilt(e.target.value); },
          'aria-label': 'Filter stunts by skill',
          title: 'Filter by skill',
          style: {minWidth: 110},
        }, stuntSkills.map(function(sk) {
          return h('option', {key: sk, value: sk}, sk === '' ? 'All skills' : sk);
        })),
        h('div', {className: 'tm-count'}, activeCount + ' / ' + (entries.length + custArr.length) + ' active'),
        hasChanges && h('button', {
          className: 'btn btn-ghost',
          onClick: resetTable,
          title: 'Reset this table to defaults',
          style: {fontSize: 'var(--text-label)', padding: '5px 10px'},
        }, '↺ Reset')
      ),

      // ── Legend ────────────────────────────────────────────────────
      h('div', {style: {
        padding: '6px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0,
        fontSize: 'var(--text-label)', color: 'var(--text-muted)', display: 'flex', gap: 14, flexWrap: 'wrap',
      }},
        h('span', null, '🔒 Lock = only locked entries roll'),
        h('span', null, '✕ Exclude = remove from pool'),
        h('span', null, '✦ Custom entries are always included')
      ),

      // ── Lock mode warning ─────────────────────────────────────────
      lockMode && h('div', {className: 'tm-lock-warning'},
        '🔒 Lock mode - only ' + lockArr.length + ' locked entr' + (lockArr.length === 1 ? 'y' : 'ies') + ' will roll from this table'
      ),

      // ── Entry list ────────────────────────────────────────────────
      h('div', {style: {overflowY: 'auto', flex: 1}},
        visibleIndices.map(function(i) {
          var entry = allEntries[i];
          var isExcl = exclArr.indexOf(i) !== -1;
          var isLock = lockArr.indexOf(i) !== -1;
          var lbl = entryLabel(entry);
          var display = lbl.length > 130 ? lbl.slice(0, 130) + '…' : lbl;
          var rowClass = 'tm-entry-row' + (isLock ? ' is-locked' : isExcl ? ' is-excl' : '');
          return h('div', {key: i, className: rowClass},
            h('button', {
              className: 'tm-icon-btn',
              onClick: function() { toggleLock(i); },
              title: isLock ? 'Unlock' : 'Lock - only locked entries will roll',
              style: {color: isLock ? 'var(--accent)' : 'var(--text-muted)'},
              'aria-pressed': String(isLock), 'aria-label': 'Lock entry',
            }, isLock ? '🔒' : '🔓'),
            h('button', {
              className: 'tm-icon-btn',
              onClick: function() { toggleExclude(i); },
              title: isExcl ? 'Re-include' : 'Exclude from pool',
              style: {color: isExcl ? 'var(--c-red)' : 'var(--text-muted)', fontWeight: 700, fontSize: 13, paddingLeft: 5, paddingRight: 5},
              'aria-pressed': String(isExcl), 'aria-label': 'Exclude entry',
            }, isExcl ? '✕' : '○'),
            h('div', {
              className: 'tm-entry-text' + (isExcl ? ' is-excl' : ''),
            }, display)
          );
        }),

        // Custom entries section
        custArr.length > 0 && h('div', null,
          h('div', {className: 'tm-custom-badge'}, '✦ Custom Entries'),
          custArr.map(function(entry, ci) {
            return h('div', {key: 'c' + ci, className: 'tm-entry-row is-locked'},
              h('span', {style: {fontSize: 14, color: 'var(--accent)', flexShrink: 0, paddingTop: 2, marginRight: 2}}, '✦'),
              h('div', {className: 'tm-entry-text', style: {flex: 1}}, entry),
              h('button', {
                className: 'tm-icon-btn',
                onClick: function() { removeCustom(ci); },
                style: {color: 'var(--c-red)', marginLeft: 4},
                title: 'Remove custom entry', 'aria-label': 'Remove',
              }, '✕')
            );
          })
        )
      ),

      // ── Custom entry input ─────────────────────────────────────────
      isStr
        ? h('div', {className: 'tm-custom-row'},
            h('input', {
              type: 'text', className: 'tm-input',
              value: custIn,
              onInput: function(e) { setCustIn(e.target.value); },
              onKeyDown: function(e) { if (e.key === 'Enter') addCustom(); },
              placeholder: 'Add a custom entry to this table…',
              'aria-label': 'Custom entry text',
            }),
            h('button', {
              className: 'btn btn-primary',
              onClick: addCustom,
              disabled: !custIn.trim(),
              style: {flexShrink: 0},
            }, '+ Add')
          )
        : h('div', {className: 'tm-no-custom'},
            "Custom text entries aren\u2019t available for structured tables. Use lock and exclude to shape the pool."
          )
    )
  );
}

// ════════════════════════════════════════════════════════════════════════
// Next Step Strip
// Contextual "What next?" suggestions shown below a generated result.
// Maps genId → two logical follow-up generators with short prompts.
// ════════════════════════════════════════════════════════════════════════

var NEXT_STEP_MAP = {
  npc_major:    [{id:'scene',       hint:'Build their scene'},    {id:'seed',        hint:'Add a story seed'}],
  npc_minor:    [{id:'scene',       hint:'Set the scene'},        {id:'encounter',   hint:'Create an encounter'}],
  scene:        [{id:'encounter',   hint:'Add opposition'},       {id:'npc_minor',   hint:'Populate it'}],
  encounter:    [{id:'consequence', hint:'After the fight'},      {id:'complication',hint:'Add a twist'}],
  seed:         [{id:'faction',     hint:'Who\'s behind it?'},    {id:'obstacle',    hint:'What\'s in the way?'}],
  faction:      [{id:'npc_major',   hint:'Give it a face'},       {id:'seed',        hint:'What do they want?'}],
  compel:       [{id:'consequence', hint:'How bad does it get?'}, {id:'complication',hint:'Pile on'}],
  backstory:    [{id:'npc_major',   hint:'Flesh them out'},       {id:'compel',      hint:'Exploit the past'}],
  campaign:     [{id:'npc_major',   hint:'Create your villain'},  {id:'scene',       hint:'Open scene'}],
  challenge:    [{id:'obstacle',    hint:'Raise the stakes'},     {id:'countdown',   hint:'Add pressure'}],
  contest:      [{id:'complication',hint:'Complicate it'},        {id:'compel',      hint:'Make it personal'}],
  consequence:  [{id:'compel',      hint:'Invoke against them'},  {id:'scene',       hint:'Scene of recovery'}],
  complication: [{id:'scene',       hint:'Set the new scene'},    {id:'compel',      hint:'Add a compel'}],
  obstacle:     [{id:'scene',       hint:'Build the scene'},      {id:'encounter',   hint:'Who guards it?'}],
  countdown:    [{id:'scene',       hint:'Scene of escalation'},  {id:'complication',hint:'Introduce wrinkle'}],
  constraint:   [{id:'scene',       hint:'Scene it generates'},   {id:'encounter',   hint:'Force the issue'}],
};


// ════════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════════
// MOBILE BOTTOM SHEET
// iOS-native "more options" sheet. Slides up from bottom edge.
// Renders at root level so it overlays everything including sticky header.
// Uses CSS animation (sheet-in keyframe). Safe-area aware via env().
// ════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════
// Fate Point Tracker
// Floating panel showing per-PC fate point pools.
// State persisted to localStorage as fate_fp_state.
// Default state: 3 PCs, each with refresh=3, current=3.
// ════════════════════════════════════════════════════════════════════════

var DEFAULT_FP_STATE = {
  pcs: [
    {id: 1, name: 'PC 1', refresh: 3, current: 3},
    {id: 2, name: 'PC 2', refresh: 3, current: 3},
    {id: 3, name: 'PC 3', refresh: 3, current: 3},
  ],
  pool: 0,
};

// ════════════════════════════════════════════════════════════════════════
// MILESTONE TRACKER — session-only, no persistence
// Renders as second tab in the FP panel
// ════════════════════════════════════════════════════════════════════════

function MilestoneTracker(props) {
  const [minorDone, setMinorDone] = useState([]);
  const [majorDone, setMajorDone] = useState([]);

  var MINOR_OPTIONS = [
    'Swap two skill ratings',
    'Rewrite one stunt (free)',
    'Buy a new stunt (−1 Refresh)',
    'Rewrite any non-High Concept aspect',
  ];
  var MAJOR_OPTIONS = [
    'Do one Milestone option',
    'Increase one skill rating by one step',
    'Rewrite High Concept (optional)',
    'Begin recovery on moderate/severe consequence',
  ];

  function toggle(arr, setArr, val) {
    setArr(function(prev) {
      return prev.includes(val) ? prev.filter(function(x) { return x !== val; }) : prev.concat([val]);
    });
  }

  function Option(oProps) {
    var checked = oProps.arr.includes(oProps.val);
    return h('label', {
      className: 'milestone-strike' + (checked ? ' done' : ''),
      onClick: function() { toggle(oProps.arr, oProps.setArr, oProps.val); },
      style: {
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: '6px 0', cursor: 'pointer',
        borderBottom: '1px solid var(--border)',
        color: checked ? 'var(--text)' : 'var(--text-dim)',
      },
    },
      h('div', {
        className: checked ? 'milestone-check-pop' : '',
        style: {
          width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1,
          border: '1.5px solid ' + (checked ? 'var(--accent)' : 'var(--border)'),
          background: checked ? 'var(--accent)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, color: 'var(--bg)',
        }
      }, checked ? '✓' : ''),
      h('span', {style: {fontSize: 'var(--text-sm)', lineHeight: 1.45, opacity: checked ? 0.6 : 1}}, oProps.val)
    );
  }

  return h('div', {style: {padding: '4px 0'}},
    h('div', {style: {marginBottom: 14}},
      h('div', {style: {fontSize: 'var(--text-label)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6}}, '⬡ Milestone'),
      h('div', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)', marginBottom: 8}}, 'End of every session - pick ONE'),
      MINOR_OPTIONS.map(function(opt) { return h(Option, {key: opt, val: opt, arr: minorDone, setArr: setMinorDone}); }),
      h('button', {
        onClick: function() { setMinorDone([]); },
        style: {marginTop: 8, fontSize: 'var(--text-label)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-ui)'},
      }, '↺ Clear')
    ),
    h('div', null,
      h('div', {style: {fontSize: 'var(--text-label)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-purple)', marginBottom: 6}}, '◆ Breakthrough'),
      h('div', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)', marginBottom: 8}}, 'End of a story arc - do ALL of these'),
      MAJOR_OPTIONS.map(function(opt) { return h(Option, {key: opt, val: opt, arr: majorDone, setArr: setMajorDone}); }),
      h('button', {
        onClick: function() { setMajorDone([]); },
        style: {marginTop: 8, fontSize: 'var(--text-label)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-ui)'},
      }, '↺ Clear')
    )
  );
}

// ════════════════════════════════════════════════════════════════════════
// POPCORN INITIATIVE TRACKER — session-only, wired to last Encounter result
// ════════════════════════════════════════════════════════════════════════

function PopcornTracker(props) {
  var partySize = props.partySize || 3;
  var lastEncounter = props.lastEncounter || null;

  // Build default participant list from encounter opposition + generic PCs
  function defaultParticipants() {
    var list = [];
    for (var i = 1; i <= partySize; i++) { list.push({id: 'pc_'+i, name: 'PC '+i, done: false, type: 'pc'}); }
    if (lastEncounter && lastEncounter.opposition) {
      lastEncounter.opposition.forEach(function(o, i) {
        list.push({id: 'npc_'+i, name: o.name || ('NPC '+(i+1)), done: false, type: 'npc'});
      });
    }
    return list;
  }

  // Load from sessionStorage, fall back to defaults
  const [participants, setParticipants] = useState(function() {
    try {
      var saved = sessionStorage.getItem('ogma_popcorn');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return defaultParticipants();
  });
  const [newName, setNewName] = useState('');

  // Persist to sessionStorage on any change
  useEffect(function() {
    try { sessionStorage.setItem('ogma_popcorn', JSON.stringify(participants)); } catch(e) {}
  }, [participants]);

  function toggleDone(id) {
    setParticipants(function(prev) {
      return prev.map(function(p) { return p.id === id ? Object.assign({}, p, {done: !p.done}) : p; });
    });
  }

  function addParticipant() {
    var name = newName.trim();
    if (!name) return;
    setParticipants(function(prev) { return prev.concat([{id: 'custom_'+Date.now(), name: name, done: false, type: 'pc'}]); });
    setNewName('');
  }

  function removeParticipant(id) {
    setParticipants(function(prev) { return prev.filter(function(p) { return p.id !== id; }); });
  }

  function newRound() {
    setParticipants(function(prev) { return prev.map(function(p) { return Object.assign({}, p, {done: false}); }); });
  }

  var remaining = participants.filter(function(p) { return !p.done; }).length;

  return h('div', {style: {padding: '4px 0'}},
    h('div', {style: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}},
      h('div', {style: {fontSize: 'var(--text-label)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)'}},
        '🏁 Popcorn Initiative'
      ),
      h('div', {style: {display: 'flex', gap: 4}},
        h('span', {style: {fontSize: 'var(--text-label)', color: remaining === 0 ? 'var(--c-green)' : 'var(--text-muted)'}},
          remaining === 0 ? 'Round done!' : remaining + ' to go'
        ),
        h('button', {
          onClick: newRound,
          style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 6px', fontFamily: 'var(--font-ui)'},
          title: 'New round - clear all checkmarks',
        }, '↺')
      )
    ),
    h('div', {style: {marginBottom: 8}},
      participants.map(function(p) {
        return h('div', {
          key: p.id,
          role: 'checkbox',
          tabIndex: 0,
          'aria-checked': String(!!p.done),
          'aria-label': p.name + (p.done ? ' — acted' : ' — not yet acted'),
          onClick: function() { toggleDone(p.id); },
          onKeyDown: function(e) { if (e.key===' '||e.key==='Enter'){e.preventDefault();toggleDone(p.id);} },
          style: {
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px',
            borderBottom: '1px solid var(--border)', cursor: 'pointer',
            opacity: p.done ? 0.45 : 1, transition: 'opacity 0.15s',
          },
        },
          h('div', {style: {
            width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
            border: '1.5px solid ' + (p.done ? 'var(--c-green)' : (p.type === 'npc' ? 'var(--c-red)' : 'var(--accent)')),
            background: p.done ? 'var(--c-green)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, color: 'var(--bg)',
          }}, p.done ? '✓' : ''),
          h('span', {style: {
            flex: 1, fontSize: 'var(--text-sm)',
            color: p.type === 'npc' ? 'var(--c-red)' : 'var(--text)',
            textDecoration: p.done ? 'line-through' : 'none',
          }}, p.name),
          h('button', {
            onClick: function(e) { e.stopPropagation(); removeParticipant(p.id); },
            style: {background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12, padding: '0 2px', lineHeight: 1},
            'aria-label': 'Remove ' + p.name,
          }, '×')
        );
      })
    ),
    h('div', {style: {display: 'flex', gap: 4}},
      h('input', {
        value: newName,
        onChange: function(e) { setNewName(e.target.value); },
        onKeyDown: function(e) { if (e.key === 'Enter') addParticipant(); },
        placeholder: 'Add participant…',
        style: {
          flex: 1, background: 'var(--inset)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '4px 8px', color: 'var(--text)',
          fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)',
        },
        'aria-label': 'New participant name',
      }),
      h('button', {
        onClick: addParticipant,
        className: 'btn btn-ghost',
        style: {fontSize: 12, padding: '4px 10px', minHeight: 0},
      }, '+')
    )
  );
}

// ════════════════════════════════════════════════════════════════════════
// UX-12: COUNTDOWN TRACKER — persistent active countdown tracks
// Stored in IDB under countdown_[campId]_[id]. Shown in Prep sidebar.
// ════════════════════════════════════════════════════════════════════════
function CountdownTracker(props) {
  var campId   = props.campId;
  var onClose  = props.onClose;
  var lastCD   = props.lastCountdown; // data from most recent countdown roll, or null

  const [tracks, setTracks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load from IDB on mount
  useEffect(function() {
    DB.loadSession('countdowns_' + campId).then(function(saved) {
      if (saved && Array.isArray(saved)) setTracks(saved);
      setLoaded(true);
    }).catch(function(err) { console.warn('[Ogma] countdowns load failed:', err); setLoaded(true); });
  }, [campId]);

  function persist(next) {
    setTracks(next);
    DB.saveSession('countdowns_' + campId, next).catch(function(err){ console.warn('[Ogma] countdowns save failed:', err); });
  }

  function addFromRoll() {
    if (!lastCD) return;
    var id = 'cd_' + Date.now();
    persist(tracks.concat([{
      id: id, name: lastCD.name, boxes: lastCD.boxes,
      filled: 0, unit: lastCD.unit, trigger: lastCD.trigger, outcome: lastCD.outcome,
    }]));
  }

  function tick(id) {
    persist(tracks.map(function(t) {
      if (t.id !== id) return t;
      var next = Math.min(t.filled + 1, t.boxes);
      return Object.assign({}, t, {filled: next});
    }));
  }

  function untick(id) {
    persist(tracks.map(function(t) {
      if (t.id !== id) return t;
      return Object.assign({}, t, {filled: Math.max(0, t.filled - 1)});
    }));
  }

  function remove(id) {
    persist(tracks.filter(function(t) { return t.id !== id; }));
  }

  if (!loaded) return h('div', {className: 'cd-tracker'}, h('div', {style:{padding:'14px',color:'var(--text-muted)',fontSize:12}}, 'Loading…'));

  return h('div', {className: 'cd-tracker'},

    // Add from last roll
    lastCD && !tracks.find(function(t){ return t.name === lastCD.name; }) &&
      h('button', {className: 'cd-add-btn', onClick: addFromRoll},
        h('span', null, '+ Track: '),
        h('strong', null, lastCD.name)
      ),

    // Active tracks
    tracks.length === 0
      ? h('div', {className: 'cd-empty'}, 'No active countdowns. Roll a Countdown then click "+ Track" to add it here.')
      : h('div', {className: 'cd-track-list'},
          tracks.map(function(t) {
            var triggered = t.filled >= t.boxes;
            return h('div', {key: t.id, className: 'cd-track' + (triggered ? ' triggered' : '')},
              h('div', {className: 'cd-track-top'},
                h('div', {className: 'cd-track-name'}, t.name),
                h('button', {className: 'cd-remove-btn', onClick: function(){ remove(t.id); }, 'aria-label': 'Remove ' + t.name}, '✕')
              ),
              // Box row
              h('div', {className: 'cd-boxes'},
                Array.from({length: t.boxes}, function(_, i) {
                  var filled = i < t.filled;
                  return h('button', {
                    key: i,
                    className: 'cd-box' + (filled ? ' filled' : ''),
                    onClick: function(){ filled ? untick(t.id) : tick(t.id); },
                    'aria-label': (filled ? 'Unmark' : 'Mark') + ' box ' + (i+1),
                    title: t.unit,
                  });
                })
              ),
              h('div', {className: 'cd-track-meta'}, t.filled + '/' + t.boxes + ' · ' + t.unit),
              triggered
                ? h('div', {className: 'cd-triggered-label'}, '⚡ TRIGGERED — ' + t.outcome)
                : h('div', {className: 'cd-trigger-preview'}, '→ ' + t.trigger)
            );
          })
        )
  );
}

function FatePointTracker(props) {
  var state = props.state || DEFAULT_FP_STATE;
  var update = props.onUpdate;

  const [lastFPAnim, setLastFPAnim] = useState(null);

  function adjustPC(id, delta) {
    var pc = state.pcs.find(function(p) { return p.id === id; });
    if (!pc) return;
    var newVal = Math.max(0, pc.current + delta);
    var animDot = delta < 0 ? pc.current - 1 : pc.current; // index of dot changing
    setLastFPAnim({id: id, dot: animDot, dir: delta > 0 ? 'gain' : 'spend'});
    setTimeout(function() { setLastFPAnim(null); }, 380);
    var next = Object.assign({}, state, {
      pcs: state.pcs.map(function(p) {
        if (p.id !== id) return p;
        return Object.assign({}, p, {current: newVal});
      })
    });
    update(next);
  }

  function setName(id, name) {
    var next = Object.assign({}, state, {
      pcs: state.pcs.map(function(pc) {
        return pc.id === id ? Object.assign({}, pc, {name: name}) : pc;
      })
    });
    update(next);
  }

  function addPC() {
    var ids = state.pcs.map(function(p) { return p.id; });
    var newId = Math.max.apply(null, ids) + 1;
    update(Object.assign({}, state, {
      pcs: state.pcs.concat([{id: newId, name: 'PC ' + newId, refresh: 3, current: 3}])
    }));
  }

  function removePC(id) {
    update(Object.assign({}, state, {pcs: state.pcs.filter(function(p) { return p.id !== id; })}));
  }

  function resetAll() {
    update(Object.assign({}, state, {
      pcs: state.pcs.map(function(pc) { return Object.assign({}, pc, {current: pc.refresh}); }),
      pool: 0,
    }));
  }

  function adjustPool(delta) {
    update(Object.assign({}, state, {pool: Math.max(0, (state.pool || 0) + delta)}));
  }

  const [fpTab, setFpTab] = useState('fp');

  var TAB_STYLE = function(id) { return {
    flex: 1, background: 'none', border: 'none', cursor: 'pointer',
    padding: '6px 4px', fontSize: 'var(--text-label)', fontFamily: 'var(--font-ui)',
    fontWeight: fpTab === id ? 700 : 500,
    color: fpTab === id ? 'var(--accent)' : 'var(--text-muted)',
    borderBottom: '2px solid ' + (fpTab === id ? 'var(--accent)' : 'transparent'),
    transition: 'all 0.15s', whiteSpace: 'nowrap',
  }; };

  return h('div', {className: 'fp-tracker'},
    h('div', {className: 'fp-header'},
      h('span', {className: 'fp-title'}, '◎ Fate Tools'),
      fpTab === 'fp' && h('button', {className: 'btn btn-ghost', onClick: resetAll, title: 'Reset all to refresh', style: {fontSize: 12, padding: '2px 8px', minHeight: 0}}, '↺ Reset'),
    ),
    // Tab bar
    h('div', {style: {display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 10}},
      h('button', {onClick: function() { setFpTab('fp'); }, style: TAB_STYLE('fp'), 'aria-pressed': String(fpTab==='fp')}, '◎ Fate Points'),
      h('button', {onClick: function() { setFpTab('ms'); }, style: TAB_STYLE('ms'), 'aria-pressed': String(fpTab==='ms')}, '⬡ Milestones'),
      h('button', {onClick: function() { setFpTab('pi'); }, style: TAB_STYLE('pi'), 'aria-pressed': String(fpTab==='pi')}, '🏁 Initiative')
    ),
    // Tab: Fate Points
    fpTab === 'fp' && h(Fragment, null,
      h('div', {className: 'fp-pcs'},
        state.pcs.map(function(pc) {
          return h('div', {key: pc.id, className: 'fp-pc-row'},
            h('input', {
              className: 'fp-pc-name',
              value: pc.name,
              onChange: function(e) { setName(pc.id, e.target.value); },
              'aria-label': 'Player character name',
            }),
            h('div', {className: 'fp-controls'},
              h('button', {className: 'fp-btn fp-minus', onClick: function() { adjustPC(pc.id, -1); }, 'aria-label': 'Spend fate point', disabled: pc.current === 0}, '−'),
              h('div', {className: 'fp-dots'},
                [0,1,2,3,4,5].map(function(i) {
                  var filled = i < pc.current;
                  var isAnimDot = lastFPAnim && lastFPAnim.id === pc.id && lastFPAnim.dot === i;
                  var animClass = isAnimDot ? (' fp-' + lastFPAnim.dir + 'ing') : '';
                  return h('div', {
                    key: i,
                    className: 'fp-dot' + (filled ? ' fp-dot-filled' : '') + animClass,
                    onClick: function() { adjustPC(pc.id, i < pc.current ? -1 : 1); },
                  });
                })
              ),
              h('button', {className: 'fp-btn fp-plus', onClick: function() { adjustPC(pc.id, 1); }, 'aria-label': 'Gain fate point'}, '+'),
              h('span', {className: 'fp-count'}, pc.current)
            ),
            h('button', {className: 'fp-remove', onClick: function() { removePC(pc.id); }, 'aria-label': 'Remove ' + pc.name, title: 'Remove'}, '×')
          );
        })
      ),
      h('div', {className: 'fp-pool-row'},
        h('span', {className: 'fp-pool-label'}, 'GM Pool'),
        h('button', {className: 'fp-btn fp-minus', onClick: function() { adjustPool(-1); }, disabled: (state.pool || 0) === 0, 'aria-label': 'Decrease GM fate point pool'}, '−'),
        h('span', {className: 'fp-pool-count', 'aria-live': 'polite', 'aria-label': 'GM Pool: ' + (state.pool || 0) + ' fate points'}, state.pool || 0),
        h('button', {className: 'fp-btn fp-plus', onClick: function() { adjustPool(1); }, 'aria-label': 'Increase GM fate point pool'}, '+')
      ),
      h('button', {className: 'fp-add-pc', onClick: addPC}, '+ Add PC')
    ),
    // Tab: Milestones
    fpTab === 'ms' && h(MilestoneTracker, null),
    // Tab: Popcorn Initiative
    fpTab === 'pi' && h(PopcornTracker, {partySize: props.partySize, lastEncounter: props.lastEncounter})
  );
}

// ── Session Pack — 3-card prep packet (Seed + Countdown + Compel) ──────────────
function SessionPackCard(props) {
  var genId = props.genId;
  var data  = props.data;
  var campId = props.campId;
  var gen   = (GENERATORS || []).find(function(g) { return g.id === genId; }) || {};
  var hc    = HELP_CONTENT[genId] || {};
  var _cv = useState(false); var spCardView = _cv[0]; var setSpCardView = _cv[1];
  return h('div', {className: 'sp-card'},
    h('div', {className: 'sp-card-header'},
      h('span', {className: 'sp-card-icon'}, gen.icon || ''),
      h('span', {className: 'sp-card-label'}, hc.title || gen.label || genId),
      h('button', {
        className: 'card-view-btn' + (spCardView ? ' active' : ''),
        onClick: function() { setSpCardView(function(v) { return !v; }); },
        title: spCardView ? 'Switch to dossier view' : 'Switch to card view',
        'aria-label': spCardView ? 'Switch to dossier view' : 'Switch to card view',
        'aria-pressed': String(spCardView),
        style: {marginLeft: 'auto', fontSize: 11, padding: '2px 8px'},
      }, spCardView ? '⊟ Dossier' : '♥ Card')
    ),
    h('div', {className: 'sp-card-body'},
      spCardView
        ? renderCard(genId, data, campId || '', function(){}, [], null)
        : renderResult(genId, data, null, [])
    )
  );
}

function SessionPackPanel(props) {
  var pack     = props.pack;
  var onPin    = props.onPin;
  var onClear  = props.onClear;
  if (!pack) return null;

  return h('div', {className: 'sp-panel fade-up'},
    h('div', {className: 'sp-header'},
      h('div', {className: 'sp-header-title'},
        h('span', {className: 'sp-header-icon'}, h(RaIcon, {n: 'play_intro'})),
        ' Quick Adventure Start Pack'
      ),
      h('div', {className: 'sp-header-actions'},
        h('button', {
          className: 'btn btn-ghost sp-btn',
          onClick: onPin,
          title: 'Save all three cards to Table Prep',
        }, '\uD83D\uDCCB Save all'),
        h('button', {
          className: 'btn btn-ghost sp-btn',
          onClick: onClear,
          title: 'Clear session pack',
          style: {color: 'var(--text-muted)'},
        }, '\u2715 Clear')
      )
    ),
    h('div', {className: 'sp-meta'},
      'Seed \u00B7 Scene \u00B7 Major NPC \u2014 one click to a playable session skeleton'
    ),
    h(SessionPackCard, {genId: 'seed',      data: pack.seed.data,      campId: props.campId}),
    h(SessionPackCard, {genId: 'scene',     data: pack.scene.data,     campId: props.campId}),
    h(SessionPackCard, {genId: 'npc_major', data: pack.npcMajor.data, campId: props.campId})
  );
}
// Returns a short display label for a result — icon + primary name field.
function getResultLabel(r) {
  if (!r || !r.data) return '\u2014';
  var d = r.data;
  var g = GENERATORS.find(function(g2) { return g2.id === r.genId; });
  var icon = g ? g.icon + ' ' : '';
  var name = d.name || d.contest_type || (d.aspects && d.aspects.high_concept) ||
             (d.current && d.current.name) || (d.location && d.location.slice(0, 30)) ||
             (d.aspect) || (d.goal && d.goal.slice(0, 30)) ||
             (d.new_aspect && d.new_aspect.slice(0, 30)) ||
             (d.questions && 'Backstory') || '\u2014';
  return icon + name;
}

// ── TABLE SYNC MODULE ─────────────────────────────────────────────────────
// Mirrors the sync layer in run.html. Solo mode when tableSyncRef===null.
var TABLE_SYNC_HOST = null;
try{var _tsp=JSON.parse(localStorage.getItem('fate_prefs_v1')||'{}');TABLE_SYNC_HOST=_tsp.syncHost||null;}catch(e){}
var OGMA_DEFAULT_SYNC_HOST = (typeof OGMA_CONFIG !== 'undefined' ? OGMA_CONFIG.DEFAULT_SYNC_HOST : 'ogma-sync.brs165.workers.dev');

function generateTableRoomCode(){
  var chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code='';
  for(var i=0;i<4;i++)code+=chars[Math.floor(Math.random()*chars.length)];
  return code;
}

// createTableSync — sole sync factory (v330: createSync in ui-run.js removed — this is the live implementation)
// Superset of old createSync: adds broadcastLastState, sendCursor, cursor presence, 300ms re-broadcast fix.
function createTableSync(roomCode,role,onStateUpdate,onRoll,onToast,onPresence){
  var host=TABLE_SYNC_HOST||OGMA_DEFAULT_SYNC_HOST;
  if(typeof PartySocket==='undefined'){console.warn('PartySocket not loaded');return null;}
  var ws=new PartySocket({host:host,room:roomCode.toLowerCase(),query:{role:role}});
  var sync={ws:ws,role:role,roomCode:roomCode,connected:false,_lastState:null,
    broadcastState:function(state){
      if(sync.role!=='gm'||!sync.connected)return;
      // PrepCanvas already filtered gmOnly cards before calling this
      sync._lastState=state; // cache for re-broadcast on player join
      ws.send(JSON.stringify({type:'state',payload:state}));
    },
    broadcastLastState:function(){
      if(sync.role!=='gm'||!sync.connected||!sync._lastState)return;
      ws.send(JSON.stringify({type:'state',payload:sync._lastState}));
    },
    broadcastRoll:function(data){
      // MP-20: GM broadcasts dice result to all players
      if(sync.role!=='gm'||!sync.connected)return;
      ws.send(JSON.stringify(Object.assign({type:'roll'},data)));
    },
    sendRoll:function(playerId,data){
      // MP-21: Player sends dice result to GM
      if(sync.role!=='player'||!sync.connected)return;
      ws.send(JSON.stringify(Object.assign({type:'player_roll',playerId:playerId},data)));
    },
    sendCursor:function(x,y,name,color,id){
      // MP-22: player broadcasts cursor position to GM
      if(sync.role!=='player'||!sync.connected)return;
      ws.send(JSON.stringify({type:'player_cursor',x:x,y:y,name:name,color:color,id:id}));
    },
    sendAction:function(playerId,action,patch){
      if(sync.role!=='player'||!sync.connected)return;
      ws.send(JSON.stringify({type:'player_action',playerId:playerId,action:action,patch:patch}));
    },
    disconnect:function(){ws.close();sync.connected=false;}
  };
  ws.addEventListener('open',function(){sync.connected=true;});
  ws.addEventListener('close',function(){sync.connected=false;});
  ws.addEventListener('message',function(event){
    var data;try{data=JSON.parse(event.data);}catch(e){return;}
    switch(data.type){
      case 'welcome':
        if(data.state&&sync.role==='player')onStateUpdate(data.state);
        break;
      case 'state':
        if(sync.role==='player')onStateUpdate(data.payload);
        break;
      case 'toast': onToast(data.msg); break;
      case 'presence':
        onPresence(data.connections);
        // MP-07 fix: re-broadcast current state when a new player joins
        if(sync.role==='gm'&&sync._lastState){
          // 300ms: allow the player's WS 'open' event to fire and their state to settle
          // before the GM re-broadcasts. Shorter = player may receive state before being ready.
          setTimeout(function(){sync.broadcastLastState();},300);
        }
        break;
      case 'roll':
        // MP-20: player receives GM's roll result
        onRoll(data);
        break;
      case 'player_roll':
        // MP-21: GM receives player's roll result
        if(sync.role==='gm')onRoll(data);
        break;
      case 'cursor':
        // MP-22: player receives GM cursor position
        if(sync.role==='player')onStateUpdate({type:'cursor',x:data.x,y:data.y,name:data.name,color:data.color,id:data.id});
        break;
      case 'player_cursor':
        // MP-22: GM receives player cursor positions
        if(sync.role==='gm')onStateUpdate({type:'cursor',x:data.x,y:data.y,name:data.name,color:data.color,id:data.id});
        break;
      case 'player_action':
        if(sync.role==='gm')onStateUpdate({type:'player_action',playerId:data.playerId,patch:data.patch});
        break;
    }
  });
  return sync;
}
// ════════════════════════════════════════════════════════════════════════
// CAMPAIGN APP (used by each campaign HTML page)
// Each page calls: ReactDOM.createRoot(...).render(h(CampaignApp, {campId: 'thelongafter'}))
// ════════════════════════════════════════════════════════════════════════

var LADDER_NAMES = ['','Average','Fair','Good','Great','Superb','Fantastic','Epic','Legendary'];

// ── ResultCard — generator identity strip (icon + label + accent line) ──────
// renderResult() renders the full content below this strip.
function ResultCard(props) {
  var result = props.result;
  var gen    = props.gen;
  if (!result || !result.data) return null;

  return h('div', {className: 'result-card'},
    h('div', {className: 'result-card-gen'},
      gen ? gen.icon + ' ' + gen.label : result.genId,
      h('div', {className: 'result-card-gen-line'})
    )
  );
}

// ── GmTipsPanel — invoke/compel + running tips + checklist ─────────────────
// ════════════════════════════════════════════════════════════════════════
// RESULT HELP PANEL — Option E: always-visible bottom sheet
// Replaces: GM Mode toggle + Help Level setting + "How to use this" expandable
// Two-column reference panel below every result card.
// Left: 'What this is' — description, output structure, rules bullets + SRD links
// Right: 'For GM' — running tips, invoke/compel examples, checklist
// Optional D&D? tab (only when dnd_notes exists). 'New here?' removed.
// ════════════════════════════════════════════════════════════════════════
function ResultHelpPanel(props) {
  var genId = props.genId;
  // Merge srd_url from HELP_ENTRIES — srd_url lives there, rich content in HELP_CONTENT
  var _entry = (typeof HELP_ENTRIES !== 'undefined' ? HELP_ENTRIES : []).find(function(e){ return e.id === genId; }) || {};
  var hc = Object.assign({}, HELP_CONTENT[genId] || {}, {srd_url: _entry.srd_url || (HELP_CONTENT[genId]||{}).srd_url});
  var [tab, setTab] = useState('main');
  var checks = props.checks; var setChecks = props.setChecks;

  var tips      = Array.isArray(hc.gm_tips)      ? hc.gm_tips      : (hc.gm_tips      ? [hc.gm_tips]      : []);
  var running   = Array.isArray(hc.gm_running)   ? hc.gm_running   : (hc.gm_running   ? [hc.gm_running]   : []);
  var allTips   = tips.concat(running);
  var checklist = Array.isArray(hc.gm_checklist) ? hc.gm_checklist : (hc.gm_checklist ? [hc.gm_checklist] : []);
  var rules     = Array.isArray(hc.rules)        ? hc.rules        : [];
  var hasDnd    = !!(hc.dnd_notes);

  function toggleCheck(i) {
    if (!setChecks) return;
    var next = (checks || []).slice();
    next[i] = !next[i];
    setChecks(next);
  }

  var leftCol = h('div', {className: 'rhp-col'},
    h('div', {className: 'rhp-col-hdr'}, 'What this is'),
    hc.what && h('div', {className: 'rhp-what'}, hc.what),
    hc.output && h('div', {style:{marginTop:8}},
      h('div', {className: 'rhp-output-lbl'}, 'Output structure'),
      h('div', {className: 'rhp-output'}, hc.output)
    ),
    rules.length > 0 && h('div', {style:{marginTop:8}},
      h('div', {className: 'rhp-output-lbl'}, 'Rules reference · Fate Condensed'),
      h('div', null,
        rules.map(function(rule, i) {
          return h('div', {key: i, className: 'rhp-rule-row'},
            h('span', {className: 'rhp-rule-pip'}, '◈'),
            h('span', {className: 'rhp-rule-text'}, rule),
            hc.srd_url && h('a', {href: hc.srd_url, target: '_blank', rel: 'noopener noreferrer', className: 'rhp-srd'}, 'SRD ↗')
          );
        })
      )
    ),
    !rules.length && hc.rule && h('div', {className: 'rhp-rule', style:{marginTop:6}},
      hc.rule,
      hc.srd_url && h('a', {href: hc.srd_url, target: '_blank', rel: 'noopener noreferrer', className: 'rhp-srd'}, ' SRD ↗')
    )
  );

  var rightCol = h('div', {className: 'rhp-col'},
    h('div', {className: 'rhp-col-hdr'}, 'For GM'),
    allTips.length > 0 && h('div', null,
      allTips.slice(0, 2).map(function(tip, i) {
        return h('div', {key: i, className: 'rhp-tip'},
          h('span', {className: 'rhp-tip-arrow'}, '→'),
          h('span', null, tip)
        );
      })
    ),
    (hc.invoke_example || hc.compel_example) && h('div', {style:{marginTop:6}},
      hc.invoke_example && h('div', {className: 'rhp-invoke'},
        h('div', {className: 'rhp-invoke-lbl'}, '❆ Invoke'),
        h('div', {className: 'rhp-ex-body'}, hc.invoke_example)
      ),
      hc.compel_example && h('div', {className: 'rhp-compel', style:{marginTop:4}},
        h('div', {className: 'rhp-compel-lbl'}, '⊗ Compel'),
        h('div', {className: 'rhp-ex-body'}, hc.compel_example)
      )
    ),
    checklist.length > 0 && h('div', {style:{marginTop:6}},
      h('div', {className: 'rhp-col-hdr', style:{marginTop:0}}, 'Checklist'),
      checklist.map(function(item, i) {
        var done = !!(checks && checks[i]);
        return h('div', {key: i, className: 'rhp-check' + (done ? ' done' : ''),
          onClick: function(){ toggleCheck(i); },
          role: 'checkbox', 'aria-checked': String(!!done), tabIndex: 0,
          onKeyDown: function(e){ if(e.key===' '||e.key==='Enter'){e.preventDefault();toggleCheck(i);} }
        },
          h('div', {className: 'rhp-check-box'}, done ? '✓' : ''),
          h('span', null, item)
        );
      })
    ),
    hc.tip && h('div', {className: 'rhp-callout'},
      h('span', {className: 'rhp-callout-icon'}, '💡'),
      hc.tip
    )
  );

  var dndContent = h('div', {className: 'rhp-full'},
    h('div', {className: 'rhp-dnd-block'},
      h('div', {className: 'rhp-dnd-lbl'}, '⚔ Coming from D&D / Pathfinder'),
      hc.dnd_notes
        ? h('div', {className: 'rhp-dnd-body'}, hc.dnd_notes)
        : h('div', {className: 'rhp-dnd-body', style:{color:'var(--text-muted)',fontStyle:'italic'}}, 'No D&D comparison for this generator.')
    )
  );

  return h('div', {className: 'rhp-shell', role: 'complementary', 'aria-label': 'Generator reference'},
    h('div', {className: 'rhp-tabs', role: 'tablist', 'aria-label': 'Reference tabs'},
      h('button', {
        id: 'rhp-tab-main',
        className: 'rhp-tab' + (tab === 'main' ? ' on' : ''),
        onClick: function(){ setTab('main'); },
        role: 'tab',
        'aria-selected': String(tab === 'main'),
        'aria-controls': 'rhp-panel-main',
      }, 'What this is · For GM'),
      hasDnd && h('button', {
        id: 'rhp-tab-dnd',
        className: 'rhp-tab' + (tab === 'dnd' ? ' on' : ''),
        onClick: function(){ setTab('dnd'); },
        role: 'tab',
        'aria-selected': String(tab === 'dnd'),
        'aria-controls': 'rhp-panel-dnd',
      }, '\u2694 D&D?')
    ),
    h('div', {className: 'rhp-body'},
      tab === 'main' && h('div', {
        id: 'rhp-panel-main', role: 'tabpanel', 'aria-labelledby': 'rhp-tab-main',
        className: 'rhp-grid'
      }, leftCol, rightCol),
      tab === 'dnd' && h('div', {
        id: 'rhp-panel-dnd', role: 'tabpanel', 'aria-labelledby': 'rhp-tab-dnd',
      }, dndContent)
    )
  );
}





// ── ExportMenu — unified export/import dropdown (EXP-06) ──────────────────
// Props: cards[], campName, onImport
// Shows: Image Pack (PNG zip), Print (HTML), JSON export, Import
function ExportMenu(props) {
  var cards    = props.cards || [];
  var campName = props.campName || '';
  var onImport = props.onImport || function(){};
  var hasCards = cards.length > 0;

  var _open = useState(false); var open = _open[0]; var setOpen = _open[1];
  var menuRef = useRef(null);

  // Close on outside click
  useEffect(function() {
    if (!open) return;
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return function() { document.removeEventListener('mousedown', handler); };
  }, [open]);

  function doImagePack() {
    setOpen(false);
    if (!hasCards) return;
    if (typeof DB === 'undefined' || !DB.exportCardsAsPng) { return; }
    DB.exportCardsAsPng(cards, campName);
  }

  function doPrint() {
    setOpen(false);
    if (!hasCards) return;
    if (typeof DB === 'undefined' || !DB.printCards) { return; }
    DB.printCards(cards, campName);
  }

  function doJson() {
    setOpen(false);
    if (!hasCards) return;
    if (typeof DB === 'undefined' || !DB.exportCards) { return; }
    DB.exportCards(null, campName, cards);
  }

  function doImport() {
    setOpen(false);
    onImport();
  }

  var menuItems = [
    hasCards && {
      icon: '\uD83D\uDDBC\uFE0F',
      label: 'Image Pack',
      sub: 'PNG zip for Miro / Figma',
      action: doImagePack,
      key: 'img',
    },
    hasCards && {
      icon: '\uD83D\uDDA8',
      label: 'Print',
      sub: 'Printable HTML',
      action: doPrint,
      key: 'print',
    },
    hasCards && {
      icon: '\u2193',
      label: 'Export JSON',
      sub: cards.length + ' card' + (cards.length === 1 ? '' : 's'),
      action: doJson,
      key: 'json',
    },
    {
      icon: '\u2191',
      label: 'Import JSON',
      sub: 'Restore from file',
      action: doImport,
      key: 'import',
    },
  ].filter(Boolean);

  return h('div', {
    ref: menuRef,
    style: {position: 'relative', display: 'inline-flex'},
  },
    h('button', {
      className: 'btn btn-ghost action-bar-icon' + (open ? ' active' : ''),
      onClick: function() { setOpen(function(v) { return !v; }); },
      title: 'Export / Import',
      'aria-label': 'Export and import options',
      'aria-expanded': String(open),
      'aria-haspopup': 'menu',
    }, h(FaFileArrowDownIcon, {size: 14})),
    open && h('div', {
      role: 'menu',
      'aria-label': 'Export options',
      style: {
        position: 'absolute', top: 'calc(100% + 6px)', right: 0,
        background: 'var(--panel-raised)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '6px 0', minWidth: 210,
        boxShadow: '0 8px 32px rgba(0,0,0,.35), 0 0 0 1px rgba(0,0,0,.08)',
        zIndex: 500,
        animation: 'fadeDown .14s ease',
      },
    },
      h('div', {
        style: {padding: '4px 14px 7px', fontSize: 10, fontWeight: 700,
          letterSpacing: '.12em', color: 'var(--text-muted)', textTransform: 'uppercase'},
      }, 'Export / Import'),
      menuItems.map(function(item) {
        return h('button', {
          key: item.key,
          role: 'menuitem',
          onClick: item.action,
          className: 'export-menu-item',
        },
          h('span', {style: {fontSize: 16, width: 22, textAlign: 'center', flexShrink: 0}}, item.icon),
          h('div', {style: {flex: 1, minWidth: 0}},
            h('div', {style: {fontSize: 13, fontWeight: 600, lineHeight: 1.2}}, item.label),
            h('div', {style: {fontSize: 11, color: 'var(--text-muted)', marginTop: 1}}, item.sub)
          )
        );
      })
    )
  );
}

// ── useChromeHooks — UI chrome state: toast, PWA, Safari, SW update, online ──
// Extracted from CampaignApp to reduce its state footprint.
// Called once inside CampaignApp; all returned values destructured into local vars.
function useChromeHooks(campId) {
  var _toast       = useState(null);          var toast = _toast[0]; var setToast = _toast[1];
  var _update      = useState(false);         var updateAvailable = _update[0]; var setUpdateAvailable = _update[1];
  var _safari      = useState(false);         var showSafariWarn = _safari[0]; var setShowSafariWarn = _safari[1];
  var _ios         = useState(false);         var showIosInstall = _ios[0]; var setShowIosInstall = _ios[1];
  var _pwa         = useState(false);         var showPwaNudge = _pwa[0]; var setShowPwaNudge = _pwa[1];
  var _online      = useState(typeof navigator !== 'undefined' ? navigator.onLine !== false : true);
  var isOnline = _online[0]; var setIsOnline = _online[1];
  var toastTimer          = useRef(null);
  var deferredInstallPrompt = useRef(null);

  function showToast(msg) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(function() { setToast(null); }, TIMING.TOAST_MS);
  }

  function dismissPwaNudge() {
    setShowPwaNudge(false);
    try { LS.set('pwa_nudge_dismissed', true); } catch(e) {}
  }

  function installPwa() {
    if (!deferredInstallPrompt.current) return;
    deferredInstallPrompt.current.prompt();
    deferredInstallPrompt.current.userChoice.then(function() {
      deferredInstallPrompt.current = null;
      setShowPwaNudge(false);
    });
  }

  // PWA install nudge
  useEffect(function() {
    var dismissed = false;
    try { dismissed = LS.get('pwa_nudge_dismissed'); } catch(e) {}
    if (dismissed) return;
    var visits = 0;
    try { visits = (LS.get('visit_count_' + campId) || 0) + 1; LS.set('visit_count_' + campId, visits); } catch(e) {}
    function onBeforeInstall(e) {
      e.preventDefault();
      deferredInstallPrompt.current = e;
      if (visits >= 2) setShowPwaNudge(true);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return function() { window.removeEventListener('beforeinstallprompt', onBeforeInstall); };
  }, [campId]);

  // SW update detection
  useEffect(function() {
    window.__showUpdateToast = function() { setUpdateAvailable(true); };
    return function() { delete window.__showUpdateToast; };
  }, []);

  // Safari/iOS detection (run once — UA never changes)
  useEffect(function() {
    var ua = navigator.userAgent || '';
    var isIOS = /iphone|ipad|ipod/i.test(ua);
    var isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
    var isStandalone = ('standalone' in navigator) && navigator.standalone;
    if ((isIOS || isSafari) && !isStandalone) {
      var warnDismissed = false;
      try { warnDismissed = LS.get('safari_warn_dismissed'); } catch(e) {}
      if (!warnDismissed) setShowSafariWarn(true);
    }
    if (isIOS && isSafari && !isStandalone) {
      var iosDismissed = false;
      try { iosDismissed = LS.get('ios_install_dismissed'); } catch(e) {}
      if (!iosDismissed) setShowIosInstall(true);
    }
  }, []);

  // Online/offline
  useEffect(function() {
    function onOnline()  { setIsOnline(true);  }
    function onOffline() { setIsOnline(false); }
    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    return function() {
      window.removeEventListener('online',  onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return {
    toast: toast, setToast: setToast, showToast: showToast,
    updateAvailable: updateAvailable,
    showSafariWarn: showSafariWarn, setShowSafariWarn: setShowSafariWarn,
    showIosInstall: showIosInstall, setShowIosInstall: setShowIosInstall,
    showPwaNudge: showPwaNudge, dismissPwaNudge: dismissPwaNudge, installPwa: installPwa,
    isOnline: isOnline,
    deferredInstallPrompt: deferredInstallPrompt,
  };
}

// ── useGeneratorSession ──────────────────────────────────────────────────────
// Owns: result, history, rolling, activeGen, partySize, consequenceSev, cardView,
//       inspireMode/Results/Chosen, pinnedCards, sessionPack, packRolling,
//       resultAnim, showStreakBadge, confPcs, pinBouncing + all generator handlers.
// Args: campId, campMeta, t (tables), universalMerge, prefs, showToast
function useGeneratorSession(campId, campMeta, t, universalMerge, prefs, showToast) {
  var _activeGen    = useState('npc_minor');         var activeGen    = _activeGen[0];    var setActiveGen    = _activeGen[1];
  var _result       = useState(null);                var result       = _result[0];       var setResult       = _result[1];
  var _rolling      = useState(false);               var rolling      = _rolling[0];      var setRolling      = _rolling[1];
  var _history      = useState([]);                  var history      = _history[0];      var setHistory      = _history[1];
  var _partySize    = useState(3);                   var partySize    = _partySize[0];    var setPartySize    = _partySize[1];
  var _consequenceSev = useState('');                var consequenceSev = _consequenceSev[0]; var setConsequenceSev = _consequenceSev[1];
  var _cardView     = useState(false);               var cardView     = _cardView[0];     var setCardView     = _cardView[1];
  var _inspireMode  = useState(false);               var inspireMode  = _inspireMode[0];  var setInspireMode  = _inspireMode[1];
  var _inspireRes   = useState([]);                  var inspireResults = _inspireRes[0]; var setInspireResults = _inspireRes[1];
  var _inspireChosen = useState(null);               var inspireChosen = _inspireChosen[0]; var setInspireChosen = _inspireChosen[1];
  var _pinnedCards  = useState([]);                  var pinnedCards  = _pinnedCards[0];  var setPinnedCards  = _pinnedCards[1];
  var _pinBouncing  = useState(false);               var pinBouncing  = _pinBouncing[0];  var setPinBouncing  = _pinBouncing[1];
  var _sessionPack  = useState(null);                var sessionPack  = _sessionPack[0];  var setSessionPack  = _sessionPack[1];
  var _packRolling  = useState(false);               var packRolling  = _packRolling[0];  var setPackRolling  = _packRolling[1];
  var _resultAnim   = useState(false);               var resultAnim   = _resultAnim[0];   var setResultAnim   = _resultAnim[1];
  var _streakBadge  = useState(false);               var showStreakBadge = _streakBadge[0]; var setShowStreakBadge = _streakBadge[1];
  var _confPcs      = useState([]);                  var confPcs      = _confPcs[0];      var setConfPcs      = _confPcs[1];

  var rollCountRef     = useRef(0);
  var isMountedRef     = useRef(true);
  var prefsRef         = useRef(prefs);   prefsRef.current = prefs;
  var pinnedCardsRef   = useRef(pinnedCards); pinnedCardsRef.current = pinnedCards;
  var _lastSeed        = useRef(null);
  var seedResultDone   = useRef(false);
  var usedGensRef      = useRef({});

  // Cleanup on unmount
  useEffect(function() { return function() { isMountedRef.current = false; }; }, []);

  // Load session from IDB
  useEffect(function() {
    DB.loadSession('fate_' + campId).then(function(saved) {
      if (saved && saved.result)    setResult(saved.result);
      if (saved && saved.history)   setHistory(saved.history);
      if (saved && saved.activeGen) setActiveGen(saved.activeGen);
    }).catch(function() {});
    DB.loadSession('fate_tprefs_' + campId).then(function() {}).catch(function() {});
  }, [campId]);

  // Save session when result changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(function() {
    if (result) {
      DB.saveSession('fate_' + campId, {result: result, history: history, activeGen: activeGen}).catch(function(err) { console.warn('[Ogma] save:', err); });
      DB.saveSession('fate_last_camp', {id: campId}).catch(function(err) { console.warn('[Ogma] save:', err); });
    }
  }, [result]);

  // Load pinned cards on mount
  useEffect(function() {
    DB.loadCards(campId).then(function(cards) {
      if (cards && cards.length) setPinnedCards(cards.sort(function(a,b){return b.ts-a.ts;}));
    }).catch(function() {});
  }, [campId]);

  var gen = (typeof GENERATORS !== 'undefined' ? GENERATORS : []).find(function(g) { return g.id === activeGen; }) || {};

  function groupForGen(genId) {
    if (typeof GENERATOR_GROUPS === 'undefined') return '';
    for (var i = 0; i < GENERATOR_GROUPS.length; i++) {
      if (GENERATOR_GROUPS[i].gens.indexOf(genId) !== -1) return GENERATOR_GROUPS[i].id;
    }
    return GENERATOR_GROUPS[0].id;
  }

  var doGenerate = useCallback(function() {
    if (navigator.vibrate) navigator.vibrate(40);
    setRolling(true);
    rollCountRef.current += 1;
    if (rollCountRef.current % 5 === 0) {
      setShowStreakBadge(true);
      setTimeout(function() { setShowStreakBadge(false); }, 1200);
    }
    try {
      var base = universalMerge ? mergeUniversal(t) : t;
      var eff  = filteredTables(base, prefsRef.current);
      var opts = {};
      if (activeGen === 'consequence' && consequenceSev) opts.severity = consequenceSev;
      var seed = Math.floor(Math.random() * 0xFFFFFF) + 1;
      var data = generate(activeGen, eff, partySize, opts, seed);
      _lastSeed.current = seed;
      var newResult = {genId: activeGen, data: data, _seed: seed, _ts: Date.now()};
      setTimeout(function() {
        if (!isMountedRef.current) return;
        setResult(newResult);
        setResultAnim(true);
        setTimeout(function() { if(isMountedRef.current) setResultAnim(false); }, 320);
        setHistory(function(h) {
          return [{genId: activeGen, data: data, gen: gen}].concat(h).slice(0, 8);
        });
        setRolling(false);
        var cat = activeGen.replace(/_minor|_major/, '');
        (function() {
          var prev = usedGensRef.current;
          if (prev[cat + '_celebrated']) return;
          prev[cat] = true;
          var uniq = Object.keys(prev).filter(function(k) { return k.indexOf('_celebrated') === -1; }).length;
          if (uniq >= 6) {
            var CONF = ['#F5A623','#4CD964','#5AC8FA','#BF5AF2','#FF3B30','#FFD60A','#32D7E8','#C8864A'];
            var pieces = Array.from({length: 28}, function(_, i) {
              return {id: i, color: CONF[i % CONF.length], dx: (Math.random()-0.5)*200, dy: -(Math.random()*140+60), dr: Math.random()*720-360, delay: Math.random()*0.18, size: Math.random()*8+5};
            });
            setConfPcs(pieces);
            setTimeout(function() { setConfPcs([]); }, 1200);
            prev[cat + '_celebrated'] = true;
          }
        })();
      }, 220);
    } catch(e) {
      console.error('Generate failed:', e);
      setRolling(false);
    }
  }, [activeGen, t, partySize, gen, universalMerge, consequenceSev]);

  var doInspire = useCallback(function() {
    if (rolling) return;
    setRolling(true);
    var base = universalMerge ? mergeUniversal(t) : t;
    var eff  = filteredTables(base, prefsRef.current);
    var opts = {};
    if (activeGen === 'consequence' && consequenceSev) opts.severity = consequenceSev;
    var three = [generate(activeGen, eff, partySize, opts), generate(activeGen, eff, partySize, opts), generate(activeGen, eff, partySize, opts)];
    setTimeout(function() {
      setInspireResults(three); setInspireMode(true); setResult(null); setRolling(false);
    }, 220);
  }, [activeGen, t, partySize, gen, universalMerge, consequenceSev]);

  function pickInspireResult(data) {
    var chosenIdx = inspireResults.indexOf(data);
    setInspireChosen(chosenIdx);
    setTimeout(function() {
      setResult({genId: activeGen, data: data});
      setInspireMode(false); setInspireResults([]); setInspireChosen(null);
    }, 280);
    setHistory(function(h) { return [{genId: activeGen, data: data, gen: gen}].concat(h).slice(0, 8); });
  }

  function selectGen(id) {
    setActiveGen(id); setResult(null); setSessionPack(null);
    setInspireMode(false); setInspireResults([]);
    if (typeof GENERATOR_GROUPS !== 'undefined') {
      // activeGroup is in CampaignApp scope — call setActiveGroup via returned setter
    }
    var shell = typeof getAppShell === 'function' ? getAppShell() : null;
    if (shell) shell.removeAttribute('data-pressure');
  }

  function pinResult() {
    if (!result) return;
    setPinBouncing(true);
    setTimeout(function() { setPinBouncing(false); }, 400);
    var card = {
      id: String(Date.now()), campId: campId, genId: result.genId,
      label: typeof getResultLabel === 'function' ? getResultLabel(result) : result.genId,
      data: result.data, ts: Date.now(), state: null, visible: true,
    };
    setPinnedCards(function(prev) { return [card].concat(prev); });
    DB.saveCard(campId, card).catch(function(err) { console.warn('[Ogma] pin save failed:', err); });
    showToast('\uD83D\uDCCB Saved to Table Prep');
    if (navigator.vibrate) navigator.vibrate(30);
  }

  function unpinCard(cardId) {
    setPinnedCards(function(prev) { return prev.filter(function(c) { return c.id !== cardId; }); });
    DB.deleteCard(campId, cardId).catch(function(err) { console.warn('[Ogma] unpin delete failed:', err); });
  }

  function restoreCard(card) {
    setResult({ genId: card.genId, data: card.data });
    setActiveGen(card.genId);
  }

  return {
    activeGen: activeGen, setActiveGen: setActiveGen,
    result: result, setResult: setResult,
    rolling: rolling,
    history: history,
    partySize: partySize, setPartySize: setPartySize,
    consequenceSev: consequenceSev, setConsequenceSev: setConsequenceSev,
    cardView: cardView, setCardView: setCardView,
    inspireMode: inspireMode, setInspireMode: setInspireMode,
    inspireResults: inspireResults, inspireChosen: inspireChosen,
    pinnedCards: pinnedCards, setPinnedCards: setPinnedCards,
    pinBouncing: pinBouncing,
    sessionPack: sessionPack, setSessionPack: setSessionPack,
    packRolling: packRolling, setPackRolling: setPackRolling,
    resultAnim: resultAnim,
    showStreakBadge: showStreakBadge,
    confPcs: confPcs,
    gen: gen,
    doGenerate: doGenerate,
    doInspire: doInspire,
    pickInspireResult: pickInspireResult,
    selectGen: selectGen,
    pinResult: pinResult,
    unpinCard: unpinCard,
    restoreCard: restoreCard,
    isMountedRef: isMountedRef,
    prefsRef: prefsRef,
    pinnedCardsRef: pinnedCardsRef,
    _lastSeed: _lastSeed,
    seedResultDone: seedResultDone,
    rollCountRef: rollCountRef,
  };
}

function CampaignApp(props) {
  var campId = props.campId;
  var camp = CAMPAIGNS[campId];
  var t = camp.tables;

  const [theme, setTheme] = useState(getTheme());
  const [textSize, setTextSize] = useState(getTextSize());
  // ── URL seed params — BL-06 shareable links ─────────────────────────────
  // Lazy initializer: parsed once on mount, not on every render
  var _urlParams = useState(function() {
    try {
      var p = new URLSearchParams(window.location.search);
      var s = p.get('seed'); var g = p.get('gen');
      return (s && g) ? {seed: parseInt(s, 36), gen: g} : null;
    } catch(e) { return null; }
  })[0]; // [0] = current value only; no setter needed (URL never changes)
  // Chrome state (toast, PWA, Safari, SW, online) — must be before useGeneratorSession
  var _chrome = useChromeHooks(campId);
  var toast = _chrome.toast; var setToast = _chrome.setToast; var showToast = _chrome.showToast;
  var updateAvailable = _chrome.updateAvailable; var setUpdateAvailable = _chrome.setUpdateAvailable;
  var showSafariWarn = _chrome.showSafariWarn; var setShowSafariWarn = _chrome.setShowSafariWarn;
  var showIosInstall = _chrome.showIosInstall; var setShowIosInstall = _chrome.setShowIosInstall;
  var showPwaNudge = _chrome.showPwaNudge;
  var dismissPwaNudge = _chrome.dismissPwaNudge; var installPwa = _chrome.installPwa;
  var isOnline = _chrome.isOnline;
  var deferredInstallPrompt = _chrome.deferredInstallPrompt;
  // Table prefs + universal merge — must be before useGeneratorSession
  const [prefs, setPrefs] = useState({excluded:{}, locked:{}, custom:{}});
  const [universalMerge, setUniversalMerge] = useState(function() { try { return LS.get('universal_merge') !== false; } catch(e) { return true; } });
  function toggleUniversalMerge() {
    var next = !universalMerge;
    setUniversalMerge(next);
    try { LS.set('universal_merge', next); } catch(e) {}
  }
  // Generator session state (result, history, rolling, pinned, inspire, etc.)
  var _gs = useGeneratorSession(campId, camp, t, universalMerge, prefs, showToast);
  var activeGen = _gs.activeGen; var setActiveGen = _gs.setActiveGen;
  var result = _gs.result; var setResult = _gs.setResult;
  var rolling = _gs.rolling;
  var history = _gs.history;
  var partySize = _gs.partySize; var setPartySize = _gs.setPartySize;
  var gen = _gs.gen;
  var doGenerate = _gs.doGenerate;
  var doInspire = _gs.doInspire;
  var pickInspireResult = _gs.pickInspireResult;
  var selectGen = _gs.selectGen;
  var pinResult = _gs.pinResult;
  var unpinCard = _gs.unpinCard;
  var restoreCard = _gs.restoreCard;
  var pinnedCards = _gs.pinnedCards; var setPinnedCards = _gs.setPinnedCards;
  var pinBouncing = _gs.pinBouncing;
  var confPcs = _gs.confPcs;
  var inspireMode = _gs.inspireMode; var setInspireMode = _gs.setInspireMode;
  var inspireResults = _gs.inspireResults;
  var inspireChosen = _gs.inspireChosen;
  var cardView = _gs.cardView; var setCardView = _gs.setCardView;
  var consequenceSev = _gs.consequenceSev; var setConsequenceSev = _gs.setConsequenceSev;
  var resultAnim = _gs.resultAnim;
  var showStreakBadge = _gs.showStreakBadge;
  var sessionPack = _gs.sessionPack; var setSessionPack = _gs.setSessionPack;
  var packRolling = _gs.packRolling; var setPackRolling = _gs.setPackRolling;
  var isMountedRef = _gs.isMountedRef;
  var prefsRef = _gs.prefsRef;
  var pinnedCardsRef = _gs.pinnedCardsRef;
  var _lastSeed = _gs._lastSeed;
  var seedResultDone = _gs.seedResultDone;
  var rollCountRef = _gs.rollCountRef;
  const [showKbShortcuts, setShowKbShortcuts] = useState(false);
  // WS-12: Quick Find bar
  const [showQuickFind, setShowQuickFind] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false); // EXP-03: copy-link feedback
  // ── Modal panels — one active at a time ─────────────────────────────────
  // Replaces 7 separate boolean state vars with a single discriminated union.
  // activePanel: 'tables'|'settings'|'vault'|'fp'|'cd'|'doc'|null
  const [activePanel, setActivePanel] = useState(null);
  // Convenience aliases — same call sites, no render changes needed
  var showTables   = activePanel === 'tables';
  var showSettings = activePanel === 'settings';
  var showVault    = activePanel === 'vault';
  var showFP       = activePanel === 'fp';
  var showCD       = activePanel === 'cd';
  var showDoc      = activePanel === 'doc';
  function setShowTables(v)   { setActivePanel(v ? 'tables'   : null); }
  function setShowSettings(v) { setActivePanel(v ? 'settings' : null); }
  function setShowVault(v)    { setActivePanel(v ? 'vault'    : null); }
  function setShowFP(v)       { setActivePanel(v ? 'fp'       : null); }
  function setShowCD(v)       { setActivePanel(v ? 'cd'       : null); }
  function setShowDoc(v)      { setActivePanel(v ? 'doc'      : null); }
  const [fpState, setFpState] = useState(function() {
    try { var s = LS.get('fp_state'); return s || null; } catch(e) { return null; }
  });
  function updateFP(next) {
    setFpState(next);
    try { LS.set('fp_state', next); } catch(e) {}
  }
  const [showSidebar, setShowSidebar] = useState(false);
  // F4: Consequence severity selector - '' means random (default)
  // Card view toggle — MTG-style result card vs dossier

  // Interaction state
  // Navigation
  const [activeGroup, setActiveGroup] = useState(function() { return groupForGen('npc_minor'); });
  // History/Pinned drawer
  const [showHistory, setShowHistory] = useState(false);
  const [prepView, setPrepView] = useState(false);
  // Table multiplayer sync
  const tableSyncRef = React.useRef(null);
  const [tableRoomCode, setTableRoomCode] = useState(function(){
    try{var p=new URLSearchParams(window.location.search);return p.get('room')||null;}catch(e){return null;}
  });
  const [tableIsRemote, setTableIsRemote] = useState(false);
  const [tablePresence, setTablePresence] = useState([]);




  // (showToast, SW update, Safari/iOS, PWA effects now in useChromeHooks)


  function toggleTheme() {
    var next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next); setTheme(next);
  }
  function toggleTextSize() {
    var next = (textSize + 1) % 3;
    applyTextSize(next); setTextSize(next);
  }
  var gen = GENERATORS.find(function(g) { return g.id === activeGen; });


  // Two-tier nav: find which group the active generator belongs to
  function groupForGen(genId) {
    for (var i = 0; i < GENERATOR_GROUPS.length; i++) {
      if (GENERATOR_GROUPS[i].gens.indexOf(genId) !== -1) return GENERATOR_GROUPS[i].id;
    }
    return GENERATOR_GROUPS[0].id;
  }
  var currentGroup = GENERATOR_GROUPS.find(function(g) { return g.id === activeGroup; }) || GENERATOR_GROUPS[0];
  var groupGens = currentGroup.gens.map(function(gid) { return GENERATORS.find(function(g) { return g.id === gid; }); }).filter(Boolean);
  // Table multiplayer sync refs
  var tableCursorCbRef = useRef(null);   // MP-22: holds PrepCanvas cursor handler
  var remoteStateCbRef = useRef(null);    // MP-07 fix: holds PrepCanvas state applier

  function hostTable(){
    var code=generateTableRoomCode();
    setTableRoomCode(code);
    var s=createTableSync(code,'gm',
      function(data){
        if(data.type==='cursor'){
          if(tableCursorCbRef.current)tableCursorCbRef.current(data);
        }
      },
      function(rollData){showToast((rollData.who||'?')+' \u00B7 '+(rollData.skill||'?')+' \u2192 '+(rollData.label||rollData.total));}, // MP-21: receive player rolls
      function(msg){showToast(msg);},
      function(conns){setTablePresence(conns);}
    );
    tableSyncRef.current=s;
    if(!s){showToast('Sync unavailable');return;}
    showToast('Table hosted: '+code);
  }
  function joinTable(code){
    var s=createTableSync(code,'player',
      function(data){
        if(!data||typeof data!=='object')return;
        if(data.type==='cursor'){
          if(tableCursorCbRef.current)tableCursorCbRef.current(data);
          return;
        }
        if(data.type==='player_action')return;
        // MP-07 fix: apply full canvas state broadcast from GM
        if(remoteStateCbRef.current)remoteStateCbRef.current(data);
        setTableIsRemote(true);
      },
      function(rollData){showToast((rollData.who||'?')+' \u00B7 '+(rollData.skill||'?')+' \u2192 '+(rollData.label||rollData.total));}, // MP-20: receive GM rolls
      function(msg){showToast(msg);},
      function(conns){setTablePresence(conns);}
    );
    tableSyncRef.current=s;
    setTableRoomCode(code);
    setTableIsRemote(true);
  }
  function disconnectTable(){
    if(tableSyncRef.current)tableSyncRef.current.disconnect();
    tableSyncRef.current=null;
    setTableRoomCode(null);setTableIsRemote(false);setTablePresence([]);
    showToast('Table disconnected');
  }
  // Auto-join if URL has ?room= param (remote player following a link)
  useEffect(function(){
    if(tableRoomCode&&!tableSyncRef.current)joinTable(tableRoomCode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRoomCode]);
  // Help level preference - controls inline help detail
  const [helpLevel, setHelpLevel] = useState(function() { try { return LS.get('help_level') || 'new_fate'; } catch(e) { return 'new_fate'; } });
  function changeHelpLevel(lvl) { setHelpLevel(lvl); try { LS.set('help_level', lvl); } catch(e) {} }

  // ── Sidebar tab state (Concept A tabbed sidebar)
  const [sidebarTab, setSidebarTab] = useState('gen');

  // ── Result panel tab state (GM Tips | Rules | D&D Notes)
  // Checklist state — per-session, cleared on generator change
  const [checklistState, setChecklistState] = useState([]);
  // Inspire chosen index — for ghost animation

  // ── URL seed pre-generation — BL-06 ──────────────────────────────────────
  useEffect(function() {
    if (seedResultDone.current || !_urlParams) return;
    seedResultDone.current = true;
    try {
      var base = universalMerge ? mergeUniversal(t) : t;
      var eff  = filteredTables(base, prefs);
      var data = generate(_urlParams.gen, eff, partySize, {}, _urlParams.seed);
      if (data && typeof data === 'object') {
        setResult({genId: _urlParams.gen, data: data});
      }
    } catch(e) {}
  }, []); // run once on mount; seedResultDone.current is the one-shot guard

  // ── Intro modal — large popup over the page, dismissed on click or sequence end ─


  // Help level display metadata
  var HL_META = {
    experienced: {icon: '🎭', label: 'Experienced'},
    new_fate:    {icon: '🎲', label: 'Other RPGs'},
    dnd_convert: {icon: '⚔',  label: 'D&D player'},
    new_ttrpg:   {icon: '🌱', label: 'New here'},
  };
  var hlMeta = HL_META[helpLevel] || HL_META['new_fate'];

  // GM Mode - surfaces running guidance on results
  const [gmMode, setGmMode] = useState(function() { try { return LS.get('gm_mode') !== false; } catch(e) { return true; } });
  function toggleGmMode() {
    var next = !gmMode; setGmMode(next);
    try { LS.set('gm_mode', next); } catch(e) {}
    document.documentElement.setAttribute('data-gm-mode', next ? 'on' : 'off');
  }


  // Quick Adventure Start Pack — generates Adventure Seed + Scene Setup + Major NPC (first-session bundle)
  // Changed from Seed+Countdown+Compel per WS-14 real session feedback (Priya):
  // Countdown+Compel assume ongoing campaign context. First session needs Seed+Scene+NPC.
  var doFullSession = useCallback(function() {
    if (packRolling || rolling) return;
    setPackRolling(true);
    setSessionPack(null);
    setResult(null);
    if (navigator.vibrate) navigator.vibrate(40);
    var base = universalMerge ? mergeUniversal(t) : t;
    var eff  = filteredTables(base, prefsRef.current);
    var seedData  = generate('seed',      eff, partySize, {});
    var sceneData = generate('scene',     eff, partySize, {});
    var npcData   = generate('npc_major', eff, partySize, {});
    setTimeout(function() {
      var pack = {
        seed:     {genId: 'seed',      data: seedData},
        scene:    {genId: 'scene',     data: sceneData},
        npcMajor: {genId: 'npc_major', data: npcData},
        ts:       Date.now(),
      };
      setSessionPack(pack);
      // Persist to IDB so Run surface can import it
      DB.saveSession('quick_prep_pack_' + campId, {
        seedData: seedData, sceneData: sceneData, npcData: npcData,
        pack: pack, campId: campId, ts: Date.now(),
      }).catch(function(){});
      setActiveGen('seed');
      setPackRolling(false);
    }, 400);
  }, [t, partySize, universalMerge, rolling, packRolling]);

  // EXP-02: Export pinned cards as JSON file
  function exportCards() {
    if (!pinnedCards.length) { showToast('No cards to export'); return; }
    if (typeof DB === 'undefined' || !DB.exportCards) { showToast('Export unavailable'); return; }
    DB.exportCards(campId, camp.meta.name, pinnedCards);
    showToast('Exported ' + pinnedCards.length + ' card' + (pinnedCards.length === 1 ? '' : 's'));
  }

  // EXP-02: Import cards from Ogma JSON file
  function importCards() {
    if (typeof DB === 'undefined' || !DB.importFile) { showToast('Import unavailable'); return; }
    DB.importFile().then(function(data) {
      if (data.type === 'cards' && Array.isArray(data.cards) && data.cards.length) {
        data.cards.forEach(function(card) {
          var c = Object.assign({}, card, {id: String(Date.now() + Math.random()), ts: Date.now()});
          setPinnedCards(function(prev) { return [c].concat(prev); });
          DB.saveCard(campId, c).catch(function() {});
        });
        showToast('Imported ' + data.cards.length + ' card' + (data.cards.length === 1 ? '' : 's'));
      } else if (data.type === 'card' && data.card) {
        var c = Object.assign({}, data.card, {id: String(Date.now() + Math.random()), ts: Date.now()});
        setPinnedCards(function(prev) { return [c].concat(prev); });
        DB.saveCard(campId, c).catch(function() {});
        showToast('Card imported');
      } else {
        showToast('Unrecognised file — expected an Ogma cards export');
      }
    }).catch(function(err) {
      showToast('Import failed: ' + (err && err.message ? err.message : 'unknown error'));
    });
  }

  function copyShareLinkWithFeedback() {
    copyShareLink();
    setLinkCopied(true);
    setTimeout(function() { setLinkCopied(false); }, 1800);
  }

  function copyShareLink() {
    if (!result) return;
    var seed = _lastSeed.current;
    if (!seed) return;
    var base = window.location.pathname + window.location.search.split('?')[0];
    var url = window.location.origin + base.replace(/[?#].*$/, '') +
              '?gen=' + encodeURIComponent(result.genId) + '&seed=' + seed;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function() {
        showToast('🔗 Link copied');
      }).catch(function() { showToast('🔗 Link ready — copy from address bar'); });
    } else {
      showToast('🔗 Link ready — copy from address bar');
    }
    try { window.history.replaceState({}, '', '?gen=' + encodeURIComponent(result.genId) + '&seed=' + seed); } catch(e) {}
  }

  // Apply campaign data-attribute for CSS accent vars
  useEffect(function() {
    document.documentElement.setAttribute('data-campaign', campId);
    return function() { document.documentElement.removeAttribute('data-campaign'); };
  }, [campId]);

  // Apply GM Mode data-attribute
  useEffect(function() {
    document.documentElement.setAttribute('data-gm-mode', gmMode ? 'on' : 'off');
  }, [gmMode]);

  // Sidebar focus management — move focus to first item when drawer opens (mobile a11y)
  var sidebarRef = useRef(null);
  useEffect(function() {
    if (!showSidebar) return;
    if (window.innerWidth > 640) return;
    var el = sidebarRef.current;
    if (!el) return;
    var first = el.querySelector('button, a, [tabindex="0"]');
    if (first) setTimeout(function() { first.focus(); }, 50);
  }, [showSidebar]);

  // Sticky Roll FAB — appears when Roll button scrolls off-screen
  var rollBtnRef = useRef(null);
  const [showFAB, setShowFAB] = useState(false);
  useEffect(function() {
    var el = rollBtnRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    var obs = new IntersectionObserver(function(entries) {
      setShowFAB(!entries[0].isIntersecting);
    }, {threshold: 0.1});
    obs.observe(el);
    return function() { obs.disconnect(); };
  }, []);


  // Keyboard shortcuts
  useEffect(function() {
    function onKey(e) {
      var tag = (e.target || {}).tagName || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Escape always closes any open panel
      if (e.key === 'Escape') {
        if (showQuickFind)   { setShowQuickFind(false);  return; }
        if (showSidebar)   { setShowSidebar(false);   return; }
        if (showHistory)   { setShowHistory(false);   return; }
        if (showKbShortcuts) { setShowKbShortcuts(false); return; }
        if (showTables)    { setShowTables(false);    return; }
        if (showSettings)  { setShowSettings(false);  return; }
        if (showVault)     { setShowVault(false);     return; }
        if (showDoc)       { setShowDoc(false);       return; }
        return;
      }

      // All other shortcuts blocked when a modal/panel is open
      if (showQuickFind || showTables || showSettings || showHistory || showSidebar || showVault || showDoc) return;

      if (e.code === 'Space' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (!rolling) doGenerate();
      } else if (e.key === '/') {
        e.preventDefault();
        setShowQuickFind(true);
      } else if (e.key === 'p' || e.key === 'P') {
        if (result) {
          var already = pinnedCardsRef.current.some(function(c) {
            return c.genId === result.genId && JSON.stringify(c.data) === JSON.stringify(result.data);
          });
          if (!already) {
            setPinnedCards(function(prev) { return [{genId: result.genId, data: result.data}].concat(prev); });
            setToast('Kept ✓');
          }
        }
      } else if (e.key === 'g' || e.key === 'G') {
        var allGens = GENERATOR_GROUPS.reduce(function(acc, grp) { return acc.concat(grp.gens); }, []);
        var idx = allGens.indexOf(activeGen);
        var next = allGens[(idx + 1) % allGens.length];
        selectGen(next);
      } else if (e.key === 'i' || e.key === 'I') {
        if (!rolling) doInspire();
      } else if (e.key === '?') {
        setShowKbShortcuts(true);
      } else if (e.key === 'z' || e.key === 'Z') {
        // Undo last pin (H3)
        setPinnedCards(function(prev) {
          if (prev.length === 0) return prev;
          setToast('Removed from session ↩');
          return prev.slice(1);
        });
      } else if (e.key === 'l' || e.key === 'L') {
        if (result) copyShareLinkWithFeedback();
      } else if (e.key === 'c' || e.key === 'C') {
        if (result) {
          var md = toMarkdown(result.genId, result.data, camp.meta.name);
          if (md && navigator.clipboard) {
            navigator.clipboard.writeText(md).then(function() {
              setToast('Copied ✓');
            }).catch(function() {
              setToast('Copy failed - use Share button');
            });
          }
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return function() { document.removeEventListener('keydown', onKey); };
  }, [rolling, result, activeGen, showTables, showSettings, showVault, showHistory, showSidebar, showKbShortcuts, showQuickFind, showDoc, doGenerate, doInspire, copyShareLink]);

  var totalEntries = Object.values(t).reduce(function(n, v) { return n + (Array.isArray(v) ? v.length : 0); }, 0);

  return h('div', {className: 'app-shell', 'data-gen': activeGen},
    h('a', {href: '#main', className: 'skip-link'}, 'Skip to main content'),

    // ════════════════════════════════════════════════════════════════
    // PATTERN G: TOPBAR + SIDEBAR + CONTENT PANEL
    // Desktop: sticky topbar (40px) + sidebar (220px) + result panel
    // Mobile:  sticky topbar + off-canvas drawer + full-width content
    // ════════════════════════════════════════════════════════════════

    // ── Top bar — unified chrome: wordmark + breadcrumb + status chips ──
    h('header', {className: 'topbar', role: 'banner'},
      // Hamburger — 44px touch target (W2), mobile only
      h('button', {
        className: 'topbar-hamburger btn btn-icon btn-ghost',
        onClick: function() { setShowSidebar(!showSidebar); },
        'aria-label': showSidebar ? 'Close menu' : 'Open menu',
        'aria-expanded': String(showSidebar),
        title: 'Menu',
      }, showSidebar ? '✕' : '☰'),
      // OGMA wordmark — replaces full acronym (H8)
      h('a', {href: '../index.html', className: 'topbar-wordmark', 'aria-label': 'Ogma home'}, 'OGMA'),
      h('div', {className: 'topbar-sep', 'aria-hidden': 'true'}),
      // Breadcrumb trail — IA3, present on every page
      h('nav', {className: 'topbar-crumb', 'aria-label': 'Breadcrumb'},
        h('a', {href: '../index.html', className: 'topbar-crumb-item'}, 'Home'),
        h('span', {className: 'topbar-crumb-sep', 'aria-hidden': 'true'}, '›'),
        h('span', {className: 'topbar-crumb-item'}, camp.meta.name),
        h('span', {className: 'topbar-crumb-sep', 'aria-hidden': 'true'}, '›'),
        h('span', {
          className: 'topbar-crumb-item current',
          'aria-current': 'page',
        }, (GENERATORS.find(function(g) { return g.id === activeGen; }) || {}).label || activeGen)
      ),
      // UX-04: unified nav tabs — Worlds / Prep / Learn / Help
      h('nav', {className: 'topbar-tabs', 'aria-label': 'Main navigation'},
        h('a', {href: '../index.html', className: 'topbar-tab'},
          h('span', {className: 'topbar-tab-icon', 'aria-hidden': 'true'}, '🌍'),
          h('span', {className: 'topbar-tab-label'}, 'Worlds')
        ),

        h('a', {href: '../help/learn-fate.html', className: 'topbar-tab'},
          h('span', {className: 'topbar-tab-icon', 'aria-hidden': 'true'}, '📖'),
          h('span', {className: 'topbar-tab-label'}, 'Learn')
        ),
        h('a', {href: '../help/index.html', className: 'topbar-tab'},
          h('span', {className: 'topbar-tab-icon', 'aria-hidden': 'true'}, '❓'),
          h('span', {className: 'topbar-tab-label'}, 'Help')
        )
      ),
      // Status zone — always visible, interactive (H1, H4, H6, H9)
      h('div', {className: 'topbar-status'},
        // Offline indicator
        !isOnline && h('span', {
          className: 'topbar-chip topbar-chip-offline',
          role: 'status',
          'aria-live': 'polite',
          title: 'You are offline. Ogma is running from cached data.',
        }, '⚡ Offline'),

        // Table prep — cart icon + saved card count
        h('button', {
          className: 'btn btn-ghost topbar-nav-btn topbar-nav-hide-sm' + (prepView ? ' active' : ''),
          onClick: function() { setPrepView(function(v) { return !v; }); },
          title: prepView ? 'Back to generator' : 'View Table (' + pinnedCards.length + ' cards)',
          'aria-pressed': String(prepView),
          style: {fontSize: 13, gap: 5},
        },
          h(FaCartPlusIcon, {size: 13}),
          ' Table',
          pinnedCards.length > 0 && h('span', {style: {
            marginLeft: 4, fontSize: 10, fontWeight: 800,
            background: 'var(--accent)', color: '#000',
            borderRadius: '100px', padding: '1px 5px', lineHeight: 1.4,
          }}, String(pinnedCards.length))
        ),
        // Theme toggle
        h('a', {
          href: 'campaigns/board.html?world=' + campId,
          className: 'btn btn-ghost topbar-nav-btn topbar-nav-hide-sm',
          style: {fontSize: 12, textDecoration: 'none', padding: '5px 10px'},
          title: 'Try the new Board view (beta)',
        }, '📄 Board'),
        h('button', {
          className: 'btn btn-icon btn-ghost',
          onClick: toggleTheme,
          'aria-label': theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
          title: theme === 'dark' ? 'Light mode' : 'Dark mode',
          style: {width: 44, height: 44},
        }, h(RaIcon, {n: theme === 'dark' ? RA_ICONS.theme_light : RA_ICONS.theme_dark}))
      )
    ),

    // ── App body: sidebar + content ───────────────────────────────────
    h('div', {className: 'app-body'},

      showSidebar && h('div', {
        className: 'sidebar-backdrop',
        onClick: function() { setShowSidebar(false); },
        'aria-hidden': 'true',
      }),

      // ── Sidebar — Concept A: tabbed Generate / Session ──────────────────
      h('nav', {
        ref: sidebarRef,
        className: 'sidebar' + (showSidebar ? ' sidebar-open' : ''),
        'aria-label': 'Generators and tools',
      },

        // Visually-hidden ARIA live region — announces tab name on switch (W7, H1)
        h('div', {className: 'sidebar-aria-live', 'aria-live': 'polite', 'aria-atomic': 'true', id: 'sb-tab-announce', role: 'status'}),

        // ── Tab bar ─────────────────────────────────────────────────
        h('div', {className: 'sidebar-tab-bar', role: 'tablist'},
          h('button', {
            id: 'sb-tab-gen',
            className: 'sidebar-tab-btn' + (sidebarTab === 'gen' ? ' active' : ''),
            onClick: function() {
              setSidebarTab('gen');
              var el = document.getElementById('sb-tab-announce');
              if (el) el.textContent = 'Generate tab';
            },
            role: 'tab',
            'aria-selected': String(sidebarTab === 'gen'),
            'aria-controls': 'sb-panel-gen',
          }, 'Generate'),

        ),

        // ══════════════════════════════════════════════════════════
        // GENERATE PANEL — 16 generators in 4 groups
        // ══════════════════════════════════════════════════════════
        h('div', {
          id: 'sb-panel-gen',
          className: 'sidebar-panel' + (sidebarTab === 'gen' ? ' active' : ''),
          role: 'tabpanel',
          'aria-labelledby': 'sb-tab-gen',
        },
          h('div', {className: 'sidebar-group-label'}, 'Characters'),
          ['npc_minor','npc_major','backstory'].map(function(gid) {
            var g = GENERATORS.find(function(x) { return x.id === gid; });
            if (!g) return null;
            return h('button', {
              key: gid,
              className: 'sidebar-gen-item' + (activeGen === gid ? ' active' : ''),
              onClick: function() { selectGen(gid); setShowSidebar(false); },
            },
              h('span', {className: 'sidebar-item-icon'}, RA_ICONS[gid] ? h(RaIcon, {n: RA_ICONS[gid]}) : g.icon),
              h('span', {className: 'sidebar-item-label'}, g.label)
            );
          }),
          h('div', {className: 'sidebar-group-label'}, 'Scenes'),
          ['scene','encounter','complication'].map(function(gid) {
            var g = GENERATORS.find(function(x) { return x.id === gid; });
            if (!g) return null;
            return h('button', {
              key: gid,
              className: 'sidebar-gen-item' + (activeGen === gid ? ' active' : ''),
              onClick: function() { selectGen(gid); setShowSidebar(false); },
            },
              h('span', {className: 'sidebar-item-icon'}, RA_ICONS[gid] ? h(RaIcon, {n: RA_ICONS[gid]}) : g.icon),
              h('span', {className: 'sidebar-item-label'}, g.label)
            );
          }),
          h('div', {className: 'sidebar-group-label'}, 'Pacing'),
          ['challenge','contest','obstacle','countdown','constraint'].map(function(gid) {
            var g = GENERATORS.find(function(x) { return x.id === gid; });
            if (!g) return null;
            return h('button', {
              key: gid,
              className: 'sidebar-gen-item' + (activeGen === gid ? ' active' : ''),
              onClick: function() { selectGen(gid); setShowSidebar(false); },
            },
              h('span', {className: 'sidebar-item-icon'}, RA_ICONS[gid] ? h(RaIcon, {n: RA_ICONS[gid]}) : g.icon),
              h('span', {className: 'sidebar-item-label'}, g.label)
            );
          }),
          h('div', {className: 'sidebar-group-label'}, 'World'),
          ['campaign','seed','faction','compel','consequence'].map(function(gid) {
            var g = GENERATORS.find(function(x) { return x.id === gid; });
            if (!g) return null;
            return h('button', {
              key: gid,
              className: 'sidebar-gen-item' + (activeGen === gid ? ' active' : ''),
              onClick: function() { selectGen(gid); setShowSidebar(false); },
            },
              h('span', {className: 'sidebar-item-icon'}, RA_ICONS[gid] ? h(RaIcon, {n: RA_ICONS[gid]}) : g.icon),
              h('span', {className: 'sidebar-item-label'}, g.label)
            );
          }),
          h('div', {className: 'sidebar-group-label'}, 'Tools'),
          
          h('button', {
            id: 'sidebar-btn-doc',
            className: 'sidebar-tool-btn' + (showDoc ? ' active' : ''),
            onClick: function() { setShowDoc(!showDoc); setShowSidebar(false); },
            'aria-pressed': String(showDoc),
            'aria-controls': 'floater-doc',
          },
            h('span', {className: 'sidebar-item-icon'}, '📝'),
            h('span', {className: 'sidebar-item-label'}, 'Session Notes')
          ),
          h('button', {
            className: 'sidebar-tool-btn',
            'aria-label': 'Keyboard shortcuts',
            onClick: function() { setShowKbShortcuts(true); },
            title: 'Keyboard shortcuts',
          },
            h('span', {className: 'sidebar-item-icon'}, h('span', {'aria-hidden':'true'}, '⌨')),
            h('span', {className: 'sidebar-item-label'}, 'KB Shortcuts')
          ),
          h('div', {className: 'sidebar-group-label'}, 'Settings'),
          h('button', {
            className: 'sidebar-tool-btn',
            onClick: function() { setShowTables(true); setShowSidebar(false); },
          },
            h('span', {className: 'sidebar-item-icon'}, h(RaIcon, {n: RA_ICONS.customize})),
            h('span', {className: 'sidebar-item-label'}, 'Customize Tables')
          ),
          h('button', {
            className: 'sidebar-tool-btn',
            onClick: function() { setShowSettings(true); setShowSidebar(false); },
          },
            h('span', {className: 'sidebar-item-icon'}, h(RaIcon, {n: RA_ICONS.settings})),
            h('span', {className: 'sidebar-item-label'}, 'Settings')
          ),
          
          h('div', {style: {height: 8, flexShrink: 0}})
        ),

        // ══════════════════════════════════════════════════════════
        // SESSION PANEL — at-table tools + GM Mode/Help Level + nav
        // ══════════════════════════════════════════════════════════
        h('div', {
          id: 'sb-panel-sess',
          className: 'sidebar-panel' + (sidebarTab === 'sess' ? ' active' : ''),
          role: 'tabpanel',
          'aria-label': 'Prep tools and settings',
        },

          // ── Vault ─────────────────────────────────────────────
          

          h('div', {className: 'sidebar-divider'}),

          // ── Tools ──────────────────────────────────────
          h('div', {className: 'sidebar-group-label'}, 'Tools'),
          


                    h('div', {className: 'sidebar-legal'},
            'Fate™ is a trademark of Evil Hat Productions, LLC.',
            h('br', null),
            h('a', {href: '../license.html', style: {color: 'inherit', textDecoration: 'underline', opacity: 0.7}},
              'License & Attribution (CC BY 3.0)')
          )
        )
      ),

      // ── Main content panel ───────────────────────────────────────────
      h('div', {className: 'content-panel'},

        // ── TABLE PREP VIEW — infinite canvas (run-style) ─────────────────
        prepView && h(PrepCanvas, {
          campId: campId,
          campName: camp.meta.name,
          partySize: partySize,
          pinnedCards: pinnedCards,
          setPinnedCards: setPinnedCards,
          toStunts: t.stunts,
          onBack: function() { setPrepView(false); },
          onExport: function() {
            var header = '# ' + camp.meta.name + ' \u2014 Session Pack\n_' + pinnedCards.length + ' cards_\n\n';
            var body = pinnedCards.map(function(c, i) {
              return '## ' + (i+1) + '. ' + (c.data.name || c.data.location || c.genId) + '\n' + toMarkdown(c.genId, c.data, camp.meta.name);
            }).join('\n\n---\n\n');
            var blob = new Blob([header + body], {type: 'text/markdown'});
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url; a.download = camp.meta.name.replace(/\s+/g,'-').toLowerCase() + '-prep.md';
            document.body.appendChild(a); a.click();
            document.body.removeChild(a); setTimeout(function(){URL.revokeObjectURL(url);}, 30000);
            showToast('\u2B07 Prep exported as .md');
          },
          showToast: showToast,
          DB: DB,
          // TC-21: open the FP+Milestone floater from Table toolbar
          onShowMilestones: function() { setActivePanel('fp'); },
          // Table sync props
          tableSyncCtx: {
            sync:       tableSyncRef.current,
            roomCode:   tableRoomCode,
            isRemote:   tableIsRemote,
            presence:   tablePresence,
            onCursor:   function(handler){tableCursorCbRef.current=handler;},
            onState:    function(handler){remoteStateCbRef.current=handler;},
            host:       hostTable,
            join:       joinTable,
            disconnect: disconnectTable,
          },
        }),

        // ── NORMAL GENERATE VIEW ───────────────────────────────────────────
        !prepView && h('main', {id: 'main'},
          h('div', {className: 'main-layout'},

        // Result panel
        h('div', {id: 'result-panel', role: 'region', 'aria-label': sessionPack ? 'Full session prep packet' : (result ? 'Generated ' + gen.label + ' result' : 'Ready to generate ' + gen.label), 'aria-live': 'polite', 'aria-atomic': 'true'},
          h('div', {className: 'result-panel', style: {padding: 0, overflow: 'hidden'}},

            // ── Unified action bar: Roll + Inspire + contextual + secondary ──
            h('div', {className: 'action-bar', ref: rollBtnRef},
              // PRIMARY: Roll
              confPcs.length > 0 && h('div', {style:{position:'relative',height:0,overflow:'visible','aria-hidden':'true'}},
                confPcs.map(function(p) {
                  return h('div', {key: p.id, className:'confetti-piece',
                    style:{background:p.color, width:p.size+'px', height:p.size+'px',
                      '--dx':p.dx+'px', '--dy':p.dy+'px', '--dr':p.dr+'deg',
                      animationDelay:p.delay+'s', top:'-4px', left:'50%', marginLeft:'-4px'}});
                })
              ),
              h('button', {
                className: 'btn-roll action-bar-roll' + (rolling ? ' rolling' : '') + (showStreakBadge ? ' streak-pulse' : ''),
                onClick: doGenerate,
                disabled: rolling,
                'aria-live': 'polite',
                style: {position: 'relative'},
              },
                showStreakBadge && h('span', {className: 'streak-badge'}, '+' + rollCountRef.current + ' 🎲'),
                h('span', {className: 'roll-label'},
                  rolling
                    ? h(Fragment, null, h('span', {className: 'dice-spinning'}, h('span', {'aria-hidden':'true'}, '🎲')), ' Rolling…')
                    : h(Fragment, null, h('span', {'aria-hidden':'true'}, '🎲'), ' Roll ', gen.label)
                ),
                h('span', {className: 'roll-fx'})
              ),
              // INSPIRE
              h('button', {
                className: 'btn btn-ghost action-bar-inspire' + (inspireMode ? ' inspire-active' : ''),
                onClick: inspireMode
                  ? function() { setInspireMode(false); setInspireResults([]); }
                  : doInspire,
                disabled: rolling,
                title: inspireMode ? 'Exit inspiration mode' : 'Roll 3 options to pick from [I]',
                'aria-label': inspireMode ? 'Exit inspiration mode' : 'Inspiration mode',
                'aria-keyshortcuts': 'I',
              },
                h('span', {'aria-hidden':'true'}, inspireMode ? '✕' : '🔮'),
                h('span', {className: 'action-bar-label'}, inspireMode ? ' Exit inspiration mode' : ' Inspire — roll 3 options to pick from')
              ),
              // CONTEXTUAL: consequence severity / party size
              activeGen === 'consequence' && h('div', {className: 'action-bar-ctx-row'},
                h('span', {className:'action-bar-ctx-label'}, 'Severity:'),
                ['', 'mild', 'moderate', 'severe'].map(function(sev) {
                  var label = sev || 'Any';
                  var isActive = consequenceSev === sev;
                  var sevColors = {'': 'var(--text-dim)', mild: 'var(--c-blue)', moderate: 'var(--c-purple)', severe: 'var(--c-red)'};
                  return h('button', {
                    key: sev || 'random',
                    className: 'btn btn-ghost action-bar-ctx',
                    onClick: function() { setConsequenceSev(sev); },
                    style: {
                      color: isActive ? '#fff' : sevColors[sev],
                      background: isActive ? sevColors[sev] : 'transparent',
                      border: '1px solid ' + (isActive ? sevColors[sev] : 'var(--border)'),
                    },
                  }, label.charAt(0).toUpperCase() + label.slice(1));
                })
              ),
              activeGen === 'encounter' && h('div', {className: 'action-bar-ctx-row'},
                h('span', {className:'action-bar-ctx-label'}, 'Party size:'),
                [2, 3, 4, 5].map(function(n) {
                  return h('button', {
                    key: n,
                    className: 'party-btn action-bar-ctx' + (partySize === n ? ' active' : ''),
                    onClick: function() { setPartySize(n); },
                  }, n);
                })
              ),
              // SECONDARY (pushed right): Rules / Share / Pin
              h('div', {className: 'action-bar-secondary'},

                // EXP-03: Copy link
                result && h('button', {
                  className: 'btn btn-ghost action-bar-icon' + (linkCopied ? ' export-copied' : ''),
                  onClick: copyShareLinkWithFeedback,
                  title: linkCopied ? 'Link copied!' : 'Copy shareable link to this result',
                  'aria-label': linkCopied ? 'Link copied' : 'Copy shareable link',
                }, linkCopied ? '\u2705' : '\uD83D\uDD17'),
                result && h('button', {
                  className: 'btn btn-ghost action-bar-icon' + (showExport ? ' active' : ''),
                  onClick: function() { setShowExport(!showExport); },
                  title: showExport ? 'Close export options' : 'More export options',
                  'aria-label': 'Export options',
                }, h(FaShareIcon, {size:14})),
                result && h('button', {
                  className: 'btn btn-ghost action-bar-icon' + (pinBouncing ? ' pin-bounce' : ''),
                  onClick: pinResult,
                  title: 'Save to Table Prep [P]',
                  'aria-label': pinnedCards.length > 0
                    ? 'Save to Table Prep (' + pinnedCards.length + ' saved)'
                    : 'Save to Table Prep',
                  style: {position: 'relative'},
                },
                  pinBouncing && h('span', {className: 'pin-ring-el'}),
                  h(FaCartPlusIcon, {size: 16}),
                  pinnedCards.length > 0 && h('span', {
                    'aria-hidden': 'true',
                    style: {
                      position: 'absolute', top: 1, right: 1,
                      width: 14, height: 14, borderRadius: '50%',
                      background: 'var(--accent)', color: '#fff',
                      fontSize: 9, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      lineHeight: 1, pointerEvents: 'none',
                    },
                  }, pinnedCards.length > 9 ? '9+' : String(pinnedCards.length))
                ),
                pinnedCards.length > 0 &&
                // Card view toggle
                h('button', {
                  className: 'card-view-btn' + (cardView ? ' active' : ''),
                  onClick: function() { setCardView(function(v) { return !v; }); },
                  title: cardView ? 'Switch to dossier view' : 'Switch to card view',
                  'aria-label': cardView ? 'Switch to dossier view' : 'Switch to card view',
                  'aria-pressed': String(cardView),
                }, cardView ? '\u22df Dossier' : '\u2665 Card'),
                // EXP-06+: Export menu — Image Pack / Print / JSON / Import
                h(ExportMenu, {
                  cards: pinnedCards,
                  campName: camp.meta.name,
                  onImport: importCards,
                })
              )
            ),

            // ── Inline share drawer ────────────────────────────────────
            showExport && result && h(ShareDrawer, {
              genId:    result.genId,
              data:     result.data,
              campName: camp.meta.name,
              campId:   campId,
              onClose:  function() { setShowExport(false); },
              onCopyLink: copyShareLink,
            }),

            // ── Session Pack — shown instead of single result ─────────────────────
            sessionPack && h(SessionPackPanel, {
              pack: sessionPack,
              campId: campId,
              onPin: function() {
                var ts = Date.now();
                [
                  {genId:'seed',      data:sessionPack.seed.data},
                  {genId:'scene',     data:sessionPack.scene.data},
                  {genId:'npc_major', data:sessionPack.npcMajor.data},
                ].forEach(function(c) {
                  var card = {
                    id: String(ts + Math.random()),
                    campId: campId, genId: c.genId,
                    label: (GENERATORS.find(function(g){return g.id===c.genId;})||{}).label || c.genId,
                    data: c.data, ts: ts,
                  };
                  setPinnedCards(function(prev) { return [card].concat(prev); });
                  DB.saveCard(campId, card).catch(function(err) { console.warn('[Ogma] session pack pin save failed:', err); });
                });
                showToast('\uD83D\uDCCB 3 cards saved to Table Prep');
                if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
              },
              onClear: function() { setSessionPack(null); setResult(null); },
            }),

            // ── Single result ────────────────────────────────────────────────
            !sessionPack && h('div', null,

            // ── Result card: name, aspects, skills ──────────────────────────
            h('div', {className: resultAnim ? 'result-card-appear' : ''},
              h(ResultCard, {result: result, gen: gen})
            ),

            // ── Full generator content: card view or dossier ─────────────────
            result && (cardView
              ? h('div', {key: result._ts || result.genId},
                  renderCard(result.genId, result.data, campId,
                    function(patch) { if (patch && patch._pin) { pinResult(); } },
                    t.stunts,
                    function(targetGenId) { selectGen(targetGenId); setTimeout(doGenerate, 80); }
                  ))
              : h('div', {key: (result._ts || result.genId) + '-d'},
                  renderResult(result.genId, result.data, null, t.stunts, function(targetGenId) {
                    selectGen(targetGenId);
                    setTimeout(doGenerate, 80);
                  }))),

            // ── UX-10: What next? guidance strip ────────────────────────────
            result && pinnedCards.length < 5 && (function() {
              var NEXT = {
                npc_minor:  [{id:'scene',label:'Scene'},     {id:'seed',label:'Seed'},      {id:'compel',label:'Compel'}],
                npc_major:  [{id:'scene',label:'Scene'},     {id:'faction',label:'Faction'},{id:'seed',label:'Seed'}],
                seed:       [{id:'faction',label:'Faction'},{id:'scene',label:'Scene'},     {id:'npc_major',label:'Major NPC'}],
                scene:      [{id:'npc_minor',label:'Minor NPC'},{id:'encounter',label:'Encounter'},{id:'compel',label:'Compel'}],
                faction:    [{id:'npc_major',label:'Major NPC'},{id:'seed',label:'Seed'},   {id:'complication',label:'Complication'}],
                encounter:  [{id:'scene',label:'Scene'},     {id:'npc_major',label:'Major NPC'},{id:'consequence',label:'Consequence'}],
                compel:     [{id:'npc_minor',label:'Minor NPC'},{id:'scene',label:'Scene'}, {id:'seed',label:'Seed'}],
                consequence:[{id:'scene',label:'Scene'},     {id:'compel',label:'Compel'},  {id:'npc_minor',label:'Minor NPC'}],
                campaign:   [{id:'faction',label:'Faction'},{id:'seed',label:'Seed'},       {id:'npc_major',label:'Major NPC'}],
                backstory:  [{id:'npc_major',label:'Major NPC'},{id:'compel',label:'Compel'},{id:'scene',label:'Scene'}],
                obstacle:   [{id:'scene',label:'Scene'},     {id:'encounter',label:'Encounter'},{id:'countdown',label:'Countdown'}],
                countdown:  [{id:'faction',label:'Faction'},{id:'seed',label:'Seed'},       {id:'obstacle',label:'Obstacle'}],
                challenge:  [{id:'scene',label:'Scene'},     {id:'npc_major',label:'Major NPC'},{id:'consequence',label:'Consequence'}],
                contest:    [{id:'scene',label:'Scene'},     {id:'compel',label:'Compel'},  {id:'npc_minor',label:'Minor NPC'}],
                complication:[{id:'scene',label:'Scene'},    {id:'npc_minor',label:'Minor NPC'},{id:'compel',label:'Compel'}],
                constraint: [{id:'scene',label:'Scene'},     {id:'encounter',label:'Encounter'},{id:'countdown',label:'Countdown'}],
              };
              var suggestions = NEXT[result.genId];
              if (!suggestions) return null;
              return h('div', {className: 'what-next-strip'},
                h('span', {className: 'what-next-label'}, 'Try next:'),
                suggestions.map(function(s) {
                  return h('button', {
                    key: s.id,
                    className: 'what-next-pill',
                    onClick: function() { selectGen(s.id); setTimeout(doGenerate, 80); },
                    title: 'Roll a ' + s.label,
                  }, s.label);
                })
              );
            })(),

            // ── Inspire mode ─────────────────────────────────────────────────
            inspireMode && inspireResults.length > 0 && h('div', {className: 'inspire-wrap'},
              h('div', {className: 'inspire-header'},
                h('span', {className: 'lbl'}, '✦ Inspiration Mode - pick one'),
                h('button', {
                  className: 'btn btn-ghost',
                  onClick: doInspire,
                  disabled: rolling,
                  style: {fontSize: 12, padding: '2px 10px', minHeight: 0},
                }, '↺ Reroll all')
              ),
              h('div', {className: 'inspire-grid'},
                inspireResults.map(function(data, i) {
                  var title = data.name || data.title || data.type || gen.label;
                  var sub   = data.high_concept || data.aspect || data.situation || data.core_aspect || '';
                  var ghostClass = inspireChosen !== null && inspireChosen !== i ? ' inspire-ghost' : '';
                  var chosenClass = inspireChosen === i ? ' inspire-chosen' : '';
                  return h('button', {
                    key: i,
                    className: 'inspire-card' + ghostClass + chosenClass,
                    onClick: function() { if (inspireChosen === null) pickInspireResult(data); },
                    'aria-label': 'Pick option ' + (i + 1),
                  },
                    h('div', {className: 'inspire-card-num'}, i + 1),
                    h('div', {className: 'inspire-card-title'}, title),
                    sub && h('div', {className: 'inspire-card-sub'}, sub)
                  );
                })
              )
            ),

            // ── Empty state (no result yet) ──────────────────────────────────
            !result && !rolling && !inspireMode && h('div', {
              style: {display:'flex',flexDirection:'column',alignItems:'center',
                      justifyContent:'center',padding:'48px 20px',gap:12,textAlign:'center'}
            },
              h('div', {style:{fontSize:36,opacity:.35}}, gen.icon),
              h('div', {style:{fontSize:'var(--text-lg)',fontWeight:700,color:'var(--text)',opacity:.7}}, gen.label),
              h('div', {style:{fontSize:'var(--text-sm)',color:'var(--text-muted)'}}, gen.sub || ''),
              h('div', {style:{fontSize:'var(--text-label)',color:'var(--text-muted)',marginTop:8}},
                'Press ',
                h('kbd', {style:{background:'var(--panel)',border:'1px solid var(--border-mid)',
                  borderRadius:4,padding:'1px 6px',fontSize:11}}, 'Space'),
                ' or Roll to generate'
              ),
              // P-06: Quick Adventure Start Pack hero button
              h('button', {
                className: 'btn btn-ghost',
                onClick: function() { doFullSession(); },
                disabled: packRolling || rolling,
                style: {marginTop:12,fontSize:13,padding:'8px 18px',gap:6,
                        display:'flex',alignItems:'center',
                        border:'1px solid color-mix(in srgb,var(--accent) 40%,transparent)',
                        borderRadius:'var(--glass-radius-sm)'},
              },
                h('span', null, h(RaIcon, {n: 'play_intro'})),
                h('span', null, 'Quick Adventure Start Pack — seed + scene + NPC')
              )
            ),

            // ── Option E: Result Help Panel (bottom sheet) ─────────
            result && h(ResultHelpPanel, {
              genId: activeGen,
              checks: checklistState, setChecks: setChecklistState,
            })
            )   // close !sessionPack wrapper
          )     // close result-panel.class
        )       // close result-panel id
      )         // close main-layout
    ),          // close main (!prepView && h('main'...)); separator before history panel

    // ── History & Pinned slide-over panel ─────────────────────────────
    showHistory && h('div', {className: 'hist-overlay', onClick: function() { setShowHistory(false); }, 'aria-hidden': 'true'}),
    showHistory && h('div', {className: 'hist-panel'},
      h('div', {className: 'hist-panel-header'},
        h('span', {style: {fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)'}}, '\uD83D\uDCCB Table Prep'),
        h('button', {
          className: 'btn btn-icon btn-ghost',
          'aria-label': 'Close Table Prep panel',
          onClick: function() { setShowHistory(false); },
          'aria-label': 'Close history panel',
          style: {fontSize: 18, padding: '4px 8px'},
        }, '✕')
      ),
      // Session pack — copy all kept results as a single Markdown doc
      pinnedCards.length > 0 && h('button', {
        className: 'btn btn-ghost',
        onClick: function() {
          var header = '# ' + camp.meta.name + ' - Session Pack\n_Generated ' + new Date().toLocaleDateString() + ' · ' + pinnedCards.length + ' saved results_\n\n';
          var body = pinnedCards.map(function(c, i) {
            return '## ' + (i + 1) + '. ' + (c.data.name || c.data.title || c.genId) + '\n' + toMarkdown(c.genId, c.data, camp.meta.name);
          }).join('\n\n---\n\n');
          var md = header + body;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(md).then(function() {
              setToast('Session pack copied - ' + pinnedCards.length + ' results');
            });
          } else {
            setResult({genId: pinnedCards[0].genId, data: pinnedCards[0].data, _batchMd: md});
            setShowExport(true);
            setShowHistory(false);
          }
        },
        style: {width: '100%', marginBottom: 4, justifyContent: 'center', fontSize: 'var(--text-sm)'},
        'aria-label': 'Copy all saved results as Markdown',
      }, '📋 Copy Session Pack (' + pinnedCards.length + ')'),

      // ── Batch Markdown: save as .md file ────────────────────────────────
      pinnedCards.length > 0 && h('button', {
        className: 'btn btn-ghost',
        onClick: function() {
          var header = '# ' + camp.meta.name + ' — Session Pack\n_Generated ' + new Date().toLocaleDateString() + ' · ' + pinnedCards.length + ' results_\n\n';
          var body = pinnedCards.map(function(card, i) {
            return '## ' + (i + 1) + '. ' + (card.data.name || card.data.title || card.genId) + '\n' + toMarkdown(card.genId, card.data, camp.meta.name);
          }).join('\n\n---\n\n');
          var md = header + body;
          var blob = new Blob([md], {type: 'text/markdown;charset=utf-8'});
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = camp.meta.name.replace(/\s+/g, '-').toLowerCase() + '-session.md';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function() { URL.revokeObjectURL(url); }, 60000);
          setToast('💾 Saved session pack as .md');
        },
        style: {width: '100%', marginBottom: 4, justifyContent: 'center', fontSize: 'var(--text-sm)'},
        'aria-label': 'Download all saved results as Markdown file',
        title: 'Save all saved results as a single .md file',
      }, '💾 Save Session Pack .md (' + pinnedCards.length + ')'),

      // ── Ogma JSON: single-file batch export ────────────────────────────
      pinnedCards.length > 0 && h('button', {
        className: 'btn btn-ghost',
        onClick: function() {
          var json = toBatchOgmaJSON(pinnedCards, camp.meta.name, campId);
          if (!json) { setToast('Nothing to export'); return; }
          var blob = new Blob([json], {type: 'application/json;charset=utf-8'});
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = camp.meta.name.replace(/\s+/g, '-').toLowerCase() + '-session.ogma.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function() { URL.revokeObjectURL(url); }, 60000);
          setToast('⬇ Saved — ' + pinnedCards.length + ' results as .ogma.json');
          setShowHistory(false);
        },
        style: {width: '100%', marginBottom: 4, justifyContent: 'center', fontSize: 'var(--text-sm)'},
        'aria-label': 'Export all saved results as Ogma JSON file',
        title: 'Download all saved results as a single .ogma.json file — re-import anytime',
      }, '{ } Export Ogma JSON (' + pinnedCards.length + ')'),

      // ── Ogma JSON: import from file ───────────────────────────────────
      h('label', {
        className: 'btn btn-ghost',
        style: {width: '100%', marginBottom: 8, justifyContent: 'center', fontSize: 'var(--text-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6},
        title: 'Import an .ogma.json file — loads single result or batch into your session',
        'aria-label': 'Import Ogma JSON file',
      },
        '📂 Import Ogma JSON',
        h('input', {
          type: 'file', accept: '.json,.ogma.json',
          style: {display: 'none'},
          onChange: function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(ev) {
              var parsed = (typeof parseOgmaJSON !== 'undefined') ? parseOgmaJSON(ev.target.result) : null;
              if (!parsed) {
                setToast('⚠ Not a valid Ogma JSON file');
                return;
              }
              if (parsed.type === 'single') {
                setResult({genId: parsed.generator, data: parsed.data});
                setActiveGen(parsed.generator);
                setActiveGroup(groupForGen(parsed.generator));
                setShowHistory(false);
                setToast('✓ Imported ' + parsed.generator.replace(/_/g,' ') + ' result');
              } else if (parsed.type === 'batch') {
                var ts = Date.now();
                var imported = 0;
                parsed.results.forEach(function(r, i) {
                  var card = {
                    id: String(ts + i),
                    campId: campId,
                    genId: r.generator,
                    label: r.label || r.generator,
                    data: r.data,
                    ts: r.ts || ts,
                  };
                  setPinnedCards(function(prev) { return [card].concat(prev); });
                  DB.saveCard(campId, card).catch(function(err) { console.warn('[Ogma] history import save failed:', err); });
                  imported++;
                });
                setShowHistory(false);
                setToast('✓ Imported ' + imported + ' result' + (imported !== 1 ? 's' : '') + ' to session');
              }
            };
            reader.readAsText(file);
            e.target.value = '';
          },
        })
      ),

      /* FARI_VAULT_PARKED 2026.03.154
      // Fari / Foundry batch export — parked, see ROADMAP.md parking lot
      */
      // Pinned section — full card content view
      pinnedCards.length > 0 && h('div', {style: {marginBottom: 16}},
        h('div', {className: 'history-label'}, '\uD83D\uDCCB Your session (' + pinnedCards.length + ')'),
        h('div', {style: {display:'flex', flexDirection:'column', gap:6, marginTop:4}},
          pinnedCards.map(function(card) {
            var d = card.data || {};
            var genMeta = (GENERATORS||[]).find(function(g){return g.id===card.genId;})||{};
            var hcHelp = HELP_CONTENT && HELP_CONTENT[card.genId] ? HELP_CONTENT[card.genId] : {};
            var typeName = hcHelp.title || genMeta.label || card.genId;
            var icon = genMeta.icon || '\u25C8';
            // Derive 2-3 key content lines from data
            var lines = [];
            var name = d.name||d.location||d.situation||d.contest_type||d.aspect||d.hook||d.new_aspect||'';
            if(name && name !== card.label) lines.push({t:'title', v:name});
            if(d.aspects && d.aspects.high_concept) lines.push({t:'hc', v:d.aspects.high_concept});
            else if(Array.isArray(d.aspects) && d.aspects[0]) lines.push({t:'hc', v:d.aspects[0].name||d.aspects[0]});
            if(d.aspects && d.aspects.trouble) lines.push({t:'tr', v:d.aspects.trouble});
            if(d.goal) lines.push({t:'hc', v:d.goal});
            if(d.objective) lines.push({t:'hc', v:d.objective});
            if(d.complication) lines.push({t:'tr', v:d.complication});
            if(d.situation) lines.push({t:'tr', v:d.situation});
            if(d.current && d.current.name) lines.push({t:'hc', v:'\u26A1 '+d.current.name});
            if(d.impending && d.impending.name) lines.push({t:'tr', v:'\uD83C\uDF11 '+d.impending.name});
            if(d.desc) lines.push({t:'dim', v:d.desc.slice(0,80)+(d.desc.length>80?'\u2026':'')});
            lines = lines.slice(0,3);
            return h('div', {
              key: card.id,
              style: {background:'var(--inset)',border:'1px solid var(--border)',borderRadius:7,
                      padding:'7px 9px',display:'flex',flexDirection:'column',gap:3}
            },
              h('div', {style: {display:'flex',alignItems:'center',gap:5,marginBottom:2}},
                h('span', {style: {fontSize:8,fontWeight:800,letterSpacing:'.08em',textTransform:'uppercase',
                                   color:'var(--accent)',background:'color-mix(in srgb,var(--accent) 10%,transparent)',
                                   padding:'1px 5px',borderRadius:3,flexShrink:0}}, icon+' '+typeName),
                h('span', {
                  style: {flex:1,fontSize:11,fontWeight:700,color:'var(--text)',
                          overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                          cursor:'pointer'},
                  onClick: function() { restoreCard(card); setShowHistory(false); },
                  title: 'Restore: ' + card.label,
                }, card.label),
                h('button', {
                  style: {flexShrink:0,background:'none',border:'none',cursor:'pointer',
                          color:'var(--text-muted)',fontSize:12,padding:'0 3px',lineHeight:1},
                  onClick: function() { DB.exportCard({genId:card.genId,label:card.label,data:card.data,state:card.state||null,ts:card.ts},camp.meta?camp.meta.name:campId); },
                  title:'Export as JSON','aria-label':'Export '+card.label,
                }, '\u2193'),
                h('button', {
                  style: {flexShrink:0,background:'none',border:'none',cursor:'pointer',
                          color:'var(--text-muted)',fontSize:13,padding:'0 2px',lineHeight:1},
                  onClick: function() { unpinCard(card.id); },
                  title:'Remove from Table Prep','aria-label':'Remove '+card.label,
                }, '\u2715')
              ),
              lines.map(function(l,i){
                var col = l.t==='hc'?'var(--text)':l.t==='tr'?'var(--c-red)':'var(--text-dim)';
                var style = {fontSize:10,color:col,lineHeight:1.4,
                             overflow:'hidden',textOverflow:'ellipsis',
                             display:'-webkit-box',WebkitLineClamp:1,WebkitBoxOrient:'vertical'};
                if(l.t==='hc') style.fontWeight=600;
                if(l.t==='tr') style.fontStyle='italic';
                return h('div',{key:i,style:style},l.v);
              })
            );
          })
        )
      ),
      // Recent history section
      history.length > 0 && h('div', null,
        h('div', {className: 'history-label'}, 'Recent'),
        h('div', {className: 'drawer-items'},
          history.map(function(item, i) {
            return h('button', {
              key: i,
              className: 'history-item',
              onClick: function() { setResult({genId: item.genId, data: item.data}); setActiveGen(item.genId); setActiveGroup(groupForGen(item.genId)); setShowHistory(false); },
              title: 'Restore this result',
            },
              (item.gen ? item.gen.icon + ' ' : '') +
              (item.data.name || item.data.contest_type || (item.data.current && item.data.current.name) ||
               (item.data.stunts ? 'Stunts' : null) ||
               (item.data.aspects ? 'Scene' : null) ||
               (item.data.opposition ? 'Encounter' : null) || '-')
            );
          })
        )
      ), // close showHistory panel
      // Empty state
      (history.length === 0 && pinnedCards.length === 0) && h('div', {
        style: {textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 'var(--text-sm)'}
      }, 'Roll a generator to start building history.')
      ), // close content-panel children
      ), // close content-panel
    ), // close app-body

    // ── Toast notification ───────────────────────────────────────────
    toast && h('div', {className: 'toast'}, toast),

    // ── WS-06: SW update — persistent top-bar banner ─────────────────
    updateAvailable && h('div', {
      className: 'pwa-banner pwa-banner-update',
      role: 'alert',
      'aria-live': 'assertive',
    },
      h('span', {className: 'pwa-banner-icon', 'aria-hidden': 'true'}, '🔄'),
      h('span', {className: 'pwa-banner-msg'}, 'A new version of Ogma is ready.'),
      h('button', {
        className: 'pwa-banner-action',
        onClick: function() { window.location.reload(); },
      }, 'Update now'),
      h('button', {
        className: 'pwa-banner-dismiss',
        onClick: function() { setUpdateAvailable(false); },
        'aria-label': 'Dismiss update notification',
      }, '✕')
    ),

    // ── WS-07: Safari 7-day storage warning ──────────────────────────
    showSafariWarn && !showIosInstall && h('div', {
      className: 'pwa-banner pwa-banner-warn',
      role: 'status',
      'aria-live': 'polite',
    },
      h('span', {className: 'pwa-banner-icon', 'aria-hidden': 'true'}, '⚠️'),
      h('span', {className: 'pwa-banner-msg'}, 'Safari clears storage after 7 days. Install Ogma to keep your session.'),
      h('button', {
        className: 'pwa-banner-dismiss',
        onClick: function() {
          setShowSafariWarn(false);
          try { LS.set('safari_warn_dismissed', true); } catch(e) {}
        },
        'aria-label': 'Dismiss storage warning',
      }, '✕')
    ),

    // ── WS-07: iOS A2HS install nudge ────────────────────────────────
    showIosInstall && h('div', {
      className: 'pwa-banner pwa-banner-ios',
      role: 'status',
      'aria-live': 'polite',
    },
      h('span', {className: 'pwa-banner-icon', 'aria-hidden': 'true'}, '📲'),
      h('span', {className: 'pwa-banner-msg'},
        'Add to Home Screen for offline use: tap ',
        h('span', {'aria-label': 'Share button'}, '⎙'),
        ' → Add to Home Screen'
      ),
      h('button', {
        className: 'pwa-banner-dismiss',
        onClick: function() {
          setShowIosInstall(false);
          setShowSafariWarn(false);
          try { LS.set('ios_install_dismissed', true); LS.set('safari_warn_dismissed', true); } catch(e) {}
        },
        'aria-label': 'Dismiss install prompt',
      }, '✕')
    ),

    // ── Modals ────────────────────────────────────────────────────────
    showKbShortcuts && h(KBShortcutsModal, {onClose: function() { setShowKbShortcuts(false); }}),

    // WS-12: Quick Find
    showQuickFind && h(QuickFind, {
      campId: campId,
      onClose: function() { setShowQuickFind(false); },
      onSelectGen: selectGen,
    }),
    showTables && h(TableManagerModal, {
      tables: t,
      prefs: prefs,
      activeGen: activeGen,
      universalMerge: universalMerge,
      onPrefsChange: function(newPrefs) { setPrefs(newPrefs); },
      onClose: function() { setShowTables(false); },
    }),
    showSettings && h(SettingsModal, {
      theme: theme,
      textSize: textSize,
      helpLevel: helpLevel,
      universalMerge: universalMerge,
      onToggleTheme: toggleTheme,
      onToggleTextSize: toggleTextSize,
      onSetHelpLevel: changeHelpLevel,
      onToggleUniversal: toggleUniversalMerge,
      onClose: function() { setShowSettings(false); },
    }),
    showVault && h(VaultModal, {
      campId: campId,
      campName: camp.meta ? camp.meta.name : campId,
      pinnedCards: pinnedCards,
      showToast: showToast,
      onLoad: function(session) {
        if (session && session.cards && session.cards.length > 0) {
          var loaded = session.cards.map(function(c) {
            return {
              id: c.id || ('vault_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)),
              genId: c.genId, label: c.label || '', data: c.data, state: c.state || null,
              ts: c.ts || Date.now(),
            };
          });
          setPinnedCards(function(prev) { return loaded.concat(prev); });
          if (loaded[0]) {
            setActiveGen(loaded[0].genId);
            setResult({genId: loaded[0].genId, data: loaded[0].data});
          }
          showToast('Loaded ' + loaded.length + ' card' + (loaded.length === 1 ? '' : 's') + ' from "' + (session.name || 'Session') + '"');
        }
      },
      onClose: function() { setShowVault(false); },
    }),

    // Fate Point / Milestone / Initiative panel
    showFP && h(Floater, {
      id: 'fp',
      floaterId: 'floater-fp',
      triggerId: 'sidebar-btn-fp',
      title: 'Fate Tools',
      icon: '◎',
      width: 300,
      defaultX: typeof window !== 'undefined' ? Math.max(8, window.innerWidth - 316) : 200,
      defaultY: 60,
      onClose: function() { setShowFP(false); },
    },
      h(FatePointTracker, {
        state: fpState || DEFAULT_FP_STATE,
        onUpdate: updateFP,
        onClose: function() { setShowFP(false); },
        partySize: partySize,
        lastEncounter: (result && result.genId === 'encounter') ? result.data : null,
      })
    ),

    // UX-12: Countdown Tracker panel
    showCD && h(Floater, {
      id: 'cd',
      floaterId: 'floater-cd',
      triggerId: 'sidebar-btn-cd',
      title: 'Countdown Tracker',
      icon: '⏱',
      width: 300,
      defaultX: typeof window !== 'undefined' ? Math.max(8, window.innerWidth - 336) : 180,
      defaultY: 80,
      onClose: function() { setShowCD(false); },
    },
      h(CountdownTracker, {
        campId: campId,
        lastCountdown: (result && result.genId === 'countdown') ? result.data : null,
        onClose: function() { setShowCD(false); },
      })
    ),

    // IDEA-06: Session Notes panel
    showDoc && h(Floater, {
      id: 'doc',
      floaterId: 'floater-doc',
      triggerId: 'sidebar-btn-doc',
      title: 'Session Notes',
      icon: '📝',
      width: 340,
      defaultX: typeof window !== 'undefined' ? Math.max(8, window.innerWidth - 356) : 160,
      defaultY: 100,
      onClose: function() { setShowDoc(false); },
    },
      h(SessionDoc, {
        campId: campId,
        onClose: function() { setShowDoc(false); },
      })
    ),

    // PWA install nudge — shown after 2nd visit if installable and not dismissed
    showPwaNudge && h('div', {
      style: {
        position: 'fixed', bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))', left: '50%', transform: 'translateX(-50%)',
        zIndex: 1200, display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12,
        boxShadow: 'var(--glass-shadow)',
        padding: '10px 14px', maxWidth: 340, width: 'calc(100vw - 32px)',
      },
      role: 'status', 'aria-live': 'polite',
    },
      h('span', {style: {fontSize: 20}}, '📲'),
      h('span', {style: {flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 1.4}},
        'Install Ogma for offline use - works without internet'
      ),
      h('button', {
        onClick: installPwa,
        className: 'btn btn-ghost',
        style: {fontSize: 12, padding: '4px 10px', minHeight: 0, whiteSpace: 'nowrap'},
      }, 'Install'),
      h('button', {
        onClick: function() {
          setShowPwaNudge(false);
          try { LS.set('pwa_nudge_dismissed', true); } catch(e) {}
        },
        style: {background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16, padding: '0 2px', lineHeight: 1},
        'aria-label': 'Dismiss install prompt',
      }, '✕')
    ),

    // Sticky Roll FAB — mobile only, appears when Roll button scrolls off-screen
    showFAB && h('button', {
      className: 'roll-fab',
      onClick: doGenerate,
      disabled: rolling,
      'aria-label': 'Roll ' + gen.label,
      title: 'Roll ' + gen.label,
    }, rolling ? '…' : '🎲'),

    // License footer - last item in content-panel; always visible without opening sidebar
    h('footer', {className: 'camp-content-footer'},
      'Fate\u2122 trademark of Evil Hat Productions, LLC. D&D\u00ae trademark of Wizards of the Coast LLC. Released under CC BY 3.0. \u00b7 ',
      h('a', {href: '../license.html', className: 'camp-content-footer-link'}, 'Full Attribution'),
      ' \u00b7 ',
      /* FARI_FOOTER_PARKED 2026.03.154 */ // h('a', {href: 'https://fari.app/', ...}, 'Fari App'),
      ' \u00b7 ',
      h('a', {href: 'https://fate-srd.com/', target: '_blank', rel: 'noreferrer', className: 'camp-content-footer-link'}, 'fate-srd.com')
    ),

  ); // close app-shell
}

