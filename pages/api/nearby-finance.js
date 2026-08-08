const validCoord = (value, min, max) => Number.isFinite(Number(value)) && Number(value) >= min && Number(value) <= max;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  const radius = Math.min(5000, Math.max(300, Number(req.query.radius) || 1800));
  if (!validCoord(lat, -90, 90) || !validCoord(lon, -180, 180)) return res.status(400).json({ error: 'Invalid coordinates' });

  const query = `[out:json][timeout:12];(nwr(around:${radius},${lat},${lon})[amenity~"^(atm|bank|bureau_de_change|money_transfer)$"];);out center tags;`;
  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'User-Agent': 'Kiwango/1.0' },
      body: new URLSearchParams({ data: query }),
      signal: AbortSignal.timeout(14000),
    });
    if (!response.ok) return res.status(502).json({ error: 'Map provider unavailable' });
    const data = await response.json();
    const items = (data.elements || []).map((item) => ({
      id: `${item.type}-${item.id}`,
      type: item.tags?.amenity || 'financial_service',
      name: item.tags?.name || item.tags?.brand || item.tags?.operator || null,
      lat: item.lat ?? item.center?.lat,
      lon: item.lon ?? item.center?.lon,
      openingHours: item.tags?.opening_hours || null,
      operator: item.tags?.operator || item.tags?.brand || null,
      address: [item.tags?.['addr:street'], item.tags?.['addr:city']].filter(Boolean).join(', ') || null,
    })).filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lon));
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');
    return res.status(200).json({ items, radius, provider: 'OpenStreetMap / Overpass API' });
  } catch {
    return res.status(502).json({ error: 'Unable to query nearby financial services' });
  }
}
