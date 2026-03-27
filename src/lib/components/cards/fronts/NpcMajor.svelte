<script>
  import StressRow from '../StressRow.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  const LADDER = {8:"Legendary",7:"Epic",6:"Fantastic",5:"Superb",4:"Great",3:"Good",2:"Fair",1:"Average",0:"Mediocre"};

  let asp = $derived(data.aspects || {});
  let skills = $derived(Array.isArray(data.skills) ? data.skills : []);
  let stunts = $derived(Array.isArray(data.stunts) ? data.stunts : []);
  let others = $derived(Array.isArray(asp.others) ? asp.others : []);
  let phyHits = $derived(cardState?.phyHit ?? Array(data.physical_stress || 3).fill(false));
  let menHits = $derived(cardState?.menHit ?? Array(data.mental_stress  || 3).fill(false));

  function setPhy(a) { onUpdate({ phyHit: a }); }
  function setMen(a) { onUpdate({ menHit: a }); }
</script>

<!-- Aspects -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">ASPECTS</div>
  {#if asp.high_concept}
    <div class="fs-aspect-label fs-aspect-label-hc">High Concept</div>
    <div class="fs-aspect-val">{asp.high_concept}</div>
  {/if}
  {#if asp.trouble}
    <div class="fs-aspect-label fs-aspect-label-tr">Trouble</div>
    <div class="fs-aspect-val">{asp.trouble}</div>
  {/if}
  {#each others as a, i}
    <div class="fs-aspect-label fs-aspect-label-other">Aspect {i + 3}</div>
    <div class="fs-aspect-val">{a}</div>
  {/each}
</div>

<!-- Skills -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">SKILLS</div>
  {#each skills as s}
    <div class="fs-skill-row">
      <span class="fs-skill-badge">+{s.r}</span>
      <span class="fs-skill-name">{s.name}</span>
      <span class="fs-skill-ladder">({LADDER[s.r] || ''})</span>
    </div>
  {/each}
</div>

<!-- Stress -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">STRESS</div>
  <StressRow label="Physical" hits={phyHits.length ? phyHits : Array(data.physical_stress||3).fill(false)} setHits={setPhy} color="var(--fs-stress-phy)" />
  <StressRow label="Mental" hits={menHits.length ? menHits : Array(data.mental_stress||3).fill(false)} setHits={setMen} color="var(--fs-stress-men)" />
</div>

<!-- Consequences -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">CONSEQUENCES</div>
  <div class="fs-con-row">
    <span class="fs-con-label fs-con-label-mild">Mild (2)</span>
    <div class="fs-con-line"></div>
  </div>
  <div class="fs-con-row">
    <span class="fs-con-label fs-con-label-mod">Moderate (4)</span>
    <div class="fs-con-line"></div>
  </div>
  <div class="fs-con-row">
    <span class="fs-con-label fs-con-label-sev">Severe (6)</span>
    <div class="fs-con-line"></div>
  </div>
</div>

<!-- Stunts -->
{#if stunts.length > 0}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">STUNTS</div>
    {#each stunts as s}
      <div class="fs-stunt">
        <div class="fs-stunt-name">{s.name}{s.skill ? ` (${s.skill})` : ''}</div>
        <div class="fs-stunt-desc">{s.desc || s}</div>
      </div>
    {/each}
  </div>
{/if}
