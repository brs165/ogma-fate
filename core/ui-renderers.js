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
    h(FDId, {name: 'Adventure Seed', type: 'Seed'}),
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
    case 'pc':           return h(MajorResult,          {data: {name: data.name, aspects: {high_concept: data.aspects&&data.aspects.high_concept, trouble: data.aspects&&data.aspects.trouble, others: [data.aspects&&data.aspects.other1, data.aspects&&data.aspects.other2, data.aspects&&data.aspects.other3].filter(Boolean)}, skills: data.skills, stunts: data.stunts, physical_stress: data.physical_stress, mental_stress: data.mental_stress, refresh: data.refresh}, onUpdate: up, stunts: stunts, onChainRoll: chain});
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
  pc:          {label:'Player Character', icon:'☆', spine:'npc', color:'var(--c-blue)'},
  backstory:   {label:'Backstory',  icon:'📖',spine:'gm', color:'var(--text-muted)'},
  obstacle:    {label:'Obstacle',   icon:'🛡', spine:'mechanic', color:'var(--c-purple)'},
  countdown:   {label:'Countdown',  icon:'⏱', spine:'countdown', color:'var(--accent)'},
  constraint:  {label:'Constraint', icon:'🔒',spine:'mechanic', color:'var(--c-purple)'},
};


// ════════════════════════════════════════════════════════════════════════
// CARD RENDERER v4 — Ogma Card Format
// A2  Flip: pure opacity fade + state swap. Zero 3D transforms.
// A1  All text >= 11px
// A3  textMuted >= 4.6:1 contrast in both themes
// A4  role="button", tabIndex, aria-label, aria-pressed, onKeyDown
// A5  :focus-visible ring injected once on mount
// A6  prefers-reduced-motion: instant swap, no animation
// ════════════════════════════════════════════════════════════════════════

var CV4_CAT = {
  character: { color: 'var(--c-blue,#60a5fa)'    },
  world:     { color: 'var(--gold,#fbbf24)'        },
  mechanics: { color: 'var(--c-red,#f87171)'       },
  tool:      { color: 'var(--c-purple,#a78bfa)'    },
  pressure:  { color: 'var(--c-green,#34d399)'     },
  custom:    { color: 'var(--text-muted,#888)'      },
};

var CV4_META = {
  npc_minor:    { cat: 'character', icon: '\u25c8' },
  npc_major:    { cat: 'character', icon: '\u25c6' },
  faction:      { cat: 'character', icon: '\u2691'  },
  scene:        { cat: 'world',     icon: '\u25c9'  },
  campaign:     { cat: 'world',     icon: '\u2736'  },
  encounter:    { cat: 'world',     icon: '\u2694'  },
  seed:         { cat: 'world',     icon: '\u2295'  },
  compel:       { cat: 'mechanics', icon: '\u21a9'  },
  challenge:    { cat: 'mechanics', icon: '\u2299'  },
  contest:      { cat: 'mechanics', icon: '\u21cc'  },
  consequence:  { cat: 'mechanics', icon: '\u2b21'  },
  complication: { cat: 'tool',      icon: '\u26a1'  },
  pc:           { cat: 'character', icon: '\u2606'  },
  backstory:    { cat: 'tool',      icon: '\u25d1'  },
  obstacle:     { cat: 'pressure',  icon: '\u25b2'  },
  countdown:    { cat: 'pressure',  icon: '\u23f3'  },
  constraint:   { cat: 'pressure',  icon: '\u2298'  },
  custom:       { cat: 'custom',    icon: '\u270e'  },
};

var CV4_HELP = {
  npc_minor: {
    what: 'A supporting character with one aspect, one peak skill, and one stress box.',
    when: 'Shopkeepers, witnesses, bystanders \u2014 anyone who has one scene and a name.',
    rule: 'No consequences \u2014 one solid hit takes them out. Use the aspect as a compel hook immediately. Never give a minor NPC a second stress box by mistake; that turns them into a major NPC.',
    invoke: 'A PC with Athletics needs to leap a rooftop. The guard\u2019s aspect is \u201cAlways Watching the Exits\u201d. Invoke it as an obstacle \u2014 they spotted the PC\u2019s route, adding passive opposition.',
    compel: 'The informant\u2019s weakness is \u201cDesperate for Coin\u201d. Compel it: someone offers them money mid-scene and they hesitate just long enough to blow the party\u2019s cover.',
  },
  npc_major: {
    what: 'A full character: skill pyramid, stunts, dual stress tracks, and a complete aspect suite.',
    when: 'Recurring antagonists, key allies, anyone who survives a conflict and returns.',
    rule: 'Refresh = free invokes they can spend against the party. High Concept and Trouble are the most compellable aspects. Consequence recovery requires a treatment roll before timing starts.',
    invoke: 'The warlord\u2019s High Concept is \u201cFeared Across Three Territories\u201d. Invoke it on a Provoke roll to intimidate the PC into backing down without combat \u2014 +2 or a reroll.',
    compel: 'The same warlord\u2019s Trouble is \u201cI Never Forgive a Debt\u201d. Compel it when a PC who once helped them asks a favour \u2014 the warlord has to honour it, even when it costs them.',
  },
  faction: {
    what: 'An organisation with a goal, method, structural weakness, and a human face.',
    when: 'Between sessions or when players ask who is behind something.',
    rule: 'Goal + Method = two sides of one faction aspect. The Face is the person the PCs deal with. The Weakness is how the faction can be disrupted without direct confrontation.',
    invoke: 'The faction\u2019s aspect is \u201cResources Flow Upward, Never Down\u201d. Invoke it when they bribe a checkpoint: the bribe gets through because the faction\u2019s money is everywhere.',
    compel: 'The same faction aspect means a local chapter is starved of supplies. Compel it: a faction lieutenant asks the PCs to help, because they can\u2019t ask headquarters without losing face.',
  },
  scene: {
    what: 'Situation aspects and zones that make a location mechanically and dramatically alive.',
    when: 'Before any scene where action is likely. Use framing questions to decide if the scene is worth playing.',
    rule: 'Scene aspects last until the fiction changes them. Free invokes reset each scene. Zones control movement.',
    invoke: 'The scene aspect is \u201cChoking Dust Storm Closing In\u201d. A PC uses its free invoke on a Notice roll to spot the enemy before visibility drops to zero.',
    compel: 'The same aspect: compel it mid-fight to cut off a PC\u2019s escape route. The storm arrived early and the exit zone is now impassable \u2014 here\u2019s a Fate point.',
  },
  campaign: {
    what: 'A current issue, an impending threat, and setting aspects defining what kind of world this is.',
    when: 'Session zero, between arcs, or when the table needs a shared frame to pull against.',
    rule: 'Current issue = what is already on fire. Impending = what happens if they do not act. Both are aspects. Use them every session or they disappear.',
    invoke: 'The current issue is \u201cThe Water Rights War Is Already Being Fought\u201d. Invoke it when the PCs need to explain why every faction is armed \u2014 free narrative permission.',
    compel: 'The impending issue is \u201cThe Rail Company Arrives in Sixty Days\u201d. Compel it: the company\u2019s advance scouts are already in town, asking questions, and they\u2019ve noticed the PCs.',
  },
  encounter: {
    what: 'A full conflict setup: opposition, zones, stakes, twist, and starting GM fate points.',
    when: 'Any scene with direct opposition. The twist fires mid-conflict, not in the first exchange.',
    rule: 'GM starts with 1 FP per PC. Always state victory and defeat conditions before the first roll. The twist is optional.',
    invoke: 'Spend a GM fate point to invoke the encounter aspect \u201cNarrow Corridors, No Flanking\u201d against a PC\u2019s Fight attack: the tight space negates their advantage.',
    compel: 'A PC\u2019s trouble is relevant: they\u2019re \u201cKnown in Every Town\u201d. Compel it \u2014 a guard recognises them the moment they walk in and sounds the alarm.',
  },
  seed: {
    what: 'A 3-scene skeleton: opening, complication, climax. Drop-in ready for one session.',
    when: 'Session prep, unexpected cancellations, or when you need something playable in minutes.',
    rule: 'Do not add more scenes. The constraint is the design.',
    invoke: 'The seed\u2019s situation aspect is \u201cOld Debts Come Due Tonight\u201d. Invoke it in the opening scene to establish why the NPC called the PCs specifically \u2014 free context, no roll needed.',
    compel: 'The same aspect in the climax: compel a PC whose trouble relates to owing favours. They can\u2019t refuse the call for help, even though they know it\u2019s a trap.',
  },
  compel: {
    what: 'A situation where an aspect makes things worse in exchange for a Fate point.',
    when: 'When a player aspect is relevant and making life harder would be more interesting.',
    rule: 'Event compels happen to the character. Decision compels require a hard choice. Player refuses by spending 1 FP.',
    invoke: 'Not applicable \u2014 a Compel is itself the activation of an aspect. If a player refuses, that costs them 1 FP. The GM gains nothing from invoking vs. compelling the same aspect.',
    compel: 'A PC\u2019s trouble is \u201cI Always Finish What I Start\u201d. Event compel: the building is on fire and the target escaped, but the evidence is still inside. Here\u2019s a Fate point \u2014 do you go in?',
  },
  challenge: {
    what: 'A series of overcome rolls where each result matters and changes the fiction.',
    when: 'Extended tasks where failure at multiple stages has independent consequences.',
    rule: 'Each roll succeeds, fails, or ties independently. Declare all stakes before the first roll.',
    invoke: 'A PC rolls Crafts to repair the transmitter mid-challenge. Invoke the scene aspect \u201cPartially Flooded Engine Room\u201d for +2 on a creative approach: standing water conducts the signal.',
    compel: 'Mid-challenge, a PC\u2019s High Concept \u201cSelf-Taught Mechanic\u201d gets compelled: the procedure requires training they don\u2019t have. They can solve it \u2014 but it will take an extra roll and a cost.',
  },
  contest: {
    what: 'Two sides competing for a goal, not fighting, but racing, arguing, or outmanoeuvring.',
    when: 'Chases, debates, political manoeuvring, escape sequences.',
    rule: 'Both sides roll every exchange. Three victories wins (default). Ties add a twist. The loser earns a Fate point.',
    invoke: 'A PC is one victory from winning the debate. Invoke their aspect \u201cI\u2019ve Read Every Document in This Archive\u201d for +2 on the final Academics roll.',
    compel: 'The PC is ahead in a footchase but their trouble is \u201cI Never Leave Anyone Behind\u201d. Compel it: an ally just tripped. Do they keep running or stop? Here\u2019s a Fate point.',
  },
  consequence: {
    what: 'An aspect a character takes to absorb a hit instead of being taken out.',
    when: 'When stress will not cover the overflow and the player wants to stay in the scene.',
    rule: 'Mild = 2 shifts. Moderate = 4. Severe = 6. Recovery needs a treatment overcome roll first.',
    invoke: 'The PC took a Mild consequence: \u201cKnocked Around\u201d. In the next scene, an enemy invokes it for +2 on a Provoke roll \u2014 battered people are easier to intimidate.',
    compel: 'Same consequence: compel it when the PC tries to climb a wall. \u201cYou\u2019re knocked around \u2014 the GM offers a Fate point. You can make the climb but you\u2019ll worsen the injury.\u201d',
  },
  complication: {
    what: 'A new aspect that enters the scene and makes everything harder.',
    when: 'End of a scene that resolved cleanly, or when a scene needs a second wind.',
    rule: 'Complications arrive with at least one free invoke. Remove them only when the fiction justifies it.',
    invoke: 'The complication \u201cReinforcements Called In\u201d arrives with one free invoke. Use it on the new NPCs\u2019 first action in the exchange \u2014 they arrived coordinated and ready.',
    compel: 'The complication is \u201cThe Safe House Is Compromised\u201d. Compel it when a PC tries to retreat there: they arrive and walk straight into an ambush. Fate point offered.',
  },
  pc: {
    what: 'A complete Fate Condensed player character: 5 aspects, full skill pyramid, 3 stunts, stress tracks, and session zero questions.',
    when: 'Session zero, one-shots, or when a player needs an instant character. Generate 3\u20134, let players pick and customise.',
    rule: 'Skill pyramid: 1\u00d7+4, 2\u00d7+3, 3\u00d7+2, 4\u00d7+1. Refresh 3 with 3 free stunts. Physique/Will determine stress track length. All 3 consequence slots always open at creation.',
    invoke: 'A PC\u2019s High Concept is \u201cVault-Born Archivist on First Surface Mission\u201d. Invoke it when they recall pre-war technical schematics \u2014 +2 on Lore, and the fiction earns it.',
    compel: 'The same PC\u2019s Trouble is \u201cThe Map In My Head Has Never Been Wrong Before\u201d. Compel it when the map is wrong: they trusted it too long and now they\u2019re deep in hostile territory.',
  },
  backstory: {
    what: 'Targeted questions that build a character history and create hooks into the campaign.',
    when: 'Session zero, or when a new player joins and needs weaving into the party.',
    rule: 'Every answer should name another PC or NPC and leave something unresolved. Hooks are invitations, never mandates.',
    invoke: 'A backstory established that the PC \u201cOwes the Settlement That Patched Them Up\u201d. Turn it into an aspect and invoke it when the settlement sends a messenger \u2014 the PC\u2019s history opens a door.',
    compel: 'The same aspect: compel it when the settlement asks for something dangerous. \u201cYou owe them. Here\u2019s a Fate point if you agree even though it\u2019s a terrible idea.\u201d',
  },
  obstacle: {
    what: 'A passive threat that opposes the party without taking an action each exchange.',
    when: 'Environmental dangers, barriers, conditions. Anything that resists without acting in the conflict.',
    rule: 'Obstacles do not act in a conflict. Passive opposition = their rating. Disable by overcoming at rating + 2.',
    invoke: 'The obstacle aspect is \u201cFloodwater Rising Fast\u201d. Invoke it against a PC\u2019s Athletics roll to cross: the water\u2019s current is now actively opposing them, not just a difficulty number.',
    compel: 'The same obstacle: compel a PC whose trouble is \u201cI Can\u2019t Leave Anyone Behind\u201d. The water is rising and someone\u2019s stuck. Do they go back? Fate point on the table.',
  },
  countdown: {
    what: 'A ticking clock that creates urgency without requiring direct opposition.',
    when: 'Whenever players risk losing momentum, or a threat has a natural deadline.',
    rule: 'Fill one box per trigger. The last box fires the outcome, no roll, no negotiation. Show the track openly.',
    invoke: 'The countdown aspect is \u201cThe Convoy Reaches the Border in Four Hours\u201d. Invoke it when a PC is stalling \u2014 it\u2019s a reminder the clock is an aspect with mechanical weight.',
    compel: 'Two boxes left. Compel a PC\u2019s trouble to fill one now: their impulsive action triggered the next stage early. Fate point, and the clock ticks forward.',
  },
  constraint: {
    what: 'A limitation that forces the party to change their approach rather than roll higher.',
    when: 'When the obvious solution is too easy, or a scene needs tactical texture without more enemies.',
    rule: 'Constraints do not deal stress, they change the rules. Bypass requires specific fiction, not a high roll.',
    invoke: 'The constraint is \u201cNo Weapons Inside the Negotiation Chamber\u201d. Invoke it on a Contacts roll to establish that a PC has a contact who can smuggle one in \u2014 using the rule as the hook.',
    compel: 'Same constraint. A PC goes for their weapon anyway \u2014 compel their impulsive trouble. Guards move. The room goes hostile. Fate point, and the negotiation just became a conflict.',
  },
  custom: {
    what: 'A blank card you fill in yourself \u2014 title, type, and notes all editable in place.',
    when: 'Any time the generators produce something close but not quite right, or you need to capture an improvised NPC, location, aspect, or clue right now.',
    rule: 'Click the title or notes to edit. Tap the type pill to cycle: Aspect \u2192 NPC \u2192 Location \u2192 Clue \u2192 Other. The type tints the card accent colour for quick visual scanning. Send to Table works normally.',
    invoke: 'You improvised an NPC mid-scene and named them. Create a custom card with type NPC, write their aspect and peak skill in the notes. Now it\u2019s a real card you can send to the table and invoke from.',
    compel: 'You noted a location detail as a custom Aspect card: \u201cThe Chandelier Is Hanging by One Chain.\u201d Compel it against the most reckless PC \u2014 they notice it, and they have an idea.',
  },
};



var CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

function cv4UseReducedMotion() {
  var _r = useState(function() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e) { return false; }
  });
  var reduced = _r[0]; var setReduced = _r[1];
  useEffect(function() {
    try {
      var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      function onMQ(e) { setReduced(e.matches); }
      mq.addEventListener('change', onMQ);
      return function() { mq.removeEventListener('change', onMQ); };
    } catch(e) {}
  }, []);
  return reduced;
}

var cv4StyleInjected = false;
function cv4InjectStyles() {
  if (cv4StyleInjected) return;
  cv4StyleInjected = true;
  try {
    if (document.getElementById('ogma-cv4-styles')) return;
    var s = document.createElement('style');
    s.id = 'ogma-cv4-styles';
    s.textContent = [
      '.fd-card{transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s ease,border-color .15s}',
      '@keyframes fd-stamp-in{from{opacity:0;transform:scale(.95) rotate(-.4deg)}to{opacity:1;transform:none}}',
      '@keyframes fd-box-stamp{from{transform:scale(1.4)}to{transform:none}}',
      '@keyframes fd-clock-tick{from{transform:scaleY(.7)}to{transform:none}}',
      '@keyframes cv4pulse{0%,100%{opacity:1}50%{opacity:.4}}',
      '@keyframes fadeDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}'
    ].join('');
    document.head.appendChild(s);
  } catch(e) {}
}
var CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
var CV4_BODY = "system-ui,-apple-system,sans-serif";

// ── Field Dispatch cv4 helpers ────────────────────────────────────────────

function cv4Lbl(label, color) {
  return h('div', {style:{
    fontSize:10, fontWeight:800, letterSpacing:'0.22em', color:color||'var(--text-muted)',
    fontFamily:CV4_MONO, textTransform:'uppercase', marginBottom:4, lineHeight:1
  }}, label);
}

function cv4Tag(text, color) {
  return h('span', {style:{
    fontSize:10, fontWeight:800, letterSpacing:'0.12em', color:color,
    border:'1.5px solid '+color+'66', borderRadius:2, padding:'2px 6px',
    marginRight:4, whiteSpace:'nowrap', display:'inline-block',
    fontFamily:CV4_MONO
  }}, text);
}

function cv4Pip(color, size) {
  size = size || 10;
  return h('div', {style:{width:size, height:size, border:'1.5px solid '+color, borderRadius:1, flexShrink:0}});
}

function cv4SPill(name, r) {
  var c = r >= 4 ? 'var(--c-red,#E06060)' : r >= 3 ? 'var(--gold,#C8A050)' : r >= 2 ? 'var(--c-blue,#5AC8FA)' : 'var(--text-muted)';
  return h('div', {style:{display:'flex', alignItems:'center', gap:5}},
    h('div', {style:{
      fontSize:11, fontWeight:800, color:'var(--cv-card-dark,#1A1610)', background:c,
      fontFamily:CV4_MONO, lineHeight:1, minWidth:26, textAlign:'center',
      padding:'2px 5px', borderRadius:2
    }}, '+'+r),
    h('div', {style:{fontSize:12, color:'var(--cv-card-text-dim)', fontFamily:CV4_SANS, fontStyle:'italic'}}, name)
  );
}

function cv4Inset(children, sx) {
  return h('div', {style:Object.assign({
    padding:'7px 10px',
    background:'var(--inset)',
    border:'1px solid var(--cv-card-bdr,var(--border))',
    borderRadius:2
  }, sx||{})}, children);
}

function cv4Accent(children, color, sx) {
  return h('div', {style:Object.assign({
    padding:'7px 10px',
    background:'color-mix(in srgb,'+color+' 8%,var(--cv-card-dark,var(--panel)))',
    border:'1px solid '+color+'33',
    borderLeft:'3px solid '+color,
    borderRadius:'0 2px 2px 0'
  }, sx||{})}, children);
}

function cv4StressTrack(label, hits, setHits, color) {
  return h('div', null,
    cv4Lbl(label, color),
    h('div', {style:{display:'flex', gap:4, flexWrap:'wrap'}},
      hits.map(function(v, i) {
        return h('div', {
          key:i,
          role:'checkbox',
          tabIndex:0,
          'aria-checked':String(!!v),
          'aria-label':label+' stress box '+(i+1)+(v?' (marked)':' (clear)'),
          onClick:function(e){
            e.stopPropagation();
            var a=hits.slice(); a[i]=!a[i]; setHits(a);
          },
          onKeyDown:function(e){
            if(e.key===' '||e.key==='Enter'){
              e.preventDefault();
              var a=hits.slice(); a[i]=!a[i]; setHits(a);
            }
          },
          style:{
            width:18, height:18, borderRadius:2,
            border:'2px solid '+color,
            background:v?color:'transparent',
            cursor:'pointer', flexShrink:0,
            transition:'all 0.12s cubic-bezier(0.34,1.56,0.64,1)',
            position:'relative',
            animation:v?'fd-box-stamp 0.2s cubic-bezier(0.34,1.56,0.64,1)':'none',
          },
        },
          v&&h('span',{style:{
            position:'absolute', inset:0, display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:10, fontWeight:800,
            color:'var(--cv-card-dark,#1A1610)', lineHeight:1, pointerEvents:'none',
            fontFamily:CV4_MONO
          }},'\u2715')
        );
      })
    )
  );
}

function cv4Clock(boxes, filled, setFilled, color) {
  var full = filled >= boxes;
  return h('div', null,
    cv4Lbl('CLOCK \u2014 '+boxes+' BOXES'+(full?' \u2014 TRIGGERED!':''), full?'var(--c-red,#E06060)':color),
    h('div', {style:{display:'flex', gap:5, flexWrap:'wrap', marginBottom:4}},
      Array.from({length:boxes}).map(function(_,i) {
        var ticked = i < filled;
        return h('div', {
          key:i,
          role:'checkbox',
          tabIndex:0,
          'aria-checked':String(ticked),
          'aria-label':'Clock box '+(i+1)+(ticked?' (ticked)':' (empty)'),
          onClick:function(e){e.stopPropagation();setFilled(ticked?i:i+1);},
          onKeyDown:function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();setFilled(ticked?i:i+1);}},
          style:{
            width:28, height:28, borderRadius:2, cursor:'pointer',
            border:'2px solid '+(full?'var(--c-red,#E06060)':color),
            background:ticked
              ?'color-mix(in srgb,'+(full?'var(--c-red,#E06060)':color)+' 35%,var(--cv-card-dark,#1A1610))'
              :'transparent',
            transition:'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
            display:'flex', alignItems:'center', justifyContent:'center',
            animation:ticked?'fd-clock-tick 0.2s cubic-bezier(0.34,1.56,0.64,1)':'none',
          },
        },
          ticked&&h('span',{style:{
            fontSize:12, fontWeight:800,
            color:full?'var(--c-red,#E06060)':color,
            pointerEvents:'none', fontFamily:CV4_MONO
          }},'\u2713')
        );
      })
    ),
    full&&h('div',{style:{
      fontSize:11, fontWeight:800, color:'var(--c-red,#E06060)', fontFamily:CV4_MONO,
      letterSpacing:'0.18em', animation:'cv4pulse 0.6s ease-in-out infinite'
    }},'\u26a1 CLOCK FULL \u2014 TRIGGER NOW')
  );
}

