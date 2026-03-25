<script>
  import CvLabel from '../CvLabel.svelte';
  import CvTag from '../CvTag.svelte';

  export let data = {};
  export let campName = '';
  export let catColor = 'var(--accent)';

  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  const CC = {
    danger:     'var(--c-red,#f87171)',
    cover:      'var(--c-blue,#60a5fa)',
    tone:       'var(--gold,#fbbf24)',
    movement:   'var(--c-green,#34d399)',
    usable:     'var(--c-purple,#a78bfa)',
  };

  $: aspects = Array.isArray(data.aspects) ? data.aspects : [];
  $: zones   = Array.isArray(data.zones)   ? data.zones   : [];
  $: fqs     = Array.isArray(data.framing_questions) ? data.framing_questions : [];

  function aspectColor(a) {
    const cat = (typeof a === 'object' && a.category) ? a.category.toLowerCase() : 'tone';
    return CC[cat] || catColor;
  }
  function aspectCat(a) {
    return (typeof a === 'object' && a.category) ? a.category.toLowerCase() : 'tone';
  }
  function aspectFi(a) {
    return typeof a === 'object' ? (a.free_invoke || a.fi) : false;
  }
  function aspectName(a) {
    return typeof a === 'string' ? a : (a.name || '');
  }
  function zoneName(z)   { return typeof z === 'string' ? z : (z.name || ''); }
  function zoneAspect(z) { return typeof z === 'object' ? (z.aspect || '') : ''; }
  function zoneDesc(z)   { return typeof z === 'object' ? (z.description || '') : ''; }
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <CvLabel label="SCENE ASPECTS" color={catColor} />
    {#each aspects as a, i}
      {@const acol = aspectColor(a)}
      <div style="display:flex; gap:7px; align-items:flex-start">
        <CvTag text={aspectCat(a).toUpperCase()} color={acol} />
        <div style="font-size:11px; color:var(--text); font-family:{CV4_SANS}; font-style:italic; line-height:1.35">
          {aspectName(a)}{#if aspectFi(a)}<span style="font-size:10px; font-weight:700; color:var(--c-green,#34d399); font-style:normal; margin-left:4px">FI</span>{/if}
        </div>
      </div>
    {/each}
  </div>

  <!-- Right column -->
  <div style="width:180px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <CvLabel label="ZONES" color={catColor} />
    {#each zones.slice(0,4) as z, i}
      <div style="margin-bottom:5px; padding:4px 8px; background:var(--inset); border:1px solid var(--border); border-left:2px solid {catColor}; border-radius:0 4px 4px 0">
        <div style="font-size:11px; font-weight:700; color:var(--text); font-family:{CV4_SANS}; line-height:1.2">{zoneName(z)}</div>
        {#if zoneAspect(z)}<div style="font-size:11px; color:{catColor}; font-style:italic; font-family:{CV4_SANS}">{zoneAspect(z)}</div>{/if}
        {#if zoneDesc(z)}<div style="font-size:10px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.3; margin-top:2px">{zoneDesc(z)}</div>{/if}
      </div>
    {/each}

    {#if fqs.length > 0}
      <div>
        <CvLabel label="FRAMING" color={catColor} />
        {#each fqs.slice(0,3) as q}
          <p style="margin:0 0 4px; font-size:10px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.35">• {q}</p>
        {/each}
      </div>
    {/if}
  </div>
</div>
