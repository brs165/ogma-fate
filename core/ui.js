// core/ui.js
// React UI layer: primitive components, result renderers, modals,
// LandingApp, TableManagerModal, CampaignApp.
// Depends on core/engine.js (pick, pickN, fillTemplate, generate, toMarkdown, etc.)
// and data globals (CAMPAIGNS, GENERATORS, HELP_CONTENT, HELP_ENTRIES, UNIVERSAL).
// ─────────────────────────────────────────────────────────────────────────────

// ── React aliases ─────────────────────────────────────────────────────────
var h            = React.createElement;
var useState     = React.useState;
var useCallback  = React.useCallback;
var useEffect    = React.useEffect;
var useRef       = React.useRef;
var Fragment     = React.Fragment;

// ── RPG Awesome icon map (BL-iconography) ────────────────────────────────
// Maps generator IDs and UI keys to RPG Awesome class names.
// Usage: h(RaIcon, {n:'crossed-swords'}) or RaIcon({n:'trophy'})
var RA_ICONS = {
  // ── Generators ────────────────────────────────────────────────────────────
  npc_minor:    'player',          // generic figure = unnamed NPC
  npc_major:    'player-king',     // crowned figure = major recurring character
  scene:        'campfire',        // a scene location and gathering point
  campaign:     'guarded-tower',   // a defended position = campaign forces at work
  encounter:    'crossed-swords',  // direct conflict = encounter
  seed:         'acorn',           // acorn grows into a story = adventure seed
  compel:       'divert',          // redirect fate = compel swerves the story
  challenge:    'archery-target',  // aim at a goal through multiple rolls
  contest:      'trophy',          // competition between two sides
  consequence:  'health-decrease', // health going down = lasting wound/mark
  faction:      'castle-flag',     // organised power with a banner
  complication: 'poison-cloud',    // sudden eruption of trouble
  backstory:    'quill-ink',       // writing your personal history
  obstacle:     'barrier',         // something physically in the way
  countdown:    'hourglass',       // time running out
  constraint:   'metal-gate',      // a gate = blocked passage = can't go through
  // ── UI chrome ─────────────────────────────────────────────────────────────
  pin:          'plain-dagger',    // sticking a dagger to pin something in place
  gm_mode:      'crown',           // GM = king of the table
  fp_tracker:   'crystals',        // fate energy = magical crystalline resource
  history:      'scroll-unfurled', // an open log of past events
  play_intro:   'torch',           // lighting the way into the story
  guide:        'book',            // reference book / annotated worldbook
  rules:        'help',            // the rules reference / help system
  dnd_guide:    'crossed-swords',  // D&D = swords and combat
  home:         'castle-emblem',   // the home base / keep
  customize:    'cog-wheel',       // fine-grained customisation control
  settings:     'cog',             // general settings
  theme_light:  'sun',             // light mode = sunlight
  theme_dark:   'moon-sun',        // dark mode = moon obscuring sun
  inspire:      'crystal-ball',    // seeing possibilities = inspiration
  session_zero: 'sprout',          // a new beginning
  learn:        'lighthouse',      // a beacon = quick start = guides you in
  // ── Generator groups ──────────────────────────────────────────────────────
  characters:   'player',
  scenes:       'campfire',
  pacing:       'hourglass',
  world:        'mountains',
};

// RaIcon: renders an RPG Awesome <i> tag. n = class suffix (e.g. 'sword').
// Pass size prop for ra-lg, ra-2x etc.
function RaIcon(props) {
  return h('i', {
    className: 'ra ra-' + props.n + (props.size ? ' ra-' + props.size : ''),
    'aria-hidden': 'true',
    style: {fontSize: 'inherit', lineHeight: 1, verticalAlign: 'middle'},
  });
}

// ── UI timing constants ────────────────────────────────────────────────────
var TIMING = {
  COPY_CONFIRM_MS:  2200,  // "Copied!" badge display duration
  TOAST_MS:         2500,  // Toast notification auto-dismiss
  INTRO_REPLAY_MS:  150,   // Delay before replaying intro (let sidebar close first)
};