function cv4Body(left, right, rightWidth) {
  // Field Dispatch: left column + optional right data column
  return h('div', {style:{flex:1, padding:'12px 16px 14px', display:'flex', gap:14}},
    h('div', {style:{flex:1, display:'flex', flexDirection:'column', gap:8, minWidth:0}}, left),
    right && h('div', {style:{width:rightWidth||144, flexShrink:0, display:'flex', flexDirection:'column', gap:8}}, right)
  );
}

// ── cv4BackPanel — GM guidance inline footer ───────────────────────────────
function cv4BackPanel(genId, catColor) {
  var help = CV4_HELP[genId] || {what:'',when:'',rule:'',invoke:'',compel:''};
  var accentBlue  = 'var(--c-blue,#60a5fa)';
  var accentGreen = 'var(--c-green,#4CD964)';
  return h('div', {style:{padding:'12px 16px 14px', display:'flex', flexDirection:'column', gap:10}},

    // ── What / When ──────────────────────────────────────────────────────
    h('div', {style:{display:'flex', gap:12}},
      h('div', {style:{flex:1}},
        cv4Lbl('WHAT IT GENERATES', catColor),
        h('p', {style:{margin:0, fontSize:11, color:'var(--cv-card-text-dim)', lineHeight:1.65, fontFamily:CV4_BODY}}, help.what)
      ),
      h('div', {style:{flex:1}},
        cv4Lbl('WHEN TO USE IT', catColor),
        h('p', {style:{margin:0, fontSize:11, color:'var(--cv-card-text-dim)', lineHeight:1.65, fontFamily:CV4_BODY}}, help.when)
      )
    ),

    // ── Table rule ───────────────────────────────────────────────────────
    h('div', {style:{
      padding:'8px 12px',
      background:'color-mix(in srgb,'+catColor+' 8%,var(--cv-card-dark,var(--panel)))',
      borderLeft:'3px solid '+catColor,
      borderRadius:'0 2px 2px 0'
    }},
      cv4Lbl('TABLE RULE', catColor),
      h('p', {style:{margin:0, fontSize:11, color:'var(--cv-card-text-dim)', lineHeight:1.7, fontFamily:CV4_BODY}}, help.rule)
    ),

    // ── Invoke + Compel examples ─────────────────────────────────────────
    (help.invoke || help.compel) && h('div', {style:{display:'flex', gap:8}},
      help.invoke && h('div', {style:{
        flex:1, padding:'8px 10px',
        background:'color-mix(in srgb,'+accentBlue+' 8%,var(--cv-card-dark,var(--panel)))',
        borderLeft:'3px solid '+accentBlue,
        borderRadius:'0 2px 2px 0'
      }},
        h('div', {style:{display:'flex', alignItems:'center', gap:5, marginBottom:4}},
          cv4Lbl('INVOKE', accentBlue),
          h('span', {style:{fontSize:9, color:accentBlue, fontFamily:CV4_MONO, opacity:0.7, letterSpacing:'0.1em'}}, 'EXAMPLE')
        ),
        h('p', {style:{margin:0, fontSize:11, color:'var(--cv-card-text-dim)', lineHeight:1.6, fontFamily:CV4_BODY}}, help.invoke)
      ),
      help.compel && h('div', {style:{
        flex:1, padding:'8px 10px',
        background:'color-mix(in srgb,var(--c-red,#E06060) 8%,var(--cv-card-dark,var(--panel)))',
        borderLeft:'3px solid var(--c-red,#E06060)',
        borderRadius:'0 2px 2px 0'
      }},
        h('div', {style:{display:'flex', alignItems:'center', gap:5, marginBottom:4}},
          cv4Lbl('COMPEL', 'var(--c-red,#E06060)'),
          h('span', {style:{fontSize:9, color:'var(--c-red,#E06060)', fontFamily:CV4_MONO, opacity:0.7, letterSpacing:'0.1em'}}, 'EXAMPLE')
        ),
        h('p', {style:{margin:0, fontSize:11, color:'var(--cv-card-text-dim)', lineHeight:1.6, fontFamily:CV4_BODY}}, help.compel)
      )
    )
  );
}

// ── Field Dispatch cv4Card ─────────────────────────────────────────────────
// CSS 3D flip: front = card content, back = GM guidance. Front drives height,
// back scrolls if taller. Reduced-motion: instant toggle, no transform.
function cv4Card(props) {
  var genId    = props.genId;
  var campName = props.campName || '';
  var data     = props.data || {};
  var frontFn  = props.frontFn;
  var onUpdate = props.onUpdate || null;
  var saved    = props.savedCardState || null;

  var _flipped = useState(false); var flipped = _flipped[0]; var setFlipped = _flipped[1];
  var _hov     = useState(false); var hovered = _hov[0];     var setHovered = _hov[1];
  var _vis     = useState(true);  var visible = _vis[0];     var setVisible = _vis[1];
  var reduced  = cv4UseReducedMotion();

  var phyMax = typeof data.physical_stress === 'number' ? data.physical_stress : (typeof data.stress === 'number' ? data.stress : 0);
  var menMax = typeof data.mental_stress === 'number' ? data.mental_stress : 0;
  var _st = useState(function() {
    // Restore interactive state from IDB if available, else fresh defaults
    if (saved) return Object.assign({
      phyHit: Array(phyMax).fill(false),
      menHit: Array(menMax).fill(false),
      cdFilled: 0, scoreA: 0, scoreB: 0, treated: false,
    }, saved);
    return {
      phyHit: Array(phyMax).fill(false),
      menHit: Array(menMax).fill(false),
      cdFilled: 0,
      scoreA: 0, scoreB: 0,
      treated: false,
    };
  });
  var cardState = _st[0]; var setCardState = _st[1];

  function updState(patch) {
    setCardState(function(s) {
      var next = Object.assign({}, s, patch);
      if (onUpdate) onUpdate(next);
      return next;
    });
  }

  var meta = CV4_META[genId] || {cat:'mechanics', icon:'\u25c8'};
  var cat  = CV4_CAT[meta.cat] || CV4_CAT.mechanics;
  var catColor = cat.color;

  useEffect(function() { cv4InjectStyles(); }, []);

  // Entry fade
  useEffect(function() {
    if (reduced) return;
    setVisible(false);
    var t = setTimeout(function() { setVisible(true); }, 30);
    return function() { clearTimeout(t); };
  }, [genId, data]);

  var genLabel = genId.replace(/_/g, ' ').toUpperCase();
  var ariaLabel = genLabel + ' card' + (campName ? ' from ' + campName : '');

  // Shared stamp band
  function stampBand() {
    return h('div', {style:{height: 5, background: catColor, flexShrink: 0}});
  }

  // Shared header
  function cardHeader(label) {
    return h('div', {style:{
      height: 34, flexShrink: 0,
      borderBottom: '1px solid ' + catColor + '33',
      display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8,
      background: 'color-mix(in srgb,'+catColor+' 6%,var(--cv-card-dark,var(--panel)))',
    }},
      h('span', {style:{fontSize:14, color:catColor, lineHeight:1, flexShrink:0}}, meta.icon),
      h('span', {style:{
        fontSize:10, fontWeight:800, letterSpacing:'0.22em', color:catColor,
        fontFamily:CV4_MONO, textTransform:'uppercase'
      }}, label),
      h('div', {style:{flex:1}}),
      campName && h('span', {style:{
        fontSize:10, color:'var(--cv-card-text-muted)', fontFamily:CV4_MONO,
        letterSpacing:'0.08em', fontStyle:'italic'
      }}, campName)
    );
  }

  // Flip trigger button
  function flipBtn(label, chevron) {
    return h('button', {
      onClick: function(e){ e.stopPropagation(); setFlipped(function(v){return !v;}); },
      onKeyDown: function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();setFlipped(function(v){return !v;});} },
      'aria-label': flipped ? 'Show card front' : 'Show GM guidance',
      style:{
        width:'100%', height:28, background:'transparent', border:'none',
        borderTop: '1px solid ' + catColor + '22',
        cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
        gap:6, fontFamily:CV4_MONO, fontSize:10, fontWeight:700, letterSpacing:'0.18em',
        color: catColor,
        textTransform:'uppercase',
      },
    }, h('span', {style:{fontSize:10, lineHeight:1}}, chevron), label);
  }

  return h('div', {
    className: 'cv4-flip-container',
    role: 'region',
    'aria-label': ariaLabel,
    onMouseEnter: function() { setHovered(true); },
    onMouseLeave: function() { setHovered(false); },
    style: {
      perspective: reduced ? 'none' : '1000px',
      animation: reduced ? 'none' : 'fd-stamp-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
      opacity: visible ? 1 : 0,
    },
  },
    h('div', {
      className: 'cv4-flipper' + (flipped ? ' cv4-flipped' : ''),
      style: {
        position: 'relative',
        transformStyle: reduced ? 'flat' : 'preserve-3d',
        transition: reduced ? 'none' : 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
        transform: flipped ? (reduced ? 'none' : 'rotateY(180deg)') : 'none',
      },
    },
      // ── FRONT ─────────────────────────────────────────────────────────
      h('div', {
        className: 'cv4-face cv4-front fd-card',
        style: {
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          background: 'var(--cv-card-dark,var(--panel))',
          border: '1px solid ' + (hovered ? catColor + 'AA' : 'var(--cv-card-bdr,var(--border))'),
          borderRadius: 3,
          overflow: 'hidden',
          display: reduced && flipped ? 'none' : 'flex',
          flexDirection: 'column',
          boxShadow: hovered
            ? '5px 7px 0 rgba(0,0,0,0.18), 0 0 0 1px ' + catColor + '44'
            : '3px 3px 0 rgba(0,0,0,0.18)',
          transform: hovered && !flipped ? 'translateY(-3px) rotate(0.25deg)' : 'none',
          transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, border-color 0.15s',
        },
      },
        stampBand(),
        cardHeader(genLabel),
        h('div', {style:{flexShrink:0}},
          frontFn(genId, data, campName, catColor, {state:cardState, upd:updState, phyMax:phyMax, menMax:menMax, onUpdate:onUpdate})
        ),
        flipBtn('Tap for GM Guidance', '\u25ba')
      ),
      // ── BACK ──────────────────────────────────────────────────────────
      h('div', {
        className: 'cv4-face cv4-back',
        style: {
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: reduced ? 'none' : 'rotateY(180deg)',
          position: reduced ? 'relative' : 'absolute',
          top: 0, left: 0, right: 0,
          minHeight: '100%',
          background: 'var(--cv-card-dark,var(--panel))',
          border: '1px solid ' + (hovered ? catColor + 'AA' : 'var(--cv-card-bdr,var(--border))'),
          borderRadius: 3,
          overflow: 'hidden',
          display: reduced && !flipped ? 'none' : 'flex',
          flexDirection: 'column',
          boxShadow: hovered
            ? '5px 7px 0 rgba(0,0,0,0.18), 0 0 0 1px ' + catColor + '44'
            : '3px 3px 0 rgba(0,0,0,0.18)',
        },
      },
        stampBand(),
        cardHeader('GM GUIDANCE'),
        h('div', {style:{flex:1, overflowY:'auto', maxHeight:400}},
          cv4BackPanel(genId, catColor)
        ),
        flipBtn('Tap for Card Details', '\u25c0')
      )
    )
  );
}


