<script>
  let { data = {}, campName = '', catColor = 'var(--fs-section)' } = $props();
</script>

<div class="fs-section-gap">
  <div class="fs-stunt" style="border-left:3px solid var(--fs-section); border-radius:0 3px 3px 0; padding:8px 10px">
    <div style="font-size:10px; font-weight:800; letter-spacing:0.12em; color:var(--fs-section); margin-bottom:3px">NEW SCENE ASPECT</div>
    <div style="font-size:13px; font-weight:700; color:var(--fs-text); line-height:1.3; margin-bottom:4px">{data.new_aspect || ''}</div>
    {#if data.type}<span class="fs-skill-badge" style="font-size:9px; padding:2px 8px; text-transform:uppercase">{(data.type || '').toUpperCase()}</span>{/if}
  </div>
</div>

{#if data.arrival}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">ARRIVAL</div>
    <div style="font-size:12px; color:var(--fs-text-dim); line-height:1.4">{data.arrival}</div>
  </div>
{/if}

<div class="fs-section-gap">
  <div class="fs-section-hdr">ENVIRONMENT SHIFT</div>
  <div style="font-size:12px; color:var(--fs-text-dim); line-height:1.4">{data.env || data.environment_shift || ''}</div>
</div>

{#if data.spotlight}
  <div class="fs-section-gap">
    <div class="fs-stunt" style="border-left:3px solid var(--fs-section); border-radius:0 3px 3px 0">
      <div class="fs-stunt-name">SPOTLIGHT</div>
      <div style="font-size:13px; font-weight:700; color:var(--fs-section); text-transform:capitalize">{data.spotlight}</div>
    </div>
  </div>
{/if}
