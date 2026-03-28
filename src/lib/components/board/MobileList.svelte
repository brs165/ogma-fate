<script>
  import Cv4Card from '../cards/Cv4Card.svelte';

  let { cards = [], campId = '', onOpen = () => {}, onRemove = () => {} } = $props();
  let genCards = $derived(cards.filter(c => c.genId && c.genId !== 'sticky' && c.genId !== 'boost' && c.genId !== 'label' && c.data));
  let stickyCards = $derived(cards.filter(c => c.genId === 'sticky'));
  let boostCards = $derived(cards.filter(c => c.genId === 'boost'));

  const TYPE_MAP = {
    npc_minor: 'Minor NPC', npc_major: 'Major NPC', scene: 'Scene', campaign: 'Campaign',
    encounter: 'Encounter', seed: 'Seed', compel: 'Compel', challenge: 'Challenge',
    contest: 'Contest', consequence: 'Consequence', faction: 'Faction', complication: 'Complication',
    backstory: 'Backstory', obstacle: 'Obstacle', countdown: 'Countdown', constraint: 'Constraint',
  };

  function cardTypeLabel(genId) { return TYPE_MAP[genId] || genId; }

  function cardTitle(card) {
    const d = card.data || {};
    return card.title || d.name || d.location || d.situation || d.track_name || card.genId || '\u2014';
  }
</script>

{#if cards.length === 0}
  <div class="bml-empty">
    <div style="font-size:32px;margin-bottom:10px"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i></div>
    <div style="font-size:14px;font-weight:700;color:var(--text)">Table is empty</div>
    <div style="font-size:12px;color:var(--text-muted);margin-top:4px">Roll a generator, then tap <strong>Send to Table</strong></div>
  </div>
{:else}
  <div class="bml-list">
    <div class="bml-count">{cards.length} card{cards.length === 1 ? '' : 's'} on table</div>

    {#each genCards as card (card.id)}
      <div class="bml-card-full">
        <div class="bml-card-actions">
          <span class="bml-card-type-pill">{cardTypeLabel(card.genId)}</span>
          <button
            class="bml-expand"
            onclick={() => onOpen(card)}
            aria-label="Expand {cardTitle(card)}"
          ><i class="fa-solid fa-expand" aria-hidden="true"></i></button>
          <button
            class="bml-remove"
            onclick={() => onRemove(card.id)}
            aria-label="Remove {cardTitle(card)}"
          ><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button>
        </div>
        <Cv4Card genId={card.genId} data={card.data} campName={campId} />
      </div>
    {/each}

    {#if stickyCards.length > 0}
      <div class="bml-section"><i class="fa-solid fa-thumbtack" aria-hidden="true"></i> Sticky notes ({stickyCards.length})</div>
      {#each stickyCards as card (card.id)}
        <div class="bml-sticky-item">
          <span class="bml-sticky-text">{card.text || 'Empty note'}</span>
          <button class="bml-remove" onclick={() => onRemove(card.id)} aria-label="Remove sticky">&times;</button>
        </div>
      {/each}
    {/if}

    {#if boostCards.length > 0}
      <div class="bml-section"><i class="fa-solid fa-bolt" aria-hidden="true"></i> Boosts ({boostCards.length})</div>
      {#each boostCards as card (card.id)}
        <div class="bml-sticky-item" style="border-left-color:#f4b942">
          <span class="bml-sticky-text">{card.text || 'Boost'}{card.expired ? ' (used)' : ''}</span>
          <button class="bml-remove" onclick={() => onRemove(card.id)} aria-label="Remove boost">&times;</button>
        </div>
      {/each}
    {/if}
  </div>
{/if}
