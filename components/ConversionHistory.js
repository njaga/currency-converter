import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, ArrowRight, Database } from 'lucide-react';
import { getTranslation } from '../lib/i18n';
import { getCurrencyByCode } from '../lib/currencies';

export default function ConversionHistory({ history = [], onClear, onSelectPair, lang = 'fr' }) {
  if (!history || history.length === 0) {
    return (
      <div className="max-w-full rounded-3xl border border-slate-200/60 bg-white/70 p-6 text-center backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/50">
        <History className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {getTranslation(lang, 'noHistory')}
        </p>
      </div>
    );
  }

  const formatTime = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num, decimals = 2) => {
    return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 p-5 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/50">
      <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex-none rounded-lg bg-blue-500/10 p-1.5 text-blue-600 dark:text-blue-400">
            <History className="h-4 w-4" />
          </div>
          <h3 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
            {getTranslation(lang, 'history')}
          </h3>
          <span className="flex-none rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
            {history.length}
          </span>
        </div>

        <button
          onClick={onClear}
          className="inline-flex flex-none items-center gap-1 rounded-lg p-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
          aria-label={getTranslation(lang, 'clearHistory')}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{getTranslation(lang, 'clearHistory')}</span>
        </button>
      </div>

      <div className="max-h-60 max-w-full space-y-2 overflow-x-hidden overflow-y-auto pr-1">
        <AnimatePresence>
          {history.map((item, idx) => {
            const fromCurr = getCurrencyByCode(item.from);
            const toCurr = getCurrencyByCode(item.to);

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => onSelectPair && onSelectPair(item.from, item.to, item.amount)}
                className="group flex min-w-0 max-w-full cursor-pointer flex-col gap-2 rounded-2xl border border-slate-200/50 bg-slate-50/80 p-3 transition-all hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-blue-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span className="min-w-0 break-all font-mono">
                    {formatNumber(item.amount, fromCurr.decimals)} {item.from}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 flex-none text-slate-400 transition-colors group-hover:text-blue-500" />
                  <span className="min-w-0 break-all font-mono font-bold text-blue-600 dark:text-blue-400">
                    {formatNumber(item.result, toCurr.decimals)} {item.to}
                  </span>
                </div>

                <div className="flex flex-none flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  {item.isOffline && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                      <Database className="h-2.5 w-2.5 flex-none" /> {getTranslation(lang, 'offlineBadge')}
                    </span>
                  )}
                  <span className="font-mono">{formatTime(item.timestamp)}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
