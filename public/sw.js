const CACHE_NAME = 'kiwango-shell-v2';
const OFFLINE_URL = '/app';
const PRECACHE_ASSETS = ['/', '/app', '/site.webmanifest', '/favicon.svg', '/logo.svg', '/mentions-legales'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) return;

  // Documents: network first so a new Kiwango release is visible immediately.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response?.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone())).catch(() => undefined);
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match(OFFLINE_URL)) || caches.match('/'))
    );
    return;
  }

  // Same-origin static assets: cache first, refresh in the background.
  if (url.origin === self.location.origin && ['style', 'script', 'image', 'font', 'manifest'].includes(request.destination)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const refresh = fetch(request)
          .then((response) => {
            if (response?.ok) cache.put(request, response.clone()).catch(() => undefined);
            return response;
          })
          .catch(() => cached);
        return cached || refresh;
      })
    );
  }
});
