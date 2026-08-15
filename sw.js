const CACHE_NAME = 'fi-patel-solar-v2';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'css/styles.css',
  'js/app.js',
  'js/calculator.js',
  'favicon.svg',
  'manifest.json',
  'assets/logo.svg',
  'assets/logo_dark_bg.svg',
  'assets/adani_solar.svg',
  'assets/waaree_solar.svg',
  'assets/citizen_solar.svg',
  'assets/hero_slide_1.jpg',
  'assets/hero_slide_2.png',
  'assets/hero_slide_3.jpg',
  'assets/hero_slide_4.png',
  'PRoject completed/ChatGPT Image Aug 15, 2026, 10_47_10 AM.png',
  'PRoject completed/ChatGPT Image Aug 15, 2026, 10_56_16 AM.png',
  'PRoject completed/ChatGPT Image Aug 15, 2026, 10_56_22 AM.png',
  'PRoject completed/ChatGPT Image Aug 15, 2026, 10_56_26 AM.png',
  'PRoject completed/ChatGPT Image Aug 15, 2026, 10_58_24 AM.png',
  'PRoject completed/ChatGPT Image Aug 15, 2026, 11_02_14 AM.png'
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

  // Stale-while-revalidate / Network-first strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
