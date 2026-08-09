import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, MapPin, Search } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import { TRAVEL_DESTINATIONS } from '../lib/travel';
import { trackEvent } from '../lib/telemetry';
import { getCountryDirectory } from '../lib/country-directory-client';

const fallbackCountries = TRAVEL_DESTINATIONS.map((item) => ({ code: item.code, name: item.country, currencies: [{ code: item.currency, name: item.currency }], primaryCurrency: { code: item.currency, name: item.currency } }));

function countryLabel(country, lang) {
  try { return new Intl.DisplayNames([lang === 'en' ? 'en' : 'fr'], { type: 'region' }).of(country.code) || country.name; }
  catch { return country.name; }
}

function CountryFlag({ code }) {
  const Component = Flags[String(code || '').toUpperCase()];
  return Component
    ? <Component className="h-7 w-10 flex-none rounded-md border border-black/5 object-cover shadow-sm" />
    : <span className="flex h-7 w-10 flex-none items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-400 dark:bg-white/5">{code || '—'}</span>;
}

export default function CountryQuickSelect({ lang = 'fr', onSelect }) {
  const [countries, setCountries] = useState([]); const [open, setOpen] = useState(false); const [query, setQuery] = useState(''); const rootRef = useRef(null);
  useEffect(() => { let active = true; getCountryDirectory(fallbackCountries).then(({ countries: directory }) => { if (active) setCountries(directory); }); return () => { active = false; }; }, []);
  useEffect(() => { const close=(event)=>{if(!rootRef.current?.contains(event.target))setOpen(false)};const escape=(event)=>{if(event.key==='Escape')setOpen(false)};document.addEventListener('pointerdown',close);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',escape)};},[]);
  const filtered=useMemo(()=>{const needle=query.trim().toLowerCase();if(!needle)return countries.slice(0,12);return countries.filter((country)=>{const label=countryLabel(country,lang);const currencies=(country.currencies||[]).map((c)=>`${c.code} ${c.name||''}`).join(' ');return `${label} ${country.name||''} ${country.code} ${currencies}`.toLowerCase().includes(needle)}).slice(0,16)},[countries,query,lang]);

  return <div ref={rootRef} className="relative z-[170]">
    <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 sm:px-4"><MapPin className="h-4 w-4 text-emerald-600"/><span className="hidden sm:inline">Destination</span><ChevronDown className={`h-4 w-4 transition ${open?'rotate-180':''}`}/></button>
    {open&&<div className="absolute right-0 top-[calc(100%+10px)] z-[190] w-[min(370px,calc(100vw-24px))] overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,.16)] dark:border-white/10 dark:bg-slate-900"><div className="px-1 pb-3"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">{lang==='fr'?'Raccourci voyage':'Travel shortcut'}</p><p className="mt-1 text-sm font-semibold">{lang==='fr'?'Choisir une destination':'Choose a destination'}</p></div><label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5 dark:bg-white/5"><Search className="h-4 w-4 text-slate-400"/><input autoFocus value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={lang==='fr'?'Pays, code ou devise…':'Country, code or currency…'} className="w-full min-w-0 bg-transparent text-sm outline-none"/></label><div className="mt-2 max-h-72 overflow-y-auto pr-1">{filtered.map((country)=>{const name=countryLabel(country,lang);const currency=country.primaryCurrency||country.currencies?.[0];return <button key={country.code} type="button" onClick={()=>{trackEvent('destination_select',{country:country.code,currency:currency?.code||'unknown'});onSelect?.(country);setOpen(false);setQuery('')}} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"><CountryFlag code={country.flag || country.code}/><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{name}</span><span className="block truncate text-xs text-slate-400">{currency?.code||'—'}{currency?.name?` · ${currency.name}`:''}</span></span><span className="flex-none text-[10px] font-bold text-slate-400">{country.code}</span></button>})}{!filtered.length&&<p className="px-3 py-8 text-center text-sm text-slate-400">{lang==='fr'?'Aucun pays trouvé.':'No country found.'}</p>}</div></div>}
  </div>;
}
