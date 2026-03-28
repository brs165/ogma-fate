// canvasStore.js — Canvas state: card CRUD, generate, connectors, undo, IDB persist, SvelteFlow derived stores
// Factory: createCanvasStore(campCanvasKey, tables, showToast, onCardsChange)
import { writable, get } from 'svelte/store';
import { generate, mergeUniversal, filteredTables, GENERATORS } from '../engine.js';
import { DB } from '../db.js';
import { boardUid, extractCardTitle, extractCardSummary, extractCardTags, STICKY_COLORS } from '../helpers.js';

// ── Session Zero pack generator (standalone, no store dependency) ─────────
export function generateSzPack(pcDrafts, campId, campName, campData, mode) {
  const tables = filteredTables(mergeUniversal(campData.tables || {}), {});
  const allCards = [];
  const CARD_W = 360, CARD_GAP = 24, COLS = 3;

  // Campaign Frame card
  try {
    const frameData = generate('campaign', tables, 4, {});
    allCards.push({ id: boardUid(), genId: 'campaign', sourceCanvas: 'prep', title: campName + ' — Campaign Frame', summary: '', tags: [], data: frameData, x: 24, y: 24, z: Date.now(), ts: Date.now(), gmOnly: false });
  } catch(e) {}

  // Per-PC cards
  pcDrafts.forEach((pc, idx) => {
    const col = (idx + 1) % COLS;
    const row = Math.floor((idx + 1) / COLS);
    const baseX = 24 + col * (CARD_W + CARD_GAP);
    const baseY = 24 + row * 600;

    let pcData = {};
    try { pcData = generate('pc', tables, 4, {}); } catch(e) {}
    if (pc.name) pcData.name = pc.name;
    if (pc.hc) pcData.aspects = { ...pcData.aspects, high_concept: pc.hc };
    if (pc.trouble) pcData.aspects = { ...pcData.aspects, trouble: pc.trouble };

    allCards.push({ id: boardUid(), genId: 'pc', sourceCanvas: 'prep', title: pc.name || ('Player ' + (idx + 1)), summary: pc.hc || '', tags: [], data: pcData, x: baseX, y: baseY, z: Date.now() + idx, ts: Date.now(), gmOnly: false });

    if (pc.hc) allCards.push({ id: boardUid(), genId: 'sticky', sourceCanvas: 'prep', text: pc.hc, colorIdx: idx % 4, rotation: Math.random() * 4 - 2, x: baseX, y: baseY + 520, z: Date.now() + idx + 0.1, ts: Date.now() });
    if (pc.trouble) allCards.push({ id: boardUid(), genId: 'sticky', sourceCanvas: 'prep', text: pc.trouble, colorIdx: (idx + 2) % 4, rotation: Math.random() * 4 - 2, x: baseX + CARD_W / 2, y: baseY + 520, z: Date.now() + idx + 0.2, ts: Date.now() });

    try {
      const bsData = generate('backstory', tables, 4, {});
      allCards.push({ id: boardUid(), genId: 'backstory', sourceCanvas: 'prep', title: (pc.name || 'Player ' + (idx + 1)) + ' — Backstory', summary: '', tags: [], data: bsData, x: baseX, y: baseY + 660, z: Date.now() + idx + 0.3, ts: Date.now(), gmOnly: false });
    } catch(e) {}
  });

  return allCards;
}

