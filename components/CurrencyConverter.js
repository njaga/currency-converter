import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRightLeft, ChevronDown, Download, History, Moon, Plane, RefreshCw, Share2, Sparkles, Star, Sun, WifiOff } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import Link from 'next/link';

import { getCurrencyByCode } from '../lib/currencies';
import { calculateCrossRate, getExchangeRates } from '../lib/rates';
import { clearConversionHistory, getConversionHistory, getFavorites, saveConversionHistory, saveFavorite } from '../lib/db';
import { getTranslation } from '../lib/i18n';

import ConversionHistory from './ConversionHistory';
import CurrencySelectorModal from './CurrencySelectorModal';
import LandingFeatures from './LandingFeatures';
import LanguageMenu from './LanguageMenu';
import Logo from './Logo';
import MarketingSections from './MarketingSections';
import MobileDock from './MobileDock';
import OfflineBadge from './OfflineBadge';
import PopularRatesGrid from './PopularRatesGrid';
import TravelMode from './TravelMode';

const Flag = ({ country, className = 'w-7 h-5' }) => {
  if (!country) return null;
  const Component = Flags[country.toUpperCase()];
  return Component ? <Component className={`${className} rounded-md border border-black/5 object-cover shadow-sm`} /> : null;
};

const parseAmount = (value) => {
  if (typeof value !== 'string') return Number(value);
  return Number(value.replace(/\s/g, '').replace(',', '.'));
};

