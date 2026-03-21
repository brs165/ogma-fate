// ui-modals.js — Modal primitive, ShareDrawer, KBShortcuts, Help, Settings, Vault
// Depends on: ui-primitives.js (h, useState, useEffect, useRef, Fragment)
// MODAL PRIMITIVE
// ════════════════════════════════════════════════════════════════════════

function Modal(props) {
  const boxRef = useRef(null);
  const triggerRef = useRef(null);

  // Save the element that opened the modal so focus returns on close
  useEffect(function() {
    triggerRef.current = document.activeElement;
    return function() {
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, []);

  // Close on Escape
  useEffect(function() {
    function onKeyDown(e) { if (e.key === 'Escape') props.onClose(); }
    document.addEventListener('keydown', onKeyDown);
    return function() { document.removeEventListener('keydown', onKeyDown); };
  }, [props.onClose]);

  // Focus trap - WCAG 2.1 SC 2.1.2
  // On mount: find all focusable children, auto-focus the first.
  // Tab/Shift+Tab cycles within the modal; focus cannot escape to background content.
  useEffect(function() {
    const box = boxRef.current;
    if (!box) return;
    const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const nodes = Array.prototype.slice.call(box.querySelectorAll(FOCUSABLE));
    if (nodes.length) nodes[0].focus();
    function trapTab(e) {
      if (e.key !== 'Tab') return;
      const live = Array.prototype.slice.call(box.querySelectorAll(FOCUSABLE));
      if (!live.length) { e.preventDefault(); return; }
      const first = live[0]; const last = live[live.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', trapTab);
    return function() { document.removeEventListener('keydown', trapTab); };
  }, []);

  return h('div', {
    className: 'modal-overlay',
    onClick: props.onClose,
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': props.ariaLabel || 'Dialog',
  },
    h('div', {
      ref: boxRef,
      className: 'modal-box ' + (props.wide ? 'modal-box-wide' : 'modal-box-narrow'),
      onClick: function(e) { e.stopPropagation(); },
    }, props.children)
  );
}

// ════════════════════════════════════════════════════════════════════════
// EXPORT MODAL
// ════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════
// SHARE DRAWER — inline expand below panel toolbar
// ════════════════════════════════════════════════════════════════════════

function ShareDrawer(props) {
  const genId   = props.genId;
  const data    = props.data;
  const campName = props.campName;
  const campId  = props.campId || '';
  const onCopyLink = props.onCopyLink;
  const [copiedFormat, setCopiedFormat] = useState(null);

  // _batchMd is set when exporting a full pinned session pack via old-browser fallback
  const md       = (data && data._batchMd) ? data._batchMd : toMarkdown(genId, data, campName);
  const ogmaJson = toOgmaJSON(genId, data, campName, campId);

  function copyTo(text, format) {
    if (!text) return;
    function confirm() {
      setCopiedFormat(format);
      setTimeout(function() { setCopiedFormat(null); }, TIMING.COPY_CONFIRM_MS);
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(confirm);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      confirm();
    }
  }

  function downloadMd() {
    const blob = new Blob([md], {type: 'text/markdown;charset=utf-8'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = (campName || 'ogma').replace(/\s+/g, '_') + '_' + genId + '.md';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  function downloadOgma() {
    const blob = new Blob([ogmaJson], {type: 'application/json;charset=utf-8'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = (campName || 'ogma').replace(/\s+/g, '_') + '_' + genId + '.ogma.json';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  return h('div', {
    className: 'share-drawer',
    role: 'region',
    'aria-label': 'Export options',
    style: { borderTop: '1px solid var(--border)', background: 'var(--inset)', padding: '10px 16px' }
  },
    // ── Row 1: Copy Link + Markdown + print ───────────────────────────────────
    h('div', {style: {display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8}},
      h('span', {className: 'section-cap'}, 'Markdown'),
      h('button', {
        className: 'btn-xs' + (copiedFormat === 'md' ? ' export-copied' : ''),
        onClick: function() { copyTo(md, 'md'); },
        'aria-label': copiedFormat === 'md' ? 'Copied to clipboard' : 'Copy as Markdown',
      }, copiedFormat === 'md' ? '✓ Copied!' : '📋 Copy'),
      h('button', {
        className: 'btn-xs',
        onClick: downloadMd,
        title: 'Save as .md file',
        'aria-label': 'Download as Markdown file',
      }, h(FaFileArrowDownIcon, {size: 12}), ' Save .md'),
      h('button', {
        className: 'btn-xs',
        onClick: function() { window.print(); },
        title: 'Print or save as PDF',
        'aria-label': 'Print or save as PDF',
      }, '🖨 Print'),
      h('button', {
        className: 'btn btn-icon btn-ghost',
        onClick: props.onClose,
        'aria-label': 'Close export options',
        style: {marginLeft: 'auto', fontSize: 13},
      }, '✕')
    ),

    // ── Row 2: Ogma JSON export ────────────────────────────────────────
    h('div', {style: {display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--border)'}},
      h('span', {className: 'section-cap'}, 'Ogma JSON'),
      h('button', {
        className: 'btn-xs' + (copiedFormat === 'ogma' ? ' export-copied' : ''),
        onClick: function() { copyTo(ogmaJson, 'ogma'); },
        title: 'Copy as Ogma JSON — re-import in any Ogma campaign',
        'aria-label': copiedFormat === 'ogma' ? 'Copied to clipboard' : 'Copy as Ogma JSON',
      }, copiedFormat === 'ogma' ? '✓ Copied!' : '{ } Copy JSON'),
      h('button', {
        className: 'btn-xs',
        onClick: downloadOgma,
        title: 'Save as .ogma.json file — import later in Ogma',
        'aria-label': 'Download as Ogma JSON file',
      }, h(FaFileArrowDownIcon, {size: 12}), ' Save .ogma.json'),
      h('span', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)', fontStyle: 'italic', marginLeft: 4}},
        'Re-importable in Ogma'
      )
    )

    /* FARI_VTT_ROW_PARKED 2026.03.154 — restore from git/zip if needed
    // VTT exports — Fari App / Foundry (NPC generators only)
    // Parked: see ROADMAP.md parking lot for revisit date.
    */
  );
}

// ════════════════════════════════════════════════════════════════════════
// HELP MODAL
// ════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════
// KB SHORTCUTS MODAL
// ════════════════════════════════════════════════════════════════════════

function KBShortcutsModal(props) {
  const shortcuts = [
    ['Space', 'Roll current generator'],
    ['/',     'Quick Find — search generators, worlds, help'],
    ['G',     'Cycle to next generator'],
    ['P',     'Pin current result'],
    ['L',     'Copy shareable link for this result'],
    ['Z',     'Undo last pin'],
    ['I',     'Inspiration mode - roll 3, pick one'],
    ['C',     'Copy result as Markdown'],
    ['?',     'Open this shortcuts panel'],
    ['Esc',   'Close any open panel or sidebar'],
  ];
  return h(Modal, {onClose: props.onClose, ariaLabel: 'Keyboard shortcuts', label: 'Keyboard shortcuts'},
    h(ModalHeader, {title: 'KB Shortcuts', onClose: props.onClose}),
    h('div', {className: 'modal-body'},
      h('div', {className: 'kbd-grid', style: {marginTop: 4}},
        shortcuts.map(function(row) {
          return h('div', {key: row[0], className: 'kbd-row'},
            h('kbd', {className: 'kbd-key'}, row[0]),
            h('span', {className: 'kbd-desc'},
              row[1],
              row[2] && h('a', {
                href: row[2], target: '_blank', rel: 'noopener',
                className: 'kbd-sub-link',
                style: {display:'block', fontSize:'var(--text-label)', color:'var(--accent)',
                        marginTop:4, textDecoration:'none'},
                onClick: function(e) { e.stopPropagation(); },
              }, '↗ Open')
            )
          );
        })
      )
    )
  );
}


// ════════════════════════════════════════════════════════════════════════
// SETTINGS MODAL
// ════════════════════════════════════════════════════════════════════════

function ToggleSwitch(props) {
  const on = !!props.value;
  return h('button', {
    onClick: props.onToggle,
    'aria-pressed': String(on),
    'aria-label': props.label || '',
    style: {
      width: 50, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
      background: on ? 'var(--accent)' : 'var(--border-mid)',
      position: 'relative', flexShrink: 0, transition: 'background 0.2s',
    },
  },
    h('div', {style: {
      width: 22, height: 22, borderRadius: '50%', background: '#fff',
      position: 'absolute', top: 3,
      left: on ? 25 : 3,
      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    }})
  );
}

function SettingsRow(props) {
  return h('div', {style: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
    borderBottom: '1px solid var(--border)',
  }},
    h('div', {style: {flex: 1}},
      h('div', {style: {fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)'}}, props.title),
      props.desc && h('div', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 2}}, props.desc)
    ),
    props.children
  );
}

// ════════════════════════════════════════════════════════════════════════
// VAULT MODAL — named session save/load/browse/delete/export/import
// P-01b, P-02, P-04
// ════════════════════════════════════════════════════════════════════════

function VaultModal(props) {
  const campId = props.campId;
  const campName = props.campName || campId;
  const pinnedCards = props.pinnedCards || [];
  const onLoad = props.onLoad;
  const onClose = props.onClose;
  const showToast = props.showToast;

  const [sessions, setSessions] = useState(null);
  const [saveName, setSaveName] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  function refresh() {
    DB.vaultList().then(function(all) {
      // Show all sessions, sorted by most recent; optionally filter by campaign
      setSessions(all);
    });
  }
  useEffect(function() { refresh(); }, []);

  function handleSave() {
    if (!saveName.trim()) return;
    setSaving(true);
    var session = {
      name: saveName.trim(),
      campaign: campId,
      cards: pinnedCards.map(function(c) {
        return { genId: c.genId, label: c.label || '', data: c.data, state: c.state || null, ts: c.ts };
      }),
    };
    DB.vaultSave(session).then(function() {
      setSaveName('');
      setSaving(false);
      refresh();
      if (showToast) showToast('Session saved');
    });
  }

  function handleLoad(session) {
    if (onLoad) onLoad(session);
    onClose();
  }

  function handleDelete(id) {
    DB.vaultDelete(id).then(function() {
      setConfirmId(null);
      refresh();
      if (showToast) showToast('Session deleted');
    });
  }

  function handleExportSession(session) {
    DB.exportSession(session);
  }

  function handleExportCard(card) {
    DB.exportCard(card, campName);
  }

  function handleImport() {
    DB.importFile().then(function(data) {
      if (data.type === 'session' && data.session) {
        return DB.vaultSave(data.session).then(function() {
          refresh();
          if (showToast) showToast('Session imported');
        });
      } else if (data.type === 'card' && data.card) {
        if (onLoad) onLoad({
          name: 'Imported card',
          campaign: data.campaign || campId,
          cards: [data.card],
        });
        onClose();
      } else {
        if (showToast) showToast('Unrecognised file format');
      }
    }).catch(function(err) {
      if (showToast) showToast('Import failed: ' + (err.message || 'unknown error'));
    });
  }

  const campSessions = sessions ? sessions.filter((s) => s.campaign === campId) : null;
  const otherSessions = sessions ? sessions.filter((s) => s.campaign !== campId) : null;

  return h(Modal, {onClose: onClose, label: 'Table Prep'},
    h('div', {className: 'modal-box', style: {maxWidth: 520}},
      h('div', {className: 'modal-header'},
        h('div', {className: 'modal-title'}, '📋 Table Prep'),
        h('button', {className: 'btn btn-icon btn-ghost', onClick: onClose, 'aria-label': 'Close'}, '✕')
      ),

      // ── Save current session ──────────────────────────────────────
      h('div', {style: {padding: '14px 20px', borderBottom: '1px solid var(--border)'}},
        h('div', {style: {fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text)', marginBottom: 8}},
          'Save current session' + (pinnedCards.length > 0 ? ' (' + pinnedCards.length + ' pinned card' + (pinnedCards.length === 1 ? '' : 's') + ')' : '')
        ),
        pinnedCards.length === 0
          ? h('div', {style: {fontSize: 12, color: 'var(--text-muted)'}}, 'Save some results first — they will appear here.')
          : h('div', {style: {display: 'flex', gap: 8}},
              h('input', {
                type: 'text',
                value: saveName,
                onChange: function(e) { setSaveName(e.target.value); },
                onKeyDown: function(e) { if (e.key === 'Enter') handleSave(); },
                placeholder: 'Session name…',
                style: {flex: 1, padding: '6px 10px', fontSize: 13, fontFamily: 'var(--font-ui)',
                        borderRadius: 'var(--glass-radius-sm)', border: '1px solid var(--border)',
                        background: 'var(--inset)', color: 'var(--text)'},
              }),
              h('button', {
                className: 'btn btn-ghost',
                onClick: handleSave,
                disabled: saving || !saveName.trim(),
                style: {fontSize: 12, padding: '6px 14px', whiteSpace: 'nowrap'},
              }, saving ? 'Saving…' : 'Save')
            )
      ),

      // ── Import button ─────────────────────────────────────────────
      h('div', {style: {padding: '10px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8}},
        h('button', {
          className: 'btn btn-ghost',
          onClick: handleImport,
          style: {fontSize: 12, padding: '5px 12px'},
        }, h(FaFileArrowUpIcon, {size: 13}), ' Import from file'),
      ),

      // ── Session list ──────────────────────────────────────────────
      h('div', {style: {padding: '10px 20px 20px', maxHeight: 360, overflowY: 'auto'}},
        !sessions && h('div', {style: {color: 'var(--text-muted)', fontSize: 12, padding: '12px 0'}}, 'Loading…'),
        sessions && campSessions && campSessions.length === 0 && (!otherSessions || otherSessions.length === 0) &&
          h('div', {style: {color: 'var(--text-muted)', fontSize: 12, padding: '12px 0'}}, 'No saved sessions yet.'),

        // Current campaign sessions
        campSessions && campSessions.length > 0 && h('div', null,
          h('div', {style: {fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: 'var(--text-muted)', marginBottom: 6, marginTop: 4}}, campName),
          campSessions.map(function(s) {
            return h('div', {key: s.id, className: 'vault-row'},
              h('div', {className: 'vault-row-info', onClick: function() { handleLoad(s); }, style: {cursor: 'pointer'}},
                h('div', {className: 'vault-row-name'}, s.name),
                h('div', {className: 'vault-row-meta'},
                  (s.cards ? s.cards.length : 0) + ' card' + ((s.cards && s.cards.length !== 1) ? 's' : '') +
                  ' · ' + new Date(s.updated || s.created).toLocaleDateString()
                )
              ),
              h('div', {className: 'vault-row-actions'},
                h('button', {className: 'btn btn-ghost vault-btn', onClick: function() { handleExportSession(s); }, title: 'Export JSON'}, '↓'),
                confirmId === s.id
                  ? h('button', {className: 'btn btn-ghost vault-btn vault-btn-danger', onClick: function() { handleDelete(s.id); }}, '✓ Delete')
                  : h('button', {className: 'btn btn-ghost vault-btn', onClick: function() { setConfirmId(s.id); }, title: 'Delete'}, '✕')
              )
            );
          })
        ),

        // Other campaign sessions
        otherSessions && otherSessions.length > 0 && h('div', {style: {marginTop: 16}},
          h('div', {style: {fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: 'var(--text-muted)', marginBottom: 6}}, 'Other worlds'),
          otherSessions.map(function(s) {
            return h('div', {key: s.id, className: 'vault-row'},
              h('div', {className: 'vault-row-info'},
                h('div', {className: 'vault-row-name'}, s.name),
                h('div', {className: 'vault-row-meta'},
                  (s.campaign || 'unknown') + ' · ' +
                  (s.cards ? s.cards.length : 0) + ' card' + ((s.cards && s.cards.length !== 1) ? 's' : '') +
                  ' · ' + new Date(s.updated || s.created).toLocaleDateString()
                )
              ),
              h('div', {className: 'vault-row-actions'},
                h('button', {className: 'btn btn-ghost vault-btn', onClick: function() { handleExportSession(s); }, title: 'Export JSON'}, '↓'),
                confirmId === s.id
                  ? h('button', {className: 'btn btn-ghost vault-btn vault-btn-danger', onClick: function() { handleDelete(s.id); }}, '✓ Delete')
                  : h('button', {className: 'btn btn-ghost vault-btn', onClick: function() { setConfirmId(s.id); }, title: 'Delete'}, '✕')
              )
            );
          })
        )
      )
    )
  );
}

function SettingsModal(props) {
  const TEXT_SIZE_NAMES = ['Default', 'Large', 'Extra Large'];
  const LEVEL_OPTIONS = [
    {id: 'experienced', label: 'Experienced Fate GM', desc: 'Minimal rules - just the generator output'},
    {id: 'new_fate', label: 'New to Fate', desc: 'Full rules explanations with Fate Condensed page references'},
    {id: 'dnd_convert', label: 'Coming from D&D', desc: 'Rules explanations + D&D contrast notes'},
    {id: 'new_ttrpg', label: 'New to TTRPGs', desc: 'Gentle introductions assuming no prior RPG experience'},
  ];
  return h(Modal, {onClose: props.onClose, label: 'Settings'},
    h('div', {className: 'modal-box', style: {maxWidth: 460}},
      h('div', {className: 'modal-header'},
        h('div', {className: 'modal-title'}, '⚙ Settings'),
        h('button', {className: 'btn btn-icon btn-ghost', onClick: props.onClose, 'aria-label': 'Close'}, '✕')
      ),

      // Experience Level - the most important setting
      h('div', {style: {padding: '14px 20px', borderBottom: '1px solid var(--border)'}},
        h('div', {style: {fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text)', marginBottom: 8}}, 'Help Level'),
        h('div', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)', marginBottom: 10}}, 'Adjusts the inline rules reference shown before each roll.'),
        h('div', {style: {display: 'flex', flexDirection: 'column', gap: 6}},
          LEVEL_OPTIONS.map(function(opt) {
            var isActive = props.helpLevel === opt.id;
            return h('button', {
              key: opt.id,
              onClick: function() { props.onSetHelpLevel(opt.id); },
              style: {
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                borderRadius: 'var(--glass-radius-sm)', border: '1px solid',
                borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                background: isActive ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-ui)',
                transition: 'all 0.15s',
              },
            },
              h('div', {style: {
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                border: '2px solid ' + (isActive ? 'var(--accent)' : 'var(--border)'),
                background: isActive ? 'var(--accent)' : 'transparent',
                boxShadow: isActive ? '0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent)' : 'none',
              }}),
              h('div', null,
                h('div', {style: {fontSize: 'var(--text-sm)', fontWeight: 600, color: isActive ? 'var(--text)' : 'var(--text-dim)'}}, opt.label),
                h('div', {className: 'text-label-muted'}, opt.desc)
              )
            );
          })
        )
      ),

      // Theme
      h(SettingsRow, {title: 'Appearance', desc: 'Switch between dark and light mode'},
        h('button', {
          className: 'btn btn-ghost',
          onClick: props.onToggleTheme,
          style: {fontSize: 14, padding: '6px 16px', minHeight: 0},
        }, props.theme === 'dark' ? '☀ Light' : '🌙 Dark')
      ),

      // Text Size
      h(SettingsRow, {title: 'Text Size', desc: 'Currently: ' + TEXT_SIZE_NAMES[props.textSize]},
        h('button', {
          className: 'btn btn-ghost',
          onClick: props.onToggleTextSize,
          style: {fontSize: [14, 16, 18][props.textSize], fontWeight: 800, padding: '6px 16px', minHeight: 0, letterSpacing: '-0.02em'},
        }, ['A', 'A⁺', 'A⁺⁺'][props.textSize])
      ),

      // Generic Tables
      h(SettingsRow, {title: 'Include Generic Fate Tables', desc: 'Mix in setting-agnostic content (obstacles, countdowns, contests, universal stunts, compels) alongside campaign tables'},
        h(ToggleSwitch, {value: props.universalMerge, label: 'Toggle generic tables', onToggle: props.onToggleUniversal})
      ),

      // Links
      h('div', {style: {
        padding: '14px 20px', borderTop: '1px solid var(--border)',
        display: 'flex', gap: 10, flexWrap: 'wrap',
      }},
        h('a', {href: '../help/new-to-ogma.html', className: 'btn btn-ghost btn-nav'}, '📖 Help & Wiki'),
        h('a', {href: '../help/index.html', className: 'btn btn-ghost btn-nav'}, '📖 Help'),
        h('a', {href: '../about.html', className: 'btn btn-ghost btn-nav'}, 'About'),
        h('a', {href: '../license.html', className: 'btn btn-ghost btn-nav'}, 'License')
      )
    )
  );
}



// ════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════
// WS-12: QUICK FIND BAR
// ════════════════════════════════════════════════════════════════════════
function QuickFind(props) {
  var onClose     = props.onClose;
  var onSelectGen = props.onSelectGen;
  var campId      = props.campId;

  const [query,    setQuery]    = useState('');
  const [genOnly,  setGenOnly]  = useState(false);
  const [selected, setSelected] = useState(0);
  var inputRef = useRef(null);

  // INDEX is stable for the lifetime of this QuickFind mount.
  // Previously rebuilt on every keystroke (~31 allocations/keypress). Now memoised.
  var INDEX = useMemo(function() {
    var items = [];

    if (typeof GENERATORS !== 'undefined') {
      GENERATORS.forEach(function(g) {
        items.push({type: 'gen', id: g.id, label: g.label, sub: g.sub || '', icon: g.icon || '🎲',
          action: function() { if (onSelectGen) onSelectGen(g.id); onClose(); }
        });
      });
    }

    var WIKI = [
      {label: 'Learn Fate',       url: '../help/learn-fate.html',       icon: '📖'},
      {label: 'How to Use Ogma',  url: '../help/how-to-use-ogma.html',  icon: '📖'},
      {label: 'D&D Transition',   url: '../help/dnd-transition.html',   icon: '⚔'},
      {label: 'Fate Mechanics',   url: '../help/fate-mechanics.html',   icon: '🎲'},
      {label: 'Generators Guide', url: '../help/generators.html',       icon: '📋'},
      {label: 'Export & Share',   url: '../help/export-share.html',     icon: '📤'},
      {label: 'FAQ',              url: '../help/faq.html',              icon: '❓'},
    ];
    WIKI.forEach(function(w) {
      items.push({type: 'wiki', id: w.label, label: w.label, sub: 'Help & Wiki', icon: w.icon,
        action: function() { window.location.href = w.url; onClose(); }
      });
    });

    var WORLD_LABELS = {
      thelongafter:'The Long After',  cyberpunk:'Neon Abyss',       fantasy:'Shattered Kingdoms',
      space:'Void Runners',           victorian:'Gaslight Chronicles', postapoc:'The Long Road',
      western:'Dust and Iron',        dVentiRealm:'dVenti Realm',
    };
    var WORLD_ICONS = {
      thelongafter:'🌅', cyberpunk:'⬡',  fantasy:'⚔️', space:'🚀',
      victorian:'🎩',    postapoc:'🛣️', western:'🤠', dVentiRealm:'⚔',
    };
    Object.keys(WORLD_LABELS).forEach(function(id) {
      items.push({type: 'world', id: id, label: WORLD_LABELS[id], sub: 'Campaign World', icon: WORLD_ICONS[id] || '🌍',
        action: function() { window.location.href = '../campaigns/' + id + '.html'; onClose(); }
      });
    });
    return items;
  }, [campId]);

  // Fuzzy filter
  function score(item, q) {
    var haystack = (item.label + ' ' + (item.sub || '')).toLowerCase();
    var needle = q.toLowerCase().trim();
    if (!needle) return 1;
    if (haystack.startsWith(needle)) return 3;
    if (haystack.includes(needle)) return 2;
    // partial char match
    var chars = needle.split('');
    var pos = 0;
    for (var c = 0; c < chars.length; c++) {
      var idx = haystack.indexOf(chars[c], pos);
      if (idx === -1) return 0;
      pos = idx + 1;
    }
    return 1;
  }

  var filtered = genOnly ? INDEX.filter(function(item) { return item.type === 'gen'; }) : INDEX;
  var results = query.trim()
    ? filtered.filter(function(item) { return score(item, query) > 0; })
        .sort(function(a, b) { return score(b, query) - score(a, query); })
        .slice(0, 8)
    : filtered.filter(function(item) { return item.type === 'gen'; }).slice(0, 8);

  // (selected state declared at top of component)

  useEffect(function() {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(function() { setSelected(0); }, [query]);

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(function(s) { return Math.min(s + 1, results.length - 1); }); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(function(s) { return Math.max(s - 1, 0); }); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[selected]) results[selected].action(); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  }

  return h('div', {
    className: 'qf-overlay',
    role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Quick find',
    onClick: function(e) { if (e.target === e.currentTarget) onClose(); },
  },
    h('div', {className: 'qf-box'},
      h('div', {className: 'qf-input-row'},
        h('span', {className: 'qf-search-icon', 'aria-hidden': 'true'}, '🔍'),
        h('input', {
          ref: inputRef,
          type: 'text',
          className: 'qf-input',
          placeholder: genOnly ? 'Search generators…' : 'Find generator, world, or help page…',
          value: query,
          onChange: function(e) { setQuery(e.target.value); },
          onKeyDown: onKeyDown,
          role: 'combobox',
          'aria-label': 'Quick find search',
          'aria-expanded': String(results.length > 0),
          'aria-controls': 'qf-listbox',
          'aria-autocomplete': 'list',
          'aria-activedescendant': results[selected] ? 'qf-opt-' + selected : undefined,
          autoComplete: 'off', autoCorrect: 'off', spellCheck: false,
        }),
        h('button', {
          className: 'qf-gen-toggle' + (genOnly ? ' active' : ''),
          onClick: function() { setGenOnly(!genOnly); if (inputRef.current) inputRef.current.focus(); },
          title: genOnly ? 'Show all results' : 'Show generators only',
          'aria-pressed': String(genOnly),
        }, '🎲'),
        h('kbd', {className: 'qf-esc-hint'}, 'esc')
      ),
      h('div', {className: 'qf-results', role: 'listbox', id: 'qf-listbox', 'aria-label': 'Search results'},
        results.length === 0
          ? h('div', {className: 'qf-empty'}, 'No results for "' + query + '"')
          : results.map(function(item, i) {
              return h('button', {
                key: item.type + ':' + item.id,
                id: 'qf-opt-' + i,
                className: 'qf-result' + (i === selected ? ' qf-result-active' : ''),
                role: 'option', 'aria-selected': String(i === selected),
                onClick: item.action,
                onMouseEnter: function() { setSelected(i); },
              },
                h('span', {className: 'qf-result-icon', 'aria-hidden': 'true'}, item.icon),
                h('span', {className: 'qf-result-body'},
                  h('span', {className: 'qf-result-label'}, item.label),
                  item.sub && h('span', {className: 'qf-result-sub'}, item.sub)
                ),
                h('span', {className: 'qf-result-type qf-type-' + item.type}, item.type)
              );
            })
      ),
      h('div', {className: 'qf-footer'},
        h('span', null, h('kbd', null, '↑↓'), ' navigate'),
        h('span', null, h('kbd', null, '↵'), ' select'),
        h('span', null, h('kbd', null, '/'), ' open')
      )
    )
  );
}

// ════════════════════════════════════════════════════════════════════════
// SESSION DOC — IDEA-06
// Persistent GM scratchpad per campaign. IDB-backed, autosaves on keystroke.
// Slide-in panel, same shell as FP Tracker.
// ════════════════════════════════════════════════════════════════════════

function SessionDoc(props) {
  const campId   = props.campId;
  const onClose  = props.onClose;
  const IDB_KEY  = 'session_doc_' + campId;
  const WORD_GOAL = 100; // rough "enough notes" threshold

  const [text, setText]       = useState('');
  const [saved, setSaved]     = useState(true);
  const [loading, setLoading] = useState(true);
  const debounceRef           = useRef(null);

  // Clear debounce on unmount (leak fix)
  useEffect(function() {
    return function() { clearTimeout(debounceRef.current); };
  }, []);

  // Load on mount
  useEffect(function() {
    DB.loadSession(IDB_KEY).then(function(d) {
      if (d && d.text) setText(d.text);
      setLoading(false);
    }).catch(function() { setLoading(false); });
  }, [campId]);

  // Autosave with debounce
  function handleChange(e) {
    const val = e.target.value;
    setText(val);
    setSaved(false);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(function() {
      DB.saveSession(IDB_KEY, {text: val, ts: Date.now()}).then(function() {
        setSaved(true);
      }).catch(function() {});
    }, 800);
  }

  function copyAll() {
    navigator.clipboard.writeText(text).catch(function() {});
  }

  function clearDoc() {
    if (!confirm('Clear session notes?')) return;
    setText('');
    DB.saveSession(IDB_KEY, {text: '', ts: Date.now()}).catch(function() {});
  }

  const words   = text.trim() ? text.trim().split(/\s+/).length : 0;
  const hasNotes = words >= WORD_GOAL;

  return h('div', {className: 'fp-panel', style: {display: 'flex', flexDirection: 'column'}},
    // Save indicator (header handled by Floater)
    h('div', {style: {display: 'flex', justifyContent: 'flex-end', padding: '4px 14px 0', minHeight: 16}},
      !saved && h('span', {style: {fontSize: 9, color: 'var(--text-muted)', fontStyle: 'italic'}}, 'saving…'),
      saved && text && h('span', {style: {fontSize: 9, color: 'var(--c-green)'}}, '✓ saved')
    ),

    // Toolbar
    h('div', {style: {
      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
      borderBottom: '1px solid var(--border)', flexShrink: 0,
    }},
      h('span', {style: {fontSize: 10, color: 'var(--text-muted)', flex: 1}},
        words + ' word' + (words !== 1 ? 's' : '') +
        (hasNotes ? '  ✦' : '')
      ),
      h('button', {
        onClick: copyAll, disabled: !text,
        style: {background: 'none', border: '1px solid var(--border)', borderRadius: 4,
          padding: '2px 8px', fontSize: 10, color: 'var(--text-muted)', cursor: text ? 'pointer' : 'not-allowed',
          fontFamily: 'var(--font-ui)', opacity: text ? 1 : 0.4},
      }, '📋 Copy'),
      h('button', {
        onClick: clearDoc, disabled: !text,
        style: {background: 'none', border: 'none', borderRadius: 4,
          padding: '2px 6px', fontSize: 10, color: 'var(--c-red)', cursor: text ? 'pointer' : 'not-allowed',
          fontFamily: 'var(--font-ui)', opacity: text ? 1 : 0.4},
        title: 'Clear all notes',
      }, '↺'),
    ),

    // Text area
    loading
      ? h('div', {style: {padding: 16, color: 'var(--text-muted)', fontSize: 12}}, 'Loading…')
      : h('textarea', {
          value: text,
          onChange: handleChange,
          'aria-label': 'Session notes',
          id: 'session-doc-textarea',
          placeholder: [
            '# Session notes\n',
            'Use this for anything mid-session:\n',
            '- What the players just decided\n',
            '- NPCs introduced\n',
            '- Aspects created at the table\n',
            '- What happens next\n',
          ].join(''),
          autoFocus: true,
          style: {
            flex: 1, resize: 'none', background: 'var(--bg)',
            border: 'none', outline: 'none',
            padding: '12px 14px', fontSize: 12,
            color: 'var(--text)', lineHeight: 1.7,
            fontFamily: 'var(--font-ui)',
            minHeight: 0,
          },
        }),

    // Footer hint
    h('div', {style: {
      padding: '6px 14px', borderTop: '1px solid var(--border)',
      fontSize: 10, color: 'var(--text-muted)', flexShrink: 0,
      lineHeight: 1.5,
    }},
      'Notes are saved per campaign and persist between sessions. Markdown-friendly.'
    )
  );
}
