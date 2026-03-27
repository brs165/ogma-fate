<script>
  import ExportMenu from './ExportMenu.svelte';
  import { ToggleGroup, Select, DropdownMenu, Tooltip } from 'bits-ui';

  let { campMeta = {}, mode = 'prep', onModeChange = () => {}, campId = '', onCampChange = () => {}, isOnline = true, sync = {}, panels = {}, counts = {}, exportActions = {}, cards = [], campName = '', onExportCanvas = () => {}, onImportCanvas = () => {}, onPrint = () => {}, onToggleMobileList = null, mobileListView = false, onExportView = null, onBack = null } = $props();

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
    {#if onBack}
      <button class="bt-back" onclick={onBack} title="Back to generator">&larr;</button>
    {:else}
      <a href="/campaigns/{campId}" class="bt-back" title="Back to generator">&larr;</a>
    {/if}
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
    <button class="bt-icon-btn bt-panel-toggle"
      onclick={onToggleLeft}
      aria-label={leftOpen ? 'Hide panel' : 'Show panel'}
      aria-expanded={String(!!leftOpen)}
      title={leftOpen ? 'Hide panel' : 'Show panel'}
    >{leftOpen ? '\u25C0' : '\u25B6'}</button>
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
      <span class="bt-chip bt-room-chip"><i class="fa-solid fa-link" aria-hidden="true"></i>&nbsp;Room&nbsp;{roomCode}</span>
    {/if}
    {#if !isOnline}
      <span class="bt-chip bt-offline"><i class="fa-solid fa-bolt" aria-hidden="true"></i> Offline</span>
    {/if}
    {#if mode === 'prep' && onTableCount > 0}
      <span class="bt-chip bt-ontable-chip"><i class="fa-solid fa-circle" aria-hidden="true" style="font-size:8px"></i>&nbsp;{onTableCount} on table</span>
    {/if}

    <!-- Binder (Prep) -->
    {#if mode === 'prep'}
      <Tooltip.Root openDelay={400}>
        <Tooltip.Trigger asChild>
          {#snippet child({ props })}
            <button {...props} class="bt-icon-btn{binderOpen ? ' active' : ''}"
              onclick={onToggleBinder}
              aria-label={binderOpen ? 'Hide Binder' : 'Open Binder'}
              aria-pressed={String(binderOpen)}
              style="position:relative"
            >
              <i class="fa-solid fa-clipboard" aria-hidden="true"></i>
              {#if binderCount > 0 || trayCount > 0}
                <span class="bt-count" style="position:absolute;top:-4px;right:-4px">
                  {trayCount > 0 ? trayCount : binderCount}
                </span>
              {/if}
            </button>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content class="bt-tooltip" sideOffset={6}>
            Binder{binderCount > 0 ? ` (${binderCount})` : ''}
            <Tooltip.Arrow class="bt-tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    {/if}

    <!-- Dice -->
    <Tooltip.Root openDelay={400}>
      <Tooltip.Trigger asChild>
        {#snippet child({ props })}
          <button {...props} class="bt-icon-btn{showDice ? ' active' : ''}"
            onclick={onToggleDice}
            aria-label={showDice ? 'Close dice roller' : 'Open dice roller'}
            aria-pressed={String(showDice)}
          ><i class="fa-solid fa-dice-d20" aria-hidden="true"></i></button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content class="bt-tooltip" sideOffset={6}>
          Dice Roller <kbd class="bt-tooltip-kbd">R</kbd>
          <Tooltip.Arrow class="bt-tooltip-arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>

    <!-- FP tracker -->
    <Tooltip.Root openDelay={400}>
      <Tooltip.Trigger asChild>
        {#snippet child({ props })}
          <button {...props} class="bt-icon-btn{showFP ? ' active' : ''}"
            onclick={onToggleFP}
            aria-label={showFP ? 'Close Fate Point tracker' : 'Open Fate Point tracker'}
            aria-pressed={String(showFP)}
          ><i class="fa-solid fa-bullseye" aria-hidden="true"></i></button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content class="bt-tooltip" sideOffset={6}>
          Fate Points
          <Tooltip.Arrow class="bt-tooltip-arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>

    <!-- Host / room code -->
    {#if mode === 'play' && syncStatus === 'offline'}
      <button class="bt-nav" onclick={onHost} title="Host a live session"><i class="fa-solid fa-globe" aria-hidden="true"></i> Host</button>
    {/if}
    {#if mode === 'play' && syncStatus === 'connected'}
      <span style="display:flex;align-items:center;gap:3px">
        <button class="bt-nav"
          style="color:var(--c-green,#30d158);border-color:var(--c-green,#30d158);font-variant-numeric:tabular-nums"
          title="Click to copy player join link" onclick={copyJoinLink}
        ><i class="fa-solid fa-link" aria-hidden="true"></i>&nbsp;{roomCode}</button>
        <button class="bt-icon-btn" style="font-size:12px;opacity:0.6;width:22px;height:22px;min-width:0"
          title="Disconnect" onclick={onDisconnect} aria-label="Disconnect">&times;</button>
      </span>
    {/if}

    <!-- Export menu -->
    <ExportMenu {cards} {campName} {onExportCanvas} {onImportCanvas} {onPrint} {mode} />

    <!-- Mobile list/canvas — visible on mobile only -->
    {#if onToggleMobileList}
      <Tooltip.Root openDelay={400}>
        <Tooltip.Trigger asChild>
          {#snippet child({ props })}
            <button {...props} class="bt-icon-btn bt-mob-view-toggle"
              onclick={onToggleMobileList}
              aria-label={mobileListView ? 'Canvas view' : 'List view'}
              aria-pressed={String(!!mobileListView)}
            >{mobileListView ? '\u25A6' : '\u2261'}</button>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content class="bt-tooltip" sideOffset={6}>
            {mobileListView ? 'Canvas view' : 'List view'}
            <Tooltip.Arrow class="bt-tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    {/if}

    <!-- Overflow menu — groups low-priority actions, shown on all sizes but essential on mobile -->
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="bt-icon-btn bt-overflow-btn" aria-label="More options">&hellip;</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class="bt-overflow-content" align="end" sideOffset={6}>
          <DropdownMenu.Item class="bt-overflow-item" onSelect={onToggleTheme}>
            <span class="bt-overflow-icon">{theme === 'dark' ? '\u2600' : '\u263D'}</span>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </DropdownMenu.Item>
          <DropdownMenu.Item class="bt-overflow-item" onSelect={toggleA11yPatterns}>
            <span class="bt-overflow-icon">&diams;</span>
            Colorblind patterns
          </DropdownMenu.Item>
          {#if onToggleNotes}
            <DropdownMenu.Item class="bt-overflow-item" onSelect={onToggleNotes}>
              <span class="bt-overflow-icon"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i></span>
              Session notes
            </DropdownMenu.Item>
          {/if}
          {#if onExportView}
            <DropdownMenu.Separator class="export-dd-sep" />
            <DropdownMenu.Item class="bt-overflow-item" onSelect={onExportView}>
              <span class="bt-overflow-icon">&ctdot;</span>
              Export cards
            </DropdownMenu.Item>
          {/if}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>

  </div>
</div>
