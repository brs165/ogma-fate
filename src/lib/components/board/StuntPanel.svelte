<svelte:options runes={false} />

<script>
  // ── StuntPanel — stunt library with search + filter ───────────────────────────
  import { UNIVERSAL } from '../../../data/universal.js';
  // Note: worldStunts prop is passed by the parent from CAMPAIGNS[campId].tables.stunts

  export let worldStunts = [];  // Passed in by parent from CAMPAIGNS[campId].tables.stunts

  let filter  = '';
  let skill   = 'all';
  let tag     = 'all';
  let copied  = null;
  let copyTimer = null;

  $: uniStunts = (UNIVERSAL && UNIVERSAL.stunts) ? UNIVERSAL.stunts : [];
  $: allStunts = worldStunts.concat(uniStunts);

  $: skills = ['all', ...allStunts
    .map(s => s.skill)
    .filter((v, i, a) => a.indexOf(v) === i && v && v !== 'varies')
    .sort()
  ];

  $: tags = ['all', ...allStunts
    .reduce((acc, s) => {
      (s.tags || []).forEach(t => { if (!acc.includes(t)) acc.push(t); });
      return acc;
    }, [])
    .sort()
  ];

  $: filtered = allStunts.filter(s => {
    if (skill !== 'all' && s.skill !== skill) return false;
    if (tag !== 'all' && !(s.tags || []).includes(tag)) return false;
    if (filter) {
      const q = filter.toLowerCase();
      return (s.name || '').toLowerCase().includes(q) ||
             (s.skill || '').toLowerCase().includes(q) ||
             (s.desc || '').toLowerCase().includes(q);
    }
    return true;
  });

  function copyStunt(s) {
    const text = s.name + ' (' + s.skill + '): ' + s.desc;
    function confirmCopy() {
      copied = s.name;
      if (copyTimer) clearTimeout(copyTimer);
      copyTimer = setTimeout(() => { copied = null; }, 1500);
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(confirmCopy).catch(() => {
        fallbackCopy(text); confirmCopy();
      });
    } else {
      fallbackCopy(text); confirmCopy();
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
  }

  const SKILL_COLOR = 'var(--accent)';
  const TYPE_COLOR = { bonus: 'var(--c-blue,#60a5fa)', special: 'var(--c-purple,#a78bfa)' };

  function onCardKeyDown(e, s) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyStunt(s); }
  }
</script>

<div class="blp-body blp-stunts">
  <!-- Filters -->
  <div class="bs-filters">
    <input
      type="text"
      class="bs-search"
      placeholder="Search stunts…"
      bind:value={filter}
      aria-label="Search stunts"
    />
    <div class="bs-selects">
      <select class="bs-select" bind:value={skill} aria-label="Filter by skill">
        {#each skills as sk (sk)}
          <option value={sk}>{sk === 'all' ? 'All skills' : sk}</option>
        {/each}
      </select>
      <select class="bs-select" bind:value={tag} aria-label="Filter by tag">
        {#each tags as tg (tg)}
          <option value={tg}>{tg === 'all' ? 'All tags' : tg}</option>
        {/each}
      </select>
    </div>
    <div class="bs-count" aria-live="polite">
      {filtered.length} of {allStunts.length} stunts{worldStunts.length ? ' · ' + worldStunts.length + ' world' : ''}
    </div>
  </div>

  <!-- Stunt list -->
  {#if filtered.length === 0}
    <div class="bs-empty">No stunts match your filters.</div>
  {:else}
    <div class="bs-list">
      {#each filtered as s, i (s.name || i)}
        {@const isCopied = copied === s.name}
        {@const typeCol = TYPE_COLOR[s.type] || TYPE_COLOR.bonus}
        <div
          class="bs-card{isCopied ? ' bs-copied' : ''}"
          role="button"
          tabindex="0"
          aria-label="Copy stunt: {s.name}"
          on:click={() => copyStunt(s)}
          on:keydown={e => onCardKeyDown(e, s)}
        >
          <div class="bs-card-header">
            <span class="bs-name">{s.name}</span>
            <span class="bs-type" style="color:{typeCol}; border-color:{typeCol}55">
              {s.type === 'special' ? 'ONCE/SCENE' : '+2'}
            </span>
          </div>
          <div class="bs-skill" style="color:{SKILL_COLOR}">{s.skill}</div>
          <p class="bs-desc">{s.desc}</p>
          <div class="bs-footer">
            {#each (s.tags || []) as tg (tg)}
              <span class="bs-tag">{tg}</span>
            {/each}
            <span class="bs-copy-hint">{isCopied ? '✓ Copied' : '⌘ Copy'}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
