<script>
  let { data = {}, campName = '', catColor = 'var(--fs-section)' } = $props();

  let cur = $derived(data.current || {});
  let imp = $derived(data.impending || {});
  let curFaces = $derived(Array.isArray(cur.faces) ? cur.faces : []);
  let impFaces = $derived(Array.isArray(imp.faces) ? imp.faces : []);
  let setting = $derived(Array.isArray(data.setting) ? data.setting : []);
  let curPlaces = $derived(Array.isArray(cur.places) ? cur.places : []);
</script>

<!-- Current Issue -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">CURRENT ISSUE</div>
  <div style="font-size:13px; font-weight:700; color:var(--fs-text); line-height:1.3; margin-bottom:3px">{cur.name || ''}</div>
  {#if cur.desc}<div style="font-size:12px; color:var(--fs-text-dim); line-height:1.5">{cur.desc}</div>{/if}
  {#if curFaces.length > 0}
    <div style="display:flex; flex-direction:column; gap:3px; margin-top:6px">
      {#each curFaces as f}
        <div class="fs-stunt">
          <span class="fs-stunt-name">{f.name}: </span>
          <span class="fs-stunt-desc" style="display:inline; font-style:italic">{f.role}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Impending Issue -->
<div class="fs-section-gap">
  <div class="fs-stunt" style="border-left:3px solid #c62828; border-radius:0 3px 3px 0">
    <div style="font-size:10px; font-weight:800; letter-spacing:0.12em; color:#c62828; margin-bottom:2px">IMPENDING</div>
    <div style="font-size:13px; font-weight:700; color:#c62828; line-height:1.3">{imp.name || ''}</div>
    {#if imp.desc}<div class="fs-stunt-desc" style="font-style:italic">{imp.desc}</div>{/if}
  </div>
  {#if impFaces.length > 0}
    <div style="display:flex; flex-direction:column; gap:3px; margin-top:4px">
      {#each impFaces as f}
        <div class="fs-stunt">
          <span style="font-size:12px; font-weight:700; color:#c62828">{f.name}: </span>
          <span class="fs-stunt-desc" style="display:inline; font-style:italic">{f.role}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Setting Aspects -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">SETTING ASPECTS</div>
  {#each setting as s}
    <div class="fs-aspect-val">"{s}"</div>
  {/each}
</div>

<!-- Places -->
{#if curPlaces.length > 0}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">PLACES</div>
    {#each curPlaces as p}
      <div style="font-size:12px; color:var(--fs-text-dim); padding:1px 0"><i class="fa-solid fa-circle" aria-hidden="true" style="font-size:4px; vertical-align:middle; margin-right:6px; color:var(--fs-section)"></i>{p}</div>
    {/each}
  </div>
{/if}
