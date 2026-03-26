<svelte:options runes={false} />

<script>
  // ── ExportPanel — full export page in left panel ──────────────────────────────
  import { DB } from '../../db.js';
  import {
    toBatchMarkdown, toBatchPlainText,
    toBatchMermaid, toBatchObsidianMD, toBatchTypst,
  } from '../../engine.js';

  export let cards    = [];
  export let campName = '';
  export let onToast  = null;
  export let onImport = null;

  // Filter to exportable cards
  $: exportable = cards.filter(c =>
    c.genId && c.genId !== 'sticky' && c.genId !== 'boost' && c.genId !== 'label' && c.data
  );

  // Selection state — reset when exportable set changes
  let sel = {};
  $: {
    void exportable.length;
    const s = {};
    exportable.forEach(c => { s[c.id] = true; });
    sel = s;
  }

  let fmt  = 'md';
  let del_ = 'copy';

  function toggleCard(id) {
    sel = { ...sel, [id]: !sel[id] };
  }
  function selAll()  { const s = {}; exportable.forEach(c => { s[c.id] = true;  }); sel = s; }
  function selNone() { sel = {}; }

  $: selectedCards  = exportable.filter(c => sel[c.id]);
  $: selectedCount  = selectedCards.length;

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

  $: activeFmt = FORMATS.find(f => f.id === fmt) || FORMATS[0];
  $: isPopup = activeFmt.action === 'popup';

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
        <button class="bep-sel-btn" on:click={selAll}>All</button>
        <button class="bep-sel-btn" on:click={selNone}>None</button>
      </span>
    </div>

    <div class="bep-card-list">
      {#each exportable as c (c.id)}
        {@const title = cardTitle(c)}
        {@const label = genLabel(c.genId)}
        <label class="bep-card-row">
          <input type="checkbox" checked={!!sel[c.id]} on:change={() => toggleCard(c.id)} />
          <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:11px">
            {title || label}
          </span>
          <span style="font-size:10px; color:var(--text-muted); flex-shrink:0">{label}</span>
        </label>
      {/each}
    </div>

    <!-- Format grid -->
    <div class="bep-section-label">Format</div>
    <div class="bep-fmt-grid">
      {#each FORMATS as f (f.id)}
        <button
          class="bep-fmt-btn{fmt === f.id ? ' is-active' : ''}"
          on:click={() => (fmt = f.id)}
          aria-pressed={String(fmt === f.id)}
          title="{f.label} — {f.sub}"
        >
          <span class="bep-fmt-icon">{f.icon}</span>
          <span class="bep-fmt-info">
            <span class="bep-fmt-name">{f.label}</span>
            <span class="bep-fmt-sub">{f.sub}</span>
          </span>
        </button>
      {/each}
    </div>

    <!-- Delivery -->
    {#if !isPopup}
      <div class="bep-section-label">Delivery</div>
      <div class="bep-del-row">
        <button class="bep-del-btn{del_ === 'copy' ? ' is-active' : ''}" on:click={() => (del_ = 'copy')}>⌘ Copy to clipboard</button>
        <button class="bep-del-btn{del_ === 'download' ? ' is-active' : ''}" on:click={() => (del_ = 'download')}>↓ Download file</button>
      </div>
    {/if}

    <!-- Execute -->
    <div class="bep-exec-row">
      <button class="bep-exec-btn" disabled={selectedCount === 0} on:click={doExecute}>
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
      <button class="bep-import-link" on:click={onImport}>↑ Import from JSON</button>
    {/if}
  {/if}
</div>
