<script>
  import CvLabel from '../CvLabel.svelte';
  let { data = {}, campName = '', catColor = 'var(--accent)' } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div style="font-size:15px; font-weight:800; color:var(--text); font-family:{CV4_MONO}; line-height:1.1">{data.name || ''}</div>

    <div style="padding:8px 10px; background:color-mix(in srgb,{catColor} 8%,var(--cv-card-dark,var(--panel))); border:1px solid {catColor}33; border-left:3px solid {catColor}; border-radius:0 2px 2px 0">
      <CvLabel label="RESTRICTED ACTION" color={catColor} />
      <p style="margin:0; font-size:12px; font-weight:600; color:var(--text); font-family:{CV4_SANS}; line-height:1.35">{data.restricted_action || data.what_resists || data.what || ''}</p>
    </div>

    <div style="padding:7px 10px; background:color-mix(in srgb,var(--c-red,#f87171) 8%,var(--cv-card-dark,var(--panel))); border:1px solid var(--c-red,#f87171)33; border-left:3px solid var(--c-red,#f87171); border-radius:0 2px 2px 0">
      <CvLabel label="IF VIOLATED" color="var(--c-red,#f87171)" />
      <p style="margin:0; font-size:11px; color:var(--c-red,#f87171); font-family:{CV4_SANS}; line-height:1.4">{data.consequence || ''}</p>
    </div>

    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <CvLabel label="HOW TO BYPASS" color="var(--c-green,#34d399)" />
      <p style="margin:0; font-size:11px; color:var(--c-green,#34d399); font-family:{CV4_SANS}; line-height:1.4">{data.bypass || ''}</p>
    </div>
  </div>

  <!-- Right column -->
  <div style="width:128px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <div style="text-align:center">
      <CvLabel label="TYPE" color={catColor} />
      <div style="padding:7px 12px; background:color-mix(in srgb,{catColor} 16%,var(--inset)); border:2px solid {catColor}; border-radius:6px; display:inline-block">
        <div style="font-size:13px; font-weight:800; color:{catColor}; font-family:{CV4_MONO}; text-transform:capitalize">{data.constraint_type || ''}</div>
      </div>
    </div>

    {#if data.gm_note}
      <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
        <CvLabel label="GM NOTE" color={catColor} />
        <p style="margin:0; font-size:11px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.5">{data.gm_note}</p>
      </div>
    {:else}
      <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
        <p style="margin:0; font-size:11px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.5">Forces a new approach — not higher rolls</p>
      </div>
    {/if}
  </div>
</div>
