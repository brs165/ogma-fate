<svelte:options runes={false} />

<script>
  import HelpPanel from '../board/HelpPanel.svelte';
  import StuntPanel from '../board/StuntPanel.svelte';

  export let activeGen = 'npc_minor';
  export let onSelectGen = () => {};
  export let campId = '';
  export let activeTab = 'gen';
  export let onTabChange = () => {};
  export let campName = '';

  // Derive world stunts from CAMPAIGNS global
  $: worldStunts = (typeof globalThis.CAMPAIGNS !== 'undefined' && globalThis.CAMPAIGNS[campId] &&
    globalThis.CAMPAIGNS[campId].tables && globalThis.CAMPAIGNS[campId].tables.stunts)
    ? globalThis.CAMPAIGNS[campId].tables.stunts : [];

  const BOARD_GEN_GROUPS = [
    {
      id: 'characters', label: 'Characters',
      gens: [
        { id: 'npc_minor', label: 'Minor NPC', sub: 'name \u00b7 aspect \u00b7 weakness', icon: '\u{1F9D1}' },
        { id: 'npc_major', label: 'Major NPC', sub: '5 aspects \u00b7 skills \u00b7 stunts', icon: '\u{1F451}' },
        { id: 'backstory', label: 'PC Backstory', sub: 'hook \u00b7 secret \u00b7 connection', icon: '\u{1F3AD}' },
      ]
    },
    {
      id: 'scenes', label: 'Scenes',
      gens: [
        { id: 'scene', label: 'Scene Setup', sub: 'aspects \u00b7 zones \u00b7 framing', icon: '\u{1F525}' },
        { id: 'encounter', label: 'Encounter', sub: 'opposition \u00b7 aspects \u00b7 stakes', icon: '\u2694' },
        { id: 'complication', label: 'Complication', sub: 'aspect that makes things harder', icon: '\u26A0' },
      ]
    },
    {
      id: 'pacing', label: 'Pacing',
      gens: [
        { id: 'challenge', label: 'Challenge', sub: 'sequence of overcome rolls', icon: '\u{1F3AF}' },
        { id: 'contest', label: 'Contest', sub: 'race to 3 victories', icon: '\u{1F3C6}' },
        { id: 'obstacle', label: 'Obstacle', sub: 'passive opposition \u00b7 disable', icon: '\u{1F6E1}' },
        { id: 'countdown', label: 'Countdown', sub: 'ticking clock \u00b7 trigger', icon: '\u23F3' },
        { id: 'constraint', label: 'Constraint', sub: 'rule that limits the scene', icon: '\u{1F512}' },
      ]
    },
    {
      id: 'world', label: 'World',
      gens: [
        { id: 'campaign', label: 'Campaign Frame', sub: 'issues \u00b7 factions \u00b7 themes', icon: '\u{1F3F0}' },
        { id: 'seed', label: 'Adventure Seed', sub: '3-scene sketch \u00b7 opposition', icon: '\u{1F33F}' },
        { id: 'faction', label: 'Faction', sub: 'goal \u00b7 method \u00b7 weakness', icon: '\u{1F6A9}' },
        { id: 'compel', label: 'Compel', sub: 'make an aspect cause trouble', icon: '\u21A9' },
        { id: 'consequence', label: 'Consequence', sub: 'named lasting harm aspect', icon: '\u2764' },
      ]
    },
    {
      id: 'tools', label: 'Canvas Tools', separator: true,
      gens: [
        { id: 'custom', label: 'Custom Card', sub: 'blank \u2014 fill in as you play', icon: '\u270E' },
        { id: 'sticky', label: 'Aspect Sticky', sub: 'free-text aspect note', icon: '\u{1F4DD}' },
        { id: 'boost', label: 'Boost', sub: 'temp aspect \u2014 1 invoke then gone', icon: '\u26A1' },
        { id: 'label', label: 'Section Label', sub: 'organise your canvas', icon: '\u{1F516}' },
      ]
    },
  ];
</script>

<div class="blp">
  <div class="blp-tabs">
    <button class="blp-tab" class:active={activeTab === 'gen'} on:click={() => onTabChange('gen')}>Generate</button>
    <button class="blp-tab" class:active={activeTab === 'stunts'} on:click={() => onTabChange('stunts')}>Stunts</button>
    <button class="blp-tab" class:active={activeTab === 'help'} on:click={() => onTabChange('help')}>Help</button>
  </div>

  {#if activeTab === 'gen'}
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
            on:click={() => onSelectGen(gen.id)}
            title="{gen.label}{gen.sub ? ' \u2014 ' + gen.sub : ''}"
          >
            <span class="blp-icon">{gen.icon}</span>
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
  {/if}

  {#if activeTab === 'stunts'}
    <StuntPanel worldStunts={worldStunts} />
  {/if}

  {#if activeTab === 'help'}
    <HelpPanel />
  {/if}
</div>
