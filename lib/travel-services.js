const SERVICE_TYPES = ['banks', 'exchange'];

const normalizePlaces = (places) => Array.isArray(places)
  ? places.filter((place) => place?.id && place?.name).slice(0, 12)
  : [];

export async function fetchTravelFinancialServices({ destination, lang = 'fr', previous = null, fetcher = fetch }) {
  const attemptedAt = Date.now();
  const requests = SERVICE_TYPES.map(async (type) => {
    const params = new URLSearchParams({ type, destination, lang: lang === 'en' ? 'en' : 'fr' });
    const response = await fetcher(`/api/travel-map?${params.toString()}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || `travel-service-${type}`);
    return { type, places: normalizePlaces(data?.places) };
  });

  const results = await Promise.allSettled(requests);
  const snapshot = {
    provider: 'Google Places',
    banks: normalizePlaces(previous?.banks),
    exchange: normalizePlaces(previous?.exchange),
    fetchedAt: previous?.fetchedAt || null,
    attemptedAt,
    updatedTypes: [],
    preservedTypes: [],
    errors: [],
  };

  results.forEach((result, index) => {
    const type = SERVICE_TYPES[index];
    if (result.status === 'fulfilled') {
      snapshot[type] = result.value.places;
      snapshot.updatedTypes.push(type);
      return;
    }
    if (Array.isArray(previous?.[type])) snapshot.preservedTypes.push(type);
    snapshot.errors.push(type);
  });

  const updatedCount = snapshot.updatedTypes.length;
  snapshot.fetchedAt = updatedCount ? attemptedAt : snapshot.fetchedAt;
  snapshot.syncState = updatedCount === SERVICE_TYPES.length
    ? 'complete'
    : updatedCount > 0
      ? 'partial'
      : previous
        ? 'stale'
        : 'unavailable';

  return snapshot;
}
