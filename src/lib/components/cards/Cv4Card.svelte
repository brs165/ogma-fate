<script>
  import { onMount, onDestroy } from 'svelte';
  import BackPanel from './BackPanel.svelte';

  // ── Front component registry ────────────────────────────────────────────
  import NpcMinor    from './fronts/NpcMinor.svelte';
  import NpcMajor    from './fronts/NpcMajor.svelte';
  import Faction     from './fronts/Faction.svelte';
  import Scene       from './fronts/Scene.svelte';
  import Campaign    from './fronts/Campaign.svelte';
  import Encounter   from './fronts/Encounter.svelte';
  import Seed        from './fronts/Seed.svelte';
  import Compel      from './fronts/Compel.svelte';
  import Challenge   from './fronts/Challenge.svelte';
  import Contest     from './fronts/Contest.svelte';
  import Consequence from './fronts/Consequence.svelte';
  import Complication from './fronts/Complication.svelte';
  import Pc          from './fronts/Pc.svelte';
  import Backstory   from './fronts/Backstory.svelte';
  import Obstacle    from './fronts/Obstacle.svelte';
  import Countdown   from './fronts/Countdown.svelte';
  import Constraint  from './fronts/Constraint.svelte';
  import Custom      from './fronts/Custom.svelte';

  const FRONTS = {
    npc_minor: NpcMinor, npc_major: NpcMajor, faction: Faction,
    scene: Scene, campaign: Campaign, encounter: Encounter,
    seed: Seed, compel: Compel, challenge: Challenge,
    contest: Contest, consequence: Consequence, complication: Complication,
    pc: Pc, backstory: Backstory, obstacle: Obstacle,
    countdown: Countdown, constraint: Constraint, custom: Custom,
  };

  // ── Generator meta ──────────────────────────────────────────────────────
  const CV4_META = {
    npc_minor:    { icon: 'fa-solid fa-user',              label: 'Minor NPC' },
    npc_major:    { icon: 'fa-solid fa-user-tie',          label: 'Major NPC' },
    faction:      { icon: 'fa-solid fa-chess-rook',        label: 'Faction' },
    scene:        { icon: 'fa-solid fa-map',               label: 'Scene Setup' },
    campaign:     { icon: 'fa-solid fa-scroll',            label: 'Campaign Frame' },
    encounter:    { icon: 'fa-solid fa-burst',             label: 'Encounter' },
    seed:         { icon: 'fa-solid fa-seedling',          label: 'Adventure Seed' },
    compel:       { icon: 'fa-solid fa-hand-point-right',  label: 'Compel' },
    challenge:    { icon: 'fa-solid fa-mountain',          label: 'Challenge' },
    contest:      { icon: 'fa-solid fa-flag-checkered',    label: 'Contest' },
    consequence:  { icon: 'fa-solid fa-bolt',              label: 'Consequence' },
    complication: { icon: 'fa-solid fa-triangle-exclamation', label: 'Complication' },
    pc:           { icon: 'fa-solid fa-star',              label: 'Player Character' },
    backstory:    { icon: 'fa-solid fa-book-open',         label: 'PC Backstory' },
    obstacle:     { icon: 'fa-solid fa-shield-halved',     label: 'Obstacle' },
    countdown:    { icon: 'fa-solid fa-hourglass-half',    label: 'Countdown' },
    constraint:   { icon: 'fa-solid fa-lock',              label: 'Constraint' },
    custom:       { icon: 'fa-solid fa-pen-to-square',     label: 'Custom' },
  };

  // ── Campaign header gradient map ────────────────────────────────────────
  const CAMP_HDR = {
    thelongafter: 'var(--fs-hdr-thelongafter)',
    cyberpunk:    'var(--fs-hdr-cyberpunk)',
    fantasy:      'var(--fs-hdr-fantasy)',
    space:        'var(--fs-hdr-space)',
    victorian:    'var(--fs-hdr-victorian)',
    postapoc:     'var(--fs-hdr-postapoc)',
    western:      'var(--fs-hdr-western)',
    dVentiRealm:  'var(--fs-hdr-dVentiRealm)',
  };

  // ── Props ────────────────────────────────────────────────────────────────
  let { genId = 'npc_minor', campName = '', data = {}, onUpdate = null, savedCardState = null } = $props();

  // ── UI state ─────────────────────────────────────────────────────────────
  let flipped = $state(false);
  let hovered = $state(false);
  let visible = $state(true);
  let reduced = $state(false);

  // ── Reduced-motion listener ───────────────────────────────────────────────
  let mq = $state();
  onMount(() => {
    try {
      mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      reduced = mq.matches;
      const handler = e => { reduced = e.matches; };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } catch(e) {}
  });

  // ── Entry fade (triggers on genId/data change) ────────────────────────────
  let fadeTimer = $state();
  $effect(() => {
    if (!reduced) {
      void genId; void data;
      visible = false;
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => { visible = true; }, 30);
    }
  });

  onDestroy(() => clearTimeout(fadeTimer));

  // ── Derived ───────────────────────────────────────────────────────────────
  let meta      = $derived(CV4_META[genId] || { icon: 'fa-solid fa-dice-d20', label: genId });
  let genLabel  = $derived(meta.label);
  let ariaLabel = $derived(genLabel + ' card' + (campName ? ' from ' + campName : ''));
  let FrontComponent = $derived(FRONTS[genId] || null);
  let hdrBg    = $derived(CAMP_HDR[campName] || 'var(--fs-hdr-default)');
  let sectionColor = $derived('var(--fs-section)');

  // ── Interactive card state ────────────────────────────────────────────────
  let cardState = (() => {
    const pMax = typeof data.physical_stress === 'number' ? data.physical_stress
               : typeof data.stress          === 'number' ? data.stress : 0;
    const mMax = typeof data.mental_stress   === 'number' ? data.mental_stress : 0;
    const defaults = {
      phyHit:   Array(pMax).fill(false),
      menHit:   Array(mMax).fill(false),
      cdFilled: 0, scoreA: 0, scoreB: 0, treated: false,
    };
    return savedCardState ? Object.assign({}, defaults, savedCardState) : defaults;
  })();

  function updState(patch) {
    cardState = Object.assign({}, cardState, patch);
    if (onUpdate) onUpdate(cardState);
  }

  // ── Flip helpers ──────────────────────────────────────────────────────────
  function toggleFlip(e) {
    e.stopPropagation();
    flipped = !flipped;
  }
  function onFlipKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipped = !flipped; }
  }
