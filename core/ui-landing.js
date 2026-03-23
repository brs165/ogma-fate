// ui-landing.js — LandingApp + CAMPAIGN_PAGES/INFO constants
// Depends on: ui-primitives.js, ui-renderers.js
// LANDING PAGE APP (used by index.html)
// ════════════════════════════════════════════════════════════════════════

const CAMPAIGN_PAGES = {
  thelongafter: 'campaigns/thelongafter.html',
  cyberpunk:    'campaigns/cyberpunk.html',
  fantasy:      'campaigns/fantasy.html',
  space:        'campaigns/space.html',
  victorian:    'campaigns/victorian.html',
  postapoc:     'campaigns/postapoc.html',
  western:      'campaigns/western.html',
  dVentiRealm:  'campaigns/dVentiRealm.html',
};

const CAMPAIGN_GUIDE_PAGES = {
  thelongafter: 'campaigns/guide-thelongafter.html',
  cyberpunk:    'campaigns/guide-cyberpunk.html',
  fantasy:      'campaigns/guide-fantasy.html',
  space:        'campaigns/guide-space.html',
  victorian:    'campaigns/guide-victorian.html',
  postapoc:     'campaigns/guide-postapoc.html',
  western:      'campaigns/guide-western.html',
  dVentiRealm:  'campaigns/guide-dVentiRealm.html',
};

const CAMPAIGN_INFO = {
  thelongafter: {name: 'The Long After',          icon: '◈', genre: 'Sword & Planet',   vibes: 'Nausicaä · Thundarr · Book of the New Sun', tones: ['action','weird'], era: 'swords', hook: 'Warlords and ruined gods in the wreckage of civilisation'},
  cyberpunk:    {name: 'Neon Abyss',              icon: '⬡', genre: 'Cyberpunk',        vibes: 'Neuromancer · Blade Runner · Edgerunners',   tones: ['action','dark'],  era: 'guns',   hook: 'Chrome, corp-blood, and the city that eats its own'},
  fantasy:      {name: 'Shattered Kingdoms',      icon: '✦', genre: 'Dark Fantasy',     vibes: 'Malazan · Black Company · Witcher',           tones: ['dark','weird'],   era: 'swords', hook: 'Grim blades, older magic, and the weight of history'},
  space:        {name: 'Void Runners',             icon: '◯', genre: 'Space Western',    vibes: 'Firefly · The Expanse · Cowboy Bebop',        tones: ['action','dark'],  era: 'stars',  hook: 'Hard vacuum, hard choices, and no one coming to help'},
  victorian:    {name: 'The Gaslight Chronicles',  icon: '⊕', genre: 'Gothic Horror',    vibes: 'Penny Dreadful · From Hell · The Prestige',   tones: ['dark','weird'],   era: 'swords', hook: 'Gaslight and secrets and things that should not exist'},
  postapoc:     {name: 'The Long Road',            icon: '◻', genre: 'Post-Apocalypse',  vibes: 'Mad Max · Last of Us · Station Eleven',       tones: ['action','dark'],  era: 'guns',   hook: 'The world already ended. Survive what comes next'},
  western:      {name: 'Dust and Iron',            icon: '◈', genre: 'Frontier Western', vibes: 'Blood Meridian · Deadwood · True Grit',        tones: ['action','dark'],  era: 'guns',   hook: 'Frontier justice. Railroad money and the weight of the old war'},
  dVentiRealm:  {name: 'dVenti Realm',             icon: '⬟', genre: 'High Fantasy',     vibes: 'D&D 5e · Pathfinder · Dragon Age',             tones: ['dark','action'],  era: 'swords', hook: 'The Senate collapsed. The Vaults are still here. So is everything sealed inside them.'},
};

// CRT page-navigation helper — applies shutdown animation then navigates
function crtNavigate(url) {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.location.href = url;
    return;
  }
  var wrap = document.getElementById('land-crt-wrap');
  if (!wrap) { window.location.href = url; return; }
  wrap.classList.add('crt-nav-off');
  // After animation fires, redirect
  setTimeout(function() { window.location.href = url; }, 360);
}

