<script>
  // OgmaCanvas — native pan/zoom canvas surface
  // Self-contained: wheel zoom, pointer pan, pointer-capture card drag,
  // SVG connector overlay, CSS minimap, dot background, zoom controls.
  // Board.svelte passes data + callbacks; this component owns no store state.

  import BoardCard   from './BoardCard.svelte';
  import BoardSticky from './BoardSticky.svelte';
  import BoardBoost  from './BoardBoost.svelte';
  import BoardLabel  from './BoardLabel.svelte';
  import BoardGroup  from './BoardGroup.svelte';
  import CanvasContextMenu from './CanvasContextMenu.svelte';

  // ── Props ────────────────────────────────────────────────────────────────
  let {
    cards           = [],
    connectors      = [],
    groups          = [],
    loaded          = false,
    mode            = 'prep',
    campId          = '',
    cardSearch      = '',
    connectSourceId = null,
    modeTransitioning = false,
    ctx             = null,
    // Callbacks
    onUpdateCard    = null,
    onDeleteCard    = null,
    onRerollCard    = null,
    onOpenCard      = null,
    onInvoke        = null,
    onConnect       = null,
    onUpdateConnector = null,
    onUpdateGroup   = null,
    onDeleteGroup   = null,
    onContextMenu   = null,
    onCtxClose      = null,
    onCtxGenerate   = null,
    onCtxTemplate   = null,
    ctxTemplates    = [],
    onEdgeCoach     = null,
    onClearTable    = null,
    onAutoArrange   = null,
    onExportModal   = null,
    toast           = null,
    showToast       = null,
  } = $props();

  // ── Canvas state (fully owned here) ──────────────────────────────────────
  let panX = $state(20);
  let panY = $state(20);
  let zoom = $state(0.8);
  let cvWrap   = $state();
  let dragState = $state(null); // { cardId, offsetX, offsetY, currentX, currentY, moved }
  let panDrag   = $state(null); // { startX, startY, startPanX, startPanY }

  const MIN_ZOOM = 0.15, MAX_ZOOM = 2.5;

  // ── Coordinate math ───────────────────────────────────────────────────────
  function screenToCanvas(sx, sy) {
    return { x: (sx - panX) / zoom, y: (sy - panY) / zoom };
  }

  // ── Zoom ──────────────────────────────────────────────────────────────────
  function adjustZoom(delta) {
    zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta));
  }

  export function fitAll() {
    if (!cards.length || !cvWrap) return;
    const CARD_W = 646, CARD_H = 320, PAD = 60;
    const minX = Math.min(...cards.map(c => c.x)) - PAD;
    const minY = Math.min(...cards.map(c => c.y)) - PAD;
    const maxX = Math.max(...cards.map(c => c.x + CARD_W)) + PAD;
    const maxY = Math.max(...cards.map(c => c.y + CARD_H)) + PAD;
    const w = maxX - minX, h = maxY - minY;
    const rect = cvWrap.getBoundingClientRect();
    const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.min(rect.width / w, rect.height / h)));
    zoom = z;
    panX = (rect.width  - w * z) / 2 - minX * z;
    panY = (rect.height - h * z) / 2 - minY * z;
  }

  // ── Wheel zoom (zoom toward cursor) ──────────────────────────────────────
  function onWheel(e) {
    e.preventDefault();
    if (!cvWrap) return;
    const rect  = cvWrap.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const delta  = e.deltaMode === 1 ? -e.deltaY * 0.05 : -e.deltaY * 0.001;
    const newZ   = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta));
    panX = mouseX - (mouseX - panX) * (newZ / zoom);
    panY = mouseY - (mouseY - panY) * (newZ / zoom);
    zoom = newZ;
  }

  // ── Pan (drag on empty canvas) ────────────────────────────────────────────
  function onWrapPointerDown(e) {
    if (e.target.closest('.cv-card-pos')) return;
    if (e.button !== 0) return;
    panDrag = { startX: e.clientX, startY: e.clientY, startPanX: panX, startPanY: panY };
    if (cvWrap) cvWrap.setPointerCapture(e.pointerId);
  }

  // ── Card drag ─────────────────────────────────────────────────────────────
  function onCardPointerDown(e, card) {
    if (e.button !== 0) return;
    if (e.target.closest('button') || e.target.closest('input') ||
        e.target.closest('textarea') || e.target.closest('select') ||
        e.target.closest('a') || e.target.closest('[contenteditable]')) return;
    e.stopPropagation();
    const cp = screenToCanvas(e.clientX, e.clientY);
    dragState = {
      cardId: card.id,
      offsetX: cp.x - card.x,
      offsetY: cp.y - card.y,
      currentX: card.x,
      currentY: card.y,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onWrapPointerMove(e) {
    if (panDrag) {
      panX = panDrag.startPanX + (e.clientX - panDrag.startX);
      panY = panDrag.startPanY + (e.clientY - panDrag.startY);
      return;
    }
    if (dragState) {
      const cp = screenToCanvas(e.clientX, e.clientY);
      dragState = {
        ...dragState,
        currentX: Math.round(cp.x - dragState.offsetX),
        currentY: Math.round(cp.y - dragState.offsetY),
        moved: true,
      };
    }
  }

  function onWrapPointerUp(e) {
    if (panDrag) { panDrag = null; return; }
    if (dragState) {
      if (dragState.moved && onUpdateCard) {
        // ── Stack detection (WC-07) ─────────────────────────────────────────
        // If dropped within 80px of another card's centre, form a stack
        const SNAP = 80;
        const droppedCard = cards.find(c => c.id === dragState.cardId);
        const target = droppedCard ? cards.find(c => {
          if (c.id === dragState.cardId || c.genId === 'sticky' || c.genId === 'label') return false;
          const cx = c.x + 323, cy = c.y + 160; // card centre
          const dx = cx - (dragState.currentX + 323);
          const dy = cy - (dragState.currentY + 160);
          return Math.sqrt(dx*dx + dy*dy) < SNAP;
        }) : null;

        if (target) {
          // Stack: move dragged card onto target, mark stackId
          const stackId = target.stackId || target.id;
          onUpdateCard(dragState.cardId, {
            x: target.x + 12, y: target.y + 12,
            z: (target.z || 1) + 1,
            stackId,
          });
          // Ensure target also has stackId
          if (!target.stackId) onUpdateCard(target.id, { stackId: target.id });
          if (showToast) showToast('\u29C5 Cards stacked — click to expand');
        } else {
          // Normal move — clear stackId if it had one
          onUpdateCard(dragState.cardId, {
            x: dragState.currentX, y: dragState.currentY, z: Date.now(),
            stackId: null,
          });
        }
      }
      dragState = null;
    }
  }

  // ── Context menu ──────────────────────────────────────────────────────────
  function onContextMenuWrap(e) {
    if (e.target.closest('.board-card') || e.target.closest('.board-sticky')) return;
    e.preventDefault();
    const cp = screenToCanvas(e.clientX, e.clientY);
    if (onContextMenu) onContextMenu(e.clientX, e.clientY, cp.x, cp.y);
  }

  // ── Connector screen coords ───────────────────────────────────────────────
  function getCardCenter(cardId) {
    const isDragged = dragState?.cardId === cardId;
    const card = cards.find(c => c.id === cardId);
    if (!card) return null;
    const cx = isDragged ? dragState.currentX : card.x;
    const cy = isDragged ? dragState.currentY : card.y;
    const W = card.genId === 'label' ? 200 : (card.genId === 'sticky' || card.genId === 'boost') ? 160 : 646;
    const H = card.genId === 'label' ? 36  : (card.genId === 'sticky' || card.genId === 'boost') ? 140 : 300;
    return { x: (cx + W / 2) * zoom + panX, y: (cy + H / 2) * zoom + panY };
  }

  // ── Search dim ────────────────────────────────────────────────────────────
  function isSearchMatch(card) {
    if (!cardSearch) return true;
    const q = cardSearch.toLowerCase();
    return (card.title  || '').toLowerCase().includes(q) ||
           (card.summary || '').toLowerCase().includes(q) ||
           (card.text    || '').toLowerCase().includes(q) ||
           (card.genId   || '').toLowerCase().includes(q);
  }

  // ── Minimap ───────────────────────────────────────────────────────────────
  const CARD_COLORS = {
    npc_minor:'#e8b83a', npc_major:'#e8793a', backstory:'#4a90d9', scene:'#3aaa7a',
    encounter:'#d04a6a', complication:'#d04a6a', challenge:'#4a90d9', contest:'#6a7dd4',
    obstacle:'#888', countdown:'#e8793a', constraint:'#888', campaign:'#6a7dd4',
    seed:'#e8b83a', faction:'#6a7dd4', compel:'#3aaa7a', consequence:'#e8793a',
    custom:'#888', pc:'#3aaa7a', sticky:'#fff176', boost:'#f4b942', label:'#c8a96e',
  };
  function cardColor(genId) { return CARD_COLORS[genId] || '#888'; }

  const MM_W = 140, MM_H = 90;
  let showMinimap = $state(true);

  // ── Minimap click-to-pan ──────────────────────────────────────────────────
  function onMinimapClick(e) {
    const bounds = minimapBounds();
    if (!bounds || !cvWrap) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mmX = e.clientX - rect.left - 8;
    const mmY = e.clientY - rect.top  - 8;
    const canvasX = mmX / bounds.scale + bounds.minX;
    const canvasY = mmY / bounds.scale + bounds.minY;
    const wrapRect = cvWrap.getBoundingClientRect();
    panX = -(canvasX * zoom) + wrapRect.width  / 2;
    panY = -(canvasY * zoom) + wrapRect.height / 2;
  }
  function minimapBounds() {
    if (!cards.length) return null;
    const xs = cards.map(c => c.x), ys = cards.map(c => c.y);
    const minX = Math.min(...xs), minY = Math.min(...ys);
    const maxX = Math.max(...cards.map(c => c.x + 646)), maxY = Math.max(...cards.map(c => c.y + 300));
    const w = maxX - minX || 1, h = maxY - minY || 1;
    return { minX, minY, scale: Math.min((MM_W - 16) / w, (MM_H - 16) / h) };
  }
  function minimapViewport(bounds) {
    if (!bounds || !cvWrap) return null;
    const rect = cvWrap.getBoundingClientRect();
    return {
      x: (-panX / zoom - bounds.minX) * bounds.scale + 8,
      y: (-panY / zoom - bounds.minY) * bounds.scale + 8,
      w: (rect.width  / zoom) * bounds.scale,
      h: (rect.height / zoom) * bounds.scale,
    };
  }

  // ── Edge label cycling ────────────────────────────────────────────────────
  const EDGE_LABELS = ['', 'Knows', 'Opposes', 'Ally', 'Fears', 'Owes', 'Loves', 'Rival', 'Commands', 'Seeks'];
  function cycleEdgeLabel(conn) {
    if (onEdgeCoach) onEdgeCoach();
    if (onUpdateConnector)
      onUpdateConnector(conn.id, { label: EDGE_LABELS[(EDGE_LABELS.indexOf(conn.label || '') + 1) % EDGE_LABELS.length] });
  }
</script>

<!-- ── Canvas surface ──────────────────────────────────────────────────────── -->
<div
  class="cv-wrap{connectSourceId ? ' connect-mode' : ''}{modeTransitioning ? ' mode-transitioning' : ''}"
  bind:this={cvWrap}
  onwheel={onWheel}
  onpointerdown={onWrapPointerDown}
  onpointermove={onWrapPointerMove}
  onpointerup={onWrapPointerUp}
  onpointercancel={onWrapPointerUp}
  oncontextmenu={onContextMenuWrap}
  role="application"
  aria-label="Campaign canvas"
>
  <!-- Dot background -->
  <div class="cv-dot-bg" aria-hidden="true"></div>

  <!-- SVG connector overlay -->
  <svg class="cv-svg-overlay" aria-hidden="true">
    {#each connectors as conn (conn.id)}
      {#if getCardCenter(conn.fromId) && getCardCenter(conn.toId)}
        {@const a = getCardCenter(conn.fromId)}
        {@const b = getCardCenter(conn.toId)}
        {@const mx = (a.x + b.x) / 2}
        {@const my = (a.y + b.y) / 2}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <g onclick={(e) => { e.stopPropagation(); cycleEdgeLabel(conn); }} style="cursor:pointer">
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} class="cv-connector-line" />
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} class="cv-connector-hit" />
          {#if conn.label}
            <rect x={mx - 28} y={my - 9} width="56" height="18" rx="3" class="cv-edge-label-bg" />
            <text x={mx} y={my + 4} class="cv-edge-label">{conn.label}</text>
          {/if}
        </g>
      {/if}
    {/each}
  </svg>

  <!-- Transformed viewport — all cards live here -->
  <div
    class="cv-viewport"
    style="transform: translate({panX}px,{panY}px) scale({zoom}); transform-origin: 0 0;"
  >
    <!-- Groups render beneath cards (lower z-index) -->
    {#each groups as group (group.id)}
      <BoardGroup
        {group}
        {zoom}
        {panX}
        {panY}
        onUpdate={onUpdateGroup}
        onDelete={onDeleteGroup}
      />
    {/each}

    {#each [...cards].sort((a, b) => (a.z || 0) - (b.z || 0)) as card (card.id)}
      {@const isDragged = dragState?.cardId === card.id}
      {@const cx = isDragged ? dragState.currentX : card.x}
      {@const cy = isDragged ? dragState.currentY : card.y}
      {@const dimmed = !isSearchMatch(card)}
      <div
        class="cv-card-pos{isDragged ? ' cv-dragging' : ''}{dimmed ? ' cv-dimmed' : ''}{connectSourceId === card.id ? ' cv-connect-source' : ''}"
        style="left:{cx}px; top:{cy}px; z-index:{isDragged ? 9999 : (card.z || 1)};"
        onpointerdown={(e) => onCardPointerDown(e, card)}
      >
        {#if card.genId === 'sticky'}
          <BoardSticky {card} onDelete={onDeleteCard} onUpdate={onUpdateCard} />
        {:else if card.genId === 'boost'}
          <BoardBoost  {card} onDelete={onDeleteCard} onUpdate={onUpdateCard} />
        {:else if card.genId === 'label'}
          <BoardLabel  {card} onDelete={onDeleteCard} onUpdate={onUpdateCard} />
        {:else}
          {@const stackCount = card.stackId ? cards.filter(c => c.stackId === card.stackId || c.id === card.stackId).length : 1}
          <BoardCard
            {card} {mode} {campId}
            isOnTable={false}
            {stackCount}
            onDelete={onDeleteCard}
            onReroll={onRerollCard}
            onUpdate={(id, patch) => {
              if (patch._fanStack) {
                // Fan out all cards in this stack — smart placement avoids existing cards
                const stackId = card.stackId || card.id;
                const stackCards = cards.filter(c => c.stackId === stackId || c.id === stackId);
                const otherCards = cards.filter(c => c.stackId !== stackId && c.id !== stackId);
                const COLS = 3, CW = 680, CH = 500;

                // Find a clear origin: start at card position, shift right if occupied
                let originX = card.x;
                let originY = card.y;
                const isOccupied = (x, y) => otherCards.some(oc =>
                  Math.abs(oc.x - x) < CW * 0.6 && Math.abs(oc.y - y) < CH * 0.6
                );
                // Try a few origin offsets to find clear space
                const offsets = [[0,0],[0,-520],[0,520],[CW*COLS+40,0],[-CW-40,0]];
                for (const [ox, oy] of offsets) {
                  if (!isOccupied(originX + ox, originY + oy)) {
                    originX += ox; originY += oy; break;
                  }
                }

                stackCards.forEach((sc, i) => {
                  if (onUpdateCard) onUpdateCard(sc.id, {
                    x: originX + (i % COLS) * CW,
                    y: originY + Math.floor(i / COLS) * CH,
                    z: Date.now() + i,
                    stackId: null,
                  });
                });
                if (showToast) showToast('\u29C4 Stack fanned — ' + stackCards.length + ' cards');
                return;
              }
              if (onUpdateCard) onUpdateCard(id, patch);
            }}
            onSendToTable={null}
            onOpen={onOpenCard}
            onInvoke={onInvoke}
            onConnect={onConnect}
            isConnectSource={connectSourceId === card.id}
          />
        {/if}
      </div>
    {/each}
  </div>

  <!-- Empty canvas CTA -->
  {#if loaded && cards.length === 0}
    <div class="cv-empty-hint" aria-hidden="true">
      <div class="cv-empty-icon">◈</div>
      <div class="cv-empty-title">Table is ready</div>
      <div class="cv-empty-steps">
        <div class="cv-empty-step">
          <span class="cv-empty-step-num">1</span>
          <span>Pick a generator on the left</span>
        </div>
        <div class="cv-empty-step">
          <span class="cv-empty-step-num">2</span>
          <span>Hit <kbd>Space</kbd> or <strong>Roll</strong></span>
        </div>
        <div class="cv-empty-step">
          <span class="cv-empty-step-num">3</span>
          <span>Click <strong>→ Table</strong> to place it here</span>
        </div>
      </div>
      <div class="cv-empty-sub">Right-click anywhere to generate directly · <kbd>Ctrl+K</kbd> for commands</div>
    </div>
  {/if}

  <!-- Zoom controls -->
  <div class="cv-controls" aria-label="Canvas controls">
    <button class="cv-ctrl-btn" onclick={() => adjustZoom(0.15)}  aria-label="Zoom in">+</button>
    <button class="cv-ctrl-btn" onclick={() => adjustZoom(-0.15)} aria-label="Zoom out">−</button>
    <button class="cv-ctrl-btn" onclick={fitAll}                  aria-label="Fit all cards">⊡</button>
    {#if cards.length > 0}
      <div class="cv-ctrl-sep" aria-hidden="true"></div>
      <button class="cv-ctrl-btn" onclick={onAutoArrange} aria-label="Auto-arrange cards">⊞</button>
      <button class="cv-ctrl-btn" onclick={onExportModal} aria-label="Export / Import">↓</button>
      <button class="cv-ctrl-btn cv-ctrl-danger" onclick={onClearTable} aria-label="Clear table">✕</button>
    {/if}
  </div>

  <!-- Minimap -->
  {#if cards.length > 0}
    {@const bounds = minimapBounds()}
    {@const vp = bounds ? minimapViewport(bounds) : null}
    <div class="cv-minimap{showMinimap ? '' : ' cv-minimap-hidden'}"
      role="button"
      tabindex="0"
      aria-label="Canvas minimap — click to pan"
      onclick={onMinimapClick}
      onkeydown={(e) => { if (e.key === 'Enter') onMinimapClick(e); }}
    >
      {#if showMinimap && bounds}
        {#each cards as c (c.id)}
          <div class="cv-mm-card" style="
            left:{(c.x - bounds.minX) * bounds.scale + 8}px;
            top:{(c.y - bounds.minY) * bounds.scale + 8}px;
            width:{Math.max(3, 16 * bounds.scale)}px;
            height:{Math.max(2, 10 * bounds.scale)}px;
            background:{cardColor(c.genId)};
          "></div>
        {/each}
        {#if vp}
          <div class="cv-mm-vp" style="
            left:{vp.x}px; top:{vp.y}px;
            width:{Math.max(8, vp.w)}px; height:{Math.max(8, vp.h)}px;
          "></div>
        {/if}
      {/if}
      <!-- Toggle button -->
      <button
        class="cv-mm-toggle"
        onclick={(e) => { e.stopPropagation(); showMinimap = !showMinimap; }}
        aria-label={showMinimap ? 'Hide minimap' : 'Show minimap'}
        aria-pressed={String(showMinimap)}
      >{showMinimap ? '▼' : '▲'}</button>
    </div>
  {/if}

  <!-- Context menu -->
  <CanvasContextMenu
    {ctx}
    onClose={onCtxClose}
    onGenerate={onCtxGenerate}
    onTemplate={onCtxTemplate}
    templates={ctxTemplates}
  />

  <!-- Toast -->
  {#if toast}
    <div class="cv-toast">{toast}</div>
  {/if}
</div>
