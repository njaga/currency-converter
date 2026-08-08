const SOURCE_URL = 'https://restcountries.com/v3.1/all?fields=name,cca2,cca3,currencies,flags,region,subregion,capital';

function normalizeCountry(country) {
  const currencies = Object.entries(country.currencies || {}).map(([code, meta]) => ({
    code,
    name: meta?.name || code,
    symbol: meta?.symbol || code,
  }));

  return {
    code: country.cca2,
    code3: country.cca3,
    name: country.name?.common || country.cca2,
    officialName: country.name?.official || country.name?.common || country.cca2,
    region: country.region || null,
    subregion: country.subregion || null,
    capital: country.capital?.[0] || null,
    flag: country.cca2?.toLowerCase() || null,
    flagUrl: country.flags?.svg || country.flags?.png || null,
    currencies,
    primaryCurrency: currencies[0] || null,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const response = await fetch(SOURCE_URL, {
      headers: { Accept: 'application/json', 'User-Agent': 'Kiwango/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return res.status(502).json({ error: 'Country directory unavailable' });

    const data = await response.json();
    const countries = (Array.isArray(data) ? data : [])
      .map(normalizeCountry)
      .filter((country) => country.code && country.primaryCurrency)
      .sort((a, b) => a.name.localeCompare(b.name));

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json({ countries, count: countries.length, provider: 'REST Countries' });
  } catch {
    return res.status(502).json({ error: 'Unable to load the global country directory' });
  }
}
