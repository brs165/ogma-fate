// fate-suite/db.js — converted to ES module
// Promise-based IndexedDB wrapper with synchronous memStore fallback.
import Dexie from 'dexie';

  var LS_KEY     = 'fate_prefs_v1';
  var LS_VERSION = 1;

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

  function initPrefs() {
    var prefs = loadPrefs();
    if (!prefs) prefs = { _v: LS_VERSION, intro_seen: {} };

    // ── BL-01: Migration — lift legacy bare localStorage keys into prefs ──
    // Old code wrote theme directly as localStorage.setItem('fate_theme', ...)
    // Pull them in once, then they live under fate_prefs_v1 forever.
    if (!prefs.theme) {
      var legacyTheme = (function() {
        try { return localStorage.getItem('fate_theme') || localStorage.getItem('fate-theme') || null; } catch(e) { return null; }
      })();
      if (legacyTheme) { prefs.theme = legacyTheme; savePrefs(prefs); }
    }

    // ── Schema defaults — ensure all known keys have a value ──────────────
    var DEFAULTS = {
      _v:                      LS_VERSION,
      theme:                   'dark',
      textsize:                0,
      universal_merge:         true,
      help_level:              'new_fate',
      gm_mode:                 true,
      intro_seen:              {},
      coach_canvas_dismissed:  false,
      coach_play_dismissed:    false,
      pwa_nudge_dismissed:     false,
      safari_warn_dismissed:   false,
      ios_install_dismissed:   false,
      visit_counts:            {},
    };
    var changed = false;
    Object.keys(DEFAULTS).forEach(function(k) {
      if (prefs[k] === undefined) { prefs[k] = DEFAULTS[k]; changed = true; }
    });

    // ── BL-01: Migrate straggler bare localStorage keys into prefs ──────
    var STRAGGLER_BOOLS = ['pwa_nudge_dismissed', 'safari_warn_dismissed', 'ios_install_dismissed'];
    STRAGGLER_BOOLS.forEach(function(k) {
      if (!prefs[k]) {
        try { if (localStorage.getItem(k)) { prefs[k] = true; changed = true; localStorage.removeItem(k); } } catch(e) {}
      }
    });
    // Migrate visit_count_* keys
    try {
      var allKeys = Object.keys(localStorage);
      allKeys.forEach(function(k) {
        if (k.startsWith('visit_count_')) {
          var campId = k.replace('visit_count_', '');
          var val = parseInt(localStorage.getItem(k) || '0', 10) || 0;
          if (!prefs.visit_counts) prefs.visit_counts = {};
          if (!prefs.visit_counts[campId]) { prefs.visit_counts[campId] = val; changed = true; }
          localStorage.removeItem(k);
        }
      });
    } catch(e) {}

    if (!prefs._v) { prefs._v = LS_VERSION; changed = true; }
    if (changed) savePrefs(prefs);

    return prefs;
  }

  var _prefs = null;

  function ensurePrefs() {
    if (!_prefs) _prefs = initPrefs();
    return _prefs;
  }

export const LS = {
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
    // Visit counts per campaign
    getVisitCount: function(campId) {
      return (ensurePrefs().visit_counts || {})[campId] || 0;
    },
    incrementVisitCount: function(campId) {
      var p = ensurePrefs();
      if (!p.visit_counts) p.visit_counts = {};
      p.visit_counts[campId] = (p.visit_counts[campId] || 0) + 1;
      savePrefs(p);
      return p.visit_counts[campId];
    },

};

