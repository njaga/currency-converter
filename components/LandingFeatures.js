import React from 'react';
import { WifiOff, Zap, ShieldCheck, Coins, Check } from 'lucide-react';
import { getTranslation } from '../lib/i18n';

export default function LandingFeatures({ lang = 'fr' }) {
  const fr = lang === 'fr';

  return (
    <section className="py-16 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">Kiwango</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-.045em] text-slate-950 dark:text-white md:text-5xl">
            {getTranslation(lang, 'whyChoose')}
          </h2>
        </div>
        <p className="max-w-xl text-base leading-7 text-slate-500 lg:justify-self-end">
          {fr
            ? 'Une expérience pensée autour des vrais moments où comprendre son argent devient difficile pendant un voyage.'
            : 'An experience built around the real moments when understanding your money becomes difficult while travelling.'}
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-12 lg:grid-rows-2">
        <article className="relative min-h-[390px] overflow-hidden rounded-[34px] bg-[#07130f] p-7 text-white lg:col-span-7 lg:row-span-2 sm:p-9">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative max-w-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
              <WifiOff className="h-5 w-5" />
            </div>
            <h3 className="mt-7 text-3xl font-semibold tracking-[-.04em]">
              {fr ? 'Le réseau disparaît. Vos repères restent.' : 'The network disappears. Your references stay.'}
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-400">{getTranslation(lang, 'featureOfflineDesc')}</p>
          </div>
          <div className="absolute bottom-7 left-7 right-7 grid gap-2 sm:left-9 sm:right-9 sm:grid-cols-3">
            {[
              ['Gambie', 'GMD ↔ XOF', '✓ Offline'],
              ['Sierra Leone', 'SLE ↔ EUR', '✓ Offline'],
              [fr ? 'Dernière sync' : 'Last sync', '06:21', fr ? "Aujourd'hui" : 'Today'],
            ].map(([label, value, meta]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
                <p className="text-[10px] uppercase tracking-[.13em] text-slate-500">{label}</p>
                <p className="mt-2 font-semibold">{value}</p>
                <p className="mt-1 text-xs text-emerald-300">{meta}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="relative min-h-[190px] overflow-hidden rounded-[34px] bg-[#eff8f3] p-7 dark:bg-emerald-950/20 lg:col-span-5">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-900">
              <Coins className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-700">XOF · XAF · GMD · GHS</span>
          </div>
          <h3 className="mt-7 text-xl font-semibold tracking-[-.03em]">{getTranslation(lang, 'featureCurrenciesTitle')}</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{getTranslation(lang, 'featureCurrenciesDesc')}</p>
        </article>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5">
          <article className="rounded-[30px] border border-slate-200/80 p-6 dark:border-white/10">
            <Zap className="h-5 w-5 text-emerald-700" />
            <h3 className="mt-8 text-lg font-semibold">{getTranslation(lang, 'featureSpeedTitle')}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{getTranslation(lang, 'featureSpeedDesc')}</p>
          </article>
          <article className="rounded-[30px] border border-slate-200/80 p-6 dark:border-white/10">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
            <h3 className="mt-8 text-lg font-semibold">{getTranslation(lang, 'featureCacheTitle')}</h3>
            <div className="mt-3 space-y-2 text-xs text-slate-500">
              <p className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" />{fr ? 'Pas de compte requis' : 'No account required'}</p>
              <p className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" />{fr ? 'Données locales' : 'Local data'}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
