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
    "revision": "3b578c6d026ec253590467b5fe54440b"
  },
  {
    "url": "index.html",
    "revision": "4ab73e7681ca4959b116d82da14bdb23"
  },
  {
    "url": "manifest.json",
    "revision": "e1ee00160357f76933a40bf479df7375"
  },
  {
    "url": "sounds/app1.m4a",
    "revision": "6c245f74e540a0cd6ca1bf1a2617a05f"
  },
  {
    "url": "sounds/app1.mp3",
    "revision": "13099d6b38f25bb3923834222d73f2ff"
  },
  {
    "url": "sounds/app2.m4a",
    "revision": "24517a8b05d5d26f2a6e8f9dd46969c9"
  },
  {
    "url": "sounds/app2.mp3",
    "revision": "6d532b8d1c379cda014543143b1d7ea0"
  },
  {
    "url": "sounds/app3.m4a",
    "revision": "d92a7628379ef903802cf1232459da4a"
  },
  {
    "url": "sounds/app3.mp3",
    "revision": "7e15bed50a69b8e2e3c315555f7e6e11"
  },
  {
    "url": "sounds/app4.m4a",
    "revision": "26f67e8cecea2f052db7d0bafc43d8ae"
  },
  {
    "url": "sounds/app4.mp3",
    "revision": "0faa246870b6e051af7fad32876e5085"
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
