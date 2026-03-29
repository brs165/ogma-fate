<script>
  // ── MobileTableFan — mobile hero-card + fan-drawer for the table view ────
  // Replaces cp-table-fab + cp-mobile-sheet on ≤640px screens.
  // Props: cards, campName, campId, onCardDelete, onCardReroll
  import { onMount } from 'svelte';
  import { Collapsible } from 'bits-ui';
  import Cv4Card from '../cards/Cv4Card.svelte';

  let {
    cards       = [],
    campName    = '',
    campId      = '',
    onCardDelete = null,
    onCardReroll = null,
  } = $props();

  let focusIdx = $state(0);
  let fanOpen  = $state(false);
  let reduced  = $state(false);

  let focusCard = $derived(cards[focusIdx] ?? null);

  let fanCards = $derived(
    cards
      .map((c, i) => ({ card: c, origIdx: i }))
      .filter(({ origIdx }) => origIdx !== focusIdx)
      .slice(0, 5)
  );

  let fanHeight = $derived(fanCards.length * 56);

  const TYPE_COLOR = {
    npc_minor: '#e8b83a', npc_major: '#e8793a', backstory: '#4a90d9',
    scene: '#3aaa7a', encounter: '#d04a6a', complication: '#d04a6a',
    challenge: '#4a90d9', contest: '#6a7dd4', obstacle: '#888888',
    countdown: '#e8793a', constraint: '#888888', campaign: '#6a7dd4',
    seed: '#e8b83a', faction: '#6a7dd4', compel: '#3aaa7a',
    consequence: '#e8793a', custom: '#888888', boost: '#f4b942', pc: '#c4a24a',
  };

  const TYPE_LABEL = {
    npc_minor: 'NPC', npc_major: 'NPC+', backstory: 'BACK',
    scene: 'SCENE', encounter: 'ENC', complication: 'COMP',
    challenge: 'CHAL', contest: 'CONT', obstacle: 'OBS',
    countdown: 'CLOCK', constraint: 'CONST', campaign: 'CAMP',
    seed: 'SEED', faction: 'FACT', compel: 'COMPEL',
    consequence: 'CONSEQ', custom: 'CUSTOM', boost: 'BOOST', pc: 'PC',
  };

  const TYPE_ICON = {
    npc_minor: 'fa-user', npc_major: 'fa-crown', backstory: 'fa-masks-theater',
    scene: 'fa-fire', encounter: 'fa-burst', complication: 'fa-triangle-exclamation',
    challenge: 'fa-bullseye', contest: 'fa-trophy', obstacle: 'fa-shield-halved',
    countdown: 'fa-clock', constraint: 'fa-lock', campaign: 'fa-globe',
    seed: 'fa-seedling', faction: 'fa-flag', compel: 'fa-rotate-left',
    consequence: 'fa-bolt', custom: 'fa-pen', boost: 'fa-bolt', pc: 'fa-user',
  };

  function cardColor(genId) { return TYPE_COLOR[genId] ?? '#888888'; }
  function cardLabel(genId) { return TYPE_LABEL[genId] ?? genId.toUpperCase(); }
  function cardIcon(genId)  { return TYPE_ICON[genId]  ?? 'fa-cards'; }

  function cardTitle(card) {
    const d = card.data ?? {};
    return d.name ?? d.title ?? d.high_concept ?? d.concept ?? card.genId ?? 'Card';
  }

  function selectCard(origIdx) {
    focusIdx = origIdx;
    fanOpen  = false;
  }

  function handleDelete(id) {
    const newLen = cards.length - 1;
    if (focusIdx >= newLen) focusIdx = Math.max(0, newLen - 1);
    onCardDelete?.(id);
  }

  onMount(() => {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      reduced = mq.matches;
      const h = (e) => { reduced = e.matches; };
      mq.addEventListener('change', h);
      return () => mq.removeEventListener('change', h);
    } catch {}
  });
</script>

