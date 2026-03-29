<script>
  import { Checkbox } from 'bits-ui';
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  const LADDER = {8:"Legendary",7:"Epic",6:"Fantastic",5:"Superb",4:"Great",3:"Good",2:"Fair",1:"Average",0:"Mediocre"};

  let opp = $derived(Array.isArray(data.opposition) ? data.opposition : []);
  let scAspects = $derived(Array.isArray(data.aspects) ? data.aspects : []);
  let zones = $derived(Array.isArray(data.zones) ? data.zones : []);

  function aspName(a) { return typeof a === 'string' ? a : (a.name || ''); }
  function zoneName(z) { return typeof z === 'string' ? z : (z.name || ''); }
  function zoneAsp(z) { return typeof z === 'object' ? (z.aspect || '') : ''; }

  // Per-opponent stress tracking
  let oppStress = $derived(cardState?.oppStress || {});
  function toggleHit(oppName, i) {
    const key = oppName + '_' + i;
    const updated = { ...oppStress, [key]: !oppStress[key] };
    onUpdate({ oppStress: updated });
  }
  function isHit(oppName, i) { return !!(oppStress[(oppName + '_' + i)]); }
</script>

<!-- Scene Aspects -->
{#if scAspects.length > 0}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">SCENE</div>
    {#each scAspects.slice(0,3) as a}
      <div class="fs-aspect-val">{aspName(a)}</div>
    {/each}
  </div>
{/if}

<!-- Opposition -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">OPPOSITION</div>
  {#each opp as o}
    {@const isMajor = (o.type || '').toLowerCase() === 'major'}
    {@const oAspects = Array.isArray(o.aspects) ? o.aspects : []}
    {@const stressCount = o.stress || 2}
    <div class="fs-stunt" style="border-left:3px solid {isMajor ? 'var(--fs-con-sev)' : 'var(--fs-border-mid)'}; border-radius:0 3px 3px 0; padding:8px 10px">
      <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px">
        <span style="font-size:9px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:{isMajor ? 'var(--fs-con-sev)' : 'var(--fs-text-muted)'}; padding:1px 6px; border-radius:2px">{(o.type||'').toUpperCase()} ×{o.qty||1}</span>
        <span style="font-size:12px; font-weight:700; color:var(--fs-text)">{o.name || ''}</span>
      </div>
      <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:4px">
        {#each (o.skills||[]).slice(0,3) as s}
          <div class="fs-skill-row" style="margin-bottom:0">
            <span class="fs-skill-badge">+{s.r}</span>
            <span class="fs-skill-name" style="font-size:11px">{s.name}</span>
          </div>
        {/each}
      </div>
      {#if oAspects.length > 0}
        {#each oAspects.slice(0,2) as a}
          <div style="font-size:11px; font-style:italic; color:var(--fs-text-muted)">"{a}"</div>
        {/each}
      {/if}
      {#if o.stunt}<div style="font-size:11px; color:var(--fs-section); margin-top:2px"><i class="fa-solid fa-star" aria-hidden="true" style="font-size:8px"></i> {o.stunt}</div>{/if}
      <!-- Interactive stress boxes -->
      <div class="fs-stress-boxes" style="margin-top:6px" role="group" aria-label="{o.name} stress track">
        {#each Array.from({length: stressCount}) as _, i}
          {@const hit = isHit(o.name, i)}
          <Checkbox.Root
            checked={hit}
            onCheckedChange={() => toggleHit(o.name, i)}
            aria-label="Stress box {i+1}{hit ? ' (hit)' : ' (clear)'}"
            style="border-color:var(--fs-stress-phy); background:{hit ? 'var(--fs-stress-phy)' : 'transparent'}; color:{hit ? '#fff' : 'var(--fs-stress-phy)'};"
          >
            <Checkbox.Indicator>
              {#if hit}<i class="fa-solid fa-xmark" aria-hidden="true"></i>{/if}
            </Checkbox.Indicator>
          </Checkbox.Root>
        {/each}
      </div>
    </div>
  {/each}
</div>

<!-- Win / Lose -->
<div style="display:flex; gap:8px; margin-bottom:14px">
  <div class="fs-stunt" style="flex:1; border-left:3px solid #2e7d32; border-radius:0 3px 3px 0">
    <OgmaTooltip tip="Declare before the first roll. What the PCs achieve on victory.">
      <div class="fs-stunt-name" style="color:#2e7d32">WIN</div>
    </OgmaTooltip>
    <div class="fs-stunt-desc">{data.victory || ''}</div>
  </div>
  <div class="fs-stunt" style="flex:1; border-left:3px solid #c62828; border-radius:0 3px 3px 0">
    <OgmaTooltip tip="Declare before the first roll. What happens if the PCs are defeated or concede.">
      <div class="fs-stunt-name" style="color:#c62828">LOSE</div>
    </OgmaTooltip>
    <div class="fs-stunt-desc">{data.defeat || ''}</div>
  </div>
</div>

<!-- Twist + Zones + GM FP -->
<div style="display:flex; gap:14px">
  <div style="flex:1">
    {#if data.twist}
      <div class="fs-section-hdr">TWIST</div>
      <div style="font-size:12px; color:var(--fs-text-dim); font-style:italic; line-height:1.4; margin-bottom:10px">{data.twist}</div>
    {/if}
    {#if zones.length > 0}
      <div class="fs-section-hdr">ZONES</div>
      {#each zones.slice(0,3) as z}
        <div class="fs-stunt" style="border-left:3px solid var(--fs-badge-bg, var(--fs-section)); border-radius:0 3px 3px 0">
          <div style="font-size:11px; font-weight:700; color:var(--fs-text)">{zoneName(z)}</div>
          {#if zoneAsp(z)}<div style="font-size:11px; color:var(--fs-section); font-style:italic">{zoneAsp(z)}</div>{/if}
        </div>
      {/each}
    {/if}
  </div>
  {#if data.gm_fate_points}
    <div style="text-align:center; flex-shrink:0; width:60px">
      <OgmaTooltip tip="GM fate points: 1 per PC. Spend to invoke scene aspects against PCs or activate NPC stunts.">
        <div class="fs-section-hdr">GM FP</div>
      </OgmaTooltip>
      <div style="font-size:28px; font-weight:800; color:var(--fs-text); line-height:1">{data.gm_fate_points}</div>
    </div>
  {/if}
</div>
