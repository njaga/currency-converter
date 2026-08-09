import { useEffect, useState } from 'react';
import { Banknote, Landmark, Loader2, MapPin, RefreshCw, Route } from 'lucide-react';

const TOOLS = [
  { id: 'route', icon: Route, fr: 'Itinéraire', en: 'Directions' },
  { id: 'banks', icon: Landmark, fr: 'DAB & banques', en: 'ATMs & banks' },
  { id: 'exchange', icon: Banknote, fr: 'Bureaux de change', en: 'Exchange offices' },
];

export default function DestinationMapTools({ origin = '', destination, lang = 'fr' }) {
  const fr = lang === 'fr';
  const [active, setActive] = useState('route');
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = async (type = active) => {
    if (!destination || (type === 'route' && !origin.trim())) {
      setData(null);
      setStatus('error');
      setError(fr ? 'Renseignez d’abord votre ville ou pays de départ.' : 'Enter your departure city or country first.');
      return;
    }
    setActive(type);
    setStatus('loading');
    setError('');
    try {
      const params = new URLSearchParams({ type, destination, lang });
      if (origin.trim()) params.set('origin', origin.trim());
      const response = await fetch(`/api/travel-map?${params.toString()}`);
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Unavailable');
      setData(json);
      setStatus('ready');
    } catch {
      setData(null);
      setStatus('error');
      setError(fr ? 'Google Maps ne peut pas charger ces informations pour le moment.' : 'Google Maps cannot load this information right now.');
    }
  };

  useEffect(() => { setData(null); setError(''); setStatus('idle'); }, [origin, destination]);

  return <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/10">
    <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{fr ? `Explorer ${destination} sans quitter Kiwango` : `Explore ${destination} without leaving Kiwango`}</p>
    <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">{fr ? 'Calculez le trajet et repérez les services financiers directement ici. Les résultats proviennent de Google Maps et ne sont pas affiliés.' : 'Calculate your route and find financial services right here. Results come from Google Maps and are not affiliated.'}</p>

    <div className="mt-4 grid gap-2 sm:grid-cols-3">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        const selected = active === tool.id;
        return <button key={tool.id} type="button" onClick={() => load(tool.id)} aria-pressed={selected} className={`flex items-center gap-2 border px-3 py-3 text-left text-xs font-semibold transition ${selected ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100' : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-white/10 dark:hover:bg-emerald-950/20'}`}><Icon className="h-4 w-4 flex-none text-emerald-700" />{fr ? tool.fr : tool.en}{status === 'loading' && selected && <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin" />}</button>;
      })}
    </div>

    {status === 'idle' && <button type="button" onClick={() => load(active)} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">{fr ? 'Afficher les informations' : 'Show information'}<MapPin className="h-3.5 w-3.5" /></button>}
    {error && <div className="mt-4 flex items-start justify-between gap-4 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100"><span>{error}</span><button type="button" onClick={() => load(active)} className="inline-flex flex-none items-center gap-1.5 font-semibold"><RefreshCw className="h-3.5 w-3.5" />{fr ? 'Réessayer' : 'Retry'}</button></div>}

    {status === 'ready' && data?.route && <div className="mt-4 border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[.025]">
      <div className="grid gap-3 sm:grid-cols-3"><Metric label={fr ? 'Distance' : 'Distance'} value={data.route.distance} /><Metric label={fr ? 'Durée estimée' : 'Estimated time'} value={data.route.duration} /><Metric label={fr ? 'Trajet' : 'Route'} value={data.route.summary || `${origin} → ${destination}`} /></div>
      <div className="mt-4 divide-y divide-slate-200 dark:divide-white/10">{data.route.steps?.slice(0, 8).map((step, index) => <div key={`${step.instruction}-${index}`} className="grid grid-cols-[26px_1fr_auto] gap-2 py-3 text-xs"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-800">{index + 1}</span><span className="leading-5 text-slate-700 dark:text-slate-200">{step.instruction}</span><span className="text-slate-400">{step.distance}</span></div>)}</div>
    </div>}

    {status === 'ready' && Array.isArray(data?.places) && <div className="mt-4 grid gap-2 sm:grid-cols-2">{data.places.map((place) => <article key={place.id} className="flex min-w-0 items-start gap-3 border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[.025]"><span className="flex h-9 w-9 flex-none items-center justify-center bg-emerald-100 text-emerald-800"><MapPin className="h-4 w-4" /></span><div className="min-w-0"><h4 className="truncate text-sm font-semibold">{place.name}</h4><p className="mt-1 text-xs leading-5 text-slate-500">{place.address || destination}</p><div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[.08em] text-slate-400">{place.rating && <span>{place.rating}/5</span>}{place.openNow !== null && <span className={place.openNow ? 'text-emerald-700' : 'text-rose-600'}>{place.openNow ? (fr ? 'Ouvert' : 'Open') : (fr ? 'Fermé' : 'Closed')}</span>}</div></div></article>)}</div>}
    {status === 'ready' && Array.isArray(data?.places) && !data.places.length && <p className="mt-4 text-sm text-slate-500">{fr ? 'Aucun résultat Google Maps trouvé pour cette destination.' : 'No Google Maps results found for this destination.'}</p>}
    {status === 'ready' && <p className="mt-3 text-[10px] text-slate-400">{fr ? 'Données Google Maps · résultats indicatifs à vérifier sur place.' : 'Google Maps data · indicative results to verify locally.'}</p>}
  </div>;
}

function Metric({ label, value }) {
  return <div className="bg-white p-3 dark:bg-slate-950/60"><p className="text-[10px] uppercase tracking-[.12em] text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold">{value || '—'}</p></div>;
}
