// sessionStore.js — Session: active generator, result history, chain rolls, prefs
// Factory: createSessionStore(campId, campMeta, tables, prefs, showToast)
import { writable, get } from 'svelte/store';
import { generate, generateSeedPack, mergeUniversal, filteredTables, GENERATORS } from '../engine.js';
import { DB } from '../db.js';

const TOAST_MS = 2500;

export function createSessionStore(campId, campMeta, tables, prefs, showToast) {
  const activeGen       = writable('seed');
  const result          = writable(null);
  const rolling         = writable(false);
  const history         = writable([]);
  const partySize       = writable(3);
  const consequenceSev  = writable('');
  const cardView        = writable(false);
  const inspireMode     = writable(false);
  const inspireResults  = writable([]);
  const inspireChosen   = writable(null);
  const pinnedCards     = writable([]);
  const pinBouncing     = writable(false);
  const sessionPack     = writable(null);
  const packRolling     = writable(false);
  const resultAnim      = writable(false);
  const showStreakBadge = writable(false);
  const confPcs         = writable([]);

  let rollCount    = 0;
  let isMounted    = true;
  let currentPrefs = prefs;
  let usedGens     = {};

  // Load session from IDB
  if (DB) {
    DB.loadSession('fate_' + campId).then(saved => {
      if (saved && saved.result)    result.set(saved.result);
      if (saved && saved.history)   history.set(saved.history);
      if (saved && saved.activeGen) activeGen.set(saved.activeGen);
    }).catch(() => {});

    DB.loadCards(campId).then(cards => {
      if (cards && cards.length) pinnedCards.set(cards.sort((a, b) => b.ts - a.ts));
    }).catch(() => {});
  }

  // Persist result to IDB whenever it changes (debounced)
  let _sessionPersistTimer;
  result.subscribe(r => {
    if (!r || !DB) return;
    clearTimeout(_sessionPersistTimer);
    _sessionPersistTimer = setTimeout(() => {
      DB.saveSession('fate_' + campId, {
        result: r,
        history: get(history),
        activeGen: get(activeGen),
      }).catch(err => console.warn('[Ogma] save:', err));
      DB.saveSession('fate_last_camp', { id: campId }).catch(() => {});
    }, 400);
  });

  function doGenerate() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);
    rolling.set(true);
    rollCount += 1;
    if (rollCount % 5 === 0) {
      showStreakBadge.set(true);
      setTimeout(() => showStreakBadge.set(false), 1200);
    }
    try {
      const genId = get(activeGen);
      const pSize = get(partySize);
      const csev  = get(consequenceSev);
      const base = mergeUniversal ? mergeUniversal(tables) : tables;
      const eff  = filteredTables ? filteredTables(base, currentPrefs) : base;
      const opts = {};
      if (genId === 'consequence' && csev) opts.severity = csev;
      const seed = Math.floor(Math.random() * 0xFFFFFF) + 1;

      // Seed pack: generate multiple cards at once
      if (genId === 'seed') {
        let pack;
        try { pack = generateSeedPack(eff, pSize); } catch(e) { pack = null; }
        if (pack && pack.length > 0) {
          setTimeout(() => {
            if (!isMounted) return;
            result.set({ genId: 'seed', isSeedPack: true, pack, _ts: Date.now() });
            resultAnim.set(true);
            setTimeout(() => { if (isMounted) resultAnim.set(false); }, 320);
            history.update(h => [{ genId: 'seed', data: pack[0]?.data || {}, gen: (GENERATORS || []).find(g => g.id === 'seed') || {} }].concat(h).slice(0, 8));
            rolling.set(false);
          }, 220);
          return;
        }
      }

      const data = generate(genId, eff, pSize, opts, seed);
      const gen  = (GENERATORS || []).find(g => g.id === genId) || {};
      const newResult = { genId, data, _seed: seed, _ts: Date.now() };
      setTimeout(() => {
        if (!isMounted) return;
        result.set(newResult);
        resultAnim.set(true);
        setTimeout(() => { if (isMounted) resultAnim.set(false); }, 320);
        history.update(h => [{ genId, data, gen }].concat(h).slice(0, 8));
        rolling.set(false);
        // confetti after 6+ unique generator categories
        const cat = genId.replace(/_minor|_major/, '');
        if (!usedGens[cat + '_celebrated']) {
          usedGens[cat] = true;
          const uniq = Object.keys(usedGens).filter(k => k.indexOf('_celebrated') === -1).length;
          if (uniq >= 6) {
            const CONF = ['#F5A623','#4CD964','#5AC8FA','#BF5AF2','#FF3B30','#FFD60A','#32D7E8','#C8864A'];
            const pieces = Array.from({ length: 28 }, (_, i) => ({
              id: i, color: CONF[i % CONF.length],
              dx: (Math.random() - 0.5) * 200, dy: -(Math.random() * 140 + 60),
              dr: Math.random() * 720 - 360, delay: Math.random() * 0.18,
              size: Math.random() * 8 + 5,
            }));
            confPcs.set(pieces);
            setTimeout(() => confPcs.set([]), 1200);
            usedGens[cat + '_celebrated'] = true;
          }
        }
      }, 220);
    } catch (e) {
      console.error('Generate failed:', e);
      rolling.set(false);
    }
  }

  function doInspire() {
    if (get(rolling)) return;
    rolling.set(true);
    const genId = get(activeGen);
    const pSize = get(partySize);
    const csev  = get(consequenceSev);
    const base = mergeUniversal ? mergeUniversal(tables) : tables;
    const eff  = filteredTables ? filteredTables(base, currentPrefs) : base;
    const opts = {};
    if (genId === 'consequence' && csev) opts.severity = csev;
    const three = [
      generate(genId, eff, pSize, opts),
      generate(genId, eff, pSize, opts),
      generate(genId, eff, pSize, opts),
    ];
    setTimeout(() => {
      inspireResults.set(three); inspireMode.set(true); result.set(null); rolling.set(false);
    }, 220);
  }

  function pickInspireResult(data) {
    const genId = get(activeGen);
    const results = get(inspireResults);
    inspireChosen.set(results.indexOf(data));
    const gen = (GENERATORS || []).find(g => g.id === genId) || {};
    setTimeout(() => {
      result.set({ genId, data });
      inspireMode.set(false); inspireResults.set([]); inspireChosen.set(null);
    }, 280);
    history.update(h => [{ genId, data, gen }].concat(h).slice(0, 8));
  }

  function selectGen(id) {
    activeGen.set(id); result.set(null); sessionPack.set(null);
    inspireMode.set(false); inspireResults.set([]);
  }

  function pinResult() {
    const r = get(result);
    if (!r) return;
    pinBouncing.set(true);
    setTimeout(() => pinBouncing.set(false), 400);
    const card = {
      id: String(Date.now()), campId, genId: r.genId,
      label: r.genId, // simplified — full label derived at render time
      data: r.data, ts: Date.now(), state: null, visible: true,
    };
    pinnedCards.update(prev => [card].concat(prev));
    if (DB) DB.saveCard(campId, card).catch(err => console.warn('[Ogma] pin save failed:', err));
    showToast('📋 Saved to Table Prep');
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
  }

  function pinResultDirect(item) {
    if (!item || !item.data) return;
    const card = {
      id: String(Date.now()) + Math.random().toString(36).slice(2),
      campId, genId: item.genId,
      label: item.genId,
      data: item.data, ts: Date.now(), state: null, visible: true,
    };
    pinnedCards.update(prev => [card].concat(prev));
    if (DB) DB.saveCard(campId, card).catch(() => {});
  }

  function unpinCard(cardId) {
    pinnedCards.update(prev => prev.filter(c => c.id !== cardId));
    if (DB) DB.deleteCard(campId, cardId).catch(err => console.warn('[Ogma] unpin delete failed:', err));
  }

  function restoreCard(card) {
    result.set({ genId: card.genId, data: card.data });
    activeGen.set(card.genId);
  }

  function updatePrefs(p) {
    currentPrefs = p;
  }

  function destroy() {
    isMounted = false;
  }

  return {
    activeGen, result, rolling, history, partySize, consequenceSev,
    cardView, inspireMode, inspireResults, inspireChosen,
    pinnedCards, pinBouncing, sessionPack, packRolling,
    resultAnim, showStreakBadge, confPcs,
    doGenerate, doInspire, pickInspireResult,
    selectGen, pinResult, pinResultDirect, unpinCard, restoreCard,
    updatePrefs, destroy,
  };
}
