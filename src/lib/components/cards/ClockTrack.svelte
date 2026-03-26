<script>
  import CvLabel from './CvLabel.svelte';
  let { boxes = 4, filled = 0, setFilled = () => {}, color = 'var(--accent)' } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  let full = $derived(filled >= boxes);
  let labelColor = $derived(full ? 'var(--c-red,#E06060)' : color);
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
  <CvLabel label={labelText} color={labelColor} />
  <div style:display="flex" style:gap="5px" style:flex-wrap="wrap" style:margin-bottom="4px">
    {#each Array.from({ length: boxes }) as _, i (i)}
      {@const ticked = i < filled}
      {@const borderColor = full ? 'var(--c-red,#E06060)' : color}
      {@const bgBase = full ? 'var(--c-red,#E06060)' : color}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        role="checkbox"
        tabindex="0"
        aria-checked={String(ticked)}
        aria-label="Clock box {i + 1}{ticked ? ' (ticked)' : ' (empty)'}"
        onclick={(e) => onClick(e, i, ticked)}
        onkeydown={(e) => onKeyDown(e, i, ticked)}
        style:width="28px"
        style:height="28px"
        style:border-radius="2px"
        style:cursor="pointer"
        style:border="2px solid {borderColor}"
        style:background={ticked ? 'color-mix(in srgb,' + bgBase + ' 35%,var(--fs-bg,#F5F0E8))' : 'transparent'}
        style:transition="all 0.18s cubic-bezier(0.34,1.56,0.64,1)"
        style:display="flex"
        style:align-items="center"
        style:justify-content="center"
        style:animation={ticked ? 'fd-clock-tick 0.2s cubic-bezier(0.34,1.56,0.64,1)' : 'none'}
      >
        {#if ticked}
          <span style:font-size="12px"
                style:font-weight="800"
                style:color={full ? 'var(--c-red,#E06060)' : color}
                style:pointer-events="none"
                style:font-family={CV4_MONO}>
            <i class="fa-solid fa-check"></i>
          </span>
        {/if}
      </div>
    {/each}
  </div>

  {#if full}
    <div style:font-size="11px"
         style:font-weight="800"
         style:color="var(--c-red,#E06060)"
         style:font-family={CV4_MONO}
         style:letter-spacing="0.18em"
         style:animation="cv4pulse 0.6s ease-in-out infinite">
      &#x26a1; CLOCK FULL &mdash; TRIGGER NOW
    </div>
  {/if}
</div>
