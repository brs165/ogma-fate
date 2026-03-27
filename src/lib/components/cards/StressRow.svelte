<script>
  import { Checkbox } from 'bits-ui';
  import OgmaTooltip from '../shared/OgmaTooltip.svelte';
  let { label = '', hits = [], setHits = () => {}, color = 'var(--fs-stress-phy)' } = $props();

  const TIPS = {
    'Physical': 'Physical stress — taken when hurt bodily. Clears at end of scene. 3 boxes base; 4 at Physique 1–2, 6 at Physique 3+.',
    'Mental': 'Mental stress — taken from fear, manipulation, or social harm. Clears at end of scene. 3 boxes base; 4 at Will 1–2, 6 at Will 3+.',
  };
  let tip = $derived(TIPS[label] || 'Stress clears at end of scene. Check a box to absorb a hit.');

  function toggle(i) {
    const a = hits.slice();
    a[i] = !a[i];
    setHits(a);
  }
</script>

<div class="fs-stress-track">
  <OgmaTooltip {tip}>
    <span class="fs-stress-label" tabindex="0">{label}</span>
  </OgmaTooltip>
  <div class="fs-stress-boxes">
    {#each hits as v, i (i)}
      <Checkbox.Root
        checked={!!v}
        onCheckedChange={() => toggle(i)}
        aria-label="{label} stress box {i + 1}{v ? ' (marked)' : ' (clear)'}"
        style="border-color:{color}; background:{v ? color : 'transparent'}; color:{v ? '#fff' : color};"
      >
        <Checkbox.Indicator>
          {#if v}<i class="fa-solid fa-xmark" aria-hidden="true"></i>{/if}
        </Checkbox.Indicator>
      </Checkbox.Root>
    {/each}
  </div>
</div>
