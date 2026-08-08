import React from 'react';
import { Database, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { getTranslation } from '../lib/i18n';

export default function OfflineBadge({ isOffline, source, timestamp, onRefresh, lang = 'fr' }) {
  const age = timestamp ? Date.now() - timestamp : null;
  const isStale = age !== null && age > 6 * 60 * 60 * 1000;
  const isVeryStale = age !== null && age > 72 * 60 * 60 * 1000;
  const isFixed = source === 'fixed_parity';
  const isUnavailable = source === 'unavailable';
  const isCached = source === 'indexeddb_cache';

  const formatDate = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  };

  const statusLabel = isUnavailable
    ? (lang === 'fr' ? 'Taux indisponible' : 'Rate unavailable')
    : isFixed
      ? (lang === 'fr' ? 'Parité fixe officielle' : 'Official fixed parity')
      : isCached
        ? (lang === 'fr' ? 'Taux en cache' : 'Cached rate')
        : isOffline
          ? getTranslation(lang, 'offlineMode')
          : getTranslation(lang, 'onlineMode');

  const statusClass = isUnavailable || isVeryStale
    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
    : isFixed
      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
      : isOffline || isCached || isStale
        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] ${statusClass}`}>
          <span className="w-2 h-2 rounded-full bg-current opacity-80" />
          {statusLabel}
        </span>

        {isCached && (
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
            <Database className="w-3 h-3 text-blue-500" /> IndexedDB
          </span>
        )}

        {isFixed && (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3 h-3" /> EUR/XOF/XAF
          </span>
        )}

        {timestamp && (
          <span className="text-slate-400 dark:text-slate-500 text-[11px] hidden sm:inline">
            • {formatDate(timestamp)}
          </span>
        )}

        {(isStale || isVeryStale) && isCached && (
          <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-bold ${isVeryStale ? 'bg-red-500/15 text-red-700 dark:text-red-300' : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'}`}>
            <AlertCircle className="w-3 h-3" />
            {isVeryStale
              ? (lang === 'fr' ? 'Taux ancien — indicatif' : 'Old rate — indicative')
              : getTranslation(lang, 'staleRates')}
          </span>
        )}
      </div>

      {!isFixed && (
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          aria-label={getTranslation(lang, 'refresh')}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{getTranslation(lang, 'refresh')}</span>
        </button>
      )}
    </div>
  );
}
