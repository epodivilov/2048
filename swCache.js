const VERSION = 0.31;
const CACHE_NAME = `swCache_v_${VERSION}`;

function fromCache (request) {
  return caches.open(CACHE_NAME).then((cache) =>
    cache.match(request).then((matching) =>
      matching || Promise.reject('no-match')
    ));
}

function update (request) {
  return caches.open(CACHE_NAME).then((cache) =>
    fetch(request).then((response) =>
      cache.put(request, response)
    )
  );
}

self.addEventListener('install', event => {
  event.waitUntil(
    new Promise(resolve => {
      self.addEventListener('message', ({ data: { cacheUrls } }) => {
        caches.open(CACHE_NAME)
          .then(cache => cache.addAll(cacheUrls))
          .then(resolve);
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (CACHE_NAME !== cacheName && cacheName.startsWith('swCache_v_')) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(fromCache(event.request));
  event.waitUntil(update(event.request));
});

