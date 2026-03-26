<script>
  // ── ExportMenu — topbar export/import dropdown via Bits UI DropdownMenu ───────
  import { DropdownMenu } from 'bits-ui';
  import { DB } from '../../db.js';

  let { cards = [], campName = '', onExportCanvas = null, onImportCanvas = null, onPrint = null, mode = 'prep' } = $props();

  let hasCards = $derived(cards.filter(c =>
    c.genId && c.genId !== 'sticky' && c.genId !== 'boost' && c.genId !== 'label'
  ).length > 0);

  function doImagePack() {
    const printable = cards.filter(c =>
      c.genId && c.genId !== 'sticky' && c.genId !== 'boost' && c.genId !== 'label' && c.data
    );
    if (DB.exportCardsAsPng) DB.exportCardsAsPng(printable, campName);
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="bt-icon-btn" aria-label="Export and import options" title="Export / Import">
    ↓
  </DropdownMenu.Trigger>

  <DropdownMenu.Portal>
    <DropdownMenu.Content class="export-dd-content" sideOffset={6} align="end">
      <DropdownMenu.Label class="export-dd-label">Export</DropdownMenu.Label>
      <DropdownMenu.Separator class="export-dd-sep" />

      <DropdownMenu.Item class="export-dd-item" onSelect={() => onExportCanvas?.()}>
        <span class="export-dd-icon">{'{ }'}</span>
        <span class="export-dd-body">
          <span class="export-dd-name">JSON</span>
          <span class="export-dd-sub">Canvas state — re-importable</span>
        </span>
      </DropdownMenu.Item>

      {#if hasCards}
        <DropdownMenu.Item class="export-dd-item" onSelect={doImagePack}>
          <span class="export-dd-icon">▣</span>
          <span class="export-dd-body">
            <span class="export-dd-name">Image Pack</span>
            <span class="export-dd-sub">PNG zip for Miro / Figma</span>
          </span>
        </DropdownMenu.Item>
      {/if}

      {#if mode !== 'play' && hasCards}
        <DropdownMenu.Item class="export-dd-item" onSelect={() => onPrint?.()}>
          <span class="export-dd-icon">⎙</span>
          <span class="export-dd-body">
            <span class="export-dd-name">Print</span>
            <span class="export-dd-sub">Printable A4 layout</span>
          </span>
        </DropdownMenu.Item>
      {/if}

      <DropdownMenu.Separator class="export-dd-sep" />

      <DropdownMenu.Item class="export-dd-item" onSelect={() => onImportCanvas?.()}>
        <span class="export-dd-icon">↑</span>
        <span class="export-dd-body">
          <span class="export-dd-name">Import</span>
          <span class="export-dd-sub">Restore from .json file</span>
        </span>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