function cv4FrontNpcMinor(genId, d, campName, catColor, ctx) {
  var aspects = Array.isArray(d.aspects) ? d.aspects : [];
  var skills  = Array.isArray(d.skills)  ? d.skills  : [];
  var stunt   = d.stunt || null;
  var stress  = d.stress || 1;
  var hits    = ctx ? ctx.state.phyHit : Array(stress).fill(false);
  function setHits(a) { if (ctx) ctx.upd({phyHit:a}); }
  return cv4Body([
    h('div',{style:{fontSize:17,fontWeight:800,color:'var(--text)',fontFamily:CV4_MONO,lineHeight:1.1,letterSpacing:'-0.02em'}},d.name||''),
    aspects.map(function(a,i){return h('div',{key:i,style:{padding:'4px 9px',borderRadius:4,fontSize:11,fontStyle:'italic',fontFamily:CV4_SANS,background:i===0?'color-mix(in srgb,'+catColor+' 12%,var(--inset))':'var(--inset)',border:'1px solid '+(i===0?catColor+'66':'var(--border)'),color:i===0?catColor:'var(--text-dim)',fontWeight:i===0?600:400}},i===0&&h('span',{style:{fontSize:10,fontWeight:800,fontStyle:'normal',letterSpacing:'0.15em',marginRight:5,fontFamily:CV4_MONO,color:catColor}},'HC '),a);}),
    stunt&&cv4Inset([h('span',{style:{fontSize:11,fontWeight:700,color:catColor,fontFamily:CV4_SANS}},stunt.name+': '),h('span',{style:{fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS}},stunt.desc||'')])
  ],[
    skills.length>0&&h('div',null,cv4Lbl('SKILLS',catColor),
      h('div',{style:{display:'flex',flexDirection:'column',gap:3}},
        skills.map(function(s,i){return h('div',{key:i},cv4SPill(s.name,s.r));})
      )
    ),
    cv4StressTrack('STRESS', hits.length ? hits : Array(stress).fill(false), setHits, catColor),
    cv4Inset([h('div',{style:{fontSize:11,color:'var(--text-muted)',fontFamily:CV4_SANS,lineHeight:1.5}},'No consequences'),h('div',{style:{fontSize:11,color:'var(--text-muted)',fontFamily:CV4_SANS}},'One hit = out')])
  ],114);
}

function cv4FrontNpcMajor(genId, d, campName, catColor, ctx) {
  var asp=d.aspects||{}; var skills=Array.isArray(d.skills)?d.skills:[]; var stunts=Array.isArray(d.stunts)?d.stunts:[];
  var others=Array.isArray(asp.others)?asp.others:[];
  var phyHits = ctx ? ctx.state.phyHit : Array(d.physical_stress||3).fill(false);
  var menHits = ctx ? ctx.state.menHit : Array(d.mental_stress||3).fill(false);
  function setPhy(a) { if (ctx) ctx.upd({phyHit:a}); }
  function setMen(a) { if (ctx) ctx.upd({menHit:a}); }
  return cv4Body([
    h('div',{style:{fontSize:15,fontWeight:800,color:'var(--text)',fontFamily:CV4_MONO,lineHeight:1.1,letterSpacing:'-0.02em'}},d.name||''),
    asp.high_concept&&h('div',{style:{padding:'4px 9px',background:'color-mix(in srgb,'+catColor+' 12%,var(--inset))',border:'1px solid '+catColor+'55',borderRadius:4,fontSize:11,color:catColor,fontStyle:'italic',fontFamily:CV4_SANS,fontWeight:600}},h('span',{style:{fontSize:10,fontWeight:800,fontStyle:'normal',letterSpacing:'0.15em',marginRight:5,fontFamily:CV4_MONO}},'HC '),asp.high_concept),
    asp.trouble&&h('div',{style:{padding:'4px 9px',background:'color-mix(in srgb,var(--c-red,#f87171) 10%,var(--inset))',border:'1px solid rgba(248,113,113,0.33)',borderRadius:4,fontSize:11,color:'var(--text-dim)',fontStyle:'italic',fontFamily:CV4_SANS}},h('span',{style:{fontSize:10,fontWeight:800,fontStyle:'normal',letterSpacing:'0.15em',marginRight:5,fontFamily:CV4_MONO,color:'var(--c-red,#f87171)'}},'TR '),asp.trouble),
    others.length>0&&h('div',{style:{display:'flex',flexDirection:'column',gap:3}},
      others.map(function(a,i){return h('div',{key:i,style:{padding:'3px 9px',borderRadius:4,fontSize:11,fontStyle:'italic',fontFamily:CV4_SANS,background:'var(--inset)',border:'1px solid var(--border)',color:'var(--text-dim)'}},a);})
    ),
    stunts.length>0&&h('div',{style:{display:'flex',flexDirection:'column',gap:4}},
      stunts.map(function(s,i){return h('div',{key:i,style:{padding:'4px 8px',background:'var(--inset)',border:'1px solid var(--border)',borderLeft:'2px solid '+catColor,borderRadius:'0 4px 4px 0'}},
        h('span',{style:{fontSize:11,fontWeight:700,color:catColor,fontFamily:CV4_SANS}},s.name+(s.skill?' ('+s.skill+')':'')+': '),
        h('span',{style:{fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS}},s.desc||s)
      );})
    )
  ],[
    h('div',null,cv4Lbl('SKILLS',catColor),h('div',{style:{display:'flex',flexDirection:'column',gap:3}},skills.map(function(s,i){return h('div',{key:i},cv4SPill(s.name,s.r));}))),
    h('div',{style:{display:'flex',flexDirection:'column',gap:5}},
      cv4StressTrack('PHY', phyHits.length ? phyHits : Array(d.physical_stress||3).fill(false), setPhy, 'var(--gold,#fbbf24)'),
      cv4StressTrack('MEN', menHits.length ? menHits : Array(d.mental_stress||3).fill(false), setMen, 'var(--c-purple,#a78bfa)'),
      h('div',{style:{fontSize:9,color:'var(--text-muted)',fontFamily:'var(--font-ui)',lineHeight:1.3,marginTop:1,fontStyle:'italic'}},
        'Stress \u2260 HP \u2014 clears end of scene. Physique/Will \u22653 \u2192 6 boxes.'
      ),
      h('div',{style:{display:'flex',flexDirection:'column',gap:3}},
        cv4Lbl('CONSEQUENCES',catColor),
        [['Mild','var(--c-blue,#60a5fa)',2],['Moderate','var(--gold,#fbbf24)',4],['Severe','var(--c-red,#f87171)',6]].map(function(row){
          return h('div',{key:row[0],style:{display:'flex',alignItems:'center',gap:5,padding:'2px 0'}},
            h('div',{style:{width:18,height:18,borderRadius:3,border:'1.5px solid '+row[1],flexShrink:0}}),
            h('div',{style:{fontSize:10,fontWeight:700,color:row[1],fontFamily:CV4_MONO,width:54}},row[0]),
            h('div',{style:{fontSize:10,color:'var(--text-muted)',fontFamily:CV4_SANS}},row[2]+' shifts')
          );
        })
      ),
      h('div',null,cv4Lbl('REF',catColor),h('div',{style:{fontSize:20,fontWeight:800,color:'var(--text)',lineHeight:1,fontFamily:CV4_MONO}},d.refresh||3))
    )
  ],180);
}

function cv4FrontFaction(genId, d, campName, catColor) {
  var face=d.face||{}; var fn_=typeof face==='string'?face:(face.name||''); var fr=typeof face==='string'?'':(face.role||'');
  return cv4Body([
    h('div',{style:{fontSize:14,fontWeight:800,color:'var(--text)',fontFamily:CV4_MONO,lineHeight:1.15}},d.name||''),
    h('div',null,cv4Lbl('GOAL',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text)',fontFamily:CV4_SANS,lineHeight:1.45}},d.goal||'')),
    h('div',null,cv4Lbl('METHOD',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.45,fontStyle:'italic'}},d.method||'')),
    cv4Accent([cv4Lbl('WEAKNESS','var(--c-red,#f87171)'),h('p',{style:{margin:0,fontSize:11,color:'var(--c-red,#f87171)',fontFamily:CV4_SANS,lineHeight:1.35}},d.weakness||'')],'var(--c-red,#f87171)')
  ],[
    fn_&&h('div',{style:{padding:'9px 10px',background:'color-mix(in srgb,'+catColor+' 12%,var(--inset))',border:'1px solid '+catColor+'44',borderRadius:6}},cv4Lbl('THE FACE',catColor),h('div',{style:{fontSize:12,fontWeight:700,color:'var(--text)',fontFamily:CV4_SANS,marginBottom:2}},fn_),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4,fontStyle:'italic'}},fr)),
    cv4Inset([h('p',{style:{margin:0,fontSize:11,color:'var(--text-muted)',fontFamily:CV4_SANS,lineHeight:1.5}},'Goal + Method = two sides of one faction aspect')])
  ],162);
}

function cv4FrontScene(genId, d, campName, catColor) {
  var aspects=Array.isArray(d.aspects)?d.aspects:[]; var zones=Array.isArray(d.zones)?d.zones:[];
  var fqs=Array.isArray(d.framing_questions)?d.framing_questions:[];
  var cc={danger:'var(--c-red,#f87171)',cover:'var(--c-blue,#60a5fa)',tone:'var(--gold,#fbbf24)',movement:'var(--c-green,#34d399)',usable:'var(--c-purple,#a78bfa)'};
  return cv4Body([
    cv4Lbl('SCENE ASPECTS',catColor),
    aspects.map(function(a,i){var name=typeof a==='string'?a:(a.name||'');var cat_=(typeof a==='object'&&a.category)?a.category.toLowerCase():'tone';var fi=(typeof a==='object')?(a.free_invoke||a.fi):false;var acol=cc[cat_]||catColor;return h('div',{key:i,style:{display:'flex',gap:7,alignItems:'flex-start'}},cv4Tag(cat_.toUpperCase(),acol),h('div',{style:{fontSize:11,color:'var(--text)',fontFamily:CV4_SANS,fontStyle:'italic',lineHeight:1.35}},name,fi&&h('span',{style:{fontSize:10,fontWeight:700,color:'var(--c-green,#34d399)',fontStyle:'normal',marginLeft:4}},'FI')));})
  ],[
    cv4Lbl('ZONES',catColor),
    zones.slice(0,4).map(function(z,i){var zn=typeof z==='string'?z:(z.name||'');var za=typeof z==='object'?(z.aspect||''):'';var zdesc=typeof z==='object'?(z.description||''):'';return h('div',{key:i,style:{marginBottom:5,padding:'4px 8px',background:'var(--inset)',border:'1px solid var(--border)',borderLeft:'2px solid '+catColor,borderRadius:'0 4px 4px 0'}},h('div',{style:{fontSize:11,fontWeight:700,color:'var(--text)',fontFamily:CV4_SANS,lineHeight:1.2}},zn),za&&h('div',{style:{fontSize:11,color:catColor,fontStyle:'italic',fontFamily:CV4_SANS}},za),zdesc&&h('div',{style:{fontSize:10,color:'var(--text-muted)',fontFamily:CV4_SANS,lineHeight:1.3,marginTop:2}},zdesc));}),
    fqs.length>0&&h('div',null,cv4Lbl('FRAMING',catColor),
      fqs.slice(0,3).map(function(q,i){return h('p',{key:i,style:{margin:'0 0 4px',fontSize:10,color:'var(--text-muted)',fontFamily:CV4_SANS,lineHeight:1.35}},'\u2022 '+q);})
    )
  ],180);
}

