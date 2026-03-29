<script>
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)' } = $props();
  // constraint_type: 'limitation' | 'resistance'
  let isLimitation = $derived((data.constraint_type || '') === 'limitation');
  let actionLabel  = $derived(isLimitation ? 'RESTRICTED ACTION' : 'WHAT IT RESISTS');
  let actionText   = $derived(data.what_resists || data.restricted_action || data.what || '');
</script>

<div style="display:flex; gap:14px">
  <div style="flex:1; min-width:0">
    <div class="fs-section-gap">
      <div class="fs-stunt" style="border-left:3px solid var(--fs-section); border-radius:0 3px 3px 0; padding:8px 10px">
        <div style="font-size:10px; font-weight:800; letter-spacing:0.12em; color:var(--fs-section); margin-bottom:3px">{actionLabel}</div>
        <div style="font-size:13px; font-weight:600; color:var(--fs-text); line-height:1.35">{actionText}</div>
      </div>
    </div>

    {#if isLimitation && data.consequence}
      <div class="fs-section-gap">
        <div class="fs-stunt" style="border-left:3px solid #c62828; border-radius:0 3px 3px 0">
          <div class="fs-stunt-name" style="color:#c62828">IF VIOLATED</div>
          <div class="fs-stunt-desc">{data.consequence}</div>
        </div>
      </div>
    {/if}

    {#if data.bypass}
      <div class="fs-section-gap">
        <div class="fs-stunt" style="border-left:3px solid #2e7d32; border-radius:0 3px 3px 0">
          <div class="fs-stunt-name" style="color:#2e7d32">HOW TO BYPASS</div>
          <div class="fs-stunt-desc">{data.bypass}</div>
        </div>
      </div>
    {/if}
  </div>

  <div style="width:100px; flex-shrink:0; text-align:center">
    <div style="font-size:10px; font-weight:800; letter-spacing:0.12em; color:var(--fs-section); margin-bottom:6px">TYPE</div>
    <OgmaTooltip tip={isLimitation ? 'Limitation: restricts a specific action. Forces the party to find another approach.' : 'Resistance: protects against a type of action. Cannot be overcome by rolling higher.'}>
      <span class="fs-skill-badge" style="font-size:12px; padding:4px 12px; text-transform:capitalize">{data.constraint_type || ''}</span>
    </OgmaTooltip>
    {#if data.gm_note}
      <div class="fs-stunt" style="margin-top:10px; text-align:left">
        <div class="fs-stunt-name">GM NOTE</div>
        <div class="fs-stunt-desc">{data.gm_note}</div>
      </div>
    {:else}
      <div style="font-size:11px; color:var(--fs-text-muted); margin-top:10px; line-height:1.4">Forces a new approach — not higher rolls</div>
    {/if}
  </div>
</div>
