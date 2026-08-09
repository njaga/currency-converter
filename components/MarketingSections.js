import React, { useState } from 'react';
import { ChevronDown, Coins, Globe, ShieldCheck, WifiOff, Zap } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import { getTranslation } from '../lib/i18n';
import XeStyleLiveRates from './XeStyleLiveRates';
import XeStyleAppDownload from './XeStyleAppDownload';

const FlagIcon = ({ countryCode }) => {
  if (!countryCode) return null;
  const Component = Flags[countryCode.toUpperCase()];
  return Component ? <Component className="h-4 w-6 rounded-sm border border-black/5 object-cover" /> : null;
};

const ZONES = [
  {
    name: 'UEMOA (BCEAO)',
    cur: 'XOF',
    countries: ['sn', 'ci', 'ml', 'bf', 'bj', 'tg', 'ne', 'gw'],
    desc: "Huit pays d'Afrique de l'Ouest partageant le franc CFA BCEAO.",
  },
  {
    name: 'CEMAC (BEAC)',
    cur: 'XAF',
    countries: ['cm', 'ga', 'cg', 'td', 'cf', 'gq'],
    desc: "Six pays d'Afrique centrale partageant le franc CFA BEAC.",
  },
  {
    name: "Afrique de l'Ouest",
    cur: 'NGN · GHS · GMD · SLE',
    countries: ['ng', 'gh', 'gm', 'sl'],
    desc: 'Naira, cedi, dalasi et leone avec taux synchronisés depuis plusieurs sources.',
  },
  {
    name: "Afrique de l'Est",
    cur: 'KES · TZS · UGX · RWF',
    countries: ['ke', 'tz', 'ug', 'rw'],
    desc: "Principales devises utilisées dans la région est-africaine.",
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

  const steps = [
    { step: '01', icon: Coins, title: getTranslation(lang, 'step1Title'), desc: getTranslation(lang, 'step1Desc') },
    { step: '02', icon: Zap, title: getTranslation(lang, 'step2Title'), desc: getTranslation(lang, 'step2Desc') },
    { step: '03', icon: WifiOff, title: getTranslation(lang, 'step3Title'), desc: getTranslation(lang, 'step3Desc') },
  ];

  const faqs = [
    { q: getTranslation(lang, 'faq1Q'), a: getTranslation(lang, 'faq1A') },
    { q: getTranslation(lang, 'faq2Q'), a: getTranslation(lang, 'faq2A') },
    { q: getTranslation(lang, 'faq3Q'), a: getTranslation(lang, 'faq3A') },
    { q: getTranslation(lang, 'faq4Q'), a: getTranslation(lang, 'faq4A') },
  ];

  return (
    <div className="space-y-0">
      <section className="border-t border-slate-200 py-12 dark:border-slate-800 md:py-16">
        <div className="mb-7 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
            {lang === 'fr' ? 'Marché' : 'Market'}
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white md:text-3xl">
            {lang === 'fr' ? 'Taux de change en direct' : 'Live exchange rates'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {lang === 'fr' ? 'Une lecture simple des principales paires suivies par AfriChange.' : 'A simple view of the main currency pairs tracked by AfriChange.'}
          </p>
        </div>
        <XeStyleLiveRates allRates={allRates} onSelectPair={onSelectPair} onOpenSelectorModal={onOpenSelectorModal} lang={lang} />
      </section>

      <section className="border-t border-slate-200 py-12 dark:border-slate-800 md:py-16">
        <XeStyleAppDownload onInstall={onInstall} pwaPrompt={pwaPrompt} lang={lang} />
      </section>

      <section className="border-t border-slate-200 py-12 dark:border-slate-800 md:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
            {lang === 'fr' ? 'Utilisation' : 'Usage'}
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white md:text-3xl">
            {getTranslation(lang, 'howItWorksTitle')}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {getTranslation(lang, 'howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid border-y border-slate-200 dark:border-slate-800 md:grid-cols-3">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className={`py-6 md:px-6 ${index > 0 ? 'border-t border-slate-200 md:border-l md:border-t-0 dark:border-slate-800' : ''}`}>
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-400">{item.step}</span>
                  <Icon className="h-4 w-4 text-emerald-700 dark:text-emerald-400" strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-slate-200 py-12 dark:border-slate-800 md:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
            {lang === 'fr' ? 'Couverture' : 'Coverage'}
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white md:text-3xl">
            {getTranslation(lang, 'zonesTitle')}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {getTranslation(lang, 'zonesSubtitle')}
          </p>
        </div>

        <div className="border-y border-slate-200 dark:border-slate-800">
          {ZONES.map((zone, index) => (
            <div key={zone.name} className={`grid gap-4 py-5 md:grid-cols-[1fr_1fr_auto] md:items-center ${index > 0 ? 'border-t border-slate-200 dark:border-slate-800' : ''}`}>
              <div>
                <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{zone.name}</h3>
                <p className="mt-1 font-mono text-xs text-emerald-700 dark:text-emerald-400">{zone.cur}</p>
              </div>
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{zone.desc}</p>
              <div className="flex flex-wrap gap-1.5 md:justify-end">
                {zone.countries.map((country) => <FlagIcon key={country} countryCode={country} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 py-12 dark:border-slate-800 md:py-16">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
              {lang === 'fr' ? 'Confiance' : 'Trust'}
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white md:text-3xl">
              {lang === 'fr' ? 'Pensé pour être utile, pas spectaculaire.' : 'Built to be useful, not flashy.'}
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
              <ShieldCheck className="mb-3 h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              <p className="text-sm font-semibold">{lang === 'fr' ? 'Données locales' : 'Local data'}</p>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{lang === 'fr' ? 'Historique, favoris et voyages préparés restent sur votre appareil.' : 'History, favorites and prepared trips stay on your device.'}</p>
            </div>
            <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
              <Globe className="mb-3 h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              <p className="text-sm font-semibold">{lang === 'fr' ? 'Conçu pour l’Afrique' : 'Built for Africa'}</p>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{lang === 'fr' ? 'Les devises africaines et les besoins de déplacement sont au centre du produit.' : 'African currencies and travel needs are at the centre of the product.'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 py-12 dark:border-slate-800 md:py-16">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">{getTranslation(lang, 'faqTitle')}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{getTranslation(lang, 'faqSubtitle')}</p>
        </div>

        <div className="border-y border-slate-200 dark:border-slate-800">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={faq.q} className={index > 0 ? 'border-t border-slate-200 dark:border-slate-800' : ''}>
                <button onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-slate-950 dark:text-white">
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 flex-none text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <p className="max-w-3xl pb-5 text-sm leading-6 text-slate-500 dark:text-slate-400">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