function cv4FrontCampaign(genId, d, campName, catColor) {
  var cur=d.current||{}; var imp=d.impending||{};
  var curFaces=Array.isArray(cur.faces)?cur.faces:[];
  var impFaces=Array.isArray(imp.faces)?imp.faces:[];
  var setting=Array.isArray(d.setting)?d.setting:[];
  return cv4Body([
    h('div',null,cv4Lbl('CURRENT ISSUE',catColor),h('div',{style:{fontSize:12,fontWeight:700,color:'var(--text)',fontFamily:CV4_SANS,lineHeight:1.3,marginBottom:3}},cur.name||''),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.5}},cur.desc||'')),
    curFaces.length>0&&h('div',{style:{display:'flex',flexDirection:'column',gap:3}},
      curFaces.map(function(f,i){return h('div',{key:i,style:{padding:'3px 8px',background:'var(--inset)',border:'1px solid var(--border)',borderRadius:4}},
        h('span',{style:{fontSize:11,fontWeight:700,color:catColor,fontFamily:CV4_SANS}},f.name+': '),
        h('span',{style:{fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,fontStyle:'italic'}},f.role)
      );})
    ),
    cv4Accent([cv4Lbl('IMPENDING','var(--c-red,#f87171)'),
      h('div',{style:{fontSize:12,fontWeight:700,color:'var(--c-red,#f87171)',fontFamily:CV4_SANS,lineHeight:1.3,marginBottom:imp.desc?3:0}},imp.name||''),
      imp.desc&&h('p',{style:{margin:0,fontSize:11,fontStyle:'italic',color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.35}},imp.desc)
    ],'var(--c-red,#f87171)'),
    impFaces.length>0&&h('div',{style:{display:'flex',flexDirection:'column',gap:3}},
      impFaces.map(function(f,i){return h('div',{key:i,style:{padding:'3px 8px',background:'var(--inset)',border:'1px solid rgba(248,113,113,0.25)',borderRadius:4}},
        h('span',{style:{fontSize:11,fontWeight:700,color:'var(--c-red,#f87171)',fontFamily:CV4_SANS}},f.name+': '),
        h('span',{style:{fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,fontStyle:'italic'}},f.role)
      );})
    )
  ],[
    cv4Lbl('SETTING ASPECTS',catColor),
    setting.map(function(s,i){return h('p',{key:i,style:{margin:'0 0 6px',fontSize:11,fontStyle:'italic',color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4,paddingLeft:8,borderLeft:'1px solid var(--border)'}},'\u201c'+s+'\u201d');}),
    (cur.places||[]).length>0&&h('div',null,cv4Lbl('PLACES',catColor),
      (cur.places||[]).map(function(p,i){return h('div',{key:i,style:{fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,padding:'1px 0'}},'\u00b7 '+p);})
    )
  ],172);
}

function cv4FrontEncounter(genId, d, campName, catColor) {
  var opp=Array.isArray(d.opposition)?d.opposition:[];
  var scAspects=Array.isArray(d.aspects)?d.aspects:[];
  var zones=Array.isArray(d.zones)?d.zones:[];
  return cv4Body([
    scAspects.length>0&&h('div',null,
      cv4Lbl('SCENE',catColor),
      h('div',{style:{display:'flex',flexDirection:'column',gap:3}},
        scAspects.slice(0,3).map(function(a,i){return h('div',{key:i,style:{padding:'2px 7px',background:'var(--inset)',border:'1px solid var(--border)',borderRadius:3,fontSize:11,fontStyle:'italic',color:'var(--text-dim)',fontFamily:CV4_SANS}},typeof a==='string'?a:(a.name||''));})
      )
    ),
    cv4Lbl('OPPOSITION',catColor),
    opp.map(function(o,i){
      var isMajor=(o.type||'').toLowerCase()==='major';
      var oAspects=Array.isArray(o.aspects)?o.aspects:[];
      return h('div',{key:i,style:{background:'var(--inset)',border:'1px solid '+(isMajor?catColor+'55':'var(--border)'),borderRadius:5,overflow:'hidden',marginBottom:4}},
        h('div',{style:{display:'flex'}},
          h('div',{style:{padding:'5px 8px',background:isMajor?catColor:'var(--panel)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minWidth:42,flexShrink:0}},
            h('div',{style:{fontSize:10,fontWeight:700,color:isMajor?'#0d1117':'var(--text-muted)',letterSpacing:'0.1em',fontFamily:CV4_MONO}},(o.type||'').toUpperCase()),
            h('div',{style:{fontSize:13,fontWeight:700,color:isMajor?'#0d1117':'var(--text)',fontFamily:CV4_MONO}},'\xd7'+(o.qty||1))
          ),
          h('div',{style:{flex:1,padding:'5px 8px'}},
            h('div',{style:{fontSize:11,fontWeight:700,color:'var(--text)',fontFamily:CV4_SANS,marginBottom:3}},o.name||''),
            h('div',{style:{display:'flex',gap:7,flexWrap:'wrap',marginBottom:oAspects.length?3:0}},
              (o.skills||[]).slice(0,3).map(function(s,j){return h('div',{key:j},cv4SPill(s.name,s.r));})
            ),
            oAspects.length>0&&h('div',{style:{display:'flex',flexDirection:'column',gap:2}},
              oAspects.slice(0,2).map(function(a,j){return h('div',{key:j,style:{fontSize:10,fontStyle:'italic',color:'var(--text-muted)',fontFamily:CV4_SANS}},'\u201c'+a+'\u201d');})
            ),
            o.stunt&&h('div',{style:{fontSize:10,color:catColor,fontFamily:CV4_SANS,marginTop:2,fontStyle:'italic'}},'\u2605 '+o.stunt)
          ),
          h('div',{style:{padding:'5px 8px 5px 0',display:'flex',gap:2,alignItems:'center',flexShrink:0}},
            Array.from({length:o.stress||2}).map(function(_,j){return cv4Pip(isMajor?catColor:'var(--text-muted)',9);}))
        )
      );
    }),
    h('div',{style:{display:'flex',gap:6}},
      h('div',{style:{flex:1,padding:'4px 7px',background:'color-mix(in srgb,var(--c-green,#34d399) 10%,var(--inset))',border:'1px solid rgba(52,211,153,0.3)',borderLeft:'2px solid var(--c-green,#34d399)',borderRadius:'0 3px 3px 0'}},cv4Lbl('WIN','var(--c-green,#34d399)'),h('p',{style:{margin:0,fontSize:11,color:'var(--c-green,#34d399)',fontFamily:CV4_SANS,lineHeight:1.3}},d.victory||'')),
      h('div',{style:{flex:1,padding:'4px 7px',background:'color-mix(in srgb,var(--c-red,#f87171) 10%,var(--inset))',border:'1px solid rgba(248,113,113,0.3)',borderLeft:'2px solid var(--c-red,#f87171)',borderRadius:'0 3px 3px 0'}},cv4Lbl('LOSE','var(--c-red,#f87171)'),h('p',{style:{margin:0,fontSize:11,color:'var(--c-red,#f87171)',fontFamily:CV4_SANS,lineHeight:1.3}},d.defeat||''))
    )
  ],[
    h('div',null,cv4Lbl('TWIST',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontStyle:'italic',fontFamily:CV4_SANS,lineHeight:1.4}},d.twist||'')),
    zones.length>0&&h('div',null,cv4Lbl('ZONES',catColor),
      zones.slice(0,3).map(function(z,i){var zn=typeof z==='string'?z:(z.name||'');var za=typeof z==='object'?(z.aspect||''):'';return h('div',{key:i,style:{marginBottom:3,padding:'3px 7px',background:'var(--inset)',borderLeft:'2px solid '+catColor+'66',borderRadius:'0 3px 3px 0'}},h('div',{style:{fontSize:10,fontWeight:700,color:'var(--text)',fontFamily:CV4_SANS}},zn),za&&h('div',{style:{fontSize:10,color:'var(--text-muted)',fontStyle:'italic',fontFamily:CV4_SANS}},za));})
    ),
    h('div',null,cv4Lbl('GM FP',catColor),h('div',{style:{fontSize:28,fontWeight:800,color:'var(--text)',lineHeight:1,fontFamily:CV4_MONO}},d.gm_fate_points||''))
  ],130);
}

function cv4FrontSeed(genId, d, campName, catColor) {
  var scenes=Array.isArray(d.scenes)?d.scenes:[]; var cols=[catColor,'var(--gold,#fbbf24)','var(--c-red,#f87171)'];
  var opp=Array.isArray(d.opposition)?d.opposition:[];
  return cv4Body([
    h('div',null,cv4Lbl('OBJECTIVE',catColor),h('p',{style:{margin:0,fontSize:11,fontWeight:600,color:'var(--text)',fontFamily:CV4_SANS,lineHeight:1.45}},d.objective||'')),
    h('div',null,cv4Lbl('LOCATION',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4}},d.location||'')),
    d.issue&&h('div',null,cv4Lbl('ISSUE IN PLAY',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4,fontStyle:'italic'}},d.issue||'')),
    d.setting_asp&&cv4Inset([cv4Lbl('SETTING ASPECT',catColor),h('p',{style:{margin:0,fontSize:11,fontStyle:'italic',color:'var(--text-dim)',fontFamily:CV4_SANS}},d.setting_asp||'')]),
    cv4Accent([cv4Lbl('COMPLICATION','var(--c-red,#f87171)'),h('p',{style:{margin:0,fontSize:11,color:'var(--c-red,#f87171)',fontFamily:CV4_SANS,lineHeight:1.3}},d.complication||'')],'var(--c-red,#f87171)')
  ],[
    cv4Lbl('3-SCENE SKELETON',catColor),
    scenes.map(function(s,i){var b=s.brief||'';if(b.length>80)b=b.slice(0,80)+'\u2026';return h('div',{key:i,style:{padding:'5px 8px',background:'var(--inset)',border:'1px solid var(--border)',borderLeft:'2px solid '+cols[i],borderRadius:'0 4px 4px 0',marginBottom:4}},h('div',{style:{fontSize:10,fontWeight:700,color:cols[i],letterSpacing:'0.15em',fontFamily:CV4_MONO}},s.type||('ACT '+(i+1))),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.3}},b));}),
    d.twist&&h('div',null,cv4Lbl('TWIST',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontStyle:'italic',fontFamily:CV4_SANS,lineHeight:1.35}},d.twist)),
    d.victory&&h('div',{style:{display:'flex',gap:5}},
      h('div',{style:{flex:1,padding:'3px 7px',background:'color-mix(in srgb,var(--c-green,#34d399) 10%,var(--inset))',borderLeft:'2px solid var(--c-green,#34d399)',borderRadius:'0 3px 3px 0'}},cv4Lbl('WIN','var(--c-green,#34d399)'),h('p',{style:{margin:0,fontSize:10,color:'var(--c-green,#34d399)',fontFamily:CV4_SANS,lineHeight:1.3}},d.victory)),
      d.defeat&&h('div',{style:{flex:1,padding:'3px 7px',background:'color-mix(in srgb,var(--c-red,#f87171) 10%,var(--inset))',borderLeft:'2px solid var(--c-red,#f87171)',borderRadius:'0 3px 3px 0'}},cv4Lbl('LOSE','var(--c-red,#f87171)'),h('p',{style:{margin:0,fontSize:10,color:'var(--c-red,#f87171)',fontFamily:CV4_SANS,lineHeight:1.3}},d.defeat))
    ),
    opp.length>0&&h('div',null,cv4Lbl('OPPOSITION',catColor),
      opp.slice(0,2).map(function(o,i){return h('div',{key:i,style:{display:'flex',gap:5,alignItems:'center',padding:'2px 0'}},
        h('div',{style:{fontSize:10,fontWeight:700,color:catColor,fontFamily:CV4_MONO}},'\xd7'+(o.qty||1)),
        h('div',{style:{fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS}},o.name||'')
      );})
    )
  ],170);
}

