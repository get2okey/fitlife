const CACHE_NAME = "fitlife-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/workouts.html",
  "/exercise.html",
  "/css/style.css",
  "/js/main.js",
  "/js/workouts.js",
  "/js/workouts-data.js",
  "/js/exercise.js"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch Cached Files
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// === Notification Event ===
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://get2okey.github.io/fitlife/workouts.html")
  );
});
