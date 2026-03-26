<script>
  import { Collapsible } from 'bits-ui';
  // ── PlayerRow — player FP, stress, consequences, concede, compel ─────────────
  let { player = {}, sel = false, onUpd = null, onSel = null, onCompel = null } = $props();
  let expanded = $state(false);
  let fpAnimKey = $state(0);
  let fpAnimDir = $state('');
  let stressShake = $state(false);

  function shakeIfFull(hits) {
    const marked = hits.filter(Boolean).length;
    if (marked === hits.length) {
      stressShake = true;
      setTimeout(() => { stressShake = false; }, 400);
    }
  }

  let fpCol = $derived(player.fp === 0 ? 'var(--c-red)' : player.fp < player.ref ? 'var(--c-amber,#f4b942)' : 'var(--c-green)');
  let conseq = $derived(player.conseq || ['', '', '']);

  function setConseq(i, val) {
    const n = conseq.slice();
    n[i] = val;
    if (onUpd) onUpd({ conseq: n });
  }

  function toggleSel() {
    if (onSel) onSel(sel ? null : player.id);
  }

  function toggleActed(e) {
    e.stopPropagation();
    if (onUpd) onUpd({ acted: !player.acted });
  }

  function onRowKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleSel(); }
  }

  function togglePhy(i) {
    const a = (player.phy || []).slice();
    a[i] = !a[i];
    if (onUpd) onUpd({ phy: a });
    shakeIfFull(a);
  }

  function toggleMen(i) {
    const a = (player.men || []).slice();
    a[i] = !a[i];
    if (onUpd) onUpd({ men: a });
    shakeIfFull(a);
  }

  function onStressKeyDown(fn, i, e) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); fn(i); }
  }

  function doConcedeClick() {
    const conseqCount = (player.conseq || []).filter(c => c).length;
    if (conseqCount === 0) return;
    if (!confirm(player.name + ' concedes.\nEarns ' + conseqCount + ' FP (1 per consequence).')) return;
    if (onUpd) onUpd({ fp: (player.fp || 0) + conseqCount, acted: true });
  }

  let conseqFilled = $derived((player.conseq || []).filter(c => c).length);

  let labels = $derived(conseq.length >= 4
    ? [
        {name:'Mild', rec:'end of next scene'},
        {name:'Moderate', rec:'end of session'},
        {name:'Severe', rec:'end of scenario'},
        {name:'Mild 2', rec:'end of next scene'},
      ]
    : [
        {name:'Mild', rec:'end of next scene'},
        {name:'Moderate', rec:'end of session'},
        {name:'Severe', rec:'end of scenario'},
      ]);
</script>

<div
  class="rs-player{sel ? ' selected' : ''}"
  style="border-left-color:{player.color || 'var(--accent)'}; border-left-width:3px"
