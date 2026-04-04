<script>
  // CanvasContextMenu — right-click menu for canvas card generation
  // No SvelteFlow dependency — coords computed by Board.svelte screenToCanvas()

  let { ctx = null, onClose = null, onGenerate = null, onTemplate = null, templates = [] } = $props();

  const CTX_ITEMS = [
    { id: 'npc_minor',   icon: 'fa-user', label: 'Minor NPC' },
    { id: 'npc_major',   icon: 'fa-crown', label: 'Major NPC' },
    { id: 'scene',       icon: 'fa-fire', label: 'Scene Setup' },
    { id: 'encounter',   icon: 'fa-burst',    label: 'Encounter' },
    { id: 'compel',      icon: 'fa-rotate-left',    label: 'Compel' },
    { id: 'custom',      icon: 'fa-pen',    label: 'Custom Card' },
    { id: 'sticky',      icon: 'fa-note-sticky', label: 'Aspect Sticky' },
    { id: 'boost',       icon: 'fa-bolt',    label: 'Boost' },
    { id: 'label',       icon: 'fa-bookmark', label: 'Section Label' },
    { id: '__group__',   icon: 'fa-layer-group', label: 'Scene Group' },
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
        <span class="board-ctx-icon" aria-hidden="true"><i class="fa-solid {g.icon}"></i></span>{g.label}
      </div>
    {/each}
    <div class="board-ctx-sep" role="separator"></div>
    {#if templates.length > 0}
      <div class="board-ctx-section" role="none">Drop template</div>
      {#each templates as t (t.id)}
        <div
          class="board-ctx-item"
          role="menuitem"
          tabindex="0"
          onclick={() => { onTemplate?.(t.id); onClose?.(); }}
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTemplate?.(t.id); onClose?.(); } }}
        >
          <span class="board-ctx-icon" aria-hidden="true"><i class="fa-solid {t.icon}"></i></span>
          <span>{t.label}</span>
          <span class="board-ctx-sub">{t.desc}</span>
        </div>
      {/each}
      <div class="board-ctx-sep" role="separator"></div>
    {/if}
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
