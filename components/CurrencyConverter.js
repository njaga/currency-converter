import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightLeft,
  Star,
  RefreshCw,
  Sun,
  Moon,
  ChevronDown,
  CheckCircle,
  Download,
  Share2,
  Globe,
  Sparkles,
  TrendingUp,
  History,
} from 'lucide-react';
import Link from 'next/link';
import * as Flags from 'country-flag-icons/react/3x2';

import { CURRENCIES, getCurrencyByCode } from '../lib/currencies';
import { getExchangeRates, calculateCrossRate } from '../lib/rates';
import {
  saveConversionHistory,
  getConversionHistory,
  clearConversionHistory,
} from '../lib/db';
import { TRANSLATIONS, getTranslation } from '../lib/i18n';

import Logo from './Logo';
import OfflineBadge from './OfflineBadge';
import CurrencySelectorModal from './CurrencySelectorModal';
import ConversionHistory from './ConversionHistory';
import PopularRatesGrid from './PopularRatesGrid';
import LandingFeatures from './LandingFeatures';
import MarketingSections from './MarketingSections';

// Flag Component
const Flag = ({ country, className = 'w-7 h-5' }) => {
  if (!country) return null;
  const isoCode = country.toUpperCase();
  const FlagComponent = Flags[isoCode];
  if (!FlagComponent) return null;
  return <FlagComponent className={`${className} rounded-xs shadow-xs flex-shrink-0 object-cover`} />;
};

// Theme toggle component
const ThemeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/15 transition-colors"
    aria-label="Toggle theme"
  >
    {isDark ? <Moon className="w-4 h-4 text-white" /> : <Sun className="w-4 h-4 text-amber-400" />}
  </button>
);

