import "@/styles/globals.css";
import "@/styles/premium-fixes.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        const register = () => {
          navigator.serviceWorker
            .register("/sw.js")
            .catch((err) => {
              console.warn("PWA ServiceWorker registration failed:", err);
            });
        };
        window.addEventListener("load", register);
        return () => window.removeEventListener("load", register);
      }

      // In development mode, unregister active SW to avoid dev chunk caching conflicts.
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
    }
  }, []);

  return <Component {...pageProps} />;
}
