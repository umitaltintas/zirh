/* ZIRH — salonda çekim olmasa da açılsın diye basit bir önbellek. */
const CACHE = "zirh-v8";

const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",

  "./css/base.css",
  "./css/shell.css",
  "./css/screens.css",

  "./src/main.js",
  "./src/dom.js",
  "./src/store.js",
  "./src/data/exercises.js",
  "./src/data/programs.js",
  "./src/data/videos.js",
  "./src/data/warmup.js",
  "./src/data/meals.js",
  "./src/data/nutrition.js",
  "./src/ui/router.js",
  "./src/ui/sheet.js",
  "./src/ui/timer.js",
  "./src/screens/workout.js",
  "./src/screens/history.js",
  "./src/screens/profile.js",
  "./src/screens/meals.js"
];

self.addEventListener("install", ev => {
  ev.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", ev => {
  ev.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Ağdan al, kopyasını sakla; ağ yoksa önbellekten ver. */
function networkFirst(req, key){
  return fetch(req)
    .then(res => {
      if(res && res.status === 200){
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(key || req, copy));
      }
      return res;
    })
    .catch(() => caches.match(key || req).then(hit => hit || caches.match("./")));
}

self.addEventListener("fetch", ev => {
  const req = ev.request;
  if(req.method !== "GET") return;

  const url = new URL(req.url);

  /* Sayfanın kendisi: önce ağ. Güncelleme kaçmasın. */
  if(req.mode === "navigate"){
    ev.respondWith(networkFirst(req, "./index.html"));
    return;
  }

  /* YouTube gömüsü önbelleğe girmesin. */
  if(url.hostname.indexOf("youtube") > -1) return;

  /* Kendi modüllerimiz ve stillerimiz de önce ağdan.
     Önbellek öncelikli olsalardı yeni index.html ile eski modüller
     eşleşip uygulamayı yarı güncel bir hâlde bırakabilirdi. */
  if(url.origin === location.origin && /\.(js|css)$/.test(url.pathname)){
    ev.respondWith(networkFirst(req));
    return;
  }

  /* Diğerleri (ikonlar, yazı tipleri): önce önbellek. */
  ev.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if(res && res.status === 200 &&
         (url.origin === location.origin ||
          url.hostname.indexOf("gstatic") > -1 ||
          url.hostname.indexOf("googleapis") > -1)){
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => hit || new Response("", {status: 504, statusText: "Çevrimdışı"})))
  );
});
