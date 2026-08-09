const SOURCE_URL = 'https://api.restcountries.com/countries/v5?limit=100&response_fields=names.common,names.official,codes.alpha_2,codes.alpha_3,currencies,flag.svg,flag.png,region,subregion,capitals';
const LEGACY_PUBLIC_URL = 'https://restcountries.com/v3.1/all?fields=name,cca2,cca3,currencies,flags,region,subregion,capital';

export function normalizeCountry(country) {
  const currencies = Array.isArray(country.currencies)
    ? country.currencies.map((item) => ({
        code: item?.code || item?.iso_code || item?.currency_code,
        name: item?.name || item?.code || item?.iso_code,
        symbol: item?.symbol || item?.code || item?.iso_code,
      })).filter((item) => item.code)
    : Object.entries(country.currencies || {}).map(([code, meta]) => ({
        code,
        name: meta?.name || code,
        symbol: meta?.symbol || code,
      }));

  const code = country.codes?.alpha_2 || country.cca2;
  const code3 = country.codes?.alpha_3 || country.cca3;
  const capital = Array.isArray(country.capitals)
    ? (typeof country.capitals[0] === 'string' ? country.capitals[0] : country.capitals[0]?.name)
    : country.capital?.[0] || null;

  return {
    code,
    code3,
    name: country.names?.common || country.name?.common || code,
    officialName: country.names?.official || country.name?.official || country.names?.common || country.name?.common || code,
    region: country.region || null,
    subregion: country.subregion || null,
    capital,
    flag: code?.toLowerCase() || null,
    flagUrl: country.flag?.svg || country.flag?.png || country.flags?.svg || country.flags?.png || null,
    currencies,
    primaryCurrency: currencies[0] || null,
  };
}

export const normalizeDirectory = (rawCountries) => rawCountries
  .map(normalizeCountry)
  .filter((country) => country.code && country.primaryCurrency)
  .sort((a, b) => a.name.localeCompare(b.name));

async function fetchPage(apiKey, offset = 0) {
  const url = new URL(SOURCE_URL);
  url.searchParams.set('offset', String(offset));
  const response = await fetch(url, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`REST Countries v5 ${response.status}`);
  return response.json();
}

async function fetchAuthenticatedDirectory(apiKey) {
  const first = await fetchPage(apiKey, 0);
  const firstObjects = first?.data?.objects || [];
  const total = Number(first?.data?.meta?.total || firstObjects.length);
  const offsets = [];
  for (let offset = 100; offset < total; offset += 100) offsets.push(offset);
  const remaining = await Promise.all(offsets.map((offset) => fetchPage(apiKey, offset)));
  return normalizeDirectory([first, ...remaining].flatMap((page) => page?.data?.objects || []));
}

async function fetchLegacyPublicDirectory() {
  const response = await fetch(LEGACY_PUBLIC_URL, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`REST Countries legacy ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('REST Countries legacy invalid payload');
  return normalizeDirectory(data);
}

export async function fetchCountryDirectory() {
  const apiKey = process.env.REST_COUNTRIES_API_KEY;
  if (apiKey) {
    try {
      const countries = await fetchAuthenticatedDirectory(apiKey);
      if (countries.length >= 100) return { countries, provider: 'REST Countries v5' };
    } catch (error) {
      console.warn('REST Countries v5 unavailable:', error?.message || error);
    }
  }

  try {
    const countries = await fetchLegacyPublicDirectory();
    if (countries.length >= 100) return { countries, provider: 'REST Countries public fallback' };
  } catch (error) {
    console.warn('REST Countries public fallback unavailable:', error?.message || error);
  }

  return { countries: [], provider: null };
}

export function countrySlug(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '-')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

export function resolveCountry(countries, value) {
  const needle = String(value || '').toLowerCase();
  return countries.find((country) =>
    country.code?.toLowerCase() === needle ||
    country.code3?.toLowerCase() === needle ||
    countrySlug(country.name) === needle ||
    countrySlug(country.officialName) === needle
  ) || null;
}
