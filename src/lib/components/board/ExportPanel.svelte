<script>
  // ── ExportPanel — full export page in left panel ──────────────────────────────
  import { DB } from '../../db.js';
  import { RadioGroup } from 'bits-ui';
  import {
    toBatchMarkdown, toBatchPlainText,
    toBatchMermaid, toBatchObsidianMD, toBatchTypst,
  } from '../../engine.js';
  let { cards = [], campName = '', onToast = null, onImport = null } = $props();
  // Filter to exportable cards
  let exportable = $derived(cards.filter(c =>
    c.genId && c.genId !== 'sticky' && c.genId !== 'boost' && c.genId !== 'label' && c.data
  ));

  // Selection state — reset when exportable set changes
  let sel = $state({});
  $effect(() => {
    const s = {};
    exportable.forEach(c => { s[c.id] = true; });
    sel = s;
  });

  let fmt = $state('md');
  let del_ = $state('copy');

  function toggleCard(id) {
    sel = { ...sel, [id]: !sel[id] };
  }
  function selAll()  { const s = {}; exportable.forEach(c => { s[c.id] = true;  }); sel = s; }
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
    {id:'md',  label:'Markdown',   icon:'MD',  sub:'GM notes · Discord',   action:'copy'},
    {id:'mm',  label:'Mermaid',    icon:'MM',  sub:'Notion · GitHub',      action:'copy'},
    {id:'ob',  label:'Obsidian',   icon:'OB',  sub:'Callout blocks',       action:'copy'},
    {id:'ty',  label:'Typst',      icon:'TY',  sub:'Compiles to PDF',      action:'download'},
    {id:'txt', label:'Plain text', icon:'TXT', sub:'Any editor',           action:'download'},
    {id:'json',label:'JSON',       icon:'{}',  sub:'Re-import to Ogma',    action:'download'},
    {id:'img', label:'Image Pack', icon:'▣',   sub:'PNG zip',              action:'popup'},
    {id:'prt', label:'Print',      icon:'⎙',   sub:'PDF popup',            action:'popup'},
  ];

  let activeFmt = $derived(FORMATS.find(f => f.id === fmt) || FORMATS[0]);
  let isPopup = $derived(activeFmt.action === 'popup');

  function doExecute() {
    if (!selectedCards.length) return;

    if (fmt === 'json') {
      if (DB.exportCards) DB.exportCards(null, campName, selectedCards);
      if (onToast) onToast('↓ JSON downloaded');
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
        navigator.clipboard.writeText(txt).then(() => {
          if (onToast) onToast(activeFmt.label + ' copied');
        });
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
      if (onToast) onToast('↓ ' + activeFmt.label + ' downloaded');
    }
  }
</script>

<div class="blp-body bep-body">
  {#if exportable.length === 0}
    <div style="padding:16px 10px; text-align:center; color:var(--text-muted); font-size:11px">
      No cards on canvas yet. Generate some first.
    </div>
  {:else}
    <!-- Cards checklist -->
    <div class="bep-section-label" style="display:flex; align-items:center; justify-content:space-between">
      <span>Cards <span style="font-weight:400; color:var(--text-muted); font-size:10px">({selectedCount}/{exportable.length})</span></span>
      <span style="display:flex; gap:4px">
        <button class="bep-sel-btn" onclick={selAll}>All</button>
        <button class="bep-sel-btn" onclick={selNone}>None</button>
      </span>
    </div>

    <div class="bep-card-list">
      {#each exportable as c (c.id)}
        {@const title = cardTitle(c)}
        {@const label = genLabel(c.genId)}
        <label class="bep-card-row">
          <input type="checkbox" checked={!!sel[c.id]} onchange={() => toggleCard(c.id)} />
          <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:11px">
            {title || label}
          </span>
          <span style="font-size:10px; color:var(--text-muted); flex-shrink:0">{label}</span>
        </label>
      {/each}
    </div>

    <!-- Format grid — Bits RadioGroup for keyboard navigation -->
    <div class="bep-section-label">Format</div>
    <RadioGroup.Root bind:value={fmt} aria-label="Export format" class="bep-fmt-grid">
      {#each FORMATS as f (f.id)}
        <RadioGroup.Item
          value={f.id}
          class="bep-fmt-btn{fmt === f.id ? ' is-active' : ''}"
          aria-label="{f.label} — {f.sub}"
        >
          <span class="bep-fmt-icon">{f.icon}</span>
          <span class="bep-fmt-info">
            <span class="bep-fmt-name">{f.label}</span>
            <span class="bep-fmt-sub">{f.sub}</span>
          </span>
        </RadioGroup.Item>
      {/each}
    </RadioGroup.Root>

    <!-- Delivery — Bits RadioGroup -->
    {#if !isPopup}
      <div class="bep-section-label">Delivery</div>
      <RadioGroup.Root bind:value={del_} aria-label="Delivery method" class="bep-del-row">
        <RadioGroup.Item value="copy" class="bep-del-btn{del_ === 'copy' ? ' is-active' : ''}">⌘ Copy to clipboard</RadioGroup.Item>
        <RadioGroup.Item value="download" class="bep-del-btn{del_ === 'download' ? ' is-active' : ''}">↓ Download file</RadioGroup.Item>
      </RadioGroup.Root>
    {/if}

    <!-- Execute -->
    <div class="bep-exec-row">
      <button class="bep-exec-btn" disabled={selectedCount === 0} onclick={doExecute}>
        {#if isPopup}
          ▶ {activeFmt.label}
        {:else if del_ === 'copy'}
          ⌘ Copy {activeFmt.label} ({selectedCount})
        {:else}
          ↓ Export {activeFmt.label} ({selectedCount})
        {/if}
      </button>
    </div>

    <!-- Import link -->
    {#if onImport}
      <button class="bep-import-link" onclick={onImport}>↑ Import from JSON</button>
    {/if}
  {/if}
</div>