function cv4FrontCompel(genId, d, campName, catColor) {
  return cv4Body([
    cv4Accent([cv4Lbl('SITUATION',catColor),h('p',{style:{margin:0,fontSize:13,fontWeight:700,color:'var(--text)',fontFamily:CV4_SANS,lineHeight:1.35}},d.situation||'')],catColor,{padding:'8px 10px'}),
    cv4Inset([cv4Lbl('IF ACCEPTED',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4,fontStyle:'italic'}},d.consequence||d.complication||'')])
  ],[
    h('div',null,cv4Lbl('TYPE',catColor),h('div',{style:{padding:'4px 9px',background:'color-mix(in srgb,'+catColor+' 16%,var(--inset))',border:'1px solid '+catColor+'44',borderRadius:4,display:'inline-block',fontSize:13,fontWeight:700,color:catColor,fontFamily:CV4_MONO,textTransform:'uppercase'}},d.template_type||'event')),
    d.template&&cv4Inset([cv4Lbl('TEMPLATE',catColor),h('p',{style:{margin:0,fontSize:10,color:'var(--text-muted)',fontFamily:CV4_SANS,lineHeight:1.5,fontStyle:'italic'}},d.template)]),
    cv4Inset([cv4Lbl('PLAYER CHOICE',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.5}},'Accept for 1 FP \u2014 or refuse by spending 1 FP')])
  ],160);
}

function cv4FrontChallenge(genId, d, campName, catColor) {
  return cv4Body([
    h('div',null,h('div',{style:{fontSize:14,fontWeight:800,color:'var(--text)',fontFamily:CV4_MONO,lineHeight:1.2}},d.name||d.title||''),h('p',{style:{margin:'3px 0 0',fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4}},d.desc||d.description||'')),
    h('div',{style:{display:'flex',gap:8}},
      h('div',{style:{flex:1,padding:'5px 8px',background:'color-mix(in srgb,var(--c-green,#34d399) 10%,var(--inset))',border:'1px solid rgba(52,211,153,0.3)',borderLeft:'2px solid var(--c-green,#34d399)',borderRadius:'0 5px 5px 0'}},cv4Lbl('SUCCESS','var(--c-green,#34d399)'),h('p',{style:{margin:0,fontSize:11,color:'var(--c-green,#34d399)',fontFamily:CV4_SANS,lineHeight:1.35}},d.success||'')),
      h('div',{style:{flex:1,padding:'5px 8px',background:'color-mix(in srgb,var(--c-red,#f87171) 10%,var(--inset))',border:'1px solid rgba(248,113,113,0.3)',borderLeft:'2px solid var(--c-red,#f87171)',borderRadius:'0 5px 5px 0'}},cv4Lbl('FAILURE','var(--c-red,#f87171)'),h('p',{style:{margin:0,fontSize:11,color:'var(--c-red,#f87171)',fontFamily:CV4_SANS,lineHeight:1.35}},d.failure||''))
    ),
    (d.stakes_good||d.stakes_bad)&&h('div',{style:{display:'flex',gap:8}},
      d.stakes_good&&h('div',{style:{flex:1,padding:'4px 7px',background:'color-mix(in srgb,var(--c-green,#34d399) 6%,var(--inset))',border:'1px solid rgba(52,211,153,0.2)',borderLeft:'2px solid rgba(52,211,153,0.4)',borderRadius:'0 4px 4px 0'}},cv4Lbl('STAKES WIN','var(--c-green,#34d399)'),h('p',{style:{margin:0,fontSize:10,color:'var(--text-muted)',fontFamily:CV4_SANS,lineHeight:1.35}},d.stakes_good)),
      d.stakes_bad&&h('div',{style:{flex:1,padding:'4px 7px',background:'color-mix(in srgb,var(--c-red,#f87171) 6%,var(--inset))',border:'1px solid rgba(248,113,113,0.2)',borderLeft:'2px solid rgba(248,113,113,0.4)',borderRadius:'0 4px 4px 0'}},cv4Lbl('STAKES LOSE','var(--c-red,#f87171)'),h('p',{style:{margin:0,fontSize:10,color:'var(--text-muted)',fontFamily:CV4_SANS,lineHeight:1.35}},d.stakes_bad))
    )
  ],[
    cv4Accent([cv4Lbl('PRIMARY SKILL',catColor),h('div',{style:{fontSize:13,fontWeight:700,color:catColor,fontFamily:CV4_MONO}},d.primary||d.primary_skill||'')],catColor),
    cv4Inset([cv4Lbl('OPPOSING FORCE',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4}},d.opposing||d.opposition_skill||'')])
  ],158);
}

function cv4FrontContest(genId, d, campName, catColor, ctx) {
  var victories=d.victories_needed||3; var twists=Array.isArray(d.twists)?d.twists:[];
  var sideA={label:d.side_a||'Side A',skills:d.skills_a||''}; var sideB={label:d.side_b||'Side B',skills:d.skills_b||''};
  var sA = ctx ? ctx.state.scoreA : 0;
  var sB = ctx ? ctx.state.scoreB : 0;
  function tick(side) { if (!ctx) return; var next=side==='a'?{scoreA:Math.min(sA+1,victories)}:{scoreB:Math.min(sB+1,victories)}; ctx.upd(next); }
  function reset() { if (ctx) ctx.upd({scoreA:0,scoreB:0}); }
  var winA = sA>=victories; var winB = sB>=victories;
  return cv4Body([
    h('div',null,h('div',{style:{fontSize:13,fontWeight:800,color:'var(--text)',fontFamily:CV4_MONO,lineHeight:1.2}},d.contest_type||''),h('p',{style:{margin:'2px 0 0',fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4}},d.desc||'')),
    d.aspect&&cv4Accent([cv4Lbl('SCENE ASPECT',catColor),h('p',{style:{margin:0,fontSize:11,fontStyle:'italic',color:'var(--text)',fontFamily:CV4_SANS}},d.aspect)],catColor),
    h('div',{style:{display:'flex',gap:6}},
      [[sideA,catColor,sA,winA,'a'],[sideB,'var(--c-red,#f87171)',sB,winB,'b']].map(function(row,i){
        var side=row[0]; var col=row[1]; var score=row[2]; var won=row[3]; var key=row[4];
        return h('div',{key:i,style:{flex:1,padding:'5px 8px',background:won?'color-mix(in srgb,'+col+' 15%,var(--inset))':'var(--inset)',border:'1px solid '+(won?col:col+'44'),borderTop:'2px solid '+col,borderRadius:4}},
          h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:3}},
            h('div',{style:{fontSize:11,fontWeight:700,color:col,fontFamily:CV4_SANS}},side.label),
            h('button',{onClick:function(e){e.stopPropagation();tick(key);},disabled:won,'aria-label':'Add victory for '+side.label,style:{padding:'2px 8px',background:col,border:'none',borderRadius:3,color:'var(--bg,#0d1117)',fontSize:11,fontWeight:700,cursor:won?'default':'pointer',opacity:won?0.4:1,fontFamily:CV4_SANS}},'+1')
          ),
          h('div',{style:{display:'flex',gap:3,'aria-label':side.label+' victories: '+score+' of '+victories}},
            Array.from({length:victories}).map(function(_,j){return h('div',{key:j,style:{width:16,height:16,borderRadius:2,background:j<score?col:'transparent',border:'1.5px solid '+col,transition:'all .15s'}});})
          ),
          h('div',{style:{fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,marginTop:2}},side.skills)
        );
      })
    ),
    h('div',{style:{display:'flex',justifyContent:'flex-end'}},
      h('button',{onClick:function(e){e.stopPropagation();reset();},'aria-label':'Reset contest scores',style:{padding:'2px 8px',background:'transparent',border:'1px solid var(--border)',borderRadius:3,fontSize:11,color:'var(--text-muted)',cursor:'pointer',fontFamily:CV4_SANS}},'Reset')
    )
  ],[
    h('div',{style:{textAlign:'center'}},cv4Lbl('VICTORIES NEEDED',catColor),h('div',{style:{fontSize:46,fontWeight:900,color:catColor,lineHeight:1,fontFamily:CV4_MONO}},victories),h('div',{style:{fontSize:11,color:'var(--text-muted)',fontFamily:CV4_SANS}},'per side')),
    twists.length>0&&h('div',null,cv4Lbl('POSSIBLE TWISTS',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.5}},twists.slice(0,2).map(function(t){return '\u00b7 '+t;}).join('  '))),
    (d.stakes_good||d.stakes_bad)&&h('div',{style:{display:'flex',flexDirection:'column',gap:4}},
      d.stakes_good&&h('div',{style:{padding:'3px 7px',background:'color-mix(in srgb,var(--c-green,#34d399) 8%,var(--inset))',borderLeft:'2px solid var(--c-green,#34d399)',borderRadius:'0 3px 3px 0'}},cv4Lbl('IF WIN','var(--c-green,#34d399)'),h('p',{style:{margin:0,fontSize:10,color:'var(--text-muted)',fontFamily:CV4_SANS,lineHeight:1.3}},d.stakes_good)),
      d.stakes_bad&&h('div',{style:{padding:'3px 7px',background:'color-mix(in srgb,var(--c-red,#f87171) 8%,var(--inset))',borderLeft:'2px solid var(--c-red,#f87171)',borderRadius:'0 3px 3px 0'}},cv4Lbl('IF LOSE','var(--c-red,#f87171)'),h('p',{style:{margin:0,fontSize:10,color:'var(--text-muted)',fontFamily:CV4_SANS,lineHeight:1.3}},d.stakes_bad))
    ),
    cv4Inset([h('p',{style:{margin:0,fontSize:11,color:'var(--text-muted)',fontFamily:CV4_SANS,textAlign:'center',lineHeight:1.4}},'Both sides roll every exchange')]),
    cv4Inset([cv4Lbl('ON A TIE','var(--c-amber,#f4b942)'),
      h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4}},
        'Neither side marks a victory. GM introduces a new situation aspect (FCon p.33).')
    ])
  ],128);
}

