<script>
  // ── TurnBar — draggable turn order strip for Play mode ────────────────────────
  import { AlertDialog, Tooltip } from 'bits-ui';

  let { players = [], order = [], setOrder = null, onToggleActed = null, round = 1, onNewRound = null, onPrevRound = null, roundFlash = false, onEndScene = null, onStartSession = null, onNewScene = null, onSessionSummary = null, onPrintScene = null, npcCards = [], onToggleNpcActed = null } = $props();
  let dragId = $state(null);
  let overId = $state(null);

  let orderedPlayers = $derived((() => {
    const op = order.map(id => players.find(p => p.id === id)).filter(Boolean);
    players.forEach(p => { if (order.indexOf(p.id) < 0) op.push(p); });
    return op;
  })());

  let allActed = $derived(players.length > 0
    && players.every(p => p.acted)
    && npcCards.every(n => n.acted));

  let stressedCount = $derived(players.filter(p =>
    (p.phy || []).some(Boolean) || (p.men || []).some(Boolean)
  ).length);

  function onDragStart(e, id) {
    dragId = id;
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e, id) {
    e.preventDefault();
    if (id !== dragId) overId = id;
  }

  function onDrop(e, toId) {
    e.preventDefault();
    if (dragId && dragId !== toId && setOrder) {
      setOrder(o => {
        const a = o.slice();
        const fi = a.indexOf(dragId);
        const ti = a.indexOf(toId);
        if (fi < 0 || ti < 0) return o;
        a.splice(fi, 1);
        a.splice(ti, 0, dragId);
        return a;
      });
    }
    dragId = null;
    overId = null;
  }

  function onDragEnd() {
    dragId = null;
    overId = null;
  }

  let confirmPending = $state(null); // { action, label, detail, fn }

  function requestConfirm(action, label, detail, fn) {
    confirmPending = { action, label, detail, fn };
  }

  function doConfirm() {
    if (confirmPending) confirmPending.fn();
    confirmPending = null;
  }

  function endScene() {
    requestConfirm('end-scene', 'End Scene?',
      'Stress cleared. Consequences and FP preserved.',
      () => { if (onEndScene) onEndScene(); });
  }

  function startSession() {
    requestConfirm('start-session', 'Start New Session?',
      'FP reset to refresh value. Round resets to 1.',
      () => { if (onStartSession) onStartSession(); });
  }

  function newScene() {
    requestConfirm('new-scene', 'New Scene?',
      'Play table cleared. Stress cleared. GM pool reset.',
      () => { if (onNewScene) onNewScene(); });
  }

  function onNpcKeyDown(e, npc) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onToggleNpcActed) onToggleNpcActed(npc.id);
    }
  }
</script>

<div class="board-turn-bar">
  <!-- Round pill -->
  <div class="rs-round-pill{roundFlash ? ' rs-round-flash' : ''}" style="flex-shrink:0">
    <button class="rs-round-btn" onclick={onPrevRound} aria-label="Prev round">−</button>
    <span style="font-size:10px; color:var(--text-muted); margin-right:2px; letter-spacing:.03em">XCHG</span>
    <span class="rs-round-num" aria-live="polite" aria-atomic="true" aria-label="Round {round}">{round}</span>
    <button class="rs-round-btn" onclick={onNewRound} aria-label="New round">+</button>
  </div>