// ── JOIN-01: Join a Table card ───────────────────────────────────────────
// Players use this to join a GM's hosted session without needing a direct URL.
// Input: 4-char room code → navigates to campaigns/[world]?room=CODE
// World is not known at join time — the server tells the player which world
// is being played after they connect (via the 'welcome' state message).
// For now: navigate to a generic join URL handled by the SPA router.
function JoinTableCard() {
  var _code = useState(''); var code = _code[0]; var setCode = _code[1];
  var _err = useState(''); var err = _err[0]; var setErr = _err[1];

  function handleJoin() {
    var clean = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length < 4) { setErr('Enter the 4-character code your GM shared.'); return; }
    setErr('');
    // Navigate to the run surface with the room code — board.html?mode=play handles join flow
    window.location.href = 'campaigns/board.html?mode=play&room=' + clean;
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleJoin();
  }

  return h('div', {className: 'land-join-section'},
    h('div', {className: 'land-worlds-inner'},
      h('h2', {className: 'land-section-heading'}, 'Join a Table'),
      h('p', {className: 'land-section-sub'},
        'Your GM is running a live session. Enter the room code they shared to join.'
      ),
      h('div', {className: 'land-join-form'},
        h('input', {
          className: 'land-join-input',
          type: 'text',
          placeholder: 'Room code — e.g. A3KX',
          value: code,
          maxLength: 6,
          'aria-label': 'Room code',
          spellCheck: false,
          autoCapitalize: 'characters',
          onChange: function(e) {
            setCode(e.target.value.toUpperCase());
            if (err) setErr('');
          },
          onKeyDown: handleKey,
        }),
        h('button', {
          className: 'btn land-join-btn',
          onClick: handleJoin,
          disabled: code.trim().length === 0,
          'aria-label': 'Join table',
        }, 'Join →')
      ),
      err && h('div', {className: 'land-join-err', role: 'alert'}, err)
    )
  );
}

