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
    "revision": "37767d11c668b695b1f49ee0d13725de"
  },
  {
    "url": "index.html",
    "revision": "e9fdc9039a38dfcd407fcdb909473b7e"
  },
  {
    "url": "manifest.json",
    "revision": "e1ee00160357f76933a40bf479df7375"
  },
  {
    "url": "sounds/app1.mp3",
    "revision": "13099d6b38f25bb3923834222d73f2ff"
  },
  {
    "url": "sounds/app2.mp3",
    "revision": "6d532b8d1c379cda014543143b1d7ea0"
  },
  {
    "url": "sounds/app3.mp3",
    "revision": "7e15bed50a69b8e2e3c315555f7e6e11"
  },
  {
    "url": "sounds/app4.mp3",
    "revision": "0faa246870b6e051af7fad32876e5085"
  },
  {
    "url": "sounds/app5.mp3",
    "revision": "fc60ba02f527ef28ce33fb62fe4f8287"
  },
  {
    "url": "style.css",
    "revision": "a0d31088397b2eef6adc0582b6f8a816"
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
