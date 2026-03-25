<script>
  import CvLabel from '../CvLabel.svelte';

  export let data = {};
  export let campName = '';
  export let catColor = 'var(--accent)';

  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  $: scenes = Array.isArray(data.scenes) ? data.scenes : [];
  $: opp    = Array.isArray(data.opposition) ? data.opposition : [];

  const cols = ['', 'var(--gold,#fbbf24)', 'var(--c-red,#f87171)'];

  function sceneColor(i) {
    return i === 0 ? catColor : cols[i] || catColor;
  }

  function truncate(s, max) {
    if (!s) return '';
    return s.length > max ? s.slice(0, max) + '…' : s;
  }
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div>
      <CvLabel label="OBJECTIVE" color={catColor} />
      <p style="margin:0; font-size:11px; font-weight:600; color:var(--text); font-family:{CV4_SANS}; line-height:1.45">{data.objective || ''}</p>
    </div>

    <div>
      <CvLabel label="LOCATION" color={catColor} />
      <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4">{data.location || ''}</p>
    </div>

    {#if data.issue}
      <div>
        <CvLabel label="ISSUE IN PLAY" color={catColor} />
        <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4; font-style:italic">{data.issue}</p>
      </div>
    {/if}

    {#if data.setting_asp}
      <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
        <CvLabel label="SETTING ASPECT" color={catColor} />
        <p style="margin:0; font-size:11px; font-style:italic; color:var(--text-dim); font-family:{CV4_SANS}">{data.setting_asp}</p>
      </div>
    {/if}

    <div style="padding:7px 10px; background:color-mix(in srgb,var(--c-red,#f87171) 8%,var(--cv-card-dark,var(--panel))); border:1px solid var(--c-red,#f87171)33; border-left:3px solid var(--c-red,#f87171); border-radius:0 2px 2px 0">
      <CvLabel label="COMPLICATION" color="var(--c-red,#f87171)" />
      <p style="margin:0; font-size:11px; color:var(--c-red,#f87171); font-family:{CV4_SANS}; line-height:1.3">{data.complication || ''}</p>
    </div>
  </div>

  <!-- Right column -->
  <div style="width:170px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <CvLabel label="3-SCENE SKELETON" color={catColor} />
    {#each scenes as s, i}
      {@const brief = truncate(s.brief || '', 80)}
      <div style="padding:5px 8px; background:var(--inset); border:1px solid var(--border); border-left:2px solid {sceneColor(i)}; border-radius:0 4px 4px 0; margin-bottom:4px">
        <div style="font-size:10px; font-weight:700; color:{sceneColor(i)}; letter-spacing:0.15em; font-family:{CV4_MONO}">{s.type || `ACT ${i+1}`}</div>
        <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.3">{brief}</p>
      </div>
    {/each}

    {#if data.twist}
      <div>
        <CvLabel label="TWIST" color={catColor} />
        <p style="margin:0; font-size:11px; color:var(--text-dim); font-style:italic; font-family:{CV4_SANS}; line-height:1.35">{data.twist}</p>
      </div>
    {/if}

    {#if data.victory}
      <div style="display:flex; gap:5px">
        <div style="flex:1; padding:3px 7px; background:color-mix(in srgb,var(--c-green,#34d399) 10%,var(--inset)); border-left:2px solid var(--c-green,#34d399); border-radius:0 3px 3px 0">
          <CvLabel label="WIN" color="var(--c-green,#34d399)" />
          <p style="margin:0; font-size:10px; color:var(--c-green,#34d399); font-family:{CV4_SANS}; line-height:1.3">{data.victory}</p>
        </div>
        {#if data.defeat}
          <div style="flex:1; padding:3px 7px; background:color-mix(in srgb,var(--c-red,#f87171) 10%,var(--inset)); border-left:2px solid var(--c-red,#f87171); border-radius:0 3px 3px 0">
            <CvLabel label="LOSE" color="var(--c-red,#f87171)" />
            <p style="margin:0; font-size:10px; color:var(--c-red,#f87171); font-family:{CV4_SANS}; line-height:1.3">{data.defeat}</p>
          </div>
        {/if}
      </div>
    {/if}

    {#if opp.length > 0}
      <div>
        <CvLabel label="OPPOSITION" color={catColor} />
        {#each opp.slice(0,2) as o}
          <div style="display:flex; gap:5px; align-items:center; padding:2px 0">
            <div style="font-size:10px; font-weight:700; color:{catColor}; font-family:{CV4_MONO}">×{o.qty || 1}</div>
            <div style="font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}">{o.name || ''}</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
