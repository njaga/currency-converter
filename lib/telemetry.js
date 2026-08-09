const safeText = (value, max = 80) => String(value ?? '').replace(/[\r\n\t]/g, ' ').trim().slice(0, max);

export function trackEvent(name, data = {}) {
  if (typeof window === 'undefined') return;
  if (navigator.doNotTrack === '1') return;

  const eventName = safeText(name, 48);
  if (!eventName) return;

  const payload = Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
      .slice(0, 8)
      .map(([key, value]) => [safeText(key, 32), typeof value === 'string' ? safeText(value, 80) : value])
  );

  try {
    if (window.umami?.track) window.umami.track(eventName, payload);
  } catch {}
}

export function reportClientError(error, context = 'client') {
  if (typeof window === 'undefined') return;
  const body = JSON.stringify({
    event: 'client_error',
    context: safeText(context, 48),
    message: safeText(error?.message || error || 'Unknown client error', 180),
    path: window.location.pathname.slice(0, 120),
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/telemetry', new Blob([body], { type: 'application/json' }));
      return;
    }
    fetch('/api/telemetry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => undefined);
  } catch {}
}
