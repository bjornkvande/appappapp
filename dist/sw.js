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
    "revision": "947d5c8e7b66d2e23fc01a73c0d12a5c"
  },
  {
    "url": "index.html",
    "revision": "8f0015cb9f95d8fb157cee1820a8db11"
  },
  {
    "url": "sounds/app1.m4a",
    "revision": "3c8c7b71499102328f8e9d52c4c8860d"
  },
  {
    "url": "sounds/app10.m4a",
    "revision": "a7ebb0d71c3f23a264076874ad1022cc"
  },
  {
    "url": "sounds/app11.m4a",
    "revision": "cfe87939f3bfe364a3070ec4f1c7aa6b"
  },
  {
    "url": "sounds/app12.m4a",
    "revision": "821e017609b8d5e683983d6db2f22eef"
  },
  {
    "url": "sounds/app2.m4a",
    "revision": "904170ded270f036415627a7cbad0c92"
  },
  {
    "url": "sounds/app3.m4a",
    "revision": "6c245f74e540a0cd6ca1bf1a2617a05f"
  },
  {
    "url": "sounds/app4.m4a",
    "revision": "24517a8b05d5d26f2a6e8f9dd46969c9"
  },
  {
    "url": "sounds/app5.m4a",
    "revision": "c97d3444f47f87e4e495d680ea7d5109"
  },
  {
    "url": "sounds/app6.m4a",
    "revision": "1554327e590a8af5864ada59a5ddd6c8"
  },
  {
    "url": "sounds/app7.m4a",
    "revision": "d92a7628379ef903802cf1232459da4a"
  },
  {
    "url": "sounds/app8.m4a",
    "revision": "da98cac60917a87e37032ea09f1bb370"
  },
  {
    "url": "sounds/app9.m4a",
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
