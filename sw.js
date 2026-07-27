/* ZIRH — salonda çekim olmasa da açılsın diye basit bir önbellek. */
const CACHE = "zirh-v4";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
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

self.addEventListener("fetch", ev => {
  const req = ev.request;
  if(req.method !== "GET") return;

  const url = new URL(req.url);

  // Sayfanın kendisi: önce ağ, olmazsa önbellek. Güncelleme kaçmasın.
  if(req.mode === "navigate"){
    ev.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html").then(r => r || caches.match("./")))
    );
    return;
  }

  // YouTube gömüsü önbelleğe girmesin.
  if(url.hostname.indexOf("youtube") > -1) return;

  // Diğerleri: önce önbellek, sonra ağ; başarılıysa sakla.
  ev.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if(res && res.status === 200 && (url.origin === location.origin || url.hostname.indexOf("gstatic") > -1 || url.hostname.indexOf("googleapis") > -1)){
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => hit || new Response("", {status:504, statusText:"Çevrimdışı"})))
  );
});
