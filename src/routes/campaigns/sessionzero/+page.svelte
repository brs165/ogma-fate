<svelte:options runes={false} />

<script>
  import { onMount } from 'svelte';

  let theme = 'dark';
  let selectedWorld = null;
  let step = 1;

  const CAMPAIGN_INFO = {
    thelongafter: { name: 'The Long After', icon: '◈', genre: 'Sword & Planet' },
    cyberpunk:    { name: 'Neon Abyss', icon: '⬡', genre: 'Cyberpunk' },
    fantasy:      { name: 'Shattered Kingdoms', icon: '✦', genre: 'Dark Fantasy' },
    space:        { name: 'Void Runners', icon: '◯', genre: 'Space Western' },
    victorian:    { name: 'The Gaslight Chronicles', icon: '⊕', genre: 'Gothic Horror' },
    postapoc:     { name: 'The Long Road', icon: '◻', genre: 'Post-Apocalypse' },
    western:      { name: 'Dust and Iron', icon: '◈', genre: 'Frontier Western' },
    dVentiRealm:  { name: 'dVenti Realm', icon: '⬟', genre: 'High Fantasy' },
  };

  $: worlds = Object.entries(CAMPAIGN_INFO).map(([id, info]) => ({ id, ...info }));

  onMount(() => {
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

  function selectWorld(id) {
    selectedWorld = id;
  }

  function goToWorld() {
    if (selectedWorld) {
      window.location.href = '/campaigns/' + selectedWorld;
    }
  }
</script>

<svelte:head>
  <title>Prep Wizard — Ogma</title>
  <meta name="description" content="10-minute GM prep wizard for Fate Condensed. Start with a world, end with a session." />
</svelte:head>

<div class="land-shell">
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header class="land-topnav topbar" role="banner">
    <a href="/" class="topbar-wordmark" aria-label="Ogma home">OGMA</a>
    <div class="topbar-spacer" style="flex:1"></div>
    <div class="topbar-status">
      <a href="/help" class="btn btn-ghost topbar-nav-btn" style="font-size:13px;text-decoration:none">&#128218; Help</a>
      <button class="btn btn-icon btn-ghost" on:click={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        style="width:44px;height:44px">{theme === 'dark' ? '☀️' : '◑'}</button>
    </div>
  </header>

  <main id="main-content" style="flex:1;display:flex;flex-direction:column;align-items:center;padding:24px 16px 80px">
    <div style="width:100%;max-width:600px">
      <div style="font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:6px">STEP 1 OF 3</div>
      <h1 style="font-size:26px;font-weight:800;letter-spacing:-.025em;color:var(--text);margin-bottom:8px;line-height:1.2">Choose your world</h1>
      <p style="font-size:13px;color:var(--text-dim);line-height:1.65;margin-bottom:24px">Pick the campaign setting for this session. Each world has its own tone, NPCs, and themes.</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:24px">
        {#each worlds as w (w.id)}
          <button
            style="background:{selectedWorld === w.id ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'var(--glass-bg)'};border:1px solid {selectedWorld === w.id ? 'var(--accent)' : 'var(--glass-border)'};border-radius:10px;padding:14px;cursor:pointer;text-align:left;font-family:var(--font-ui);{selectedWorld === w.id ? 'box-shadow:0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent)' : ''}"
            on:click={() => selectWorld(w.id)}
            aria-pressed={String(selectedWorld === w.id)}
          >
            <div style="font-size:22px;margin-bottom:6px">{w.icon}</div>
            <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px">{w.name}</div>
            <div style="font-size:10px;color:var(--text-muted)">{w.genre}</div>
          </button>
        {/each}
      </div>

      {#if selectedWorld}
        <button
          style="width:100%;padding:14px;background:var(--accent);color:#000;font-weight:700;font-size:15px;border:none;border-radius:100px;cursor:pointer"
          on:click={goToWorld}
        >
          Open {CAMPAIGN_INFO[selectedWorld].name} &rarr;
        </button>
      {/if}
    </div>
  </main>

  <footer class="land-footer">
    <div class="land-footer-inner">
      <div style="font-style:italic;color:var(--text-muted);margin-bottom:4px">
        <strong>O</strong>n-demand <strong>G</strong>enerator for <strong>M</strong>asterful <strong>A</strong>dventures
      </div>
      <div>
        <a href="/license">Full Attribution</a> &middot;
        <a href="/help">&#128218; Help</a> &middot;
        <a href="/about">About</a>
      </div>
    </div>
  </footer>
</div>
