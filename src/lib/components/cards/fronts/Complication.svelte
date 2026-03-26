<script>
  import CvLabel from '../CvLabel.svelte';
  import CvTag from '../CvTag.svelte';
  let { data = {}, campName = '', catColor = 'var(--accent)' } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div style="padding:8px 10px; background:color-mix(in srgb,{catColor} 8%,var(--cv-card-dark,var(--panel))); border:1px solid {catColor}33; border-left:3px solid {catColor}; border-radius:0 2px 2px 0">
      <CvLabel label="NEW SCENE ASPECT" color={catColor} />
      <div style="font-size:12px; font-weight:700; color:var(--text); font-family:{CV4_SANS}; line-height:1.3; margin-bottom:4px">{data.new_aspect || ''}</div>
      {#if data.type}<CvTag text={(data.type || '').toUpperCase()} color={catColor} />{/if}
    </div>

    {#if data.arrival}
      <div>
        <CvLabel label="ARRIVAL" color={catColor} />
        <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4">{data.arrival}</p>
      </div>
    {/if}
  </div>

  <!-- Right column -->
  <div style="width:160px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <CvLabel label="ENVIRONMENT SHIFT" color={catColor} />
      <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4">{data.env || data.environment_shift || ''}</p>
    </div>

    <div style="padding:7px 10px; background:color-mix(in srgb,{catColor} 8%,var(--cv-card-dark,var(--panel))); border:1px solid {catColor}33; border-left:3px solid {catColor}; border-radius:0 2px 2px 0">
      <CvLabel label="SPOTLIGHT" color={catColor} />
      <div style="font-size:13px; font-weight:700; color:{catColor}; font-family:{CV4_MONO}; text-transform:capitalize">{data.spotlight || ''}</div>
    </div>
  </div>
</div>
