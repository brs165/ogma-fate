<script>
  // ── PlayPanel — tabs: Players | Generate in Play mode; accordion in Prep ──────
  import PlayerRow from './PlayerRow.svelte';

  let {
    players = [], selPlayer = null,
    onSel = null, onUpd = null, onAdd = null,
    gmPool = 0, updGmPool = null,
    onQuickNpc = null, onStarterScene = null, onCompel = null,
    collapsed = false,
    // Generator pass-through for play mode "Generate" tab
    activeGen = 'npc_minor', onSelectGen = null,
    campId = '', campName = '',
  } = $props();

  let open = $state(false);
  let tab = $state('players'); // 'players' | 'generate'

  const PLAY_GENS = [
    { id: 'npc_minor',   icon: '🧑', label: 'Minor NPC',      sub: 'name · aspect · weakness' },
    { id: 'npc_major',   icon: '👑', label: 'Major NPC',      sub: '5 aspects · skills · stunts' },
    { id: 'scene',       icon: '🔥', label: 'Scene Setup',    sub: 'aspects · zones · framing' },
    { id: 'encounter',   icon: '⚔',  label: 'Encounter',      sub: 'opposition · stakes' },
    { id: 'compel',      icon: '↩',  label: 'Compel',         sub: 'make an aspect cause trouble' },
    { id: 'complication',icon: '⚠',  label: 'Complication',   sub: 'aspect that makes things harder' },
    { id: 'countdown',   icon: '⏳', label: 'Countdown',      sub: 'ticking clock · trigger' },
    { id: 'consequence', icon: '❤',  label: 'Consequence',    sub: 'named lasting harm aspect' },
    { id: 'custom',      icon: '✎',  label: 'Custom Card',    sub: 'blank — fill in as you play' },
    { id: 'sticky',      icon: '📝', label: 'Aspect Sticky',  sub: 'free-text aspect note' },
    { id: 'boost',       icon: '⚡', label: 'Boost',           sub: 'temp aspect — 1 invoke' },
  ];
</script>

{#if collapsed}
  <!-- ── PREP MODE: compact player accordion ─────────────────────────────── -->
  <div class="blp-roster-acc">
    <button
      class="blp-roster-hdr"
      onclick={() => (open = !open)}
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
          <PlayerRow player={p} sel={selPlayer === p.id} {onSel}
            onUpd={patch => onUpd && onUpd(p.id, patch)} />
        {/each}
        <button class="rs-add-player" aria-label="Add player" onclick={onAdd}>+ Add Player</button>
      </div>
    {/if}
  </div>

{:else}
  <!-- ── PLAY MODE: tabbed panel ─────────────────────────────────────────── -->
  <div class="blp play-panel">

    <!-- Tab strip -->
    <div class="blp-tabs play-tabs">
      <button
        class="blp-tab{tab === 'players' ? ' active' : ''}"
        onclick={() => tab = 'players'}
        aria-selected={tab === 'players'}
      >👥 Players{players.length > 0 ? ` (${players.length})` : ''}</button>
      <button
        class="blp-tab{tab === 'generate' ? ' active' : ''}"
        onclick={() => tab = 'generate'}
        aria-selected={tab === 'generate'}
      >⚡ Generate</button>
    </div>

    <!-- ── PLAYERS TAB ────────────────────────────────────────────────────── -->
    {#if tab === 'players'}
      <div class="blp-body">

        <!-- GM Fate Point Pool -->
        {#if updGmPool}
          <div class="rs-gm-pool{gmPool === 0 ? ' rs-gm-pool-empty' : ''}">
            <span class="rs-gm-pool-label">GM Pool</span>
            <button class="rs-fp-btn" onclick={() => updGmPool(-1)} aria-label="Spend GM fate point">−</button>
            <span class="rs-gm-pool-val" style="color:{gmPool === 0 ? 'var(--c-red)' : 'var(--accent)'}">{gmPool}</span>
            <button class="rs-fp-btn" onclick={() => updGmPool(1)} aria-label="Gain GM fate point">+</button>
            <span class="rs-gm-pool-hint">NPC invokes</span>
          </div>
        {/if}

        {#if players.length === 0}
          <div class="play-empty-state">
            <div style="font-size:24px; margin-bottom:8px">👥</div>
            <div style="font-weight:600; margin-bottom:4px">No players yet</div>
            <div style="font-size:11px; color:var(--text-muted)">Add players to track FP and stress.</div>
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

        <button class="rs-add-player" aria-label="Add player" onclick={onAdd}>+ Add Player</button>

        {#if onStarterScene}
          <button class="rs-add-player rs-starter-btn" aria-label="Generate starter scene" onclick={onStarterScene}>
            🎬 Starter Scene
          </button>
        {/if}
      </div>

    <!-- ── GENERATE TAB ───────────────────────────────────────────────────── -->
    {:else}
      <div class="blp-body play-gen-list">
        <div class="play-gen-hint">Click to generate &amp; place on canvas</div>
        {#each PLAY_GENS as g (g.id)}
          <button
            class="play-gen-item{activeGen === g.id ? ' active' : ''}"
            onclick={() => onSelectGen && onSelectGen(g.id)}
            aria-label="Generate {g.label}"
          >
            <span class="play-gen-icon">{g.icon}</span>
            <span class="play-gen-text">
              <span class="play-gen-label">{g.label}</span>
              <span class="play-gen-sub">{g.sub}</span>
            </span>
          </button>
        {/each}

        {#if onQuickNpc}
          <button class="rs-add-player" style="margin-top:8px; border-color:var(--c-red); color:var(--c-red)"
            aria-label="Generate quick NPC" onclick={onQuickNpc}>
            ⚡ Quick NPC
          </button>
        {/if}
      </div>
    {/if}
  </div>
{/if}
