// partysocket-lite.js — same-origin drop-in for the partysocket npm package
// Implements the API surface Ogma uses: new PartySocket({host,room,query}),
// send(), close(), addEventListener(), removeEventListener()
// Auto-reconnects with exponential backoff. No CDN, no CORS, no MIME issues.
//
// Why vendored: partysocket ships ESM+CJS only (no UMD/IIFE global build).
// Every CDN URL returns either text/plain (CJS) or broken ESM (unresolved
// internal imports). The only reliable browser-script option is this file.
// 86 lines of standard WebSocket API we own and control.
//
// Reconnect behaviour mirrors partysocket@1.x:
//   - exponential backoff: 500ms → 1s → 2s → ... → 30s max
//   - message queue: send() buffers while reconnecting, flushes on open
//   - dead flag: close() stops reconnect permanently
(function(global) {
  'use strict';

  function PartySocket(opts) {
    this._opts      = opts;
    this._ws        = null;
    this._delay     = 500;
    this._dead      = false;
    this._queue     = [];
    this._listeners = { open: [], close: [], message: [], error: [] };
    this._connect();
  }

  PartySocket.prototype._url = function() {
    var o     = this._opts;
    var proto = location.protocol === 'https:' ? 'wss' : 'ws';
    var qs    = '';
    if (o.query) {
      qs = '?' + Object.keys(o.query).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(o.query[k]);
      }).join('&');
    }
    // partysocket URL convention: host/parties/main/:room
    return proto + '://' + o.host + '/parties/main/' + o.room + qs;
  };

  PartySocket.prototype._connect = function() {
    var self = this;
    if (self._dead) return;
    try {
      var ws = new WebSocket(self._url());
      self._ws = ws;

      ws.onopen = function(e) {
        self._delay = 500;                               // reset backoff
        self._queue.forEach(function(m) { ws.send(m); }); // flush queue
        self._queue = [];
        self._emit('open', e);
      };
      ws.onclose = function(e) {
        self._emit('close', e);
        if (!self._dead) {
          setTimeout(function() {
            self._delay = Math.min(self._delay * 2, 30000);
            self._connect();
          }, self._delay);
        }
      };
      ws.onmessage = function(e) { self._emit('message', e); };
      ws.onerror   = function(e) { self._emit('error', e); };
    } catch(e) {
      if (!self._dead) {
        setTimeout(function() { self._connect(); }, self._delay);
      }
    }
  };

  PartySocket.prototype._emit = function(type, event) {
    (this._listeners[type] || []).forEach(function(fn) { fn(event); });
  };

  PartySocket.prototype.addEventListener = function(type, fn) {
    if (!this._listeners[type]) this._listeners[type] = [];
    this._listeners[type].push(fn);
  };

  PartySocket.prototype.removeEventListener = function(type, fn) {
    if (!this._listeners[type]) return;
    this._listeners[type] = this._listeners[type].filter(function(f) { return f !== fn; });
  };

  PartySocket.prototype.send = function(msg) {
    if (this._ws && this._ws.readyState === WebSocket.OPEN) {
      this._ws.send(msg);
    } else {
      this._queue.push(msg); // buffer until reconnected
    }
  };

  PartySocket.prototype.close = function() {
    this._dead = true;
    if (this._ws) this._ws.close();
  };

  global.PartySocket = PartySocket;

})(typeof window !== 'undefined' ? window : this);
