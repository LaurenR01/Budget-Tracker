const CACHE_NAME = 'static-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/styles.css',
  'index.js',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', function(event) {
    if (event.request.url.includes('/api')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME)
        .then(cache =>{
        return fetch(event.request)
        .then(response => {
            if (response.status === 200) {
                cache.put(event.request.url, response.clone());
            }
            return response;
        }).catch(err => {
            return cache.match(event.request);
        });
        }).catch(err =>console.log(err))
      );
      return;
  }
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                return response || fetch (event.request);
            });
        })
    )}
 
  );

  self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(
          keyList.map(function(key) {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
    );
  });