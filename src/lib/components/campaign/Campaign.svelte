<svelte:options runes={false} />

<script>
  import { onMount, onDestroy } from 'svelte';
  import { GENERATORS } from '../../engine.js';
  import { CAMPAIGNS } from '../../../data/shared.js';
  import { createSessionStore } from '../../stores/sessionStore.js';
  import { createChromeStore } from '../../stores/chromeStore.js';
  import DB from '../../db.js';
  import Cv4Card from '../cards/Cv4Card.svelte';
  import Board from '../board/Board.svelte';

  export let campId = 'fantasy';

  // ── Derived ────────────────────────────────────────────────────────────────
  $: camp = CAMPAIGNS[campId] || { meta: { name: campId, icon: '\u25C8' }, tables: {}, colors: {} };
  $: campName = camp.meta ? camp.meta.name : campId;

  // ── Local state ────────────────────────────────────────────────────────────
  let theme = 'dark';
  let showSidebar = false;
  let sbAcc = 'generate';
  let canvasView = false;
  let prefs = { excluded: {}, locked: {}, custom: {} };
  let universalMerge = true;
  let gmMode = true;

  // ── Stores ─────────────────────────────────────────────────────────────────
  let chrome;
  let session;
  let unsubs = [];

  // Reactive values from stores
  let toast = null;
  let isOnline = true;
  let activeGen = 'npc_minor';
  let result = null;
  let rolling = false;
  let pinnedCards = [];
  let pinBouncing = false;
  let sessionPack = null;
  let resultAnim = false;

  function initStores() {
    unsubs.forEach(u => u());
    unsubs = [];

    chrome = createChromeStore(campId);
    session = createSessionStore(campId, camp.meta, camp.tables || {}, prefs, chrome.showToast);

    unsubs.push(chrome.toast.subscribe(v => toast = v));
    unsubs.push(chrome.isOnline.subscribe(v => isOnline = v));
    unsubs.push(session.activeGen.subscribe(v => activeGen = v));
    unsubs.push(session.result.subscribe(v => result = v));
    unsubs.push(session.rolling.subscribe(v => rolling = v));
    unsubs.push(session.pinnedCards.subscribe(v => pinnedCards = v));
    unsubs.push(session.pinBouncing.subscribe(v => pinBouncing = v));
    unsubs.push(session.sessionPack.subscribe(v => sessionPack = v));
    unsubs.push(session.resultAnim.subscribe(v => resultAnim = v));
  }

  $: gen = GENERATORS.find(g => g.id === activeGen) || GENERATORS[0];

  // ── Generator groups for sidebar ──────────────────────────────────────────
  const GENERATOR_GROUPS = [
    { id: 'people', label: 'People', gens: ['npc_minor', 'npc_major', 'pc', 'backstory'] },
    { id: 'scene', label: 'Scene', gens: ['scene', 'encounter', 'complication'] },
    { id: 'story', label: 'Story', gens: ['seed', 'campaign', 'faction'] },
    { id: 'mechanics', label: 'Mechanics', gens: ['compel', 'consequence', 'challenge', 'contest', 'obstacle', 'countdown', 'constraint'] },
  ];

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  onMount(() => {
    initStores();
    chrome.init();

    // Theme
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      theme = p.theme || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}

    // Campaign data attr
    document.documentElement.setAttribute('data-campaign', campId);

    // GM mode
    try { gmMode = (JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}').gm_mode !== false); } catch (e) {}
    document.documentElement.setAttribute('data-gm-mode', gmMode ? 'on' : 'off');

    // Keyboard shortcuts
    document.addEventListener('keydown', onKey);

    // Check canvas param
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('canvas') === '1') canvasView = true;
    } catch (e) {}
  });

  onDestroy(() => {
    unsubs.forEach(u => u());
    if (session) session.destroy();
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', onKey);
      document.documentElement.removeAttribute('data-campaign');
    }
  });

  // ── Theme ──────────────────────────────────────────────────────────────────
  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      p.theme = theme;
      localStorage.setItem('fate_prefs_v1', JSON.stringify(p));
    } catch (e) {}
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  function doGenerate() { if (session && !rolling) session.doGenerate(); }
  function doInspire() { if (session && !rolling) session.doInspire(); }
  function pinResult() { if (session) session.pinResult(); }

  function selectGen(genId) {
    if (session) session.selectGen(genId);
    showSidebar = false;
  }

  function toggleAcc(s) { sbAcc = sbAcc === s ? null : s; }

  function openCanvas() { canvasView = true; showSidebar = false; }
  function closeCanvas() { canvasView = false; }

  // ── Keyboard ───────────────────────────────────────────────────────────────
  function onKey(e) {
    const tag = (e.target || {}).tagName || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'Escape') { showSidebar = false; return; }
    if (e.code === 'Space' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      doGenerate();
    } else if (e.key === 'p' || e.key === 'P') {
      if (result) pinResult();
    } else if (e.key === 'i' || e.key === 'I') {
      doInspire();
    }
  }
