<script>
  // ── BoardSticky — inline-editable aspect sticky note ─────────────────────────
  import { tick } from 'svelte';
  let { card = {}, onDelete = null, onUpdate = null, onDragStart = null, onInvoke = null } = $props();
  const STICKY_COLORS = [
    {bg: '#fff9c4', text: '#5a4e00', label: '#8a7800'},
    {bg: '#d4f5e4', text: '#0d4d2a', label: '#0d6e3a'},
    {bg: '#fde8d8', text: '#6a2a00', label: '#b84a1a'},
    {bg: '#e8e4fc', text: '#2a2060', label: '#5a50b0'},
  ];

  let editing = $state(false);
  let draft = $state(card.text || '');

  let sc = $derived(STICKY_COLORS[card.colorIdx || 0]);

  function commitEdit() {
    editing = false;
    if (draft !== card.text) {
      if (onUpdate) onUpdate(card.id, { text: draft || 'New Aspect' });
    }
  }

  function startEdit() {
    draft   = card.text || '';
    editing = true;
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

  let freeInvokes = $derived(card.freeInvokes || 0);

  function pipClick(i) {
    const fi = card.freeInvokes || 0;
    if (i < fi) {
      if (onUpdate) onUpdate(card.id, { freeInvokes: Math.max(0, fi - 1) });
      if (onInvoke) onInvoke({ source: 'free', label: card.text || 'Aspect' });
    }
  }

  function addInvoke() {
    const fi = card.freeInvokes || 0;
    if (fi < 4 && onUpdate) onUpdate(card.id, { freeInvokes: fi + 1 });
  }

  let textareaEl;
  $effect(() => { if (editing && textareaEl) tick().then(() => textareaEl?.focus()); });
</script>

<div
  class="board-sticky{editing ? ' editing' : ''}"
  style="background:{sc.bg}; color:{sc.text};
         transform:{editing ? 'rotate(0deg)' : 'rotate(' + (card.rotation || 0) + 'deg)'};
         z-index:{card.z || 1}"
  tabindex={editing ? -1 : 0}
  role="note"
  aria-label="Aspect sticky: {card.text || 'New Aspect'}{editing ? '' : '. Press Enter to edit.'}"
  ondblclick={(e) => { e.stopPropagation(); startEdit(e); }}
  onkeydown={onKeyDown}
>
  <div class="bc-actions nodrag nopan">
    {#if card.rotation}
      <button class="bc-btn" aria-label="Reset rotation"
        onclick={(e) => { e.stopPropagation(); (() => onUpdate && onUpdate(card.id, { rotation: 0 }))(e); }}>↻</button>
    {/if}
    <button class="bc-btn" aria-label="Delete"
      onclick={(e) => { e.stopPropagation(); (() => onDelete && onDelete(card.id))(e); }}>✕</button>
  </div>

  <div class="board-sticky-label" style="color:{sc.label}">Aspect</div>

  {#if editing}
    <!-- svelte-ignore a11y_autofocus -->
    <textarea
      bind:this={textareaEl}
      bind:value={draft}
      rows="3"
      autofocus
      class="board-sticky-input"
      style="background:transparent; color:{sc.text}; border:none; border-bottom:2px solid {sc.label};
             outline:none; width:100%; resize:none; font-family:inherit; font-size:12px;
             padding:0; line-height:1.5"
      onblur={commitEdit}
      onkeydown={onTextareaKeyDown}
      onclick={(e) => e.stopPropagation()}
    ></textarea>
  {:else}
    <div class="board-sticky-text" >{card.text || '"New Aspect"'}</div>
  {/if}

  <!-- Free invoke pips -->
  <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
  <div class="sticky-invokes" onclick={(e) => e.stopPropagation()}>
    <span class="sticky-inv-label" style="color:{sc.label}">Invokes</span>
    {#each [0,1,2,3] as i}
      {@const filled = i < freeInvokes}
      <button
        class="sticky-inv-pip{filled ? ' filled' : ''}"
        style="background:{filled ? sc.label : 'transparent'}; border-color:{sc.label}"
        aria-label={filled ? 'Use free invoke ' + (i+1) : 'Empty invoke slot ' + (i+1)}
        onclick={() => pipClick(i)}
      ></button>
    {/each}
    <button
      class="sticky-inv-add"
      style="color:{sc.label}; border-color:{sc.label}"
      aria-label="Add free invoke"
      onclick={addInvoke}
    >+</button>
  </div>
</div>
