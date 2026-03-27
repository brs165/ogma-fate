<script>
  let { data = {}, campName = '', catColor = 'var(--fs-section)' } = $props();

  let qs = $derived(Array.isArray(data.questions) ? data.questions : []);
</script>

<div class="fs-section-gap">
  <div class="fs-section-hdr">SESSION ZERO QUESTIONS</div>
  {#each qs as q, i}
    <div style="display:flex; gap:8px; align-items:flex-start; margin-bottom:6px">
      <span class="fs-skill-badge" style="min-width:22px; height:22px; border-radius:50%; font-size:11px">{i+1}</span>
      <div style="font-size:12px; color:var(--fs-text); line-height:1.45">{q}</div>
    </div>
  {/each}
</div>

{#if data.hook}
  <div class="fs-section-gap">
    <div class="fs-stunt" style="border-left:3px solid var(--fs-section); border-radius:0 3px 3px 0">
      <div class="fs-stunt-name">ADVENTURE HOOK</div>
      <div class="fs-stunt-desc" style="font-style:italic">{data.hook}</div>
    </div>
  </div>
{/if}

<div class="fs-stunt">
  <div class="fs-stunt-name">RELATIONSHIP WEB</div>
  <div class="fs-stunt-desc">{data.relationship || 'Each player names two PCs. What do you share? What secret?'}</div>
</div>
