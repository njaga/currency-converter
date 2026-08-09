import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Loader2, MapPin, Search } from 'lucide-react';

const createSession = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `kiwango-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export default function PlaceAutocompleteInput({ value, onChange, lang = 'fr', selectedPlace = null }) {
  const fr = lang === 'fr';
  const rootRef = useRef(null);
  const sessionRef = useRef(null);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const close = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  useEffect(() => {
    const query = value.trim();
    if (!hasInteracted || query.length < 2 || selectedPlace?.label === value) {
      setItems([]);
      setStatus('idle');
      return undefined;
    }
    if (!sessionRef.current) sessionRef.current = createSession();
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus('loading');
      try {
        const response = await fetch(`/api/place-autocomplete?q=${encodeURIComponent(query)}&lang=${lang}&session=${encodeURIComponent(sessionRef.current)}`, { signal: controller.signal });
        const data = await response.json();
        setItems(Array.isArray(data.items) ? data.items : []);
        setOpen(true);
        setStatus(response.ok ? 'ready' : 'unavailable');
      } catch (error) {
        if (error.name !== 'AbortError') setStatus('unavailable');
      }
    }, 280);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [value, lang, selectedPlace?.label, hasInteracted]);

  const select = (item) => {
    onChange(item.label, item);
    setOpen(false);
    setItems([]);
    sessionRef.current = null;
    setHasInteracted(false);
  };

  return <div ref={rootRef} className="relative">
    <div className="flex items-center gap-2 border border-slate-200 px-3.5 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-white/10">
      <MapPin className="h-4 w-4 flex-none text-emerald-600" />
      <input
        value={value}
        onChange={(event) => { setHasInteracted(true); onChange(event.target.value, null); }}
        onFocus={() => items.length && setOpen(true)}
        placeholder={fr ? 'Rechercher une ville ou un pays…' : 'Search for a city or country…'}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls="origin-place-suggestions"
        className="w-full bg-transparent py-3 text-sm outline-none"
      />
      {status === 'loading' ? <Loader2 className="h-4 w-4 flex-none animate-spin text-slate-400" /> : <Search className="h-4 w-4 flex-none text-slate-300" />}
    </div>
    {open && <div id="origin-place-suggestions" className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,.16)] dark:border-white/10 dark:bg-slate-900">
      {items.map((item) => <button key={item.id} type="button" onClick={() => select(item)} className="flex w-full items-start gap-3 px-3 py-3 text-left transition hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
        <MapPin className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
        <span className="min-w-0"><strong className="block truncate text-sm">{item.mainText}</strong>{item.secondaryText && <span className="mt-0.5 block truncate text-xs text-slate-500">{item.secondaryText}</span>}</span>
      </button>)}
      {!items.length && status === 'ready' && <p className="px-3 py-4 text-sm text-slate-500">{fr ? 'Aucun lieu trouvé.' : 'No place found.'}</p>}
      <div className="flex items-center justify-between border-t border-slate-100 px-3 pt-2 text-[10px] text-slate-400 dark:border-white/10"><span>{fr ? 'Résultats cartographiques' : 'Map results'}</span><span className="font-semibold">Google Maps</span></div>
    </div>}
    {selectedPlace?.mapsUrl && <a href={selectedPlace.mapsUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline">{fr ? 'Lieu Google Maps sélectionné' : 'Google Maps place selected'}<ExternalLink className="h-3 w-3" /></a>}
    {status === 'unavailable' && <p className="mt-2 text-xs text-amber-700">{fr ? 'Google Maps est momentanément indisponible. Vous pouvez continuer avec une saisie libre.' : 'Google Maps is temporarily unavailable. You can continue with free text.'}</p>}
  </div>;
}
