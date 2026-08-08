const clean = (value, max = 180) => String(value ?? '').replace(/[\r\n\t]/g, ' ').trim().slice(0, max);

export async function reportServerIssue(event, details = {}) {
  const payload = {
    event: clean(event, 48),
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
    details: Object.fromEntries(
      Object.entries(details)
        .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
        .slice(0, 10)
        .map(([key, value]) => [clean(key, 32), typeof value === 'string' ? clean(value) : value])
    ),
  };

  if (!payload.event) return;

  const endpoint = process.env.MONITORING_WEBHOOK_URL;
  if (!endpoint) {
    console.error('[Kiwango monitoring]', payload);
    return;
  }

  try {
    const parsed = new URL(endpoint);
    if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Unsupported monitoring protocol');
    await fetch(parsed.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.MONITORING_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.MONITORING_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3500),
    });
  } catch (error) {
    console.error('[Kiwango monitoring delivery failed]', clean(error?.message || error));
  }
}
