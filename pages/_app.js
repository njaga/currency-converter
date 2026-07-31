import "@/styles/globals.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => {
              console.log("AfriChange PWA ServiceWorker registered with scope:", reg.scope);
            })
            .catch((err) => {
              console.warn("AfriChange PWA ServiceWorker registration failed:", err);
            });
        });
      } else {
        // In development mode, unregister active SW to avoid dev chunk caching conflicts
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (let reg of registrations) {
            reg.unregister();
          }
        });
      }
    }
  }, []);

  return <Component {...pageProps} />;
}
