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
    h(FDId, {name: 'Quick Adventure Start', type: 'Seed'}),
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
      h('span', {className: 'chain-roll-label'}, 'Related'),
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
        h('button', {onClick: function() { setScoreA(0); setScoreB(0); if (props.onUpdate) props.onUpdate({scoreA:0,scoreB:0,WIN:WIN}); }, style: {marginTop:6,background:'none',border:'none',cursor:'pointer',fontSize:11,color:'var(--text-muted)',fontFamily:'var(--font-ui)'}}, '↩ Reset')
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
      h('span', {className: 'chain-roll-label'}, 'Related'),
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
