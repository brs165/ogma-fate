<script>
  let { data = {}, campName = '', catColor = 'var(--fs-section)' } = $props();

  const CC = {
    danger: '#c62828', cover: '#1565c0', tone: '#b8860b', movement: '#2e7d32', usable: '#7b1fa2',
  };

  let aspects = $derived(Array.isArray(data.aspects) ? data.aspects : []);
  let zones = $derived(Array.isArray(data.zones) ? data.zones : []);
  let fqs = $derived(Array.isArray(data.framing_questions) ? data.framing_questions : []);

  function aspectColor(a) {
    const cat = (typeof a === 'object' && a.category) ? a.category.toLowerCase() : 'tone';
    return CC[cat] || '#6B4400';
  }
  function aspectCat(a) { return (typeof a === 'object' && a.category) ? a.category.toLowerCase() : 'tone'; }
  function aspectFi(a) { return typeof a === 'object' ? (a.free_invoke || a.fi) : false; }
  function aspectName(a) { return typeof a === 'string' ? a : (a.name || ''); }
  function zoneName(z) { return typeof z === 'string' ? z : (z.name || ''); }
  function zoneAspect(z) { return typeof z === 'object' ? (z.aspect || '') : ''; }
  function zoneDesc(z) { return typeof z === 'object' ? (z.description || '') : ''; }
</script>

<!-- Scene Aspects -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">SCENE ASPECTS</div>
  {#each aspects as a, i}
    {@const acol = aspectColor(a)}
    <div style="display:flex; gap:8px; align-items:flex-start; margin-bottom:6px">
      <span style="display:inline-flex; align-items:center; justify-content:center; padding:2px 8px; border-radius:3px; min-width:56px; text-align:center; background:{acol}; color:#fff; font-size:9px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; flex-shrink:0">{aspectCat(a)}</span>
      <div style="font-size:12px; color:var(--fs-text); font-style:italic; line-height:1.4; font-weight:500">
        {aspectName(a)}{#if aspectFi(a)}<span style="font-size:9px; font-weight:800; color:#fff; font-style:normal; margin-left:6px; background:#2e7d32; padding:1px 6px; border-radius:3px">FREE INVOKE</span>{/if}
      </div>
    </div>
  {/each}
</div>

<!-- Zones -->
{#if zones.length > 0}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">ZONES</div>
    {#each zones.slice(0,4) as z}
      <div class="fs-stunt" style="border-left:3px solid var(--fs-badge-bg, var(--fs-section)); border-radius:0 3px 3px 0">
        <div style="font-size:12px; font-weight:700; color:var(--fs-text); line-height:1.2">{zoneName(z)}</div>
        {#if zoneAspect(z)}<div style="font-size:12px; color:var(--fs-section); font-style:italic">{zoneAspect(z)}</div>{/if}
        {#if zoneDesc(z)}<div style="font-size:11px; color:var(--fs-text-muted); line-height:1.35; margin-top:2px">{zoneDesc(z)}</div>{/if}
      </div>
    {/each}
  </div>
{/if}

<!-- Framing Questions -->
{#if fqs.length > 0}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">FRAMING QUESTIONS</div>
    {#each fqs.slice(0,3) as q}
      <p style="margin:0 0 4px; font-size:12px; color:var(--fs-text-muted); line-height:1.4"><i class="fa-solid fa-circle" aria-hidden="true" style="font-size:4px; vertical-align:middle; margin-right:6px; color:var(--fs-section)"></i>{q}</p>
    {/each}
  </div>
{/if}
