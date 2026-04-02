<script>
  import StressRow from '../StressRow.svelte';
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  const LADDER = {8:"Legendary",7:"Epic",6:"Fantastic",5:"Superb",4:"Great",3:"Good",2:"Fair",1:"Average",0:"Mediocre"};
  const POWER_COLORS = {
    mook: '#78909C', average: '#1565c0', fair: '#2e7d32', good: '#C8944A', great: '#c62828',
  };

  let peakSkill = $derived(data.peakSkill || { name: 'Fight', rating: 2 });
  let stress = $derived(data.stress || 1);
  let hits = $derived(cardState?.phyHit ?? Array(stress).fill(false));
  let powerColor = $derived(POWER_COLORS[data.powerLevel] || '#1565c0');

  function setHits(a) { onUpdate({ phyHit: a }); }
</script>

<!-- Power Level Badge -->
<div class="fs-section-gap">
  <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px">
    <span style="display:inline-flex; align-items:center; padding:2px 8px; border-radius:3px; background:{powerColor}; color:#fff; font-size:9px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase">{data.powerLevel || 'average'}</span>
  </div>

  <!-- High Concept -->
  <div class="fs-aspect-label fs-aspect-label-hc">High Concept</div>
  <div class="fs-aspect-val">{data.highConcept || ''}</div>

  <!-- Trouble (if present) -->
  {#if data.trouble}
    <div class="fs-aspect-label fs-aspect-label-other">Trouble</div>
    <div class="fs-aspect-val" style="color:var(--fs-trouble)">{data.trouble}</div>
  {/if}
</div>

<!-- Peak Skill -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">PEAK SKILL</div>
  <OgmaTooltip tip="{peakSkill.name} at +{peakSkill.rating} ({LADDER[peakSkill.rating] || ''})">
    <div class="fs-skill-row" style="--skill-pct:{Math.min(1, (peakSkill.rating || 0) / 7)}; --skill-delay:0ms">
      <span class="fs-skill-badge">+{peakSkill.rating}</span>
      <span class="fs-skill-name">{peakSkill.name}</span>
      <span class="fs-skill-ladder">({LADDER[peakSkill.rating] || ''})</span>
    </div>
  </OgmaTooltip>
</div>

<!-- Stress -->
<div class="fs-section-gap">
  <StressRow label="Stress" hits={hits.length ? hits : Array(stress).fill(false)} {setHits} color="var(--fs-stress-phy)" />
</div>

<!-- Stunt (if present) -->
{#if data.stunt}
  <div class="fs-section-gap">
    <OgmaTooltip tip="Stunts give +2 to a skill in a specific situation, or a once-per-scene special ability.">
      <div class="fs-section-hdr">STUNT</div>
    </OgmaTooltip>
    <div class="fs-stunt">
      <div class="fs-stunt-name">{data.stunt.name}</div>
      <div class="fs-stunt-desc">{data.stunt.desc || ''}</div>
    </div>
  </div>
{/if}
