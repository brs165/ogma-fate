<script>
  let { data = {}, campName = '', catColor = 'var(--fs-section)' } = $props();

  let face = $derived(data.face || {});
  let fn_ = $derived(typeof face === 'string' ? face : (face.name || ''));
  let fr = $derived(typeof face === 'string' ? '' : (face.role || ''));
</script>

<div class="fs-section-gap">
  <div class="fs-section-hdr">GOAL</div>
  <div style="font-size:13px; color:var(--fs-text); line-height:1.45">{data.goal || ''}</div>
</div>

<div class="fs-section-gap">
  <div class="fs-section-hdr">METHOD</div>
  <div style="font-size:12px; color:var(--fs-text-dim); font-style:italic; line-height:1.45">{data.method || ''}</div>
</div>

<div class="fs-section-gap">
  <div class="fs-stunt" style="border-left:3px solid #c62828; border-radius:0 3px 3px 0">
    <div class="fs-stunt-name" style="color:#c62828">WEAKNESS</div>
    <div class="fs-stunt-desc">{data.weakness || ''}</div>
  </div>
</div>

{#if fn_}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">THE FACE</div>
    <div class="fs-stunt" style="border-left:3px solid var(--fs-badge-bg, var(--fs-section)); border-radius:0 3px 3px 0">
      <div style="font-size:13px; font-weight:700; color:var(--fs-text)">{fn_}</div>
      {#if fr}<div class="fs-stunt-desc" style="font-style:italic">{fr}</div>{/if}
    </div>
  </div>
{/if}

<div class="fs-stunt">
  <div class="fs-stunt-desc" style="text-align:center">Goal + Method = two sides of one faction aspect</div>
</div>
