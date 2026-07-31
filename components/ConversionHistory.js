import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, ArrowRight, Database } from 'lucide-react';
import { getTranslation } from '../lib/i18n';
import { getCurrencyByCode } from '../lib/currencies';

export default function ConversionHistory({ history = [], onClear, onSelectPair, lang = 'fr' }) {
  if (!history || history.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 backdrop-blur-md text-center">
        <History className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
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
    <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <History className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {getTranslation(lang, 'history')}
          </h3>
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
            {history.length}
          </span>
        </div>

        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          aria-label={getTranslation(lang, 'clearHistory')}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{getTranslation(lang, 'clearHistory')}</span>
        </button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
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
                className="group flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span className="font-mono">
                    {formatNumber(item.amount, fromCurr.decimals)} {item.from}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {formatNumber(item.result, toCurr.decimals)} {item.to}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  {item.isOffline && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                      <Database className="w-2.5 h-2.5" /> {getTranslation(lang, 'offlineBadge')}
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
