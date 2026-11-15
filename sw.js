/* Service worker: guarda la pagina para que funcione incluso sin internet.
   Si cambias el contenido (fotos, fechas, mensajes...), sube el numero de VERSION. */
const VERSION = "v1";
const CACHE = "detalle-" + VERSION;
const ARCHIVOS = [
  "./", "./index.html", "./manifest.json",
  "./icon-192.png", "./icon-512.png",
  "./carta.pdf", "./detalle.pdf", "./cancion.mp3",
  "./fotos/portada.jpg", "./fotos/tiempo.jpg",
  "./fotos/foto1.jpg", "./fotos/foto2.jpg", "./fotos/foto3.jpg", "./fotos/foto4.jpg", "./fotos/foto5.jpg",
  "./fotos/foto6.jpg", "./fotos/foto7.jpg", "./fotos/foto8.jpg", "./fotos/foto9.jpg", "./fotos/foto10.jpg",
  "./fotos/primersalida.jpg", "./fotos/primerconcierto.jpg"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ARCHIVOS.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || e.request.url.includes("video.mp4")) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
    if (resp && resp.ok && new URL(e.request.url).origin === location.origin) {
      const copia = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia));
    }
    return resp;
  }).catch(() => caches.match("./"))));
});