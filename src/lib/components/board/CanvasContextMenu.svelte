<script>
  // CanvasContextMenu — lives inside <SvelteFlow> tree so useSvelteFlow() works
  import { useSvelteFlow, Panel } from '@xyflow/svelte';
  import { getContext } from 'svelte';

  let { ctx = null, onClose = null, onGenerate = null } = $props();

  const { screenToFlowPosition } = useSvelteFlow();

  const CTX_ITEMS = [
    { id: 'npc_minor',   icon: '🧑', label: 'Minor NPC' },
    { id: 'npc_major',   icon: '👑', label: 'Major NPC' },
    { id: 'scene',       icon: '🔥', label: 'Scene Setup' },
    { id: 'encounter',   icon: '⚔',  label: 'Encounter' },
    { id: 'compel',      icon: '↩',  label: 'Compel' },
    { id: 'custom',      icon: '✎',  label: 'Custom Card' },
    { id: 'sticky',      icon: '📝', label: 'Aspect Sticky' },
    { id: 'boost',       icon: '⚡', label: 'Boost' },
    { id: 'label',       icon: '🔖', label: 'Section Label' },
  ];

  function generate(genId) {
    if (!ctx || !onGenerate) return;
    // Convert screen coords → canvas coords using SvelteFlow API
    const canvasPos = screenToFlowPosition({ x: ctx.screenX, y: ctx.screenY });
    onGenerate(genId, canvasPos.x, canvasPos.y);
    if (onClose) onClose();
  }
</script>

{#if ctx}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="board-ctx"
    role="menu"
    aria-label="Generate card at position"
    tabindex="-1"
    style="left:{ctx.screenX}px;top:{ctx.screenY}px;position:fixed;z-index:9999"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => { if (e.key === 'Escape') onClose?.(); }}
  >
    <div class="board-ctx-section" role="none">Generate here</div>
    {#each CTX_ITEMS as g (g.id)}
      <div
        class="board-ctx-item"
        role="menuitem"
        tabindex="0"
        onclick={() => generate(g.id)}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); generate(g.id); } }}
      >
        <span class="board-ctx-icon" aria-hidden="true">{g.icon}</span>{g.label}
      </div>
    {/each}
    <div class="board-ctx-sep" role="separator"></div>
    <div
      class="board-ctx-item"
      role="menuitem"
      tabindex="0"
      onclick={onClose}
      onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClose?.(); } }}
    >
      <span class="board-ctx-icon" aria-hidden="true">&times;</span> Cancel
    </div>
  </div>
{/if}
