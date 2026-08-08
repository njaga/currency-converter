import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronRight, DownloadCloud, Globe2, Loader2, MapPin, Plane, RefreshCw, Search, ShieldCheck, WifiOff } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';

import { getPreparedTrip, savePreparedTrip } from '../lib/db';
import { getExchangeRates, calculateCrossRate } from '../lib/rates';
import { TRAVEL_DESTINATIONS } from '../lib/travel';
import TripPreparation from './TripPreparation';

const Flag = ({ code, className = 'h-6 w-9' }) => {
  const Component = Flags[code?.toUpperCase()];
  return Component ? <Component className={`${className} rounded-md border border-black/5 object-cover shadow-sm`} /> : <Globe2 className="h-5 w-5 text-slate-400"/>;
};

function localizedCountryName(country, lang) {
  try {
    return new Intl.DisplayNames([lang === 'en' ? 'en' : 'fr'], { type: 'region' }).of(country.code) || country.name;
  } catch {
    return country.name;
  }
}

function fallbackCountries() {
  return TRAVEL_DESTINATIONS.map((item) => ({
    code: item.code,
    code3: item.code,
    name: item.country,
    officialName: item.country,
    region: 'Africa',
    subregion: null,
    capital: null,
    flag: item.flag,
    currencies: [{ code: item.currency, name: item.currency, symbol: item.currency }],
    primaryCurrency: { code: item.currency, name: item.currency, symbol: item.currency },
  }));
}

function buildPairs(currencyCode) {
  const preferred = ['XOF', 'EUR', 'USD', 'GBP'];
  if (currencyCode === 'XOF') preferred.unshift('GMD');
  if (currencyCode === 'XAF') preferred.unshift('XOF');
  return [...new Set(preferred)].filter((code) => code !== currencyCode).slice(0, 4);
}

function readRequestedCountry() {
  if (typeof window === 'undefined') return 'GM';
  const fromUrl = new URLSearchParams(window.location.search).get('country')?.toUpperCase();
  const saved = localStorage.getItem('kiwango_quick_destination')?.toUpperCase();
  return fromUrl || saved || 'GM';
}

