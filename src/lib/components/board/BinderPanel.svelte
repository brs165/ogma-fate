<script>
  // ── BinderPanel — binder library + drafting tray ─────────────────────────────
  import { GENERATORS } from '../../engine.js';
  import { ToggleGroup } from 'bits-ui';
  let { campId = '', campName = '', binderCards = [], trayCards = [], onAddToTray = null, onRemoveFromTray = null, onSendTrayToCanvas = null, onSendToCanvas = null, onExportCard = null, onUnpin = null } = $props();
  const BINDER_FILTER_GROUPS = {
    people:    ['npc_minor', 'npc_major', 'pc', 'backstory'],
    scene:     ['scene', 'encounter', 'complication', 'seed'],
    story:     ['campaign', 'faction', 'compel', 'consequence'],
    mechanics: ['challenge', 'contest', 'obstacle', 'countdown', 'constraint'],
  };

  const filters = [
    {id:'all',      label:'All'},
    {id:'people',   label:'People'},
    {id:'scene',    label:'Scene'},
    {id:'story',    label:'Story'},
    {id:'mechanics',label:'Mech'},
  ];

  let filter = $state('all');

  let visible = $derived(binderCards.filter(card => {
    if (filter === 'all') return true;
    return (BINDER_FILTER_GROUPS[filter] || []).includes(card.genId);
  }));

  function cardTitle(card) {
    const d = card.data || {};
    return d.name || d.location || d.situation ||
           (d.aspects && d.aspects.high_concept) || card.label || card.genId;
  }

  function genMeta(genId) {
    return (GENERATORS || []).find(g => g.id === genId) || {};
  }

  function inTray(card) {
    return trayCards.some(c => c.id === card.id);
  }

  function toggleTray(card) {
    if (inTray(card)) {
      if (onRemoveFromTray) onRemoveFromTray(card.id);
    } else {
      if (onAddToTray) onAddToTray(card);
    }
  }
</script>

<div class="bbp">
  <!-- Header -->
  <div class="bbp-header">
    <span class="bbp-title">📋 Binder</span>
    {#if binderCards.length > 0}
      <span class="bbp-count">{binderCards.length}</span>
    {/if}
  </div>

  <!-- Filter strip -->
  {#if binderCards.length > 0}
    <ToggleGroup.Root
      type="single"
      value={filter}
      onValueChange={(v) => { if (v) filter = v; }}
      class="bbp-filters"
      aria-label="Filter by type"
    >
      {#each filters as f (f.id)}
        <ToggleGroup.Item value={f.id} class="bbp-filter-btn" aria-label="Filter: {f.label}">
          {f.label}
        </ToggleGroup.Item>
      {/each}
    </ToggleGroup.Root>
  {/if}

  <!-- Card list -->
  <div class="bbp-list">
    {#if visible.length === 0}
      <div class="bbp-empty">
        {binderCards.length === 0
          ? 'Save cards from the generator to build your Binder.'
          : 'No cards match this filter.'}
      </div>
    {/if}
    {#each visible as card (card.id)}
      {@const meta  = genMeta(card.genId)}
      {@const title = cardTitle(card)}
      {@const tray  = inTray(card)}
      <div class="bbp-card">
        <div class="bbp-card-id">
          <span class="bbp-card-icon" aria-hidden="true">{meta.icon || '◈'}</span>
          <span class="bbp-card-title">{title}</span>
        </div>
        <div class="bbp-card-actions">
          <button
            class="bbp-action{tray ? ' in-tray' : ''}"
            onclick={() => toggleTray(card)}
            title={tray ? 'Remove from Tray' : 'Add to Drafting Tray'}
            aria-pressed={String(tray)}
          >{tray ? '★' : '☆'}</button>
          <button
            class="bbp-action bbp-action-canvas"
            onclick={() => onSendToCanvas && onSendToCanvas(card)}
            title="Place on canvas now"
          >→</button>
          <button
            class="bbp-action"
            onclick={() => onExportCard && onExportCard(card)}
            title="Export as JSON"
          >↓</button>
          <button
            class="bbp-action bbp-action-remove"
            onclick={() => onUnpin && onUnpin(card.id)}
            title="Remove from Binder"
          >✕</button>
        </div>
      </div>
    {/each}
  </div>

  <!-- Drafting Tray -->
  <div class="bbp-tray">
    <div class="bbp-tray-header">
      <span class="bbp-tray-title">🗂 Tray</span>
      {#if trayCards.length > 0}
        <span class="bbp-tray-count">{trayCards.length}</span>
        <button
          class="bbp-tray-send"
          onclick={() => onSendTrayToCanvas && onSendTrayToCanvas()}
          title="Place all Tray cards on canvas"
        >→ All to canvas</button>
      {/if}
    </div>
    {#if trayCards.length === 0}
      <div class="bbp-tray-empty">Stage cards here before play.</div>
    {:else}
      <div class="bbp-tray-list">
        {#each trayCards as card (card.id)}
          {@const meta  = genMeta(card.genId)}
          {@const title = cardTitle(card)}
          <div class="bbp-tray-row">
            <span class="bbp-tray-icon" aria-hidden="true">{meta.icon || '◈'}</span>
            <span class="bbp-tray-name">{title}</span>
            <button
              class="bbp-tray-remove"
              onclick={() => onRemoveFromTray && onRemoveFromTray(card.id)}
              aria-label="Remove from tray"
            >✕</button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
