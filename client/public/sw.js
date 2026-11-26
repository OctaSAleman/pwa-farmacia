// Service Worker de la PWA Farmacia
// Se registra desde src/registerSW.js (solo en producción)

const CACHE_NAME = 'farmacia-pwa-v1';

// Archivos base que se guardan al instalar
const ARCHIVOS_BASE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// 1. Install: guardado inicial en caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_BASE))
  );
  self.skipWaiting();
});

// 2. Activate: limpieza de cachés antiguas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 3. Fetch
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Solo GET del mismo sitio. La API (/api/) y el login nunca se guardan en caché.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // Páginas (navegación): primero la red; sin red, la app guardada o offline.html
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(async () => {
        const app = await caches.match('/index.html');
        return app || caches.match('/offline.html');
      })
    );
    return;
  }

  // Archivos estáticos (JS, CSS, imágenes): primero caché, si no, red y se guarda
  e.respondWith(
    caches.match(request).then(
      (guardado) =>
        guardado ||
        fetch(request).then((respuesta) => {
          if (respuesta.ok) {
            const copia = respuesta.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
          }
          return respuesta;
        })
    )
  );
});

// 4. Push: notificaciones del sistema
self.addEventListener('push', (e) => {
  const texto = e.data ? e.data.text() : 'Notificación del sistema de farmacia';
  e.waitUntil(
    self.registration.showNotification('Farmacia PWA', {
      body: texto,
      icon: '/icons/icon-192.png',
    })
  );
});
