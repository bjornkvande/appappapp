/* globals importScripts, workbox */

'use strict';

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);

const FILES_TO_CACHE = [
  { url: '/', revision: '2020-01-01' },
  { url: '/app.js', revision: '2020-01-01' },
  { url: '/style.css', revision: '2020-01-01' },
  { url: '/sounds/app1.m4a', revision: '2020-01-01' },
  { url: '/sounds/app2.m4a', revision: '2020-01-01' },
  { url: '/sounds/app3.m4a', revision: '2020-01-01' },
  { url: '/sounds/app4.m4a', revision: '2020-01-01' },
  { url: '/sounds/app5.m4a', revision: '2020-01-01' },
  { url: '/sounds/app6.m4a', revision: '2020-01-01' },
  { url: '/sounds/app7.m4a', revision: '2020-01-01' },
  { url: '/sounds/app8.m4a', revision: '2020-01-01' },
  { url: '/sounds/app9.m4a', revision: '2020-01-01' },
  { url: '/sounds/app10.m4a', revision: '2020-01-01' },
  { url: '/sounds/app11.m4a', revision: '2020-01-01' },
  { url: '/sounds/app12.m4a', revision: '2020-01-01' }
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
