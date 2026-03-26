<script>
  import CvLabel from '../CvLabel.svelte';
  let { data = {}, campName = '', catColor = 'var(--accent)' } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  let opp = $derived(Array.isArray(data.opposition) ? data.opposition : []);
  let scAspects = $derived(Array.isArray(data.aspects)    ? data.aspects    : []);
  let zones = $derived(Array.isArray(data.zones)      ? data.zones      : []);

  function spillColor(r) {
    return r >= 4 ? 'var(--c-red,#E06060)' : r >= 3 ? 'var(--gold,#C8A050)' : r >= 2 ? 'var(--c-blue,#5AC8FA)' : 'var(--text-muted)';
  }
  function aspName(a) { return typeof a === 'string' ? a : (a.name || ''); }
  function zoneName(z) { return typeof z === 'string' ? z : (z.name || ''); }
  function zoneAsp(z)  { return typeof z === 'object' ? (z.aspect || '') : ''; }
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    {#if scAspects.length > 0}
      <div>
        <CvLabel label="SCENE" color={catColor} />
        <div style="display:flex; flex-direction:column; gap:3px">
          {#each scAspects.slice(0,3) as a}
            <div style="padding:2px 7px; background:var(--inset); border:1px solid var(--border); border-radius:3px; font-size:11px; font-style:italic; color:var(--text-dim); font-family:{CV4_SANS}">{aspName(a)}</div>
          {/each}
        </div>
      </div>
    {/if}

    <CvLabel label="OPPOSITION" color={catColor} />
    {#each opp as o}
      {@const isMajor = (o.type || '').toLowerCase() === 'major'}
      {@const oAspects = Array.isArray(o.aspects) ? o.aspects : []}
      <div style="background:var(--inset); border:1px solid {isMajor ? catColor+'55' : 'var(--border)'}; border-radius:5px; overflow:hidden; margin-bottom:4px">
        <div style="display:flex">
          <div style="padding:5px 8px; background:{isMajor ? catColor : 'var(--panel)'}; display:flex; flex-direction:column; align-items:center; justify-content:center; min-width:42px; flex-shrink:0">
            <div style="font-size:10px; font-weight:700; color:{isMajor ? '#0d1117' : 'var(--text-muted)'}; letter-spacing:0.1em; font-family:{CV4_MONO}">{(o.type || '').toUpperCase()}</div>
            <div style="font-size:13px; font-weight:700; color:{isMajor ? '#0d1117' : 'var(--text)'}; font-family:{CV4_MONO}">×{o.qty || 1}</div>
          </div>
          <div style="flex:1; padding:5px 8px">
            <div style="font-size:11px; font-weight:700; color:var(--text); font-family:{CV4_SANS}; margin-bottom:3px">{o.name || ''}</div>
            <div style="display:flex; gap:7px; flex-wrap:wrap; margin-bottom:{oAspects.length ? 3 : 0}px">
              {#each (o.skills || []).slice(0,3) as s}
                <div style="display:flex; align-items:center; gap:5px">
                  <div style="font-size:11px; font-weight:800; color:var(--cv-card-dark,#1A1610); background:{spillColor(s.r)}; font-family:{CV4_MONO}; line-height:1; min-width:26px; text-align:center; padding:2px 5px; border-radius:2px">+{s.r}</div>
                  <div style="font-size:12px; color:var(--cv-card-text-dim); font-family:{CV4_SANS}; font-style:italic">{s.name}</div>
                </div>
              {/each}
            </div>
            {#if oAspects.length > 0}
              <div style="display:flex; flex-direction:column; gap:2px">
                {#each oAspects.slice(0,2) as a}
                  <div style="font-size:10px; font-style:italic; color:var(--text-muted); font-family:{CV4_SANS}">"{a}"</div>
                {/each}
              </div>
            {/if}
            {#if o.stunt}<div style="font-size:10px; color:{catColor}; font-family:{CV4_SANS}; margin-top:2px; font-style:italic">★ {o.stunt}</div>{/if}
          </div>
          <div style="padding:5px 8px 5px 0; display:flex; gap:2px; align-items:center; flex-shrink:0">
            {#each Array.from({length: o.stress || 2}) as _}
              <div style="width:9px; height:9px; border:1.5px solid {isMajor ? catColor : 'var(--text-muted)'}; border-radius:1px; flex-shrink:0"></div>
            {/each}
          </div>
        </div>
      </div>
    {/each}

    <div style="display:flex; gap:6px">
      <div style="flex:1; padding:4px 7px; background:color-mix(in srgb,var(--c-green,#34d399) 10%,var(--inset)); border:1px solid rgba(52,211,153,0.3); border-left:2px solid var(--c-green,#34d399); border-radius:0 3px 3px 0">
        <CvLabel label="WIN" color="var(--c-green,#34d399)" />
        <p style="margin:0; font-size:11px; color:var(--c-green,#34d399); font-family:{CV4_SANS}; line-height:1.3">{data.victory || ''}</p>
      </div>
      <div style="flex:1; padding:4px 7px; background:color-mix(in srgb,var(--c-red,#f87171) 10%,var(--inset)); border:1px solid rgba(248,113,113,0.3); border-left:2px solid var(--c-red,#f87171); border-radius:0 3px 3px 0">
        <CvLabel label="LOSE" color="var(--c-red,#f87171)" />
        <p style="margin:0; font-size:11px; color:var(--c-red,#f87171); font-family:{CV4_SANS}; line-height:1.3">{data.defeat || ''}</p>
      </div>
    </div>
  </div>

  <!-- Right column -->
  <div style="width:130px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <div>
      <CvLabel label="TWIST" color={catColor} />
      <p style="margin:0; font-size:11px; color:var(--text-dim); font-style:italic; font-family:{CV4_SANS}; line-height:1.4">{data.twist || ''}</p>
    </div>

    {#if zones.length > 0}
      <div>
        <CvLabel label="ZONES" color={catColor} />
        {#each zones.slice(0,3) as z}
          <div style="margin-bottom:3px; padding:3px 7px; background:var(--inset); border-left:2px solid {catColor}66; border-radius:0 3px 3px 0">
            <div style="font-size:10px; font-weight:700; color:var(--text); font-family:{CV4_SANS}">{zoneName(z)}</div>
            {#if zoneAsp(z)}<div style="font-size:10px; color:var(--text-muted); font-style:italic; font-family:{CV4_SANS}">{zoneAsp(z)}</div>{/if}
          </div>
        {/each}
      </div>
    {/if}

    <div>
      <CvLabel label="GM FP" color={catColor} />
      <div style="font-size:28px; font-weight:800; color:var(--text); line-height:1; font-family:{CV4_MONO}">{data.gm_fate_points || ''}</div>
    </div>
  </div>
</div>
