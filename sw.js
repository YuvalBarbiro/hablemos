/* Offline support: precache the whole app; bump VERSION on every change you publish. */
const VERSION = 'hablemos-1.0.0';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/app.css', 'js/app.js',
  'js/data/units1-2.js', 'js/data/units3-4.js', 'js/data/units5-6.js', 'js/data/reference.js',
  'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => req.mode === 'navigate' ? caches.match('index.html') : Response.error()))
  );
});
