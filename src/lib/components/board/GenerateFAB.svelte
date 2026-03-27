<script>
  // ── GenerateFAB — mobile floating action button for canvas generation ─────────
  // Replaces right-click context menu on touch devices
  import { DropdownMenu } from 'bits-ui';

  let { onGenerate = null, activeGen = 'npc_minor' } = $props();

  const FAB_ITEMS = [
    { id: 'npc_minor',   icon: 'fa-user', label: 'Minor NPC' },
    { id: 'npc_major',   icon: 'fa-crown', label: 'Major NPC' },
    { id: 'scene',       icon: 'fa-fire', label: 'Scene Setup' },
    { id: 'encounter',   icon: 'fa-burst',  label: 'Encounter' },
    { id: 'compel',      icon: 'fa-rotate-left',  label: 'Compel' },
    { id: 'sticky',      icon: 'fa-note-sticky', label: 'Aspect Sticky' },
    { id: 'boost',       icon: 'fa-bolt', label: 'Boost' },
    { id: 'custom',      icon: 'fa-pen',  label: 'Custom Card' },
    { id: 'countdown',   icon: 'fa-clock', label: 'Countdown' },
    { id: 'label',       icon: 'fa-bookmark', label: 'Section Label' },
  ];
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="gen-fab" aria-label="Generate card">
    +
  </DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content class="gen-fab-content" side="top" align="end" sideOffset={12}>
      <DropdownMenu.Label class="gen-fab-label">Generate</DropdownMenu.Label>
      <DropdownMenu.Separator class="export-dd-sep" />
      {#each FAB_ITEMS as g (g.id)}
        <DropdownMenu.Item
          class="gen-fab-item{activeGen === g.id ? ' active' : ''}"
          onSelect={() => onGenerate?.(g.id)}
        >
          <span class="gen-fab-icon"><i class="fa-solid {g.icon}" aria-hidden="true"></i></span>
          <span class="gen-fab-name">{g.label}</span>
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
