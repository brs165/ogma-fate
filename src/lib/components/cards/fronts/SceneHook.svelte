<script>
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  const CC = {
    danger: '#c62828', cover: '#1565c0', tone: '#b8860b', movement: '#2e7d32', usable: '#7b1fa2',
  };
  const CAT_TIPS = {
    danger: 'Danger — active threat. Invoke against PCs, compel as collateral.',
    cover: 'Cover — provides defensive advantage. +2 when behind it.',
    tone: 'Tone — sets mood and stakes. Invoke for roleplaying bonuses.',
    movement: 'Movement — affects zone traversal. Invoke for extra distance.',
    usable: 'Usable — exploitable object or element. Invoke for creative advantage.',
  };

  let aspectColor = $derived(CC[data.aspectType] || '#b8860b');
  let compels = $derived(Array.isArray(data.compels) ? data.compels : []);
</script>

<!-- Scene Aspect -->
<div class="fs-section-gap">
  <div class="fs-section-hdr">SCENE ASPECT</div>
  <div style="display:flex; gap:8px; align-items:flex-start; margin-bottom:8px">
    <OgmaTooltip tip={CAT_TIPS[data.aspectType] || 'Scene aspect'}>
      <span style="display:inline-flex; align-items:center; padding:2px 8px; border-radius:3px; min-width:56px; text-align:center; background:{aspectColor}; color:#fff; font-size:9px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; flex-shrink:0" tabindex="0">{data.aspectType || 'tone'}</span>
    </OgmaTooltip>
    <div style="font-size:14px; color:var(--fs-text); font-style:italic; line-height:1.4; font-weight:600">
      {data.sceneAspect || ''}
    </div>
  </div>
</div>

<!-- Compel Suggestions -->
{#if compels.length > 0}
  <div class="fs-section-gap">
    <OgmaTooltip tip="Compel suggestions — offer a fate point when an aspect causes trouble.">
      <div class="fs-section-hdr">COMPEL SUGGESTIONS</div>
    </OgmaTooltip>
    {#each compels as c, i}
      <div class="fs-stunt" style="border-left:3px solid {aspectColor}; border-radius:0 3px 3px 0; margin-bottom:6px">
        <div style="font-size:11px; font-weight:700; color:var(--fs-text); line-height:1.2; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:2px">
          Compel {i + 1} — {c.target}
        </div>
        <div style="font-size:12px; color:var(--fs-text); line-height:1.4; margin-bottom:2px">
          <span style="font-weight:600; color:var(--fs-section)">Pressure:</span> {c.pressure}
        </div>
        <div style="font-size:12px; color:var(--fs-text); line-height:1.4">
          <span style="font-weight:600; color:var(--fs-trouble)">Consequence:</span> {c.consequence}
        </div>
      </div>
    {/each}
  </div>
{/if}

<!-- Framing Question -->
{#if data.framingQuestion}
  <div class="fs-section-gap">
    <OgmaTooltip tip="Answer before play to decide if this scene is worth playing.">
      <div class="fs-section-hdr">FRAMING QUESTION</div>
    </OgmaTooltip>
    <p style="margin:0; font-size:12px; color:var(--fs-text-muted); line-height:1.4; font-style:italic">
      <i class="fa-solid fa-circle" aria-hidden="true" style="font-size:4px; vertical-align:middle; margin-right:6px; color:var(--fs-section)"></i>{data.framingQuestion}
    </p>
  </div>
{/if}
