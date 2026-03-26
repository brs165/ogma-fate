<script>
  import CvLabel from '../CvLabel.svelte';
  import StressRow from '../StressRow.svelte';
  let { data = {}, campName = '', catColor = 'var(--accent)' } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const LADDER = { 4: 'Great', 3: 'Good', 2: 'Fair', 1: 'Average', 0: 'Mediocre' };

  let asp = $derived(data.aspects || {});
  let skills = $derived(Array.isArray(data.skills) ? data.skills : []);
  let stunts = $derived(Array.isArray(data.stunts) ? data.stunts : []);
  let otherAsps = $derived([asp.other1, asp.other2, asp.other3].filter(Boolean));
  let consequences = $derived(data.consequences || [2, 4, 6]);

  let byRating = $derived((() => {
    const m = {};
    skills.forEach(s => {
      const r = s.r || 0;
      if (!m[r]) m[r] = [];
      m[r].push(s.name);
    });
    return m;
  })());
  let pyramidRatings = $derived([4,3,2,1].filter(r => byRating[r] && byRating[r].length));

  const noop = () => {};
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div style="font-size:16px; font-weight:900; color:var(--text); font-family:{CV4_MONO}; line-height:1.1; margin-bottom:4px">{data.name || ''}</div>

    <div style="padding:7px 10px; background:color-mix(in srgb,{catColor} 8%,var(--cv-card-dark,var(--panel))); border:1px solid {catColor}33; border-left:3px solid {catColor}; border-radius:0 2px 2px 0">
      <CvLabel label="HIGH CONCEPT" color={catColor} />
      <p style="margin:0; font-size:12px; font-weight:700; color:var(--text); font-family:{CV4_SANS}; line-height:1.35; font-style:italic">{asp.high_concept || ''}</p>
    </div>

    <div style="padding:7px 10px; background:color-mix(in srgb,var(--c-red,#f87171) 8%,var(--cv-card-dark,var(--panel))); border:1px solid var(--c-red,#f87171)33; border-left:3px solid var(--c-red,#f87171); border-radius:0 2px 2px 0">
      <CvLabel label="TROUBLE" color="var(--c-red,#f87171)" />
      <p style="margin:0; font-size:11px; font-weight:600; color:var(--c-red,#f87171); font-family:{CV4_SANS}; line-height:1.35; font-style:italic">{asp.trouble || ''}</p>
    </div>

    {#if otherAsps.length > 0}
      <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
        <CvLabel label="OTHER ASPECTS" color={catColor} />
        {#each otherAsps as a, i}
          <p style="margin:0; font-size:11px; color:var(--text); font-family:{CV4_SANS}; line-height:1.4; font-style:italic; border-left:2px solid {catColor}44; padding-left:7px; margin-bottom:{i < otherAsps.length - 1 ? 4 : 0}px">{a}</p>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Right column -->
  <div style="width:220px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <!-- Skill pyramid -->
    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <CvLabel label="SKILLS" color={catColor} />
      <div style="display:flex; flex-direction:column; gap:3px; margin-top:3px">
        {#each pyramidRatings as r}
          <div style="display:flex; align-items:baseline; gap:5px">
            <div style="font-size:10px; font-weight:800; color:{catColor}; font-family:{CV4_MONO}; width:52px; flex-shrink:0">+{r} {LADDER[r]}</div>
            <div style="font-size:10px; color:var(--text-dim); font-family:{CV4_SANS}">{byRating[r].join(', ')}</div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Stress tracks (non-interactive for PC reference card) -->
    <div style="display:flex; gap:6px; margin-top:4px">
      <div style="flex:1">
        <StressRow label="PHYS" hits={Array(data.physical_stress || 3).fill(false)} setHits={noop} color={catColor} />
      </div>
      <div style="flex:1">
        <StressRow label="MENT" hits={Array(data.mental_stress || 3).fill(false)} setHits={noop} color={catColor} />
      </div>
    </div>

    <!-- Refresh + consequences -->
    <div style="display:flex; gap:8px; align-items:center; margin-top:4px">
      <div style="text-align:center">
        <CvLabel label="REFRESH" color={catColor} />
        <div style="font-size:18px; font-weight:900; color:{catColor}; font-family:{CV4_MONO}; line-height:1">{String(data.refresh || 3)}</div>
      </div>
      <div style="flex:1">
        <CvLabel label="CONSEQUENCES" color={catColor} />
        <div style="display:flex; flex-direction:column; gap:2px; margin-top:2px">
          {#each consequences as shift, i}
            {@const label = ['Mild','Moderate','Severe'][i] || 'Severe'}
            <div style="display:flex; align-items:center; gap:4px">
              <div style="font-size:9px; font-weight:800; color:var(--text-muted); font-family:{CV4_MONO}; width:52px; flex-shrink:0">{label} (-{shift})</div>
              <div style="flex:1; height:1px; border-bottom:1px dashed var(--border)"></div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Stunts -->
    {#if stunts.length > 0}
      <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
        <CvLabel label="STUNTS" color={catColor} />
        {#each stunts as st, i}
          <div style="margin-bottom:{i < stunts.length - 1 ? 5 : 0}px">
            <div style="font-size:11px; font-weight:700; color:var(--text); font-family:{CV4_SANS}">
              {st.name || ''}{#if st.skill}<span style="color:{catColor}; font-size:10px; font-family:{CV4_MONO}"> [{st.skill}]</span>{/if}
            </div>
            <div style="font-size:10px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.4; margin-top:1px">{st.desc || ''}</div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Session zero questions -->
    {#if Array.isArray(data.questions) && data.questions.length > 0}
      <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
        <CvLabel label="SESSION ZERO QUESTIONS" color={catColor} />
        {#each data.questions as q, i}
          <p style="margin:0; margin-bottom:{i < data.questions.length - 1 ? 4 : 0}px; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.45; padding-left:10px; border-left:2px solid {catColor}44">{q}</p>
        {/each}
      </div>
    {/if}
  </div>
</div>
