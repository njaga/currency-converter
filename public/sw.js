const CACHE_NAME = 'kiwango-pwa-v1';

const PRECACHE_ASSETS = [
  '/',
  '/site.webmanifest',
  '/favicon.svg',
  '/logo.svg',
  '/mentions-legales',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((cacheNames) => Promise.all(cacheNames.filter((cache) => cache !== CACHE_NAME).map((cache) => caches.delete(cache)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) return;
  const cacheable = request.mode === 'navigate' || url.origin === self.location.origin || ['style', 'script', 'image', 'font'].includes(request.destination);
  if (!cacheable) return;

  event.respondWith(caches.open(CACHE_NAME).then(async (cache) => {
    const cachedResponse = await cache.match(request);
    const networkPromise = fetch(request).then((networkResponse) => {
      if (networkResponse?.ok && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) cache.put(request, networkResponse.clone()).catch(() => undefined);
      return networkResponse;
    }).catch(() => cachedResponse || caches.match('/'));
    return cachedResponse || networkPromise;
  }));
});
