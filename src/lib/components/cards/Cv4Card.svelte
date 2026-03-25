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
    npc_minor:    NpcMinor,
    npc_major:    NpcMajor,
    faction:      Faction,
    scene:        Scene,
    campaign:     Campaign,
    encounter:    Encounter,
    seed:         Seed,
    compel:       Compel,
    challenge:    Challenge,
    contest:      Contest,
    consequence:  Consequence,
    complication: Complication,
    pc:           Pc,
    backstory:    Backstory,
    obstacle:     Obstacle,
    countdown:    Countdown,
    constraint:   Constraint,
    custom:       Custom,
  };

  // ── Category / meta maps ─────────────────────────────────────────────────
  const CV4_CAT = {
    character: { color: 'var(--c-blue,#60a5fa)'   },
    world:     { color: 'var(--gold,#fbbf24)'      },
    mechanics: { color: 'var(--c-red,#f87171)'     },
    tool:      { color: 'var(--c-purple,#a78bfa)'  },
    pressure:  { color: 'var(--c-green,#34d399)'   },
    custom:    { color: 'var(--text-muted,#888)'   },
  };

  const CV4_META = {
    npc_minor:    { cat: 'character', icon: '◈' },
    npc_major:    { cat: 'character', icon: '◆' },
    faction:      { cat: 'character', icon: '⚑' },
    scene:        { cat: 'world',     icon: '◉' },
    campaign:     { cat: 'world',     icon: '✶' },
    encounter:    { cat: 'world',     icon: '⚔' },
    seed:         { cat: 'world',     icon: '⊕' },
    compel:       { cat: 'mechanics', icon: '↩' },
    challenge:    { cat: 'mechanics', icon: '⊙' },
    contest:      { cat: 'mechanics', icon: '⇌' },
    consequence:  { cat: 'mechanics', icon: '⬡' },
    complication: { cat: 'tool',      icon: '⚡' },
    pc:           { cat: 'character', icon: '☆' },
    backstory:    { cat: 'tool',      icon: '◑' },
    obstacle:     { cat: 'pressure',  icon: '▲' },
    countdown:    { cat: 'pressure',  icon: '⏳' },
    constraint:   { cat: 'pressure',  icon: '⊘' },
    custom:       { cat: 'custom',    icon: '✎' },
  };

  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  // ── Props ────────────────────────────────────────────────────────────────
  export let genId          = 'npc_minor';
  export let campName       = '';
  export let data           = {};
  export let onUpdate       = null;
  export let savedCardState = null;

  // ── UI state ─────────────────────────────────────────────────────────────
  let flipped  = false;
  let hovered  = false;
  let visible  = true;
  let reduced  = false;

  // ── Reduced-motion listener ───────────────────────────────────────────────
  let mq;
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
  let fadeTimer;
  $: if (!reduced) {
    // Reference both deps so Svelte tracks them
    void genId; void data;
    visible = false;
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => { visible = true; }, 30);
  }

  onDestroy(() => clearTimeout(fadeTimer));

  // ── Derived ───────────────────────────────────────────────────────────────
  $: meta      = CV4_META[genId] || { cat: 'mechanics', icon: '◈' };
  $: cat       = CV4_CAT[meta.cat] || CV4_CAT.mechanics;
  $: catColor  = cat.color;
  $: genLabel  = genId.replace(/_/g, ' ').toUpperCase();
  $: ariaLabel = genLabel + ' card' + (campName ? ' from ' + campName : '');
  $: FrontComponent = FRONTS[genId] || null;

  // ── Interactive card state ────────────────────────────────────────────────
  $: phyMax = typeof data.physical_stress === 'number' ? data.physical_stress
            : typeof data.stress           === 'number' ? data.stress : 0;
  $: menMax = typeof data.mental_stress   === 'number' ? data.mental_stress : 0;

  // Initialize once (like React useState initializer)
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
  on:mouseenter={() => hovered = true}
  on:mouseleave={() => hovered = false}
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
      class="cv4-face cv4-front fd-card"
      style="backface-visibility:hidden; -webkit-backface-visibility:hidden; background:var(--cv-card-dark,var(--panel)); border:1px solid {hovered ? catColor + 'AA' : 'var(--cv-card-bdr,var(--border))'}; border-radius:3px; overflow:hidden; display:{reduced && flipped ? 'none' : 'flex'}; flex-direction:column; box-shadow:{hovered ? '5px 7px 0 rgba(0,0,0,0.18), 0 0 0 1px ' + catColor + '44' : '3px 3px 0 rgba(0,0,0,0.18)'}; transform:{hovered && !flipped ? 'translateY(-3px) rotate(0.25deg)' : 'none'}; transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, border-color 0.15s"
    >
      <!-- Stamp band -->
      <div style="height:5px; background:{catColor}; flex-shrink:0"></div>
      <!-- Header -->
      <div style="height:34px; flex-shrink:0; border-bottom:1px solid {catColor}33; display:flex; align-items:center; padding:0 14px; gap:8px; background:color-mix(in srgb,{catColor} 6%,var(--cv-card-dark,var(--panel)))">
        <span style="font-size:14px; color:{catColor}; line-height:1; flex-shrink:0">{meta.icon}</span>
        <span style="font-size:10px; font-weight:800; letter-spacing:0.22em; color:{catColor}; font-family:{CV4_MONO}; text-transform:uppercase">{genLabel}</span>
        <div style="flex:1"></div>
        {#if campName}<span style="font-size:10px; color:var(--cv-card-text-muted); font-family:{CV4_MONO}; letter-spacing:0.08em; font-style:italic">{campName}</span>{/if}
      </div>
      <!-- Front content -->
      {#if FrontComponent}
        <div style="flex-shrink:0">
          <svelte:component
            this={FrontComponent}
            {data}
            {campName}
            {catColor}
            {cardState}
            onUpdate={updState}
          />
        </div>
      {/if}
      <!-- Flip button -->
      <button
        on:click={toggleFlip}
        on:keydown={onFlipKeydown}
        aria-label={flipped ? 'Show card front' : 'Show GM guidance'}
        style="width:100%; height:28px; background:transparent; border:none; border-top:1px solid {catColor}22; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; font-family:{CV4_MONO}; font-size:10px; font-weight:700; letter-spacing:0.18em; color:{catColor}; text-transform:uppercase"
      ><span style="font-size:10px; line-height:1">▶</span> TAP FOR GM GUIDANCE</button>
    </div>

    <!-- ── BACK ───────────────────────────────────────────────────────── -->
    <div
      class="cv4-face cv4-back"
      style="backface-visibility:hidden; -webkit-backface-visibility:hidden; transform:{reduced ? 'none' : 'rotateY(180deg)'}; position:{flipped && !reduced ? 'relative' : reduced ? 'relative' : 'absolute'}; top:0; left:0; right:0; background:var(--cv-card-dark,var(--panel)); border:1px solid {hovered ? catColor + 'AA' : 'var(--cv-card-bdr,var(--border))'}; border-radius:3px; overflow:hidden; display:{reduced && !flipped ? 'none' : 'flex'}; flex-direction:column; box-shadow:{hovered ? '5px 7px 0 rgba(0,0,0,0.18), 0 0 0 1px ' + catColor + '44' : '3px 3px 0 rgba(0,0,0,0.18)'}"
    >
      <!-- Stamp band -->
      <div style="height:5px; background:{catColor}; flex-shrink:0"></div>
      <!-- Header -->
      <div style="height:34px; flex-shrink:0; border-bottom:1px solid {catColor}33; display:flex; align-items:center; padding:0 14px; gap:8px; background:color-mix(in srgb,{catColor} 6%,var(--cv-card-dark,var(--panel)))">
        <span style="font-size:14px; color:{catColor}; line-height:1; flex-shrink:0">{meta.icon}</span>
        <span style="font-size:10px; font-weight:800; letter-spacing:0.22em; color:{catColor}; font-family:{CV4_MONO}; text-transform:uppercase">GM GUIDANCE</span>
        <div style="flex:1"></div>
        {#if campName}<span style="font-size:10px; color:var(--cv-card-text-muted); font-family:{CV4_MONO}; letter-spacing:0.08em; font-style:italic">{campName}</span>{/if}
      </div>
      <!-- Back panel content -->
      <div style="flex:1; overflow-y:visible; min-height:0">
        <BackPanel {genId} {catColor} />
      </div>
      <!-- Flip button -->
      <button
        on:click={toggleFlip}
        on:keydown={onFlipKeydown}
        aria-label="Show card front"
        style="width:100%; height:28px; background:transparent; border:none; border-top:1px solid {catColor}22; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; font-family:{CV4_MONO}; font-size:10px; font-weight:700; letter-spacing:0.18em; color:{catColor}; text-transform:uppercase"
      ><span style="font-size:10px; line-height:1">◀</span> TAP FOR CARD DETAILS</button>
    </div>
  </div>
</div>
