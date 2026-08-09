const ALLOWED_BASES = new Set([
  'EUR','USD','GBP','XOF','XAF','NGN','GHS','GMD','SLE','CVE','GNF','LRD','MRU',
  'CDF','STN','KES','TZS','UGX','ETB','RWF','BIF','MUR','MGA','SCR','MAD','DZD','TND',
  'EGP','ZAR','BWP','NAD','MZN','ZMW','CAD','CHF','JPY','CNY','AED','SAR',
]);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const base = String(req.query.base || 'EUR').toUpperCase();
  if (!ALLOWED_BASES.has(base)) {
    return res.status(400).json({ error: 'Unsupported base currency' });
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Server fallback provider is not configured' });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${encodeURIComponent(apiKey)}/latest/${encodeURIComponent(base)}`,
      { signal: controller.signal }
    );
    clearTimeout(timer);

    if (!response.ok) {
      return res.status(502).json({ error: 'Exchange-rate provider unavailable' });
    }

    const data = await response.json();
    if (data?.result !== 'success' || !data?.conversion_rates) {
      return res.status(502).json({ error: 'Invalid exchange-rate provider response' });
    }

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    return res.status(200).json({
      base,
      rates: data.conversion_rates,
      providerUpdatedAt: data.time_last_update_unix ? data.time_last_update_unix * 1000 : null,
    });
  } catch {
    return res.status(502).json({ error: 'Exchange-rate provider request failed' });
  }
}
