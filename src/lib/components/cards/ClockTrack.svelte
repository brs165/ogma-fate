<script>
  import { Checkbox } from 'bits-ui';
  let { boxes = 4, filled = 0, setFilled = () => {}, color = 'var(--fs-section)' } = $props();

  let full = $derived(filled >= boxes);
  let labelColor = $derived(full ? '#c62828' : color);
  let labelText = $derived('CLOCK \u2014 ' + boxes + ' BOXES' + (full ? ' \u2014 TRIGGERED!' : ''));

  function onClick(i, ticked) {
    setFilled(ticked ? i : i + 1);
  }
</script>

<div class="fs-clock-track {full ? 'cd-triggered-shake' : ''}">
  <div class="fs-section-hdr" style="color:{labelColor}; border-color:{labelColor}">{labelText}</div>
  <div style="display:flex; gap:5px; flex-wrap:wrap; margin-bottom:4px" role="group" aria-label="Countdown clock boxes">
    {#each Array.from({ length: boxes }) as _, i (i)}
      {@const ticked = i < filled}
      {@const borderColor = full ? '#c62828' : color}
      {@const bg = full ? '#c62828' : color}
      <Checkbox.Root
        checked={ticked}
        onCheckedChange={() => onClick(i, ticked)}
        aria-label="Clock box {i + 1}{ticked ? ' (ticked)' : ' (empty)'}"
        style="width:28px; height:28px; border-color:{borderColor}; background:{ticked ? bg : 'transparent'}; color:{ticked ? '#fff' : borderColor};"
      >
        <Checkbox.Indicator>
          {#if ticked}<i class="fa-solid fa-check" aria-hidden="true"></i>{/if}
        </Checkbox.Indicator>
      </Checkbox.Root>
    {/each}
  </div>
</div>