// ── IndexedDB via Dexie 4 (WS-04) ────────────────────────────────────────────
// Dexie 4 CDN loaded before this file. Falls back to memStore if unavailable.
// Public API surface identical to v1 — no call-site changes required.
// IDB via Dexie 4. Falls back to memStore if unavailable.
  var DB_NAME = 'ogma_v2';

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
    try {
      var db = new Dexie(DB_NAME);
      db.version(1).stores({
        sessions: 'key, ts',
        cards:    'key, ts',
      });
      dxOpening = db.open()
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
export const DB = {

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
      var json = JSON.stringify({ format: 'ogma', version: '2.0.0', type: 'session', exported: new Date().toISOString(), campaign: session.campaign || '', campId: session.campId || '', ts: Date.now(), session: session }, null, 2);
      var blob = new Blob([json], {type: 'application/json'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = (session.name || 'ogma-session').replace(/[^a-zA-Z0-9_-]/g, '_') + '.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    },

    exportCard: function(card, campName) {
      var json = JSON.stringify({ format: 'ogma', version: '2.0.0', generator: card.genId || '', campaign: campName || '', campId: card.campId || '', ts: Date.now(), data: card.data || card }, null, 2);
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
        format: 'ogma', version: '2.0.0',
        campaign: campName || campId,
        campId: campId,
        ts: Date.now(),
        results: cards.map(function(c) {
          return { generator: c.genId || c.generator || '', label: c.title || c.genId || '', data: c.data || {}, ts: c.ts || Date.now() };
        })
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
      return DB.loadSession(key).then(function(state) {
        if (!state) throw new Error('Nothing to export — canvas is empty');
        var json = JSON.stringify({
          format: 'ogma', version: '2.0.0', type: 'canvas',
          exported: new Date().toISOString(),
          ts: Date.now(), key: key, state: state
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
      return DB.importFile().then(function(data) {
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
              if (data.format !== 'ogma') return reject(new Error('Not an Ogma file'));
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
          npc_minor:'Minor NPC', npc_major:'Major NPC', pc:'Player Character', scene:'Scene Setup',
          encounter:'Encounter', seed:'Adventure Seed', compel:'Compel',
          challenge:'Challenge', contest:'Contest', consequence:'Consequence',
          faction:'Faction', complication:'Complication', backstory:'PC Backstory',
          obstacle:'Obstacle', countdown:'Countdown', constraint:'Constraint',
          campaign:'Campaign Frame', sticky:'Aspect', label:'Section'
        };
        var typeLabel = GEN_LABELS[genId] || genId;

        var rows = [];

        if (genId === 'npc_minor') {
          var aspects = Array.isArray(data.aspects) ? data.aspects : [];
          aspects.forEach(function(a, i) {
            rows.push('<div class="pc-row ' + (i===0?'asp-hc':'asp-other') + '">' + esc(a) + '</div>');
          });
          if (data.skills && data.skills.length) {
            var sk = data.skills.map(function(s) {
              return '<span class="skill-chip">+' + s.r + ' ' + esc(s.name) + '</span>';
            }).join(' ');
            rows.push('<div class="pc-skills">' + sk + '</div>');
          }
          if (data.stunt) {
            rows.push('<div class="pc-stunt"><strong>' + esc(data.stunt.name) + ':</strong> ' + esc(data.stunt.desc) + '</div>');
          }
          var stressN = data.stress || 0;
          if (stressN) {
            var boxes = '';
            for (var i=0;i<stressN;i++) boxes += '<span class="stress-box phy"></span>';
            rows.push('<div class="pc-stress">STRESS ' + boxes + '</div>');
          }
          rows.push('<div class="pc-row asp-other">No consequences — one hit = out</div>');
        }

        else if (genId === 'npc_major') {
          var asp = data.aspects || {};
          if (asp.high_concept) rows.push('<div class="pc-row asp-hc">' + esc(asp.high_concept) + '</div>');
          if (asp.trouble)      rows.push('<div class="pc-row asp-tr">► ' + esc(asp.trouble) + '</div>');
          if (asp.others && asp.others.length) {
            asp.others.forEach(function(a) {
              rows.push('<div class="pc-row asp-other">' + esc(a) + '</div>');
            });
          }
          if (data.skills && data.skills.length) {
            var sk2 = data.skills.map(function(s) {
              return '<span class="skill-chip">+' + s.r + ' ' + esc(s.name) + '</span>';
            }).join(' ');
            rows.push('<div class="pc-skills">' + sk2 + '</div>');
          }
          if (data.stunts && data.stunts.length) {
            data.stunts.forEach(function(st) {
              rows.push('<div class="pc-stunt"><strong>' + esc(st.name) + ' (' + esc(st.skill) + '):</strong> ' + esc(st.desc) + '</div>');
            });
          }
          var phy = data.physical_stress || 0, men = data.mental_stress || 0;
          var phyBoxes = '', menBoxes = '';
          for (var pi=0;pi<phy;pi++) phyBoxes += '<span class="stress-box phy"></span>';
          for (var mi=0;mi<men;mi++) menBoxes += '<span class="stress-box men"></span>';
          if (phy || men) rows.push('<div class="pc-stress">PHY ' + phyBoxes + '&nbsp;&nbsp;MEN ' + menBoxes + '</div>');
          var conSlots = data.consequences || [2, 4, 6];
          var conLabels = ['Mild', 'Moderate', 'Severe'];
          var conStr = conSlots.map(function(v, i) { return (conLabels[i] || 'Extra Mild') + ' □ ' + v; }).join('  ');
          rows.push('<div class="pc-stress" style="font-size:7pt;color:#666">' + conStr + ' &nbsp;|&nbsp; Refresh: ' + (data.refresh || 3) + '</div>');
        }

        else if (genId === 'scene') {
          var scAspects = Array.isArray(data.aspects) ? data.aspects : [];
          scAspects.forEach(function(a) {
            var name = typeof a === 'string' ? a : (a.name || '');
            var cat  = typeof a === 'object' ? (a.category || '') : '';
            var fi   = typeof a === 'object' && (a.free_invoke || a.fi);
            rows.push('<div class="asp-chip">' + (cat?'['+cat+'] ':'') + esc(name) + (fi?' ★FI':'') + '</div>');
          });
          var zones = Array.isArray(data.zones) ? data.zones : [];
          if (zones.length) {
            rows.push('<div class="field-row"><strong>Zones:</strong> ' + zones.slice(0,4).map(function(z) {
              var zn = typeof z==='string'?z:(z.name||'');
              var za = typeof z==='object'?(z.aspect||''):'';
              return esc(zn) + (za?' — <em>'+esc(za)+'</em>':'');
            }).join(' · ') + '</div>');
          }
        }

        else if (genId === 'encounter') {
          var scAsp2 = Array.isArray(data.aspects) ? data.aspects : [];
          if (scAsp2.length) {
            rows.push('<div class="asp-chip">' + scAsp2.slice(0,3).map(function(a){return esc(typeof a==='string'?a:(a.name||''));}).join('</div><div class="asp-chip">') + '</div>');
          }
          var opp = Array.isArray(data.opposition) ? data.opposition : [];
          opp.forEach(function(o) {
            var isMajor = (o.type||'').toLowerCase()==='major';
            var sk3 = (o.skills||[]).slice(0,3).map(function(s){return '+'+s.r+' '+s.name;}).join(' / ');
            rows.push('<div class="field-row"><strong>' + (isMajor?'◆':'◈') + ' ×' + (o.qty||1) + ' ' + esc(o.name) + '</strong>' + (sk3?' — '+esc(sk3):'') + '</div>');
          });
          if (data.victory) rows.push('<div class="field-row"><strong style="color:#1a7a40">Win:</strong> ' + esc(data.victory) + '</div>');
          if (data.defeat)  rows.push('<div class="field-row"><strong style="color:#a00">Lose:</strong> ' + esc(data.defeat) + '</div>');
          if (data.twist)   rows.push('<div class="field-row"><strong>Twist:</strong> <em>' + esc(data.twist) + '</em></div>');
        }

        else if (genId === 'faction') {
          if (data.goal)    rows.push('<div class="field-row"><strong>Goal:</strong> ' + esc(data.goal) + '</div>');
          if (data.method)  rows.push('<div class="field-row"><strong>Method:</strong> ' + esc(data.method) + '</div>');
          if (data.weakness)rows.push('<div class="field-row"><strong>Weakness:</strong> ' + esc(data.weakness) + '</div>');
          var face = data.face || {};
          var faceName = typeof face==='string'?face:(face.name||'');
          var faceRole = typeof face==='object'?(face.role||''):'';
          if (faceName) rows.push('<div class="field-row"><strong>Face:</strong> ' + esc(faceName) + (faceRole?' — <em>'+esc(faceRole)+'</em>':'') + '</div>');
        }

        else if (genId === 'seed') {
          if (data.objective)    rows.push('<div class="field-row"><strong>Objective:</strong> ' + esc(data.objective) + '</div>');
          if (data.location)     rows.push('<div class="field-row"><strong>Location:</strong> ' + esc(data.location) + '</div>');
          if (data.complication) rows.push('<div class="field-row"><strong>Complication:</strong> ' + esc(data.complication) + '</div>');
          if (data.issue)        rows.push('<div class="field-row"><strong>Issue:</strong> <em>' + esc(data.issue) + '</em></div>');
          var seOpp = Array.isArray(data.opposition) ? data.opposition : [];
          seOpp.slice(0,2).forEach(function(o) {
            rows.push('<div class="field-row">◈ ×' + (o.qty||1) + ' ' + esc(o.name||'') + '</div>');
          });
          if (data.victory) rows.push('<div class="field-row"><strong style="color:#1a7a40">Win:</strong> ' + esc(data.victory) + '</div>');
          if (data.defeat)  rows.push('<div class="field-row"><strong style="color:#a00">Lose:</strong> ' + esc(data.defeat) + '</div>');
          if (data.twist)   rows.push('<div class="field-row"><strong>Twist:</strong> <em>' + esc(data.twist) + '</em></div>');
        }

        else if (genId === 'compel') {
          if (data.situation)   rows.push('<div class="asp-hc">' + esc(data.situation) + '</div>');
          if (data.consequence) rows.push('<div class="field-row"><strong>If accepted:</strong> ' + esc(data.consequence) + '</div>');
          if (data.template_type) rows.push('<div class="field-row"><strong>Type:</strong> ' + esc(data.template_type) + '</div>');
        }

        else if (genId === 'challenge') {
          if (data.name||data.title) rows.push('<div class="asp-hc">' + esc(data.name||data.title) + '</div>');
          if (data.desc)          rows.push('<div class="field-row">' + esc(data.desc) + '</div>');
          if (data.primary)       rows.push('<div class="field-row"><strong>Skill:</strong> ' + esc(data.primary) + '</div>');
          if (data.opposing)      rows.push('<div class="field-row"><strong>Opposing:</strong> ' + esc(data.opposing) + '</div>');
          if (data.success)       rows.push('<div class="field-row"><strong style="color:#1a7a40">Success:</strong> ' + esc(data.success) + '</div>');
          if (data.failure)       rows.push('<div class="field-row"><strong style="color:#a00">Failure:</strong> ' + esc(data.failure) + '</div>');
          if (data.stakes_good)   rows.push('<div class="field-row" style="color:#555"><strong>Stakes win:</strong> ' + esc(data.stakes_good) + '</div>');
          if (data.stakes_bad)    rows.push('<div class="field-row" style="color:#555"><strong>Stakes lose:</strong> ' + esc(data.stakes_bad) + '</div>');
        }

        else if (genId === 'contest') {
          if (data.contest_type)   rows.push('<div class="asp-hc">' + esc(data.contest_type) + '</div>');
          if (data.desc)           rows.push('<div class="field-row">' + esc(data.desc) + '</div>');
          if (data.aspect)         rows.push('<div class="asp-chip"><em>' + esc(data.aspect) + '</em></div>');
          if (data.side_a && data.side_b) rows.push('<div class="field-row"><strong>' + esc(data.side_a) + '</strong> ' + esc(data.skills_a||'') + '</div><div class="field-row"><strong>' + esc(data.side_b) + '</strong> ' + esc(data.skills_b||'') + '</div>');
          if (data.victories_needed) rows.push('<div class="field-row">First to ' + data.victories_needed + ' victories</div>');
          var twists = Array.isArray(data.twists) ? data.twists : [];
          if (twists.length) rows.push('<div class="field-row"><strong>Twists:</strong> ' + twists.slice(0,2).map(esc).join(' / ') + '</div>');
          if (data.stakes_good) rows.push('<div class="field-row" style="color:#555"><strong>Win:</strong> ' + esc(data.stakes_good) + '</div>');
          if (data.stakes_bad)  rows.push('<div class="field-row" style="color:#555"><strong>Lose:</strong> ' + esc(data.stakes_bad) + '</div>');
        }

        else if (genId === 'consequence') {
          var sev = (data.severity || 'mild');
          rows.push('<div class="asp-hc">' + sev.charAt(0).toUpperCase()+sev.slice(1) + ' Consequence</div>');
          if (data.aspect)  rows.push('<div class="pc-row asp-hc">' + esc(data.aspect) + '</div>');
          if (data.context) rows.push('<div class="pc-row asp-other"><em>' + esc(data.context) + '</em></div>');
          if (data.compel_hook) rows.push('<div class="field-row"><strong>Compel hook:</strong> ' + esc(data.compel_hook) + '</div>');
        }

        else if (genId === 'countdown') {
          if (data.name)    rows.push('<div class="asp-hc">' + esc(data.name) + '</div>');
          if (data.trigger) rows.push('<div class="field-row"><strong>Trigger:</strong> ' + esc(data.trigger) + '</div>');
          if (data.unit)    rows.push('<div class="field-row"><strong>Unit:</strong> ' + esc(data.unit) + '</div>');
          var ticks = data.boxes || 4;
          var boxHtml = '';
          for (var ci=0;ci<ticks;ci++) boxHtml += '<span class="stress-box"></span>';
          rows.push('<div class="pc-stress" style="margin-top:6px">' + boxHtml + '</div>');
          if (data.outcome) rows.push('<div class="field-row"><strong style="color:#a00">When full:</strong> ' + esc(data.outcome) + '</div>');
        }

        else if (genId === 'campaign') {
          var cur = data.current || {}, imp = data.impending || {};
          if (cur.name) rows.push('<div class="asp-hc">' + esc(cur.name) + '</div>');
          if (cur.desc) rows.push('<div class="field-row">' + esc(cur.desc) + '</div>');
          var curFaces = Array.isArray(cur.faces) ? cur.faces : [];
          curFaces.forEach(function(f) {
            rows.push('<div class="field-row" style="color:#555">◈ <strong>' + esc(f.name) + '</strong> — <em>' + esc(f.role) + '</em></div>');
          });
          if (imp.name) rows.push('<div class="field-row"><strong style="color:#a00">Impending:</strong> ' + esc(imp.name) + '</div>');
          var setting = Array.isArray(data.setting) ? data.setting : [];
          setting.forEach(function(s) { rows.push('<div class="asp-chip"><em>' + esc(s) + '</em></div>'); });
        }

        else if (genId === 'complication') {
          if (data.new_aspect) rows.push('<div class="asp-hc">"' + esc(data.new_aspect) + '"</div>');
          if (data.arrival)    rows.push('<div class="field-row"><strong>Arrival:</strong> ' + esc(data.arrival) + '</div>');
          if (data.env)        rows.push('<div class="field-row"><strong>Env:</strong> ' + esc(data.env) + '</div>');
          if (data.spotlight)  rows.push('<div class="field-row"><strong>Spotlight:</strong> ' + esc(data.spotlight) + '</div>');
        }

        else if (genId === 'obstacle') {
          if (data.name||data.title) rows.push('<div class="asp-hc">' + esc(data.name||data.title) + '</div>');
          if (data.aspect)    rows.push('<div class="asp-chip"><em>' + esc(data.aspect) + '</em></div>');
          if (data.obstacle_type) rows.push('<div class="field-row"><strong>Type:</strong> ' + esc(data.obstacle_type) + (data.rating != null ?' &nbsp;Rating: '+data.rating:'') + '</div>');
          if (data.disable||data.bypass) rows.push('<div class="field-row"><strong>Bypass:</strong> ' + esc(data.disable||data.bypass) + '</div>');
          if (data.gm_note)   rows.push('<div class="field-row" style="color:#666">' + esc(data.gm_note) + '</div>');
        }

        else if (genId === 'constraint') {
          if (data.name) rows.push('<div class="asp-hc">' + esc(data.name) + '</div>');
          if (data.restricted_action||data.what_resists) rows.push('<div class="field-row"><strong>Restricts:</strong> ' + esc(data.restricted_action||data.what_resists) + '</div>');
          if (data.consequence) rows.push('<div class="field-row"><strong style="color:#a00">If violated:</strong> ' + esc(data.consequence) + '</div>');
          if (data.bypass)      rows.push('<div class="field-row"><strong style="color:#1a7a40">Bypass:</strong> ' + esc(data.bypass) + '</div>');
          if (data.gm_note)     rows.push('<div class="field-row" style="color:#666">' + esc(data.gm_note) + '</div>');
        }

        else if (genId === 'pc') {
          var asp = data.aspects || {};
          var LADDER = {4:'Great (+4)',3:'Good (+3)',2:'Fair (+2)',1:'Average (+1)'};
          if (asp.high_concept) rows.push('<div class="pc-row asp-hc">' + esc(asp.high_concept) + '</div>');
          if (asp.trouble)      rows.push('<div class="pc-row asp-tr">► ' + esc(asp.trouble) + '</div>');
          ['other1','other2','other3'].forEach(function(k){ if(asp[k]) rows.push('<div class="pc-row asp-other">' + esc(asp[k]) + '</div>'); });
          if (data.skills && data.skills.length) {
            var byR = {};
            data.skills.forEach(function(s){ if(!byR[s.r]) byR[s.r]=[]; byR[s.r].push(s.name); });
            var skRows = [4,3,2,1].filter(function(r){return byR[r];}).map(function(r){
              return '<span class="skill-chip">+'+r+' '+esc(byR[r].join('/'))+' <em style="font-weight:400;opacity:.7">('+LADDER[r]+')</em></span>';
            });
            rows.push('<div class="pc-skills">' + skRows.join(' ') + '</div>');
          }
          if (data.stunts && data.stunts.length) {
            rows.push('<div class="pc-stunt-hdr">STUNTS</div>');
            data.stunts.forEach(function(st){
              rows.push('<div class="pc-stunt"><strong>' + esc(st.name) + '</strong> ['+esc(st.skill||'')+'] ' + esc(st.desc||'') + '</div>');
            });
          }
          var physN = data.physical_stress || 3, mentN = data.mental_stress || 3;
          var physB = '', mentB = '';
          for(var i=0;i<physN;i++) physB += '<span class="stress-box phy"></span>';
          for(var j=0;j<mentN;j++) mentB += '<span class="stress-box men"></span>';
          rows.push('<div class="pc-stress">PHYSICAL ' + physB + ' &nbsp; MENTAL ' + mentB + '  &nbsp; REFRESH <strong>' + (data.refresh||3) + '</strong></div>');
          var conSlots2 = data.consequences || [2, 4, 6];
          var conLabels2 = ['Mild', 'Moderate', 'Severe'];
          rows.push('<div class="pc-row asp-other" style="font-size:10px;opacity:.7">Consequences: ' + conSlots2.map(function(v, i) { return (conLabels2[i] || 'Extra Mild') + ' −' + v; }).join(' / ') + '</div>');
          if (Array.isArray(data.questions) && data.questions.length) {
            rows.push('<div class="pc-stunt-hdr">SESSION ZERO</div>');
            data.questions.forEach(function(q,i){ rows.push('<div class="pc-row asp-other">'+(i+1)+'. '+esc(q)+'</div>'); });
          }
        }

        else if (genId === 'backstory') {
          (Array.isArray(data.questions)?data.questions:[]).forEach(function(q,i){
            rows.push('<div class="field-row">' + (i+1) + '. ' + esc(q) + '</div>');
          });
          if (data.hook) rows.push('<div class="field-row"><strong>Hook:</strong> <em>' + esc(data.hook) + '</em></div>');
        }

        else {
          var text2 = card.text || data.situation || data.description || data.text || card.summary || '';
          if (text2) rows.push('<div class="field-row">' + esc(text2) + '</div>');
        }

        var accentColor = ({
          npc_minor:'#8B4513', npc_major:'#8B4513', pc:'#1565C0', faction:'#7C3ACD',
          scene:'#076478', campaign:'#076478', encounter:'#8B4513',
          seed:'#076478', compel:'#7B1FA2', challenge:'#7B1FA2',
          contest:'#7B1FA2', consequence:'#7B1FA2', complication:'#7B1FA2',
          backstory:'#7B1FA2', obstacle:'#2E7D32', countdown:'#2E7D32',
          constraint:'#2E7D32'
        })[genId] || '#8B4513';
        return (
          '<div class="card">' +
            '<div class="card-band" style="background:' + accentColor + '"></div>' +
            '<div class="card-header">' +
              '<span class="card-type" style="color:' + accentColor + '">' + esc(typeLabel) + '</span>' +
              (campName ? '<span class="card-world">' + esc(campName) + '</span>' : '') +
            '</div>' +
            '<div class="card-inner">' +
              '<div class="card-title">' + esc(title) + '</div>' +
              (rows.length ? '<div class="card-body">' + rows.join('') + '</div>' : '') +
            '</div>' +
          '</div>'
        );
      }

      var html = (
        '<!DOCTYPE html><html lang="en"><head>' +
        '<meta charset="UTF-8">' +
        '<title>Ogma Print — ' + esc(campName || 'Cards') + '</title>' +
        '<style>' +
        '@import url("https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,400;0,700;0,800;1,400;1,700&display=swap");' +
        '@page{size:A4 portrait;margin:10mm}' +
        'body{font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif;margin:0;padding:0;background:#EDE8DF;color:#1C1410;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
        'h1{font-size:11pt;font-weight:900;color:#8B4513;margin:0 0 8px;letter-spacing:-.02em}' +
        '.controls{padding:6px 0 10px;display:flex;gap:8px;align-items:center}' +
        '@media print{.controls{display:none}}' +
        'button{padding:6px 14px;border:1.5px solid #8B4513;border-radius:3px;background:#F5F0E8;cursor:pointer;font-size:11px;font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif;font-weight:700;letter-spacing:.06em;color:#8B4513;box-shadow:2px 2px 0 rgba(0,0,0,.12)}' +
        'button:hover{box-shadow:3px 4px 0 rgba(0,0,0,.12)}' +
        '.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8mm;padding:0}' +
        '@media(min-width:800px){.grid{grid-template-columns:repeat(3,1fr)}}' +
        '.card{border:1px solid rgba(28,20,10,.18);border-radius:3px;min-height:48mm;display:flex;flex-direction:column;break-inside:avoid;page-break-inside:avoid;box-sizing:border-box;background:#F5F0E8;box-shadow:2px 2px 0 rgba(0,0,0,.1)}' +
        '.card-band{height:4px;border-radius:3px 3px 0 0;flex-shrink:0}' +
        '.card-header{display:flex;justify-content:space-between;align-items:center;padding:5px 9px 4px;border-bottom:1px solid rgba(28,20,10,.1)}' +
        '.card-type{font-size:7pt;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#8B4513;font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif}' +
        '.card-world{font-size:7pt;color:rgba(139,69,19,.5);letter-spacing:.06em;font-style:italic;font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif}' +
        '.card-inner{padding:7px 9px;flex:1;display:flex;flex-direction:column;gap:0}' +
        '.card-title{font-size:11pt;font-weight:900;line-height:1.2;margin-bottom:6px;color:#1C1410;letter-spacing:-.02em}' +
        '.card-body{font-size:8.5pt;color:#3a2e24;line-height:1.4;flex:1;display:flex;flex-direction:column;gap:3px}' +
        '.sec-lbl{font-size:7pt;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#8B4513;font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif;margin:5px 0 3px}' +
        '.pc-row{color:#3a2e24}' +
        '.asp-hc{font-style:italic;font-weight:600;color:#1C1410;padding:2px 6px 2px 8px;border-left:2.5px solid #8B4513;background:rgba(139,69,19,.05);border-radius:0 2px 2px 0;margin:2px 0}' +
        '.asp-tr{font-style:italic;color:#7A1414;padding:2px 6px 2px 8px;border-left:2px solid rgba(122,20,20,.35);border-radius:0 2px 2px 0;margin:2px 0}' +
        '.asp-other{font-style:italic;color:#5a4a3a;font-size:8pt;padding:2px 6px 2px 8px;border-left:1px solid rgba(28,20,10,.12);border-radius:0 2px 2px 0;margin:2px 0}' +
        '.asp-chip{display:inline-block;border:1px solid rgba(139,69,19,.25);border-radius:2px;padding:1px 5px;margin:1px 2px 1px 0;font-size:7.5pt;font-style:italic;color:#5a4a3a}' +
        '.pc-skills{display:flex;flex-wrap:wrap;gap:2px;margin:3px 0}' +
        '.skill-chip{font-size:7pt;border:none;border-radius:2px;padding:2px 5px;color:#F5F0E8;white-space:nowrap;font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif;font-weight:700;background:#8B4513}' +
        '.pc-stunt{font-size:7.5pt;color:#5a4a3a;border-left:2px solid rgba(139,69,19,.28);padding-left:5px;margin:2px 0;font-style:italic}' +
        '.pc-stress{display:flex;align-items:center;gap:3px;font-size:7pt;color:#8B4513;margin-top:auto;padding-top:5px;font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif;font-weight:700;letter-spacing:.06em}' +
        '.stress-box{display:inline-block;width:10px;height:10px;border:1.5px solid;border-radius:1px}' +
        '.stress-box.phy{border-color:#C8944A}' +
        '.stress-box.men{border-color:#7C3ACD}' +
        '.field-row{font-size:8.5pt;color:#3a2e24;line-height:1.35}' +
        '.field-row strong{color:#1C1410;font-weight:700}' +
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

    // EXP-06: Export cards as PNG image pack (for Miro, Figma, etc.)
    exportCardsAsPng: function(cards, campName) {
      if (!cards || cards.length === 0) { alert('No cards to export.'); return; }

      // Re-use the same esc() and renderCardHtml() logic as printCards so visual output matches.
      function esc(s) {
        if (!s) return '';
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      }

      // ── renderCardHtml is duplicated here so the popup is self-contained ─
      function renderCard(card) {
        var genId = card.genId || '';
        var data  = card.data  || {};
        var title = card.title || data.name || data.location || data.situation || genId;
        var GEN_LABELS = {
          npc_minor:'Minor NPC', npc_major:'Major NPC', pc:'Player Character', scene:'Scene Setup',
          encounter:'Encounter', seed:'Adventure Seed', compel:'Compel',
          challenge:'Challenge', contest:'Contest', consequence:'Consequence',
          faction:'Faction', complication:'Complication', backstory:'PC Backstory',
          obstacle:'Obstacle', countdown:'Countdown', constraint:'Constraint',
          campaign:'Campaign Frame'
        };
        var LADDER = {4:'Great (+4)', 3:'Good (+3)', 2:'Fair (+2)', 1:'Average (+1)'};
        var typeLabel = GEN_LABELS[genId] || genId;
        var rows = [];

        if (genId === 'npc_minor') {
          var aspects = Array.isArray(data.aspects) ? data.aspects : [];
          aspects.forEach(function(a, i) { rows.push('<div class="pc-row '+(i===0?'asp-hc':'asp-other')+'">'+esc(a)+'</div>'); });
          if (data.skills && data.skills.length) rows.push('<div class="pc-skills">'+data.skills.map(function(s){return '<span class="skill-chip">+'+s.r+' '+esc(s.name)+'</span>';}).join(' ')+'</div>');
          if (data.stunt) rows.push('<div class="pc-stunt"><strong>'+esc(data.stunt.name)+':</strong> '+esc(data.stunt.desc)+'</div>');
          var stressN = data.stress || 0;
          if (stressN) { var boxes=''; for(var i=0;i<stressN;i++) boxes+='<span class="stress-box phy"></span>'; rows.push('<div class="pc-stress">STRESS '+boxes+'</div>'); }
          rows.push('<div class="pc-row asp-other">No consequences &mdash; one hit = out</div>');
        }
        else if (genId === 'pc' || genId === 'npc_major') {
          var asp = data.aspects || {};
          if (asp.high_concept) rows.push('<div class="pc-row asp-hc">'+esc(asp.high_concept)+'</div>');
          if (asp.trouble)      rows.push('<div class="pc-row asp-tr">&#9658; '+esc(asp.trouble)+'</div>');
          var others = genId==='pc' ? [asp.other1,asp.other2,asp.other3].filter(Boolean) : (asp.others||[]);
          others.forEach(function(a){ rows.push('<div class="pc-row asp-other">'+esc(a)+'</div>'); });
          if (data.skills && data.skills.length) {
            var byR={};
            data.skills.forEach(function(s){if(!byR[s.r])byR[s.r]=[];byR[s.r].push(s.name);});
            rows.push('<div class="pc-skills">'+ [4,3,2,1].filter(function(r){return byR[r];}).map(function(r){
              return '<span class="skill-chip">+'+r+' '+esc(byR[r].join('/'))+' <em style="font-weight:400;opacity:.7">('+LADDER[r]+')</em></span>';
            }).join(' ')+'</div>');
          }
          if (data.stunts && data.stunts.length) {
            rows.push('<div class="pc-stunt-hdr">STUNTS</div>');
            data.stunts.forEach(function(st){ rows.push('<div class="pc-stunt"><strong>'+esc(st.name)+'</strong> ['+esc(st.skill||'')+'] '+esc(st.desc||'')+'</div>'); });
          }
          var physN=data.physical_stress||3, mentN=data.mental_stress||3;
          var physB='', mentB='';
          for(var i=0;i<physN;i++) physB+='<span class="stress-box phy"></span>';
          for(var j=0;j<mentN;j++) mentB+='<span class="stress-box men"></span>';
          rows.push('<div class="pc-stress">PHYSICAL '+physB+' &nbsp; MENTAL '+mentB+' &nbsp; REFRESH <strong>'+(data.refresh||3)+'</strong></div>');
          var conSlots3 = data.consequences || [2, 4, 6];
          var conLabels3 = ['Mild', 'Moderate', 'Severe'];
          rows.push('<div class="pc-row asp-other" style="font-size:10px;opacity:.7">Consequences: ' + conSlots3.map(function(v, i) { return (conLabels3[i] || 'Extra Mild') + ' &minus;' + v; }).join(' / ') + '</div>');
          if (genId==='pc' && Array.isArray(data.questions) && data.questions.length) {
            rows.push('<div class="pc-stunt-hdr">SESSION ZERO</div>');
            data.questions.forEach(function(q,i){ rows.push('<div class="pc-row asp-other">'+(i+1)+'. '+esc(q)+'</div>'); });
          }
        }
        else if (genId==='faction') {
          var asp2=data.aspects||{};
          if(asp2.high_concept) rows.push('<div class="pc-row asp-hc">'+esc(asp2.high_concept)+'</div>');
          if(data.goal)     rows.push('<div class="field-row"><strong>Goal:</strong> '+esc(data.goal)+'</div>');
          if(data.method)   rows.push('<div class="field-row"><strong>Method:</strong> '+esc(data.method)+'</div>');
          if(data.weakness) rows.push('<div class="field-row" style="color:#7A1414"><strong>Weakness:</strong> '+esc(data.weakness)+'</div>');
          if(data.face)     rows.push('<div class="field-row"><strong>Face:</strong> '+esc(data.face)+'</div>');
        }
        else if (genId==='scene') {
          (Array.isArray(data.aspects)?data.aspects:[]).slice(0,4).forEach(function(a){
            var n=typeof a==='string'?a:(a.name||'');
            rows.push('<div class="pc-row asp-other">&ldquo;'+esc(n)+'&rdquo;</div>');
          });
          if(data.zones&&data.zones.length) rows.push('<div class="field-row" style="color:#5a4a3a;font-size:8pt">Zones: '+data.zones.slice(0,3).map(function(z){return typeof z==='string'?esc(z):esc(z.name||'');}).join(' &middot; ')+'</div>');
        }
        else if (genId==='encounter') {
          (Array.isArray(data.opposition)?data.opposition:[]).slice(0,3).forEach(function(o){ rows.push('<div class="pc-row asp-other">&times;'+(o.qty||1)+' '+esc(o.name||o)+'</div>'); });
          if(data.victory) rows.push('<div class="field-row" style="color:#2e7d32"><strong>Win:</strong> '+esc(data.victory)+'</div>');
          if(data.defeat)  rows.push('<div class="field-row" style="color:#7A1414"><strong>Lose:</strong> '+esc(data.defeat)+'</div>');
        }
        else if (genId==='seed') {
          if(data.objective)    rows.push('<div class="pc-row asp-hc">'+esc(data.objective)+'</div>');
          if(data.complication) rows.push('<div class="pc-row asp-tr">'+esc(data.complication)+'</div>');
          if(data.twist)        rows.push('<div class="field-row" style="color:#5a4a3a"><strong>Twist:</strong> '+esc(data.twist)+'</div>');
          if(data.victory||data.stakes_good) rows.push('<div class="field-row" style="color:#2e7d32"><strong>Win:</strong> '+esc(data.victory||data.stakes_good)+'</div>');
          if(data.defeat||data.stakes_bad)   rows.push('<div class="field-row" style="color:#7A1414"><strong>Lose:</strong> '+esc(data.defeat||data.stakes_bad)+'</div>');
        }
        else if (genId==='campaign') {
          var cur=data.current||{}, imp=data.impending||{};
          if(cur.name) rows.push('<div class="pc-row asp-hc">'+esc(cur.name)+'</div>');
          if(imp.name) rows.push('<div class="pc-row asp-tr"><strong>Impending:</strong> '+esc(imp.name)+'</div>');
        }
        else if (genId==='compel') {
          if(data.situation)   rows.push('<div class="pc-row asp-hc">'+esc(data.situation)+'</div>');
          if(data.consequence||data.complication) rows.push('<div class="field-row"><strong>If accepted:</strong> '+esc(data.consequence||data.complication)+'</div>');
        }
        else if (genId==='challenge') {
          if(data.name||data.title) rows.push('<div class="pc-row asp-hc">'+esc(data.name||data.title)+'</div>');
          if(data.primary||data.primary_skill) rows.push('<div class="field-row"><strong>Skill:</strong> '+esc(data.primary||data.primary_skill)+'</div>');
          if(data.success||data.stakes_good) rows.push('<div class="field-row" style="color:#2e7d32"><strong>Win:</strong> '+esc(data.success||data.stakes_good)+'</div>');
          if(data.failure||data.stakes_bad)  rows.push('<div class="field-row" style="color:#7A1414"><strong>Lose:</strong> '+esc(data.failure||data.stakes_bad)+'</div>');
        }
        else if (genId==='contest') {
          if(data.contest_type) rows.push('<div class="pc-row asp-hc">'+esc(data.contest_type)+'</div>');
          if(data.side_a&&data.side_b) rows.push('<div class="field-row">'+esc(data.side_a)+' vs '+esc(data.side_b)+'</div>');
          if(data.victories_needed) rows.push('<div class="field-row" style="color:#5a4a3a">First to '+data.victories_needed+' victories</div>');
        }
        else if (genId==='consequence') {
          var sev=(data.severity||'mild').toUpperCase();
          rows.push('<div class="pc-row asp-hc">'+esc(sev)+': '+esc(data.aspect||data.mild||data.moderate||data.severe||'')+'</div>');
          if(data.compel_hook) rows.push('<div class="field-row"><strong>Hook:</strong> '+esc(data.compel_hook)+'</div>');
        }
        else if (genId==='countdown') {
          if(data.trigger) rows.push('<div class="field-row"><strong>Trigger:</strong> '+esc(data.trigger)+'</div>');
          var bc=data.boxes||4, bs=''; for(var bi=0;bi<bc;bi++) bs+='<span class="stress-box phy"></span>';
          rows.push('<div class="pc-stress">'+bs+'</div>');
          if(data.outcome) rows.push('<div class="field-row" style="color:#7A1414"><strong>When full:</strong> '+esc(data.outcome)+'</div>');
        }
        else if (genId==='complication') {
          if(data.new_aspect) rows.push('<div class="pc-row asp-hc">&ldquo;'+esc(data.new_aspect)+'&rdquo;</div>');
          if(data.arrival)    rows.push('<div class="field-row" style="color:#5a4a3a">'+esc(data.arrival)+'</div>');
        }
        else if (genId==='obstacle') {
          if(data.restricted_action||data.what_resists) rows.push('<div class="field-row"><strong>Restricts:</strong> '+esc(data.restricted_action||data.what_resists)+'</div>');
          if(data.bypass) rows.push('<div class="field-row" style="color:#2e7d32"><strong>Bypass:</strong> '+esc(data.bypass)+'</div>');
          if(data.gm_note) rows.push('<div class="field-row" style="color:#5a4a3a;font-style:italic">'+esc(data.gm_note)+'</div>');
        }
        else if (genId==='constraint') {
          if(data.restricted_action||data.what_resists) rows.push('<div class="field-row"><strong>Restricts:</strong> '+esc(data.restricted_action||data.what_resists)+'</div>');
          if(data.consequence) rows.push('<div class="field-row" style="color:#7A1414"><strong>If violated:</strong> '+esc(data.consequence)+'</div>');
          if(data.bypass) rows.push('<div class="field-row" style="color:#2e7d32"><strong>Bypass:</strong> '+esc(data.bypass)+'</div>');
        }
        else if (genId==='backstory') {
          (Array.isArray(data.questions)?data.questions:[]).forEach(function(q,i){ rows.push('<div class="field-row">'+(i+1)+'. '+esc(q)+'</div>'); });
          if(data.hook) rows.push('<div class="field-row"><strong>Hook:</strong> <em>'+esc(data.hook)+'</em></div>');
        }
        else {
          var text2 = card.text || data.situation || data.description || data.text || card.summary || '';
          if (text2) rows.push('<div class="field-row">'+esc(text2)+'</div>');
        }

        var accentColor = ({
          npc_minor:'#8B4513', npc_major:'#8B4513', pc:'#1565C0', faction:'#7C3ACD',
          scene:'#076478', campaign:'#076478', encounter:'#8B4513',
          seed:'#076478', compel:'#7B1FA2', challenge:'#7B1FA2',
          contest:'#7B1FA2', consequence:'#7B1FA2', complication:'#7B1FA2',
          backstory:'#7B1FA2', obstacle:'#2E7D32', countdown:'#2E7D32', constraint:'#2E7D32'
        })[genId] || '#8B4513';

        return (
          '<div class="card">' +
            '<div class="card-band" style="background:' + accentColor + '"></div>' +
            '<div class="card-header">' +
              '<span class="card-type" style="color:' + accentColor + '">' + esc(typeLabel) + '</span>' +
              (campName ? '<span class="card-world">' + esc(campName) + '</span>' : '') +
            '</div>' +
            '<div class="card-inner">' +
              '<div class="card-title">' + esc(title) + '</div>' +
              (rows.length ? '<div class="card-body">' + rows.join('') + '</div>' : '') +
            '</div>' +
          '</div>'
        );
      }

      var safecamp = (campName||'ogma').replace(/[^a-zA-Z0-9_-]/g,'_');
      var html = (
        '<!DOCTYPE html><html lang="en"><head>' +
        '<meta charset="UTF-8">' +
        '<title>Ogma Image Pack &mdash; ' + esc(campName||'Cards') + '</title>' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" integrity="sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==" crossorigin="anonymous"><'+'/script>' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" integrity="sha512-XMVd28F1oH/O71fzwBnV7HucLxVwtxf26XV8P4wPk26EDxuGZ91N8bsOttmnomcCD3CS5ZMRL50H0GgOHvegtg==" crossorigin="anonymous"><'+'/script>' +
        '<style>' +
        '@import url("https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,400;0,700;0,800;1,400;1,700&display=swap");' +
        'body{font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif;margin:0;padding:16px;background:#EDE8DF;color:#1C1410;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
        'h1{font-size:11pt;font-weight:900;color:#8B4513;margin:0 0 6px;letter-spacing:-.02em}' +
        '.controls{padding:4px 0 12px;display:flex;gap:8px;align-items:center}' +
        '#status{padding:8px 12px;background:#F5F0E8;border:1px solid rgba(139,69,19,.2);border-radius:3px;margin-bottom:12px;font-size:12px;color:#5a4a3a;font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif}' +
        '.done{color:#2e7d32;font-weight:700}.err{color:#7A1414}' +
        'button{padding:6px 14px;border:1.5px solid #8B4513;border-radius:3px;background:#F5F0E8;cursor:pointer;font-size:11px;font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif;font-weight:700;letter-spacing:.06em;color:#8B4513;box-shadow:2px 2px 0 rgba(0,0,0,.12)}' +
        'button:hover{box-shadow:3px 4px 0 rgba(0,0,0,.12);transform:translateY(-1px)}' +
        'button:disabled{opacity:.5;cursor:default;transform:none}' +
        '.grid{display:grid;grid-template-columns:repeat(auto-fill,320px);gap:12px}' +
        '.card{background:#F5F0E8;border:1px solid rgba(28,20,10,.18);border-radius:3px;overflow:hidden;display:flex;flex-direction:column;box-shadow:2px 2px 0 rgba(0,0,0,.10)}' +
        '.card-band{height:4px;flex-shrink:0}' +
        '.card-header{display:flex;justify-content:space-between;align-items:center;padding:5px 9px 4px;border-bottom:1px solid rgba(28,20,10,.1)}' +
        '.card-type{font-size:7pt;font-weight:800;letter-spacing:.2em;text-transform:uppercase;font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif}' +
        '.card-world{font-size:7pt;color:rgba(139,69,19,.5);letter-spacing:.06em;font-style:italic;font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif}' +
        '.card-inner{padding:7px 9px;flex:1;display:flex;flex-direction:column;gap:0}' +
        '.card-title{font-size:11pt;font-weight:900;line-height:1.2;margin-bottom:6px;color:#1C1410;letter-spacing:-.02em}' +
        '.card-body{font-size:8.5pt;color:#3a2e24;line-height:1.4;flex:1;display:flex;flex-direction:column;gap:3px}' +
        '.pc-row{color:#3a2e24}' +
        '.asp-hc{font-style:italic;font-weight:600;color:#1C1410;padding:2px 6px 2px 8px;border-left:2.5px solid #8B4513;background:rgba(139,69,19,.05);border-radius:0 2px 2px 0;margin:2px 0}' +
        '.asp-tr{font-style:italic;color:#7A1414;padding:2px 6px 2px 8px;border-left:2px solid rgba(122,20,20,.35);border-radius:0 2px 2px 0;margin:2px 0}' +
        '.asp-other{font-style:italic;color:#5a4a3a;font-size:8pt;padding:2px 6px 2px 8px;border-left:1px solid rgba(28,20,10,.12);border-radius:0 2px 2px 0;margin:2px 0}' +
        '.pc-skills{display:flex;flex-wrap:wrap;gap:2px;margin:3px 0}' +
        '.skill-chip{font-size:7pt;border:none;border-radius:2px;padding:2px 5px;color:#F5F0E8;white-space:nowrap;font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif;font-weight:700;background:#8B4513}' +
        '.pc-stunt{font-size:7.5pt;color:#5a4a3a;border-left:2px solid rgba(139,69,19,.28);padding-left:5px;margin:2px 0;font-style:italic}' +
        '.pc-stunt-hdr{font-size:7pt;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#8B4513;font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif;margin:5px 0 3px}' +
        '.pc-stress{display:flex;align-items:center;gap:3px;font-size:7pt;color:#8B4513;margin-top:auto;padding-top:5px;font-family:"Jost","Futura","Century Gothic","Trebuchet MS",sans-serif;font-weight:700;letter-spacing:.06em;flex-wrap:wrap}' +
        '.stress-box{display:inline-block;width:10px;height:10px;border:1.5px solid;border-radius:1px}' +
        '.stress-box.phy{border-color:#C8944A}' +
        '.stress-box.men{border-color:#7C3ACD}' +
        '.field-row{font-size:8.5pt;color:#3a2e24;line-height:1.35}' +
        '.field-row strong{color:#1C1410;font-weight:700}' +
        '</style></head><body>' +
        '<div class="controls">' +
        '<h1>Ogma &mdash; ' + esc(campName||'Cards') + ' &mdash; ' + cards.length + ' card' + (cards.length===1?'':'s') + '</h1>' +
        '<button id="dlBtn" onclick="startExport()">Download ZIP</button>' +
        '<button onclick="window.close()">&#x2715; Close</button>' +
        '</div>' +
        '<div id="status">Ready. Click "Download ZIP" to capture all cards as PNG images.</div>' +
        '<div class="grid" id="grid">' + cards.map(renderCard).join('') + '</div>' +
        '<script>' +
        'function startExport(){' +
        '  if(typeof html2canvas==="undefined"||typeof JSZip==="undefined"){' +
        '    document.getElementById("status").innerHTML="<span class=\\"err\\">Libraries not loaded &mdash; check internet connection and reload.</span>";' +
        '    return;' +
        '  }' +
        '  var btn=document.getElementById("dlBtn");' +
        '  var status=document.getElementById("status");' +
        '  var els=document.querySelectorAll(".card");' +
        '  var zip=new JSZip();' +
        '  var folder=zip.folder("' + safecamp + '_cards");' +
        '  btn.disabled=true;' +
        '  btn.textContent="Rendering...";' +
        '  var idx=0;' +
        '  function next(){' +
        '    if(idx>=els.length){' +
        '      status.textContent="Packaging ZIP...";' +
        '      zip.generateAsync({type:"blob"}).then(function(blob){' +
        '        var url=URL.createObjectURL(blob);' +
        '        var a=document.createElement("a");' +
        '        a.href=url;a.download="' + safecamp + '_cards.zip";' +
        '        document.body.appendChild(a);a.click();' +
        '        document.body.removeChild(a);URL.revokeObjectURL(url);' +
        '        status.innerHTML="<span class=\\"done\\">Done &mdash; "+els.length+" card'+(cards.length===1?'':'s')+' exported.</span>";' +
        '        btn.textContent="Done";btn.disabled=false;' +
        '      });' +
        '      return;' +
        '    }' +
        '    status.textContent="Rendering card "+(idx+1)+" of "+els.length+"...";' +
        '    html2canvas(els[idx],{scale:2,backgroundColor:"#EDE8DF",logging:false,useCORS:true}).then(function(cv){' +
        '      var img=cv.toDataURL("image/png").split(",")[1];' +
        '      var lbl=(els[idx].querySelector(".card-type")||{}).textContent||("card_"+(idx+1));' +
        '      var fn=lbl.toLowerCase().replace(/[^a-z0-9]+/g,"_")+"_"+(idx+1).toString().padStart(3,"0")+".png";' +
        '      folder.file(fn,img,{base64:true});' +
        '      idx++;next();' +
        '    }).catch(function(e){' +
        '      status.innerHTML+="<br><span class=\\"err\\">Card "+(idx+1)+" failed: "+e.message+"</span>";' +
        '      idx++;next();' +
        '    });' +
        '  }' +
        '  next();' +
        '}' +
        '<'+'/script></body></html>'
      );

      var blob = new Blob([html], {type:'text/html;charset=utf-8'});
      var url = URL.createObjectURL(blob);
      var w = window.open(url, '_blank', 'width=900,height=700,scrollbars=yes');
      if (!w) {
        var a = document.createElement('a');
        a.href = url; a.download = safecamp + '-image-pack.html';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }
      setTimeout(function() { URL.revokeObjectURL(url); }, 60000);
    },

  };
