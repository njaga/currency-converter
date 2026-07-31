import { saveRatesCache, getRatesCache } from './db.js';
import { FIXED_PARITIES } from './currencies.js';

// Baseline offline fallback exchange rates (EUR base)
export const STATIC_BASELINE_RATES_EUR = {
  EUR: 1.0,
  XOF: 655.957,
  XAF: 655.957,
  USD: 1.085,
  GBP: 0.852,
  NGN: 1720.50,
  GHS: 16.80,
  GMD: 73.50,
  SLE: 22.80,
  CVE: 110.265,
  GNF: 9350.0,
  LRD: 210.50,
  MRU: 43.10,
  CDF: 3050.0,
  STN: 24.50,
  KES: 140.20,
  TZS: 2880.0,
  UGX: 4050.0,
  ETB: 132.50,
  RWF: 1460.0,
  BIF: 3120.0,
  MUR: 50.80,
  MGA: 4950.0,
  SCR: 14.80,
  MAD: 10.82,
  DZD: 145.60,
  TND: 3.38,
  EGP: 52.60,
  ZAR: 19.85,
  BWP: 14.65,
  NAD: 19.85,
  MZN: 69.40,
  ZMW: 28.50,
  CAD: 1.48,
  CHF: 0.96,
  JPY: 168.50,
  CNY: 7.82,
  AED: 3.98,
  SAR: 4.07,
};

const FRANKFURTER_API = 'https://api.frankfurter.app/latest';
const FAWAZ_API_PRIMARY = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';
const FAWAZ_API_BACKUP = 'https://latest.currency-api.pages.dev/v1/currencies';
const EXCHANGERATE_API = 'https://v6.exchangerate-api.com/v6/1276659af5bdc69143b11f57/latest';

/**
 * Fetch rates from Frankfurter API (great for EUR, USD, GBP, ZAR, MAD, etc.)
 */
async function fetchFrankfurterRates(fromCode) {
  try {
    const res = await fetch(`${FRANKFURTER_API}?from=${fromCode.toUpperCase()}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.rates) {
      return {
        ...data.rates,
        [fromCode.toUpperCase()]: 1.0,
      };
    }
  } catch (e) {
    console.warn('Frankfurter API fetch failed:', e);
  }
  return null;
}

/**
 * Fetch rates from Fawaz Ahmed Open Source API (150+ currencies including 25+ African)
 */
async function fetchFawazRates(fromCode) {
  const codeLower = fromCode.toLowerCase();
  
  // Try Primary CDN
  try {
    const res = await fetch(`${FAWAZ_API_PRIMARY}/${codeLower}.json`);
    if (res.ok) {
      const data = await res.json();
      if (data && data[codeLower]) {
        const uppercaseRates = {};
        for (const [key, val] of Object.entries(data[codeLower])) {
          uppercaseRates[key.toUpperCase()] = val;
        }
        return uppercaseRates;
      }
    }
  } catch (e) {
    console.warn('Fawaz Primary API failed:', e);
  }

  // Try Backup Cloudflare Pages CDN
  try {
    const res = await fetch(`${FAWAZ_API_BACKUP}/${codeLower}.json`);
    if (res.ok) {
      const data = await res.json();
      if (data && data[codeLower]) {
        const uppercaseRates = {};
        for (const [key, val] of Object.entries(data[codeLower])) {
          uppercaseRates[key.toUpperCase()] = val;
        }
        return uppercaseRates;
      }
    }
  } catch (e) {
    console.warn('Fawaz Backup API failed:', e);
  }

  return null;
}

/**
 * Fetch rates from ExchangeRate-API as fallback
 */
async function fetchExchangeRateApi(fromCode) {
  try {
    const res = await fetch(`${EXCHANGERATE_API}/${fromCode.toUpperCase()}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.result === 'success' && data.conversion_rates) {
      return data.conversion_rates;
    }
  } catch (e) {
    console.warn('ExchangeRate-API failed:', e);
  }
  return null;
}

/**
 * Calculate cross rate between two currencies using a base rate table
 */
