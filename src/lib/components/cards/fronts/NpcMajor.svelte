<script>
  import CvLabel from '../CvLabel.svelte';
  import StressRow from '../StressRow.svelte';
  let { data = {}, campName = '', catColor = 'var(--accent)', cardState = {}, onUpdate = () => {} } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  let asp = $derived(data.aspects || {});
  let skills = $derived(Array.isArray(data.skills) ? data.skills : []);
  let stunts = $derived(Array.isArray(data.stunts) ? data.stunts : []);
  let others = $derived(Array.isArray(asp.others) ? asp.others : []);
  let phyHits = $derived(cardState?.phyHit ?? Array(data.physical_stress || 3).fill(false));
  let menHits = $derived(cardState?.menHit ?? Array(data.mental_stress  || 3).fill(false));

  function setPhy(a) { onUpdate({ phyHit: a }); }
  function setMen(a) { onUpdate({ menHit: a }); }

  const CONS = [
    { label: 'Mild',     color: 'var(--c-blue,#60a5fa)',  shifts: 2 },
    { label: 'Moderate', color: 'var(--gold,#fbbf24)',     shifts: 4 },
    { label: 'Severe',   color: 'var(--c-red,#f87171)',    shifts: 6 },
  ];

  function spillColor(r) {
    return r >= 4 ? 'var(--c-red,#E06060)' : r >= 3 ? 'var(--gold,#C8A050)' : r >= 2 ? 'var(--c-blue,#5AC8FA)' : 'var(--text-muted)';
  }
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div style="font-size:15px; font-weight:800; color:var(--text); font-family:{CV4_MONO}; line-height:1.1; letter-spacing:-0.02em">{data.name || ''}</div>

    {#if asp.high_concept}
      <div style="padding:4px 9px; background:color-mix(in srgb,{catColor} 12%,var(--inset)); border:1px solid {catColor}55; border-radius:4px; font-size:11px; color:{catColor}; font-style:italic; font-family:{CV4_SANS}; font-weight:600">
        <span style="font-size:10px; font-weight:800; font-style:normal; letter-spacing:0.15em; margin-right:5px; font-family:{CV4_MONO}">HC </span>{asp.high_concept}
      </div>
    {/if}

    {#if asp.trouble}
      <div style="padding:4px 9px; background:color-mix(in srgb,var(--c-red,#f87171) 10%,var(--inset)); border:1px solid rgba(248,113,113,0.33); border-radius:4px; font-size:11px; color:var(--text-dim); font-style:italic; font-family:{CV4_SANS}">
        <span style="font-size:10px; font-weight:800; font-style:normal; letter-spacing:0.15em; margin-right:5px; font-family:{CV4_MONO}; color:var(--c-red,#f87171)">TR </span>{asp.trouble}
      </div>
    {/if}

    {#if others.length > 0}
      <div style="display:flex; flex-direction:column; gap:3px">
        {#each others as a}
          <div style="padding:3px 9px; border-radius:4px; font-size:11px; font-style:italic; font-family:{CV4_SANS}; background:var(--inset); border:1px solid var(--border); color:var(--text-dim)">{a}</div>
        {/each}
      </div>
    {/if}

    {#if stunts.length > 0}
      <div style="display:flex; flex-direction:column; gap:4px">
        {#each stunts as s}
          <div style="padding:4px 8px; background:var(--inset); border:1px solid var(--border); border-left:2px solid {catColor}; border-radius:0 4px 4px 0">
            <span style="font-size:11px; font-weight:700; color:{catColor}; font-family:{CV4_SANS}">{s.name}{s.skill ? ` (${s.skill})` : ''}: </span>
            <span style="font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}">{s.desc || s}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Right column -->
  <div style="width:180px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <div>
      <CvLabel label="SKILLS" color={catColor} />
      <div style="display:flex; flex-direction:column; gap:3px">
        {#each skills as s}
          <div style="display:flex; align-items:center; gap:5px">
            <div style="font-size:11px; font-weight:800; color:var(--cv-card-dark,#1A1610); background:{spillColor(s.r)}; font-family:{CV4_MONO}; line-height:1; min-width:26px; text-align:center; padding:2px 5px; border-radius:2px">+{s.r}</div>
            <div style="font-size:12px; color:var(--cv-card-text-dim); font-family:{CV4_SANS}; font-style:italic">{s.name}</div>
          </div>
        {/each}
      </div>
    </div>

    <div style="display:flex; flex-direction:column; gap:5px">
      <StressRow label="PHY" hits={phyHits.length ? phyHits : Array(data.physical_stress||3).fill(false)} setHits={setPhy} color="var(--gold,#fbbf24)" />
      <StressRow label="MEN" hits={menHits.length ? menHits : Array(data.mental_stress||3).fill(false)} setHits={setMen} color="var(--c-purple,#a78bfa)" />
      <div style="font-size:9px; color:var(--text-muted); font-family:var(--font-ui); line-height:1.3; margin-top:1px; font-style:italic">Stress ≠ HP — clears end of scene. Physique/Will ≥3 → 6 boxes.</div>

      <div style="display:flex; flex-direction:column; gap:3px">
        <CvLabel label="CONSEQUENCES" color={catColor} />
        {#each CONS as row}
          <div style="display:flex; align-items:center; gap:5px; padding:2px 0">
            <div style="width:18px; height:18px; border-radius:3px; border:1.5px solid {row.color}; flex-shrink:0"></div>
            <div style="font-size:10px; font-weight:700; color:{row.color}; font-family:{CV4_MONO}; width:54px">{row.label}</div>
            <div style="font-size:10px; color:var(--text-muted); font-family:{CV4_SANS}">{row.shifts} shifts</div>
          </div>
        {/each}
      </div>

      <div>
        <CvLabel label="REF" color={catColor} />
        <div style="font-size:20px; font-weight:800; color:var(--text); line-height:1; font-family:{CV4_MONO}">{data.refresh || 3}</div>
      </div>
    </div>
  </div>
</div>
