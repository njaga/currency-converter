import { fetchCountryDirectory } from '../../lib/countries-server';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { countries, provider } = await fetchCountryDirectory();
  if (Array.isArray(countries) && countries.length >= 100) {
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json({ countries, count: countries.length, provider });
  }

  const apiKey = process.env.REST_COUNTRIES_API_KEY;
  return res.status(503).json({
    error: 'Country directory unavailable',
    code: apiKey ? 'COUNTRY_DIRECTORY_UPSTREAM_ERROR' : 'COUNTRY_DIRECTORY_NOT_CONFIGURED',
    message: apiKey
      ? 'Les fournisseurs du répertoire mondial sont temporairement indisponibles.'
      : 'Le fournisseur public est indisponible. Ajoutez REST_COUNTRIES_API_KEY pour activer le fallback authentifié.',
  });
}
