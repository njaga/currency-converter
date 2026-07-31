import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, Zap, ShieldCheck, Coins, Sparkles } from 'lucide-react';
import { getTranslation } from '../lib/i18n';

export default function LandingFeatures({ lang = 'fr' }) {
  const features = [
    {
      icon: WifiOff,
      titleKey: 'featureOfflineTitle',
      descKey: 'featureOfflineDesc',
      tag: 'Offline Ready',
    },
    {
      icon: Coins,
      titleKey: 'featureCurrenciesTitle',
      descKey: 'featureCurrenciesDesc',
      tag: 'UEMOA / CEMAC',
    },
    {
      icon: Zap,
      titleKey: 'featureSpeedTitle',
      descKey: 'featureSpeedDesc',
      tag: '<10ms Speed',
    },
    {
      icon: ShieldCheck,
      titleKey: 'featureCacheTitle',
      descKey: 'featureCacheDesc',
      tag: 'Data Saver',
    },
  ];

  return (
    <div className="py-10 space-y-8 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Avantages Clés</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {getTranslation(lang, 'whyChoose')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {getTranslation(lang, 'whyChooseSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-lg hover:shadow-xl hover:border-blue-500 transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                  {feat.tag}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 pt-1">
                {getTranslation(lang, feat.titleKey)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {getTranslation(lang, feat.descKey)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
