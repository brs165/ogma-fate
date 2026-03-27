<script>
  import CvLabel from '../CvLabel.svelte';

  export let data = {};
  export let campName = '';
  export let catColor = 'var(--accent)';

  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div style="padding:8px 10px; background:color-mix(in srgb,{catColor} 8%,var(--cv-card-dark,var(--panel))); border:1px solid {catColor}33; border-left:3px solid {catColor}; border-radius:0 2px 2px 0">
      <CvLabel label="SITUATION" color={catColor} />
      <p style="margin:0; font-size:13px; font-weight:700; color:var(--text); font-family:{CV4_SANS}; line-height:1.35">{data.situation || ''}</p>
    </div>

    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <CvLabel label="IF ACCEPTED" color={catColor} />
      <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4; font-style:italic">{data.consequence || data.complication || ''}</p>
    </div>
  </div>

  <!-- Right column -->
  <div style="width:160px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <div>
      <CvLabel label="TYPE" color={catColor} />
      <div style="padding:4px 9px; background:color-mix(in srgb,{catColor} 16%,var(--inset)); border:1px solid {catColor}44; border-radius:4px; display:inline-block; font-size:13px; font-weight:700; color:{catColor}; font-family:{CV4_MONO}; text-transform:uppercase">{data.template_type || 'event'}</div>
    </div>

    {#if data.template}
      <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
        <CvLabel label="TEMPLATE" color={catColor} />
        <p style="margin:0; font-size:10px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.5; font-style:italic">{data.template}</p>
      </div>
    {/if}

    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <CvLabel label="PLAYER CHOICE" color={catColor} />
      <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.5">Accept for 1 FP — or refuse by spending 1 FP</p>
    </div>
  </div>
</div>
