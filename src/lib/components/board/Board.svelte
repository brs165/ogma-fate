<script>
  import { onMount, onDestroy, setContext } from 'svelte';
  import { get, writable } from 'svelte/store';
  import { SvelteFlow, Background, BackgroundVariant, MiniMap, Controls } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  import { nodeTypes } from './nodeTypes.js';
  import { getWorldTables, getWorldMeta } from '../../helpers.js';
  import { createCanvasStore } from '../../stores/canvasStore.js';
  import { createPlayStore } from '../../stores/playStore.js';
  import { createBinderStore } from '../../stores/binderStore.js';
  import { createSyncStore } from '../../stores/syncStore.js';
  import DB, { LS } from '../../db.js';

  // Child components
  import Topbar from './Topbar.svelte';
  import LeftPanel from '../panels/LeftPanel.svelte';
  import PlayPanel from './PlayPanel.svelte';
  import BoardCard from './BoardCard.svelte';
  import BoardLabel from './BoardLabel.svelte';
  import MobileList from './MobileList.svelte';
  import TurnBar from './TurnBar.svelte';
  import CombatTracker from './CombatTracker.svelte';
  import BinderPanel from './BinderPanel.svelte';
  import DossierModal from './DossierModal.svelte';
  import CommandPalette from './CommandPalette.svelte';
  import ExportPanel from './ExportPanel.svelte';
  import DicePanel from '../dice/DicePanel.svelte';
  import CanvasContextMenu from './CanvasContextMenu.svelte';
  import GenerateFAB from './GenerateFAB.svelte';
  import FatePointTracker from '../campaign/FatePointTracker.svelte';

  // ── Props ──────────────────────────────────────────────────────────────────
  let { campId = 'fantasy', initialMode = 'prep', initialRoom = null } = $props();

  // ── Constants ──────────────────────────────────────────────────────────────
  const BOARD_CANVAS_PREP_KEY = 'board_canvas_v1';
  const BOARD_CANVAS_PLAY_KEY = 'board_play_v1';
  const BOARD_FP_KEY = 'board_fp_v1';

  // ── Derived (early — needed before stores) ──────────────────────────────
  let campMeta = $derived(getWorldMeta(campId));
  let tables = $derived(getWorldTables(campId));

  // ── Local state ────────────────────────────────────────────────────────────
  let mode = $state(initialMode);
  let modeTransitioning = $state(false);
  let activeGen = $state('npc_minor');
  let leftTab = $state('gen');
  let theme = $state('dark');
  let isOnline = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);

  let toast = $state(null);
  let dossierCard = $state(null);
  let cmdPalette = $state(false);
  let cardSearch = $state('');
  let connectSourceId = $state(null);
  let connectorLines = $state([]);
  // SvelteFlow requires Svelte store references, not $state arrays
  // These are assigned from canvas.nodes / canvas.edges (writable/derived stores)
  let flowNodes = writable([]);
  let flowEdges = writable([]);

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
  let showTracker = $state(false);
  let exportView = $state(false);
  let fitViewOnLoad = $state(false);  // true when restoring existing cards
  // zoom/pan now handled by Svelte Flow

  // Coach marks
  let coachCanvas = $state(false);
  let coachPlay = $state(false);
  let coachEdge = $state(false);

  // Panel visibility
  let leftOpen = $state(typeof window !== 'undefined' ? window.innerWidth > 520 : true);
  let showDice = $state(false);
  let showClearModal = $state(false);
  let showFP = $state(false);
  let showNotes = $state(false);
  let mobileListView = $state(false);

  // Player join state
  let playerJoinName = $state('');
  let playerJoinSent = $state(false);
  let pcStep = $state(0);
  let pcDraft = { hc: '', trouble: '', aspect3: '', skills: {}, avatar: '' };

  // FP tracker state
  let fpState = $state(null);

  // Sync state received from GM
  let syncState = $state(null);

  // Compel + invoke
  let compelOffer = $state(null);
  let pendingInvoke = $state(null);
  let rollHistory = $state([]);

  // Canvas refs
  // canvasRef/dragRef/panRef removed — Svelte Flow handles drag/pan

  // Context menu
  let ctx = $state(null);

  // ── Canvas wrapper ref (for coordinate conversion) ───────────────────────
  let sfWrap = $state();

  // ── Toast queue ────────────────────────────────────────────────────────────
  let toastTimer = $state(null);
  let toastQueue = $state([]);

  function drainToast() {
    if (toastQueue.length === 0) { toast = null; toastTimer = null; return; }
    toast = toastQueue[0];
    toastQueue = toastQueue.slice(1);  // $state-safe: reassign not mutate
    toastTimer = setTimeout(drainToast, 1800);
  }

  function showToast(msg) {
    toastQueue = [...toastQueue, msg];  // $state-safe: reassign not mutate
    if (!toastTimer) {
      drainToast();
    }
  }

  // ── Stores ─────────────────────────────────────────────────────────────────
  let canvasKey = $derived(mode === 'prep' ? BOARD_CANVAS_PREP_KEY : BOARD_CANVAS_PLAY_KEY);
  let campCanvasKey = $derived(canvasKey + '_' + campId);

  // These stores are created once on mount and recreated when campId changes
  let canvas = $state();
  let play = $state();
  let binder = $state();
  let sync = $state();

  // Svelte Flow context — must be called during init
  setContext('ogma_canvas', {
    get mode() { return mode; },
    get campId() { return campId; },
    get playCardIds() { return playCardIds; },
    get connectSourceId() { return connectSourceId; },
    get cardSearch() { return cardSearch; },
    onDelete: (id) => canvas && canvas.deleteCard(id),
    onReroll: (id) => canvas && canvas.rerollCard(id),
    onUpdate: (id, patch) => canvas && canvas.updateCard(id, patch),
    onSendToTable: (card) => binder && binder.sendToTable(card),
    onOpen: (card) => { dossierCard = card; },
    onInvoke: (opts) => { pendingInvoke = opts; showDice = true; showToast('\u2726 Invoke queued \u2014 +2 on next roll'); },
    onUpdateConnector: (id, patch) => canvas && canvas.updateConnector && canvas.updateConnector(id, patch),
  });

  function initStores() {
    // Clean up previous subscriptions
    unsubs.forEach(u => u());
    unsubs = [];  // plain array, fine to reassign

    canvas = createCanvasStore(campCanvasKey, tables, showToast, null);
    play = createPlayStore(campId);
    sync = createSyncStore(showToast);
    binder = createBinderStore(
      campId, campMeta.name,
      BOARD_CANVAS_PLAY_KEY + '_' + campId,
      showToast,
      () => canvas ? canvas.getCards() : [],
      (next) => { if (canvas) canvas.persistCanvas(next); },
      () => {}
    );

    // Subscribe to store values
    unsubs.push(canvas.cards.subscribe(v => cards = v));
    unsubs.push(canvas.connectors.subscribe(v => connectorLines = v));
    unsubs.push(canvas.nodes.subscribe(v => flowNodes.set(v)));
    unsubs.push(canvas.edges.subscribe(v => flowEdges.set(v)));
    let binderLoadedOnce = false;
    unsubs.push(canvas.loaded.subscribe(v => {
      loaded = v;
      if (v && !binderLoadedOnce) {
        binderLoadedOnce = true;
        // fitView if restoring existing cards
        const existing = get(canvas.cards);
        if (existing && existing.length > 0) {
          fitViewOnLoad = true;
          setTimeout(() => { fitViewOnLoad = false; }, 500);
        }
        setTimeout(() => {
          const currentBinder = get(binder.binderCards);
          if (currentBinder && currentBinder.length > 0) {
            canvas.loadBinderToCanvas(currentBinder);
          }
        }, 100);
      }
    }));
    unsubs.push(play.players.subscribe(v => players = v));
    unsubs.push(play.round.subscribe(v => round = v));
    unsubs.push(play.order.subscribe(v => order = v));
    unsubs.push(play.selPlayer.subscribe(v => selPlayer = v));
    unsubs.push(play.roundFlash.subscribe(v => roundFlash = v));
    unsubs.push(play.gmPool.subscribe(v => gmPool = v));
    unsubs.push(binder.binderCards.subscribe(v => binderCards = v));
    unsubs.push(binder.trayCards.subscribe(v => trayCards = v));
    unsubs.push(binder.binderOpen.subscribe(v => binderOpenVal = v));
    unsubs.push(binder.playCardIds.subscribe(v => playCardIds = v));
    unsubs.push(sync.syncObj.subscribe(v => syncObj = v));
    unsubs.push(sync.syncStatus.subscribe(v => syncStatus = v));
    unsubs.push(sync.roomCode.subscribe(v => roomCode = v));
  }

  // Reactive values from stores — manually subscribed in initStores
  let cards = $state([]);
  let loaded = $state(false);
  let players = $state([]);
  let round = $state(1);
  let order = $state([]);
  let selPlayer = $state(null);
  let roundFlash = $state(false);
  let gmPool = $state(0);
  let binderCards = $state([]);
  let trayCards = $state([]);
  let binderOpenVal = $state(false);
  let playCardIds = $state(new Set());
  let syncObj = $state(null);
  let syncStatus = $state('offline');
  let roomCode = $state('');

  let unsubs = [];  // not $state — never rendered, just cleanup refs

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  onMount(() => {
    initStores();

    // Theme restore
    try {
      const t = LS.get('theme') || 'dark';
      theme = t;
      document.documentElement.setAttribute('data-theme', t);
    } catch (e) {}

    // Campaign data-attribute
    if (campId) document.documentElement.setAttribute('data-campaign', campId);

    // Coach mark
    try {
      if (!LS.get('coach_canvas_dismissed')) coachCanvas = true;
    } catch (e) {}

    // Online/offline
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    // Load FP state
    if (DB) {
      DB.loadSession(BOARD_FP_KEY + '_' + campId).then(saved => {
        if (saved && saved.pcs) fpState = saved;
      }).catch(() => {});
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', onGlobalKey);

    // Mouse move/up for drag
    // mousemove/mouseup removed — Svelte Flow handles drag

    // Session Zero auto-populate listener
    window.addEventListener('ogma:sz-pc', onSzPc);
  });

  function onSzPc(e) {
    if (!e.detail || !e.detail.genId || !canvas) return;
    const { genId, data } = e.detail;
    if (canvas.generateCardWithData) {
      canvas.generateCardWithData(genId, data, 80, 80);
    }
  }

  onDestroy(() => {
    unsubs.forEach(u => u());
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
      // mousemove/mouseup removed — Svelte Flow handles drag
      document.removeEventListener('keydown', onGlobalKey);
      window.removeEventListener('ogma:sz-pc', onSzPc);
    }
    clearTimeout(toastTimer);
    document.documentElement.removeAttribute('data-campaign');
  });

  function goOnline() { isOnline = true; }
  function goOffline() { isOnline = false; }

  // ── Mode change — left panel always open in prep ──────────────────────────
  $effect(() => { if (mode === 'prep') leftOpen = true; });

  // ── Play mode coach mark ──────────────────────────────────────────────────
  $effect(() => { if (mode === 'play') {
    try {
      if (!LS.get('coach_play_dismissed')) coachPlay = true;
    } catch (e) {}
  } });

  // ── Theme toggle ──────────────────────────────────────────────────────────
  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    LS.set('theme', theme);
  }

  // ── Coach mark dismiss ────────────────────────────────────────────────────
  function dismissCoachCanvas() {
    coachCanvas = false;
    LS.set('coach_canvas_dismissed', true);
  }
  function dismissCoachPlay() {
    coachPlay = false;
    LS.set('coach_play_dismissed', true);
  }

  // ── Generator select (left panel click = generate immediately) ────────────
  function selectGen(genId) {
    activeGen = genId;
    if (canvas) canvas.generateCard(genId);
  }

  // ── Mode change handler ───────────────────────────────────────────────────
  function onModeChange(m) {
    if (m === mode) return;
    if (canvas) canvas.persistCanvas(get(canvas.cards));
    modeTransitioning = true;
    setTimeout(() => {
      mode = m;
      setTimeout(() => { modeTransitioning = false; }, 350);
    }, 80);
  }

  // ── FP persistence ────────────────────────────────────────────────────────
  function persistFP(next) {
    if (!DB) return;
    DB.saveSession(BOARD_FP_KEY + '_' + campId, next).catch(() => {});
  }

  // ── Roll history ──────────────────────────────────────────────────────────
  function addRoll(entry) {
    rollHistory = [entry, ...rollHistory].slice(0, 12);
  }

  // ── Drag system — direct DOM during drag, single store update on drop ────
  // Manual drag/zoom removed — Svelte Flow handles all canvas interaction

  // fitAll — Svelte Flow Controls has fitView button; this is a no-op for keyboard shortcut compat
  function fitAll() {
    // Svelte Flow fitView is handled by the Controls component
  }

  // ── Context menu (right-click) ────────────────────────────────────────────
  function onCanvasContextMenu(e) {
    if (e.target.closest('.board-card') || e.target.closest('.board-sticky')) return;
    e.preventDefault();
    // Use client coords for menu display (fixed positioning)
    // Canvas coords passed to generateCard — SvelteFlow handles node placement
    // For now use clientX/Y as canvas coords; at default zoom 0.8 this is ~accurate
    // TODO: extract exact canvas transform via .svelte-flow__viewport transform matrix
    ctx = {
      screenX: e.clientX, screenY: e.clientY,
      canvasX: e.clientX, canvasY: e.clientY,
    };
  }

  function ctxGenerate(genId, canvasX, canvasY) {
    if (!canvas) return;
    canvas.generateCard(genId, canvasX, canvasY);
    ctx = null;
  }

  const CTX_ITEMS = [
    { id: 'npc_minor', icon: '\u{1F9D1}', label: 'Minor NPC' },
    { id: 'npc_major', icon: '\u{1F451}', label: 'Major NPC' },
    { id: 'scene', icon: '\u{1F525}', label: 'Scene Setup' },
    { id: 'encounter', icon: '\u2694', label: 'Encounter' },
    { id: 'compel', icon: '\u21A9', label: 'Compel' },
    { id: 'custom', icon: '\u270E', label: 'Custom Card' },
    { id: 'sticky', icon: '\u{1F4DD}', label: 'Aspect Sticky' },
    { id: 'label', icon: '\u{1F516}', label: 'Section Label' },
  ];

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  function onGlobalKey(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      cmdPalette = !cmdPalette;
      return;
    }
    const tag = (e.target || {}).tagName || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'Escape' && connectSourceId) { connectSourceId = null; return; }
    if (dossierCard) {
      if (e.key === 'Escape') dossierCard = null;
      return;
    }
    if (e.key === 'Escape') return;
    if (e.code === 'Space' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      if (canvas) canvas.generateCard(activeGen);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (canvas) canvas.undoLast();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      // Ctrl+A = select all nodes; Ctrl+Shift+A = deselect all
      flowNodes.update(nodes => nodes.map(n => ({ ...n, selected: !e.shiftKey })));
    } else if (e.key === 'r' || e.key === 'R') {
      showDice = !showDice;
    } else if (e.key === 'f' || e.key === 'F') {
      fitAll();
    }
  }

  // ── Command palette actions ───────────────────────────────────────────────
  let cmdActions = $derived([
    { id: 'gen-npc', icon: '\u{1F9D1}', label: 'Generate Minor NPC', shortcut: 'Space', fn: () => { if (canvas) canvas.generateCard('npc_minor'); } },
    { id: 'gen-major', icon: '\u{1F451}', label: 'Generate Major NPC', fn: () => { if (canvas) canvas.generateCard('npc_major'); } },
    { id: 'gen-scene', icon: '\u{1F525}', label: 'Generate Scene', fn: () => { if (canvas) canvas.generateCard('scene'); } },
    { id: 'gen-encounter', icon: '\u2694', label: 'Generate Encounter', fn: () => { if (canvas) canvas.generateCard('encounter'); } },
    { id: 'gen-sticky', icon: '\u{1F4DD}', label: 'Add Aspect Sticky', fn: () => { if (canvas) canvas.generateCard('sticky'); } },
    { id: 'gen-boost', icon: '\u26A1', label: 'Add Boost', fn: () => { if (canvas) canvas.generateCard('boost'); } },
    { id: 'dice', icon: '\u{1F3B2}', label: 'Toggle Dice Roller', shortcut: 'R', fn: () => { showDice = !showDice; } },
    { id: 'fp', icon: '\u25CE', label: 'Toggle FP Tracker', fn: () => { showFP = !showFP; } },
    { id: 'export', icon: '\u2193', label: 'Export Cards', fn: () => { exportView = true; } },
    { id: 'fit', icon: '\u2922', label: 'Fit All Cards', shortcut: 'F', fn: fitAll },
    { id: 'clear', icon: '\u{1F5D1}', label: 'Clear Table', fn: () => { showClearModal = true; } },
    { id: 'undo', icon: '\u21B6', label: 'Undo', shortcut: '\u2318Z', fn: () => { if (canvas) canvas.undoLast(); } },
    { id: 'selectAll', icon: '\u2610', label: 'Select All Nodes', shortcut: '\u2318A', fn: () => { flowNodes.update(ns => ns.map(n => ({ ...n, selected: true }))); } },
    { id: 'mode', icon: '\u25B6', label: mode === 'prep' ? 'Switch to Play' : 'Switch to Prep', fn: () => onModeChange(mode === 'prep' ? 'play' : 'prep') },
    { id: 'theme', icon: '\u263D', label: 'Toggle Dark/Light', fn: toggleTheme },
  ]);

  // ── NPC cards for turn bar ────────────────────────────────────────────────
  let npcCards = $derived(cards.filter(c => c.genId === 'npc_minor' || c.genId === 'npc_major'));

  // ── Search dim ────────────────────────────────────────────────────────────
  function isSearchMatch(card) {
    if (!cardSearch) return true;
    const q = cardSearch.toLowerCase();
    return (card.title || '').toLowerCase().includes(q) ||
      (card.summary || '').toLowerCase().includes(q) ||
      (card.text || '').toLowerCase().includes(q) ||
      (card.genId || '').toLowerCase().includes(q);
  }
