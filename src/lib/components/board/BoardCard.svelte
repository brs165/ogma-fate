<script>
  // ── BoardCard — generated card on the board canvas ───────────────────────────
  import Cv4Card from '../cards/Cv4Card.svelte';
  import { GENERATORS } from '../../engine.js';

  const BOARD_TYPE_COLOR = {
    npc_minor:    {stripe:'#e8b83a', tc:'#b8860b', bg:'#fffbee'},
    npc_major:    {stripe:'#e8793a', tc:'#c4581a', bg:'#fff3ee'},
    backstory:    {stripe:'#4a90d9', tc:'#2a70b9', bg:'#eef4fd'},
    scene:        {stripe:'#3aaa7a', tc:'#2a8a5a', bg:'#eefaf4'},
    encounter:    {stripe:'#d04a6a', tc:'#b03050', bg:'#fef0f3'},
    complication: {stripe:'#d04a6a', tc:'#b03050', bg:'#fef0f3'},
    challenge:    {stripe:'#4a90d9', tc:'#2a70b9', bg:'#eef4fd'},
    contest:      {stripe:'#6a7dd4', tc:'#5a6db8', bg:'#f0f1fc'},
    obstacle:     {stripe:'#888',    tc:'#555',    bg:'#f5f4f1'},
    countdown:    {stripe:'#e8793a', tc:'#c4581a', bg:'#fff3ee'},
    constraint:   {stripe:'#888',    tc:'#555',    bg:'#f5f4f1'},
    campaign:     {stripe:'#6a7dd4', tc:'#5a6db8', bg:'#f0f1fc'},
    seed:         {stripe:'#e8b83a', tc:'#b8860b', bg:'#fffbee'},
    faction:      {stripe:'#6a7dd4', tc:'#5a6db8', bg:'#f0f1fc'},
    compel:       {stripe:'#3aaa7a', tc:'#2a8a5a', bg:'#eefaf4'},
    consequence:  {stripe:'#e8793a', tc:'#c4581a', bg:'#fff3ee'},
    custom:       {stripe:'#888',    tc:'#555',    bg:'#f5f4f1'},
    boost:        {stripe:'#f4b942', tc:'#b8860b', bg:'#fffbee'},
  };

  export let card              = {};
  export let onDelete          = null;
  export let onReroll          = null;
  export let onSendToTable     = null;
  export let onRemoveFromTable = null;
  export let onOpen            = null;
  export let onDragStart       = null;
  export let onUpdate          = null;
  export let isOnTable         = false;
  export let mode              = 'prep';
  export let campId            = '';
  export let onInvoke          = null;
  export let onConnect         = null;
  export let isConnectSource   = false;

  $: C = BOARD_TYPE_COLOR[card.genId] || { stripe: '#888', tc: '#555', bg: '#f5f4f1' };

  $: genEntry = (GENERATORS || []).find(g => g.id === card.genId);

  function onMouseDown(e) {
    if (e.target.closest('.bc-actions') || e.target.closest('.bc-cv4-wrap')) return;
    if (onDragStart) onDragStart(e, card.id);
  }

  function onKeyDown(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      if (onDelete) onDelete(card.id);
    }
    const step = e.shiftKey ? 50 : 10;
    if (e.key === 'ArrowRight') { e.preventDefault(); if (onUpdate) onUpdate(card.id, { x: card.x + step }); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); if (onUpdate) onUpdate(card.id, { x: card.x - step }); }
    if (e.key === 'ArrowDown')  { e.preventDefault(); if (onUpdate) onUpdate(card.id, { y: card.y + step }); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); if (onUpdate) onUpdate(card.id, { y: card.y - step }); }
  }

  function onCustomUpdate(newData) {
    if (!onUpdate) return;
    const merged = { ...card.data, ...newData };
    // Re-derive title/summary/tags for custom cards
    onUpdate(card.id, {
      data:    merged,
      title:   merged.title || 'Custom Card',
      summary: merged.body  || '',
      tags:    [{aspect:'Aspect',npc:'NPC',location:'Location',clue:'Clue',other:'Other'}[merged.type] || 'Custom'],
    });
  }

  function onStateUpdate(interactiveState) {
    if (onUpdate) onUpdate(card.id, { cardState: interactiveState });
  }
