// sw.js - Ogma Service Worker
// Strategy: cache-first for all static assets, network-first for CDN scripts.
// Safari fix: redirected responses are cloned as non-redirected before caching.

var CACHE_NAME = 'fate-generator-2026.03.306';

var APP_SHELL = [
  '/index.html',
  '/about.html',
  '/learn.html',
  '/license.html',
  '/help/index.html',
  '/help/new-to-ogma.html',
  '/help/getting-started.html',
  '/help/learn-fate.html',
  '/help/how-to-use-ogma.html',
  '/help/generators.html',
  '/help/fate-mechanics.html',
  '/help/at-the-table.html',
  '/help/export-share.html',
  '/help/customise.html',
  '/help/dnd-transition.html',
  '/help/faq.html',
  '/help/hosting.html',
  '/assets/js/partysocket.js',
  '/campaigns/thelongafter.html',
  '/campaigns/sessionzero.html',
  '/campaigns/transition.html',
  '/campaigns/guide-thelongafter.html',
  '/campaigns/guide-cyberpunk.html',
  '/campaigns/guide-fantasy.html',
  '/campaigns/guide-space.html',
  '/campaigns/guide-victorian.html',
  '/campaigns/guide-postapoc.html',
  '/campaigns/cyberpunk.html',
  '/campaigns/fantasy.html',
  '/campaigns/space.html',
  '/campaigns/victorian.html',
  '/campaigns/postapoc.html',
  '/campaigns/western.html',
  '/campaigns/guide-western.html',
  '/campaigns/dVentiRealm.html',
  '/campaigns/guide-dVentiRealm.html',
  '/campaigns/run.html',
  '/campaigns/board.html',
  '/core/ui-table.js',
  '/core/ui-board.js',
  '/assets/pdf/the_long_road.pdf',
  '/assets/pdf/the_long_after.pdf',
  '/assets/pdf/the_gaslight_chronicles.pdf',
  '/campaigns/character-creation.html',
  '/assets/css/theme.css',
  '/assets/css/help-shared.css',
  '/assets/css/campaigns/theme-thelongafter.css',
  '/assets/css/campaigns/theme-cyberpunk.css',
  '/assets/css/campaigns/theme-fantasy.css',
  '/assets/css/campaigns/theme-space.css',
  '/assets/css/campaigns/theme-victorian.css',
  '/assets/css/campaigns/theme-postapoc.css',
  '/assets/css/campaigns/theme-western.css',
  '/assets/css/campaigns/theme-dVentiRealm.css',
  '/core/engine.js',
  '/core/ui-primitives.js',
  '/core/ui-renderers.js',
  '/core/ui-modals.js',
  '/core/ui-landing.js',
  '/core/ui.js',
  '/core/db.js',
  '/core/intro.js',
  '/data/shared-lite.js',
  '/data/shared.js',
  '/data/universal.js',
  '/data/thelongafter.js',
  '/data/cyberpunk.js',
  '/data/fantasy.js',
  '/data/space.js',
  '/data/victorian.js',
  '/data/postapoc.js',
  '/data/western.js',
  '/data/dVentiRealm.js',
  '/manifest.json',
  '/assets/favicons/icon.svg',
  '/assets/favicons/icon-192.png',
  '/assets/favicons/icon-512.png',
  '/assets/favicons/icon-32.png',
  '/assets/favicons/icon-180.png',
  '/assets/favicons/apple-touch-icon.png',
  '/assets/favicons/favicon.ico',
  '/assets/img/og-default.png',
  '/assets/js/dice-roller.js',
  '/assets/js/help-shared.js',
];

var CDN_SCRIPTS = [
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/dexie/4.0.10/dexie.min.js',
];

// Safari throws "Response served by service worker has redirections" if a
// cached response has response.redirected === true. This clones the body
// into a fresh, non-redirected Response object before caching.
function cleanResponse(response) {
  if (!response.redirected) return Promise.resolve(response);
  return response.blob().then(function(body) {
    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  });
}

