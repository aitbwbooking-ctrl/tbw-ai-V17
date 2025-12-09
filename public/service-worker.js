// Jednostavan cache za PWA
const CACHE_NAME = "tbw-ai-v17";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/tbw-logo.png",
  "/intro.mp4",
  "/hero-zagreb.jpg",
  "/hero-split.jpg",
  "/hero-zadar.jpg",
  "/hero-karlovac.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((oldKey) => caches.delete(oldKey))
      )
    )
  );
  self.clients.claim();
});

// Cache-first za statiku, network-first za ostalo
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  // Statika
  if (
    CORE_ASSETS.some((asset) => request.url.includes(asset)) ||
    request.destination === "image" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
      )
    );
    return;
  }

  // Ostalo: network-first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
