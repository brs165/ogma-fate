<script>
  // ── ExportModal — Dialog-based import/export with card selection ──────────
  import { Dialog, RadioGroup, Tabs } from 'bits-ui';
  import { DB } from '../../db.js';
  import {
    toBatchMarkdown, toBatchPlainText,
    toBatchMermaid, toBatchObsidianMD, toBatchTypst,
    parseOgmaJSON,
  } from '../../engine.js';

  let { open = false, onOpenChange = () => {}, cards = [], campName = '', onToast = null, onImportCards = null, onImportCanvas = null } = $props();

  // ── Export tab state ──────────────────────────────────────────────────────
  let exportable = $derived(cards.filter(c =>
    c.genId && c.genId !== 'sticky' && c.genId !== 'boost' && c.genId !== 'label' && c.data
  ));

  let sel = $state({});
  $effect(() => {
    const s = {};
    exportable.forEach(c => { s[c.id] = true; });
    sel = s;
  });

  let fmt = $state('md');
  let del_ = $state('copy');

  function toggleCard(id) { sel = { ...sel, [id]: !sel[id] }; }
  function selAll()  { const s = {}; exportable.forEach(c => { s[c.id] = true; }); sel = s; }
  function selNone() { sel = {}; }

  let selectedCards = $derived(exportable.filter(c => sel[c.id]));
  let selectedCount = $derived(selectedCards.length);

  function cardTitle(c) {
    const d = c.data || {};
    return d.name || d.location || d.situation || d.title ||
           (d.aspects && d.aspects.high_concept) ||
           c.title || c.genId || '';
  }
  function genLabel(genId) {
    return (genId || '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  const FORMATS = [
    {id:'md',  label:'Markdown',   icon:'MD',  sub:'GM notes',         action:'copy'},
    {id:'mm',  label:'Mermaid',    icon:'MM',  sub:'Notion / GitHub',  action:'copy'},
    {id:'ob',  label:'Obsidian',   icon:'OB',  sub:'Callout blocks',   action:'copy'},
    {id:'ty',  label:'Typst',      icon:'TY',  sub:'Compiles to PDF',  action:'download'},
    {id:'txt', label:'Plain text', icon:'TXT', sub:'Any editor',       action:'download'},
    {id:'json',label:'JSON',       icon:'{}',  sub:'Re-import to Ogma',action:'download'},
    {id:'img', label:'Image Pack', icon:'\u25a3',sub:'PNG zip',        action:'popup'},
    {id:'prt', label:'Print',      icon:'\u2399',sub:'PDF popup',      action:'popup'},
  ];

  let activeFmt = $derived(FORMATS.find(f => f.id === fmt) || FORMATS[0]);
  let isPopup = $derived(activeFmt.action === 'popup');

  function doExport() {
    if (!selectedCards.length) return;

    if (fmt === 'json') {
      if (DB.exportCards) DB.exportCards(null, campName, selectedCards);
      toast('JSON downloaded');
      return;
    }
    if (fmt === 'img') {
      if (DB.exportCardsAsPng) DB.exportCardsAsPng(selectedCards, campName);
      return;
    }
    if (fmt === 'prt') {
      if (DB.printCards) DB.printCards(selectedCards, campName);
      return;
    }

    const batchFns = { md: toBatchMarkdown, mm: toBatchMermaid, ob: toBatchObsidianMD, ty: toBatchTypst, txt: toBatchPlainText };
    const batchFn = batchFns[fmt];
    if (!batchFn) return;

    const cardObjs = selectedCards.map(c => ({ genId: c.genId || '', data: c.data || {}, title: cardTitle(c) }));
    const txt = batchFn(cardObjs, campName);
    if (!txt) return;

    if (del_ === 'copy') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(txt).then(() => toast(activeFmt.label + ' copied'));
      }
    } else {
      const ext = {md:'md', mm:'mmd', ob:'md', ty:'typ', txt:'txt'}[fmt] || 'txt';
      const fname = (campName || 'ogma').replace(/[^a-zA-Z0-9_-]/g, '_') + '-board.' + ext;
      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = fname;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      toast(activeFmt.label + ' downloaded');
    }
  }

  function toast(msg) { if (onToast) onToast(msg); }

  // ── Import tab state ──────────────────────────────────────────────────────
  let importMode = $state('cards');
  let importPreview = $state(null);
  let importError = $state('');
  let dragOver = $state(false);

  function handleFile(file) {
    if (!file) return;
    importError = '';
    importPreview = null;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = reader.result;
        const obj = JSON.parse(raw);

        // Canvas state import
        if (obj.type === 'canvas' && obj.state) {
          importMode = 'canvas';
          importPreview = { type: 'canvas', cardCount: (obj.state.cards || []).length, raw: obj };
          return;
        }

        // Card-level import via parseOgmaJSON
        const parsed = parseOgmaJSON(raw);
        if (parsed) {
          importMode = 'cards';
          const results = parsed.type === 'batch' ? parsed.results : [{ generator: parsed.generator, data: parsed.data, ts: parsed.ts }];
          importPreview = {
            type: 'cards',
            campaign: parsed.campaign || '',
            cardCount: results.length,
            generators: [...new Set(results.map(r => r.generator))],
            results,
          };
          return;
        }

        importError = 'Not a valid Ogma export file.';
      } catch (e) {
        importError = 'Could not parse JSON file.';
      }
    };
    reader.readAsText(file);
  }

  function onDrop(e) {
    e.preventDefault();
    dragOver = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }

  function onDragOver(e) { e.preventDefault(); dragOver = true; }
  function onDragLeave() { dragOver = false; }

  function openFilePicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = () => { if (input.files?.[0]) handleFile(input.files[0]); };
    input.click();
  }

  function doImport() {
    if (!importPreview) return;
    if (importPreview.type === 'canvas') {
      if (onImportCanvas) {
        const data = importPreview.raw;
        onImportCanvas(data);
        toast('Board imported — ' + importPreview.cardCount + ' cards loaded');
      }
    } else if (importPreview.type === 'cards') {
      if (onImportCards) {
        const count = onImportCards(importPreview.results);
        toast(count + ' card' + (count !== 1 ? 's' : '') + ' imported');
      }
    }
    importPreview = null;
    onOpenChange(false);
  }

  let activeTab = $state('export');
