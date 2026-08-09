import { reportServerIssue } from '../../lib/server-monitoring';

const clean = (value, max = 160) => String(value || '').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const input = clean(req.query.q);
  const lang = req.query.lang === 'en' ? 'en' : 'fr';
  const sessionToken = clean(req.query.session, 80);
  const key = process.env.GOOGLE_MAPS_API_KEY;

  if (input.length < 2) return res.status(200).json({ items: [], provider: 'Google Maps' });
  if (!key) return res.status(503).json({ error: 'Google Maps is not configured', items: [] });

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat',
      },
      body: JSON.stringify({
        input,
        languageCode: lang,
        includeQueryPredictions: false,
        ...(sessionToken ? { sessionToken } : {}),
      }),
      signal: AbortSignal.timeout(7000),
    });

    if (!response.ok) throw new Error(`Google Places autocomplete ${response.status}`);
    const data = await response.json();
    const items = (data.suggestions || []).map((suggestion) => {
      const prediction = suggestion.placePrediction;
      if (!prediction?.placeId || !prediction?.text?.text) return null;
      const label = prediction.text.text;
      return {
        id: prediction.placeId,
        label,
        mainText: prediction.structuredFormat?.mainText?.text || label,
        secondaryText: prediction.structuredFormat?.secondaryText?.text || '',
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label)}&query_place_id=${encodeURIComponent(prediction.placeId)}`,
      };
    }).filter(Boolean).slice(0, 7);

    res.setHeader('Cache-Control', 'private, max-age=60');
    return res.status(200).json({ items, provider: 'Google Maps' });
  } catch (error) {
    await reportServerIssue('place_autocomplete_unavailable', { message: error?.message || 'unknown' });
    return res.status(502).json({ error: 'Place autocomplete unavailable', items: [] });
  }
}
