<script>
  import ExportMenu from './ExportMenu.svelte';
  // Grouped props
  // Cards & extra callbacks
  // Destructure sync
  let { campMeta = {}, mode = 'prep', onModeChange = () => {}, campId = '', onCampChange = () => {}, isOnline = true, sync = {}, panels = {}, counts = {}, exportActions = {}, cards = [], campName = '', onExportCanvas = () => {}, onImportCanvas = () => {}, onPrint = () => {}, onToggleMobileList = null, mobileListView = false, onExportView = null } = $props();
  let syncStatus = $derived(sync.status || 'offline');
  let roomCode = $derived(sync.roomCode || '');
  let syncRole = $derived(sync.role || null);
  let onHost = $derived(sync.onHost || (() => {}));
  let onDisconnect = $derived(sync.onDisconnect || (() => {}));
  let showToast = $derived(sync.onToast || (() => {}));

  // Destructure panels
  let leftOpen = $derived(panels.leftOpen);
  let onToggleLeft = $derived(panels.onToggleLeft || (() => {}));
  let showDice = $derived(panels.showDice);
  let onToggleDice = $derived(panels.onToggleDice || (() => {}));
  let showFP = $derived(panels.showFP);
  let onToggleFP = $derived(panels.onToggleFP || (() => {}));
  let binderOpen = $derived(panels.binderOpen);
  let onToggleBinder = $derived(panels.onToggleBinder || (() => {}));
  let showNotes = $derived(panels.showNotes);
  let onToggleNotes = $derived(panels.onToggleNotes || null);

  // Destructure counts
  let onTableCount = $derived(counts.onTable || 0);
  let binderCount = $derived(counts.binder || 0);
  let trayCount = $derived(counts.tray || 0);

  // Destructure export actions
  let theme = $derived(exportActions.theme || 'dark');
  let onToggleTheme = $derived(exportActions.onToggleTheme || (() => {}));

  // Worlds list
  let worlds = $derived(typeof globalThis.CAMPAIGNS !== 'undefined'
    ? Object.keys(globalThis.CAMPAIGNS).map(id => ({ id, name: ((globalThis.CAMPAIGNS[id] || {}).meta || {}).name || id }))
    : [{ id: campId, name: (campMeta && campMeta.name) || campId }]);

  function copyJoinLink() {
    const joinUrl = window.location.origin + '/campaigns/' + campId + '?mode=play&room=' + roomCode;
    try {
      navigator.clipboard.writeText(joinUrl).then(() => {
        showToast('\u{1F517} Join link copied \u2014 ' + roomCode);
      });
    } catch (e) {
      showToast('Room ' + roomCode + ' \u2014 share: ?room=' + roomCode);
    }
  }

  function toggleA11yPatterns() {
    const on = document.body.getAttribute('data-a11y-patterns') === 'true';
    document.body.setAttribute('data-a11y-patterns', on ? 'false' : 'true');
  }
</script>