</script>

<Dialog.Root {open} {onOpenChange}>
  <Dialog.Portal>
    <Dialog.Overlay class="modal-overlay" />
    <Dialog.Content class="modal-content em-modal" aria-describedby={undefined}>
      <div class="em-top">
        <Dialog.Title class="em-title">Export / Import</Dialog.Title>
        <Dialog.Close class="bd-close" aria-label="Close">&#x2715;</Dialog.Close>
      </div>

      <Tabs.Root bind:value={activeTab} class="em-tabs">
        <Tabs.List class="em-tab-list" aria-label="Export or Import">
          <Tabs.Trigger value="export" class="em-tab{activeTab === 'export' ? ' em-tab-active' : ''}">Export</Tabs.Trigger>
          <Tabs.Trigger value="import" class="em-tab{activeTab === 'import' ? ' em-tab-active' : ''}">Import</Tabs.Trigger>
        </Tabs.List>

        <!-- ── EXPORT TAB ─────────────────────────────────────────── -->
        <Tabs.Content value="export" class="em-tab-body">
          {#if exportable.length === 0}
            <div class="em-empty">No cards on canvas. Generate some first.</div>
          {:else}
            <!-- Card checklist -->
            <div class="em-section-label">
              <span>Cards <span class="em-count">({selectedCount}/{exportable.length})</span></span>
              <span class="em-sel-btns">
                <button class="em-sel-btn" onclick={selAll}>All</button>
                <button class="em-sel-btn" onclick={selNone}>None</button>
              </span>
            </div>
            <div class="em-card-list">
              {#each exportable as c (c.id)}
                <label class="em-card-row">
                  <input type="checkbox" checked={!!sel[c.id]} onchange={() => toggleCard(c.id)} />
                  <span class="em-card-name">{cardTitle(c) || genLabel(c.genId)}</span>
                  <span class="em-card-type">{genLabel(c.genId)}</span>
                </label>
              {/each}
            </div>

            <!-- Format grid -->
            <div class="em-section-label"><span>Format</span></div>
            <RadioGroup.Root bind:value={fmt} aria-label="Export format" class="em-fmt-grid">
              {#each FORMATS as f (f.id)}
                <RadioGroup.Item
                  value={f.id}
                  class="em-fmt-btn{fmt === f.id ? ' is-active' : ''}"
                  aria-label="{f.label} — {f.sub}"
                >
                  <span class="em-fmt-icon">{f.icon}</span>
                  <span class="em-fmt-info">
                    <span class="em-fmt-name">{f.label}</span>
                    <span class="em-fmt-sub">{f.sub}</span>
                  </span>
                </RadioGroup.Item>
              {/each}
            </RadioGroup.Root>

            <!-- Delivery -->
            {#if !isPopup}
              <div class="em-section-label"><span>Delivery</span></div>
              <RadioGroup.Root bind:value={del_} aria-label="Delivery method" class="em-del-row">
                <RadioGroup.Item value="copy" class="em-del-btn{del_ === 'copy' ? ' is-active' : ''}">Copy to clipboard</RadioGroup.Item>
                <RadioGroup.Item value="download" class="em-del-btn{del_ === 'download' ? ' is-active' : ''}">Download file</RadioGroup.Item>
              </RadioGroup.Root>
            {/if}

            <!-- Execute -->
            <div class="em-exec-row">
              <button class="em-exec-btn btn-roll" disabled={selectedCount === 0} onclick={doExport}>
                {#if isPopup}
                  {activeFmt.label}
                {:else if del_ === 'copy'}
                  Copy {activeFmt.label} ({selectedCount})
                {:else}
                  Export {activeFmt.label} ({selectedCount})
                {/if}
              </button>
            </div>
          {/if}
        </Tabs.Content>

        <!-- ── IMPORT TAB ─────────────────────────────────────────── -->
        <Tabs.Content value="import" class="em-tab-body">
          <!-- Drop zone -->
          <div
            class="em-drop-zone{dragOver ? ' em-drop-active' : ''}"
            ondrop={onDrop}
            ondragover={onDragOver}
            ondragleave={onDragLeave}
            role="button"
            tabindex="0"
            aria-label="Drop a JSON file here or click to browse"
            onclick={openFilePicker}
            onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openFilePicker(); }}
          >
            <div class="em-drop-icon"><i class="fa-solid fa-file-import" aria-hidden="true"></i></div>
            <div class="em-drop-text">Drop a <strong>.json</strong> file here</div>
            <div class="em-drop-sub">or click to browse</div>
          </div>

          {#if importError}
            <div class="em-import-error">{importError}</div>
          {/if}

          {#if importPreview}
            <div class="em-preview">
              <div class="em-preview-title">
                {importPreview.type === 'canvas' ? 'Canvas State' : 'Card Export'}
              </div>
              <div class="em-preview-detail">
                {importPreview.cardCount} card{importPreview.cardCount !== 1 ? 's' : ''}
                {#if importPreview.campaign}
                  from <strong>{importPreview.campaign}</strong>
                {/if}
              </div>
              {#if importPreview.generators}
                <div class="em-preview-gens">
                  {importPreview.generators.map(g => genLabel(g)).join(', ')}
                </div>
              {/if}
              <button class="em-exec-btn btn-roll" onclick={doImport}>
                Import {importPreview.cardCount} card{importPreview.cardCount !== 1 ? 's' : ''}
              </button>
            </div>
          {/if}
        </Tabs.Content>
      </Tabs.Root>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
