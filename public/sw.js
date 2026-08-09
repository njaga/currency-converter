const CACHE_NAME = 'kiwango-shell-v5';
const OFFLINE_URL = '/convertisseur';
const PRECACHE_ASSETS = ['/', '/convertisseur', '/voyage', '/outils', '/site.webmanifest', '/favicon.svg', '/logo.svg', '/mentions-legales'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) return;

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
