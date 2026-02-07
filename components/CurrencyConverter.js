import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRightLeft, Star, RefreshCw, TrendingUp, 
  Sun, Moon, Clock, ChevronDown, Check, X, Bookmark, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const EXCHANGE_RATE_API_KEY = '1276659af5bdc69143b11f57';
const EXCHANGE_RATE_API_URL = 'https://v6.exchangerate-api.com/v6/';

const OPEN_EXCHANGE_APP_ID = '7c71ac4719b841758f38e4dc994eb8d3';
const OPEN_EXCHANGE_API_URL = 'https://openexchangerates.org/api/';

// Currency data with country codes for flag API
const CURRENCIES = [
  { code: 'XOF', name: 'Franc CFA (BCEAO)', country: 'sn', symbol: 'CFA' },
  { code: 'EUR', name: 'Euro', country: 'eu', symbol: '€' },
  { code: 'USD', name: 'Dollar américain', country: 'us', symbol: '$' },
  { code: 'GBP', name: 'Livre sterling', country: 'gb', symbol: '£' },
  { code: 'CAD', name: 'Dollar canadien', country: 'ca', symbol: 'C$' },
  { code: 'CHF', name: 'Franc suisse', country: 'ch', symbol: 'CHF' },
  { code: 'JPY', name: 'Yen japonais', country: 'jp', symbol: '¥' },
  { code: 'CNY', name: 'Yuan chinois', country: 'cn', symbol: '¥' },
  { code: 'AUD', name: 'Dollar australien', country: 'au', symbol: 'A$' },
  { code: 'MAD', name: 'Dirham marocain', country: 'ma', symbol: 'DH' },
  { code: 'NGN', name: 'Naira nigérian', country: 'ng', symbol: '₦' },
  { code: 'GHS', name: 'Cedi ghanéen', country: 'gh', symbol: '₵' },
];

// Flag component using country-flag-icons (SVG)
import * as Flags from 'country-flag-icons/react/3x2';

const Flag = ({ country, size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-4',
    md: 'w-8 h-5',
    lg: 'w-10 h-7'
  };
  
  if (!country) return null;
  
  // Map country codes to ISO 3166-1 alpha-2 (uppercase)
  const countryMap = {
    'sn': 'SN', 'eu': 'EU', 'us': 'US', 'gb': 'GB', 'ca': 'CA',
    'ch': 'CH', 'jp': 'JP', 'cn': 'CN', 'au': 'AU', 'ma': 'MA',
    'ng': 'NG', 'gh': 'GH'
  };
  
  const isoCode = countryMap[country] || country.toUpperCase();
  const FlagComponent = Flags[isoCode];
  
  if (!FlagComponent) return null;
  
  return (
    <div className="flex-shrink-0">
      <FlagComponent className={`${sizes[size]} rounded-sm shadow-sm`} />
    </div>
  );
};

