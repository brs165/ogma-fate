<script>
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)' } = $props();

  let scenes = $derived(Array.isArray(data.scenes) ? data.scenes : []);
  let opp = $derived(Array.isArray(data.opposition) ? data.opposition : []);

  const SCENE_COLORS = ['var(--fs-section)', '#b8860b', '#c62828'];

  function truncate(s, max) {
    if (!s) return '';
    return s.length > max ? s.slice(0, max) + '\u2026' : s;
  }
</script>

<!-- Objective + Location -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">OBJECTIVE</div>
  <div style="font-size:13px; font-weight:600; color:var(--fs-text); line-height:1.45">{data.objective || ''}</div>
</div>

<div class="fs-section-gap">
  <div class="fs-section-hdr">LOCATION</div>
  <div style="font-size:12px; color:var(--fs-text-dim); line-height:1.4">{data.location || ''}</div>
</div>

{#if data.issue}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">ISSUE IN PLAY</div>
    <div style="font-size:12px; color:var(--fs-text-dim); font-style:italic; line-height:1.4">{data.issue}</div>
  </div>
{/if}

{#if data.setting_asp}
  <div class="fs-section-gap">
    <div class="fs-stunt">
      <div class="fs-stunt-name">Setting Aspect</div>
      <div class="fs-stunt-desc" style="font-style:italic">{data.setting_asp}</div>
    </div>
  </div>
{/if}

<!-- Complication -->
<div class="fs-section-gap">
  <div class="fs-stunt" style="border-left:3px solid #c62828; border-radius:0 3px 3px 0">
    <div class="fs-stunt-name" style="color:#c62828">COMPLICATION</div>
    <div class="fs-stunt-desc">{data.complication || ''}</div>
  </div>
</div>

<!-- 3-Scene Skeleton -->
<div class="fs-section-gap">
  <OgmaTooltip tip="Three beats: setup, complication, climax. Let players fill the gaps.">
    <div class="fs-section-hdr">3-SCENE SKELETON</div>
  </OgmaTooltip>
  {#each scenes as s, i}
    {@const brief = truncate(s.brief || '', 120)}
    <div class="fs-stunt" style="border-left:3px solid {SCENE_COLORS[i] || 'var(--fs-section)'}; border-radius:0 3px 3px 0">
      <div style="font-size:10px; font-weight:800; letter-spacing:0.12em; color:{SCENE_COLORS[i] || 'var(--fs-section)'}">{s.type || `ACT ${i+1}`}</div>
      <div class="fs-stunt-desc">{brief}</div>
    </div>
  {/each}
</div>

<!-- Twist -->
{#if data.twist}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">TWIST</div>
    <div style="font-size:12px; color:var(--fs-text-dim); font-style:italic; line-height:1.4">{data.twist}</div>
  </div>
{/if}

<!-- Win / Lose -->
{#if data.victory || data.defeat}
  <div style="display:flex; gap:8px; margin-bottom:14px">
    {#if data.victory}
      <div class="fs-stunt" style="flex:1; border-left:3px solid #2e7d32; border-radius:0 3px 3px 0">
        <div class="fs-stunt-name" style="color:#2e7d32">WIN</div>
        <div class="fs-stunt-desc">{data.victory}</div>
      </div>
    {/if}
    {#if data.defeat}
      <div class="fs-stunt" style="flex:1; border-left:3px solid #c62828; border-radius:0 3px 3px 0">
        <div class="fs-stunt-name" style="color:#c62828">LOSE</div>
        <div class="fs-stunt-desc">{data.defeat}</div>
      </div>
    {/if}
  </div>
{/if}

<!-- Opposition -->
{#if opp.length > 0}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">OPPOSITION</div>
    {#each opp.slice(0,2) as o}
      <div style="display:flex; gap:6px; align-items:center; margin-bottom:3px">
        <span class="fs-skill-badge" style="min-width:24px">&times;{o.qty || 1}</span>
        <span style="font-size:12px; color:var(--fs-text-dim)">{o.name || ''}</span>
      </div>
    {/each}
  </div>
{/if}
