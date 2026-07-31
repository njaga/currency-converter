import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check, Globe } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import { CURRENCIES, REGIONS, REGION_NAMES } from '../lib/currencies';
import { getTranslation } from '../lib/i18n';

// Flag component with ISO uppercase resolution
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

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset search when modal opens
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
        onClick={(e) => {
          // Close on backdrop click
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
          className="w-full max-w-lg max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {label || getTranslation(lang, 'selectCurrency')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {filteredCurrencies.length} {getTranslation(lang, 'currenciesAvailable')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={getTranslation(lang, 'close') || 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={getTranslation(lang, 'searchCurrency')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Region Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar scrollbar-none">
              {Object.values(REGIONS).map((reg) => {
                const isSelected = activeRegion === reg;
                const regName = REGION_NAMES[lang]?.[reg] || REGION_NAMES.fr[reg];
                return (
                  <button
                    key={reg}
                    onClick={() => setActiveRegion(reg)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {regName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Currencies List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 max-h-[50vh]">
            {filteredCurrencies.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
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
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60'
                        : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <FlagIcon countryCode={currency.country} className="w-8 h-5 rounded" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                            {currency.code}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {currency.symbol}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {currency.name}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="p-1 rounded-full bg-blue-600 text-white shadow-sm">
                        <Check className="w-4 h-4" />
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