// Theme toggle component
const ThemeToggle = ({ isDark, onToggle }) => (
  <motion.button
    onClick={onToggle}
    className="theme-toggle"
    whileTap={{ scale: 0.95 }}
    aria-label="Toggle theme"
  >
    <motion.div
      className="theme-toggle-handle"
      animate={{ x: isDark ? 28 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {isDark ? (
        <Moon className="w-3 h-3 text-white" />
      ) : (
        <Sun className="w-3 h-3 text-amber-500" />
      )}
    </motion.div>
  </motion.button>
);

// Currency dropdown with mobile-optimized design
const CurrencyDropdown = ({ value, onChange, currencies, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = currencies.find(c => c.code === value);
  const dropdownRef = useRef(null);

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
    <div className="flex-1 min-w-0" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="currency-selector touch-feedback"
          whileTap={{ scale: 0.98 }}
        >
          <Flag country={selected?.country} size="md" />
          <div className="flex-1 text-left min-w-0">
            <p className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">{selected?.code}</p>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">{selected?.name}</p>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:block"
          >
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="dropdown-panel"
            >
              {currencies.map((currency) => (
                <motion.button
                  key={currency.code}
                  onClick={() => {
                    onChange(currency.code);
                    setIsOpen(false);
                  }}
                  className={`dropdown-item ${value === currency.code ? 'selected' : ''}`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Flag country={currency.country} size="sm" />
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{currency.code}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currency.name}</p>
                  </div>
                  {value === currency.code && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Rate comparison bar
const RateBar = ({ currency, rate, maxRate, baseRate }) => {
  const percentage = (rate / maxRate) * 100;
  const isBase = rate === baseRate;
  const currencyData = CURRENCIES.find(c => c.code === currency);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3"
    >
      <Flag country={currencyData?.country} size="sm" />
      <span className="w-12 text-sm font-semibold text-slate-700 dark:text-slate-300">{currency}</span>
      <div className="flex-1 rate-bar">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`rate-bar-fill ${isBase ? '' : 'opacity-50'}`}
        />
      </div>
      <span className="w-24 text-right text-sm font-mono text-slate-600 dark:text-slate-400">
        {rate.toFixed(4)}
      </span>
    </motion.div>
  );
};

// Toast notification for feedback
const Toast = ({ message, isVisible, onClose }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast-success"
      >
        <CheckCircle className="w-5 h-5" />
        <span>{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

// Main component
const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('XOF');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [allRates, setAllRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [showRates, setShowRates] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const inputRef = useRef(null);
  
  // Ref to track if we're currently fetching (prevents double fetch)
  const isFetchingRef = useRef(false);

  // Show toast notification
  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2500);
  };

  // Initialize dark mode
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(saved ? saved === 'dark' : prefersDark);
  }, []);

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('currency_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load favorites:', e);
    }
  }, []);

  // Swap currencies handler
  const handleSwapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  // Keyboard shortcuts
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
        handleSwapCurrencies();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwapCurrencies]);

  // Fetch exchange rate - stable function that won't cause re-renders
  const fetchExchangeRate = useCallback(async (amountValue, from, to) => {
    if (!amountValue || parseFloat(amountValue) <= 0) {
      setConvertedAmount(null);
      setExchangeRate(null);
      return;
    }

    // Prevent double fetch
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setIsLoading(true);
    
    try {
      // Try primary API
      const response = await fetch(`${EXCHANGE_RATE_API_URL}${EXCHANGE_RATE_API_KEY}/latest/${from}`);
      if (!response.ok) throw new Error('Primary API Failed');
      
      const data = await response.json();
      
      if (data.result === 'success') {
        const rate = data.conversion_rates[to];
        setExchangeRate(rate);
        setAllRates(data.conversion_rates);
        setConvertedAmount(parseFloat(amountValue) * rate);
        setLastUpdated(new Date(data.time_last_update_unix * 1000));
      } else {
        throw new Error('Primary API Error');
      }
    } catch (error) {
      console.warn('Primary API failed, trying backup:', error);
      
      // Fallback to Open Exchange Rates
      try {
        const backupResponse = await fetch(`${OPEN_EXCHANGE_API_URL}latest.json?app_id=${OPEN_EXCHANGE_APP_ID}`);
        const backupData = await backupResponse.json();
        
        if (!backupData.error) {
          const fromRate = backupData.rates[from];
          const toRate = backupData.rates[to];
          
          if (fromRate && toRate) {
            const crossRate = toRate / fromRate;
            setExchangeRate(crossRate);
            setAllRates(backupData.rates);
            setConvertedAmount(parseFloat(amountValue) * crossRate);
            setLastUpdated(new Date(backupData.timestamp * 1000));
          }
        }
      } catch (backupError) {
        console.error('Backup API Error:', backupError);
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Debounced effect for fetching rates - FIXED: no fetchExchangeRate in deps
  useEffect(() => {
    const timer = setTimeout(() => {
      if (amount) {
        fetchExchangeRate(amount, fromCurrency, toCurrency);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [amount, fromCurrency, toCurrency, fetchExchangeRate]);

  // Save favorite - FIXED with validation
  const handleSaveFavorite = () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Entrez un montant valide');
      return;
    }
    
    if (!exchangeRate) {
      showToast('Attendez la conversion');
      return;
    }

    const newFav = {
      id: Date.now(),
      amount: numAmount,
      from: fromCurrency,
      to: toCurrency,
      rate: exchangeRate
    };
    
    const updatedFavorites = [newFav, ...favorites.slice(0, 4)];
    setFavorites(updatedFavorites);
    
    // Persist to localStorage
    try {
      localStorage.setItem('currency_favorites', JSON.stringify(updatedFavorites));
      showToast('Conversion sauvegardée !');
    } catch (e) {
      console.warn('Failed to save favorites:', e);
    }
  };

  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favorites.filter(f => f.id !== id);
    setFavorites(updatedFavorites);
    try {
      localStorage.setItem('currency_favorites', JSON.stringify(updatedFavorites));
    } catch (e) {
      console.warn('Failed to save favorites:', e);
    }
  };

  const formatTime = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "À l'instant";
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Get popular rates for comparison
  const popularRates = ['EUR', 'USD', 'GBP', 'XOF', 'CAD', 'CHF']
    .filter(c => c !== fromCurrency && allRates[c])
    .map(c => ({ code: c, rate: allRates[c] }));
  const maxRate = Math.max(...popularRates.map(r => r.rate), 1);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-11 h-11 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image 
                src="/favicon.svg" 
                alt="XOF Converter" 
                width={44} 
                height={44}
                className="w-full h-full"
              />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">XOF Converter</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Taux en temps réel</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <kbd className="kbd">/</kbd>
              <span>Focus</span>
            </div>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:py-8 safe-bottom">
        <div className="space-y-5">
          
          {/* Main converter card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 md:p-8 relative z-50"
          >
            {/* Amount input */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Montant
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="amount-input"
                />
                {isLoading && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Currency selectors - side by side */}
            <div className="flex items-center gap-2 md:gap-4">
              <CurrencyDropdown
                value={fromCurrency}
                onChange={setFromCurrency}
                currencies={CURRENCIES}
                label="De"
              />
              
              {/* Swap button - center */}
              <motion.button
                onClick={handleSwapCurrencies}
                className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mt-6"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                aria-label="Swap currencies"
              >
                <ArrowRightLeft className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>

              <CurrencyDropdown
                value={toCurrency}
                onChange={setToCurrency}
                currencies={CURRENCIES}
                label="Vers"
              />
            </div>

            {/* Result */}
            <AnimatePresence mode="wait">
              {convertedAmount !== null && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="pt-6 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="flex flex-col gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        {formatNumber(parseFloat(amount))} {fromCurrency} =
                      </p>
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <p className="result-value">
                          {formatNumber(convertedAmount)}
                        </p>
                        <span className="text-xl md:text-2xl font-bold text-blue-600">{toCurrency}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={handleSaveFavorite}
                      className="glow-button px-5 py-3.5 font-semibold flex items-center justify-center gap-2 w-full md:w-auto"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Star className="w-4 h-4" />
                      Sauvegarder
                    </motion.button>
                  </div>

                  {/* Rate info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span>1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}</span>
                    </div>
                    {lastUpdated && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(lastUpdated)}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Rate comparison */}
          {Object.keys(allRates).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-5 md:p-6"
            >
              <button
                onClick={() => setShowRates(!showRates)}
                className="w-full flex items-center justify-between mb-4 touch-feedback"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Taux de change</h3>
                </div>
                <motion.div
                  animate={{ rotate: showRates ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {showRates && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-3 overflow-hidden"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      Pour 1 {fromCurrency}
                    </p>
                    {popularRates.map((rate) => (
                      <RateBar
                        key={rate.code}
                        currency={rate.code}
                        rate={rate.rate}
                        maxRate={maxRate}
                        baseRate={allRates[toCurrency]}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Favorites */}
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-5 md:p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Bookmark className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Récents</h3>
              </div>
              <div className="grid gap-2">
                {favorites.map((fav) => (
                  <motion.div
                    key={fav.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="favorite-card group"
                    onClick={() => {
                      setAmount(fav.amount.toString());
                      setFromCurrency(fav.from);
                      setToCurrency(fav.to);
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Flag country={CURRENCIES.find(c => c.code === fav.from)?.country} size="sm" />
                      <span className="text-slate-400">→</span>
                      <Flag country={CURRENCIES.find(c => c.code === fav.to)?.country} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {formatNumber(fav.amount)} {fav.from} → {fav.to}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(fav.id);
                      }}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                      aria-label="Remove favorite"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Keyboard shortcuts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center justify-center gap-6 text-xs text-slate-400 dark:text-slate-500"
          >
            <div className="flex items-center gap-2">
              <kbd className="kbd">/</kbd>
              <span>Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="kbd">Ctrl</kbd>
              <span>+</span>
              <kbd className="kbd">S</kbd>
              <span>Swap</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="kbd">Esc</kbd>
              <span>Blur</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/50 dark:border-slate-800/50 mt-8">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Développé par{' '}
            <a 
              href="https://ndiagandiaye.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              Ndiaga Ndiaye
            </a>
          </p>
          <Link 
            href="/mentions-legales"
            className="text-sm text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
          >
            Mentions légales
          </Link>
        </div>
      </footer>

      {/* Toast notification */}
      <Toast 
        message={toast.message} 
        isVisible={toast.visible} 
        onClose={() => setToast({ message: '', visible: false })} 
      />
    </div>
  );
};

export default CurrencyConverter;