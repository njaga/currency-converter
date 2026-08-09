import "@/styles/globals.css";
import "@/styles/premium-fixes.css";
import "@/styles/mobile-release.css";
import { useEffect, useState } from "react";
import AppErrorBoundary from "../components/AppErrorBoundary";
import PrivacyAnalytics from "../components/PrivacyAnalytics";
import { reportClientError } from "../lib/telemetry";

export default function App({ Component, pageProps }) {
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    const onError = (event) => reportClientError(event.error || event.message, 'window_error');
    const onRejection = (event) => reportClientError(event.reason, 'unhandled_rejection');
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return undefined;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
      return undefined;
    }

    let registration;
    let hasReloaded = false;

    const onControllerChange = () => {
      if (hasReloaded) return;
      hasReloaded = true;
      window.location.reload();
    };

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register("/sw.js");
        if (registration.waiting) setWaitingWorker(registration.waiting);
        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingWorker(registration.waiting || installing);
            }
          });
        });
      } catch (err) {
        reportClientError(err, 'service_worker_registration');
      }
    };

    window.addEventListener("load", register);
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    return () => {
      window.removeEventListener("load", register);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const updateApp = () => {
    if (!waitingWorker) return;
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  };

  return (
    <AppErrorBoundary>
      <PrivacyAnalytics />
      <Component {...pageProps} />
      {waitingWorker && (
        <div className="fixed inset-x-3 z-[220] mx-auto max-w-md" style={{ bottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }} role="status" aria-live="polite">
          <div className="flex items-center gap-3 rounded-[22px] border border-slate-200/80 bg-white/95 p-3.5 shadow-[0_22px_65px_rgba(15,23,42,.2)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-950 dark:text-white">Une nouvelle version de Kiwango est prête.</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">La mise à jour recharge l’application sans supprimer vos données locales.</p>
            </div>
            <button type="button" onClick={updateApp} className="flex-none rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
              Mettre à jour
            </button>
          </div>
        </div>
      )}
    </AppErrorBoundary>
  );
}
