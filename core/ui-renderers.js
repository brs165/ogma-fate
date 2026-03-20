// ui-renderers.js — All 16 result renderer components + renderResult dispatcher
// Depends on: ui-primitives.js (h, FD components)
// RESULT RENDERERS — Field Dossier design
// ════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════
// STUNT-02: StuntSuggester — tag-match stunt recommendations for NPC cards
// ════════════════════════════════════════════════════════════════════════

// Keyword → tag mapping for concept-to-stunt matching
const KEYWORD_TAGS = {
  // combat signals
  fight:['combat'],fighter:['combat'],warrior:['combat'],soldier:['combat'],guard:['combat'],
  enforcer:['combat'],killer:['combat'],assassin:['combat'],duelist:['combat'],hunter:['combat'],
  mercenary:['combat'],veteran:['combat'],brawler:['combat'],pit:['combat'],arena:['combat'],
  // stealth / subterfuge
  spy:['stealth','subterfuge'],shadow:['stealth'],thief:['subterfuge'],burglar:['subterfuge'],
  smuggler:['subterfuge'],rogue:['stealth','subterfuge'],infiltrat:['stealth','subterfuge'],
  sneak:['stealth'],outlaw:['stealth','subterfuge'],fugitive:['stealth','subterfuge'],
  con:['subterfuge'],bluff:['subterfuge'],deceiv:['subterfuge'],mask:['subterfuge','social'],
  // social / leadership
  leader:['leadership','social'],captain:['leadership'],commander:['leadership'],chief:['leadership'],
  warden:['leadership'],founder:['leadership','social'],elder:['leadership','social'],
  community:['leadership','social'],settlement:['leadership','social'],council:['leadership','social'],
  diplomat:['social','negotiation'],negotiat:['negotiation','social'],fixer:['social','negotiation'],
  broker:['negotiation','social'],merchant:['negotiation'],trader:['negotiation'],
  noble:['social','leadership'],lord:['leadership','social'],politician:['social','negotiation'],
  organis:['leadership','social'],network:['social','negotiation'],faction:['leadership','social'],
  // knowledge / investigation
  scholar:['knowledge'],lore:['knowledge'],sage:['knowledge'],archivist:['knowledge'],
  investigat:['investigation','knowledge'],detective:['investigation'],analyst:['investigation','knowledge'],
  cartograph:['knowledge','movement'],navigator:['knowledge','movement'],map:['knowledge','movement'],
  // technical / repair
  engineer:['technical','repair'],mechanic:['technical','repair'],tinker:['technical','repair'],
  craft:['technical'],inventor:['technical','repair'],hacker:['technical','subterfuge'],
  tech:['technical'],pilot:['movement','technical'],driver:['movement','technical'],
  // survival / movement
  scout:['movement','investigation','survival'],runner:['movement'],courier:['movement'],
  ranger:['survival','movement'],survivalist:['survival'],nomad:['movement','survival'],
  wasteland:['survival'],desert:['survival'],wild:['survival'],frontier:['survival','movement'],
  road:['movement','survival'],
  // supernatural / knowledge
  mage:['supernatural','knowledge'],wizard:['supernatural','knowledge'],witch:['supernatural'],
  occult:['supernatural','knowledge'],psychic:['supernatural'],medium:['supernatural','social'],
  eldritch:['supernatural'],mystic:['supernatural','knowledge'],oracle:['supernatural','knowledge'],
  // intimidation
  intimidat:['intimidation'],feared:['intimidation','social'],notorious:['intimidation','social'],
  warlord:['intimidation','leadership','combat'],enforcer:['intimidation','combat'],
};

function scoreStunt(stunt, conceptTags) {
  if (!stunt.tags || !conceptTags.length) return 0;
  let score = 0;
  stunt.tags.forEach(function(t) {
    if (conceptTags.indexOf(t) !== -1) score += 2;
  });
  // Slight bonus for matching the stunt skill to concept keywords
  return score;
}

function conceptToTags(concept) {
  if (!concept) return [];
  const lower = concept.toLowerCase();
  const found = [];
  Object.keys(KEYWORD_TAGS).forEach(function(kw) {
    if (lower.includes(kw)) {
      KEYWORD_TAGS[kw].forEach(function(t) {
        if (found.indexOf(t) === -1) found.push(t);
      });
    }
  });
  return found.length ? found : ['combat','social','survival']; // fallback
}

function suggestStunts(stunts, concept) {
  const tags = conceptToTags(concept);
  const scored = stunts.map(function(s) {
    return {stunt: s, score: scoreStunt(s, tags)};
  }).sort(function(a, b) { return b.score - a.score; });

  const bonus   = scored.filter(function(x) { return x.stunt.type === 'bonus'; });
  const special = scored.filter(function(x) { return x.stunt.type === 'special'; });

  // Pick best bonus, best special, then best from a *different* tag cluster as wildcard
  const pick1 = bonus[0] && bonus[0].stunt;
  const pick2 = special[0] && special[0].stunt;
  // Wildcard: highest-scoring stunt whose primary tag isn't already covered by picks 1+2
  const coveredTags = [pick1, pick2].filter(Boolean).flatMap(function(s) { return s.tags || []; });
  const wildcard = scored.find(function(x) {
    if (x.stunt === pick1 || x.stunt === pick2) return false;
    return (x.stunt.tags || []).some(function(t) { return coveredTags.indexOf(t) === -1; });
  }) || scored.find(function(x) { return x.stunt !== pick1 && x.stunt !== pick2; });

  return [pick1, pick2, wildcard && wildcard.stunt].filter(Boolean).slice(0, 3);
}

function StuntSuggester(props) {
  const concept = props.concept || '';
  const stunts  = props.stunts  || [];
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  function handleOpen() {
    if (!open) setSuggestions(suggestStunts(stunts, concept));
    setOpen(function(o) { return !o; });
  }
  function reroll() {
    // Shuffle the pool slightly by rotating and re-scoring
    const shuffled = stunts.slice().sort(function() { return Math.random() - 0.5; });
    setSuggestions(suggestStunts(shuffled, concept));
  }

  const typeLabel = {bonus: '+2 BONUS', special: 'ONCE/SCENE'};
  const typeColor = {bonus: 'var(--accent)', special: 'var(--c-green)'};

  return h('div', {className: 'stunt-suggester'},
    h('button', {
      className: 'stunt-suggest-btn',
      onClick: handleOpen,
      'aria-expanded': String(open),
      title: 'Suggest stunts based on this NPC\'s concept',
    },
      h('span', {className: 'stunt-suggest-icon', 'aria-hidden': 'true'}, '✦'),
      'Suggest stunts',
      h('span', {className: 'stunt-suggest-chevron', style: {transform: open ? 'rotate(180deg)' : 'none'}}, '▾')
    ),
    open && suggestions && h('div', {className: 'stunt-suggest-panel'},
      h('div', {className: 'stunt-suggest-eyebrow'},
        'Matched to: ',
        h('em', null, concept.length > 50 ? concept.substring(0, 50) + '…' : concept)
      ),
      h('div', {className: 'stunt-suggest-list'},
        suggestions.map(function(s, i) {
          return h('div', {key: i, className: 'stunt-suggest-card'},
            h('div', {className: 'stunt-suggest-header'},
              h('span', {className: 'stunt-suggest-name'}, s.name),
              h('span', {
                className: 'stunt-suggest-type',
                style: {color: typeColor[s.type] || 'var(--accent)'},
              }, typeLabel[s.type] || s.type),
              h('span', {className: 'stunt-suggest-skill'}, s.skill)
            ),
            h('div', {className: 'stunt-suggest-desc'}, s.desc),
            props.onUpdate && h('button', {
              className: 'stunt-suggest-use',
              title: 'Replace the weakest matching stunt on this NPC with ' + s.name,
              onClick: function() {
                props.onUpdate({swap_stunt: s});
              },
            }, '↩ Use this stunt')
          );
        })
      ),
      h('button', {className: 'stunt-suggest-reroll', onClick: reroll}, '↻ Different suggestions')
    )
  );
}

function MinorResult(props) {
  const d = props.data;
  return h(FDCard, null,
    h(FDId, {name: d.name, type: 'Minor NPC'}),
    h(FDHdr, {tip: 'Aspects are true statements. Invoke for +2 or reroll. Compel for fate points.'}, 'Aspects'),
    h(FDSect, null,
      h(FDAsp, {label: 'HC', tip: 'High Concept — core identity', hc: true, text: d.aspects[0], showQuality: true}),
      d.aspects[1] && h(FDAsp, {label: 'Weakness', tip: 'Weakness — GM compel target', tr: true, text: d.aspects[1], showQuality: true})
    ),
    h('div', {className: 'fd-body'},
      h('div', {className: 'fd-col'},
        h(FDHdr, null, 'Skills'),
        h(FDSect, null, d.skills.map(function(s, i) { return h(FDSkill, {key: i, name: s.name, r: s.r}); })),
        d.stunt && h(FDHdr, null, 'Stunt'),
        d.stunt && h(FDSect, null, h(FDStunt, {stunt: d.stunt}))
      ),
      h('div', {className: 'fd-col'},
        h(FDHdr, {tip: 'Stress = plot armour. Clears every scene.'}, 'Stress'),
        h(FDSect, null, h(FDStressTrack, {n: d.stress, label: 'Stress', onUpdate: props.onUpdate}))
      )
    ),
    props.stunts && props.stunts.length > 0 && h(StuntSuggester, {
      concept: d.aspects[0] || '',
      stunts: props.stunts,
    }),
    h(FDGm, {text: 'No consequence slots. One solid hit takes them out. Compel the weakness for drama.'})
  );
}

function MajorResult(props) {
  const d = props.data;
  return h(FDCard, null,
    h(FDId, {name: d.name, type: 'Major NPC', refresh: d.refresh}),
    h('div', {className: 'fd-body'},
      h('div', {className: 'fd-col'},
        h(FDHdr, null, 'Aspects'),
        h(FDSect, null,
          h(FDAsp, {label: 'HC', tip: 'High Concept — core truth. Invoke for +2.', hc: true, text: d.aspects.high_concept, showQuality: true}),
          h(FDAsp, {label: 'TR', tip: 'Trouble — what gets them in trouble. Compel target.', tr: true, text: d.aspects.trouble, showQuality: true}),
          d.aspects.others.map(function(a, i) { return h(FDAsp, {key: i, text: a, showQuality: true}); })
        ),
        h(FDHdr, {tip: 'Stress clears every scene. Consequences persist.'}, 'Stress & consequences'),
        h(FDSect, null,
          h(FDStressTrack, {n: d.physical_stress, label: 'Phys', onUpdate: props.onUpdate}),
          h(FDStressTrack, {n: d.mental_stress, label: 'Ment', onUpdate: props.onUpdate}),
          h(FDCon, {shifts: '2', sev: 'Mild', tip: 'Absorbs 2 shifts. Clear: next scene + overcome Fair (+2).'}),
          h(FDCon, {shifts: '4', sev: 'Moderate', tip: 'Absorbs 4 shifts. Clear: full session + overcome Great (+4).'}),
          h(FDCon, {shifts: '6', sev: 'Severe', tip: 'Absorbs 6 shifts. Clear: breakthrough + overcome Fantastic (+6).'})
        )
      ),
      h('div', {className: 'fd-col'},
        h(FDHdr, null, 'Skills'),
        h(FDSect, null, d.skills.map(function(s, i) { return h(FDSkill, {key: i, name: s.name, r: s.r}); })),
        h(FDHdr, null, 'Stunts'),
        h(FDSect, null, d.stunts.map(function(s, i) { return h(FDStunt, {key: i, stunt: s}); })),
        props.stunts && props.stunts.length > 0 && h(StuntSuggester, {
          concept: d.aspects.high_concept || '',
          stunts: props.stunts,
        })
      )
    ),
    h(FDGm, {text: 'Refresh ' + d.refresh + '. GM fate point pool = 1 per PC at scene start (FCon p.44). This NPC adds their refresh to the pool only when they return after conceding or taking hostile invokes. Can concede — let them escape for a future scene.'})
  );
}

function SceneResult(props) {
  const d = props.data;
  const [pinned, setPinned] = useState([]);
  function togglePin(i) {
    setPinned(function(p) {
      let next = p.includes(i) ? p.filter((x) => x!==i) : p.concat([i]);
      if (props.onUpdate) props.onUpdate({active_aspects: next});
      return next;
    });
  }
  const catLabel = {tone:'tone',movement:'movement',cover:'cover',danger:'danger',usable:'usable'};
  const catColor = {tone:'var(--c-purple)',movement:'var(--c-red)',cover:'var(--c-blue)',danger:'var(--c-red)',usable:'var(--c-green)'};
  const senseEmoji = {sight:'👁',sound:'👂',smell:'👃',touch:'✋',taste:'👅'};
  return h(FDCard, null,
    h(FDId, {name: 'Scene setup', type: props.worldName || 'Scene'}),
    h('div', {className: 'fd-body'},
      h('div', {className: 'fd-col'},
        h(FDHdr, {tip: 'Situation aspects are true. Anyone can invoke for +2 or compel. Tap to mark active.'}, 'Situation aspects'),
        h(FDSect, null,
          d.aspects.map(function(a, i) {
            const col = catColor[a.category] || 'var(--accent)';
            const isActive = pinned.includes(i);
            return h('div', {
              key: i, onClick: function() { togglePin(i); },
              className: 'fd-aspect-row' + (isActive ? ' fd-aspect-active' : ''),
              title: isActive ? 'Click to unmark' : 'Click to mark active',
            },
              h('div', {className: 'fd-aspect-check', style: {borderColor: isActive ? col : 'var(--border)', background: isActive ? col : 'transparent'}}, isActive ? '✓' : ''),
              h('div', {style: {flex: 1}},
                h('div', {style: {fontSize: 13, fontStyle: 'italic', color: isActive ? 'var(--text)' : 'var(--text-dim)', lineHeight: 1.35}}, a.name),
                h('div', {style: {display: 'flex', gap: 6, marginTop: 2, alignItems: 'center'}},
                  h('span', {className: 'fd-badge ' + (catLabel[a.category] || '')}, catLabel[a.category] || a.category),
                  a.sense && h('span', {
                    title: a.sense,
                    'aria-label': 'Sensory cue: ' + a.sense,
                    style: {fontSize: 10, opacity: 0.7, lineHeight: 1},
                  }, senseEmoji[a.sense] || ''),
                  a.free_invoke && h('span', {className: 'free-invoke-badge-appear', style: {fontSize: 10, color: 'var(--c-green)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase'}}, 'FREE INVOKE')
                )
              )
            );
          })
        )
      ),
      h('div', {className: 'fd-col'},
        h(FDHdr, {tip: 'Zones = areas. Moving costs 1 action unless free (no barrier).'}, 'Zones'),
        h(FDSect, null,
          d.zones && d.zones.map(function(z, i) { return h(FDZone, {key: i, name: z.name, aspect: z.aspect, desc: z.description}); })
        )
      )
    ),
    d.framing_questions && d.framing_questions.length > 0 && h('div', null,
      h(FDHdr, null, 'Scene framing'),
      h(FDSect, null,
        d.framing_questions.map(function(q, i) {
          return h('div', {key: i, style: {fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, padding: '3px 0', borderBottom: i < d.framing_questions.length - 1 ? '0.5px solid var(--border)' : 'none'}}, q);
        })
      )
    ),
    h(FDGm, {text: 'Announce 1–2 visible aspects as players arrive. Tap ✓ marks aspects currently in play.'})
  );
}

function CampaignResult(props) {
  const d = props.data;
  function Issue(iprops) {
    const [open, setOpen] = useState(true);
    const iss = iprops.issue;
    const panelId = 'issue-' + (iprops.side || 'a');
    return h('div', {style: {marginBottom: 6}},
      h('button', {onClick: function() { setOpen((v) => !v); },
        'aria-expanded': String(open), 'aria-controls': panelId,
        style: {display:'flex',alignItems:'center',gap:8,width:'100%',background:'none',border:'none',cursor:'pointer',padding:'3px 0',textAlign:'left'}},
        h('div', {style: {fontSize: 13, fontWeight: 700, color: iprops.color, flex: 1}}, iss.name),
        h('div', {style: {fontSize: 12, color: 'var(--text-muted)', transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'none'}}, '›')
      ),
      open && h('div', {id: panelId},
        h('div', {style: {fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 6, marginTop: 2}}, iss.desc),
        iss.faces && iss.faces.map(function(f, i) {
          return h('div', {key: i, style: {fontSize: 12, color: 'var(--text-muted)', marginBottom: 2}},
            h('span', {style: {color: iprops.color, fontWeight: 700}}, f.name), ' — ', f.role);
        }),
        iss.places && h('div', {style: {fontSize: 11, color: 'var(--text-muted)', marginTop: 3}}, iss.places.join(' · '))
      )
    );
  }
  return h(FDCard, null,
    h(FDId, {name: 'Campaign issues', type: 'Campaign'}),
    h('div', {className: 'fd-body'},
      h('div', {className: 'fd-col'},
        h(FDHdr, {tip: 'Current issue drives compels this session.'}, 'Current issue'),
        d.current && h(FDSect, null, h(Issue, {issue: d.current, color: 'var(--accent)', side: 'current'})),
        !d.current && h(FDSect, null, h('div', {style:{fontSize:11,color:'var(--text-muted)',fontStyle:'italic'}},'No current issue data')),
        h(FDHdr, {tip: 'Impending issue advances off-screen if ignored.'}, 'Impending issue'),
        d.impending && h(FDSect, null, h(Issue, {issue: d.impending, color: 'var(--c-purple)', side: 'impending'})),
        !d.impending && h(FDSect, null, h('div', {style:{fontSize:11,color:'var(--text-muted)',fontStyle:'italic'}},'No impending issue data'))
      ),
      h('div', {className: 'fd-col'},
        h(FDHdr, null, 'Setting aspects'),
        h(FDSect, null, (d.setting||[]).map(function(a, i) { return h(FDAsp, {key: i, text: a, badge: 'tone', badgeLabel: 'setting'}); }))
      )
    ),
    h(FDGm, {text: 'Keep one current and one impending. When the current resolves, promote the impending and roll a new one.'})
  );
}

function EncounterResult(props) {
  const d = props.data;
  const [gmFP, setGmFP] = useState(d.gm_fate_points || 0);
  return h(FDCard, null,
    h(FDId, {name: 'Encounter', type: 'Encounter'}),
    h('div', {className: 'fd-body'},
      h('div', {className: 'fd-col'},
        h(FDHdr, null, 'Situation aspects'),
        h(FDSect, null, d.aspects.map(function(a, i) { return h(FDAsp, {key: i, text: a, showQuality: true}); })),
        h(FDHdr, {tip: 'Zones = areas. Moving costs 1 action unless free.'}, 'Zones'),
        h(FDSect, null, d.zones && d.zones.map(function(z, i) { return h(FDZone, {key: i, name: z.name, aspect: z.aspect}); }))
      ),
      h('div', {className: 'fd-col'},
        h(FDHdr, {tip: 'Opposition shares GM pool: 1 FP per PC.'}, 'Opposition'),
        h(FDSect, null,
          d.opposition.map(function(o, oi) {
            return h('div', {key: oi, className: 'fd-opp'},
              h('div', {className: 'fd-opph'},
                h('span', {className: 'fd-oppn'}, o.name + (o.qty > 1 ? ' ×' + o.qty : '')),
                h('span', {className: 'fd-oppt'}, o.type)
              ),
              h('div', {className: 'fd-oppb'},
                o.aspects && o.aspects.map(function(a, i) { return h('div', {key: i, className: 'fd-oppa'}, a); }),
                o.skills && o.skills.map(function(s, i) { return h('span', {key: i}, h('b', null, s.name + ' +' + s.r), i < o.skills.length - 1 ? ' · ' : ''); }),
                o.stunt && h('div', {style: {fontSize: 11, marginTop: 3}}, h('span', {style: {color: 'var(--accent)', fontWeight: 700}}, 'Stunt: '), o.stunt),
                h(FDStressTrack, {n: o.stress, label: 'Stress'})
              )
            );
          })
        ),
        h(FDHdr, null, 'Conditions'),
        h(FDSect, null,
          h('div', {className: 'fd-cond'}, h('span', {className: 'fd-cl', style: {color: 'var(--c-green)'}}, 'Victory'), h('span', {style: {fontStyle: 'italic', color: 'var(--text)'}}, d.victory)),
          h('div', {className: 'fd-cond'}, h('span', {className: 'fd-cl', style: {color: 'var(--c-red)'}}, 'Defeat'), h('span', {style: {fontStyle: 'italic', color: 'var(--text)'}}, d.defeat))
        )
      )
    ),
    h(FDTwist, {text: d.twist}),
    // GM Fate Points - interactive tally
    h('div', {className: 'fd-fp'},
      Array.from({length: Math.max(d.gm_fate_points, gmFP) + 1}, function(_, i) {
        return h('div', {key: i, className: 'fd-fpd' + (i < gmFP ? ' spent' : ''),
          title: i < gmFP ? 'Click to spend' : 'Spent',
          onClick: function() { setGmFP((v) => v === i + 1 ? i : i + 1); }}, '◆');
      }),
      h('span', {className: 'fd-fpl'}, 'GM pool (' + d.gm_fate_points + ' PCs)')
    ),
    h(FDGm, {text: 'State victory/defeat before the first roll. Drop the twist when the outcome feels settled.'})
  );
}

