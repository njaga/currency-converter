import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, X, Check, Globe } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import { CURRENCIES, REGIONS, REGION_NAMES } from '../lib/currencies';
import { getTranslation } from '../lib/i18n';

const FlagIcon = ({ countryCode, className = 'w-7 h-5' }) => {
  if (!countryCode) return null;
  const isoCode = countryCode.toUpperCase();
  const Component = Flags[isoCode];
  if (!Component) return <Globe className={`${className} text-slate-400`} />;
  return <Component className={`${className} flex-shrink-0 rounded-sm object-cover shadow-xs`} />;
};

export default function CurrencySelectorModal({ isOpen, onClose, selectedCode, onSelect, label, lang = 'fr' }) {
  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState(REGIONS.ALL);
  const reduceMotion = useReducedMotion();

  const filteredCurrencies = useMemo(() => CURRENCIES.filter((currency) => {
    const needle = search.toLowerCase();
    const matchesSearch = currency.code.toLowerCase().includes(needle) || currency.name.toLowerCase().includes(needle);
    const matchesRegion = activeRegion === REGIONS.ALL || currency.region === activeRegion;
    return matchesSearch && matchesRegion;
  }), [search, activeRegion]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setActiveRegion(REGIONS.ALL);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[200] flex max-w-full items-end justify-center overflow-hidden bg-slate-900/60 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-[max(8px,env(safe-area-inset-top))] backdrop-blur-sm sm:items-center sm:p-6"
        onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
        role="dialog"
        aria-modal="true"
        aria-label={label || getTranslation(lang, 'selectCurrency')}
      >
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 24 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex max-h-[min(88dvh,760px)] w-full min-w-0 max-w-lg flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-3xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex min-w-0 items-center justify-between border-b border-slate-100 p-4 sm:p-5 dark:border-slate-800">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">{label || getTranslation(lang, 'selectCurrency')}</h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{filteredCurrencies.length} {getTranslation(lang, 'currenciesAvailable')}</p>
            </div>
            <button onClick={onClose} className="flex h-11 w-11 flex-none items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label={getTranslation(lang, 'close') || 'Close'}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border-b border-slate-100 bg-slate-50/50 p-3 sm:p-4 dark:border-slate-800/60 dark:bg-slate-900/50">
            <div className="relative min-w-0">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={getTranslation(lang, 'searchCurrency')}
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-base text-slate-900 placeholder-slate-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:text-sm"
                autoFocus
                enterKeyHint="search"
              />
              {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"><X className="h-3.5 w-3.5" /></button>}
            </div>

            <div className="mt-3 flex max-w-full gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {Object.values(REGIONS).map((region) => {
                const selected = activeRegion === region;
                const regionName = REGION_NAMES[lang]?.[region] || REGION_NAMES.fr[region];
                return <button key={region} onClick={() => setActiveRegion(region)} className={`flex-none whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-all ${selected ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}>{regionName}</button>;
              })}
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden overscroll-contain p-2 sm:p-3">
            {filteredCurrencies.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400">{getTranslation(lang, 'noCurrencyFound')} &quot;{search}&quot;</div>
            ) : filteredCurrencies.map((currency) => {
              const selected = selectedCode === currency.code;
              return (
                <motion.button
                  key={currency.code}
                  onClick={() => { onSelect(currency.code); onClose(); }}
                  whileHover={reduceMotion ? undefined : { x: 2 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className={`flex min-h-[60px] w-full min-w-0 max-w-full items-center justify-between rounded-2xl border p-3 text-left transition-all ${selected ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/40' : 'border-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/60'}`}
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <FlagIcon countryCode={currency.country} className="h-5 w-8 rounded" />
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2"><span className="text-base font-bold text-slate-900 dark:text-slate-100">{currency.code}</span><span className="flex-none rounded bg-slate-200/70 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{currency.symbol}</span></div>
                      <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{currency.name}</p>
                    </div>
                  </div>
                  {selected && <div className="flex-none rounded-full bg-emerald-600 p-1 text-white shadow-sm"><Check className="h-4 w-4" /></div>}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
