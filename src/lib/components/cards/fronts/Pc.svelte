<script>
  import StressRow from '../StressRow.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)' } = $props();

  const LADDER = {8:"Legendary",7:"Epic",6:"Fantastic",5:"Superb",4:"Great",3:"Good",2:"Fair",1:"Average",0:"Mediocre"};

  let asp = $derived(data.aspects || {});
  let skills = $derived(Array.isArray(data.skills) ? data.skills : []);
  let stunts = $derived(Array.isArray(data.stunts) ? data.stunts : []);
  let otherAsps = $derived([asp.other1, asp.other2, asp.other3].filter(Boolean));
  let consequences = $derived(data.consequences || [2, 4, 6]);
  const CON_LABELS = ['Mild','Moderate','Severe'];
  const CON_CLASSES = ['fs-con-label-mild','fs-con-label-mod','fs-con-label-sev'];
  const noop = () => {};
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
  {#each otherAsps as a, i}
    <div class="fs-aspect-label fs-aspect-label-other">Aspect {i + 3}</div>
    <div class="fs-aspect-val">{a}</div>
  {/each}
</div>

<!-- Skills -->
{#if skills.length > 0}
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
{/if}

<!-- Stress -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">STRESS</div>
  <StressRow label="Physical" hits={Array(data.physical_stress || 3).fill(false)} setHits={noop} color="var(--fs-stress-phy)" />
  <StressRow label="Mental" hits={Array(data.mental_stress || 3).fill(false)} setHits={noop} color="var(--fs-stress-men)" />
</div>

<!-- Consequences -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">CONSEQUENCES</div>
  {#each consequences as shift, i}
    <div class="fs-con-row">
      <span class="fs-con-label {CON_CLASSES[i] || 'fs-con-label-sev'}">{CON_LABELS[i] || 'Severe'} ({shift})</span>
      <div class="fs-con-line"></div>
    </div>
  {/each}
</div>

<!-- Stunts -->
{#if stunts.length > 0}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">STUNTS</div>
    {#each stunts as st}
      <div class="fs-stunt">
        <div class="fs-stunt-name">{st.name || ''}{#if st.skill} <span style="font-weight:400">({st.skill})</span>{/if}</div>
        <div class="fs-stunt-desc">{st.desc || ''}</div>
      </div>
    {/each}
  </div>
{/if}

<!-- Session Zero Questions -->
{#if Array.isArray(data.questions) && data.questions.length > 0}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">SESSION ZERO QUESTIONS</div>
    {#each data.questions as q}
      <div class="fs-stunt">
        <div class="fs-stunt-desc">{q}</div>
      </div>
    {/each}
  </div>
{/if}