</script>

<!-- ── Template ─────────────────────────────────────────────────────────────── -->

<div class="board-app" data-theme={theme} data-mode={mode} onclick={() => ctx = null}>

  <!-- ── Topbar ────────────────────────────────────────────────────────────── -->
  <Topbar
    campMeta={campMeta}
    {mode}
    onModeChange={onModeChange}
    {campId}
    onCampChange={(newId) => { if (canvas) canvas.persistCanvas(get(canvas.cards)); window.location.href = '/campaigns/' + newId; }}
    {isOnline}
    sync={{
      status: syncStatus,
      roomCode: roomCode,
      role: syncObj ? syncObj.role : null,
      onHost: sync ? sync.connectAsHost : () => {},
      onDisconnect: sync ? sync.disconnectSync : () => {},
      onToast: showToast,
    }}
    panels={{
      leftOpen,
      onToggleLeft: () => { leftOpen = !leftOpen; },
      showDice,
      onToggleDice: () => { showDice = !showDice; },
      showFP,
      onToggleFP: () => { showFP = !showFP; },
      binderOpen: binderOpenVal,
      onToggleBinder: () => { if (binder) binder.binderOpen.update(v => !v); },
      mobileListView,
      onToggleMobileList: () => { mobileListView = !mobileListView; },
      showNotes,
      onToggleNotes: () => { showNotes = !showNotes; },
    }}
    counts={{
      onTable: playCardIds.size,
      binder: binderCards.length,
      tray: trayCards.length,
      pin: 0,
    }}
    exportActions={{
      cards,
      campName: campMeta.name,
      theme,
      onToggleTheme: toggleTheme,
      onExportCanvas: canvas ? canvas.exportCanvas : () => {},
      onImportCanvas: canvas ? canvas.importCanvas : () => {},
      onPrint: () => showToast('Print not yet available'),
    }}
    onExportView={() => { exportView = true; }}
    onToggleMobileList={() => { mobileListView = !mobileListView; }}
    {mobileListView}
    cards={cards}
    campName={campMeta.name}
    onExportCanvas={canvas ? canvas.exportCanvas : () => {}}
    onImportCanvas={canvas ? canvas.importCanvas : () => {}}
    onPrint={() => showToast('Print not yet available')}
  />

  <!-- ── Body: left panel + canvas column ──────────────────────────────────── -->
  <div class="board-body">

    <!-- Mobile drawer backdrop — tap to close left panel -->
    {#if leftOpen}
      <div class="blp-backdrop" onclick={() => { leftOpen = false; }} aria-hidden="true"></div>
    {/if}

    <!-- Left panel: generators / stunts / help + play panel -->
    <div class="blp-wrap" class:blp-hidden={!leftOpen}>
      <LeftPanel
        {activeGen}
        onSelectGen={selectGen}
        {campId}
        activeTab={leftTab}
        onTabChange={(t) => { leftTab = t; }}
        campName={campMeta.name}
      />
      <PlayPanel
        {players}
        {selPlayer}
        onSel={(p) => { if (play) play.selPlayer.set(p); }}
        onUpd={(id, patch) => {
          if (play) {
            // WC-08: Auto-create consequence sticky when a consequence is written
            if (patch.conseq && canvas) {
              const oldPlayer = players.find(p => p.id === id);
              const oldConseq = oldPlayer ? (oldPlayer.conseq || ['', '', '']) : ['', '', ''];
              const SEVERITY = ['Mild', 'Moderate', 'Severe'];
              const STICKY_COLOR = [3, 0, 2]; // purple, yellow, orange
              patch.conseq.forEach((text, i) => {
                if (text && text.trim() && (!oldConseq[i] || !oldConseq[i].trim())) {
                  const label = (oldPlayer ? oldPlayer.name : '?') + ' \u2014 ' + SEVERITY[i];
                  canvas.addStickyWithText(label + ': ' + text, STICKY_COLOR[i]);
                  showToast(SEVERITY[i] + ' consequence sticky added');
                }
              });
            }
            play.updPlayer(id, patch);
          }
        }}
        onAdd={(name) => { if (play) play.addPlayer(name); }}
        collapsed={mode === 'prep'}
        {gmPool}
        {activeGen}
        onSelectGen={selectGen}
        campName={campMeta.name}
        updGmPool={mode === 'play' && play ? play.updGmPool : null}
        onQuickNpc={mode === 'play' ? () => { if (canvas) { canvas.generateCard('npc_minor'); showToast('\u26A1 Quick NPC added'); } } : null}
        onStarterScene={mode === 'play' ? () => {
          if (!canvas) return;
          canvas.generateCard('scene', 60, 60);
          canvas.generateCard('npc_minor', 400, 60);
          canvas.generateCard('npc_minor', 740, 60);
          canvas.generateCard('encounter', 60, 480);
          canvas.generateCard('countdown', 400, 480);
          showToast('\u{1F3AC} Starter scene: 1 scene + 2 NPCs + encounter + countdown');
        } : null}
        onCompel={mode === 'play' ? (player) => {
          const aspect = prompt('Compel which aspect?\n(' + player.name + '\u2019s HC: ' + (player.hc || '?') + ')');
          if (!aspect) return;
          compelOffer = { playerId: player.id, playerName: player.name, aspect };
          showToast('\u21A9 Compel offered to ' + player.name);
        } : null}
      />
    </div>

    <!-- Right column: turn bar + canvas -->
    <div class="board-canvas-col" class:bcol-list-mode={mobileListView}>

      <!-- Export page (replaces canvas) -->
      {#if exportView}
        <div class="board-export-page">
          <div class="board-export-page-hdr">
            <button class="bep-back-btn" onclick={() => { exportView = false; }} aria-label="Back to canvas">&larr; Back</button>
            <h2 class="bep-page-title">Export Cards</h2>
          </div>
          <ExportPanel
            {cards}
            campName={campMeta.name}
            onToast={showToast}
            onImport={canvas ? canvas.importCanvas : null}
          />
        </div>
      {/if}

      <!-- Normal canvas content -->
      {#if !exportView}

        <!-- Mobile list view -->
        {#if mobileListView}
          <MobileList
            {cards}
            {campId}
            onOpen={(card) => { dossierCard = card; }}
            onRemove={(id) => { if (canvas) canvas.deleteCard(id); }}
          />
        {/if}

        <!-- Play mode turn bar -->
        {#if mode === 'play' && players.length > 0}
          <TurnBar
            {players}
            {order}
            setOrder={(fn) => {
              const next = typeof fn === 'function' ? fn(order) : fn;
              if (play) { play.order.set(next); play.persistPlayState(null, null, next); }
            }}
            onToggleActed={play ? play.toggleActed : () => {}}
            {round}
            onNewRound={play ? play.newRound : () => {}}
            onPrevRound={play ? play.prevRound : () => {}}
            {roundFlash}
            onEndScene={() => { if (play) { play.endScene(); showToast('Scene ended \u2014 stress cleared'); } }}
            onStartSession={() => { if (play) { play.startSession(); showToast('\u25B6 Session started \u2014 FP refreshed'); } }}
            onSessionSummary={() => {
              const lines = ['# Session Summary \u2014 ' + campMeta.name, '', '## Players'];
              players.forEach(p => {
                const cList = (p.conseq || []).filter(Boolean);
                lines.push('- **' + p.name + '** \u2014 FP: ' + (p.fp || 0) + (cList.length ? ', Consequences: ' + cList.join(', ') : ''));
              });
              lines.push('', '## Rolls (' + rollHistory.length + ')');
              rollHistory.forEach(r => {
                lines.push('- ' + r.who + ' \u00b7 ' + r.skill + ' \u2192 ' + (r.total >= 0 ? '+' : '') + r.total);
              });
              lines.push('', 'Round: ' + round + ' \u00b7 GM Pool: ' + gmPool + ' \u00b7 Cards on canvas: ' + cards.length);
              if (navigator.clipboard) navigator.clipboard.writeText(lines.join('\n')).then(() => showToast('\u{1F4CB} Session summary copied'));
            }}
            onNewScene={() => {
              if (play) { play.endScene(); play.round.set(1); play.persistPlayState(null, 1, null); }
              if (binder) binder.clearTable();
              showToast('\u25B6 New scene \u2014 table cleared');
            }}
            {npcCards}
            onToggleNpcActed={(id) => { if (canvas) canvas.updateCard(id, { acted: !cards.find(c => c.id === id)?.acted }); }}
            onPrintScene={() => showToast('Print not yet available')}
          />
        {/if}

        <!-- Combat tracker toggle + view -->
        {#if mode === 'play' && players.length > 0}
          <div class="ct-toggle-row">
            <button class="ct-toggle-btn" onclick={() => { showTracker = !showTracker; }}
              aria-pressed={String(showTracker)} aria-label="Toggle combat tracker">
              {showTracker ? '\u25BC Combat Tracker' : '\u25B6 Combat Tracker'}
            </button>
          </div>
        {/if}
        {#if showTracker && mode === 'play'}
          <CombatTracker
            {players}
            {npcCards}
            onToggleActed={play ? play.toggleActed : () => {}}
            onToggleNpcActed={(id) => { if (canvas) canvas.updateCard(id, { acted: !cards.find(c => c.id === id)?.acted }); }}
          />
        {/if}

        <!-- Canvas area — Svelte Flow -->
        <div class="board-sf-wrap{connectSourceId ? ' connect-mode' : ''}{modeTransitioning ? ' mode-transitioning' : ''}" oncontextmenu={onCanvasContextMenu} bind:this={sfWrap}>
          <SvelteFlow
            nodes={flowNodes}
            edges={flowEdges}
            {nodeTypes}
            fitView={fitViewOnLoad}
            minZoom={0.2}
            maxZoom={2}
            defaultViewport={{ x: 20, y: 20, zoom: 0.8 }}
            deleteKey="Delete"
            panOnScroll={true}
            panOnDrag={[1, 2]}
            selectionOnDrag={false}
            multiSelectionKeyCode="Shift"
            on:nodedragstop={(e) => {
              if (canvas && e.detail && e.detail.nodes) canvas.syncNodePositions(e.detail.nodes);
            }}
            on:nodeclick={(e) => {
              if (canvas && e.detail?.node)
                canvas.updateCard(e.detail.node.id, { z: Date.now() });
            }}
            on:connect={(e) => {
              if (canvas && e.detail) canvas.addConnector(e.detail.source, e.detail.target);
            }}
            on:edgedelete={(e) => {
              if (canvas && e.detail && e.detail.edges) e.detail.edges.forEach(edge => canvas.removeConnector(edge.id));
            }}
            on:edgeclick={(e) => {
              if (!canvas || !e.detail?.edge) return;
              if (!coachEdge) {
                coachEdge = true;
                showToast('\u21D4 Click edge to cycle relationship label');
              }
              const edge = e.detail.edge;
              const LABELS = ['', 'Knows', 'Opposes', 'Ally', 'Fears', 'Owes', 'Loves', 'Rival', 'Commands', 'Seeks'];
              const current = edge.data?.label || '';
              const next = LABELS[(LABELS.indexOf(current) + 1) % LABELS.length];
              canvas.updateConnector(edge.id, { label: next });
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
            <Controls />
            <MiniMap
              nodeColor={(n) => {
                const C = {
                  npc_minor:'#e8b83a',npc_major:'#e8793a',backstory:'#4a90d9',
                  scene:'#3aaa7a',encounter:'#d04a6a',complication:'#d04a6a',
                  challenge:'#4a90d9',contest:'#6a7dd4',obstacle:'#888888',
                  countdown:'#e8793a',constraint:'#888888',campaign:'#6a7dd4',
                  seed:'#e8b83a',faction:'#6a7dd4',compel:'#3aaa7a',
                  consequence:'#e8793a',custom:'#888888',pc:'#3aaa7a',
                  sticky:'#fff176',boost:'#f4b942',label:'#c8a96e',
                };
                return C[n.type] || '#888888';
              }}
              maskColor="rgba(0,0,0,0.5)"
            />
            <!-- Empty canvas hint -->
            {#if loaded && cards.length === 0}
              <div class="board-sf-empty" aria-hidden="true">
                <span class="board-sf-empty-icon">◈</span>
                <span>Right-click to generate, or press <kbd>Space</kbd></span>
                <span class="board-sf-empty-hint">Click a generator in the left panel to get started</span>
              </div>
            {/if}
          </SvelteFlow>

          <!-- Context menu — inside SF tree so useSvelteFlow() coord conversion works -->
          <CanvasContextMenu
            {ctx}
            onClose={() => { ctx = null; }}
            onGenerate={ctxGenerate}
          />

          <!-- Toast -->
          {#if toast}
            <div class="board-toast">{toast}</div>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Mobile generate FAB — hidden on desktop, visible on mobile -->
  <GenerateFAB
    {activeGen}
    onGenerate={(genId) => { if (canvas) canvas.generateCard(genId); }}
  />

  <!-- Binder right panel (Prep mode only) -->
  {#if mode === 'prep' && binderOpenVal}
    <div class="bbp-wrap">
      <BinderPanel
        {campId}
        campName={campMeta.name}
        {binderCards}
        {trayCards}
        onAddToTray={binder ? binder.addToTray : null}
        onRemoveFromTray={binder ? binder.removeFromTray : null}
        onSendTrayToCanvas={binder ? binder.sendTrayToCanvas : null}
        onSendToCanvas={binder ? binder.sendToCanvas : null}
        onExportCard={binder ? binder.exportCard : null}
        onUnpin={binder ? binder.unpinCard : null}
      />
    </div>
  {/if}

  <!-- Dice floater -->
  {#if showDice}
    <div class="board-floater board-dice-floater" onclick={(e) => e.stopPropagation()}>
      <div class="board-floater-hdr">
        <span class="board-floater-title"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> Dice</span>
        <button class="board-floater-close" onclick={() => { showDice = false; }} aria-label="Close dice roller">&times;</button>
      </div>
      <DicePanel
        players={fpState ? (fpState.pcs || []).map(pc => ({ id: pc.id, name: pc.name, skills: pc.skills || [] })) : []}
        selId={null}
        {pendingInvoke}
        onClearInvoke={() => { pendingInvoke = null; }}
        spendFP={(id) => {
          if (!fpState) return;
          const updated = { ...fpState, pcs: fpState.pcs.map(pc => pc.id === id ? { ...pc, current: Math.max(0, pc.current - 1) } : pc) };
          fpState = updated;
          persistFP(updated);
        }}
        onRoll={(r) => {
          showToast(r.who + ' \u00b7 ' + r.skill + ' \u2192 ' + (r.total >= 0 ? '+' : '') + r.total);
          addRoll(r);
        }}
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

  <!-- Session notes floater -->
  {#if showNotes}
    <div class="board-floater board-notes-floater" onclick={(e) => e.stopPropagation()}>
      <div class="board-floater-hdr">
        <span class="board-floater-title"><i class="fa-solid fa-note-sticky" aria-hidden="true"></i> Session Notes</span>
        <button class="board-floater-close" onclick={() => { showNotes = false; }} aria-label="Close session notes">&times;</button>
      </div>
      <div style="padding:12px;color:var(--text-muted);font-size:13px">
        Session notes coming soon.
      </div>
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
      onSendToTable={binder ? binder.sendToTable : null}
      onRemoveFromTable={binder ? binder.removeFromTable : null}
      onDelete={canvas ? canvas.deleteCard : null}
      isOnTable={playCardIds.has(dossierCard.id)}
      {mode}
      campName={campMeta.name}
      {campId}
    />
  {/if}


  <!-- Compel offer modal -->
  {#if compelOffer}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={() => compelOffer = null} role="presentation">
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div class="modal-box modal-box-narrow" onclick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Compel offer"
        tabindex="-1">
        <div class="modal-header">
          <span class="modal-title">↩ Compel Offer</span>
          <button class="modal-close" onclick={() => compelOffer = null} aria-label="Close">×</button>
        </div>
        <div class="modal-body" style="padding:16px">
          <div style="margin-bottom:12px; font-size:13px">
            <strong>{compelOffer.playerName}</strong> — aspect:
            <em style="color:var(--accent)">{compelOffer.aspect}</em>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin-bottom:16px; line-height:1.5">
            Offer 1 FP to complicate their situation using this aspect.
            They can accept (take complication + gain 1 FP) or refuse (pay 1 FP to resist).
          </div>
          <div style="display:flex; gap:8px; justify-content:flex-end">
            <button class="tb-confirm-cancel" onclick={() => compelOffer = null}>Cancel</button>
            <button class="tb-confirm-ok" onclick={() => {
              if (play) {
                const p = players.find(pl => pl.id === compelOffer.playerId);
                if (p) {
                  play.updPlayer(compelOffer.playerId, { fp: (p.fp || 0) + 1 });
                  showToast('↩ Compel accepted — ' + compelOffer.playerName + ' gains 1 FP');
                }
              }
              compelOffer = null;
            }}>Accept (+1 FP)</button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Clear table modal -->
  {#if showClearModal}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={() => showClearModal = false} role="presentation">
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div class="modal-box modal-box-narrow" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Clear table options">
        <div class="modal-header">
          <span class="modal-title">Clear Table</span>
          <button class="btn btn-ghost btn-icon" onclick={() => showClearModal = false} aria-label="Close"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        </div>
        <div class="modal-body">
          <p class="rhp-ready-sub">Choose what to clear. This cannot be undone.</p>
          <div class="sz-grid">
            <button class="btn sz-option" onclick={() => { if (canvas) canvas.clearCanvas(); showClearModal = false; }}>
              <div class="sz-option-title">Clear current canvas</div>
              <div class="sz-option-sub">Removes all cards from the {mode} canvas</div>
            </button>
            <button class="btn sz-option" onclick={() => { showClearModal = false; showToast('Use Prep mode to clear prep canvas'); }}>
              <div class="sz-option-title">Clear other canvas</div>
              <div class="sz-option-sub">Switch to {mode === 'prep' ? 'play' : 'prep'} mode first to clear that canvas</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
