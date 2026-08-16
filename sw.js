const CACHE_NAME = 'fi-patel-solar-v13';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'css/styles.css',
  'js/app.js',
  'js/calculator.js',
  'manifest.json',
  'assets/logo.svg',
  'assets/logo_dark_bg.svg',
  'assets/adani_logo.png',
  'assets/waaree_logo.png',
  'assets/citizen_logo.png',
  'assets/gallery_engineer_install.png',
  'assets/gallery_roof_sun.jpg',
  'assets/gallery_solar_carport.jpg',
  'assets/gallery_solar_farm.jpg',
  'assets/hero_slide_2.png',
  'assets/hero_slide_3.jpg',
  'PRoject completed/ChatGPT Image Aug 15, 2026, 10_47_10 AM.png',
  'PRoject completed/ChatGPT Image Aug 15, 2026, 10_56_16 AM.png',
  'PRoject completed/ChatGPT Image Aug 15, 2026, 10_56_26 AM.png',
  'PRoject completed/project_prantij_himmatnagar.jpg',
  'PRoject completed/project_virpur_himmatnagar.jpg',
  'PRoject completed/project_jadar_himmatnagar.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.log('PWA cache addAll error:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
      }
      return networkResponse;
    }).catch(() => caches.match(event.request))
  );
});
