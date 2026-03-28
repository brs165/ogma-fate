<script>
  // Board.svelte — Table surface coordinator
  // Sprint 1+2: play/binder/sync removed. Single canvas key. No mode toggle.
  import { onMount, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { getWorldTables, getWorldMeta } from '../../helpers.js';
  import { createCanvasStore } from '../../stores/canvasStore.js';
  import { DB, LS } from '../../db.js';

  import Topbar        from './Topbar.svelte';
  import LeftPanel     from '../panels/LeftPanel.svelte';
  import DossierModal  from './DossierModal.svelte';
  import CommandPalette from './CommandPalette.svelte';
  import ExportPanel   from './ExportPanel.svelte';
  import ExportModal   from './ExportModal.svelte';
  import DicePanel     from '../dice/DicePanel.svelte';
  import OgmaCanvas    from './OgmaCanvas.svelte';
  import MobileList    from './MobileList.svelte';
  import GenerateFAB   from './GenerateFAB.svelte';
  import FatePointTracker from '../campaign/FatePointTracker.svelte';
  import { AlertDialog } from 'bits-ui';

  // ── Props ──────────────────────────────────────────────────────────────────
  let { campId = 'fantasy', onClose = null, embedded = false } = $props();

  // ── Exposed for embedded parent ────────────────────────────────────────────
  export function sendToTable(genId, data) {
    if (!canvas) return;
    canvas.generateCardWithData(genId, data);
  }
  export function toggleDice() { showDice = !showDice; }
  export function toggleFP()   { showFP   = !showFP;   }
  export function dropTemplateFromParent(tplId) { dropTemplate(tplId); }

  // ── Constants ──────────────────────────────────────────────────────────────
  const BOARD_CANVAS_KEY = 'board_canvas_v1';
  const BOARD_FP_KEY     = 'board_fp_v1';

  // ── Derived ────────────────────────────────────────────────────────────────
  let campMeta = $derived(getWorldMeta(campId));
  let tables   = $derived(getWorldTables(campId));

  // ── UI state ───────────────────────────────────────────────────────────────
  let activeGen    = $state('seed');
  let leftTab      = $state('gen');
  let theme        = $state('dark');
  let isOnline     = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);
  let leftOpen     = $state(typeof window !== 'undefined' ? window.innerWidth > 520 : true);

  let toast        = $state(null);
  let toastTimer   = null;
  let toastQueue   = $state([]);

  let dossierCard  = $state(null);
  let cmdPalette   = $state(false);
  let cardSearch   = $state('');
  let connectSourceId = $state(null);
  let connectorLines  = $state([]);
  let exportView   = $state(false);
  let showDice     = $state(false);
  let showFP       = $state(false);
  let showClearModal = $state(false);
  let showExportModal = $state(false);
  let coachEdge    = $state(false);
  let canvasRef    = $state();
  let isMobile     = $state(typeof window !== 'undefined' && window.innerWidth < 768);

  // ── FP state ───────────────────────────────────────────────────────────────
  let fpState = $state(null);
  function persistFP(next) {
    if (!DB) return;
    DB.saveSession(BOARD_FP_KEY + '_' + campId, next).catch(() => {});
  }

  // ── Store ──────────────────────────────────────────────────────────────────
  let canvas = $state();
  let cards  = $state([]);
  let loaded = $state(false);
  let groups = $state([]);
  let unsubs = [];

  let campCanvasKey = $derived(BOARD_CANVAS_KEY + '_' + campId);

  function initStores() {
    unsubs.forEach(u => u());
    unsubs = [];
    canvas = createCanvasStore(campCanvasKey, tables, showToast, null);
    unsubs.push(canvas.cards.subscribe(v => cards = v));
    unsubs.push(canvas.connectors.subscribe(v => connectorLines = v));
    unsubs.push(canvas.groups.subscribe(v => groups = v));
    unsubs.push(canvas.loaded.subscribe(v => {
      loaded = v;
      if (v && cards.length > 0) setTimeout(() => fitAll(), 120);
    }));
  }

  // ── Toast ──────────────────────────────────────────────────────────────────
  function drainToast() {
    if (!toastQueue.length) { toast = null; toastTimer = null; return; }
    toast = toastQueue[0];
    toastQueue = toastQueue.slice(1);
    toastTimer = setTimeout(() => drainToast(), 2500);
  }
  function showToast(msg) {
    toastQueue = [...toastQueue, msg];
    if (!toastTimer) drainToast();
  }

  // ── Connect mode ───────────────────────────────────────────────────────────
  function handleConnectClick(cardId) {
    if (!connectSourceId) {
      connectSourceId = cardId;
      showToast('Click another card to connect — Esc to cancel');
    } else if (connectSourceId === cardId) {
      connectSourceId = null;
    } else {
      canvas.addConnector(connectSourceId, cardId);
      connectSourceId = null;
      showToast('Connected');
    }
  }

  // ── fitAll via OgmaCanvas ref ──────────────────────────────────────────────
  function fitAll() { if (canvasRef) canvasRef.fitAll(); }

  // ── Canvas templates (WC-05) ───────────────────────────────────────────────
  const CANVAS_TEMPLATES = [
    {
      id: 'tpl_opening',
      icon: 'fa-clapperboard',
      label: 'Opening Scene',
      desc: 'Scene + 2 NPCs + Countdown',
      cards: [
        { genId: 'scene',      dx: 0,   dy: 0   },
        { genId: 'npc_minor',  dx: 680, dy: 0   },
        { genId: 'npc_minor',  dx: 680, dy: 480 },
        { genId: 'countdown',  dx: 0,   dy: 520 },
      ],
    },
    {
      id: 'tpl_investigation',
      icon: 'fa-magnifying-glass',
      label: 'Investigation',
      desc: 'Scene + Faction + Complication + Obstacle',
      cards: [
        { genId: 'scene',        dx: 0,   dy: 0   },
        { genId: 'faction',      dx: 680, dy: 0   },
        { genId: 'complication', dx: 0,   dy: 520 },
        { genId: 'obstacle',     dx: 680, dy: 520 },
      ],
    },
    {
      id: 'tpl_climax',
      icon: 'fa-fire',
      label: 'Climax',
      desc: 'Encounter + Contest + 2 Boosts',
      cards: [
        { genId: 'encounter', dx: 0,    dy: 0   },
        { genId: 'contest',   dx: 680,  dy: 0   },
        { genId: 'boost',     dx: 0,    dy: 520 },
        { genId: 'boost',     dx: 340,  dy: 520 },
      ],
    },
    {
      id: 'tpl_session_zero',
      icon: 'fa-users',
      label: 'Session Zero',
      desc: 'Campaign frame + PC × 3 + Backstory × 3',
      cards: [
        { genId: 'campaign',  dx: 0,    dy: 0   },
        { genId: 'pc',        dx: 700,  dy: 0   },
        { genId: 'backstory', dx: 700,  dy: 480 },
        { genId: 'pc',        dx: 1060, dy: 0   },
        { genId: 'backstory', dx: 1060, dy: 480 },
        { genId: 'pc',        dx: 1420, dy: 0   },
        { genId: 'backstory', dx: 1420, dy: 480 },
      ],
    },
  ];

  function dropTemplate(tplId, originX = 60, originY = 60) {
    if (!canvas) return;
    const tpl = CANVAS_TEMPLATES.find(t => t.id === tplId);
    if (!tpl) return;
    tpl.cards.forEach((slot, i) => {
      setTimeout(() => {
        canvas.generateCard(slot.genId, originX + slot.dx, originY + slot.dy);
      }, i * 80);
    });
    showToast(tpl.label + ' template dropped');
  }

  // ── Topbar Add menu ────────────────────────────────────────────────────────
  function generateFromMenu(genId) {
    if (!canvas) return;
    canvas.generateCard(genId);
  }
  function addGroupFromMenu() {
    if (canvas) canvas.addGroup(60, 60);
  }

  // ── Generator select ──────────────────────────────────────────────────────
  function selectGen(genId) {
    activeGen = genId;
    if (canvas) canvas.generateCard(genId);
  }

  // ── Theme ─────────────────────────────────────────────────────────────────
  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    LS.set('theme', theme);
  }

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  function onGlobalKey(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault(); cmdPalette = !cmdPalette; return;
    }
    const tag = (e.target || {}).tagName || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'Escape' && connectSourceId) { connectSourceId = null; return; }
    if (dossierCard) { if (e.key === 'Escape') dossierCard = null; return; }
    if (e.key === 'Escape') return;
    if (e.code === 'Space' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      if (embedded) return;  // split-view Space handled by Campaign.svelte
      e.preventDefault();
      if (canvas) canvas.generateCard(activeGen);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault(); if (canvas) canvas.undoLast();
    } else if (e.key === 'r' || e.key === 'R') {
      showDice = !showDice;
    } else if (e.key === 'f' || e.key === 'F') {
      fitAll();
    }
  }

  let cmdActions = $derived([
    { id: 'gen-npc',     icon: 'fa-user', label: 'Generate Minor NPC',  shortcut: 'Space', fn: () => { if (canvas) canvas.generateCard('npc_minor'); } },
    { id: 'gen-major',   icon: 'fa-crown', label: 'Generate Major NPC',              fn: () => { if (canvas) canvas.generateCard('npc_major'); } },
    { id: 'gen-scene',   icon: 'fa-fire', label: 'Generate Scene',                  fn: () => { if (canvas) canvas.generateCard('scene'); } },
    { id: 'gen-encounter',icon: 'fa-burst',   label: 'Generate Encounter',              fn: () => { if (canvas) canvas.generateCard('encounter'); } },
    { id: 'gen-sticky',  icon: 'fa-note-sticky', label: 'Add Aspect Sticky',               fn: () => { if (canvas) canvas.generateCard('sticky'); } },
    ...CANVAS_TEMPLATES.map(t => ({
      id: t.id, icon: t.icon, label: 'Template: ' + t.label, sub: t.desc,
      fn: () => dropTemplate(t.id),
    })),
    { id: 'dice',        icon: 'fa-dice-d20', label: 'Toggle Dice Roller', shortcut: 'R', fn: () => { showDice = !showDice; } },
    { id: 'fp',          icon: 'fa-coins',    label: 'Toggle Fate Points',              fn: () => { showFP = !showFP; } },
    { id: 'export',      icon: 'fa-file-export',    label: 'Export Cards',                    fn: () => { exportView = true; } },
    { id: 'fit',         icon: 'fa-expand',    label: 'Fit All Cards',      shortcut: 'F', fn: fitAll },
    { id: 'clear',       icon: 'fa-trash-can', label: 'Clear Table',                     fn: () => { showClearModal = true; } },
    { id: 'undo',        icon: 'fa-rotate-left',    label: 'Undo',               shortcut: '\u2318Z', fn: () => { if (canvas) canvas.undoLast(); } },
    { id: 'theme',       icon: 'fa-circle-half-stroke',    label: 'Toggle Theme',                    fn: toggleTheme },
  ]);

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  onMount(() => {
    initStores();
    try { theme = LS.get('theme') || 'dark'; document.documentElement.setAttribute('data-theme', theme); } catch(e) {}
    if (campId) document.documentElement.setAttribute('data-campaign', campId);
    if (DB) DB.loadSession(BOARD_FP_KEY + '_' + campId).then(saved => { if (saved && saved.pcs) fpState = saved; }).catch(() => {});
    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    document.addEventListener('keydown', onGlobalKey);
    window.addEventListener('ogma:sz-pc', onSzPc);
  });

  function onOnline()  { isOnline = true; }
  function onOffline() { isOnline = false; }

  function onSzPc(e) {
    if (!e.detail || !e.detail.genId || !canvas) return;
    if (canvas.generateCardWithData) canvas.generateCardWithData(e.detail.genId, e.detail.data, 80, 80);
  }

  onDestroy(() => {
    unsubs.forEach(u => u());
    if (typeof window !== 'undefined') {
      document.removeEventListener('keydown', onGlobalKey);
      window.removeEventListener('ogma:sz-pc', onSzPc);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    }
    clearTimeout(toastTimer);
    document.documentElement.removeAttribute('data-campaign');
  });