function TravelIllustration() {
  return (
    <svg viewBox="0 0 360 300" className="pointer-events-none absolute bottom-0 right-0 w-[74%] max-w-[330px] text-emerald-600" aria-hidden="true">
      <circle cx="230" cy="175" r="112" fill="currentColor" opacity="0.055" />
      <circle cx="230" cy="175" r="86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.12" />
      <path d="M226 72l28 10 18 22 18 8-4 17 14 15-13 25 4 24-16 12-7 34-18 26-14-5-9-27-17-16-7-24-18-22 7-20-6-19 12-15 5-23 23-16Z" fill="currentColor" opacity="0.18" />
      <path d="M196 129c0-19 15-34 34-34s34 15 34 34c0 25-34 57-34 57s-34-32-34-57Z" fill="currentColor" opacity="0.94" />
      <circle cx="230" cy="129" r="11" fill="white" opacity="0.95" />
      <path d="M73 242c38-30 77-46 119-47 40-1 74 7 104 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 10" opacity="0.28" />
      <path d="m88 221 18 4-10 8 7 8-5 3-12-10-12 4 14-17Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

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
  const [swapSpin, setSwapSpin] = useState(false);
  const requestIdRef = useRef(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang === 'fr' || savedLang === 'en') setLang(savedLang);
    else localStorage.setItem('app_lang', 'fr');

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
    }, 220);
    return () => clearTimeout(timer);
  }, [amount, fromCurrency, toCurrency, fetchRates]);

  const handleSwap = () => {
    setSwapSpin(true);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setTimeout(() => setSwapSpin(false), 320);
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
    if (newLang !== 'fr' && newLang !== 'en') return;
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
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  const formatNum = (value, decimals = 2) => new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value || 0);

  const tabs = [
    { id: 'converter', label: lang === 'fr' ? 'Convertir' : 'Convert' },
    { id: 'travel', label: lang === 'fr' ? 'Voyage' : 'Travel' },
    { id: 'rates', label: lang === 'fr' ? 'Devises' : 'Currencies' },
    { id: 'history', label: lang === 'fr' ? 'Historique' : 'History' },
  ];

  const CurrencyPanel = ({ type }) => {
    const isFrom = type === 'from';
    const info = isFrom ? fromInfo : toInfo;
    const code = isFrom ? fromCurrency : toCurrency;
    return (
      <div className="relative flex min-h-[210px] min-w-0 flex-col justify-between overflow-hidden p-5 sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.08),transparent_34%)] opacity-80" />
        <div className="relative z-10 min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{isFrom ? (lang === 'fr' ? 'Vous envoyez' : 'You send') : (lang === 'fr' ? 'Vous recevez' : 'You receive')}</span>
          {isFrom ? (
            <input ref={inputRef} value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" type="text" placeholder="10 000" className="mt-5 w-full min-w-0 bg-transparent text-[40px] font-semibold leading-none tracking-[-0.055em] text-slate-950 outline-none placeholder:text-slate-300 sm:text-[50px] dark:text-white dark:placeholder:text-slate-700" />
          ) : (
            <div className={`mt-5 min-h-[52px] min-w-0 break-words text-[40px] font-semibold leading-none tracking-[-0.055em] transition-all duration-300 sm:text-[50px] ${convertedAmount !== null ? 'text-slate-950 dark:text-white' : 'text-slate-300 dark:text-slate-700'}`}>
              {isLoading ? <RefreshCw className="h-7 w-7 animate-spin text-emerald-600" /> : hasAmount && convertedAmount !== null ? formatNum(convertedAmount, info.decimals) : '—'}
            </div>
          )}
        </div>
        <button onClick={() => setModalConfig({ isOpen: true, target: type })} className="relative z-10 mt-7 flex min-w-0 items-center justify-between rounded-2xl border border-slate-200/80 bg-white/76 px-4 py-3.5 text-left shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 dark:border-white/10 dark:bg-slate-900/70">
          <span className="flex min-w-0 items-center gap-3"><Flag country={info.country} className="h-7 w-10 flex-none" /><span className="min-w-0"><span className="block text-sm font-semibold text-slate-950 dark:text-white">{code}</span><span className="block truncate text-xs text-slate-500 dark:text-slate-400">{info.name}</span></span></span><ChevronDown className="h-4 w-4 flex-none text-slate-400" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfb_58%,#f7faf8_100%)] pb-28 text-slate-950 dark:bg-[linear-gradient(180deg,#020617_0%,#07110d_100%)] dark:text-slate-100 md:pb-0">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-[0_4px_24px_rgba(15,23,42,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
        <div className="mx-auto flex h-[68px] w-full max-w-6xl min-w-0 items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3"><Logo size="md" /><span className="hidden border-l border-slate-200 pl-3 text-[11px] text-slate-400 xl:block dark:border-slate-800">{lang === 'fr' ? "Le convertisseur pensé pour l'Afrique" : 'Built for currency travel across Africa'}</span></div>
          <nav className="hidden flex-none items-center rounded-full border border-slate-200/80 bg-slate-50/80 p-1 shadow-sm lg:flex dark:border-white/10 dark:bg-white/5" aria-label="Navigation principale">
            {tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-[0_6px_18px_rgba(5,150,105,0.18)]' : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'}`}>{tab.label}</button>)}
          </nav>
          <div className="flex flex-none items-center gap-1">
            {pwaPrompt && <button onClick={handleInstall} className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-emerald-300 md:flex dark:border-white/10 dark:bg-white/5 dark:text-slate-200"><Download className="h-3.5 w-3.5" /> Installer</button>}
            <button onClick={shareApp} className="hidden rounded-full p-2.5 text-slate-500 transition hover:bg-slate-100 sm:block dark:hover:bg-white/10" aria-label="Partager"><Share2 className="h-4 w-4" /></button>
            <LanguageMenu value={lang} onChange={handleLanguageChange} />
            <button onClick={() => setIsDark(!isDark)} className="rounded-full p-2.5 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Changer le thème">{isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl min-w-0 px-4 py-6 md:px-6 md:py-9">
        {activeTab === 'converter' && <>
          <section className="relative min-w-0 overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:p-6 dark:border-white/10 dark:bg-white/[0.035]">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-300/15 blur-3xl" />
            <div className="mb-5 flex min-w-0 flex-col gap-3 px-1 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 max-w-2xl"><div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"><Sparkles className="h-3.5 w-3.5" /> AfriChange</div><h1 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl lg:text-[42px]">{lang === 'fr' ? 'Convertir sans friction, même quand le réseau disparaît.' : 'Frictionless conversion, even when the network disappears.'}</h1></div>
              <p className="max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">{lang === 'fr' ? 'Taux synchronisés, favoris, voyage et mode hors connexion dans une seule expérience.' : 'Synced rates, favorites, travel and offline mode in one experience.'}</p>
            </div>

            <div className="relative min-w-0 overflow-hidden rounded-[26px] border border-slate-200 bg-white/82 shadow-[0_16px_44px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-slate-950/65">
              <div className="grid min-w-0 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                <CurrencyPanel type="from" />
                <div className="relative flex items-center justify-center border-y border-slate-200 md:border-x md:border-y-0 dark:border-white/10"><button onClick={handleSwap} className="absolute z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white text-slate-700 shadow-[0_10px_25px_rgba(15,23,42,0.14)] transition-all hover:scale-105 hover:text-emerald-700 md:relative dark:border-white/10 dark:bg-slate-900 dark:text-slate-200" aria-label="Inverser les devises"><ArrowRightLeft className={`h-4 w-4 transition-transform duration-300 ${swapSpin ? 'rotate-180' : ''}`} /></button></div>
                <CurrencyPanel type="to" />
              </div>
              <div className="flex min-w-0 flex-col gap-3 border-t border-slate-200 bg-slate-50/75 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7 dark:border-white/10 dark:bg-white/[0.025]"><div className="min-w-0">{exchangeRate && hasAmount ? <p className="break-words text-sm font-semibold">1 {fromCurrency} = {formatNum(exchangeRate, 4)} {toCurrency}</p> : <p className="text-sm text-slate-500">{lang === 'fr' ? 'Saisissez un montant pour commencer.' : 'Enter an amount to start.'}</p>}<div className="mt-1.5"><OfflineBadge isOffline={isOffline} source={rateSource} timestamp={lastUpdated} onRefresh={() => fetchRates(amount || '100', fromCurrency, toCurrency, true)} lang={lang} /></div></div><button onClick={handleSaveFavorite} disabled={!exchangeRate} className="inline-flex flex-none items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-amber-300 hover:text-amber-700 disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"><Star className="h-3.5 w-3.5" /> {lang === 'fr' ? 'Ajouter aux favoris' : 'Save pair'}</button></div>
            </div>
            {isOffline && <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-200"><WifiOff className="mt-0.5 h-4 w-4 flex-none" /><span>{lang === 'fr' ? 'Mode hors connexion actif. AfriChange utilise le dernier taux fiable enregistré sur cet appareil.' : 'Offline mode is active. AfriChange is using the latest reliable rate stored on this device.'}</span></div>}
          </section>

          <section className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
            <div className="min-w-0 rounded-[26px] border border-slate-200/80 bg-white/78 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.045)] backdrop-blur-xl sm:p-6 dark:border-white/10 dark:bg-white/[0.035]">
              <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{lang === 'fr' ? 'Marché' : 'Market'}</p><h2 className="mt-1 text-xl font-semibold tracking-[-0.025em]">{lang === 'fr' ? 'Taux populaires' : 'Popular rates'}</h2></div><button onClick={() => setActiveTab('rates')} className="flex-none text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400">{lang === 'fr' ? 'Voir toutes les devises' : 'View currencies'}</button></div>
              <PopularRatesGrid allRates={allRates} onSelectPair={openPair} lang={lang} />
            </div>

            <button onClick={() => setActiveTab('travel')} className="group relative min-h-[360px] min-w-0 overflow-hidden rounded-[26px] border border-emerald-200/80 bg-[linear-gradient(145deg,#f0fdf4_0%,#ffffff_76%)] p-6 text-left shadow-[0_16px_44px_rgba(5,150,105,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_56px_rgba(5,150,105,0.12)] dark:border-emerald-900/40 dark:bg-[linear-gradient(145deg,rgba(6,78,59,0.2),rgba(2,6,23,0.5))]">
              <div className="relative z-10 max-w-[74%]"><span className="inline-flex rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-emerald-300">{lang === 'fr' ? 'Mode voyage' : 'Travel mode'}</span><h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">{lang === 'fr' ? 'Préparer un pays avant le départ.' : 'Prepare a country before departure.'}</h3><p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{lang === 'fr' ? 'Téléchargez les taux utiles et gardez-les disponibles sans SIM ni connexion.' : 'Download useful rates and keep them available without a SIM card or connection.'}</p><div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400"><Plane className="h-4 w-4 transition-transform group-hover:translate-x-1" /> {lang === 'fr' ? 'Préparer mon voyage' : 'Prepare my trip'}</div></div>
              <TravelIllustration />
            </button>
          </section>

          <div className="mt-12 min-w-0 space-y-14"><LandingFeatures lang={lang} /><MarketingSections lang={lang} allRates={allRates} onSelectPair={openPair} onOpenSelectorModal={(target) => setModalConfig({ isOpen: true, target })} pwaPrompt={pwaPrompt} onInstall={handleInstall} /></div>
        </>}

        {activeTab === 'travel' && <TravelMode lang={lang} onSelectPair={openPair} />}
        {activeTab === 'rates' && <section className="min-w-0"><div className="mb-6 max-w-2xl"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">{lang === 'fr' ? 'Devises' : 'Currencies'}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{lang === 'fr' ? 'Explorer les taux disponibles.' : 'Explore available rates.'}</h1></div><div className="min-w-0 rounded-[26px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.045)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]"><PopularRatesGrid allRates={allRates} onSelectPair={openPair} lang={lang} /></div></section>}
        {activeTab === 'history' && <section className="min-w-0"><div className="mb-6 flex items-center gap-2"><History className="h-5 w-5" /><h1 className="text-3xl font-semibold tracking-[-0.04em]">{lang === 'fr' ? 'Historique et favoris' : 'History and favorites'}</h1></div><div className="grid min-w-0 gap-6 md:grid-cols-2"><div className="min-w-0 rounded-[26px] border border-slate-200/80 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.035]"><h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{lang === 'fr' ? 'Favoris' : 'Favorites'}</h3><div className="divide-y divide-slate-100 dark:divide-white/10">{favorites.length ? favorites.map((fav) => <button key={fav.pair || `${fav.from}-${fav.to}`} onClick={() => { setFromCurrency(fav.from); setToCurrency(fav.to); setAmount(String(fav.amount)); setActiveTab('converter'); }} className="flex w-full min-w-0 items-center justify-between gap-3 py-3 text-left text-sm transition hover:text-emerald-700"><span className="font-medium">{fav.from} → {fav.to}</span><span className="truncate text-slate-500">1 {fav.from} = {formatNum(fav.rate, 4)} {fav.to}</span></button>) : <p className="py-5 text-sm text-slate-500">{lang === 'fr' ? 'Aucune paire favorite.' : 'No favorite pair yet.'}</p>}</div></div><div className="min-w-0 rounded-[26px] border border-slate-200/80 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.035]"><ConversionHistory history={history} onClear={handleClearHistory} onSelectPair={(from, to, savedAmount) => { setFromCurrency(from); setToCurrency(to); if (savedAmount) setAmount(String(savedAmount)); setActiveTab('converter'); }} lang={lang} /></div></div></section>}
      </main>

      <footer className="mt-12 border-t border-slate-200/70 dark:border-white/10"><div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between md:px-6"><span>AfriChange · {lang === 'fr' ? 'Vos données restent sur votre appareil.' : 'Your data stays on your device.'}</span><div className="flex gap-4"><Link href="/mentions-legales" className="hover:text-slate-900 dark:hover:text-white">{getTranslation(lang, 'legal')}</Link><a href="https://ndiagandiaye.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white">Ndiaga Ndiaye</a></div></div></footer>
      <MobileDock activeTab={activeTab} onChange={setActiveTab} lang={lang} />
      <CurrencySelectorModal isOpen={modalConfig.isOpen} onClose={() => setModalConfig((current) => ({ ...current, isOpen: false }))} selectedCode={modalConfig.target === 'from' ? fromCurrency : toCurrency} onSelect={(code) => { if (modalConfig.target === 'from') setFromCurrency(code); else setToCurrency(code); setModalConfig((current) => ({ ...current, isOpen: false })); }} label={modalConfig.target === 'from' ? getTranslation(lang, 'from') : getTranslation(lang, 'to')} lang={lang} />
    </div>
  );
}
