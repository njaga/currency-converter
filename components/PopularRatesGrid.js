import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, TrendingUp, Sparkles } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import { getCurrencyByCode, REGIONS, REGION_NAMES } from '../lib/currencies';
import { calculateCrossRate } from '../lib/rates';
import { getTranslation } from '../lib/i18n';

const FlagIcon = ({ countryCode, className = 'w-6 h-4' }) => {
  if (!countryCode) return null;
  const Component = Flags[countryCode.toUpperCase()];
  if (!Component) return null;
  return <Component className={`${className} rounded-xs object-cover flex-shrink-0 shadow-2xs`} />;
};

// Parity key mapping for i18n
const PARITY_KEYS = {
  'Parité Fixe BCEAO': 'parityFixedBCEAO',
  'Parité Fixe BEAC': 'parityFixedBEAC',
  '1:1 Parité Fixe': 'parityFixed11',
  'Taux Marché': 'parityMarket',
  'Taux Triangulaire': 'parityTriangular',
  'Taux Interbancaire': 'parityInterbank',
  'Taux Banques': 'parityBank',
};

const MARKET_PAIRS = [
  // Afrique de l'Ouest
  { from: 'EUR', to: 'XOF', region: REGIONS.WEST_AFRICA, parityKey: 'Parité Fixe BCEAO' },
  { from: 'EUR', to: 'NGN', region: REGIONS.WEST_AFRICA, parityKey: 'Taux Marché' },
  { from: 'USD', to: 'XOF', region: REGIONS.WEST_AFRICA, parityKey: 'Taux Marché' },
  { from: 'XOF', to: 'NGN', region: REGIONS.WEST_AFRICA, parityKey: 'Taux Triangulaire' },
  { from: 'EUR', to: 'GHS', region: REGIONS.WEST_AFRICA, parityKey: 'Taux Marché' },
  { from: 'EUR', to: 'GMD', region: REGIONS.WEST_AFRICA, parityKey: 'Taux Marché' },
  { from: 'EUR', to: 'SLE', region: REGIONS.WEST_AFRICA, parityKey: 'Taux Marché' },

  // Afrique Centrale
  { from: 'EUR', to: 'XAF', region: REGIONS.CENTRAL_AFRICA, parityKey: 'Parité Fixe BEAC' },
  { from: 'XOF', to: 'XAF', region: REGIONS.CENTRAL_AFRICA, parityKey: '1:1 Parité Fixe' },
  { from: 'EUR', to: 'CDF', region: REGIONS.CENTRAL_AFRICA, parityKey: 'Taux Marché' },

  // Afrique de l'Est
  { from: 'EUR', to: 'KES', region: REGIONS.EAST_AFRICA, parityKey: 'Taux Marché' },
  { from: 'USD', to: 'KES', region: REGIONS.EAST_AFRICA, parityKey: 'Taux Marché' },
  { from: 'EUR', to: 'TZS', region: REGIONS.EAST_AFRICA, parityKey: 'Taux Marché' },
  { from: 'EUR', to: 'ETB', region: REGIONS.EAST_AFRICA, parityKey: 'Taux Marché' },

  // Afrique du Nord
  { from: 'EUR', to: 'MAD', region: REGIONS.NORTH_AFRICA, parityKey: 'Taux Banques' },
  { from: 'USD', to: 'MAD', region: REGIONS.NORTH_AFRICA, parityKey: 'Taux Banques' },
  { from: 'EUR', to: 'EGP', region: REGIONS.NORTH_AFRICA, parityKey: 'Taux Marché' },

  // Southern / International
  { from: 'USD', to: 'ZAR', region: REGIONS.SOUTHERN_AFRICA, parityKey: 'Taux Marché' },
  { from: 'EUR', to: 'USD', region: REGIONS.INTERNATIONAL, parityKey: 'Taux Interbancaire' },
  { from: 'GBP', to: 'EUR', region: REGIONS.INTERNATIONAL, parityKey: 'Taux Interbancaire' },
];

export default function PopularRatesGrid({ allRates = {}, onSelectPair, lang = 'fr' }) {
  const [activeRegion, setActiveRegion] = useState(REGIONS.ALL);

  const filteredPairs = useMemo(() => {
    if (activeRegion === REGIONS.ALL) return MARKET_PAIRS;
    return MARKET_PAIRS.filter((p) => p.region === activeRegion);
  }, [activeRegion]);

  const formatNum = (num, decimals = 2) => {
    if (!num) return '--';
    return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const getParityLabel = (parityKey) => {
    const i18nKey = PARITY_KEYS[parityKey];
    return i18nKey ? getTranslation(lang, i18nKey) : parityKey;
  };

  return (
    <div className="py-2 space-y-5">
      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            {getTranslation(lang, 'marketsTitle')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {getTranslation(lang, 'marketsSubtitle')}
          </p>
        </div>

        {/* Region Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {Object.values(REGIONS).map((reg) => {
            const isSelected = activeRegion === reg;
            const regName = REGION_NAMES[lang]?.[reg] || REGION_NAMES.fr[reg];
            return (
              <button
                key={reg}
                onClick={() => setActiveRegion(reg)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {regName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sleek Financial List View (Clean & Uncluttered) */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        {filteredPairs.map((pair, idx) => {
          const fromCurr = getCurrencyByCode(pair.from);
          const toCurr = getCurrencyByCode(pair.to);
          const rate = calculateCrossRate(pair.from, pair.to, allRates, 'EUR');
          const parityLabel = getParityLabel(pair.parityKey);
          const isFixed = pair.parityKey.includes('Fixe');

          return (
            <motion.div
              key={`${pair.from}-${pair.to}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02, duration: 0.2 }}
              onClick={() => onSelectPair && onSelectPair(pair.from, pair.to)}
              className="group flex items-center justify-between px-4 py-3 hover:bg-white dark:hover:bg-slate-800/80 cursor-pointer transition-all duration-150"
            >
              {/* Left Column: Flags & Pair Names */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center -space-x-1.5 flex-shrink-0">
                  <FlagIcon countryCode={fromCurr.country} className="w-6 h-4 rounded-xs border border-white dark:border-slate-900" />
                  <FlagIcon countryCode={toCurr.country} className="w-6 h-4 rounded-xs border border-white dark:border-slate-900" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                      {pair.from} / {pair.to}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isFixed
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {parityLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    {fromCurr.name} → {toCurr.name}
                  </p>
                </div>
              </div>

              {/* Right Column: Rate & Arrow */}
              <div className="flex items-center gap-3 text-right flex-shrink-0">
                <div>
                  <div className="text-sm font-mono font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    1 {pair.from} = {formatNum(rate, toCurr.decimals)} <span className="text-xs font-sans text-slate-400 font-bold">{pair.to}</span>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
