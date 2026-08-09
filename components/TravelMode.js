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
    getPreparedTrip(destinationCode).then((trip) => {
      if (!cancelled) setPreparedTrip(trip);
    });
    return () => { cancelled = true; };
  }, [destinationCode]);

  const prepareOffline = async () => {
    setStatus('syncing');
    try {
      const data = await getExchangeRates('EUR', true);
      const usablePairs = destination.pairs
        .map((counter) => ({
          from: destination.currency,
          to: counter,
          rate: calculateCrossRate(destination.currency, counter, data?.rates || {}, 'EUR'),
        }))
        .filter((pair) => Number.isFinite(pair.rate));

      if (!data?.rates || usablePairs.length === 0) {
        setStatus('error');
        return;
      }

      const trip = {
        countryCode: destination.code,
        country: destination.country,
        currency: destination.currency,
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
  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const pairs = preparedTrip?.pairs?.length
    ? preparedTrip.pairs
    : destination.pairs.map((counter) => ({
        from: destination.currency,
        to: counter,
        rate: calculateCrossRate(destination.currency, counter, rates, 'EUR'),
      }));

  return (
    <section>
      <div className="relative overflow-hidden rounded-[32px] border border-emerald-200/70 bg-[linear-gradient(145deg,#f0fdf4_0%,#ffffff_62%,#f8fafc_100%)] p-6 shadow-[0_24px_70px_rgba(5,150,105,0.08)] sm:p-8 dark:border-emerald-900/40 dark:bg-[linear-gradient(145deg,rgba(6,78,59,0.2),rgba(2,6,23,0.72))]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-300/18 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-emerald-300"><Plane className="h-3.5 w-3.5" /> {lang === 'fr' ? 'Mode voyage' : 'Travel mode'}</div>
          <h1 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl md:text-[44px]">{lang === 'fr' ? 'Arrivez avec vos taux déjà dans la poche.' : 'Arrive with your rates already in your pocket.'}</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">{lang === 'fr' ? 'Choisissez une destination, synchronisez avant de partir et utilisez AfriChange même sans carte SIM ni connexion.' : 'Choose a destination, sync before leaving and keep using AfriChange without a SIM card or connection.'}</p>
        </div>
        <svg viewBox="0 0 260 220" className="pointer-events-none absolute -bottom-8 right-0 hidden w-[300px] text-emerald-600/90 md:block" aria-hidden="true"><circle cx="150" cy="105" r="82" fill="currentColor" opacity="0.08"/><circle cx="150" cy="105" r="52" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M150 57c-24 0-43 18-43 41 0 30 43 68 43 68s43-38 43-68c0-23-19-41-43-41Z" fill="currentColor" opacity="0.9"/><circle cx="150" cy="98" r="15" fill="white" opacity="0.9"/><path d="M48 169c35-23 68-31 100-27m15 2c17 2 31 7 47 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 9" opacity="0.35"/></svg>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
          <div className="mb-3 px-2 pt-1"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{lang === 'fr' ? 'Destination' : 'Destination'}</p><h2 className="mt-1 text-lg font-semibold">{lang === 'fr' ? 'Où allez-vous ?' : 'Where are you going?'}</h2></div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {TRAVEL_DESTINATIONS.map((item) => {
              const active = destinationCode === item.code;
              return (
                <button key={item.code} onClick={() => { setDestinationCode(item.code); setStatus('idle'); }} className={`group flex items-center justify-between rounded-2xl border px-3.5 py-3 text-left transition-all duration-200 ${active ? 'border-emerald-300 bg-emerald-50/80 shadow-[0_8px_22px_rgba(5,150,105,0.08)] dark:border-emerald-700/50 dark:bg-emerald-950/30' : 'border-transparent bg-slate-50/70 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white dark:bg-white/[0.025] dark:hover:border-white/10 dark:hover:bg-white/[0.05]'}`}>
                  <span className="flex items-center gap-3"><Flag code={item.flag} /><span><span className="block text-sm font-semibold">{lang === 'fr' ? item.country : item.countryEn}</span><span className="block text-xs text-slate-500">{item.currency}</span></span></span>{active ? <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white"><Check className="h-3.5 w-3.5" /></span> : <span className="h-2 w-2 rounded-full bg-slate-200 transition group-hover:bg-emerald-300 dark:bg-slate-700" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/82 shadow-[0_18px_54px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
          <div className="border-b border-slate-200/80 p-5 sm:p-6 dark:border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div><div className="mb-3 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4 text-emerald-600" /> {lang === 'fr' ? destination.country : destination.countryEn}</div><div className="flex items-center gap-3"><Flag code={destination.flag} className="h-8 w-12" /><div><p className="text-2xl font-semibold tracking-[-0.03em]">{destination.currency}</p><p className="text-xs text-slate-500">{currency.name}</p></div></div></div>
              {preparedTrip && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"><ShieldCheck className="h-3.5 w-3.5" /> {lang === 'fr' ? 'Prêt hors ligne' : 'Offline ready'}</span>}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="mb-3 flex items-center justify-between"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{lang === 'fr' ? 'Paires préparées' : 'Prepared pairs'}</p><span className="text-[11px] text-slate-400">{pairs.length} {lang === 'fr' ? 'paires' : 'pairs'}</span></div>
            <div className="grid gap-2 sm:grid-cols-2">
              {pairs.map((pair) => (
                <button key={`${pair.from}-${pair.to}`} onClick={() => onSelectPair?.(pair.from, pair.to)} className="group rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.025] dark:hover:bg-white/[0.05]">
                  <span className="block text-sm font-semibold">{pair.from} ↔ {pair.to}</span>
                  <span className="mt-1 block text-xs text-slate-500">{Number.isFinite(pair.rate) ? `1 ${pair.from} = ${pair.rate.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 4 })} ${pair.to}` : (lang === 'fr' ? 'À synchroniser' : 'Needs sync')}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50/80 p-4 text-xs text-slate-500 dark:bg-white/[0.025] sm:grid-cols-2"><div><span className="block font-medium text-slate-700 dark:text-slate-300">{lang === 'fr' ? 'Dernière synchronisation' : 'Last sync'}</span><span>{formatDate(preparedAt)}</span></div><div><span className="block font-medium text-slate-700 dark:text-slate-300">{lang === 'fr' ? 'Stockage' : 'Storage'}</span><span>{lang === 'fr' ? 'Local, sur cet appareil' : 'Local, on this device'}</span></div></div>

            {status === 'error' && <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 px-3 py-2.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"><WifiOff className="mt-0.5 h-3.5 w-3.5" /> {lang === 'fr' ? 'Impossible de récupérer des taux fiables. Reconnectez-vous puis réessayez.' : 'Could not retrieve reliable rates. Reconnect and try again.'}</div>}

            <button onClick={prepareOffline} disabled={status === 'syncing'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(5,150,105,0.18)] transition-all hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70 dark:bg-emerald-500 dark:hover:bg-emerald-400">
              {status === 'syncing' ? <><RefreshCw className="h-4 w-4 animate-spin" /> {lang === 'fr' ? 'Synchronisation…' : 'Syncing…'}</> : <><DownloadCloud className="h-4 w-4" /> {preparedTrip ? (lang === 'fr' ? 'Mettre à jour les taux' : 'Update rates') : (lang === 'fr' ? `Préparer ${destination.country} hors connexion` : `Prepare ${destination.countryEn} offline`)}</>}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
