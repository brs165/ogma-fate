<script>
  let { label = '', hits = [], setHits = () => {}, color = 'var(--fs-stress-phy)' } = $props();

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

<div class="fs-stress-track">
  <span class="fs-stress-label">{label}</span>
  <div class="fs-stress-boxes">
    {#each hits as v, i (i)}
      <div
        class="fs-stress-box"
        role="checkbox"
        tabindex="0"
        aria-checked={String(!!v)}
        aria-label="{label} stress box {i + 1}{v ? ' (marked)' : ' (clear)'}"
        onclick={(e) => { e.stopPropagation(); toggle(i); }}
        onkeydown={(e) => onKeyDown(e, i)}
        style="border-color:{color}; background:{v ? color : 'transparent'}; color:{v ? '#fff' : color}; animation:{v ? 'fd-box-stamp 0.2s cubic-bezier(0.34,1.56,0.64,1)' : 'none'}"
      >
        {#if v}
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        {/if}
      </div>
    {/each}
  </div>
</div>
