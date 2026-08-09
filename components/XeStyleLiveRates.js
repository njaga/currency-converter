import React, { useMemo, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import { CURRENCIES, getCurrencyByCode } from '../lib/currencies';
import { calculateCrossRate } from '../lib/rates';

const FlagIcon = ({ countryCode }) => {
  if (!countryCode) return null;
  const Component = Flags[countryCode.toUpperCase()];
  return Component ? <Component className="h-5 w-7 rounded-sm border border-black/5 object-cover" /> : null;
};

const DEFAULT_TARGETS = ['XOF', 'GMD', 'SLE', 'GHS', 'NGN', 'USD', 'GBP', 'KES'];

export default function XeStyleLiveRates({ allRates = {}, onSelectPair, lang = 'fr' }) {
  const [baseCurrency, setBaseCurrency] = useState('EUR');
  const baseInfo = getCurrencyByCode(baseCurrency);
  const targets = useMemo(() => DEFAULT_TARGETS.filter((code) => code !== baseCurrency), [baseCurrency]);
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  const formatNum = (num) => Number.isFinite(num) ? new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }).format(num) : '—';

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_70px_-52px_rgba(15,23,42,.4)] dark:border-white/10 dark:bg-slate-900/50">
      <div className="flex min-w-0 max-w-full flex-col gap-4 border-b border-slate-200/80 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-slate-900/70">
        <div className="min-w-0 max-w-full"><p className="text-xs font-medium text-slate-400">{lang === 'fr' ? 'Devise de référence' : 'Base currency'}</p><div className="mt-1 flex min-w-0 max-w-full items-center gap-2"><FlagIcon countryCode={baseInfo.country} /><div className="relative min-w-0 max-w-full flex-1"><select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)} className="block w-full max-w-full appearance-none truncate bg-transparent pr-6 text-sm font-semibold text-slate-950 outline-none dark:text-white">{CURRENCIES.map((currency) => <option key={currency.code} value={currency.code}>{currency.code} · {currency.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /></div></div></div>
        <div className="inline-flex flex-none items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{lang === 'fr' ? 'Taux synchronisés' : 'Synced rates'}</div>
      </div>

      <div className="hidden grid-cols-[1.2fr_.7fr_auto] gap-4 border-b border-slate-100 px-5 py-3 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400 sm:grid dark:border-white/10"><span>Devise</span><span>1 {baseCurrency}</span><span /></div>
      <div className="divide-y divide-slate-100 dark:divide-white/10">
        {targets.map((targetCode) => {
          const target = getCurrencyByCode(targetCode);
          const rate = calculateCrossRate(baseCurrency, targetCode, allRates, 'EUR');
          return (
            <button key={targetCode} onClick={() => onSelectPair?.(baseCurrency, targetCode)} className="group grid w-full min-w-0 max-w-full gap-3 px-5 py-4 text-left transition-all duration-200 hover:bg-emerald-50/60 active:bg-emerald-100/60 dark:hover:bg-emerald-950/10 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,.7fr)_auto] sm:items-center">
              <div className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-11 flex-none items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-100 dark:bg-slate-950 dark:ring-white/10"><FlagIcon countryCode={target.country} /></span><div className="min-w-0"><p className="text-sm font-semibold text-slate-950 dark:text-white">{targetCode}</p><p className="mt-0.5 truncate text-xs text-slate-500">{target.name}</p></div></div>
              <p className="min-w-0 truncate font-mono text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-200">{formatNum(rate)}</p>
              <span className="inline-flex h-9 w-9 flex-none items-center justify-center justify-self-start rounded-full border border-slate-200 text-slate-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:border-emerald-300 group-hover:bg-white group-hover:text-emerald-700 dark:border-white/10 dark:group-hover:bg-slate-900 sm:justify-self-end"><ArrowRight className="h-3.5 w-3.5" /></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
