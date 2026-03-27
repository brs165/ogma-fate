<script>
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  const SC = { mild: 'var(--fs-con-mild)', moderate: 'var(--fs-con-mod)', severe: 'var(--fs-con-sev)' };
  const ROWS = [
    { label: 'Mild', s: 2, cls: 'fs-con-label-mild' },
    { label: 'Moderate', s: 4, cls: 'fs-con-label-mod' },
    { label: 'Severe', s: 6, cls: 'fs-con-label-sev' },
  ];

  let sev = $derived((data.severity || 'mild').toLowerCase());
  let col = $derived(SC[sev] || 'var(--fs-con-mild)');
  let treated = $derived(!!(cardState?.treated));

  let recoveryTip = $derived(
    sev === 'mild' ? 'Mild: clears at end of the next scene after treatment (FCon p.37).' :
    sev === 'moderate' ? 'Moderate: clears at end of the session it was treated in (FCon p.37).' :
    'Severe: clears at end of the arc it was treated in (FCon p.37).'
  );
  let untreatedTip = 'Treatment must be narrated (medicine, rest, magic). Once treated, recovery timing begins.';

  function toggleTreated(e) {
    onUpdate({ treated: !treated });
  }
</script>

<!-- Consequence Aspect -->
<div class="fs-section-gap">
  <div class="fs-stunt" style="border-left:4px solid {col}; border-radius:0 3px 3px 0; padding:10px 12px">
    <div style="font-size:10px; font-weight:800; letter-spacing:0.12em; color:{col}; margin-bottom:3px">CONSEQUENCE ASPECT</div>
    <div style="font-size:15px; font-weight:800; color:var(--fs-text); line-height:1.2">{data.aspect || ''}</div>
    {#if data.context}<div style="font-size:12px; color:var(--fs-text-dim); font-style:italic; margin-top:4px">{data.context}</div>{/if}
  </div>
</div>

<!-- Compel Hook -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">COMPEL HOOK</div>
  <div style="font-size:12px; color:var(--fs-text-dim); font-style:italic; line-height:1.4">"{data.compel_hook || ''}"</div>
</div>

<!-- Severity ladder -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">SEVERITY</div>
  <div style="display:flex; flex-direction:column; gap:3px">
    {#each ROWS as r}
      <div style="display:flex; gap:8px; align-items:center; opacity:{r.label.toLowerCase() === sev ? 1 : 0.3}">
        <span class="fs-con-label {r.cls}" style="width:80px">{r.label}</span>
        <span style="font-size:12px; font-weight:700; color:var(--fs-text-dim)">{r.s} shifts</span>
        {#if r.label.toLowerCase() === sev}<span style="font-size:10px; font-weight:800; color:{col}; margin-left:4px"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></span>{/if}
      </div>
    {/each}
  </div>
</div>

<!-- Treated toggle -->
<OgmaTooltip tip={treated ? recoveryTip : untreatedTip}>
  <button
    onclick={toggleTreated}
    role="checkbox"
    aria-checked={String(treated)}
    aria-label={treated ? 'Consequence treated — timer started' : 'Mark consequence as treated'}
    class="fs-stunt"
    style="width:100%; cursor:pointer; text-align:center; font-size:12px; font-weight:700; letter-spacing:0.08em; color:{treated ? '#2e7d32' : 'var(--fs-text-muted)'}; border-color:{treated ? '#2e7d32' : 'var(--fs-border)'}; background:{treated ? 'rgba(46,125,50,0.08)' : 'var(--fs-stunt-bg)'}; transition:all 0.15s"
  >{#if treated}<i class="fa-solid fa-check" aria-hidden="true"></i> TREATED — {recoveryTip}{:else}MARK AS TREATED{/if}</button>
</OgmaTooltip>
