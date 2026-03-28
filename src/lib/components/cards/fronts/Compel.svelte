<script>
  let { data = {}, campName = '', catColor = 'var(--fs-section)' } = $props();
</script>

<div class="fs-section-gap compel-result-appear">
  <div class="fs-stunt" style="border-left:3px solid var(--fs-section); border-radius:0 3px 3px 0; padding:8px 10px">
    <div style="font-size:10px; font-weight:800; letter-spacing:0.12em; color:var(--fs-section); margin-bottom:2px">SITUATION</div>
    <div style="font-size:13px; font-weight:700; color:var(--fs-text); line-height:1.35">{data.situation || ''}</div>
  </div>
</div>

<div class="fs-section-gap">
  <div class="fs-section-hdr">IF ACCEPTED</div>
  <div style="font-size:12px; color:var(--fs-text-dim); font-style:italic; line-height:1.4">{data.consequence || data.complication || ''}</div>
</div>

<div style="display:flex; gap:10px; margin-bottom:14px">
  <div style="flex-shrink:0">
    <div class="fs-section-hdr">TYPE</div>
    <span class="fs-skill-badge" style="font-size:12px; padding:3px 10px; text-transform:uppercase">{data.template_type || 'event'}</span>
  </div>
  <div style="flex:1">
    <div class="fs-section-hdr">PLAYER CHOICE</div>
    <div style="font-size:12px; color:var(--fs-text-dim); line-height:1.4">Accept for 1 FP — or refuse by spending 1 FP</div>
  </div>
</div>

{#if data.template}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">TEMPLATE</div>
    <div style="font-size:12px; color:var(--fs-text-muted); font-style:italic; line-height:1.5">{data.template}</div>
  </div>
{/if}
