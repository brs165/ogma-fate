// fate-suite/db.js
// Promise-based IndexedDB wrapper with synchronous memStore fallback.
// HTTPS-first (v89) — IDB works reliably on all browsers via HTTPS.
// memStore fallback retained for edge cases (private browsing, storage pressure).

// ── BL-01: Versioned localStorage schema ─────────────────────────────────────
// All app preferences are stored under a single versioned JSON key.
// On first load, old flat keys are migrated and then removed.
// Access via window.LS.get(key) / window.LS.set(key, value).
//
// Schema v1 keys:
//   theme            - 'dark' | 'light'
//   textsize         - integer (-2..+4)
//   fp_state         - object (FatePointTracker state)
//   universal_merge  - boolean
//   help_level       - string ('new_fate' | 'know_fate' | 'expert')
//   onboarding_done  - boolean
//   gm_mode          - boolean
//   intro_seen       - object { [worldKey]: true }

(function() {
  var LS_KEY     = 'fate_prefs_v1';
  var LS_VERSION = 1;

  // Old flat keys → new schema key map (for migration)
  // Note: static pages (learn, about) used 'fate-theme' (hyphen); campaign pages used 'fate_theme' (underscore)
  var MIGRATE_MAP = {
    'fate_theme':           'theme',
    'fate-theme':           'theme',
    'fate_textsize':        'textsize',
    'fate_fp_state':        'fp_state',
    'fate_universal_merge': 'universal_merge',
    'fate_help_level':      'help_level',
    'fate_onboarding_done': 'onboarding_done',
    'fate_gm_mode':         'gm_mode',
  };

  function loadPrefs() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return null;
  }

  function savePrefs(prefs) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(prefs)); } catch(e) {}
  }

  function migrate() {
    // Check if any old flat keys exist
    var hadOldKeys = false;
    var migrated = { _v: LS_VERSION, intro_seen: {} };

    Object.keys(MIGRATE_MAP).forEach(function(oldKey) {
      var newKey = MIGRATE_MAP[oldKey];
      try {
        var val = localStorage.getItem(oldKey);
        if (val !== null) {
          hadOldKeys = true;
          // Coerce types
          if (newKey === 'fp_state') {
            try { migrated[newKey] = JSON.parse(val); } catch(e) {}
          } else if (newKey === 'universal_merge' || newKey === 'gm_mode') {
            migrated[newKey] = val !== 'off';
          } else if (newKey === 'onboarding_done') {
            migrated[newKey] = val === '1';
          } else if (newKey === 'textsize') {
            migrated[newKey] = parseInt(val, 10) || 0;
          } else {
            migrated[newKey] = val;
          }
          localStorage.removeItem(oldKey);
        }
      } catch(e) {}
    });

    // Migrate intro_seen keys (fate_intro_seen_{world})
    var worlds = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','index'];
    worlds.forEach(function(w) {
      var k = 'fate_intro_seen_' + w;
      try {
        if (localStorage.getItem(k)) {
          hadOldKeys = true;
          migrated.intro_seen[w] = true;
          localStorage.removeItem(k);
        }
      } catch(e) {}
    });

    if (hadOldKeys) savePrefs(migrated);
    return migrated;
  }

  function initPrefs() {
    var prefs = loadPrefs();
    if (!prefs) prefs = migrate();
    if (!prefs) prefs = { _v: LS_VERSION, intro_seen: {} };
    return prefs;
  }

  var _prefs = null;

  function ensurePrefs() {
    if (!_prefs) _prefs = initPrefs();
    return _prefs;
  }

  window.LS = {
    get: function(key) {
      return ensurePrefs()[key];
    },
    set: function(key, value) {
      var p = ensurePrefs();
      p[key] = value;
      savePrefs(p);
    },
    // Convenience: get a nested intro_seen value
    getIntroSeen: function(worldKey) {
      return !!(ensurePrefs().intro_seen || {})[worldKey];
    },
    setIntroSeen: function(worldKey, val) {
      var p = ensurePrefs();
      if (!p.intro_seen) p.intro_seen = {};
      p.intro_seen[worldKey] = !!val;
      savePrefs(p);
    },
    removeIntroSeen: function(worldKey) {
      var p = ensurePrefs();
      if (p.intro_seen) delete p.intro_seen[worldKey];
      savePrefs(p);
    },
  };

})();

