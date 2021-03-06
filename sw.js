// ServiceWorker
console.log('Service worker initialized...');

// Install event
// 1. Open a cache.
// 2. Cache our files.
// 3. Confirm whether all the required assets are cached or not.

// importScripts('serviceworker-cache-polyfill.js');

// try { document.getElementById('cache').innerHTML = cacheName; } catch(err) { }

const cacheName = '2.1.0';
const urlsToCache = [
  '/',
  'index.html',
  'img/Reggie.jpg',
  'img/Rochester-Institute-of-Technology.png',
  'vendor/fontawesome-free/css/all.min.css',
  'css/freelancer.min.css',
  'js/freelancer.min.js', 
  'vendor/bootstrap/js/bootstrap.bundle.min.js',
  'vendor/jquery/jquery-3.5.1.min.js',
  'vendor/jquery/jquery.easing.min.js',
  'vendor/swiper/swiper-bundle.min.css',
  'vendor/swiper/swiper-bundle.min.js'
];

self.addEventListener('install', function(event) {

  console.log('Service worker opened install event initialized...');

  // Perform install steps
  // event.waitUntil - waits for the last promise in the series to complete before returning control to the event handler.
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  
  console.log('Service worker activate event initialized...');

  var cacheKeeplist = cacheName;
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
    return caches.open(cacheName)
    .then(function(cache) {
      console.log('fetchAndCache succeeded.');
      cache.put(url, response.clone());
      return response;
    });
  })
  .catch(function(error) {
    // You could return a custom offline 404 page here
    console.log('fetchAndCache failed: ', error);
  });
}