<script>
  // ── MobileTableFan — FAB → list → card detail, mobile only ────────────────
  import Cv4Card from '../cards/Cv4Card.svelte';

  let {
    cards        = [],
    campName     = '',
    campId       = '',
    onCardDelete = null,
    onCardReroll = null,
  } = $props();

  let sheetOpen = $state(false);
  let focusedId = $state(null);

  // Auto-clears focusedId if the card was deleted
  let focusedCard = $derived(
    focusedId ? (cards.find(c => c.id === focusedId) ?? null) : null
  );

  const TYPE_COLOR = {
    npc_minor: '#e8b83a', npc_major: '#e8793a', backstory: '#4a90d9',
    scene: '#3aaa7a', encounter: '#d04a6a', complication: '#d04a6a',
    challenge: '#4a90d9', contest: '#6a7dd4', obstacle: '#888888',
    countdown: '#e8793a', constraint: '#888888', campaign: '#6a7dd4',
    seed: '#e8b83a', faction: '#6a7dd4', compel: '#3aaa7a',
    consequence: '#e8793a', custom: '#888888', boost: '#f4b942', pc: '#c4a24a',
    sticky: '#a78bfa', label: '#888888',
  };
  const TYPE_LABEL = {
    npc_minor: 'Minor NPC', npc_major: 'Major NPC', backstory: 'PC Backstory',
    scene: 'Scene', encounter: 'Encounter', complication: 'Complication',
    challenge: 'Challenge', contest: 'Contest', obstacle: 'Obstacle',
    countdown: 'Countdown', constraint: 'Constraint', campaign: 'Campaign',
    seed: 'Seed', faction: 'Faction', compel: 'Compel',
    consequence: 'Consequence', custom: 'Custom', boost: 'Boost', pc: 'PC',
    sticky: 'Sticky', label: 'Label',
  };
  const TYPE_ICON = {
    npc_minor: 'fa-user', npc_major: 'fa-crown', backstory: 'fa-masks-theater',
    scene: 'fa-fire', encounter: 'fa-burst', complication: 'fa-triangle-exclamation',
    challenge: 'fa-bullseye', contest: 'fa-trophy', obstacle: 'fa-shield-halved',
    countdown: 'fa-clock', constraint: 'fa-lock', campaign: 'fa-globe',
    seed: 'fa-seedling', faction: 'fa-flag', compel: 'fa-rotate-left',
    consequence: 'fa-bolt', custom: 'fa-pen', boost: 'fa-bolt', pc: 'fa-user',
    sticky: 'fa-note-sticky', label: 'fa-bookmark',
  };

  function cardColor(genId) { return TYPE_COLOR[genId] ?? '#888888'; }
  function cardLabel(genId) { return TYPE_LABEL[genId] ?? genId; }
  function cardIcon(genId)  { return TYPE_ICON[genId]  ?? 'fa-table-cells'; }

  function cardTitle(card) {
    if (card.genId === 'sticky' || card.genId === 'label') return card.text || '(empty)';
    if (card.genId === 'boost') return card.text || 'Boost';
    const d = card.data ?? {};
    return d.name ?? d.title ?? d.high_concept ?? d.concept ?? d.situation ?? d.track_name ?? '—';
  }

  function openSheet() { sheetOpen = true; focusedId = null; }
  function closeSheet() { sheetOpen = false; focusedId = null; }
  function backToList() { focusedId = null; }

  function handleDelete(id) {
    onCardDelete?.(id);
    focusedId = null;
  }
</script>

<!-- FAB: always rendered, position:fixed, hidden on desktop via CSS -->
<button
  class="mtf-fab"
  class:mtf-fab--open={sheetOpen}
  onclick={openSheet}
  aria-label="Open table{cards.length > 0 ? ` — ${cards.length} card${cards.length === 1 ? '' : 's'}` : ''}"
>
  <i class="fa-solid fa-table-cells" aria-hidden="true"></i>
  {#if cards.length > 0}
    <span class="mtf-fab-badge">{cards.length}</span>
  {/if}
</button>

<!-- Sheet: full-screen overlay when open -->
{#if sheetOpen}
  <div class="mtf-sheet" role="dialog" aria-modal="true" aria-label="Table cards">

    <!-- Header -->
    <div class="mtf-hdr">
      {#if focusedCard}
        <button class="mtf-hdr-back" onclick={backToList} aria-label="Back to card list">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          <span>All cards</span>
        </button>
        <span class="mtf-hdr-type" style="color:{cardColor(focusedCard.genId)}">
          {cardLabel(focusedCard.genId)}
        </span>
      {:else}
        <span class="mtf-hdr-title">
          <i class="fa-solid fa-table-cells" aria-hidden="true"></i>
          Table
          {#if cards.length > 0}<span class="mtf-hdr-count">{cards.length}</span>{/if}
        </span>
      {/if}
      <button class="mtf-hdr-close" onclick={closeSheet} aria-label="Close table">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Body: card detail or list -->
    {#if focusedCard}
      <div class="mtf-detail-scroll">
        <Cv4Card
          genId={focusedCard.genId}
          campName={campId}
          data={focusedCard.data ?? {}}
          savedCardState={focusedCard.cardState ?? null}
          autoGuidance={false}
        />
      </div>
      <div class="mtf-detail-actions">
        <button
          class="mtf-action-btn mtf-action-reroll"
          onclick={() => onCardReroll?.(focusedCard.id)}
          aria-label="Reroll this card"
        >
          <i class="fa-solid fa-dice-d20" aria-hidden="true"></i> Reroll
        </button>
        <button
          class="mtf-action-btn mtf-action-delete"
          onclick={() => handleDelete(focusedCard.id)}
          aria-label="Remove card from table"
        >
          <i class="fa-solid fa-trash" aria-hidden="true"></i> Remove
        </button>
      </div>

    {:else if cards.length === 0}
      <div class="mtf-empty">
        <i class="fa-solid fa-table-cells" aria-hidden="true"></i>
        <strong>Table is empty</strong>
        <span>Roll a generator and tap <strong>Send to Table</strong></span>
      </div>

    {:else}
      <div class="mtf-list" role="listbox" aria-label="Cards on table">
        {#each cards as card (card.id)}
          {@const color = cardColor(card.genId)}
          <button
            class="mtf-card-row"
            role="option"
            aria-selected={false}
            onclick={() => { focusedId = card.id; }}
            aria-label="View {cardTitle(card)}"
          >
            <span class="mtf-row-bar" style="background:{color}"></span>
            <span class="mtf-row-icon" style="color:{color}">
              <i class="fa-solid {cardIcon(card.genId)}" aria-hidden="true"></i>
            </span>
            <span class="mtf-row-text">
              <span class="mtf-row-title">{cardTitle(card)}</span>
              <span class="mtf-row-type" style="color:{color}">{cardLabel(card.genId)}</span>
            </span>
            <i class="fa-solid fa-chevron-right mtf-row-cue" aria-hidden="true"></i>
          </button>
        {/each}
      </div>
    {/if}

  </div>
{/if}
