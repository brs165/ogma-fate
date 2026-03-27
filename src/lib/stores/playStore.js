// playStore.js — from useBoardPlayState (react-source/core/ui-board.js L2081-2250)
// Factory: createPlayStore(campId)
import { writable } from 'svelte/store';
import DB from '../db.js';

const PLAYER_COLORS = ['var(--accent)', 'var(--c-purple)', 'var(--c-blue)', 'var(--c-green)', 'var(--c-red)'];

export function createPlayStore(campId) {
  const players    = writable([]);
  const round      = writable(1);
  const order      = writable([]);
  const selPlayer  = writable(null);
  const roundFlash = writable(false);
  const gmPool     = writable(0);

  let roundFlashTimer = null;

  function getVal(store) {
    let v;
    store.subscribe(x => v = x)();
    return v;
  }

  function persistPlayState(pl, rnd, ord, gp) {
    if (!DB) return;
    const key = 'board_play_session_' + campId;
    DB.saveSession(key, {
      players: pl  != null ? pl  : getVal(players),
      round:   rnd != null ? rnd : getVal(round),
      order:   ord != null ? ord : getVal(order),
      gmPool:  gp  != null ? gp  : getVal(gmPool),
    }).catch(err => console.warn('[Ogma] board play state save failed:', err));
  }

  // Load on init (once per campId)
  if (DB) {
    DB.loadSession('board_play_session_' + campId).then(saved => {
      if (!saved) return;
      if (Array.isArray(saved.players) && saved.players.length > 0) players.set(saved.players);
      if (typeof saved.round === 'number') round.set(saved.round);
      if (Array.isArray(saved.order) && saved.order.length > 0) order.set(saved.order);
      if (typeof saved.gmPool === 'number') gmPool.set(saved.gmPool);
    }).catch(() => {});
  }

  function newRound() {
    const next = getVal(round) + 1;
    round.set(next);
    players.update(ps => {
      const cleared = ps.map(p => Object.assign({}, p, { acted: false }));
      persistPlayState(cleared, next, null);
      return cleared;
    });
    roundFlash.set(true);
    if (roundFlashTimer) clearTimeout(roundFlashTimer);
    roundFlashTimer = setTimeout(() => roundFlash.set(false), 600);
  }

  function prevRound() {
    const cur = getVal(round);
    if (cur <= 1) return;
    const next = cur - 1;
    round.set(next);
    persistPlayState(null, next, null);
  }

  function toggleActed(playerId) {
    players.update(ps => {
      const next = ps.map(p => p.id === playerId ? Object.assign({}, p, { acted: !p.acted }) : p);
      persistPlayState(next, null, null);
      return next;
    });
  }

  function updPlayer(id, patch) {
    players.update(ps => {
      const next = ps.map(p => p.id === id ? Object.assign({}, p, patch) : p);
      persistPlayState(next, null, null);
      return next;
    });
  }

  // SCN-01: End Scene — clear all stress, preserve consequences/FP (FCon p.30)
  function endScene() {
    players.update(ps => {
      const cleared = ps.map(p => Object.assign({}, p, {
        phy: p.phy.map(() => false),
        men: p.men.map(() => false),
        acted: false,
      }));
      // FCon p.20: GM gets 1 FP per PC per new scene
      const newPool = cleared.length;
      gmPool.set(newPool);
      persistPlayState(cleared, null, null, newPool);
      return cleared;
    });
  }

  // FCon p.20: GM fate point pool
  function updGmPool(delta) {
    const cur = getVal(gmPool);
    const next = Math.max(0, cur + delta);
    gmPool.set(next);
    persistPlayState(null, null, null, next);
  }

  // WS-40: Session start — FCon p.19: FP resets to max(refresh, current)
  function startSession() {
    players.update(ps => {
      const refreshed = ps.map(p => Object.assign({}, p, { fp: Math.max(p.ref || 3, p.fp || 0) }));
      persistPlayState(refreshed, null, null);
      return refreshed;
    });
    round.set(1);
    persistPlayState(null, 1, null);
  }

  function addPlayer(nameArg, pcArg) {
    const cur = getVal(players);
    // WS-49: Max players guard
    if (cur.length >= 8) return;
    const name = nameArg || (typeof prompt !== 'undefined' ? prompt('Player name:') : null);
    if (!name) return;
    // PL-03: derive stress from skills (FCon p.12)
    const pc = pcArg || {};
    const skills = Array.isArray(pc.skills) ? pc.skills : [];
    const physique = (skills.find(s => s.name === 'Physique') || {}).r || 0;
    const will     = (skills.find(s => s.name === 'Will')     || {}).r || 0;
    const phy = physique >= 3 ? [false,false,false,false,false,false]
              : physique >= 1 ? [false,false,false,false]
              : [false,false,false];
    const men = will >= 3 ? [false,false,false,false,false,false]
              : will >= 1 ? [false,false,false,false]
              : [false,false,false];
    // WS-41: Extra mild consequence — FCon p.12
    const extraMild = (physique >= 5 || will >= 5);
    const np = {
      id: 'bp' + Date.now() + Math.random().toString(36).slice(2, 5),
      name,
      hc: pc.hc || '',
      fp: 3, ref: 3,
      phy, men,
      color: PLAYER_COLORS[cur.length % PLAYER_COLORS.length],
      acted: false,
      conseq: extraMild ? ['', '', '', ''] : ['', '', ''],
      extraMild,
      avatar: pc.avatar || '',
      aspects: pc.aspects || [],
      skills,
    };
    const nextP = cur.concat([np]);
    const curOrder = getVal(order);
    const nextO = curOrder.concat([np.id]);
    players.set(nextP);
    order.set(nextO);
    persistPlayState(nextP, null, nextO);
  }

  function removePlayer(id) {
    const nextP = getVal(players).filter(p => p.id !== id);
    const nextO = getVal(order).filter(oid => oid !== id);
    players.set(nextP);
    order.set(nextO);
    persistPlayState(nextP, null, nextO);
    const sel = getVal(selPlayer);
    if (sel === id) selPlayer.set(null);
  }

  return {
    players, round, order, selPlayer, roundFlash, gmPool,
    persistPlayState,
    newRound, prevRound, toggleActed,
    updPlayer, addPlayer, removePlayer,
    endScene, startSession, updGmPool,
  };
}
