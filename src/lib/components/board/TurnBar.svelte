<svelte:options runes={false} />

<script>
  // ── TurnBar — draggable turn order strip for Play mode ────────────────────────
  export let players         = [];
  export let order           = [];
  export let setOrder        = null;
  export let onToggleActed   = null;
  export let round           = 1;
  export let onNewRound      = null;
  export let onPrevRound     = null;
  export let roundFlash      = false;
  export let onEndScene      = null;
  export let onStartSession  = null;
  export let onNewScene      = null;
  export let onSessionSummary = null;
  export let onPrintScene    = null;
  export let npcCards        = [];
  export let onToggleNpcActed = null;

  let dragId = null;
  let overId = null;

  $: orderedPlayers = (() => {
    const op = order.map(id => players.find(p => p.id === id)).filter(Boolean);
    players.forEach(p => { if (order.indexOf(p.id) < 0) op.push(p); });
    return op;
  })();

  $: allActed = players.length > 0
    && players.every(p => p.acted)
    && npcCards.every(n => n.acted);

  $: stressedCount = players.filter(p =>
    (p.phy || []).some(Boolean) || (p.men || []).some(Boolean)
  ).length;

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

  function endScene() {
    if (!confirm('End scene?\nAll stress boxes cleared. Consequences and FP preserved.')) return;
    if (onEndScene) onEndScene();
  }

  function startSession() {
    if (!confirm('Start new session?\nAll FP reset to refresh value (or current if higher). Round resets to 1.')) return;
    if (onStartSession) onStartSession();
  }

  function newScene() {
    if (!confirm('New scene?\nPlay table cleared. Stress cleared. GM pool reset. Round 1.')) return;
    if (onNewScene) onNewScene();
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
    <button class="rs-round-btn" on:click={onPrevRound} aria-label="Prev round">−</button>
    <span style="font-size:11px; color:var(--text-muted); margin-right:2px">Rnd</span>
    <span class="rs-round-num" aria-live="polite" aria-atomic="true" aria-label="Round {round}">{round}</span>
    <button class="rs-round-btn" on:click={onNewRound} aria-label="New round">+</button>
  </div>

  <span class="rs-turn-label" style="flex-shrink:0">Turn:</span>

  <!-- PC pills -->
  {#each orderedPlayers as p (p.id)}
    <div
      class="rs-turn-pill{p.acted ? ' acted' : ''}{dragId === p.id ? ' dragging' : ''}{overId === p.id ? ' drag-over' : ''}"
      draggable="true"
      role="button"
      tabindex="0"
      aria-label="{p.name}{p.acted ? ' (acted)' : ''}"
      on:dragstart={e => onDragStart(e, p.id)}
      on:dragover={e => onDragOver(e, p.id)}
      on:drop={e => onDrop(e, p.id)}
      on:dragend={onDragEnd}
      on:click={() => onToggleActed && onToggleActed(p.id)}
      on:keydown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleActed && onToggleActed(p.id); } }}
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
        on:click={() => onToggleNpcActed && onToggleNpcActed(npc.id)}
        on:keydown={e => onNpcKeyDown(e, npc)}
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
    <button class="board-scene-end" on:click={endScene}
      title="End scene — clears all stress (FCon p.30)" aria-label="End scene">
      {stressedCount > 0 ? '⏹ End Scene (' + stressedCount + ' stressed)' : '⏹ End Scene'}
    </button>
  {/if}

  {#if onStartSession}
    <button class="board-scene-end" on:click={startSession}
      title="Start session — refresh FP (FCon p.19)" aria-label="Start new session"
      style="border-color:var(--c-green); color:var(--c-green)">
      ▶ Start Session
    </button>
  {/if}

  {#if onNewScene}
    <button class="board-scene-end" on:click={newScene}
      title="New scene — clears table and stress" aria-label="New scene"
      style="border-color:var(--c-blue); color:var(--c-blue)">
      ⟳ New Scene
    </button>
  {/if}

  {#if onSessionSummary}
    <button class="board-scene-end" on:click={onSessionSummary}
      title="Copy session summary to clipboard" aria-label="Session summary"
      style="border-color:var(--text-muted); color:var(--text-muted)">
      📋 Summary
    </button>
    <button class="board-scene-end" on:click={() => onPrintScene && onPrintScene()}
      title="Print current scene state" aria-label="Print scene"
      style="border-color:var(--text-muted); color:var(--text-muted)">
      ⎙ Print
    </button>
  {/if}
</div>
