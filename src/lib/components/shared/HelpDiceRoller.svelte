<script>
  let { mode = 'basic', skill = 0, label = '' } = $props();
  const ADJECTIVES = [
    [-4, 'Abysmal',    '#FF3B30'],
    [-3, 'Terrible',   '#FF6B4A'],
    [-2, 'Poor',       '#FF9500'],
    [-1, 'Mediocre',   '#FFCC00'],
    [0,  'Average',    '#8E8E93'],
    [1,  'Fair',       '#34C759'],
    [2,  'Good',       '#30D158'],
    [3,  'Great',      '#32ADE6'],
    [4,  'Superb',     '#5E5CE6'],
    [5,  'Fantastic',  '#BF5AF2'],
    [6,  'Epic',       '#FF375F'],
    [7,  'Legendary',  '#FF6ABD'],
    [8,  'Legendary+', '#FF6ABD'],
  ];

  function getAdj(n) {
    for (let i = 0; i < ADJECTIVES.length; i++) {
      if (ADJECTIVES[i][0] === n) return { label: ADJECTIVES[i][1], color: ADJECTIVES[i][2] };
    }
    if (n < -4) return { label: 'Abysmal', color: '#FF3B30' };
    return { label: 'Legendary+', color: '#FF6ABD' };
  }

  function rollDie() {
    return ['+', '+', '0', '0', '-', '-'][Math.floor(Math.random() * 6)];
  }

  function dieValue(face) {
    return face === '+' ? 1 : face === '-' ? -1 : 0;
  }

  function outcomeLabel(raw, sk) {
    const total = raw + sk;
    if (total >= 3) return 'Success with Style';
    if (total >= 1) return 'Success';
    if (total === 0) return 'Tie';
    return 'Fail';
  }

  let faces = $state([null, null, null, null]);
  let revealed = $state([false, false, false, false]);
  let rolling = $state(false);
  let result = $state(null);
  let btnLabel = $state('Roll 4dF');

  function roll() {
    if (rolling) return;
    rolling = true;
    btnLabel = '…';
    result = null;
    revealed = [false, false, false, false];

    const newFaces = [rollDie(), rollDie(), rollDie(), rollDie()];
    faces = newFaces;

    // Reveal dice one by one
    let idx = 0;
    const interval = setInterval(() => {
      revealed[idx] = true;
      revealed = [...revealed];
      idx++;
      if (idx >= 4) {
        clearInterval(interval);
        // Show result
        const raw = newFaces.reduce((s, f) => s + dieValue(f), 0);
        const total = raw + skill;
        const adj = getAdj(total);
        const outcome = outcomeLabel(raw, skill);
        result = { total, adj, outcome };
        rolling = false;
        btnLabel = 'Roll again';
      }
    }, 120);
  }

  function dieClass(face) {
    if (face === '+') return 'dr-die dr-die-pop dr-die-pos';
    if (face === '-') return 'dr-die dr-die-pop dr-die-neg';
    return 'dr-die dr-die-pop dr-die-zero';
  }

  function dieText(face) {
    if (face === '-') return '−';
    return face;
  }

  let skillText = $derived((skill >= 0 ? '+' : '') + skill);
  let displayLabel = $derived(label || (mode === 'skill' ? '4DF — SKILL ROLL' : '4DF — RAW ROLL'));
</script>

<div class="dr-widget" role="region" aria-label={label || '4dF dice roller'}>
  <div class="dr-top">
    <span class="dr-label">{displayLabel}</span>
    {#if mode === 'skill'}
      <span class="dr-label">—</span>
      <span class="dr-skill-badge"><span class="dr-skill-val">{skillText}</span></span>
    {/if}
  </div>

  <div class="dr-dice-row" aria-live="polite" aria-atomic="true">
    {#each [0, 1, 2, 3] as i}
      {#if revealed[i] && faces[i]}
        <span class={dieClass(faces[i])} aria-hidden="true">{dieText(faces[i])}</span>
      {:else}
        <span class="dr-die dr-die-hidden" aria-hidden="true">?</span>
      {/if}
    {/each}
  </div>

  <div class="dr-result-row" aria-live="polite">
    {#if result}
      <span class="dr-total" style="color:{result.adj.color}">{result.total >= 0 ? '+' : ''}{result.total}</span>
      <span class="dr-adj" style="color:{result.adj.color}">{result.adj.label}</span>
      {#if mode === 'skill'}
        <span class="dr-outcome">{result.outcome}</span>
      {/if}
    {:else}
      <span class="dr-result-placeholder">—</span>
    {/if}
  </div>

  <button class="dr-btn" type="button" aria-label="Roll 4 Fate dice" disabled={rolling} onclick={roll}>
    {btnLabel}
  </button>
</div>
