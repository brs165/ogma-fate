<script>
  import StressRow from '../StressRow.svelte';
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  const LADDER = {8:"Legendary",7:"Epic",6:"Fantastic",5:"Superb",4:"Great",3:"Good",2:"Fair",1:"Average",0:"Mediocre"};
  const SKILL_TIPS = {
    'Shoot':'Ranged attacks.','Fight':'Melee attacks.','Provoke':'Intimidation, emotional attacks.',
    'Deceive':'Lies, misdirection.','Rapport':'Charm, persuasion.','Empathy':'Reading people.',
    'Notice':'Perception, spotting hidden things.','Investigate':'Research, deduction.',
    'Stealth':'Hiding, moving unseen.','Burglary':'Breaking in, picking locks.',
    'Athletics':'Running, jumping, dodging.','Physique':'Strength, endurance.',
    'Will':'Mental fortitude.','Crafts':'Making and repairing.','Lore':'Specialized knowledge.',
    'Resources':'Wealth.','Contacts':'Social network.','Drive':'Vehicles.',
  };
  function skillTip(name, r) {
    return `${name} — ${LADDER[r] || ('+'+r)} (+${r}). ${SKILL_TIPS[name] || name}`;
  }

  let aspects = $derived(Array.isArray(data.aspects) ? data.aspects : []);
  let skills = $derived(Array.isArray(data.skills) ? data.skills : []);
  let stunt = $derived(data.stunt || null);
  let stress = $derived(data.stress || 1);
  let hits = $derived(cardState?.phyHit ?? Array(stress).fill(false));

  function setHits(a) { onUpdate({ phyHit: a }); }
</script>

<!-- Aspects -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">ASPECTS</div>
  {#each aspects as a, i}
    <div class="fs-aspect-label {i === 0 ? 'fs-aspect-label-hc' : 'fs-aspect-label-other'}">{i === 0 ? 'High Concept' : 'Weakness'}</div>
    <div class="fs-aspect-val">{a}</div>
  {/each}
</div>

<!-- Skills -->
{#if skills.length > 0}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">SKILLS</div>
    {#each skills as s, i}
      <OgmaTooltip tip={skillTip(s.name, s.r)}>
        <div class="fs-skill-row" style="--skill-pct:{Math.min(1, (s.r || 0) / 7)}; --skill-delay:{i * 40}ms">
          <span class="fs-skill-badge">+{s.r}</span>
          <span class="fs-skill-name">{s.name}</span>
          <span class="fs-skill-ladder">({LADDER[s.r] || ''})</span>
        </div>
      </OgmaTooltip>
    {/each}
  </div>
{/if}

<!-- Stress -->
<div class="fs-section-gap">
  <StressRow label="Stress" hits={hits.length ? hits : Array(stress).fill(false)} {setHits} color="var(--fs-stress-phy)" />
  <div style="font-size:11px; color:var(--fs-text-muted); line-height:1.4; margin-top:4px; font-style:italic">No consequences — one hit beyond stress = taken out.</div>
</div>

<!-- Stunt -->
{#if stunt}
  <div class="fs-section-gap">
    <OgmaTooltip tip="Stunts give +2 to a skill in a specific situation, or a once-per-scene special ability.">
      <div class="fs-section-hdr">STUNT</div>
    </OgmaTooltip>
    <div class="fs-stunt">
      <div class="fs-stunt-name">{stunt.name}</div>
      <div class="fs-stunt-desc">{stunt.desc || ''}</div>
    </div>
  </div>
{/if}
