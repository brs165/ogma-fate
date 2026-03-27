<script>
  import { Tabs } from 'bits-ui';
  let { state = { pcs: [], pool: 0 }, onUpdate = () => {} } = $props();
  let lastFPAnim = $state(null);
  let fpTab = $state('fp');
  let collapsed = $state(false);

  // ── Drag ─────────────────────────────────────────────────────────────────
  let posX = $state(null);
  let posY = $state(null);
  let dragOffset = $state(null);
  let panel = $state();

  function onHdrPointerDown(e) {
    if (e.button !== 0) return;
    if (e.target.closest('button')) return;
    const rect = panel.getBoundingClientRect();
    dragOffset = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onHdrPointerMove(e) {
    if (!dragOffset) return;
    posX = e.clientX - dragOffset.dx;
    posY = e.clientY - dragOffset.dy;
  }
  function onHdrPointerUp() { dragOffset = null; }

  function adjustPC(id, delta) {
    const pc = state.pcs.find(p => p.id === id);
    if (!pc) return;
    const newVal = Math.max(0, pc.current + delta);
    const animDot = delta < 0 ? pc.current - 1 : pc.current;
    lastFPAnim = { id, dot: animDot, dir: delta > 0 ? 'gain' : 'spend' };
    setTimeout(() => { lastFPAnim = null; }, 380);
    onUpdate({ ...state, pcs: state.pcs.map(p => p.id !== id ? p : { ...p, current: newVal }) });
  }

  function setName(id, name) {
    onUpdate({ ...state, pcs: state.pcs.map(pc => pc.id === id ? { ...pc, name } : pc) });
  }

  function addPC() {
    const ids = state.pcs.map(p => p.id);
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    onUpdate({ ...state, pcs: [...state.pcs, { id: newId, name: 'PC ' + newId, refresh: 3, current: 3 }] });
  }

  function removePC(id) {
    onUpdate({ ...state, pcs: state.pcs.filter(p => p.id !== id) });
  }

  function resetAll() {
    onUpdate({ ...state, pcs: state.pcs.map(pc => ({ ...pc, current: pc.refresh })), pool: 0 });
  }

  function adjustPool(delta) {
    onUpdate({ ...state, pool: Math.max(0, (state.pool || 0) + delta) });
  }
</script>

<!-- ── Card shell ─────────────────────────────────────────────────────────── -->
<div
  class="fpt-panel fd-card"
  bind:this={panel}
  style={posX !== null ? `position:fixed;left:${posX}px;top:${posY}px;` : ''}
  onclick={(e) => e.stopPropagation()}
>
  <!-- Draggable header stripe -->
  <div
    class="fpt-hdr"
    onpointerdown={onHdrPointerDown}
    onpointermove={onHdrPointerMove}
    onpointerup={onHdrPointerUp}
    onpointercancel={onHdrPointerUp}
    role="toolbar"
    aria-label="Fate Point Tracker"
  >
    <span class="fpt-hdr-icon" aria-hidden="true"><i class="fa-solid fa-coins"></i></span>
    <span class="fpt-hdr-title">Fate Points</span>
    {#if !collapsed && fpTab === 'fp'}
      <button class="fpt-reset-btn btn btn-ghost" onclick={resetAll} title="Reset all to refresh" aria-label="Reset all fate points">
        <i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i>
      </button>
    {/if}
    <button class="fpt-collapse-btn" onclick={() => { collapsed = !collapsed; }}
      aria-label={collapsed ? 'Expand' : 'Collapse'}>
      <i class="fa-solid fa-chevron-{collapsed ? 'down' : 'up'}" aria-hidden="true"></i>
    </button>
  </div>

  {#if !collapsed}
  <!-- Tab bar — Bits Tabs -->
  <Tabs.Root bind:value={fpTab}>
    <Tabs.List aria-label="Fate tools sections">
      <Tabs.Trigger value="fp">FP</Tabs.Trigger>
      <Tabs.Trigger value="ms">Miles.</Tabs.Trigger>
      <Tabs.Trigger value="pi">Init.</Tabs.Trigger>
    </Tabs.List>

    <!-- Fate Points tab -->
    <Tabs.Content value="fp">
    <div class="fp-pcs">
      {#each state.pcs as pc (pc.id)}
        <div class="fp-pc-row">
          <input class="fp-pc-name" value={pc.name}
            onchange={(e) => setName(pc.id, e.target.value)} aria-label="PC name" />
          <div class="fp-controls">
            <button class="fp-btn fp-minus" onclick={() => adjustPC(pc.id, -1)} disabled={pc.current === 0} aria-label="Spend">&minus;</button>
            <div class="fp-dots" role="group" aria-label="Fate points for {pc.name}">
              {#each [0,1,2,3,4,5] as i}
                {@const filled = i < pc.current}
                {@const isAnim = lastFPAnim && lastFPAnim.id === pc.id && lastFPAnim.dot === i}
                <button
                  class="fp-dot" class:fp-dot-filled={filled}
                  class:fp-gaining={isAnim && lastFPAnim.dir === 'gain'}
                  class:fp-spending={isAnim && lastFPAnim.dir === 'spend'}
                  onclick={() => adjustPC(pc.id, i < pc.current ? -1 : 1)}
                  aria-label="{filled ? 'Spend' : 'Gain'} fate point (dot {i + 1})"
                  aria-pressed={String(filled)}
                ></button>
              {/each}
            </div>
            <button class="fp-btn fp-plus" onclick={() => adjustPC(pc.id, 1)} aria-label="Gain">+</button>
            {#key pc.current}<span class="fp-count fp-count-anim">{pc.current}</span>{/key}
          </div>
          <button class="fp-remove" onclick={() => removePC(pc.id)} aria-label="Remove {pc.name}">&times;</button>
        </div>
      {/each}
    </div>
    <div class="fp-pool-row">
      <span class="fp-pool-label">GM Pool</span>
      <button class="fp-btn fp-minus" onclick={() => adjustPool(-1)} disabled={(state.pool||0)===0} aria-label="Decrease pool">&minus;</button>
      <span class="fp-pool-count" aria-live="polite">{state.pool || 0}</span>
      <button class="fp-btn fp-plus" onclick={() => adjustPool(1)} aria-label="Increase pool">+</button>
    </div>
    <button class="fp-add-pc" onclick={addPC}>+ Add PC</button>
    </Tabs.Content>

    <!-- Milestones tab -->
    <Tabs.Content value="ms">
      <div class="fpt-rules-body">
        <p><strong>Minor</strong> (end of session): Switch skills, rename stunt, rename mild consequence, change aspect.</p>
        <p><strong>Significant</strong> (end of arc): +1 skill or +1 stunt slot, plus Minor.</p>
        <p><strong>Major</strong> (campaign shake-up): +1 refresh, rename high concept, clear severe consequence, plus Significant.</p>
      </div>
    </Tabs.Content>

    <!-- Initiative tab -->
    <Tabs.Content value="pi">
      <div class="fpt-rules-body">
        <p><strong>Popcorn Initiative</strong>: After you act, you choose who goes next. NPCs and PCs alternate unless someone spends a fate point to interrupt.</p>
      </div>
    </Tabs.Content>
  </Tabs.Root>
  {/if}
</div>
