<script>
  import HelpPanel from '../board/HelpPanel.svelte';
  import StuntPanel from '../board/StuntPanel.svelte';
  import MonitorPanel from '../board/MonitorPanel.svelte';
  import { Tabs, ScrollArea } from 'bits-ui';
  // Derive world stunts from CAMPAIGNS global
  let {
    activeGen = 'npc_minor',
    onSelectGen = () => {},
    campId = '',
    activeTab = 'gen',
    onTabChange = () => {},
    campName = '',
    cards = [],
    onPanToCard = () => {},
    onUpdateCard = null,
    showConflictGrid = false,
    onToggleConflictGrid = () => {},
    sessionHistory = [],
    pinnedCards = [],
  } = $props();

  let worldStunts = $derived((typeof globalThis.CAMPAIGNS !== 'undefined' && globalThis.CAMPAIGNS[campId] &&
    globalThis.CAMPAIGNS[campId].tables && globalThis.CAMPAIGNS[campId].tables.stunts)
    ? globalThis.CAMPAIGNS[campId].tables.stunts : []);

  const BOARD_GEN_GROUPS = [
    {
      id: 'characters', label: 'Characters',
      gens: [
        { id: 'npc_minor', label: 'Minor NPC', sub: 'name \u00b7 aspect \u00b7 weakness', icon: 'fa-user' },
        { id: 'npc_major', label: 'Major NPC', sub: '5 aspects \u00b7 skills \u00b7 stunts', icon: 'fa-crown' },
        { id: 'npc_instant', label: 'Instant NPC', sub: 'quick stat at chosen power level', icon: 'fa-bolt-lightning' },
        { id: 'backstory', label: 'PC Backstory', sub: 'hook \u00b7 secret \u00b7 connection', icon: 'fa-masks-theater' },
      ]
    },
    {
      id: 'scenes', label: 'Scenes',
      gens: [
        { id: 'scene', label: 'Scene Setup', sub: 'aspects \u00b7 zones \u00b7 framing', icon: 'fa-fire' },
        { id: 'scene_hook', label: 'Scene Hook', sub: 'aspect + two compel suggestions', icon: 'fa-anchor' },
        { id: 'encounter', label: 'Encounter', sub: 'opposition \u00b7 aspects \u00b7 stakes', icon: 'fa-burst' },
        { id: 'location_flavor', label: 'Location Flavor', sub: 'description \u00b7 zones \u00b7 hidden aspect', icon: 'fa-map-location-dot' },
        { id: 'complication', label: 'Complication', sub: 'aspect that makes things harder', icon: 'fa-triangle-exclamation' },
      ]
    },
    {
      id: 'pacing', label: 'Pacing',
      gens: [
        { id: 'challenge', label: 'Challenge', sub: 'sequence of overcome rolls', icon: 'fa-bullseye' },
        { id: 'contest', label: 'Contest', sub: 'race to 3 victories', icon: 'fa-trophy' },
        { id: 'obstacle', label: 'Obstacle', sub: 'passive opposition \u00b7 disable', icon: 'fa-shield-halved' },
        { id: 'countdown', label: 'Countdown', sub: 'ticking clock \u00b7 trigger', icon: 'fa-clock' },
        { id: 'constraint', label: 'Constraint', sub: 'rule that limits the scene', icon: 'fa-lock' },
      ]
    },
    {
      id: 'world', label: 'World',
      gens: [
        { id: 'campaign', label: 'Campaign Frame', sub: 'issues \u00b7 factions \u00b7 themes', icon: 'fa-globe' },
        { id: 'seed', label: 'Adventure Seed', sub: '3-scene sketch \u00b7 opposition', icon: 'fa-seedling' },
        { id: 'faction', label: 'Faction', sub: 'goal \u00b7 method \u00b7 weakness', icon: 'fa-flag' },
        { id: 'compel', label: 'Compel', sub: 'make an aspect cause trouble', icon: 'fa-rotate-left' },
        { id: 'consequence', label: 'Consequence', sub: 'named lasting harm aspect', icon: 'fa-bolt' },
      ]
    },
    {
      id: 'tools', label: 'Canvas Tools', separator: true,
      gens: [
        { id: 'custom', label: 'Custom Card', sub: 'blank \u2014 fill in as you play', icon: 'fa-pen' },
        { id: 'sticky', label: 'Aspect Sticky', sub: 'free-text aspect note', icon: 'fa-note-sticky' },
        { id: 'boost', label: 'Boost', sub: 'temp aspect \u2014 1 invoke then gone', icon: 'fa-bolt' },
        { id: 'label', label: 'Section Label', sub: 'organise your canvas', icon: 'fa-bookmark' },
      ]
    },
  ];
</script>

<div class="blp">
  <Tabs.Root value={activeTab} onValueChange={(v) => onTabChange(v)}>
    <Tabs.List aria-label="Panel sections">
      <Tabs.Trigger value="gen">Generate</Tabs.Trigger>
      <Tabs.Trigger value="monitor">Monitor</Tabs.Trigger>
      <Tabs.Trigger value="stunts">Stunts</Tabs.Trigger>
      <Tabs.Trigger value="help">Help</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="gen">
      <ScrollArea.Root>
        <ScrollArea.Viewport>
          <div class="blp-body">
            {#each BOARD_GEN_GROUPS as group (group.id)}
              {#if group.separator}
                <div class="blp-separator">{group.label}</div>
              {:else}
                <div class="blp-group">{group.label}</div>
              {/if}
              {#each group.gens as gen (gen.id)}
                <button
                  class="blp-item" class:active={activeGen === gen.id}
                  onclick={() => onSelectGen(gen.id)}
                  onkeydown={(e) => {
                    if (e.key === 'ArrowDown') { e.preventDefault(); e.currentTarget.nextElementSibling?.focus(); }
                    if (e.key === 'ArrowUp') { e.preventDefault(); e.currentTarget.previousElementSibling?.focus(); }
                  }}
                  aria-label="{gen.label}{gen.sub ? ' \u2014 ' + gen.sub : ''}"
                >
                  <span class="blp-icon"><i class="fa-solid {gen.icon}" aria-hidden="true"></i></span>
                  <div class="blp-label-wrap">
                    <span class="blp-label">{gen.label}</span>
                    {#if gen.sub}
                      <span class="blp-sub">{gen.sub}</span>
                    {/if}
                  </div>
                </button>
              {/each}
            {/each}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </Tabs.Content>

    <Tabs.Content value="monitor">
      <MonitorPanel
        {cards}
        {onPanToCard}
        {onUpdateCard}
        {showConflictGrid}
        {onToggleConflictGrid}
      />
    </Tabs.Content>

    <Tabs.Content value="stunts">
      <StuntPanel worldStunts={worldStunts} />
    </Tabs.Content>

    <Tabs.Content value="help">
      <HelpPanel {activeGen} />
    </Tabs.Content>
  </Tabs.Root>
</div>
