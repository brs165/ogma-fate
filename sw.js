// sw.js — Fate Condensed Campaign Generator Service Worker
// Strategy: cache-first for all static assets, network-first for CDN scripts.
// Safari fix: redirected responses are cloned as non-redirected before caching.

var CACHE_NAME = 'fate-generator-2026.03.22';

var APP_SHELL = [
  './index.html',
  './about.html',
  './learn.html',
  './license.html',
  './campaigns/thelongafter.html',
  './campaigns/sessionzero.html',
  './campaigns/transition.html',
  './campaigns/guide-thelongafter.html',
  './campaigns/guide-cyberpunk.html',
  './campaigns/guide-fantasy.html',
  './campaigns/guide-space.html',
  './campaigns/guide-victorian.html',
  './campaigns/guide-postapoc.html',
  './campaigns/cyberpunk.html',
  './campaigns/fantasy.html',
  './campaigns/space.html',
  './campaigns/victorian.html',
  './campaigns/postapoc.html',
  './assets/css/theme.css',
  './core/engine.js',
  './core/ui.js',
  './core/db.js',
  './core/intro.js',
  './data/shared.js',
  './data/universal.js',
  './data/thelongafter.js',
  './data/cyberpunk.js',
  './data/fantasy.js',
  './data/space.js',
  './data/victorian.js',
  './data/postapoc.js',
  './manifest.json',
  './assets/favicons/icon.svg',
  './assets/favicons/icon-192.png',
  './assets/favicons/icon-512.png',
  './assets/favicons/icon-32.png',
  './assets/favicons/icon-180.png',
  './assets/favicons/apple-touch-icon.png',
  './assets/favicons/favicon.ico',
  './assets/img/og-default.png',
];

var CDN_SCRIPTS = [
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://unpkg.com/rpg-awesome@0.2.0/css/rpg-awesome.min.css',
  'https://unpkg.com/rpg-awesome@0.2.0/fonts/rpgawesome-webfont.woff2',
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
      var cdnPromise = Promise.allSettled(
        CDN_SCRIPTS.map(function(url) {
          return fetch(url, { cache: 'no-cache' }).then(function(response) {
            if (response.ok) return cleanResponse(response).then(function(c) { return cache.put(url, c); });
          }).catch(function() {});
        })
      );
      return Promise.all([shellPromise, cdnPromise]);
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
    })
  );
});

// ── Fetch ───────────────────────────────────────────────────────────────
self.addEventListener('fetch', function(event) {
  var url = event.request.url;
  if (event.request.method !== 'GET') return;

  // CDN scripts: cache-first
  var isCDN = CDN_SCRIPTS.some(function(cdn) { return url.indexOf(cdn) === 0; });
  if (isCDN) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then(function(response) {
          if (response.ok) {
            var r2 = response.clone();
            cleanResponse(r2).then(function(clean) {
              caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clean); });
            });
          }
          return response;
        }).catch(function() {
          return new Response('', { status: 503, statusText: 'CDN unavailable' });
        });
      })
    );
    return;
  }

  // Navigation requests: cache-first, fall back to index.html for SPA-like behavior
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        // Root navigation — try index.html from cache
        return caches.match('./index.html');
      }).then(function(cached) {
        if (cached) return cached;
        // Network fallback
        return fetch(event.request).then(function(response) {
          if (response.ok) {
            var r2 = response.clone();
            cleanResponse(r2).then(function(clean) {
              caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clean); });
            });
          }
          return response;
        });
      }).catch(function() {
        return caches.match('./index.html').then(function(r) {
          return r || new Response(
            '<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;background:#0c0c0e;color:#d4a832">' +
            '<h1>Fate Generator</h1><p>Offline — this page is not cached yet.</p>' +
            '<p><a href="." style="color:#d4a832">Return home</a></p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
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
            caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clean); });
          });
        }
        return response;
      });
    })
  );
});
