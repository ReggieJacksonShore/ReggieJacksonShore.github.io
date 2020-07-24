// ServiceWorker
console.log('Service worker initialized...');

// Install event
// 1. Open a cache.
// 2. Cache our files.
// 3. Confirm whether all the required assets are cached or not.

// importScripts('serviceworker-cache-polyfill.js');

var CACHE_NAME = 'cache-v18';
var urlsToCache = [
  './img/Reggie.jpg',
  './img/Rochester-Institute-of-Technology.png',
  './vendor/fontawesome-free/css/all.min.css',
  './css/freelancer.min.css',
  './vendor/jquery/jquery-3.5.1.min.js',
  './vendor/swiper/swiper-bundle.min.css',
  './vendor/swiper/swiper-bundle.min.js'
];

self.addEventListener('install', function(event) {
  
  console.log('Service worker opened install event initialized...');

  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  
  console.log('Service worker activate event initialized...');

  var cacheKeeplist = CACHE_NAME;
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// Fetching from the cache
// Now that there are assets in the cache, the service worker can use those resources instead of requesting them from the network.

self.addEventListener('fetch', function(event) {
  
  console.log('Service worker fetch event initialized...');

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