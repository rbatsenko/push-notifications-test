"use client";

import { useEffect, useState } from "react";
import IOSInstallPrompt from "../components/IOSInstallPrompt";

export default function Home() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (typeof window === "undefined") return;

        // Check if service workers are supported
        if (!("serviceWorker" in navigator)) {
          setError("Service Workers are not supported in this browser");
          return;
        }

        // Request notification permission
        const perm = await Notification.requestPermission();
        setPermission(perm);

        // Register Service Worker
        const reg = await navigator.serviceWorker.register("/sw.js");
        setRegistration(reg);
      } catch (err) {
        console.error("Error initializing app:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    initializeApp();
  }, []);

  const showNotification = async () => {
    try {
      if (!registration) {
        throw new Error("Service Worker not registered");
      }

      if (!registration.active) {
        throw new Error("Service Worker not active");
      }

      registration.active.postMessage({
        type: "SHOW_NOTIFICATION",
        message: "Hello! This is a test notification.",
      });
    } catch (err) {
      console.error("Error showing notification:", err);
      setError(
        err instanceof Error ? err.message : "Failed to show notification"
      );
    }
  };

  // Show any errors to help with debugging
  if (error) {
    return (
      <main>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Error
        </h1>
        <p style={{ color: "#ef4444" }}>{error}</p>
      </main>
    );
  }

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
