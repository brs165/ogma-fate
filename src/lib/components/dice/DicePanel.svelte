<script>
  import { onDestroy } from 'svelte';

  // ── Props ────────────────────────────────────────────────────────────────
  export let players       = [];
  export let selId         = null;
  export let spendFP       = null;
  export let onRoll        = null;
  export let pendingInvoke = null;
  export let onClearInvoke = null;

  // ── Ladder data ───────────────────────────────────────────────────────────
  const TP_LADDER = [
    {v:8,l:'Legendary'},{v:7,l:'Epic'},{v:6,l:'Fantastic'},{v:5,l:'Superb'},
    {v:4,l:'Great'},{v:3,l:'Good'},{v:2,l:'Fair'},{v:1,l:'Average'},
    {v:0,l:'Mediocre'},{v:-1,l:'Poor'},{v:-2,l:'Terrible'},
  ];
  const TP_LADDER_HEX = [
    [-4,'#FF3B30'],[-3,'#FF6B4A'],[-2,'#FF9500'],[-1,'#FFCC00'],
    [0,'#8E8E93'],[1,'#34C759'],[2,'#30D158'],[3,'#32ADE6'],
    [4,'#5E5CE6'],[5,'#BF5AF2'],[6,'#FF375F'],[7,'#FF6ABD'],[8,'#FF6ABD'],
  ];

  function tpLbl(v) {
    const e = TP_LADDER.find(x => x.v === v);
    return e ? e.l : (v > 8 ? 'Legendary+' : 'Abysmal');
  }
  function tpLcolHex(v) {
    const e = TP_LADDER_HEX.find(x => x[0] === v);
    if (e) return e[1];
    return v < -4 ? '#FF3B30' : '#FF6ABD';
  }
  function randomFace() {
    return ['+', '0', '−'][Math.floor(Math.random() * 3)];
  }

  // ── State ─────────────────────────────────────────────────────────────────
  let dice         = ['+', '0', '+', '−'];
  let phase        = 'idle';   // idle | flicker | reveal | done
  let revealCount  = 0;
  let result       = null;
  let activeSk     = null;
  let boosted      = false;
  let history      = [];
  let diff         = 0;
  let ladderOpen   = false;
  let flickerFaces = ['+', '0', '−', '+'];

  // Timer refs
  let flickerTimer = null;
  let revealTimer  = null;

  onDestroy(() => {
    if (flickerTimer) clearInterval(flickerTimer);
    if (revealTimer)  clearInterval(revealTimer);
  });

  // ── Derived ───────────────────────────────────────────────────────────────
  $: player      = players.find(p => p.id === selId) || null;
  $: mod         = activeSk ? (activeSk.v != null ? activeSk.v : activeSk.r || 0) : 0;
  $: invokeBonus = pendingInvoke ? 2 : 0;
  $: final       = result != null ? result + mod + (boosted ? 2 : 0) + invokeBonus : null;
  $: rolling     = phase === 'flicker' || phase === 'reveal';

  // Outcome calculation
  $: outcomeData = (() => {
    if (phase !== 'done' || final == null) return null;
    const margin  = final - diff;
    const outcome = margin >= 3 ? 'Succeed w/ Style'
                  : margin >= 1 ? 'Success'
                  : margin === 0 ? 'Tie'
                  : 'Fail';
    const outCol  = margin >= 3 ? '#32ADE6'
                  : margin >= 1 ? '#34C759'
                  : margin === 0 ? '#FFCC00'
                  : '#FF3B30';
    const hints = {
      'Succeed w/ Style': 'You get what you want + a boost',
      'Success':          'You get what you want',
      'Tie':              'You get what you want, at a minor cost',
      'Fail':             "You don't get what you want, and it may get worse",
    };
    return { outcome, outCol, hint: hints[outcome], margin };
  })();

  // ── Die class helper ──────────────────────────────────────────────────────
  function dieClass(f, isFlicker, isHidden, isPop) {
    const base = 'dr-die';
    if (isHidden && isPop) return base + ' dr-die-hidden dr-die-spin';
    if (isHidden)  return base + ' dr-die-hidden';
    if (isPop) {
      const colorClass = f === '+' ? 'dr-die-pos' : f === '−' ? 'dr-die-neg' : 'dr-die-zero';
      return base + ' dr-die-pop ' + colorClass;
    }
    const colorClass = f === '+' ? 'dr-die-pos' : f === '−' ? 'dr-die-neg' : 'dr-die-zero';
    return base + ' ' + colorClass;
  }

  // ── Roll ─────────────────────────────────────────────────────────────────
  function doRoll(sk) {
    if (rolling) return;
    activeSk    = sk;
    boosted     = false;
    result      = null;
    revealCount = 0;

    const faces = [randomFace(), randomFace(), randomFace(), randomFace()];

    phase = 'flicker';
    let flicks = 0;
    if (flickerTimer) clearInterval(flickerTimer);
    flickerTimer = setInterval(() => {
      flickerFaces = [randomFace(), randomFace(), randomFace(), randomFace()];
      flicks++;
      if (flicks >= 5) {
        clearInterval(flickerTimer); flickerTimer = null;
        dice        = faces;
        phase       = 'reveal';
        revealCount = 0;
        let idx = 0;
        if (revealTimer) clearInterval(revealTimer);
        revealTimer = setInterval(() => {
          idx++;
          revealCount = idx;
          if (idx >= 4) {
            clearInterval(revealTimer); revealTimer = null;
            const raw = faces.reduce((s, f) => s + (f === '+' ? 1 : f === '−' ? -1 : 0), 0);
            result = raw;
            phase  = 'done';
            const skVal = sk.v != null ? sk.v : sk.r || 0;
            let total   = raw + skVal;
            if (pendingInvoke) total += 2;
            const entry = {
              who:   player ? player.name : '?',
              skill: sk.l || sk.name,
              total,
            };
            history = [entry, ...history].slice(0, 8);
            if (onRoll) onRoll({
              who:     entry.who,
              skill:   entry.skill,
              total,
              invoked: pendingInvoke ? pendingInvoke.label : null,
            });
            if (pendingInvoke && onClearInvoke) onClearInvoke();
          }
        }, 120);
      }
    }, 80);
  }

  // Stats derived from history
  $: stats = (() => {
    if (history.length < 3) return null;
    const totals = history.map(r => r.total);
    const avg    = totals.reduce((a,b) => a+b, 0) / totals.length;
    const hi     = Math.max(...totals);
    const lo     = Math.min(...totals);
    const byPlayer = {};
    history.forEach(r => {
      if (!byPlayer[r.who]) byPlayer[r.who] = [];
      byPlayer[r.who].push(r.total);
    });
    return { avg, hi, lo, byPlayer };
  })();
