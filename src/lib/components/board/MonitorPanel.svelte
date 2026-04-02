<script>
  import { ScrollArea } from 'bits-ui';
  import StressRow from '../cards/StressRow.svelte';
  import ClockTrack from '../cards/ClockTrack.svelte';

  let {
    cards = [],
    onPanToCard = () => {},
    onUpdateCard = null,
    showConflictGrid = false,
    onToggleConflictGrid = () => {},
  } = $props();

  // ── Derived data from canvas cards ──────────────────────────────────────
  let npcCards = $derived(cards.filter(c =>
    c.gen === 'npc_minor' || c.gen === 'npc_major' || c.gen === 'npc_instant'
  ));
  let sceneCards = $derived(cards.filter(c => c.gen === 'scene' || c.gen === 'scene_hook'));
  let countdownCards = $derived(cards.filter(c => c.gen === 'countdown'));
  let boostCards = $derived(cards.filter(c => c.gen === 'boost'));

  // ── Collect all active aspects from all cards ───────────────────────────
  let allAspects = $derived((() => {
    const aspects = [];
    cards.forEach(c => {
      if (!c.data) return;
      // Scene aspects
      if (Array.isArray(c.data.aspects)) {
        c.data.aspects.forEach(a => {
          if (typeof a === 'object' && a.name) {
            aspects.push({ text: a.name, type: 'situation', category: a.category || 'tone', cardId: c.id, source: extractName(c) });
          } else if (typeof a === 'string') {
            aspects.push({ text: a, type: 'character', cardId: c.id, source: extractName(c) });
          }
        });
      }
      // NPC aspects (object form)
      if (c.data.aspects && typeof c.data.aspects === 'object' && !Array.isArray(c.data.aspects)) {
        if (c.data.aspects.high_concept) aspects.push({ text: c.data.aspects.high_concept, type: 'character', cardId: c.id, source: c.data.name || 'NPC' });
        if (c.data.aspects.trouble) aspects.push({ text: c.data.aspects.trouble, type: 'consequence', cardId: c.id, source: c.data.name || 'NPC' });
      }
      // NPC Instant aspects
      if (c.gen === 'npc_instant') {
        if (c.data.highConcept) aspects.push({ text: c.data.highConcept, type: 'character', cardId: c.id, source: c.data.name || 'NPC' });
        if (c.data.trouble) aspects.push({ text: c.data.trouble, type: 'consequence', cardId: c.id, source: c.data.name || 'NPC' });
      }
      // Scene hook aspects
      if (c.gen === 'scene_hook' && c.data.sceneAspect) {
        aspects.push({ text: c.data.sceneAspect, type: 'situation', category: c.data.aspectType || 'tone', cardId: c.id, source: 'Scene Hook' });
      }
      // Location flavor hidden aspect
      if (c.gen === 'location_flavor' && c.data.hiddenDiscovery) {
        aspects.push({ text: c.data.hiddenDiscovery.name, type: 'hidden', cardId: c.id, source: c.data.location || 'Location' });
      }
    });
    return aspects;
  })());

  let situationAspects = $derived(allAspects.filter(a => a.type === 'situation'));
  let characterAspects = $derived(allAspects.filter(a => a.type === 'character'));
  let boostAspects = $derived(boostCards.map(c => ({ text: c.data?.text || c.data?.title || 'Boost', cardId: c.id, source: 'Boost' })));

  const CC = { danger: '#c62828', cover: '#1565c0', tone: '#b8860b', movement: '#2e7d32', usable: '#7b1fa2' };

  function extractName(c) {
    return c.data?.name || c.data?.location || c.data?.sceneAspect || c.gen || 'Card';
  }

  function npcPeakSkill(c) {
    if (c.gen === 'npc_instant' && c.data?.peakSkill) {
      return c.data.peakSkill;
    }
    if (c.data?.skills && c.data.skills.length > 0) {
      return c.data.skills.reduce((best, s) => s.r > (best?.r || 0) ? s : best, c.data.skills[0]);
    }
    return null;
  }

  function npcStress(c) {
    if (c.gen === 'npc_instant') return c.data?.stress || 1;
    if (c.data?.physical_stress) return c.data.physical_stress;
    if (c.data?.stress) return c.data.stress;
    return 2;
  }

  function npcHits(c) {
    return c.cardState?.phyHit ?? Array(npcStress(c)).fill(false);
  }

  function setNpcHits(card, hits) {
    if (onUpdateCard) onUpdateCard(card.id, { cardState: { ...card.cardState, phyHit: hits } });
  }

  function countdownFilled(c) {
    return c.cardState?.cdFilled ?? 0;
  }
  function setCountdownFilled(card, n) {
    if (onUpdateCard) onUpdateCard(card.id, { cardState: { ...card.cardState, cdFilled: n } });
  }
