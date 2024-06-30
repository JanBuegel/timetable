const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/timetable',
  '/css/styles.css',
  '/js/main.js',
  '/manifest.json',
  '/stages' // Hinzufügen der /stages-Route
];

// Install event - cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Fetch the stages data and add to cache
        return fetch('/stages').then(response => {
          if (response.ok) {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put('/stages', response.clone());
              return response;
            });
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached files
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/stages')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});