>
  <!-- Header row -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="rs-player-top"
    role="button"
    tabindex="0"
    aria-expanded={String(!!sel)}
    aria-label="{sel ? 'Collapse ' : 'Expand '}{player.name}"
    onclick={toggleSel}
    onkeydown={onRowKeyDown}
  >
    <div class="rs-player-dot" style="background:{player.color || 'var(--accent)'}"></div>
    <div class="rs-player-name">{player.name}</div>
    {#if sel}
      <button
        style="background:none; border:none; cursor:pointer; font-size:10px; color:var(--text-muted); padding:0 2px; flex-shrink:0"
        onclick={(e) => { e.stopPropagation(); (() => (expanded = !expanded))(e); }}
      >{expanded ? '▲' : '▼'}</button>
    {/if}
    <button
      style="background:none; border:none; cursor:pointer; font-size:12px; color:{player.acted ? 'var(--c-green)' : 'var(--border-mid)'}; padding:0 2px; flex-shrink:0; line-height:1"
      onclick={toggleActed}
      aria-label={player.acted ? 'Mark unacted' : 'Mark acted'}
    >{player.acted ? '●' : '○'}</button>
  </div>

  <!-- High concept -->
  {#if player.hc}
    <div class="rs-player-hc">{player.hc}</div>
  {/if}

  <!-- FP row -->
  <div class="rs-fp-row">
    <span class="rs-fp-label">FP</span>
    <button class="rs-fp-btn"
      onclick={() => { fpAnimDir='spend'; fpAnimKey++; onUpd && onUpd({ fp: Math.max(0, player.fp - 1) }); }}
      aria-label="Spend FP">−</button>
    {#key fpAnimKey}<span class="rs-fp-num fp-anim-{fpAnimDir}" style="color:{fpCol}">{player.fp}</span>{/key}
    <button class="rs-fp-btn"
      onclick={() => { fpAnimDir='gain'; fpAnimKey++; onUpd && onUpd({ fp: player.fp + 1 }); }}
      aria-label="Gain FP">+</button>
  </div>

  <!-- Stress row -->
  <div class="rs-stress-row{stressShake ? ' rs-stress-shake' : '' }">
    <span class="rs-fp-label rs-stress-label-phy">PHY</span>
    <div style="display:flex; gap:2px">
      {#each (player.phy || []) as v, i}
        <div
          class="rs-stress-box rs-stress-phy{v ? ' filled' : ''}"
          role="checkbox"
          aria-checked={String(!!v)}
          aria-label="Physical stress {i + 1}"
          title="{v ? 'Clear' : 'Mark'} Physical {i + 1}"
          tabindex="0"
          onclick={() => { togglePhy(i); }}
          onkeydown={e => onStressKeyDown(togglePhy, i, e)}
        ></div>
      {/each}
    </div>
    <span class="rs-fp-label rs-stress-label-men" style="margin-left:4px">MEN</span>
    <div style="display:flex; gap:2px">
      {#each (player.men || []) as v, i}
        <div
          class="rs-stress-box rs-stress-men{v ? ' filled' : ''}"
          role="checkbox"
          aria-checked={String(!!v)}
          aria-label="Mental stress {i + 1}"
          title="{v ? 'Clear' : 'Mark'} Mental {i + 1}"
          tabindex="0"
          onclick={() => { toggleMen(i); }}
          onkeydown={e => onStressKeyDown(toggleMen, i, e)}
        ></div>
      {/each}
    </div>
  </div>

  <!-- Expanded: consequences + buttons — Bits UI Collapsible for animated height -->
  <Collapsible.Root open={expanded}>
    <Collapsible.Content class="rs-player-collapsible">
    <div style="padding:0 8px 7px">
      <div style="font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
                  color:var(--text-muted); margin-bottom:3px">Consequences</div>
      {#each labels as slot, i}
        <div style="margin-bottom:4px">
          <div style="display:flex; align-items:center; gap:3px">
            <span style="font-size:11px; color:var(--text-muted); width:46px; flex-shrink:0">{slot.name}</span>
            <input
              type="text"
              value={conseq[i] || ''}
              placeholder="empty"
              aria-label="{slot.name} consequence"
              oninput={e => setConseq(i, e.currentTarget.value)}
              class="rs-conseq-input{conseq[i] ? ' filled' : ''}"
            />
          </div>
          {#if conseq[i]}
            <div style="font-size:10px; color:var(--text-muted); margin-left:49px; font-style:italic">
              ↳ clears {slot.rec}
            </div>
          {/if}
        </div>
      {/each}

      <button
        class="rs-concede-btn"
        onclick={doConcedeClick}
        disabled={!player.conseq || !player.conseq.some(c => c)}
        aria-label="Concede conflict"
        title="FCon p.35: exit conflict, earn 1 FP per consequence taken"
      >⚐ Concede ({conseqFilled} FP)</button>

      {#if onCompel}
        <button
          class="rs-concede-btn"
          onclick={() => onCompel(player)}
          aria-label="Offer compel to {player.name}"
          title="FCon p.20: offer FP through aspect"
          style="border-color:var(--c-purple); color:var(--c-purple)"
        >↩ Compel</button>
      {/if}
    </div>
  </Collapsible.Content>
  </Collapsible.Root>
</div>
