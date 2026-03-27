<svelte:options runes={false} />

<script>
  import { onMount, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { getWorldTables, getWorldMeta } from '../../helpers.js';
  import { createCanvasStore } from '../../stores/canvasStore.js';
  import { createPlayStore } from '../../stores/playStore.js';
  import { createBinderStore } from '../../stores/binderStore.js';
  import { createSyncStore } from '../../stores/syncStore.js';
  import DB from '../../db.js';

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
  import FatePointTracker from '../campaign/FatePointTracker.svelte';

  // ── Props ──────────────────────────────────────────────────────────────────
  export let campId = 'fantasy';
  export let initialMode = 'prep';
  export let initialRoom = null;

  // ── Constants ──────────────────────────────────────────────────────────────
  const BOARD_CANVAS_PREP_KEY = 'board_canvas_v1';
  const BOARD_CANVAS_PLAY_KEY = 'board_play_v1';
  const BOARD_FP_KEY = 'board_fp_v1';

  // ── Derived (early — needed before stores) ──────────────────────────────
  $: campMeta = getWorldMeta(campId);
  $: tables = getWorldTables(campId);

  // ── Local state ────────────────────────────────────────────────────────────
  let mode = initialMode;
  let activeGen = 'npc_minor';
  let leftTab = 'gen';
  let theme = 'dark';
  let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  let toast = null;
  let dossierCard = null;
  let cmdPalette = false;
  let cardSearch = '';
  let showTracker = false;
  let exportView = false;
  let zoom = 0.6;
  let pan = { x: 0, y: 0 };

  // Coach marks
  let coachCanvas = false;
  let coachPlay = false;

  // Panel visibility
  let leftOpen = typeof window !== 'undefined' ? window.innerWidth > 520 : true;
  let showDice = false;
  let showFP = false;
  let showNotes = false;
  let mobileListView = false;

  // Player join state
  let playerJoinName = '';
  let playerJoinSent = false;
  let pcStep = 0;
  let pcDraft = { hc: '', trouble: '', aspect3: '', skills: {}, avatar: '' };

  // FP tracker state
  let fpState = null;

  // Sync state received from GM
  let syncState = null;

  // Compel + invoke
  let compelOffer = null;
  let pendingInvoke = null;
  let rollHistory = [];

  // Canvas refs
  let canvasRef;
  let dragRef = null;
  let panRef = null;

  // Context menu
  let ctx = null;

  // ── Toast queue ────────────────────────────────────────────────────────────
  let toastTimer = null;
  let toastQueue = [];

  function drainToast() {
    if (toastQueue.length === 0) { toast = null; return; }
    toast = toastQueue.shift();
    toastTimer = setTimeout(drainToast, 1800);
  }

  function showToast(msg) {
    toastQueue.push(msg);
    if (!toastTimer || toastQueue.length === 1) {
      clearTimeout(toastTimer);
      drainToast();
    }
  }

  // ── Stores ─────────────────────────────────────────────────────────────────
  $: canvasKey = mode === 'prep' ? BOARD_CANVAS_PREP_KEY : BOARD_CANVAS_PLAY_KEY;
  $: campCanvasKey = canvasKey + '_' + campId;

  // These stores are created once on mount and recreated when campId changes
  let canvas;
  let play;
  let binder;
  let sync;

  function initStores() {
    // Clean up previous subscriptions
    unsubs.forEach(u => u());
    unsubs = [];

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
    unsubs.push(canvas.loaded.subscribe(v => loaded = v));
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
  let cards = [];
  let loaded = false;
  let players = [];
  let round = 1;
  let order = [];
  let selPlayer = null;
  let roundFlash = false;
  let gmPool = 0;
  let binderCards = [];
  let trayCards = [];
  let binderOpenVal = false;
  let playCardIds = new Set();
  let syncObj = null;
  let syncStatus = 'offline';
  let roomCode = '';

  let unsubs = [];

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  onMount(() => {
    initStores();

    // Theme restore
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      const t = p.theme || localStorage.getItem('fate_theme') || 'dark';
      theme = t;
      document.documentElement.setAttribute('data-theme', t);
    } catch (e) {}

    // Campaign data-attribute
    if (campId) document.documentElement.setAttribute('data-campaign', campId);

    // Coach mark
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      if (!p.coach_canvas_dismissed) coachCanvas = true;
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
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  onDestroy(() => {
    unsubs.forEach(u => u());
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keydown', onGlobalKey);
    }
    clearTimeout(toastTimer);
    document.documentElement.removeAttribute('data-campaign');
  });

  function goOnline() { isOnline = true; }
  function goOffline() { isOnline = false; }

  // ── Mode change — left panel always open in prep ──────────────────────────
  $: if (mode === 'prep') leftOpen = true;

  // ── Play mode coach mark ──────────────────────────────────────────────────
  $: if (mode === 'play') {
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      if (!p.coach_play_dismissed) coachPlay = true;
    } catch (e) {}
  }

  // ── Theme toggle ──────────────────────────────────────────────────────────
  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      p.theme = theme;
      localStorage.setItem('fate_prefs_v1', JSON.stringify(p));
    } catch (e) {}
  }

  // ── Coach mark dismiss ────────────────────────────────────────────────────
  function dismissCoachCanvas() {
    coachCanvas = false;
    try { const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}'); p.coach_canvas_dismissed = true; localStorage.setItem('fate_prefs_v1', JSON.stringify(p)); } catch (e) {}
  }
  function dismissCoachPlay() {
    coachPlay = false;
    try { const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}'); p.coach_play_dismissed = true; localStorage.setItem('fate_prefs_v1', JSON.stringify(p)); } catch (e) {}
  }

  // ── Generator select (left panel click = generate immediately) ────────────
  function selectGen(genId) {
    activeGen = genId;
    if (canvas) canvas.generateCard(genId);
  }

  // ── Mode change handler ───────────────────────────────────────────────────
  function onModeChange(m) {
    if (canvas) canvas.persistCanvas(get(canvas.cards));
    mode = m;
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
  function onDragStart(e, cardId) {
    if (e.button !== 0) return;
    const allCards = canvas ? get(canvas.cards) : [];
    const card = allCards.find(c => c.id === cardId);
    if (!card) return;

    const el = e.target.closest('.board-card') || e.target.closest('.board-sticky') || e.target.closest('.board-boost') || e.target.closest('.board-label');
    if (!el) return;

    const topZ = Date.now();
    el.style.zIndex = topZ;

    dragRef = {
      cardId, el,
      startMouseX: e.clientX, startMouseY: e.clientY,
      startCardX: card.x, startCardY: card.y,
      topZ, moved: false, finalX: null, finalY: null,
    };
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (dragRef) {
      const dx = e.clientX - dragRef.startMouseX;
      const dy = e.clientY - dragRef.startMouseY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.moved = true;
      const newX = dragRef.startCardX + dx / zoom;
      const newY = dragRef.startCardY + dy / zoom;
      dragRef.el.style.left = newX + 'px';
      dragRef.el.style.top = newY + 'px';
      dragRef.finalX = newX;
      dragRef.finalY = newY;
      if (!dragRef.el.classList.contains('drag-active')) {
        dragRef.el.classList.add('drag-active');
      }
    }
    if (panRef) {
      const pdx = e.clientX - panRef.startX;
      const pdy = e.clientY - panRef.startY;
      pan = { x: panRef.origX + pdx, y: panRef.origY + pdy };
    }
  }

  function onMouseUp() {
    if (dragRef) {
      const d = dragRef;
      dragRef = null;
      if (d.el) d.el.classList.remove('drag-active');
      if (d.moved && canvas) {
        const fx = d.finalX != null ? d.finalX : d.startCardX;
        const fy = d.finalY != null ? d.finalY : d.startCardY;
        canvas.updateCard(d.cardId, { x: fx, y: fy, z: d.topZ });
      } else if (canvas) {
        canvas.updateCard(d.cardId, { z: d.topZ });
      }
    }
    panRef = null;
  }

  // ── Zoom ──────────────────────────────────────────────────────────────────
  function changeZoom(delta) {
    zoom = Math.min(2, Math.max(0.25, Math.round((zoom + delta) * 100) / 100));
  }

  function fitAll() {
    if (!cards || cards.length === 0 || !canvasRef) return;
    const rect = canvasRef.getBoundingClientRect();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    cards.forEach(c => {
      if (c.x != null && c.y != null) {
        minX = Math.min(minX, c.x); minY = Math.min(minY, c.y);
        maxX = Math.max(maxX, c.x + 320); maxY = Math.max(maxY, c.y + 400);
      }
    });
    if (!isFinite(minX)) return;
    const cw = maxX - minX + 60, ch = maxY - minY + 60;
    zoom = Math.min(2, Math.max(0.25, Math.min(rect.width / cw, rect.height / ch) * 0.9));
    pan = { x: -minX * zoom + (rect.width - cw * zoom) / 2 + 30, y: -minY * zoom + (rect.height - ch * zoom) / 2 + 30 };
  }

  // ── Canvas pan ────────────────────────────────────────────────────────────
  function onCanvasMouseDown(e) {
    if (leftOpen && typeof window !== 'undefined' && window.matchMedia('(max-width:640px)').matches) {
      leftOpen = false;
      return;
    }
    if (e.target.closest('.board-card') || e.target.closest('.board-sticky')) return;
    if (e.target.closest('.board-ctx') || e.target.closest('.board-zoom')) return;
    if (e.button !== 0 && e.button !== 1) return;
    panRef = { startX: e.clientX, startY: e.clientY, origX: pan.x, origY: pan.y };
    e.preventDefault();
  }

  function onCanvasWheel(e) {
    e.preventDefault();
    if (!canvasRef) return;
    const r = canvasRef.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    const nz = Math.min(2, Math.max(0.25, Math.round(zoom * delta * 100) / 100));
    pan = { x: mx - (mx - pan.x) * (nz / zoom), y: my - (my - pan.y) * (nz / zoom) };
    zoom = nz;
  }

  // ── Context menu (right-click) ────────────────────────────────────────────
  function onCanvasContextMenu(e) {
    if (e.target.closest('.board-card') || e.target.closest('.board-sticky')) return;
    e.preventDefault();
    const r = canvasRef.getBoundingClientRect();
    ctx = {
      screenX: e.clientX - r.left, screenY: e.clientY - r.top,
      canvasX: (e.clientX - r.left - pan.x) / zoom,
      canvasY: (e.clientY - r.top - pan.y) / zoom,
    };
  }

  function ctxGenerate(genId) {
    if (!ctx || !canvas) return;
    canvas.generateCard(genId, ctx.canvasX, ctx.canvasY);
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
    } else if (e.key === 'r' || e.key === 'R') {
      showDice = !showDice;
    } else if (e.key === 'f' || e.key === 'F') {
      fitAll();
    }
  }

  // ── Command palette actions ───────────────────────────────────────────────
  $: cmdActions = [
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
    { id: 'undo', icon: '\u21B6', label: 'Undo', shortcut: '\u2318Z', fn: () => { if (canvas) canvas.undoLast(); } },
    { id: 'mode', icon: '\u25B6', label: mode === 'prep' ? 'Switch to Play' : 'Switch to Prep', fn: () => onModeChange(mode === 'prep' ? 'play' : 'prep') },
    { id: 'theme', icon: '\u263D', label: 'Toggle Dark/Light', fn: toggleTheme },
  ];

  // ── NPC cards for turn bar ────────────────────────────────────────────────
  $: npcCards = cards.filter(c => c.genId === 'npc_minor' || c.genId === 'npc_major');

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