function cv4FrontConsequence(genId, d, campName, catColor, ctx) {
  var sc={mild:'var(--c-blue,#60a5fa)',moderate:'var(--gold,#fbbf24)',severe:'var(--c-red,#f87171)'}; var sev=(d.severity||'mild').toLowerCase(); var col=sc[sev]||'var(--c-purple,#a78bfa)';
  var rows=[{label:'Mild',s:2,c:'var(--c-blue,#60a5fa)'},{label:'Moderate',s:4,c:'var(--gold,#fbbf24)'},{label:'Severe',s:6,c:'var(--c-red,#f87171)'}];
  var treated = ctx ? !!ctx.state.treated : false;
  function toggleTreated(e) { e.stopPropagation(); if (ctx) ctx.upd({treated:!treated}); }
  return cv4Body([
    cv4Accent([cv4Lbl('CONSEQUENCE ASPECT',col),h('div',{style:{fontSize:15,fontWeight:800,color:'var(--text)',fontFamily:CV4_MONO,lineHeight:1.2,letterSpacing:'-0.02em'}},d.aspect||''),d.context&&h('p',{style:{margin:'4px 0 0',fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,fontStyle:'italic'}},d.context)],col,{padding:'10px 12px',borderLeft:'4px solid '+col,borderRadius:'0 8px 8px 0'}),
    cv4Inset([cv4Lbl('COMPEL HOOK',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4,fontStyle:'italic'}},'\u201c'+(d.compel_hook||'')+'\u201d')]),
    h('button',{
      onClick:toggleTreated, role:'checkbox', 'aria-checked':String(treated),
      'aria-label':treated?'Consequence treated \u2014 timer started':'Mark consequence as treated',
      style:{width:'100%',padding:'6px 10px',background:treated?'color-mix(in srgb,var(--c-green,#34d399) 15%,var(--inset))':'var(--inset)',
        border:'1px solid '+(treated?'var(--c-green,#34d399)':'var(--border)'),borderRadius:5,
        cursor:'pointer',fontFamily:CV4_MONO,fontSize:11,fontWeight:700,
        color:treated?'var(--c-green,#34d399)':'var(--text-muted)',letterSpacing:'0.1em',
        transition:'all .15s',textAlign:'center'}
    }, treated?'\u2713 TREATED \u2014 TIMER STARTED':'MARK AS TREATED')
  ],[
    h('div',{style:{textAlign:'center'}},cv4Lbl('SEVERITY',col),h('div',{style:{padding:'8px 14px',background:'color-mix(in srgb,'+col+' 16%,var(--inset))',border:'2px solid '+col,borderRadius:8,display:'inline-block'}},h('div',{style:{fontSize:14,fontWeight:800,color:col,fontFamily:CV4_MONO,textTransform:'capitalize'}},sev))),
    h('div',{style:{display:'flex',flexDirection:'column',gap:3}},rows.map(function(r){return h('div',{key:r.label,style:{display:'flex',gap:6,alignItems:'center',opacity:r.label.toLowerCase()===sev?1:0.28}},h('div',{style:{fontSize:11,fontWeight:r.label.toLowerCase()===sev?700:400,color:r.c,fontFamily:CV4_SANS,width:54}},r.label),h('div',{style:{fontSize:11,fontWeight:700,color:r.c,fontFamily:CV4_MONO}},r.s+' shifts'));})  )],128);
}

function cv4FrontComplication(genId, d, campName, catColor) {
  return cv4Body([
    cv4Accent([cv4Lbl('NEW SCENE ASPECT',catColor),h('div',{style:{fontSize:12,fontWeight:700,color:'var(--text)',fontFamily:CV4_SANS,lineHeight:1.3,marginBottom:4}},d.new_aspect||''),d.type&&cv4Tag((d.type||'').toUpperCase(),catColor)],catColor,{padding:'8px 10px'}),
    d.arrival&&h('div',null,cv4Lbl('ARRIVAL',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4}},d.arrival))
  ],[
    cv4Inset([cv4Lbl('ENVIRONMENT SHIFT',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4}},d.env||d.environment_shift||'')]),
    cv4Accent([cv4Lbl('SPOTLIGHT',catColor),h('div',{style:{fontSize:13,fontWeight:700,color:catColor,fontFamily:CV4_MONO,textTransform:'capitalize'}},d.spotlight||'')],catColor)
  ],160);
}

function cv4FrontBackstory(genId, d, campName, catColor) {
  var qs=Array.isArray(d.questions)?d.questions:[];
  return cv4Body([
    cv4Lbl('SESSION ZERO QUESTIONS',catColor),
    qs.map(function(q,i){return h('div',{key:i,style:{display:'flex',gap:8,alignItems:'flex-start'}},h('div',{style:{width:18,height:18,borderRadius:'50%',flexShrink:0,background:'color-mix(in srgb,'+catColor+' 16%,var(--inset))',border:'1px solid '+catColor+'55',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:catColor,fontFamily:CV4_MONO}},(i+1).toString()),h('p',{style:{margin:0,fontSize:11,color:'var(--text)',fontFamily:CV4_SANS,lineHeight:1.45}},q));})
  ],[
    cv4Accent([cv4Lbl('HOOK',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.45,fontStyle:'italic'}},d.hook||'')],catColor),
    cv4Inset([cv4Lbl('RELATIONSHIP WEB',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-muted)',fontFamily:CV4_SANS,lineHeight:1.5}},d.relationship||'Each player names two PCs. What do you share? What secret?')])
  ],160);
}

function cv4FrontObstacle(genId, d, campName, catColor) {
  var tc={block:'var(--c-blue,#60a5fa)',hazard:'var(--c-red,#f87171)',distraction:'var(--gold,#fbbf24)'}; var type_=(d.obstacle_type||'block').toLowerCase(); var col=tc[type_]||'var(--c-green,#34d399)'; var rating=d.rating!=null?d.rating:d.opposition; var ratingLabel=d.rating_label||d.opposition_label||'';
  return cv4Body([
    h('div',{style:{fontSize:15,fontWeight:800,color:'var(--text)',fontFamily:CV4_MONO,lineHeight:1.1}},d.name||d.title||''),
    cv4Accent([cv4Lbl('OBSTACLE ASPECT',col),h('p',{style:{margin:0,fontSize:12,fontStyle:'italic',fontWeight:600,color:'var(--text)',fontFamily:CV4_SANS}},d.aspect||d.choice||'')],col),
    cv4Inset([cv4Lbl('HOW TO BYPASS',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4}},d.disable||d.bypass||'')]),
    d.gm_note&&cv4Inset([cv4Lbl('GM NOTE',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-muted)',fontFamily:CV4_SANS,lineHeight:1.4}},d.gm_note)])
  ],[
    h('div',{style:{textAlign:'center'}},
      h('div',{style:{fontSize:11,fontWeight:700,letterSpacing:'0.15em',color:col,fontFamily:CV4_MONO,marginBottom:6,textTransform:'uppercase'}},type_),
      rating!=null&&h('div',{style:{width:60,height:60,borderRadius:'50%',background:'color-mix(in srgb,'+col+' 14%,var(--inset))',border:'2px solid '+col,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}},h('div',{style:{fontSize:22,fontWeight:900,color:col,lineHeight:1,fontFamily:CV4_MONO}},rating),ratingLabel&&h('div',{style:{fontSize:10,color:col,fontFamily:CV4_SANS}},ratingLabel))
    ),
    d.weapon&&h('div',{style:{textAlign:'center'}},h('div',{style:{fontSize:11,color:'var(--text-muted)',fontFamily:CV4_MONO,letterSpacing:'0.1em'}},'WEAPON'),h('div',{style:{fontSize:20,fontWeight:800,color:'var(--c-red,#f87171)',fontFamily:CV4_MONO}},d.weapon))
  ],118);
}