</script>

<div class="app-shell" data-gen={activeGen}>
  <a href="#main" class="skip-link">Skip to main content</a>

  <!-- Mobile slim bar -->
  <header class="sb-slim-bar">
    <button
      class="btn btn-icon btn-ghost sb-hamburger"
      on:click={() => { showSidebar = !showSidebar; }}
      aria-label={showSidebar ? 'Close menu' : 'Open menu'}
      aria-expanded={String(showSidebar)}
    >{showSidebar ? '\u2715' : '\u2630'}</button>
    <span class="sb-slim-world">{campName}</span>
    <span class="sb-slim-gen" aria-hidden="true">{gen ? gen.label : ''}</span>
    <button
      class="btn btn-icon btn-ghost"
      on:click={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style="width:44px;height:44px;margin-left:auto"
    >{theme === 'dark' ? '\u2600' : '\u25D1'}</button>
  </header>

  <!-- App body: sidebar + content -->
  <div class="app-body">

    {#if showSidebar}
      <div class="sidebar-backdrop" on:click={() => { showSidebar = false; }} aria-hidden="true"></div>
    {/if}

    <!-- Sidebar -->
    <nav class="sidebar" class:sidebar-open={showSidebar} aria-label="Generators and tools">
      <div class="sb-header">
        <a href="/" class="sb-wordmark" aria-label="Ogma home">OGMA</a>
        <span class="sb-world-chip">{campName}</span>
      </div>

      <div class="sb-acc" role="navigation" aria-label="Campaign navigation">

        <!-- PLAY section -->
        <div class="sb-acc-sec">
          <button
            class="sb-acc-hdr" class:is-open={sbAcc === 'play'}
            on:click={() => toggleAcc('play')}
            aria-expanded={String(sbAcc === 'play')}
          >
            <span aria-hidden="true" class="sb-acc-sec-ico">&#x25B6;</span>
            <span class="sb-acc-sec-name">Play</span>
            <span aria-hidden="true" class="sb-acc-meta">{isOnline ? 'online' : 'offline'}</span>
            <span aria-hidden="true" class="sb-acc-chev">&#x203A;</span>
          </button>
          {#if sbAcc === 'play'}
            <div class="sb-acc-body" role="group" aria-label="Play tools">
              <button class="sb-acc-item" class:active={canvasView} on:click={openCanvas} aria-pressed={String(canvasView)}>
                <span aria-hidden="true" class="sidebar-item-icon">&#x25A6;</span>
                <span class="sidebar-item-label">Prep & Play</span>
                {#if pinnedCards.length > 0}
                  <span class="sb-count-badge" aria-hidden="true">{pinnedCards.length}</span>
                {/if}
              </button>
              <button class="sb-acc-item" on:click={() => { canvasView = true; showSidebar = false; }}>
                <span aria-hidden="true" class="sidebar-item-icon">&#x2193;</span>
                <span class="sidebar-item-label">Export Cards</span>
              </button>
              <button class="sb-acc-item" on:click={() => { showSidebar = false; }}>
                <span aria-hidden="true" class="sidebar-item-icon">&#x1F4DD;</span>
                <span class="sidebar-item-label">Session Notes</span>
              </button>
            </div>
          {/if}
        </div>

        <!-- GENERATE section -->
        <div class="sb-acc-sec">
          <button
            class="sb-acc-hdr" class:is-open={sbAcc === 'generate'}
            on:click={() => toggleAcc('generate')}
            aria-expanded={String(sbAcc === 'generate')}
          >
            <span aria-hidden="true" class="sb-acc-sec-ico">&#x1F3B2;</span>
            <span class="sb-acc-sec-name">Generate</span>
            <span aria-hidden="true" class="sb-acc-meta">{gen ? gen.label.split(' ').slice(0, 2).join(' ') : ''}</span>
            <span aria-hidden="true" class="sb-acc-chev">&#x203A;</span>
          </button>
          {#if sbAcc === 'generate'}
            <div class="sb-acc-body sb-acc-generate-body" role="group" aria-label="Generators">
              {#each GENERATOR_GROUPS as group (group.id)}
                <div class="sb-acc-group-lbl">{group.label}</div>
                {#each group.gens as genId (genId)}
                  {@const g = GENERATORS.find(x => x.id === genId)}
                  {#if g}
                    <button
                      class="sb-acc-item sb-acc-gen" class:active={activeGen === genId}
                      on:click={() => selectGen(genId)}
                      aria-label={g.label}
                    >
                      <span aria-hidden="true" class="sidebar-item-icon">{g.icon || ''}</span>
                      <span class="sidebar-item-label">{g.label}</span>
                    </button>
                  {/if}
                {/each}
              {/each}
            </div>
          {/if}
        </div>

        <!-- SETTINGS section -->
        <div class="sb-acc-sec sb-acc-sec-settings">
          <button
            class="sb-acc-hdr sb-acc-hdr-settings" class:is-open={sbAcc === 'settings'}
            on:click={() => toggleAcc('settings')}
            aria-expanded={String(sbAcc === 'settings')}
          >
            <span aria-hidden="true" class="sb-acc-sec-ico sb-acc-sec-ico-sm">&#x2699;</span>
            <span class="sb-acc-sec-name sb-acc-sec-name-muted">Settings</span>
            <span aria-hidden="true" class="sb-acc-chev">&#x203A;</span>
          </button>
          {#if sbAcc === 'settings'}
            <div class="sb-acc-body" role="group" aria-label="Settings">
              <button class="sb-acc-item" on:click={toggleTheme}>
                <span aria-hidden="true" class="sidebar-item-icon">{theme === 'dark' ? '\u2600' : '\u25D1'}</span>
                <span class="sidebar-item-label">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              </button>
              <a href="/help" class="sb-acc-item" style="text-decoration:none">
                <span aria-hidden="true" class="sidebar-item-icon">&#x1F4D6;</span>
                <span class="sidebar-item-label">Help &amp; Wiki</span>
              </a>
              <a href="/about" class="sb-acc-item" style="text-decoration:none">
                <span aria-hidden="true" class="sidebar-item-icon">&#x2139;</span>
                <span class="sidebar-item-label">About</span>
              </a>
              <a href="/license" class="sb-acc-item" style="text-decoration:none">
                <span aria-hidden="true" class="sidebar-item-icon">&#xa9;</span>
                <span class="sidebar-item-label">License</span>
              </a>
            </div>
          {/if}
        </div>
      </div>

      <div style="height:8px;flex-shrink:0"></div>

      <!-- Dock -->
      <div class="sb-dock" role="toolbar" aria-label="Site navigation and status">
        <a href="/help/learn-fate" class="sb-dock-btn" aria-label="Learn Fate">
          <span aria-hidden="true" class="sb-dock-ico">&#x1F4D6;</span>
          <span class="sb-dock-lbl">Learn</span>
        </a>
        <a href="/" class="sb-dock-btn" aria-label="All Worlds">
          <span aria-hidden="true" class="sb-dock-ico">&#x1F30D;</span>
          <span class="sb-dock-lbl">Worlds</span>
        </a>
        <div class="sb-dock-btn sb-dock-status" role="status" aria-live="polite" aria-label={isOnline ? 'Online' : 'Offline'} tabindex="-1">
          <span aria-hidden="true" class="sb-status-dot" class:offline={!isOnline}></span>
          <span class="sb-dock-lbl" style="color:{isOnline ? 'var(--c-green,#4CD964)' : 'var(--c-red,#E06060)'}">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>
    </nav>

    <!-- Main content panel -->
    <div class="content-panel">

      <!-- Canvas view: Board component -->
      {#if canvasView}
        <Board {campId} initialMode="prep" />
      {/if}

      <!-- Normal generate view -->
      {#if !canvasView}
        <main id="main">
          <div class="main-layout">

            <!-- Result panel -->
            <div id="result-panel" role="region" aria-label={result ? 'Generated ' + gen.label + ' result' : 'Ready to generate'} aria-live="polite" aria-atomic="true">
              <div class="result-panel" style="padding:0;overflow:hidden">

                <!-- Action bar -->
                <div class="action-bar">
                  <button
                    class="btn-roll action-bar-roll" class:rolling
                    on:click={doGenerate}
                    disabled={rolling}
                    aria-live="polite"
                    style="position:relative"
                  >
                    <span class="roll-label">
                      {#if rolling}
                        <span class="dice-spinning"><span aria-hidden="true">&#x1F3B2;</span></span> Rolling&hellip;
                      {:else}
                        <span aria-hidden="true">&#x1F3B2;</span> Roll {gen ? gen.label : ''}
                      {/if}
                    </span>
                  </button>

                  <!-- Pin -->
                  <div class="action-bar-secondary">
                    {#if result}
                      <button
                        class="btn btn-ghost action-bar-icon" class:pin-bounce={pinBouncing}
                        on:click={pinResult}
                        title="Save to Table Prep [P]"
                        aria-label="Save to Table Prep{pinnedCards.length > 0 ? ' (' + pinnedCards.length + ' saved)' : ''}"
                        style="position:relative"
                      >
                        &#x1F4CC;
                        {#if pinnedCards.length > 0}
                          <span aria-hidden="true" style="position:absolute;top:1px;right:1px;width:14px;height:14px;border-radius:50%;background:var(--accent);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center">
                            {pinnedCards.length > 9 ? '9+' : pinnedCards.length}
                          </span>
                        {/if}
                      </button>
                    {/if}
                  </div>
                </div>

                <!-- Result display -->
                {#if result}
                  <div class={resultAnim ? 'result-card-appear' : ''}>
                    <div style="padding:16px">
                      <Cv4Card
                        genId={result.genId}
                        data={result.data}
                        campName={campName}
                      />
                    </div>
                  </div>
                {:else}
                  <div style="padding:40px 20px;text-align:center;color:var(--text-muted)">
                    <div style="font-size:48px;margin-bottom:12px">&#x1F3B2;</div>
                    <div style="font-size:16px;font-weight:700;margin-bottom:6px">Ready to generate</div>
                    <div style="font-size:13px">Click <strong>Roll</strong> or press <strong>Space</strong> to generate a {gen ? gen.label : 'result'}.</div>
                  </div>
                {/if}
              </div>
            </div>

          </div>
        </main>
      {/if}
    </div>
  </div>

  <!-- Toast -->
  {#if toast}
    <div class="board-toast" style="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999">{toast}</div>
  {/if}
</div>
