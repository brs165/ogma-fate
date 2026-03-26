<script>
  import ExportMenu from './ExportMenu.svelte';
  import { ToggleGroup, Tooltip, Select } from 'bits-ui';

  let { campMeta = {}, mode = 'prep', onModeChange = () => {}, campId = '', onCampChange = () => {}, isOnline = true, sync = {}, panels = {}, counts = {}, exportActions = {}, cards = [], campName = '', onExportCanvas = () => {}, onImportCanvas = () => {}, onPrint = () => {}, onToggleMobileList = null, mobileListView = false, onExportView = null } = $props();

  let syncStatus = $derived(sync.status || 'offline');
  let roomCode   = $derived(sync.roomCode || '');
  let syncRole   = $derived(sync.role || null);
  let onHost     = $derived(sync.onHost || (() => {}));
  let onDisconnect = $derived(sync.onDisconnect || (() => {}));
  let showToast  = $derived(sync.onToast || (() => {}));

  let leftOpen      = $derived(panels.leftOpen);
  let onToggleLeft  = $derived(panels.onToggleLeft || (() => {}));
  let showDice      = $derived(panels.showDice);
  let onToggleDice  = $derived(panels.onToggleDice || (() => {}));
  let showFP        = $derived(panels.showFP);
  let onToggleFP    = $derived(panels.onToggleFP || (() => {}));
  let binderOpen    = $derived(panels.binderOpen);
  let onToggleBinder = $derived(panels.onToggleBinder || (() => {}));
  let showNotes     = $derived(panels.showNotes);
  let onToggleNotes = $derived(panels.onToggleNotes || null);

  let onTableCount = $derived(counts.onTable || 0);
  let binderCount  = $derived(counts.binder || 0);
  let trayCount    = $derived(counts.tray || 0);

  let theme         = $derived(exportActions.theme || 'dark');
  let onToggleTheme = $derived(exportActions.onToggleTheme || (() => {}));

  let worlds = $derived(typeof globalThis.CAMPAIGNS !== 'undefined'
    ? Object.keys(globalThis.CAMPAIGNS).map(id => ({
        id,
        name: ((globalThis.CAMPAIGNS[id] || {}).meta || {}).name || id,
        icon: ((globalThis.CAMPAIGNS[id] || {}).meta || {}).icon || '◈',
      }))
    : [{ id: campId, name: (campMeta && campMeta.name) || campId, icon: campMeta?.icon || '◈' }]);
  let selectedWorld = $derived(worlds.find(w => w.id === campId) || worlds[0]);

  function copyJoinLink() {
    const joinUrl = window.location.origin + '/campaigns/' + campId + '?mode=play&room=' + roomCode;
    try {
      navigator.clipboard.writeText(joinUrl).then(() => showToast('\u{1F517} Join link copied \u2014 ' + roomCode));
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

  <!-- World picker — Bits UI Select -->
  <div class="bt-world">
    <a href="/campaigns/{campId}" class="bt-back" title="Back to generator">&larr;</a>
    <Select.Root
      type="single"
      value={campId}
      onValueChange={(v) => { if (v && v !== campId) onCampChange(v); }}
    >
      <Select.Trigger class="bt-world-trigger" aria-label="Switch world">
        <span class="bt-world-icon" aria-hidden="true">{selectedWorld?.icon || '◈'}</span>
        <span class="bt-world-name">{selectedWorld?.name || campId}</span>
        <span class="bt-world-chevron" aria-hidden="true">›</span>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="bt-world-content" sideOffset={4}>
          <Select.Viewport class="bt-world-viewport">
            {#each worlds as w (w.id)}
              <Select.Item value={w.id} label={w.name} class="bt-world-item" aria-label={w.name}>
                <span class="bt-world-item-icon" aria-hidden="true">{w.icon}</span>
                <Select.ItemText class="bt-world-item-name">{w.name}</Select.ItemText>
                {#if w.id === campId}
                  <span class="bt-world-item-check" aria-hidden="true">✓</span>
                {/if}
              </Select.Item>
            {/each}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>

  <!-- Panel toggle (play mode) -->
  {#if mode === 'play'}
    <Tooltip.Root openDelay={400}>
      <Tooltip.Trigger class="bt-icon-btn bt-panel-toggle"
        onclick={onToggleLeft}
        aria-label={leftOpen ? 'Hide panel' : 'Show panel'}
        aria-expanded={String(!!leftOpen)}
      >{leftOpen ? '\u25C0' : '\u25B6'}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content class="bt-tooltip">{leftOpen ? 'Hide panel' : 'Show panel'}</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  {/if}

  <!-- Mode toggle — Bits UI ToggleGroup -->
  <ToggleGroup.Root
    type="single"
    value={mode}
    onValueChange={(v) => { if (v) onModeChange(v); }}
    class="bt-mode"
    aria-label="Switch mode"
  >
    <ToggleGroup.Item
      value="prep"
      class="bt-mode-btn"
      aria-label="Prep mode — generate and arrange cards privately"
      title="Prep — private canvas. Players cannot see this."
    >Prep</ToggleGroup.Item>
    <ToggleGroup.Item
      value="play"
      class="bt-mode-btn"
      aria-label="Play mode — live session view"
      title="Play — live session. Cards sent to table visible to players."
    >Play</ToggleGroup.Item>
  </ToggleGroup.Root>

  <!-- Right nav -->
  <div class="bt-right">

    <!-- Status chips -->
    {#if mode === 'play' && syncStatus === 'connected' && syncRole === 'gm'}
      <span class="bt-chip bt-play-chip">&blacktriangleright; Live</span>
    {/if}
    {#if mode === 'play' && syncStatus === 'connecting'}
      <span class="bt-chip bt-offline">&hourglass; Connecting&hellip;</span>
    {/if}
    {#if syncRole === 'player' && syncStatus === 'connected' && roomCode}
      <span class="bt-chip bt-room-chip">&#x1F517;&nbsp;Room&nbsp;{roomCode}</span>
    {/if}
    {#if !isOnline}
      <span class="bt-chip bt-offline">&#x26A1; Offline</span>
    {/if}
    {#if mode === 'prep' && onTableCount > 0}
      <span class="bt-chip bt-ontable-chip">&#x25CF;&nbsp;{onTableCount} on table</span>
    {/if}

    <!-- Binder (Prep) -->
    {#if mode === 'prep'}
      <Tooltip.Root openDelay={400}>
        <Tooltip.Trigger class="bt-icon-btn{binderOpen ? ' active' : ''}"
          onclick={onToggleBinder}
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
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content class="bt-tooltip">Binder{binderCount > 0 ? ` (${binderCount})` : ''}</Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    {/if}

    <!-- Dice -->
    <Tooltip.Root openDelay={400}>
      <Tooltip.Trigger class="bt-icon-btn{showDice ? ' active' : ''}"
        onclick={onToggleDice}
        aria-label={showDice ? 'Close dice roller' : 'Open dice roller'}
        aria-pressed={String(showDice)}
      >&#x1F3B2;</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content class="bt-tooltip">Dice Roller <kbd class="bt-kbd">R</kbd></Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>

    <!-- FP tracker -->
    <Tooltip.Root openDelay={400}>
      <Tooltip.Trigger class="bt-icon-btn{showFP ? ' active' : ''}"
        onclick={onToggleFP}
        aria-label={showFP ? 'Close Fate Point tracker' : 'Open Fate Point tracker'}
        aria-pressed={String(showFP)}
      >&#x25CE;</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content class="bt-tooltip">Fate Point Tracker</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>

    <!-- Session notes -->
    {#if onToggleNotes}
      <Tooltip.Root openDelay={400}>
        <Tooltip.Trigger class="bt-icon-btn{showNotes ? ' active' : ''}"
          onclick={onToggleNotes}
          aria-label={showNotes ? 'Close notes' : 'Open session notes'}
          aria-pressed={String(showNotes)}
        >&#x1F4DD;</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content class="bt-tooltip">Session Notes</Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    {/if}

    <!-- Host / room code -->
    {#if mode === 'play' && syncStatus === 'offline'}
      <button class="bt-nav" onclick={onHost} title="Host a live session">&#x1F310; Host</button>
    {/if}
    {#if mode === 'play' && syncStatus === 'connected'}
      <span style="display:flex;align-items:center;gap:3px">
        <button class="bt-nav"
          style="color:var(--c-green,#30d158);border-color:var(--c-green,#30d158);font-variant-numeric:tabular-nums"
          title="Click to copy player join link" onclick={copyJoinLink}
        >&#x1F517;&nbsp;{roomCode}</button>
        <button class="bt-icon-btn" style="font-size:12px;opacity:0.6;width:22px;height:22px;min-width:0"
          title="Disconnect" onclick={onDisconnect} aria-label="Disconnect">&times;</button>
      </span>
    {/if}

    <!-- Export menu -->
    <ExportMenu {cards} {campName} {onExportCanvas} {onImportCanvas} {onPrint} {mode} />

    <!-- Mobile list/canvas -->
    {#if onToggleMobileList}
      <Tooltip.Root openDelay={400}>
        <Tooltip.Trigger class="bt-icon-btn bt-mob-view-toggle"
          onclick={onToggleMobileList}
          aria-label={mobileListView ? 'Canvas view' : 'List view'}
          aria-pressed={String(!!mobileListView)}
        >{mobileListView ? '\u25A6' : '\u2261'}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content class="bt-tooltip">{mobileListView ? 'Canvas view' : 'List view'}</Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    {/if}

    <!-- Theme -->
    <Tooltip.Root openDelay={400}>
      <Tooltip.Trigger class="bt-icon-btn"
        onclick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >{theme === 'dark' ? '\u2600' : '\u263D'}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content class="bt-tooltip">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>

    <!-- A11y patterns -->
    <Tooltip.Root openDelay={400}>
      <Tooltip.Trigger class="bt-icon-btn"
        onclick={toggleA11yPatterns}
        aria-label="Toggle colorblind-safe patterns"
      >&diams;</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content class="bt-tooltip">Colorblind patterns</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>

    <!-- Export page -->
    {#if onExportView}
      <Tooltip.Root openDelay={400}>
        <Tooltip.Trigger class="bt-icon-btn"
          onclick={onExportView}
          aria-label="Open export page"
        >&ctdot;</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content class="bt-tooltip">Export Cards</Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    {/if}

  </div>
</div>
