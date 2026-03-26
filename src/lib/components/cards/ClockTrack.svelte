<script>
  let { boxes = 4, filled = 0, setFilled = () => {}, color = 'var(--fs-section)' } = $props();

  let full = $derived(filled >= boxes);
  let labelColor = $derived(full ? '#c62828' : color);
  let labelText = $derived('CLOCK \u2014 ' + boxes + ' BOXES' + (full ? ' \u2014 TRIGGERED!' : ''));

  function onClick(e, i, ticked) {
    e.stopPropagation();
    setFilled(ticked ? i : i + 1);
  }

  function onKeyDown(e, i, ticked) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setFilled(ticked ? i : i + 1);
    }
  }
</script>

<div>
  <div class="fs-section-hdr" style="color:{labelColor}; border-color:{labelColor}">{labelText}</div>
  <div style="display:flex; gap:5px; flex-wrap:wrap; margin-bottom:4px">
    {#each Array.from({ length: boxes }) as _, i (i)}
      {@const ticked = i < filled}
      {@const borderColor = full ? '#c62828' : color}
      {@const bgBase = full ? '#c62828' : color}
      <div
        class="fs-stress-box"
        role="checkbox"
        tabindex="0"
        aria-checked={String(ticked)}
        aria-label="Clock box {i + 1}{ticked ? ' (ticked)' : ' (empty)'}"
        onclick={(e) => onClick(e, i, ticked)}
        onkeydown={(e) => onKeyDown(e, i, ticked)}
        style="width:28px; height:28px; border-color:{borderColor}; background:{ticked ? bgBase : 'transparent'}; color:{ticked ? '#fff' : borderColor}; animation:{ticked ? 'fd-clock-tick 0.2s cubic-bezier(0.34,1.56,0.64,1)' : 'none'}"
      >
        {#if ticked}
          <i class="fa-solid fa-check" aria-hidden="true"></i>
        {/if}
      </div>
    {/each}
  </div>

  {#if full}
    <div style="font-size:11px; font-weight:800; color:#c62828; letter-spacing:0.18em; animation:cv4pulse 0.6s ease-in-out infinite">
      <i class="fa-solid fa-bolt" aria-hidden="true"></i> CLOCK FULL &mdash; TRIGGER NOW
    </div>
  {/if}
</div>
