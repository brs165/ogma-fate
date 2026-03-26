<script>
  // ── GenerateFAB — mobile floating action button for canvas generation ─────────
  // Replaces right-click context menu on touch devices
  import { DropdownMenu } from 'bits-ui';

  let { onGenerate = null, activeGen = 'npc_minor' } = $props();

  const FAB_ITEMS = [
    { id: 'npc_minor',   icon: '🧑', label: 'Minor NPC' },
    { id: 'npc_major',   icon: '👑', label: 'Major NPC' },
    { id: 'scene',       icon: '🔥', label: 'Scene Setup' },
    { id: 'encounter',   icon: '⚔',  label: 'Encounter' },
    { id: 'compel',      icon: '↩',  label: 'Compel' },
    { id: 'sticky',      icon: '📝', label: 'Aspect Sticky' },
    { id: 'boost',       icon: '⚡', label: 'Boost' },
    { id: 'custom',      icon: '✎',  label: 'Custom Card' },
    { id: 'countdown',   icon: '⏳', label: 'Countdown' },
    { id: 'label',       icon: '🔖', label: 'Section Label' },
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
          <span class="gen-fab-icon">{g.icon}</span>
          <span class="gen-fab-name">{g.label}</span>
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
