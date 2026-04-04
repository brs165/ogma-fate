<script>
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)' } = $props();
</script>

<div class="fs-section-gap">
  <div style="font-size:15px; font-weight:800; color:var(--fs-text); line-height:1.2; margin-bottom:4px">{data.name || data.title || ''}</div>
  <div style="font-size:12px; color:var(--fs-text-dim); line-height:1.4">{data.desc || data.description || ''}</div>
</div>

<div class="fs-section-gap">
  <div class="fs-stunt" style="border-left:3px solid var(--fs-section); border-radius:0 3px 3px 0">
    <OgmaTooltip tip="Primary skill — the PC rolls this skill (4dF + skill rating) to overcome the challenge. Ties count as success at minor cost.">
      <div class="fs-stunt-name" style="cursor:help" tabindex="0">Primary Skill</div>
    </OgmaTooltip>
    <div style="font-size:13px; font-weight:700; color:var(--fs-section)">{data.primary || data.primary_skill || ''}</div>
  </div>
</div>

<div class="fs-section-gap">
  <div class="fs-stunt">
    <OgmaTooltip tip="Opposing force — sets the difficulty. May be a fixed rating (passive opposition) or an NPC rolling against the PC (active opposition).">
      <div class="fs-stunt-name" style="cursor:help" tabindex="0">Opposing Force</div>
    </OgmaTooltip>
    <div class="fs-stunt-desc">{data.opposing || data.opposition_skill || ''}</div>
  </div>
</div>

<div style="display:flex; gap:8px; margin-bottom:14px">
  <div class="fs-stunt" style="flex:1; border-left:3px solid #2e7d32; border-radius:0 3px 3px 0">
    <div class="fs-stunt-name" style="color:#2e7d32">SUCCESS</div>
    <div class="fs-stunt-desc">{data.success || ''}</div>
  </div>
  <div class="fs-stunt" style="flex:1; border-left:3px solid #c62828; border-radius:0 3px 3px 0">
    <div class="fs-stunt-name" style="color:#c62828">FAILURE</div>
    <div class="fs-stunt-desc">{data.failure || ''}</div>
  </div>
</div>

{#if data.stakes_good || data.stakes_bad}
  <div style="display:flex; gap:8px; margin-bottom:14px">
    {#if data.stakes_good}
      <div class="fs-stunt" style="flex:1">
        <div class="fs-stunt-name" style="color:#2e7d32">Stakes Win</div>
        <div class="fs-stunt-desc">{data.stakes_good}</div>
      </div>
    {/if}
    {#if data.stakes_bad}
      <div class="fs-stunt" style="flex:1">
        <div class="fs-stunt-name" style="color:#c62828">Stakes Lose</div>
        <div class="fs-stunt-desc">{data.stakes_bad}</div>
      </div>
    {/if}
  </div>
{/if}
