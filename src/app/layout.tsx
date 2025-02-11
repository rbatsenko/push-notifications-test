import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local Notifications Demo",
  description: "Testing local notifications",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Notifications Demo",
  },
  icons: {
    apple: "/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
