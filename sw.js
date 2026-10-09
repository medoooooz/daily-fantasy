/* Service worker: بيخلي التطبيق يتثبّت، وبيحتفظ بنسخة من ملفات الموقع نفسه،
   وبيستقبل تنبيهات الموبايل (Firebase Cloud Messaging) لما التطبيق مقفول. */
try {
  importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
  firebase.initializeApp({
    apiKey: "AIzaSyC0RGeDSrze6LYWg3evAB1HYgLVT0_iPx8",
    authDomain: "daily-fantasy-4e288.firebaseapp.com",
    projectId: "daily-fantasy-4e288",
    storageBucket: "daily-fantasy-4e288.firebasestorage.app",
    messagingSenderId: "856010520496",
    appId: "1:856010520496:web:526a9ee316e7b4b5f24875"
  });
  firebase.messaging();   // بيعرض التنبيهات اللي فيها notification تلقائياً
} catch (e) { /* مفيش نت وقت التثبيت: التطبيق لسه شغال، والتنبيهات هتشتغل بعد ما الـ worker يتحدث */ }

const CACHE = 'daily-fantasy-v2';
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
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return clients.openWindow('./');
  }));
});