function cv4FrontCountdown(genId, d, campName, catColor, ctx) {
  var boxes=d.boxes||4;
  var filled = ctx ? ctx.state.cdFilled : 0;
  function setFilled(n) { if (ctx) ctx.upd({cdFilled:n}); }
  return cv4Body([
    h('div',{style:{fontSize:15,fontWeight:800,color:'var(--text)',fontFamily:CV4_MONO,lineHeight:1.1}},d.name||''),
    h('div',null,cv4Lbl('TRIGGER',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-dim)',fontFamily:CV4_SANS,lineHeight:1.4}},d.trigger||'')),
    cv4Accent([cv4Lbl('OUTCOME WHEN FULL','var(--c-red,#f87171)'),h('p',{style:{margin:0,fontSize:11,fontWeight:600,color:'var(--c-red,#f87171)',fontFamily:CV4_SANS,lineHeight:1.35}},d.outcome||'')],'var(--c-red,#f87171)')
  ],[
    cv4Clock(boxes, filled, setFilled, catColor),
    cv4Inset([cv4Lbl('UNIT',catColor),h('div',{style:{fontSize:13,fontWeight:700,color:'var(--text)',textTransform:'capitalize',fontFamily:CV4_MONO}},d.unit||'')])
  ],160);
}

function cv4FrontConstraint(genId, d, campName, catColor) {
  return cv4Body([
    h('div',{style:{fontSize:15,fontWeight:800,color:'var(--text)',fontFamily:CV4_MONO,lineHeight:1.1}},d.name||''),
    cv4Accent([cv4Lbl('RESTRICTED ACTION',catColor),h('p',{style:{margin:0,fontSize:12,fontWeight:600,color:'var(--text)',fontFamily:CV4_SANS,lineHeight:1.35}},d.restricted_action||d.what_resists||d.what||'')],catColor,{padding:'8px 10px'}),
    cv4Accent([cv4Lbl('IF VIOLATED','var(--c-red,#f87171)'),h('p',{style:{margin:0,fontSize:11,color:'var(--c-red,#f87171)',fontFamily:CV4_SANS,lineHeight:1.4}},d.consequence||'')],'var(--c-red,#f87171)'),
    cv4Inset([cv4Lbl('HOW TO BYPASS','var(--c-green,#34d399)'),h('p',{style:{margin:0,fontSize:11,color:'var(--c-green,#34d399)',fontFamily:CV4_SANS,lineHeight:1.4}},d.bypass||'')])
  ],[
    h('div',{style:{textAlign:'center'}},cv4Lbl('TYPE',catColor),h('div',{style:{padding:'7px 12px',background:'color-mix(in srgb,'+catColor+' 16%,var(--inset))',border:'2px solid '+catColor,borderRadius:6,display:'inline-block'}},h('div',{style:{fontSize:13,fontWeight:800,color:catColor,fontFamily:CV4_MONO,textTransform:'capitalize'}},d.constraint_type||''))),
    d.gm_note&&cv4Inset([cv4Lbl('GM NOTE',catColor),h('p',{style:{margin:0,fontSize:11,color:'var(--text-muted)',fontFamily:CV4_SANS,lineHeight:1.5}},d.gm_note)]),
    !d.gm_note&&cv4Inset([h('p',{style:{margin:0,fontSize:11,color:'var(--text-muted)',fontFamily:CV4_SANS,lineHeight:1.5}},'Forces a new approach \u2014 not higher rolls')])
  ],128);
}


function cv4FrontPc(genId, d, campName, catColor) {
  var asp = d.aspects || {};
  var skills = Array.isArray(d.skills) ? d.skills : [];
  var stunts = Array.isArray(d.stunts) ? d.stunts : [];
  var LADDER = {4:'Great',3:'Good',2:'Fair',1:'Average',0:'Mediocre'};

  // Group skills by rating for compact pyramid display
  var byRating = {};
  skills.forEach(function(s) {
    var r = s.r || 0;
    if (!byRating[r]) byRating[r] = [];
    byRating[r].push(s.name);
  });
  var pyramidRatings = [4,3,2,1].filter(function(r){ return byRating[r] && byRating[r].length; });

  return cv4Body([
    // Name
    h('div', {style:{fontSize:16, fontWeight:900, color:'var(--text)', fontFamily:CV4_MONO, lineHeight:1.1, marginBottom:4}}, d.name || ''),

    // High Concept + Trouble
    cv4Accent([
      cv4Lbl('HIGH CONCEPT', catColor),
      h('p', {style:{margin:0, fontSize:12, fontWeight:700, color:'var(--text)', fontFamily:CV4_SANS, lineHeight:1.35, fontStyle:'italic'}}, asp.high_concept || ''),
    ], catColor),
    cv4Accent([
      cv4Lbl('TROUBLE', 'var(--c-red,#f87171)'),
      h('p', {style:{margin:0, fontSize:11, fontWeight:600, color:'var(--c-red,#f87171)', fontFamily:CV4_SANS, lineHeight:1.35, fontStyle:'italic'}}, asp.trouble || ''),
    ], 'var(--c-red,#f87171)'),

    // Other aspects
    [asp.other1, asp.other2, asp.other3].filter(Boolean).length > 0 &&
      cv4Inset([
        cv4Lbl('OTHER ASPECTS', catColor),
        [asp.other1, asp.other2, asp.other3].filter(Boolean).map(function(a, i) {
          return h('p', {key:i, style:{margin:0, fontSize:11, color:'var(--text)', fontFamily:CV4_SANS, lineHeight:1.4, fontStyle:'italic',
            borderLeft:'2px solid '+catColor+'44', paddingLeft:7, marginBottom: i < 2 ? 4 : 0}}, a);
        })
      ]),

  ],[
    // Skill pyramid
    cv4Inset([
      cv4Lbl('SKILLS', catColor),
      h('div', {style:{display:'flex', flexDirection:'column', gap:3, marginTop:3}},
        pyramidRatings.map(function(r) {
          return h('div', {key:r, style:{display:'flex', alignItems:'baseline', gap:5}},
            h('div', {style:{fontSize:10, fontWeight:800, color:catColor, fontFamily:CV4_MONO, width:52, flexShrink:0}},
              '+'+r+' '+LADDER[r]),
            h('div', {style:{fontSize:10, color:'var(--text-dim)', fontFamily:CV4_SANS}},
              byRating[r].join(', '))
          );
        })
      )
    ]),

    // Stress tracks
    h('div', {style:{display:'flex', gap:6, marginTop:4}},
      h('div', {style:{flex:1}},
        cv4StressTrack('PHYS', Array(d.physical_stress || 3).fill(false), function(){}, catColor)
      ),
      h('div', {style:{flex:1}},
        cv4StressTrack('MENT', Array(d.mental_stress || 3).fill(false), function(){}, catColor)
      )
    ),

    // Refresh + consequences
    h('div', {style:{display:'flex', gap:8, alignItems:'center', marginTop:4}},
      h('div', {style:{textAlign:'center'}},
        cv4Lbl('REFRESH', catColor),
        h('div', {style:{fontSize:18, fontWeight:900, color:catColor, fontFamily:CV4_MONO, lineHeight:1}},
          String(d.refresh || 3))
      ),
      h('div', {style:{flex:1}},
        cv4Lbl('CONSEQUENCES', catColor),
        h('div', {style:{display:'flex', flexDirection:'column', gap:2, marginTop:2}},
          (d.consequences||[2,4,6]).map(function(shift, i) {
            var label = ['Mild','Moderate','Severe'][i] || 'Severe';
            return h('div', {key:i, style:{display:'flex', alignItems:'center', gap:4}},
              h('div', {style:{fontSize:9, fontWeight:800, color:'var(--text-muted)', fontFamily:CV4_MONO, width:52, flexShrink:0}},
                label+' (-'+shift+')'),
              h('div', {style:{flex:1, height:1, borderBottom:'1px dashed var(--border)'}}));
          })
        )
      )
    ),

    // Stunts
    stunts.length > 0 && cv4Inset([
      cv4Lbl('STUNTS', catColor),
      stunts.map(function(st, i) {
        return h('div', {key:i, style:{marginBottom: i < stunts.length-1 ? 5 : 0}},
          h('div', {style:{fontSize:11, fontWeight:700, color:'var(--text)', fontFamily:CV4_SANS}},
            (st.name || '') + (st.skill ? h('span',{style:{color:catColor,fontSize:10,fontFamily:CV4_MONO}},' ['+st.skill+']') : '')),
          h('div', {style:{fontSize:10, color:'var(--text-muted)', fontFamily:CV4_SANS, lineHeight:1.4, marginTop:1}},
            st.desc || '')
        );
      })
    ]),

    // Session zero questions
    Array.isArray(d.questions) && d.questions.length > 0 &&
      cv4Inset([
        cv4Lbl('SESSION ZERO QUESTIONS', catColor),
        d.questions.map(function(q, i) {
          return h('p', {key:i, style:{margin:0, marginBottom: i<d.questions.length-1?4:0,
            fontSize:11, color:'var(--text-dim)', fontFamily:CV4_SANS, lineHeight:1.45,
            paddingLeft:10, borderLeft:'2px solid '+catColor+'44'}}, q);
        })
      ]),

  ], 220);
}

// ── cv4FrontCustom — fully inline-editable blank card ─────────────────────
// GM creates this during play. Title, type, and body are all editable in place.
// Type cycles through common Fate card categories and tints the card accent.
var CV4_CUSTOM_TYPES = [
  {id:'aspect',   label:'Aspect',   color:'var(--c-green,#34d399)'},
  {id:'npc',      label:'NPC',      color:'var(--c-blue,#60a5fa)'},
  {id:'location', label:'Location', color:'var(--gold,#fbbf24)'},
  {id:'clue',     label:'Clue',     color:'var(--c-purple,#a78bfa)'},
  {id:'other',    label:'Other',    color:'var(--text-muted,#888)'},
];

function cv4FrontCustom(genId, d, campName, catColor, onUpdate) {
  var _editTitle = useState(false); var editTitle = _editTitle[0]; var setEditTitle = _editTitle[1];
  var _editBody  = useState(false); var editBody  = _editBody[0];  var setEditBody  = _editBody[1];
  var _title = useState(d.title || 'Untitled'); var draftTitle = _title[0]; var setDraftTitle = _title[1];
  var _body  = useState(d.body  || '');         var draftBody  = _body[0];  var setDraftBody  = _body[1];

  var typeId    = d.type || 'aspect';
  var typeEntry = CV4_CUSTOM_TYPES.find(function(t){return t.id===typeId;}) || CV4_CUSTOM_TYPES[0];
  var typeColor = typeEntry.color;

  function commitTitle() {
    setEditTitle(false);
    var val = draftTitle.trim() || 'Untitled';
    setDraftTitle(val);
    if (onUpdate && val !== d.title) onUpdate({title: val, body: d.body, type: d.type});
  }
  function commitBody() {
    setEditBody(false);
    if (onUpdate && draftBody !== d.body) onUpdate({title: d.title, body: draftBody, type: d.type});
  }
  function cycleType() {
    var idx = CV4_CUSTOM_TYPES.findIndex(function(t){return t.id===typeId;});
    var next = CV4_CUSTOM_TYPES[(idx+1) % CV4_CUSTOM_TYPES.length];
    if (onUpdate) onUpdate({title: d.title, body: d.body, type: next.id});
  }

  return h('div', {style:{flex:1, padding:'10px 14px 12px', display:'flex', flexDirection:'column', gap:8}},

    // ── Type pill (clickable — cycles through types) ──────────────────────
    h('button', {
      onClick: cycleType,
      title: 'Click to change type',
      style:{
        alignSelf:'flex-start', background:'color-mix(in srgb,'+typeColor+' 15%,transparent)',
        border:'1px solid color-mix(in srgb,'+typeColor+' 40%,transparent)',
        borderRadius:4, padding:'2px 8px', fontSize:10, fontWeight:700,
        fontFamily:CV4_MONO, color:typeColor, cursor:'pointer', letterSpacing:'0.12em',
        textTransform:'uppercase', lineHeight:1.4,
      },
    }, typeEntry.label + ' \u00b7 tap to change'),

    // ── Title ─────────────────────────────────────────────────────────────
    editTitle
      ? h('input', {
          autoFocus: true,
          value: draftTitle,
          maxLength: 80,
          style:{
            fontSize:14, fontWeight:700, color:'var(--text)', background:'transparent',
            border:'none', borderBottom:'2px solid '+typeColor, outline:'none',
            width:'100%', fontFamily:CV4_MONO, padding:'2px 0',
          },
          onChange: function(e){ setDraftTitle(e.target.value); },
          onBlur: commitTitle,
          onKeyDown: function(e){
            if(e.key==='Enter'){ e.preventDefault(); commitTitle(); }
            if(e.key==='Escape'){ setDraftTitle(d.title||'Untitled'); setEditTitle(false); }
          },
          onClick: function(e){ e.stopPropagation(); },
        })
      : h('div', {
          onClick: function(e){ e.stopPropagation(); setDraftTitle(draftTitle); setEditTitle(true); },
          title: 'Click to edit title',
          style:{
            fontSize:14, fontWeight:700, color:'var(--text)', fontFamily:CV4_MONO,
            cursor:'text', lineHeight:1.3, borderBottom:'1px dashed transparent',
            paddingBottom:2,
          },
          onMouseEnter: function(e){ e.currentTarget.style.borderBottomColor=typeColor+'66'; },
          onMouseLeave: function(e){ e.currentTarget.style.borderBottomColor='transparent'; },
        }, draftTitle || h('span',{style:{color:'var(--text-muted)',fontStyle:'italic'}},'Untitled')),

    // ── Body ──────────────────────────────────────────────────────────────
    editBody
      ? h('textarea', {
          autoFocus: true,
          value: draftBody,
          maxLength: 400,
          rows: 4,
          style:{
            fontSize:11, color:'var(--text)', background:'var(--inset,rgba(0,0,0,.08))',
            border:'1px solid '+typeColor+'66', borderRadius:4, outline:'none',
            width:'100%', resize:'vertical', fontFamily:CV4_SANS, padding:'6px 8px',
            lineHeight:1.55,
          },
          onChange: function(e){ setDraftBody(e.target.value); },
          onBlur: commitBody,
          onKeyDown: function(e){
            if(e.key==='Escape'){ setDraftBody(d.body||''); setEditBody(false); }
          },
          onClick: function(e){ e.stopPropagation(); },
          placeholder: 'Notes, aspects, stats, anything\u2026',
        })
      : h('div', {
          onClick: function(e){ e.stopPropagation(); setDraftBody(draftBody); setEditBody(true); },
          title: 'Click to edit notes',
          style:{
            fontSize:11, color: draftBody ? 'var(--text-dim)' : 'var(--text-muted)',
            fontStyle: draftBody ? 'normal' : 'italic',
            lineHeight:1.55, cursor:'text', whiteSpace:'pre-wrap',
            minHeight:40, padding:'4px 0',
          },
        }, draftBody || 'Click to add notes\u2026')
  );
}

var CV4_FRONTS = {
  npc_minor:cv4FrontNpcMinor, npc_major:cv4FrontNpcMajor, faction:cv4FrontFaction,
  scene:cv4FrontScene, campaign:cv4FrontCampaign, encounter:cv4FrontEncounter, seed:cv4FrontSeed,
  compel:cv4FrontCompel, challenge:cv4FrontChallenge, contest:cv4FrontContest, consequence:cv4FrontConsequence,
  complication:cv4FrontComplication, pc:cv4FrontPc, backstory:cv4FrontBackstory, obstacle:cv4FrontObstacle,
  countdown:cv4FrontCountdown, constraint:cv4FrontConstraint,
  custom: function(gid, d, cn, cc, opts) { return cv4FrontCustom(gid, d, cn, cc, opts && opts.onUpdate); },
};

function renderCard(genId, data, campId, onUpdate, worldStunts, onChainRoll, savedCardState) {
  var campName = '';
  try {
    if (typeof CAMPAIGNS !== 'undefined' && campId && CAMPAIGNS[campId] && CAMPAIGNS[campId].meta) {
      campName = CAMPAIGNS[campId].meta.name || campId;
    }
  } catch(e) {}
  var frontFn = CV4_FRONTS[genId] || function(gid,d,cn,cc) {
    return h('div',{style:{flex:1,overflow:'hidden',padding:'10px 14px 0'}},
      h('div',{style:{fontSize:13,fontWeight:700,color:'var(--text)'}},d.name||d.location||d.situation||gid),
      h('div',{style:{marginTop:6,fontSize:11,color:'var(--text-dim)',lineHeight:1.6}},
        Object.keys(d).filter(function(k){return typeof d[k]==='string'&&d[k];}).slice(0,4).map(function(k,i){return h('div',{key:i},h('strong',{style:{color:'var(--text-muted)',fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase'}},k+': '),d[k]);})
      )
    );
  };
  return h(cv4Card, {genId:genId, campName:campName, data:data||{}, frontFn:frontFn, onUpdate:onUpdate||null, savedCardState:savedCardState||null});
}
