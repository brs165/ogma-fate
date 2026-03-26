// binderStore.js — Binder: saved cards, tray, pin/unpin, send to canvas
// Factory: createBinderStore(campId, campMetaName, playCanvasKey, showToast, getCanvasCards, persistCanvas, onTableChange)
import { writable, get } from 'svelte/store';
import DB from '../db.js';

export function createBinderStore(campId, campMetaName, playCanvasKey, showToast, getCanvasCards, persistCanvas, onTableChange) {
  const binderCards = writable([]);
  const trayCards   = writable([]);
  const binderOpen  = writable(false);
  const playCardIds = writable(new Set());

  // Load Binder cards + Tray + play canvas IDs from IDB on init
  if (DB) {
    DB.loadCards(campId).then(cards => {
      if (cards && cards.length) binderCards.set(cards.sort((a, b) => b.ts - a.ts));
    }).catch(() => {});
    DB.loadSession('binder_tray_' + campId).then(saved => {
      if (saved && Array.isArray(saved.cards) && saved.cards.length) trayCards.set(saved.cards);
    }).catch(() => {});
    DB.loadSession(playCanvasKey).then(saved => {
      if (saved && Array.isArray(saved.cards)) {
        playCardIds.set(new Set(saved.cards.map(c => c.sourceId || c.id)));
      }
    }).catch(() => {});
  }

  function addToTray(card) {
    const cur = get(trayCards);
    const already = cur.some(c => c.id === card.id);
    if (already) { showToast('Already in Tray'); return; }
    const next = cur.concat([Object.assign({}, card, { trayTs: Date.now() })]);
    trayCards.set(next);
    if (DB) DB.saveSession('binder_tray_' + campId, { cards: next }).catch(() => {});
    showToast('✓ Added to Tray');
  }

  function removeFromTray(cardId) {
    trayCards.update(prev => {
      const next = prev.filter(c => c.id !== cardId);
      if (DB) DB.saveSession('binder_tray_' + campId, { cards: next }).catch(() => {});
      return next;
    });
  }

  function sendTrayToCanvas() {
    const cur = get(trayCards);
    if (!cur.length) { showToast('Tray is empty'); return; }
    const currentCards = getCanvasCards ? getCanvasCards() : [];
    const newCards = cur.map((card, i) => {
      const d = card.data || {};
      const title = d.name || d.location || d.situation || (d.aspects && d.aspects.high_concept) || card.genId;
      return {
        id: 'b' + Date.now() + i + Math.random().toString(36).slice(2, 5),
        genId: card.genId, title, summary: card.label || title, tags: [],
        data: d, x: 60 + (i % 3) * 340, y: 60 + Math.floor(i / 3) * 280,
        z: Date.now() + i, ts: Date.now(), gmOnly: false,
      };
    });
    if (persistCanvas) persistCanvas(currentCards.concat(newCards));
    const count = cur.length;
    trayCards.set([]);
    if (DB) DB.saveSession('binder_tray_' + campId, { cards: [] }).catch(() => {});
    showToast('✓ ' + count + ' card' + (count === 1 ? '' : 's') + ' placed on canvas');
  }

  function sendToCanvas(card) {
    const d = card.data || {};
    const title = d.name || d.location || d.situation || (d.aspects && d.aspects.high_concept) || card.genId;
    const placed = {
      id: 'b' + Date.now() + Math.random().toString(36).slice(2, 6),
      genId: card.genId, title, summary: card.label || title, tags: [],
      data: d, x: 60 + Math.floor(Math.random() * 3) * 340,
      y: 60 + Math.floor(Math.random() * 2) * 200,
      z: Date.now(), ts: Date.now(), gmOnly: false,
    };
    const prev = getCanvasCards ? getCanvasCards() : [];
    const next = prev.concat([placed]);
    if (persistCanvas) persistCanvas(next);
    showToast('✓ Placed on canvas');
  }

  function unpinCard(cardId) {
    binderCards.update(prev => prev.filter(c => c.id !== cardId));
    if (DB) DB.deleteCard(campId, cardId).catch(() => {});
  }

  function exportCard(card) {
    if (DB && DB.exportCard) {
      DB.exportCard({ genId: card.genId, label: card.label, data: card.data, state: card.state || null, ts: card.ts }, campMetaName);
    }
  }

  function sendToTable(card) {
    if (!DB) { showToast('⚠ Storage unavailable'); return; }
    const tableCard = Object.assign({}, card, {
      id: 'tbl_' + Date.now() + Math.random().toString(36).slice(2, 5),
      sourceId: card.id, ts: Date.now(),
    });
    DB.loadSession(playCanvasKey).then(saved => {
      const existing = (saved && Array.isArray(saved.cards)) ? saved.cards : [];
      const alreadySent = existing.some(c => c.sourceId === card.id);
      if (alreadySent) { showToast('Already on table'); return; }
      const next = existing.concat([tableCard]);
      return DB.saveSession(playCanvasKey, { cards: next, ts: Date.now() }).then(() => {
        playCardIds.update(prev => { const ns = new Set(prev); ns.add(card.id); return ns; });
        showToast('● Put on table');
        if (onTableChange) onTableChange(next.filter(c => !c.gmOnly));
      });
    }).catch(() => showToast('⚠ Could not put on table'));
  }

  // SCN-02: Remove from table
  function removeFromTable(sourceId) {
    if (!DB) { showToast('⚠ Storage unavailable'); return; }
    DB.loadSession(playCanvasKey).then(saved => {
      const existing = (saved && Array.isArray(saved.cards)) ? saved.cards : [];
      const next = existing.filter(c => c.sourceId !== sourceId);
      if (next.length === existing.length) { showToast('Not on table'); return; }
      return DB.saveSession(playCanvasKey, { cards: next, ts: Date.now() }).then(() => {
        playCardIds.update(prev => { const ns = new Set(prev); ns.delete(sourceId); return ns; });
        showToast('○ Removed from table');
        if (onTableChange) onTableChange(next.filter(c => !c.gmOnly));
      });
    }).catch(() => showToast('⚠ Could not remove from table'));
  }

  // WS-32: Clear all cards from play table
  function clearTable() {
    if (!DB) return;
    DB.saveSession(playCanvasKey, { cards: [], ts: Date.now() }).then(() => {
      playCardIds.set(new Set());
      if (onTableChange) onTableChange([]);
    }).catch(() => {});
  }

  return {
    binderCards, trayCards, binderOpen, playCardIds,
    addToTray, removeFromTray, sendTrayToCanvas, sendToCanvas,
    unpinCard, exportCard, sendToTable, removeFromTable, clearTable,
  };
}
