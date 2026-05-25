const CACHE = 'jp-dojo-v1';
const ASSETS = [
  '/japonais-dojo/',
  '/japonais-dojo/index.html',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;300;400;600&family=Zen+Kaku+Gothic+New:wght@300;400;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (!resp || resp.status !== 200 || resp.type === 'opaque') return resp;
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return resp;
      }).catch(() => caches.match('/japonais-dojo/'));
    })
  );
});
