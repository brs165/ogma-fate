<script>
  import ClockTrack from '../ClockTrack.svelte';
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  let boxes = $derived(data.boxes || 4);
  let filled = $derived(cardState?.cdFilled ?? 0);

  function setFilled(n) { onUpdate({ cdFilled: n }); }
</script>

<div style="display:flex; gap:14px">
  <div style="flex:1; min-width:0">
    <div class="fs-section-gap">
      <OgmaTooltip tip="Trigger — what causes a box to fill. Each time this happens in the fiction, mark one segment on the clock.">
        <div class="fs-section-hdr" style="cursor:help" tabindex="0">TRIGGER</div>
      </OgmaTooltip>
      <div style="font-size:12px; color:var(--fs-text-dim); line-height:1.4">{data.trigger || ''}</div>
    </div>

    <div class="fs-section-gap">
      <div class="fs-stunt" style="border-left:3px solid #c62828; border-radius:0 3px 3px 0">
        <OgmaTooltip tip="Outcome — when every segment is filled, this consequence fires automatically. PCs can try to prevent it before the clock completes.">
          <div class="fs-stunt-name" style="color:#c62828; cursor:help" tabindex="0">OUTCOME WHEN FULL</div>
        </OgmaTooltip>
        <div class="fs-stunt-desc" style="color:#c62828; font-weight:600">{data.outcome || ''}</div>
      </div>
    </div>

    {#if data.unit}
      <div class="fs-section-gap">
        <div class="fs-stunt">
          <div class="fs-stunt-name">UNIT</div>
          <div style="font-size:13px; font-weight:700; color:var(--fs-text); text-transform:capitalize">{data.unit}</div>
        </div>
      </div>
    {/if}
  </div>

  <div style="width:140px; flex-shrink:0">
    <ClockTrack {boxes} {filled} {setFilled} color="var(--fs-badge-bg, var(--fs-section))" />
  </div>
</div>
