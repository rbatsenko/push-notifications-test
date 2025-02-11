"use client";

import { useEffect, useState } from "react";
import IOSInstallPrompt from "../components/IOSInstallPrompt";

const isIOS = () =>
  typeof window !== "undefined" &&
  /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

const isPWA = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(display-mode: standalone)").matches;

export default function Home() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [error, setError] = useState<string>("");
  const [isSupported, setIsSupported] = useState(false);
  const [swState, setSwState] = useState<string>("unknown");

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (typeof window === "undefined") return;

        // For iOS, only enable notifications in PWA mode
        if (isIOS() && !isPWA()) {
          setError("Please install this app to enable notifications");
          setIsSupported(false);
          return;
        }

        // Check if notifications are supported
        if (!("Notification" in window)) {
          setError("Notifications are not supported in this browser");
          setIsSupported(false);
          return;
        }
        setIsSupported(true);

        // Check if service workers are supported
        if (!("serviceWorker" in navigator)) {
          setError("Service Workers are not supported in this browser");
          return;
        }

        // Get current permission status
        if ("Notification" in window) {
          setPermission(Notification.permission);
        }

        // Register Service Worker and ensure it's active
        const reg = await navigator.serviceWorker.register("/sw.js");
        setSwState(reg.active ? "active" : "waiting");

        if (!reg.active) {
          // Wait for the service worker to activate
          await new Promise((resolve) => {
            reg.addEventListener(
              "activate",
              () => {
                setSwState("active");
                resolve(true);
              },
              {
                once: true,
              }
            );
          });
        }
        setRegistration(reg);
      } catch (err) {
        console.error("Error initializing app:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    initializeApp();
  }, []);

  const requestPermission = async () => {
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
    } catch (err) {
      console.error("Error requesting permission:", err);
      setError(
        err instanceof Error ? err.message : "Failed to request permission"
      );
    }
  };

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
          {isIOS() && !isPWA() ? "Install Required" : "Error"}
        </h1>
        <p style={{ color: "#ef4444" }}>{error}</p>
        {isIOS() && !isPWA() && (
          <p style={{ marginTop: "1rem" }}>
            To enable notifications on iOS, please install this app to your home
            screen first. Look for the &quot;Add to Home Screen&quot; option in
            your browser&apos;s menu.
          </p>
        )}
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
        {!isSupported ? (
          <p className="error-text">
            Push notifications are not supported in this browser. Please use a
            different browser or platform to test this feature.
          </p>
        ) : (
          <>
            <p>Notification Permission: {permission}</p>
            <p>Service Worker State: {swState}</p>

            {permission === "default" && (
              <button onClick={requestPermission}>
                Request Notification Permission
              </button>
            )}

            {permission === "granted" && (
              <button
                onClick={showNotification}
                disabled={!registration?.active}
                style={{
                  opacity: registration?.active ? 1 : 0.5,
                }}
              >
                Show Local Notification
                {!registration?.active && " (Waiting for Service Worker)"}
              </button>
            )}

            {permission === "denied" && (
              <p className="error-text">
                Notifications are blocked. Please enable them in your browser
                settings.
              </p>
            )}
          </>
        )}
      </div>

      <IOSInstallPrompt />
    </main>
  );
}
