import { useEffect, useState } from "react";

interface SafariNavigator extends Navigator {
  standalone?: boolean;
}

export default function IOSInstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the device is iOS
    const ios = /iphone|ipad|ipod/.test(
      window.navigator.userAgent.toLowerCase()
    );

    // Check if the app is already installed (running in standalone mode)
    const nav = window.navigator as SafariNavigator;
    const standalone = nav.standalone === true;

    setIsIOS(ios);
    setIsStandalone(standalone);
  }, []);

  if (!isIOS || isStandalone) {
    return null;
  }

  return (
    <div className="install-prompt">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={{ fontWeight: "500" }}>Install this app on your iPhone</p>
          <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
            Tap the share button then "Add to Home Screen"
          </p>
        </div>
        <button
          onClick={() => {
            const prompt = document.querySelector(".install-prompt");
            if (prompt) {
              prompt.remove();
            }
          }}
          style={{ background: "transparent", color: "#6b7280" }}
        >
          <span style={{ display: "none" }}>Close</span>✕
        </button>
      </div>
    </div>
  );
}
