const SOURCE_URL = 'https://api.restcountries.com/countries/v5?limit=100&response_fields=names.common,names.official,codes.alpha_2,codes.alpha_3,currencies,flag.svg,flag.png,region,subregion,capitals';
const LEGACY_PUBLIC_URL = 'https://restcountries.com/v3.1/all?fields=name,cca2,cca3,currencies,flags,region,subregion,capital';

function normalizeCountry(country) {
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

const normalizeDirectory = (rawCountries) => rawCountries
  .map(normalizeCountry)
  .filter((country) => country.code && country.primaryCurrency)
  .sort((a, b) => a.name.localeCompare(b.name));

async function fetchPage(apiKey, offset = 0) {
  const url = new URL(SOURCE_URL);
  url.searchParams.set('offset', String(offset));

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
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

function sendDirectory(res, countries, provider) {
  if (!Array.isArray(countries) || countries.length < 100) return false;
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
  res.status(200).json({ countries, count: countries.length, provider });
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.REST_COUNTRIES_API_KEY;

  if (apiKey) {
    try {
      const countries = await fetchAuthenticatedDirectory(apiKey);
      if (sendDirectory(res, countries, 'REST Countries v5')) return;
    } catch (error) {
      console.warn('REST Countries v5 unavailable:', error?.message || error);
    }
  }

  try {
    const countries = await fetchLegacyPublicDirectory();
    if (sendDirectory(res, countries, 'REST Countries public fallback')) return;
  } catch (error) {
    console.warn('REST Countries public fallback unavailable:', error?.message || error);
  }

  return res.status(503).json({
    error: 'Country directory unavailable',
    code: apiKey ? 'COUNTRY_DIRECTORY_UPSTREAM_ERROR' : 'COUNTRY_DIRECTORY_NOT_CONFIGURED',
    message: apiKey
      ? 'Les fournisseurs du répertoire mondial sont temporairement indisponibles.'
      : 'Le fournisseur public est indisponible. Ajoutez REST_COUNTRIES_API_KEY pour activer le fallback authentifié.',
  });
}
