// canvasStore.js — from useBoardCards (react-source/core/ui-board.js L2387-2593)
// Factory: createCanvasStore(campCanvasKey, tables, showToast, onCardsChange)
import { writable, get } from 'svelte/store';
import { generate, mergeUniversal, filteredTables, GENERATORS } from '../engine.js';
import DB from '../db.js';
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
  const loaded = writable(false);

  let undoStack   = [];
  const lastPlaced = { x: 60, y: 60, col: 0 };

  // Load canvas from IDB when key changes
  if (DB) {
    DB.loadSession(campCanvasKey).then(saved => {
      if (saved && Array.isArray(saved.cards)) cards.set(saved.cards);
      loaded.set(true);
    }).catch(() => loaded.set(true));
    DB.loadSession(campCanvasKey + '_connectors').then(saved => {
      if (saved && Array.isArray(saved.connectors)) connectors.set(saved.connectors);
    }).catch(() => {});
  } else {
    loaded.set(true);
  }

  function persistCanvas(nextCards) {
    if (!DB) return;
    DB.saveSession(campCanvasKey, { cards: nextCards, ts: Date.now() }).catch(() => {});
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
      x: x !== undefined ? x : 80,
      y: y !== undefined ? y : 80,
      z: Date.now(),
      ts: Date.now(),
      gmOnly: false,
    };
    mutate(prev => prev.concat([card]));
    if (showToast) showToast('Session Zero PC added to canvas');
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

  function removeCardConnectors(cardId) {
    connectors.update(cs => cs.filter(c => c.fromId !== cardId && c.toId !== cardId));
    persistConnectors();
  }

  function clearCanvas() {
    connectors.set([]);
    persistConnectors();
    mutate(() => []);
    if (showToast) showToast('Canvas cleared');
  }

  function loadBinderToCanvas(binderCards) {
    if (!binderCards || binderCards.length === 0) return;
    const existing = get(cards);
    if (existing.length > 0) return;

    const CARD_W = 360;
    const CARD_GAP = 24;
    const COLS = 3;
    const START_X = 24;
    const START_Y = 24;

    const placed = binderCards.map((bc, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      return {
        id: boardUid(),
        genId: bc.genId,
        title: bc.title || extractCardTitle(bc.genId, bc.data || {}),
        summary: bc.summary || extractCardSummary(bc.genId, bc.data || {}),
        tags: bc.tags || extractCardTags(bc.genId, bc.data || {}),
        data: bc.data,
        x: START_X + col * (CARD_W + CARD_GAP),
        y: START_Y + row * (CARD_W + CARD_GAP),
        z: Date.now() + i,
        ts: Date.now(),
        gmOnly: false,
        _fromBinder: true,
      };
    });

    mutate(() => placed);
    if (showToast) showToast(placed.length + ' binder cards loaded to canvas');
  }

  return {
    cards, loaded, connectors,
    getCards: () => get(cards),
    persistCanvas,
    generateCard, generateCardWithData, loadBinderToCanvas,
    updateCard, deleteCard, rerollCard,
    addConnector, removeConnector, removeCardConnectors, clearCanvas,
    undoLast, exportCanvas, importCanvas,
  };
}