</script>

<div class="tp-dice-v2" role="region" aria-label="Dice roller">

  <!-- Who -->
  <div class="tp-dice-who">
    {#if player}
      <span style="color:{player.color || 'var(--accent)'}">{player.name}</span>
    {:else}
      <span style="color:var(--text-muted)">↑ Select a player</span>
    {/if}
  </div>

  <!-- Dice row -->
  <div class="dr-dice-row" aria-live="polite" aria-atomic="true">
    {#each [0,1,2,3] as idx}
      {#if phase === 'flicker'}
        <span class="dr-die dr-die-hidden dr-die-spin" aria-hidden="true">{flickerFaces[idx]}</span>
      {:else if phase === 'reveal'}
        {#if idx < revealCount}
          {@const f = dice[idx]}
          <span
            class="dr-die dr-die-pop {f === '+' ? 'dr-die-pos' : f === '−' ? 'dr-die-neg' : 'dr-die-zero'}"
            aria-hidden="true"
          >{f}</span>
        {:else}
          <span class="dr-die dr-die-hidden" aria-hidden="true">?</span>
        {/if}
      {:else if phase === 'done'}
        {@const fd = dice[idx]}
        <span
          class="dr-die {fd === '+' ? 'dr-die-pos' : fd === '−' ? 'dr-die-neg' : 'dr-die-zero'}"
          aria-hidden="true"
        >{fd}</span>
      {:else}
        <span class="dr-die dr-die-hidden" aria-hidden="true">?</span>
      {/if}
    {/each}
  </div>

  <!-- Result row -->
  <div class="dr-result-row">
    {#if phase === 'done' && final != null}
      <span class="dr-total" style="color:{tpLcolHex(final)}">{final >= 0 ? '+' : ''}{final}</span>
      <span class="dr-adj"   style="color:{tpLcolHex(final)}">{tpLbl(final)}</span>
      {#if outcomeData}
        <span class="dr-outcome" style="color:{outcomeData.outCol}; border-color:{outcomeData.outCol}">
          {outcomeData.outcome}{outcomeData.margin > 0 ? ' +' + outcomeData.margin : outcomeData.margin < 0 ? ' ' + outcomeData.margin : ''}
        </span>
      {/if}
    {:else if phase === 'idle'}
      <span class="dr-result-placeholder">{player ? 'Pick a skill or roll 4dF' : '—'}</span>
    {/if}
  </div>

  <!-- Outcome hint -->
  {#if outcomeData}
    <div class="tp-dice-outcome-hint" style="color:{outcomeData.outCol}">{outcomeData.hint}</div>
  {/if}

  <!-- Pending invoke badge -->
  {#if pendingInvoke}
    <div class="tp-dice-invoke-badge">
      <span style="color:{pendingInvoke.source === 'free' ? 'var(--c-green)' : 'var(--accent)'}">
        {pendingInvoke.source === 'free' ? '✦ Free Invoke' : '⦿ Invoke'} +2
      </span>
      <span style="font-size:10px; color:var(--text-muted); font-style:italic">
         — {pendingInvoke.label || 'aspect'}
      </span>
      <button class="tp-dice-invoke-clear" on:click={onClearInvoke} aria-label="Cancel invoke">✕</button>
    </div>
  {/if}

  <!-- Create Advantage guide -->
  {#if phase === 'done' && final != null}
    <div class="tp-dice-ca-guide">
      <details>
        <summary style="font-size:10px; color:var(--text-muted); cursor:pointer">✦ Create Advantage?</summary>
        <div style="font-size:10px; color:var(--text-dim); line-height:1.5; padding:4px 0">
          {#if final - diff >= 3}
            ✅ SWS — create/discover aspect with 2 free invokes
          {:else if final - diff >= 1}
            ✅ Success — create/discover aspect with 1 free invoke
          {:else if final - diff === 0}
            ⚠ Tie — boost (1 free invoke, then gone)
          {:else}
            ❌ Fail — aspect exists but opponent gets free invoke
          {/if}
        </div>
      </details>
    </div>
  {/if}

  <!-- Controls -->
  <div class="tp-dice-controls">
    <button
      class="dr-btn"
      disabled={rolling}
      on:click={() => doRoll({ l: '4dF', v: 0 })}
      aria-label="Roll 4 Fate dice"
    >{rolling ? '…' : '🎲 Roll 4dF'}</button>

    {#if phase === 'done'}
      <button
        class="dr-btn"
        class:tp-dice-boosted={boosted}
        disabled={!player || (player.fp || 0) <= 0 || boosted}
        on:click={() => { if (!player || boosted || result == null) return; if (spendFP) spendFP(selId); boosted = true; }}
        title="Spend 1 FP for +2"
        style="min-width:0; padding:6px 16px"
      >{boosted ? '✅ +2' : '⦿ FP +2'}</button>
    {/if}

    <!-- Opposition selector -->
    <div class="tp-dice-opp">
      <span class="tp-dice-opp-label">vs</span>
      <div class="tp-ladder-wrap">
        <button
          class="tp-ladder-sel"
          on:click={() => ladderOpen = !ladderOpen}
          aria-expanded={String(ladderOpen)}
          aria-haspopup="listbox"
          title="Select opposition difficulty"
        >
          <span class="tp-ladder-val" style="color:{tpLcolHex(diff)}">{diff >= 0 ? '+' : ''}{diff}</span>
          <span class="tp-ladder-name">{tpLbl(diff)}</span>
          <span class="tp-ladder-chev">{ladderOpen ? '▴' : '▾'}</span>
        </button>

        {#if ladderOpen}
          <div class="tp-ladder-dropdown" role="listbox" aria-label="Fate Ladder">
            {#each TP_LADDER as row}
              {@const sel = row.v === diff}
              <button
                class="tp-ladder-opt"
                class:selected={sel}
                role="option"
                aria-selected={String(sel)}
                on:click={() => { diff = row.v; ladderOpen = false; }}
              >
                <span class="tp-ladder-opt-val" style="color:{tpLcolHex(row.v)}">{row.v >= 0 ? '+' : ''}{row.v}</span>
                <span class="tp-ladder-opt-name">{row.l}</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Skill pills -->
  {#if player && (player.skills || []).length > 0}
    <div class="tp-dice-skills">
      {#each player.skills as sk}
        {@const v      = sk.v != null ? sk.v : sk.r || 0}
        {@const isSel  = activeSk && (activeSk.l || activeSk.name) === (sk.l || sk.name)}
        <button
          class="tp-dice-skill-pill"
          class:active={isSel}
          on:click={() => doRoll(sk)}
        >
          <span class="tp-dice-skill-name">{sk.l || sk.name}</span>
          <span class="tp-dice-skill-val" style="color:{tpLcolHex(v)}">{v >= 0 ? '+' : ''}{v}</span>
        </button>
      {/each}
    </div>
  {/if}

  <!-- History -->
  {#if history.length > 0}
    <div class="tp-dice-history">
      <span class="tp-dice-hist-label">History</span>
      {#each history.slice(0, 5) as r}
        <span class="tp-dice-hist-entry">
          <span style="font-weight:800; color:{tpLcolHex(r.total)}">{r.total >= 0 ? '+' : ''}{r.total}</span>
          {' '}{r.skill}
          <span style="color:var(--text-muted); font-size:10px"> · {r.who}</span>
        </span>
      {/each}
    </div>
  {/if}

  <!-- Stats (after 3+ rolls) -->
  {#if stats}
    <details class="tp-dice-stats">
      <summary class="tp-dice-stats-toggle">📊 Stats ({history.length} rolls)</summary>
      <div class="tp-dice-stats-body">
        <div class="tp-dice-stats-row">
          <span>Avg: <strong style="color:{tpLcolHex(Math.round(stats.avg))}">{stats.avg.toFixed(1)}</strong></span>
          <span>High: <strong style="color:{tpLcolHex(stats.hi)}">+{stats.hi}</strong></span>
          <span>Low: <strong style="color:{tpLcolHex(stats.lo)}">{stats.lo >= 0 ? '+' : ''}{stats.lo}</strong></span>
        </div>
        {#each Object.keys(stats.byPlayer) as name}
          {@const rolls = stats.byPlayer[name]}
          {@const pAvg  = rolls.reduce((a,b) => a+b, 0) / rolls.length}
          <div class="tp-dice-stats-player">
            <span>{name}</span>
            <span>{rolls.length} rolls</span>
            <span style="color:{tpLcolHex(Math.round(pAvg))}; font-weight:700">avg {pAvg.toFixed(1)}</span>
          </div>
        {/each}
      </div>
    </details>
  {/if}
</div>
