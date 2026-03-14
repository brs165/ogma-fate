// fate-suite/db.js
// Promise-based IndexedDB wrapper with synchronous memStore fallback.
// Works on file:// protocol in Chrome, Firefox, Edge.
// Safari on file:// may block IDB — memStore silently takes over.

// ── BL-01: Versioned localStorage schema ─────────────────────────────────────
// All app preferences are stored under a single versioned JSON key.
// On first load, old flat keys are migrated and then removed.
// Access via window.LS.get(key) / window.LS.set(key, value).
//
// Schema v1 keys:
//   theme            — 'dark' | 'light'
//   textsize         — integer (-2..+4)
//   fp_state         — object (FatePointTracker state)
//   universal_merge  — boolean
//   help_level       — string ('new_fate' | 'know_fate' | 'expert')
//   onboarding_done  — boolean
//   gm_mode          — boolean
//   intro_seen       — object { [worldKey]: true }

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

// ── IndexedDB ─────────────────────────────────────────────────────────────────
(function() {
  var DB_NAME    = 'fate_generator';
  var DB_VERSION = 1;
  var STORE_SESSIONS = 'sessions';
  var STORE_CARDS    = 'cards';

  // ── In-memory fallback ────────────────────────────────────────────────────
  var memStore = {};

  // ── IDB open ──────────────────────────────────────────────────────────────
  var dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function(resolve, reject) {
      try {
        var req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
            db.createObjectStore(STORE_SESSIONS, { keyPath: 'key' });
          }
          if (!db.objectStoreNames.contains(STORE_CARDS)) {
            db.createObjectStore(STORE_CARDS, { keyPath: 'key' });
          }
        };
        req.onsuccess = function(e) { resolve(e.target.result); };
        req.onerror   = function(e) {
          // TD-06: Reset so future calls can retry (e.g. after permission change)
          dbPromise = null;
          reject(e.target.error);
        };
        req.onblocked = function() {
          dbPromise = null;
          reject(new Error('IDB blocked'));
        };
      } catch(err) {
        dbPromise = null;
        reject(err);
      }
    });
    return dbPromise;
  }

  // ── Low-level IDB helpers ─────────────────────────────────────────────────
  function idbGet(storeName, key) {
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx  = db.transaction(storeName, 'readonly');
        var req = tx.objectStore(storeName).get(key);
        req.onsuccess = function(e) { resolve(e.target.result || null); };
        req.onerror   = function(e) { reject(e.target.error); };
      });
    });
  }

  function idbPut(storeName, record) {
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx  = db.transaction(storeName, 'readwrite');
        var req = tx.objectStore(storeName).put(record);
        req.onsuccess = function(e) { resolve(e.target.result); };
        req.onerror   = function(e) { reject(e.target.error); };
      });
    });
  }

  function idbDelete(storeName, key) {
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx  = db.transaction(storeName, 'readwrite');
        var req = tx.objectStore(storeName).delete(key);
        req.onsuccess = function() { resolve(true); };
        req.onerror   = function(e) { reject(e.target.error); };
      });
    });
  }

  function idbGetAllKeys(storeName, prefix) {
    return openDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx   = db.transaction(storeName, 'readonly');
        var keys = [];
        var req  = tx.objectStore(storeName).openCursor();
        req.onsuccess = function(e) {
          var cursor = e.target.result;
          if (cursor) {
            if (!prefix || cursor.key.indexOf(prefix) === 0) keys.push(cursor.key);
            cursor.continue();
          } else {
            resolve(keys);
          }
        };
        req.onerror = function(e) { reject(e.target.error); };
      });
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.DB = {

    saveSession: function(key, stateObject) {
      return idbPut(STORE_SESSIONS, { key: key, value: stateObject, ts: Date.now() })
        .catch(function() {
          memStore[key] = { key: key, value: stateObject };
          return key;
        });
    },

    loadSession: function(key) {
      return idbGet(STORE_SESSIONS, key)
        .then(function(record) { return record ? record.value : null; })
        .catch(function() {
          var r = memStore[key];
          return r ? r.value : null;
        });
    },

    clearSession: function(key) {
      delete memStore[key];
      return idbDelete(STORE_SESSIONS, key).catch(function() { return true; });
    },

    listSessions: function(prefix) {
      return idbGetAllKeys(STORE_SESSIONS, prefix)
        .catch(function() {
          return Object.keys(memStore).filter(function(k) {
            return !prefix || k.indexOf(prefix) === 0;
          });
        });
    },

    // ── Cards (pinned results) ────────────────────────────────────────────
    saveCard: function(campId, card) {
      // card = {id, campId, genId, label, data, ts}
      var key = 'card_' + campId + '_' + card.id;
      return idbPut(STORE_CARDS, { key: key, value: card, ts: card.ts || Date.now() })
        .catch(function() {
          memStore[key] = { key: key, value: card };
          return key;
        });
    },

    loadCards: function(campId) {
      var prefix = 'card_' + campId + '_';
      return idbGetAllKeys(STORE_CARDS, prefix).then(function(keys) {
        return Promise.all(keys.map(function(k) {
          return idbGet(STORE_CARDS, k).then(function(r) { return r ? r.value : null; });
        }));
      }).then(function(cards) {
        return cards.filter(Boolean).sort(function(a, b) { return (b.ts || 0) - (a.ts || 0); });
      }).catch(function() {
        var prefix2 = 'card_' + campId + '_';
        return Object.keys(memStore)
          .filter(function(k) { return k.indexOf(prefix2) === 0; })
          .map(function(k) { return memStore[k].value; })
          .filter(Boolean)
          .sort(function(a, b) { return (b.ts || 0) - (a.ts || 0); });
      });
    },

    deleteCard: function(campId, cardId) {
      var key = 'card_' + campId + '_' + cardId;
      delete memStore[key];
      return idbDelete(STORE_CARDS, key).catch(function() { return true; });
    },

  };

})();
