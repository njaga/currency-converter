import { saveRatesCache, getRatesCache } from './db.js';
import { FIXED_PARITIES } from './currencies.js';

const FRANKFURTER_API = 'https://api.frankfurter.app/latest';
const FAWAZ_API_PRIMARY = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';
const FAWAZ_API_BACKUP = 'https://latest.currency-api.pages.dev/v1/currencies';

const FRESH_CACHE_MS = 6 * 60 * 60 * 1000;
const STALE_CACHE_MS = 72 * 60 * 60 * 1000;

function normalizeRates(input, base) {
  if (!input || typeof input !== 'object') return null;
  const normalized = { [base.toUpperCase()]: 1 };
  for (const [code, value] of Object.entries(input)) {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) {
      normalized[code.toUpperCase()] = numeric;
    }
  }
  return Object.keys(normalized).length > 1 ? normalized : null;
}

function applyKnownFixedParities(base, rates) {
  const result = { ...rates };
  const upperBase = base.toUpperCase();

  if (upperBase === 'EUR') {
    result.XOF = 655.957;
    result.XAF = 655.957;
  } else if (upperBase === 'XOF') {
    result.EUR = 1 / 655.957;
    result.XAF = 1;
  } else if (upperBase === 'XAF') {
    result.EUR = 1 / 655.957;
    result.XOF = 1;
  }

  return result;
}

async function fetchJson(url, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFawazRates(fromCode) {
  const code = fromCode.toLowerCase();
  for (const baseUrl of [FAWAZ_API_PRIMARY, FAWAZ_API_BACKUP]) {
    const data = await fetchJson(`${baseUrl}/${code}.json`);
    const rates = normalizeRates(data?.[code], fromCode);
    if (rates && Object.keys(rates).length > 10) return rates;
  }
  return null;
}

async function fetchFrankfurterRates(fromCode) {
  const data = await fetchJson(`${FRANKFURTER_API}?from=${encodeURIComponent(fromCode.toUpperCase())}`);
  return normalizeRates(data?.rates, fromCode);
}

async function fetchServerFallback(fromCode) {
  if (typeof window === 'undefined') return null;
  const data = await fetchJson(`/api/rates?base=${encodeURIComponent(fromCode.toUpperCase())}`);
  return normalizeRates(data?.rates, fromCode);
}

function cacheFreshness(timestamp) {
  if (!timestamp) return 'unknown';
  const age = Date.now() - timestamp;
  if (age <= FRESH_CACHE_MS) return 'fresh';
  if (age <= STALE_CACHE_MS) return 'stale';
  return 'very_stale';
}

export function calculateCrossRate(fromCode, toCode, ratesTable, baseCurrency = 'EUR') {
  const from = fromCode.toUpperCase();
  const to = toCode.toUpperCase();

  if (from === to) return 1;
  const fixed = FIXED_PARITIES[`${from}_${to}`];
  if (fixed) return fixed;

  if (!ratesTable || typeof ratesTable !== 'object') return null;
  if (from === baseCurrency && ratesTable[to]) return ratesTable[to];
  if (to === baseCurrency && ratesTable[from] > 0) return 1 / ratesTable[from];

  const fromRate = Number(ratesTable[from]);
  const toRate = Number(ratesTable[to]);
  if (Number.isFinite(fromRate) && Number.isFinite(toRate) && fromRate > 0 && toRate > 0) {
    return toRate / fromRate;
  }
  return null;
}

function fixedParityOnlyRates(base) {
  const upper = base.toUpperCase();
  if (upper === 'EUR') return { EUR: 1, XOF: 655.957, XAF: 655.957 };
  if (upper === 'XOF') return { XOF: 1, XAF: 1, EUR: 1 / 655.957 };
  if (upper === 'XAF') return { XAF: 1, XOF: 1, EUR: 1 / 655.957 };
  return null;
}

export async function getExchangeRates(fromCode = 'EUR', forceRefresh = false) {
  const from = fromCode.toUpperCase();
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const cached = await getRatesCache(from);

  if (!forceRefresh && cached?.rates && cacheFreshness(cached.updatedAt) === 'fresh') {
    return {
      rates: cached.rates,
      base: from,
      source: cached.source || 'indexeddb_cache',
      isOffline: !isOnline,
      timestamp: cached.updatedAt,
      freshness: 'fresh',
    };
  }

  if (isOnline) {
    const providers = [
      ['fawaz', fetchFawazRates],
      ['frankfurter', fetchFrankfurterRates],
      ['server_fallback', fetchServerFallback],
    ];

    for (const [source, provider] of providers) {
      const rawRates = await provider(from);
      if (!rawRates) continue;
      const rates = applyKnownFixedParities(from, rawRates);
      const savedAt = Date.now();
      await saveRatesCache(from, rates, source, savedAt);
      return {
        rates,
        base: from,
        source,
        isOffline: false,
        timestamp: savedAt,
        freshness: 'fresh',
      };
    }
  }

  if (cached?.rates) {
    return {
      rates: cached.rates,
      base: from,
      source: 'indexeddb_cache',
      isOffline: true,
      timestamp: cached.updatedAt || null,
      freshness: cacheFreshness(cached.updatedAt),
    };
  }

  const fixedRates = fixedParityOnlyRates(from);
  if (fixedRates) {
    return {
      rates: fixedRates,
      base: from,
      source: 'fixed_parity',
      isOffline: true,
      timestamp: null,
      freshness: 'fixed',
    };
  }

  return {
    rates: {},
    base: from,
    source: 'unavailable',
    isOffline: true,
    timestamp: null,
    freshness: 'unavailable',
  };
}
