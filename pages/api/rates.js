import { reportServerIssue } from '../../lib/server-monitoring';

const ALLOWED_BASES = new Set([
  'EUR','USD','GBP','XOF','XAF','NGN','GHS','GMD','SLE','CVE','GNF','LRD','MRU',
  'CDF','STN','KES','TZS','UGX','ETB','RWF','BIF','MUR','MGA','SCR','MAD','DZD','TND',
  'EGP','ZAR','BWP','NAD','MZN','ZMW','CAD','CHF','JPY','CNY','AED','SAR',
]);

const timeoutFetch = async (url, options = {}, timeoutMs = 6500) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try { return await fetch(url, { ...options, signal: controller.signal }); }
  finally { clearTimeout(timer); }
};

async function exchangeRateApi(base, apiKey) {
  if (!apiKey) return null;
  try {
    const response = await timeoutFetch(`https://v6.exchangerate-api.com/v6/${encodeURIComponent(apiKey)}/latest/${encodeURIComponent(base)}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data?.result !== 'success' || !data?.conversion_rates) return null;
    return { provider: 'ExchangeRate-API', rates: data.conversion_rates, providerUpdatedAt: data.time_last_update_unix ? data.time_last_update_unix * 1000 : null };
  } catch { return null; }
}

async function currencyApi(base, apiKey) {
  if (!apiKey) return null;
  try {
    const url = new URL('https://api.currencyapi.com/v3/latest');
    url.searchParams.set('base_currency', base); url.searchParams.set('type', 'fiat');
    const response = await timeoutFetch(url.toString(), { headers: { Accept: 'application/json', apikey: apiKey } });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data?.data || typeof data.data !== 'object') return null;
    const rates = Object.fromEntries(Object.entries(data.data).map(([code, item]) => [String(code).toUpperCase(), Number(item?.value)]).filter(([, value]) => Number.isFinite(value) && value > 0));
    if (Object.keys(rates).length < 2) return null;
    rates[base] = 1;
    return { provider: 'CurrencyAPI', rates, providerUpdatedAt: data.meta?.last_updated_at ? Date.parse(data.meta.last_updated_at) : null };
  } catch { return null; }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed' }); }
  const base = String(req.query.base || 'EUR').toUpperCase();
  if (!ALLOWED_BASES.has(base)) return res.status(400).json({ error: 'Unsupported base currency' });

  const configured = { exchangeRateApi: Boolean(process.env.EXCHANGE_RATE_API_KEY), currencyApi: Boolean(process.env.CURRENCY_API_KEY) };
  if (!configured.exchangeRateApi && !configured.currencyApi) return res.status(503).json({ error: 'No server fallback rate provider is configured' });

  const providers = [() => exchangeRateApi(base, process.env.EXCHANGE_RATE_API_KEY), () => currencyApi(base, process.env.CURRENCY_API_KEY)];
  for (const provider of providers) {
    const result = await provider();
    if (!result) continue;
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    return res.status(200).json({ base, rates: result.rates, provider: result.provider, providerUpdatedAt: result.providerUpdatedAt || null });
  }

  await reportServerIssue('rate_providers_unavailable', { base, exchangeRateApi: configured.exchangeRateApi, currencyApi: configured.currencyApi });
  return res.status(502).json({ error: 'All configured exchange-rate fallback providers are unavailable' });
}
