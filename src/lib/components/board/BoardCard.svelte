<script>
  // ── BoardCard — generated card on the board canvas ───────────────────────────
  import Cv4Card from '../cards/Cv4Card.svelte';
  import { GENERATORS } from '../../engine.js';

  let { card = {}, onDelete = null, onReroll = null, onSendToTable = null, onRemoveFromTable = null, onOpen = null, onDragStart = null, onUpdate = null, isOnTable = false, mode = 'prep', campId = '', onInvoke = null, onConnect = null, isConnectSource = false } = $props();
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
  let C = $derived(BOARD_TYPE_COLOR[card.genId] || { stripe: '#888', tc: '#555', bg: '#f5f4f1' });

  let genEntry = $derived((GENERATORS || []).find(g => g.id === card.genId));

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
  onmousedown={onMouseDown}
  onkeydown={onKeyDown}
>
  <!-- Action buttons -->
  <div class="bc-actions">
    {#if card.genId !== 'custom'}
      <button class="bc-btn" title="Reroll" aria-label="Reroll"
        onclick={(e) => { e.stopPropagation(); (() => onReroll && onReroll(card.id))(e); }}><i class="fa-solid fa-rotate-right" aria-hidden="true"></i></button>
    {/if}
    {#if onInvoke && card.genId !== 'sticky' && card.genId !== 'boost' && card.genId !== 'label'}
      <button class="bc-btn" title="Invoke aspect from this card (+2 next roll)" aria-label="Invoke aspect"
        onclick={(e) => { e.stopPropagation(); onInvoke({ source: 'paid', label: card.title || card.genId }); }}
        style="color:var(--accent); font-weight:800">⦿</button>
    {/if}
    <button class="bc-btn bc-btn-connect" class:connecting={isConnectSource}
      title="Draw connection line to another card"
      onclick={(e) => { e.stopPropagation(); if (onConnect) onConnect && onConnect(card.id); }}
      aria-label="Connect this card to another"><i class="fa-solid fa-link" aria-hidden="true"></i></button>
    <button class="bc-btn" title="Pin to Table" aria-label="Pin to Table"
      onclick={(e) => { e.stopPropagation(); (() => onSendToTable && onSendToTable(card))(e); }}><i class="fa-solid fa-cart-plus" aria-hidden="true"></i></button>
    {#if mode === 'prep'}
      <button class="bc-btn" title="Move to Table" aria-label="Move to Table"
        onclick={(e) => { e.stopPropagation(); (() => { if (onSendToTable) onSendToTable(card); if (onDelete) onDelete(card.id); })(e); }}><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
    {/if}
    <button class="bc-btn" title="Delete" aria-label="Delete"
      onclick={(e) => { e.stopPropagation(); (() => onDelete && onDelete(card.id))(e); }}><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
  </div>

  <!-- Drag handle -->
  <div
    class="bc-drag-handle"
    role="button"
    tabindex="-1"
    aria-label="Drag handle"
    onmousedown={e => onDragStart && onDragStart(e, card.id)}
    onkeydown={() => {}}
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
            onclick={(e) => { e.stopPropagation(); onRemoveFromTable(card.id); }}
            aria-label="Remove {card.title || 'card'} from table"
            title="Remove from table"
          >✕</button>
        {/if}
      {:else}
        <button
          class="bc-send-table"
          onclick={(e) => { e.stopPropagation(); if (onSendToTable) onSendToTable && onSendToTable(card); }}
          aria-label="Put {card.title || 'card'} on table"
        >→ Table</button>
      {/if}
    </div>
  {/if}

  {#if card.sourceCanvas === 'prep' && mode === 'prep'}
    <div class="bc-source-badge">PREP</div>
  {/if}
</div>