export default function TravelMode({ lang = 'fr', onSelectPair }) {
  const [countries, setCountries] = useState([]);
  const [destinationCode, setDestinationCode] = useState('GM');
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [directoryStatus, setDirectoryStatus] = useState('loading');
  const [preparedTrip, setPreparedTrip] = useState(null);
  const [status, setStatus] = useState('idle');
  const [rates, setRates] = useState({});

  useEffect(() => {
    const requested = readRequestedCountry();
    setDestinationCode(requested);
    let cancelled = false;
    fetch('/api/countries').then(async (response) => {
      if (!response.ok) throw new Error('countries');
      return response.json();
    }).then((data) => {
      if (cancelled) return;
      const nextCountries = data.countries || [];
      setCountries(nextCountries);
      setDirectoryStatus('ready');
      if (nextCountries.length && !nextCountries.some((country) => country.code === requested)) {
        setDestinationCode(nextCountries[0].code);
      }
    }).catch(() => {
      if (cancelled) return;
      const fallback = fallbackCountries();
      setCountries(fallback);
      setDirectoryStatus('fallback');
      if (fallback.length && !fallback.some((country) => country.code === requested)) {
        setDestinationCode(fallback[0].code);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const chooseDestination = (code) => {
    setDestinationCode(code);
    setStatus('idle');
    setPreparedTrip(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kiwango_quick_destination', code);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'travel');
      url.searchParams.set('country', code);
      window.history.replaceState({}, '', `${url.pathname}${url.search}`);
    }
  };

  const destination = useMemo(() => countries.find((country) => country.code === destinationCode) || countries[0] || null, [countries, destinationCode]);
  const localName = destination ? localizedCountryName(destination, lang) : '';
  const primaryCurrency = destination?.primaryCurrency || destination?.currencies?.[0] || null;
  const pairTargets = useMemo(() => primaryCurrency ? buildPairs(primaryCurrency.code) : [], [primaryCurrency]);

  useEffect(() => {
    if (!destination?.code) return;
    let cancelled = false;
    getPreparedTrip(destination.code).then((trip) => { if (!cancelled) setPreparedTrip(trip); });
    return () => { cancelled = true; };
  }, [destination?.code]);

  const regions = useMemo(() => ['all', ...new Set(countries.map((country) => country.region).filter(Boolean))], [countries]);
  const filteredCountries = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return countries.filter((country) => {
      if (region !== 'all' && country.region !== region) return false;
      if (!needle) return true;
      const name = localizedCountryName(country, lang).toLocaleLowerCase();
      const currencies = (country.currencies || []).map((item) => `${item.code} ${item.name}`).join(' ').toLocaleLowerCase();
      return name.includes(needle) || country.name?.toLocaleLowerCase().includes(needle) || country.code?.toLocaleLowerCase().includes(needle) || currencies.includes(needle);
    });
  }, [countries, query, region, lang]);

  const prepareOffline = async () => {
    if (!destination || !primaryCurrency) return;
    setStatus('syncing');
    try {
      const data = await getExchangeRates('EUR', true);
      const usablePairs = pairTargets.map((counter) => ({
        from: primaryCurrency.code,
        to: counter,
        rate: calculateCrossRate(primaryCurrency.code, counter, data?.rates || {}, 'EUR'),
      })).filter((pair) => Number.isFinite(pair.rate));

      if (!data?.rates || usablePairs.length === 0) { setStatus('error'); return; }
      const trip = {
        countryCode: destination.code,
        country: localName,
        currency: primaryCurrency.code,
        currencyName: primaryCurrency.name,
        currencies: destination.currencies,
        capital: destination.capital,
        region: destination.region,
        pairs: usablePairs,
        rateSource: data.source,
        rateTimestamp: data.timestamp,
      };
      await savePreparedTrip(trip);
      setRates(data.rates);
      setPreparedTrip({ ...trip, preparedAt: Date.now() });
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  const preparedAt = preparedTrip?.rateTimestamp || preparedTrip?.preparedAt;
  const formatDate = (timestamp) => !timestamp ? '—' : new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp));
  const pairs = preparedTrip?.countryCode === destination?.code && preparedTrip?.pairs?.length
    ? preparedTrip.pairs
    : pairTargets.map((counter) => ({ from: primaryCurrency?.code, to: counter, rate: primaryCurrency ? calculateCrossRate(primaryCurrency.code, counter, rates, 'EUR') : null }));
  const referencePair = pairs.find((pair) => pair.to === 'XOF') || pairs.find((pair) => pair.to === 'EUR') || pairs.find((pair) => Number.isFinite(pair.rate));
  const quickAmounts = [10, 50, 100, 500, 1000];

  if (!destination && directoryStatus === 'loading') return <div className="flex min-h-[420px] items-center justify-center gap-3 text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin text-emerald-600"/>Chargement du répertoire mondial…</div>;
  if (!destination) return <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">Le répertoire des destinations est indisponible.</div>;

  return <section className="min-w-0">
    <div className="relative overflow-hidden rounded-[32px] border border-emerald-200/70 bg-[linear-gradient(145deg,#f0fdf4_0%,#ffffff_62%,#f8fafc_100%)] p-6 shadow-[0_24px_70px_rgba(5,150,105,.08)] sm:p-8 dark:border-emerald-900/40 dark:bg-emerald-950/10">
      <div className="relative z-10 max-w-2xl"><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm dark:bg-white/10 dark:text-emerald-300"><Plane className="h-3.5 w-3.5"/>Kiwango Travel Pack</div><h1 className="text-3xl font-semibold tracking-[-.045em] sm:text-4xl md:text-[44px]">Choisissez un pays. Kiwango s’occupe de sa monnaie.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">Recherchez votre destination dans le monde entier, découvrez la devise utilisée et préparez taux, budget et outils avant le départ.</p></div>
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full border border-emerald-200/80 bg-emerald-100/35 dark:border-emerald-900/40 dark:bg-emerald-950/20"><Globe2 className="absolute left-[86px] top-[78px] h-32 w-32 text-emerald-600/30"/><Plane className="absolute left-[62px] top-[64px] h-9 w-9 -rotate-12 text-emerald-600"/></div>
    </div>

    <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <div className="min-w-0 rounded-[28px] border border-slate-200/80 bg-white/85 p-4 shadow-[0_18px_50px_rgba(15,23,42,.05)] dark:border-white/10 dark:bg-white/[.035]">
        <div className="px-1 pt-1"><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-slate-400">Destination</p><h2 className="mt-1 text-lg font-semibold">Où allez-vous ?</h2></div>
        <label className="mt-4 flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-white/10 dark:bg-slate-950"><Search className="h-4 w-4 flex-none text-slate-400"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Pays, code ou devise…" className="w-full min-w-0 bg-transparent text-sm outline-none"/></label>
        <div className="mt-3 flex flex-wrap gap-2">{regions.map((item)=><button key={item} onClick={()=>setRegion(item)} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${region===item?'bg-slate-950 text-white dark:bg-white dark:text-slate-950':'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300'}`}>{item==='all'?'Tous':item}</button>)}</div>
        <div className="mt-4 max-h-[560px] space-y-1 overflow-y-auto pr-1">{filteredCountries.map((item)=>{const active=destinationCode===item.code;const currency=item.primaryCurrency;return <button key={item.code} onClick={()=>chooseDestination(item.code)} className={`flex w-full min-w-0 items-center justify-between rounded-2xl border px-3.5 py-3 text-left transition ${active?'border-emerald-300 bg-emerald-50/80 dark:border-emerald-700/50 dark:bg-emerald-950/30':'border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-white/10 dark:hover:bg-white/[.025]'}`}><span className="flex min-w-0 items-center gap-3"><Flag code={item.flag}/><span className="min-w-0"><span className="block truncate text-sm font-semibold">{localizedCountryName(item,lang)}</span><span className="block truncate text-xs text-slate-500">{currency?.code || '—'} · {currency?.name || 'Devise non renseignée'}</span></span></span>{active?<span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-emerald-600 text-white"><Check className="h-3.5 w-3.5"/></span>:<ChevronRight className="h-4 w-4 flex-none text-slate-300"/>}</button>})}{!filteredCountries.length&&<p className="px-3 py-8 text-center text-sm text-slate-500">Aucune destination trouvée.</p>}</div>
        <p className="mt-3 px-2 text-[11px] text-slate-400">{directoryStatus==='ready'?`${countries.length} destinations chargées`:'Répertoire de secours actif'}</p>
      </div>

      <div className="min-w-0 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/85 shadow-[0_18px_54px_rgba(15,23,42,.06)] dark:border-white/10 dark:bg-white/[.035]">
        <div className="border-b border-slate-200/80 p-5 sm:p-6 dark:border-white/10"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="mb-3 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4 text-emerald-600"/>{localName}{destination.capital?` · ${destination.capital}`:''}</div><div className="flex items-center gap-3"><Flag code={destination.flag} className="h-9 w-14"/><div><p className="text-2xl font-semibold tracking-[-.03em]">{primaryCurrency?.code || '—'}</p><p className="text-xs text-slate-500">{primaryCurrency?.name || 'Devise non renseignée'}</p></div></div></div>{preparedTrip?.countryCode===destination.code&&<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"><ShieldCheck className="h-3.5 w-3.5"/>Prêt hors ligne</span>}</div>
          {(destination.currencies?.length || 0)>1&&<div className="mt-4 flex flex-wrap gap-2">{destination.currencies.map((currency)=><span key={currency.code} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{currency.code} · {currency.name}</span>)}</div>}
        </div>
        <div className="p-5 sm:p-6"><div className="mb-3 flex items-center justify-between"><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-slate-400">Paires utiles</p><span className="text-[11px] text-slate-400">{pairs.length} paires</span></div><div className="grid gap-2 sm:grid-cols-2">{pairs.map((pair)=><button key={`${pair.from}-${pair.to}`} onClick={()=>onSelectPair?.(pair.from,pair.to)} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-left transition hover:border-emerald-300 hover:bg-white dark:border-white/10 dark:bg-white/[.025]"><span className="block text-sm font-semibold">{pair.from} ↔ {pair.to}</span><span className="mt-1 block text-xs text-slate-500">{Number.isFinite(pair.rate)?`1 ${pair.from} = ${pair.rate.toLocaleString(lang==='fr'?'fr-FR':'en-US',{maximumFractionDigits:4})} ${pair.to}`:'À synchroniser'}</span></button>)}</div>
        {referencePair&&Number.isFinite(referencePair.rate)&&<div className="mt-6"><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-slate-400">Cheat sheet</p><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">{quickAmounts.map((value)=><button key={value} onClick={()=>onSelectPair?.(referencePair.from,referencePair.to)} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-emerald-300 dark:border-white/10 dark:bg-white/[.025]"><span className="block text-xs font-semibold">{value.toLocaleString()} {referencePair.from}</span><span className="mt-1 block text-[11px] text-slate-500">≈ {(value*referencePair.rate).toLocaleString(lang==='fr'?'fr-FR':'en-US',{maximumFractionDigits:0})} {referencePair.to}</span></button>)}</div></div>}
        <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50/80 p-4 text-xs text-slate-500 dark:bg-white/[.025] sm:grid-cols-3"><div><span className="block font-medium text-slate-700 dark:text-slate-300">Dernière synchronisation</span><span>{formatDate(preparedAt)}</span></div><div><span className="block font-medium text-slate-700 dark:text-slate-300">Région</span><span>{destination.region || '—'}</span></div><div><span className="block font-medium text-slate-700 dark:text-slate-300">Stockage</span><span>Local, sur cet appareil</span></div></div>
        {status==='error'&&<div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 px-3 py-2.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"><WifiOff className="mt-0.5 h-3.5 w-3.5"/>Impossible de récupérer des taux fiables pour {primaryCurrency?.code}. La destination reste accessible, mais le Travel Pack n’est pas marqué comme synchronisé.</div>}
        <button onClick={prepareOffline} disabled={status==='syncing'||!primaryCurrency} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(5,150,105,.18)] transition hover:bg-emerald-700 disabled:opacity-60">{status==='syncing'?<><RefreshCw className="h-4 w-4 animate-spin"/>Synchronisation…</>:<><DownloadCloud className="h-4 w-4"/>{preparedTrip?.countryCode===destination.code?'Mettre à jour le Travel Pack':`Préparer ${localName} hors connexion`}</>}</button></div>
      </div>
    </div>

    <TripPreparation country={{...destination,name:localName}} lang={lang}/>
  </section>;
}
