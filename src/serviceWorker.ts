/// <reference path="./types/service-worker.d.ts" />

const CACHE_NAME = 'cursor-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/static/css/main.chunk.css',
  '/Template.glb'
];

/**
 * @event install
 * @description This event is fired when the service worker is installed.
 * It opens a cache and adds all the static assets to it for offline availability.
 * @param {ExtendableEvent} event - The install event.
 */
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

/**
 * @event activate
 * @description This event is fired when the service worker is activated.
 * It cleans up old caches by deleting any caches that do not match the current cache name.
 * @param {ExtendableEvent} event - The activate event.
 */
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

/**
 * @event fetch
 * @description This event is fired for every network request.
 * It implements a cache-first strategy. It first checks if the request is in the cache.
 * If it is, it returns the cached response. Otherwise, it fetches the request from the network,
 * caches the response, and then returns it.
 * @param {FetchEvent} event - The fetch event.
 */
self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
}); 