// ── Theme init (runs immediately, before React render) ───────────────────
(function initTheme() {
  var saved = LS.get('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

function applyTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  LS.set('theme', mode);
}
function getTheme() {
  return LS.get('theme') || 'light';
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

function Lbl(props) {
  return h('div', {className: 'lbl', style: {marginBottom: props.mb || 4}}, props.children);
}

function AspectBadge(props) {
  var COLOR_LABEL = {
    "var(--accent)":   "High Concept - core identity; invoke for +2 or reroll, compel to create complications",
    "var(--c-red)":    "Trouble - the complication driving drama; GMs compel this to offer fate points",
    "var(--text-dim)": "Aspect - a true statement about the fiction; invoke with a fate point for +2 or reroll",
    "var(--c-blue)":   "Setting Aspect - a permanent world truth; always available to invoke or compel",
    "var(--c-purple)": "Scene Tone - atmospheric aspect; invoke to reinforce the mood or overcome it",
    "var(--c-green)":  "Usable Element - something in the scene to exploit; invoke for +2 or Create Advantage",
  };
  var tip = props.label || COLOR_LABEL[props.color] || "Aspect - invoke with a fate point for +2 or a reroll";
  return h('div', {
    className: 'aspect-badge',
    title: tip,
    'aria-label': props.text + ' (' + tip + ')',
    style: {
      color: props.color,
      borderColor: props.color + '55',
      backgroundColor: props.color + '11',
      marginBottom: 4,
    },
  }, '◈ ' + props.text);
}

function SkillBar(props) {
  var label = SKILL_LABEL[props.r] || ('+' + props.r);
  var tip = props.name + ' at ' + label + ' (+' + props.r + ') - roll 4dF + ' + props.r + ' when this skill applies.';
  return h('div', {className: 'skill-bar', title: tip},
    h('div', {className: 'skill-rating'}, '+' + props.r),
    h('div', {className: 'skill-label-text'}, label),
    h('div', {className: 'skill-name-text'}, props.name)
  );
}

// Interactive stress boxes - tap to mark/clear
function StressBoxes(props) {
  var _hit = useState(0); var hits = _hit[0]; var setHits = _hit[1];
  var _shake = useState(false); var shaking = _shake[0]; var setShaking = _shake[1];
  var n = props.n || 0;
  var takenOut = hits >= n && n > 0;
  var trackTip = (props.label || 'Stress') + ' track - ' + n + ' box' + (n !== 1 ? 'es' : '') + '. Tap a box to mark it. All stress clears at end of scene.';
  function mark(i) {
    var next = hits === i + 1 ? i : i + 1;
    setHits(next);
    if (next >= n && n > 0) {
      setShaking(true);
      setTimeout(function() { setShaking(false); }, 600);
      if (navigator.vibrate) navigator.vibrate([40, 60, 80]);
    }
  }
  return h('div', {className: 'stress-track' + (takenOut && shaking ? ' taken-out' : ''), title: trackTip},
    h('div', {style: {display:'flex',alignItems:'center',flexWrap:'wrap',gap:4}},
      h('div', {className: 'stress-label-text'}, props.label || 'Stress'),
      takenOut && h('span', {className: 'taken-out-label'}, '⚡ TAKEN OUT')
    ),
    h('div', {className: 'stress-boxes'},
      Array.from({length: n}, function(_, i) {
        var marked = i < hits;
        return h('div', {
          key: i,
          className: 'stress-box',
          onClick: function() { mark(i); },
          title: marked ? 'Click to clear' : 'Click to mark hit',
          style: {
            cursor: 'pointer',
            background: marked ? (takenOut ? 'var(--c-red)' : 'var(--accent)') : 'rgba(255,255,255,0.03)',
            borderColor: marked ? (takenOut ? 'var(--c-red)' : 'var(--accent)') : 'var(--accent)',
            transition: 'all 0.2s',
            position: 'relative',
          },
        }, marked ? h('div', {style: {position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'var(--bg)',fontWeight:800}}, '✕') : null);
      })
    )
  );
}

function StuntRow(props) {
  var s = props.stunt;
  var isSpecial = s.type === 'special';
  return h('div', {className: 'stunt-row'},
    h('div', {className: 'stunt-header'},
      h('span', {className: 'stunt-name'}, s.name),
      h('span', {className: 'stunt-skill'}, s.skill),
      h('span', {
        className: 'stunt-badge',
        title: isSpecial ? 'Once per scene - usable once; provides a special mechanical effect beyond a simple +2' : '+2 bonus - when the stunt condition applies, add +2 to the named skill roll',
        style: {
          background: isSpecial ? 'rgba(80,184,120,0.15)' : 'rgba(80,144,208,0.15)',
          color: isSpecial ? 'var(--c-green)' : 'var(--c-blue)',
          border: '1px solid ' + (isSpecial ? 'var(--c-green)' : 'var(--c-blue)') + '55',
        },
      }, isSpecial ? 'ONCE/SCENE' : '+2 BONUS')
    ),
    h('div', {className: 'stunt-desc'}, s.desc)
  );
}

function GMNote(props) {
  return h('div', {className: 'gm-note gm-guidance', title: 'GM Note - table advice for running this content'},
    h('div', {className: 'gm-note-label'}, 'GM Note'),
    h('div', {className: 'gm-note-text'}, props.text)
  );
}

function InfoBox(props) {
  var col = props.color || 'var(--accent)';
  return h('div', {
    className: 'info-box',
    title: props.tip || null,
    style: {borderColor: col + '44', backgroundColor: col + '11'},
  },
    h('div', {className: 'info-box-label', style: {color: col}}, props.label),
    h('div', {className: 'info-box-text', style: {color: 'var(--text)'}}, props.text)
  );
}

// ════════════════════════════════════════════════════════════════════════
// RESULT RENDERERS
// ════════════════════════════════════════════════════════════════════════

function MinorResult(props) {
  var d = props.data;
  return h('div', null,
    h(Lbl, null, 'MINOR NPC'),
    h('div', {style: {fontSize: 20, fontWeight: 700, color: 'var(--gold)', marginBottom: 12, fontFamily: 'var(--font-ui)'}}, d.name),
    h(Lbl, {mb: 6}, 'ASPECTS'),
    d.aspects.map(function(a, i) {
      return h(AspectBadge, {key: i, text: a, color: i === 0 ? 'var(--accent)' : 'var(--c-red)', label: i === 0 ? 'High Concept' : 'Weakness - GMs compel this for drama'});
    }),
    h('div', {style: {marginTop: 12}},
      h(Lbl, {mb: 6}, 'SKILLS'),
      d.skills.map(function(s, i) { return h(SkillBar, {key: i, name: s.name, r: s.r}); })
    ),
    d.stunt && h('div', {style: {marginTop: 12}},
      h(Lbl, {mb: 6}, 'STUNT'),
      h(StuntRow, {stunt: d.stunt})
    ),
    h('div', {style: {marginTop: 12}},
      h(StressBoxes, {n: d.stress, label: 'Stress'})
    ),
    h(GMNote, {text: 'No consequence slots. One good hit takes them out. Weakness aspect is your best compel lever.'})
  );
}

function MajorResult(props) {
  var d = props.data;
  var _tab = useState('aspects'); var activeTab = _tab[0]; var setActiveTab = _tab[1];
  var tabStyle = function(id) {
    var active = activeTab === id;
    return {
      padding: '5px 14px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-label)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
      borderRadius: '8px 8px 0 0',
      background: active ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'transparent',
      color: active ? 'var(--accent)' : 'var(--text-muted)',
      borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
      transition: 'all 0.15s',
    };
  };
  return h('div', null,
    h(Lbl, null, 'MAJOR NPC'),
    h('div', {style: {display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 14}},
      h('div', {style: {fontSize: 20, fontWeight: 700, color: 'var(--gold)', fontFamily: 'var(--font-ui)'}}, d.name),
      h('div', {
        title: 'Refresh - fate points this NPC starts each scene with; also minimum fate points after a session',
        style: {fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 700, background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)', borderRadius: 20, padding: '2px 10px'},
      }, '↺ Refresh ' + d.refresh)
    ),
    // Tab bar
    h('div', {style: {display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', marginBottom: 12}},
      h('button', {style: tabStyle('aspects'), onClick: function() { setActiveTab('aspects'); }}, 'Aspects'),
      h('button', {style: tabStyle('skills'),  onClick: function() { setActiveTab('skills');  }}, 'Skills'),
      h('button', {style: tabStyle('stunts'),  onClick: function() { setActiveTab('stunts');  }}, 'Stunts')
    ),
    // Tab content
    activeTab === 'aspects' && h('div', null,
      h(AspectBadge, {text: d.aspects.high_concept, color: 'var(--accent)'}),
      h(AspectBadge, {text: d.aspects.trouble, color: 'var(--c-red)', label: 'Trouble - the core complication driving this NPC\'s drama; compel it for a fate point'}),
      d.aspects.others.map(function(a, i) { return h(AspectBadge, {key: i, text: a, color: 'var(--text-dim)'}); })
    ),
    activeTab === 'skills' && h('div', null,
      h('div', {className: 'two-col'},
        h('div', null,
          h(Lbl, {mb: 6}, 'SKILLS'),
          d.skills.map(function(s, i) { return h(SkillBar, {key: i, name: s.name, r: s.r}); })
        ),
        h('div', null,
          h(Lbl, {mb: 6}, 'STRESS'),
          h(StressBoxes, {n: d.physical_stress, label: 'Physical'}),
          h(StressBoxes, {n: d.mental_stress, label: 'Mental'}),
          h('div', {style: {marginTop: 10}},
            h(Lbl, {mb: 4}, 'CONSEQUENCES'),
            ['Mild −2', 'Moderate −4', 'Severe −6'].map(function(row, i) {
              return h('div', {key: i, style: {display:'flex', alignItems:'center', gap:8, padding:'4px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none'}},
                h('div', {style: {width:14, height:14, border:'1.5px solid var(--border)', borderRadius:3}}),
                h('div', {style: {fontSize: 'var(--text-label)', color: 'var(--text-dim)'}}, row)
              );
            })
          )
        )
      )
    ),
    activeTab === 'stunts' && h('div', null,
      d.stunts.map(function(s, i) { return h(StuntRow, {key: i, stunt: s}); }),
      h(GMNote, {text: 'Major NPCs start each scene with Refresh fate points. They can concede - let them escape dramatically for a future session.'})
    )
  );
}

function SceneResult(props) {
  var d = props.data;
  var _pinned = useState([]); var pinned = _pinned[0]; var setPinned = _pinned[1];
  function togglePin(i) { setPinned(function(p) { return p.includes(i) ? p.filter(function(x) { return x !== i; }) : p.concat([i]); }); }
  var catColor = {tone: 'var(--c-purple)', movement: 'var(--c-red)', cover: 'var(--c-blue)', danger: 'var(--c-red)', usable: 'var(--c-green)'};
  var catLabel = {tone: 'TONE', movement: 'MOVEMENT', cover: 'COVER', danger: 'DANGER', usable: 'USABLE'};
  return h('div', null,
    h(Lbl, null, 'SCENE SETUP'),
    h(Lbl, {mb: 6}, 'SITUATION ASPECTS - tap to mark active at the table'),
    d.aspects.map(function(a, i) {
      var col = catColor[a.category] || 'var(--accent)';
      var isActive = pinned.includes(i);
      return h('div', {
        key: i,
        onClick: function() { togglePin(i); },
        title: isActive ? 'Click to unmark' : 'Click to mark active',
        style: {
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6,
          padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
          background: isActive ? 'color-mix(in srgb, ' + col + ' 10%, transparent)' : 'var(--inset)',
          border: '1px solid ' + (isActive ? col + '55' : 'var(--border)'),
          transition: 'all 0.15s',
        },
      },
        h('div', {style: {
          width: 16, height: 16, borderRadius: 4, flexShrink: 0, transition: 'all 0.15s',
          border: '1.5px solid ' + (isActive ? col : 'var(--border)'),
          background: isActive ? col : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
          color: 'var(--bg)',
        }}, isActive ? '✓' : ''),
        h('div', {style: {flex: 1}},
          h('div', {style: {fontSize: 'var(--text-sm)', fontStyle: 'italic', color: isActive ? 'var(--text)' : 'var(--text-dim)', lineHeight: 1.35}}, '"' + a.name + '"'),
          h('div', {style: {display: 'flex', gap: 8, marginTop: 3}},
            h('span', {style: {fontSize: 'var(--text-label)', color: col, letterSpacing: 1, fontWeight: 700}}, catLabel[a.category] || a.category.toUpperCase()),
            a.free_invoke && h('span', {style: {fontSize: 'var(--text-label)', color: 'var(--c-green)', letterSpacing: 1}}, '✦ FREE INVOKE')
          )
        )
      );
    }),
    d.zones && d.zones.length && h('div', {style: {marginTop: 12}},
      h(Lbl, {mb: 6}, 'ZONES'),
      h('div', {className: 'zone-grid'},
        d.zones.map(function(z, i) {
          return h('div', {key: i, className: 'zone-card', title: 'Zone - a distinct area of the scene.'},
            h('div', {className: 'zone-name'}, z.name),
            z.aspect && h('div', {className: 'zone-aspect-text'}, z.aspect),
            z.description && h('div', {className: 'zone-desc'}, z.description)
          );
        })
      )
    ),
    d.framing_questions && d.framing_questions.length > 0 && h('div', {style: {marginTop: 12}},
      h(Lbl, {mb: 6}, 'SCENE FRAMING'),
      h('div', {style: {background: 'var(--inset)', border: '1px solid var(--border)', borderRadius: 12, padding: 12}},
        d.framing_questions.map(function(q, i) {
          return h('div', {key: i, style: {fontSize: 'var(--text-sm)', color: 'var(--text-dim)', lineHeight: 1.6, padding: '4px 0', borderBottom: i < d.framing_questions.length - 1 ? '1px solid var(--border)' : 'none'}}, q);
        })
      )
    ),
    h(GMNote, {text: 'Announce 1–2 visible aspects as players arrive. Let them discover the rest. ✓ marks the aspects currently in play - keep them where the table can see.'})
  );
}

function CampaignResult(props) {
  var d = props.data;
  function Issue(iprops) {
    var _open = useState(true); var open = _open[0]; var setOpen = _open[1];
    var iss = iprops.issue;
    return h('div', {style: {marginBottom: 14}},
      h('button', {
        onClick: function() { setOpen(function(v) { return !v; }); },
        style: {
          display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'none',
          border: 'none', cursor: 'pointer', padding: '4px 0', textAlign: 'left',
        },
      },
        h('div', {style: {fontSize: 'var(--text-sm)', fontWeight: 700, color: iprops.color, flex: 1}}, iss.name),
        h('div', {style: {fontSize: 12, color: 'var(--text-muted)', transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'none'}}, '›')
      ),
      open && h('div', null,
        h('div', {style: {fontSize: 'var(--text-sm)', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 8, marginTop: 4}}, iss.desc),
        iss.faces && iss.faces.map(function(f, i) {
          return h('div', {key: i, style: {fontSize: 'var(--text-sm)', color: 'var(--text-dim)', marginBottom: 3}},
            h('span', {style: {color: iprops.color, fontWeight: 700}}, f.name), ' - ', f.role
          );
        }),
        iss.places && h('div', {style: {fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4}}, '📍 ' + iss.places.join('  ·  '))
      )
    );
  }
  return h('div', null,
    h(Lbl, null, 'CAMPAIGN ISSUES'),
    h('div', {style: {background: 'var(--inset)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 10}},
      h('div', {style: {fontSize: 'var(--text-label)', letterSpacing: 2, color: 'var(--c-red)', textTransform: 'uppercase', marginBottom: 8}}, '⚡ Current Issue - happening NOW'),
      h(Issue, {issue: d.current, color: 'var(--accent)'})
    ),
    h('div', {style: {background: 'var(--inset)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 10}},
      h('div', {style: {fontSize: 'var(--text-label)', letterSpacing: 2, color: 'var(--c-purple)', textTransform: 'uppercase', marginBottom: 8}}, '🌑 Impending Issue - brewing on the horizon'),
      h(Issue, {issue: d.impending, color: 'var(--accent)'})
    ),
    h(Lbl, {mb: 6}, 'SETTING ASPECTS'),
    d.setting.map(function(a, i) { return h(AspectBadge, {key: i, text: a, color: 'var(--c-blue)', label: 'Setting Aspect - a permanent world truth; always available to invoke or compel'}); }),
    h(GMNote, {text: 'Roll two issues for your opening sessions. Roll a third when the first resolves. Keep one current and one impending - perpetual forward momentum.'})
  );
}

function EncounterResult(props) {
  var d = props.data;
  var _fp = useState(d.gm_fate_points || 0); var gmFP = _fp[0]; var setGmFP = _fp[1];
  return h('div', null,
    h(Lbl, null, 'ENCOUNTER'),
    h(Lbl, {mb: 6}, 'SITUATION ASPECTS'),
    d.aspects.map(function(a, i) { return h(AspectBadge, {key: i, text: a, color: 'var(--accent)'}); }),
    d.zones && d.zones.length && h('div', {style: {marginTop: 10}},
      h(Lbl, {mb: 6}, 'ZONES'),
      h('div', {className: 'zone-grid'},
        d.zones.map(function(z, i) {
          return h('div', {key: i, className: 'zone-card'},
            h('div', {className: 'zone-name'}, z.name),
            z.aspect && h('div', {className: 'zone-aspect-text'}, z.aspect)
          );
        })
      )
    ),
    h('div', {style: {marginTop: 12}},
      h(Lbl, {mb: 6}, 'OPPOSITION'),
      d.opposition.map(function(o, oi) {
        return h('div', {key: oi, className: 'opp-card opp-type-' + o.type, title: o.type === 'major' ? 'Major NPC - full stress track; can concede to escape dramatically' : 'Minor NPC - one solid hit usually takes them out'},
          h('div', {style: {display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6}},
            h('div', {style: {fontSize: 'var(--text-base)', fontWeight: 700, color: o.type === 'major' ? 'var(--accent)' : 'var(--c-red)'}},
              o.name + (o.qty > 1 ? ' ×' + o.qty : '')
            ),
            h('span', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase'}}, o.type)
          ),
          o.aspects && o.aspects.map(function(a, i) { return h(AspectBadge, {key: i, text: a, color: 'var(--text-dim)'}); }),
          h('div', {style: {marginTop: 6}},
            o.skills && o.skills.map(function(s, i) { return h(SkillBar, {key: i, name: s.name, r: s.r}); })
          ),
          o.stunt && h('div', {style: {marginTop: 6, fontSize: 'var(--text-sm)', color: 'var(--text-dim)', fontStyle: 'italic'}},
            h('span', {style: {color: 'var(--accent)', fontWeight: 700}}, 'Stunt: '), o.stunt
          ),
          h(StressBoxes, {n: o.stress, label: 'Stress'})
        );
      })
    ),
    // GM Fate Points - interactive tally
    h('div', {style: {marginTop: 12, padding: '10px 14px', background: 'var(--inset)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12}},
      h('div', {style: {flex: 1}},
        h('div', {style: {fontSize: 'var(--text-label)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4}}, 'GM Fate Points'),
        h('div', {style: {display: 'flex', gap: 5, flexWrap: 'wrap'}},
          Array.from({length: Math.max(d.gm_fate_points, gmFP) + 1}, function(_, i) {
            return h('div', {
              key: i,
              title: i < gmFP ? 'Click to spend' : 'Spent',
              onClick: function() { setGmFP(function(v) { return v === i + 1 ? i : i + 1; }); },
              style: {
                width: 22, height: 22, borderRadius: 11, cursor: 'pointer',
                border: '1.5px solid var(--accent)',
                background: i < gmFP ? 'var(--accent)' : 'transparent',
                transition: 'all 0.15s',
              },
            });
          })
        )
      ),
      h('div', {style: {display: 'flex', flexDirection: 'column', gap: 4}},
        h('button', {onClick: function() { setGmFP(function(v) { return v + 1; }); }, style: {width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--text-dim)', fontSize: 16, cursor: 'pointer', lineHeight: 1}}, '+'),
        h('button', {onClick: function() { setGmFP(function(v) { return Math.max(0, v - 1); }); }, style: {width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--text-dim)', fontSize: 16, cursor: 'pointer', lineHeight: 1}}, '−')
      )
    ),
    h('div', {style: {marginTop: 10}},
      h(InfoBox, {label: '🏆 VICTORY CONDITION', text: d.victory, color: 'var(--c-green)', tip: 'State this before the first roll'}),
      h(InfoBox, {label: '💀 DEFEAT CONDITION', text: d.defeat, color: 'var(--c-red)', tip: 'Equally important to state upfront'}),
      h(InfoBox, {label: '🌀 MID-SCENE TWIST', text: d.twist, color: 'var(--c-purple)', tip: 'Drop this when the outcome feels settled'})
    ),
    h(GMNote, {text: 'State victory/defeat conditions before the first roll. Drop the twist when the outcome feels settled. Tap stress boxes to track hits. Tap fate point dots to spend them.'})
  );
}

function SeedResult(props) {
  var d = props.data;
  var _scene = useState(0); var activeScene = _scene[0]; var setActiveScene = _scene[1];
  var sceneColors = ['var(--c-blue)', 'var(--c-purple)', 'var(--c-red)'];
  return h('div', null,
    h(Lbl, null, 'ADVENTURE SEED'),
    h(InfoBox, {label: '📍 LOCATION',    text: d.location,     color: 'var(--c-blue)',   tip: 'Where Session 1 opens'}),
    h(InfoBox, {label: '🎯 OBJECTIVE',   text: d.objective,    color: 'var(--gold)',     tip: 'What the party is here to do'}),
    h(InfoBox, {label: '⚡ COMPLICATION', text: d.complication, color: 'var(--c-red)',   tip: 'What makes the objective not simple'}),
    h(Lbl, {mb: 6, style: {marginTop: 14}}, 'THREE SCENE SKETCH'),
    // Scene tab strip
    h('div', {style: {display: 'flex', gap: 4, marginBottom: 8}},
      d.scenes.map(function(scene) {
        var col = sceneColors[scene.num - 1];
        var isActive = activeScene === scene.num - 1;
        return h('button', {
          key: scene.num,
          onClick: function() { setActiveScene(scene.num - 1); },
          style: {
            flex: 1, padding: '6px 8px', border: 'none', cursor: 'pointer', borderRadius: 8,
            background: isActive ? 'color-mix(in srgb, ' + col + ' 15%, transparent)' : 'var(--inset)',
            border: '1px solid ' + (isActive ? col + '55' : 'var(--border)'),
            color: isActive ? col : 'var(--text-muted)',
            fontSize: 'var(--text-label)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
          },
        }, scene.type);
      })
    ),
    h('div', {
      style: {
        padding: '10px 14px', borderRadius: 10,
        border: '1px solid ' + sceneColors[activeScene] + '44',
        background: sceneColors[activeScene] + '0d',
        fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 1.65,
      },
    }, d.scenes[activeScene].brief),
    h(Lbl, {mb: 6, style: {marginTop: 14}}, 'OPPOSITION'),
    h('div', {className: 'opp-grid'},
      d.opposition.map(function(o, oi) {
        return h('div', {key: oi, className: 'opp-card opp-type-' + o.type},
          h('div', {className: 'opp-name'}, o.name),
          h('div', {className: 'opp-type-label'}, o.type === 'major' ? '◆ Major' : '◈ Mook'),
          h('div', {style: {fontSize: 'var(--text-label)', color: 'var(--text-dim)', marginTop: 4}}, o.desc)
        );
      })
    ),
    h(Lbl, {mb: 6, style: {marginTop: 14}}, 'STAKES'),
    h(InfoBox, {label: '🏆 VICTORY', text: d.victory, color: 'var(--c-green)', tip: 'State this before the first roll'}),
    h(InfoBox, {label: '💀 DEFEAT',  text: d.defeat,  color: 'var(--c-red)',   tip: 'Equally important to state upfront'}),
    h(InfoBox, {label: '🌀 TWIST',   text: d.twist,   color: 'var(--c-purple)', tip: 'Hold until the outcome looks settled'}),
    h('div', {className: 'gm-note', style: {marginTop: 10}},
      h('div', {className: 'gm-note-label'}, '🌍 Setting Aspect in Play'),
      h('div', {className: 'gm-note-text'}, '"' + d.setting_asp + '"')
    ),
    h('div', {className: 'gm-note', style: {marginTop: 6}},
      h('div', {className: 'gm-note-label'}, '🌐 Active Campaign Issue'),
      h('div', {className: 'gm-note-text'}, d.issue)
    ),
    h(GMNote, {text: 'Prep Scene 1 in full. Scenes 2 and 3 are targets - follow the players, not the brief. State victory and defeat conditions before the first roll.'})
  );
}

function CompelResult(props) {
  var d = props.data;
  var _res = useState(null); var resolution = _res[0]; var setResolution = _res[1];
  return h('div', {style: {animation: 'fadeUp 0.3s ease both'}},
    h('div', {className: 'lbl', style: {marginBottom: 12}}, 'Compel'),
    h('div', {className: 'info-box', style: {borderColor: 'var(--accent)', background: 'color-mix(in srgb, var(--accent) 10%, transparent)', marginBottom: 10}},
      h('div', {className: 'info-box-label', style: {color: 'var(--gold)'}}, '🎭 Situation'),
      h('div', {className: 'info-box-text'}, d.situation)
    ),
    h('div', {className: 'info-box', style: {borderColor: 'var(--c-red)', background: 'color-mix(in srgb, var(--c-red) 8%, transparent)', marginBottom: 10}},
      h('div', {className: 'info-box-label', style: {color: 'var(--c-red)'}}, '⚡ If Accepted'),
      h('div', {className: 'info-box-text'}, d.consequence)
    ),
    d.template ? h('div', {className: 'info-box', style: {borderColor: 'var(--c-purple)', background: 'color-mix(in srgb, var(--c-purple) 8%, transparent)', marginBottom: 10}},
      h('div', {className: 'info-box-label', style: {color: 'var(--c-purple)'}}, '📝 ' + (d.template_type === 'event' ? 'Event' : 'Decision') + ' Framing'),
      h('div', {className: 'info-box-text', style: {fontStyle: 'italic'}}, d.template)
    ) : null,
    // Accept / Refuse buttons
    resolution === null && h('div', {style: {display: 'flex', gap: 8, marginTop: 10}},
      h('button', {
        onClick: function() { setResolution('accepted'); },
        style: {
          flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--c-green)', cursor: 'pointer',
          background: 'color-mix(in srgb, var(--c-green) 10%, transparent)',
          color: 'var(--c-green)', fontWeight: 700, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)',
          transition: 'all 0.15s',
        },
      }, '✓ Accept - gain 1 FP'),
      h('button', {
        onClick: function() { setResolution('refused'); },
        style: {
          flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--c-red)', cursor: 'pointer',
          background: 'color-mix(in srgb, var(--c-red) 10%, transparent)',
          color: 'var(--c-red)', fontWeight: 700, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)',
          transition: 'all 0.15s',
        },
      }, '✕ Refuse - spend 1 FP')
    ),
    resolution && h('div', {
      style: {
        marginTop: 10, padding: '10px 14px', borderRadius: 10, textAlign: 'center',
        background: resolution === 'accepted' ? 'color-mix(in srgb, var(--c-green) 10%, transparent)' : 'color-mix(in srgb, var(--c-red) 10%, transparent)',
        border: '1px solid ' + (resolution === 'accepted' ? 'var(--c-green)' : 'var(--c-red)'),
      },
    },
      h('div', {style: {fontWeight: 700, fontSize: 'var(--text-sm)', color: resolution === 'accepted' ? 'var(--c-green)' : 'var(--c-red)'}},
        resolution === 'accepted' ? 'Accepted - complication enters play, player gains 1 FP' : 'Refused - player spends 1 FP'
      ),
      h('button', {
        onClick: function() { setResolution(null); },
        style: {marginTop: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-label)', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)'},
      }, '↩ Reset')
    ),
    h('div', {className: 'gm-note gm-guidance', style: {marginTop: 10}},
      h('div', {className: 'gm-note-label'}, '💡 Fate Point Flow'),
      h('div', {className: 'gm-note-text'}, 'Offer the fate point BEFORE stating the consequence. If the player pays 1 FP to refuse, accept it - that is the system working.')
    )
  );
}

function ChallengeResult(props) {
  var d = props.data;
  var _out = useState('none'); var outcome = _out[0]; var setOutcome = _out[1];
  return h('div', {style: {animation: 'fadeUp 0.3s ease both'}},
    h('div', {className: 'lbl', style: {marginBottom: 4}}, 'Challenge'),
    h('div', {style: {fontSize: 20, fontWeight: 800, color: 'var(--gold)', marginBottom: 6}}, d.name),
    h('div', {style: {fontSize: 'var(--text-sm)', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 14}}, d.desc),
    h('div', {className: 'two-col', style: {marginBottom: 10}},
      h('div', {className: 'info-box', style: {borderColor: 'var(--c-blue)', background: 'color-mix(in srgb, var(--c-blue) 8%, transparent)'}},
        h('div', {className: 'info-box-label', style: {color: 'var(--c-blue)'}}, '🎲 Primary Skill(s)'),
        h('div', {className: 'info-box-text'}, d.primary)
      ),
      h('div', {className: 'info-box', style: {borderColor: 'var(--c-red)', background: 'color-mix(in srgb, var(--c-red) 8%, transparent)'}},
        h('div', {className: 'info-box-label', style: {color: 'var(--c-red)'}}, '⚔ Opposing Force'),
        h('div', {className: 'info-box-text'}, d.opposing)
      )
    ),
    h('div', {className: 'two-col', style: {marginBottom: 14}},
      h('div', {
        className: 'info-box',
        onClick: function() { setOutcome(function(v) { return v === 'success' ? 'none' : 'success'; }); },
        style: {
          borderColor: 'var(--c-green)', cursor: 'pointer',
          background: outcome === 'success' ? 'color-mix(in srgb, var(--c-green) 18%, transparent)' : 'color-mix(in srgb, var(--c-green) 8%, transparent)',
          outline: outcome === 'success' ? '2px solid var(--c-green)' : 'none',
          transition: 'all 0.15s',
        },
      },
        h('div', {className: 'info-box-label', style: {color: 'var(--c-green)'}}, '✓ Success' + (outcome === 'success' ? ' ◀' : '')),
        h('div', {className: 'info-box-text'}, d.success)
      ),
      h('div', {
        className: 'info-box',
        onClick: function() { setOutcome(function(v) { return v === 'failure' ? 'none' : 'failure'; }); },
        style: {
          borderColor: 'var(--c-red)', cursor: 'pointer',
          background: outcome === 'failure' ? 'color-mix(in srgb, var(--c-red) 18%, transparent)' : 'color-mix(in srgb, var(--c-red) 8%, transparent)',
          outline: outcome === 'failure' ? '2px solid var(--c-red)' : 'none',
          transition: 'all 0.15s',
        },
      },
        h('div', {className: 'info-box-label', style: {color: 'var(--c-red)'}}, '✗ Failure' + (outcome === 'failure' ? ' ◀' : '')),
        h('div', {className: 'info-box-text'}, d.failure)
      )
    ),
    h('div', {className: 'lbl', style: {marginBottom: 6}}, 'Campaign Stakes'),
    h('div', {className: 'two-col'},
      h('div', {className: 'info-box', style: {borderColor: 'var(--c-green)', background: 'color-mix(in srgb, var(--c-green) 6%, transparent)'}},
        h('div', {className: 'info-box-label', style: {color: 'var(--c-green)'}}, '🏆 If They Win'),
        h('div', {className: 'info-box-text'}, d.stakes_good)
      ),
      h('div', {className: 'info-box', style: {borderColor: 'var(--c-red)', background: 'color-mix(in srgb, var(--c-red) 6%, transparent)'}},
        h('div', {className: 'info-box-label', style: {color: 'var(--c-red)'}}, '💀 If They Lose'),
        h('div', {className: 'info-box-text'}, d.stakes_bad)
      )
    )
  );
}

function ContestResult(props) {
  var d = props.data;
  var WIN = d.victories_needed || 3;
  var _a = useState(0); var scoreA = _a[0]; var setScoreA = _a[1];
  var _b = useState(0); var scoreB = _b[0]; var setScoreB = _b[1];
  var winner = scoreA >= WIN ? d.side_a : scoreB >= WIN ? d.side_b : null;
  function TrackSide(tprops) {
    var score = tprops.score;
    var isWinner = score >= WIN;
    return h('div', {
      className: 'info-box',
      style: {
        borderColor: isWinner ? 'var(--accent)' : (tprops.colorVar + '66'),
        background: isWinner ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : ('color-mix(in srgb, ' + tprops.colorVar + ' 8%, transparent)'),
        transition: 'all 0.3s',
      },
    },
      h('div', {className: 'info-box-label', style: {color: isWinner ? 'var(--accent)' : tprops.colorVar, display:'flex', alignItems:'center', gap:4}},
        tprops.icon + ' ' + tprops.name,
        isWinner && h('span', {className: 'trophy-pop', key: 'trophy'}, '🏆')
      ),
      h('div', {className: 'info-box-text', style: {marginBottom: 8}}, tprops.skills),
      h('div', {style: {display: 'flex', gap: 5, marginBottom: 8}},
        Array.from({length: WIN}, function(_, i) {
          var filled = i < score;
          return h('div', {
            key: i,
            title: filled ? 'Click to remove victory' : 'Click to mark victory',
            onClick: function() { tprops.setScore(function(v) { return v === i + 1 ? i : i + 1; }); },
            style: {
              width: 28, height: 28, borderRadius: 7, cursor: 'pointer', transition: 'all 0.2s',
              border: '2px solid ' + (filled ? (isWinner ? 'var(--accent)' : tprops.colorVar) : 'var(--border)'),
              background: filled ? (isWinner ? 'var(--accent)' : ('color-mix(in srgb, ' + tprops.colorVar + ' 30%, transparent)')) : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: filled ? (isWinner ? 'var(--bg)' : tprops.colorVar) : 'var(--text-muted)',
            },
          }, filled ? '✓' : '');
        })
      ),
      h('div', {style: {fontSize: 'var(--text-label)', color: isWinner ? 'var(--accent)' : 'var(--text-muted)'}},
        score + ' / ' + WIN + (isWinner ? ' — first to 3!' : '')
      )
    );
  }
  return h('div', {style: {animation: 'fadeUp 0.3s ease both'}},
    h(Lbl, null, 'CONTEST'),
    h('div', {style: {fontSize: 20, fontWeight: 800, color: 'var(--gold)', marginBottom: 4}}, d.contest_type),
    h('div', {style: {fontSize: 'var(--text-sm)', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 12}}, d.desc),
    h(AspectBadge, {text: d.aspect, color: 'var(--accent)', label: 'Situation aspect - always in play during the contest'}),
    h('div', {style: {display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12}},
      h(TrackSide, {name: d.side_a, skills: d.skills_a, score: scoreA, setScore: setScoreA, colorVar: 'var(--c-blue)',  icon: '🔵'}),
      h(TrackSide, {name: d.side_b, skills: d.skills_b, score: scoreB, setScore: setScoreB, colorVar: 'var(--c-red)',   icon: '🔴'})
    ),
    winner && h('div', {
      style: {
        marginTop: 10, padding: '10px 14px', borderRadius: 10, textAlign: 'center',
        background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
        border: '1px solid var(--accent)',
        animation: 'fadeUp 0.2s ease both',
      },
    },
      h('div', {style: {fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--accent)'}}, winner + ' wins the contest!'),
      h('button', {
        onClick: function() { setScoreA(0); setScoreB(0); },
        style: {marginTop: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-label)', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)'},
      }, '↩ Reset')
    ),
    h('div', {style: {marginTop: 12}},
      h(Lbl, {mb: 6}, 'TWISTS - ON TIED EXCHANGES'),
      d.twists.map(function(tw, i) {
        return h('div', {key: i, style: {fontSize: 'var(--text-sm)', color: 'var(--text-dim)', lineHeight: 1.6, padding: '4px 0', borderBottom: i < d.twists.length - 1 ? '1px solid var(--border)' : 'none'}},
          h('span', {style: {color: 'var(--c-purple)', fontWeight: 700}}, (i + 1) + '. '), tw
        );
      })
    ),
    h('div', {style: {marginTop: 12}},
      h(InfoBox, {label: '🏆 IF ' + d.side_a.toUpperCase() + ' WINS', text: d.stakes_good, color: 'var(--c-green)'}),
      h(InfoBox, {label: '💀 IF ' + d.side_b.toUpperCase() + ' WINS', text: d.stakes_bad,  color: 'var(--c-red)'})
    ),
    h(GMNote, {text: 'Tap the boxes to score victories. First to ' + WIN + ' wins. Tied exchange = introduce a twist aspect instead of scoring.'})
  );
}

function ConsequenceResult(props) {
  var d = props.data;
  var _treated = useState(false); var treated = _treated[0]; var setTreated = _treated[1];
  var _cleared = useState(false); var cleared = _cleared[0]; var setCleared = _cleared[1];
  var sevColor = {mild: 'var(--c-blue)', moderate: 'var(--c-purple)', severe: 'var(--c-red)'};
  var sevLabel = {mild: 'MILD', moderate: 'MODERATE', severe: 'SEVERE'};
  var sevTip = {
    mild:     'Overcome Fair+2 to treat. Clears after one full scene.',
    moderate: 'Overcome Great+4 to treat. Clears after a full session.',
    severe:   'Overcome Fantastic+6 to treat. Clears after a major milestone.',
  };
  var recoveryTarget = {mild: 'Fair +2', moderate: 'Great +4', severe: 'Fantastic +6'};
  var recoveryWindow = {mild: 'next scene', moderate: 'full session', severe: 'major milestone'};
  var col = sevColor[d.severity] || 'var(--accent)';
  return h('div', null,
    h(Lbl, null, 'CONSEQUENCE'),
    h('div', {title: sevTip[d.severity], style: {display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12, color: col, border: '1px solid ' + col + '55', background: col + '18'}}, sevLabel[d.severity] || d.severity.toUpperCase()),
    h('div', {style: {fontSize: 18, fontStyle: 'italic', color: 'var(--text)', padding: '10px 14px', marginBottom: 10, background: col + '0d', border: '1px solid ' + col + '33', borderRadius: 10, lineHeight: 1.4}},
      '"' + d.aspect + '"'
    ),
    h('div', {style: {marginTop: 4, marginBottom: 14, fontSize: 'var(--text-sm)', color: 'var(--text-dim)', fontStyle: 'italic'}}, 'Suffered ' + d.context + '.'),
    h(InfoBox, {label: '⊗ COMPEL HOOK', text: d.compel_hook, color: 'var(--c-purple)', tip: 'Use this to offer the player a fate point in exchange for the consequence making things worse'}),
    // Recovery tracker
    h('div', {style: {marginTop: 12, padding: '10px 14px', background: 'var(--inset)', border: '1px solid var(--border)', borderRadius: 10}},
      h(Lbl, {mb: 8}, 'RECOVERY TRACKER'),
      h('div', {style: {display: 'flex', flexDirection: 'column', gap: 8}},
        h('label', {
          onClick: function() { setTreated(function(v) { return !v; }); },
          style: {display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer'},
        },
          h('div', {className: treated ? 'consequence-marked' : '', style: {width: 20, height: 20, borderRadius: 5, border: '2px solid ' + (treated ? col : 'var(--border)'), background: treated ? col : 'transparent', flexShrink: 0, transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--bg)'}}, treated ? '✓' : ''),
          h('div', null,
            h('div', {style: {fontSize: 'var(--text-sm)', color: treated ? 'var(--text)' : 'var(--text-dim)', fontWeight: treated ? 600 : 400}}, 'Treatment: overcome ' + recoveryTarget[d.severity]),
            h('div', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)'}}, 'Academics (physical) or Empathy (mental) · +2 if self-treating')
          )
        ),
        h('label', {
          onClick: function() { if (treated) setCleared(function(v) { return !v; }); },
          style: {display: 'flex', alignItems: 'center', gap: 10, cursor: treated ? 'pointer' : 'not-allowed', opacity: treated ? 1 : 0.4},
        },
          h('div', {style: {width: 20, height: 20, borderRadius: 5, border: '2px solid ' + (cleared ? 'var(--c-green)' : 'var(--border)'), background: cleared ? 'var(--c-green)' : 'transparent', flexShrink: 0, transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--bg)'}}, cleared ? '✓' : ''),
          h('div', null,
            h('div', {style: {fontSize: 'var(--text-sm)', color: cleared ? 'var(--c-green)' : 'var(--text-dim)', fontWeight: cleared ? 600 : 400}}, 'Cleared after ' + recoveryWindow[d.severity]),
            h('div', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)'}}, treated ? 'Treatment done - mark when window passes' : 'Treat first')
          )
        )
      )
    )
  );
}

function FactionResult(props) {
  var d = props.data;
  var _open = useState(false); var faceOpen = _open[0]; var setFaceOpen = _open[1];
  return h('div', null,
    h(Lbl, null, 'FACTION'),
    h('div', {style: {fontSize: 22, fontWeight: 700, color: 'var(--gold)', marginBottom: 14, fontFamily: 'var(--font-ui)'}}, d.name),
    h(InfoBox, {label: '◎ GOAL',     text: d.goal,    color: 'var(--accent)',  tip: 'What this faction is actively working toward; drive every NPC interaction with it in mind'}),
    h(InfoBox, {label: '⚙ METHOD',   text: d.method,  color: 'var(--c-blue)', tip: 'How they pursue the goal; use this to flavour their agents and assets'}),
    h(InfoBox, {label: '⚡ WEAKNESS', text: d.weakness, color: 'var(--c-red)', tip: 'The exploitable crack; smart players should be able to find and use this'}),
    h('div', {style: {marginTop: 12}},
      h(Lbl, {mb: 6}, 'NAMED FACE'),
      h('div', {
        style: {
          borderRadius: 10, border: '1px solid var(--c-green)44',
          background: 'var(--c-green)11', overflow: 'hidden',
        },
      },
        h('button', {
          onClick: function() { setFaceOpen(function(v) { return !v; }); },
          title: faceOpen ? 'Click to collapse' : 'Click to reveal role',
          style: {
            width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, textAlign: 'left',
          },
        },
          h('div', {style: {fontWeight: 700, color: 'var(--gold)', fontSize: 17}}, d.face.name),
          h('div', {style: {fontSize: 12, color: 'var(--c-green)', transition: 'transform 0.2s', transform: faceOpen ? 'rotate(90deg)' : 'none'}}, '›')
        ),
        faceOpen && h('div', {style: {padding: '0 14px 12px', borderTop: '1px solid var(--c-green)22'}},
          h('div', {style: {paddingTop: 10, color: 'var(--text-dim)', fontSize: 'var(--text-sm)', fontStyle: 'italic', lineHeight: 1.5}}, d.face.role)
        )
      )
    ),
    h(GMNote, {text: 'Give this faction an aspect of its own - usually the goal rewritten as a truth. The named face is their point of contact - build them out with the Major NPC generator.'})
  );
}

function ComplicationResult(props) {
  var d = props.data;
  var _spot = useState(d.spotlight || 'aspect'); var spotlightChosen = _spot[0]; var setSpotlightChosen = _spot[1];
  var spotlightItems = [
    {id: 'aspect',  label: 'New Aspect',   text: d.new_aspect, color: 'var(--c-red)',    tip: 'Drop this new aspect into the fiction right now - name it aloud'},
    {id: 'arrival', label: 'Arrival',      text: d.arrival,    color: 'var(--c-blue)',   tip: 'Introduce the arrival this exchange'},
    {id: 'env',     label: 'Env. Shift',   text: d.env,        color: 'var(--c-green)',  tip: 'Trigger the environment shift immediately'},
  ];
  var spotlightTips = {
    aspect:  'Drop the new aspect into the fiction right now - name it aloud and tell the players it exists.',
    arrival: 'Introduce the arrival this exchange. They enter with their own agenda and no obligation to help.',
    env:     'Trigger the environment shift immediately. Describe what changes and what it now costs to act.',
  };
  return h('div', null,
    h(Lbl, null, 'SCENE COMPLICATION'),
    h('div', {style: {display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12, color: 'var(--c-purple)', border: '1px solid var(--c-purple)55', background: 'var(--c-purple)18'}}, d.type.toUpperCase()),
    // Spotlight selector
    h('div', {style: {marginBottom: 12}},
      h(Lbl, {mb: 6}, 'SPOTLIGHT - which to introduce first'),
      h('div', {style: {display: 'flex', gap: 4}},
        spotlightItems.map(function(item) {
          var isActive = spotlightChosen === item.id;
          return h('button', {
            key: item.id,
            onClick: function() { setSpotlightChosen(item.id); },
            style: {
              flex: 1, padding: '6px 4px', border: '1px solid ' + (isActive ? item.color : 'var(--border)'),
              borderRadius: 7, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-label)',
              fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
              background: isActive ? ('color-mix(in srgb, ' + item.color + ' 14%, transparent)') : 'var(--inset)',
              color: isActive ? item.color : 'var(--text-muted)', transition: 'all 0.15s',
            },
          }, item.label);
        })
      )
    ),
    // Show highlighted item first, then the others
    h('div', {style: {padding: '12px 14px', borderRadius: 10, border: '2px solid ' + spotlightItems.find(function(x){return x.id===spotlightChosen;}).color, background: 'color-mix(in srgb, ' + spotlightItems.find(function(x){return x.id===spotlightChosen;}).color + ' 8%, transparent)', marginBottom: 8, animation: 'fadeUp 0.2s ease both'}},
      h('div', {style: {fontSize: 'var(--text-label)', fontWeight: 700, color: spotlightItems.find(function(x){return x.id===spotlightChosen;}).color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5}}, '▶ INTRODUCE NOW: ' + spotlightItems.find(function(x){return x.id===spotlightChosen;}).label),
      h('div', {style: {fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 1.55}}, spotlightItems.find(function(x){return x.id===spotlightChosen;}).text)
    ),
    spotlightItems.filter(function(item) { return item.id !== spotlightChosen; }).map(function(item) {
      return h(InfoBox, {key: item.id, label: item.label, text: item.text, color: item.color});
    }),
    h(GMNote, {text: spotlightTips[spotlightChosen] + ' Let the players react before layering in the others.'})
  );
}

function BackstoryResult(props) {
  var d = props.data;
  var _exp = useState(-1); var expanded = _exp[0]; var setExpanded = _exp[1];
  return h('div', null,
    h(Lbl, null, 'PC BACKSTORY'),
    h(Lbl, {mb: 8}, 'SESSION ZERO QUESTIONS - tap to expand'),
    h('div', {style: {marginBottom: 14}},
      d.questions.map(function(q, i) {
        var isOpen = expanded === i;
        return h('div', {
          key: i,
          onClick: function() { setExpanded(function(v) { return v === i ? -1 : i; }); },
          style: {
            padding: '10px 14px', borderRadius: 10, marginBottom: 6,
            border: '1px solid ' + (isOpen ? 'var(--accent)88' : 'var(--accent)44'),
            background: isOpen ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'color-mix(in srgb, var(--accent) 4%, transparent)',
            cursor: 'pointer', transition: 'all 0.15s',
          },
        },
          h('div', {style: {display: 'flex', alignItems: 'flex-start', gap: 10}},
            h('div', {style: {color: 'var(--accent)', fontWeight: 700, fontSize: 'var(--text-sm)', flexShrink: 0, marginTop: 1}}, (i + 1) + '.'),
            h('div', {style: {flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 1.6}}, q),
            h('div', {style: {fontSize: 12, color: 'var(--text-muted)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none', flexShrink: 0}}, '›')
          ),
          isOpen && h('div', {style: {marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)'}},
            h('div', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 8}}, 'Player answer:'),
            h('div', {style: {minHeight: 40, borderRadius: 6, border: '1px dashed var(--border)', padding: '6px 10px', background: 'var(--inset)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)'}}, ' ')
          )
        );
      })
    ),
    h(InfoBox, {label: '🔗 RELATIONSHIP WEB', text: d.relationship, color: 'var(--c-blue)', tip: 'Relationship web - run this after individual questions; it creates cross-PC connections that become your strongest compel material'}),
    h(InfoBox, {label: '◎ OPENING HOOK', text: d.hook, color: 'var(--c-green)', tip: 'Opening hook - the framing for Session 1 Scene 1'}),
    h(GMNote, {text: 'Every answer should produce at least one aspect - write them down as the players speak. These are your primary compel material for the whole campaign.'})
  );
}

function ObstacleResult(props) {
  var d = props.data;
  var typeColor = {hazard: 'var(--c-red)', block: 'var(--c-blue)', distraction: 'var(--c-purple)'};
  var typeLabel = {hazard: 'HAZARD', block: 'BLOCK', distraction: 'DISTRACTION'};
  var typeTip = {
    hazard:      'Hazard - acts in initiative, attacks PCs. Cannot be attacked. Overcome or Create Advantage against it.',
    block:       'Block - passive opposition. Does not act in initiative. Disable difficulty = rating + 2.',
    distraction: 'Distraction - forces a choice with consequences on both sides. The drama is in the decision.',
  };
  var col = typeColor[d.obstacle_type] || 'var(--accent)';
  if (d.obstacle_type === 'distraction') {
    return h('div', null,
      h(Lbl, null, 'OBSTACLE'),
      h('div', {title: typeTip.distraction, style: {display:'inline-block', padding:'3px 10px', borderRadius:4, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:12, color:col, border:'1px solid '+col+'55', background:col+'18'}}, 'DISTRACTION'),
      h('div', {style:{fontSize:22, fontWeight:700, color:'var(--gold)', marginBottom:14}}, d.name),
      h(InfoBox, {label:'⚖ THE CHOICE', text:d.choice, color:'var(--c-purple)', tip:'Present this to the players - both options have consequences'}),
      h('div', {style:{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, margin:'12px 0'}},
        h('div', {style:{padding:'10px 14px', borderRadius:6, border:'1px solid var(--c-red)44', background:'var(--c-red)11'}},
          h('div', {style:{fontSize:12, fontWeight:700, color:'var(--c-red)', letterSpacing:1, marginBottom:4}}, 'LEAVE IT'),
          h('div', {style:{fontSize:'var(--text-sm)', color:'var(--text-dim)'}}, d.repercussion_leave)
        ),
        h('div', {style:{padding:'10px 14px', borderRadius:6, border:'1px solid var(--c-blue)44', background:'var(--c-blue)11'}},
          h('div', {style:{fontSize:12, fontWeight:700, color:'var(--c-blue)', letterSpacing:1, marginBottom:4}}, 'DEAL WITH IT'),
          h('div', {style:{fontSize:'var(--text-sm)', color:'var(--text-dim)'}}, d.repercussion_deal)
        )
      ),
      d.opposition ? h('div', {style:{fontSize:'var(--text-sm)', color:'var(--text-dim)', marginTop:8}}, 'Opposition (if rolled): ' + d.opposition_label + ' (+' + d.opposition + ')') : null,
      h(GMNote, {text: d.gm_note})
    );
  }
  return h('div', null,
    h(Lbl, null, 'OBSTACLE'),
    h('div', {title: typeTip[d.obstacle_type], style: {display:'inline-block', padding:'3px 10px', borderRadius:4, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:12, color:col, border:'1px solid '+col+'55', background:col+'18'}}, typeLabel[d.obstacle_type]),
    h('div', {style:{fontSize:22, fontWeight:700, color:'var(--gold)', marginBottom:14}}, d.name),
    h(AspectBadge, {text: d.aspect, color: col, label: typeLabel[d.obstacle_type] + ' aspect - invoke or compel as normal'}),
    h('div', {style:{display:'flex', gap:16, flexWrap:'wrap', margin:'12px 0'}},
      h('div', {style:{fontSize:'var(--text-sm)', color:'var(--text-dim)'}}, 'Rating: ', h('strong', {style:{color:'var(--text)'}}, d.rating_label + ' (+' + d.rating + ')')),
      d.weapon > 0 ? h('div', {style:{fontSize:'var(--text-sm)', color:'var(--c-red)'}}, 'Weapon: ' + d.weapon) : null,
      d.obstacle_type === 'block' ? h('div', {style:{fontSize:'var(--text-sm)', color:'var(--text-dim)'}}, 'Disable: +' + (d.rating + 2)) : null
    ),
    h(InfoBox, {label:'🔧 HOW TO DISABLE', text:d.disable, color:'var(--c-green)', tip:'How PCs can neutralize this obstacle'}),
    h(GMNote, {text: d.gm_note})
  );
}

function CountdownResult(props) {
  var d = props.data;
  var _filled = useState(0); var filled = _filled[0]; var setFilled = _filled[1];
  var _particles = useState([]); var particles = _particles[0]; var setParticles = _particles[1];
  var triggered = filled >= d.boxes;
  var pct = d.boxes > 0 ? filled / d.boxes : 0;
  var barColor = pct < 0.5 ? 'var(--accent)' : pct < 0.75 ? 'var(--c-purple)' : 'var(--c-red)';

  function markBox(i) {
    var next = filled === i + 1 ? i : i + 1;
    var wasTriggered = filled >= d.boxes;
    setFilled(next);
    if (next >= d.boxes && !wasTriggered) {
      // Fire particles
      var pts = Array.from({length: 12}, function(_, p) {
        var angle = p * 30 * (Math.PI / 180);
        var r = 40 + Math.random() * 25;
        return {
          id: p,
          px: Math.round(Math.cos(angle) * r),
          py: Math.round(Math.sin(angle) * r),
        };
      });
      setParticles(pts);
      setTimeout(function() { setParticles([]); }, 700);
      if (navigator.vibrate) navigator.vibrate([30, 50, 100]);
    }
  }

  return h('div', null,
    h(Lbl, null, 'COUNTDOWN'),
    h('div', {className: triggered ? 'cd-name-pop' : '', style:{fontSize:22, fontWeight:700, color: triggered ? 'var(--c-red)' : 'var(--gold)', marginBottom:14, transition:'color 0.3s'}}, d.name),
    h('div', {className: triggered ? 'cd-triggered-shake' : '', style:{position:'relative', padding:'14px 12px', borderRadius:12, marginBottom:10, border:'1px solid ' + (triggered ? 'var(--c-red)66' : 'var(--border)'), background:'var(--inset)', overflow:'visible', transition:'border-color 0.3s'}},
      h('div', {style:{position:'absolute', top:0, left:0, height:'100%', width: (pct*100)+'%', background:'color-mix(in srgb, ' + barColor + ' 12%, transparent)', transition:'width 0.3s, background 0.3s', pointerEvents:'none', borderRadius:12}}),
      // Particles
      particles.map(function(p) {
        return h('div', {key: p.id, className: 'cd-particle', style: {'--px': p.px+'px', '--py': p.py+'px', animationDelay: (p.id * 0.025) + 's'}});
      }),
      h('div', {style:{fontSize:'var(--text-label)', color: triggered ? 'var(--c-red)' : barColor, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10, position:'relative', transition:'color 0.3s'}},
        triggered ? '⚡ TRIGGERED' : 'TRACK - tap to mark'
      ),
      h('div', {style:{display:'flex', gap:6, flexWrap:'wrap', position:'relative', marginBottom:8}},
        Array.from({length: d.boxes}, function(_, i) {
          var isMarked = i < filled;
          var boxColor = i < filled * 0.5 ? 'var(--accent)' : i < filled * 0.75 ? 'var(--c-purple)' : 'var(--c-red)';
          return h('div', {
            key: i,
            title: isMarked ? 'Click to unmark' : 'Click to mark',
            onClick: function() { markBox(i); },
            style: {
              width: 32, height: 32, borderRadius: 8, cursor:'pointer', transition:'all 0.2s',
              border: '2px solid ' + (isMarked ? boxColor : 'var(--border)'),
              background: isMarked ? ('color-mix(in srgb, ' + boxColor + ' 25%, transparent)') : 'transparent',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:13, fontWeight:800, color: isMarked ? boxColor : 'var(--text-muted)',
            },
          }, isMarked ? '✕' : String(i+1));
        })
      ),
      h('div', {style:{fontSize:'var(--text-label)', color:'var(--text-muted)', position:'relative'}}, filled + ' of ' + d.boxes + ' · measured in ' + d.unit)
    ),
    h(InfoBox, {label:'⚡ TRIGGER', text:d.trigger, color:'var(--c-red)', tip:'The event that marks a box on the countdown track'}),
    h('div', {
      className: triggered ? 'cd-outcome-appear' : '',
      style:{
        padding:'12px 14px', borderRadius:10, marginTop:4, transition:'all 0.3s',
        border:'1px solid ' + (triggered ? 'var(--c-red)' : 'var(--c-red)44'),
        background: triggered ? 'color-mix(in srgb, var(--c-red) 15%, transparent)' : 'color-mix(in srgb, var(--c-red) 6%, transparent)',
      },
    },
      h('div', {style:{fontSize:12, fontWeight:700, color:'var(--c-red)', letterSpacing:1, textTransform:'uppercase', marginBottom:5}}, triggered ? '💀 TRIGGERED - THIS HAPPENS NOW' : '💀 WHEN THE CLOCK HITS ZERO'),
      h('div', {style:{fontSize:'var(--text-sm)', color: triggered ? 'var(--text)' : 'var(--text-dim)', fontWeight: triggered ? 600 : 400, lineHeight:1.55}}, d.outcome)
    ),
    h(GMNote, {text: d.gm_note})
  );
}

function ConstraintResult(props) {
  var d = props.data;
  var _done = useState(false); var bypassDone = _done[0]; var setBypassDone = _done[1];
  var isLim = d.constraint_type === 'limitation';
  var col = isLim ? 'var(--c-purple)' : 'var(--c-blue)';
  var tag = isLim ? 'LIMITATION' : 'RESISTANCE';
  var tagTip = isLim
    ? 'Limitation - restricts a PC action with consequences. Players can still act; the question is whether the cost is worth it.'
    : 'Resistance - makes the target immune to a category of action until a specific bypass is achieved. Forces Plan B.';
  return h('div', null,
    h(Lbl, null, 'CONSTRAINT'),
    h('div', {title: tagTip, style: {display:'inline-block', padding:'3px 10px', borderRadius:4, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:12, color:col, border:'1px solid '+col+'55', background:col+'18'}}, tag),
    h('div', {style:{fontSize:22, fontWeight:700, color:'var(--gold)', marginBottom:14}}, d.name),
    isLim
      ? h(Fragment, null,
          h(InfoBox, {label:'🚫 RESTRICTED ACTION', text:d.restricted_action, color:'var(--c-purple)', tip:'What the PCs cannot do freely - announce this before they act'}),
          h(InfoBox, {label:'⚡ CONSEQUENCE IF TAKEN ANYWAY', text:d.consequence, color:'var(--c-red)', tip:'What happens if they do it anyway - this is the cost, not a prohibition'})
        )
      : h(Fragment, null,
          h(InfoBox, {label:'🛡 WHAT IT RESISTS', text:d.what_resists, color:'var(--c-blue)', tip:'What category of action is blocked'}),
          // Bypass with completion toggle
          h('div', {
            onClick: function() { setBypassDone(function(v) { return !v; }); },
            style: {
              padding:'10px 14px', borderRadius:8, marginBottom:8, cursor:'pointer', transition:'all 0.2s',
              border:'1px solid ' + (bypassDone ? 'var(--c-green)' : 'var(--c-green)44'),
              background: bypassDone ? 'color-mix(in srgb, var(--c-green) 12%, transparent)' : 'color-mix(in srgb, var(--c-green) 4%, transparent)',
            },
          },
            h('div', {style:{display:'flex', alignItems:'flex-start', gap:10}},
              h('div', {style:{width:18, height:18, borderRadius:4, flexShrink:0, marginTop:1, border:'1.5px solid ' + (bypassDone ? 'var(--c-green)' : 'var(--border)'), background: bypassDone ? 'var(--c-green)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'var(--bg)', transition:'all 0.15s'}}, bypassDone ? '✓' : ''),
              h('div', null,
                h('div', {style:{fontSize:'var(--text-label)', fontWeight:700, color:'var(--c-green)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:4}}, '🔓 HOW TO BYPASS' + (bypassDone ? ' - DONE' : '')),
                h('div', {style:{fontSize:'var(--text-sm)', color: bypassDone ? 'var(--text)' : 'var(--text-dim)', lineHeight:1.55, textDecoration: bypassDone ? 'line-through' : 'none'}}, d.bypass)
              )
            )
          )
        ),
    h(GMNote, {text: d.gm_note})
  );
}



function renderResult(genId, data) {
  switch (genId) {
    case 'npc_minor':    return h(MinorResult,        {data: data});
    case 'npc_major':    return h(MajorResult,        {data: data});
    case 'scene':        return h(SceneResult,        {data: data});
    case 'campaign':     return h(CampaignResult,     {data: data});
    case 'encounter':    return h(EncounterResult,    {data: data});
    case 'seed':         return h(SeedResult,         {data: data});
    case 'compel':       return h(CompelResult,       {data: data});
    case 'challenge':    return h(ChallengeResult,    {data: data});
    case 'contest':      return h(ContestResult,      {data: data});
    case 'consequence':  return h(ConsequenceResult,  {data: data});
    case 'faction':      return h(FactionResult,      {data: data});
    case 'complication': return h(ComplicationResult, {data: data});
    case 'backstory':    return h(BackstoryResult,    {data: data});
    case 'obstacle':     return h(ObstacleResult,     {data: data});
    case 'countdown':    return h(CountdownResult,    {data: data});
    case 'constraint':   return h(ConstraintResult,   {data: data});
    default: return null;
  }
}

// ════════════════════════════════════════════════════════════════════════
// MODAL PRIMITIVE
// ════════════════════════════════════════════════════════════════════════

function Modal(props) {
  var boxRef = useRef(null);

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
    var box = boxRef.current;
    if (!box) return;
    var FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var nodes = Array.prototype.slice.call(box.querySelectorAll(FOCUSABLE));
    if (nodes.length) nodes[0].focus();
    function trapTab(e) {
      if (e.key !== 'Tab') return;
      var live = Array.prototype.slice.call(box.querySelectorAll(FOCUSABLE));
      if (!live.length) { e.preventDefault(); return; }
      var first = live[0]; var last = live[live.length - 1];
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
  var genId = props.genId; var data = props.data; var campName = props.campName;
  var _c = useState(null); var copiedFormat = _c[0]; var setCopiedFormat = _c[1];

  // _batchMd is set when exporting a full pinned session pack via old-browser fallback
  var md = (data && data._batchMd) ? data._batchMd : toMarkdown(genId, data, campName);

  // VTT exports only make sense for NPC generators
  var isNpc = genId === 'npc_minor' || genId === 'npc_major';
  var fariJson  = isNpc ? toFariJSON(genId, data, campName)  : null;
  var roll20Json = isNpc ? toRoll20JSON(genId, data)          : null;

  function copyTo(text, format) {
    if (!text) return;
    function confirm() {
      setCopiedFormat(format);
      setTimeout(function() { setCopiedFormat(null); }, TIMING.COPY_CONFIRM_MS);
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(confirm);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      confirm();
    }
  }

  function downloadFile() {
    var blob = new Blob([md], {type: 'text/markdown;charset=utf-8'});
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href = url;
    a.download = (campName || 'fate').replace(/\s+/g, '_') + '_' + genId + '.md';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  return h('div', {
    className: 'share-drawer',
    role: 'region',
    'aria-label': 'Share options',
    style: {
      borderTop: '1px solid var(--border)',
      background: 'var(--inset)',
      padding: '10px 16px',
    }
  },
    // ── Row 1: Markdown + file + print ────────────────────────────────
    h('div', {style: {display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: isNpc ? 8 : 0}},
      h('span', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 4}}, 'Export / Print'),
      h('button', {
        className: 'btn btn-primary' + (copiedFormat === 'md' ? ' export-copied' : ''),
        onClick: function() { copyTo(md, 'md'); },
        style: {fontSize: 12, padding: '4px 12px', minHeight: 0},
      }, copiedFormat === 'md' ? '✓ Copied!' : '📋 Copy Markdown'),
      h('button', {
        className: 'btn btn-ghost',
        onClick: downloadFile,
        title: 'Save as .md file',
        style: {fontSize: 12, padding: '4px 12px', minHeight: 0},
      }, '💾 Save .md'),
      h('button', {
        className: 'btn btn-ghost',
        onClick: function() { window.print(); },
        title: 'Print or save as PDF',
        style: {fontSize: 12, padding: '4px 12px', minHeight: 0},
      }, '🖨 Print'),
      h('button', {
        className: 'btn btn-icon btn-ghost',
        onClick: props.onClose,
        'aria-label': 'Close share options',
        style: {marginLeft: 'auto', fontSize: 13},
      }, '✕')
    ),

    // ── Row 2: VTT exports (NPC generators only) ──────────────────────
    isNpc && h('div', {style: {display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--border)'}},
      h('span', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 4}}, 'VTT Export'),

      h('button', {
        className: 'btn btn-ghost' + (copiedFormat === 'fari' ? ' export-copied' : ''),
        onClick: function() { copyTo(fariJson, 'fari'); },
        title: 'Fari App: Characters → Import\nFoundry VTT (Fate Core Official): paste into character importer',
        style: {fontSize: 12, padding: '4px 12px', minHeight: 0},
      }, copiedFormat === 'fari' ? '✓ Copied!' : '🎲 Fari / Foundry'),

      h('button', {
        className: 'btn btn-ghost' + (copiedFormat === 'roll20' ? ' export-copied' : ''),
        onClick: function() { copyTo(roll20Json, 'roll20'); },
        title: 'Roll20: open "Fate by Evil Hat" sheet → Developer Mode → paste into import box',
        style: {fontSize: 12, padding: '4px 12px', minHeight: 0},
      }, copiedFormat === 'roll20' ? '✓ Copied!' : '🎲 Roll20'),

      h('span', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)', fontStyle: 'italic', marginLeft: 4}},
        genId === 'npc_minor' ? 'Minor NPC' : 'Major NPC'
      )
    )
  );
}


// ════════════════════════════════════════════════════════════════════════
// HELP MODAL
// ════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════
// KB SHORTCUTS MODAL
// ════════════════════════════════════════════════════════════════════════

function KBShortcutsModal(props) {
  var shortcuts = [
    ['Space', 'Roll current generator'],
    ['G',     'Cycle to next generator'],
    ['P',     'Pin current result'],
    ['Z',     'Undo last pin'],
    ['I',     'Inspiration mode - roll 3, pick one'],
    ['C',     'Copy result as Markdown'],
    ['?',     'Open this shortcuts panel'],
    ['Esc',   'Close any open panel or sidebar'],
  ];
  return h(Modal, {onClose: props.onClose, label: 'Keyboard shortcuts'},
    h(ModalHeader, {title: 'KB Shortcuts', onClose: props.onClose}),
    h('div', {className: 'modal-body'},
      h('div', {className: 'kbd-grid', style: {marginTop: 4}},
        shortcuts.map(function(row) {
          return h('div', {key: row[0], className: 'kbd-row'},
            h('kbd', {className: 'kbd-key'}, row[0]),
            h('span', {className: 'kbd-desc'}, row[1])
          );
        })
      )
    )
  );
}

function HelpModal(props) {
  var genId = props.genId;
  var hc = HELP_CONTENT[genId] || {};

  return h(Modal, {onClose: props.onClose, label: 'Help - ' + (hc.title || genId)},
    h('div', {className: 'modal-header'},
      h('div', {className: 'modal-title'}, 'Help - ' + (hc.title || 'Generator')),
      h('button', {className: 'btn btn-icon btn-ghost', onClick: props.onClose, 'aria-label': 'Close'}, '✕')
    ),
    h('div', {className: 'modal-body'},
      h('div', {className: 'help-section'},
        h('div', {className: 'help-section-lbl'}, 'What this generates'),
        h('div', {style: {fontSize: 15, color: 'var(--text)', lineHeight: 1.6}}, hc.what || '')
      ),
      h('div', {className: 'help-section'},
        h('div', {className: 'help-section-lbl'}, 'Output structure'),
        h('div', {style: {fontSize: 15, color: 'var(--text-dim)', lineHeight: 1.6}}, hc.output || '')
      ),
      h('div', {className: 'help-section'},
        h('div', {className: 'help-section-lbl'}, 'Rules reference (Fate Condensed)'),
        (function() {
          var entry = (HELP_ENTRIES || []).find(function(e) { return e.id === genId; });
          var srdUrl = entry && entry.srd_url;
          return (hc.rules || hc.how || []).map(function(r, i) {
            return h('div', {key: i, className: 'help-rule-row'},
              h('span', {className: 'help-rule-icon'}, '◈'),
              h('span', {className: 'help-rule-text'}, r),
              srdUrl && h('a', {
                className: 'help-rule-srd',
                href: srdUrl,
                target: '_blank', rel: 'noopener noreferrer',
                title: 'Read on fate-srd.com',
              }, 'SRD ↗')
            );
          });
        })()
      ),
      (hc.tips && hc.tips.length > 0) ? h('div', {className: 'help-section'},
        h('div', {className: 'help-section-lbl'}, 'Tips'),
        (hc.tips).map(function(t, i) {
          return h('div', {key: i, className: 'help-rule-row'},
            h('span', {className: 'help-rule-icon'}, '💡'),
            h('span', {className: 'help-rule-text'}, t)
          );
        })
      ) : null,
      h('div', {className: 'help-gm-tip gm-guidance'},
        h('div', {className: 'help-gm-tip-label'}, 'GM Tip'),
        h('div', {className: 'help-gm-tip-text'}, hc.gm_tips || '')
      ),
      // Invoke & compel examples — shown in GM Tips tab
      (hc.invoke_example || hc.compel_example) && h('div', {className: 'help-section gm-guidance', style: {marginTop: 10}},
        h('div', {className: 'help-section-lbl'}, '✦ Invoke & Compel Examples'),
        hc.invoke_example && h('div', {style: {marginBottom: 10}},
          h('div', {style: {fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4}}, '✦ Invoke for +2'),
          h('div', {style: {fontSize: 14, color: 'var(--text)', lineHeight: 1.55, padding: '8px 10px', background: 'var(--inset)', borderRadius: 8, borderLeft: '2px solid var(--accent)'}}, hc.invoke_example)
        ),
        hc.compel_example && h('div', null,
          h('div', {style: {fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-red)', marginBottom: 4}}, '⊗ Compel for drama'),
          h('div', {style: {fontSize: 14, color: 'var(--text)', lineHeight: 1.55, padding: '8px 10px', background: 'var(--inset)', borderRadius: 8, borderLeft: '2px solid var(--c-red)'}}, hc.compel_example)
        )
      ),

    )
  );
}

// ════════════════════════════════════════════════════════════════════════
// FULL HELP PANEL (all generators overview)
// ════════════════════════════════════════════════════════════════════════

function HelpPanel(props) {
  return h('div', {
    role: 'dialog', 'aria-modal': 'true', 'aria-label': 'How to use this generator',
    className: 'modal-overlay',
    onClick: function(e) { if (e.target === e.currentTarget) props.onClose(); },
  },
    h('div', {
      style: {
        background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12,
        maxWidth: 700, width: '100%', padding: 24, maxHeight: '85vh',
        overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      },
      onClick: function(e) { e.stopPropagation(); },
    },
      h('div', {style: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}},
        h('div', {style: {fontSize: 18, fontWeight: 700, color: 'var(--gold)'}}, 'How to Use This Generator'),
        h('button', {
          className: 'btn btn-ghost',
          onClick: props.onClose,
          'aria-label': 'Close help',
        }, '✕ Close')
      ),
      h('p', {style: {color: 'var(--text-dim)', fontSize: 15, marginBottom: 20, lineHeight: 1.6}},
        'This is a ', h('strong', {style: {color: 'var(--text)'}}, 'Fate Condensed'),
        ' GM prep tool. Each generator draws from hundreds of curated, setting-specific table entries. Fully offline once loaded - roll as often as you like, re-roll anything that doesn\'t fit.'
      ),
      h('div', {style: {fontSize: 15, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12}}, 'Generators'),
      (HELP_ENTRIES || []).map(function(entry) {
        return h('div', {key: entry.id, style: {marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid var(--border)'}},
          h('div', {style: {display: 'flex', gap: 10, alignItems: 'flex-start'}},
            h('div', {style: {fontSize: 20, color: 'var(--accent)', flexShrink: 0, marginTop: 2}}, entry.icon),
            h('div', {style: {flex: 1}},
              h('div', {style: {fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4}}, entry.label),
              h('div', {style: {fontSize: 15, color: 'var(--text-dim)', lineHeight: 1.55, marginBottom: 6}}, entry.what),
              h('div', {style: {fontSize: 15, color: 'var(--text-dim)', lineHeight: 1.55, marginBottom: 4}},
                h('strong', {style: {color: 'var(--text-muted)'}}, 'How to use: '), entry.how
              ),
              h('div', {style: {fontSize: 15, color: 'var(--accent)', lineHeight: 1.55, marginBottom: 4}},
                h('strong', null, 'Tip: '), entry.tip
              ),
              h('div', {style: {fontSize: 15, color: 'var(--text-muted)', fontStyle: 'italic'}}, entry.rule)
            )
          )
        );
      }),
      h('div', {style: {marginTop: 20, background: 'var(--inset)', borderRadius: 12, padding: '14px 16px'}},
        h('div', {style: {fontSize: 15, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8}}, 'Fate Condensed - Core Concepts'),
        [
          ['Aspects', 'Phrases that are always true in the fiction. Invoke for +2 or a reroll (costs a fate point). Compel to complicate a character\'s life (GM gives a fate point).'],
          ['Stress', 'Temporary hits. 1-point boxes in Fate Condensed (not escalating like Fate Core). Minor NPCs have no consequences - one good hit takes them out.'],
          ['Success at a Cost', 'When a PC fails a roll, the GM can offer success at a minor cost (a complication, a bad aspect) or a major cost (a consequence, a serious setback). This is the "Yes, but..." engine - use it instead of flat failure. (p.16)'],
          ['Initiative', 'Popcorn / Balsera-style: the acting character picks who goes next - PC or NPC. No fixed turn order. Tactical and social. (p.31)'],
          ['Fate Points', 'Currency of player agency. PCs start with Refresh fate points each session. GM starts each scene with points equal to the number of PCs.'],
          ['Conceding', 'A character can concede before being taken out. They negotiate terms of their exit (they stay in the story) and earn one fate point per consequence taken in the conflict. Villains should concede too. (p.37)'],
          ['Exchanges', 'Fate uses "exchanges" not "rounds". An exchange ends when everyone has acted. There is no fixed initiative count - just the popcorn pass.'],
          ['Full Defense', 'Optional (p.48): Skip your action to get +2 to all defend rolls until your next turn. If nothing attacks you, you get a boost instead.'],
          ['Teamwork', 'One character rolls, others contribute +1 each if they have at least Average (+1) in a relevant skill. (p.32)'],
          ['Advancement', 'Minor Milestone (end of every session): swap skills, rewrite a stunt, or rewrite an aspect. Major Milestone (end of a story arc): do one minor milestone option PLUS increase one skill by one step - and optionally rewrite your high concept. No XP, no levels. (FCon p.39)'],
        ].map(function(pair, i) {
          return h('div', {key: i, style: {marginBottom: 8}},
            h('div', {style: {fontSize: 15, fontWeight: 700, color: 'var(--accent)', marginBottom: 2}}, pair[0]),
            h('div', {style: {fontSize: 15, color: 'var(--text-dim)', lineHeight: 1.5}}, pair[1])
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
  var on = !!props.value;
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
// HELP LEVEL ONBOARDING MODAL
// Fires once on first campaign visit. Surfaces Help Level so C1/C2 users
// actually find the feature that was designed for them.
// Stored in localStorage as fate_onboarding_done = '1'.
// ════════════════════════════════════════════════════════════════════════

function HelpLevelOnboardingModal(props) {
  var LEVEL_OPTIONS = [
    {id: 'new_ttrpg',    icon: '🌱', label: 'New to tabletop RPGs',    desc: 'Gentle explanations - no prior RPG experience needed'},
    {id: 'dnd_convert',  icon: '⚔',  label: 'I play D&D / Pathfinder',  desc: 'Rules help + side-by-side D&D comparisons'},
    {id: 'new_fate',     icon: '🎲', label: 'I play other RPGs',         desc: 'Fate mechanics explained, no jargon'},
    {id: 'experienced',  icon: '🎭', label: 'I know Fate well',          desc: 'Minimal help - just the generated content'},
  ];
  return h('div', {
    className: 'modal-overlay',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Choose your experience level',
    style: {zIndex: 9999},
  },
    h('div', {
      className: 'modal-box modal-box-narrow',
      onClick: function(e) { e.stopPropagation(); },
      style: {maxWidth: 420},
    },
      h('div', {className: 'modal-header'},
        h('div', {className: 'modal-title'}, '👋 Quick question'),
      ),
      h('div', {style: {padding: '4px 20px 8px', fontSize: 'var(--text-sm)', color: 'var(--text-dim)', lineHeight: 1.6}},
        'How much Fate experience do you have? This sets the ', h('strong', null, 'Help Level'), ' - inline rules coaching you\'ll see on every result. You can change it any time in ⚙ Settings.'
      ),
      h('div', {style: {padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8}},
        LEVEL_OPTIONS.map(function(opt) {
          return h('button', {
            key: opt.id,
            onClick: function() { props.onSelect(opt.id); },
            style: {
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
              borderRadius: 'var(--glass-radius)', border: '1px solid var(--border)',
              background: 'var(--panel)', cursor: 'pointer', textAlign: 'left',
              fontFamily: 'var(--font-ui)', transition: 'all 0.15s', width: '100%',
            },
            'aria-label': opt.label + ' - ' + opt.desc,
            onMouseEnter: function(e) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 8%, transparent)'; },
            onMouseLeave: function(e) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--panel)'; },
          },
            h('span', {style: {fontSize: 24, flexShrink: 0, width: 32, textAlign: 'center'}}, opt.icon),
            h('div', null,
              h('div', {style: {fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text)'}}, opt.label),
              h('div', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)', marginTop: 2}}, opt.desc)
            )
          );
        }),
        h('button', {
          onClick: function() { props.onSelect('new_fate'); },
          style: {
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
            fontSize: 'var(--text-label)', fontFamily: 'var(--font-ui)', padding: '4px 0', textAlign: 'center',
          },
          'aria-label': 'Skip this question',
        }, 'Skip')
      )
    )
  );
}

function SettingsModal(props) {
  var TEXT_SIZE_NAMES = ['Default', 'Large', 'Extra Large'];
  var LEVEL_OPTIONS = [
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
                h('div', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)'}}, opt.desc)
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
        h('a', {href: '../learn.html', className: 'btn btn-ghost', style: {fontSize: 13, textDecoration: 'none', flex: 1, justifyContent: 'center'}}, '📖 Quick Start'),
        h('a', {href: '../about.html', className: 'btn btn-ghost', style: {fontSize: 13, textDecoration: 'none', flex: 1, justifyContent: 'center'}}, 'About'),
        h('a', {href: '../license.html', className: 'btn btn-ghost', style: {fontSize: 13, textDecoration: 'none', flex: 1, justifyContent: 'center'}}, 'License')
      )
    )
  );
}

function ThemeToggle(props) {
  var isDark = props.theme === 'dark';
  return h('button', {
    className: 'btn btn-icon btn-ghost',
    onClick: props.onToggle,
    'aria-label': isDark ? 'Switch to light mode' : 'Switch to dark mode',
    title: isDark ? 'Light mode' : 'Dark mode',
  }, isDark ? '☀️' : '🌙');
}

var TEXT_SIZE_LABELS = ['A', 'A⁺', 'A⁺⁺'];
var TEXT_SIZE_TITLES = [
  'Normal text - click to increase',
  'Large text - click to increase',
  'Extra-large text - click to reset',
];
function TextSizeToggle(props) {
  var sz = props.size || 0;
  return h('button', {
    className: 'btn btn-icon btn-ghost',
    onClick: props.onToggle,
    title: TEXT_SIZE_TITLES[sz],
    'aria-label': 'Text size ' + TEXT_SIZE_LABELS[sz],
    style: { fontSize: [13, 15, 17][sz], fontWeight: 800, letterSpacing: '-0.02em', minWidth: 38 },
  }, TEXT_SIZE_LABELS[sz]);
}

// ════════════════════════════════════════════════════════════════════════
// LANDING PAGE APP (used by index.html)
// ════════════════════════════════════════════════════════════════════════

var CAMPAIGN_PAGES = {
  thelongafter: 'campaigns/thelongafter.html',
  cyberpunk: 'campaigns/cyberpunk.html',
  fantasy:   'campaigns/fantasy.html',
  space:     'campaigns/space.html',
  victorian: 'campaigns/victorian.html',
  postapoc:  'campaigns/postapoc.html',
  western:   'campaigns/western.html',
};

var CAMPAIGN_GUIDE_PAGES = {
  thelongafter: 'campaigns/guide-thelongafter.html',
  cyberpunk:    'campaigns/guide-cyberpunk.html',
  fantasy:      'campaigns/guide-fantasy.html',
  space:        'campaigns/guide-space.html',
  victorian:    'campaigns/guide-victorian.html',
  postapoc:     'campaigns/guide-postapoc.html',
  western:      'campaigns/guide-western.html',
};

var CAMPAIGN_INFO = {
  thelongafter: {genre: 'Sword & Planet',  vibes: 'Nausicaä · Thundarr · Book of the New Sun', tones: ['action','weird'], era: 'swords', hook: 'Warlords and ruined gods in the wreckage of civilisation'},
  cyberpunk:    {genre: 'Cyberpunk',       vibes: 'Neuromancer · Blade Runner · Edgerunners',   tones: ['action','dark'],  era: 'guns',   hook: 'Chrome, corp-blood, and the city that eats its own'},
  fantasy:      {genre: 'Dark Fantasy',    vibes: 'Malazan · Black Company · Witcher',           tones: ['dark','weird'],   era: 'swords', hook: 'Grim blades, older magic, and the weight of history'},
  space:        {genre: 'Space Western',   vibes: 'Firefly · The Expanse · Cowboy Bebop',        tones: ['action','dark'],  era: 'stars',  hook: 'Hard vacuum, hard choices, and no one coming to help'},
  victorian:    {genre: 'Gothic Horror',   vibes: 'Penny Dreadful · From Hell · The Prestige',   tones: ['dark','weird'],   era: 'swords', hook: 'Gaslight and secrets and things that should not exist'},
  postapoc:     {genre: 'Post-Apocalypse', vibes: 'Mad Max · Last of Us · Station Eleven',       tones: ['action','dark'],  era: 'guns',   hook: 'The world already ended. Survive what comes next'},
  western:      {genre: 'Frontier Western',  vibes: 'Blood Meridian · Deadwood · True Grit',       tones: ['action','dark'],  era: 'guns',   hook: 'Frontier justice. Railroad money and the weight of the old war'},
};

function LandingApp() {
  var _t = useState(getTheme()); var theme = _t[0]; var setTheme = _t[1];
  function toggleTheme() {
    var next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next); setTheme(next);
  }
  var camps = Object.values(CAMPAIGNS);

  // R-11: Last-used campaign - read from localStorage session data
  var lastCamp = (function() {
    try {
      var ids = Object.keys(CAMPAIGN_PAGES);
      for (var i = 0; i < ids.length; i++) {
        var saved = null;
        try { saved = JSON.parse(localStorage.getItem('fate_' + ids[i])); } catch(e) {}
        if (saved && saved.result) return {id: ids[i], href: CAMPAIGN_PAGES[ids[i]]};
      }
    } catch(e) {}
    return null;
  })();

  return h('div', {className: 'land-shell'},
    h('a', {href: '#main', className: 'skip-link'}, 'Skip to main content'),

    // ── Topbar — unified chrome (wordmark + breadcrumb + nav) ────────────
    h('header', {className: 'land-topnav topbar', role: 'banner'},
      h('a', {href: 'index.html', className: 'topbar-wordmark', 'aria-label': 'Ogma home'}, 'OGMA'),
      h('div', {className: 'topbar-sep', 'aria-hidden': 'true'}),
      h('nav', {className: 'topbar-crumb', 'aria-label': 'Breadcrumb'},
        h('span', {className: 'topbar-crumb-item current', 'aria-current': 'page'}, 'Campaign Select')
      ),
      h('div', {className: 'topbar-status'},
        h('a', {href: 'learn.html', className: 'btn btn-ghost topbar-nav-btn topbar-nav-hide-sm', style: {textDecoration: 'none'}}, '📖 Quick Start'),
        h('a', {href: 'campaigns/transition.html', className: 'btn btn-ghost topbar-nav-btn topbar-nav-hide-sm', style: {textDecoration: 'none'}}, '⚔ D&D Guide'),
        h('a', {href: 'about.html', className: 'btn btn-ghost topbar-nav-btn topbar-nav-hide-sm', style: {textDecoration: 'none'}}, 'About'),
        h('button', {
          className: 'btn btn-icon btn-ghost',
          onClick: toggleTheme,
          'aria-label': theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
          title: theme === 'dark' ? 'Light mode' : 'Dark mode',
          style: {width: 44, height: 44},
        }, theme === 'dark' ? '☀️' : '🌙')
      )
    ),

    h('main', {id: 'main'},

      // ── Hero ──────────────────────────────────────────────────────────
      h('div', {className: 'land-hero'},
        h('div', {className: 'land-hero-inner'},
          h('p', {className: 'land-hero-eyebrow'},
            h('strong', null, 'O'), 'n-demand ',
            h('strong', null, 'G'), 'enerator for ',
            h('strong', null, 'M'), 'asterful ',
            h('strong', null, 'A'), 'dventures'
          ),
          h('h1', {className: 'land-hero-title'},
            'Your session is in two hours.',
            h('br', null),
            h('span', {className: 'land-hero-sub'}, 'Pick a world. Roll. Play.')
          ),
          h('p', {className: 'land-hero-desc'},
            'Rules-accurate NPCs, scenes, and encounters - generated in one click, ready for the table.'
          ),
          h('div', {className: 'land-hero-pills'},
            h('span', {className: 'land-hero-pill'}, '📴 Fully offline'),
            h('span', {className: 'land-hero-pill'}, '🔓 Free forever'),
            h('span', {className: 'land-hero-pill'}, '🖨 Print-ready'),
            h('span', {className: 'land-hero-pill'}, '⚡ One click')
          ),
          lastCamp && h('a', {
            href: lastCamp.href,
            className: 'land-continue-btn',
            'aria-label': 'Continue ' + lastCamp.id,
          },
            '↩ Continue with ', h('strong', null, (CAMPAIGNS[lastCamp.id] || {}).meta && CAMPAIGNS[lastCamp.id].meta.icon + ' ' + CAMPAIGNS[lastCamp.id].meta.name || lastCamp.id),
            h('span', {className: 'land-continue-arrow'}, ' →')
          )
        )
      ),

      // ── World picker - the primary CTA ───────────────────────────────
      h('div', {className: 'land-worlds-section', id: 'worlds'},
        h('div', {className: 'land-worlds-inner'},
          h('h2', {className: 'land-section-heading'}, 'Choose your world'),
          h('div', {className: 'land-worlds-grid'},
            camps.map(function(camp, idx) {
              var info = CAMPAIGN_INFO[camp.meta.id] || {};
              return h('a', {
                key: camp.meta.id,
                href: CAMPAIGN_PAGES[camp.meta.id],
                className: 'land-world-card',
                'data-campaign': camp.meta.id,
                style: {animationDelay: (idx * 0.05) + 's'},
              },
                h('div', {className: 'land-world-card-accent'}),
                h('div', {className: 'land-world-card-body'},
                  h('div', {className: 'land-world-icon'}, camp.meta.icon),
                  h('div', {className: 'land-world-info'},
                    h('div', {className: 'land-world-name'}, camp.meta.name),
                    h('div', {className: 'land-world-genre'}, info.genre || ''),
                    h('div', {className: 'land-world-hook'}, info.hook || '')
                  ),
                  h('div', {className: 'land-world-arrow'}, '›')
                ),
                h('div', {className: 'land-world-footer'},
                  h('span', {className: 'land-world-vibes'}, info.vibes || ''),
                  h('a', {
                    href: CAMPAIGN_GUIDE_PAGES[camp.meta.id],
                    className: 'land-world-guide-link',
                    onClick: function(e) { e.stopPropagation(); },
                    title: camp.meta.name + ' Campaign Guide',
                  }, 'Campaign Guide →')
                )
              );
            })
          )
        )
      ),

      // ── New GM? onboarding paths ──────────────────────────────────────
      h('div', {className: 'land-onboard-section'},
        h('div', {className: 'land-worlds-inner'},
          h('h2', {className: 'land-section-heading'}, 'New to Fate?'),
          h('div', {className: 'land-onboard-grid'},
            h('a', {href: 'campaigns/sessionzero.html', className: 'land-onboard-card'},
              h('div', {className: 'land-onboard-icon'}, h(RaIcon, {n: RA_ICONS.session_zero, size: '2x'})),
              h('div', {className: 'land-onboard-text'},
                h('div', {className: 'land-onboard-label'}, 'Session Zero Wizard'),
                h('div', {className: 'land-onboard-desc'}, 'Guided character creation for a new table. Works solo or as a group.')
              ),
              h('span', {className: 'land-onboard-arrow'}, '›')
            ),
            h('a', {href: 'campaigns/transition.html', className: 'land-onboard-card'},
              h('div', {className: 'land-onboard-icon'}, h(RaIcon, {n: RA_ICONS.dnd_guide, size: '2x'})),
              h('div', {className: 'land-onboard-text'},
                h('div', {className: 'land-onboard-label'}, 'Coming from D&D?'),
                h('div', {className: 'land-onboard-desc'}, 'Every major difference explained side by side. Aspects vs. ability scores, stress vs. HP, and more.')
              ),
              h('span', {className: 'land-onboard-arrow'}, '›')
            ),
            h('a', {href: 'learn.html', className: 'land-onboard-card'},
              h('div', {className: 'land-onboard-icon'}, h(RaIcon, {n: RA_ICONS.learn, size: '2x'})),
              h('div', {className: 'land-onboard-text'},
                h('div', {className: 'land-onboard-label'}, 'Quick-Start Guide'),
                h('div', {className: 'land-onboard-desc'}, 'Rules primer, GM craft tips, worked examples, and a full Fate glossary.')
              ),
              h('span', {className: 'land-onboard-arrow'}, '›')
            )
          )
        )
      ),

      // ── What's inside ─────────────────────────────────────────────────
      h('div', {className: 'land-generators-section'},
        h('div', {className: 'land-worlds-inner'},
          h('h2', {className: 'land-section-heading'}, '16 generators. Every result rules-ready.'),
          h('div', {className: 'land-gen-groups'},
            GENERATOR_GROUPS.map(function(grp) {
              return h('div', {key: grp.id, className: 'land-gen-group'},
                h('div', {className: 'land-gen-group-header'},
                  h('span', {className: 'land-gen-group-icon'}, h(RaIcon, {n: RA_ICONS[grp.id] || grp.id})),
                  h('span', {className: 'land-gen-group-name'}, grp.label)
                ),
                h('div', {className: 'land-gen-group-items'},
                  grp.gens.map(function(gid) {
                    var g = GENERATORS.find(function(x) { return x.id === gid; });
                    return g ? h('div', {key: gid, className: 'land-gen-item'},
                      h('span', {className: 'land-gen-item-name'}, g.icon + ' ' + g.label),
                      g.sub && h('span', {className: 'land-gen-item-sub'}, g.sub)
                    ) : null;
                  })
                )
              );
            })
          )
        )
      )
    ),

    // ── Footer ─────────────────────────────────────────────────────────
    h('footer', {className: 'land-footer'},
      h('div', {className: 'land-footer-inner'},
        h('div', {style: {fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: 4}},
          h('strong', null, 'O'), 'n-demand ',
          h('strong', null, 'G'), 'enerator for ',
          h('strong', null, 'M'), 'asterful ',
          h('strong', null, 'A'), 'dventures'
        ),
        h('div', null,
          'Fate™ is a trademark of ',
          h('a', {href: 'https://www.evilhat.com', target: '_blank', rel: 'noreferrer'}, 'Evil Hat Productions, LLC'),
          '.'
        ),
        h('div', {style: {marginTop: 4}},
          h('a', {href: 'license.html'}, 'CC BY 3.0'),
          ' · ',
          h('a', {href: 'https://fate-srd.com/official-licensing-fate', target: '_blank', rel: 'noreferrer'}, 'Fate Licensing'),
          ' · ',
          h('a', {href: 'about.html'}, 'About Ogma'),
          ' · ',
          h('a', {href: 'CONTRIBUTING.md', target: '_blank', rel: 'noreferrer'}, 'Contribute')
        )
      )
    )
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

  var _selKey    = useState(defaultKey); var selKey = _selKey[0]; var setSelKey = _selKey[1];
  var _custIn    = useState('');               var custIn = _custIn[0]; var setCustIn = _custIn[1];
  var _skillFilt = useState('');               var skillFilt = _skillFilt[0]; var setSkillFilt = _skillFilt[1];

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
// NEXT STEP STRIP (ND-02)
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

function NextStepStrip(props) {
  var steps = NEXT_STEP_MAP[props.genId];
  if (!steps) return null;
  return h('div', {className: 'next-step-strip', 'aria-label': 'Suggested next steps'},
    h('span', {className: 'next-step-label'}, 'What\'s next?'),
    h('div', {className: 'next-step-btns'},
      steps.map(function(step) {
        var g = GENERATORS.find(function(gen) { return gen.id === step.id; });
        if (!g) return null;
        return h('button', {
          key: step.id,
          className: 'next-step-btn',
          onClick: function() { props.onSelectGen(step.id); },
          'aria-label': step.hint + ' - switch to ' + g.label + ' generator',
          title: step.hint,
        },
          h('span', {'aria-hidden': 'true'}, g.icon),
          h('span', null, step.hint)
        );
      })
    )
  );
}

// ════════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════════
// MOBILE BOTTOM SHEET
// iOS-native "more options" sheet. Slides up from bottom edge.
// Renders at root level so it overlays everything including sticky header.
// Uses CSS animation (sheet-in keyframe). Safe-area aware via env().
// ════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════
// FATE POINT TRACKER (ND-10)
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
  var _minor = useState([]); var minorDone = _minor[0]; var setMinorDone = _minor[1];
  var _major = useState([]); var majorDone = _major[0]; var setMajorDone = _major[1];

  var MINOR_OPTIONS = [
    'Swap two skill ratings',
    'Rewrite one stunt (free)',
    'Buy a new stunt (−1 Refresh)',
    'Rewrite any non-High Concept aspect',
  ];
  var MAJOR_OPTIONS = [
    'Do one Minor Milestone option',
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
      h('div', {style: {fontSize: 'var(--text-label)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6}}, '⬡ Minor Milestone'),
      h('div', {style: {fontSize: 'var(--text-label)', color: 'var(--text-muted)', marginBottom: 8}}, 'End of every session - pick ONE'),
      MINOR_OPTIONS.map(function(opt) { return h(Option, {key: opt, val: opt, arr: minorDone, setArr: setMinorDone}); }),
      h('button', {
        onClick: function() { setMinorDone([]); },
        style: {marginTop: 8, fontSize: 'var(--text-label)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-ui)'},
      }, '↺ Clear')
    ),
    h('div', null,
      h('div', {style: {fontSize: 'var(--text-label)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-purple)', marginBottom: 6}}, '◆ Major Milestone'),
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
  var _parts = useState(function() {
    try {
      var saved = sessionStorage.getItem('ogma_popcorn');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return defaultParticipants();
  });
  var participants = _parts[0]; var setParticipants = _parts[1];
  var _newName = useState(''); var newName = _newName[0]; var setNewName = _newName[1];

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
          onClick: function() { toggleDone(p.id); },
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

function FatePointTracker(props) {
  var state = props.state || DEFAULT_FP_STATE;
  var update = props.onUpdate;

  var _lastFP = useState(null); var lastFPAnim = _lastFP[0]; var setLastFPAnim = _lastFP[1];

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

  var _fpTab = useState('fp'); var fpTab = _fpTab[0]; var setFpTab = _fpTab[1];

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
      h('button', {className: 'btn btn-ghost', onClick: props.onClose, style: {fontSize: 14, padding: '2px 8px', minHeight: 0}, 'aria-label': 'Close'}, '✕')
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
        h('button', {className: 'fp-btn fp-minus', onClick: function() { adjustPool(-1); }, disabled: (state.pool || 0) === 0}, '−'),
        h('span', {className: 'fp-pool-count'}, state.pool || 0),
        h('button', {className: 'fp-btn fp-plus', onClick: function() { adjustPool(1); }}, '+')
      ),
      h('button', {className: 'fp-add-pc', onClick: addPC}, '+ Add PC')
    ),
    // Tab: Milestones (BL-10)
    fpTab === 'ms' && h(MilestoneTracker, null),
    // Tab: Popcorn Initiative (BL-35)
    fpTab === 'pi' && h(PopcornTracker, {partySize: props.partySize, lastEncounter: props.lastEncounter})
  );
}

// ════════════════════════════════════════════════════════════════════════
// CAMPAIGN APP (used by each campaign HTML page)
// Each page calls: ReactDOM.createRoot(...).render(h(CampaignApp, {campId: 'thelongafter'}))
// ════════════════════════════════════════════════════════════════════════

var LADDER_NAMES = ['','Average','Fair','Good','Great','Superb','Fantastic','Epic','Legendary'];


// ── ResultCard — top section: name, aspects, skills ─────────────────────────
function ResultCard(props) {
  var result = props.result;
  var gen    = props.gen;
  if (!result || !result.data) return null;
  var d    = result.data;
  var genId = result.genId;

  // Name / title
  var title = d.name || d.title || d.type || (gen && gen.label) || genId;
  var sub   = d.high_concept || d.situation || d.aspect || d.core_aspect
              || d.scene_aspect || d.goal || '';

  // Aspects — normalise to [{text, type, free}]
  var aspects = [];
  if (d.aspects) {
    if (Array.isArray(d.aspects)) {
      d.aspects.forEach(function(a) {
        if (typeof a === 'string') aspects.push({text:a, type:'ot'});
        else if (a && a.name) aspects.push({text:a.name, type:'ot', free:!!a.free_invoke});
      });
    } else if (typeof d.aspects === 'object') {
      if (d.aspects.high_concept) aspects.push({text:d.aspects.high_concept, type:'hc'});
      if (d.aspects.trouble)      aspects.push({text:d.aspects.trouble,      type:'tr'});
      if (d.aspects.others) {
        d.aspects.others.forEach(function(a) { aspects.push({text:a, type:'ot'}); });
      }
    }
  }
  // For faction — add method/weakness as aspects
  if (genId === 'faction' || genId === 'seed') {
    if (d.method)   aspects.push({text:d.method,   type:'ot', badge:'METHOD'});
    if (d.weakness) aspects.push({text:d.weakness, type:'tr', badge:'WEAKNESS'});
    if (d.complication) aspects.push({text:d.complication, type:'tr', badge:'COMPLICATION'});
    if (d.issue)    aspects.push({text:d.issue.replace(/^[^:]+:\s*/,''), type:'ot', badge:'ISSUE'});
  }

  // Skills
  var skills = Array.isArray(d.skills) ? d.skills : [];

  return h('div', {className: 'result-card'},
    h('div', {className: 'result-card-gen'},
      gen ? gen.icon + ' ' + gen.label : genId,
      h('div', {className: 'result-card-gen-line'})
    ),
    title && h('div', {className: 'result-card-name'}, title),
    sub   && h('div', {className: 'result-card-sub'},  sub),
    aspects.length > 0 && h('div', {className: 'result-card-aspects'},
      aspects.slice(0,6).map(function(a, i) {
        var cls = 'result-asp asp-' + (a.type || 'ot') + (a.free ? ' asp-free' : '');
        return h('div', {key:i, className: cls},
          h('span', {className: 'result-asp-dot'}),
          h('div', null,
            a.badge && h('span', {className: 'result-asp-badge'}, a.badge + ' '),
            a.text
          )
        );
      })
    ),
    skills.length > 0 && h('div', {className: 'result-skills'},
      skills.slice(0,6).map(function(s, i) {
        return h('div', {key:i, className: 'result-skill'},
          h('span', {className: 'result-skill-r'}, '+' + s.r),
          h('span', {className: 'result-skill-n'}, s.name),
          h('span', {className: 'result-skill-l'}, LADDER_NAMES[s.r] || '')
        );
      })
    )
  );
}

// ── GmTipsPanel — invoke/compel + running tips + checklist ─────────────────
function GmTipsPanel(props) {
  var genId     = props.genId;
  var helpLevel = props.helpLevel;
  var checks    = props.checks;
  var setChecks = props.setChecks;
  var hc = HELP_CONTENT[genId] || {};

  function toggleCheck(i) {
    var next = checks.slice();
    next[i] = !next[i];
    setChecks(next);
  }

  var tips    = Array.isArray(hc.gm_tips)    ? hc.gm_tips    : (hc.gm_tips    ? [hc.gm_tips]    : []);
  var running = Array.isArray(hc.gm_running) ? hc.gm_running : (hc.gm_running ? [hc.gm_running] : []);
  var checklist = Array.isArray(hc.gm_checklist) ? hc.gm_checklist : (hc.gm_checklist ? [hc.gm_checklist] : []);

  return h('div', {className: 'result-tab-panel active'},
    // Invoke example
    hc.invoke_example && h('div', null,
      h('div', {className: 'rtp-lbl'}, 'Invoke example'),
      h('div', {className: 'rtp-ic invoke'},
        h('div', {className: 'rtp-ic-hdr'}, 'When to spend the fate point'),
        h('div', {className: 'rtp-ic-body'}, hc.invoke_example)
      )
    ),
    // Compel example
    hc.compel_example && h('div', null,
      h('div', {className: 'rtp-lbl'}, 'Compel example'),
      h('div', {className: 'rtp-ic compel'},
        h('div', {className: 'rtp-ic-hdr'}, 'When to offer the fate point'),
        h('div', {className: 'rtp-ic-body'}, hc.compel_example)
      )
    ),
    // GM tips
    (tips.length > 0 || running.length > 0) && h('div', null,
      h('div', {className: 'rtp-lbl'}, 'Running this generator'),
      h('div', null,
        tips.concat(running).map(function(tip, i) {
          return h('div', {key:i, className: 'rtp-tip'},
            h('span', {className: 'rtp-tip-ic'}, '→'),
            h('span', {className: 'rtp-tip-tx'}, tip)
          );
        })
      )
    ),
    // Checklist
    checklist.length > 0 && h('div', null,
      h('div', {className: 'rtp-lbl'}, 'Scene checklist'),
      h('div', null,
        checklist.map(function(item, i) {
          var done = !!(checks && checks[i]);
          return h('div', {key:i, className: 'rtp-check', onClick: function(){toggleCheck(i);}},
            h('div', {className: 'rtp-check-box' + (done ? ' done' : '')}, done ? '✓' : ''),
            h('span', null, item)
          );
        })
      )
    )
  );
}

// ── RulesPanel — Fate Condensed reference inline ────────────────────────────
function RulesPanel(props) {
  var genId = props.genId;
  var hc = HELP_CONTENT[genId] || {};
  var entry = (HELP_ENTRIES || []).find(function(e){ return e.id === genId; });
  var rules = hc.rules || hc.how || [];

  return h('div', {className: 'result-tab-panel active'},
    hc.what && h('div', null,
      h('div', {className: 'rtp-lbl'}, 'What this generates'),
      h('div', {style:{fontSize:13,color:'var(--text-dim)',lineHeight:1.6}}, hc.what)
    ),
    hc.output && h('div', null,
      h('div', {className: 'rtp-lbl'}, 'Output structure'),
      h('div', {style:{fontSize:12,color:'var(--text-muted)',lineHeight:1.6}}, hc.output)
    ),
    rules.length > 0 && h('div', null,
      h('div', {className: 'rtp-lbl'}, 'Fate Condensed — rules reference'),
      h('div', null,
        rules.map(function(rule, i) {
          var srdUrl = entry && entry.srd_url;
          return h('div', {key:i, className: 'rtp-rule'},
            h('span', {className: 'rtp-rule-dot'}, '◈'),
            h('span', {className: 'rtp-rule-tx'},
              rule,
              i === rules.length - 1 && srdUrl && h(Fragment, null,
                ' ',
                h('a', {href:srdUrl, target:'_blank', rel:'noopener noreferrer', className:'rtp-srd'},
                  '↗ SRD')
              )
            )
          );
        })
      )
    )
  );
}

// ── DndPanel — D&D / Pathfinder contrast notes ──────────────────────────────
function DndPanel(props) {
  var genId = props.genId;
  var hc = HELP_CONTENT[genId] || {};
  if (!hc.dnd_notes) return h('div', {className:'result-tab-panel active'},
    h('div', {style:{color:'var(--text-muted)',fontSize:13,padding:'8px 0'}},
      'No D&D comparison notes for this generator.')
  );
  return h('div', {className: 'result-tab-panel active'},
    h('div', {className: 'rtp-dnd'},
      h('div', {className: 'rtp-dnd-hdr'}, 'Coming from D&D / Pathfinder?'),
      h('div', {className: 'rtp-dnd-body'}, hc.dnd_notes)
    ),
    h('div', {className: 'rtp-rule'},
      h('span', {className: 'rtp-rule-dot'}, '◈'),
      h('span', {className: 'rtp-rule-tx'}, 'There are no hit points. Stress tracks how long you can stay in a conflict — not physical damage. When all stress boxes are filled the character is taken out, not necessarily dead.')
    ),
    h('div', {className: 'rtp-rule'},
      h('span', {className: 'rtp-rule-dot'}, '◈'),
      h('span', {className: 'rtp-rule-tx'}, 'Aspects replace ability checks as the fiction layer. Invoke an aspect to justify a bonus; get compelled on it to introduce a complication.')
    )
  );
}

function CampaignApp(props) {
  var campId = props.campId;
  var camp = CAMPAIGNS[campId];
  var t = camp.tables;

  var _theme = useState(getTheme()); var theme = _theme[0]; var setTheme = _theme[1];
  var _tsz   = useState(getTextSize()); var textSize = _tsz[0]; var setTextSize = _tsz[1];
  var _gen   = useState('npc_minor'); var activeGen = _gen[0]; var setActiveGen = _gen[1];
  var _res   = useState(null);        var result = _res[0];    var setResult = _res[1];
  var _party = useState(3);           var partySize = _party[0]; var setPartySize = _party[1];
  var _roll  = useState(false);       var rolling = _roll[0];  var setRolling = _roll[1];
  var _hist  = useState([]);          var history = _hist[0];  var setHistory = _hist[1];
  var _help  = useState(false);       var showHelp = _help[0]; var setShowHelp = _help[1];
  var _kbsc  = useState(false);       var showKbShortcuts = _kbsc[0]; var setShowKbShortcuts = _kbsc[1];
  var _exp   = useState(false);       var showExport = _exp[0]; var setShowExport = _exp[1];
  var _prefs = useState({excluded:{}, locked:{}, custom:{}}); var prefs = _prefs[0]; var setPrefs = _prefs[1];
  var _tbls  = useState(false);       var showTables = _tbls[0]; var setShowTables = _tbls[1];
  var _sett  = useState(false);       var showSettings = _sett[0]; var setShowSettings = _sett[1];
  var _showFP = useState(false);      var showFP = _showFP[0];     var setShowFP = _showFP[1];
  var _fp = useState(function() {
    try { var s = LS.get('fp_state'); return s || null; } catch(e) { return null; }
  });
  var fpState = _fp[0]; var setFpState = _fp[1];
  function updateFP(next) {
    setFpState(next);
    try { LS.set('fp_state', next); } catch(e) {}
  }
  var _sidebar = useState(false);      var showSidebar = _sidebar[0]; var setShowSidebar = _sidebar[1];
  var _insp  = useState(false);       var inspireMode = _insp[0];  var setInspireMode   = _insp[1];
  var _inspR = useState([]);          var inspireResults = _inspR[0]; var setInspireResults = _inspR[1];
  var prefsRef = useRef(prefs); prefsRef.current = prefs;
  var _pins    = useState([]);          var pinnedCards = _pins[0];    var setPinnedCards = _pins[1];
  // Universal merge toggle - default on, persisted globally in localStorage
  var _uMerge  = useState(function() { try { return LS.get('universal_merge') !== false; } catch(e) { return true; } });
  var universalMerge = _uMerge[0]; var setUniversalMerge = _uMerge[1];
  function toggleUniversalMerge() {
    var next = !universalMerge;
    setUniversalMerge(next);
    try { LS.set('universal_merge', next); } catch(e) {}
  }
  // F4: Consequence severity selector - '' means random (default)
  var _csev = useState(''); var consequenceSev = _csev[0]; var setConsequenceSev = _csev[1];

  // PWA install nudge
  var deferredInstallPrompt = useRef(null);
  var _pwa = useState(false); var showPwaNudge = _pwa[0]; var setShowPwaNudge = _pwa[1];

  // Load last session + table prefs on mount
  useEffect(function() {
    DB.loadSession('fate_' + campId).then(function(saved) {
      if (saved && saved.result)    setResult(saved.result);
      if (saved && saved.history)   setHistory(saved.history);
      if (saved && saved.activeGen) setActiveGen(saved.activeGen);
    }).catch(function() {});
    DB.loadSession('fate_tprefs_' + campId).then(function(saved) {
      if (saved) setPrefs(saved);
    }).catch(function() {});
  }, [campId]);

  // Save session on result change
  useEffect(function() {
    if (result) {
      DB.saveSession('fate_' + campId, {result: result, history: history, activeGen: activeGen}).catch(function() {});
    }
  }, [result]);

  // Save table prefs when they change
  useEffect(function() {
    DB.saveSession('fate_tprefs_' + campId, prefs).catch(function() {});
  }, [prefs]);

  // PWA install nudge - capture prompt, show after 2nd visit if not dismissed
  useEffect(function() {
    var dismissed = false;
    try { dismissed = LS.get('pwa_nudge_dismissed'); } catch(e) {}
    if (dismissed) return;
    // Increment visit count
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

  // Toast notification
  var _toast = useState(null); var toast = _toast[0]; var setToast = _toast[1];
  var _upd = useState(false); var updateAvailable = _upd[0]; var setUpdateAvailable = _upd[1];
  var toastTimer = useRef(null);
  function showToast(msg) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(function() { setToast(null); }, TIMING.TOAST_MS);
  }

  // SW update toast — triggered by controllerchange listener in page HTML
  useEffect(function() {
    window.__showUpdateToast = function() {
      setUpdateAvailable(true);
    };
    return function() { delete window.__showUpdateToast; };
  }, []);

  var _pinBounce = useState(false); var pinBouncing = _pinBounce[0]; var setPinBouncing = _pinBounce[1];

  function pinResult() {
    if (!result) return;
    setPinBouncing(true);
    setTimeout(function() { setPinBouncing(false); }, 400);
    var card = {
      id: String(Date.now()),
      campId: campId, genId: result.genId,
      label: getResultLabel(result),
      data: result.data, ts: Date.now(),
    };
    setPinnedCards(function(prev) { return [card].concat(prev); });
    DB.saveCard(campId, card).catch(function() {});
    showToast('📌 Pinned - find it in 📋 History');
    if (navigator.vibrate) navigator.vibrate(30);
  }

  function unpinCard(cardId) {
    setPinnedCards(function(prev) { return prev.filter(function(c) { return c.id !== cardId; }); });
    DB.deleteCard(campId, cardId).catch(function() {});
  }

  function restoreCard(card) {
    setResult({ genId: card.genId, data: card.data });
    setActiveGen(card.genId);
  }

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
  var _grp = useState(function() { return groupForGen('npc_minor'); });
  var activeGroup = _grp[0]; var setActiveGroup = _grp[1];
  var currentGroup = GENERATOR_GROUPS.find(function(g) { return g.id === activeGroup; }) || GENERATOR_GROUPS[0];
  var groupGens = currentGroup.gens.map(function(gid) { return GENERATORS.find(function(g) { return g.id === gid; }); }).filter(Boolean);
  // History/Pinned drawer
  var _showHist = useState(false); var showHistory = _showHist[0]; var setShowHistory = _showHist[1];
  // Help level preference - controls inline help detail
  var _helpLvl = useState(function() { try { return LS.get('help_level') || 'new_fate'; } catch(e) { return 'new_fate'; } });
  var helpLevel = _helpLvl[0]; var setHelpLevel = _helpLvl[1];
  function changeHelpLevel(lvl) { setHelpLevel(lvl); try { LS.set('help_level', lvl); } catch(e) {} }

  // ── Sidebar tab state (Concept A tabbed sidebar)
  var _sbTab = useState('gen'); var sidebarTab = _sbTab[0]; var setSidebarTab = _sbTab[1];
  var _hlOpen = useState(false); var hlPickerOpen = _hlOpen[0]; var setHlPickerOpen = _hlOpen[1];

  // ── Result panel tab state (GM Tips | Rules | D&D Notes)
  var _rtab = useState('tips'); var resultTab = _rtab[0]; var setResultTab = _rtab[1];
  // Checklist state — per-session, cleared on generator change
  var _chk = useState([]); var checklistState = _chk[0]; var setChecklistState = _chk[1];
  // Inspire chosen index — for ghost animation
  var _iChosen = useState(null); var inspireChosen = _iChosen[0]; var setInspireChosen = _iChosen[1];

  // ── Online/offline detection (H9)
  var _online = useState(typeof navigator !== 'undefined' ? navigator.onLine !== false : true);
  var isOnline = _online[0]; var setIsOnline = _online[1];

  // Help level display metadata
  var HL_META = {
    experienced: {icon: '🎭', label: 'Experienced'},
    new_fate:    {icon: '🎲', label: 'Other RPGs'},
    dnd_convert: {icon: '⚔',  label: 'D&D player'},
    new_ttrpg:   {icon: '🌱', label: 'New here'},
  };
  var hlMeta = HL_META[helpLevel] || HL_META['new_fate'];

  // First-visit Help Level onboarding prompt (ND-01/UX-02)
  // Only shown if user has never made an explicit Help Level selection.
  var _onboarding = useState(function() {
    try { return !LS.get('onboarding_done'); } catch(e) { return false; }
  });
  var showOnboarding = _onboarding[0]; var setShowOnboarding = _onboarding[1];
  function handleOnboardingSelect(lvl) {
    changeHelpLevel(lvl);
    setShowOnboarding(false);
    try { LS.set('onboarding_done', true); } catch(e) {}
  }

  // GM Mode - surfaces running guidance on results
  var _gmMode = useState(function() { try { return LS.get('gm_mode') !== false; } catch(e) { return true; } });
  var gmMode = _gmMode[0]; var setGmMode = _gmMode[1];
  function toggleGmMode() {
    var next = !gmMode; setGmMode(next);
    try { LS.set('gm_mode', next); } catch(e) {}
    document.documentElement.setAttribute('data-gm-mode', next ? 'on' : 'off');
  }

  var _rollCount = useState(0); var rollCount = _rollCount[0]; var setRollCount = _rollCount[1];
  var _rAnim = useState(false); var resultAnim = _rAnim[0]; var setResultAnim = _rAnim[1];
  var _streakBadge = useState(false); var showStreakBadge = _streakBadge[0]; var setShowStreakBadge = _streakBadge[1];

  var doGenerate = useCallback(function() {
    if (navigator.vibrate) navigator.vibrate(40);
    setRolling(true);
    // Streak counter
    setRollCount(function(n) {
      var next = n + 1;
      if (next % 5 === 0) {
        setShowStreakBadge(true);
        setTimeout(function() { setShowStreakBadge(false); }, 1200);
      }
      return next;
    });
    // Generate immediately but hold the rolling state for 2s minimum
    var base = universalMerge ? mergeUniversal(t) : t;
    var eff  = filteredTables(base, prefsRef.current);
    var opts = {};
    if (activeGen === 'consequence' && consequenceSev) opts.severity = consequenceSev;
    var data = generate(activeGen, eff, partySize, opts);
    var newResult = {genId: activeGen, data: data};
    setTimeout(function() {
      setResult(newResult);
      setResultAnim(true);
      setTimeout(function() { setResultAnim(false); }, 320);
      setHistory(function(h) {
        return [{genId: activeGen, data: data, gen: gen}, h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7]].filter(Boolean).slice(0, 8);
      });
      setRolling(false);
    }, 220);
  }, [activeGen, t, partySize, gen, universalMerge, consequenceSev]);

              // Inspiration mode — pick one of three options
  var doInspire = useCallback(function() {
    if (rolling) return;
    setRolling(true);
    var base = universalMerge ? mergeUniversal(t) : t;
    var eff  = filteredTables(base, prefsRef.current);
    var opts = {};
    if (activeGen === 'consequence' && consequenceSev) opts.severity = consequenceSev;
    var three = [
      generate(activeGen, eff, partySize, opts),
      generate(activeGen, eff, partySize, opts),
      generate(activeGen, eff, partySize, opts),
    ];
    setTimeout(function() {
      setInspireResults(three);
      setInspireMode(true);
      setResult(null);
      setRolling(false);
    }, 220);
  }, [activeGen, t, partySize, gen, universalMerge, consequenceSev]);

  function pickInspireResult(data) {
    // Find which index was chosen for ghost animation
    var chosenIdx = inspireResults.indexOf(data);
    setInspireChosen(chosenIdx);
    setTimeout(function() {
      setResult({genId: activeGen, data: data});
      setInspireMode(false);
      setInspireResults([]);
      setInspireChosen(null);
    }, 280);
    setHistory(function(h) {
      return [{genId: activeGen, data: data, gen: gen}, h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7]].filter(Boolean).slice(0, 8);
    });
  }

  function selectGen(id) { setActiveGen(id); setResult(null); setInspireMode(false); setInspireResults([]); setActiveGroup(groupForGen(id)); setResultTab('tips'); setChecklistState([]); }

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

  // R-13: Sticky Roll FAB - appears when Roll button scrolls off-screen
  var rollBtnRef = useRef(null);
  var _fab = useState(false); var showFAB = _fab[0]; var setShowFAB = _fab[1];
  useEffect(function() {
    var el = rollBtnRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    var obs = new IntersectionObserver(function(entries) {
      setShowFAB(!entries[0].isIntersecting);
    }, {threshold: 0.1});
    obs.observe(el);
    return function() { obs.disconnect(); };
  }, []);


  // ── Online/offline listener (H9) ──────────────────────────────────────────
  useEffect(function() {
    function goOnline()  { setIsOnline(true);  }
    function goOffline() { setIsOnline(false); }
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);
    return function() {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(function() {
    function onKey(e) {
      var tag = (e.target || {}).tagName || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Escape always closes any open panel
      if (e.key === 'Escape') {
        if (showSidebar)   { setShowSidebar(false);   return; }
        if (showHistory)   { setShowHistory(false);   return; }
        if (showKbShortcuts) { setShowKbShortcuts(false); return; }
        if (showHelp)      { setShowHelp(false);      return; }
        if (showTables)    { setShowTables(false);    return; }
        if (showSettings)  { setShowSettings(false);  return; }
        return;
      }

      // All other shortcuts blocked when a modal/panel is open
      if (showHelp || showTables || showSettings || showHistory || showSidebar) return;

      if (e.code === 'Space' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (!rolling) doGenerate();
      } else if (e.key === 'p' || e.key === 'P') {
        if (result) {
          setPinnedCards(function(prev) {
            var already = prev.some(function(c) { return c.genId === result.genId && JSON.stringify(c.data) === JSON.stringify(result.data); });
            if (already) return prev;
            setToast('Pinned ✓');
            return [{genId: result.genId, data: result.data}].concat(prev);
          });
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
          setToast('Pin removed ↩');
          return prev.slice(1);
        });
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
  }, [rolling, result, activeGen, showHelp, showTables, showSettings, showHistory, showSidebar, showKbShortcuts, doGenerate, doInspire, pinnedCards]);

  var totalEntries = Object.values(t).reduce(function(n, v) { return n + (Array.isArray(v) ? v.length : 0); }, 0);

  return h('div', {className: 'app-shell'},
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
      // Status zone — always visible, interactive (H1, H4, H6, H9)
      h('div', {className: 'topbar-status'},
        // Offline indicator (H9)
        !isOnline && h('span', {
          className: 'topbar-chip topbar-chip-offline',
          role: 'status',
          'aria-live': 'polite',
          title: 'You are offline. Ogma is running from cached data.',
        }, '⚡ Offline'),
        // GM Mode chip — clickable toggle (H1, H4)
        h('button', {
          className: 'topbar-chip ' + (gmMode ? 'topbar-chip-gm' : 'topbar-chip-gm-off'),
          onClick: toggleGmMode,
          'aria-pressed': String(gmMode),
          title: gmMode ? 'GM Mode on — click to disable coaching overlays' : 'GM Mode off — click to enable coaching overlays',
        }, gmMode ? 'GM ON' : 'GM OFF'),
        // Help Level chip — shows current level, opens Session tab picker (H6)
        h('button', {
          className: 'topbar-chip topbar-chip-hl',
          onClick: function() {
            setSidebarTab('sess');
            setHlPickerOpen(true);
            if (!showSidebar) setShowSidebar(true);
          },
          title: 'Help level: ' + (hlMeta.label) + ' — click to change',
        }, hlMeta.icon + ' ' + hlMeta.label),
        // Theme toggle
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
          h('button', {
            className: 'sidebar-tab-btn' + (sidebarTab === 'sess' ? ' active' : ''),
            onClick: function() {
              setSidebarTab('sess');
              var el = document.getElementById('sb-tab-announce');
              if (el) el.textContent = 'Session tab';
            },
            role: 'tab',
            'aria-selected': String(sidebarTab === 'sess'),
            'aria-controls': 'sb-panel-sess',
          }, 'Session')
        ),

        // ══════════════════════════════════════════════════════════
        // GENERATE PANEL — 16 generators in 4 groups
        // ══════════════════════════════════════════════════════════
        h('div', {
          id: 'sb-panel-gen',
          className: 'sidebar-panel' + (sidebarTab === 'gen' ? ' active' : ''),
          role: 'tabpanel',
          'aria-label': 'Generator list',
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
          h('div', {style: {height: 8, flexShrink: 0}})
        ),

        // ══════════════════════════════════════════════════════════
        // SESSION PANEL — at-table tools + GM Mode/Help Level + nav
        // ══════════════════════════════════════════════════════════
        h('div', {
          id: 'sb-panel-sess',
          className: 'sidebar-panel' + (sidebarTab === 'sess' ? ' active' : ''),
          role: 'tabpanel',
          'aria-label': 'Session tools and settings',
        },

          // ── At the table ──────────────────────────────────────
          h('div', {className: 'sidebar-group-label'}, 'At the table'),
          h('button', {
            className: 'sidebar-tool-btn' + (showFP ? ' active' : ''),
            onClick: function() { setShowFP(!showFP); setShowSidebar(false); },
            'aria-pressed': String(showFP),
          },
            h('span', {className: 'sidebar-item-icon'}, h(RaIcon, {n: RA_ICONS.fp_tracker})),
            h('span', {className: 'sidebar-item-label'}, 'FP Tracker')
          ),
          h('button', {
            className: 'sidebar-tool-btn' + (showHistory ? ' active' : ''),
            onClick: function() { setShowHistory(!showHistory); setShowSidebar(false); },
            'aria-pressed': String(showHistory),
          },
            h('span', {className: 'sidebar-item-icon'}, h(RaIcon, {n: RA_ICONS.history})),
            h('span', {className: 'sidebar-item-label'},
              pinnedCards.length > 0 ? 'History · ' + pinnedCards.length + ' pinned' : 'History'
            )
          ),

          h('div', {className: 'sidebar-divider'}),

          // ── GM Mode + Help Level (Variant 2 from mocks) ───────
          h('div', {className: 'gm-sidebar-block'},
            h('div', {className: 'gm-sidebar-main'},
              h('div', {className: 'gm-sidebar-left'},
                h('div', {className: 'gm-sidebar-title'}, 'GM Mode'),
                gmMode && h('div', {className: 'gm-sidebar-subrow'},
                  h('span', {className: 'gm-sidebar-sublabel'}, 'Help level:'),
                  h('button', {
                    className: 'hl-sb-pill',
                    onClick: function() { setHlPickerOpen(!hlPickerOpen); },
                    'aria-expanded': String(hlPickerOpen),
                    'aria-controls': 'hl-sb-drawer',
                  },
                    h('span', {'aria-hidden': 'true'}, hlMeta.icon),
                    ' ', hlMeta.label,
                    h('span', {className: 'hl-sb-caret' + (hlPickerOpen ? ' open' : ''), 'aria-hidden': 'true'}, '▾')
                  )
                ),
                !gmMode && h('div', {className: 'gm-sidebar-off-note'}, 'Help level saved — still affects inline cards.')
              ),
              h('button', {
                className: 'sidebar-tog-wrap',
                onClick: toggleGmMode,
                'aria-pressed': String(gmMode),
                'aria-label': gmMode ? 'Disable GM Mode' : 'Enable GM Mode',
                title: 'Toggle GM Mode',
              },
                h(ToggleSwitch, {value: gmMode, label: '', onToggle: toggleGmMode})
              )
            ),
            h('div', {
              id: 'hl-sb-drawer',
              className: 'hl-sb-drawer' + (hlPickerOpen && gmMode ? ' open' : ' closed'),
              'aria-hidden': String(!(hlPickerOpen && gmMode)),
            },
              h('div', {className: 'hl-sb-inner'},
                [
                  {id: 'experienced', icon: '🎭', label: 'I know Fate well',        sub: 'Minimal help — just the output'},
                  {id: 'new_fate',    icon: '🎲', label: 'I play other RPGs',        sub: 'Fate mechanics, no jargon'},
                  {id: 'dnd_convert', icon: '⚔',  label: 'I play D&D / Pathfinder',  sub: 'Rules + D&D comparison notes'},
                  {id: 'new_ttrpg',   icon: '🌱', label: 'New to tabletop RPGs',      sub: 'Gentle intro from scratch'},
                ].map(function(opt) {
                  return h('button', {
                    key: opt.id,
                    className: 'hl-sb-opt' + (helpLevel === opt.id ? ' selected' : ''),
                    onClick: function() {
                      changeHelpLevel(opt.id);
                      setHlPickerOpen(false);
                    },
                    'aria-pressed': String(helpLevel === opt.id),
                  },
                    h('span', {className: 'hl-sb-icon', 'aria-hidden': 'true'}, opt.icon),
                    h('div', null,
                      h('div', {className: 'hl-sb-name'}, opt.label),
                      h('div', {className: 'hl-sb-sub'}, opt.sub)
                    )
                  );
                })
              )
            )
          ),

          // ── Settings ──────────────────────────────────────────
          h('div', {className: 'sidebar-divider'}),
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
          h('button', {
            className: 'sidebar-tool-btn',
            onClick: toggleTheme,
            'aria-label': theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
          },
            h('span', {className: 'sidebar-item-icon'}, h(RaIcon, {n: theme === 'dark' ? RA_ICONS.theme_light : RA_ICONS.theme_dark})),
            h('span', {className: 'sidebar-item-label'}, theme === 'dark' ? 'Light mode' : 'Dark mode')
          ),

          // ── Navigate ──────────────────────────────────────────
          h('div', {className: 'sidebar-divider'}),
          h('div', {className: 'sidebar-group-label'}, 'Navigate'),
          h('button', {
            className: 'sidebar-tool-btn',
            onClick: function() { setShowSidebar(false); setTimeout(function() { if (window.fateReplayIntro) window.fateReplayIntro(); }, TIMING.INTRO_REPLAY_MS); },
          },
            h('span', {className: 'sidebar-item-icon'}, h(RaIcon, {n: RA_ICONS.play_intro})),
            h('span', {className: 'sidebar-item-label'}, 'Play Intro')
          ),
          h('a', {href: '../campaigns/guide-' + campId + '.html', className: 'sidebar-tool-btn'},
            h('span', {className: 'sidebar-item-icon'}, h(RaIcon, {n: RA_ICONS.guide})),
            h('span', {className: 'sidebar-item-label'}, 'Campaign Guide')
          ),
          h('button', {
            className: 'sidebar-tool-btn',
            onClick: function() { setShowKbShortcuts(true); setShowSidebar(false); },
            title: 'Keyboard shortcuts reference',
          },
            h('span', {className: 'sidebar-item-icon'}, h(RaIcon, {n: 'keyboard'})),
            h('span', {className: 'sidebar-item-label'}, 'KB Shortcuts')
          ),
          h('a', {href: '../campaigns/transition.html', className: 'sidebar-tool-btn'},
            h('span', {className: 'sidebar-item-icon'}, h(RaIcon, {n: RA_ICONS.dnd_guide})),
            h('span', {className: 'sidebar-item-label'}, 'D&D Guide')
          ),
          h('a', {href: '../campaigns/sessionzero.html', className: 'sidebar-tool-btn'},
            h('span', {className: 'sidebar-item-icon'}, h(RaIcon, {n: RA_ICONS.learn || 'player'})),
            h('span', {className: 'sidebar-item-label'}, 'Session Zero')
          ),
          h('a', {href: '../learn.html', className: 'sidebar-tool-btn'},
            h('span', {className: 'sidebar-item-icon'}, h(RaIcon, {n: RA_ICONS.learn})),
            h('span', {className: 'sidebar-item-label'}, 'Quick Start')
          ),
          h('a', {href: '../index.html', className: 'sidebar-tool-btn'},
            h('span', {className: 'sidebar-item-icon'}, h(RaIcon, {n: RA_ICONS.home})),
            h('span', {className: 'sidebar-item-label'}, 'Home')
          ),
          h('a', {href: '../about.html', className: 'sidebar-tool-btn'},
            h('span', {className: 'sidebar-item-icon'}, 'ℹ'),
            h('span', {className: 'sidebar-item-label'}, 'About')
          ),

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

        // Main layout
        h('main', {id: 'main'},
          h('div', {className: 'main-layout'},

        // Result panel
        h('div', {id: 'result-panel', role: 'region', 'aria-label': result ? 'Generated ' + gen.label + ' result' : 'Ready to generate ' + gen.label, 'aria-live': 'polite', 'aria-atomic': 'true'},
          h('div', {className: 'result-panel', style: {padding: 0, overflow: 'hidden'}},

            // ── Unified action bar: Roll + Inspire + contextual + secondary ──
            h('div', {className: 'action-bar', ref: rollBtnRef},
              // PRIMARY: Roll
              h('button', {
                className: 'btn-roll action-bar-roll' + (rolling ? ' rolling' : '') + (showStreakBadge ? ' streak-pulse' : ''),
                onClick: doGenerate,
                disabled: rolling,
                'aria-live': 'polite',
                style: {position: 'relative'},
              },
                showStreakBadge && h('span', {className: 'streak-badge'}, '+' + rollCount + ' 🎲'),
                h('span', {className: 'roll-label'},
                  rolling
                    ? h(Fragment, null, h('span', {className: 'dice-spinning'}, h(RaIcon, {n: 'perspective-dice-random'})), ' Rolling…')
                    : h(Fragment, null, h(RaIcon, {n: 'perspective-dice-random'}), ' Roll ', gen.label)
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
                h(RaIcon, {n: inspireMode ? 'cancel' : 'crystal-ball'}),
                h('span', {className: 'action-bar-label'}, inspireMode ? ' Exit' : ' Inspire')
              ),
              // CONTEXTUAL: consequence severity / party size
              activeGen === 'consequence' && h(Fragment, null,
                h('span', {className: 'action-bar-divider'}),
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
              activeGen === 'encounter' && h(Fragment, null,
                h('span', {className: 'action-bar-divider'}),
                h('span', {className: 'party-label'}, 'Party:'),
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
                h('button', {
                  className: 'btn btn-ghost action-bar-icon',
                  onClick: function() { setShowHelp(true); },
                  title: 'Rules reference [?]',
                  'aria-label': 'Rules reference',
                }, h(RaIcon, {n: RA_ICONS.rules})),
                result && h('button', {
                  className: 'btn btn-ghost action-bar-icon' + (showExport ? ' active' : ''),
                  onClick: function() { setShowExport(!showExport); },
                  title: showExport ? 'Close share options' : 'Share or export',
                  'aria-label': 'Share',
                }, h(RaIcon, {n: 'quill-ink'})),
                result && h('button', {
                  className: 'btn btn-ghost action-bar-icon' + (pinBouncing ? ' pin-bounce' : ''),
                  onClick: pinResult,
                  title: 'Pin result [P]',
                  'aria-label': pinnedCards.length > 0
                    ? 'Pin result (' + pinnedCards.length + ' pinned)'
                    : 'Pin result',
                  style: {position: 'relative'},
                },
                  pinBouncing && h('span', {className: 'pin-ring-el'}),
                  h(RaIcon, {n: RA_ICONS.pin}),
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
                pinnedCards.length > 0 && h('button', {
                  className: 'btn btn-ghost action-bar-secondary-export',
                  onClick: function() { setShowHistory(true); },
                  title: 'Export ' + pinnedCards.length + ' pinned result' + (pinnedCards.length === 1 ? '' : 's'),
                  'aria-label': 'Export pinned results',
                  style: {fontSize: 'var(--text-sm)', padding: '6px 10px', minHeight: 36},
                },
                  h(RaIcon, {n: 'pouch'}), ' Export Pinned'
                )
              )
            ),

            // ── Inline share drawer ────────────────────────────────────
            showExport && result && h(ShareDrawer, {
              genId: result.genId,
              data: result.data,
              campName: camp.meta.name,
              onClose: function() { setShowExport(false); },
            }),

            // ── Result card: name, aspects, skills ──────────────────────────
            h('div', {className: resultAnim ? 'result-card-appear' : ''},
              h(ResultCard, {result: result, gen: gen})
            ),

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
              )
            ),

            // ── GM info tabs: Tips | Rules | D&D Notes ───────────────────────
            result && h('div', {style:{display:'flex',flexDirection:'column',minHeight:0}},
              h('div', {className:'result-tab-bar', role:'tablist'},
                h('button', {
                  className: 'result-tab-btn' + (resultTab==='tips'?' active':''),
                  onClick: function(){setResultTab('tips');},
                  role:'tab', 'aria-selected':String(resultTab==='tips'),
                }, '◈ GM Tips'),
                h('button', {
                  className: 'result-tab-btn' + (resultTab==='rules'?' active':''),
                  onClick: function(){setResultTab('rules');},
                  role:'tab', 'aria-selected':String(resultTab==='rules'),
                }, '⊞ Rules'),
                gmMode && helpLevel==='dnd_convert' && h('button', {
                  className: 'result-tab-btn' + (resultTab==='dnd'?' active':''),
                  onClick: function(){setResultTab('dnd');},
                  role:'tab', 'aria-selected':String(resultTab==='dnd'),
                }, '⚔ D&D Notes')
              ),
              h('div', {className:'result-tab-content', role:'tabpanel'},
                resultTab==='tips'  && h(GmTipsPanel, {
                  genId: activeGen, helpLevel: helpLevel,
                  checks: checklistState, setChecks: setChecklistState,
                }),
                resultTab==='rules' && h(RulesPanel, {genId: activeGen}),
                resultTab==='dnd'   && h(DndPanel,   {genId: activeGen})
              )
            )
          )     // close result-panel.class
        )       // close result-panel id
      )         // close main-layout
    )           // close main
    ),          // close content-panel child; separator before history panel

    // ── History & Pinned slide-over panel ─────────────────────────────
    showHistory && h('div', {className: 'hist-overlay', onClick: function() { setShowHistory(false); }}),
    showHistory && h('div', {className: 'hist-panel'},
      h('div', {className: 'hist-panel-header'},
        h('span', {style: {fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)'}}, '📋 History & Pinned'),
        h('button', {
          className: 'btn btn-icon btn-ghost',
          onClick: function() { setShowHistory(false); },
          'aria-label': 'Close history panel',
          style: {fontSize: 18, padding: '4px 8px'},
        }, '✕')
      ),
      // Session pack — copy all pinned results as a single Markdown doc
      pinnedCards.length > 0 && h('button', {
        className: 'btn btn-ghost',
        onClick: function() {
          var header = '# ' + camp.meta.name + ' - Session Pack\n_Generated ' + new Date().toLocaleDateString() + ' · ' + pinnedCards.length + ' pinned results_\n\n';
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
      }, '📋 Copy Session Pack (' + pinnedCards.length + ')'),
      // Batch export of all pinned results
      pinnedCards.length > 0 && h('button', {
        className: 'btn btn-ghost',
        onClick: function() {
          var json = (typeof toBatchFariJSON !== 'undefined') ? toBatchFariJSON(pinnedCards, camp.meta.name) : null;
          if (!json) { setToast('Nothing to export'); return; }
          var blob = new Blob([json], {type: 'application/json'});
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = camp.meta.name.replace(/\s+/g, '-').toLowerCase() + '-session.fari.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function() { URL.revokeObjectURL(url); }, 60000);
          setToast('🎲 Fari pack downloaded - ' + pinnedCards.length + ' results');
          setShowHistory(false);
        },
        style: {width: '100%', marginBottom: 8, justifyContent: 'center', fontSize: 'var(--text-sm)'},
      }, '🎲 Export to Fari / Foundry (' + pinnedCards.length + ')'  ),
      // Pinned section
      pinnedCards.length > 0 && h('div', {style: {marginBottom: 16}},
        h('div', {className: 'history-label'}, '📌 Pinned'),
        h('div', {className: 'drawer-items'},
          pinnedCards.map(function(card) {
            return h('div', {
              key: card.id,
              className: 'history-item',
              style: {display:'flex', alignItems:'center', gap:4, paddingRight:2},
            },
              h('button', {
                style: {flex:1, textAlign:'left', background:'none', border:'none', cursor:'pointer',
                  color:'var(--text)', fontSize:'inherit', overflow:'hidden', textOverflow:'ellipsis',
                  whiteSpace:'nowrap', padding:0, fontFamily:'var(--font-ui)'},
                onClick: function() { restoreCard(card); setShowHistory(false); },
                title: 'Restore: ' + card.label,
              }, card.label),
              h('button', {
                style: {flexShrink:0, background:'none', border:'none', cursor:'pointer',
                  color:'var(--text-muted)', fontSize:13, padding:'0 2px', lineHeight:1},
                onClick: function() { unpinCard(card.id); },
                title: 'Unpin',
                'aria-label': 'Unpin ' + card.label,
              }, '✕')
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
      ), // close content-panel
    ), // close app-body

    // ── Toast notification ───────────────────────────────────────────
    toast && h('div', {className: 'toast'}, toast),

    // ── PERF-04: SW update available toast ───────────────────────────
    updateAvailable && h('div', {
      className: 'toast toast-update',
      role: 'status',
      'aria-live': 'polite',
    },
      '🔄 Update available — ',
      h('button', {
        onClick: function() { window.location.reload(); },
        style: {
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--accent)', fontWeight: 700, fontSize: 'inherit',
          fontFamily: 'inherit', padding: 0, textDecoration: 'underline',
        },
      }, 'reload to apply'),
      h('button', {
        onClick: function() { setUpdateAvailable(false); },
        style: {
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 16, padding: '0 0 0 10px',
          fontFamily: 'inherit', lineHeight: 1,
        },
        'aria-label': 'Dismiss update notification',
      }, '✕')
    ),

    // ── Modals ────────────────────────────────────────────────────────
    showHelp && h(HelpModal, {genId: activeGen, onClose: function() { setShowHelp(false); }}),
    showKbShortcuts && h(KBShortcutsModal, {onClose: function() { setShowKbShortcuts(false); }}),
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

    // First-visit onboarding - only shown once, surfaces Help Level for C1/C2 users
    showOnboarding && h(HelpLevelOnboardingModal, {onSelect: handleOnboardingSelect}),

    // Fate Point / Milestone / Initiative panel
    showFP && h('div', {className: 'fp-panel'},
      h(FatePointTracker, {
        state: fpState || DEFAULT_FP_STATE,
        onUpdate: updateFP,
        onClose: function() { setShowFP(false); },
        partySize: partySize,
        lastEncounter: (result && result.genId === 'encounter') ? result.data : null,
      })
    ),

    // PWA install nudge — shown after 2nd visit if installable and not dismissed
    showPwaNudge && h('div', {
      style: {
        position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
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
        onClick: function() {
          if (deferredInstallPrompt.current) {
            deferredInstallPrompt.current.prompt();
            deferredInstallPrompt.current.userChoice.then(function() {
              deferredInstallPrompt.current = null;
              setShowPwaNudge(false);
              try { LS.set('pwa_nudge_dismissed', true); } catch(e) {}
            });
          }
        },
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
      'Fate\u2122 trademark of Evil Hat Productions, LLC. \u00b7 ',
      h('a', {href: '../license.html', className: 'camp-content-footer-link'}, 'License & Attribution')
    ),

  ); // close app-shell
}