function LandingApp() {
  const [theme, setTheme] = useState(getTheme());
  const landIntroRef = useRef(null);
  useEffect(function() {
    const el = landIntroRef.current;
    if (!el || typeof window.fateInitInline !== 'function') return;
    window.fateInitInline(el, {worldKey: 'index'});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  function toggleTheme() {
    let next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next); setTheme(next);
  }

  // ── UX-03: Landing NPC demo — hardcoded pool of 20, 2-3 per world ─────────
  const NPC_POOL = [
    // The Long After
    { world: 'The Long After', icon: '🌅', concept: 'Last Cartographer of the Before-Times', trouble: 'The Map Shows a City That Shouldn\'t Exist', skill: 'Lore +3', stunt: 'Living Archive: +2 to Lore when recalling pre-Collapse geography.' },
    { world: 'The Long After', icon: '🌅', concept: 'Scavenger-Priest of the Rusted Saints', trouble: 'Faith Built on Parts That No Longer Fit', skill: 'Will +3', stunt: 'Lay on Hands (Mechanical): once per scene, repair one stress on a willing target with salvage tools.' },
    { world: 'The Long After', icon: '🌅', concept: 'Road Tax Collector with a Legitimate Monopoly', trouble: 'The Route That Pays My Salary Doesn\'t Exist Anymore', skill: 'Provoke +2', stunt: 'I Know What This Is Worth: +2 to Rapport when negotiating salvage value.' },
    // Neon Abyss
    { world: 'Neon Abyss', icon: '🌆', concept: 'Debt-Bonded Neural Translator', trouble: 'My Employer Owns My Language Centers', skill: 'Empathy +4', stunt: 'Ghost Signal: once per session, intercept a private corporate data packet without triggering alerts.' },
    { world: 'Neon Abyss', icon: '🌆', concept: 'Ex-Corpo Medic Running an Unlicensed Clinic', trouble: 'Every Patient Is Evidence', skill: 'Medicine +3', stunt: 'Field Triage: +2 to overcome when treating consequences in the field with improvised tools.' },
    { world: 'Neon Abyss', icon: '🌆', concept: 'Protest Archivist Who Films Everything', trouble: 'The Footage Has Made Me a Target', skill: 'Notice +3', stunt: 'You\'re on Camera: once per scene, reveal you recorded a key moment — create a "Documented Evidence" aspect with one free invoke.' },
    // Shattered Kingdoms
    { world: 'Shattered Kingdoms', icon: '⚔️', concept: 'Battle-Surgeon Who Stitches with Scar-Thread', trouble: 'The Thread Remembers What It Healed', skill: 'Crafts +3', stunt: 'Scar Lore: +2 to Empathy when reading the history of wounds on a willing subject.' },
    { world: 'Shattered Kingdoms', icon: '⚔️', concept: 'Exiled Prince Hiding as a Traveling Merchant', trouble: 'The Crown\'s Spies Recognize My Hands', skill: 'Deceive +3', stunt: 'Merchant\'s Price: +2 to Rapport when using trade goods as social leverage.' },
    { world: 'Shattered Kingdoms', icon: '⚔️', concept: 'Hedge Witch Paid in Secrets', trouble: 'I Know Too Much to Be Safe Anywhere', skill: 'Lore +4', stunt: 'Cost of Knowledge: once per session, name a secret someone present holds — they must confirm or deny it.' },
    // Void Runners
    { world: 'Void Runners', icon: '🚀', concept: 'Jump Drive Mechanic Three Payments Behind', trouble: 'The Drive Works. The Paperwork Doesn\'t.', skill: 'Engineering +4', stunt: 'Hot Start: once per session, push a failing drive past its rated capacity — it works, but takes a consequence.' },
    { world: 'Void Runners', icon: '🚀', concept: 'Retired Fleet Medic Running Cargo', trouble: 'The Fleet Wants Me Back and Won\'t Take No', skill: 'Medicine +3', stunt: 'Combat Triage: +2 to overcome stress consequences in zero-g or vacuum conditions.' },
    { world: 'Void Runners', icon: '🚀', concept: 'Salvage Auctioneer with a Questionable Ledger', trouble: 'Half My Inventory Has Prior Owners', skill: 'Contacts +3', stunt: 'Finder\'s Cut: +2 to Contacts when locating hard-to-source ship components through informal channels.' },
    // The Gaslight Chronicles
    { world: 'The Gaslight Chronicles', icon: '🎩', concept: 'Alienist Who Studies What Studies Him Back', trouble: 'My Notes Are Starting to Write Themselves', skill: 'Lore +4', stunt: 'Clinical Distance: +2 to Will when resisting mental consequence aspects caused by eldritch phenomena.' },
    { world: 'The Gaslight Chronicles', icon: '🎩', concept: 'Society Photographer with a Darkroom Secret', trouble: 'Some Subjects Appear in the Negative That Weren\'t in the Room', skill: 'Notice +3', stunt: 'The Camera Sees True: once per session, reveal a hidden aspect of a location or person through developed photographs.' },
    { world: 'The Gaslight Chronicles', icon: '🎩', concept: 'Clockwork Surgeon Wanted by the College', trouble: 'My Methods Work. My Methods Are Illegal.', skill: 'Crafts +3', stunt: 'Surgical Precision: once per scene, treat a Moderate consequence as Mild for the purpose of scene-end recovery.' },
    // The Long Road
    { world: 'The Long Road', icon: '🛣️', concept: 'Convoy Medic Who Buries What She Can\'t Fix', trouble: 'The Graves Are Catching Up', skill: 'Medicine +3', stunt: 'Keep Moving: +2 to Will when treating consequences during active travel under pressure.' },
    { world: 'The Long Road', icon: '🛣️', concept: 'Water-Finder Who Charges What the Water\'s Worth', trouble: 'Everyone Needs Me. Nobody Trusts Me.', skill: 'Investigate +3', stunt: 'Dowsing the Ruin: +2 to Investigate when searching pre-collapse structures for viable water sources.' },
    // Dust and Iron
    { world: 'Dust and Iron', icon: '🤠', concept: 'Land Surveyor Working Both Sides of the Deed', trouble: 'Three Towns Believe the Same Acre Is Theirs', skill: 'Lore +2', stunt: 'I Know This Land: +2 to Notice when reading terrain for cover, ambush points, or escape routes.' },
    { world: 'Dust and Iron', icon: '🤠', concept: 'Circuit Rider Preacher with a Warrant', trouble: 'The Lord\'s Work and the Law\'s Work Crossed Once', skill: 'Provoke +3', stunt: 'Fire and Brimstone: once per scene, compel a hostile NPC\'s conscience aspect without spending a fate point.' },
    { world: 'Dust and Iron', icon: '🤠', concept: 'Assay Office Clerk Who Knows Every Vein', trouble: 'The Company Pays My Salary and Owns My Silence', skill: 'Contacts +2', stunt: 'Supply Chain: +2 to Contacts when locating equipment or personnel through mining company networks.' },
  ];

  // Pick 3 random from pool, reshuffled on button press
  function pickThree(pool) {
    const arr = pool.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      let tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr.slice(0, 3);
  }
  var _demo = useState(function() { return pickThree(NPC_POOL); });
  var demoNpcs = _demo[0]; var setDemoNpcs = _demo[1];
  // Build world list from CAMPAIGN_INFO (always available on landing page via shared-lite.js).
  // CAMPAIGNS is populated only on campaign pages — not on the landing page.
  var camps = (function() {
    var arr = Object.keys(CAMPAIGN_INFO).map(function(id) {
      var info = CAMPAIGN_INFO[id];
      return { meta: { id: id, name: info.name, icon: info.icon || '◈' } };
    });
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  })();

  // Last-used campaign — read from IDB (written by CampaignApp on every result save)
  const [lastCamp, setLastCamp] = useState(null);
  useEffect(function() {
    if (typeof DB !== 'undefined') {
      DB.loadSession('fate_last_camp').then(function(saved) {
        if (saved && saved.id && CAMPAIGN_PAGES[saved.id]) {
          setLastCamp({id: saved.id, href: CAMPAIGN_PAGES[saved.id]});
        }
      }).catch(function() {});
    }
  }, []);

  return h('div', {id: 'land-crt-wrap', className: 'land-shell'},
    h('a', {href: '#main', className: 'skip-link'}, 'Skip to main content'),

    // ── Topbar — minimal: wordmark · Prep Wizard · Help · theme toggle ───────────────
    h('header', {className: 'land-topnav topbar', role: 'banner'},
      h('a', {href: 'index.html', className: 'topbar-wordmark', 'aria-label': 'Ogma home'}, 'OGMA'),
      h('div', {className: 'topbar-spacer', style: {flex: 1}}),
      h('div', {className: 'topbar-status'},
        h('a', {href: 'campaigns/sessionzero.html', className: 'btn btn-ghost topbar-nav-btn', style: {fontSize: '13px', textDecoration: 'none'}}, '🎲 Prep Wizard'),
        h('a', {href: 'help/index.html', className: 'btn btn-ghost topbar-nav-btn', style: {fontSize: '13px', textDecoration: 'none'}}, '📖 Help'),
        h('button', {
          className: 'btn btn-icon btn-ghost',
          onClick: toggleTheme,
          'aria-label': theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
          title: theme === 'dark' ? 'Light mode' : 'Dark mode',
          style: {width: 44, height: 44},
        }, theme === 'dark' ? '☀️' : '◑')
      )
    ),

    h('main', {id: 'main'},

      // ── Hero ──────────────────────────────────────────────────────────
      h('div', {className: 'land-hero'},
        h('div', {className: 'land-hero-inner'},
          h('p', {className: 'land-hero-eyebrow'},
            h('span', {style: {whiteSpace: 'nowrap'}}, h('strong', {className: 'ogma-letter', style: {'--i': 0}}, 'O'), 'n-demand '),
            h('span', {style: {whiteSpace: 'nowrap'}}, h('strong', {className: 'ogma-letter', style: {'--i': 1}}, 'G'), 'enerator for '),
            h('span', {style: {whiteSpace: 'nowrap'}}, h('strong', {className: 'ogma-letter', style: {'--i': 2}}, 'M'), 'asterful '),
            h('span', {style: {whiteSpace: 'nowrap'}}, h('strong', {className: 'ogma-letter', style: {'--i': 3}}, 'A'), 'dventures')
          ),
          h('h1', {className: 'land-hero-title'},
            'Your session is in two hours.',
            h('br', null),
            h('span', {className: 'land-hero-sub'}, 'Pick a world. Roll. Play.')
          ),
          h('p', {className: 'land-hero-desc'},
            'Rules-accurate NPCs, scenes, and encounters — generated in one click, ready for the table.'
          ),
          h('p', {className: 'land-hero-desc', style: {fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4}},
            'Every GM should be able to run a great Fate Condensed session, regardless of how much time they had to prep.'
          ),
          h('div', {
            ref: landIntroRef,
            className: 'land-intro-teaser',
            'aria-label': 'Ogma introduction',
          }),
          h('div', {className: 'land-hero-pills'},
            h('span', {className: 'land-hero-pill'}, '📴 Fully offline'),
            h('span', {className: 'land-hero-pill'}, '🔓 Free forever'),
            h('span', {className: 'land-hero-pill'}, '🖨 Print-ready'),
            h('span', {className: 'land-hero-pill'}, '⚡ One click')
          ),
          h('div', {className: 'land-hero-ctas'},
            h('a', {
              href: 'campaigns/sessionzero.html',
              className: 'land-cta-primary',
              'aria-label': 'Open the Prep Wizard',
            }, '🎲 Start with the Prep Wizard'),
            h('a', {
              href: '#worlds',
              className: 'land-cta-secondary',
            }, 'Pick a world →')
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


      // ── Learn · Prep · Run · Export ─────────────────────────────────────────────
      h('div', {className: 'land-onboard-section'},
        h('div', {className: 'land-worlds-inner'},
          h('h2', {className: 'land-section-heading'}, 'New here?'),
          h('div', {className: 'land-onboard-grid'},
            h('a', {href: 'help/learn-fate.html', className: 'land-onboard-card'},
              h('div', {className: 'land-onboard-icon'}, h(RaIcon, {n: RA_ICONS.learn, size: '2x'})),
              h('div', {className: 'land-onboard-text'},
                h('div', {className: 'land-onboard-label'}, 'Learn Fate'),
                h('div', {className: 'land-onboard-desc'}, 'Step-by-step guide to the rules — as a player or a GM. Coming from D&D? We cover that too.')
              ),
              h('span', {className: 'land-onboard-arrow'}, '›')
            ),
            h('a', {href: 'campaigns/sessionzero.html', className: 'land-onboard-card'},
              h('div', {className: 'land-onboard-icon'}, h(RaIcon, {n: RA_ICONS.session_zero, size: '2x'})),
              h('div', {className: 'land-onboard-text'},
                h('div', {className: 'land-onboard-label'}, 'Prep a Session'),
                h('div', {className: 'land-onboard-desc'}, 'The Prep Wizard walks you through world, players, seed, scene, and opening NPC in 10 minutes. Done screen sends cards straight to the Table.')
              ),
              h('span', {className: 'land-onboard-arrow'}, '›')
            ),
            h('a', {href: 'help/how-to-use-ogma.html#gm-table', className: 'land-onboard-card'},
              h('div', {className: 'land-onboard-icon'}, h(RaIcon, {n: RA_ICONS.dnd_guide, size: '2x'})),
              h('div', {className: 'land-onboard-text'},
                h('div', {className: 'land-onboard-label'}, 'Export & Play'),
                h('div', {className: 'land-onboard-desc'}, 'Ogma JSON export, Markdown, print-ready cards, and shareable links. Take your prep to any table.')
              ),
              h('span', {className: 'land-onboard-arrow'}, '›')
            )
          )
        )
      ),

    // ── JOIN-01: Join a Table card ───────────────────────────────────────────
    h(JoinTableCard),

      // ── World picker ──────────────────────────────────────────────────
      h('div', {className: 'land-worlds-section', id: 'worlds'},
        h('div', {className: 'land-worlds-inner'},
          h('h2', {className: 'land-section-heading'}, 'Choose your world'),
          h('div', {className: 'land-worlds-grid'},
            camps.map(function(camp, idx) {
              const info = CAMPAIGN_INFO[camp.meta.id] || {};
              return h('a', {
                key: camp.meta.id,
                href: CAMPAIGN_PAGES[camp.meta.id],
                className: 'land-world-card',
                'data-campaign': camp.meta.id,
                style: {animationDelay: (idx * 0.05) + 's', position: 'relative', overflow: 'hidden'},
                onClick: function(e) {
                  e.preventDefault();
                  // Ripple ring — inject, animate, self-remove
                  var el = e.currentTarget;
                  var rip = document.createElement('div');
                  rip.className = 'world-card-ripple';
                  el.appendChild(rip);
                  var dest = el.getAttribute('href');
                  // Short delay so ripple is visible before CRT wipe
                  setTimeout(function() { crtNavigate(dest); }, 80);
                },
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
      )

    ),

      // ── UX-03: NPC demo ───────────────────────────────────────────────
      h('div', {className: 'land-npc-demo-section'},
        h('div', {className: 'land-worlds-inner'},
          h('div', {className: 'land-npc-demo-hdr'},
            h('div', null,
              h('h2', {className: 'land-section-heading', style: {marginBottom: 4}}, 'Every NPC is ready to run.'),
              h('p', {className: 'land-npc-demo-sub'}, 'High concept, trouble, top skill, and a stunt — rules-accurate, fiction-first.')
            ),
            h('button', {
              className: 'btn btn-ghost land-npc-shuffle-btn',
              onClick: function() { setDemoNpcs(pickThree(NPC_POOL)); },
              'aria-label': 'Show three different NPCs',
            }, '🎲 Shuffle')
          ),
          h('div', {className: 'land-npc-demo-grid'},
            demoNpcs.map(function(npc, i) {
              return h('div', {key: i, className: 'land-npc-card'},
                h('div', {className: 'land-npc-world'},
                  h('span', {'aria-hidden': 'true'}, npc.icon),
                  ' ', npc.world
                ),
                h('div', {className: 'land-npc-concept'}, npc.concept),
                h('div', {className: 'land-npc-trouble'},
                  h('span', {className: 'land-npc-label'}, 'Trouble'),
                  h('span', {className: 'land-npc-trouble-text'}, npc.trouble)
                ),
                h('div', {className: 'land-npc-row'},
                  h('div', {className: 'land-npc-skill'},
                    h('span', {className: 'land-npc-label'}, 'Top Skill'),
                    h('span', null, npc.skill)
                  )
                ),
                h('div', {className: 'land-npc-stunt'},
                  h('span', {className: 'land-npc-label'}, 'Stunt'),
                  h('span', {className: 'land-npc-stunt-text'}, npc.stunt)
                )
              );
            })
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
        h('div', {style: {marginBottom: 4}},
          'Fate™ is a trademark of ',
          h('a', {href: 'https://www.evilhat.com', target: '_blank', rel: 'noreferrer'}, 'Evil Hat Productions, LLC'),
          '. D&D® is a trademark of Wizards of the Coast LLC. Released under ',
          h('a', {href: 'license.html'}, 'CC BY 3.0'),
          '.'
        ),
        h('div', {style: {marginBottom: 4}},
          'Play surface: ',
          /* FARI_FOOTER_PARKED 2026.03.154 */
          ' · Rules reference: ',
          h('a', {href: 'https://fate-srd.com/', target: '_blank', rel: 'noreferrer'}, 'fate-srd.com'),
          ' (Randy Oest) · ',
          h('a', {href: 'https://www.dndbeyond.com/srd', target: '_blank', rel: 'noreferrer'}, 'D&D SRD 5.2.1')
        ),
        h('div', null,
          h('a', {href: 'license.html'}, 'Full Attribution'),
          ' · ',
          h('a', {href: 'https://fate-srd.com/official-licensing-fate', target: '_blank', rel: 'noreferrer'}, 'Fate Licensing'),
          ' · ',
          h('a', {href: 'help/index.html'}, '📖 Help'),
          ' · ',
          h('a', {href: 'about.html'}, 'About'),
          ' · ',
          h('a', {href: 'CONTRIBUTING.md', target: '_blank', rel: 'noreferrer'}, 'Contribute')
        )
      )
    )
  );
}

