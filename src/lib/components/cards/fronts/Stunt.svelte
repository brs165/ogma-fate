<script>
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  const TYPE_LABEL = { bonus: '+2 Bonus', special: 'Rule Exception', once: 'Once Per Scene' };
  let typeLabel = $derived(TYPE_LABEL[data.type] || (data.type || 'Bonus'));
  let typeColor = $derived(data.type === 'special' || data.type === 'once' ? 'var(--c-purple,#a78bfa)' : 'var(--accent)');
</script>

<!-- Stunt name & skill -->
<div class="fs-section-gap">
  <div class="fs-stunt" style="border-left:4px solid {typeColor}; border-radius:0 3px 3px 0; padding:10px 12px">
    <div style="font-size:10px; font-weight:800; letter-spacing:0.12em; color:{typeColor}; margin-bottom:3px">STUNT</div>
    <div style="font-size:15px; font-weight:800; color:var(--fs-text); line-height:1.2">{data.name || ''}</div>
    {#if data.skill && data.skill !== 'varies'}
      <div style="font-size:11px; color:var(--fs-text-muted); margin-top:4px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em">{data.skill}</div>
    {/if}
  </div>
</div>

<!-- Effect description -->
<div class="fs-section-gap">
  <OgmaTooltip tip="What the stunt lets you do. Must be conditional — a narrow circumstance, not a blanket bonus.">
    <div class="fs-section-hdr">EFFECT</div>
  </OgmaTooltip>
  <div style="font-size:13px; color:var(--fs-text); line-height:1.5">{data.desc || ''}</div>
</div>

<!-- Type badge -->
<div class="fs-section-gap">
  <OgmaTooltip tip="Bonus: +2 to a specific roll in a specific situation. Special: replaces the +2 with a unique rule exception.">
    <div class="fs-section-hdr">TYPE</div>
  </OgmaTooltip>
  <div style="display:inline-flex; align-items:center; gap:6px; padding:3px 10px; border-radius:4px; background:color-mix(in srgb,{typeColor} 12%,transparent); border:1px solid color-mix(in srgb,{typeColor} 30%,transparent)">
    <span style="font-size:11px; font-weight:700; color:{typeColor}; letter-spacing:0.06em">{typeLabel}</span>
  </div>
</div>

{#if data.tags && data.tags.length}
<!-- Tags -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">TAGS</div>
  <div style="display:flex; gap:4px; flex-wrap:wrap">
    {#each data.tags as tag}
      <span style="font-size:10px; font-weight:600; padding:2px 7px; border-radius:3px; background:var(--fs-inset,var(--inset)); border:1px solid var(--fs-border,var(--border)); color:var(--fs-text-muted); letter-spacing:0.04em; text-transform:uppercase">{tag}</span>
    {/each}
  </div>
</div>
{/if}
