const CACHE_NAME = 'app_cache_v_0.3';

self.addEventListener('install', event => {
  const timeStamp = Date.now();

  event.waitUntil(
    new Promise(resolve => {
      self.addEventListener('message', ({ data: { cacheUrls } }) => {
        const urls = cacheUrls.map(url => `${url}?timestamp=${timeStamp}`);

        caches.open(CACHE_NAME)
          .then(cache => cache.addAll(['/', ...urls]))
          .then(resolve);
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(response => {
      return response || fetch(event.request);
    })
  );
});
