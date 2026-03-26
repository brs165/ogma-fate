<script>
  let { cards = [], campId = '', onOpen = () => {}, onRemove = () => {} } = $props();
  let genCards = $derived(cards.filter(c => c.genId && c.genId !== 'sticky' && c.genId !== 'boost' && c.genId !== 'label' && c.data));
  let stickyCards = $derived(cards.filter(c => c.genId === 'sticky'));
  let boostCards = $derived(cards.filter(c => c.genId === 'boost'));
  let labelCards = $derived(cards.filter(c => c.genId === 'label'));

  const TYPE_MAP = {
    npc_minor: 'Minor NPC', npc_major: 'Major NPC', scene: 'Scene', campaign: 'Campaign',
    encounter: 'Encounter', seed: 'Seed', compel: 'Compel', challenge: 'Challenge',
    contest: 'Contest', consequence: 'Consequence', faction: 'Faction', complication: 'Complication',
    backstory: 'Backstory', obstacle: 'Obstacle', countdown: 'Countdown', constraint: 'Constraint',
  };

  const CAT_COLOR = {
    npc_minor: 'var(--c-blue,#60a5fa)', npc_major: 'var(--c-blue,#60a5fa)', faction: 'var(--c-blue,#60a5fa)',
    scene: 'var(--gold,#fbbf24)', campaign: 'var(--gold,#fbbf24)', encounter: 'var(--gold,#fbbf24)', seed: 'var(--gold,#fbbf24)',
    compel: 'var(--c-red,#f87171)', challenge: 'var(--c-red,#f87171)', contest: 'var(--c-red,#f87171)', consequence: 'var(--c-red,#f87171)',
    complication: 'var(--c-purple,#a78bfa)', backstory: 'var(--c-purple,#a78bfa)',
    obstacle: 'var(--c-green,#34d399)', countdown: 'var(--c-green,#34d399)', constraint: 'var(--c-green,#34d399)',
  };

  function cardTypeLabel(genId) { return TYPE_MAP[genId] || genId; }

  function cardTitle(card) {
    const d = card.data || {};
    return card.title || d.name || d.location || d.situation || d.track_name || card.genId || '\u2014';
  }

  function handleKeyDown(e, card) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(card); }
  }
</script>

{#if cards.length === 0}
  <div class="bml-empty">
    <div style="font-size:32px;margin-bottom:10px">&#x1F3B2;</div>
    <div style="font-size:14px;font-weight:700;color:var(--text)">Canvas is empty</div>
    <div style="font-size:12px;color:var(--text-muted);margin-top:4px">Use Generate tab to add cards.</div>
  </div>
{:else}
  <div class="bml-list">
    {#each genCards as card (card.id)}
      {@const col = CAT_COLOR[card.genId] || 'var(--accent)'}
      <div
        class="bml-card"
        style="border-left:3px solid {col}"
        role="button"
        tabindex="0"
        aria-label="{cardTypeLabel(card.genId)}: {cardTitle(card)}"
        onclick={() => onOpen(card)}
        onkeydown={(e) => handleKeyDown(e, card)}
      >
        <div class="bml-card-type" style="color:{col}">{cardTypeLabel(card.genId)}</div>
        <div class="bml-card-title">{cardTitle(card)}</div>
        <button
          class="bml-remove"
          onclick={(e) => { e.stopPropagation(); (() => onRemove(card.id))(e); }}
          aria-label="Remove {cardTitle(card)}"
        >&times;</button>
      </div>
    {/each}
    {#if stickyCards.length > 0}
      <div class="bml-section">&#x1F4CC; Sticky notes ({stickyCards.length})</div>
    {/if}
    {#if boostCards.length > 0}
      <div class="bml-section">&#x26A1; Boosts ({boostCards.length})</div>
    {/if}
    {#if labelCards.length > 0}
      <div class="bml-section">&#x1F3F7; Labels ({labelCards.length})</div>
    {/if}
  </div>
{/if}
