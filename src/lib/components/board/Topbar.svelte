<script>
  import ExportMenu from './ExportMenu.svelte';
  import { Select, DropdownMenu } from 'bits-ui';

  let { campMeta = {}, campId = '', onCampChange = () => {}, isOnline = true, panels = {}, exportActions = {}, cards = [], campName = '', onExportCanvas = () => {}, onImportCanvas = () => {}, onExportView = null, onClose = null } = $props();

  let leftOpen      = $derived(panels.leftOpen);
  let onToggleLeft  = $derived(panels.onToggleLeft || (() => {}));
  let showDice      = $derived(panels.showDice);
  let onToggleDice  = $derived(panels.onToggleDice || (() => {}));
  let showFP        = $derived(panels.showFP);
  let onToggleFP    = $derived(panels.onToggleFP || (() => {}));
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

  function toggleA11yPatterns() {
    try {
      const has = document.documentElement.classList.toggle('a11y-patterns');
      localStorage.setItem('a11y_patterns', has ? '1' : '');
    } catch(e) {}
  }
</script>

<div class="bt-bar">

  <!-- World / back -->
  <div class="bt-world">
    {#if onClose}
      <button class="bt-back" onclick={onClose} title="Back to generator" aria-label="Back to generator">&larr;</button>
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

  <!-- Table label -->
  <span class="bt-table-label">Table</span>

  <!-- Right nav -->
  <div class="bt-right">

    <!-- Offline chip -->
    {#if !isOnline}
      <span class="bt-chip bt-offline"><i class="fa-solid fa-bolt" aria-hidden="true"></i> Offline</span>
    {/if}

    <!-- Panel toggle -->
    <button class="bt-icon-btn"
      onclick={onToggleLeft}
      aria-label={leftOpen ? 'Hide panel' : 'Show panel'}
      aria-expanded={String(!!leftOpen)}
      title={leftOpen ? 'Hide panel' : 'Show panel'}
    ><i class="fa-solid fa-sidebar" aria-hidden="true"></i></button>

    <!-- Dice -->
    <button class="bt-icon-btn{showDice ? ' active' : ''}"
      onclick={onToggleDice}
      aria-label={showDice ? 'Close dice roller' : 'Open dice roller'}
      aria-pressed={String(showDice)}
      title="Dice Roller (R)"
    ><i class="fa-solid fa-dice-d20" aria-hidden="true"></i></button>

    <!-- FP tracker -->
    <button class="bt-icon-btn{showFP ? ' active' : ''}"
      onclick={onToggleFP}
      aria-label={showFP ? 'Close Fate Points' : 'Open Fate Points'}
      aria-pressed={String(showFP)}
      title="Fate Point Tracker"
    ><i class="fa-solid fa-bullseye" aria-hidden="true"></i></button>

    <!-- Export menu -->
    <ExportMenu {cards} {campName} {onExportCanvas} {onImportCanvas} onPrint={() => {}} />

    <!-- Overflow -->
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