// ── IndexedDB via Dexie 4 (WS-04) ────────────────────────────────────────────
// Dexie 4 CDN loaded before this file. Falls back to memStore if unavailable.
// Public API surface identical to v1 — no call-site changes required.
// Migration: on first open, reads any records from the legacy raw-IDB db
// (fate_generator v1) and copies them into the Dexie db, then marks done.
(function() {
  var DB_NAME = 'ogma_v2';       // new name avoids collision with legacy db
  var LEGACY_DB_NAME = 'fate_generator'; // v1 raw IDB — migrated on first open

  // ── In-memory fallback (private browsing / storage pressure) ─────────────
  var memStore = {};
  function memGet(key)       { var r = memStore[key]; return r ? r.value : null; }
  function memSet(key, val)  { memStore[key] = { value: val }; }
  function memDel(key)       { delete memStore[key]; }
  function memKeys(prefix) {
    return Object.keys(memStore).filter(function(k) {
      return !prefix || k.indexOf(prefix) === 0;
    });
  }

  // ── Dexie instance ────────────────────────────────────────────────────────
  var dx = null;
  var dxOpening = null; // in-progress open promise (concurrent guard)
  var dxFailed  = false; // permanent failure flag — stop retrying

  function getDB() {
    if (dx)        return Promise.resolve(dx);
    if (dxFailed)  return Promise.reject(new Error('IDB unavailable'));
    if (dxOpening) return dxOpening;
    if (typeof Dexie === 'undefined') return Promise.reject(new Error('Dexie not loaded'));
    try {
      var db = new Dexie(DB_NAME);
      db.version(1).stores({
        sessions: 'key, ts',
        cards:    'key, ts',
      });
      dxOpening = db.open()
        .then(function() { return runMigration(db); })
        .then(function() { dx = db; dxOpening = null; return db; })
        .catch(function(err) {
          dxFailed = true; dxOpening = null;
          throw err;
        });
      return dxOpening;
    } catch(err) {
      dxFailed = true;
      return Promise.reject(err);
    }
  }

  // ── One-time migration from legacy raw IDB ────────────────────────────────
  function runMigration(db) {
    var MIGRATED_KEY = 'idb_migrated_v2';
    try { if (localStorage.getItem(MIGRATED_KEY)) return Promise.resolve(); } catch(e) {}

    return new Promise(function(resolve) {
      try {
        var req = indexedDB.open(LEGACY_DB_NAME, 1);
        req.onsuccess = function(e) {
          var legacyDb = e.target.result;
          var storeNames = Array.prototype.slice.call(legacyDb.objectStoreNames);
          if (!storeNames.length) { legacyDb.close(); resolve(); return; }

          var pending = [];

          storeNames.forEach(function(storeName) {
            var targetTable = storeName === 'sessions' ? db.sessions : db.cards;
            pending.push(new Promise(function(res) {
              try {
                var tx  = legacyDb.transaction(storeName, 'readonly');
                var all = tx.objectStore(storeName).getAll();
                all.onsuccess = function(ev) {
                  var records = ev.target.result || [];
                  if (!records.length) { res(); return; }
                  targetTable.bulkPut(records).then(res).catch(res);
                };
                all.onerror = function() { res(); };
              } catch(err) { res(); }
            }));
          });

          Promise.all(pending).then(function() {
            legacyDb.close();
            try { localStorage.setItem(MIGRATED_KEY, '1'); } catch(e) {}
            resolve();
          }).catch(function() {
            legacyDb.close(); // ensure close on failure path
            resolve();
          });
        };
        req.onerror  = function() { resolve(); };
        req.onblocked = function() { resolve(); };
      } catch(err) { resolve(); }
    });
  }

  // ── Low-level Dexie helpers ───────────────────────────────────────────────
  function dxGet(table, key) {
    return getDB().then(function(db) {
      return db[table].get(key).then(function(r) { return r || null; });
    });
  }

  function dxPut(table, record) {
    return getDB().then(function(db) { return db[table].put(record); });
  }

  function dxDelete(table, key) {
    return getDB().then(function(db) { return db[table].delete(key); });
  }

  function dxKeys(table, prefix) {
    return getDB().then(function(db) {
      return db[table].toCollection().primaryKeys().then(function(keys) {
        return prefix
          ? keys.filter(function(k) { return k.indexOf(prefix) === 0; })
          : keys;
      });
    });
  }

  // ── Public API — identical surface to v1 ─────────────────────────────────
  window.DB = {

    // ── Sessions ────────────────────────────────────────────────────────────
    saveSession: function(key, stateObject) {
      return dxPut('sessions', { key: key, value: stateObject, ts: Date.now() })
        .catch(function() { memSet(key, stateObject); return key; });
    },

    loadSession: function(key) {
      return dxGet('sessions', key)
        .then(function(r) { return r ? r.value : null; })
        .catch(function() { return memGet(key); });
    },

    clearSession: function(key) {
      memDel(key);
      return dxDelete('sessions', key).catch(function() { return true; });
    },

    listSessions: function(prefix) {
      return dxKeys('sessions', prefix)
        .catch(function() { return memKeys(prefix); });
    },

    // ── Cards (pinned results) ───────────────────────────────────────────────
    saveCard: function(campId, card) {
      var key = 'card_' + campId + '_' + card.id;
      return dxPut('cards', { key: key, value: card, ts: card.ts || Date.now() })
        .catch(function() { memSet(key, card); return key; });
    },

    loadCards: function(campId) {
      var prefix = 'card_' + campId + '_';
      return dxKeys('cards', prefix).then(function(keys) {
        return Promise.all(keys.map(function(k) {
          return dxGet('cards', k).then(function(r) { return r ? r.value : null; }).catch(function() { return null; });
        }));
      }).then(function(cards) {
        return cards.filter(Boolean).sort(function(a, b) { return (b.ts || 0) - (a.ts || 0); });
      }).catch(function() {
        return memKeys(prefix)
          .map(function(k) { return memGet(k); })
          .filter(Boolean)
          .sort(function(a, b) { return (b.ts || 0) - (a.ts || 0); });
      });
    },

    deleteCard: function(campId, cardId) {
      var key = 'card_' + campId + '_' + cardId;
      memDel(key);
      return dxDelete('cards', key).catch(function() { return true; });
    },

    // ── Vault — named session save/load/browse/delete ────────────────────────
    vaultSave: function(session) {
      var id = session.id || ('v_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8));
      var record = {
        id: id,
        name: session.name || 'Untitled Session',
        campaign: session.campaign || '',
        created: session.created || Date.now(),
        updated: Date.now(),
        cards: session.cards || [],
      };
      var key = 'vault_' + id;
      return dxPut('sessions', { key: key, value: record, ts: record.updated })
        .then(function() { return record; })
        .catch(function() { memSet(key, record); return record; });
    },

    vaultLoad: function(id) {
      var key = 'vault_' + id;
      return dxGet('sessions', key)
        .then(function(r) { return r ? r.value : null; })
        .catch(function() { return memGet(key); });
    },

    vaultList: function() {
      return dxKeys('sessions', 'vault_').then(function(keys) {
        return Promise.all(keys.map(function(k) {
          return dxGet('sessions', k).then(function(r) { return r ? r.value : null; }).catch(function() { return null; });
        }));
      }).then(function(sessions) {
        return sessions.filter(Boolean).sort(function(a, b) {
          return (b.updated || b.created || 0) - (a.updated || a.created || 0);
        });
      }).catch(function() {
        return memKeys('vault_')
          .map(function(k) { return memGet(k); })
          .filter(Boolean)
          .sort(function(a, b) { return (b.updated || 0) - (a.updated || 0); });
      });
    },

    vaultDelete: function(id) {
      var key = 'vault_' + id;
      memDel(key);
      return dxDelete('sessions', key).catch(function() { return true; });
    },

    // ── Export / Import (JSON file) ──────────────────────────────────────────
    exportSession: function(session) {
      var json = JSON.stringify({ ogma: true, version: 1, type: 'session', exported: new Date().toISOString(), session: session }, null, 2);
      var blob = new Blob([json], {type: 'application/json'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = (session.name || 'ogma-session').replace(/[^a-zA-Z0-9_-]/g, '_') + '.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    },

    exportCard: function(card, campName) {
      var json = JSON.stringify({ ogma: true, version: 1, type: 'card', exported: new Date().toISOString(), campaign: campName || '', card: card }, null, 2);
      var blob = new Blob([json], {type: 'application/json'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = (card.label || card.genId || 'ogma-card').replace(/[^a-zA-Z0-9_-]/g, '_') + '.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    },

    importFile: function() {
      return new Promise(function(resolve, reject) {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        document.body.appendChild(input);
        input.onchange = function(e) {
          var file = e.target.files[0];
          document.body.removeChild(input);
          if (!file) return reject(new Error('No file selected'));
          var reader = new FileReader();
          reader.onload = function(ev) {
            try {
              var data = JSON.parse(ev.target.result);
              if (!data.ogma) return reject(new Error('Not an Ogma file'));
              resolve(data);
            } catch(err) { reject(err); }
          };
          reader.onerror = function() { reject(new Error('File read error')); };
          reader.readAsText(file);
        };
        input.click();
      });
    },

  };

})();