<div class="board-app" data-theme={theme} data-mode={mode} on:click={() => ctx = null}>

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
        onUpd={(id, patch) => { if (play) play.updPlayer(id, patch); }}
        onAdd={(name) => { if (play) play.addPlayer(name); }}
        collapsed={mode === 'prep'}
        {gmPool}
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
            <button class="bep-back-btn" on:click={() => { exportView = false; }} aria-label="Back to canvas">&larr; Back</button>
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
            <button class="ct-toggle-btn" on:click={() => { showTracker = !showTracker; }}
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

        <!-- Canvas area -->
        <div
          id="board-canvas"
          class="board-canvas-wrap"
          bind:this={canvasRef}
          on:contextmenu={onCanvasContextMenu}
          on:mousedown={onCanvasMouseDown}
          on:wheel|preventDefault={onCanvasWheel}
        >
          <!-- Dot grid background -->
          <div class="board-dot-grid"></div>

          <!-- Zoomable canvas layer -->
          <div
            class="board-canvas-layer"
            style="transform:translate({pan.x}px,{pan.y}px) scale({zoom});transform-origin:0 0"
          >
            {#each cards as card (card.id)}
              {#if card.genId === 'label'}
                <BoardLabel
                  {card}
                  onDelete={canvas ? canvas.deleteCard : () => {}}
                  onUpdate={canvas ? canvas.updateCard : () => {}}
                  {onDragStart}
                />
              {:else}
                <div style={cardSearch && !isSearchMatch(card) ? 'opacity:0.2;pointer-events:none' : ''}>
                  <BoardCard
                    {card}
                    onDelete={canvas ? canvas.deleteCard : null}
                    onReroll={canvas ? canvas.rerollCard : null}
                    onSendToTable={binder ? binder.sendToTable : null}
                    onRemoveFromTable={binder ? binder.removeFromTable : null}
                    onOpen={(c) => { dossierCard = c; }}
                    {onDragStart}
                    onUpdate={canvas ? canvas.updateCard : null}
                    {mode}
                    {campId}
                    isOnTable={playCardIds.has(card.id)}
                    onInvoke={(inv) => { pendingInvoke = inv; showDice = true; showToast('\u2726 Invoke queued \u2014 +2 on next roll'); }}
                  />
                </div>
              {/if}
            {/each}
          </div>

          <!-- Empty state -->
          {#if cards.length === 0 && loaded}
            <div class="board-empty">
              <div class="board-empty-icon">&#x1F3B2;</div>
              <div class="board-empty-title">Canvas is empty</div>
              <div class="board-empty-desc">
                Click any generator in the left panel to place a card.<br/>
                Right-click anywhere to generate in place.
              </div>
            </div>
          {/if}

          <!-- Coach marks -->
          {#if coachCanvas && cards.length === 0 && loaded && mode === 'prep'}
            <div class="board-coach board-coach-canvas" role="dialog" aria-label="Getting started tip">
              <div class="bc-coach-body">
                <div class="bc-coach-icon">&#x1F3B2;</div>
                <div class="bc-coach-text">
                  <strong>This is your GM canvas</strong>
                  <span> &mdash; generate cards from the left panel, arrange them here. Switch to <strong>Play</strong> and click <strong>Host</strong> when your players are ready.</span>
                </div>
                <button class="bc-coach-dismiss" on:click={dismissCoachCanvas} aria-label="Dismiss tip">&times;</button>
              </div>
            </div>
          {/if}

          {#if coachPlay && mode === 'play'}
            <div class="board-coach board-coach-play" role="dialog" aria-label="Play mode tip">
              <div class="bc-coach-body">
                <div class="bc-coach-icon">&#x25CF;</div>
                <div class="bc-coach-text">
                  <strong>Prep cards are private.</strong>
                  <span> Use <strong>&#x25CF; Send to Table</strong> on any Prep card to share it with connected players.</span>
                </div>
                <button class="bc-coach-dismiss" on:click={dismissCoachPlay} aria-label="Dismiss tip">&times;</button>
              </div>
            </div>
          {/if}

          <!-- Context menu -->
          {#if ctx}
            <div
              class="board-ctx"
              role="menu"
              aria-label="Generate card"
              style="left:{ctx.screenX}px;top:{ctx.screenY}px"
              on:click|stopPropagation
            >
              <div class="board-ctx-section" role="none">Generate here</div>
              {#each CTX_ITEMS as g (g.id)}
                <div
                  class="board-ctx-item" role="menuitem" tabindex="0"
                  on:click={() => ctxGenerate(g.id)}
                  on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ctxGenerate(g.id); } }}
                >
                  <span class="board-ctx-icon" aria-hidden="true">{g.icon}</span>
                  {g.label}
                </div>
              {/each}
              <div class="board-ctx-sep" role="separator"></div>
              <div
                class="board-ctx-item" role="menuitem" tabindex="0"
                on:click={() => { ctx = null; }}
                on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ctx = null; } }}
              >
                <span class="board-ctx-icon" aria-hidden="true">&times;</span> Cancel
              </div>
            </div>
          {/if}

          <!-- Card search -->
          <div class="board-search">
            <input
              type="text" value={cardSearch}
              placeholder="&#x1F50D; Search cards&hellip;"
              on:input={(e) => { cardSearch = e.target.value; }}
              on:keydown={(e) => { if (e.key === 'Escape') cardSearch = ''; }}
              aria-label="Search cards on canvas"
              style="width:{cardSearch ? 140 : 100}px;transition:width .15s"
            />
            {#if cardSearch}
              <button class="board-search-clear" on:click={() => { cardSearch = ''; }} aria-label="Clear search">&times;</button>
            {/if}
          </div>

          <!-- Zoom controls -->
          <div class="board-zoom">
            <button class="board-zoom-btn" on:click={() => changeZoom(-0.1)} aria-label="Zoom out">&minus;</button>
            <div class="board-zoom-pct">{Math.round(zoom * 100)}%</div>
            <button class="board-zoom-btn" on:click={() => changeZoom(0.1)} aria-label="Zoom in">+</button>
            <button class="board-zoom-btn" on:click={fitAll} aria-label="Fit all cards" title="Zoom to fit all cards">&#x2922;</button>
          </div>

          <!-- Toast -->
          {#if toast}
            <div class="board-toast">{toast}</div>
          {/if}
        </div>
      {/if}
    </div>
  </div>

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
    <div class="board-floater board-dice-floater" on:click|stopPropagation>
      <div class="board-floater-hdr">
        <span class="board-floater-title">&#x1F3B2; Dice</span>
        <button class="board-floater-close" on:click={() => { showDice = false; }} aria-label="Close dice roller">&times;</button>
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
    <div class="board-floater board-fp-floater" on:click|stopPropagation>
      <div class="board-floater-hdr">
        <span class="board-floater-title">&#x25CE; Fate Points</span>
        <button class="board-floater-close" on:click={() => { showFP = false; }} aria-label="Close Fate Point tracker">&times;</button>
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
    <div class="board-floater board-notes-floater" on:click|stopPropagation>
      <div class="board-floater-hdr">
        <span class="board-floater-title">&#x1F4DD; Session Notes</span>
        <button class="board-floater-close" on:click={() => { showNotes = false; }} aria-label="Close session notes">&times;</button>
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
</div>
