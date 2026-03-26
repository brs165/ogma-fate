<script>
  import CvLabel from '../CvLabel.svelte';
  let { data = {}, campName = '', catColor = 'var(--accent)' } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div>
      <div style="font-size:14px; font-weight:800; color:var(--text); font-family:{CV4_MONO}; line-height:1.2">{data.name || data.title || ''}</div>
      <p style="margin:3px 0 0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4">{data.desc || data.description || ''}</p>
    </div>

    <div style="display:flex; gap:8px">
      <div style="flex:1; padding:5px 8px; background:color-mix(in srgb,var(--c-green,#34d399) 10%,var(--inset)); border:1px solid rgba(52,211,153,0.3); border-left:2px solid var(--c-green,#34d399); border-radius:0 5px 5px 0">
        <CvLabel label="SUCCESS" color="var(--c-green,#34d399)" />
        <p style="margin:0; font-size:11px; color:var(--c-green,#34d399); font-family:{CV4_SANS}; line-height:1.35">{data.success || ''}</p>
      </div>
      <div style="flex:1; padding:5px 8px; background:color-mix(in srgb,var(--c-red,#f87171) 10%,var(--inset)); border:1px solid rgba(248,113,113,0.3); border-left:2px solid var(--c-red,#f87171); border-radius:0 5px 5px 0">
        <CvLabel label="FAILURE" color="var(--c-red,#f87171)" />
        <p style="margin:0; font-size:11px; color:var(--c-red,#f87171); font-family:{CV4_SANS}; line-height:1.35">{data.failure || ''}</p>
      </div>
    </div>

    {#if data.stakes_good || data.stakes_bad}
      <div style="display:flex; gap:8px">
        {#if data.stakes_good}
          <div style="flex:1; padding:4px 7px; background:color-mix(in srgb,var(--c-green,#34d399) 6%,var(--inset)); border:1px solid rgba(52,211,153,0.2); border-left:2px solid rgba(52,211,153,0.4); border-radius:0 4px 4px 0">
            <CvLabel label="STAKES WIN" color="var(--c-green,#34d399)" />
            <p style="margin:0; font-size:10px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.35">{data.stakes_good}</p>
          </div>
        {/if}
        {#if data.stakes_bad}
          <div style="flex:1; padding:4px 7px; background:color-mix(in srgb,var(--c-red,#f87171) 6%,var(--inset)); border:1px solid rgba(248,113,113,0.2); border-left:2px solid rgba(248,113,113,0.4); border-radius:0 4px 4px 0">
            <CvLabel label="STAKES LOSE" color="var(--c-red,#f87171)" />
            <p style="margin:0; font-size:10px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.35">{data.stakes_bad}</p>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Right column -->
  <div style="width:158px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <div style="padding:7px 10px; background:color-mix(in srgb,{catColor} 8%,var(--cv-card-dark,var(--panel))); border:1px solid {catColor}33; border-left:3px solid {catColor}; border-radius:0 2px 2px 0">
      <CvLabel label="PRIMARY SKILL" color={catColor} />
      <div style="font-size:13px; font-weight:700; color:{catColor}; font-family:{CV4_MONO}">{data.primary || data.primary_skill || ''}</div>
    </div>

    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <CvLabel label="OPPOSING FORCE" color={catColor} />
      <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4">{data.opposing || data.opposition_skill || ''}</p>
    </div>
  </div>
</div>