<div class="mtf-root">

  {#if cards.length === 0}
    <div class="mtf-empty">
      <i class="fa-solid fa-table-cells" aria-hidden="true"></i>
      <span>No cards on table yet.</span>
      <span class="mtf-empty-hint">Roll a generator, then tap <strong>Send to Table</strong>.</span>
    </div>

  {:else}
    <!-- Hero card -->
    <div
      class="mtf-hero"
      class:mtf-hero--fan-open={fanOpen}
      style="--fan-h:{fanHeight}px"
    >
      {#if focusCard}
        <div class="mtf-badge">
          <span class="mtf-badge-idx">{focusIdx + 1} / {cards.length}</span>
          <span class="mtf-badge-type" style="color:{cardColor(focusCard.genId)}">{cardLabel(focusCard.genId)}</span>
        </div>

        <div class="mtf-cv4-wrap">
          <Cv4Card
            genId={focusCard.genId}
            campName={campName}
            data={focusCard.data ?? {}}
            savedCardState={focusCard.cardState ?? null}
            autoGuidance={false}
          />
        </div>

        <div class="mtf-card-actions">
          <button
            class="mtf-action-btn mtf-action-reroll"
            onclick={() => onCardReroll?.(focusCard.id)}
            aria-label="Reroll this card"
          >
            <i class="fa-solid fa-dice-d20" aria-hidden="true"></i> Reroll
          </button>
          <button
            class="mtf-action-btn mtf-action-delete"
            onclick={() => handleDelete(focusCard.id)}
            aria-label="Remove card from table"
          >
            <i class="fa-solid fa-trash" aria-hidden="true"></i> Remove
          </button>
        </div>
      {/if}
    </div>

    <!-- Fan toggle + strips -->
    <Collapsible.Root open={fanOpen} onOpenChange={(v) => { fanOpen = v; }}>
      <Collapsible.Trigger asChild>
        {#snippet child({ props })}
          <button
            {...props}
            class="mtf-fan-trigger"
            aria-label={fanOpen ? 'Collapse card list' : `Show all ${cards.length} cards`}
          >
            <span class="mtf-fan-trigger-dots">
              {#each cards as _, i}
                <span
                  class="mtf-dot"
                  class:mtf-dot--active={i === focusIdx}
                  style={i === focusIdx ? `background:${cardColor(focusCard?.genId)}` : ''}
                ></span>
              {/each}
            </span>
            <span class="mtf-fan-trigger-label">
              {#if fanOpen}
                <i class="fa-solid fa-chevron-down" aria-hidden="true"></i> Close
              {:else}
                <i class="fa-solid fa-chevron-up" aria-hidden="true"></i>
                All cards ({cards.length})
              {/if}
            </span>
          </button>
        {/snippet}
      </Collapsible.Trigger>

      <Collapsible.Content>
        <div
          class="mtf-fan-list"
          class:mtf-fan-list--reduced={reduced}
          role="listbox"
          aria-label="All table cards"
        >
          {#each fanCards as { card, origIdx }, stackPos}
            {@const color = cardColor(card.genId)}
            {@const title = cardTitle(card)}
            {@const label = cardLabel(card.genId)}
            {@const icon  = cardIcon(card.genId)}
            <button
              class="mtf-fan-strip"
              role="option"
              aria-selected={false}
              aria-label="Focus {title} ({label})"
              style="--strip-color:{color};--strip-delay:{reduced ? 0 : stackPos * 35}ms"
              onclick={() => selectCard(origIdx)}
            >
              <span class="mtf-strip-bar" style="background:{color}"></span>
              <span class="mtf-strip-icon" style="color:{color}">
                <i class="fa-solid {icon}" aria-hidden="true"></i>
              </span>
              <span class="mtf-strip-text">
                <span class="mtf-strip-title">{title}</span>
                <span class="mtf-strip-type" style="color:{color}">{label}</span>
              </span>
              <span class="mtf-strip-cue" aria-hidden="true">
                <i class="fa-solid fa-arrow-up-to-bracket"></i>
              </span>
            </button>
          {/each}

          <div class="mtf-fan-add-hint">
            Roll a generator and tap <strong>Send to Table</strong> to add more cards.
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  {/if}

</div>
