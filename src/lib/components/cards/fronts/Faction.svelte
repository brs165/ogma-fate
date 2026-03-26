<script>
  import CvLabel from '../CvLabel.svelte';
  import CvTag from '../CvTag.svelte';
  let { data = {}, campName = '', catColor = 'var(--accent)' } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  let face = $derived(data.face || {});
  let fn_ = $derived(typeof face === 'string' ? face : (face.name || ''));
  let fr = $derived(typeof face === 'string' ? '' : (face.role || ''));
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div style="font-size:14px; font-weight:800; color:var(--text); font-family:{CV4_MONO}; line-height:1.15">{data.name || ''}</div>

    <div>
      <CvLabel label="GOAL" color={catColor} />
      <p style="margin:0; font-size:11px; color:var(--text); font-family:{CV4_SANS}; line-height:1.45">{data.goal || ''}</p>
    </div>

    <div>
      <CvLabel label="METHOD" color={catColor} />
      <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.45; font-style:italic">{data.method || ''}</p>
    </div>

    <div style="padding:7px 10px; background:color-mix(in srgb,var(--c-red,#f87171) 8%,var(--cv-card-dark,var(--panel))); border:1px solid var(--c-red,#f87171)33; border-left:3px solid var(--c-red,#f87171); border-radius:0 2px 2px 0">
      <CvLabel label="WEAKNESS" color="var(--c-red,#f87171)" />
      <p style="margin:0; font-size:11px; color:var(--c-red,#f87171); font-family:{CV4_SANS}; line-height:1.35">{data.weakness || ''}</p>
    </div>
  </div>

  <!-- Right column -->
  <div style="width:162px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    {#if fn_}
      <div style="padding:9px 10px; background:color-mix(in srgb,{catColor} 12%,var(--inset)); border:1px solid {catColor}44; border-radius:6px">
        <CvLabel label="THE FACE" color={catColor} />
        <div style="font-size:12px; font-weight:700; color:var(--text); font-family:{CV4_SANS}; margin-bottom:2px">{fn_}</div>
        <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4; font-style:italic">{fr}</p>
      </div>
    {/if}

    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <p style="margin:0; font-size:11px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.5">Goal + Method = two sides of one faction aspect</p>
    </div>
  </div>
</div>
