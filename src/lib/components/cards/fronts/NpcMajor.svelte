<script>
  import StressRow from '../StressRow.svelte';
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  const LADDER = {8:"Legendary",7:"Epic",6:"Fantastic",5:"Superb",4:"Great",3:"Good",2:"Fair",1:"Average",0:"Mediocre"};
  const SKILL_TIPS = {
    'Shoot': 'Ranged attacks. Difficulty = target defense.',
    'Fight': 'Melee attacks and physical contests.',
    'Provoke': 'Intimidation, manipulation, emotional attacks.',
    'Deceive': 'Lies, misdirection, disguise.',
    'Rapport': 'Charm, diplomacy, persuasion.',
    'Empathy': 'Reading people, sensing intent.',
    'Notice': 'Perception, awareness, spotting hidden things.',
    'Investigate': 'Research, deduction, finding clues.',
    'Stealth': 'Hiding, moving unseen.',
    'Burglary': 'Breaking in, picking locks, sleight of hand.',
    'Athletics': 'Running, jumping, dodging.',
    'Physique': 'Strength, endurance. Determines physical stress track.',
    'Will': 'Mental fortitude. Determines mental stress track.',
    'Crafts': 'Making and repairing things.',
    'Lore': 'Arcane or specialized knowledge.',
    'Resources': 'Wealth and material assets.',
    'Contacts': 'Social network, knowing people.',
    'Drive': 'Vehicles and chase scenes.',
  };
  function skillTip(name, r) {
    const base = SKILL_TIPS[name] || name;
    const label = LADDER[r] || ('+' + r);
    return `${name} — ${label} (+${r}). ${base}`;
  }

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

<!-- Stress -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">STRESS</div>
  <StressRow label="Physical" hits={phyHits.length ? phyHits : Array(data.physical_stress||3).fill(false)} setHits={setPhy} color="var(--fs-stress-phy)" />
  <StressRow label="Mental" hits={menHits.length ? menHits : Array(data.mental_stress||3).fill(false)} setHits={setMen} color="var(--fs-stress-men)" />
</div>

<!-- Consequences -->
{#snippet conRow(label, cls)}
  <div class="fs-con-row">
    <OgmaTooltip tip={label === 'Mild (2)' ? 'Absorbs 2 shifts. Clears end of next scene after treatment.' : label === 'Moderate (4)' ? 'Absorbs 4 shifts. Clears end of session after treatment.' : 'Absorbs 6 shifts. Clears end of arc after treatment.'}>
      <span class="fs-con-label {cls}">{label}</span>
    </OgmaTooltip>
    <div class="fs-con-line"></div>
  </div>
{/snippet}
<div class="fs-section-gap">
  <OgmaTooltip tip="Lasting injuries that are aspects — can be invoked for +2 or compelled for complications. Recovery requires a treatment roll first.">
    <div class="fs-section-hdr">CONSEQUENCES</div>
  </OgmaTooltip>
  {@render conRow('Mild (2)',     'fs-con-label-mild')}
  {@render conRow('Moderate (4)', 'fs-con-label-mod')}
  {@render conRow('Severe (6)',   'fs-con-label-sev')}
</div>

<!-- Stunts -->
{#if stunts.length > 0}
  <div class="fs-section-gap">
    <OgmaTooltip tip="Special abilities: +2 to a skill in a narrow situation, or a once-per-scene effect. Don\u2019t forget to use them.">
      <div class="fs-section-hdr">STUNTS</div>
    </OgmaTooltip>
    {#each stunts as s}
      <div class="fs-stunt">
        <div class="fs-stunt-name">{s.name}{s.skill ? ` (${s.skill})` : ''}</div>
        <div class="fs-stunt-desc">{s.desc || s}</div>
      </div>
    {/each}
  </div>
{/if}
