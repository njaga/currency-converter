import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRightLeft,
  CheckCircle,
  ChevronDown,
  Download,
  Globe,
  History,
  Moon,
  RefreshCw,
  Share2,
  Star,
  Sun,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import * as Flags from 'country-flag-icons/react/3x2';

import { getCurrencyByCode } from '../lib/currencies';
import { calculateCrossRate, getExchangeRates } from '../lib/rates';
import {
  clearConversionHistory,
  getConversionHistory,
  getFavorites,
  saveConversionHistory,
  saveFavorite,
} from '../lib/db';
import { getTranslation, TRANSLATIONS } from '../lib/i18n';

import ConversionHistory from './ConversionHistory';
import CurrencySelectorModal from './CurrencySelectorModal';
import LandingFeatures from './LandingFeatures';
import Logo from './Logo';
import MarketingSections from './MarketingSections';
import OfflineBadge from './OfflineBadge';
import PopularRatesGrid from './PopularRatesGrid';

const Flag = ({ country, className = 'w-7 h-5' }) => {
  if (!country) return null;
  const FlagComponent = Flags[country.toUpperCase()];
  return FlagComponent
    ? <FlagComponent className={`${className} rounded-xs shadow-xs flex-shrink-0 object-cover`} />
    : null;
};

const parseAmount = (value) => {
  const normalized = String(value ?? '')
    .trim()
    .replace(/[\s\u00A0]/g, '')
    .replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
};

const ThemeToggle = ({ isDark, onToggle }) => (
  <button onClick={onToggle} className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/15 transition-colors" aria-label="Toggle theme">
    {isDark ? <Moon className="w-4 h-4 text-white" /> : <Sun className="w-4 h-4 text-amber-400" />}
  </button>
);

