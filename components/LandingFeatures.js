import React from 'react';
import { Coins, ShieldCheck, WifiOff, Zap } from 'lucide-react';
import { getTranslation } from '../lib/i18n';

const FEATURES = [
  {
    icon: WifiOff,
    titleFr: 'Disponible même sans réseau',
    titleEn: 'Available even without a network',
    descFr: 'Préparez un voyage en ligne, puis consultez vos derniers taux et repères hors connexion.',
    descEn: 'Prepare a trip online, then access your latest rates and references offline.',
  },
  {
    icon: Coins,
    titleFr: 'Devises africaines et internationales',
    titleEn: 'African and international currencies',
    descFr: 'XOF, XAF, NGN, GHS, SLE, KES, EUR, USD et les principales devises de voyage.',
    descEn: 'XOF, XAF, NGN, GHS, SLE, KES, EUR, USD and major travel currencies.',
  },
  {
    icon: Zap,
    titleFr: 'Conversion immédiate',
    titleEn: 'Instant conversion',
    descFr: 'Le calcul utilise le dernier taux synchronisé sans appeler un service externe à chaque chiffre saisi.',
    descEn: 'Calculations use the latest synced rate without calling an external service for every digit.',
  },
  {
    icon: ShieldCheck,
    titleFr: 'Vos données restent sur cet appareil',
    titleEn: 'Your data stays on this device',
    descFr: 'Aucun compte requis. Favoris, budgets et voyages préparés sont enregistrés localement.',
    descEn: 'No account required. Favourites, budgets and prepared trips are stored locally.',
  },
];

export default function LandingFeatures({ lang = 'fr' }) {
  const fr = lang === 'fr';

  return (
    <section className="py-16 md:py-24">
      <div className="grid gap-8 border-b border-slate-200 pb-8 dark:border-white/10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">Kiwango</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-.045em] text-slate-950 dark:text-white md:text-5xl">
            {getTranslation(lang, 'whyChoose')}
          </h2>
        </div>
        <p className="max-w-xl text-base leading-7 text-slate-500 lg:justify-self-end">
          {fr
            ? 'Quatre principes simples pour comprendre votre argent avant et pendant un déplacement.'
            : 'Four simple principles to understand your money before and during a trip.'}
        </p>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-white/10">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <article key={feature.titleFr} className="grid gap-4 py-7 sm:grid-cols-[56px_1fr_1.3fr] sm:items-center">
              <span className="text-xs font-semibold tabular-nums text-slate-400">0{index + 1}</span>
              <h3 className="flex items-center gap-3 text-lg font-semibold">
                <Icon className="h-5 w-5 text-emerald-700" />
                {fr ? feature.titleFr : feature.titleEn}
              </h3>
              <p className="text-sm leading-6 text-slate-500">{fr ? feature.descFr : feature.descEn}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
