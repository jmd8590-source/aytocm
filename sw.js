/**
 * CIVITAS - Progressive Web App Service Worker
 * Cache First for static assets, Network First with IndexedDB/LocalStorage fallback for data
 */

const CACHE_NAME = 'civitas-cache-v1';
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
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Cache addAll non-critical failure', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
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
      }).catch(() => {
        // Offline fallback
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
