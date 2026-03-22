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
  var dxFailed   = false; // permanent failure flag — stop retrying
  var dxFailCount = 0;   // retry budget before permanent failure
  var DX_MAX_FAILS = 2;  // allow 2 transient failures before giving up

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
        .then(function() {
          dx = db; dxOpening = null;
          // Request persistent storage so the browser (especially Safari) won't
          // evict IndexedDB data after 7 days of non-use. Fire-and-forget — no
          // error handling needed; failure is silent and doesn't break anything.
          if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist().catch(function() {});
          }
          return db;
        })
        .catch(function(err) {
          dxFailCount++;
          if (dxFailCount >= DX_MAX_FAILS) { dxFailed = true; }
          dxOpening = null;
          throw err;
        });
      return dxOpening;
    } catch(err) {
      dxFailCount++;
      if (dxFailCount >= DX_MAX_FAILS) { dxFailed = true; }
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
                all.onerror = function(ev) { console.warn('[DB] Legacy store read failed:', ev); res(); };
              } catch(err) { console.warn('[DB] Legacy transaction failed:', err); res(); }
            }));
          });

          Promise.all(pending).then(function() {
            legacyDb.close();
            try { localStorage.setItem(MIGRATED_KEY, '1'); } catch(e) {}
            resolve();
          }).catch(function(err) {
            console.warn('[DB] Legacy migration failed:', err);
            legacyDb.close(); // ensure close on failure path
            resolve();
          });
        };
        req.onerror  = function(ev) { console.warn('[DB] Legacy IDB open failed — migration skipped:', ev); resolve(); };
        req.onblocked = function() { console.warn('[DB] Legacy IDB open blocked — migration skipped'); resolve(); };
      } catch(err) { console.warn('[DB] Legacy IDB unavailable — migration skipped:', err); resolve(); }
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

    // EXP-02: Export all pinned cards for a campaign as a JSON file
    exportCards: function(campId, campName, cards) {
      var json = JSON.stringify({
        ogma: true, version: 1, type: 'cards',
        exported: new Date().toISOString(),
        campaign: campId, campName: campName || campId,
        cards: cards
      }, null, 2);
      var blob = new Blob([json], {type: 'application/json'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      var fname = (campName || campId).replace(/[^a-zA-Z0-9_-]/g, '_') +
                  '_cards_' + new Date().toISOString().slice(0,10) + '.json';
      a.download = fname;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    },

    // EXP-02: Export full canvas IDB state (board or run session) as JSON
    exportCanvasState: function(key, filename) {
      return window.DB.loadSession(key).then(function(state) {
        if (!state) throw new Error('Nothing to export — canvas is empty');
        var json = JSON.stringify({
          ogma: true, version: 1, type: 'canvas',
          exported: new Date().toISOString(),
          key: key, state: state
        }, null, 2);
        var blob = new Blob([json], {type: 'application/json'});
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = (filename || 'ogma-canvas').replace(/[^a-zA-Z0-9_-]/g, '_') + '.json';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
      }).catch(function(err) {
        console.error('exportCanvasState failed:', err);
        throw err; // re-throw so callers can handle with their own .catch()
      });
    },

    // EXP-02: Import canvas state from JSON file (returns {key, state})
    importCanvasState: function() {
      return window.DB.importFile().then(function(data) {
        if (data.type !== 'canvas') throw new Error('Not a canvas export file');
        if (!data.key || !data.state) throw new Error('Invalid canvas file');
        return data;
      });
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
    // EXP-05: Print cards — opens a printable HTML page in a new window
        printCards: function(cards, campName) {
      if (!cards || cards.length === 0) { alert('No cards to print.'); return; }

      function esc(s) {
        if (!s) return '';
        return String(s)
          .replace(/&/g,'&amp;')
          .replace(/</g,'&lt;')
          .replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;');
      }

      function renderCardHtml(card) {
        var genId = card.genId || '';
        var data  = card.data  || {};
        var title = card.title || data.name || data.location || data.situation || genId;
        var GEN_LABELS = {
          npc_minor:'Minor NPC', npc_major:'Major NPC', scene:'Scene Setup',
          encounter:'Encounter', seed:'Adventure Seed', compel:'Compel',
          challenge:'Challenge', contest:'Contest', consequence:'Consequence',
          faction:'Faction', complication:'Complication', backstory:'PC Backstory',
          obstacle:'Obstacle', countdown:'Countdown', constraint:'Constraint',
          campaign:'Campaign Frame', sticky:'Aspect', label:'Section'
        };
        var typeLabel = GEN_LABELS[genId] || genId;

        var rows = [];

        // ── NPC ──────────────────────────────────────────────────────
        if (genId === 'npc_minor' || genId === 'npc_major') {
          var asp = data.aspects || {};
          if (asp.high_concept) rows.push('<div class="pc-row asp-hc">' + esc(asp.high_concept) + '</div>');
          if (asp.trouble)      rows.push('<div class="pc-row asp-tr">► ' + esc(asp.trouble) + '</div>');
          if (asp.others && asp.others.length) {
            asp.others.forEach(function(a) {
              rows.push('<div class="pc-row asp-other">' + esc(a) + '</div>');
            });
          }
          if (data.skills && data.skills.length) {
            var sk = data.skills.slice(0,6).map(function(s) {
              return '<span class="skill-chip">+' + s.r + ' ' + esc(s.name) + '</span>';
            }).join(' ');
            rows.push('<div class="pc-skills">' + sk + '</div>');
          }
          if (data.stunts && data.stunts.length) {
            data.stunts.forEach(function(st) {
              rows.push('<div class="pc-stunt"><strong>' + esc(st.name) + ':</strong> ' + esc(st.desc) + '</div>');
            });
          }
          if (data.physical_stress || data.mental_stress) {
            var phy = data.physical_stress || 0;
            var men = data.mental_stress || 0;
            var boxes = function(n, cls) {
              var s = '';
              for (var i=0;i<n;i++) s += '<span class="stress-box ' + cls + '"></span>';
              return s;
            };
            rows.push('<div class="pc-stress">PHY ' + boxes(phy,'phy') + '  MEN ' + boxes(men,'men') + '</div>');
          }
        }
        // ── SCENE ────────────────────────────────────────────────────
        else if (genId === 'scene') {
          if (data.situation) rows.push('<div class="field-row"><strong>Situation:</strong> ' + esc(data.situation) + '</div>');
          if (data.aspects && data.aspects.length) {
            data.aspects.forEach(function(a) {
              rows.push('<div class="asp-chip">' + esc(a) + '</div>');
            });
          }
          if (data.threat)  rows.push('<div class="field-row"><strong>Threat:</strong> ' + esc(data.threat) + '</div>');
          if (data.zones && data.zones.length) {
            rows.push('<div class="field-row"><strong>Zones:</strong> ' + data.zones.slice(0,3).map(esc).join(' · ') + '</div>');
          }
        }
        // ── FACTION ──────────────────────────────────────────────────
        else if (genId === 'faction') {
          if (data.goal)    rows.push('<div class="field-row"><strong>Goal:</strong> ' + esc(data.goal) + '</div>');
          if (data.method)  rows.push('<div class="field-row"><strong>Method:</strong> ' + esc(data.method) + '</div>');
          if (data.weakness)rows.push('<div class="field-row"><strong>Weakness:</strong> ' + esc(data.weakness) + '</div>');
          if (data.face)    rows.push('<div class="field-row"><strong>Face:</strong> ' + esc(data.face) + '</div>');
        }
        // ── SEED ─────────────────────────────────────────────────────
        else if (genId === 'seed') {
          if (data.objective)    rows.push('<div class="field-row"><strong>Objective:</strong> ' + esc(data.objective) + '</div>');
          if (data.complication) rows.push('<div class="field-row"><strong>Complication:</strong> ' + esc(data.complication) + '</div>');
          if (data.opposition)   rows.push('<div class="field-row"><strong>Opposition:</strong> ' + esc(data.opposition) + '</div>');
          if (data.twist)        rows.push('<div class="field-row"><strong>Twist:</strong> ' + esc(data.twist) + '</div>');
        }
        // ── ENCOUNTER ────────────────────────────────────────────────
        else if (genId === 'encounter') {
          if (data.opposition)  rows.push('<div class="field-row"><strong>Opposition:</strong> ' + esc(data.opposition) + '</div>');
          if (data.stakes)      rows.push('<div class="field-row"><strong>Stakes:</strong> ' + esc(data.stakes) + '</div>');
          if (data.twist)       rows.push('<div class="field-row"><strong>Twist:</strong> ' + esc(data.twist) + '</div>');
          if (data.victory)     rows.push('<div class="field-row"><strong>Victory:</strong> ' + esc(data.victory) + '</div>');
        }
        // ── COMPEL ───────────────────────────────────────────────────
        else if (genId === 'compel') {
          if (data.situation)   rows.push('<div class="field-row">' + esc(data.situation) + '</div>');
          if (data.consequence) rows.push('<div class="field-row"><strong>Consequence:</strong> ' + esc(data.consequence) + '</div>');
        }
        // ── CHALLENGE ────────────────────────────────────────────────
        else if (genId === 'challenge') {
          if (data.obstacle)    rows.push('<div class="field-row">' + esc(data.obstacle) + '</div>');
          if (data.primary_skill) rows.push('<div class="field-row"><strong>Skill:</strong> ' + esc(data.primary_skill) + '</div>');
          if (data.success)     rows.push('<div class="field-row"><strong>Success:</strong> ' + esc(data.success) + '</div>');
          if (data.failure)     rows.push('<div class="field-row"><strong>Failure:</strong> ' + esc(data.failure) + '</div>');
        }
        // ── CONSEQUENCE ──────────────────────────────────────────────
        else if (genId === 'consequence') {
          var sev = data.severity || data.mild ? 'Mild' : data.moderate ? 'Moderate' : data.severe ? 'Severe' : '';
          var text = data.mild || data.moderate || data.severe || data.aspect || '';
          if (sev)  rows.push('<div class="asp-hc">' + sev + ' Consequence</div>');
          if (text) rows.push('<div class="pc-row asp-hc">' + esc(text) + '</div>');
          if (data.compel_hook) rows.push('<div class="field-row"><strong>Hook:</strong> ' + esc(data.compel_hook) + '</div>');
        }
        // ── COUNTDOWN ────────────────────────────────────────────────
        else if (genId === 'countdown') {
          if (data.track_name)  rows.push('<div class="asp-hc">' + esc(data.track_name) + '</div>');
          if (data.trigger)     rows.push('<div class="field-row"><strong>Trigger:</strong> ' + esc(data.trigger) + '</div>');
          if (data.outcome)     rows.push('<div class="field-row"><strong>Outcome:</strong> ' + esc(data.outcome) + '</div>');
          var ticks = data.boxes || 4;
          var boxes = '';
          for (var i=0;i<ticks;i++) boxes += '<span class="stress-box"></span>';
          rows.push('<div class="pc-stress" style="margin-top:6px">' + boxes + '</div>');
        }
        // ── CAMPAIGN ─────────────────────────────────────────────────
        else if (genId === 'campaign') {
          if (data.current_issue)   rows.push('<div class="field-row"><strong>Current:</strong> ' + esc(data.current_issue) + '</div>');
          if (data.impending_issue) rows.push('<div class="field-row"><strong>Impending:</strong> ' + esc(data.impending_issue) + '</div>');
          if (data.aspects && data.aspects.length) {
            data.aspects.forEach(function(a) { rows.push('<div class="asp-chip">' + esc(a) + '</div>'); });
          }
        }
        // ── STICKY / LABEL / FALLBACK ─────────────────────────────────
        else {
          var text2 = card.text || data.situation || data.description || data.text || card.summary || '';
          if (text2) rows.push('<div class="field-row">' + esc(text2) + '</div>');
          if (card.summary && card.summary !== text2) rows.push('<div class="field-row">' + esc(card.summary) + '</div>');
        }

        return (
          '<div class="card">' +
            '<div class="card-header">' +
              '<span class="card-type">' + esc(typeLabel) + '</span>' +
              (campName ? '<span class="card-world">' + esc(campName) + '</span>' : '') +
            '</div>' +
            '<div class="card-title">' + esc(title) + '</div>' +
            (rows.length ? '<div class="card-body">' + rows.join('') + '</div>' : '') +
          '</div>'
        );
      }

      var html = (
        '<!DOCTYPE html><html lang="en"><head>' +
        '<meta charset="UTF-8">' +
        '<title>Ogma Print — ' + esc(campName || 'Cards') + '</title>' +
        '<style>' +
        '@page{size:A4 portrait;margin:10mm}' +
        'body{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;margin:0;padding:0;background:#fff;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
        'h1{font-size:11pt;font-weight:400;color:#555;margin:0 0 8px;padding:0}' +
        '.controls{padding:6px 0 10px;display:flex;gap:8px;align-items:center}' +
        '@media print{.controls{display:none}}' +
        'button{padding:6px 14px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;font-size:12px}' +
        'button:hover{background:#f5f5f5}' +
        '.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8mm;padding:0}' +
        '@media(min-width:800px){.grid{grid-template-columns:repeat(3,1fr)}}' +
        '.card{border:1px solid #222;border-radius:3px;padding:7px 9px;min-height:48mm;display:flex;flex-direction:column;break-inside:avoid;page-break-inside:avoid;box-sizing:border-box}' +
        '.card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;padding-bottom:4px;border-bottom:1px solid #ccc}' +
        '.card-type{font-size:7.5pt;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#444}' +
        '.card-world{font-size:7pt;color:#888;letter-spacing:.05em}' +
        '.card-title{font-size:11pt;font-weight:700;line-height:1.25;margin-bottom:5px;color:#000}' +
        '.card-body{font-size:8.5pt;color:#222;line-height:1.4;flex:1;display:flex;flex-direction:column;gap:3px}' +
        '.pc-row{color:#333}' +
        '.asp-hc{font-style:italic;font-weight:600;color:#000}' +
        '.asp-tr{font-style:italic;color:#555}' +
        '.asp-other{font-style:italic;color:#777;font-size:8pt}' +
        '.asp-chip{display:inline-block;border:1px solid #aaa;border-radius:2px;padding:1px 5px;margin:1px 2px 1px 0;font-size:7.5pt;font-style:italic;color:#333}' +
        '.pc-skills{display:flex;flex-wrap:wrap;gap:2px;margin:3px 0}' +
        '.skill-chip{font-size:7.5pt;border:1px solid #ccc;border-radius:2px;padding:1px 4px;color:#333;white-space:nowrap}' +
        '.pc-stunt{font-size:7.5pt;color:#444;border-left:2px solid #aaa;padding-left:4px;margin:2px 0}' +
        '.pc-stress{display:flex;align-items:center;gap:3px;font-size:7pt;color:#666;margin-top:auto;padding-top:4px}' +
        '.stress-box{display:inline-block;width:10px;height:10px;border:1.5px solid #666;border-radius:1px}' +
        '.stress-box.phy{border-color:#e05}' +
        '.stress-box.men{border-color:#55a}' +
        '.field-row{font-size:8.5pt;color:#333;line-height:1.35}' +
        '.field-row strong{color:#000}' +
        '</style></head><body>' +
        '<div class="controls">' +
        '<h1>Ogma — ' + esc(campName || 'Cards') + ' — ' + cards.length + ' card' + (cards.length === 1 ? '' : 's') + '</h1>' +
        '<button onclick="window.print()">&#128438; Print</button>' +
        '<button onclick="window.close()">&#x2715; Close</button>' +
        '</div>' +
        '<div class="grid">' +
        cards.map(renderCardHtml).join('') +
        '</div></body></html>'
      );

      var blob = new Blob([html], {type: 'text/html;charset=utf-8'});
      var url = URL.createObjectURL(blob);
      var w = window.open(url, '_blank', 'width=900,height=700,scrollbars=yes');
      if (!w) {
        // Pop-up blocked — fall back to download
        var a = document.createElement('a');
        a.href = url;
        a.download = (campName || 'ogma').replace(/[^a-zA-Z0-9_-]/g, '_') + '-print.html';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }
    },

  };

})();