function SeedResult(props) {
  const d = props.data;
  const [activeScene, setActiveScene] = useState(0);
  const sceneColors = ['var(--c-blue)', 'var(--c-purple)', 'var(--c-red)'];
  return h(FDCard, null,
    h(FDId, {name: 'Session starter', type: 'Session'}),
    h(FDHdr, null, 'Setup'),
    h(FDSect, null,
      h(FDInfoBox, {label: 'Location', text: d.location, color: 'var(--c-blue)', tip: 'Where Session 1 opens'}),
      h(FDInfoBox, {label: 'Objective', text: d.objective, color: 'var(--accent)', tip: 'What the party is here to do'}),
      h(FDInfoBox, {label: 'Complication', text: d.complication, color: 'var(--c-red)', tip: 'What makes it not simple'})
    ),
    h(FDHdr, null, 'Three scene sketch'),
    h(FDSect, null,
      h('div', {style: {display: 'flex', gap: 4, marginBottom: 8}},
        d.scenes.map(function(scene) {
            const col = sceneColors[scene.num - 1]; var isActive = activeScene === scene.num - 1;
          return h('button', {key: scene.num, onClick: function() { setActiveScene(scene.num - 1); }, className: 'seed-scene-tab',
            style: {background: isActive ? 'color-mix(in srgb, ' + col + ' 15%, transparent)' : 'var(--inset)', borderColor: isActive ? col + '55' : 'var(--border)', color: isActive ? col : 'var(--text-muted)'}}, scene.type);
        })
      ),
      h('div', {style: {padding: '8px 12px', borderRadius: 8, border: '1px solid ' + sceneColors[activeScene] + '44', background: sceneColors[activeScene] + '0d', fontSize: 13, color: 'var(--text)', lineHeight: 1.6}}, d.scenes[activeScene].brief)
    ),
    h('div', {className: 'fd-body'},
      h('div', {className: 'fd-col'},
        h(FDHdr, null, 'Opposition'),
        h(FDSect, null,
          d.opposition.map(function(o, oi) {
            return h('div', {key: oi, className: 'fd-opp'},
              h('div', {className: 'fd-opph'}, h('span', {className: 'fd-oppn'}, o.name), h('span', {className: 'fd-oppt'}, o.type === 'major' ? 'Major' : 'Mook')),
              h('div', {className: 'fd-oppb'}, h('span', {style: {color: 'var(--text-muted)'}}, o.desc))
            );
          })
        )
      ),
      h('div', {className: 'fd-col'},
        h(FDHdr, null, 'Stakes'),
        h(FDSect, null,
          h(FDInfoBox, {label: 'Victory', text: d.victory, color: 'var(--c-green)'}),
          h(FDInfoBox, {label: 'Defeat', text: d.defeat, color: 'var(--c-red)'}),
          h(FDInfoBox, {label: 'Twist', text: d.twist, color: 'var(--c-purple)', tip: 'Hold until the outcome looks settled'})
        )
      )
    ),
    h(FDSect, null,
      h(FDInfoBox, {label: 'Setting aspect', text: d.setting_asp, color: 'var(--c-blue)'}),
      h(FDInfoBox, {label: 'Campaign issue', text: d.issue, color: 'var(--accent)'})
    ),
    h(FDGm, {text: 'Prep Scene 1 in full. Follow the players after that. State victory/defeat before the first roll.'}),
    props.onChainRoll && h('div', {className: 'chain-roll-strip'},
      h('span', {className: 'chain-roll-label'}, 'Connected'),
      h('button', {
        className: 'chain-roll-btn',
        onClick: function() { props.onChainRoll('scene'); },
        title: 'Roll a scene for the seed location',
      }, '🎲 Roll Scene for this location'),
      h('button', {
        className: 'chain-roll-btn',
        onClick: function() { props.onChainRoll('faction'); },
        title: 'Roll a faction involved in this seed',
      }, '🎲 Roll Faction for this seed')
    )
  );
}

function CompelResult(props) {
  const d = props.data;
  const [resolution, setResolution] = useState(null);
  return h(FDCard, {className: 'compel-result-appear'},
    h(FDId, {name: 'Compel', type: 'Compel'}),
    h(FDSect, null,
      h(FDInfoBox, {label: 'Situation', text: d.situation, color: 'var(--accent)'}),
      h(FDInfoBox, {label: 'If accepted', text: d.consequence, color: 'var(--c-red)'}),
      d.template && h(FDInfoBox, {label: (d.template_type === 'event' ? 'Event' : 'Decision') + ' framing', text: d.template, color: 'var(--c-purple)'})
    ),
    h(FDSect, null,
      resolution === null && h('div', {style: {display: 'flex', gap: 8}},
        h('button', {onClick: function() { setResolution('accepted'); },
          style: {flex:1,padding:'10px 14px',borderRadius:8,border:'1px solid var(--c-green)',cursor:'pointer',background:'color-mix(in srgb,var(--c-green) 10%,transparent)',color:'var(--c-green)',fontWeight:700,fontSize:13,fontFamily:'var(--font-ui)',transition:'all 0.15s'}}, '✓ Accept — gain 1 FP'),
        h('button', {onClick: function() { setResolution('refused'); },
          style: {flex:1,padding:'10px 14px',borderRadius:8,border:'1px solid var(--c-red)',cursor:'pointer',background:'color-mix(in srgb,var(--c-red) 10%,transparent)',color:'var(--c-red)',fontWeight:700,fontSize:13,fontFamily:'var(--font-ui)',transition:'all 0.15s'}}, '✕ Refuse — spend 1 FP')
      ),
      resolution && h('div', {role: 'status', 'aria-live': 'polite', style: {padding:'10px 14px',borderRadius:8,textAlign:'center',background:resolution==='accepted'?'color-mix(in srgb,var(--c-green) 10%,transparent)':'color-mix(in srgb,var(--c-red) 10%,transparent)',border:'1px solid '+(resolution==='accepted'?'var(--c-green)':'var(--c-red)')}},
        h('div', {style: {fontWeight:700,fontSize:13,color:resolution==='accepted'?'var(--c-green)':'var(--c-red)'}}, resolution === 'accepted' ? 'Accepted — complication enters play, player gains 1 FP' : 'Refused — player spends 1 FP'),
        h('button', {onClick: function() { setResolution(null); }, style: {marginTop:6,background:'none',border:'none',cursor:'pointer',fontSize:11,color:'var(--text-muted)',fontFamily:'var(--font-ui)'}}, '↩ Reset')
      )
    ),
    h(FDGm, {text: 'Offer the fate point BEFORE stating the consequence. Refusal costs 1 FP — that is the system working.'})
  );
}

function ChallengeResult(props) {
  const d = props.data;
  const [outcome, setOutcome] = useState('none');
  return h(FDCard, null,
    h(FDId, {name: d.name, type: 'Challenge'}),
    h(FDSect, null,
      h('div', {style: {fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 8}}, d.desc)
    ),
    h('div', {className: 'fd-body'},
      h('div', {className: 'fd-col'},
        h(FDHdr, null, 'Primary skills'),
        h(FDSect, null, h('div', {style: {fontSize: 13, color: 'var(--text)'}}, d.primary)),
        h(FDHdr, null, 'Opposing force'),
        h(FDSect, null, h('div', {style: {fontSize: 13, color: 'var(--text)'}}, d.opposing))
      ),
      h('div', {className: 'fd-col'},
        h(FDHdr, null, 'Outcomes — tap to select'),
        h(FDSect, null,
          h('button', {
            onClick: function() { setOutcome((v) => v === 'success' ? 'none' : 'success'); },
            role: 'checkbox', 'aria-checked': String(outcome === 'success'),
            'aria-label': 'Mark outcome: Success',
            className: 'fd-infobox', style: {width: '100%', textAlign: 'left', borderColor: 'var(--c-green)44', backgroundColor: outcome === 'success' ? 'color-mix(in srgb,var(--c-green) 18%,transparent)' : 'color-mix(in srgb,var(--c-green) 6%,transparent)', cursor: 'pointer', outline: outcome === 'success' ? '2px solid var(--c-green)' : 'none', transition: 'all 0.15s', border: '0.5px solid', borderRadius: 'var(--glass-radius-sm,6px)', padding: '8px 12px', fontFamily: 'var(--font-ui)'}},
            h('div', {className: 'fd-infobox-label', style: {color: 'var(--c-green)'}}, 'Success' + (outcome === 'success' ? ' ◀' : '')),
            h('div', {className: 'fd-infobox-text'}, d.success)
          ),
          h('button', {
            onClick: function() { setOutcome((v) => v === 'failure' ? 'none' : 'failure'); },
            role: 'checkbox', 'aria-checked': String(outcome === 'failure'),
            'aria-label': 'Mark outcome: Failure',
            className: 'fd-infobox', style: {width: '100%', textAlign: 'left', borderColor: 'var(--c-red)44', backgroundColor: outcome === 'failure' ? 'color-mix(in srgb,var(--c-red) 18%,transparent)' : 'color-mix(in srgb,var(--c-red) 6%,transparent)', cursor: 'pointer', outline: outcome === 'failure' ? '2px solid var(--c-red)' : 'none', transition: 'all 0.15s', border: '0.5px solid', borderRadius: 'var(--glass-radius-sm,6px)', padding: '8px 12px', fontFamily: 'var(--font-ui)'}},
            h('div', {className: 'fd-infobox-label', style: {color: 'var(--c-red)'}}, 'Failure' + (outcome === 'failure' ? ' ◀' : '')),
            h('div', {className: 'fd-infobox-text'}, d.failure)
          )
        )
      )
    ),
    h(FDGm, {text: 'Let players Create Advantage first. Keep it to 3–5 rolls. Failure changes the situation — it doesn\'t end the scene.'})
  );
}

function ContestResult(props) {
  const d = props.data;
  const WIN = d.victories_needed || 3;
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const winner = scoreA >= WIN ? d.side_a : scoreB >= WIN ? d.side_b : null;
  function updateScoreA(fn) { setScoreA(function(v) { let next = fn(v); if (props.onUpdate) props.onUpdate({scoreA: next, scoreB: scoreB, WIN: WIN}); return next; }); }
  function updateScoreB(fn) { setScoreB(function(v) { let next = fn(v); if (props.onUpdate) props.onUpdate({scoreA: scoreA, scoreB: next, WIN: WIN}); return next; }); }
  function TrackSide(tp) {
    const score = tp.score; var isWinner = score >= WIN;
    return h('div', {className: 'fd-infobox', style: {borderColor: isWinner ? 'var(--accent)44' : tp.colorVar + '44', backgroundColor: isWinner ? 'color-mix(in srgb,var(--accent) 15%,transparent)' : 'color-mix(in srgb,' + tp.colorVar + ' 8%,transparent)', transition: 'all 0.3s'}},
      h('div', {className: 'fd-infobox-label', style: {color: isWinner ? 'var(--accent)' : tp.colorVar}}, tp.icon + ' ' + tp.name + (isWinner ? ' 🏆' : '')),
      h('div', {style: {fontSize: 12, color: 'var(--text-muted)', marginBottom: 6}}, tp.skills),
      h('div', {style: {display: 'flex', gap: 5, marginBottom: 6}},
        Array.from({length: WIN}, function(_, i) {
          var filled = i < score;
          return h('div', {
            key: i,
            role: 'checkbox', tabIndex: 0,
            'aria-checked': String(filled),
            'aria-label': tp.name + ' victory ' + (i+1) + ' of ' + WIN,
            onClick: function() { tp.setScore((v) => v === i + 1 ? i : i + 1); },
            onKeyDown: function(e) { if (e.key===' '||e.key==='Enter'){e.preventDefault();tp.setScore(function(v){return v===i+1?i:i+1;});} },
            className: 'contest-box',
            style: {border: '2px solid ' + (filled ? (isWinner ? 'var(--accent)' : tp.colorVar) : 'var(--border)'), background: filled ? (isWinner ? 'var(--accent)' : 'color-mix(in srgb,' + tp.colorVar + ' 30%,transparent)') : 'transparent', color: filled ? (isWinner ? 'var(--bg)' : tp.colorVar) : 'var(--text-muted)'}}, filled ? '✓' : '');
        })
      ),
      h('div', {style: {fontSize: 11, color: isWinner ? 'var(--accent)' : 'var(--text-muted)'}}, score + ' / ' + WIN + (isWinner ? ' — wins!' : ''))
    );
  }
  return h(FDCard, null,
    h(FDId, {name: d.contest_type, type: 'Contest'}),
    h(FDSect, null,
      h('div', {style: {fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 8}}, d.desc),
      h(FDAsp, {text: d.aspect, badge: 'tone', badgeLabel: 'situation'})
    ),
    h('div', {className: 'fd-body'},
      h('div', {className: 'fd-col'}, h(FDSect, null, h(TrackSide, {name: d.side_a, skills: d.skills_a, score: scoreA, setScore: updateScoreA, colorVar: 'var(--c-blue)', icon: '🔵'}))),
      h('div', {className: 'fd-col'}, h(FDSect, null, h(TrackSide, {name: d.side_b, skills: d.skills_b, score: scoreB, setScore: updateScoreB, colorVar: 'var(--c-red)', icon: '🔴'})))
    ),
    winner && h(FDSect, null,
      h('div', {style: {padding:'10px 14px',borderRadius:8,textAlign:'center',background:'color-mix(in srgb,var(--accent) 12%,transparent)',border:'1px solid var(--accent)',animation:'fadeUp 0.2s ease both'}},
        h('div', {style: {fontSize: 15, fontWeight: 800, color: 'var(--accent)'}}, winner + ' wins!'),
        h('button', {onClick: function() { setScoreA(0); setScoreB(0); if (props.onUpdate) props.onUpdate({scoreA:0,scoreB:0,WIN:WIN}); }, className: 'contest-reset-btn'}, '↩ Reset')
      )
    ),
    h(FDHdr, null, 'Twists — on tied exchanges'),
    h(FDSect, null, d.twists.map(function(tw, i) {
      return h('div', {key: i, style: {fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, padding: '3px 0', borderBottom: i < d.twists.length - 1 ? '0.5px solid var(--border)' : 'none'}},
        h('span', {style: {color: 'var(--c-purple)', fontWeight: 700}}, (i + 1) + '. '), tw);
    })),
    h('div', {className: 'fd-body'},
      h('div', {className: 'fd-col'}, h(FDSect, null, h(FDInfoBox, {label: 'If ' + d.side_a + ' wins', text: d.stakes_good, color: 'var(--c-green)'}))),
      h('div', {className: 'fd-col'}, h(FDSect, null, h(FDInfoBox, {label: 'If ' + d.side_b + ' wins', text: d.stakes_bad, color: 'var(--c-red)'})))
    ),
    h(FDGm, {text: 'Tap boxes to score victories. First to ' + WIN + ' wins. On a tie: neither side marks a victory. GM introduces a new situation aspect (FCon p.33).'})
  );
}

