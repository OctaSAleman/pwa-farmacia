const CACHE_NAME = 'farmacia-pwa-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/styles.css',
    './js/app.js',
    './public/manifest.json'
];

// Evento Install: Guardado inicial en caché
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Evento Activate: Limpieza de cachés antiguas
self.addEventListener('activate', (e) => {
    e.waitUntil(
        return Promise.all( keys.map((key) => {
            if (key !== CACHE_NAME) return caches.delete(key);
        }));
    );
});

// Evento Fetch: Estrategia Network Firste con Fallback a Cache
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).then((networkResponse) => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
        })
        .catch(() => caches.match(e.request))
    );
});