<div class="bt-bar">
  <!-- Logo + world picker -->
  <div class="bt-world">
    <a href="/campaigns/{campId}" class="bt-back" title="Back to generator">&larr;</a>
    <span class="bt-world-icon">{campMeta.icon || '\u25C8'}</span>
    <select
      class="bt-world-select"
      value={campId}
      onchange={(e) => onCampChange(e.target.value)}
      title="Switch world"
      aria-label="Switch world"
    >
      {#each worlds as w (w.id)}
        <option value={w.id}>{w.name}</option>
      {/each}
    </select>
  </div>

  <!-- Panel toggle (play mode only) -->
  {#if mode === 'play'}
    <button
      class="bt-icon-btn bt-panel-toggle"
      onclick={onToggleLeft}
      title={leftOpen ? 'Hide generators' : 'Show generators'}
      aria-label={leftOpen ? 'Hide generator panel' : 'Show generator panel'}
      aria-expanded={String(!!leftOpen)}
    >{leftOpen ? '\u25C0' : '\u25B6'}</button>
  {/if}

  <!-- Mode toggle -->
  <div class="bt-mode">
    <button
      class="bt-mode-btn" class:active={mode === 'prep'}
      onclick={() => onModeChange('prep')}
      title="Prep \u2014 generate and arrange cards privately. Players cannot see this canvas."
      aria-pressed={String(mode === 'prep')}
    >Prep</button>
    <button
      class="bt-mode-btn" class:active={mode === 'play'}
      onclick={() => onModeChange('play')}
      title="Play \u2014 live session view. Cards you send to table are visible to connected players."
      aria-pressed={String(mode === 'play')}
    >Play</button>
  </div>

  <!-- Right nav -->
  <div class="bt-right">
    {#if mode === 'play' && syncStatus === 'connected' && syncRole === 'gm'}
      <span class="bt-chip bt-play-chip">&blacktriangleright; Live</span>
    {/if}
    {#if mode === 'play' && syncStatus === 'connecting'}
      <span class="bt-chip bt-offline">&hourglass; Connecting&hellip;</span>
    {/if}
    {#if syncRole === 'player' && syncStatus === 'connected' && roomCode}
      <span class="bt-chip bt-room-chip" title="Connected to Room {roomCode} \u2014 waiting for GM to add you">
        &#x1F517;&nbsp;Room&nbsp;{roomCode}
      </span>
    {/if}
    {#if !isOnline}
      <span class="bt-chip bt-offline">&zwnj;&#x26A1; Offline</span>
    {/if}

    <!-- "N on table" chip (Prep mode) -->
    {#if mode === 'prep' && onTableCount > 0}
      <span class="bt-chip bt-ontable-chip" title="{onTableCount} card{onTableCount === 1 ? '' : 's'} on the play table">
        &#x25CF;&nbsp;{onTableCount} on table
      </span>
    {/if}

    <!-- Binder toggle (Prep mode only) -->
    {#if mode === 'prep'}
      <button
        class="bt-icon-btn" class:active={binderOpen}
        onclick={onToggleBinder}
        title={binderOpen ? 'Hide Binder' : 'Show Binder' + (binderCount > 0 ? ' (' + binderCount + ' cards)' : '')}
        aria-label={binderOpen ? 'Hide Binder' : 'Open Binder'}
        aria-pressed={String(binderOpen)}
        style="position:relative"
      >
        &#x1F4CB;
        {#if binderCount > 0 || trayCount > 0}
          <span class="bt-count" style="position:absolute;top:-4px;right:-4px">
            {trayCount > 0 ? trayCount : binderCount}
          </span>
        {/if}
      </button>
    {/if}

    <!-- Dice toggle -->
    <button
      class="bt-icon-btn" class:active={showDice}
      onclick={onToggleDice}
      title="Dice roller"
      aria-label={showDice ? 'Close dice roller' : 'Open dice roller'}
      aria-pressed={String(showDice)}
    >&#x1F3B2;</button>

    <!-- FP tracker toggle -->
    <button
      class="bt-icon-btn" class:active={showFP}
      onclick={onToggleFP}
      title="Fate Point tracker"
      aria-label={showFP ? 'Close Fate Point tracker' : 'Open Fate Point tracker'}
      aria-pressed={String(showFP)}
    >&#x25CE;</button>

    <!-- Session notes toggle -->
    {#if onToggleNotes}
      <button
        class="bt-icon-btn" class:active={showNotes}
        onclick={onToggleNotes}
        title="Session notes"
        aria-label={showNotes ? 'Close session notes' : 'Open session notes'}
        aria-pressed={String(showNotes)}
      >&#x1F4DD;</button>
    {/if}

    <!-- Host button (Play mode, offline) -->
    {#if mode === 'play' && syncStatus === 'offline'}
      <button class="bt-nav" onclick={onHost} title="Host a live session \u2014 share room code with players">
        &#x1F310; Host
      </button>
    {/if}

    <!-- Connected: room code + disconnect -->
    {#if mode === 'play' && syncStatus === 'connected'}
      <span style="display:flex;align-items:center;gap:3px">
        <button
          class="bt-nav"
          style="color:var(--c-green,#30d158);border-color:var(--c-green,#30d158);font-variant-numeric:tabular-nums"
          title="Click to copy player join link"
          onclick={copyJoinLink}
        >&#x1F517;&nbsp;{roomCode}</button>
        <button
          class="bt-icon-btn"
          style="font-size:12px;opacity:0.6;width:22px;height:22px;min-width:0"
          title="Disconnect from live session"
          onclick={onDisconnect}
          aria-label="Disconnect"
        >&times;</button>
      </span>
    {/if}

    <!-- Export menu -->
    <ExportMenu
      {cards}
      {campName}
      {onExportCanvas}
      {onImportCanvas}
      {onPrint}
      {mode}
    />

    <!-- Mobile list/canvas toggle -->
    {#if onToggleMobileList}
      <button
        class="bt-icon-btn bt-mob-view-toggle"
        onclick={onToggleMobileList}
        title={mobileListView ? 'Switch to canvas' : 'Switch to card list'}
        aria-label={mobileListView ? 'Canvas view' : 'List view'}
        aria-pressed={String(!!mobileListView)}
      >{mobileListView ? '\u25A6' : '\u2261'}</button>
    {/if}

    <!-- Theme toggle -->
    <button
      class="bt-icon-btn"
      onclick={onToggleTheme}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >{theme === 'dark' ? '\u2600' : '\u263D'}</button>

    <!-- Colorblind patterns toggle -->
    <button
      class="bt-icon-btn"
      onclick={toggleA11yPatterns}
      title="Toggle colorblind-safe patterns"
      aria-label="Toggle colorblind-safe patterns"
    >&diams;</button>

    <!-- Export page -->
    {#if onExportView}
      <button
        class="bt-icon-btn"
        onclick={onExportView}
        title="Export Cards"
        aria-label="Open export page"
      >&ctdot;</button>
    {/if}
  </div>
</div>