</script>

<div class="monitor-panel">
  <ScrollArea.Root>
    <ScrollArea.Viewport>
      <div class="monitor-body">

        <!-- Conflict Grid Toggle -->
        {#if npcCards.length > 0}
          <div class="monitor-section">
            <button
              class="monitor-grid-toggle"
              onclick={onToggleConflictGrid}
              aria-pressed={String(showConflictGrid)}
            >
              <i class="fa-solid fa-table-cells" aria-hidden="true"></i>
              {showConflictGrid ? 'Close Conflict Grid' : 'Open Conflict Grid'}
              <span class="monitor-badge">{npcCards.length}</span>
            </button>
          </div>
        {/if}

        <!-- Scene Strip -->
        {#if situationAspects.length > 0}
          <div class="monitor-section">
            <div class="monitor-section-hdr">SCENE ASPECTS</div>
            {#each situationAspects as a}
              <button class="monitor-aspect-row" onclick={() => onPanToCard(a.cardId)}>
                <span class="monitor-cat-pip" style="background:{CC[a.category] || '#b8860b'}"></span>
                <span class="monitor-aspect-text">{a.text}</span>
                <span class="monitor-aspect-source">{a.source}</span>
              </button>
            {/each}
          </div>
        {/if}

        <!-- NPC Roster -->
        {#if npcCards.length > 0}
          <div class="monitor-section">
            <div class="monitor-section-hdr">NPC ROSTER <span class="monitor-count">{npcCards.length}</span></div>
            {#each npcCards as c (c.id)}
              {@const peak = npcPeakSkill(c)}
              <button class="monitor-npc-row" onclick={() => onPanToCard(c.id)}>
                <div class="monitor-npc-name">{c.data?.name || 'NPC'}</div>
                <div class="monitor-npc-info">
                  {#if peak}
                    <span class="monitor-skill-badge">+{peak.rating || peak.r} {peak.name}</span>
                  {/if}
                  <span class="monitor-stress-inline">
                    {#each npcHits(c) as v, i}
                      <span class="monitor-stress-box" class:monitor-stress-hit={v}></span>
                    {/each}
                  </span>
                </div>
              </button>
            {/each}
          </div>
        {/if}

        <!-- Character Aspects -->
        {#if characterAspects.length > 0}
          <div class="monitor-section">
            <div class="monitor-section-hdr">CHARACTER ASPECTS</div>
            {#each characterAspects.slice(0, 12) as a}
              <button class="monitor-aspect-row" onclick={() => onPanToCard(a.cardId)}>
                <span class="monitor-cat-pip" style="background:var(--accent, #C8944A)"></span>
                <span class="monitor-aspect-text">{a.text}</span>
                <span class="monitor-aspect-source">{a.source}</span>
              </button>
            {/each}
          </div>
        {/if}

        <!-- Boosts -->
        {#if boostAspects.length > 0}
          <div class="monitor-section">
            <div class="monitor-section-hdr">BOOSTS <span class="monitor-count">{boostAspects.length}</span></div>
            {#each boostAspects as a}
              <button class="monitor-aspect-row" onclick={() => onPanToCard(a.cardId)}>
                <span class="monitor-cat-pip" style="background:#4CAF50"></span>
                <span class="monitor-aspect-text">{a.text}</span>
              </button>
            {/each}
          </div>
        {/if}

        <!-- Countdowns -->
        {#if countdownCards.length > 0}
          <div class="monitor-section">
            <div class="monitor-section-hdr">CLOCKS & COUNTDOWNS</div>
            {#each countdownCards as c (c.id)}
              <div class="monitor-countdown-row">
                <button class="monitor-countdown-name" onclick={() => onPanToCard(c.id)}>
                  {c.data?.track_name || c.data?.name || 'Countdown'}
                </button>
                <div class="monitor-countdown-boxes">
                  {#each Array.from({ length: c.data?.boxes || 4 }) as _, i}
                    {@const ticked = i < countdownFilled(c)}
                    <button
                      class="monitor-cd-box"
                      class:monitor-cd-ticked={ticked}
                      onclick={() => setCountdownFilled(c, ticked ? i : i + 1)}
                      aria-label="Clock box {i + 1}{ticked ? ' (ticked)' : ' (empty)'}"
                    ></button>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        {/if}

        <!-- Empty state -->
        {#if cards.length === 0}
          <div class="monitor-empty">
            <i class="fa-solid fa-binoculars" aria-hidden="true"></i>
            <p>No cards on the table yet.</p>
            <p>Generate cards to see live scene data here.</p>
          </div>
        {/if}

      </div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="vertical">
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</div>
