<script>
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  let victories = $derived(data.victories_needed || 3);
  let twists = $derived(Array.isArray(data.twists) ? data.twists : []);
  let sideA = $derived({ label: data.side_a || 'Side A', skills: data.skills_a || '' });
  let sideB = $derived({ label: data.side_b || 'Side B', skills: data.skills_b || '' });
  let sA = $derived(cardState?.scoreA ?? 0);
  let sB = $derived(cardState?.scoreB ?? 0);
  let winA = $derived(sA >= victories);
  let winB = $derived(sB >= victories);

  const colA = 'var(--fs-stress-phy)';
  const colB = '#c62828';

  function tick(side) {
    if (side === 'a') onUpdate({ scoreA: Math.min(sA + 1, victories) });
    else              onUpdate({ scoreB: Math.min(sB + 1, victories) });
  }
  function reset(e) { e.stopPropagation(); onUpdate({ scoreA: 0, scoreB: 0 }); }
</script>

<div class="fs-section-gap">
  <div style="font-size:14px; font-weight:800; color:var(--fs-text); line-height:1.2; margin-bottom:4px">{data.contest_type || ''}</div>
  <div style="font-size:12px; color:var(--fs-text-dim); line-height:1.4">{data.desc || ''}</div>
</div>

{#if data.aspect}
  <div class="fs-section-gap">
    <div class="fs-stunt" style="border-left:3px solid var(--fs-section); border-radius:0 3px 3px 0">
      <div class="fs-stunt-name">Scene Aspect</div>
      <div class="fs-stunt-desc" style="font-style:italic">{data.aspect}</div>
    </div>
  </div>
{/if}

<!-- Interactive score panels -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">VICTORY TRACK — First to {victories}</div>
  <div style="display:flex; gap:8px">
    {#each [{ side: sideA, col: colA, score: sA, won: winA, key: 'a' }, { side: sideB, col: colB, score: sB, won: winB, key: 'b' }] as row}
      <div style="flex:1; padding:8px 10px; background:{row.won ? 'rgba(46,125,50,0.08)' : 'var(--fs-stunt-bg)'}; border:1px solid {row.won ? '#2e7d32' : 'var(--fs-border)'}; border-top:3px solid {row.col}; border-radius:0 0 3px 3px">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px">
          <div style="font-size:12px; font-weight:700; color:{row.col}">{row.side.label}</div>
          <button
            onclick={(e) => { e.stopPropagation(); tick(row.key); }}
            disabled={row.won}
            aria-label="Add victory for {row.side.label}"
            style="padding:2px 10px; background:{row.col}; border:none; border-radius:3px; color:#fff; font-size:11px; font-weight:700; cursor:{row.won ? 'default' : 'pointer'}; opacity:{row.won ? 0.4 : 1}"
          >+1</button>
        </div>
        <div style="display:flex; gap:4px" aria-label="{row.side.label} victories: {row.score} of {victories}">
          {#each Array.from({length: victories}) as _, j}
            <div style="width:20px; height:20px; border-radius:3px; background:{j < row.score ? row.col : 'transparent'}; border:2px solid {row.col}; transition:all .15s"></div>
          {/each}
        </div>
        <div style="font-size:11px; color:var(--fs-text-muted); margin-top:3px">{row.side.skills}</div>
      </div>
    {/each}
  </div>
  <div style="display:flex; justify-content:flex-end; margin-top:6px">
    <button onclick={reset} aria-label="Reset contest scores" style="padding:3px 10px; background:transparent; border:1px solid var(--fs-border); border-radius:3px; font-size:11px; color:var(--fs-text-muted); cursor:pointer"><i class="fa-solid fa-arrows-rotate" aria-hidden="true" style="font-size:9px"></i> Reset</button>
  </div>
</div>

<!-- Twists -->
{#if twists.length > 0}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">POSSIBLE TWISTS</div>
    {#each twists.slice(0,3) as t}
      <div style="font-size:12px; color:var(--fs-text-dim); line-height:1.4; margin-bottom:2px"><i class="fa-solid fa-circle" aria-hidden="true" style="font-size:4px; vertical-align:middle; margin-right:6px; color:var(--fs-section)"></i>{t}</div>
    {/each}
  </div>
{/if}

<!-- Stakes + Tie rule -->
{#if data.stakes_good || data.stakes_bad}
  <div style="display:flex; gap:8px; margin-bottom:14px">
    {#if data.stakes_good}
      <div class="fs-stunt" style="flex:1; border-left:3px solid #2e7d32; border-radius:0 3px 3px 0">
        <div class="fs-stunt-name" style="color:#2e7d32">IF WIN</div>
        <div class="fs-stunt-desc">{data.stakes_good}</div>
      </div>
    {/if}
    {#if data.stakes_bad}
      <div class="fs-stunt" style="flex:1; border-left:3px solid #c62828; border-radius:0 3px 3px 0">
        <div class="fs-stunt-name" style="color:#c62828">IF LOSE</div>
        <div class="fs-stunt-desc">{data.stakes_bad}</div>
      </div>
    {/if}
  </div>
{/if}

<div class="fs-stunt">
  <div class="fs-stunt-name" style="color:#b8860b">ON A TIE</div>
  <div class="fs-stunt-desc">Neither side marks a victory. GM introduces a new situation aspect (FCon p.33).</div>
</div>
