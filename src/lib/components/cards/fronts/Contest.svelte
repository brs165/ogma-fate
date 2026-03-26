<script>
  import CvLabel from '../CvLabel.svelte';
  let { data = {}, campName = '', catColor = 'var(--accent)', cardState = {}, onUpdate = () => {} } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  let victories = $derived(data.victories_needed || 3);
  let twists = $derived(Array.isArray(data.twists) ? data.twists : []);
  let sideA = $derived({ label: data.side_a || 'Side A', skills: data.skills_a || '' });
  let sideB = $derived({ label: data.side_b || 'Side B', skills: data.skills_b || '' });
  let sA = $derived(cardState?.scoreA ?? 0);
  let sB = $derived(cardState?.scoreB ?? 0);
  let winA = $derived(sA >= victories);
  let winB = $derived(sB >= victories);

  const colA = () => catColor;
  const colB = 'var(--c-red,#f87171)';

  function tick(side) {
    if (side === 'a') onUpdate({ scoreA: Math.min(sA + 1, victories) });
    else              onUpdate({ scoreB: Math.min(sB + 1, victories) });
  }
  function reset(e) { e.stopPropagation(); onUpdate({ scoreA: 0, scoreB: 0 }); }
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div>
      <div style="font-size:13px; font-weight:800; color:var(--text); font-family:{CV4_MONO}; line-height:1.2">{data.contest_type || ''}</div>
      <p style="margin:2px 0 0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4">{data.desc || ''}</p>
    </div>

    {#if data.aspect}
      <div style="padding:7px 10px; background:color-mix(in srgb,{catColor} 8%,var(--cv-card-dark,var(--panel))); border:1px solid {catColor}33; border-left:3px solid {catColor}; border-radius:0 2px 2px 0">
        <CvLabel label="SCENE ASPECT" color={catColor} />
        <p style="margin:0; font-size:11px; font-style:italic; color:var(--text); font-family:{CV4_SANS}">{data.aspect}</p>
      </div>
    {/if}

    <!-- Score panels -->
    <div style="display:flex; gap:6px">
      {#each [{ side: sideA, col: catColor, score: sA, won: winA, key: 'a' }, { side: sideB, col: colB, score: sB, won: winB, key: 'b' }] as row}
        <div style="flex:1; padding:5px 8px; background:{row.won ? `color-mix(in srgb,${row.col} 15%,var(--inset))` : 'var(--inset)'}; border:1px solid {row.won ? row.col : row.col+'44'}; border-top:2px solid {row.col}; border-radius:4px">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px">
            <div style="font-size:11px; font-weight:700; color:{row.col}; font-family:{CV4_SANS}">{row.side.label}</div>
            <button
              onclick={(e) => { e.stopPropagation(); (() => tick(row.key))(e); }}
              disabled={row.won}
              aria-label="Add victory for {row.side.label}"
              style="padding:2px 8px; background:{row.col}; border:none; border-radius:3px; color:var(--bg,#0d1117); font-size:11px; font-weight:700; cursor:{row.won ? 'default' : 'pointer'}; opacity:{row.won ? 0.4 : 1}; font-family:{CV4_SANS}"
            >+1</button>
          </div>
          <div style="display:flex; gap:3px" aria-label="{row.side.label} victories: {row.score} of {victories}">
            {#each Array.from({length: victories}) as _, j}
              <div style="width:16px; height:16px; border-radius:2px; background:{j < row.score ? row.col : 'transparent'}; border:1.5px solid {row.col}; transition:all .15s"></div>
            {/each}
          </div>
          <div style="font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; margin-top:2px">{row.side.skills}</div>
        </div>
      {/each}
    </div>

    <div style="display:flex; justify-content:flex-end">
      <button onclick={reset} aria-label="Reset contest scores" style="padding:2px 8px; background:transparent; border:1px solid var(--border); border-radius:3px; font-size:11px; color:var(--text-muted); cursor:pointer; font-family:{CV4_SANS}">Reset</button>
    </div>
  </div>

  <!-- Right column -->
  <div style="width:128px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <div style="text-align:center">
      <CvLabel label="VICTORIES NEEDED" color={catColor} />
      <div style="font-size:46px; font-weight:900; color:{catColor}; line-height:1; font-family:{CV4_MONO}">{victories}</div>
      <div style="font-size:11px; color:var(--text-muted); font-family:{CV4_SANS}">per side</div>
    </div>

    {#if twists.length > 0}
      <div>
        <CvLabel label="POSSIBLE TWISTS" color={catColor} />
        <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.5">{twists.slice(0,2).map(t => '· ' + t).join('  ')}</p>
      </div>
    {/if}

    {#if data.stakes_good || data.stakes_bad}
      <div style="display:flex; flex-direction:column; gap:4px">
        {#if data.stakes_good}
          <div style="padding:3px 7px; background:color-mix(in srgb,var(--c-green,#34d399) 8%,var(--inset)); border-left:2px solid var(--c-green,#34d399); border-radius:0 3px 3px 0">
            <CvLabel label="IF WIN" color="var(--c-green,#34d399)" />
            <p style="margin:0; font-size:10px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.3">{data.stakes_good}</p>
          </div>
        {/if}
        {#if data.stakes_bad}
          <div style="padding:3px 7px; background:color-mix(in srgb,var(--c-red,#f87171) 8%,var(--inset)); border-left:2px solid var(--c-red,#f87171); border-radius:0 3px 3px 0">
            <CvLabel label="IF LOSE" color="var(--c-red,#f87171)" />
            <p style="margin:0; font-size:10px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.3">{data.stakes_bad}</p>
          </div>
        {/if}
      </div>
    {/if}

    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <p style="margin:0; font-size:11px; color:var(--text-muted); font-family:{CV4_SANS}; text-align:center; line-height:1.4">Both sides roll every exchange</p>
    </div>

    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <CvLabel label="ON A TIE" color="var(--c-amber,#f4b942)" />
      <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4">Neither side marks a victory. GM introduces a new situation aspect (FCon p.33).</p>
    </div>
  </div>
</div>
