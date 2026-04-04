<script>
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  const CC = {
    danger: '#c62828', cover: '#1565c0', tone: '#b8860b', movement: '#2e7d32', usable: '#7b1fa2',
  };
  const CAT_TIPS = {
    danger:   'Danger aspect — active threat in the scene. Can attack, tick down, or escalate. Invoke it against PCs, compel it as collateral damage.',
    cover:    'Cover aspect — provides passive opposition to attacks. +2 for anyone using it to defend. Invoke for free when behind it.',
    tone:     'Tone aspect — sets the mood and stakes. Invoke it to justify roleplaying bonuses. Compel it to enforce the genre.',
    movement: 'Movement aspect — affects how characters cross zones. Invoke for free movement or extra distance. Compel to slow or block.',
    usable:   'Usable aspect — an object or element the PCs can exploit. Invoke for creative advantage rolls or compel when it backfires.',
  };
  function catTip(a) {
    const cat = aspectCat(a);
    return CAT_TIPS[cat] || 'Scene aspect — invoke for +2 on relevant rolls, compel to create complications.';
  }
  function zoneTip(z) {
    const aspect = zoneAspect(z);
    return aspect ? `Zone: ${zoneName(z)} — aspect "${aspect}". Moving between zones is free unless impeded.` : `Zone: ${zoneName(z)}. Moving between adjacent zones is free; costs an overcome roll if impeded.`;
  }

  let aspects = $derived(Array.isArray(data.aspects) ? data.aspects : []);
  let zones = $derived(Array.isArray(data.zones) ? data.zones : []);
  let fqs = $derived(Array.isArray(data.framing_questions) ? data.framing_questions : []);
  let spentFi = $derived(cardState?.spentFi || {});

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

  function toggleFi(i) {
    const updated = { ...spentFi, [i]: !spentFi[i] };
    onUpdate({ spentFi: updated });
  }
</script>

<!-- Scene Aspects -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">SCENE ASPECTS</div>
  {#each aspects as a, i}
    {@const acol = aspectColor(a)}
    <div style="display:flex; gap:8px; align-items:flex-start; margin-bottom:6px">
      <OgmaTooltip tip={catTip(a)}>
        <span style="display:inline-flex; align-items:center; justify-content:center; padding:2px 8px; border-radius:3px; min-width:56px; text-align:center; background:{acol}; color:#fff; font-size:9px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; flex-shrink:0" tabindex="0">{aspectCat(a)}</span>
      </OgmaTooltip>
      <div style="font-size:12px; color:var(--fs-text); font-style:italic; line-height:1.4; font-weight:500" class="{spentFi[i] ? 'fi-spent' : ''}">
        {aspectName(a)}{#if aspectFi(a)}
          <OgmaTooltip tip={spentFi[i] ? 'Free invoke spent — click to restore' : 'One free +2 on your next roll. No fate point needed. Click to mark as spent.'}>
            <button
              class="fi-badge-btn"
              onclick={(e) => { e.stopPropagation(); toggleFi(i); }}
              aria-label="{spentFi[i] ? 'Free invoke spent' : 'Spend free invoke'}"
              aria-pressed={String(!!spentFi[i])}
            ><span style="font-size:9px; font-weight:800; color:{spentFi[i] ? '#999' : '#fff'}; font-style:normal; margin-left:6px; background:{spentFi[i] ? '#999' : '#2e7d32'}; padding:1px 6px; border-radius:3px; text-decoration:{spentFi[i] ? 'line-through' : 'none'}">{spentFi[i] ? 'USED' : 'FREE INVOKE'}</span></button>
          </OgmaTooltip>
        {/if}
      </div>
    </div>
  {/each}
</div>

<!-- Zones -->
{#if zones.length > 0}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">ZONES</div>
    {#each zones.slice(0,4) as z}
      <OgmaTooltip tip={zoneTip(z)}>
        <div class="fs-stunt" style="border-left:3px solid var(--fs-badge-bg, var(--fs-section)); border-radius:0 3px 3px 0; cursor:default">
          <div style="font-size:12px; font-weight:700; color:var(--fs-text); line-height:1.2">{zoneName(z)}</div>
          {#if zoneAspect(z)}<div style="font-size:12px; color:var(--fs-section); font-style:italic">{zoneAspect(z)}</div>{/if}
          {#if zoneDesc(z)}<div style="font-size:11px; color:var(--fs-text-muted); line-height:1.35; margin-top:2px">{zoneDesc(z)}</div>{/if}
        </div>
      </OgmaTooltip>
    {/each}
  </div>
{/if}

<!-- Framing Questions -->
{#if fqs.length > 0}
  <div class="fs-section-gap">
    <OgmaTooltip tip="Answer before play to decide if this scene is worth playing.">
      <div class="fs-section-hdr">FRAMING QUESTIONS</div>
    </OgmaTooltip>
    {#each fqs.slice(0,3) as q}
      <p style="margin:0 0 4px; font-size:12px; color:var(--fs-text-muted); line-height:1.4"><i class="fa-solid fa-circle" aria-hidden="true" style="font-size:4px; vertical-align:middle; margin-right:6px; color:var(--fs-section)"></i>{q}</p>
    {/each}
  </div>
{/if}
