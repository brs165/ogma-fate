<script>
  export let card = {};
  export let onUpdate = () => {};
  export let onDelete = () => {};
  export let onDragStart = () => {};
  export let childCards = [];

  const LABEL_STYLES = [
    { bg: 'color-mix(in srgb,var(--accent) 10%,var(--panel))', border: 'var(--accent)', text: 'var(--accent)' },
    { bg: 'color-mix(in srgb,var(--c-green,#34c759) 10%,var(--panel))', border: 'var(--c-green,#34c759)', text: 'var(--c-green,#34c759)' },
    { bg: 'color-mix(in srgb,var(--c-red,#ff3b30) 10%,var(--panel))', border: 'var(--c-red,#ff3b30)', text: 'var(--c-red,#ff3b30)' },
    { bg: 'color-mix(in srgb,var(--c-purple,#a78bfa) 10%,var(--panel))', border: 'var(--c-purple,#a78bfa)', text: 'var(--c-purple,#a78bfa)' },
    { bg: 'color-mix(in srgb,var(--c-amber,#f4b942) 10%,var(--panel))', border: 'var(--c-amber,#f4b942)', text: 'var(--c-amber,#f4b942)' },
  ];

  let editing = false;
  let draft = card.text || 'Section';

  $: S = LABEL_STYLES[card.styleIdx || 0] || LABEL_STYLES[0];
  $: zoneMode = card.zoneMode || false;
  $: zoneW = zoneMode && childCards.length > 0
    ? Math.max(400, ...childCards.map(c => (c.x - card.x) + 360)) + 40
    : (card.zoneW || 400);
  $: zoneH = zoneMode && childCards.length > 0
    ? Math.max(200, ...childCards.map(c => (c.y - card.y) + 300)) + 40
    : (card.zoneH || 200);

  function commit() {
    editing = false;
    if (draft.trim() && draft !== card.text) onUpdate(card.id, { text: draft.trim() });
  }

  function onMouseDown(e) {
    if (editing || e.target.closest('.bc-actions')) return;
    onDragStart(e, card.id);
  }

  function onDoubleClick(e) {
    e.stopPropagation();
    draft = card.text || 'Section';
    editing = true;
  }

  function onWrapperKeyDown(e) {
    if (!editing && (e.key === 'Enter' || e.key === 'F2')) {
      e.preventDefault();
      draft = card.text || 'Section';
      editing = true;
    }
    if (!editing && (e.key === 'Delete' || e.key === 'Backspace')) {
      e.preventDefault();
      onDelete(card.id);
    }
  }

  function onInputKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { editing = false; }
  }

  function cycleStyle(e) {
    e.stopPropagation();
    onUpdate(card.id, { styleIdx: ((card.styleIdx || 0) + 1) % LABEL_STYLES.length });
  }

  function deleteLabel(e) {
    e.stopPropagation();
    onDelete(card.id);
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-no-noninteractive-tabindex -->
<div
  class="board-label"
  class:editing
  class:zone-active={zoneMode}
  style:left="{card.x}px"
  style:top="{card.y}px"
  style:z-index={card.z || 1}
  style:width="{zoneMode ? zoneW + 'px' : 'auto'}"
  style:height="{zoneMode ? zoneH + 'px' : 'auto'}"
  tabindex={editing ? -1 : 0}
  role="heading"
  aria-level="2"
  aria-label="Section: {card.text || 'Section'}"
  on:mousedown={onMouseDown}
  on:dblclick={onDoubleClick}
  on:keydown={onWrapperKeyDown}
>
  <div class="bc-actions">
    <button class="bc-btn" title="Toggle Zone Container"
      on:click|stopPropagation={() => onUpdate(card.id, { zoneMode: !zoneMode, zoneW: 400, zoneH: 200 })}
    >{zoneMode ? '⊟' : '⊞'}</button>
    <button class="bc-btn" title="Change colour" on:click={cycleStyle}>🎨</button>
    <button class="bc-btn" title="Delete" on:click={deleteLabel}>✕</button>
  </div>

  {#if zoneMode}
    <div class="board-zone-container"
      style:border-color={S.border}
      style:background={S.bg}
      style:width="{zoneW}px"
      style:height="{zoneH}px"
    ></div>
  {/if}

  <div class="board-label-inner"
       style:background={S.bg}
       style:border-color={S.border}
       style:color={S.text}>
    {#if editing}
      <!-- svelte-ignore a11y-autofocus -->
      <input
        type="text"
        class="board-label-input"
        bind:value={draft}
        autofocus
        aria-label="Edit label text"
        style:background="transparent"
        style:color={S.text}
        style:border="none"
        style:outline="none"
        style:font-family="inherit"
        style:font-size="inherit"
        style:font-weight="inherit"
        style:width="100%"
        on:blur={commit}
        on:keydown={onInputKeyDown}
        on:click|stopPropagation
      />
    {:else}
      <span title="Double-click to rename">{card.text || 'Section'}</span>
    {/if}
  </div>
</div>
