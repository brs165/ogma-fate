<script>
  import CvLabel from '../CvLabel.svelte';

  export let data = {};
  export let campName = '';
  export let catColor = 'var(--accent)';

  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  $: cur      = data.current || {};
  $: imp      = data.impending || {};
  $: curFaces = Array.isArray(cur.faces) ? cur.faces : [];
  $: impFaces = Array.isArray(imp.faces) ? imp.faces : [];
  $: setting  = Array.isArray(data.setting) ? data.setting : [];
  $: curPlaces = Array.isArray(cur.places) ? cur.places : [];
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div>
      <CvLabel label="CURRENT ISSUE" color={catColor} />
      <div style="font-size:12px; font-weight:700; color:var(--text); font-family:{CV4_SANS}; line-height:1.3; margin-bottom:3px">{cur.name || ''}</div>
      <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.5">{cur.desc || ''}</p>
    </div>

    {#if curFaces.length > 0}
      <div style="display:flex; flex-direction:column; gap:3px">
        {#each curFaces as f}
          <div style="padding:3px 8px; background:var(--inset); border:1px solid var(--border); border-radius:4px">
            <span style="font-size:11px; font-weight:700; color:{catColor}; font-family:{CV4_SANS}">{f.name}: </span>
            <span style="font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; font-style:italic">{f.role}</span>
          </div>
        {/each}
      </div>
    {/if}

    <div style="padding:7px 10px; background:color-mix(in srgb,var(--c-red,#f87171) 8%,var(--cv-card-dark,var(--panel))); border:1px solid var(--c-red,#f87171)33; border-left:3px solid var(--c-red,#f87171); border-radius:0 2px 2px 0">
      <CvLabel label="IMPENDING" color="var(--c-red,#f87171)" />
      <div style="font-size:12px; font-weight:700; color:var(--c-red,#f87171); font-family:{CV4_SANS}; line-height:1.3; margin-bottom:{imp.desc ? 3 : 0}px">{imp.name || ''}</div>
      {#if imp.desc}<p style="margin:0; font-size:11px; font-style:italic; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.35">{imp.desc}</p>{/if}
    </div>

    {#if impFaces.length > 0}
      <div style="display:flex; flex-direction:column; gap:3px">
        {#each impFaces as f}
          <div style="padding:3px 8px; background:var(--inset); border:1px solid rgba(248,113,113,0.25); border-radius:4px">
            <span style="font-size:11px; font-weight:700; color:var(--c-red,#f87171); font-family:{CV4_SANS}">{f.name}: </span>
            <span style="font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; font-style:italic">{f.role}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Right column -->
  <div style="width:172px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <CvLabel label="SETTING ASPECTS" color={catColor} />
    {#each setting as s}
      <p style="margin:0 0 6px; font-size:11px; font-style:italic; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4; padding-left:8px; border-left:1px solid var(--border)">"{s}"</p>
    {/each}

    {#if curPlaces.length > 0}
      <div>
        <CvLabel label="PLACES" color={catColor} />
        {#each curPlaces as p}
          <div style="font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; padding:1px 0">· {p}</div>
        {/each}
      </div>
    {/if}
  </div>
</div>
