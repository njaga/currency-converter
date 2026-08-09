import React, { useEffect, useMemo, useState } from 'react';
import { Check, DownloadCloud, MapPin, Plane, RefreshCw, ShieldCheck, WifiOff } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';

import { getPreparedTrip, savePreparedTrip } from '../lib/db';
import { getExchangeRates, calculateCrossRate } from '../lib/rates';
import { getCurrencyByCode } from '../lib/currencies';
import { TRAVEL_DESTINATIONS, getTravelDestination } from '../lib/travel';

const Flag = ({ code, className = 'h-6 w-9' }) => {
  const Component = Flags[code?.toUpperCase()];
  return Component ? <Component className={`${className} rounded-md border border-black/5 object-cover shadow-sm`} /> : null;
};

export default function TravelMode({ lang = 'fr', onSelectPair }) {
  const [destinationCode, setDestinationCode] = useState('GM');
  const [preparedTrip, setPreparedTrip] = useState(null);
  const [status, setStatus] = useState('idle');
  const [rates, setRates] = useState({});
  const destination = useMemo(() => getTravelDestination(destinationCode), [destinationCode]);
  const currency = getCurrencyByCode(destination.currency);

  useEffect(() => {
    let cancelled = false;
    getPreparedTrip(destinationCode).then((trip) => { if (!cancelled) setPreparedTrip(trip); });
    return () => { cancelled = true; };
  }, [destinationCode]);

  const prepareOffline = async () => {
    setStatus('syncing');
    try {
      const data = await getExchangeRates('EUR', true);
      const usablePairs = destination.pairs.map((counter) => ({ from: destination.currency, to: counter, rate: calculateCrossRate(destination.currency, counter, data?.rates || {}, 'EUR') })).filter((pair) => Number.isFinite(pair.rate));
      if (!data?.rates || usablePairs.length === 0) { setStatus('error'); return; }
      const trip = { countryCode: destination.code, country: destination.country, currency: destination.currency, pairs: usablePairs, rateSource: data.source, rateTimestamp: data.timestamp };
      await savePreparedTrip(trip);
      setRates(data.rates); setPreparedTrip({ ...trip, preparedAt: Date.now() }); setStatus('ready');
    } catch { setStatus('error'); }
  };

  const preparedAt = preparedTrip?.rateTimestamp || preparedTrip?.preparedAt;
  const formatDate = (timestamp) => !timestamp ? '—' : new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp));
  const pairs = preparedTrip?.pairs?.length ? preparedTrip.pairs : destination.pairs.map((counter) => ({ from: destination.currency, to: counter, rate: calculateCrossRate(destination.currency, counter, rates, 'EUR') }));
  const referencePair = pairs.find((pair) => pair.to === 'XOF') || pairs.find((pair) => Number.isFinite(pair.rate));
  const quickAmounts = [10, 50, 100, 500, 1000];

  return <section className="min-w-0">
    <div className="relative overflow-hidden rounded-[32px] border border-emerald-200/70 bg-[linear-gradient(145deg,#f0fdf4_0%,#ffffff_62%,#f8fafc_100%)] p-6 shadow-[0_24px_70px_rgba(5,150,105,.08)] sm:p-8 dark:border-emerald-900/40 dark:bg-emerald-950/10"><div className="relative z-10 max-w-2xl"><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm dark:bg-white/10 dark:text-emerald-300"><Plane className="h-3.5 w-3.5"/>Kiwango Travel Pack</div><h1 className="text-3xl font-semibold tracking-[-.045em] sm:text-4xl md:text-[44px]">Arrivez avec vos taux déjà dans la poche.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">Choisissez une destination, synchronisez avant de partir et gardez vos conversions utiles accessibles sans SIM ni connexion.</p></div><div className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full border border-emerald-200 bg-emerald-100/40 dark:border-emerald-900/40 dark:bg-emerald-950/20"><div className="absolute left-16 top-16 h-36 w-36 rounded-full border border-emerald-300/50"/><MapPin className="absolute left-[116px] top-[104px] h-12 w-12 text-emerald-600"/></div></div>

    <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[.82fr_1.18fr]">
      <div className="min-w-0 rounded-[28px] border border-slate-200/80 bg-white/85 p-4 shadow-[0_18px_50px_rgba(15,23,42,.05)] dark:border-white/10 dark:bg-white/[.035]"><div className="mb-3 px-2 pt-1"><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-slate-400">Destination</p><h2 className="mt-1 text-lg font-semibold">Où allez-vous ?</h2></div><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">{TRAVEL_DESTINATIONS.map((item)=>{const active=destinationCode===item.code;return <button key={item.code} onClick={()=>{setDestinationCode(item.code);setStatus('idle')}} className={`flex min-w-0 items-center justify-between rounded-2xl border px-3.5 py-3 text-left transition ${active?'border-emerald-300 bg-emerald-50/80 dark:border-emerald-700/50 dark:bg-emerald-950/30':'border-transparent bg-slate-50/70 hover:border-slate-200 hover:bg-white dark:bg-white/[.025] dark:hover:border-white/10'}`}><span className="flex min-w-0 items-center gap-3"><Flag code={item.flag}/><span className="min-w-0"><span className="block truncate text-sm font-semibold">{lang==='fr'?item.country:item.countryEn}</span><span className="block text-xs text-slate-500">{item.currency}</span></span></span>{active&&<span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-emerald-600 text-white"><Check className="h-3.5 w-3.5"/></span>}</button>})}</div></div>

      <div className="min-w-0 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/85 shadow-[0_18px_54px_rgba(15,23,42,.06)] dark:border-white/10 dark:bg-white/[.035]"><div className="border-b border-slate-200/80 p-5 sm:p-6 dark:border-white/10"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="mb-3 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4 text-emerald-600"/>{lang==='fr'?destination.country:destination.countryEn}</div><div className="flex items-center gap-3"><Flag code={destination.flag} className="h-8 w-12"/><div><p className="text-2xl font-semibold tracking-[-.03em]">{destination.currency}</p><p className="text-xs text-slate-500">{currency.name}</p></div></div></div>{preparedTrip&&<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"><ShieldCheck className="h-3.5 w-3.5"/>Prêt hors ligne</span>}</div></div>
        <div className="p-5 sm:p-6"><div className="mb-3 flex items-center justify-between"><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-slate-400">Paires préparées</p><span className="text-[11px] text-slate-400">{pairs.length} paires</span></div><div className="grid gap-2 sm:grid-cols-2">{pairs.map((pair)=><button key={`${pair.from}-${pair.to}`} onClick={()=>onSelectPair?.(pair.from,pair.to)} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-left transition hover:border-emerald-300 hover:bg-white dark:border-white/10 dark:bg-white/[.025]"><span className="block text-sm font-semibold">{pair.from} ↔ {pair.to}</span><span className="mt-1 block text-xs text-slate-500">{Number.isFinite(pair.rate)?`1 ${pair.from} = ${pair.rate.toLocaleString(lang==='fr'?'fr-FR':'en-US',{maximumFractionDigits:4})} ${pair.to}`:'À synchroniser'}</span></button>)}</div>
        {referencePair&&Number.isFinite(referencePair.rate)&&<div className="mt-6"><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-slate-400">Cheat sheet</p><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">{quickAmounts.map((value)=><button key={value} onClick={()=>onSelectPair?.(referencePair.from,referencePair.to)} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left dark:border-white/10 dark:bg-white/[.025]"><span className="block text-xs font-semibold">{value.toLocaleString()} {referencePair.from}</span><span className="mt-1 block text-[11px] text-slate-500">≈ {(value*referencePair.rate).toLocaleString(lang==='fr'?'fr-FR':'en-US',{maximumFractionDigits:0})} {referencePair.to}</span></button>)}</div></div>}
        <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50/80 p-4 text-xs text-slate-500 dark:bg-white/[.025] sm:grid-cols-2"><div><span className="block font-medium text-slate-700 dark:text-slate-300">Dernière synchronisation</span><span>{formatDate(preparedAt)}</span></div><div><span className="block font-medium text-slate-700 dark:text-slate-300">Stockage</span><span>Local, sur cet appareil</span></div></div>{status==='error'&&<div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 px-3 py-2.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"><WifiOff className="mt-0.5 h-3.5 w-3.5"/>Impossible de récupérer des taux fiables. Reconnectez-vous puis réessayez.</div>}<button onClick={prepareOffline} disabled={status==='syncing'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(5,150,105,.18)] transition hover:bg-emerald-700 disabled:opacity-70">{status==='syncing'?<><RefreshCw className="h-4 w-4 animate-spin"/>Synchronisation…</>:<><DownloadCloud className="h-4 w-4"/>{preparedTrip?'Mettre à jour le Travel Pack':`Préparer ${destination.country} hors connexion`}</>}</button></div>
      </div>
    </div>
  </section>;
}
