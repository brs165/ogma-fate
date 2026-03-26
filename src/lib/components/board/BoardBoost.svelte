<script>
  // ── BoardBoost — ephemeral boost card with 1 free invoke ─────────────────────
  let { card = {}, onDelete = null, onUpdate = null, onDragStart = null, onInvoke = null } = $props();
  let editing = false;
  let draft   = card.text || '';

  let expired = $derived(card.expired || false);

  function commitEdit() {
    editing = false;
    if (draft !== card.text) {
      if (onUpdate) onUpdate(card.id, { text: draft || 'New Boost' });
    }
  }

  function startEdit() {
    draft   = card.text || '';
    editing = true;
  }

  function onMouseDown(e) {
    if (editing) return;
    if (e.target.closest('.bc-actions')) return;
    if (onDragStart) onDragStart(e, card.id);
  }

  function onKeyDown(e) {
    if (!editing && (e.key === 'Enter' || e.key === 'F2')) {
      e.preventDefault(); startEdit();
    }
    if (!editing && (e.key === 'Delete' || e.key === 'Backspace')) {
      e.preventDefault(); if (onDelete) onDelete(card.id);
    }
  }

  function onTextareaKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
    if (e.key === 'Escape') { editing = false; }
  }

  function useInvoke(e) {
    e.stopPropagation();
    if (onUpdate) onUpdate(card.id, { freeInvokes: 0, expired: true });
    if (onInvoke) onInvoke({ source: 'free', label: card.text || 'Boost' });
  }

  let textareaEl;
  $effect(() => { if (editing && textareaEl) setTimeout(() => textareaEl && textareaEl.focus(), 0); });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class="board-boost{expired ? ' boost-expired' : ''}{editing ? ' editing' : ''}"
  style="left:{card.x}px; top:{card.y}px;
         transform:{editing ? 'rotate(0deg)' : 'rotate(' + (card.rotation || 0) + 'deg)'};
         z-index:{card.z || 1}"
  tabindex={editing ? -1 : 0}
  role="note"
  aria-label="Boost: {card.text || 'New Boost'}{expired ? ' (expired)' : ''}"
  onmousedown={onMouseDown}
  ondblclick={(e) => { e.stopPropagation(); startEdit(e); }}
  onkeydown={onKeyDown}
>
  <div class="bc-actions">
    <button class="bc-btn" title="Delete"
      onclick={(e) => { e.stopPropagation(); (() => onDelete && onDelete(card.id))(e); }}>✕</button>
  </div>

  <div class="boost-header">
    <span class="boost-icon">⚡</span>
    <span class="boost-label">Boost</span>
  </div>

  {#if editing}
    <!-- svelte-ignore a11y_autofocus -->
    <textarea
      bind:this={textareaEl}
      bind:value={draft}
      rows="2"
      autofocus
      class="board-sticky-input"
      style="background:transparent; color:#5a4e00; border:none; border-bottom:2px solid #f4b942;
             outline:none; width:100%; resize:none; font-family:inherit; font-size:12px;
             padding:0; line-height:1.5"
      onblur={commitEdit}
      onkeydown={onTextareaKeyDown}
      onclick={(e) => e.stopPropagation()}
    ></textarea>
  {:else}
    <div class="boost-text">{card.text || '"New Boost"'}</div>
  {/if}

  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="boost-invoke-row" onclick={(e) => e.stopPropagation()}>
    {#if expired}
      <span class="boost-expired-label">Expired — used</span>
    {:else}
      <button
        class="boost-use-btn"
        title="Use free invoke — boost expires after use"
        aria-label="Use boost free invoke"
        onclick={useInvoke}
      >● Use Invoke</button>
    {/if}
  </div>
</div>
