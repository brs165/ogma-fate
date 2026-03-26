<script>
  // ── ExportMenu — topbar export/import dropdown ────────────────────────────────
  import { onMount, onDestroy } from 'svelte';
  import { DB } from '../../db.js';
  let { cards = [], campName = '', onExportCanvas = null, onImportCanvas = null, onPrint = null, mode = 'prep' } = $props();
  let hasCards = $derived(cards.filter(c =>
    c.genId && c.genId !== 'sticky' && c.genId !== 'boost' && c.genId !== 'label'
  ).length > 0);

  let open = $state(false);
  let menuPos = { top: 0, right: 0 };
  let menuEl;
  let btnEl;

  function handleOutsideClick(e) {
    if (!open) return;
    if (menuEl && !menuEl.contains(e.target) && btnEl && !btnEl.contains(e.target)) {
      open = false;
    }
  }

  onMount(() => {
    document.addEventListener('mousedown', handleOutsideClick);
  });
  onDestroy(() => {
    document.removeEventListener('mousedown', handleOutsideClick);
  });

  function toggle() {
    if (!open && btnEl) {
      const r = btnEl.getBoundingClientRect();
      menuPos = { top: r.bottom + 6, right: window.innerWidth - r.right };
    }
    open = !open;
  }

  function doImagePack() {
    open = false;
    if (!hasCards) return;
    const printable = cards.filter(c =>
      c.genId && c.genId !== 'sticky' && c.genId !== 'boost' && c.genId !== 'label' && c.data
    );
    if (DB.exportCardsAsPng) DB.exportCardsAsPng(printable, campName);
  }

  function doPrint()         { open = false; if (onPrint) onPrint(); }
  function doExportCanvas()  { open = false; if (onExportCanvas) onExportCanvas(); }
  function doImportCanvas()  { open = false; if (onImportCanvas) onImportCanvas(); }
</script>

<div style="position:relative; display:inline-flex">
  <button
    bind:this={btnEl}
    class="bt-icon-btn{open ? ' active' : ''}"
    onclick={toggle}
    title="Export / Import"
    aria-label="Export and import options"
    aria-expanded={String(open)}
    aria-haspopup="menu"
  >↓</button>

  {#if open}
    <div
      bind:this={menuEl}
      role="menu"
      aria-label="Export options"
      style="position:fixed; top:{menuPos.top}px; right:{menuPos.right}px;
             background:var(--panel-raised); border:1.5px solid var(--border-mid);
             border-radius:3px; padding:4px 0; min-width:200px;
             box-shadow:4px 4px 0 rgba(0,0,0,.22); z-index:9000; animation:fadeDown .14s ease"
    >
      <div style="padding:6px 14px 5px; font-size:10px; font-weight:800;
                  letter-spacing:.2em; color:var(--text-muted); text-transform:uppercase;
                  font-family:var(--font-mono); border-bottom:1px solid var(--border)">Export</div>

      <!-- JSON -->
      <button role="menuitem" onclick={doExportCanvas} class="export-menu-item" aria-label="Export board canvas as JSON">
        <div class="export-menu-item-icon">{'{ }'}</div>
        <div class="export-menu-item-body">
          <div class="export-menu-item-label">JSON</div>
          <div class="export-menu-item-sub">Canvas state — re-importable</div>
        </div>
      </button>

      <!-- Image Pack -->
      {#if hasCards}
        <button role="menuitem" onclick={doImagePack} class="export-menu-item" aria-label="Export cards as PNG image pack">
          <div class="export-menu-item-icon">▣</div>
          <div class="export-menu-item-body">
            <div class="export-menu-item-label">Image Pack</div>
            <div class="export-menu-item-sub">PNG zip for Miro / Figma</div>
          </div>
        </button>
      {/if}

      <!-- Print -->
      {#if mode !== 'play' && hasCards}
        <button role="menuitem" onclick={doPrint} class="export-menu-item" aria-label="Print cards">
          <div class="export-menu-item-icon">⎙</div>
          <div class="export-menu-item-body">
            <div class="export-menu-item-label">Print</div>
            <div class="export-menu-item-sub">Printable A4 layout</div>
          </div>
        </button>
      {/if}

      <!-- Divider -->
      <div role="separator" style="height:1px; background:var(--border); margin:4px 0"></div>

      <!-- Import -->
      <button role="menuitem" onclick={doImportCanvas} class="export-menu-item" aria-label="Import board from JSON file">
        <div class="export-menu-item-icon">↑</div>
        <div class="export-menu-item-body">
          <div class="export-menu-item-label">Import</div>
          <div class="export-menu-item-sub">Restore from .json file</div>
        </div>
      </button>
    </div>
  {/if}
</div>
