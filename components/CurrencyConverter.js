import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRightLeft, ChevronDown, Download, History, Moon, Plane, RefreshCw, Share2, Star, Sun, WifiOff } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import Link from 'next/link';

import { getCurrencyByCode } from '../lib/currencies';
import { calculateCrossRate, getExchangeRates } from '../lib/rates';
import { clearConversionHistory, getConversionHistory, getFavorites, saveConversionHistory, saveFavorite } from '../lib/db';
import { getTranslation, TRANSLATIONS } from '../lib/i18n';

import ConversionHistory from './ConversionHistory';
import CurrencySelectorModal from './CurrencySelectorModal';
import Logo from './Logo';
import OfflineBadge from './OfflineBadge';
import PopularRatesGrid from './PopularRatesGrid';
import TravelMode from './TravelMode';

const Flag = ({ country, className = 'w-7 h-5' }) => {
  if (!country) return null;
  const Component = Flags[country.toUpperCase()];
  return Component ? <Component className={`${className} rounded-sm border border-black/5 object-cover`} /> : null;
};

const parseAmount = (value) => {
  if (typeof value !== 'string') return Number(value);
  return Number(value.replace(/\s/g, '').replace(',', '.'));
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
  const [rateSource, setRateSource] = useState('unavailable');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState('fr');
  const [activeTab, setActiveTab] = useState('converter');
  const [modalConfig, setModalConfig] = useState({ isOpen: false, target: 'from' });
  const [pwaPrompt, setPwaPrompt] = useState(null);
  const requestIdRef = useRef(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang && TRANSLATIONS[savedLang]) setLang(savedLang);

    Promise.all([getFavorites(5), getConversionHistory(15)]).then(([savedFavorites, savedHistory]) => {
      setFavorites(savedFavorites);
      setHistory(savedHistory);
    });

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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const fetchRates = useCallback(async (amountValue, fromCode, toCode, forceRefresh = false) => {
    const numericAmount = parseAmount(amountValue);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setExchangeRate(null);
      setConvertedAmount(null);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    try {
      const data = await getExchangeRates('EUR', forceRefresh);
      if (requestId !== requestIdRef.current) return;
      setAllRates(data?.rates || {});
      setRateSource(data?.source || 'unavailable');
      setIsOffline(Boolean(data?.isOffline));
      setLastUpdated(data?.timestamp || null);

      const rate = data?.rates ? calculateCrossRate(fromCode, toCode, data.rates, 'EUR') : null;
      if (!Number.isFinite(rate)) {
        setExchangeRate(null);
        setConvertedAmount(null);
        return;
      }

      const result = numericAmount * rate;
      setExchangeRate(rate);
      setConvertedAmount(result);
      await saveConversionHistory({ from: fromCode, to: toCode, amount: numericAmount, result, rate, source: data.source, rateTimestamp: data.timestamp, isOffline: data.isOffline });
      if (requestId === requestIdRef.current) setHistory(await getConversionHistory(15));
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (amount) fetchRates(amount, fromCurrency, toCurrency);
      else { setExchangeRate(null); setConvertedAmount(null); }
    }, 250);
    return () => clearTimeout(timer);
  }, [amount, fromCurrency, toCurrency, fetchRates]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleSaveFavorite = async () => {
    const numericAmount = parseAmount(amount || '100');
    if (!Number.isFinite(numericAmount) || !exchangeRate) return;
    await saveFavorite({ amount: numericAmount, from: fromCurrency, to: toCurrency, rate: exchangeRate });
    setFavorites(await getFavorites(5));
  };

  const handleClearHistory = async () => {
    await clearConversionHistory();
    setHistory([]);
  };

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const handleInstall = async () => {
    if (!pwaPrompt) return;
    pwaPrompt.prompt();
    await pwaPrompt.userChoice;
    setPwaPrompt(null);
  };

  const shareApp = async () => {
    const payload = { title: 'AfriChange', text: 'Convertisseur de devises africaines utilisable hors connexion.', url: window.location.href };
    if (navigator.share) await navigator.share(payload);
    else await navigator.clipboard.writeText(window.location.href);
  };

  const openPair = (from, to) => {
    setFromCurrency(from);
    setToCurrency(to);
    setActiveTab('converter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fromInfo = getCurrencyByCode(fromCurrency);
  const toInfo = getCurrencyByCode(toCurrency);
  const numericAmount = parseAmount(amount);
  const hasAmount = Number.isFinite(numericAmount) && numericAmount > 0;
  const locale = lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US';
  const formatNum = (value, decimals = 2) => new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value || 0);

  const tabs = [
    { id: 'converter', label: lang === 'fr' ? 'Convertir' : 'Convert' },
    { id: 'travel', label: lang === 'fr' ? 'Voyage' : 'Travel' },
    { id: 'rates', label: lang === 'fr' ? 'Taux' : 'Rates' },
    { id: 'history', label: lang === 'fr' ? 'Historique' : 'History' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Logo size="md" />
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`text-sm transition-colors ${activeTab === tab.id ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'}`}>{tab.label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            {pwaPrompt && <button onClick={handleInstall} className="hidden items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:flex dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"><Download className="h-3.5 w-3.5" /> Installer</button>}
            <button onClick={shareApp} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white" aria-label="Partager"><Share2 className="h-4 w-4" /></button>
            <select value={lang} onChange={(e) => handleLanguageChange(e.target.value)} className="rounded-md border-0 bg-transparent px-2 py-2 text-xs font-semibold uppercase text-slate-600 outline-none dark:text-slate-300">
              <option value="fr">FR</option><option value="en">EN</option><option value="es">ES</option><option value="wo">WO</option>
            </select>
            <button onClick={() => setIsDark(!isDark)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900" aria-label="Changer le thème">{isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-14">
        {activeTab !== 'travel' && (
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">AfriChange</p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl dark:text-white">{lang === 'fr' ? 'Convertir simplement, même sans réseau.' : 'Simple currency conversion, even offline.'}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">{lang === 'fr' ? 'Pensé pour les déplacements en Afrique. Les derniers taux synchronisés restent disponibles sur votre appareil.' : 'Built for travel across Africa. Your latest synchronized rates stay available on your device.'}</p>
          </div>
        )}

        <div className="mb-6 flex gap-5 overflow-x-auto border-b border-slate-200 md:hidden dark:border-slate-800">
          {tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap border-b-2 pb-3 text-sm ${activeTab === tab.id ? 'border-emerald-700 font-semibold text-emerald-700 dark:border-emerald-400 dark:text-emerald-400' : 'border-transparent text-slate-500'}`}>{tab.label}</button>)}
        </div>

        {activeTab === 'converter' && (
          <section>
            <div className="overflow-hidden border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
              <div className="grid md:grid-cols-[1fr_auto_1fr]">
                <div className="p-5 md:p-7">
                  <label className="text-xs font-medium text-slate-500">{lang === 'fr' ? 'Vous envoyez' : 'You send'}</label>
                  <input ref={inputRef} value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" type="text" placeholder="10 000" className="mt-3 w-full bg-transparent text-4xl font-semibold tracking-[-0.04em] outline-none placeholder:text-slate-300 md:text-5xl dark:placeholder:text-slate-700" />
                  <button onClick={() => setModalConfig({ isOpen: true, target: 'from' })} className="mt-5 flex w-full items-center justify-between border-t border-slate-100 pt-4 text-left dark:border-slate-800">
                    <span className="flex items-center gap-3"><Flag country={fromInfo.country} /><span><span className="block text-sm font-semibold">{fromCurrency}</span><span className="block text-xs text-slate-500">{fromInfo.name}</span></span></span><ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                </div>

                <div className="relative flex items-center justify-center border-y border-slate-200 py-0 md:border-x md:border-y-0 dark:border-slate-800">
                  <button onClick={handleSwap} className="absolute z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-emerald-600 hover:text-emerald-700 md:relative dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><ArrowRightLeft className="h-4 w-4" /></button>
                </div>

                <div className="p-5 md:p-7">
                  <span className="text-xs font-medium text-slate-500">{lang === 'fr' ? 'Vous recevez' : 'You receive'}</span>
                  <div className="mt-3 min-h-[58px] text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{isLoading ? <RefreshCw className="mt-2 h-7 w-7 animate-spin text-emerald-700" /> : hasAmount && convertedAmount !== null ? formatNum(convertedAmount, toInfo.decimals) : <span className="text-slate-300 dark:text-slate-700">—</span>}</div>
                  <button onClick={() => setModalConfig({ isOpen: true, target: 'to' })} className="mt-5 flex w-full items-center justify-between border-t border-slate-100 pt-4 text-left dark:border-slate-800">
                    <span className="flex items-center gap-3"><Flag country={toInfo.country} /><span><span className="block text-sm font-semibold">{toCurrency}</span><span className="block text-xs text-slate-500">{toInfo.name}</span></span></span><ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7 dark:border-slate-800">
                <div>
                  {exchangeRate && hasAmount ? <p className="text-sm font-medium">1 {fromCurrency} = {formatNum(exchangeRate, 4)} {toCurrency}</p> : <p className="text-sm text-slate-500">{lang === 'fr' ? 'Saisissez un montant pour convertir.' : 'Enter an amount to convert.'}</p>}
                  <div className="mt-1"><OfflineBadge isOffline={isOffline} source={rateSource} timestamp={lastUpdated} onRefresh={() => fetchRates(amount || '100', fromCurrency, toCurrency, true)} lang={lang} /></div>
                </div>
                <button onClick={handleSaveFavorite} disabled={!exchangeRate} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"><Star className="h-3.5 w-3.5" /> {lang === 'fr' ? 'Ajouter aux favoris' : 'Save pair'}</button>
              </div>
            </div>

            {isOffline && <div className="mt-4 flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"><WifiOff className="mt-0.5 h-4 w-4 flex-none" /><span>{lang === 'fr' ? 'Vous êtes hors connexion. AfriChange utilise le dernier taux enregistré sur cet appareil lorsqu’il est disponible.' : 'You are offline. AfriChange is using the latest rate stored on this device when available.'}</span></div>}

            <div className="mt-10 border-l-2 border-emerald-600 pl-4">
              <div className="flex items-center justify-between gap-4">
                <div><div className="flex items-center gap-2"><Plane className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /><h2 className="text-sm font-semibold">{lang === 'fr' ? 'Vous partez bientôt ?' : 'Travelling soon?'}</h2></div><p className="mt-1 text-sm text-slate-500">{lang === 'fr' ? 'Préparez vos taux avant le départ pour les retrouver hors connexion.' : 'Prepare your rates before departure so they remain available offline.'}</p></div>
                <button onClick={() => setActiveTab('travel')} className="whitespace-nowrap text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400">{lang === 'fr' ? 'Préparer un voyage' : 'Prepare a trip'}</button>
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-4 flex items-end justify-between"><div><h2 className="text-lg font-semibold tracking-[-0.02em]">{lang === 'fr' ? 'Taux populaires' : 'Popular rates'}</h2><p className="mt-1 text-sm text-slate-500">{lang === 'fr' ? 'Quelques devises utiles pour vos déplacements.' : 'Useful currencies for travel.'}</p></div><button onClick={() => setActiveTab('rates')} className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400">{lang === 'fr' ? 'Voir tout' : 'View all'}</button></div>
              <PopularRatesGrid allRates={allRates} onSelectPair={openPair} lang={lang} />
            </div>
          </section>
        )}

        {activeTab === 'travel' && <TravelMode lang={lang} onSelectPair={openPair} />}

        {activeTab === 'rates' && <section><div className="mb-5"><h2 className="text-2xl font-semibold tracking-[-0.03em]">{lang === 'fr' ? 'Taux de change' : 'Exchange rates'}</h2><p className="mt-1 text-sm text-slate-500">{lang === 'fr' ? 'Sélectionnez une paire pour revenir au convertisseur.' : 'Select a pair to return to the converter.'}</p></div><PopularRatesGrid allRates={allRates} onSelectPair={openPair} lang={lang} /></section>}

        {activeTab === 'history' && <section><div className="mb-5 flex items-center gap-2"><History className="h-5 w-5" /><h2 className="text-2xl font-semibold tracking-[-0.03em]">{lang === 'fr' ? 'Historique et favoris' : 'History and favorites'}</h2></div><div className="grid gap-8 md:grid-cols-2"><div><h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{lang === 'fr' ? 'Favoris' : 'Favorites'}</h3><div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">{favorites.length ? favorites.map((fav) => <button key={fav.pair} onClick={() => { setFromCurrency(fav.from); setToCurrency(fav.to); setAmount(String(fav.amount)); setActiveTab('converter'); }} className="flex w-full items-center justify-between py-3 text-left text-sm hover:text-emerald-700"><span className="font-medium">{fav.from} → {fav.to}</span><span className="text-slate-500">1 {fav.from} = {formatNum(fav.rate, 4)} {fav.to}</span></button>) : <p className="py-5 text-sm text-slate-500">{lang === 'fr' ? 'Aucune paire favorite.' : 'No favorite pair yet.'}</p>}</div></div><ConversionHistory history={history} onClear={handleClearHistory} onSelectPair={(from, to, savedAmount) => { setFromCurrency(from); setToCurrency(to); if (savedAmount) setAmount(String(savedAmount)); setActiveTab('converter'); }} lang={lang} /></div></section>}
      </main>

      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800"><div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between md:px-6"><span>AfriChange · {lang === 'fr' ? 'Vos données restent sur votre appareil.' : 'Your data stays on your device.'}</span><div className="flex gap-4"><Link href="/mentions-legales" className="hover:text-slate-900 dark:hover:text-white">{getTranslation(lang, 'legal')}</Link><a href="https://ndiagandiaye.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white">Ndiaga Ndiaye</a></div></div></footer>

      <CurrencySelectorModal isOpen={modalConfig.isOpen} onClose={() => setModalConfig((current) => ({ ...current, isOpen: false }))} selectedCode={modalConfig.target === 'from' ? fromCurrency : toCurrency} onSelect={(code) => { if (modalConfig.target === 'from') setFromCurrency(code); else setToCurrency(code); setModalConfig((current) => ({ ...current, isOpen: false })); }} label={modalConfig.target === 'from' ? getTranslation(lang, 'from') : getTranslation(lang, 'to')} lang={lang} />
    </div>
  );
}
