const CACHE_NAME = 'spy-game-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/modal.js',
  '/help.js',
  '/settings.js',
  '/lang.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
];

// Install event – cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event – clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch event – serve from cache or network
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Skip non-GET requests and chrome-extension protocols
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response.clone());
          return response;
        });
      }).catch(() => {
        // Optionally fallback to offline page/image
      });
    })
  );
});
