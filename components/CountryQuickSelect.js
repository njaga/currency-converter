import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, MapPin, Search } from 'lucide-react';

export default function CountryQuickSelect({ lang = 'fr', onSelect }) {
  const [countries, setCountries] = useState([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/countries').then((r) => r.ok ? r.json() : Promise.reject()).then((data) => setCountries(data.countries || [])).catch(() => setCountries([]));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return countries.slice(0, 12);
    return countries.filter((country) => {
      const label = (() => { try { return new Intl.DisplayNames([lang === 'en' ? 'en' : 'fr'], { type: 'region' }).of(country.code) || country.name; } catch { return country.name; } })();
      return `${label} ${country.code} ${(country.currencies || []).map((c) => c.code).join(' ')}`.toLowerCase().includes(needle);
    }).slice(0, 14);
  }, [countries, query, lang]);

  return <div className="relative">
    <button type="button" onClick={() => setOpen((v) => !v)} className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
      <MapPin className="h-4 w-4 text-emerald-600"/><span>{lang === 'fr' ? 'Destination' : 'Destination'}</span><ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`}/>
    </button>
    {open && <div className="absolute right-0 top-[calc(100%+10px)] z-[180] w-[min(360px,calc(100vw-24px))] rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,.16)] dark:border-white/10 dark:bg-slate-900">
      <label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5 dark:bg-white/5"><Search className="h-4 w-4 text-slate-400"/><input autoFocus value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={lang === 'fr' ? 'Rechercher un pays…' : 'Search a country…'} className="w-full bg-transparent text-sm outline-none"/></label>
      <div className="mt-2 max-h-72 overflow-y-auto">{filtered.map((country)=>{const name=(()=>{try{return new Intl.DisplayNames([lang==='en'?'en':'fr'],{type:'region'}).of(country.code)||country.name}catch{return country.name}})();return <button key={country.code} type="button" onClick={()=>{onSelect?.(country);setOpen(false);setQuery('')}} className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"><span className="min-w-0"><span className="block truncate text-sm font-semibold">{name}</span><span className="block text-xs text-slate-400">{country.primaryCurrency?.code || country.currencies?.[0]?.code || '—'}</span></span><span className="text-xs font-medium text-slate-400">{country.code}</span></button>})}</div>
    </div>}
  </div>;
}