<AlertDialog.Root open={confirmPending !== null} onOpenChange={(o) => { if (!o) confirmPending = null; }}>
  <AlertDialog.Portal>
    <AlertDialog.Overlay class="tb-confirm-overlay" />
    <AlertDialog.Content class="tb-confirm-box">
      {#if confirmPending}
        <AlertDialog.Title class="tb-confirm-title">{confirmPending.label}</AlertDialog.Title>
        <AlertDialog.Description class="tb-confirm-detail">{confirmPending.detail}</AlertDialog.Description>
        <div class="tb-confirm-actions">
          <AlertDialog.Cancel class="tb-confirm-cancel">Cancel</AlertDialog.Cancel>
          <AlertDialog.Action class="tb-confirm-ok" onclick={doConfirm}>Confirm</AlertDialog.Action>
        </div>
      {/if}
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>

  <span class="rs-turn-label" style="flex-shrink:0">Turn:</span>

  <!-- PC pills -->
  {#each orderedPlayers as p (p.id)}
    <div
      class="rs-turn-pill{p.acted ? ' acted' : ''}{dragId === p.id ? ' dragging' : ''}{overId === p.id ? ' drag-over' : ''}"
      draggable="true"
      role="button"
      tabindex="0"
      aria-label="{p.name}{p.acted ? ' (acted)' : ''}"
      ondragstart={e => onDragStart(e, p.id)}
      ondragover={e => onDragOver(e, p.id)}
      ondrop={e => onDrop(e, p.id)}
      ondragend={onDragEnd}
      onclick={() => onToggleActed && onToggleActed(p.id)}
      onkeydown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleActed && onToggleActed(p.id); } }}
    >
      {#if p.avatar}
        <span class="rs-turn-avatar">{p.avatar}</span>
      {:else}
        <div class="rs-turn-dot" style="background:{p.color || 'var(--accent)'}"></div>
      {/if}
      <span style="font-size:10px; font-weight:700; color:{p.acted ? 'var(--c-green)' : 'var(--text)'}">{p.name}</span>
      {#if p.acted}<span style="font-size:10px; color:var(--c-green)"> ✓</span>{/if}
    </div>
  {/each}

  <!-- NPC pills (divider + pills) -->
  {#if npcCards.length > 0}
    <span style="width:1px; height:18px; background:var(--border); flex-shrink:0; margin:0 2px"></span>
    {#each npcCards as npc (npc.id)}
      <div
        class="rs-turn-pill{npc.acted ? ' acted' : ''}"
        role="button"
        tabindex="0"
        onclick={() => onToggleNpcActed && onToggleNpcActed(npc.id)}
        onkeydown={e => onNpcKeyDown(e, npc)}
        style="border-color:{npc.acted ? 'var(--c-green)' : 'var(--c-red)'}"
      >
        <div class="rs-turn-dot" style="background:var(--c-red)"></div>
        <span style="font-size:10px; font-weight:700; color:{npc.acted ? 'var(--c-green)' : 'var(--text)'}">{npc.title || 'NPC'}</span>
        {#if npc.acted}<span style="font-size:10px; color:var(--c-green)"> ✓</span>{/if}
      </div>
    {/each}
  {/if}

  {#if allActed}
    <div class="rs-all-acted">✦ All acted — new round?</div>
  {/if}

  <!-- Scene controls -->
  {#if onEndScene}
    <button class="board-scene-end" onclick={endScene}
      title="End scene — clears all stress (FCon p.30)" aria-label="End scene">
      {stressedCount > 0 ? '⏹ End Scene (' + stressedCount + ' stressed)' : '⏹ End Scene'}
    </button>
  {/if}

  {#if onStartSession}
    <button class="board-scene-end" onclick={startSession}
      title="Start session — refresh FP (FCon p.19)" aria-label="Start new session"
      style="border-color:var(--c-green); color:var(--c-green)">
      ▶ Start Session
    </button>
  {/if}

  {#if onNewScene}
    <button class="board-scene-end" onclick={newScene}
      title="New scene — clears table and stress" aria-label="New scene"
      style="border-color:var(--c-blue); color:var(--c-blue)">
      ⟳ New Scene
    </button>
  {/if}

  {#if onSessionSummary}
    <button class="board-scene-end" onclick={onSessionSummary}
      title="Copy session summary to clipboard" aria-label="Session summary"
      style="border-color:var(--text-muted); color:var(--text-muted)">
      📋 Summary
    </button>
    <button class="board-scene-end" onclick={() => onPrintScene && onPrintScene()}
      title="Print current scene state" aria-label="Print scene"
      style="border-color:var(--text-muted); color:var(--text-muted)">
      ⎙ Print
    </button>
  {/if}
</div>
