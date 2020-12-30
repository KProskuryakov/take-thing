const CACHE_NAME = "take-thing-cache-v3";
const urlsToCache = [
  "/",
  "bootstrap.bundle.min.js",
  "bootstrap.min.css"
];

self.addEventListener('install', event => {
  console.log('Installing Service Worker.');
  // Perform install steps
  const preCache = async () => {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(urlsToCache);
  };
  event.waitUntil(preCache());
});

self.addEventListener('activate', event => {
  console.log("Removing stale caches.");
  // delete unused caches
  const cleanCaches = async () => {
    const keys = await caches.keys();
    keys.filter((key) => key != CACHE_NAME).forEach((key) => caches.delete(key));
  }
  event.waitUntil(cleanCaches())
});

self.addEventListener('fetch', event => {
  if (event.request.method != 'GET') {
    return;
  }

  event.respondWith(async function() {
    // Try to get the response from a cache.
    const cache = await caches.open('dynamic-v1');
    const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
      // If we found a match in the cache, return it, but also
      // update the entry in the cache in the background.
      event.waitUntil(cache.add(event.request));
      return cachedResponse;
    }

    // If we didn't find a match in the cache, use the network.
    return fetch(event.request);
  }());
});