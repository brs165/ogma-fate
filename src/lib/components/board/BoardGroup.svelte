<script>
  // BoardGroup — WC-02 scene container / node group
  // Draggable + resizable labelled region. Cards inside get a tinted bg.
  // Rendered BEHIND cards in OgmaCanvas (lower z-index).
  let {
    group = {},          // { id, label, x, y, w, h, colorIdx }
    zoom = 1,
    panX = 0,
    panY = 0,
    onUpdate = null,
    onDelete = null,
  } = $props();

  const GROUP_COLORS = [
    { border: '#4a7aff44', bg: '#4a7aff0d', text: '#4a7aff' },  // blue
    { border: '#ff6b6b44', bg: '#ff6b6b0d', text: '#ff6b6b' },  // red
    { border: '#51cf6644', bg: '#51cf660d', text: '#51cf66' },  // green
    { border: '#ffd43b44', bg: '#ffd43b0d', text: '#ffd43b' },  // gold
    { border: '#cc5de844', bg: '#cc5de80d', text: '#cc5de8' },  // purple
  ];
  let col = $derived(GROUP_COLORS[(group.colorIdx || 0) % GROUP_COLORS.length]);
  let editing = $state(false);
  let labelEl = $state();

  // ── Drag (move whole group) ────────────────────────────────────────────────
  let dragOffset = $state(null);
  function onBodyPointerDown(e) {
    if (e.target.closest('.bg-resize') || e.target.closest('.bg-label-input') || e.target.closest('.bg-actions')) return;
    if (e.button !== 0) return;
    dragOffset = { dx: e.clientX / zoom - group.x, dy: e.clientY / zoom - group.y };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
  }
  function onBodyPointerMove(e) {
    if (!dragOffset) return;
    const nx = e.clientX / zoom - dragOffset.dx;
    const ny = e.clientY / zoom - dragOffset.dy;
    onUpdate?.(group.id, { x: nx, y: ny });
  }
  function onBodyPointerUp() { dragOffset = null; }

  // ── Resize (SE corner handle) ──────────────────────────────────────────────
  let resizeStart = $state(null);
  function onResizePointerDown(e) {
    if (e.button !== 0) return;
    resizeStart = { mx: e.clientX, my: e.clientY, w: group.w, h: group.h };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
  }
  function onResizePointerMove(e) {
    if (!resizeStart) return;
    const dw = (e.clientX - resizeStart.mx) / zoom;
    const dh = (e.clientY - resizeStart.my) / zoom;
    onUpdate?.(group.id, { w: Math.max(200, resizeStart.w + dw), h: Math.max(100, resizeStart.h + dh) });
  }
  function onResizePointerUp() { resizeStart = null; }

  // ── Label edit ─────────────────────────────────────────────────────────────
  function startEdit() { editing = true; setTimeout(() => labelEl?.focus(), 0); }
  function commitLabel(e) {
    editing = false;
    onUpdate?.(group.id, { label: e.target.value || 'Scene' });
  }
  function cycleColor() {
    onUpdate?.(group.id, { colorIdx: ((group.colorIdx || 0) + 1) % GROUP_COLORS.length });
  }
</script>

<!-- Group body (rendered at group canvas position) -->
<div
  class="board-group"
  style="
    left:{group.x}px; top:{group.y}px;
    width:{group.w}px; height:{group.h}px;
    border-color:{col.border};
    background:{col.bg};
  "
  onpointerdown={onBodyPointerDown}
  onpointermove={onBodyPointerMove}
  onpointerup={onBodyPointerUp}
  onpointercancel={onBodyPointerUp}
  role="group"
  aria-label="Scene group: {group.label || 'Scene'}"
>
  <!-- Header bar -->
  <div class="bg-header" style="border-color:{col.border}; color:{col.text}">
    {#if editing}
      <input
        class="bg-label-input"
        bind:this={labelEl}
        value={group.label || 'Scene'}
        onblur={commitLabel}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') e.target.blur(); }}
        style="color:{col.text}"
      />
    {:else}
      <span
        class="bg-label"
        ondblclick={startEdit}
        title="Double-click to rename"
      >{group.label || 'Scene'}</span>
    {/if}
    <div class="bg-actions">
      <button class="bg-action-btn" onclick={cycleColor} aria-label="Change group colour">◐</button>
      <button class="bg-action-btn" onclick={() => onDelete?.(group.id)} aria-label="Delete group">✕</button>
    </div>
  </div>

  <!-- SE resize handle -->
  <div
    class="bg-resize"
    onpointerdown={onResizePointerDown}
    onpointermove={onResizePointerMove}
    onpointerup={onResizePointerUp}
    onpointercancel={onResizePointerUp}
    aria-label="Resize group"
    role="presentation"
    style="border-color:{col.border}"
  ></div>
</div>
