/* globals importScripts, workbox */

'use strict';

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);

const FILES_TO_CACHE = [
  { url: '/', revision: '2019-12-31' },
  { url: '/app.js', revision: '2019-12-31' },
  { url: '/style.css', revision: '2019-12-31' },
  { url: '/sounds/', revision: '2019-12-31' }
];

if (workbox) {
  console.log('Workbox is loaded');

  // load and start using immediately
  self.skipWaiting();

  workbox.precaching.precacheAndRoute(FILES_TO_CACHE);

  removeOldCaches();
} else {
  console.log('Sorry! Workbox didn\'t load');
}

function removeOldCaches() {
  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        const validCacheSet = new Set(Object.values(workbox.core.cacheNames));
        return Promise.all(
          cacheNames
            .filter(cacheName => !validCacheSet.has(cacheName))
            .map(cacheName => {
              console.log('deleting cache', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
    );
  });
}
