<script>
  import { RadioGroup } from 'bits-ui';
  import OgmaTooltip from '../shared/OgmaTooltip.svelte';
  let { onRoll = null } = $props();

  const FACES = [-1, -1, 0, 0, 1, 1];
  function rollFate() { return FACES[Math.floor(Math.random() * 6)]; }

  const LADDER = [
    { r: 0, label: 'Mediocre'  },
    { r: 1, label: 'Average'   },
    { r: 2, label: 'Fair'      },
    { r: 3, label: 'Good'      },
    { r: 4, label: 'Great'     },
    { r: 5, label: 'Superb'    },
    { r: 6, label: 'Fantastic' },
    { r: 7, label: 'Epic'      },
  ];
  // Fate Condensed outcomes based on shifts (your result − opposition):
  //   <0 = Fail, 0 = Tie, 1-2 = Succeed, 3+ = Succeed with Style
  function outcomeFromShifts(s) {
    if (s >= 3) return { label: 'Succeed with Style', color: 'var(--accent)' };
    if (s >= 1) return { label: 'Succeed', color: 'var(--c-green)' };
    if (s === 0) return { label: 'Tie', color: 'var(--gold)' };
    return { label: 'Fail', color: 'var(--c-red)' };
  }

  function ladderLabel(n) {
    if (n < 0) return LADDER[0].label;
    if (n < LADDER.length) return LADDER[n].label;
    return 'Legendary +' + n;
  }

  let skill       = $state(2);
  let opposition  = $state(0);
  let modifier    = $state(0);
  let dice        = $state([]);
  let total       = $state(null);
  let collapsed   = $state(false);
  let history     = $state([]);

  let posX = $state(null);
  let posY = $state(null);
  let dragOffset = $state(null);
  let panel = $state();

  function onHdrPointerDown(e) {
    if (e.button !== 0) return;
    if (e.target.closest('button')) return;
    const rect = panel.getBoundingClientRect();
    dragOffset = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onHdrPointerMove(e) {
    if (!dragOffset) return;
    posX = e.clientX - dragOffset.dx;
    posY = e.clientY - dragOffset.dy;
  }
  function onHdrPointerUp() { dragOffset = null; }

  function doRoll() {
    const d = [rollFate(), rollFate(), rollFate(), rollFate()];
    const diceSum = d.reduce((a, b) => a + b, 0);
    const t = diceSum + skill + modifier;
    dice  = d;
    total = t;
    modifier = 0;
    const entry = { skill, diceSum, total: t, label: ladderLabel(t) };
    history = [entry, ...history].slice(0, 6);
    if (onRoll) onRoll({ who: 'GM', skill: ladderLabel(skill), total: t });
    // Haptic on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);
  }

  function addModifier(n) { modifier = Math.max(-8, Math.min(8, modifier + n)); }
  function faceSym(v) { return v === 1 ? '+' : v === -1 ? '\u2212' : '0'; }
  function faceClass(v) { return v === 1 ? 'dp-die-plus' : v === -1 ? 'dp-die-minus' : 'dp-die-zero'; }

  let hasOpposition = $derived(opposition > 0);
  let shifts = $derived(total === null ? null : total - opposition);
  let outcome = $derived(shifts === null ? null : outcomeFromShifts(shifts));
</script>

<!-- ── Panel ─────────────────────────────────────────────────────────────── -->
<div
  class="dp-panel fd-card"
  bind:this={panel}
  style={posX !== null ? `position:fixed;left:${posX}px;top:${posY}px;` : ''}
  onclick={(e) => e.stopPropagation()}
>
  <!-- Header stripe — draggable -->
  <div
    class="dp-hdr"
    onpointerdown={onHdrPointerDown}
    onpointermove={onHdrPointerMove}
    onpointerup={onHdrPointerUp}
    onpointercancel={onHdrPointerUp}
    role="toolbar"
    aria-label="Dice roller"
  >
    <span class="dp-hdr-icon" aria-hidden="true"><i class="fa-solid fa-dice-d20"></i></span>
    <span class="dp-hdr-title">Dice</span>
    <button class="dp-collapse-btn" onclick={() => { collapsed = !collapsed; }}
      aria-label={collapsed ? 'Expand' : 'Collapse'} title={collapsed ? 'Expand' : 'Collapse'}>
      <i class="fa-solid fa-chevron-{collapsed ? 'down' : 'up'}" aria-hidden="true"></i>
    </button>
  </div>

  {#if !collapsed}
  <!-- Skill row — Bits RadioGroup (arrow-key navigation) -->
  <div class="dp-section">
    <div class="dp-section-label">Skill</div>
    <RadioGroup.Root
      value={String(skill)}
      onValueChange={(v) => { if (v) skill = Number(v); }}
      aria-label="Skill rating"
      class="dp-skill-row"
    >
      {#each LADDER as l (l.r)}
        <RadioGroup.Item
          value={String(l.r)}
          class="dp-skill-btn{skill === l.r ? ' dp-skill-active' : ''}"
          aria-label="{l.label} +{l.r}"
        >+{l.r}</RadioGroup.Item>
      {/each}
    </RadioGroup.Root>
    <OgmaTooltip tip="Your skill rating is your expected result. Difficulties at or below this = likely success. Roll 4dF (−4 to +4) and add to skill.">
      <div class="dp-skill-name" tabindex="0">{ladderLabel(skill)} +{skill}</div>
    </OgmaTooltip>
  </div>

  <!-- Opposition row -->
  <div class="dp-section">
    <div class="dp-section-label">Opposition / Difficulty</div>
    <RadioGroup.Root
      value={String(opposition)}
      onValueChange={(v) => { if (v) opposition = Number(v); }}
      aria-label="Opposition rating"
      class="dp-skill-row"
    >
      <RadioGroup.Item
        value="0"
        class="dp-skill-btn dp-opp-none{opposition === 0 ? ' dp-opp-active' : ''}"
        aria-label="No target set"
      >—</RadioGroup.Item>
      {#each LADDER as l (l.r)}
        <RadioGroup.Item
          value={String(l.r)}
          class="dp-skill-btn dp-opp-btn{opposition === l.r ? ' dp-opp-active' : ''}"
          aria-label="{l.label} +{l.r}"
        >+{l.r}</RadioGroup.Item>
      {/each}
    </RadioGroup.Root>
    <div class="dp-skill-name">{opposition === 0 ? 'No target — raw total shown' : ladderLabel(opposition) + ' +' + opposition}</div>
  </div>

  <!-- Modifier strip -->
  <div class="dp-section">
    <div class="dp-section-label">Modifiers{modifier !== 0 ? ' (' + (modifier > 0 ? '+' : '') + modifier + ')' : ''}</div>
    <div class="dp-mod-row">
      <button class="dp-mod-btn dp-mod-minus" onclick={() => addModifier(-2)} title="−2 (concede / disadvantage)">−2</button>
      <button class="dp-mod-btn dp-mod-minus" onclick={() => addModifier(-1)} title="−1">−1</button>
      <button class="dp-mod-btn dp-mod-neutral{modifier === 0 ? ' active' : ''}" onclick={() => { modifier = 0; }} title="Clear modifier">✕</button>
      <button class="dp-mod-btn dp-mod-plus" onclick={() => addModifier(1)} title="+1 (boost)">+1</button>
      <button class="dp-mod-btn dp-mod-plus" onclick={() => addModifier(2)} title="+2 (invoke aspect)">+2</button>
      <button class="dp-mod-btn dp-mod-plus dp-mod-invoke" onclick={() => addModifier(2)} title="Invoke aspect (+2)">
        <i class="fa-solid fa-star" aria-hidden="true"></i>
      </button>
    </div>
    {#if modifier !== 0}
      <div class="dp-running-total">
        {ladderLabel(skill)} +{skill}
        {modifier > 0 ? '+' : ''}{modifier} modifier
        = <strong>{ladderLabel(skill + modifier)} +{skill + modifier}</strong> before dice
      </div>
    {/if}
  </div>

  <!-- Roll button -->
  <div class="dp-section dp-section-roll">
    <button class="btn-roll dp-roll-btn" onclick={doRoll}>
      <i class="fa-solid fa-dice-d20" aria-hidden="true"></i>
      Roll {ladderLabel(skill)}
      {#if modifier !== 0}<span class="dp-mod-tag">{modifier > 0 ? '+' : ''}{modifier}</span>{/if}
    </button>
  </div>

  <!-- Result -->
  {#if total !== null}
    <div class="dp-result">
      <!-- Dice faces -->
      <div class="dp-dice-row" aria-label="Dice results">
        {#each dice as d, i (i)}
          <div class="dp-die {faceClass(d)}" aria-label={d === 1 ? 'Plus' : d === -1 ? 'Minus' : 'Blank'}>
            {faceSym(d)}
          </div>
        {/each}
        <span class="dp-dice-eq">= {dice.reduce((a,b)=>a+b,0) >= 0 ? '+' : ''}{dice.reduce((a,b)=>a+b,0)}</span>
      </div>
      <!-- Total -->
      <div class="dp-total-row">
        <span class="dp-total-num" style="color:{hasOpposition && outcome ? outcome.color : 'var(--text)'}">
          {total >= 0 ? '+' : ''}{total}
        </span>
        <span class="dp-total-label">{ladderLabel(total)}</span>
      </div>
      <!-- Shifts & Outcome (only when opposition is set) -->
      {#if hasOpposition && outcome}
        <div class="dp-shifts-row">
          {shifts >= 0 ? '+' : ''}{shifts} shift{Math.abs(shifts) !== 1 ? 's' : ''} vs {ladderLabel(opposition)} +{opposition}
        </div>
        <div class="dp-outcome" style="background:color-mix(in srgb,{outcome.color} 15%,transparent);color:{outcome.color}">
          {outcome.label}
        </div>
        {#if shifts === 0}
          <div class="dp-tie-hint">Succeed at minor cost, or gain a boost</div>
        {/if}
      {/if}
    </div>
  {/if}

  <!-- History -->
  {#if history.length > 0}
    <div class="dp-history" aria-label="Roll history">
      {#each history as h, i (i)}
        <span class="dp-history-entry{i === 0 ? ' dp-history-latest' : ''}"
          title="{ladderLabel(h.skill)} +{h.skill}, dice {h.diceSum >= 0 ? '+' : ''}{h.diceSum} = {h.total >= 0 ? '+' : ''}{h.total}">
          {h.total >= 0 ? '+' : ''}{h.total}
        </span>
      {/each}
    </div>
  {/if}
  {/if}
</div>
