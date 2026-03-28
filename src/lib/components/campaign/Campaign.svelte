<script>
  import { onMount, onDestroy } from 'svelte';
  import { GENERATORS } from '../../engine.js';
  import { CAMPAIGNS, HELP_CONTENT } from '../../../data/shared.js';
  import { createSessionStore } from '../../stores/sessionStore.js';
  import { createChromeStore } from '../../stores/chromeStore.js';
  import DB, { LS } from '../../db.js';
  import Cv4Card from '../cards/Cv4Card.svelte';
  import Board from '../board/Board.svelte';
  import { Collapsible } from 'bits-ui';

  let { campId = 'fantasy' } = $props();

  // ── Derived ────────────────────────────────────────────────────────────────
  let camp = $derived(CAMPAIGNS[campId] || { meta: { name: campId, icon: 'fa-dice-d20' }, tables: {}, colors: {} });
  let campName = $derived(camp.meta ? camp.meta.name : campId);

  // ── Local state ────────────────────────────────────────────────────────────
  let theme = $state('dark');
  let showSidebar = $state(false);
  let sbAcc = $state('generate');
  let prefs = { excluded: {}, locked: {}, custom: {} };
  let universalMerge = $state(true);
  let gmMode = $state(true);

  // ── Split layout state ─────────────────────────────────────────────────────
  // tableFull: generator hidden, table takes all content area
  // tableOpen: on mobile, whether the bottom-sheet table is visible
  let tableFull  = $state(false);
  let tableOpen  = $state(false); // mobile only
  let boardRef   = $state();      // bind:this on Board for sendToTable etc

  // Split ratio: fraction of content-panel width for generator column (0.3–0.7)
  const RATIO_KEY = 'ogma_split_ratio_' + campId;
  let splitRatio = $state(() => {
    try { const v = parseFloat(localStorage.getItem(RATIO_KEY)); return (v >= 0.2 && v <= 0.8) ? v : 0.5; } catch { return 0.5; }
  });
  let draggingDivider = $state(false);
  let splitRoot = $state(); // bind:this on .cp-split-root

  function onDividerPointerDown(e) {
    if (tableFull) return;
    e.preventDefault();
    draggingDivider = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onDividerPointerMove(e) {
    if (!draggingDivider || !splitRoot) return;
    const rect = splitRoot.getBoundingClientRect();
    let ratio = (e.clientX - rect.left) / rect.width;
    // Snap to thirds
    const SNAPS = [0.3, 0.5, 0.7];
    const snapped = SNAPS.find(s => Math.abs(ratio - s) < 0.04);
    ratio = snapped ?? Math.max(0.2, Math.min(0.8, ratio));
    splitRatio = ratio;
  }
  function onDividerPointerUp() {
    if (!draggingDivider) return;
    draggingDivider = false;
    try { localStorage.setItem(RATIO_KEY, String(splitRatio)); } catch {}
  }

  // ── Stores ─────────────────────────────────────────────────────────────────
  let chrome = $state();
  let session = $state();
  let unsubs = [];

  // Reactive values from stores
  let toast = $state(null);
  let isOnline = $state(true);
  let activeGen = $state('seed');
  let result = $state(null);
  let rolling = $state(false);
  let consequenceSev = $state('');
  let pinBouncing = $state(false);
  let sessionPack = $state(null);
  let resultAnim = $state(false);
  let showStreakBadge = $state(false);

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
    unsubs.push(session.pinBouncing.subscribe(v => pinBouncing = v));
    unsubs.push(session.sessionPack.subscribe(v => sessionPack = v));
    unsubs.push(session.resultAnim.subscribe(v => resultAnim = v));
    unsubs.push(session.showStreakBadge.subscribe(v => showStreakBadge = v));
    if (session.consequenceSev) unsubs.push(session.consequenceSev.subscribe(v => consequenceSev = v));
  }

  let gen = $derived(GENERATORS.find(g => g.id === activeGen) || GENERATORS[0]);
  let helpEntry = $derived(HELP_CONTENT[activeGen] || null);

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
      theme = LS.get('theme') || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}

    // Campaign data attr
    document.documentElement.setAttribute('data-campaign', campId);

    // GM mode
    try { gmMode = (LS.get('gm_mode') !== false); } catch (e) {}
    document.documentElement.setAttribute('data-gm-mode', gmMode ? 'on' : 'off');

    // Keyboard shortcuts
    document.addEventListener('keydown', onKey);

    // Check canvas param
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('table') === '1') tableFull = true;
    } catch (e) {}

    // Session Zero auto-populate (legacy path)
    try {
      const szRaw = localStorage.getItem('ogma_sz_seed');
      const szParams = new URLSearchParams(window.location.search);
      if (szRaw && szParams.get('sz') === '1') {
        const seed = JSON.parse(szRaw);
        localStorage.removeItem('ogma_sz_seed');
        if (seed.campId === campId && seed._sz_auto_pc) {
          setTimeout(() => {
            import('../../engine.js').then(({ generate: gen, mergeUniversal: mu, filteredTables: ft }) => {
              const campData = CAMPAIGNS[campId];
              if (!campData || !campData.tables) return;
              const tables = ft(mu(campData.tables), {});
              const pcData = gen('pc', tables, 4, {});
              window.dispatchEvent(new CustomEvent('ogma:sz-pc', { detail: { genId: 'pc', data: pcData } }));
            }).catch(e => console.warn('[Ogma] sz generate failed:', e));
          }, 400);
        }
      }
    } catch(e) {
      console.warn('[Ogma] sz seed read failed:', e);
    }

    // Session Zero handoff — Send All to Table path
    try {
      const szParams = new URLSearchParams(window.location.search);
      if (szParams.get('sz') === '1') {
        const handoffRaw = sessionStorage.getItem('ogma_sz_handoff');
        if (handoffRaw) {
          sessionStorage.removeItem('ogma_sz_handoff');
          const handoff = JSON.parse(handoffRaw);
          if (handoff.campId === campId && Array.isArray(handoff.cards) && handoff.cards.length) {
            // Dispatch after board has mounted and canvasStore is ready
            setTimeout(() => {
              handoff.cards.forEach((c, i) => {
                setTimeout(() => {
                  if (boardRef) boardRef.sendToTable(c.genId, c.data);
                }, i * 80); // stagger so cards land in a readable grid
              });
            }, 500);
          }
        }
      }
    } catch(e) {
      console.warn('[Ogma] sz handoff failed:', e);
    }
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
    LS.set('theme', theme);
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  function doGenerate() { if (session && !rolling) session.doGenerate(); }
  function doInspire() { if (session && !rolling) session.doInspire(); }

  function selectGen(genId) {
    if (session) session.selectGen(genId);
    showSidebar = false;
  }

  function toggleAcc(s) { sbAcc = sbAcc === s ? null : s; }

  function toggleTableFull() { tableFull = !tableFull; }
  function sendToTable() {
    if (result && boardRef) boardRef.sendToTable(result.genId, result.data);
  }

  // ── Keyboard ───────────────────────────────────────────────────────────────
  function onKey(e) {
    const tag = (e.target || {}).tagName || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'Escape') { showSidebar = false; return; }
    if (e.code === 'Space' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      doGenerate();
    } else if (e.key === 'p' || e.key === 'P') {
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
      onclick={() => { showSidebar = !showSidebar; }}
      aria-label={showSidebar ? 'Close menu' : 'Open menu'}
      aria-expanded={String(showSidebar)}
    >{showSidebar ? '\u2715' : '\u2630'}</button>
    <span class="sb-slim-world">{campName}</span>
    <span class="sb-slim-gen" aria-hidden="true">{gen ? gen.label : ''}</span>
    <button
      class="btn btn-icon btn-ghost"
      onclick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style="width:44px;height:44px;margin-left:auto"
    >{theme === 'dark' ? '\u2600' : '\u25D1'}</button>
  </header>

  <!-- App body: sidebar + content -->
  <div class="app-body">

    {#if showSidebar}
      <div class="sidebar-backdrop" onclick={() => { showSidebar = false; }} aria-hidden="true"></div>
    {/if}

    <!-- Sidebar -->
    <nav class="sidebar" class:sidebar-open={showSidebar} aria-label="Generators and tools">
      <div class="sb-header">
        <a href="/" class="sb-wordmark" aria-label="Ogma home">OGMA</a>
        <span class="sb-world-chip">{campName}</span>
      </div>

      <div class="sb-acc" role="navigation" aria-label="Campaign navigation">

        <!-- TABLE section -->
        <Collapsible.Root open={sbAcc === 'table'} onOpenChange={(o) => { sbAcc = o ? 'table' : null; }} class="sb-acc-sec">
          <Collapsible.Trigger class="sb-acc-hdr{sbAcc === 'table' ? ' is-open' : ''}">
            <span aria-hidden="true" class="sb-acc-sec-ico"><i class="fa-solid fa-table-cells"></i></span>
            <span class="sb-acc-sec-name">Table</span>
          </Collapsible.Trigger>
          <Collapsible.Content class="sb-acc-body">
            <button class="sb-acc-item" onclick={toggleTableFull} aria-pressed={String(tableFull)}>
              <span aria-hidden="true" class="sidebar-item-icon"><i class="fa-solid {tableFull ? 'fa-compress' : 'fa-expand'}"></i></span>
              <span class="sidebar-item-label">{tableFull ? 'Split view' : 'Full Table'}</span>
            </button>
            <button class="sb-acc-item sb-mobile-only" onclick={() => { tableOpen = !tableOpen; showSidebar = false; }}>
              <span aria-hidden="true" class="sidebar-item-icon"><i class="fa-solid fa-mobile-screen"></i></span>
              <span class="sidebar-item-label">Table on mobile</span>
            </button>
          </Collapsible.Content>
        </Collapsible.Root>

        <!-- GENERATE section -->
        <Collapsible.Root open={sbAcc === 'generate'} onOpenChange={(o) => { sbAcc = o ? 'generate' : null; }} class="sb-acc-sec">
          <Collapsible.Trigger class="sb-acc-hdr{sbAcc === 'generate' ? ' is-open' : ''}">
            <span aria-hidden="true" class="sb-acc-sec-ico"><i class="fa-solid fa-dice-d20"></i></span>
            <span class="sb-acc-sec-name">Generate</span>
            <span aria-hidden="true" class="sb-acc-meta">{gen ? gen.label.split(' ').slice(0, 2).join(' ') : ''}</span>
          </Collapsible.Trigger>
          <Collapsible.Content class="sb-acc-body sb-acc-generate-body">
            {#each GENERATOR_GROUPS as group (group.id)}
              <div class="sb-acc-group-lbl">{group.label}</div>
              {#each group.gens as genId (genId)}
                {@const g = GENERATORS.find(x => x.id === genId)}
                  {#if g}
                    <button
                      class="sb-acc-item sb-acc-gen" class:active={activeGen === genId}
                      onclick={() => selectGen(genId)}
                      aria-label={g.label}
                    >
                      <span aria-hidden="true" class="sidebar-item-icon">{#if g.icon}<i class="fa-solid {g.icon}"></i>{/if}</span>
                      <span class="sidebar-item-label">{g.label}</span>
                    </button>
                  {/if}
                {/each}
              {/each}
          </Collapsible.Content>
        </Collapsible.Root>

        <!-- SETTINGS section -->
        <Collapsible.Root open={sbAcc === 'settings'} onOpenChange={(o) => { sbAcc = o ? 'settings' : null; }} class="sb-acc-sec sb-acc-sec-settings">
          <Collapsible.Trigger class="sb-acc-hdr sb-acc-hdr-settings{sbAcc === 'settings' ? ' is-open' : ''}">
            <span aria-hidden="true" class="sb-acc-sec-ico sb-acc-sec-ico-sm"><i class="fa-solid fa-gear"></i></span>
            <span class="sb-acc-sec-name sb-acc-sec-name-muted">Settings</span>
          </Collapsible.Trigger>
          <Collapsible.Content class="sb-acc-body">
            <button class="sb-acc-item" onclick={toggleTheme}>
              <span aria-hidden="true" class="sidebar-item-icon"><i class="fa-solid {theme === 'dark' ? 'fa-sun' : 'fa-circle-half-stroke'}"></i></span>
              <span class="sidebar-item-label">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </button>
            <a href="/help" class="sb-acc-item" style="text-decoration:none">
              <span aria-hidden="true" class="sidebar-item-icon"><i class="fa-solid fa-book-open"></i></span>
              <span class="sidebar-item-label">Help &amp; Wiki</span>
            </a>
            <a href="/about" class="sb-acc-item" style="text-decoration:none">
              <span aria-hidden="true" class="sidebar-item-icon"><i class="fa-solid fa-circle-info"></i></span>
              <span class="sidebar-item-label">About</span>
            </a>
            <a href="/license" class="sb-acc-item" style="text-decoration:none">
              <span aria-hidden="true" class="sidebar-item-icon"><i class="fa-regular fa-copyright"></i></span>
              <span class="sidebar-item-label">License</span>
            </a>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>

      <div style="height:8px;flex-shrink:0"></div>

      <!-- Dock -->
      <div class="sb-dock" role="toolbar" aria-label="Site navigation and status">
        <a href="/help/learn-fate" class="sb-dock-btn" aria-label="Learn Fate">
          <span aria-hidden="true" class="sb-dock-ico"><i class="fa-solid fa-book-open"></i></span>
          <span class="sb-dock-lbl">Learn</span>
        </a>
        <a href="/help/reference" class="sb-dock-btn" target="_blank" rel="noopener" aria-label="Print reference card">
          <span aria-hidden="true" class="sb-dock-ico"><i class="fa-solid fa-print"></i></span>
          <span class="sb-dock-lbl">Ref</span>
        </a>
        <a href="/" class="sb-dock-btn" aria-label="All Worlds">
          <span aria-hidden="true" class="sb-dock-ico"><i class="fa-solid fa-earth-americas"></i></span>
          <span class="sb-dock-lbl">Worlds</span>
        </a>
        <div class="sb-dock-btn sb-dock-status" role="status" aria-live="polite" aria-label={isOnline ? 'Online' : 'Offline'} tabindex="-1">
          <span aria-hidden="true" class="sb-status-dot" class:offline={!isOnline}></span>
          <span class="sb-dock-lbl" style="color:{isOnline ? 'var(--c-green,#4CD964)' : 'var(--c-red,#E06060)'}">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>
    </nav>

    <!-- Main content panel — split: generator | table -->
    <div
      class="content-panel cp-split-root"
      class:cp-table-full={tableFull}
      class:cp-divider-dragging={draggingDivider}
      bind:this={splitRoot}
      style={!tableFull ? `--cp-gen-width:${(splitRatio * 100).toFixed(1)}%` : ''}
    >

      <!-- Generator column -->
      <div class="cp-gen-col">
        <!-- Strip header: generator label + full-table toggle -->
        <div class="cp-gen-hdr">
          <span class="cp-gen-hdr-label">{gen ? gen.label : 'Generate'}</span>
          <button class="cp-full-btn btn btn-ghost btn-icon" onclick={toggleTableFull}
            title={tableFull ? 'Split view' : 'Full Table'}
            aria-label={tableFull ? 'Split view' : 'Expand Table'}
          ><i class="fa-solid fa-{tableFull ? 'compress' : 'expand'}" aria-hidden="true"></i></button>
        </div>

        <main id="main" class="cp-gen-scroll">
          <div class="main-layout cp-gen-layout">

            <!-- Result panel -->
            <div id="result-panel" role="region" aria-label={result ? 'Generated ' + gen.label + ' result' : 'Ready to generate'} aria-live="polite" aria-atomic="true">
              <div class="result-panel" style="padding:0;overflow:hidden">

                <!-- Action bar -->
                <div class="action-bar">
                  <button
                    class="btn-roll action-bar-roll" class:rolling
                    onclick={doGenerate}
                    disabled={rolling}
                    aria-live="polite"
                    style="position:relative"
                  >
                    <span class="roll-label">
                      {#if rolling}
                        <span class="dice-spinning"><span aria-hidden="true">&#x1F3B2;</span></span> Rolling&hellip;
                      {:else}
                        <span aria-hidden="true"><i class="fa-solid fa-dice-d20"></i></span> Roll {gen ? gen.label : ''}
                      {/if}
                    </span>
                    {#if showStreakBadge}
                      <span class="streak-badge" aria-live="polite" aria-label="On a roll!">🔥 On a roll!</span>
                    {/if}
                  </button>

                  <!-- Secondary actions -->
                  <div class="action-bar-secondary">
                    {#if result}
                      <!-- → Table -->
                      <button
                        class="btn btn-ghost action-bar-icon cp-to-table-btn"
                        onclick={sendToTable}
                        title="Send to Table"
                        aria-label="Send to Table"
                      ><i class="fa-solid fa-arrow-right" aria-hidden="true"></i> Table</button>

                    {/if}
                  </div>
                </div>

                <!-- Consequence severity picker -->
                {#if activeGen === 'consequence'}
                  <div class="sev-picker" role="group" aria-label="Consequence severity">
                    {#each [
                      { id: '',         label: 'Any',      color: 'var(--text-muted)' },
                      { id: 'mild',     label: 'Mild',     color: 'var(--c-blue)'     },
                      { id: 'moderate', label: 'Moderate', color: 'var(--gold)'       },
                      { id: 'severe',   label: 'Severe',   color: 'var(--c-red)'      },
                    ] as sev}
                      <button
                        class="sev-btn"
                        class:sev-active={consequenceSev === sev.id}
                        style="--sev-color:{sev.color}"
                        onclick={() => session.consequenceSev.set(sev.id)}
                        aria-pressed={String(consequenceSev === sev.id)}
                      >{sev.label}</button>
                    {/each}
                  </div>
                {/if}

                <!-- Result display -->
                {#if result}
                  <div class={resultAnim ? 'result-card-appear' : ''}>
                    {#if result.isSeedPack && result.pack}
                      <div class="seed-pack-header">
                        <span class="seed-pack-title"><i class="fa-solid fa-square-plus" aria-hidden="true"></i> Adventure Seed Pack</span>
                        <span class="seed-pack-count">{result.pack.length} cards</span>
                        <button class="btn btn-ghost seed-pack-pin-all"
                          onclick={() => { result.pack.forEach(item => { if (boardRef) boardRef.sendToTable(item.genId, item.data); }); }}
                          title="Send all to Table"
                        >→ Table All</button>
                      </div>
                      <div class="seed-pack-grid">
                        {#each result.pack as item, i (i)}
                          <div class="seed-pack-item">
                            {#if item.label}
                              <div class="seed-pack-item-label">{item.label}</div>
                            {/if}
                            <Cv4Card genId={item.genId} data={item.data} campName={campName} />
                          </div>
                        {/each}
                      </div>
                    {:else}
                      <div style="padding:16px">
                        <Cv4Card genId={result.genId} data={result.data} campName={campName} />
                      </div>
                    {/if}
                  </div>
                {:else}
                  <div class="rhp-empty-state">
                    <button class="rhp-ready-icon-btn" onclick={() => session.doGenerate()} aria-label="Generate {gen ? gen.label : 'result'}">
                      <div class="rhp-ready-icon" aria-hidden="true"><i class="fa-solid {gen ? gen.icon : 'fa-dice-d20'}"></i></div>
                    </button>
                    <div class="rhp-ready-title">Ready to generate</div>
                    <div class="rhp-ready-sub">
                      Click <strong>Roll</strong> or press <strong>Space</strong>
                      to generate a {gen ? gen.label : 'result'}.
                    </div>

                    {#if helpEntry}
                      <div class="rhp-shell">

                        {#if helpEntry.what}
                          <div class="rhp-block">
                            <div class="rhp-block-label">What this generates</div>
                            <div class="rhp-block-body">{helpEntry.what}</div>
                          </div>
                        {/if}

                        {#if helpEntry.gm_running || (helpEntry.gm_tips && helpEntry.gm_tips.length)}
                          <div class="rhp-block rhp-block--gm">
                            <div class="rhp-block-label">For the GM</div>
                            <div class="rhp-block-body">
                              {helpEntry.gm_running || helpEntry.gm_tips[0]}
                            </div>
                          </div>
                        {/if}

                        {#if helpEntry.rules && helpEntry.rules.length}
                          <div class="rhp-block">
                            <div class="rhp-block-label">Rules Reference &middot; Fate Condensed</div>
                            <ul class="rhp-rules-list">
                              {#each helpEntry.rules.slice(0, 3) as rule, i}
                                {@const srdPath = helpEntry.rule_urls?.[i] || null}
                                <li class="rhp-rule-row">
                                  <span class="rhp-rule-text">{rule}</span>
                                  {#if srdPath}
                                    <a href="https://fate-srd.com{srdPath}" class="rhp-srd-link" target="_blank" rel="noreferrer noopener" aria-label="Read on the Fate SRD (opens in new tab)">SRD <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px"></i></a>
                                  {/if}
                                </li>
                              {/each}
                            </ul>
                          </div>
                        {/if}

                        {#if helpEntry.dnd_notes}
                          <div class="rhp-block rhp-block--dnd">
                            <div class="rhp-block-label">Coming from D&amp;D?</div>
                            <div class="rhp-block-body">{helpEntry.dnd_notes}</div>
                          </div>
                        {/if}

                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>

          </div>
        </main>
      </div>

      <!-- Drag divider -->
      <div
        class="cp-divider"
        class:cp-divider-active={draggingDivider}
        aria-hidden="true"
        onpointerdown={onDividerPointerDown}
        onpointermove={onDividerPointerMove}
        onpointerup={onDividerPointerUp}
        onpointercancel={onDividerPointerUp}
      ></div>

      <!-- Table column — Board embedded -->
      <div class="cp-table-col">
        <Board
          bind:this={boardRef}
          {campId}
          embedded={true}
        />
      </div>

      <!-- Mobile Table bottom-sheet -->
      {#if tableOpen}
        <div class="cp-mobile-sheet-backdrop" onclick={() => { tableOpen = false; }} aria-hidden="true"></div>
        <div class="cp-mobile-sheet" role="dialog" aria-label="Table">
          <div class="cp-mobile-sheet-hdr">
            <span class="cp-mobile-sheet-title"><i class="fa-solid fa-table-cells" aria-hidden="true"></i> Table</span>
            <button class="cp-mobile-sheet-close" onclick={() => { tableOpen = false; }} aria-label="Close Table">&times;</button>
          </div>
          <div class="cp-mobile-sheet-body">
            <!-- Board also mounts here on mobile — shares same IDB key so same cards -->
            <Board {campId} embedded={true} />
          </div>
        </div>
      {/if}

    </div>
  </div>

  <!-- Mobile Table FAB -->
  <button class="cp-table-fab" onclick={() => { tableOpen = !tableOpen; }} aria-label="Open Table" title="Open Table">
    <i class="fa-solid fa-table-cells" aria-hidden="true"></i>
  </button>

  <!-- Toast -->
  {#if toast}
    <div class="board-toast" style="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999">{toast}</div>
  {/if}
</div>
