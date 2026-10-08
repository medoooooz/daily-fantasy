/* Service worker بسيط: بيخلي التطبيق يتثبّت، وبيحتفظ بنسخة من ملفات الموقع نفسه فقط.
   بيانات Firebase والـ FPL مبتتخزنش هنا. */
const CACHE = 'daily-fantasy-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); return res; })
      .catch(() => caches.match(r))
  );
});