</script>

<!-- ── Flip container ──────────────────────────────────────────────────── -->
<div
  class="cv4-flip-container"
  role="region"
  aria-label={ariaLabel}
  onmouseenter={() => hovered = true}
  onmouseleave={() => hovered = false}
  style="perspective:{reduced ? 'none' : '1000px'}; animation:{reduced ? 'none' : 'fd-stamp-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both'}; opacity:{visible ? 1 : 0}"
>
  <!-- ── Flipper ──────────────────────────────────────────────────────── -->
  <div
    class="cv4-flipper"
    class:cv4-flipped={flipped}
    style="position:relative; transform-style:{reduced ? 'flat' : 'preserve-3d'}; transition:{reduced ? 'none' : 'transform 0.5s cubic-bezier(0.4,0,0.2,1)'}; transform:{flipped ? (reduced ? 'none' : 'rotateY(180deg)') : 'none'}"
  >
    <!-- ── FRONT ──────────────────────────────────────────────────────── -->
    <div
      class="cv4-face cv4-front fs-card"
      style="backface-visibility:hidden; -webkit-backface-visibility:hidden; display:{reduced && flipped ? 'none' : 'flex'}; flex-direction:column; transform:{hovered && !flipped ? 'translateY(-2px)' : 'none'}; transition:transform 0.2s ease, box-shadow 0.2s ease; box-shadow:{hovered ? '0 6px 20px rgba(0,0,0,0.18)' : 'var(--fs-shadow)'}"
    >
      <!-- Header — campaign-tinted gradient -->
      <div class="fs-header" style="background:{hdrBg}">
        <div>
          <div class="fs-world">
            <i class={meta.icon} aria-hidden="true" style="margin-right:4px"></i>{genLabel}
          </div>
          {#if data.name}
            <div class="fs-name">{data.name}</div>
          {:else}
            <div class="fs-name">{campName || genLabel}</div>
          {/if}
        </div>
        {#if typeof data.refresh === 'number'}
          <div class="fs-refresh" aria-label="Refresh {data.refresh}">{data.refresh}</div>
        {/if}
      </div>
      <!-- Front content -->
      {#if FrontComponent}
        <div class="fs-body">
          <FrontComponent
            {data}
            {campName}
            catColor={sectionColor}
            {cardState}
            onUpdate={updState}
          />
        </div>
      {/if}
      <!-- Flip button -->
      <button
        class="fs-flip-btn"
        onclick={toggleFlip}
        onkeydown={onFlipKeydown}
        aria-label={flipped ? 'Show card front' : 'Show GM guidance'}
      ><i class="fa-solid fa-rotate" aria-hidden="true" style="font-size:9px"></i> GM GUIDANCE</button>
    </div>

    <!-- ── BACK ───────────────────────────────────────────────────────── -->
    <div
      class="cv4-face cv4-back fs-card"
      style="backface-visibility:hidden; -webkit-backface-visibility:hidden; transform:{reduced ? 'none' : 'rotateY(180deg)'}; position:{flipped && !reduced ? 'relative' : reduced ? 'relative' : 'absolute'}; top:0; left:0; right:0; display:{reduced && !flipped ? 'none' : 'flex'}; flex-direction:column; box-shadow:var(--fs-shadow)"
    >
      <!-- Header -->
      <div class="fs-header" style="background:{hdrBg}">
        <div>
          <div class="fs-world">
            <i class={meta.icon} aria-hidden="true" style="margin-right:4px"></i>{genLabel}
          </div>
          <div class="fs-name">GM Guidance</div>
        </div>
      </div>
      <!-- Back panel content -->
      <div class="fs-body" style="flex:1; overflow-y:visible; min-height:0">
        <BackPanel {genId} catColor={sectionColor} />
      </div>
      <!-- Flip button -->
      <button
        class="fs-flip-btn"
        onclick={toggleFlip}
        onkeydown={onFlipKeydown}
        aria-label="Show card front"
      ><i class="fa-solid fa-rotate" aria-hidden="true" style="font-size:9px"></i> CARD DETAILS</button>
    </div>
  </div>
</div>
