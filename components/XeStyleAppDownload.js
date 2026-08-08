import React from 'react';
import { Download, Smartphone, WifiOff } from 'lucide-react';

export default function XeStyleAppDownload({ onInstall, lang = 'fr' }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
          {lang === 'fr' ? 'Application' : 'App'}
        </p>
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white md:text-3xl">
          {lang === 'fr'
            ? 'Emportez AfriChange avec vous.'
            : 'Take AfriChange with you.'}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          {lang === 'fr'
            ? 'Installez la PWA sur votre téléphone et préparez vos taux avant le départ. Après synchronisation, les conversions préparées restent disponibles hors connexion.'
            : 'Install the PWA on your phone and prepare your rates before departure. After syncing, prepared conversions remain available offline.'}
        </p>

        <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> PWA installable</div>
          <div className="flex items-center gap-2"><WifiOff className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> {lang === 'fr' ? 'Mode hors connexion après synchronisation' : 'Offline after sync'}</div>
        </div>

        <button
          onClick={onInstall}
          className="mt-7 inline-flex items-center gap-2 bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          <Download className="h-4 w-4" />
          {lang === 'fr' ? "Installer l'application" : 'Install the app'}
        </button>
      </div>

      <div className="border-l-2 border-emerald-600 pl-5 dark:border-emerald-500">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          {lang === 'fr' ? 'Avant votre départ' : 'Before departure'}
        </p>
        <ol className="mt-4 space-y-5">
          <li className="grid grid-cols-[24px_1fr] gap-3">
            <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">01</span>
            <div><p className="text-sm font-semibold">{lang === 'fr' ? 'Installez AfriChange' : 'Install AfriChange'}</p><p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{lang === 'fr' ? 'Ajoutez l’application à votre écran d’accueil.' : 'Add the app to your home screen.'}</p></div>
          </li>
          <li className="grid grid-cols-[24px_1fr] gap-3">
            <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">02</span>
            <div><p className="text-sm font-semibold">{lang === 'fr' ? 'Préparez une destination' : 'Prepare a destination'}</p><p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{lang === 'fr' ? 'Téléchargez les taux utiles pendant que vous avez du réseau.' : 'Download useful rates while you are connected.'}</p></div>
          </li>
          <li className="grid grid-cols-[24px_1fr] gap-3">
            <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">03</span>
            <div><p className="text-sm font-semibold">{lang === 'fr' ? 'Convertissez sur place' : 'Convert on arrival'}</p><p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{lang === 'fr' ? 'Les taux préparés restent sur votre appareil lorsque la connexion disparaît.' : 'Prepared rates remain on your device when connectivity disappears.'}</p></div>
          </li>
        </ol>
      </div>
    </section>
  );
}
