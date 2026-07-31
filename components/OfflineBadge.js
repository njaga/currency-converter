import React from 'react';
import { Wifi, WifiOff, Database, RefreshCw, AlertCircle } from 'lucide-react';
import { getTranslation } from '../lib/i18n';

export default function OfflineBadge({ isOffline, source, timestamp, onRefresh, lang = 'fr' }) {
  const isStale = timestamp ? Date.now() - timestamp > 86400000 : false;

  const formatDate = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] ${
          isOffline 
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' 
            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
          {isOffline ? getTranslation(lang, 'offlineMode') : getTranslation(lang, 'onlineMode')}
        </span>

        {source === 'indexeddb_cache' && (
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
            <Database className="w-3 h-3 text-blue-500" /> {getTranslation(lang, 'cacheIndexedDB')}
          </span>
        )}

        {timestamp && (
          <span className="text-slate-400 dark:text-slate-500 text-[11px] hidden sm:inline">
            • {formatDate(timestamp)}
          </span>
        )}

        {isStale && isOffline && (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold">
            <AlertCircle className="w-3 h-3" /> {getTranslation(lang, 'staleRates')}
          </span>
        )}
      </div>

      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        aria-label={getTranslation(lang, 'refresh')}
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>{getTranslation(lang, 'refresh')}</span>
      </button>
    </div>
  );
}
