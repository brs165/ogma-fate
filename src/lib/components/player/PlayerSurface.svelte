<script>
  import { onMount, onDestroy } from 'svelte';
  import Cv4Card from '../cards/Cv4Card.svelte';
  // ── Derived from sync state ────────────────────────────────────────────────
  let { syncState = null, playerName = '', roomCode = '', syncObj = null, syncStatus = 'offline', campId = '' } = $props();
  let cards = $derived((syncState && syncState.cards) || []);
  let fp = $derived(syncState && syncState.fp);
  let players = $derived((syncState && syncState.players) || []);
  let roundInfo = $derived(syncState ? { round: syncState.round || 1, gmPool: syncState.gmPool || 0 } : { round: 1, gmPool: 0 });
  let rollHistory = $derived((syncState && syncState.rollHistory) || []);
  let compelOffer = $derived(syncState && syncState.compelOffer);

  // ── Local state ────────────────────────────────────────────────────────────
  let tentMode = $state(false);
  let showSheet = $state(false);

  // Find this player in the roster
  let myPlayer = $derived(players.find(p => p.name && p.name.toLowerCase() === playerName.toLowerCase()));
  let myFP = $derived(fp && myPlayer ? (fp.pcs || []).find(pc => pc.name && pc.name.toLowerCase() === playerName.toLowerCase()) : null);

  // ── Actions ────────────────────────────────────────────────────────────────
  function sendStressUpdate(patch) {
    if (!syncObj || !syncObj.ws || !myPlayer) return;
    syncObj.ws.send(JSON.stringify({
      type: 'player_action',
      action: 'stress_update',
      playerId: myPlayer.id,
      patch,
    }));
  }

  function sendRoll(rollData) {
    if (!syncObj || !syncObj.ws || !myPlayer) return;
    syncObj.ws.send(JSON.stringify({
      type: 'player_action',
      action: 'player_roll',
      playerId: myPlayer.id,
      roll: { ...rollData, who: playerName },
    }));
  }

  function respondCompel(accepted) {
    if (!syncObj || !syncObj.ws || !myPlayer) return;
    syncObj.ws.send(JSON.stringify({
      type: 'player_action',
      action: 'compel_response',
      playerId: myPlayer.id,
      playerName,
      accepted,
    }));
  }

  function createAspect() {
    const name = prompt('Name the new situation aspect:');
    if (!name || !syncObj || !syncObj.ws) return;
    syncObj.ws.send(JSON.stringify({
      type: 'player_action',
      action: 'player_create_aspect',
      playerName,
      aspectName: name,
    }));
  }

  // Simple dice roller
  let diceResult = $state(null);
  let diceRolling = $state(false);

  function rollFateDice(skill, bonus) {
    diceRolling = true;
    const dice = [0, 0, 0, 0].map(() => Math.floor(Math.random() * 3) - 1);
    const total = dice.reduce((a, b) => a + b, 0) + (bonus || 0);
    setTimeout(() => {
      diceResult = { dice, bonus: bonus || 0, total, skill: skill || 'Roll' };
      diceRolling = false;
      sendRoll({ dice, bonus: bonus || 0, total, skill: skill || 'Roll', who: playerName });
    }, 400);
  }

  const DICE_FACES = { '-1': '\u2212', '0': '0', '1': '+' };
</script>

