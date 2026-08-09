const CACHE_KEY = 'kiwango_country_directory_v1';
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000;
let directoryPromise = null;

function readCache() {
  if (typeof window === 'undefined') return null;
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (!cached?.savedAt || !Array.isArray(cached.countries)) return null;
    if (Date.now() - cached.savedAt > CACHE_TTL) return null;
    return cached.countries;
  } catch {
    return null;
  }
}

function writeCache(countries) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), countries }));
  } catch {}
}

export async function getCountryDirectory(fallbackCountries = []) {
  const cached = readCache();
  if (cached?.length) return { countries: cached, source: 'local-cache' };

  if (!directoryPromise) {
    directoryPromise = fetch('/api/countries')
      .then(async (response) => {
        if (!response.ok) throw new Error('country-directory');
        const data = await response.json();
        if (!Array.isArray(data.countries) || !data.countries.length) throw new Error('country-directory-empty');
        writeCache(data.countries);
        return { countries: data.countries, source: data.provider || 'api' };
      })
      .catch(() => ({ countries: fallbackCountries, source: 'fallback' }))
      .finally(() => { directoryPromise = null; });
  }

  return directoryPromise;
}
