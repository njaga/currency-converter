import React, { useMemo, useState } from 'react';
import * as Flags from 'country-flag-icons/react/3x2';
import { CURRENCIES, getCurrencyByCode } from '../lib/currencies';
import { calculateCrossRate } from '../lib/rates';

const DEFAULT_TARGETS = ['EUR', 'USD', 'GBP', 'XOF', 'NGN', 'GHS', 'GMD', 'SLE', 'KES', 'MAD', 'ZAR'];

const FlagIcon = ({ countryCode }) => {
  if (!countryCode) return null;
  const Component = Flags[countryCode.toUpperCase()];
  return Component ? <Component className="h-4 w-6 rounded-sm border border-black/5 object-cover" /> : null;
};

export default function XeStyleLiveRates({ allRates = {}, onSelectPair, lang = 'fr' }) {
  const [baseCurrency, setBaseCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1');
  const locale = lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US';
  const numericAmount = Number(String(amount).replace(',', '.')) || 1;
  const baseInfo = getCurrencyByCode(baseCurrency);

  const targets = useMemo(
    () => DEFAULT_TARGETS.filter((code) => code !== baseCurrency),
    [baseCurrency]
  );

  const formatNumber = (value, decimals = 2) => {
    if (!Number.isFinite(value)) return '—';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: Math.min(decimals, 2),
      maximumFractionDigits: Math.min(Math.max(decimals, 2), 4),
    }).format(value);
  };

  return (
    <div className="border-y border-slate-200 dark:border-slate-800">
      <div className="flex flex-col gap-4 border-b border-slate-200 py-4 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
            {lang === 'fr' ? 'Devise de référence' : 'Base currency'}
          </label>
          <div className="flex items-center gap-2">
            <FlagIcon countryCode={baseInfo.country} />
            <select
              value={baseCurrency}
              onChange={(event) => setBaseCurrency(event.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-950 outline-none dark:text-white"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} — {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sm:text-right">
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
            {lang === 'fr' ? 'Montant' : 'Amount'}
          </label>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            className="w-32 border-b border-slate-300 bg-transparent pb-1 text-right font-mono text-sm font-semibold outline-none focus:border-emerald-700 dark:border-slate-700 dark:focus:border-emerald-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-[0.08em] text-slate-400 dark:border-slate-800">
              <th className="py-3 pr-4 font-medium">{lang === 'fr' ? 'Devise' : 'Currency'}</th>
              <th className="py-3 pr-4 font-medium">{lang === 'fr' ? 'Nom' : 'Name'}</th>
              <th className="py-3 pr-4 text-right font-medium">{lang === 'fr' ? `Pour ${numericAmount} ${baseCurrency}` : `For ${numericAmount} ${baseCurrency}`}</th>
              <th className="py-3 text-right font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
            {targets.map((targetCode) => {
              const target = getCurrencyByCode(targetCode);
              const rate = calculateCrossRate(baseCurrency, targetCode, allRates, 'EUR');
              const value = Number.isFinite(rate) ? rate * numericAmount : null;
              return (
                <tr key={targetCode} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <FlagIcon countryCode={target.country} />
                      <span className="text-sm font-semibold text-slate-950 dark:text-white">{targetCode}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-sm text-slate-500 dark:text-slate-400">{target.name}</td>
                  <td className="py-3.5 pr-4 text-right font-mono text-sm font-semibold text-slate-950 dark:text-white">
                    {formatNumber(value, target.decimals)}
                  </td>
                  <td className="py-3.5 text-right">
                    <button onClick={() => onSelectPair?.(baseCurrency, targetCode)} className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
                      {lang === 'fr' ? 'Convertir' : 'Convert'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-200 py-3 text-xs text-slate-400 dark:border-slate-800">
        {lang === 'fr'
          ? 'Les valeurs affichées utilisent les derniers taux disponibles dans AfriChange. Aucune variation 24 h fictive n’est générée.'
          : 'Values use the latest rates available in AfriChange. No fake 24-hour market movement is generated.'}
      </div>
    </div>
  );
}
