<svelte:options runes={false} />

<script>
  // ── PlayPanel — left panel in Play mode; compact accordion in Prep mode ───────
  import PlayerRow from './PlayerRow.svelte';

  export let players        = [];
  export let selPlayer      = null;
  export let onSel          = null;
  export let onUpd          = null;
  export let onAdd          = null;
  export let gmPool         = 0;
  export let updGmPool      = null;
  export let onQuickNpc     = null;
  export let onStarterScene = null;
  export let onCompel       = null;
  export let collapsed      = false;  // UNI-05: true in PREP mode

  let open = false;
</script>

{#if collapsed}
  <!-- PREP mode: compact accordion -->
  <div class="blp-roster-acc">
    <button
      class="blp-roster-hdr"
      on:click={() => (open = !open)}
      aria-expanded={String(open)}
    >
      <span>👥 Players</span>
      {#if players.length > 0}
        <span class="blp-roster-badge">{players.length}</span>
      {/if}
      <span class="blp-roster-chev" style="display:inline-block;
        transform:{open ? 'rotate(90deg)' : 'rotate(0deg)'};
        transition:transform .18s cubic-bezier(.34,1.56,.64,1); font-size:10px">›</span>
    </button>

    {#if open}
      <div class="blp-body blp-roster-body">
        {#if players.length === 0}
          <div style="padding:10px 8px; text-align:center; color:var(--text-muted); font-size:11px">
            No players yet. Add before session start.
          </div>
        {/if}
        {#each players as p (p.id)}
          <PlayerRow
            player={p}
            sel={selPlayer === p.id}
            {onSel}
            onUpd={patch => onUpd && onUpd(p.id, patch)}
          />
        {/each}
        <button class="rs-add-player" aria-label="Add player" on:click={onAdd}>+ Add Player</button>
      </div>
    {/if}
  </div>

{:else}
  <!-- PLAY mode: full panel -->
  <div class="blp">
    <div class="blp-tabs">
      <span class="blp-tab active" style="pointer-events:none; color:var(--c-green,#30d158)">▶ Play Mode</span>
    </div>
    <div class="blp-body">
      <!-- GM Fate Point Pool -->
      {#if updGmPool}
        <div class="rs-gm-pool">
          <span class="rs-gm-pool-label">GM Pool</span>
          <button class="rs-fp-btn" on:click={() => updGmPool(-1)} aria-label="Spend GM fate point">−</button>
          <span class="rs-gm-pool-val" style="color:{gmPool === 0 ? 'var(--c-red)' : 'var(--accent)'}">{gmPool}</span>
          <button class="rs-fp-btn" on:click={() => updGmPool(1)} aria-label="Gain GM fate point">+</button>
          <span class="rs-gm-pool-hint">NPC invokes</span>
        </div>
      {/if}

      {#if players.length === 0}
        <div style="padding:16px 8px; text-align:center; color:var(--text-muted); font-size:12px">
          <div style="margin-bottom:8px">👥</div>
          <div>No players yet.</div>
          <div style="font-size:11px; margin-top:4px">Add players to track FP and stress.</div>
        </div>
      {/if}

      {#each players as p (p.id)}
        <PlayerRow
          player={p}
          sel={selPlayer === p.id}
          {onSel}
          onUpd={patch => onUpd && onUpd(p.id, patch)}
          onCompel={onCompel ? player => onCompel(player) : null}
        />
      {/each}

      <button class="rs-add-player" aria-label="Add player" on:click={onAdd}>+ Add Player</button>

      {#if onQuickNpc}
        <button class="rs-add-player" aria-label="Generate quick NPC" on:click={onQuickNpc}
          style="margin-top:2px; border-color:var(--c-red); color:var(--c-red)">
          ⚡ Quick NPC
        </button>
      {/if}

      {#if onStarterScene}
        <button class="rs-add-player" aria-label="Generate starter scene" on:click={onStarterScene}
          style="margin-top:2px; border-color:var(--c-blue); color:var(--c-blue)">
          🎬 Starter Scene
        </button>
      {/if}
    </div>
  </div>
{/if}
