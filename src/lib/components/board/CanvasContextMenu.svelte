<script>
  // CanvasContextMenu — right-click menu for canvas card generation
  // No SvelteFlow dependency — coords computed by Board.svelte screenToCanvas()

  let { ctx = null, onClose = null, onGenerate = null } = $props();

  const CTX_ITEMS = [
    { id: 'npc_minor',   icon: '\u{1F9D1}', label: 'Minor NPC' },
    { id: 'npc_major',   icon: '\u{1F451}', label: 'Major NPC' },
    { id: 'scene',       icon: '\u{1F525}', label: 'Scene Setup' },
    { id: 'encounter',   icon: '\u2694',    label: 'Encounter' },
    { id: 'compel',      icon: '\u21A9',    label: 'Compel' },
    { id: 'custom',      icon: '\u270E',    label: 'Custom Card' },
    { id: 'sticky',      icon: '\u{1F4DD}', label: 'Aspect Sticky' },
    { id: 'boost',       icon: '\u26A1',    label: 'Boost' },
    { id: 'label',       icon: '\u{1F516}', label: 'Section Label' },
  ];

  function generate(genId) {
    if (!ctx || !onGenerate) return;
    // ctx.canvasX/canvasY already converted by Board.svelte screenToCanvas()
    onGenerate(genId, ctx.canvasX, ctx.canvasY);
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