// ── Install ─────────────────────────────────────────────────────────────
self.addEventListener('install', function(event) {
  self.skipWaiting(); // take over immediately, don't wait for old tabs to close
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      var shellPromise = Promise.allSettled(
        APP_SHELL.map(function(url) {
          return fetch(url).then(function(response) {
            if (!response.ok) throw new Error(response.status);
            return cleanResponse(response);
          }).then(function(clean) {
            return cache.put(url, clean);
          }).catch(function(err) {
            console.warn('[SW] Failed to cache:', url, err.message);
          });
        })
      );
      return shellPromise;
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ── Activate ────────────────────────────────────────────────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    }).catch(function(err) {
      console.warn('[SW] activate cleanup failed:', err);
    })
  );
});

// ── Fetch ───────────────────────────────────────────────────────────────
self.addEventListener('fetch', function(event) {
  var url = event.request.url;
  if (event.request.method !== 'GET') return;

  // CDN scripts: do NOT intercept — let the browser handle with its own HTTP cache
  // SW interception strips CORS headers and causes 'Loading failed' errors
  var isCDN = CDN_SCRIPTS.some(function(cdn) { return url.indexOf(cdn) === 0; });
  if (isCDN) return;

  // Navigation requests: network-first so CF Pages Pretty URLs are honoured (no _redirects file needed).
  // On failure (offline), try the cached .html equivalent of the clean URL.
  // Never fall back to index.html — that was the SPA pattern and is now wrong.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(function(response) {
        // Cache successful navigations for offline use
        if (response.ok) {
          var r2 = response.clone();
          cleanResponse(r2).then(function(clean) {
            return caches.open(CACHE_NAME).then(function(cache) { return cache.put(event.request, clean); });
          }).catch(function(err) {
            console.warn('[SW] nav cache write failed:', err);
          });
        }
        return response;
      }).catch(function() {
        // Offline: try exact URL in cache first
        return caches.match(event.request).then(function(cached) {
          if (cached) return cached;
          // Map clean top-level world slugs to their cached campaign HTML files
          var CLEAN_URL_MAP = {
            '/thelongafter': '/campaigns/thelongafter.html',
            '/cyberpunk':    '/campaigns/cyberpunk.html',
            '/fantasy':      '/campaigns/fantasy.html',
            '/space':        '/campaigns/space.html',
            '/victorian':    '/campaigns/victorian.html',
            '/postapoc':     '/campaigns/postapoc.html',
            '/western':      '/campaigns/western.html',
            '/dVentiRealm':  '/campaigns/dVentiRealm.html',
          };
          var pathname = new URL(event.request.url).pathname.replace(/\/$/, '');
          if (CLEAN_URL_MAP[pathname]) {
            return caches.match(CLEAN_URL_MAP[pathname]).then(function(mapped) {
              if (mapped) return mapped;
            });
          }
          // Try appending .html (handles other clean URLs)
          var htmlUrl = event.request.url.replace(/\/?(\?.*)?$/, '.html$1');
          return caches.match(htmlUrl).then(function(cached2) {
            if (cached2) return cached2;
            // Last resort: offline page
            return new Response(
              '<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;background:#0c0c0e;color:#d4a832">' +
              '<h1>Ogma</h1><p>You\'re offline and this page isn\'t cached yet.</p>' +
              '<p><a href="/" style="color:#d4a832">← Home</a></p></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
        });
      })
    );
    return;
  }

  // All other local assets: cache-first
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (response.ok && url.indexOf(self.location.origin) === 0) {
          var r2 = response.clone();
          cleanResponse(r2).then(function(clean) {
            return caches.open(CACHE_NAME).then(function(cache) { return cache.put(event.request, clean); });
          }).catch(function(err) {
            console.warn('[SW] asset cache write failed:', err);
          });
        }
        return response;
      }).catch(function() {
        // Stale versioned asset not on network — return empty 404 rather than rejecting
        return new Response('', { status: 404, statusText: 'Not found (stale cache)' });
      });
    })
  );
});
