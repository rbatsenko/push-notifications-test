"use client";

import { useEffect, useState } from "react";
import IOSInstallPrompt from "../components/IOSInstallPrompt";

export default function Home() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Request notification permission
      Notification.requestPermission().then((perm) => {
        setPermission(perm);
      });

      // Register Service Worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setRegistration(reg);
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }
  }, []);

  const showNotification = () => {
    if (!registration) {
      console.error("Service Worker not registered");
      return;
    }

    registration.active?.postMessage({
      type: "SHOW_NOTIFICATION",
      message: "Hello! This is a test notification.",
    });
  };

  return (
    <main>
      <h1
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Local Notifications Demo
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p>Notification Permission: {permission}</p>

        <button
          onClick={showNotification}
          disabled={!registration || permission !== "granted"}
        >
          Show Local Notification
        </button>

        {permission !== "granted" && (
          <p className="error-text">
            Please allow notifications permission to test this feature
          </p>
        )}
      </div>

      <IOSInstallPrompt />
    </main>
  );
}
