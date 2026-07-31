const CACHE_NAME = 'africhange-pwa-v2';

const PRECACHE_ASSETS = [
  '/',
  '/site.webmanifest',
  '/favicon.svg',
  '/logo.svg',
  '/mentions-legales',
];

// Install Event - Pre-cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate with protocol safety
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests or non-HTTP(S) schemes (e.g. chrome-extension://, moz-extension://)
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // Handle static assets & navigation pages
  if (
    request.mode === 'navigate' ||
    url.origin === self.origin ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            // Guard against invalid/extension/non-200 responses
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              url.protocol.startsWith('http')
            ) {
              try {
                cache.put(request, networkResponse.clone());
              } catch (e) {
                // Ignore unsupported scheme errors silently
              }
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
