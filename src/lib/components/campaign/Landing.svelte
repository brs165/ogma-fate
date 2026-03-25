<svelte:options runes={false} />

<script>
  import { onMount } from 'svelte';

  let theme = 'dark';
  let demoNpcs = [];
  let joinCode = '';
  let joinErr = '';

  const CAMPAIGN_INFO = {
    thelongafter: { name: 'The Long After', icon: '◈', genre: 'Sword & Planet', vibes: 'Nausicaä · Thundarr · Book of the New Sun', hook: 'Warlords and ruined gods in the wreckage of civilisation' },
    cyberpunk:    { name: 'Neon Abyss', icon: '⬡', genre: 'Cyberpunk', vibes: 'Neuromancer · Blade Runner · Edgerunners', hook: 'Chrome, corp-blood, and the city that eats its own' },
    fantasy:      { name: 'Shattered Kingdoms', icon: '✦', genre: 'Dark Fantasy', vibes: 'Malazan · Black Company · Witcher', hook: 'Grim blades, older magic, and the weight of history' },
    space:        { name: 'Void Runners', icon: '◯', genre: 'Space Western', vibes: 'Firefly · The Expanse · Cowboy Bebop', hook: 'Hard vacuum, hard choices, and no one coming to help' },
    victorian:    { name: 'The Gaslight Chronicles', icon: '⊕', genre: 'Gothic Horror', vibes: 'Penny Dreadful · From Hell · The Prestige', hook: 'Gaslight and secrets and things that should not exist' },
    postapoc:     { name: 'The Long Road', icon: '◻', genre: 'Post-Apocalypse', vibes: 'Mad Max · Last of Us · Station Eleven', hook: 'The world already ended. Survive what comes next' },
    western:      { name: 'Dust and Iron', icon: '◈', genre: 'Frontier Western', vibes: 'Blood Meridian · Deadwood · True Grit', hook: 'Frontier justice. Railroad money and the weight of the old war' },
    dVentiRealm:  { name: 'dVenti Realm', icon: '⬟', genre: 'High Fantasy', vibes: 'D&D 5e · Pathfinder · Dragon Age', hook: 'The Senate collapsed. The Vaults are still here. So is everything sealed inside them.' },
  };

  const NPC_POOL = [
    { world: 'The Long After', icon: '🌅', concept: 'Last Cartographer of the Before-Times', trouble: "The Map Shows a City That Shouldn't Exist", skill: 'Lore +3', stunt: 'Living Archive: +2 to Lore when recalling pre-Collapse geography.' },
    { world: 'The Long After', icon: '🌅', concept: 'Scavenger-Priest of the Rusted Saints', trouble: 'Faith Built on Parts That No Longer Fit', skill: 'Will +3', stunt: 'Lay on Hands (Mechanical): once per scene, repair one stress on a willing target with salvage tools.' },
    { world: 'The Long After', icon: '🌅', concept: "Road Tax Collector with a Legitimate Monopoly", trouble: "The Route That Pays My Salary Doesn't Exist Anymore", skill: 'Provoke +2', stunt: "I Know What This Is Worth: +2 to Rapport when negotiating salvage value." },
    { world: 'Neon Abyss', icon: '🌆', concept: 'Debt-Bonded Neural Translator', trouble: 'My Employer Owns My Language Centers', skill: 'Empathy +4', stunt: 'Ghost Signal: once per session, intercept a private corporate data packet without triggering alerts.' },
    { world: 'Neon Abyss', icon: '🌆', concept: 'Ex-Corpo Medic Running an Unlicensed Clinic', trouble: 'Every Patient Is Evidence', skill: 'Medicine +3', stunt: 'Field Triage: +2 to overcome when treating consequences in the field with improvised tools.' },
    { world: 'Neon Abyss', icon: '🌆', concept: 'Protest Archivist Who Films Everything', trouble: 'The Footage Has Made Me a Target', skill: 'Notice +3', stunt: "You're on Camera: once per scene, reveal you recorded a key moment — create a \"Documented Evidence\" aspect with one free invoke." },
    { world: 'Shattered Kingdoms', icon: '⚔️', concept: 'Battle-Surgeon Who Stitches with Scar-Thread', trouble: 'The Thread Remembers What It Healed', skill: 'Crafts +3', stunt: 'Scar Lore: +2 to Empathy when reading the history of wounds on a willing subject.' },
    { world: 'Shattered Kingdoms', icon: '⚔️', concept: 'Exiled Prince Hiding as a Traveling Merchant', trouble: "The Crown's Spies Recognize My Hands", skill: 'Deceive +3', stunt: "Merchant's Price: +2 to Rapport when using trade goods as social leverage." },
    { world: 'Shattered Kingdoms', icon: '⚔️', concept: 'Hedge Witch Paid in Secrets', trouble: 'I Know Too Much to Be Safe Anywhere', skill: 'Lore +4', stunt: "Cost of Knowledge: once per session, name a secret someone present holds — they must confirm or deny it." },
    { world: 'Void Runners', icon: '🚀', concept: 'Jump Drive Mechanic Three Payments Behind', trouble: "The Drive Works. The Paperwork Doesn't.", skill: 'Engineering +4', stunt: "Hot Start: once per session, push a failing drive past its rated capacity — it works, but takes a consequence." },
    { world: 'Void Runners', icon: '🚀', concept: 'Retired Fleet Medic Running Cargo', trouble: "The Fleet Wants Me Back and Won't Take No", skill: 'Medicine +3', stunt: 'Combat Triage: +2 to overcome stress consequences in zero-g or vacuum conditions.' },
    { world: 'Void Runners', icon: '🚀', concept: 'Salvage Auctioneer with a Questionable Ledger', trouble: 'Half My Inventory Has Prior Owners', skill: 'Contacts +3', stunt: "Finder's Cut: +2 to Contacts when locating hard-to-source ship components through informal channels." },
    { world: 'The Gaslight Chronicles', icon: '🎩', concept: 'Alienist Who Studies What Studies Him Back', trouble: 'My Notes Are Starting to Write Themselves', skill: 'Lore +4', stunt: 'Clinical Distance: +2 to Will when resisting mental consequence aspects caused by eldritch phenomena.' },
    { world: 'The Gaslight Chronicles', icon: '🎩', concept: 'Society Photographer with a Darkroom Secret', trouble: "Some Subjects Appear in the Negative That Weren't in the Room", skill: 'Notice +3', stunt: 'The Camera Sees True: once per session, reveal a hidden aspect of a location or person through developed photographs.' },
    { world: 'The Gaslight Chronicles', icon: '🎩', concept: 'Clockwork Surgeon Wanted by the College', trouble: 'My Methods Work. My Methods Are Illegal.', skill: 'Crafts +3', stunt: 'Surgical Precision: once per scene, treat a Moderate consequence as Mild for the purpose of scene-end recovery.' },
    { world: 'The Long Road', icon: '🛣️', concept: "Convoy Medic Who Buries What She Can't Fix", trouble: 'The Graves Are Catching Up', skill: 'Medicine +3', stunt: 'Keep Moving: +2 to Will when treating consequences during active travel under pressure.' },
    { world: 'The Long Road', icon: '🛣️', concept: "Water-Finder Who Charges What the Water's Worth", trouble: 'Everyone Needs Me. Nobody Trusts Me.', skill: 'Investigate +3', stunt: 'Dowsing the Ruin: +2 to Investigate when searching pre-collapse structures for viable water sources.' },
    { world: 'Dust and Iron', icon: '🤠', concept: 'Land Surveyor Working Both Sides of the Deed', trouble: 'Three Towns Believe the Same Acre Is Theirs', skill: 'Lore +2', stunt: 'I Know This Land: +2 to Notice when reading terrain for cover, ambush points, or escape routes.' },
    { world: 'Dust and Iron', icon: '🤠', concept: 'Circuit Rider Preacher with a Warrant', trouble: "The Lord's Work and the Law's Work Crossed Once", skill: 'Provoke +3', stunt: "Fire and Brimstone: once per scene, compel a hostile NPC's conscience aspect without spending a fate point." },
    { world: 'Dust and Iron', icon: '🤠', concept: 'Assay Office Clerk Who Knows Every Vein', trouble: 'The Company Pays My Salary and Owns My Silence', skill: 'Contacts +2', stunt: 'Supply Chain: +2 to Contacts when locating equipment or personnel through mining company networks.' },
  ];

  function pickThree() {
    const arr = NPC_POOL.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 3);
  }

  $: camps = (function() {
    const arr = Object.keys(CAMPAIGN_INFO).map(id => ({
      id, ...CAMPAIGN_INFO[id]
    }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  })();

  onMount(() => {
    demoNpcs = pickThree();
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      theme = p.theme || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      p.theme = theme;
      localStorage.setItem('fate_prefs_v1', JSON.stringify(p));
    } catch (e) {}
  }

  function handleJoin() {
    const clean = joinCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length < 4) { joinErr = 'Enter the 4-character code your GM shared.'; return; }
    joinErr = '';
    window.location.href = '/campaigns/fantasy?mode=play&room=' + clean;
  }
</script>

<div class="land-shell">
  <a href="#main" class="skip-link">Skip to main content</a>

  <!-- Topbar -->
  <header class="land-topnav topbar" role="banner">
    <a href="/" class="topbar-wordmark" aria-label="Ogma home">OGMA</a>
    <div class="topbar-spacer" style="flex:1"></div>
    <div class="topbar-status">
      <a href="/help" class="btn btn-ghost topbar-nav-btn" style="font-size:13px;text-decoration:none">&#128218; Help</a>
      <a href="/about" class="btn btn-ghost topbar-nav-btn" style="font-size:13px;text-decoration:none">About</a>
      <button
        class="btn btn-icon btn-ghost"
        on:click={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        style="width:44px;height:44px"
      >{theme === 'dark' ? '☀️' : '◑'}</button>
    </div>
  </header>

  <main id="main">
    <!-- Hero -->
    <div class="land-hero">
      <div class="land-hero-inner">
        <p class="land-hero-eyebrow">
          <span style="white-space:nowrap"><strong class="ogma-letter" style="--i:0">O</strong>n-demand </span>
          <span style="white-space:nowrap"><strong class="ogma-letter" style="--i:1">G</strong>enerator for </span>
          <span style="white-space:nowrap"><strong class="ogma-letter" style="--i:2">M</strong>asterful </span>
          <span style="white-space:nowrap"><strong class="ogma-letter" style="--i:3">A</strong>dventures</span>
        </p>
        <h1 class="land-hero-title">
          Your session is in two hours.
          <br/>
          <span class="land-hero-sub">Pick a world. Roll. Play.</span>
        </h1>
        <p class="land-hero-desc">
          Rules-accurate NPCs, scenes, and encounters &mdash; generated in one click, ready for the table.
        </p>
        <p class="land-hero-desc" style="font-size:var(--text-sm);color:var(--text-muted);margin-top:4px">
          Every GM should be able to run a great Fate Condensed session, regardless of how much time they had to prep.
        </p>
        <div class="land-hero-pills">
          <span class="land-hero-pill">&#x1F4F4; Fully offline</span>
          <span class="land-hero-pill">&#x1F513; Free forever</span>
          <span class="land-hero-pill">&#x1F5A8; Print-ready</span>
          <span class="land-hero-pill">&#x26A1; One click</span>
        </div>
        <div class="land-hero-ctas">
          <a href="/campaigns/fantasy" class="land-cta-primary" aria-label="Open the generator">
            &#x1F3B2; Pick a World &amp; Generate
          </a>
          <a href="#worlds" class="land-cta-secondary">
            Pick a world &rarr;
          </a>
        </div>
      </div>
    </div>

    <!-- Onboarding: New here? -->
    <div class="land-onboard-section">
      <div class="land-worlds-inner">
        <h2 class="land-section-heading">New here?</h2>
        <div class="land-onboard-grid">
          <a href="/help/learn-fate" class="land-onboard-card">
            <div class="land-onboard-icon">&#x1F3B2;</div>
            <div class="land-onboard-text">
              <div class="land-onboard-label">Learn Fate</div>
              <div class="land-onboard-desc">Step-by-step guide to the rules &mdash; as a player or a GM. Coming from D&amp;D? We cover that too.</div>
            </div>
            <span class="land-onboard-arrow">&#x203A;</span>
          </a>
          <a href="/campaigns/fantasy" class="land-onboard-card">
            <div class="land-onboard-icon">&#x26A1;</div>
            <div class="land-onboard-text">
              <div class="land-onboard-label">Prep a Session</div>
              <div class="land-onboard-desc">Pick a world and generate NPCs, scenes, encounters, and more. Done in minutes.</div>
            </div>
            <span class="land-onboard-arrow">&#x203A;</span>
          </a>
          <a href="/help/export-share" class="land-onboard-card">
            <div class="land-onboard-icon">&#x1F517;</div>
            <div class="land-onboard-text">
              <div class="land-onboard-label">Export &amp; Play</div>
              <div class="land-onboard-desc">Ogma JSON export, Markdown, print-ready cards, and shareable links. Take your prep to any table.</div>
            </div>
            <span class="land-onboard-arrow">&#x203A;</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Join a Table -->
    <div class="land-join-section">
      <div class="land-worlds-inner">
        <h2 class="land-section-heading">Join a Table</h2>
        <p class="land-section-sub">Your GM is running a live session. Enter the room code they shared to join.</p>
        <div class="land-join-form">
          <input
            class="land-join-input"
            type="text"
            placeholder="Room code — e.g. A3KX"
            bind:value={joinCode}
            maxlength="6"
            aria-label="Room code"
            spellcheck="false"
            on:input={() => { if (joinErr) joinErr = ''; }}
            on:keydown={(e) => { if (e.key === 'Enter') handleJoin(); }}
          />
          <button class="btn land-join-btn" on:click={handleJoin} disabled={joinCode.trim().length === 0} aria-label="Join table">
            Join &rarr;
          </button>
        </div>
        {#if joinErr}
          <div class="land-join-err" role="alert">{joinErr}</div>
        {/if}
      </div>
    </div>

    <!-- World picker -->
    <div class="land-worlds-section" id="worlds">
      <div class="land-worlds-inner">
        <h2 class="land-section-heading">Choose your world</h2>
        <div class="land-worlds-grid">
          {#each camps as camp, idx (camp.id)}
            <a
              href="/campaigns/{camp.id}"
              class="land-world-card"
              data-campaign={camp.id}
              style="animation-delay:{idx * 0.05}s;position:relative;overflow:hidden"
            >
              <div class="land-world-card-accent"></div>
              <div class="land-world-card-body">
                <div class="land-world-icon">{camp.icon}</div>
                <div class="land-world-info">
                  <div class="land-world-name">{camp.name}</div>
                  <div class="land-world-genre">{camp.genre}</div>
                  <div class="land-world-hook">{camp.hook}</div>
                </div>
                <div class="land-world-arrow">&#x203A;</div>
              </div>
              <div class="land-world-footer">
                <span class="land-world-vibes">{camp.vibes}</span>
              </div>
            </a>
          {/each}
        </div>
      </div>
    </div>

    <!-- NPC Demo -->
    <div class="land-npc-demo-section">
      <div class="land-worlds-inner">
        <div class="land-npc-demo-hdr">
          <div>
            <h2 class="land-section-heading" style="margin-bottom:4px">Every NPC is ready to run.</h2>
            <p class="land-npc-demo-sub">High concept, trouble, top skill, and a stunt &mdash; rules-accurate, fiction-first.</p>
          </div>
          <button class="btn btn-ghost land-npc-shuffle-btn" on:click={() => { demoNpcs = pickThree(); }} aria-label="Show three different NPCs">
            &#x1F3B2; Shuffle
          </button>
        </div>
        <div class="land-npc-demo-grid">
          {#each demoNpcs as npc, i (i)}
            <div class="land-npc-card">
              <div class="land-npc-world">
                <span aria-hidden="true">{npc.icon}</span> {npc.world}
              </div>
              <div class="land-npc-concept">{npc.concept}</div>
              <div class="land-npc-trouble">
                <span class="land-npc-label">Trouble</span>
                <span class="land-npc-trouble-text">{npc.trouble}</span>
              </div>
              <div class="land-npc-row">
                <div class="land-npc-skill">
                  <span class="land-npc-label">Top Skill</span>
                  <span>{npc.skill}</span>
                </div>
              </div>
              <div class="land-npc-stunt">
                <span class="land-npc-label">Stunt</span>
                <span class="land-npc-stunt-text">{npc.stunt}</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="land-footer">
    <div class="land-footer-inner">
      <div style="font-style:italic;color:var(--text-muted);margin-bottom:4px">
        <strong>O</strong>n-demand <strong>G</strong>enerator for <strong>M</strong>asterful <strong>A</strong>dventures
      </div>
      <div style="margin-bottom:4px">
        Fate&trade; is a trademark of Evil Hat Productions, LLC. Released under <a href="/license">CC BY 3.0</a>.
      </div>
      <div>
        <a href="/license">Full Attribution</a> &middot;
        <a href="/help">&#128218; Help</a> &middot;
        <a href="/about">About</a>
      </div>
    </div>
  </footer>
</div>
