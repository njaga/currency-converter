const isCode = (value) => /^[A-Z]{3,5}$/.test(String(value || '').toUpperCase());
const iso = (date) => date.toISOString().slice(0, 10);

async function fetchSnapshot(date, base, quote) {
  const b = base.toLowerCase();
  const q = quote.toLowerCase();
  const paths = [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${b}.min.json`,
    `https://${date}.currency-api.pages.dev/v1/currencies/${b}.min.json`,
  ];
  for (const url of paths) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!response.ok) continue;
      const data = await response.json();
      const rate = Number(data?.[b]?.[q]);
      if (Number.isFinite(rate) && rate > 0) return { date: data.date || date, rate };
    } catch {}
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const base = String(req.query.base || 'EUR').toUpperCase();
  const quote = String(req.query.quote || 'XOF').toUpperCase();
  const days = Math.min(90, Math.max(7, Number(req.query.days) || 30));
  if (!isCode(base) || !isCode(quote) || base === quote) return res.status(400).json({ error: 'Invalid currency pair' });

  const sampleCount = days <= 14 ? 7 : days <= 30 ? 10 : 12;
  const step = Math.max(1, Math.floor(days / (sampleCount - 1)));
  const dates = [];
  for (let offset = days; offset >= 0; offset -= step) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - offset);
    dates.push(iso(date));
  }
  const today = iso(new Date());
  if (!dates.includes(today)) dates.push(today);

  const snapshots = await Promise.all(dates.slice(-12).map((date) => fetchSnapshot(date, base, quote)));
  const series = snapshots.filter(Boolean).sort((a, b) => a.date.localeCompare(b.date));
  if (series.length < 2) return res.status(503).json({ error: 'Historical data unavailable for this pair', code: 'HISTORY_UNAVAILABLE', base, quote });

  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
  return res.status(200).json({ base, quote, days, provider: 'fawaz_exchange_api', series });
}
