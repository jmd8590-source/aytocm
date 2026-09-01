/**
 * CIVITAS - Progressive Web App Service Worker
 * Cache First for static assets, Network First with IndexedDB/LocalStorage fallback for data
 */

const CACHE_NAME = 'civitas-cache-v5-status-ctrl';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/variables.css',
  './css/base.css',
  './css/components.css',
  './css/layout.css',
  './css/views.css',
  './js/app.js',
  './js/utils/icons.js',
  './js/utils/helpers.js',
  './js/utils/security.js',
  './js/utils/i18n.js',
  './js/state/store.js',
  './js/state/mockData.js',
  './js/services/authService.js',
  './js/services/incidentService.js',
  './js/services/suggestionService.js',
  './js/services/notificationService.js',
  './js/services/auditService.js',
  './js/components/mapComponent.js',
  './js/components/reportWizard.js',
  './js/components/adminDashboard.js',
  './js/components/suggestionBoard.js',
  './js/components/auditViewer.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Cache addAll non-critical failure', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('🧹 Eliminando caché antigua:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Pass through non-GET and chrome extensions
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