function ConsequenceResult(props) {
  const d = props.data;
  const [treated, setTreated] = useState(false);
  const [cleared, setCleared] = useState(false);
  const sevColor = {mild: 'var(--c-blue)', moderate: 'var(--c-purple)', severe: 'var(--c-red)'};
  const recoveryTarget = {mild: 'Fair +2', moderate: 'Great +4', severe: 'Fantastic +6'};
  const recoveryWindow = {mild: 'next scene', moderate: 'full session', severe: 'breakthrough'};
  const col = sevColor[d.severity] || 'var(--accent)';
  return h(FDCard, null,
    h(FDId, {name: d.aspect, type: 'Consequence', extra: h('span', {className: 'fd-pill fd-pill-type consequence-severity-label', style: {color: col, borderColor: col}}, d.severity.toUpperCase())}),
    h(FDSect, null,
      h('div', {style: {fontSize: 13, fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: 8}}, 'Suffered ' + d.context),
      h(FDInfoBox, {label: 'Compel hook', text: d.compel_hook, color: 'var(--c-purple)', tip: 'Use this to offer a fate point when the consequence makes things worse'})
    ),
    h(FDHdr, null, 'Recovery tracker'),
    h(FDSect, null,
      h('div', {style: {display: 'flex', flexDirection: 'column', gap: 8}},
        h('label', {onClick: function() { setTreated((v) => !v); }, role: 'checkbox', 'aria-checked': String(treated), 'aria-label': 'Treatment: overcome ' + recoveryTarget[d.severity], style: {display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer'}},
          h('div', {className: 'fd-box' + (treated ? ' on' : ''), style: {width: 20, height: 20}}, treated ? '✓' : ''),
          h('div', null,
            h('div', {style: {fontSize: 13, color: treated ? 'var(--text)' : 'var(--text-muted)', fontWeight: treated ? 600 : 400}}, 'Treatment: overcome ' + recoveryTarget[d.severity]),
            h('div', {style: {fontSize: 11, color: 'var(--text-muted)'}}, 'Academics (physical) or Empathy (mental) · +2 if self-treating')
          )
        ),
        h('label', {onClick: function() { if (treated) setCleared((v) => !v); }, role: 'checkbox', 'aria-checked': String(cleared), 'aria-disabled': String(!treated), 'aria-label': 'Cleared after ' + recoveryWindow[d.severity], style: {display: 'flex', alignItems: 'center', gap: 10, cursor: treated ? 'pointer' : 'not-allowed', opacity: treated ? 1 : 0.4}},
          h('div', {className: 'fd-box' + (cleared ? ' on' : ''), style: {width: 20, height: 20, borderColor: cleared ? 'var(--c-green)' : 'var(--accent-dim)', background: cleared ? 'var(--c-green)' : 'transparent'}}, cleared ? '✓' : ''),
          h('div', null,
            h('div', {style: {fontSize: 13, color: cleared ? 'var(--c-green)' : 'var(--text-muted)', fontWeight: cleared ? 600 : 400}}, 'Cleared after ' + recoveryWindow[d.severity]),
            h('div', {style: {fontSize: 11, color: 'var(--text-muted)'}}, treated ? 'Time has passed — clear when ready' : 'Treatment must complete first')
          )
        )
      )
    ),
    h(FDGm, {text: 'A consequence that never gets compelled is wasted narrative weight. Plan at least one compel before it heals.'})
  );
}

function FactionResult(props) {
  const d = props.data;
  return h(FDCard, null,
    h(FDId, {name: d.name, type: 'Faction'}),
    h('div', {className: 'fd-body'},
      h('div', {className: 'fd-col'},
        h(FDHdr, null, 'Goal'),
        h(FDSect, null, h(FDAsp, {hc: true, text: d.goal})),
        h(FDHdr, null, 'Methods'),
        h(FDSect, null, d.method && h('div', {style: {fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6}}, d.method)),
        h(FDHdr, null, 'Weakness'),
        h(FDSect, null, h(FDAsp, {tr: true, text: d.weakness}))
      ),
      h('div', {className: 'fd-col'},
        h(FDHdr, null, 'Named face'),
        h(FDSect, null,
          d.face && h('div', null,
            h('div', {style: {fontSize: 14, fontWeight: 700, color: 'var(--text)'}}, d.face.name),
            h('div', {style: {fontSize: 12, color: 'var(--text-muted)'}}, d.face.role),
            d.face.aspect && h(FDAsp, {text: d.face.aspect})
          )
        ),
        d.aspect && h(FDHdr, null, 'Faction aspect'),
        d.aspect && h(FDSect, null, h(FDAsp, {text: d.aspect, badge: 'tone', badgeLabel: 'faction'}))
      )
    ),
    h(FDGm, {text: 'Advance the faction one step toward its goal off-screen each session the party ignores it.'}),
    props.onChainRoll && h('div', {className: 'chain-roll-strip'},
      h('span', {className: 'chain-roll-label'}, 'Connected'),
      h('button', {
        className: 'chain-roll-btn',
        onClick: function() { props.onChainRoll('npc_major'); },
        title: 'Roll a major NPC as the faction face',
      }, '🎲 Roll NPC for faction face'),
      h('button', {
        className: 'chain-roll-btn',
        onClick: function() { props.onChainRoll('seed'); },
        title: 'Roll an adventure seed involving this faction',
      }, '🎲 Roll Seed involving this faction')
    )
  );
}

function ComplicationResult(props) {
  const d = props.data;
  return h(FDCard, null,
    h(FDId, {name: d.type.name || 'Complication', type: 'Complication'}),
    h(FDSect, null,
      h(FDAsp, {text: d.type.aspect || d.aspect, badge: 'danger', badgeLabel: 'situation'}),
      d.arrival && h(FDInfoBox, {label: 'Arrives', text: d.arrival, color: 'var(--c-purple)'}),
      d.env && h(FDInfoBox, {label: 'Environment', text: d.env, color: 'var(--c-blue)'}),
      d.new_aspects && d.new_aspects.map(function(a, i) { return h(FDAsp, {key: i, text: a, badge: 'usable', badgeLabel: 'new aspect'}); })
    ),
    h(FDGm, {text: 'Introduce one element at a time. New aspects come with a free invoke. Deploy when the scene feels settled.'})
  );
}

function BackstoryResult(props) {
  const d = props.data;
  return h(FDCard, null,
    h(FDId, {name: 'Backstory prompts', type: 'Backstory'}),
    h(FDHdr, null, 'Questions'),
    h(FDSect, null,
      d.questions && d.questions.map(function(q, i) {
        return h('div', {key: i, style: {fontSize: 13, color: 'var(--text)', lineHeight: 1.6, padding: '4px 0', borderBottom: i < d.questions.length - 1 ? '0.5px solid var(--border)' : 'none'}}, q);
      })
    ),
    h('div', {className: 'fd-body'},
      h('div', {className: 'fd-col'},
        h(FDHdr, null, 'Hooks'),
        h(FDSect, null, d.hooks && d.hooks.map(function(hk, i) { return h(FDAsp, {key: i, text: hk}); }))
      ),
      h('div', {className: 'fd-col'},
        h(FDHdr, null, 'Relationships'),
        h(FDSect, null, d.relationships && d.relationships.map(function(r, i) { return h('div', {key: i, style: {fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)', padding: '3px 0'}}, '"' + r + '"'); }))
      )
    ),
    d.hook && h(FDSect, null, h(FDInfoBox, {label: 'Opening hook', text: d.hook, color: 'var(--c-green)'})),
    h(FDGm, {text: 'Ask the question and shut up. Wait for the second, messier answer. Every answer should produce at least one aspect.'})
  );
}

function ObstacleResult(props) {
  const d = props.data;
  const typeColor = {hazard: 'var(--c-red)', block: 'var(--c-blue)', distraction: 'var(--c-purple)'};
  const col = typeColor[d.obstacle_type] || 'var(--accent)';
  if (d.obstacle_type === 'distraction') {
    return h(FDCard, null,
      h(FDId, {name: d.name, type: 'Distraction', extra: h('span', {className: 'fd-pill fd-pill-type', style: {color: col, borderColor: col}}, 'DISTRACTION')}),
      h(FDSect, null, h(FDInfoBox, {label: 'The choice', text: d.choice, color: 'var(--c-purple)'})),
      h('div', {className: 'fd-body'},
        h('div', {className: 'fd-col'},
          h(FDHdr, null, 'Leave it'),
          h(FDSect, null, h('div', {style: {fontSize: 13, color: 'var(--text)'}}, d.repercussion_leave))
        ),
        h('div', {className: 'fd-col'},
          h(FDHdr, null, 'Deal with it'),
          h(FDSect, null, h('div', {style: {fontSize: 13, color: 'var(--text)'}}, d.repercussion_deal))
        )
      ),
      d.opposition && h(FDSect, null, h('div', {style: {fontSize: 12, color: 'var(--text-muted)'}}, 'Opposition: ' + d.opposition_label + ' (+' + d.opposition + ')')),
      h(FDGm, {text: d.gm_note})
    );
  }
  return h(FDCard, null,
    h(FDId, {name: d.name, type: d.obstacle_type, extra: h('span', {className: 'fd-pill fd-pill-type', style: {color: col, borderColor: col}}, d.obstacle_type.toUpperCase())}),
    h(FDSect, null,
      h(FDAsp, {text: d.aspect, badge: d.obstacle_type === 'hazard' ? 'danger' : 'cover', badgeLabel: d.obstacle_type}),
      h('div', {style: {display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, marginTop: 6}},
        h('span', {style: {color: 'var(--text-muted)'}}, 'Rating: ', h('b', {style: {color: 'var(--text)'}}, d.rating_label + ' (+' + d.rating + ')')),
        d.weapon > 0 && h('span', {style: {color: 'var(--c-red)'}}, 'Weapon: ' + d.weapon),
        d.obstacle_type === 'block' && h('span', {style: {color: 'var(--text-muted)'}}, 'Disable: +' + (d.rating + 2))
      )
    ),
    h(FDSect, null, h(FDInfoBox, {label: 'How to disable', text: d.disable, color: 'var(--c-green)'})),
    h(FDGm, {text: d.gm_note})
  );
}

function CountdownResult(props) {
  const d = props.data;
  const [filled, setFilled] = useState(0);
  const [particles, setParticles] = useState([]);
  const [shockKey, setShockKey] = useState(0);
  const triggered = filled >= d.boxes;
  const pct = d.boxes > 0 ? filled / d.boxes : 0;
  const barColor = pct < 0.5 ? 'var(--accent)' : pct < 0.75 ? 'var(--c-purple)' : 'var(--c-red)';
  function markBox(i) {
    let next = filled === i + 1 ? i : i + 1;
    const wasTriggered = filled >= d.boxes;
    setFilled(next);
    if (props.onUpdate) props.onUpdate({filled: next, boxes: d.boxes});
    // Adaptive vibrancy: push pressure level to app-shell for CSS ramp
    var shell = document.querySelector('.app-shell');
    if (shell && d.boxes > 0) {
      var p = next / d.boxes;
      var lvl = next === 0 ? null : p < 0.4 ? 'low' : p < 0.65 ? 'mid' : p < 0.9 ? 'high' : 'critical';
      lvl ? shell.setAttribute('data-pressure', lvl) : shell.removeAttribute('data-pressure');
    }
    if (next >= d.boxes && !wasTriggered) {
      var pts = Array.from({length: 12}, function(_, p) { var angle = p * 30 * (Math.PI / 180); var r = 40 + Math.random() * 25; return {id: p, px: Math.round(Math.cos(angle) * r), py: Math.round(Math.sin(angle) * r)}; });
      setParticles(pts);
      setShockKey(function(k) { return k + 1; });
      setTimeout(function() { setParticles([]); }, 700);
      if (navigator.vibrate) navigator.vibrate([30, 50, 100]);
    }
  }
  return h(FDCard, null,
    h(FDId, {name: d.name, type: 'Countdown'}),
    h(FDSect, null,
      h('div', {key: 'track-' + shockKey, className: (triggered ? 'cd-triggered-shake countdown-shockwave' : ''), style: {position: 'relative', padding: '12px 0', overflow: 'visible', borderRadius: 8}},
        h('div', {style: {position: 'absolute', top: 0, left: 0, height: '100%', width: (pct * 100) + '%', background: 'color-mix(in srgb,' + barColor + ' 12%,transparent)', transition: 'width 0.3s, background 0.3s', pointerEvents: 'none', borderRadius: 6}}),
        particles.map(function(p) { return h('div', {key: p.id, className: 'cd-particle', style: {'--px': p.px + 'px', '--py': p.py + 'px', animationDelay: (p.id * 0.025) + 's'}}); }),
        h('div', {style: {fontSize: 9, color: triggered ? 'var(--c-red)' : barColor, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, position: 'relative'}}, triggered ? 'TRIGGERED' : 'TRACK — tap to mark'),
        h('div', {style: {display: 'flex', gap: 5, flexWrap: 'wrap', position: 'relative', marginBottom: 6}},
          Array.from({length: d.boxes}, function(_, i) {
            const isMarked = i < filled;
            const boxColor = i < filled * 0.5 ? 'var(--accent)' : i < filled * 0.75 ? 'var(--c-purple)' : 'var(--c-red)';
            return h('div', {
              key: i,
              role: 'checkbox', tabIndex: 0,
              'aria-checked': String(isMarked),
              'aria-label': 'Countdown box ' + (i+1) + ' of ' + d.boxes,
              onClick: function() { markBox(i); },
              onKeyDown: function(e) { if (e.key===' '||e.key==='Enter'){e.preventDefault();markBox(i);} },
              className: 'cd-box',
              style: {border: '2px solid ' + (isMarked ? boxColor : 'var(--border)'), background: isMarked ? 'color-mix(in srgb,' + boxColor + ' 25%,transparent)' : 'transparent', color: isMarked ? boxColor : 'var(--text-muted)'}}, isMarked ? '✕' : String(i + 1));
          })
        ),
        h('div', {style: {fontSize: 11, color: 'var(--text-muted)', position: 'relative'}}, filled + ' of ' + d.boxes + ' · measured in ' + d.unit)
      )
    ),
    h(FDSect, null,
      h(FDInfoBox, {label: 'Trigger', text: d.trigger, color: barColor}),
      h('div', {className: triggered ? 'cd-outcome-appear' : '', style: {padding: '10px 12px', borderRadius: 8, border: '1px solid ' + (triggered ? 'var(--c-red)' : 'var(--c-red)44'), background: triggered ? 'color-mix(in srgb,var(--c-red) 15%,transparent)' : 'color-mix(in srgb,var(--c-red) 6%,transparent)', transition: 'all 0.3s'}},
        h('div', {style: {fontSize: 9, fontWeight: 700, color: 'var(--c-red)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4}}, triggered ? 'TRIGGERED — THIS HAPPENS NOW' : 'WHEN THE CLOCK HITS ZERO'),
        h('div', {style: {fontSize: 13, color: triggered ? 'var(--text)' : 'var(--text-muted)', fontWeight: triggered ? 600 : 400, lineHeight: 1.5}}, d.outcome)
      )
    ),
    h(FDGm, {text: d.gm_note})
  );
}

function ConstraintResult(props) {
  const d = props.data;
  const [bypassDone, setBypassDone] = useState(false);
  // Engine produces: constraint_type, name, what_resists (resistance) | restricted_action (limitation), consequence, bypass, gm_note
  const isResistance = d.constraint_type === 'resistance';
  const body = d.what_resists || d.restricted_action || '';
  const typeLabel = isResistance ? 'RESISTANCE' : 'LIMITATION';
  const bodyLabel = isResistance ? 'What is resisted' : 'Restricted action';
  return h(FDCard, null,
    h(FDId, {name: d.name, type: d.constraint_type,
      extra: h('span', {className: 'fd-pill fd-pill-type',
        style: {background: isResistance ? 'color-mix(in srgb,var(--c-red) 15%,transparent)' : 'color-mix(in srgb,var(--c-purple) 15%,transparent)',
                color: isResistance ? 'var(--c-red)' : 'var(--c-purple)'}}, typeLabel)
    }),
    h(FDSect, null,
      h(FDAsp, {hc: true, text: body}),
      d.consequence && h(FDInfoBox, {
        label: isResistance ? 'Cannot be bypassed by' : 'If triggered',
        text: d.consequence,
        color: 'var(--c-red)'
      })
    ),
    d.bypass && h(FDHdr, null, 'Bypass'),
    d.bypass && h(FDSect, null,
      h('label', {
        onClick: function() { setBypassDone(function(v) { return !v; }); },
        role: 'checkbox', 'aria-checked': String(bypassDone),
        'aria-label': 'Bypass: ' + d.bypass,
        style: {display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 0'}
      },
        h('div', {className: 'fd-box' + (bypassDone ? ' on' : ''), style: {
          width: 20, height: 20, flexShrink: 0,
          borderColor: bypassDone ? 'var(--c-green)' : 'var(--accent-dim)',
          background: bypassDone ? 'var(--c-green)' : 'transparent'
        }}, bypassDone ? '✓' : ''),
        h('div', null,
          h('div', {style: {fontSize: 13, fontWeight: 700, color: bypassDone ? 'var(--c-green)' : 'var(--text-muted)'}},
            'How to bypass' + (bypassDone ? ' — DONE' : '')),
          h('div', {style: {fontSize: 12, color: bypassDone ? 'var(--text)' : 'var(--text-muted)', lineHeight: 1.5,
            textDecoration: bypassDone ? 'line-through' : 'none'}}, d.bypass)
        )
      )
    ),
    h(FDGm, {text: d.gm_note})
  );
}


function renderResult(genId, data, onUpdate, worldStunts, onChainRoll) {
  const up = onUpdate || null;
  const stunts = worldStunts || [];
  const chain = onChainRoll || null;
  switch (genId) {
    case 'npc_minor':    return h(MinorResult,        {data: data, onUpdate: up, stunts: stunts, onChainRoll: chain});
    case 'npc_major':    return h(MajorResult,        {data: data, onUpdate: up, stunts: stunts, onChainRoll: chain});
    case 'scene':        return h(SceneResult,        {data: data, onUpdate: up});
    case 'campaign':     return h(CampaignResult,     {data: data});
    case 'encounter':    return h(EncounterResult,    {data: data});
    case 'seed':         return h(SeedResult,         {data: data, onChainRoll: chain});
    case 'compel':       return h(CompelResult,       {data: data});
    case 'challenge':    return h(ChallengeResult,    {data: data});
    case 'contest':      return h(ContestResult,      {data: data, onUpdate: up});
    case 'consequence':  return h(ConsequenceResult,  {data: data});
    case 'faction':      return h(FactionResult,      {data: data, onChainRoll: chain});
    case 'complication': return h(ComplicationResult, {data: data});
    case 'backstory':    return h(BackstoryResult,    {data: data});
    case 'obstacle':     return h(ObstacleResult,     {data: data});
    case 'countdown':    return h(CountdownResult,    {data: data, onUpdate: up});
    case 'constraint':   return h(ConstraintResult,   {data: data});
    default: return null;
  }
}

// ════════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════════
// CARD RENDERER — renderCard(genId, data, campId, onFlip)
// Alternative to renderResult() — MTG/Pokemon-style landscape card.
// Spine: generator type + icon + key number.
// Front: all generator output, no artwork placeholder.
// Back: help rules (What this is · For GM · invoke/compel · SRD).
// WCAG 3.0: text always on semantic backgrounds, accent on decorative only.
// ════════════════════════════════════════════════════════════════════════

var CARD_META = {
  npc_minor:   {label:'Minor NPC',  icon:'◈', spine:'npc', color:'var(--c-red)'},
  npc_major:   {label:'Major NPC',  icon:'◆', spine:'npc', color:'var(--c-red)'},
  scene:       {label:'Scene',      icon:'◇', spine:'scene', color:'var(--c-blue)'},
  campaign:    {label:'Campaign',   icon:'◈', spine:'scene', color:'var(--c-blue)'},
  encounter:   {label:'Encounter',  icon:'⚔', spine:'encounter', color:'var(--c-red)'},
  seed:        {label:'Seed',       icon:'◎', spine:'scene', color:'var(--c-blue)'},
  compel:      {label:'Compel',     icon:'⊗', spine:'mechanic', color:'var(--c-purple)'},
  challenge:   {label:'Challenge',  icon:'⬡', spine:'mechanic', color:'var(--c-purple)'},
  contest:     {label:'Contest',    icon:'🏁', spine:'mechanic', color:'var(--c-purple)'},
  consequence: {label:'Consequence',icon:'⚡', spine:'mechanic', color:'var(--c-purple)'},
  faction:     {label:'Faction',    icon:'⚑', spine:'faction', color:'var(--accent)'},
  complication:{label:'Complication',icon:'⚠',spine:'mechanic', color:'var(--c-purple)'},
  backstory:   {label:'Backstory',  icon:'📖',spine:'gm', color:'var(--text-muted)'},
  obstacle:    {label:'Obstacle',   icon:'🛡', spine:'mechanic', color:'var(--c-purple)'},
  countdown:   {label:'Countdown',  icon:'⏱', spine:'countdown', color:'var(--accent)'},
  constraint:  {label:'Constraint', icon:'🔒',spine:'mechanic', color:'var(--c-purple)'},
};

function FlipCard(props) {
  var genId   = props.genId;
  var data    = props.data;
  var campId  = props.campId;
  var onUpdate= props.onUpdate;
  var worldStunts = props.worldStunts || [];
  var onChainRoll = props.onChainRoll;

  const [flipped, setFlipped] = useState(false);
  const [stressState, setStressState] = useState({});
  const [cdFilled, setCdFilled] = useState(0);

  var meta = CARD_META[genId] || {label: genId, icon: '◈', spine:'mechanic', color:'var(--accent)'};
  var d = data || {};

  // Merge help content
  var hc = (typeof HELP_CONTENT !== 'undefined' && HELP_CONTENT[genId]) ? HELP_CONTENT[genId] : {};
  var entry = (typeof HELP_ENTRIES !== 'undefined' ? HELP_ENTRIES : []).find(function(e){return e.id===genId;}) || {};
  var srdUrl = entry.srd_url || hc.srd_url;
  var rules   = Array.isArray(hc.rules) ? hc.rules : [];
  var tips    = (Array.isArray(hc.gm_tips) ? hc.gm_tips : []).slice(0,2);

  // ── KEY NUMBER for spine badge ─────────────────────────────────────
  function spineNum() {
    if (d.refresh) return d.refresh;
    if (d.gm_fate_points) return d.gm_fate_points;
    if (d.boxes) return d.boxes;
    if (d.opposition && d.opposition.length) return d.opposition.length;
    return null;
  }

  // ── TYPELINE ──────────────────────────────────────────────────────
  function typeLine() {
    var parts = [meta.label];
    if (d.type && d.type.name) parts.push(d.type.name);
    if (genId==='npc_major'||genId==='npc_minor') {
      var role = d.name ? '' : '';
      if (d.aspects && d.aspects.others && d.aspects.others[0]) parts.push(d.aspects.others[0].split(' ').slice(0,3).join(' ')+'…');
    }
    if (genId==='encounter' && d.opposition && d.opposition.length) {
      parts.push(d.opposition.map(function(o){return o.name+(o.qty>1?' ×'+o.qty:'');}).join(', '));
    }
    if (genId==='countdown' && d.unit) parts.push(d.unit);
    if (genId==='consequence' && d.severity) parts.push(d.severity);
    if (genId==='faction' && d.method) parts.push(d.method.split(' ').slice(0,2).join(' '));
    return parts.join(' · ');
  }

  // ── CARD NAME ─────────────────────────────────────────────────────
  function cardName() {
    if (d.name) return d.name;
    if (d.location) return d.location;
    if (d.situation) return d.situation.slice(0,40)+(d.situation.length>40?'…':'');
    if (d.aspects && d.aspects[0]) return typeof d.aspects[0]==='string' ? d.aspects[0] : (d.aspects[0].name||'');
    if (d.aspects && d.aspects.high_concept) return d.aspects.high_concept;
    if (d.type && d.type.aspect) return d.type.aspect;
    if (d.goal) return d.goal.slice(0,40);
    return meta.label;
  }

  // ── LEFT COLUMN content ───────────────────────────────────────────
  function LeftCol() {
    if (genId==='npc_major'||genId==='npc_minor') {
      var asp = d.aspects || {};
      var hc_list = Array.isArray(asp) ? asp : [asp.high_concept, asp.trouble].concat(asp.others||[]).filter(Boolean);
      var skills = (d.skills||[]).slice(0,5);
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, 'Aspects'),
        hc_list.map(function(a,i){
          return h('div', {key:i, className:'rc-line'+(i===0?' rc-hc':i===1?' rc-tr':'')},
            i===0?h('b',null,'HC: '):i===1?h('b',null,'TR: '):null, typeof a==='string'?a:(a.name||a)
          );
        }),
        skills.length>0 && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Skills'),
        skills.length>0 && h('div', {className:'rc-line'},
          skills.map(function(s){return '+'+s.r+' '+s.name;}).join(' · ')
        )
      );
    }
    if (genId==='encounter') {
      var aspects = d.aspects || [];
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, 'Situation Aspects'),
        aspects.map(function(a,i){ return h('div', {key:i, className:'rc-line'+(i===0?' rc-hc':'')}, typeof a==='string'?a:(a.name||a)); }),
        d.zones && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Zones'),
        d.zones && d.zones.map(function(z,i){
          return h('div', {key:i, className:'rc-line'}, h('b',null,z.name), z.aspect?' — '+z.aspect:'');
        })
      );
    }
    if (genId==='compel') {
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, 'Situation'),
        h('div', {className:'rc-line rc-hc'}, d.situation||''),
        d.consequence && h('div', {className:'rc-sec', style:{marginTop:4}}, 'If Accepted'),
        d.consequence && h('div', {className:'rc-line rc-tr'}, d.consequence)
      );
    }
    if (genId==='countdown') {
      var total = d.boxes||4;
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, 'Track'),
        h('div', {className:'rc-cd-row', style:{marginTop:5}},
          Array.from({length:total}, function(_,i){
            return h('div', {key:i, className:'rc-cdbox'+(i<cdFilled?' tick':''),
              role:'checkbox', tabIndex:0,
              'aria-checked':String(i<cdFilled),
              'aria-label':'Countdown box '+(i+1),
              onClick:function(e){e.stopPropagation();setCdFilled(i<cdFilled?i:i+1);},
              onKeyDown:function(e){if(e.key===' '||e.key==='Enter'){e.stopPropagation();e.preventDefault();setCdFilled(i<cdFilled?i:i+1);}}} , i+1);
          })
        ),
        d.trigger && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Trigger'),
        d.trigger && h('div', {className:'rc-line rc-tr'}, d.trigger),
        d.unit && h('div', {className:'rc-muted', style:{marginTop:2}}, 'Unit: '+d.unit)
      );
    }
    if (genId==='scene'||genId==='seed') {
      var alist = d.aspects||[];
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, 'Aspects'),
        alist.slice(0,4).map(function(a,i){
          var txt = typeof a==='string'?a:(a.name||'');
          return h('div', {key:i, className:'rc-line'+(i===0?' rc-hc':'')+(a.tags&&a.tags[0]?' rc-tagged':''), 
            'data-tag': a.tags&&a.tags[0]?a.tags[0]:null}, txt);
        }),
        d.zones && d.zones.length>0 && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Zones'),
        d.zones && d.zones.slice(0,3).map(function(z,i){
          return h('div', {key:i, className:'rc-line'}, h('b',null,z.name+(z.aspect?' — ':'')), z.aspect||'');
        })
      );
    }
    if (genId==='faction') {
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, 'Goal'),
        h('div', {className:'rc-line rc-hc'}, d.goal||''),
        d.weakness && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Weakness'),
        d.weakness && h('div', {className:'rc-line rc-tr'}, d.weakness),
        d.face && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Named Face'),
        d.face && h('div', {className:'rc-line'}, (d.face.name||d.face)+(d.face.role?' — '+d.face.role:''))
      );
    }
    if (genId==='consequence') {
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, 'Aspect'),
        h('div', {className:'rc-line rc-hc'}, d.aspect||d.name||''),
        d.context && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Context'),
        d.context && h('div', {className:'rc-line'}, d.context)
      );
    }
    if (genId==='challenge') {
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, d.name||'Challenge'),
        d.desc && h('div', {className:'rc-line', style:{lineHeight:1.5}}, d.desc),
        d.primary && h('div', {className:'rc-sec', style:{marginTop:6}}, 'Primary skill'),
        d.primary && h('div', {className:'rc-line'}, d.primary),
        d.opposing && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Opposition'),
        d.opposing && h('div', {className:'rc-line rc-tr'}, d.opposing)
      );
    }
    if (genId==='contest') {
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, d.contest_type||'Contest'),
        d.desc && h('div', {className:'rc-line', style:{lineHeight:1.5}}, d.desc),
        d.side_a && h('div', {className:'rc-sec', style:{marginTop:6}}, 'Sides'),
        d.side_a && h('div', {className:'rc-line'}, d.side_a+' vs '+d.side_b),
        d.aspect && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Scene aspect'),
        d.aspect && h('div', {className:'rc-line rc-hc'}, d.aspect)
      );
    }
    if (genId==='obstacle') {
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, d.obstacle_type||'Obstacle'),
        h('div', {className:'rc-line rc-hc'}, d.name||''),
        d.choice && h('div', {className:'rc-sec', style:{marginTop:6}}, 'Choice'),
        d.choice && h('div', {className:'rc-line'}, d.choice),
        d.repercussion_deal && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Deal with it'),
        d.repercussion_deal && h('div', {className:'rc-line'}, d.repercussion_deal)
      );
    }
    if (genId==='constraint') {
      var body = d.what_resists || d.restricted_action || '';
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, d.constraint_type==='resistance'?'Resistance':'Limitation'),
        h('div', {className:'rc-line rc-hc'}, d.name||''),
        body && h('div', {className:'rc-sec', style:{marginTop:6}}, d.constraint_type==='resistance'?'What is resisted':'Restricted action'),
        body && h('div', {className:'rc-line rc-tr'}, body),
        d.consequence && h('div', {className:'rc-sec', style:{marginTop:4}}, 'If triggered'),
        d.consequence && h('div', {className:'rc-line'}, d.consequence)
      );
    }
    if (genId==='campaign') {
      return h('div', {className:'rc-col'},
        d.current && h('div', {className:'rc-sec'}, 'Current Issue'),
        d.current && h('div', {className:'rc-line rc-hc'}, typeof d.current==='object'?(d.current.name||''):d.current),
        d.impending && h('div', {className:'rc-sec', style:{marginTop:6}}, 'Impending Issue'),
        d.impending && h('div', {className:'rc-line rc-tr'}, typeof d.impending==='object'?(d.impending.name||''):d.impending),
        d.setting && d.setting[0] && h('div', {className:'rc-sec', style:{marginTop:6}}, 'Setting Aspect'),
        d.setting && d.setting[0] && h('div', {className:'rc-line'}, d.setting[0])
      );
    }
    if (genId==='complication') {
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, 'New Aspect'),
        h('div', {className:'rc-line rc-hc'}, d.new_aspect||''),
        d.arrival && h('div', {className:'rc-sec', style:{marginTop:6}}, 'Arrival'),
        d.arrival && h('div', {className:'rc-line'}, d.arrival),
        d.env && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Environment shift'),
        d.env && h('div', {className:'rc-line'}, d.env)
      );
    }
    if (genId==='backstory') {
      var qs = d.questions || [];
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, 'Questions'),
        qs.slice(0,3).map(function(q,i){ return h('div', {key:i, className:'rc-line', style:{marginBottom:4,lineHeight:1.4}}, (i+1)+'. '+q); }),
        d.hook && h('div', {className:'rc-sec', style:{marginTop:6}}, 'Hook'),
        d.hook && h('div', {className:'rc-line rc-hc'}, d.hook)
      );
    }
    // Default
    var lines = [];
    if (d.aspects) (Array.isArray(d.aspects)?d.aspects:[d.aspects.high_concept,d.aspects.trouble]).filter(Boolean).forEach(function(a){lines.push(typeof a==='string'?a:(a.name||''));});
    if (d.goal) lines.push(d.goal);
    if (d.situation) lines.push(d.situation);
    return h('div', {className:'rc-col'},
      h('div', {className:'rc-sec'}, 'Content'),
      lines.slice(0,4).map(function(l,i){return h('div',{key:i,className:'rc-line'+(i===0?' rc-hc':'')},l);})
    );
  }

  // ── RIGHT COLUMN content ──────────────────────────────────────────
  function RightCol() {
    if (genId==='npc_major'||genId==='npc_minor') {
      var stunts = (d.stunts||[]).slice(0,2);
      var phyMax = typeof d.physical_stress==='number'?d.physical_stress:(d.stress||2);
      var menMax = typeof d.mental_stress==='number'?d.mental_stress:0;
      return h('div', {className:'rc-col'},
        stunts.length>0 && h('div', {className:'rc-sec'}, 'Stunts'),
        stunts.map(function(s,i){
          return h('div', {key:i, className:'rc-line', style:{marginBottom:2}},
            h('b',null,(s.name||'Stunt')+': '), (s.desc||'').slice(0,60)+(s.desc&&s.desc.length>60?'…':'')
          );
        }),
        d.opposition && d.opposition.length>0 && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Opposition'),
        h('div', {className:'rc-sec', style:{marginTop:4}}, 'Stress'),
        h('div', {className:'rc-stress-row'},
          phyMax>0 && h('span', {className:'rc-stress-lbl'}, 'PHY'),
          Array.from({length:phyMax}, function(_,i){
            var k='phy-'+i;
            return h('div', {key:k, className:'rc-sbox'+(stressState[k]?' hit':''),
              role:'checkbox', tabIndex:0,
              'aria-checked':String(!!stressState[k]),
              'aria-label':'Physical stress box '+(i+1),
              onClick:function(e){e.stopPropagation();setStressState(function(s){var n=Object.assign({},s);n[k]=!n[k];return n;});},
              onKeyDown:function(e){if(e.key===' '||e.key==='Enter'){e.stopPropagation();e.preventDefault();setStressState(function(s){var n=Object.assign({},s);n[k]=!n[k];return n;});}}});
          }),
          menMax>0 && h('span', {className:'rc-stress-lbl', style:{marginLeft:6}}, 'MEN'),
          Array.from({length:menMax}, function(_,i){
            var k='men-'+i;
            return h('div', {key:k, className:'rc-sbox men'+(stressState[k]?' hit':''),
              role:'checkbox', tabIndex:0,
              'aria-checked':String(!!stressState[k]),
              'aria-label':'Mental stress box '+(i+1),
              onClick:function(e){e.stopPropagation();setStressState(function(s){var n=Object.assign({},s);n[k]=!n[k];return n;});},
              onKeyDown:function(e){if(e.key===' '||e.key==='Enter'){e.stopPropagation();e.preventDefault();setStressState(function(s){var n=Object.assign({},s);n[k]=!n[k];return n;});}}});
          })
        ),
        d.refresh && h('div', {className:'rc-muted', style:{marginTop:4}}, 'Refresh '+d.refresh)
      );
    }
    if (genId==='encounter') {
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, 'Opposition'),
        (d.opposition||[]).map(function(opp,i){
          return h('div', {key:i, style:{marginBottom:6}},
            h('div', {className:'rc-line'}, h('b',null,opp.name+(opp.qty>1?' ×'+opp.qty:'')),
              opp.type==='major'?h('span',{className:'rc-tag-major'},' major'):''),
            h('div', {className:'rc-muted'}, (opp.skills||[]).slice(0,3).map(function(s){return '+'+s.r+' '+s.name;}).join(' · ')),
            opp.aspects && h('div', {className:'rc-line rc-tr'}, typeof opp.aspects[0]==='string'?opp.aspects[0]:(opp.aspects[0]&&opp.aspects[0].name)||'')
          );
        }),
        d.victory && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Victory'),
        d.victory && h('div', {className:'rc-line'}, d.victory),
        d.defeat  && h('div', {className:'rc-sec', style:{marginTop:2}}, 'Defeat'),
        d.defeat  && h('div', {className:'rc-line rc-tr'}, d.defeat),
        d.twist   && h('div', {className:'rc-muted', style:{marginTop:4}}, 'Twist: '+d.twist)
      );
    }
    if (genId==='compel') {
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, 'Fate Point'),
        h('div', {className:'rc-line'}, 'Accept → PC gains 1 FP'),
        h('div', {className:'rc-line'}, 'Refuse → PC spends 1 FP'),
        hc.invoke_example && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Invoke example'),
        hc.invoke_example && h('div', {className:'rc-muted'}, hc.invoke_example.slice(0,90)+'…')
      );
    }
    if (genId==='countdown') {
      return h('div', {className:'rc-col'},
        h('div', {className:'rc-sec'}, 'Outcome'),
        h('div', {className:'rc-line rc-tr'}, d.outcome||''),
        tips.length>0 && h('div', {className:'rc-sec', style:{marginTop:4}}, 'GM Tip'),
        tips.length>0 && h('div', {className:'rc-muted'}, tips[0])
      );
    }
    if (genId==='seed') {
      return h('div', {className:'rc-col'},
        d.objective && h('div', {className:'rc-sec'}, 'Objective'),
        d.objective && h('div', {className:'rc-line rc-hc'}, d.objective),
        d.complication && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Complication'),
        d.complication && h('div', {className:'rc-line rc-tr'}, d.complication),
        d.twist && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Twist'),
        d.twist && h('div', {className:'rc-muted'}, d.twist)
      );
    }
    // Default right col — GM tips
    return h('div', {className:'rc-col'},
      tips.length>0 && h('div', {className:'rc-sec'}, 'For GM'),
      tips.map(function(tip,i){return h('div',{key:i,className:'rc-muted',style:{marginBottom:3}},'→ '+tip);}),
      hc.invoke_example && h('div', {className:'rc-sec', style:{marginTop:4}}, 'Invoke'),
      hc.invoke_example && h('div', {className:'rc-muted'}, hc.invoke_example.slice(0,80)+'…')
    );
  }

  // ── CARD BACK ─────────────────────────────────────────────────────
  function CardBack() {
    return h('div', {className:'rc-back-inner'},
      h('div', {className:'rc-back-hdr'}, meta.label+' — Rules Reference · Fate Condensed'),
      h('div', {className:'rc-back-cols'},
        h('div', {className:'rc-back-col'},
          hc.what && h('div', {className:'rc-back-sec'}, 'What this is'),
          hc.what && h('div', {className:'rc-back-txt'}, hc.what),
          hc.output && h('div', {className:'rc-back-sec'}, 'Output'),
          hc.output && h('div', {className:'rc-back-txt'}, hc.output),
          rules.slice(0,2).map(function(r,i){
            return h('div', {key:i, className:'rc-back-rule'}, r,
              srdUrl && h('a', {href:srdUrl,target:'_blank',rel:'noopener noreferrer',className:'rc-back-srd'},' SRD ↗'));
          })
        ),
        h('div', {className:'rc-back-col'},
          tips.length>0 && h('div', {className:'rc-back-sec'}, 'For GM'),
          tips.map(function(tip,i){return h('div',{key:i,className:'rc-back-txt',style:{marginBottom:4}},'→ '+tip);}),
          hc.invoke_example && h('div', {className:'rc-back-sec'}, 'Invoke example'),
          hc.invoke_example && h('div', {className:'rc-back-txt'}, hc.invoke_example),
          hc.compel_example && h('div', {className:'rc-back-sec', style:{marginTop:4}}, 'Compel example'),
          hc.compel_example && h('div', {className:'rc-back-txt'}, hc.compel_example),
          srdUrl && h('a', {href:srdUrl,target:'_blank',rel:'noopener noreferrer',className:'rc-back-srd-big'},'fate-srd.com ↗')
        )
      )
    );
  }

  var num = spineNum();

  return h('div', {className:'rc-scene'},
    h('div', {
      className:'rc-wrap'+(flipped?' rc-flipped':''),
      onClick: function(){setFlipped(function(f){return !f;});},
      onKeyDown: function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();setFlipped(function(f){return !f;});}},
      role:'group',
      tabIndex:0,
      'aria-label': meta.label+': '+cardName()+' (press Space or Enter to flip for rules)',
    },
      // FRONT
      h('div', {className:'rc-face'},
        h('div', {className:'rc-spine', style:{borderColor:'color-mix(in srgb,'+meta.color+' 30%,transparent)',background:'color-mix(in srgb,'+meta.color+' 8%,transparent)'}},
          h('span', {className:'rc-spine-type', style:{color:meta.color}}, meta.label),
          h('span', {className:'rc-spine-icon'}, meta.icon),
          num!=null && h('span', {className:'rc-spine-badge', style:{color:meta.color,borderColor:'color-mix(in srgb,'+meta.color+' 40%,transparent)',background:'color-mix(in srgb,'+meta.color+' 10%,transparent)'}}, num)
        ),
        h('div', {className:'rc-main'},
          h('div', {className:'rc-namebar'},
            h('span', {className:'rc-name'}, cardName()),
            h('div', {className:'rc-pills'},
              h('span', {className:'rc-pill', style:{borderColor:'color-mix(in srgb,'+meta.color+' 35%,transparent)'}}, meta.label),
              num!=null && genId==='npc_major' && h('span', {className:'rc-pill', style:{borderColor:'color-mix(in srgb,'+meta.color+' 35%,transparent)'}}, 'Refresh '+num),
              num!=null && genId==='encounter' && h('span', {className:'rc-pill', style:{borderColor:'color-mix(in srgb,'+meta.color+' 35%,transparent)'}}, 'GM FP '+num)
            )
          ),
          h('div', {className:'rc-typeline', style:{borderColor:'color-mix(in srgb,'+meta.color+' 20%,transparent)',background:'color-mix(in srgb,'+meta.color+' 5%,transparent)'}},
            h('span', {style:{color:meta.color,fontSize:10}}, meta.icon+' '),
            typeLine()
          ),
          h('div', {className:'rc-content'},
            LeftCol(),
            h('div', {className:'rc-col-sep'}),
            RightCol()
          ),
          h('div', {className:'rc-bottom'},
            h('span', {className:'rc-flip-hint'}, 'Tap for rules →'),
            h('div', {className:'rc-spacer'}),
            onChainRoll && h('button', {
              className:'chain-roll-btn',
              onClick:function(e){e.stopPropagation();onChainRoll(genId);},
              style:{fontSize:10},
            }, '⟳ Chain'),
            h('button', {
              className:'rc-pin-btn',
              onClick:function(e){e.stopPropagation();if(onUpdate)onUpdate({_pin:true});},
              title:'Save to Table Prep',
            }, '📌')
          )
        )
      ),
      // BACK
      h('div', {className:'rc-back'}, CardBack())
    )
  );
}