const LanguageSelector = ({ lang, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const languages = [
    { code: 'fr', label: 'Français (FR)' },
    { code: 'en', label: 'English (EN)' },
    { code: 'es', label: 'Español (ES)' },
    { code: 'wo', label: 'Wolof (WO)' },
  ];

  useEffect(() => {
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setIsOpen((value) => !value)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors border border-white/10">
        <Globe className="w-3.5 h-3.5 text-blue-400" />
        <span className="uppercase font-bold">{lang}</span>
        <ChevronDown className="w-3 h-3 opacity-70" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute right-0 mt-2 w-40 py-1 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 z-50 overflow-hidden text-slate-200">
            {languages.map((item) => (
              <button key={item.code} onClick={() => { onChange(item.code); setIsOpen(false); }} className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium ${lang === item.code ? 'bg-blue-600/30 text-blue-400 font-bold' : 'hover:bg-slate-800'}`}>
                {item.label}
                {lang === item.code && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Toast = ({ message, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-2xl">
        <CheckCircle className="w-4 h-4 text-emerald-400" /> {message}
      </motion.div>
    )}
  </AnimatePresence>
);

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('XOF');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [allRates, setAllRates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [rateSource, setRateSource] = useState('unavailable');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('converter');
  const [modalConfig, setModalConfig] = useState({ isOpen: false, target: 'from' });
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState('fr');
  const [toast, setToast] = useState({ message: '', visible: false });
  const [pwaPrompt, setPwaPrompt] = useState(null);
  const inputRef = useRef(null);
  const requestIdRef = useRef(0);

  const showToast = useCallback((message) => {
    setToast({ message, visible: true });
    window.setTimeout(() => setToast({ message: '', visible: false }), 2500);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang && TRANSLATIONS[savedLang]) setLang(savedLang);

    Promise.all([getFavorites(5), getConversionHistory(15)]).then(([savedFavorites, savedHistory]) => {
      setFavorites(savedFavorites);
      setHistory(savedHistory);
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const updateNetwork = () => setIsOffline(!navigator.onLine);
    const captureInstallPrompt = (event) => { event.preventDefault(); setPwaPrompt(event); };
    updateNetwork();
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);
    window.addEventListener('beforeinstallprompt', captureInstallPrompt);
    return () => {
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt);
    };
  }, []);

  const fetchRates = useCallback(async (rawAmount, from, to, forceRefresh = false) => {
    const numericAmount = parseAmount(rawAmount);
    const requestId = ++requestIdRef.current;

    if (!numericAmount || numericAmount <= 0) {
      setExchangeRate(null);
      setConvertedAmount(null);
      return;
    }

    setIsLoading(true);
    setExchangeRate(null);
    setConvertedAmount(null);

    try {
      const data = await getExchangeRates('EUR', forceRefresh);
      if (requestId !== requestIdRef.current) return;

      setAllRates(data.rates || {});
      setRateSource(data.source || 'unavailable');
      setIsOffline(Boolean(data.isOffline));
      setLastUpdated(data.timestamp || null);

      const rate = calculateCrossRate(from, to, data.rates, 'EUR');
      if (!Number.isFinite(rate) || rate <= 0) return;

      const result = numericAmount * rate;
      setExchangeRate(rate);
      setConvertedAmount(result);

      await saveConversionHistory({
        from,
        to,
        amount: numericAmount,
        result,
        rate,
        source: data.source,
        rateTimestamp: data.timestamp || null,
        isOffline: data.isOffline,
      });
      setHistory(await getConversionHistory(15));
    } catch {
      if (requestId === requestIdRef.current) {
        setRateSource('unavailable');
        setExchangeRate(null);
        setConvertedAmount(null);
      }
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (amount) fetchRates(amount, fromCurrency, toCurrency);
      else { setExchangeRate(null); setConvertedAmount(null); }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [amount, fromCurrency, toCurrency, fetchRates]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '/' && !event.target.closest('input,textarea')) { event.preventDefault(); inputRef.current?.focus(); }
      if (event.key === 'Escape') inputRef.current?.blur();
      if (event.key.toLowerCase() === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fromCurrency, toCurrency]);

  const saveCurrentFavorite = async () => {
    const numericAmount = parseAmount(amount || '100');
    if (!numericAmount || !exchangeRate) return showToast(getTranslation(lang, 'enterAmount'));
    await saveFavorite({ amount: numericAmount, from: fromCurrency, to: toCurrency, rate: exchangeRate });
    setFavorites(await getFavorites(5));
    showToast(getTranslation(lang, 'saved'));
  };

  const clearHistory = async () => {
    await clearConversionHistory();
    setHistory([]);
    showToast(getTranslation(lang, 'historyCleared'));
  };

  const installPwa = async () => {
    if (!pwaPrompt) return;
    pwaPrompt.prompt();
    const { outcome } = await pwaPrompt.userChoice;
    if (outcome === 'accepted') setPwaPrompt(null);
  };

  const shareApp = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'AfriChange', text: getTranslation(lang, 'subtitle'), url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); showToast(getTranslation(lang, 'copiedToClipboard')); }
    } catch { /* sharing can be cancelled by the user */ }
  };

  const fromInfo = getCurrencyByCode(fromCurrency);
  const toInfo = getCurrencyByCode(toCurrency);
  const numericAmount = parseAmount(amount);
  const hasAmount = numericAmount !== null && numericAmount > 0;
  const formatNum = (number, decimals = 2) => new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(number) ? number : 0);

  const tabClass = (tab) => `flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="bg-[#0a142f] text-white pt-5 pb-28 md:pb-32 px-4 relative overflow-hidden rounded-b-[40px] md:rounded-b-[65px] shadow-xl">
        <header className="relative z-20 max-w-6xl mx-auto flex items-center justify-between pb-8 border-b border-white/10">
          <Logo size="md" showText variant="light" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            {pwaPrompt && <button onClick={installPwa} className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-xs font-bold"><Download className="w-3.5 h-3.5" />{getTranslation(lang, 'installPwa')}</button>}
            <button onClick={shareApp} className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/15" aria-label={getTranslation(lang, 'shareApp')}><Share2 className="w-4 h-4" /></button>
            <LanguageSelector lang={lang} onChange={(value) => { setLang(value); localStorage.setItem('app_lang', value); }} />
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark((value) => !value)} />
          </div>
        </header>
        <div className="relative z-10 text-center max-w-3xl mx-auto pt-8 pb-4 space-y-2.5">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">{getTranslation(lang, 'heroTitle')}</h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto">{getTranslation(lang, 'heroSubtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-30 mb-16">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 md:p-8 space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <button onClick={() => setActiveTab('converter')} className={tabClass('converter')}><ArrowRightLeft className="w-4 h-4" />{getTranslation(lang, 'tabConverter')}</button>
            <button onClick={() => setActiveTab('rates')} className={tabClass('rates')}><TrendingUp className="w-4 h-4" />{getTranslation(lang, 'tabRates')}</button>
            <button onClick={() => setActiveTab('history')} className={tabClass('history')}><History className="w-4 h-4" />{getTranslation(lang, 'tabHistory')}</button>
          </div>

          {activeTab === 'converter' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{getTranslation(lang, 'from')}</span>
                  <div className="flex items-center gap-2">
                    <input ref={inputRef} type="text" inputMode="decimal" autoComplete="off" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="1,00" className="w-full text-2xl md:text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 bg-transparent focus:outline-none min-h-[44px]" />
                    <button onClick={() => setModalConfig({ isOpen: true, target: 'from' })} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-[44px]"><Flag country={fromInfo.country} className="w-6 h-4" /><strong>{fromCurrency}</strong><ChevronDown className="w-3.5 h-3.5 text-slate-400" /></button>
                  </div>
                </div>

                <button onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }} className="mx-auto p-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 min-w-[44px] min-h-[44px]" aria-label={getTranslation(lang, 'swap')}><ArrowRightLeft className="w-4 h-4" /></button>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{getTranslation(lang, 'to')}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-full text-2xl md:text-3xl font-extrabold font-mono min-h-[44px] flex items-center">
                      {isLoading ? <RefreshCw className="w-6 h-6 animate-spin text-blue-500" /> : hasAmount && convertedAmount !== null ? <span className="text-blue-600 dark:text-blue-400">{formatNum(convertedAmount, toInfo.decimals)}</span> : <span className="text-slate-300 dark:text-slate-600">—</span>}
                    </div>
                    <button onClick={() => setModalConfig({ isOpen: true, target: 'to' })} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-[44px]"><Flag country={toInfo.country} className="w-6 h-4" /><strong>{toCurrency}</strong><ChevronDown className="w-3.5 h-3.5 text-slate-400" /></button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <div className="space-y-1">
                  {exchangeRate && hasAmount ? <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono">1 {fromCurrency} = {formatNum(exchangeRate, 4)} {toCurrency}</h4> : <p className="text-xs text-slate-400">{rateSource === 'unavailable' && hasAmount ? (lang === 'fr' ? 'Aucun taux fiable disponible pour cette paire.' : 'No reliable rate is available for this pair.') : getTranslation(lang, 'enterAmountHint')}</p>}
                  <OfflineBadge isOffline={isOffline} source={rateSource} timestamp={lastUpdated} onRefresh={() => fetchRates(amount || '100', fromCurrency, toCurrency, true)} lang={lang} />
                </div>
                <button onClick={saveCurrentFavorite} disabled={!exchangeRate} className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-xs font-bold disabled:opacity-40"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{getTranslation(lang, 'saveFavorite')}</button>
              </div>
            </div>
          )}

          {activeTab === 'rates' && <PopularRatesGrid allRates={allRates} onSelectPair={(from, to) => { setFromCurrency(from); setToCurrency(to); setActiveTab('converter'); }} lang={lang} />}

          {activeTab === 'history' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 mb-3"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /><h4 className="text-xs font-bold uppercase tracking-wider">{getTranslation(lang, 'favorites')}</h4></div>
                {favorites.length ? favorites.map((favorite) => (
                  <button key={favorite.pair || `${favorite.from}_${favorite.to}`} onClick={() => { setFromCurrency(favorite.from); setToCurrency(favorite.to); setAmount(String(favorite.amount)); setActiveTab('converter'); }} className="w-full flex items-center justify-between p-3 mb-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-left">
                    <strong>{favorite.amount} {favorite.from} → {favorite.to}</strong><span className="text-blue-600 font-bold">1 {favorite.from} = {formatNum(favorite.rate, 4)} {favorite.to}</span>
                  </button>
                )) : <p className="text-xs text-slate-400 text-center py-4">{getTranslation(lang, 'noFavorites')}</p>}
              </div>
              <ConversionHistory history={history} onClear={clearHistory} onSelectPair={(from, to, value) => { setFromCurrency(from); setToCurrency(to); if (value) setAmount(String(value)); setActiveTab('converter'); }} lang={lang} />
            </div>
          )}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-16 space-y-16">
        <LandingFeatures lang={lang} />
        <MarketingSections lang={lang} allRates={allRates} onSelectPair={(from, to) => { setFromCurrency(from); setToCurrency(to); setActiveTab('converter'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onOpenSelectorModal={(target) => setModalConfig({ isOpen: true, target })} pwaPrompt={pwaPrompt} onInstall={installPwa} />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showText />
          <div className="flex items-center gap-4"><Link href="/mentions-legales" className="hover:text-blue-600">{getTranslation(lang, 'legal')}</Link><span>•</span><a href="https://ndiagandiaye.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 font-semibold">{getTranslation(lang, 'by')} Ndiaga Ndiaye</a></div>
        </div>
      </footer>

      <CurrencySelectorModal isOpen={modalConfig.isOpen} onClose={() => setModalConfig((value) => ({ ...value, isOpen: false }))} selectedCode={modalConfig.target === 'from' ? fromCurrency : toCurrency} onSelect={(code) => { if (modalConfig.target === 'from') setFromCurrency(code); else setToCurrency(code); }} label={modalConfig.target === 'from' ? getTranslation(lang, 'from') : getTranslation(lang, 'to')} lang={lang} />
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
