<script>
  let { data = {}, campName = '', catColor = 'var(--fs-section)' } = $props();

  const TC = { block: '#1565c0', hazard: '#c62828', distraction: '#b8860b' };
  let type_ = $derived((data.obstacle_type || 'block').toLowerCase());
  let col = $derived(TC[type_] || 'var(--fs-section)');
  let rating = $derived(data.rating != null ? data.rating : data.opposition);
  let ratingLabel = $derived(data.rating_label || data.opposition_label || '');
  // distraction uses choice/repercussion; block/hazard use aspect/disable
  let isDistraction = $derived(type_ === 'distraction');
</script>

<div style="display:flex; gap:14px">
  <div style="flex:1; min-width:0">

    {#if isDistraction && data.choice}
      <div class="fs-section-gap">
        <div class="fs-stunt" style="border-left:4px solid {col}; border-radius:0 3px 3px 0; padding:8px 10px">
          <div style="font-size:10px; font-weight:800; letter-spacing:0.12em; color:{col}; margin-bottom:3px">THE CHOICE</div>
          <div style="font-size:13px; font-weight:700; color:var(--fs-text); line-height:1.3">{data.choice}</div>
        </div>
      </div>
      <div class="fs-section-gap" style="display:flex; gap:8px">
        {#if data.repercussion_deal}
          <div class="fs-stunt" style="flex:1; border-left:3px solid #b8860b; border-radius:0 3px 3px 0">
            <div class="fs-stunt-name" style="color:#b8860b">DEAL WITH IT</div>
            <div class="fs-stunt-desc">{data.repercussion_deal}</div>
          </div>
        {/if}
        {#if data.repercussion_leave}
          <div class="fs-stunt" style="flex:1; border-left:3px solid #c62828; border-radius:0 3px 3px 0">
            <div class="fs-stunt-name" style="color:#c62828">LEAVE IT</div>
            <div class="fs-stunt-desc">{data.repercussion_leave}</div>
          </div>
        {/if}
      </div>
    {:else}
      <div class="fs-section-gap">
        <div class="fs-stunt" style="border-left:4px solid {col}; border-radius:0 3px 3px 0; padding:8px 10px">
          <div style="font-size:10px; font-weight:800; letter-spacing:0.12em; color:{col}; margin-bottom:3px">OBSTACLE ASPECT</div>
          <div style="font-size:13px; font-weight:700; font-style:italic; color:var(--fs-text); line-height:1.3">{data.aspect || data.name || ''}</div>
        </div>
      </div>
      {#if data.disable || data.bypass || data.overcome}
        <div class="fs-section-gap">
          <div class="fs-section-hdr">HOW TO BYPASS</div>
          <div style="font-size:12px; color:var(--fs-text-dim); line-height:1.4">{data.disable || data.bypass || data.overcome || ''}</div>
        </div>
      {/if}
      {#if data.stress_on_fail}
        <div class="fs-section-gap">
          <div class="fs-section-hdr">FAIL COST</div>
          <div style="font-size:12px; color:#c62828">{data.stress_on_fail} stress</div>
        </div>
      {/if}
    {/if}

    {#if data.gm_note}
      <div class="fs-section-gap">
        <div class="fs-section-hdr">GM NOTE</div>
        <div style="font-size:12px; color:var(--fs-text-muted); line-height:1.4">{data.gm_note}</div>
      </div>
    {/if}
  </div>

  <div style="width:100px; flex-shrink:0; text-align:center">
    <div style="font-size:11px; font-weight:800; letter-spacing:0.12em; color:{col}; text-transform:uppercase; margin-bottom:8px">{type_}</div>
    {#if rating != null}
      <div style="width:60px; height:60px; border-radius:50%; border:3px solid {col}; margin:0 auto; display:flex; align-items:center; justify-content:center; flex-direction:column; background:rgba(0,0,0,0.03)">
        <div style="font-size:22px; font-weight:900; color:{col}; line-height:1">{rating}</div>
        {#if ratingLabel}<div style="font-size:9px; color:{col}">{ratingLabel}</div>{/if}
      </div>
    {/if}
    {#if data.weapon}
      <div style="margin-top:10px">
        <div style="font-size:10px; color:var(--fs-text-muted); letter-spacing:0.1em">WEAPON</div>
        <div style="font-size:20px; font-weight:800; color:#c62828">{data.weapon}</div>
      </div>
    {/if}
  </div>
</div>