// Language Selector Dropdown
const LanguageSelector = ({ lang, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'fr', label: 'Français (FR)' },
    { code: 'en', label: 'English (EN)' },
    { code: 'es', label: 'Español (ES)' },
    { code: 'wo', label: 'Wolof (WO)' },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors border border-white/10"
      >
        <Globe className="w-3.5 h-3.5 text-blue-400" />
        <span className="uppercase font-bold">{lang}</span>
        <ChevronDown className="w-3 h-3 opacity-70" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="absolute right-0 mt-2 w-40 py-1 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 z-50 overflow-hidden text-slate-200"
          >
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  onChange(l.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors ${
                  lang === l.code
                    ? 'bg-blue-600/30 text-blue-400 font-bold'
                    : 'hover:bg-slate-800'
                }`}
              >
                <span>{l.label}</span>
                {lang === l.code && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Toast notification
const Toast = ({ message, isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-2xl border border-slate-800 dark:border-slate-200"
      >
        <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
        <span>{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

// Tab transition variants
const tabVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('XOF');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [allRates, setAllRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [rateSource, setRateSource] = useState('api');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState('fr');
  const [toast, setToast] = useState({ message: '', visible: false });
  const [pwaPrompt, setPwaPrompt] = useState(null);

  // Widget Tabs State ('converter' | 'rates' | 'history')
  const [activeTab, setActiveTab] = useState('converter');

  // Selector Modal state
  const [modalConfig, setModalConfig] = useState({ isOpen: false, target: 'from' });

  const inputRef = useRef(null);
  const isFetchingRef = useRef(false);

  // Show toast feedback
  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2500);
  };

  // Initialize theme & language
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(savedTheme ? savedTheme === 'dark' : prefersDark);

    const savedLang = localStorage.getItem('app_lang');
    if (savedLang && TRANSLATIONS[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  // Handle dark mode side effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Handle language side effect
  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  // Network listener & PWA prompt listener
  useEffect(() => {
    const updateNetworkStatus = () => {
      const offline = typeof navigator !== 'undefined' ? !navigator.onLine : false;
      setIsOffline(offline);
    };

    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    const handlePwaPrompt = (e) => {
      e.preventDefault();
      setPwaPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handlePwaPrompt);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      window.removeEventListener('beforeinstallprompt', handlePwaPrompt);
    };
  }, []);

  // Load favorites & history from IndexedDB / LocalStorage
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedFavs = localStorage.getItem('currency_favorites');
        if (savedFavs) setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.warn('Failed favorites load:', e);
      }

      const dbHistory = await getConversionHistory(15);
      setHistory(dbHistory);
    };
    loadSavedData();
  }, []);

  // Fetch exchange rates handler
  const fetchRates = useCallback(async (amountVal, fromCode, toCode, forceRefresh = false) => {
    if (!amountVal || isNaN(parseFloat(amountVal)) || parseFloat(amountVal) <= 0) {
      setConvertedAmount(null);
      setExchangeRate(null);
      return;
    }

    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      // Get rates using multi-tier rates engine (12h cache-first)
      const data = await getExchangeRates('EUR', forceRefresh);

      if (data && data.rates) {
        setAllRates(data.rates);
        setRateSource(data.source);
        setIsOffline(data.isOffline);
        setLastUpdated(data.timestamp);

        // Calculate rate from -> to using cross rate calculator
        const rate = calculateCrossRate(fromCode, toCode, data.rates, 'EUR');

        if (rate !== null) {
          setExchangeRate(rate);
          const result = parseFloat(amountVal) * rate;
          setConvertedAmount(result);

          // Save to IndexedDB history asynchronously
          const historyEntry = {
            from: fromCode,
            to: toCode,
            amount: parseFloat(amountVal),
            result,
            rate,
            isOffline: data.isOffline,
          };
          saveConversionHistory(historyEntry).then(() => {
            getConversionHistory(15).then(setHistory);
          });
        }
      }
    } catch (e) {
      console.error('Rate calculation error:', e);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Debounced rate calculation when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (amount) {
        fetchRates(amount, fromCurrency, toCurrency);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [amount, fromCurrency, toCurrency, fetchRates]);

  // Swap currencies handler
  const handleSwap = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  // Keyboard shortcuts (/ to focus, Esc to blur, Ctrl+S to swap)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !e.target.closest('input')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
      }
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSwap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwap]);

  // Save favorite handler
  const handleSaveFavorite = () => {
    const numAmount = parseFloat(amount || '100');
    if (isNaN(numAmount) || numAmount <= 0 || !exchangeRate) {
      showToast(getTranslation(lang, 'enterAmount'));
      return;
    }

    const newFav = {
      id: Date.now(),
      amount: numAmount,
      from: fromCurrency,
      to: toCurrency,
      rate: exchangeRate,
    };

    const updated = [newFav, ...favorites.filter((f) => !(f.from === fromCurrency && f.to === toCurrency)).slice(0, 4)];
    setFavorites(updated);
    try {
      localStorage.setItem('currency_favorites', JSON.stringify(updated));
      showToast(getTranslation(lang, 'saved'));
    } catch (e) {
      console.warn('Failed to save fav:', e);
    }
  };

  const handleClearHistory = async () => {
    await clearConversionHistory();
    setHistory([]);
    showToast(getTranslation(lang, 'historyCleared'));
  };

  const handleInstallPwa = async () => {
    if (!pwaPrompt) return;
    pwaPrompt.prompt();
    const { outcome } = await pwaPrompt.userChoice;
    if (outcome === 'accepted') {
      setPwaPrompt(null);
      showToast(getTranslation(lang, 'saved'));
    }
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AfriChange PWA',
        text: getTranslation(lang, 'subtitle'),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(getTranslation(lang, 'copiedToClipboard'));
    }
  };

  const fromInfo = getCurrencyByCode(fromCurrency);
  const toInfo = getCurrencyByCode(toCurrency);

  const formatNum = (num, decimals = 2) => {
    if (num === null || isNaN(num)) return '0.00';
    return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  // Check if we have a valid amount to show result
  const hasAmount = amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* BRAND HERO NAVY SECTION WITH ROUNDED BOTTOM */}
      <div className="bg-[#0a142f] text-white pt-5 pb-28 md:pb-32 px-4 relative overflow-hidden rounded-b-[40px] md:rounded-b-[65px] shadow-xl">
        {/* Glow Decor Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl" />
        </div>

        {/* Modern & Compact Navbar */}
        <header className="relative z-20 max-w-6xl mx-auto flex items-center justify-between pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Custom Brand Logo with variant='light' so 'AfriChange' is fully visible in crisp white */}
            <Logo size="md" showText={true} variant="light" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {pwaPrompt && (
              <button
                onClick={handleInstallPwa}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-500 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{getTranslation(lang, 'installPwa')}</span>
              </button>
            )}

            <button
              onClick={handleShareApp}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/15 transition-colors"
              title={getTranslation(lang, 'shareApp')}
              aria-label={getTranslation(lang, 'shareApp')}
            >
              <Share2 className="w-4 h-4" />
            </button>

            <LanguageSelector lang={lang} onChange={handleLanguageChange} />
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </header>

        {/* Hero Title Header */}
        <div className="relative z-10 text-center max-w-3xl mx-auto pt-8 pb-4 space-y-2.5">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-snug px-2">
            {getTranslation(lang, 'heroTitle')}
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto font-normal leading-relaxed px-4">
            {getTranslation(lang, 'heroSubtitle')}
          </p>
        </div>
      </div>

      {/* FLOATING CONVERTER WIDGET CARD */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-30 mb-16">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 md:p-8 space-y-6">
          {/* Widget Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto border-b border-slate-100 dark:border-slate-700/60 pb-3 no-scrollbar">
            <button
              onClick={() => setActiveTab('converter')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'converter'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              {getTranslation(lang, 'tabConverter')}
            </button>

            <button
              onClick={() => setActiveTab('rates')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'rates'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              {getTranslation(lang, 'tabRates')}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <History className="w-4 h-4" />
              {getTranslation(lang, 'tabHistory')}
            </button>
          </div>

          {/* Animated Tab Content */}
          <AnimatePresence mode="wait">
            {/* TAB 1: CONVERTER INPUTS */}
            {activeTab === 'converter' && (
              <motion.div
                key="converter"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Dual Input Container */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3">
                  {/* FROM BOX */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {getTranslation(lang, 'from')}
                    </span>

                    <div className="flex items-center justify-between gap-2">
                      <input
                        ref={inputRef}
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="1,00"
                        className="w-full text-2xl md:text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 bg-transparent focus:outline-none min-h-[44px]"
                      />

                      <button
                        onClick={() => setModalConfig({ isOpen: true, target: 'from' })}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-500 transition-all flex-shrink-0 min-h-[44px]"
                      >
                        <Flag country={fromInfo.country} className="w-6 h-4" />
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                          {fromCurrency}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* SWAP BUTTON */}
                  <div className="flex justify-center my-1 md:my-0">
                    <button
                      onClick={handleSwap}
                      className="p-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-blue-500 shadow-md transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title={getTranslation(lang, 'swap')}
                      aria-label={getTranslation(lang, 'swap')}
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  </div>

                  {/* TO BOX */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {getTranslation(lang, 'to')}
                    </span>

                    <div className="flex items-center justify-between gap-2">
                      <div className="w-full text-2xl md:text-3xl font-extrabold font-mono truncate min-h-[44px] flex items-center">
                        {isLoading ? (
                          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                        ) : hasAmount && convertedAmount !== null ? (
                          <span className="text-blue-600 dark:text-blue-400">
                            {formatNum(convertedAmount, toInfo.decimals)}
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">
                            —
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setModalConfig({ isOpen: true, target: 'to' })}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-500 transition-all flex-shrink-0 min-h-[44px]"
                      >
                        <Flag country={toInfo.country} className="w-6 h-4" />
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                          {toCurrency}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* CARD FOOTER: Rate Breakdown + CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="space-y-1 w-full sm:w-auto">
                    {exchangeRate && hasAmount ? (
                      <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono">
                        1,00 {fromCurrency} = {formatNum(exchangeRate, 4)} {toCurrency}
                      </h4>
                    ) : (
                      <p className="text-xs text-slate-400 font-medium">
                        {getTranslation(lang, 'enterAmountHint')}
                      </p>
                    )}

                    <OfflineBadge
                      isOffline={isOffline}
                      source={rateSource}
                      timestamp={lastUpdated}
                      onRefresh={() => fetchRates(amount || '100', fromCurrency, toCurrency, true)}
                      lang={lang}
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={handleSaveFavorite}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors w-full sm:w-auto min-h-[44px]"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{getTranslation(lang, 'saveFavorite')}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: POPULAR RATES */}
            {activeTab === 'rates' && (
              <motion.div
                key="rates"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <PopularRatesGrid
                  allRates={allRates}
                  onSelectPair={(f, t) => {
                    setFromCurrency(f);
                    setToCurrency(t);
                    setActiveTab('converter');
                  }}
                  lang={lang}
                />
              </motion.div>
            )}

            {/* TAB 3: HISTORY & FAVORITES */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Favorites */}
                {favorites.length > 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                        {getTranslation(lang, 'favorites')}
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {favorites.map((fav) => (
                        <div
                          key={fav.id}
                          onClick={() => {
                            setFromCurrency(fav.from);
                            setToCurrency(fav.to);
                            setAmount(fav.amount.toString());
                            setActiveTab('converter');
                          }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 cursor-pointer transition-all text-xs font-mono"
                        >
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {fav.amount} {fav.from} → {fav.to}
                          </span>
                          <span className="text-blue-600 font-bold">
                            1 {fav.from} = {formatNum(fav.rate, 4)} {fav.to}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 text-center text-xs text-slate-400">
                    <Star className="w-6 h-6 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    {getTranslation(lang, 'noFavorites')}
                  </div>
                )}

                {/* History */}
                <ConversionHistory
                  history={history}
                  onClear={handleClearHistory}
                  onSelectPair={(f, t, a) => {
                    setFromCurrency(f);
                    setToCurrency(t);
                    if (a) setAmount(a.toString());
                    setActiveTab('converter');
                  }}
                  lang={lang}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* LANDING PAGE BODY CONTENT BELOW HERO */}
      <main className="max-w-6xl mx-auto px-4 pb-16 space-y-16">
        <LandingFeatures lang={lang} />
        <MarketingSections
          lang={lang}
          allRates={allRates}
          onSelectPair={(f, t) => {
            setFromCurrency(f);
            setToCurrency(t);
            setActiveTab('converter');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSelectorModal={(target) => setModalConfig({ isOpen: true, target })}
          pwaPrompt={pwaPrompt}
          onInstall={handleInstallPwa}
        />
      </main>

      {/* FOOTER WITH BRAND LOGO */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showText={true} />

          <div className="flex items-center gap-4">
            <Link href="/mentions-legales" className="hover:text-blue-600 transition-colors">
              {getTranslation(lang, 'legal')}
            </Link>
            <span>•</span>
            <a
              href="https://ndiagandiaye.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 font-semibold transition-colors"
            >
              {getTranslation(lang, 'by')} Ndiaga Ndiaye
            </a>
          </div>
        </div>
      </footer>

      {/* Selector Modal & Toast */}
      <CurrencySelectorModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        selectedCode={modalConfig.target === 'from' ? fromCurrency : toCurrency}
        onSelect={(code) => {
          if (modalConfig.target === 'from') setFromCurrency(code);
          else setToCurrency(code);
        }}
        label={modalConfig.target === 'from' ? getTranslation(lang, 'from') : getTranslation(lang, 'to')}
        lang={lang}
      />

      <Toast message={toast.message} isVisible={toast.visible} />
    </div>
  );
}