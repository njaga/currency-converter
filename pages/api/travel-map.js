import { reportServerIssue } from '../../lib/server-monitoring';

const PLACE_FIELD_MASK = ['places.id','places.displayName','places.formattedAddress','places.location','places.primaryType','places.rating','places.userRatingCount','places.currentOpeningHours.openNow'].join(',');
const clean = (value, max = 160) => String(value || '').trim().slice(0, max);

async function searchPlaces(type, destination, lang, key) {
  const query = type === 'banks'
    ? (lang === 'en' ? `ATMs and banks in ${destination}` : `DAB et banques à ${destination}`)
    : (lang === 'en' ? `currency exchange offices in ${destination}` : `bureaux de change à ${destination}`);
  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': PLACE_FIELD_MASK },
    body: JSON.stringify({ textQuery: query, maxResultCount: 12, languageCode: lang }),
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error(`Google Places ${response.status}`);
  const data = await response.json();
  return (data.places || []).map((place) => ({
    id: place.id,
    name: place.displayName?.text || (lang === 'en' ? 'Financial service' : 'Service financier'),
    address: place.formattedAddress || null,
    type: place.primaryType || type,
    lat: place.location?.latitude ?? null,
    lon: place.location?.longitude ?? null,
    rating: place.rating || null,
    userRatingCount: place.userRatingCount || null,
    openNow: place.currentOpeningHours?.openNow ?? null,
  })).filter((place) => place.id);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const type = clean(req.query.type, 20);
  const destination = clean(req.query.destination);
  const lang = req.query.lang === 'en' ? 'en' : 'fr';
  if (!['banks','exchange'].includes(type) || !destination) return res.status(400).json({ error: 'Invalid travel map request' });
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return res.status(503).json({ error: 'Google Maps is not configured' });

  try {
    res.setHeader('Cache-Control', 'private, max-age=120');
    return res.status(200).json({ type, provider: 'Google Places', places: await searchPlaces(type, destination, lang, key) });
  } catch (error) {
    await reportServerIssue('travel_map_unavailable', { type, destination, message: error?.message || 'unknown' });
    return res.status(502).json({ error: 'Unable to query Google Maps' });
  }
}
