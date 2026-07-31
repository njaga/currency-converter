import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  WifiOff,
  Coins,
  Zap,
  ShieldCheck,
  ChevronDown,
  Download,
  Globe,
  Sparkles,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { getTranslation } from '../lib/i18n';
import * as Flags from 'country-flag-icons/react/3x2';
import XeStyleLiveRates from './XeStyleLiveRates';
import XeStyleAppDownload from './XeStyleAppDownload';

const FlagIcon = ({ countryCode, className = 'w-6 h-4' }) => {
  if (!countryCode) return null;
  const Component = Flags[countryCode.toUpperCase()];
  if (!Component) return null;
  return <Component className={`${className} rounded-xs object-cover shadow-2xs`} />;
};

// Monetary Zones Data
const ZONES = [
  {
    name: 'Zone UEMOA (BCEAO)',
    cur: 'XOF',
    countries: ['sn', 'ci', 'ml', 'bf', 'bj', 'tg', 'ne', 'gw'],
    desc: 'Parité fixe 1 EUR = 655,957 CFA. Huit pays membres d\'Afrique de l\'Ouest.',
    badge: '655.957 Fixed',
  },
  {
    name: 'Zone CEMAC (BEAC)',
    cur: 'XAF',
    countries: ['cm', 'ga', 'cg', 'td', 'cf', 'gq'],
    desc: 'Parité fixe 1 EUR = 655,957 FCFA. Six pays membres d\'Afrique Centrale.',
    badge: '655.957 Fixed',
  },
  {
    name: 'Zone WAMZ & Afrique de l\'Ouest',
    cur: 'NGN / GHS',
    countries: ['ng', 'gh', 'gm', 'sl'],
    desc: 'Taux flottants réactifs pour les économies majeures (Naira, Cedi, Dalasi).',
    badge: 'Float Market',
  },
  {
    name: 'Communauté d\'Afrique de l\'Est (EAC)',
    cur: 'KES / TZS',
    countries: ['ke', 'tz', 'ug', 'rw', 'et'],
    desc: 'Shilling kényan, tanzanien, ougandais et Birr éthiopien en temps réel.',
    badge: 'Live Stream',
  },
];

export default function MarketingSections({
  lang = 'fr',
  allRates = {},
  onSelectPair,
  onOpenSelectorModal,
  pwaPrompt,
  onInstall,
}) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const steps = [
    {
      step: '01',
      icon: Coins,
      title: getTranslation(lang, 'step1Title'),
      desc: getTranslation(lang, 'step1Desc'),
    },
    {
      step: '02',
      icon: Zap,
      title: getTranslation(lang, 'step2Title'),
      desc: getTranslation(lang, 'step2Desc'),
    },
    {
      step: '03',
      icon: WifiOff,
      title: getTranslation(lang, 'step3Title'),
      desc: getTranslation(lang, 'step3Desc'),
    },
  ];

  const faqs = [
    { q: getTranslation(lang, 'faq1Q'), a: getTranslation(lang, 'faq1A') },
    { q: getTranslation(lang, 'faq2Q'), a: getTranslation(lang, 'faq2A') },
    { q: getTranslation(lang, 'faq3Q'), a: getTranslation(lang, 'faq3A') },
    { q: getTranslation(lang, 'faq4Q'), a: getTranslation(lang, 'faq4A') },
  ];

  return (
    <div className="space-y-20 py-6">
      {/* SECTION 1: XE-STYLE LIVE EXCHANGE RATES TABLE */}
      <XeStyleLiveRates
        allRates={allRates}
        onSelectPair={onSelectPair}
        onOpenSelectorModal={onOpenSelectorModal}
        lang={lang}
      />

      {/* SECTION 2: XE-STYLE APP DOWNLOAD BANNER WITH iPHONE MOCKUP & QR CODE */}
      <XeStyleAppDownload onInstall={onInstall} lang={lang} />

      {/* SECTION 3: HOW IT WORKS (3 STEPS) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>Simplicité</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {getTranslation(lang, 'howItWorksTitle')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {getTranslation(lang, 'howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className="relative p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-lg hover:border-blue-500 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-blue-600/30 dark:text-blue-400/30 group-hover:text-blue-600 transition-colors">
                    {s.step}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: MONETARY ZONES SHOWCASE */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Globe className="w-3.5 h-3.5" />
            <span>Couverture régionale</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {getTranslation(lang, 'zonesTitle')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {getTranslation(lang, 'zonesSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ZONES.map((zone, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-md space-y-4 hover:border-blue-500 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {zone.name}
                  </h3>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    {zone.cur}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-bold">
                  {zone.badge}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {zone.desc}
              </p>

              {/* Flags list */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="text-[10px] font-bold text-slate-400 mr-1">Pays:</span>
                {zone.countries.map((c) => (
                  <FlagIcon key={c} countryCode={c} className="w-5 h-3.5 rounded-xs" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 5: KEY STATS BANNER */}
      <section className="rounded-3xl bg-[#0a142f] text-white p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-400">30+</span>
            <p className="text-xs text-slate-300 font-medium">
              {getTranslation(lang, 'statCurrencies')}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-blue-400">&lt;10ms</span>
            <p className="text-xs text-slate-300 font-medium">
              {getTranslation(lang, 'statSpeed')}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">100%</span>
            <p className="text-xs text-slate-300 font-medium">
              {getTranslation(lang, 'statOffline')}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-amber-400">0€</span>
            <p className="text-xs text-slate-300 font-medium">
              {getTranslation(lang, 'statFees')}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ ACCORDION */}
      <section className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {getTranslation(lang, 'faqTitle')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {getTranslation(lang, 'faqSubtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm font-extrabold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700/50 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
