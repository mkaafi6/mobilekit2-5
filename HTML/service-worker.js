///////////////////////////////////////////////////////////////////////////////
// MobileKit 2.5 Service Worker
//
// Design goals:
//  - Install must NEVER fail because of an external/CDN hiccup. Only LOCAL
//    files are precached; remote resources (icons/fonts) are cached at runtime.
//  - All paths are RELATIVE so this works both at the domain root (local dev,
//    e.g. http://localhost:5500/) and under a subpath (GitHub Pages project
//    site, e.g. https://<user>.github.io/mobilekit2-5/).
//  - Bump CACHE_VERSION on every release to invalidate old caches.
///////////////////////////////////////////////////////////////////////////////

var CACHE_VERSION = 'mobilekit-2.5.0';
var PRECACHE = CACHE_VERSION + '-precache';
var RUNTIME = CACHE_VERSION + '-runtime';

// Local files required to make the app work offline.
// Relative paths resolve against the service worker's own URL.
var PRECACHE_URLS = [
    './',
    './index.html',
    './__manifest.json',
    './assets/css/style.css',
    './assets/css/inc/bootstrap/bootstrap.min.css',
    './assets/css/inc/owl-carousel/owl.carousel.min.css',
    './assets/css/inc/owl-carousel/owl.theme.default.css',
    './assets/js/lib/jquery-3.4.1.min.js',
    './assets/js/lib/popper.min.js',
    './assets/js/lib/bootstrap.min.js',
    './assets/js/plugins/owl-carousel/owl.carousel.min.js',
    './assets/js/plugins/jquery-circle-progress/circle-progress.min.js',
    './assets/js/plugins/jquery-countdown/jquery.countdown.min.js',
    './assets/js/base.js'
];

// Install: precache local app shell only. Any failure here is fatal on purpose
// (the shell is local, so it should always succeed), but we never include
// remote URLs that could be blocked or offline.
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(PRECACHE)
            .then(function (cache) {
                return cache.addAll(PRECACHE_URLS);
            })
            .then(function () {
                return self.skipWaiting();
            })
    );
});

// Activate: drop caches from older versions, then take control of open pages.
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function ( keys ) {
            return Promise.all(
                keys.filter(function (key) {
                    return key !== PRECACHE && key !== RUNTIME;
                }).map(function (key) {
                    return caches.delete(key);
                })
            );
        }).then(function () {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function (event) {
    var request = event.request;

    // Only handle GET requests.
    if (request.method !== 'GET') {
        return;
    }

    // Pages / navigation: network-first, fall back to cache, then app shell.
    // This keeps content fresh while still working offline.
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(function (response) {
                    var copy = response.clone();
                    caches.open(RUNTIME).then(function (cache) {
                        cache.put(request, copy);
                    });
                    return response;
                })
                .catch(function () {
                    return caches.match(request).then(function (cached) {
                        return cached || caches.match('./index.html');
                    });
                })
        );
        return;
    }

    // Static assets (incl. cross-origin CDN icons/fonts): cache-first,
    // then network and populate the runtime cache.
    event.respondWith(
        caches.match(request).then(function (cached) {
            if (cached) {
                return cached;
            }
            return fetch(request).then(function (response) {
                // Cache successful same-origin/cors responses (res.ok) and
                // opaque cross-origin responses (res.type === 'opaque').
                if (response && (response.ok || response.type === 'opaque')) {
                    var copy = response.clone();
                    caches.open(RUNTIME).then(function (cache) {
                        cache.put(request, copy);
                    });
                }
                return response;
            }).catch(function () {
                return cached;
            });
        })
    );
});