function renderCard(genId, data, campId, onUpdate, worldStunts, onChainRoll) {
  return h(FlipCard, {
    genId:genId, data:data, campId:campId,
    onUpdate:onUpdate, worldStunts:worldStunts||[], onChainRoll:onChainRoll||null,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// PREP CANVAS — infinite canvas for Table Prep, full run.html feature parity
// ═══════════════════════════════════════════════════════════════════════

var TP_LADDER=[{v:8,l:'Legendary'},{v:7,l:'Epic'},{v:6,l:'Fantastic'},{v:5,l:'Superb'},{v:4,l:'Great'},{v:3,l:'Good'},{v:2,l:'Fair'},{v:1,l:'Average'},{v:0,l:'Mediocre'},{v:-1,l:'Poor'},{v:-2,l:'Terrible'}];
function tpLbl(v){var e=TP_LADDER.find(function(x){return x.v===v;});return e?e.l:(v>8?'Legendary+':'Abysmal');}
function tpLcol(v){return v>=3?'var(--c-green)':v>=1?'var(--accent)':v>=0?'var(--c-amber,#f4b942)':'var(--c-red)';}
function tpRollDF(){return Math.floor(Math.random()*3)-1;}
function tpUid(){return 'tp'+Date.now()+Math.random().toString(36).slice(2,6);}

var TP_GEN_MENU=[
  {id:'npc_major',label:'Major NPC',icon:'◆'},{id:'npc_minor',label:'Minor NPC',icon:'◈'},
  {id:'scene',label:'Scene',icon:'◉'},{id:'faction',label:'Faction',icon:'⚑'},
  {id:'seed',label:'Seed',icon:'✦'},{id:'compel',label:'Compel',icon:'⊗'},
  {id:'countdown',label:'Countdown',icon:'⏱'},{id:'encounter',label:'Encounter',icon:'⚔'},
  {id:'complication',label:'Complication',icon:'⚠'},{id:'obstacle',label:'Obstacle',icon:'🏔'},
];
var TP_TYPE_CLS={
  npc_major:'cct-npc',npc_minor:'cct-npc',encounter:'cct-npc',
  scene:'cct-scene',seed:'cct-scene',campaign:'cct-scene',
  faction:'cct-faction',
  compel:'cct-mechanic',challenge:'cct-mechanic',contest:'cct-mechanic',
  consequence:'cct-mechanic',complication:'cct-mechanic',obstacle:'cct-mechanic',
  countdown:'cct-mechanic',constraint:'cct-mechanic',backstory:'cct-gm',
};
var TP_TYPE_LBL={
  npc_major:'MAJOR NPC',npc_minor:'MINOR NPC',encounter:'ENCOUNTER',
  scene:'SCENE',seed:'SEED',campaign:'CAMPAIGN',faction:'FACTION',
  compel:'COMPEL',challenge:'CHALLENGE',contest:'CONTEST',
  consequence:'CONSEQUENCE',complication:'COMPLICATION',obstacle:'OBSTACLE',
  countdown:'COUNTDOWN',constraint:'CONSTRAINT',backstory:'BACKSTORY',
};
function tpTypeMap(genId){return {npc_major:'npc',npc_minor:'npc',scene:'scene',seed:'seed',faction:'faction',compel:'compel',countdown:'countdown',encounter:'npc',complication:'aspect',challenge:'gm',contest:'gm',consequence:'aspect',backstory:'gm',obstacle:'aspect',constraint:'gm'}[genId]||'other';}
// TC-15: Parse exported Ogma NPC/character JSON into a player object
function tpParseOgmaCharacter(jsonStr, playerCount){
  var COLORS=['var(--accent)','var(--c-purple)','var(--c-blue)','var(--c-green)','var(--c-red)'];
  var obj;try{obj=JSON.parse(jsonStr);}catch(e){return null;}
  if(!obj||obj.format!=='ogma')return null;
  var d=null,genId=null;
  if(obj.generator&&obj.data){genId=obj.generator;d=obj.data;}
  else if(Array.isArray(obj.results)){
    var hit=obj.results.find(function(r){return r.generator==='npc_major'||r.generator==='npc_minor';});
    if(hit){genId=hit.generator;d=hit.data;}
  }
  if(!d||!genId)return null;
  var name,aspects,skills,phy,men,stunts=[];
  if(genId==='npc_minor'){
    name=d.name||'Imported';
    aspects=Array.isArray(d.aspects)?d.aspects.map(function(a){return a.name||a;}).filter(Boolean):[];
    skills=(d.skills||[]).map(function(s){return{l:s.name,v:s.r||0,name:s.name,r:s.r||0};});
    phy=Array.from({length:Math.min(d.stress||2,3)},function(){return false;});
    men=[false,false];
  }else{
    name=d.name||'Imported';
    aspects=[d.aspects.high_concept,d.aspects.trouble].concat(d.aspects.others||[]).filter(Boolean);
    skills=(d.skills||[]).map(function(s){return{l:s.name,v:s.r||0,name:s.name,r:s.r||0};});
    phy=Array.from({length:Math.min(d.physical_stress||3,3)},function(){return false;});
    men=Array.from({length:Math.min(d.mental_stress||2,3)},function(){return false;});
    stunts=(d.stunts||[]).map(function(s){return{name:s.name||s,desc:s.desc||s.description||''};});
  }
  return{id:tpUid(),name:name,hc:aspects[0]||'',fp:d.refresh||3,ref:d.refresh||3,
    phy:phy.length?phy:[false,false,false],men:men.length?men:[false,false],
    color:COLORS[(playerCount||0)%COLORS.length],acted:false,conceded:false,
    skills:skills.slice(0,10),conseq:['','',''],treating:[false,false,false],aspects:aspects,stunts:stunts};
}
var TP_COLORS=['var(--accent)','var(--c-purple)','var(--c-blue)','var(--c-green)','var(--c-red)'];

function tpCardFromResult(genId,data){
  var title=data.name||data.location||data.situation||data.title||genId;
  var x=60+(Math.floor(Math.random()*4))*200+Math.random()*40;
  var y=60+(Math.floor(Math.random()*3))*180+Math.random()*40;
  return {id:tpUid(),genId:genId,type:tpTypeMap(genId),title:title,data:data,size:'md',x:x,y:y,phyHit:null,menHit:null,cdFilled:0,ts:Date.now()};
}

// ── TpCardBody ─────────────────────────────────────────────────────────────
function TpCardBody(props){
  var card=props.card,onUpd=props.onUpd,d=card.data||{},genId=card.genId,sz=card.size||'md';
  if(genId==='npc_major'||genId==='npc_minor'||genId==='encounter'){
    var asp=d.aspects||{};
    var hc=asp.high_concept||(Array.isArray(d.aspects)?(d.aspects[0]&&(d.aspects[0].name||d.aspects[0])):'')||card.title;
    var tr=asp.trouble||(Array.isArray(d.aspects)?(d.aspects[1]&&(d.aspects[1].name||d.aspects[1])):'');
    var skills=(d.skills||[]).slice(0,sz==='full'?6:3);
    var phyMax=typeof d.physical_stress==='number'?d.physical_stress:(d.stress||2);
    var menMax=typeof d.mental_stress==='number'?d.mental_stress:0;
    var phyHit=card.phyHit||Array(phyMax).fill(false);
    var menHit=card.menHit||Array(menMax).fill(false);
    return h('div',{className:'cc-body'},
      h('div',{className:'cc-title'},d.name||card.title),
      hc&&hc!==(d.name||card.title)&&h('div',{className:'cc-asp hc'},hc),
      tr&&h('div',{className:'cc-asp tr'},tr),
      skills.length>0&&h('div',{className:'cc-skrow'},skills.map(function(s,i){
  return h('span',{key:i,className:'cc-sk',
    title:'Roll '+s.name+' +'+s.r+(props.onRollSkill?' — click to roll':''),
    style:{cursor:props.onRollSkill?'pointer':'default'},
    onClick:props.onRollSkill?function(e){e.stopPropagation();props.onRollSkill({l:s.name,v:s.r,r:s.r});}:null,
  },h('strong',null,'+'+s.r),' '+s.name);
})),
      (phyHit.length>0||menHit.length>0)&&h('div',{className:'cc-stress'},
        phyHit.length>0&&h('span',null,'PHY'),
        phyHit.map(function(v,i){return h('div',{key:'p'+i,className:'cc-sbox'+(v?' hit':''),onClick:function(e){e.stopPropagation();var a=phyHit.slice();a[i]=!a[i];onUpd({phyHit:a});}});}),
        menHit.length>0&&h('span',{style:{marginLeft:4}},'MEN'),
        menHit.map(function(v,i){return h('div',{key:'m'+i,className:'cc-sbox'+(v?' hit':''),style:{borderColor:'var(--c-purple)'},onClick:function(e){e.stopPropagation();var a=menHit.slice();a[i]=!a[i];onUpd({menHit:a});}});})
      )
    );
  }
  if(genId==='countdown'){
    var total=d.boxes||4;var filled=card.cdFilled||0;
    return h('div',{className:'cc-body'},
      h('div',{className:'cc-title'},d.name||card.title),
      d.trigger&&h('div',{className:'cc-asp'},d.trigger),
      h('div',{className:'cc-cd-track'},Array.from({length:total},function(_,i){return h('div',{key:i,className:'cc-cdbox'+(i<filled?' tick':''),onClick:function(e){e.stopPropagation();onUpd({cdFilled:i<filled?i:i+1});}},i+1);})),
      filled>=total&&h('div',{className:'cc-trigger'},'\u26A1 TRIGGERED')
    );
  }
  if(genId==='seed'){return h('div',{className:'cc-body'},h('div',{className:'cc-title'},d.hook||d.location||card.title),d.objective&&h('div',{className:'cc-asp hc'},d.objective),d.complication&&h('div',{className:'cc-asp tr'},d.complication),sz==='full'&&d.twist&&h('div',{className:'cc-asp'},'\uD83C\uDF00 '+d.twist));}
  if(genId==='scene'){var aspects=d.aspects||[];return h('div',{className:'cc-body'},h('div',{className:'cc-title'},d.location||card.title),(sz==='full'?aspects.slice(0,5):aspects.slice(0,2)).map(function(a,i){var txt=a.name||a;return h('div',{key:i,className:'cc-asp'+(i===0?' hc':'')},txt);}));}
  if(genId==='faction'){return h('div',{className:'cc-body'},h('div',{className:'cc-title'},d.name||card.title),d.goal&&h('div',{className:'cc-asp hc'},d.goal),d.weakness&&h('div',{className:'cc-asp tr'},d.weakness));}
  if(genId==='compel'){return h('div',{className:'cc-body'},h('div',{className:'cc-title'},d.situation||card.title),d.consequence&&h('div',{className:'cc-asp tr'},'If accepted: '+d.consequence));}
  if(genId==='consequence'){return h('div',{className:'cc-body'},d.severity&&h('div',{style:{fontSize:11,fontWeight:800,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--c-amber,#f4b942)',marginBottom:2}},d.severity),h('div',{className:'cc-title'},d.aspect||d.name||card.title),d.context&&h('div',{className:'cc-asp'},d.context));}
  if(genId==='challenge'){return h('div',{className:'cc-body'},h('div',{className:'cc-title'},d.name||card.title),d.desc&&h('div',{className:'cc-asp'},d.desc),(sz==='full'||sz==='md')&&d.primary&&h('div',{className:'cc-asp hc'},'\u2692 '+d.primary),(sz==='full'||sz==='md')&&d.opposing&&h('div',{className:'cc-asp tr'},'\u2605 '+d.opposing));}
  if(genId==='contest'){return h('div',{className:'cc-body'},h('div',{className:'cc-title'},d.contest_type||card.title),d.desc&&h('div',{className:'cc-asp'},d.desc),(sz==='full'||sz==='md')&&d.side_a&&h('div',{className:'cc-asp hc'},d.side_a+' \u2694 '+d.side_b));}
  if(genId==='complication'){return h('div',{className:'cc-body'},d.new_aspect&&h('div',{className:'cc-asp hc',style:{marginTop:0}},d.new_aspect),d.arrival&&h('div',{className:'cc-asp'},'\u2794 '+d.arrival));}
  if(genId==='obstacle'){return h('div',{className:'cc-body'},d.obstacle_type&&h('div',{style:{fontSize:11,fontWeight:800,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:2}},d.obstacle_type),h('div',{className:'cc-title'},d.name||card.title),(sz==='full'||sz==='md')&&d.choice&&h('div',{className:'cc-asp'},'\u2666 '+d.choice));}
  if(genId==='backstory'){var qs=d.questions||[];return h('div',{className:'cc-body'},d.hook&&h('div',{className:'cc-asp hc',style:{marginTop:0}},d.hook),qs.slice(0,sz==='full'?3:2).map(function(q,i){return h('div',{key:i,className:'cc-asp',style:{fontStyle:'normal'}},'\u2014 '+q);}));}
  return h('div',{className:'cc-body'},
    h('div',{className:'cc-title'},card.title||genId),
    card._notes&&h('div',{style:{fontSize:11,color:'var(--text-muted)',fontStyle:'italic',marginTop:3,lineHeight:1.4}},card._notes)
  );
}

// ── TpPlayerRow ─────────────────────────────────────────────────────────────
function TpPlayerRow(props){
  var p=props.player,sel=props.sel,onUpd=props.onUpd,onSel=props.onSel;
  var _exp=useState(false);var expanded=_exp[0];var setExpanded=_exp[1];
  var fpCol=p.fp===0?'var(--c-red)':p.fp<p.ref?'var(--c-amber,#f4b942)'  :'var(--c-green)';
  var conseq=p.conseq||['','',''];
  var aspects=p.aspects||[];
  var trouble=aspects[1]||'';
  var otherAspects=aspects.slice(2);
  var stunts=p.stunts||[];
  function setConseq(i,val){var n=conseq.slice();n[i]=val;onUpd({conseq:n});}
  function setAspect(i,val){
    var next=(p.aspects||[]).slice();
    while(next.length<=i)next.push('');
    next[i]=val;
    // keep hc in sync
    onUpd({aspects:next,hc:next[0]||p.hc});
  }
  function addStunt(name){
    if(!name||!name.trim())return;
    onUpd({stunts:(stunts).concat([{name:name.trim(),desc:''}])});
  }
  function removeStunt(i){
    onUpd({stunts:stunts.filter(function(_,idx){return idx!==i;})});
  }
  return h('div',{className:'rs-player'+(sel?' selected':''),style:{borderLeftColor:p.color||'var(--accent)',borderLeftWidth:3}},

    // ── Top row: dot + name + expand toggle + acted ──
    h('div',{className:'rs-player-top',onClick:function(){onSel(sel?null:p.id);}},
      h('div',{className:'rs-player-dot',style:{background:p.color||'var(--accent)'}}),
      h('div',{className:'rs-player-name'},p.name),
      h('button',{style:{background:'none',border:'none',cursor:'pointer',fontSize:11,
        color:'var(--text-muted)',padding:'0 2px',flexShrink:0},
        onClick:function(e){e.stopPropagation();setExpanded(!expanded);}
      },expanded?'▲':'▼'),
      h('button',{style:{background:'none',border:'none',cursor:'pointer',fontSize:13,
        color:p.acted?'var(--c-green)'  :'var(--border-mid)',padding:'0 2px',flexShrink:0,lineHeight:1},
        onClick:function(e){e.stopPropagation();onUpd({acted:!p.acted});}
      },p.acted?'●':'○')
    ),

    // ── High concept (always visible) ──
    p.hc&&h('div',{className:'rs-player-hc',
      style:{borderLeft:'2px solid var(--accent)',paddingLeft:5,marginBottom:1}},
      p.hc),

    // ── Trouble (always visible when set) ──
    trouble&&h('div',{
      style:{fontSize:11,color:'var(--c-red)',fontStyle:'italic',
        padding:'1px 8px 3px',lineHeight:1.3},
      title:'Trouble aspect'},
      '⚠️ '+trouble),

    // ── FP row ──
    h('div',{className:'rs-fp-row'},
      h('span',{className:'rs-fp-label'},'FP'),
      h('button',{className:'rs-fp-btn',onClick:function(){onUpd({fp:Math.max(0,p.fp-1)});},'aria-label':'Spend FP'},'-'),
      h('span',{className:'rs-fp-num',style:{color:fpCol}},p.fp),
      h('button',{className:'rs-fp-btn',onClick:function(){onUpd({fp:p.fp+1});},'aria-label':'Gain FP'},'+'),
      h('button',{style:{background:'none',border:'none',cursor:'pointer',fontSize:10,color:'var(--text-muted)',padding:'0 2px',flexShrink:0},
        title:'Refresh: '+p.ref+' — click to reset FP to refresh',
        onClick:function(){onUpd({fp:p.ref});},
      },'↺'+p.ref)
    ),

    // ── Stress ──
    h('div',{className:'rs-stress-row'},
      h('span',{className:'rs-fp-label'},'PHY'),
      h('div',{style:{display:'flex',gap:2}},
        p.phy.map(function(v,i){
          return h('div',{key:i,className:'rs-stress-box'+(v?' filled':''),
            onClick:function(){var a=p.phy.slice();a[i]=!a[i];onUpd({phy:a});}});
        })
      ),
      h('span',{className:'rs-fp-label',style:{marginLeft:4}},'MEN'),
      h('div',{style:{display:'flex',gap:2}},
        p.men.map(function(v,i){
          return h('div',{key:i,className:'rs-stress-box'+(v?' filled':''),
            style:{borderColor:'var(--c-purple)'},
            onClick:function(){var a=p.men.slice();a[i]=!a[i];onUpd({men:a});}});
        })
      )
    ),

    // ── Expanded section ──
    expanded&&h('div',{style:{padding:'4px 8px 8px',display:'flex',flexDirection:'column',gap:7}},

      // Consequences
      h('div',null,
        h('div',{style:{fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',
          color:'var(--text-muted)',marginBottom:3}},'Consequences'),
        ['Mild','Moderate','Severe'].map(function(sev,i){
          return h('div',{key:i,style:{display:'flex',alignItems:'center',gap:3,marginBottom:3}},
            h('span',{style:{fontSize:11,color:'var(--text-muted)',width:52,flexShrink:0}},sev),
            h('input',{type:'text',value:conseq[i]||'',placeholder:'empty',
              onChange:function(e){setConseq(i,e.target.value);},
              style:{flex:1,background:'var(--inset)',
                border:'1px solid '+(conseq[i]?'var(--c-amber,#f4b942)'  :'var(--border)'),
                borderRadius:4,padding:'2px 5px',fontSize:11,
                color:'var(--text)',fontFamily:'var(--font-ui)',outline:'none'}}),
          // TC-17: treating toggle
          conseq[i]&&h('button',{
            style:{background:'none',border:'none',cursor:'pointer',fontSize:11,
              color:(p.treating||[])[i]?'var(--c-green)':'var(--text-muted)',
              padding:'0 2px',flexShrink:0,lineHeight:1},
            title:(p.treating||[])[i]?'Being treated (clear after overcome roll)':'Mark as being treated',
            onClick:function(){
              var tr=(p.treating||[false,false,false]).slice();
              tr[i]=!tr[i];
              onUpd({treating:tr});
            },
          },(p.treating||[])[i]?'✓':'□')
          );
        })
      ),

      // TC-05: Aspects
      h('div',null,
        h('div',{style:{fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',
          color:'var(--text-muted)',marginBottom:3}},'Aspects'),
        // High concept (editable)
        h('div',{style:{display:'flex',alignItems:'center',gap:3,marginBottom:3}},
          h('span',{style:{fontSize:10,color:'var(--accent)',width:52,flexShrink:0,fontWeight:700}},'HC'),
          h('input',{type:'text',value:aspects[0]||p.hc||'',placeholder:'High concept',
            onChange:function(e){setAspect(0,e.target.value);},
            style:{flex:1,background:'var(--inset)',border:'1px solid '+(aspects[0]||p.hc?'var(--accent)'  :'var(--border)'),
              borderRadius:4,padding:'2px 5px',fontSize:11,color:'var(--text)',
              fontFamily:'var(--font-ui)',outline:'none'}})
        ),
        // Trouble (editable)
        h('div',{style:{display:'flex',alignItems:'center',gap:3,marginBottom:3}},
          h('span',{style:{fontSize:10,color:'var(--c-red)',width:52,flexShrink:0,fontWeight:700}},'Trouble'),
          h('input',{type:'text',value:trouble,placeholder:'Trouble aspect',
            onChange:function(e){setAspect(1,e.target.value);},
            style:{flex:1,background:'var(--inset)',border:'1px solid '+(trouble?'var(--c-red)'  :'var(--border)'),
              borderRadius:4,padding:'2px 5px',fontSize:11,color:'var(--text)',
              fontFamily:'var(--font-ui)',outline:'none'}})
        ),
        // Other aspects
        otherAspects.map(function(a,i){
          return h('div',{key:i,style:{display:'flex',alignItems:'center',gap:3,marginBottom:3}},
            h('span',{style:{fontSize:10,color:'var(--text-muted)',width:52,flexShrink:0}},'Asp '+(i+1)),
            h('input',{type:'text',value:a||'',placeholder:'Aspect',
              onChange:function(e){setAspect(i+2,e.target.value);},
              style:{flex:1,background:'var(--inset)',border:'1px solid '+(a?'var(--border-mid)'  :'var(--border)'),
                borderRadius:4,padding:'2px 5px',fontSize:11,color:'var(--text)',
                fontFamily:'var(--font-ui)',outline:'none'}})
          );
        }),
        // Add aspect button
        h('button',{
          style:{fontSize:10,background:'none',border:'1px dashed var(--border)',
            borderRadius:4,padding:'2px 6px',cursor:'pointer',color:'var(--text-muted)',
            fontFamily:'var(--font-ui)',marginTop:2},
          onClick:function(){setAspect(aspects.length||2,'');}
        },'+ aspect')
      ),

      // TC-05: Stunts
      stunts.length>0&&h('div',null,
        h('div',{style:{fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',
          color:'var(--text-muted)',marginBottom:3}},'Stunts'),
        stunts.map(function(s,i){
          var name=typeof s==='string'?s:(s.name||s.l||'');
          var desc=typeof s==='string'?'':(s.desc||s.description||'');
          return h('div',{key:i,
            style:{background:'var(--inset)',border:'1px solid var(--border)',
              borderRadius:5,padding:'4px 7px',marginBottom:3,position:'relative'},
          },
            h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between'}},
              h('span',{style:{fontSize:11,fontWeight:700,color:'var(--accent)'}},name),
              h('button',{
                style:{background:'none',border:'none',cursor:'pointer',
                  fontSize:11,color:'var(--text-muted)',padding:'0 2px'},
                onClick:function(e){e.stopPropagation();removeStunt(i);},
                'aria-label':'Remove stunt'},
              '×')
            ),
            desc&&h('div',{style:{fontSize:10,color:'var(--text-muted)',marginTop:1,lineHeight:1.4}},desc)
          );
        })
      ),

      // Add stunt
      h('button',{
        style:{fontSize:10,background:'none',border:'1px dashed var(--border)',
          borderRadius:4,padding:'2px 6px',cursor:'pointer',color:'var(--text-muted)',
          fontFamily:'var(--font-ui)'},
        onClick:function(){
          var n=prompt('Stunt name:');
          if(n&&n.trim()){
            var d=prompt('Stunt description (optional):');
            onUpd({stunts:stunts.concat([{name:n.trim(),desc:d||''  }])});
          }
        }
      },'+ stunt')
    )
  );
}

// ── TpDicePanel — compact horizontal bar layout ────────────────────────────
function TpDicePanel(props){
  var players=props.players,selId=props.selId,spendFP=props.spendFP,onRoll=props.onRoll;
  var _dice=useState([0,0,0,0]);var dice=_dice[0];var setDice=_dice[1];
  var _spin=useState(false);var spinning=_spin[0];var setSpinning=_spin[1];
  var _res=useState(null);var result=_res[0];var setResult=_res[1];
  var _sk=useState(null);var activeSk=_sk[0];var setActiveSk=_sk[1];
  var _boost=useState(false);var boosted=_boost[0];var setBoosted=_boost[1];
  var _hist=useState([]);var history=_hist[0];var setHistory=_hist[1];
  var _diff=useState(0);var diff=_diff[0];var setDiff=_diff[1]; // TC-20: opposition difficulty
  var player=players.find(function(p){return p.id===selId;});
  var mod=activeSk?activeSk.v:0;
  var final=result!=null?result+mod+(boosted?2:0):null;
  var DFMT={'-1':'\u2212',0:'\u25CB',1:'+'};

  function doRoll(sk){
    if(spinning)return;
    setActiveSk(sk);setBoosted(false);setResult(null);setSpinning(true);
    setTimeout(function(){
      var r=[tpRollDF(),tpRollDF(),tpRollDF(),tpRollDF()];
      var s=r.reduce(function(a,b){return a+b;},0);
      setDice(r);setSpinning(false);setResult(s);
      var total=s+sk.v;
      setHistory(function(h){return [{who:player?player.name:'?',skill:sk.l||sk.name,total:total}].concat(h).slice(0,8);});
      if(onRoll)onRoll({who:player?player.name:'?',skill:sk.l||sk.name,total:total});
    },600);
  }

  // Horizontal strip: [who] [dice] [result] [roll btn] [FP spend] | [skills] | [history]
  return h('div',{style:{display:'flex',alignItems:'center',gap:10,padding:'6px 10px',flexWrap:'nowrap',overflowX:'auto',fontFamily:'var(--font-ui)',minHeight:52}},

    // ── Who is rolling ───────────────────────────────────────────
    h('div',{style:{fontSize:11,fontWeight:700,color:player?player.color||'var(--accent)':'var(--text-muted)',
      whiteSpace:'nowrap',flexShrink:0,minWidth:60,maxWidth:100,overflow:'hidden',textOverflow:'ellipsis'}},
      player?player.name:'no player'),

    // ── 4 Fate dice ──────────────────────────────────────────────
    h('div',{style:{display:'flex',gap:4,flexShrink:0}},
      dice.map(function(v,i){
        var cls='rs-die'+(spinning?' spin':v>0?' pos':v<0?' neg':' zero');
        return h('div',{key:i,className:cls,style:{width:32,height:32,fontSize:16}},
          spinning?'\u25C8':DFMT[v]||'\u25CB');
      })
    ),

    // ── Result block ─────────────────────────────────────────────
    result!=null&&!spinning&&h('div',{style:{display:'flex',alignItems:'baseline',gap:5,flexShrink:0}},
      h('span',{style:{fontSize:22,fontWeight:900,color:tpLcol(final),lineHeight:1}},
        final>=0?'+'+final:String(final)),
      h('span',{style:{fontSize:11,fontWeight:700,color:tpLcol(final)}},tpLbl(final)),
      activeSk&&h('span',{style:{fontSize:11,color:'var(--text-muted)'}},
        '('+activeSk.l+(boosted?'+2)':')'))
    ),
    result==null&&!spinning&&h('span',{style:{fontSize:11,color:'var(--text-muted)',flexShrink:0}},
      player?'roll below':'\u2191 select player'),

    // ── Roll 4dF button ──────────────────────────────────────────
    h('button',{
      className:'btn btn-ghost',
      disabled:spinning,
      onClick:function(){doRoll({l:'4dF',v:0});},
      style:{fontSize:12,flexShrink:0,whiteSpace:'nowrap'},
    },'\uD83C\uDFB2 Roll 4dF'),

    // ── FP spend ─────────────────────────────────────────────────
    result!=null&&!spinning&&h('button',{
      className:'btn btn-ghost'+(boosted?' active':''),
      disabled:!player||player.fp<=0||boosted,
      onClick:function(){if(!player||boosted||result==null)return;if(spendFP)spendFP(selId);setBoosted(true);},
      style:{fontSize:11,flexShrink:0,whiteSpace:'nowrap'},
      title:'Spend 1 FP for +2',
    },boosted?'\u2705 +2 spent':'\u29BF FP +2'),

    // TC-20: Opposition difficulty & outcome
    h('div',{style:{display:'flex',alignItems:'center',gap:4,flexShrink:0}},
      h('span',{style:{fontSize:11,color:'var(--text-muted)',whiteSpace:'nowrap'}},'vs'),
      h('input',{type:'number',min:-4,max:8,value:diff,
        onChange:function(e){setDiff(parseInt(e.target.value)||0);},
        style:{width:40,background:'var(--inset)',border:'1px solid var(--border)',
          borderRadius:5,padding:'2px 5px',fontSize:12,color:'var(--text)',
          fontFamily:'var(--font-ui)',textAlign:'center',outline:'none'},
        title:'Opposition difficulty (Fate Ladder: -4 to +8)',
      }),
      result!=null&&!spinning&&(function(){
        var margin=final-diff;
        var outcome=margin>=3?'Succeed w/ Style':margin>=1?'Success':margin===0?'Tie':'Fail';
        var col=margin>=3?'var(--c-green)':margin>=1?'var(--accent)':margin===0?'var(--c-amber,#f4b942)':'var(--c-red)';
        return h('span',{style:{fontSize:12,fontWeight:800,color:col,whiteSpace:'nowrap'}},outcome+(margin>0?' +'+margin:margin<0?' '+margin:''));
      })()
    ),
    // Separator
    h('div',{style:{width:1,height:28,background:'var(--border)',flexShrink:0}}),

    // ── Skills as pill row ────────────────────────────────────────
    player&&(player.skills||[]).length>0&&h('div',{style:{display:'flex',gap:4,flexWrap:'nowrap',overflowX:'auto',flex:1}},
      player.skills.map(function(sk){
        var isSel=activeSk&&(activeSk.l||activeSk.name)===(sk.l||sk.name);
        var v=sk.v||sk.r||0;
        return h('button',{key:sk.l||sk.name,
          onClick:function(){doRoll(sk);},
          style:{
            background:isSel?'color-mix(in srgb,var(--accent) 12%,transparent)':'var(--inset)',
            border:'1px solid '+(isSel?'var(--accent)':'var(--border)'),
            borderRadius:6,padding:'3px 9px',cursor:'pointer',fontFamily:'var(--font-ui)',
            display:'flex',alignItems:'center',gap:5,whiteSpace:'nowrap',flexShrink:0,
          },
        },
          h('span',{style:{fontSize:11,color:'var(--text)',fontWeight:600}},sk.l||sk.name),
          h('span',{style:{fontSize:12,fontWeight:800,color:tpLcol(v)}},'+'+v),
          h('span',{style:{fontSize:11}},spinning&&isSel?'\uD83C\uDFB2':'')
        );
      })
    ),
    !player&&h('span',{style:{fontSize:11,color:'var(--text-muted)',flex:1}},'Select a player in the roster to roll their skills'),

    // Separator + history (last 3, compact)
    history.length>0&&h('div',{style:{width:1,height:28,background:'var(--border)',flexShrink:0}}),
    history.length>0&&h('div',{style:{display:'flex',gap:5,alignItems:'center',flexShrink:0}},
      history.slice(0,3).map(function(r,i){
        return h('span',{key:i,style:{fontSize:11,color:'var(--text-muted)',whiteSpace:'nowrap'}},
          h('span',{style:{fontWeight:800,color:tpLcol(r.total)}},r.total>=0?'+'+r.total:String(r.total)),
          ' '+r.skill
        );
      })
    )
  );
}


// ── TpTurnBar ─────────────────────────────────────────────────────────────
function TpTurnBar(props){
  var players=props.players,order=props.order,setOrder=props.setOrder,onToggleActed=props.onToggleActed;
  var _drag=useState(null);var dragId=_drag[0];var setDragId=_drag[1];
  var _over=useState(null);var overId=_over[0];var setOverId=_over[1];
  var allActed=players.length>0&&players.every(function(p){return p.acted;});
  var orderedPlayers=order.map(function(id){return players.find(function(p){return p.id===id;});}).filter(Boolean);
  players.forEach(function(p){if(order.indexOf(p.id)<0)orderedPlayers.push(p);});
  return h('div',{className:'rs-turn-bar'},
    h('span',{className:'rs-turn-label'},'Turn Order'),
    orderedPlayers.map(function(p){
      return h('div',{key:p.id,
        className:'rs-turn-pill'+(p.acted?' acted':'')+(dragId===p.id?' dragging':'')+(overId===p.id?' drag-over':''),
        draggable:true,
        onDragStart:function(e){setDragId(p.id);e.dataTransfer.effectAllowed='move';},
        onDragOver:function(e){e.preventDefault();if(p.id!==dragId)setOverId(p.id);},
        onDrop:function(e){e.preventDefault();if(dragId&&dragId!==p.id){setOrder(function(o){var a=o.slice();var fi=a.indexOf(dragId);var ti=a.indexOf(p.id);if(fi<0||ti<0)return o;a.splice(fi,1);a.splice(ti,0,dragId);return a;});}setDragId(null);setOverId(null);},
        onDragEnd:function(){setDragId(null);setOverId(null);},
        onClick:function(){onToggleActed(p.id);},
      },
        h('div',{className:'rs-turn-dot',style:{background:p.color||'var(--accent)',width:6,height:6,borderRadius:'50%',flexShrink:0}}),
        h('span',{style:{fontSize:11,fontWeight:700,color:p.acted?'var(--c-green)':'var(--text)'}},p.name),
        p.acted&&h('span',{style:{fontSize:11,color:'var(--c-green)'}},' \u2713')
      );
    }),
    allActed&&h('div',{style:{fontSize:11,color:'var(--c-green)',fontStyle:'italic',marginLeft:6}},'\u2756 All acted')
  );
}

// ── PrepCanvas ───────────────────────────────────────────────────────────────────────────
var TP_CANVAS_KEY_PREFIX='tp_canvas_';
// Option D: category dropdown component for generate sub-bar
function TpGenDropdown(props){
  var label=props.label,icon=props.icon,items=props.items,onAdd=props.onAdd;
  var _open=React.useState(false);var open=_open[0];var setOpen=_open[1];
  var btnRef=React.useRef(null);var menuRef=React.useRef(null);
  // Close on outside click
  React.useEffect(function(){
    if(!open)return;
    function handler(e){
      if(btnRef.current&&btnRef.current.contains(e.target))return;
      if(menuRef.current&&menuRef.current.contains(e.target))return;
      setOpen(false);
    }
    document.addEventListener("mousedown",handler);
    return function(){document.removeEventListener('mousedown',handler);};
  },[open]);
  // Close on Escape
  function onKeyDown(e){
    if(e.key==='Escape')setOpen(false);
    if(e.key==='ArrowDown'&&!open)setOpen(true);
  }
  return h('div',{className:'tp-dd-wrap'},
    h('button',{
      className:'tp-dd-btn',
      ref:btnRef,
      'aria-haspopup':'menu',
      'aria-expanded':String(open),
      onClick:function(){setOpen(function(v){return !v;});},
      onKeyDown:onKeyDown,
    },
      h('span',null,icon+' '+label),
      h('span',{className:'chevron','aria-hidden':'true'},'▾')
    ),
    h('div',{
      className:'tp-dd-menu',
      ref:menuRef,
      role:'menu',
      hidden:!open,
      'aria-label':label+' generators',
    },
      items.map(function(item,i){
        if(item.sep)return h("div",{key:"sep"+i,className:"tp-dd-sep","aria-hidden":"true"});
        return h('button',{
          key:item.id||i,
          className:'tp-dd-item',
          role:'menuitem',
          onClick:function(){onAdd(item);setOpen(false);},
          onKeyDown:function(e){if(e.key==='Escape'){setOpen(false);btnRef.current&&btnRef.current.focus();}}
        },
          h('span',{'aria-hidden':'true'},item.icon),
          h('span',null,item.label)
        );
      })
    )
  );
}
// ── TpHeroModal: full-screen FlipCard on canvas card tap ─────────────────
function TpHeroModal(props){
  var card=props.card,campId=props.campId,onClose=props.onClose;
  var _in=useState(false);var animIn=_in[0];var setAnimIn=_in[1];
  var overlayRef=useRef(null);
  useEffect(function(){
    var t=requestAnimationFrame(function(){
      requestAnimationFrame(function(){setAnimIn(true);});
    });
    return function(){cancelAnimationFrame(t);};
  },[]);
  useEffect(function(){
    function onKey(e){if(e.key==='Escape')onClose();}
    document.addEventListener('keydown',onKey);
    return function(){document.removeEventListener('keydown',onKey);};
  },[onClose]);
  useEffect(function(){
    if(!animIn)return;
    if(window.ogmaMountDiceRollers){
      var mts=document.querySelectorAll('.tp-hero-dice-mount');
      if(mts.length)window.ogmaMountDiceRollers(mts);
    }
  },[animIn]);
  var skillLabel='Roll 4dF';
  var skillVal=0;
  if(card.data&&card.data.skills&&card.data.skills.length){
    skillLabel=(card.data.name||card.title)+' — '+(card.data.skills[0].name||'Roll');
    skillVal=card.data.skills[0].r||0;
  }
  return h('div',{
    ref:overlayRef,
    className:'tp-hero-overlay'+(animIn?' in':''),
    onClick:function(e){if(e.target===overlayRef.current)onClose();},
    role:'dialog','aria-modal':'true','aria-label':card.title||'Card',
  },
    h('div',{className:'tp-hero-shell'+(animIn?' in':'')},
      h('button',{className:'tp-hero-close',onClick:onClose,'aria-label':'Close'},'×'),
      h('div',{className:'tp-hero-card-wrap'},
        renderCard(card.genId, card.data||{}, campId||'', function(){}, [], null)
      ),
      h('div',{
        className:'tp-hero-dice-mount',
        'data-mode':'skill',
        'data-skill':String(skillVal),
        'data-label':skillLabel,
      })
    )
  );
}

function PrepCanvas(props){
  var campId=props.campId,campName=props.campName;
  var pinnedCards=props.pinnedCards,setPinnedCards=props.setPinnedCards;
  var onBack=props.onBack,onExport=props.onExport,showToast=props.showToast,DB=props.DB;
  var onShowMilestones=props.onShowMilestones;
  // Sync props
  var tableSync=props.tableSync;
  var tableRoomCode=props.tableRoomCode;
  var tableIsRemote=props.tableIsRemote;
  var tablePresence=props.tablePresence||[];
  var onHostTable=props.onHostTable;
  var onJoinTable=props.onJoinTable;
  var onDisconnectTable=props.onDisconnectTable;
  var _loaded=useState(false);var loaded=_loaded[0];var setLoaded=_loaded[1];
  var _scale=useState(1);var scale=_scale[0];var setScale=_scale[1];
  var _ox=useState(40);var ox=_ox[0];var setOx=_ox[1];
  var _oy=useState(40);var oy=_oy[0];var setOy=_oy[1];
  var _players=useState([]);var players=_players[0];var setPlayers=_players[1];
  var _order=useState([]);var order=_order[0];var setOrder=_order[1];
  var _selPlayer=useState(null);var selPlayer=_selPlayer[0];var setSelPlayer=_selPlayer[1];
  var _round=useState(1);var round=_round[0];var setRound=_round[1];
  var _scene=useState(1);var scene=_scene[0];var setScene=_scene[1];
  var _gmFP=useState(0);var gmFP=_gmFP[0];var setGmFP=_gmFP[1];
  var _editMode=useState(true);var editMode=_editMode[0];var setEditMode=_editMode[1];
  var _drawerOpen=useState(false);var drawerOpen=_drawerOpen[0];var setDrawerOpen=_drawerOpen[1];
  var _drawerTab=useState('gen');var drawerTab=_drawerTab[0];var setDrawerTab=_drawerTab[1];
  var _editingCard=useState(null);var editingCard=_editingCard[0];var setEditingCard=_editingCard[1];
  var _heroCard=useState(null);var heroCard=_heroCard[0];var setHeroCard=_heroCard[1];
  var newCardRef=useRef(null); // ID of most recently added card for entrance anim
  var _extras=useState(function(){
    var ex={};var COL_W=240,COL_H=260,COLS=4,PAD=20;
    pinnedCards.forEach(function(card,i){
      var col=i%COLS,row=Math.floor(i/COLS);
      ex[card.id]={x:PAD+col*(COL_W+PAD),y:PAD+row*(COL_H+PAD),size:'md',phyHit:null,menHit:null,cdFilled:0,gmOnly:false,freeInvoke:false,title:null,notes:'',zoneId:null};
    });
    return ex;
  });
  var extras=_extras[0];var setExtras=_extras[1];
  var canvasRef=useRef(null);
  var dragState=useRef(null);
  var saveTimer=useRef(null);
  var lastRemovedRef=useRef(null); // TC-18: undo
  var SAVE_KEY=TP_CANVAS_KEY_PREFIX+(campId||'default');

  // TC-01: Persist canvas state to IDB
  function persistCanvas(){
    if(!loaded)return;
    if(saveTimer.current)clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(function(){
      var s={scale:scale,ox:ox,oy:oy,players:players,order:order,round:round,scene:scene,gmFP:gmFP,editMode:editMode,extras:extras,ts:Date.now()};
      if(DB)DB.saveSession(SAVE_KEY,s).catch(function(){});
      // Broadcast to remote players if hosting
      if(tableSync&&tableSync.role==='gm'&&tableSync.connected){
        var broadcast=Object.assign({},s);
        broadcast.cards=(pinnedCards||[]).filter(function(c){var ex=extras[c.id]||{};return !ex.gmOnly;});
        tableSync.broadcastState(broadcast);
      }
    },400);
  }
  useEffect(function(){
    if(!DB){setLoaded(true);return;}
    DB.loadSession(SAVE_KEY).then(function(saved){
      if(saved){
        if(typeof saved.scale==='number')setScale(saved.scale);
        if(typeof saved.ox==='number')setOx(saved.ox);
        if(typeof saved.oy==='number')setOy(saved.oy);
        if(Array.isArray(saved.players))setPlayers(saved.players);
        if(Array.isArray(saved.order))setOrder(saved.order);
        if(typeof saved.round==='number')setRound(saved.round);
        if(typeof saved.scene==='number')setScene(saved.scene);
        if(typeof saved.gmFP==='number')setGmFP(saved.gmFP);
        if(typeof saved.editMode==='boolean')setEditMode(saved.editMode);
        if(saved.extras&&typeof saved.extras==='object'){
          setExtras(function(prev){return Object.assign({},saved.extras,Object.keys(prev).reduce(function(acc,id){if(!saved.extras[id])acc[id]=prev[id];return acc;},{}));});
        }
      }
      setLoaded(true);
    }).catch(function(){setLoaded(true);});
  },[]);
  function updExtra(id,patch){setExtras(function(prev){var next=Object.assign({},prev);next[id]=Object.assign({},prev[id]||{},patch);return next;});}
  function updPlayer(id,patch){setPlayers(function(ps){return ps.map(function(p){return p.id===id?Object.assign({},p,patch):p;});});}
  useEffect(function(){
    if(!loaded)return;
    setExtras(function(prev){
      var next=Object.assign({},prev);
      var idx=Object.keys(next).length;
      var COL_W=240,COL_H=260,COLS=4,PAD=20;
      pinnedCards.forEach(function(card){
        if(!next[card.id]){
          var col=idx%COLS,row=Math.floor(idx/COLS);
          next[card.id]={x:PAD+col*(COL_W+PAD),y:PAD+row*(COL_H+PAD),size:'md',phyHit:null,menHit:null,cdFilled:0,gmOnly:false,freeInvoke:false,title:null,notes:'',zoneId:null};
          idx++;
        }
      });
      return next;
    });
  },[pinnedCards.length,loaded]);
  useEffect(function(){if(loaded)persistCanvas();},[scale,ox,oy,round,scene,gmFP,editMode,loaded]);
  useEffect(function(){if(loaded)persistCanvas();},[players,order]);
  useEffect(function(){if(loaded)persistCanvas();},[extras]);
  useEffect(function(){
    function onKey(e){
      if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
      if((e.key==='z'||e.key==='Z')&&(e.ctrlKey||e.metaKey)){e.preventDefault();undoRemove();}
    }
    window.addEventListener('keydown',onKey);
    return function(){window.removeEventListener('keydown',onKey);};
  },[pinnedCards,extras]);
  function removeCard(id){
    var card=pinnedCards.find(function(c){return c.id===id;});
    var ex=extras[id];
    lastRemovedRef.current={card:card,ex:ex};
    setPinnedCards(function(cs){var next=cs.filter(function(c){return c.id!==id;});if(DB)DB.deleteCard(campId,id).catch(function(){});return next;});
    setExtras(function(prev){var next=Object.assign({},prev);delete next[id];return next;});
    if(showToast)showToast('Card removed — Ctrl+Z to undo');
  }
  function undoRemove(){
    var last=lastRemovedRef.current;
    if(!last||!last.card)return;
    var card=last.card;
    if(DB)DB.saveCard(campId,card).catch(function(){});
    setPinnedCards(function(cs){return cs.concat([card]);});
    if(last.ex)setExtras(function(prev){var next=Object.assign({},prev);next[card.id]=last.ex;return next;});
    lastRemovedRef.current=null;
    if(showToast)showToast('Card restored');
  }
  function spendFP(playerId){updPlayer(playerId,{fp:Math.max(0,(players.find(function(p){return p.id===playerId;})||{fp:0}).fp-1)});}
  function addGeneratedCard(genId){
    newCardRef.current='pending';
    var camp=typeof CAMPAIGNS!=='undefined'&&CAMPAIGNS[campId];
    if(!camp){if(showToast)showToast('No campaign loaded');return;}
    var eff=filteredTables(mergeUniversal(camp.tables),{});
    var data;try{data=generate(genId,eff,4);}catch(e){if(showToast)showToast('Generate failed');return;}
    if(!data)return;
    var card=tpCardFromResult(genId,data);
    var pinnedCard={id:card.id,genId:card.genId,title:card.title,data:card.data,ts:card.ts||Date.now()};
    if(DB)DB.saveCard(campId,pinnedCard).catch(function(){});
    setPinnedCards(function(cs){return cs.concat([pinnedCard]);});
    setExtras(function(prev){var next=Object.assign({},prev);next[card.id]={x:card.x,y:card.y,size:'md',phyHit:null,menHit:null,cdFilled:0,gmOnly:false,freeInvoke:false,title:null,notes:'',zoneId:null};return next;});
    if(showToast)showToast('\u2795\u00A0'+(TP_TYPE_LBL[genId]||genId)+' added');
    setDrawerOpen(false);
  }
  // TC-03: Add situation aspect card mid-scene
  function addAspectCard(name){
    if(!name||!name.trim())return;
    var id=tpUid();
    var pinnedCard={id:id,genId:'aspect',title:name.trim(),data:{aspects:[{name:name.trim()}]},ts:Date.now()};
    if(DB)DB.saveCard(campId,pinnedCard).catch(function(){});
    setPinnedCards(function(cs){return cs.concat([pinnedCard]);});
    var idx=Object.keys(extras).length,PAD=20,COL_W=220;
    setExtras(function(prev){var next=Object.assign({},prev);next[id]={x:PAD+(idx%4)*(COL_W+PAD),y:PAD+Math.floor(idx/4)*160,size:'md',phyHit:null,menHit:null,cdFilled:0,gmOnly:false,freeInvoke:true,title:name.trim(),notes:''};return next;});
    if(showToast)showToast('Aspect added with free invoke');
  }
  // TC-09: Add GM note card
  function addGMNote(){
    var id=tpUid();
    var pinnedCard={id:id,genId:'gm',title:'GM Note',data:{},ts:Date.now()};
    if(DB)DB.saveCard(campId,pinnedCard).catch(function(){});
    setPinnedCards(function(cs){return cs.concat([pinnedCard]);});
    setExtras(function(prev){var next=Object.assign({},prev);next[id]={x:40+Math.random()*200,y:40+Math.random()*200,size:'md',phyHit:null,menHit:null,cdFilled:0,gmOnly:true,freeInvoke:false,title:'GM Note',notes:'',zoneId:null};return next;});
    setEditingCard(id);
  }
  // TC-07: Add zone card
  function addZone(name,aspect,movement){
    if(!name||!name.trim())return;
    var id=tpUid();
    var notes=(aspect||'')+(movement?'\nMovement: '+movement:'');
    var pinnedCard={id:id,genId:'zone',title:name.trim(),data:{name:name,aspect:aspect,movement:movement},ts:Date.now()};
    if(DB)DB.saveCard(campId,pinnedCard).catch(function(){});
    setPinnedCards(function(cs){return cs.concat([pinnedCard]);});
    setExtras(function(prev){var next=Object.assign({},prev);next[id]={x:60+Math.random()*300,y:60+Math.random()*200,size:'full',phyHit:null,menHit:null,cdFilled:0,gmOnly:false,freeInvoke:false,title:name.trim(),notes:notes,zoneId:null};return next;});
    if(showToast)showToast('Zone added');
  }
  // TC-07: Assign card to zone
  function assignToZone(cardId,zoneId){
    updExtra(cardId,{zoneId:zoneId});
    if(showToast)showToast(zoneId?'Card added to zone':'Card removed from zone');
  }
  // TC-10: Clear canvas
  function clearCanvas(){
    if(!confirm('Clear all canvas cards and players?'))return;
    setPinnedCards(function(cs){cs.forEach(function(c){if(DB)DB.deleteCard(campId,c.id).catch(function(){});});return [];});
    setExtras({});setPlayers([]);setOrder([]);setRound(1);setScene(1);setGmFP(0);
    if(DB)DB.saveSession(SAVE_KEY,{}).catch(function(){});
    if(showToast)showToast('Canvas cleared');
  }
  function newRound(){
    setRound(function(r){return r+1;});
    setPlayers(function(ps){return ps.map(function(p){return Object.assign({},p,{acted:false});});});
    if(showToast)showToast('New round');
  }
  // TC-14: New scene — clears stress for all players
  // TC-22: Full export including player state, round, scene
  function exportFull(){
    var lines=[];
    lines.push('# '+(campName||'Session')+' \u2014 Table Export');
    lines.push('_Scene '+scene+' \u00B7 Round '+round+' \u00B7 '+pinnedCards.length+' cards_\n');
    if(players.length>0){
      lines.push('## Players\n');
      players.forEach(function(p){
        lines.push('### '+p.name+(p.conceded?' (conceded)':''));
        lines.push('FP: '+p.fp+'/'+p.ref+' \u00B7 PHY: '+p.phy.map(function(v){return v?'[x]':'[ ]';}).join(' ')+' \u00B7 MEN: '+p.men.map(function(v){return v?'[x]':'[ ]';}).join(' '));
        if(p.hc)lines.push('HC: '+p.hc);
        var tr=p.aspects&&p.aspects[1]?'Trouble: '+p.aspects[1]:''; if(tr)lines.push(tr);
        var cons=p.conseq&&p.conseq.filter(Boolean);if(cons&&cons.length)lines.push('Consequences: '+cons.join(', '));
        if(p.stunts&&p.stunts.length)lines.push('Stunts: '+p.stunts.map(function(s){return s.name||(s.l||s);}).join(', '));
        lines.push('');
      });
    }
    lines.push('## Cards\n');
    pinnedCards.forEach(function(card,i){
      var ex=extras[card.id]||{};
      var title=ex.title||card.title;
      var typeLabel=TP_TYPE_LBL[card.genId]||card.genId||'Card';
      lines.push('### '+(i+1)+'. '+title+(ex.gmOnly?' (GM only)':'')+(ex.freeInvoke?' \u2605FI':''));
      lines.push('_'+typeLabel+'_');
      if(ex.notes)lines.push('\n'+ex.notes);
      lines.push('');
    });
    var blob=new Blob([lines.join('\n')],{type:'text/markdown'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;a.download=(campName||'session').replace(/\s+/g,'-').toLowerCase()+'-table.md';
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    setTimeout(function(){URL.revokeObjectURL(url);},30000);
    if(showToast)showToast('Session exported');
  }
  function newScene(){
    setScene(function(s){return s+1;});setRound(1);
    setPlayers(function(ps){return ps.map(function(p){return Object.assign({},p,{acted:false,phy:p.phy.map(function(){return false;}),men:p.men.map(function(){return false;})});});});
    if(showToast)showToast('New scene — stress cleared');
  }

  // ── Canvas interaction ────────────────────────────────────────────
  function onCanvasMouseDown(e){
    if(e.target!==canvasRef.current&&!e.target.classList.contains('tp-canvas-inner'))return;
    dragState.current={type:'pan',startX:e.clientX,startY:e.clientY,origOx:ox,origOy:oy};
    canvasRef.current&&canvasRef.current.classList.add('panning');
  }
  function onCardDragStart(e,cardId){
    if(!editMode)return;
    e.stopPropagation();e.preventDefault();
    var ex=extras[cardId]||{x:0,y:0};
    dragState.current={type:'card',cardId:cardId,startX:e.clientX,startY:e.clientY,origX:ex.x,origY:ex.y};
    updExtra(cardId,{_dragging:true});
  }
  function onMouseMove(e){
    var ds=dragState.current;if(!ds)return;
    if(ds.type==='pan'){setOx(ds.origOx+(e.clientX-ds.startX));setOy(ds.origOy+(e.clientY-ds.startY));}
    else if(ds.type==='card'){updExtra(ds.cardId,{x:ds.origX+(e.clientX-ds.startX)/scale,y:ds.origY+(e.clientY-ds.startY)/scale,_dragging:true});}
  }
  function onMouseUp(){
    var ds=dragState.current;
    if(ds&&ds.type==='card')updExtra(ds.cardId,{_dragging:false});
    dragState.current=null;
    canvasRef.current&&canvasRef.current.classList.remove('panning');
  }
  function onWheel(e){
    e.preventDefault();
    var rect=canvasRef.current.getBoundingClientRect();
    var mx=e.clientX-rect.left,my=e.clientY-rect.top;
    var delta=e.deltaY<0?1.08:0.93;
    var ns=Math.min(Math.max(scale*delta,0.2),3);
    setScale(ns);setOx(mx-(mx-ox)*(ns/scale));setOy(my-(my-oy)*(ns/scale));
  }
  function fitAll(){
    var CARD_W=240,CARD_H=220;
    var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    pinnedCards.forEach(function(card){var ex=extras[card.id]||{x:0,y:0};minX=Math.min(minX,ex.x);minY=Math.min(minY,ex.y);maxX=Math.max(maxX,ex.x+CARD_W);maxY=Math.max(maxY,ex.y+CARD_H);});
    if(!canvasRef.current||minX===Infinity){setScale(1);setOx(40);setOy(40);return;}
    var vw=canvasRef.current.clientWidth-60,vh=canvasRef.current.clientHeight-60;
    var ns=Math.min(Math.min(vw/(maxX-minX),vh/(maxY-minY)),1.5);
    setScale(Math.max(ns,0.2));setOx(20-minX*ns);setOy(20-minY*ns);
  }

  function removeCard(id){
    setPinnedCards(function(cs){var next=cs.filter(function(c){return c.id!==id;});if(DB)DB.deleteCard(campId,id).catch(function(){});return next;});
    if(showToast)showToast('Card removed');
  }

  function spendFP(playerId){updPlayer(playerId,{fp:Math.max(0,(players.find(function(p){return p.id===playerId;})||{fp:0}).fp-1)});}

  // Add generated card to canvas
  function addGeneratedCard(genId){
    var camp=typeof CAMPAIGNS!=='undefined'&&CAMPAIGNS[campId];
    if(!camp){if(showToast)showToast('No campaign loaded');return;}
    var eff=filteredTables(mergeUniversal(camp.tables),{});
    var data;try{data=generate(genId,eff,4);}catch(e){if(showToast)showToast('Generate failed');return;}
    if(!data)return;
    var card=tpCardFromResult(genId,data);
    var pinnedCard={id:card.id,genId:card.genId,title:card.title,data:card.data,ts:card.ts||Date.now()};
    if(DB)DB.saveCard(campId,pinnedCard).catch(function(){});
    setPinnedCards(function(cs){return cs.concat([pinnedCard]);});
    setExtras(function(prev){var next=Object.assign({},prev);next[card.id]={x:card.x,y:card.y,size:'md',phyHit:null,menHit:null,cdFilled:0};return next;});
    if(showToast)showToast('\u2795 '+TP_TYPE_LBL[genId]||genId+' added');
    setDrawerOpen(false);
  }

  function newRound(){
    setRound(function(r){return r+1;});
    setPlayers(function(ps){return ps.map(function(p){return Object.assign({},p,{acted:false});});});
    if(showToast)showToast('New round');
  }

  return h('div',{className:'tp-view',onMouseMove:onMouseMove,onMouseUp:onMouseUp,onMouseLeave:onMouseUp},

    // ── Toolbar — ALL controls live here, nothing in the canvas ──
    h('div',{className:'tp-toolbar'},
      h('div',{className:'tp-toolbar-left'},
        h('button',{className:'btn btn-ghost',onClick:onBack,style:{fontSize:12}},'← Back'),
        h('span',{className:'tp-title'},h(FaCartPlusIcon,{size:13}),' Table'),
        h('span',{className:'tp-count'},pinnedCards.length+' card'+(pinnedCards.length!==1?'s':''))
      ),
      h('div',{className:'tp-toolbar-right'},
        // TC-14: Scene counter
        h('div',{className:'rs-round-pill',style:{fontFamily:'var(--font-ui)',gap:3}},
          h('span',{style:{fontSize:11,color:'var(--text-muted)',fontFamily:'var(--font-ui)'}},'Sc'),
          h('span',{className:'rs-round-num',style:{fontFamily:'var(--font-ui)'}},scene),
          h('button',{className:'rs-round-btn',onClick:newScene,'aria-label':'New scene',title:'New scene: clears all stress'},'+')
        ),
        // Round counter
        h('div',{className:'rs-round-pill',style:{fontFamily:'var(--font-ui)'}},
          h('button',{className:'rs-round-btn',onClick:function(){if(round>1)setRound(function(r){return r-1;});},'aria-label':'Prev round'},'\u2212'),
          h('span',{style:{fontSize:11,color:'var(--text-muted)',marginRight:2,fontFamily:'var(--font-ui)'}},'Rnd'),
          h('span',{className:'rs-round-num',style:{fontFamily:'var(--font-ui)'}},round),
          h('button',{className:'rs-round-btn',onClick:newRound,'aria-label':'New round'},'+')
        ),
        // TC-06: GM FP pool
        h('div',{className:'rs-round-pill',title:'GM FP pool (1 per PC). \u21BA resets.',style:{fontFamily:'var(--font-ui)',gap:3}},
          h('button',{className:'rs-round-btn',onClick:function(){setGmFP(function(v){return Math.max(0,v-1);});},'aria-label':'Spend GM FP'},'\u2212'),
          h('span',{style:{fontSize:11,color:'var(--text-muted)',fontFamily:'var(--font-ui)'}},'\u25C6 GM'),
          h('span',{className:'rs-round-num',style:{fontFamily:'var(--font-ui)',color:gmFP===0?'var(--c-red)':'var(--c-green)'}},gmFP),
          h('button',{className:'rs-round-btn',onClick:function(){setGmFP(function(v){return v+1;});},'aria-label':'Gain GM FP'},'+'),
          h('button',{className:'rs-round-btn',style:{fontSize:9},onClick:function(){setGmFP(players.length);},title:'Reset to 1 per PC'},'\u21BA')
        ),
        // TC-02: Edit/Play toggle (Play mode hides GM-only cards)
        h('button',{className:'btn btn-ghost',onClick:function(){setEditMode(function(v){return !v;});},title:editMode?'Switch to Play Mode (hides GM cards)':'Switch to Edit Mode',style:{fontSize:12}},
          editMode?'\u25B6 Play':'\u270F Edit'),
        // TC-10: Clear canvas
        h('button',{className:'btn btn-ghost',onClick:clearCanvas,title:'Clear canvas and all players',style:{fontSize:12,color:'var(--c-red)'},'aria-label':'Clear'},'\u2715'),
        // Divider
        h('div',{style:{width:1,height:20,background:'var(--border)',flexShrink:0}}),
        // Zoom
        h('button',{className:'btn btn-ghost',onClick:function(){setScale(function(s){return Math.min(s*1.2,3);});},'aria-label':'Zoom in',style:{fontSize:13,padding:'4px 8px',minWidth:32}},'+'),
        h('span',{style:{fontSize:11,color:'var(--text-muted)',minWidth:38,textAlign:'center',fontFamily:'var(--font-ui)',fontWeight:700}},Math.round(scale*100)+'%'),
        h('button',{className:'btn btn-ghost',onClick:function(){setScale(function(s){return Math.max(s/1.2,0.2);});},'aria-label':'Zoom out',style:{fontSize:13,padding:'4px 8px',minWidth:32}},'\u2212'),
        h('button',{className:'btn btn-ghost',onClick:fitAll,title:'Fit all cards',style:{fontSize:12}},'\u22DE Fit'),
        // Divider
        h('div',{style:{width:1,height:20,background:'var(--border)',flexShrink:0}}),
        // Generate toggle
        h('button',{
          className:'btn btn-ghost'+(drawerOpen&&drawerTab==='gen'?' active':''),
          onClick:function(){if(drawerOpen&&drawerTab==='gen'){setDrawerOpen(false);}else{setDrawerOpen(true);setDrawerTab('gen');}},
          style:{fontSize:12},
        },'\u2795 Generate'),
        // Dice toggle
        h('button',{
          className:'btn btn-ghost'+(drawerOpen&&drawerTab==='dice'?' active':''),
          onClick:function(){if(drawerOpen&&drawerTab==='dice'){setDrawerOpen(false);}else{setDrawerOpen(true);setDrawerTab('dice');}},
          style:{fontSize:12},
        },'\uD83C\uDFB2 Dice'),
        // Export
        h('button',{className:'btn btn-ghost',onClick:exportFull,title:'Export session as Markdown (players + cards)',style:{fontSize:12}},h(FaShareIcon,{size:12})),
        // TC-21: Milestone tracker
        onShowMilestones&&h('button',{className:'btn btn-ghost',onClick:onShowMilestones,title:'Open Milestone Tracker',style:{fontSize:12}},'⚡ Miles.'),

        // Table sync controls
        tableSync&&h('div',{style:{display:'flex',alignItems:'center',gap:4,background:'var(--inset)',
          border:'1px solid var(--c-green)',borderRadius:6,padding:'2px 8px',fontSize:11,
          color:'var(--c-green)',fontFamily:'var(--font-ui)',flexShrink:0}},
          h('span',{style:{fontWeight:700}},tableRoomCode),
          h('span',{style:{color:'var(--text-muted)',margin:'0 3px'}},'·'),
          h('span',null,tablePresence.filter(function(p){return p.connected;}).length+' online'),
          h('button',{style:{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',
            fontSize:11,padding:'0 2px',fontFamily:'var(--font-ui)'},
            title:'Copy join link',
            onClick:function(){
              var path=(window.location.pathname).replace(/\.html$/,'');
              var url=window.location.origin+path+'?room='+tableRoomCode;
              navigator.clipboard.writeText(url).then(function(){if(showToast)showToast('Join link copied!');}).catch(function(){if(showToast)showToast('Room: '+tableRoomCode);});
            }},'📋'),
          h('button',{style:{background:'none',border:'none',cursor:'pointer',color:'var(--c-red)',
            fontSize:11,padding:'0 2px',fontFamily:'var(--font-ui)'},
            onClick:onDisconnectTable},tableIsRemote?'Leave':'Stop')
        ),
        !tableSync&&!tableIsRemote&&onHostTable&&h('button',{
          className:'btn btn-ghost',
          onClick:onHostTable,
          style:{fontSize:12,fontWeight:700,color:'var(--c-green)',flexShrink:0},
          title:'Host this Table canvas online',
        },'🌐 Host'),
        !tableSync&&!tableIsRemote&&onJoinTable&&h('button',{
          className:'btn btn-ghost',
          onClick:function(){
            var code=prompt('Enter room code:');
            if(code&&code.trim())onJoinTable(code.trim().toUpperCase());
          },
          style:{fontSize:12,flexShrink:0},
          title:'Join a hosted Table session',
        },'📶 Join'),
        // Start Party Play
        campId&&h('a',{
          href:'../campaigns/run.html?world='+campId,className:'btn',
          style:{fontSize:12,fontWeight:700,textDecoration:'none',background:'linear-gradient(90deg,var(--c-green),var(--c-blue))',color:'#000',border:'none',gap:5,flexShrink:0},
        },'\u25B6 Start Party Play')
      )
    ),

    // ── Sub-bar: drawer panel — OUTSIDE canvas-wrap, never clipped ─
    drawerOpen&&h('div',{className:'tp-sub-bar'},
      h('div',{style:{display:'flex',alignItems:'center',borderBottom:'1px solid var(--border)',flexShrink:0}},
        h('div',{className:'rs-drawer-tabs',style:{flex:1}},
          h('button',{className:'rs-drawer-tab '+(drawerTab==='gen'?'on':''),onClick:function(){setDrawerTab('gen');}},'\u2795 Generate & Add to Canvas'),
          h('button',{className:'rs-drawer-tab '+(drawerTab==='dice'?'on':''),onClick:function(){setDrawerTab('dice');}},'\uD83C\uDFB2 Dice')
        ),
        h('button',{className:'rs-drawer-close',onClick:function(){setDrawerOpen(false);},'aria-label':'Close'},'\u00D7')
      ),
      drawerTab==='gen'&&h('div',{className:'tp-gen-callout'},
        h('div',{className:'tp-gen-callout-title'},'➕ Generate & Add to Canvas'),
        h('div',{className:'tp-gen-bar',role:'toolbar','aria-label':'Generate and add to canvas'},
        // Characters
        h(TpGenDropdown,{
          label:'Characters',icon:'\u25C6',
          items:[
            {id:'npc_major',label:'Major NPC',icon:'\u25C6'},
            {id:'npc_minor',label:'Minor NPC',icon:'\u25C8'},
            {sep:true},
            {id:'faction',label:'Faction',icon:'\u2691'},
            {id:'encounter',label:'Encounter',icon:'\u2694'},
          ],
          onAdd:function(item){addGeneratedCard(item.id);}
        }),
        // Scene
        h(TpGenDropdown,{
          label:'Scene',icon:'\u25C9',
          items:[
            {id:'scene',label:'Scene',icon:'\u25C9'},
            {id:'seed',label:'Seed',icon:'\u2726'},
            {sep:true},
            {id:'zone',label:'Zone',icon:'\u25A1'},
            {id:'aspect',label:'Aspect',icon:'\u25C8'},
          ],
          onAdd:function(item){
            if(item.id==='zone'){
              var n=prompt('Zone name (e.g. The Docks):');if(!n||!n.trim())return;
              var a=prompt('Zone aspect (optional):');
              var m=prompt('Movement cost (optional):');
              addZone(n.trim(),a||'',m||'');
            }else if(item.id==='aspect'){
              var na=prompt('Aspect name (e.g. On Fire):');
              if(na&&na.trim())addAspectCard(na.trim());
            }else{addGeneratedCard(item.id);}
          }
        }),
        // Mechanics
        h(TpGenDropdown,{
          label:'Mechanics',icon:'\u2297',
          items:[
            {id:'compel',label:'Compel',icon:'\u2297'},
            {id:'countdown',label:'Countdown',icon:'\u23F1'},
            {sep:true},
            {id:'complication',label:'Complication',icon:'\u26A0'},
            {id:'obstacle',label:'Obstacle',icon:'\u25B2'},
          ],
          onAdd:function(item){addGeneratedCard(item.id);}
        }),
        // GM Note standalone
        h('button',{
          className:'tp-dd-btn',
          onClick:addGMNote,
          title:'Add a GM-only sticky note',
          'aria-label':'Add GM note',
          style:{opacity:.85}
        },'\uD83D\uDD12 GM Note')
        )
      ),
      drawerTab==='dice'&&h('div',{className:'tp-sub-bar-body'},
        h(TpDicePanel,{players:players,selId:selPlayer,spendFP:spendFP,
          onRoll:function(r){if(showToast)showToast(r.who+' \u00B7 '+r.skill+' \u2192 '+tpLbl(r.total)+' ('+(r.total>=0?'+':'')+r.total+')');}
        })
      )
    ),

    // ── Main row: left players + canvas ──────────────────────────
    h('div',{style:{display:'flex',flex:1,overflow:'hidden',minHeight:0}},

      // Left: players
      h('div',{className:'rs-left'},
        h('div',{className:'rs-sidebar-hdr'},
          h('span',null,'Players & FP'),
          h('span',{title:'GM pool. Click to reset to 1 per PC.',onClick:function(){setGmFP(players.length);},
            style:{marginLeft:'auto',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:'var(--font-ui)',
              color:gmFP===0?'var(--c-red)':'var(--c-green)'}},
            '\u25C6\u00A0'+gmFP)
        ),
        h('div',{className:'rs-sidebar-body',role:'list','aria-label':'Players'},
          players.map(function(p){
            return h(TpPlayerRow,{key:p.id,player:p,sel:selPlayer===p.id,
              onUpd:function(patch){updPlayer(p.id,patch);},
              onSel:function(id){setSelPlayer(id);}});
          }),
          h('button',{className:'rs-add-player','aria-label':'Add player',onClick:function(){
            var name=prompt('Player name:');if(!name)return;
            var np={id:tpUid(),name:name,hc:'',fp:3,ref:3,
              phy:[false,false,false],men:[false,false],
              color:TP_COLORS[players.length%TP_COLORS.length],acted:false,conceded:false,skills:[],conseq:['','',''],treating:[false,false,false],aspects:[],stunts:[]};
            setPlayers(function(ps){return ps.concat([np]);});
            setOrder(function(o){return o.concat([np.id]);});
            setGmFP(function(v){return v+1;});
          }},'+ Add Player'),
          // TC-15: Import from .ogma.json
          h('label',{
            className:'rs-add-player',
            title:'Import player from Ogma .ogma.json export',
            style:{cursor:'pointer',display:'block',textAlign:'center'},
          },
            '📂 Import .ogma',
            h('input',{type:'file',accept:'.json,.ogma.json',style:{display:'none'},
              onChange:function(e){
                var file=e.target.files[0];if(!file)return;
                var reader=new FileReader();
                reader.onload=function(ev){
                  var player=tpParseOgmaCharacter(ev.target.result,players.length);
                  if(!player){if(showToast)showToast('Not a valid Ogma file');return;}
                  setPlayers(function(ps){return ps.concat([player]);});
                  setOrder(function(o){return o.concat([player.id]);});
                  setGmFP(function(v){return v+1;});
                  if(showToast)showToast(player.name+' imported');
                };
                reader.readAsText(file);e.target.value='';
              }
            })
          )
        )
      ),

      // Canvas — cards + empty state only, no drawer, no zoom
      h('div',{
        className:'tp-canvas-wrap'+(editMode?' edit-mode':''),
        role:'region','aria-label':'Session canvas',
        ref:canvasRef,onMouseDown:onCanvasMouseDown,onWheel:onWheel,
        style:{touchAction:'none'},
      },
        h('div',{className:'tp-canvas-inner',style:{transform:'translate('+ox+'px,'+oy+'px) scale('+scale+')'}},
          // TC-07: Zone-aware render — zones first (full), then non-child cards on top
        (function(){
          var visCards=pinnedCards.filter(function(card){
            var ex=extras[card.id]||{};
            return editMode||!ex.gmOnly;
          });
          var zones=visCards.filter(function(card){return card.genId==='zone';});
          var nonZone=visCards.filter(function(card){
            var ex=extras[card.id]||{};
            return card.genId!=='zone'&&!ex.zoneId;
          });
          var inZone=visCards.filter(function(card){
            var ex=extras[card.id]||{};
            return card.genId!=='zone'&&ex.zoneId;
          });
          function renderCard(card,inZoneMode){
            var ex=extras[card.id]||{x:0,y:0,size:'md'};
            var typeKey=TP_TYPE_CLS[card.genId]||'cct-mechanic';
            var typeLbl=TP_TYPE_LBL[card.genId]||(card.genId||'').toUpperCase();
            var sz=ex.size||'md';
            var genMeta=(typeof GENERATORS!=='undefined'?GENERATORS:[]).find(function(g){return g.id===card.genId;})||{};
            var zoneChildren=card.genId==='zone'?inZone.filter(function(ch){return (extras[ch.id]||{}).zoneId===card.id;}):[];
            return h('div',{key:card.id,
              className:'cc cc-'+sz+(ex._dragging?' drag-active':'')+(ex.gmOnly?' cc-gm-only':'')+(ex.freeInvoke?' cc-free-invoke':'')+(card.genId==='zone'?' cc-zone-card':'')+(newCardRef.current===card.id?' tp-card-new':''),
              ref:newCardRef.current===card.id?function(el){if(el){setTimeout(function(){newCardRef.current=null;},400);}}:null,
              style:{left:ex.x+'px',top:ex.y+'px',zIndex:ex._dragging?1000:(card.genId==='zone'?1:2)},
              onDragOver:card.genId==='zone'?function(e){e.preventDefault();}:null,
              onDrop:card.genId==='zone'?function(e){
                e.preventDefault();
                var dragId=e.dataTransfer.getData('text/plain');
                if(dragId&&dragId!==card.id)assignToZone(dragId,card.id);
              }:null,
            },
              h('div',{className:'cc-hdr',
                onMouseDown:function(e){onCardDragStart(e,card.id);},
                draggable:!inZoneMode,
                onDragStart:!inZoneMode?function(e){e.dataTransfer.setData('text/plain',card.id);}:null,
              },
                h('span',{className:'cc-type '+typeKey},(genMeta.icon?genMeta.icon+' ':'')+typeLbl),
                ex.zoneId&&h('span',{style:{fontSize:9,color:'var(--c-green)',marginLeft:4}},'⬤'),
                h('div',{className:'cc-hdr-acts'},
                  ex.freeInvoke&&h('span',{title:'Free invoke — click to consume',
                    onClick:function(e){e.stopPropagation();updExtra(card.id,{freeInvoke:false});if(showToast)showToast('Free invoke used');},
                    style:{fontSize:11,color:'var(--c-green)',cursor:'pointer',fontWeight:700,padding:'0 3px',userSelect:'none'},
                  },'★FI'),
                  editMode&&h('button',{className:'cc-ibtn'+(ex.gmOnly?' active':''),
                    onClick:function(e){e.stopPropagation();updExtra(card.id,{gmOnly:!ex.gmOnly});},
                    title:ex.gmOnly?'GM only':'Make GM only',
                    style:{color:ex.gmOnly?'var(--c-amber,#f4b942)':null,fontSize:10},
                  },ex.gmOnly?'GM':'—'),
                  h('button',{className:'cc-ibtn'+(ex.freeInvoke?' active':''),
                    onClick:function(e){e.stopPropagation();updExtra(card.id,{freeInvoke:!ex.freeInvoke});},
                    title:'Free invoke',style:{color:ex.freeInvoke?'var(--c-green)':null,fontSize:11},
                  },'★'),
                  ['sm','md','full'].map(function(s){
                    return h('button',{key:s,className:'cc-ibtn'+(sz===s?' active':''),
                      title:s==='sm'?'Compact':s==='md'?'Medium':'Full',
                      onClick:function(e){e.stopPropagation();updExtra(card.id,{size:s});}
                    },s==='sm'?'□':s==='md'?'▣':'■');
                  }),
                  editMode&&h('button',{className:'cc-ibtn',
                    onClick:function(e){e.stopPropagation();setEditingCard(card.id);},
                    'aria-label':'Edit card',title:'Edit',
                  },'✏'),
                  // TC-07: remove from zone button
                  ex.zoneId&&editMode&&h('button',{className:'cc-ibtn',
                    onClick:function(e){e.stopPropagation();assignToZone(card.id,null);},
                    title:'Remove from zone',style:{fontSize:9},
                  },'↵'),
                  h('button',{className:'cc-ibtn danger',
                    onClick:function(e){e.stopPropagation();removeCard(card.id);},
                    'aria-label':'Remove card'},'×')
                )
              ),
              sz!=='sm'&&card.genId!=='zone'&&h('div',{
                className:'tp-card-expand-btn',
                title:'Tap to expand',
                onClick:function(e){
                  if(e.target.closest('button'))return;
                  setHeroCard(card);
                  if(tableSync&&tableSync.role==='gm'&&tableSync.connected)
                    tableSync.ws.send(JSON.stringify({type:'card_expand',cardId:card.id}));
                },
              },
                h(TpCardBody,{
                  card:Object.assign({},card,{size:sz,phyHit:ex.phyHit,menHit:ex.menHit,cdFilled:ex.cdFilled||0,
                    title:ex.title!=null?ex.title:card.title,
                    _notes:ex.notes||''}),
                  onUpd:function(patch){updExtra(card.id,patch);},
                  onRollSkill:function(sk){
                    setSelPlayer(selPlayer||(players[0]&&players[0].id)||null);
                    setDrawerOpen(true);setDrawerTab('dice');
                    if(showToast)showToast('Rolling '+sk.l+' +'+sk.v+' — select player to roll');
                  }
                })
              ),
              // TC-07: Zone body with children list + drop hint
              card.genId==='zone'&&h('div',{className:'cc-zone-body'},
                h('div',{style:{fontSize:12,fontWeight:700,color:'var(--text)',marginBottom:3}},
                  ex.title||card.title),
                (ex.notes||card.notes)&&h('div',{style:{fontSize:11,fontStyle:'italic',color:'var(--text-muted)',marginBottom:4}},
                  (ex.notes||card.notes).split('\n')[0]),
                h('div',{className:'cc-zone-children'},
                  zoneChildren.map(function(ch){
                    var chex=extras[ch.id]||{};
                    return h('div',{key:ch.id,className:'cc-zone-child'},
                      h('span',{style:{fontSize:10,color:'var(--text)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},
                        (TP_TYPE_LBL[ch.genId]||ch.genId)+': '+(chex.title||ch.title)),
                      editMode&&h('button',{className:'cc-zone-child-remove',
                        onClick:function(e){e.stopPropagation();assignToZone(ch.id,null);},
                        title:'Remove from zone'},'×')
                    );
                  }),
                  editMode&&zoneChildren.length===0&&h('div',{className:'cc-zone-drop-hint'},'Drop cards here or drag a card onto this zone')
                )
              )
            );
          }
          return zones.map(function(z){return renderCard(z,false);}).concat(
                 nonZone.map(function(card){return renderCard(card,false);}));
        })()

        ),
        pinnedCards.length===0&&h('div',{className:'tp-empty'},
          h('div',{className:'tp-empty-icon'},'\uD83C\uDFB2'),
          h('div',{className:'tp-empty-title'},'Open canvas'),
          h('div',{className:'tp-empty-desc'},'Save cards from the generator, or use Generate above to add directly.')
        )
      )
    ),

    // ── Turn order bar ────────────────────────────────────────────
    players.length>0&&h(TpTurnBar,{
      players:players,order:order,setOrder:setOrder,
      onToggleActed:function(id){updPlayer(id,{acted:!(players.find(function(p){return p.id===id;})||{}).acted});},
    }),

    // TC-08: Edit card modal
        heroCard&&h(TpHeroModal,{
      card:heroCard,
      campId:campId,
      onClose:function(){
        setHeroCard(null);
        if(tableSync&&tableSync.role==='gm'&&tableSync.connected)
          tableSync.ws.send(JSON.stringify({type:'card_collapse'}));
      },
    }),
    editingCard&&(function(){
      var card=pinnedCards.find(function(c){return c.id===editingCard;});
      var ex=extras[editingCard]||{};
      var curTitle=ex.title!=null?ex.title:(card?card.title:'');
      var curNotes=ex.notes||'';
      return h('div',{
        style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',zIndex:500,
          display:'flex',alignItems:'center',justifyContent:'center',padding:16},
        onClick:function(){setEditingCard(null);},
      },
        h('div',{
          style:{background:'var(--panel-raised)',border:'1px solid var(--border)',
            borderRadius:10,padding:18,width:'min(420px,90vw)',
            display:'flex',flexDirection:'column',gap:10},
          onClick:function(e){e.stopPropagation();},
        },
          h('div',{style:{fontSize:12,fontWeight:700,color:'var(--text-muted)',
            textTransform:'uppercase',letterSpacing:'.06em'}},'Edit Card'),
          h('input',{type:'text',value:curTitle,placeholder:'Card title',
            autoFocus:true,
            style:{width:'100%',background:'var(--inset)',border:'1px solid var(--border)',
              borderRadius:6,padding:'7px 10px',fontSize:13,color:'var(--text)',
              fontFamily:'var(--font-ui)',outline:'none'},
            onChange:function(e){updExtra(editingCard,{title:e.target.value});},
          }),
          h('textarea',{value:curNotes,placeholder:'Notes (shown on card)',rows:4,
            style:{width:'100%',background:'var(--inset)',border:'1px solid var(--border)',
              borderRadius:6,padding:'7px 10px',fontSize:12,color:'var(--text)',
              fontFamily:'var(--font-ui)',outline:'none',resize:'vertical'},
            onChange:function(e){updExtra(editingCard,{notes:e.target.value});},
          }),
          h('div',{style:{display:'flex',justifyContent:'flex-end',gap:8}},
            h('button',{className:'btn btn-ghost',
              onClick:function(){setEditingCard(null);},style:{fontSize:12}},'Cancel'),
            h('button',{className:'btn',
              onClick:function(){setEditingCard(null);if(showToast)showToast('Card updated');},
              style:{fontSize:12,background:'var(--accent)',color:'var(--bg)',border:'none'}
            },'Save')
          )
        )
      );
    })()
  );
}