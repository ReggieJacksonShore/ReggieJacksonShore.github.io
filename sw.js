// ServiceWorker
console.log('Service worker setup...');

// Install event
// 1. Open a cache.
// 2. Cache our files.
// 3. Confirm whether all the required assets are cached or not.

importScripts('serviceworker-cache-polyfill.js');

var CACHE_NAME = 'site-cache';
var urlsToCache = [
  './vendor/jquery/jquery.min.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service worker opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


// Fetching from the cache
// Now that there are assets in the cache, the service worker can use those resources instead of requesting them from the network.

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      return response || fetchAndCache(event.request);
    })
  );
});

function fetchAndCache(url) {
  return fetch(url)
  .then(function(response) {
    // Check if we received a valid response
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('idk');
      cache.put(url, response.clone());
      return response;
    });
  })
  .catch(function(error) {
    console.log('Request failed: ', error);
    // You could return a custom offline 404 page here
  });
}