<script>
  import CvLabel from '../CvLabel.svelte';

  export let data = {};
  export let campName = '';
  export let catColor = 'var(--accent)';

  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  $: qs = Array.isArray(data.questions) ? data.questions : [];
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <CvLabel label="SESSION ZERO QUESTIONS" color={catColor} />
    {#each qs as q, i}
      <div style="display:flex; gap:8px; align-items:flex-start">
        <div style="width:18px; height:18px; border-radius:50%; flex-shrink:0; background:color-mix(in srgb,{catColor} 16%,var(--inset)); border:1px solid {catColor}55; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:{catColor}; font-family:{CV4_MONO}">{i+1}</div>
        <p style="margin:0; font-size:11px; color:var(--text); font-family:{CV4_SANS}; line-height:1.45">{q}</p>
      </div>
    {/each}
  </div>

  <!-- Right column -->
  <div style="width:160px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <div style="padding:7px 10px; background:color-mix(in srgb,{catColor} 8%,var(--cv-card-dark,var(--panel))); border:1px solid {catColor}33; border-left:3px solid {catColor}; border-radius:0 2px 2px 0">
      <CvLabel label="HOOK" color={catColor} />
      <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.45; font-style:italic">{data.hook || ''}</p>
    </div>

    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <CvLabel label="RELATIONSHIP WEB" color={catColor} />
      <p style="margin:0; font-size:11px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.5">{data.relationship || 'Each player names two PCs. What do you share? What secret?'}</p>
    </div>
  </div>
</div>
