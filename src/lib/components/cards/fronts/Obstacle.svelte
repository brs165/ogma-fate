<script>
  import CvLabel from '../CvLabel.svelte';
  let { data = {}, campName = '', catColor = 'var(--accent)' } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  const TC = {
    block:       'var(--c-blue,#60a5fa)',
    hazard:      'var(--c-red,#f87171)',
    distraction: 'var(--gold,#fbbf24)',
  };

  let type_ = $derived((data.obstacle_type || 'block').toLowerCase());
  let col = $derived(TC[type_] || 'var(--c-green,#34d399)');
  let rating = $derived(data.rating != null ? data.rating : data.opposition);
  let ratingLabel = $derived(data.rating_label || data.opposition_label || '');
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div style="font-size:15px; font-weight:800; color:var(--text); font-family:{CV4_MONO}; line-height:1.1">{data.name || data.title || ''}</div>

    <div style="padding:7px 10px; background:color-mix(in srgb,{col} 8%,var(--cv-card-dark,var(--panel))); border:1px solid {col}33; border-left:3px solid {col}; border-radius:0 2px 2px 0">
      <CvLabel label="OBSTACLE ASPECT" color={col} />
      <p style="margin:0; font-size:12px; font-style:italic; font-weight:600; color:var(--text); font-family:{CV4_SANS}">{data.aspect || data.choice || ''}</p>
    </div>

    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <CvLabel label="HOW TO BYPASS" color={catColor} />
      <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4">{data.disable || data.bypass || ''}</p>
    </div>

    {#if data.gm_note}
      <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
        <CvLabel label="GM NOTE" color={catColor} />
        <p style="margin:0; font-size:11px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.4">{data.gm_note}</p>
      </div>
    {/if}
  </div>

  <!-- Right column -->
  <div style="width:118px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <div style="text-align:center">
      <div style="font-size:11px; font-weight:700; letter-spacing:0.15em; color:{col}; font-family:{CV4_MONO}; margin-bottom:6px; text-transform:uppercase">{type_}</div>
      {#if rating != null}
        <div style="width:60px; height:60px; border-radius:50%; background:color-mix(in srgb,{col} 14%,var(--inset)); border:2px solid {col}; margin:0 auto; display:flex; align-items:center; justify-content:center; flex-direction:column">
          <div style="font-size:22px; font-weight:900; color:{col}; line-height:1; font-family:{CV4_MONO}">{rating}</div>
          {#if ratingLabel}<div style="font-size:10px; color:{col}; font-family:{CV4_SANS}">{ratingLabel}</div>{/if}
        </div>
      {/if}
    </div>

    {#if data.weapon}
      <div style="text-align:center">
        <div style="font-size:11px; color:var(--text-muted); font-family:{CV4_MONO}; letter-spacing:0.1em">WEAPON</div>
        <div style="font-size:20px; font-weight:800; color:var(--c-red,#f87171); font-family:{CV4_MONO}">{data.weapon}</div>
      </div>
    {/if}
  </div>
</div>
