/* globals importScripts, workbox */

'use strict';

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);

if (workbox) {
  console.log('Workbox is loaded');
  self.skipWaiting();
  workbox.precaching.precacheAndRoute([
  {
    "url": "app.js",
    "revision": "aee506e4a2a99b0297e16ccbcf68a5fe"
  },
  {
    "url": "index.html",
    "revision": "f6bedeb05c4210dade33923f154a673a"
  },
  {
    "url": "manifest.json",
    "revision": "2afeadccf7265bccf83da34255fb8358"
  },
  {
    "url": "sounds/app1.m4a",
    "revision": "6c245f74e540a0cd6ca1bf1a2617a05f"
  },
  {
    "url": "sounds/app2.m4a",
    "revision": "24517a8b05d5d26f2a6e8f9dd46969c9"
  },
  {
    "url": "sounds/app3.m4a",
    "revision": "d92a7628379ef903802cf1232459da4a"
  },
  {
    "url": "sounds/app4.m4a",
    "revision": "26f67e8cecea2f052db7d0bafc43d8ae"
  },
  {
    "url": "style.css",
    "revision": "f3c713e01536d996e8955e4896c0d6fb"
  }
]);
  cacheBackgroundImages();
  removeOldCaches();
} else {
  console.log('Sorry! Workbox didn\'t load');
}

function cacheBackgroundImages() {
  const ONE_WEEK = 7 * 24 * 60 * 60;
  createCache({
    matcher: /^https:\/\/res.cloudinary.com\/trailguide-as\//,
    cacheName: 'background-cache',
    strategy: workbox.strategies.CacheFirst,
    options: {
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: ONE_WEEK,
          maxEntries: 100
        })
      ]
    }
  });
}

function createCache({ matcher, cacheName, strategy, options = {} }) {
  const match = createMatcher(matcher);
  workbox.routing.registerRoute(match, new strategy({ cacheName, ...options }));
}

function createMatcher(matcher) {
  if (matcher instanceof Function) {
    return ({ url }) => matcher(url);
  } else {
    return matcher;
  }
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
