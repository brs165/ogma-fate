<svelte:options runes={false} />

<script>
  // ── BoardSticky — inline-editable aspect sticky note ─────────────────────────
  export let card       = {};
  export let onDelete   = null;
  export let onUpdate   = null;
  export let onDragStart = null;
  export let onInvoke   = null;

  const STICKY_COLORS = [
    {bg: '#fff9c4', text: '#5a4e00', label: '#8a7800'},
    {bg: '#d4f5e4', text: '#0d4d2a', label: '#0d6e3a'},
    {bg: '#fde8d8', text: '#6a2a00', label: '#b84a1a'},
    {bg: '#e8e4fc', text: '#2a2060', label: '#5a50b0'},
  ];

  let editing = false;
  let draft   = card.text || '';

  $: sc = STICKY_COLORS[card.colorIdx || 0];

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

  $: freeInvokes = card.freeInvokes || 0;

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
  $: if (editing && textareaEl) setTimeout(() => textareaEl && textareaEl.focus(), 0);
</script>

<div
  class="board-sticky{editing ? ' editing' : ''}"
  style="left:{card.x}px; top:{card.y}px; background:{sc.bg}; color:{sc.text};
         transform:{editing ? 'rotate(0deg)' : 'rotate(' + (card.rotation || 0) + 'deg)'};
         z-index:{card.z || 1}"
  tabindex={editing ? -1 : 0}
  role="note"
  aria-label="Aspect sticky: {card.text || 'New Aspect'}{editing ? '' : '. Press Enter to edit.'}"
  on:mousedown={onMouseDown}
  on:dblclick|stopPropagation={startEdit}
  on:keydown={onKeyDown}
>
  <div class="bc-actions">
    {#if card.rotation}
      <button class="bc-btn" title="Reset rotation" aria-label="Reset rotation"
        on:click|stopPropagation={() => onUpdate && onUpdate(card.id, { rotation: 0 })}><i class="fa-solid fa-rotate-right" aria-hidden="true"></i></button>
    {/if}
    <button class="bc-btn" title="Delete" aria-label="Delete"
      on:click|stopPropagation={() => onDelete && onDelete(card.id)}><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
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
      on:blur={commitEdit}
      on:keydown={onTextareaKeyDown}
      on:click|stopPropagation
    ></textarea>
  {:else}
    <div class="board-sticky-text" title="Double-click to edit">{card.text || '"New Aspect"'}</div>
  {/if}

  <!-- Free invoke pips -->
  <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
  <div class="sticky-invokes" on:click|stopPropagation>
    <span class="sticky-inv-label" style="color:{sc.label}">Invokes</span>
    {#each [0,1,2,3] as i}
      {@const filled = i < freeInvokes}
      <button
        class="sticky-inv-pip{filled ? ' filled' : ''}"
        style="background:{filled ? sc.label : 'transparent'}; border-color:{sc.label}"
        title={filled ? 'Use free invoke' : 'Empty'}
        aria-label={filled ? 'Use free invoke ' + (i+1) : 'Empty invoke slot ' + (i+1)}
        on:click={() => pipClick(i)}
      ></button>
    {/each}
    <button
      class="sticky-inv-add"
      style="color:{sc.label}; border-color:{sc.label}"
      title="Add free invoke"
      aria-label="Add free invoke"
      on:click={addInvoke}
    >+</button>
  </div>
</div>