</script>

<div
  class="board-card"
  style="left:{card.x}px; top:{card.y}px; z-index:{card.z || 1}"
  tabindex="0"
  role="region"
  aria-label="{genEntry ? genEntry.label : card.genId}: {card.title || ''}"
  on:mousedown={onMouseDown}
  on:keydown={onKeyDown}
>
  <!-- Action buttons -->
  <div class="bc-actions">
    {#if card.genId !== 'custom'}
      <button class="bc-btn" title="Reroll"
        on:click|stopPropagation={() => onReroll && onReroll(card.id)}>↻</button>
    {/if}
    {#if onInvoke && card.genId !== 'sticky' && card.genId !== 'boost' && card.genId !== 'label'}
      <button class="bc-btn" title="Invoke aspect from this card (+2 next roll)"
        on:click|stopPropagation={() => onInvoke({ source: 'paid', label: card.title || card.genId })}
        style="color:var(--accent); font-weight:800">⦿</button>
    {/if}
    <button class="bc-btn bc-btn-connect" class:connecting={isConnectSource}
      title="Draw connection line to another card"
      on:click|stopPropagation={() => onConnect && onConnect(card.id)}
      aria-label="Connect this card to another">&#x2341;</button>
    <button class="bc-btn" title="Pin to Table (copy)"
      on:click|stopPropagation={() => onSendToTable && onSendToTable(card)}>📌</button>
    {#if mode === 'prep'}
      <button class="bc-btn" title="Move to Table (removes from prep)"
        on:click|stopPropagation={() => { if (onSendToTable) onSendToTable(card); if (onDelete) onDelete(card.id); }}>→</button>
    {/if}
    <button class="bc-btn" title="Delete"
      on:click|stopPropagation={() => onDelete && onDelete(card.id)}>✕</button>
  </div>

  <!-- Drag handle -->
  <div
    class="bc-drag-handle"
    role="button"
    tabindex="-1"
    aria-label="Drag handle"
    on:mousedown={e => onDragStart && onDragStart(e, card.id)}
    on:keydown={() => {}}
    title="Drag to move"
  >≡</div>

  <!-- Card content -->
  <div class="bc-cv4-wrap">
    {#if card.data}
      <div class="bc-cv4-scaler">
        <Cv4Card
          genId={card.genId}
          campName={campId}
          data={card.data}
          onUpdate={card.genId === 'custom' ? onCustomUpdate : onStateUpdate}
          savedCardState={card.cardState || null}
        />
      </div>
    {:else}
      <div class="bc-inner">
        <div class="bc-type" style="color:{C.tc}">
          {genEntry ? genEntry.icon + ' ' + genEntry.label : card.genId}
        </div>
        <div class="bc-title">{card.title || ''}</div>
      </div>
    {/if}
  </div>

  <!-- Table strip (PREP mode only) -->
  {#if mode === 'prep'}
    <div class="bc-table-strip">
      {#if isOnTable}
        <span class="bc-on-table">● On table</span>
        {#if onRemoveFromTable}
          <button
            class="bc-remove-table"
            on:click|stopPropagation={() => onRemoveFromTable(card.id)}
            aria-label="Remove {card.title || 'card'} from table"
            title="Remove from table"
          >✕</button>
        {/if}
      {:else}
        <button
          class="bc-send-table"
          on:click|stopPropagation={() => onSendToTable && onSendToTable(card)}
          aria-label="Put {card.title || 'card'} on table"
        >→ Table</button>
      {/if}
    </div>
  {/if}
</div>
