<script>
  // ── AddMenu — canvas controls dropdown for generating cards and dropping templates ──
  import { DropdownMenu } from 'bits-ui';

  let { onGenerate = null, onTemplate = null, onAddGroup = null, templates = [] } = $props();

  const GEN_ITEMS = [
    { id: 'npc_minor',  icon: 'fa-user',        label: 'Minor NPC',      tip: 'Quick NPC with aspects and a skill' },
    { id: 'npc_major',  icon: 'fa-crown',        label: 'Major NPC',      tip: 'Full stat block with stress and stunts' },
    { id: 'scene',      icon: 'fa-fire',         label: 'Scene Setup',    tip: 'Aspects, zones, and framing questions' },
    { id: 'encounter',  icon: 'fa-burst',        label: 'Encounter',      tip: 'Opposition with win/lose conditions' },
    { id: 'compel',     icon: 'fa-rotate-left',  label: 'Compel',         tip: 'Compel on a character or situation aspect' },
    { id: 'custom',     icon: 'fa-pen',          label: 'Custom Card',    tip: 'Blank card you can fill in yourself' },
    { id: 'sticky',     icon: 'fa-note-sticky',  label: 'Aspect Sticky',  tip: 'Sticky note for tracking an aspect' },
    { id: 'boost',      icon: 'fa-bolt',         label: 'Boost',          tip: 'Temporary boost with free invoke' },
    { id: 'label',      icon: 'fa-bookmark',     label: 'Section Label',  tip: 'Text label to organise your table' },
    { id: '__group__',  icon: 'fa-layer-group',  label: 'Scene Group',    tip: 'Group box to visually cluster cards' },
  ];
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="cv-ctrl-btn" aria-label="Add to table" title="Add to Table">
    <i class="fa-solid fa-file-circle-plus" aria-hidden="true"></i>
  </DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content class="add-dd-content" side="top" sideOffset={6} align="end">
      <DropdownMenu.Label class="export-dd-label">Generate</DropdownMenu.Label>
      <DropdownMenu.Separator class="export-dd-sep" />
      {#each GEN_ITEMS as g (g.id)}
        <DropdownMenu.Item
          class="export-dd-item"
          onSelect={() => {
            if (g.id === '__group__') { onAddGroup?.(); }
            else { onGenerate?.(g.id); }
          }}
        >
          <span class="export-dd-icon"><i class="fa-solid {g.icon}" aria-hidden="true"></i></span>
          <span class="export-dd-body">
            <span class="export-dd-name">{g.label}</span>
            <span class="export-dd-sub">{g.tip}</span>
          </span>
        </DropdownMenu.Item>
      {/each}
      {#if templates.length > 0}
        <DropdownMenu.Separator class="export-dd-sep" />
        <DropdownMenu.Label class="export-dd-label">Templates</DropdownMenu.Label>
        <DropdownMenu.Separator class="export-dd-sep" />
        {#each templates as t (t.id)}
          <DropdownMenu.Item
            class="export-dd-item"
            onSelect={() => onTemplate?.(t.id)}
          >
            <span class="export-dd-icon"><i class="fa-solid {t.icon}" aria-hidden="true"></i></span>
            <span class="export-dd-body">
              <span class="export-dd-name">{t.label}</span>
              <span class="export-dd-sub">{t.desc}</span>
            </span>
          </DropdownMenu.Item>
        {/each}
      {/if}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
