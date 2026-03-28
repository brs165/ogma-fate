const CACHE_NAME = 'ogma-2026.03.695';

// Font Awesome CDN resources to precache for offline
const FA_CDN = [
  'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.2.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.2.0/webfonts/fa-solid-900.woff2',
  'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.2.0/webfonts/fa-regular-400.woff2',
  'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.2.0/webfonts/fa-brands-400.woff2',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/assets/css/theme.css',
        '/assets/css/help-shared.css',
        '/manifest.json',
        ...FA_CDN
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // Handle Font Awesome CDN requests (cache-first for offline)
  const isFA = url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('fontawesome');
  if (url.origin !== self.location.origin && !isFA) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache =>
            cache.put(event.request, clone)
          );
        }
        return response;
      }).catch(() => {
        // Network failed — return offline fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('', { status: 408 });
      });
    })
  );
});
