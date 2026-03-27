<script>
  import CvLabel from '../CvLabel.svelte';
  import StressRow from '../StressRow.svelte';

  export let data = {};
  export let campName = '';
  export let catColor = 'var(--accent)';
  export let cardState = {};
  export let onUpdate = () => {};

  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  $: aspects = Array.isArray(data.aspects) ? data.aspects : [];
  $: skills  = Array.isArray(data.skills)  ? data.skills  : [];
  $: stunt   = data.stunt || null;
  $: stress  = data.stress || 1;
  $: hits    = cardState?.phyHit ?? Array(stress).fill(false);

  function setHits(a) { onUpdate({ phyHit: a }); }

  function spillColor(r) {
    return r >= 4 ? 'var(--c-red,#E06060)' : r >= 3 ? 'var(--gold,#C8A050)' : r >= 2 ? 'var(--c-blue,#5AC8FA)' : 'var(--text-muted)';
  }
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div style="font-size:17px; font-weight:800; color:var(--text); font-family:{CV4_MONO}; line-height:1.1; letter-spacing:-0.02em">{data.name || ''}</div>

    {#each aspects as a, i}
      <div style="padding:4px 9px; border-radius:4px; font-size:11px; font-style:italic; font-family:{CV4_SANS}; background:{i===0 ? `color-mix(in srgb,${catColor} 12%,var(--inset))` : 'var(--inset)'}; border:1px solid {i===0 ? catColor+'66' : 'var(--border)'}; color:{i===0 ? catColor : 'var(--text-dim)'}; font-weight:{i===0 ? 600 : 400}">
        {#if i === 0}<span style="font-size:10px; font-weight:800; font-style:normal; letter-spacing:0.15em; margin-right:5px; font-family:{CV4_MONO}; color:{catColor}">HC </span>{/if}{a}
      </div>
    {/each}

    {#if stunt}
      <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
        <span style="font-size:11px; font-weight:700; color:{catColor}; font-family:{CV4_SANS}">{stunt.name}: </span>
        <span style="font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}">{stunt.desc || ''}</span>
      </div>
    {/if}
  </div>

  <!-- Right column -->
  <div style="width:114px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    {#if skills.length > 0}
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
    {/if}

    <StressRow label="STRESS" hits={hits.length ? hits : Array(stress).fill(false)} {setHits} color={catColor} />

    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <div style="font-size:11px; color:var(--text-muted); font-family:{CV4_SANS}; line-height:1.5">No consequences</div>
      <div style="font-size:11px; color:var(--text-muted); font-family:{CV4_SANS}">One hit = out</div>
    </div>
  </div>
</div>
