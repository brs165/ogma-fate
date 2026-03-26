<script>
  let { state = { pcs: [], pool: 0 }, onUpdate = () => {} } = $props();
  let lastFPAnim = null;
  let fpTab = 'fp';

  function adjustPC(id, delta) {
    const pc = state.pcs.find(p => p.id === id);
    if (!pc) return;
    const newVal = Math.max(0, pc.current + delta);
    const animDot = delta < 0 ? pc.current - 1 : pc.current;
    lastFPAnim = { id, dot: animDot, dir: delta > 0 ? 'gain' : 'spend' };
    setTimeout(() => { lastFPAnim = null; }, 380);
    onUpdate({
      ...state,
      pcs: state.pcs.map(p => p.id !== id ? p : { ...p, current: newVal })
    });
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

<div class="fp-tracker">
  <div class="fp-header">
    <span class="fp-title">&#x25CE; Fate Tools</span>
    {#if fpTab === 'fp'}
      <button class="btn btn-ghost" onclick={resetAll} title="Reset all to refresh" style="font-size:12px;padding:2px 8px;min-height:0">&#x21BA; Reset</button>
    {/if}
  </div>

  <!-- Tab bar -->
  <div style="display:flex;border-bottom:1px solid var(--border);margin-bottom:10px">
    <button
      onclick={() => fpTab = 'fp'}
      style="flex:1;background:none;border:none;cursor:pointer;padding:6px 4px;font-size:var(--text-label);font-family:var(--font-ui);font-weight:{fpTab==='fp'?700:500};color:{fpTab==='fp'?'var(--accent)':'var(--text-muted)'};border-bottom:2px solid {fpTab==='fp'?'var(--accent)':'transparent'};transition:all .15s;white-space:nowrap"
      aria-pressed={String(fpTab === 'fp')}
    >&#x25CE; Fate Points</button>
    <button
      onclick={() => fpTab = 'ms'}
      style="flex:1;background:none;border:none;cursor:pointer;padding:6px 4px;font-size:var(--text-label);font-family:var(--font-ui);font-weight:{fpTab==='ms'?700:500};color:{fpTab==='ms'?'var(--accent)':'var(--text-muted)'};border-bottom:2px solid {fpTab==='ms'?'var(--accent)':'transparent'};transition:all .15s;white-space:nowrap"
      aria-pressed={String(fpTab === 'ms')}
    >&#x2B21; Milestones</button>
    <button
      onclick={() => fpTab = 'pi'}
      style="flex:1;background:none;border:none;cursor:pointer;padding:6px 4px;font-size:var(--text-label);font-family:var(--font-ui);font-weight:{fpTab==='pi'?700:500};color:{fpTab==='pi'?'var(--accent)':'var(--text-muted)'};border-bottom:2px solid {fpTab==='pi'?'var(--accent)':'transparent'};transition:all .15s;white-space:nowrap"
      aria-pressed={String(fpTab === 'pi')}
      title="Turn Order (Popcorn) \u2014 after you act, choose who goes next. No fixed order."
    >&#x1F3C1; Turn Order</button>
  </div>

  <!-- Fate Points Tab -->
  {#if fpTab === 'fp'}
    <div class="fp-pcs">
      {#each state.pcs as pc (pc.id)}
        <div class="fp-pc-row">
          <input
            class="fp-pc-name"
            value={pc.name}
            onchange={(e) => setName(pc.id, e.target.value)}
            aria-label="Player character name"
          />
          <div class="fp-controls">
            <button class="fp-btn fp-minus" onclick={() => adjustPC(pc.id, -1)} aria-label="Spend fate point" disabled={pc.current === 0}>&minus;</button>
            <div class="fp-dots">
              {#each [0,1,2,3,4,5] as i}
                {@const filled = i < pc.current}
                {@const isAnim = lastFPAnim && lastFPAnim.id === pc.id && lastFPAnim.dot === i}
                <div
                  class="fp-dot"
                  class:fp-dot-filled={filled}
                  class:fp-gaining={isAnim && lastFPAnim.dir === 'gain'}
                  class:fp-spending={isAnim && lastFPAnim.dir === 'spend'}
                  onclick={() => adjustPC(pc.id, i < pc.current ? -1 : 1)}
                ></div>
              {/each}
            </div>
            <button class="fp-btn fp-plus" onclick={() => adjustPC(pc.id, 1)} aria-label="Gain fate point">+</button>
            <span class="fp-count">{pc.current}</span>
          </div>
          <button class="fp-remove" onclick={() => removePC(pc.id)} aria-label="Remove {pc.name}" title="Remove">&times;</button>
        </div>
      {/each}
    </div>
    <div class="fp-pool-row">
      <span class="fp-pool-label">GM Pool</span>
      <button class="fp-btn fp-minus" onclick={() => adjustPool(-1)} disabled={(state.pool || 0) === 0} aria-label="Decrease GM fate point pool">&minus;</button>
      <span class="fp-pool-count" aria-live="polite" aria-label="GM Pool: {state.pool || 0} fate points">{state.pool || 0}</span>
      <button class="fp-btn fp-plus" onclick={() => adjustPool(1)} aria-label="Increase GM fate point pool">+</button>
    </div>
    <button class="fp-add-pc" onclick={addPC}>+ Add PC</button>
  {/if}

  <!-- Milestones Tab -->
  {#if fpTab === 'ms'}
    <div style="padding:8px;color:var(--text-muted);font-size:13px">
      <p><strong>Minor Milestone</strong> (end of session): Switch skill ratings, change a stunt, rename a mild consequence, change an aspect.</p>
      <p style="margin-top:8px"><strong>Significant Milestone</strong> (end of arc): +1 skill point OR +1 stunt slot, plus all Minor benefits.</p>
      <p style="margin-top:8px"><strong>Major Milestone</strong> (campaign shake-up): +1 refresh, rename high concept, clear severe consequence, plus all Significant benefits.</p>
    </div>
  {/if}

  <!-- Turn Order Tab -->
  {#if fpTab === 'pi'}
    <div style="padding:8px;color:var(--text-muted);font-size:13px">
      <p><strong>Popcorn Initiative</strong>: After you act, you choose who goes next. NPCs and PCs alternate unless someone uses a stunt or spends a fate point to interrupt.</p>
      <p style="margin-top:8px">Use the Turn Bar at the top of the canvas to track who has acted this round.</p>
    </div>
  {/if}
</div>
