<script>
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  const LADDER = {8:"Legendary",7:"Epic",6:"Fantastic",5:"Superb",4:"Great",3:"Good",2:"Fair",1:"Average",0:"Mediocre"};

  let zones = $derived(Array.isArray(data.zones) ? data.zones : []);
  let discovery = $derived(data.hiddenDiscovery || null);
  let revealed = $derived(cardState?.discoveryRevealed ?? false);

  function toggleReveal() { onUpdate({ discoveryRevealed: !revealed }); }
</script>

<!-- Description -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">DESCRIPTION</div>
  <p style="margin:0; font-size:12px; color:var(--fs-text); line-height:1.5; font-style:italic">
    {data.description || ''}
  </p>
</div>

<!-- Zones -->
{#if zones.length > 0}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">ZONES</div>
    {#each zones as z}
      <OgmaTooltip tip="Zone: {z.name || ''}. Moving between adjacent zones is free unless impeded.">
        <div class="fs-stunt" style="border-left:3px solid var(--fs-badge-bg, var(--fs-section)); border-radius:0 3px 3px 0; cursor:default">
          <div style="font-size:12px; font-weight:700; color:var(--fs-text); line-height:1.2">{z.name || ''}</div>
          {#if z.aspect}<div style="font-size:12px; color:var(--fs-section); font-style:italic">{z.aspect}</div>{/if}
          {#if z.description}<div style="font-size:11px; color:var(--fs-text-muted); line-height:1.35; margin-top:2px">{z.description}</div>{/if}
        </div>
      </OgmaTooltip>
    {/each}
  </div>
{/if}

<!-- Hidden Discovery -->
{#if discovery}
  <div class="fs-section-gap">
    <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px">
      <OgmaTooltip tip="Hidden aspect — only visible to the GM until discovered by players.">
        <div class="fs-section-hdr" style="color:var(--asp-hidden, #78909C); margin-bottom:0">
          <i class="fa-solid fa-eye-slash" aria-hidden="true" style="font-size:9px; margin-right:4px"></i>HIDDEN DISCOVERY
        </div>
      </OgmaTooltip>
      <button
        class="fi-badge-btn"
        onclick={(e) => { e.stopPropagation(); toggleReveal(); }}
        aria-label="{revealed ? 'Hide discovery' : 'Reveal discovery'}"
        aria-pressed={String(revealed)}
      >
        <span style="font-size:9px; font-weight:800; color:#fff; font-style:normal; background:{revealed ? '#2e7d32' : '#78909C'}; padding:1px 6px; border-radius:3px">
          {revealed ? 'REVEALED' : 'HIDDEN'}
        </span>
      </button>
    </div>
    <div style="opacity:{revealed ? 1 : 0.6}; transition:opacity 0.2s ease">
      <div style="font-size:13px; color:var(--fs-text); font-style:italic; font-weight:500; margin-bottom:4px">
        "{discovery.name}"
      </div>
      <div style="font-size:11px; color:var(--fs-text-muted); line-height:1.4">
        <span style="font-weight:600">Discover:</span> {discovery.discoverSkill} at +{discovery.difficulty} ({LADDER[discovery.difficulty] || ''})
      </div>
    </div>
  </div>
{/if}
