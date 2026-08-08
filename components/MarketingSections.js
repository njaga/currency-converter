import React, { useState } from 'react';
import { ChevronDown, Coins, Globe, ShieldCheck, WifiOff, Zap, ArrowUpRight } from 'lucide-react';
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
  { name: 'UEMOA (BCEAO)', cur: 'XOF', countries: ['sn','ci','ml','bf','bj','tg','ne','gw'], desc: "Huit pays d'Afrique de l'Ouest partageant le franc CFA BCEAO." },
  { name: 'CEMAC (BEAC)', cur: 'XAF', countries: ['cm','ga','cg','td','cf','gq'], desc: "Six pays d'Afrique centrale partageant le franc CFA BEAC." },
  { name: "Afrique de l'Ouest", cur: 'NGN · GHS · GMD · SLE', countries: ['ng','gh','gm','sl'], desc: 'Naira, cedi, dalasi et leone avec taux synchronisés depuis plusieurs sources.' },
  { name: "Afrique de l'Est", cur: 'KES · TZS · UGX · RWF', countries: ['ke','tz','ug','rw'], desc: "Principales devises utilisées dans la région est-africaine." },
];

export default function MarketingSections({ lang = 'fr', allRates = {}, onSelectPair, onOpenSelectorModal, pwaPrompt, onInstall }) {
  const [openFaq, setOpenFaq] = useState(null);
  const steps = [
    { step: '01', icon: Coins, title: getTranslation(lang, 'step1Title'), desc: getTranslation(lang, 'step1Desc') },
    { step: '02', icon: Zap, title: getTranslation(lang, 'step2Title'), desc: getTranslation(lang, 'step2Desc') },
    { step: '03', icon: WifiOff, title: getTranslation(lang, 'step3Title'), desc: getTranslation(lang, 'step3Desc') },
  ];
  const faqs = [1,2,3,4].map((n) => ({ q: getTranslation(lang, `faq${n}Q`), a: getTranslation(lang, `faq${n}A`) }));

  return (
    <div>
      <section className="py-14 md:py-20">
        <div className="mb-8 max-w-2xl"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">{lang === 'fr' ? 'Marché' : 'Market'}</p><h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white md:text-4xl">{lang === 'fr' ? 'Taux de change en direct' : 'Live exchange rates'}</h2><p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{lang === 'fr' ? 'Une lecture claire des principales paires suivies par AfriChange.' : 'A clear view of the main currency pairs tracked by AfriChange.'}</p></div>
        <XeStyleLiveRates allRates={allRates} onSelectPair={onSelectPair} onOpenSelectorModal={onOpenSelectorModal} lang={lang} />
      </section>

      <section className="py-8 md:py-12"><XeStyleAppDownload onInstall={onInstall} pwaPrompt={pwaPrompt} lang={lang} /></section>

      <section className="py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
          <div className="lg:sticky lg:top-28"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">{lang === 'fr' ? 'Utilisation' : 'Usage'}</p><h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white md:text-4xl">{getTranslation(lang, 'howItWorksTitle')}</h2><p className="mt-3 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">{getTranslation(lang, 'howItWorksSubtitle')}</p></div>
          <div className="space-y-3">{steps.map((item) => { const Icon = item.icon; return <article key={item.step} className="group grid gap-5 rounded-[26px] border border-slate-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_20px_60px_-45px_rgba(16,185,129,.35)] dark:border-white/10 dark:bg-slate-900/60 sm:grid-cols-[64px_1fr_auto] sm:items-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"><Icon className="h-5 w-5" /></div><div><span className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Étape {item.step}</span><h3 className="mt-1 text-base font-semibold text-slate-950 dark:text-white">{item.title}</h3><p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.desc}</p></div><ArrowUpRight className="hidden h-4 w-4 text-slate-300 transition-all group-hover:text-emerald-600 sm:block" /></article>; })}</div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mb-9 max-w-2xl"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">{lang === 'fr' ? 'Couverture' : 'Coverage'}</p><h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white md:text-4xl">{getTranslation(lang, 'zonesTitle')}</h2><p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{getTranslation(lang, 'zonesSubtitle')}</p></div>
        <div className="grid gap-4 md:grid-cols-2">{ZONES.map((zone) => <article key={zone.name} className="group rounded-[28px] border border-slate-200/80 bg-slate-50/70 p-6 transition-all duration-300 hover:border-emerald-300 hover:bg-white hover:shadow-[0_22px_70px_-50px_rgba(16,185,129,.45)] dark:border-white/10 dark:bg-slate-900/50"><div className="flex items-start justify-between gap-4"><div><h3 className="text-base font-semibold tracking-[-.02em] text-slate-950 dark:text-white">{zone.name}</h3><p className="mt-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">{zone.cur}</p></div><Globe className="h-5 w-5 text-slate-300 transition-colors group-hover:text-emerald-600" /></div><p className="mt-5 text-sm leading-6 text-slate-500 dark:text-slate-400">{zone.desc}</p><div className="mt-6 flex flex-wrap gap-2">{zone.countries.map((country) => <span key={country} className="rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-950"><FlagIcon countryCode={country} /></span>)}</div></article>)}</div>
      </section>

      <section className="py-16 md:py-24"><div className="rounded-[30px] border border-slate-200/80 bg-slate-950 p-7 text-white shadow-[0_30px_90px_-55px_rgba(15,23,42,.85)] dark:border-white/10 md:p-10"><div className="grid gap-8 md:grid-cols-[.8fr_1.2fr]"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">{lang === 'fr' ? 'Confiance' : 'Trust'}</p><h2 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">{lang === 'fr' ? 'Conçu pour rester utile quand le contexte change.' : 'Designed to remain useful when conditions change.'}</h2></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/5 p-5"><ShieldCheck className="mb-5 h-5 w-5 text-emerald-400" /><p className="text-sm font-semibold">{lang === 'fr' ? 'Données locales' : 'Local data'}</p><p className="mt-2 text-sm leading-6 text-slate-400">{lang === 'fr' ? 'Historique, favoris et voyages préparés restent sur votre appareil.' : 'History, favorites and prepared trips stay on your device.'}</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-5"><Globe className="mb-5 h-5 w-5 text-emerald-400" /><p className="text-sm font-semibold">{lang === 'fr' ? 'Conçu pour l’Afrique' : 'Built for Africa'}</p><p className="mt-2 text-sm leading-6 text-slate-400">{lang === 'fr' ? 'Les devises africaines et les besoins de déplacement restent au centre du produit.' : 'African currencies and travel needs stay at the centre of the product.'}</p></div></div></div></div></section>

      <section className="py-16 md:py-24"><div className="mx-auto max-w-3xl"><div className="mb-7"><h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">{getTranslation(lang, 'faqTitle')}</h2><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{getTranslation(lang, 'faqSubtitle')}</p></div><div className="space-y-2">{faqs.map((faq, index) => { const isOpen = openFaq === index; return <div key={faq.q} className={`overflow-hidden rounded-2xl border transition-all ${isOpen ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/10' : 'border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/40'}`}><button onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-slate-950 dark:text-white"><span>{faq.q}</span><ChevronDown className={`h-4 w-4 flex-none text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} /></button><div className={`grid transition-[grid-template-rows,opacity] duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-6 text-slate-500 dark:text-slate-400">{faq.a}</p></div></div></div>; })}</div></div></section>
    </div>
  );
}