export function calculateCrossRate(fromCode, toCode, ratesTable, baseCurrency = 'EUR') {
  const from = fromCode.toUpperCase();
  const to = toCode.toUpperCase();

  if (from === to) return 1.0;

  // Check fixed parity rules first (e.g., EUR/XOF, EUR/XAF, XOF/XAF)
  const pairKey = `${from}_${to}`;
  if (FIXED_PARITIES[pairKey]) {
    return FIXED_PARITIES[pairKey];
  }

  // Direct lookup if base equals 'from'
  if (from === baseCurrency && ratesTable[to]) {
    return ratesTable[to];
  }

  // Inverse lookup if base equals 'to'
  if (to === baseCurrency && ratesTable[from] && ratesTable[from] > 0) {
    return 1 / ratesTable[from];
  }

  // Triangulation: rate(from -> to) = rate(base -> to) / rate(base -> from)
  const fromRate = ratesTable[from];
  const toRate = ratesTable[to];

  if (fromRate && toRate && fromRate > 0) {
    return toRate / fromRate;
  }

  return null;
}

const CACHE_MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12 hours cache window

/**
 * Main service method to get exchange rates with offline fallbacks
 */
export async function getExchangeRates(fromCode = 'EUR', forceRefresh = false) {
  const from = fromCode.toUpperCase();
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  // 1. Check IndexedDB cache first to save network tokens if cache is fresh (<12h)
  if (!forceRefresh) {
    const cachedData = await getRatesCache(from);
    if (cachedData && cachedData.rates && cachedData.updatedAt) {
      const age = Date.now() - cachedData.updatedAt;
      if (age < CACHE_MAX_AGE_MS) {
        return {
          rates: cachedData.rates,
          base: from,
          source: cachedData.source || 'indexeddb_cache',
          isOffline: !isOnline,
          timestamp: cachedData.updatedAt,
        };
      }
    }
  }

  if (isOnline) {
    // 2. Try Fawaz Ahmed API (Best for African currencies - Open Source)
    const fawazRates = await fetchFawazRates(from);
    if (fawazRates && Object.keys(fawazRates).length > 10) {
      await saveRatesCache(from, fawazRates, 'fawaz_api');
      return {
        rates: fawazRates,
        base: from,
        source: 'api_fawaz',
        isOffline: false,
        timestamp: Date.now(),
      };
    }

    // 3. Try Frankfurter API (High reliability for major/ECB currencies)
    const frankfurterRates = await fetchFrankfurterRates(from);
    if (frankfurterRates) {
      const mergedRates = { ...STATIC_BASELINE_RATES_EUR, ...frankfurterRates };
      await saveRatesCache(from, mergedRates, 'frankfurter_api');
      return {
        rates: mergedRates,
        base: from,
        source: 'api_frankfurter',
        isOffline: false,
        timestamp: Date.now(),
      };
    }

    // 4. Try ExchangeRate API
    const exRates = await fetchExchangeRateApi(from);
    if (exRates) {
      await saveRatesCache(from, exRates, 'exchangerate_api');
      return {
        rates: exRates,
        base: from,
        source: 'api_exchangerate',
        isOffline: false,
        timestamp: Date.now(),
      };
    }
  }

  // 5. Offline Fallback: Retrieve from IndexedDB cache even if stale (>12h)
  const cachedData = await getRatesCache(from);
  if (cachedData && cachedData.rates) {
    return {
      rates: cachedData.rates,
      base: from,
      source: 'indexeddb_cache',
      isOffline: true,
      timestamp: cachedData.updatedAt || Date.now(),
    };
  }

  // 5. Ultimate Fallback: Pre-bundled baseline rates snapshot
  const baselineRates = {};
  if (from === 'EUR') {
    Object.assign(baselineRates, STATIC_BASELINE_RATES_EUR);
  } else {
    // Convert baseline to requested base currency
    const eurBaseRate = STATIC_BASELINE_RATES_EUR[from] || 1;
    for (const [code, val] of Object.entries(STATIC_BASELINE_RATES_EUR)) {
      baselineRates[code] = val / eurBaseRate;
    }
  }

  return {
    rates: baselineRates,
    base: from,
    source: 'static_baseline',
    isOffline: true,
    timestamp: Date.now() - 86400000 * 2, // Marked as offline baseline snapshot
  };
}
