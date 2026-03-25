<svelte:options runes={false} />

<script>
  import { onMount } from 'svelte';

  let theme = 'dark';
  let step = 0;

  const STEPS = [
    { id: 'campaign',  title: 'Choose Your Campaign' },
    { id: 'mode',      title: 'How Deep Do You Want to Go?' },
    { id: 'setting',   title: "The World You're Playing In" },
    { id: 'aspects',   title: 'Aspects — Who Are You?' },
    { id: 'skills',    title: 'Skills & Stunts' },
    { id: 'stress',    title: 'Stress & Consequences' },
    { id: 'questions', title: 'Session Zero Questions' },
    { id: 'summary',   title: 'Summary & Export' },
  ];

  $: stepId = STEPS[step].id;
  $: totalSteps = STEPS.length;
  $: progress = ((step + 1) / totalSteps * 100);

  function next() { if (step < totalSteps - 1) step += 1; }
  function back() { if (step > 0) step -= 1; }

  onMount(() => {
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      theme = p.theme || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}

    // Read ?world= param to pre-select campaign
    try {
      const params = new URLSearchParams(window.location.search);
      const w = params.get('world');
      if (w && CAMPAIGNS[w]) {
        campId = w;
        step = 1;
      }
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

  // ── Campaign data ──────────────────────────────────────────────────────
  let campId = null;
  let mode = 'standard';

  const CAMPAIGNS = {
    thelongafter: { name: 'The Long After',          icon: '◈', genre: 'Sword & Planet',   tagline: 'Warlords and ruined gods in the wreckage of civilisation' },
    cyberpunk:    { name: 'Neon Abyss',              icon: '⬡', genre: 'Cyberpunk',        tagline: 'Chrome, corp-blood, and the city that eats its own' },
    fantasy:      { name: 'Shattered Kingdoms',      icon: '✦', genre: 'Dark Fantasy',     tagline: 'Grim blades, older magic, and the weight of history' },
    space:        { name: 'Void Runners',            icon: '◯', genre: 'Space Western',    tagline: 'Hard vacuum, hard choices, and no one coming to help' },
    victorian:    { name: 'The Gaslight Chronicles',  icon: '⊕', genre: 'Gothic Horror',   tagline: 'Gaslight and secrets and things that should not exist' },
    postapoc:     { name: 'The Long Road',           icon: '◻', genre: 'Post-Apocalypse',  tagline: 'The world already ended. Survive what comes next' },
    western:      { name: 'Dust and Iron',           icon: '◈', genre: 'Frontier Western', tagline: 'Frontier justice. Railroad money and the weight of the old war' },
    dVentiRealm:  { name: 'dVenti Realm',            icon: '⬟', genre: 'High Fantasy',    tagline: 'The Senate collapsed. The Vaults are still here. So is everything sealed inside them.' },
  };

  $: camp = campId ? CAMPAIGNS[campId] : null;

  const CAMP_ORDER = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'];

  const MODES = [
    { id: 'standard',  label: 'Condensed Standard', tag: 'Recommended', sub: 'High Concept → Trouble → Relationship → leave the rest blank → play. Fastest path to the table.' },
    { id: 'trio',      label: 'Phase Trio',         tag: 'Enriched',    sub: 'Collaborative backstory workshop. Three phases produce all five aspects through shared stories. ~20 min extra.' },
    { id: 'flashback', label: 'Flashback Slots',    tag: 'Play-First',  sub: 'Start with High Concept + Trouble + top skill only. Discover the rest during play through flashback moments.' },
  ];

  function selectCamp(id) { campId = id; }
  function selectMode(id) { mode = id; }
</script>

<svelte:head>
  <title>Session Zero — Ogma</title>
  <meta name="description" content="Step-by-step Fate Condensed character creation wizard for your whole table." />
</svelte:head>

<div class="land-shell">
  <a href="#main" class="skip-link">Skip to main content</a>

  <header class="land-topnav topbar" role="banner">
    <a href="/" class="topbar-wordmark" aria-label="Ogma home">OGMA</a>
    <div class="topbar-spacer" style="flex:1"></div>
    <div class="topbar-status">
      <a href="/help" class="btn btn-ghost topbar-nav-btn" style="font-size:13px;text-decoration:none">&#128218; Help</a>
      <a href="/about" class="btn btn-ghost topbar-nav-btn" style="font-size:13px;text-decoration:none">About</a>
      <button class="btn btn-icon btn-ghost" on:click={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        style="width:44px;height:44px">{theme === 'dark' ? '☀️' : '◑'}</button>
    </div>
  </header>

  <div class="sz-container" id="main">
    {#if step === 0}
      <div class="sz-header">
        <div class="sz-title">Session Zero</div>
        <div class="sz-subtitle">Fate Condensed Character Creation Wizard</div>
      </div>
    {/if}

    <!-- Progress bar -->
    <div class="sz-step-counter">Step {step + 1} of {totalSteps}</div>
    <div style="width:100%; height:3px; border-radius:2px; background:var(--border); margin-bottom:12px; overflow:hidden">
      <div style="width:{progress}%; height:100%; border-radius:2px; background:var(--accent, var(--gold, #888)); transition:width 0.3s ease"></div>
    </div>

    <!-- Step content -->
    <div class="sz-step-title">{STEPS[step].title}</div>

    {#if stepId === 'campaign'}
      <div class="sz-body">
        <p>Which world are you playing in? This determines the setting details, example aspects, and story prompts throughout the wizard.</p>
        <div style="display:flex; align-items:flex-start; gap:10px; padding:10px 14px; background:var(--glass-bg); border:1px solid var(--glass-border); border-radius:var(--glass-radius); margin:8px 0 4px; font-size:var(--text-sm); color:var(--text-dim); line-height:1.6">
          <span style="font-size:18px; flex-shrink:0">&#128161;</span>
          <span><strong style="color:var(--text); font-weight:600">Works solo or with your full table. </strong>Run it alone to prep your campaign and print character sheets, or share your screen and walk through it together as a group.</span>
        </div>
      </div>
      <div class="sz-grid sz-grid-2">
        {#each CAMP_ORDER as id}
          <button class="sz-option" class:selected={campId === id} on:click={() => selectCamp(id)} type="button">
            <div class="sz-option-title">{CAMPAIGNS[id].name}</div>
            <div class="sz-option-sub">{CAMPAIGNS[id].tagline.split('.')[0]}.</div>
          </button>
        {/each}
      </div>

    {:else if stepId === 'mode'}
      <div class="sz-body">
        <p>All three methods produce valid Fate Condensed characters. Choose based on how much time you have and how much pre-play collaboration your group wants.</p>
      </div>
      <div class="sz-grid">
        {#each MODES as md}
          <button class="sz-option" class:selected={mode === md.id} on:click={() => selectMode(md.id)} type="button" style="text-align:left">
            <div class="sz-option-tag">{md.tag}</div>
            <div class="sz-option-title">{md.label}</div>
            <div class="sz-option-sub">{md.sub}</div>
          </button>
        {/each}
      </div>
    {:else if stepId === 'setting'}
      <div class="sz-body"><p>World setting and issues. (Content coming in next pass.)</p></div>
    {:else if stepId === 'aspects'}
      <div class="sz-body"><p>Character aspects. (Content coming in next pass.)</p></div>
    {:else if stepId === 'skills'}
      <div class="sz-body"><p>Skills and stunts. (Content coming in next pass.)</p></div>
    {:else if stepId === 'stress'}
      <div class="sz-body"><p>Stress and consequences. (Content coming in next pass.)</p></div>
    {:else if stepId === 'questions'}
      <div class="sz-body"><p>Session zero questions. (Content coming in next pass.)</p></div>
    {:else if stepId === 'summary'}
      <div class="sz-body"><p>Summary and export. (Content coming in next pass.)</p></div>
    {/if}

    <!-- Navigation -->
    <div class="sz-nav">
      {#if step > 0}
        <button class="btn btn-ghost" on:click={back}>&larr; Back</button>
      {:else}
        <div></div>
      {/if}
      {#if step < totalSteps - 1}
        <button class="btn btn-primary" on:click={next} disabled={stepId === 'campaign' && !campId}>Next &rarr;</button>
      {/if}
    </div>
  </div>

  <footer style="text-align:center; padding:20px; font-size:12px; color:var(--text-muted); border-top:1px solid var(--border); margin-top:20px">
    Fate&trade; is a trademark of Evil Hat Productions, LLC. &middot;
    <a href="/license" style="color:var(--text-muted)">License &amp; Attribution</a> &middot;
    <a href="/help" style="color:var(--text-muted)">Help &amp; Wiki</a> &middot;
    <a href="/about" style="color:var(--text-muted)">About Ogma</a>
  </footer>
</div>
