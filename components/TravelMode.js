import React, { useEffect, useMemo, useState } from 'react';
import { Check, DownloadCloud, MapPin, RefreshCw, WifiOff } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';

import { getPreparedTrip, savePreparedTrip } from '../lib/db';
import { getExchangeRates, calculateCrossRate } from '../lib/rates';
import { getCurrencyByCode } from '../lib/currencies';
import { TRAVEL_DESTINATIONS, getTravelDestination } from '../lib/travel';

const Flag = ({ code }) => {
  const Component = Flags[code?.toUpperCase()];
  return Component ? <Component className="h-5 w-7 rounded-sm border border-black/5 object-cover" /> : null;
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
      <div className="mb-8 max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
          {lang === 'fr' ? 'Mode voyage' : 'Travel mode'}
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white md:text-4xl">
          {lang === 'fr' ? 'Préparer mon voyage.' : 'Prepare my trip.'}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {lang === 'fr'
            ? 'Synchronisez avant de partir. Les taux utiles resteront disponibles sur cet appareil même sans carte SIM ni connexion.'
            : 'Sync before you leave. Useful rates stay available on this device even without a SIM card or internet connection.'}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {lang === 'fr' ? 'Destination' : 'Destination'}
          </label>
          <div className="border border-slate-200 dark:border-slate-800">
            {TRAVEL_DESTINATIONS.map((item) => (
              <button
                key={item.code}
                onClick={() => { setDestinationCode(item.code); setStatus('idle'); }}
                className={`flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-b-0 dark:border-slate-800 ${destinationCode === item.code ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-900'}`}
              >
                <span className="flex items-center gap-3">
                  <Flag code={item.flag} />
                  <span>
                    <span className="block text-sm font-medium">{lang === 'fr' ? item.country : item.countryEn}</span>
                    <span className="block text-xs text-slate-500">{item.currency}</span>
                  </span>
                </span>
                {destinationCode === item.code && <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-800">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4" /> {lang === 'fr' ? destination.country : destination.countryEn}</div>
                <div className="flex items-center gap-3"><Flag code={destination.flag} /><div><p className="text-lg font-semibold">{destination.currency}</p><p className="text-xs text-slate-500">{currency.name}</p></div></div>
              </div>
              {preparedTrip && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"><Check className="h-3 w-3" /> {lang === 'fr' ? 'Prêt hors ligne' : 'Offline ready'}</span>}
            </div>
          </div>

          <div className="p-5 md:p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{lang === 'fr' ? 'Paires préparées' : 'Prepared pairs'}</p>
            <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {pairs.map((pair) => (
                <button
                  key={`${pair.from}-${pair.to}`}
                  onClick={() => onSelectPair?.(pair.from, pair.to)}
                  className="flex w-full items-center justify-between py-3 text-left text-sm hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  <span className="font-medium">{pair.from} ↔ {pair.to}</span>
                  <span className="text-xs text-slate-500">{Number.isFinite(pair.rate) ? `1 ${pair.from} = ${pair.rate.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 4 })} ${pair.to}` : '—'}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500 dark:border-slate-800 sm:grid-cols-2">
              <div><span className="block font-medium text-slate-700 dark:text-slate-300">{lang === 'fr' ? 'Dernière synchronisation' : 'Last sync'}</span><span>{formatDate(preparedAt)}</span></div>
              <div><span className="block font-medium text-slate-700 dark:text-slate-300">{lang === 'fr' ? 'Stockage' : 'Storage'}</span><span>{lang === 'fr' ? 'Sur cet appareil' : 'On this device'}</span></div>
            </div>

            {status === 'error' && <div className="mt-4 flex items-start gap-2 border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"><WifiOff className="mt-0.5 h-3.5 w-3.5" /> {lang === 'fr' ? 'Impossible de récupérer des taux fiables. Reconnectez-vous puis réessayez.' : 'Could not retrieve reliable rates. Reconnect and try again.'}</div>}

            <button
              onClick={prepareOffline}
              disabled={status === 'syncing'}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {status === 'syncing' ? <><RefreshCw className="h-4 w-4 animate-spin" /> {lang === 'fr' ? 'Synchronisation…' : 'Syncing…'}</> : <><DownloadCloud className="h-4 w-4" /> {preparedTrip ? (lang === 'fr' ? 'Mettre à jour les taux' : 'Update rates') : (lang === 'fr' ? `Préparer ${destination.country} hors connexion` : `Prepare ${destination.countryEn} offline`)}</>}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
