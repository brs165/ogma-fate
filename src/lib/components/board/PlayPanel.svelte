<script>
  // ── PlayPanel — tabs: Players | Generate in Play mode; accordion in Prep ──────
  import { Tabs, Collapsible } from 'bits-ui';
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
    { id: 'npc_minor',   icon: '\u{1F9D1}', label: 'Minor NPC',      sub: 'name \u00b7 aspect \u00b7 weakness' },
    { id: 'npc_major',   icon: '\u{1F451}', label: 'Major NPC',      sub: '5 aspects \u00b7 skills \u00b7 stunts' },
    { id: 'scene',       icon: '\u{1F525}', label: 'Scene Setup',    sub: 'aspects \u00b7 zones \u00b7 framing' },
    { id: 'encounter',   icon: '\u2694',  label: 'Encounter',      sub: 'opposition \u00b7 stakes' },
    { id: 'compel',      icon: '\u21A9',  label: 'Compel',         sub: 'make an aspect cause trouble' },
    { id: 'complication',icon: '\u26A0',  label: 'Complication',   sub: 'aspect that makes things harder' },
    { id: 'countdown',   icon: '\u23F3', label: 'Countdown',      sub: 'ticking clock \u00b7 trigger' },
    { id: 'consequence', icon: '\u2764',  label: 'Consequence',    sub: 'named lasting harm aspect' },
    { id: 'custom',      icon: '\u270E',  label: 'Custom Card',    sub: 'blank \u2014 fill in as you play' },
    { id: 'sticky',      icon: '\u{1F4DD}', label: 'Aspect Sticky',  sub: 'free-text aspect note' },
    { id: 'boost',       icon: '\u26A1', label: 'Boost',           sub: 'temp aspect \u2014 1 invoke' },
  ];
</script>

{#if collapsed}
  <!-- ── PREP MODE: compact player accordion ─────────────────────────────── -->
  <Collapsible.Root bind:open class="blp-roster-acc">
    <Collapsible.Trigger class="blp-roster-hdr">
      <span>👥 Players</span>
      {#if players.length > 0}
        <span class="blp-roster-badge">{players.length}</span>
      {/if}
      <span class="blp-roster-chev" aria-hidden="true">›</span>
    </Collapsible.Trigger>
    <Collapsible.Content class="blp-body blp-roster-body">
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
    </Collapsible.Content>
  </Collapsible.Root>

{:else}
  <!-- ── PLAY MODE: tabbed panel ─────────────────────────────────────────── -->
  <Tabs.Root value={tab} onValueChange={(v) => { if (v) tab = v; }} class="blp play-panel">

    <Tabs.List class="blp-tabs play-tabs" aria-label="Play panel tabs">
      <Tabs.Trigger value="players" class="blp-tab">👥 Players{players.length > 0 ? ` (${players.length})` : ''}</Tabs.Trigger>
      <Tabs.Trigger value="generate" class="blp-tab">⚡ Generate</Tabs.Trigger>
    </Tabs.List>

    <!-- ── PLAYERS TAB ────────────────────────────────────────────────────── -->
    <Tabs.Content value="players" class="blp-body blp-tab-content">

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
    </Tabs.Content>

    <!-- ── GENERATE TAB ───────────────────────────────────────────────────── -->
    <Tabs.Content value="generate" class="blp-body play-gen-list blp-tab-content">
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
    </Tabs.Content>
  </Tabs.Root>
{/if}
