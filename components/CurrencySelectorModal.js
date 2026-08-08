import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check, Globe } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import { CURRENCIES, REGIONS, REGION_NAMES } from '../lib/currencies';
import { getTranslation } from '../lib/i18n';

const FlagIcon = ({ countryCode, className = 'w-7 h-5' }) => {
  if (!countryCode) return null;
  const isoCode = countryCode.toUpperCase();
  const Component = Flags[isoCode];
  if (!Component) return <Globe className={`${className} text-slate-400`} />;
  return <Component className={`${className} rounded-sm shadow-xs object-cover flex-shrink-0`} />;
};

export default function CurrencySelectorModal({ isOpen, onClose, selectedCode, onSelect, label, lang = 'fr' }) {
  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState(REGIONS.ALL);

  const filteredCurrencies = useMemo(() => {
    return CURRENCIES.filter((c) => {
      const matchesSearch =
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = activeRegion === REGIONS.ALL || c.region === activeRegion;
      return matchesSearch && matchesRegion;
    });
  }, [search, activeRegion]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
        className="fixed inset-0 z-50 flex max-w-full items-center justify-center overflow-x-hidden bg-slate-900/60 p-4 backdrop-blur-sm sm:p-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-label={label || getTranslation(lang, 'selectCurrency')}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex max-h-[85vh] w-full min-w-0 max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex min-w-0 items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">
                {label || getTranslation(lang, 'selectCurrency')}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {filteredCurrencies.length} {getTranslation(lang, 'currenciesAvailable')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-none rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label={getTranslation(lang, 'close') || 'Close'}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border-b border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-900/50">
            <div className="relative min-w-0">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={getTranslation(lang, 'searchCurrency')}
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex max-w-full flex-wrap items-center gap-1.5 pt-3">
              {Object.values(REGIONS).map((reg) => {
                const isSelected = activeRegion === reg;
                const regName = REGION_NAMES[lang]?.[reg] || REGION_NAMES.fr[reg];
                return (
                  <button
                    key={reg}
                    onClick={() => setActiveRegion(reg)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    {regName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-h-[50vh] flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-3">
            {filteredCurrencies.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400">
                {getTranslation(lang, 'noCurrencyFound')} &quot;{search}&quot;
              </div>
            ) : (
              filteredCurrencies.map((currency) => {
                const isSelected = selectedCode === currency.code;
                return (
                  <motion.button
                    key={currency.code}
                    onClick={() => {
                      onSelect(currency.code);
                      onClose();
                    }}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex w-full min-w-0 max-w-full items-center justify-between rounded-2xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-blue-200 bg-blue-50 dark:border-blue-800/60 dark:bg-blue-950/40'
                        : 'border-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <FlagIcon countryCode={currency.country} className="h-5 w-8 rounded" />
                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                            {currency.code}
                          </span>
                          <span className="flex-none rounded bg-slate-200/70 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {currency.symbol}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                          {currency.name}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex-none rounded-full bg-blue-600 p-1 text-white shadow-sm">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </motion.button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
