<script>
  import CvLabel from './CvLabel.svelte';
  let { label = '', hits = [], setHits = () => {}, color = 'var(--accent)' } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  function toggle(i) {
    const a = hits.slice();
    a[i] = !a[i];
    setHits(a);
  }

  function onKeyDown(e, i) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle(i);
    }
  }
</script>

<div>
  <CvLabel {label} {color} />
  <div style:display="flex" style:gap="4px" style:flex-wrap="wrap">
    {#each hits as v, i (i)}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        role="checkbox"
        tabindex="0"
        aria-checked={String(!!v)}
        aria-label="{label} stress box {i + 1}{v ? ' (marked)' : ' (clear)'}"
        onclick={(e) => { e.stopPropagation(); (() => toggle(i))(e); }}
        onkeydown={(e) => onKeyDown(e, i)}
        style:width="18px"
        style:height="18px"
        style:border-radius="2px"
        style:border="2px solid {color}"
        style:background={v ? color : 'transparent'}
        style:cursor="pointer"
        style:flex-shrink="0"
        style:transition="all 0.12s cubic-bezier(0.34,1.56,0.64,1)"
        style:position="relative"
        style:animation={v ? 'fd-box-stamp 0.2s cubic-bezier(0.34,1.56,0.64,1)' : 'none'}
      >
        {#if v}
          <span style:position="absolute"
                style:inset="0"
                style:display="flex"
                style:align-items="center"
                style:justify-content="center"
                style:font-size="10px"
                style:font-weight="800"
                style:color="var(--cv-card-dark,#1A1610)"
                style:line-height="1"
                style:pointer-events="none"
                style:font-family={CV4_MONO}>
            &#x2715;
          </span>
        {/if}
      </div>
    {/each}
  </div>
</div>
