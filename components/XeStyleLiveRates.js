import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  RefreshCw,
  Plus,
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  Edit2,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import { CURRENCIES, getCurrencyByCode } from '../lib/currencies';
import { calculateCrossRate } from '../lib/rates';
import { getTranslation } from '../lib/i18n';

const FlagIcon = ({ countryCode, className = 'w-6 h-4' }) => {
  if (!countryCode) return null;
  const Component = Flags[countryCode.toUpperCase()];
  if (!Component) return null;
  return <Component className={`${className} rounded-full object-cover flex-shrink-0 shadow-xs border border-slate-200 dark:border-slate-700`} />;
};

// Realistic sparkline mini SVG graph component
const Sparkline = ({ isPositive = true }) => {
  const pointsPositive = [
    [0, 22], [8, 20], [16, 24], [24, 18], [32, 21], [40, 14], [48, 16], [56, 10], [64, 12], [72, 6], [80, 8]
  ];
  const pointsNegative = [
    [0, 8], [8, 10], [16, 6], [24, 14], [32, 12], [40, 18], [48, 15], [56, 22], [64, 20], [72, 24], [80, 22]
  ];
  
  const points = isPositive ? pointsPositive : pointsNegative;
  const pathD = `M ${points.map((p) => p.join(',')).join(' L ')}`;
  const strokeColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <svg viewBox="0 0 80 30" className="w-20 h-7 overflow-visible">
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Default featured target currencies shown in live table
const DEFAULT_TARGETS = ['EUR', 'USD', 'GBP', 'XOF', 'NGN', 'GHS', 'KES', 'MAD', 'ZAR'];

// Mocked 24h fluctuations for realism
const MOCK_CHANGES = {
  EUR: { change: -0.36, isUp: false },
  USD: { change: 0.12, isUp: true },
  GBP: { change: -0.52, isUp: false },
  XOF: { change: 0.00, isUp: true },
  XAF: { change: 0.00, isUp: true },
  NGN: { change: -1.25, isUp: false },
  GHS: { change: 0.45, isUp: true },
  KES: { change: 0.18, isUp: true },
  MAD: { change: -0.15, isUp: false },
  ZAR: { change: -0.85, isUp: false },
  CAD: { change: -0.23, isUp: false },
  JPY: { change: -2.00, isUp: false },
};

export default function XeStyleLiveRates({
  allRates = {},
  onSelectPair,
  onOpenSelectorModal,
  lang = 'fr',
}) {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [amount, setAmount] = useState(1);
  const [isReversed, setIsReversed] = useState(false);
  const [selectedTargets, setSelectedTargets] = useState(DEFAULT_TARGETS);
  const [countdown, setCountdown] = useState(48);

  // Auto-refresh countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const baseInfo = getCurrencyByCode(baseCurrency);

  const formatNum = (num, decimals = 4) => {
    if (!num || isNaN(num)) return '--';
    return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
      minimumFractionDigits: decimals > 2 ? 4 : 2,
      maximumFractionDigits: decimals > 2 ? 4 : 2,
    }).format(num);
  };

  const currentTargets = useMemo(() => {
    return selectedTargets.filter((code) => code !== baseCurrency);
  }, [selectedTargets, baseCurrency]);

  return (
    <div className="space-y-6">
      {/* HEADER TITLE SECTION */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Taux de change en direct
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Comparez les devises en temps réel et calculez le bon moment pour convertir vos fonds
        </p>
      </div>

      {/* XE LIVE RATES MAIN CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {/* TOP BAR CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:px-6 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {/* Inverser Toggle */}
          <div className="flex items-center gap-2">
            <span>Inverser</span>
            <button
              onClick={() => setIsReversed(!isReversed)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                isReversed ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  isReversed ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Desktop Table Header Indicators */}
          <div className="hidden md:flex items-center gap-16 font-bold text-slate-400">
            <span>Montant</span>
            <span>Fluctuation (sur 24 h)</span>
            <span>Graphique (sur 24 h)</span>
          </div>

          {/* Modifier Button */}
          <button
            onClick={() => onOpenSelectorModal && onOpenSelectorModal('from')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Changer la devise de base</span>
          </button>
        </div>

        {/* DARK NAVY BASE CURRENCY HEADER ROW (XE STYLE) */}
        <div className="bg-[#0a142f] text-white p-4 md:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FlagIcon countryCode={baseInfo.country} className="w-7 h-7" />
            <div className="relative">
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="bg-transparent text-white text-base md:text-lg font-extrabold pr-6 cursor-pointer focus:outline-none appearance-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 1)}
              className="w-20 md:w-28 text-right bg-white/10 text-white text-lg md:text-xl font-extrabold font-mono rounded-xl px-3 py-1 border border-white/20 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* TARGET CURRENCIES LIST (XE STYLE) */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {currentTargets.map((targetCode) => {
            const targetCurr = getCurrencyByCode(targetCode);
            const rate = calculateCrossRate(baseCurrency, targetCode, allRates, 'EUR');
            const calculatedVal = rate !== null ? rate * amount : null;
            const changeInfo = MOCK_CHANGES[targetCode] || { change: 0.05, isUp: true };

            return (
              <motion.div
                key={targetCode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 md:px-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Left: Flag & Currency Name */}
                <div className="flex items-center gap-3 min-w-[200px]">
                  <FlagIcon countryCode={targetCurr.country} className="w-6 h-6" />
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 block">
                      {targetCurr.name}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      {targetCode}
                    </span>
                  </div>
                </div>

                {/* Middle Right: Values & Graphs */}
                <div className="flex items-center justify-between md:justify-end gap-6 md:gap-12 flex-1">
                  {/* Converted Amount */}
                  <div className="text-left md:text-right min-w-[100px]">
                    <span className="text-base md:text-lg font-mono font-black text-slate-900 dark:text-slate-100">
                      {formatNum(calculatedVal, targetCurr.decimals)}
                    </span>
                  </div>

                  {/* 24h Fluctuation Pill */}
                  <div className="min-w-[80px]">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                        changeInfo.isUp
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {changeInfo.isUp ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {changeInfo.change > 0 ? `+${changeInfo.change}%` : `${changeInfo.change}%`}
                    </span>
                  </div>

                  {/* Sparkline Graph */}
                  <div className="hidden sm:block">
                    <Sparkline isPositive={changeInfo.isUp} />
                  </div>

                  {/* Convert Action Button */}
                  <button
                    onClick={() => onSelectPair && onSelectPair(baseCurrency, targetCode)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-500 transition-colors flex-shrink-0"
                  >
                    <span>Convertir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM FOOTER CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:px-6 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-200/60 dark:border-slate-800 text-xs">
          <button
            onClick={() => onOpenSelectorModal && onOpenSelectorModal('to')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-600 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une devise</span>
          </button>

          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold font-mono text-blue-600">
              {countdown}
            </span>
            <span>
              Dernière mise à jour : {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'short' })}, 11:08 UTC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
