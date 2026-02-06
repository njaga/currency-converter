import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { 
  ArrowRightLeft, Star, RefreshCw, TrendingUp, 
  Sun, Moon, Clock, ChevronDown, Check, X, Bookmark
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const EXCHANGE_RATE_API_KEY = '1276659af5bdc69143b11f57';
const EXCHANGE_RATE_API_URL = 'https://v6.exchangerate-api.com/v6/';

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

// Flag component using flagcdn.com API
const Flag = ({ country, size = 'md' }) => {
  const sizes = {
    sm: { width: 24, height: 18 },
    md: { width: 32, height: 24 },
    lg: { width: 48, height: 36 }
  };
  const { width, height } = sizes[size];
  
  return (
    <Image
      src={`https://flagcdn.com/w80/${country}.png`}
      alt={country.toUpperCase()}
      width={width}
      height={height}
      className="rounded-sm object-cover"
      unoptimized
    />
  );
};

// Animated number component
const AnimatedNumber = ({ value, decimals = 2 }) => {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (v) => 
    new Intl.NumberFormat('fr-FR', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    }).format(v)
  );
  
  useEffect(() => {
    spring.set(value || 0);
  }, [value, spring]);
  
  return <motion.span>{display}</motion.span>;
};

// Theme toggle component
const ThemeToggle = ({ isDark, onToggle }) => (
  <motion.button
    onClick={onToggle}
    className="relative w-14 h-7 bg-zinc-200 dark:bg-zinc-700 rounded-full p-1 transition-colors"
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      className="w-5 h-5 rounded-full bg-white dark:bg-primary flex items-center justify-center shadow-md"
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

// Currency dropdown
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
    <div className="flex-1" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-16 bg-zinc-100 dark:bg-zinc-800 border-2 border-transparent hover:border-primary/30 focus:border-primary rounded-2xl px-4 flex items-center gap-3 transition-all focus-ring"
          whileTap={{ scale: 0.98 }}
        >
          <Flag country={selected?.country} size="lg" />
          <div className="flex-1 text-left">
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{selected?.code}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{selected?.name}</p>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-zinc-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-[100] overflow-hidden max-h-80 overflow-y-auto"
            >
              {currencies.map((currency) => (
                <motion.button
                  key={currency.code}
                  onClick={() => {
                    onChange(currency.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors ${
                    value === currency.code ? 'bg-primary/10' : ''
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <Flag country={currency.country} size="sm" />
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{currency.code}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{currency.name}</p>
                  </div>
                  {value === currency.code && (
                    <Check className="w-5 h-5 text-primary" />
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
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3"
    >
      <Flag country={CURRENCIES.find(c => c.code === currency)?.country} size="sm" />
      <span className="w-12 text-sm font-semibold text-zinc-700 dark:text-zinc-300">{currency}</span>
      <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${isBase ? 'bg-primary' : 'bg-zinc-400 dark:bg-zinc-500'}`}
        />
      </div>
      <span className="w-24 text-right text-sm font-mono text-zinc-600 dark:text-zinc-400">
        {rate.toFixed(4)}
      </span>
    </motion.div>
  );
};

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
  const inputRef = useRef(null);

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

  // Load favorites
  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Swap currencies handler - defined before useEffect that uses it
  const handleSwapCurrencies = useCallback(() => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
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

  const fetchExchangeRate = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setConvertedAmount(null);
      setExchangeRate(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${EXCHANGE_RATE_API_URL}${EXCHANGE_RATE_API_KEY}/latest/${fromCurrency}`);
      const data = await response.json();
      
      if (data.result === 'success') {
        const rate = data.conversion_rates[toCurrency];
        setExchangeRate(rate);
        setAllRates(data.conversion_rates);
        setConvertedAmount(parseFloat(amount) * rate);
        setLastUpdated(new Date(data.time_last_update_unix * 1000));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (amount) fetchExchangeRate();
    }, 300);
    return () => clearTimeout(timer);
  }, [amount, fromCurrency, toCurrency, fetchExchangeRate]);

  const handleSaveFavorite = () => {
    const newFav = {
      id: Date.now(),
      amount: parseFloat(amount),
      from: fromCurrency,
      to: toCurrency,
      rate: exchangeRate
    };
    setFavorites(prev => [newFav, ...prev.slice(0, 4)]);
  };

  const handleRemoveFavorite = (id) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "À l'instant";
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Get popular rates for comparison
  const popularRates = ['EUR', 'USD', 'GBP', 'XOF', 'CAD', 'CHF']
    .filter(c => c !== fromCurrency && allRates[c])
    .map(c => ({ code: c, rate: allRates[c] }));
  const maxRate = Math.max(...popularRates.map(r => r.rate), 1);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image 
                src="/favicon.svg" 
                alt="XOF Converter" 
                width={48} 
                height={48}
                className="w-full h-full"
              />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">XOF Converter</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Conversion en temps réel</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
              <kbd className="kbd">/</kbd>
              <span>Rechercher</span>
            </div>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          
          {/* Main converter card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 md:p-8 relative z-50"
          >
            {/* Amount input */}
            <div className="mb-8">
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                Montant à convertir
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full h-24 bg-zinc-100 dark:bg-zinc-800 border-2 border-transparent focus:border-primary rounded-2xl px-6 text-5xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-600 transition-all focus-ring"
                />
                {isLoading && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Currency selectors */}
            <div className="flex flex-col md:flex-row items-stretch gap-4 mb-8">
              <CurrencyDropdown
                value={fromCurrency}
                onChange={setFromCurrency}
                currencies={CURRENCIES}
                label="De"
              />
              
              <div className="flex items-end justify-center md:pb-2">
                <motion.button
                  onClick={handleSwapCurrencies}
                  className="w-14 h-14 bg-primary hover:bg-primary-hover rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/25 transition-colors"
                  whileHover={{ scale: 1.05, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </motion.button>
              </div>

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
                  className="pt-6 border-t border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                        {new Intl.NumberFormat('fr-FR').format(amount)} {fromCurrency} =
                      </p>
                      <div className="flex items-baseline gap-3">
                        <p className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100">
                          <AnimatedNumber value={convertedAmount} />
                        </p>
                        <span className="text-2xl font-bold text-primary">{toCurrency}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={handleSaveFavorite}
                      className="glow-button px-6 py-3 font-semibold flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Star className="w-4 h-4" />
                      Sauvegarder
                    </motion.button>
                  </div>

                  {/* Rate info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
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
              className="glass-card p-6"
            >
              <button
                onClick={() => setShowRates(!showRates)}
                className="w-full flex items-center justify-between mb-4"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Taux de change</h3>
                </div>
                <motion.div
                  animate={{ rotate: showRates ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-zinc-400" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {showRates && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                      Pour 1 {fromCurrency}
                    </p>
                    {popularRates.map((rate, i) => (
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
              className="glass-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Bookmark className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Récents</h3>
              </div>
              <div className="grid gap-2">
                {favorites.map((fav) => (
                  <motion.div
                    key={fav.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="group flex items-center gap-3 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    onClick={() => {
                      setAmount(fav.amount.toString());
                      setFromCurrency(fav.from);
                      setToCurrency(fav.to);
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Flag country={CURRENCIES.find(c => c.code === fav.from)?.country} size="sm" />
                      <span className="text-zinc-400">→</span>
                      <Flag country={CURRENCIES.find(c => c.code === fav.to)?.country} size="sm" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {new Intl.NumberFormat('fr-FR').format(fav.amount)} {fav.from} → {fav.to}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(fav.id);
                      }}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
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
            className="hidden md:flex items-center justify-center gap-6 text-xs text-zinc-400 dark:text-zinc-500"
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
      <footer className="relative z-10 border-t border-zinc-200/50 dark:border-zinc-800/50 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Développé par{' '}
            <a 
              href="https://ndiagandiaye.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Ndiaga Ndiaye
            </a>
          </p>
          <Link 
            href="/mentions-legales"
            className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Mentions légales
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default CurrencyConverter;