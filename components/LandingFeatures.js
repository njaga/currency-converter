import React from 'react';
import { WifiOff, Zap, ShieldCheck, Coins } from 'lucide-react';
import { getTranslation } from '../lib/i18n';

export default function LandingFeatures({ lang = 'fr' }) {
  const features = [
    {
      icon: WifiOff,
      titleKey: 'featureOfflineTitle',
      descKey: 'featureOfflineDesc',
    },
    {
      icon: Coins,
      titleKey: 'featureCurrenciesTitle',
      descKey: 'featureCurrenciesDesc',
    },
    {
      icon: Zap,
      titleKey: 'featureSpeedTitle',
      descKey: 'featureSpeedDesc',
    },
    {
      icon: ShieldCheck,
      titleKey: 'featureCacheTitle',
      descKey: 'featureCacheDesc',
    },
  ];

  return (
    <section className="border-t border-slate-200 py-12 dark:border-slate-800 md:py-16">
      <div className="mb-8 max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
          AfriChange
        </p>
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white md:text-3xl">
          {getTranslation(lang, 'whyChoose')}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {getTranslation(lang, 'whyChooseSubtitle')}
        </p>
      </div>

      <div className="grid border-y border-slate-200 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.titleKey}
              className={`px-0 py-6 sm:px-5 lg:px-6 ${index > 0 ? 'border-t border-slate-200 dark:border-slate-800 sm:border-t-0' : ''} ${index % 2 === 1 ? 'sm:border-l sm:border-slate-200 sm:dark:border-slate-800' : ''} ${index > 1 ? 'lg:border-l lg:border-slate-200 lg:dark:border-slate-800' : ''}`}
            >
              <div className="mb-5 flex h-9 w-9 items-center justify-center border border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-400">
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </div>
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
                {getTranslation(lang, feature.titleKey)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {getTranslation(lang, feature.descKey)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
