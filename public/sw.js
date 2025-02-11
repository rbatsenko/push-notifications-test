/// <reference lib="webworker" />

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clear any old caches if they exist
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key)))),
    ])
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    self.registration.showNotification("Notification Demo", {
      body: event.data.message,
      icon: "/icon-192x192.png",
    });
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open") {
    clients.openWindow("/");
  }
});