</script>

<!-- ── Template ──────────────────────────────────────────────────────────── -->
<div class="board-app{embedded ? ' board-embedded' : ''}" data-theme={embedded ? undefined : theme}>

  {#if !embedded}
  <!-- Topbar -->
  <Topbar
    campMeta={campMeta}
    {campId}
    {onClose}
    {isOnline}
    panels={{
      leftOpen,
      onToggleLeft: () => { leftOpen = !leftOpen; },
      showDice,
      onToggleDice: () => { showDice = !showDice; },
      showFP,
      onToggleFP: () => { showFP = !showFP; },
    }}
    exportActions={{
      cards,
      campName: campMeta.name,
      theme,
      onToggleTheme: toggleTheme,
      onExportCanvas: canvas ? canvas.exportCanvas : () => {},
      onImportCanvas: canvas ? canvas.importCanvas : () => {},
    }}
    onExportView={() => { exportView = true; }}
    onExportModal={() => { showExportModal = true; }}
    cards={cards}
    campName={campMeta.name}
    onExportCanvas={canvas ? canvas.exportCanvas : () => {}}
    onImportCanvas={canvas ? canvas.importCanvas : () => {}}
    onCampChange={(newId) => { if (canvas) canvas.persistCanvas(get(canvas.cards)); window.location.href = '/campaigns/' + newId; }}
  />
  {/if}

  <!-- Body -->
  <div class="board-body">

    {#if !embedded}
    <!-- Mobile backdrop -->
    {#if leftOpen}
      <div class="blp-backdrop" onclick={() => { leftOpen = false; }} aria-hidden="true"></div>
    {/if}

    <!-- Left panel -->
    <div class="blp-wrap" class:blp-hidden={!leftOpen}>
      <LeftPanel
        {activeGen}
        onSelectGen={selectGen}
        {campId}
        activeTab={leftTab}
        onTabChange={(t) => { leftTab = t; }}
        campName={campMeta.name}
      />
    </div>
    {/if}

    <!-- Canvas column -->
    <div class="board-canvas-col">

      {#if exportView}
        <div class="board-export-page">
          <div class="board-export-page-hdr">
            <button class="bep-back-btn" onclick={() => { exportView = false; }} aria-label="Back to table">&larr; Back</button>
            <h2 class="bep-page-title">Export Cards</h2>
          </div>
          <ExportPanel
            {cards}
            campName={campMeta.name}
            onToast={showToast}
            onImport={canvas ? canvas.importCanvas : null}
          />
        </div>
      {:else if embedded && isMobile}
        <!-- Mobile: scrollable card list (no canvas) -->
        <MobileList
          {cards}
          {campId}
          onOpen={(card) => { dossierCard = card; }}
          onRemove={(id) => { if (canvas) canvas.deleteCard(id); }}
        />
      {:else}
        <!-- Table canvas -->
        <OgmaCanvas
          bind:this={canvasRef}
          {cards}
          connectors={connectorLines}
          {groups}
          {loaded}
          mode="prep"
          {campId}
          {cardSearch}
          {connectSourceId}
          modeTransitioning={false}
          playCardIds={new Set()}
          {toast}
          onUpdateCard={canvas ? canvas.updateCard : null}
          onDeleteCard={canvas ? canvas.deleteCard : null}
          onRerollCard={canvas ? canvas.rerollCard : null}
          onSendToTable={null}
          onOpenCard={(card) => { dossierCard = card; }}
          onInvoke={null}
          onConnect={handleConnectClick}
          onUpdateConnector={canvas ? canvas.updateConnector : null}
          onUpdateGroup={canvas ? canvas.updateGroup : null}
          onDeleteGroup={canvas ? canvas.deleteGroup : null}
          onCtxTemplate={(tplId) => dropTemplate(tplId)}
          ctxTemplates={CANVAS_TEMPLATES}
          onEdgeCoach={() => { if (!coachEdge) { coachEdge = true; showToast('\u21D4 Click line to cycle label'); } }}
          onClearTable={() => { showClearModal = true; }}
          onAutoArrange={() => { if (canvas) canvas.autoArrange(); setTimeout(() => fitAll(), 150); }}
          onExportModal={() => { showExportModal = true; }}
          onGenerate={generateFromMenu}
          onAddGroup={addGroupFromMenu}
          onTemplate={(tplId) => dropTemplate(tplId)}
          addTemplates={CANVAS_TEMPLATES}
          showToast={showToast}
          {embedded}
        />
      {/if}
    </div>
  </div>

  {#if !embedded}
  <!-- Mobile generate FAB -->
  <GenerateFAB
    {activeGen}
    onGenerate={(genId) => { if (canvas) canvas.generateCard(genId); }}
  />
  {/if}

  <!-- Dice floater -->
  {#if showDice}
    <div class="board-floater board-dice-floater" onclick={(e) => e.stopPropagation()}>
      <div class="board-floater-hdr">
        <span class="board-floater-title"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> Dice</span>
        <button class="board-floater-close" onclick={() => { showDice = false; }} aria-label="Close dice roller">&times;</button>
      </div>
      <DicePanel
        onRoll={(r) => { showToast(r.who + ' \u00b7 ' + r.skill + ' \u2192 ' + (r.total >= 0 ? '+' : '') + r.total); }}
      />
    </div>
  {/if}

  <!-- FP tracker floater -->
  {#if showFP}
    <div class="board-floater board-fp-floater" onclick={(e) => e.stopPropagation()}>
      <div class="board-floater-hdr">
        <span class="board-floater-title"><i class="fa-solid fa-coins" aria-hidden="true"></i> Fate Points</span>
        <button class="board-floater-close" onclick={() => { showFP = false; }} aria-label="Close Fate Point tracker">&times;</button>
      </div>
      {#if fpState}
        <FatePointTracker
          state={fpState}
          onUpdate={(next) => { fpState = next; persistFP(next); }}
        />
      {/if}
    </div>
  {/if}

  <!-- Command palette -->
  {#if cmdPalette}
    <CommandPalette
      actions={cmdActions}
      onClose={() => { cmdPalette = false; }}
    />
  {/if}

  <!-- Dossier modal -->
  {#if dossierCard}
    <DossierModal
      card={dossierCard}
      onClose={() => { dossierCard = null; }}
      onReroll={canvas ? canvas.rerollCard : null}
      onDelete={canvas ? canvas.deleteCard : null}
      isOnTable={false}
      mode="prep"
      campName={campMeta.name}
      {campId}
    />
  {/if}

  <!-- Export/Import Modal -->
  <ExportModal
    open={showExportModal}
    onOpenChange={(o) => { showExportModal = o; }}
    {cards}
    campName={campMeta.name}
    onToast={showToast}
    onImportCards={canvas ? canvas.importCards : null}
    onImportCanvas={(data) => {
      if (!canvas || !data || !data.state || !Array.isArray(data.state.cards)) {
        showToast('Invalid board file');
        return;
      }
      canvas.cards.set(data.state.cards);
      canvas.persistCanvas(data.state.cards);
    }}
  />

  <!-- Clear table — Bits AlertDialog (focus trap, Escape, ARIA) -->
  <AlertDialog.Root bind:open={showClearModal}>
    <AlertDialog.Portal>
      <AlertDialog.Overlay />
      <AlertDialog.Content aria-describedby="clear-table-desc">
        <AlertDialog.Title>Clear Table</AlertDialog.Title>
        <AlertDialog.Description id="clear-table-desc">
          Remove all cards from the Table. This cannot be undone.
        </AlertDialog.Description>
        <div style="display:flex;gap:8px;justify-content:flex-end;padding:0 18px 16px">
          <AlertDialog.Cancel class="btn btn-ghost">Cancel</AlertDialog.Cancel>
          <AlertDialog.Action
            class="btn"
            style="background:var(--c-red);border-color:var(--c-red);color:#fff"
            onclick={() => { showClearModal = false; if (canvas) canvas.clearCanvas(); showToast('Table cleared'); }}
          >Clear Table</AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>

</div>
