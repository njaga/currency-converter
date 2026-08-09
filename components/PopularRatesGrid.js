import React, { useMemo, useState } from 'react';
import * as Flags from 'country-flag-icons/react/3x2';
import { calculateCrossRate } from '../lib/rates';
import { getCurrencyByCode, REGIONS, REGION_NAMES } from '../lib/currencies';

const FlagIcon = ({ countryCode }) => {
  if (!countryCode) return null;
  const Component = Flags[countryCode.toUpperCase()];
  return Component ? <Component className="h-4 w-6 rounded-sm border border-black/5 object-cover" /> : null;
};

const MARKET_PAIRS = [
  { from: 'EUR', to: 'XOF', region: REGIONS.WEST_AFRICA },
  { from: 'EUR', to: 'GMD', region: REGIONS.WEST_AFRICA },
  { from: 'EUR', to: 'SLE', region: REGIONS.WEST_AFRICA },
  { from: 'EUR', to: 'GHS', region: REGIONS.WEST_AFRICA },
  { from: 'EUR', to: 'NGN', region: REGIONS.WEST_AFRICA },
  { from: 'EUR', to: 'XAF', region: REGIONS.CENTRAL_AFRICA },
  { from: 'EUR', to: 'CDF', region: REGIONS.CENTRAL_AFRICA },
  { from: 'EUR', to: 'KES', region: REGIONS.EAST_AFRICA },
  { from: 'EUR', to: 'TZS', region: REGIONS.EAST_AFRICA },
  { from: 'EUR', to: 'MAD', region: REGIONS.NORTH_AFRICA },
  { from: 'EUR', to: 'EGP', region: REGIONS.NORTH_AFRICA },
  { from: 'USD', to: 'ZAR', region: REGIONS.SOUTHERN_AFRICA },
  { from: 'EUR', to: 'USD', region: REGIONS.INTERNATIONAL },
  { from: 'GBP', to: 'EUR', region: REGIONS.INTERNATIONAL },
];

export default function PopularRatesGrid({ allRates = {}, onSelectPair, lang = 'fr' }) {
  const [activeRegion, setActiveRegion] = useState(REGIONS.ALL);
  const pairs = useMemo(() => activeRegion === REGIONS.ALL ? MARKET_PAIRS : MARKET_PAIRS.filter((pair) => pair.region === activeRegion), [activeRegion]);
  const locale = lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US';

  const formatRate = (value, decimals = 2) => {
    if (!Number.isFinite(value)) return '—';
    return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  };

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {Object.values(REGIONS).map((region) => (
          <button key={region} onClick={() => setActiveRegion(region)} className={`whitespace-nowrap border-b-2 px-1 pb-2 text-xs font-medium ${activeRegion === region ? 'border-emerald-700 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
            {REGION_NAMES[lang]?.[region] || REGION_NAMES.fr[region]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border-y border-slate-200 dark:border-slate-800">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-[0.08em] text-slate-400 dark:border-slate-800">
              <th className="py-3 pr-4 font-medium">{lang === 'fr' ? 'Paire' : 'Pair'}</th>
              <th className="py-3 pr-4 font-medium">{lang === 'fr' ? 'Devise' : 'Currency'}</th>
              <th className="py-3 text-right font-medium">{lang === 'fr' ? 'Taux' : 'Rate'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
            {pairs.map((pair) => {
              const from = getCurrencyByCode(pair.from);
              const to = getCurrencyByCode(pair.to);
              const rate = calculateCrossRate(pair.from, pair.to, allRates, 'EUR');
              return (
                <tr key={`${pair.from}-${pair.to}`} onClick={() => onSelectPair?.(pair.from, pair.to)} className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5"><div className="flex -space-x-1"><FlagIcon countryCode={from.country} /><FlagIcon countryCode={to.country} /></div><span className="text-sm font-semibold">{pair.from} / {pair.to}</span></div>
                  </td>
                  <td className="py-3.5 pr-4 text-sm text-slate-500">{to.name}</td>
                  <td className="py-3.5 text-right font-mono text-sm font-semibold">1 {pair.from} = {formatRate(rate, to.decimals)} {pair.to}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
