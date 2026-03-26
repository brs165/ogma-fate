<script>
  import CvLabel from '../CvLabel.svelte';
  let { data = {}, campName = '', catColor = 'var(--accent)', cardState = {}, onUpdate = () => {} } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  const SC = { mild: 'var(--c-blue,#60a5fa)', moderate: 'var(--gold,#fbbf24)', severe: 'var(--c-red,#f87171)' };
  const ROWS = [
    { label: 'Mild',     s: 2, c: 'var(--c-blue,#60a5fa)'  },
    { label: 'Moderate', s: 4, c: 'var(--gold,#fbbf24)'    },
    { label: 'Severe',   s: 6, c: 'var(--c-red,#f87171)'   },
  ];

  let sev = $derived((data.severity || 'mild').toLowerCase());
  let col = $derived(SC[sev] || 'var(--c-purple,#a78bfa)');
  let treated = $derived(!!(cardState?.treated));

  function toggleTreated(e) {
    e.stopPropagation();
    onUpdate({ treated: !treated });
  }
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div style="padding:10px 12px; background:color-mix(in srgb,{col} 8%,var(--cv-card-dark,var(--panel))); border:1px solid {col}33; border-left:4px solid {col}; border-radius:0 8px 8px 0">
      <CvLabel label="CONSEQUENCE ASPECT" color={col} />
      <div style="font-size:15px; font-weight:800; color:var(--text); font-family:{CV4_MONO}; line-height:1.2; letter-spacing:-0.02em">{data.aspect || ''}</div>
      {#if data.context}<p style="margin:4px 0 0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; font-style:italic">{data.context}</p>{/if}
    </div>

    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <CvLabel label="COMPEL HOOK" color={catColor} />
      <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4; font-style:italic">"{data.compel_hook || ''}"</p>
    </div>

    <button
      onclick={toggleTreated}
      role="checkbox"
      aria-checked={String(treated)}
      aria-label={treated ? 'Consequence treated — timer started' : 'Mark consequence as treated'}
      style="width:100%; padding:6px 10px; background:{treated ? 'color-mix(in srgb,var(--c-green,#34d399) 15%,var(--inset))' : 'var(--inset)'}; border:1px solid {treated ? 'var(--c-green,#34d399)' : 'var(--border)'}; border-radius:5px; cursor:pointer; font-family:{CV4_MONO}; font-size:11px; font-weight:700; color:{treated ? 'var(--c-green,#34d399)' : 'var(--text-muted)'}; letter-spacing:0.1em; transition:all .15s; text-align:center"
    >{treated ? '✓ TREATED — TIMER STARTED' : 'MARK AS TREATED'}</button>
  </div>

  <!-- Right column -->
  <div style="width:128px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <div style="text-align:center">
      <CvLabel label="SEVERITY" color={col} />
      <div style="padding:8px 14px; background:color-mix(in srgb,{col} 16%,var(--inset)); border:2px solid {col}; border-radius:8px; display:inline-block">
        <div style="font-size:14px; font-weight:800; color:{col}; font-family:{CV4_MONO}; text-transform:capitalize">{sev}</div>
      </div>
    </div>

    <div style="display:flex; flex-direction:column; gap:3px">
      {#each ROWS as r}
        <div style="display:flex; gap:6px; align-items:center; opacity:{r.label.toLowerCase() === sev ? 1 : 0.28}">
          <div style="font-size:11px; font-weight:{r.label.toLowerCase() === sev ? 700 : 400}; color:{r.c}; font-family:{CV4_SANS}; width:54px">{r.label}</div>
          <div style="font-size:11px; font-weight:700; color:{r.c}; font-family:{CV4_MONO}">{r.s} shifts</div>
        </div>
      {/each}
    </div>
  </div>
</div>
