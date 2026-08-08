import { reportServerIssue } from '../../lib/server-monitoring';

const validCoord = (value, min, max) => Number.isFinite(Number(value)) && Number(value) >= min && Number(value) <= max;

const fieldMask = ['places.id','places.displayName','places.formattedAddress','places.location','places.primaryType','places.types','places.rating','places.userRatingCount','places.googleMapsUri','places.currentOpeningHours.openNow'].join(',');

function normalizeGoogle(place, fallbackType = 'financial_service') {
  return { id: place.id, type: place.primaryType || fallbackType, name: place.displayName?.text || null, address: place.formattedAddress || null, lat: place.location?.latitude, lon: place.location?.longitude, rating: place.rating || null, userRatingCount: place.userRatingCount || null, openNow: place.currentOpeningHours?.openNow ?? null, mapsUrl: place.googleMapsUri || null, provider: 'Google Places' };
}

async function googlePost(path, body, key) {
  const response = await fetch(`https://places.googleapis.com/v1/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': fieldMask }, body: JSON.stringify(body), signal: AbortSignal.timeout(9000) });
  if (!response.ok) throw new Error(`Google Places ${response.status}`);
  return response.json();
}

async function searchGoogle(lat, lon, radius, lang) {
  const key = process.env.GOOGLE_MAPS_API_KEY; if (!key) return null;
  const circle = { center: { latitude: lat, longitude: lon }, radius };
  const [nearby, exchange, transfer] = await Promise.allSettled([
    googlePost('places:searchNearby', { includedTypes: ['atm','bank'], maxResultCount: 20, rankPreference: 'DISTANCE', languageCode: lang === 'en' ? 'en' : 'fr', locationRestriction: { circle } }, key),
    googlePost('places:searchText', { textQuery: lang === 'en' ? 'currency exchange' : 'bureau de change', maxResultCount: 10, languageCode: lang === 'en' ? 'en' : 'fr', locationBias: { circle } }, key),
    googlePost('places:searchText', { textQuery: lang === 'en' ? 'money transfer' : 'transfert d’argent', maxResultCount: 10, languageCode: lang === 'en' ? 'en' : 'fr', locationBias: { circle } }, key),
  ]);
  const merged=[]; const push=(result,fallbackType)=>{ if(result.status!=='fulfilled') return; for(const place of result.value?.places||[]) merged.push(normalizeGoogle(place,fallbackType)); };
  push(nearby,'financial_service'); push(exchange,'currency_exchange'); push(transfer,'money_transfer');
  const unique=Array.from(new Map(merged.filter(i=>i.id).map(i=>[i.id,i])).values());
  return unique.filter(i=>Number.isFinite(i.lat)&&Number.isFinite(i.lon));
}

async function searchOpenStreetMap(lat, lon, radius) {
  const query=`[out:json][timeout:12];(nwr(around:${radius},${lat},${lon})[amenity~"^(atm|bank|bureau_de_change|money_transfer)$"];);out center tags;`;
  const response=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8','User-Agent':'Kiwango/1.0'},body:new URLSearchParams({data:query}),signal:AbortSignal.timeout(14000)});
  if(!response.ok) throw new Error('OSM unavailable');
  const data=await response.json();
  return (data.elements||[]).map(item=>({id:`${item.type}-${item.id}`,type:item.tags?.amenity||'financial_service',name:item.tags?.name||item.tags?.brand||item.tags?.operator||null,lat:item.lat??item.center?.lat,lon:item.lon??item.center?.lon,address:[item.tags?.['addr:street'],item.tags?.['addr:city']].filter(Boolean).join(', ')||null,openingHours:item.tags?.opening_hours||null,operator:item.tags?.operator||item.tags?.brand||null,mapsUrl:null,provider:'OpenStreetMap'})).filter(item=>Number.isFinite(item.lat)&&Number.isFinite(item.lon));
}

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  const lat=Number(req.query.lat),lon=Number(req.query.lon),radius=Math.min(5000,Math.max(300,Number(req.query.radius)||2200)),lang=req.query.lang==='en'?'en':'fr';
  if(!validCoord(lat,-90,90)||!validCoord(lon,-180,180)) return res.status(400).json({error:'Invalid coordinates'});

  try { const googleItems=await searchGoogle(lat,lon,radius,lang); if(googleItems?.length){res.setHeader('Cache-Control','private, max-age=120');return res.status(200).json({items:googleItems,radius,provider:'Google Places'});} }
  catch(error){ await reportServerIssue('google_places_unavailable',{message:error?.message||'unknown',radius}); }

  try { const items=await searchOpenStreetMap(lat,lon,radius);res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=900');return res.status(200).json({items,radius,provider:'OpenStreetMap / Overpass API',fallback:true}); }
  catch(error){ await reportServerIssue('nearby_finance_unavailable',{message:error?.message||'unknown',radius,googleConfigured:Boolean(process.env.GOOGLE_MAPS_API_KEY)});return res.status(502).json({error:'Unable to query nearby financial services'}); }
}