<div class="player-surface" data-tent={tentMode ? 'true' : 'false'}>

  <!-- Header -->
  <div class="ps-header">
    <span class="ps-player-name">{playerName}</span>
    <span class="ps-room-code">Room {roomCode}</span>
    <button class="ps-tent-btn" onclick={() => { tentMode = !tentMode; }} aria-label={tentMode ? 'Exit tent mode' : 'Tent mode'} title="Tent mode — show your name to the table">
      {tentMode ? '\u{1F441}' : '\u{26FA}'}
    </button>
  </div>

  <!-- Tent mode: just show the name big -->
  {#if tentMode}
    <div class="ps-tent" onclick={() => { tentMode = false; }}>
      <div class="ps-tent-name">{playerName}</div>
      {#if myPlayer && myPlayer.hc}
        <div class="ps-tent-hc">{myPlayer.hc}</div>
      {/if}
    </div>
  {:else}

    <!-- Compel banner -->
    {#if compelOffer && myPlayer && compelOffer.playerId === myPlayer.id}
      <div class="ps-compel-banner" role="alert">
        <div class="ps-compel-icon">&#x21A9;</div>
        <div class="ps-compel-text">
          <strong>Compel:</strong> {compelOffer.aspect}
        </div>
        <div class="ps-compel-actions">
          <button class="ps-compel-btn ps-accept" onclick={() => respondCompel(true)}>Accept (+1 FP)</button>
          <button class="ps-compel-btn ps-refuse" onclick={() => respondCompel(false)}>Refuse (-1 FP)</button>
        </div>
      </div>
    {/if}

    <!-- FP display -->
    {#if myFP}
      <div class="ps-fp-row">
        <span class="ps-fp-label">Fate Points:</span>
        <div class="ps-fp-dots">
          {#each Array(Math.max(myFP.current, myFP.refresh || 3)) as _, i}
            <div class="fp-dot" class:fp-dot-filled={i < myFP.current}></div>
          {/each}
        </div>
        <span class="ps-fp-count">{myFP.current}</span>
      </div>
    {/if}

    <!-- Quick actions -->
    <div class="ps-actions">
      <button class="ps-action-btn" onclick={() => rollFateDice('Roll', 0)} disabled={diceRolling}>
        &#x1F3B2; Roll Fate Dice
      </button>
      <button class="ps-action-btn" onclick={createAspect}>
        &#x2726; Create Aspect
      </button>
      <button class="ps-action-btn" onclick={() => { showSheet = !showSheet; }}>
        &#x1F4CB; {showSheet ? 'Hide Sheet' : 'Character Sheet'}
      </button>
    </div>

    <!-- Dice result -->
    {#if diceResult}
      <div class="ps-dice-result">
        <div class="ps-dice-faces">
          {#each diceResult.dice as d}
            <span class="ps-die" class:ps-die-plus={d > 0} class:ps-die-minus={d < 0}>{DICE_FACES[String(d)]}</span>
          {/each}
        </div>
        <div class="ps-dice-total">
          {diceResult.skill}: {diceResult.total >= 0 ? '+' : ''}{diceResult.total}
        </div>
      </div>
    {/if}

    <!-- Character sheet (if available) -->
    {#if showSheet && myPlayer}
      <div class="ps-sheet">
        {#if myPlayer.hc}
          <div class="ps-sheet-row"><strong>High Concept:</strong> {myPlayer.hc}</div>
        {/if}
        {#if myPlayer.trouble}
          <div class="ps-sheet-row"><strong>Trouble:</strong> {myPlayer.trouble}</div>
        {/if}
        {#if myPlayer.skills && myPlayer.skills.length}
          <div class="ps-sheet-row">
            <strong>Skills:</strong>
            {#each myPlayer.skills as sk}
              <span class="ps-skill-pill">+{sk.r} {sk.name}</span>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Cards on the table (from GM) -->
    {#if cards.length > 0}
      <div class="ps-cards-section">
        <div class="ps-cards-header">On the Table ({cards.length})</div>
        <div class="ps-cards-grid">
          {#each cards as card (card.id)}
            <div class="ps-card-wrap">
              <Cv4Card
                genId={card.genId}
                data={card.data}
                campName=""
              />
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Roll history -->
    {#if rollHistory.length > 0}
      <div class="ps-history">
        <div class="ps-history-header">Recent Rolls</div>
        {#each rollHistory.slice(0, 6) as r}
          <div class="ps-history-row">
            <span class="ps-history-who">{r.who}</span>
            <span class="ps-history-skill">{r.skill}</span>
            <span class="ps-history-total" class:positive={r.total >= 0} class:negative={r.total < 0}>
              {r.total >= 0 ? '+' : ''}{r.total}
            </span>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