export function createCanvasStore(campCanvasKey, tables, showToast, onCardsChange) {
  const cards  = writable([]);
  const connectors = writable([]);
  const groups     = writable([]);
  const loaded = writable(false);

  let undoStack   = [];
  const lastPlaced = { x: 60, y: 60, col: 0 };

  // Load canvas from IDB
  if (DB) {
    DB.loadSession(campCanvasKey).then(saved => {
      if (saved && Array.isArray(saved.cards)) {
        cards.set(saved.cards);
      }
      loaded.set(true);
    }).catch(() => loaded.set(true));
    DB.loadSession(campCanvasKey + '_connectors').then(saved => {
      if (saved && Array.isArray(saved.connectors)) connectors.set(saved.connectors);
    }).catch(() => {});
    DB.loadSession(campCanvasKey + '_groups').then(saved => {
      if (saved && Array.isArray(saved.groups)) groups.set(saved.groups);
    }).catch(() => {});
  } else {
    loaded.set(true);
  }

  let _persistTimer;
  function persistCanvas(nextCards) {
    if (!DB) return;
    clearTimeout(_persistTimer);
    _persistTimer = setTimeout(() => {
      DB.saveSession(campCanvasKey, { cards: nextCards, ts: Date.now() }).catch(() => {});
    }, 400);
    if (onCardsChange) onCardsChange(nextCards);
  }

  function mutate(fn) {
    cards.update(prev => {
      const next = fn(prev);
      persistCanvas(next);
      return next;
    });
  }

  function generateCard(genId, x, y) {
    if (genId === 'label') {
      const newLabel = {
        id: boardUid(), genId: 'label', text: 'Section',
        x: x !== undefined ? x : lastPlaced.x,
        y: y !== undefined ? y : Math.max(0, lastPlaced.y - 24),
        z: Date.now(), ts: Date.now(), styleIdx: 0,
      };
      mutate(prev => prev.concat([newLabel]));
      showToast('Section label added — double-click to rename');
      return;
    }
    if (genId === 'sticky') {
      const sc = STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];
      const sticky = {
        id: boardUid(), genId: 'sticky', text: '"New Aspect"',
        colorIdx: STICKY_COLORS.indexOf(sc),
        rotation: (Math.random() * 6 - 3),
        x: x !== undefined ? x : (80 + Math.random() * 400),
        y: y !== undefined ? y : (80 + Math.random() * 300),
        z: Date.now(), ts: Date.now(),
      };
      mutate(prev => prev.concat([sticky]));
      showToast('Aspect sticky added');
      return;
    }
    if (genId === 'boost') {
      const boostCard = {
        id: boardUid(), genId: 'boost', text: '"New Boost"',
        freeInvokes: 1, expired: false,
        rotation: (Math.random() * 4 - 2),
        x: x !== undefined ? x : (80 + Math.random() * 400),
        y: y !== undefined ? y : (80 + Math.random() * 300),
        z: Date.now(), ts: Date.now(),
      };
      mutate(prev => prev.concat([boostCard]));
      showToast('⚡ Boost added — 1 free invoke');
      return;
    }
    if (genId === 'custom') {
      const customCard = {
        id: boardUid(), genId: 'custom',
        title: 'Custom Card', summary: '', tags: ['Aspect'],
        data: { title: 'Custom Card', body: '', type: 'aspect' },
        x: x !== undefined ? x : lastPlaced.x,
        y: y !== undefined ? y : lastPlaced.y,
        z: Date.now(), ts: Date.now(), gmOnly: false,
      };
      lastPlaced.col = (lastPlaced.col + 1) % 3;
      if (lastPlaced.col === 0) { lastPlaced.x = 60; lastPlaced.y += 420; } else { lastPlaced.x += 340; }
      mutate(prev => prev.concat([customCard]));
      showToast('✎ Custom Card added — click title or notes to edit');
      return;
    }
    let t = tables;
    try { if (typeof mergeUniversal === 'function') t = mergeUniversal(t); } catch (e) {}
    let data = null;
    try { if (typeof generate === 'function') data = generate(genId, t, 4); } catch (e) { console.warn('[Board] generate failed:', e); }
    if (!data) { showToast('Generation failed'); return; }
    const genMeta = (GENERATORS || []).find(g => g.id === genId) || {};
    let cardX, cardY;
    if (x !== undefined) {
      cardX = x; cardY = y;
    } else {
      cardX = lastPlaced.x; cardY = lastPlaced.y;
      lastPlaced.col = (lastPlaced.col + 1) % 3;
      if (lastPlaced.col === 0) { lastPlaced.x = 60; lastPlaced.y += 420; } else { lastPlaced.x += 340; }
    }
    const card = {
      id: boardUid(), genId,
      title: extractCardTitle(genId, data),
      summary: extractCardSummary(genId, data),
      tags: extractCardTags(genId, data),
      data, x: cardX, y: cardY,
      z: Date.now(), ts: Date.now(), gmOnly: false,
    };
    mutate(prev => prev.concat([card]));
    showToast('Generated: ' + (genMeta.icon || '') + ' ' + (genMeta.label || genId));
  }

  function updateCard(id, patch) {
    mutate(prev => prev.map(c => c.id === id ? Object.assign({}, c, patch) : c));
  }

  function deleteCard(id) {
    removeCardConnectors(id);
    cards.update(prev => {
      const removing = prev.find(c => c.id === id);
      if (removing) {
        undoStack = [{ type: 'delete', card: removing }, ...undoStack].slice(0, 10);
      }
      const next = prev.filter(c => c.id !== id);
      persistCanvas(next);
      return next;
    });
    showToast('Deleted — Ctrl+Z to undo');
  }

  function rerollCard(id) {
    const existing = get(cards).find(c => c.id === id);
    if (!existing || existing.genId === 'sticky' || existing.genId === 'custom') return;
    let t = tables;
    try { if (typeof mergeUniversal === 'function') t = mergeUniversal(t); } catch (e) {}
    let data = null;
    try { if (typeof generate === 'function') data = generate(existing.genId, t, 4); } catch (e) {}
    if (!data) return;
    undoStack = [{ type: 'reroll', id, prev: existing }, ...undoStack].slice(0, 10);
    mutate(prev => prev.map(c => {
      if (c.id !== id) return c;
      return Object.assign({}, c, {
        title: extractCardTitle(existing.genId, data),
        summary: extractCardSummary(existing.genId, data),
        tags: extractCardTags(existing.genId, data),
        data, ts: Date.now(),
      });
    }));
    showToast('Rerolled — Ctrl+Z to undo');
  }

  function undoLast() {
    if (undoStack.length === 0) { showToast('Nothing to undo'); return; }
    const entry = undoStack[0];
    undoStack = undoStack.slice(1);
    if (entry.type === 'delete') {
      mutate(prev => prev.concat([entry.card]));
      showToast('Delete undone (' + undoStack.length + ' left)');
    } else if (entry.type === 'reroll') {
      mutate(prev => prev.map(c => c.id === entry.id ? entry.prev : c));
      showToast('Reroll undone (' + undoStack.length + ' left)');
    } else if (entry.type === 'move') {
      mutate(prev => prev.map(c => entry.positions[c.id] ? Object.assign({}, c, entry.positions[c.id]) : c));
      showToast('Move undone (' + undoStack.length + ' left)');
    }
  }

  function exportCanvas(canvasKey, fname) {
    if (!DB || !DB.exportCanvasState) { showToast('Export unavailable'); return; }
    DB.exportCanvasState(canvasKey, fname).then(() => {
      showToast('Board exported');
    }).catch(err => {
      showToast(err && err.message ? err.message : 'Export failed');
    });
  }

  function importCanvas() {
    if (!DB || !DB.importCanvasState) { showToast('Import unavailable'); return; }
    DB.importCanvasState().then(data => {
      if (!data || !data.state || !Array.isArray(data.state.cards)) { showToast('Invalid board file'); return; }
      cards.set(data.state.cards);
      persistCanvas(data.state.cards);
      showToast('Board imported — ' + data.state.cards.length + ' cards loaded');
    }).catch(err => {
      if (err && err.message && err.message !== 'No file selected') showToast('Import failed: ' + err.message);
    });
  }

  function generateCardWithData(genId, data, x, y) {
    if (!data) return;
    const card = {
      id: boardUid(),
      genId,
      title: extractCardTitle(genId, data),
      summary: extractCardSummary(genId, data),
      tags: extractCardTags(genId, data),
      data,
      x: x !== undefined ? x : lastPlaced.x,
      y: y !== undefined ? y : lastPlaced.y,
      z: Date.now(),
      ts: Date.now(),
      gmOnly: false,
    };
    if (x === undefined) {
      lastPlaced.col = (lastPlaced.col + 1) % 3;
      if (lastPlaced.col === 0) { lastPlaced.x = 60; lastPlaced.y += 420; } else { lastPlaced.x += 340; }
    }
    mutate(prev => prev.concat([card]));
    if (showToast) showToast('Session Zero PC added to canvas');
  }

  function importCards(results) {
    if (!results || !results.length) return 0;
    var newCards = results.map(function(r, i) {
      return {
        id: boardUid(),
        genId: r.generator || '',
        title: extractCardTitle(r.generator || '', r.data || {}),
        summary: extractCardSummary(r.generator || '', r.data || {}),
        tags: extractCardTags(r.generator || '', r.data || {}),
        data: r.data || {},
        x: 80 + (i % 5) * 320,
        y: 80 + Math.floor(i / 5) * 240,
        z: Date.now() + i,
        ts: r.ts || Date.now(),
        gmOnly: false,
      };
    });
    mutate(function(prev) { return prev.concat(newCards); });
    return newCards.length;
  }

  function persistConnectors() {
    if (!DB) return;
    DB.saveSession(campCanvasKey + '_connectors', { connectors: get(connectors), ts: Date.now() }).catch(() => {});
  }

  function addConnector(fromId, toId) {
    if (fromId === toId) return;
    const existing = get(connectors);
    if (existing.find(c => (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId))) return;
    connectors.update(cs => cs.concat([{ id: boardUid(), fromId, toId }]));
    persistConnectors();
  }

  function removeConnector(connId) {
    connectors.update(cs => cs.filter(c => c.id !== connId));
    persistConnectors();
  }

  function updateConnector(connId, patch) {
    connectors.update(cs => cs.map(c => c.id === connId ? Object.assign({}, c, patch) : c));
    persistConnectors();
  }

  function removeCardConnectors(cardId) {
    connectors.update(cs => cs.filter(c => c.fromId !== cardId && c.toId !== cardId));
    persistConnectors();
  }

  function persistGroups() {
    if (!DB) return;
    DB.saveSession(campCanvasKey + '_groups', { groups: get(groups), ts: Date.now() }).catch(() => {});
  }

  function addGroup(x, y) {
    const g = { id: boardUid(), label: 'Scene', x: x || 60, y: y || 60, w: 640, h: 440, colorIdx: 0 };
    groups.update(gs => gs.concat([g]));
    persistGroups();
    if (showToast) showToast('\u{1F5C2} Group added — double-click label to rename');
  }

  function updateGroup(id, patch) {
    groups.update(gs => gs.map(g => g.id === id ? Object.assign({}, g, patch) : g));
    persistGroups();
  }

  function deleteGroup(id) {
    groups.update(gs => gs.filter(g => g.id !== id));
    persistGroups();
  }

  function clearCanvas() {
    connectors.set([]);
    persistConnectors();
    groups.set([]);
    persistGroups();
    mutate(() => []);
    if (showToast) showToast('Canvas cleared');
  }

  // WC-08: Create a sticky with pre-filled text (used by consequence auto-placement)
  function addStickyWithText(text, colorIdx, rotation) {
    const sticky = {
      id: boardUid(), genId: 'sticky', text: text || '"Aspect"',
      colorIdx: colorIdx != null ? colorIdx : Math.floor(Math.random() * STICKY_COLORS.length),
      rotation: rotation != null ? rotation : (Math.random() * 6 - 3),
      x: 80 + Math.random() * 400,
      y: 80 + Math.random() * 300,
      z: Date.now(), ts: Date.now(),
    };
    mutate(prev => prev.concat([sticky]));
  }

  function autoArrange() {
    var current = get(cards);
    if (!current.length) return;
    var sorted = current.slice().sort(function(a, b) { return (a.ts || 0) - (b.ts || 0); });
    var COLS = 3, CW = 680, CH = 440, PX = 60, PY = 60;
    var next = current.map(function(c) {
      var idx = sorted.indexOf(c);
      return Object.assign({}, c, {
        x: PX + (idx % COLS) * CW,
        y: PY + Math.floor(idx / COLS) * CH,
      });
    });
    cards.set(next);
    persistCanvas(next);
    lastPlaced.col = sorted.length % COLS;
    lastPlaced.x = PX + lastPlaced.col * (lastPlaced.col > 0 ? 340 : 0);
    lastPlaced.y = PY + Math.floor(sorted.length / COLS) * 420;
  }

  return {
    cards, loaded, connectors, groups,
    getCards: () => get(cards),
    persistCanvas,
    generateCard, generateCardWithData,
    updateCard, deleteCard, rerollCard,
    addConnector, removeConnector, updateConnector, removeCardConnectors,
    addGroup, updateGroup, deleteGroup,
    clearCanvas,
    addStickyWithText,
    undoLast, exportCanvas, importCanvas, importCards, autoArrange,
  };
}
