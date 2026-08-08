import React from 'react';
import { Download, Smartphone, WifiOff, Check, Plane, MapPin } from 'lucide-react';

export default function XeStyleAppDownload({ onInstall, lang = 'fr' }) {
  return (
    <section className="relative max-w-full overflow-hidden rounded-[32px] border border-slate-200/80 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,.12),transparent_38%),linear-gradient(to_bottom,#fff,#f8fafc)] p-6 shadow-[0_24px_80px_-50px_rgba(15,23,42,.45)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,.12),transparent_35%),linear-gradient(to_bottom,#0f172a,#020617)] md:p-10 lg:p-12">
      <div className="grid min-w-0 max-w-full gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:items-center">
        <div className="min-w-0 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-emerald-700 backdrop-blur dark:border-emerald-900 dark:bg-slate-900/70 dark:text-emerald-400"><Smartphone className="h-3.5 w-3.5" /> {lang === 'fr' ? 'Application installable' : 'Installable app'}</div>
          <h2 className="text-3xl font-semibold tracking-[-0.045em] text-slate-950 dark:text-white md:text-4xl">{lang === 'fr' ? 'Votre convertisseur de voyage, dans votre poche.' : 'Your travel converter, in your pocket.'}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">{lang === 'fr' ? 'Installez AfriChange, préparez vos destinations avant de partir et gardez vos taux utiles accessibles même lorsque la connexion disparaît.' : 'Install AfriChange, prepare your destinations before departure and keep useful rates accessible even when connectivity disappears.'}</p>

          <div className="mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
            {[['PWA installable', Smartphone], [lang === 'fr' ? 'Hors connexion après sync' : 'Offline after sync', WifiOff], [lang === 'fr' ? 'Préparation voyage' : 'Trip preparation', Plane], [lang === 'fr' ? 'Données sur cet appareil' : 'Data stays on-device', Check]].map(([label, Icon]) => <div key={label} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300"><span className="flex h-7 w-7 flex-none items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"><Icon className="h-3.5 w-3.5" /></span><span className="min-w-0">{label}</span></div>)}
          </div>

          <button onClick={onInstall} className="mt-8 inline-flex max-w-full items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 active:translate-y-0 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-400"><Download className="h-4 w-4 flex-none" /><span>{lang === 'fr' ? "Installer l'application" : 'Install the app'}</span></button>
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-[420px]">
          <div className="absolute -inset-6 rounded-full bg-emerald-300/15 blur-3xl dark:bg-emerald-500/10" />
          <div className="relative mx-auto w-full max-w-[245px] rounded-[38px] border-[7px] border-slate-900 bg-slate-950 p-2 shadow-[0_30px_90px_-30px_rgba(15,23,42,.55)] dark:border-slate-700">
            <div className="overflow-hidden rounded-[28px] bg-white p-4 text-slate-950">
              <div className="mx-auto mb-4 h-1.5 w-16 max-w-full rounded-full bg-slate-200" />
              <div className="mb-4 flex min-w-0 items-center justify-between gap-2"><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-emerald-700">Voyage</p><p className="mt-1 truncate text-base font-semibold">Gambie</p></div><span className="flex-none rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700">Prêt hors ligne</span></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="flex items-center gap-2"><MapPin className="h-4 w-4 flex-none text-emerald-700" /><span className="min-w-0 truncate text-xs font-semibold">GMD ↔ XOF</span></div><p className="mt-4 text-2xl font-semibold tracking-[-.04em]">500 GMD</p><p className="mt-1 text-sm text-slate-500">≈ 4 255 XOF</p></div>
              <div className="mt-3 grid grid-cols-3 gap-2">{['1k','2k','5k'].map((item) => <div key={item} className="min-w-0 rounded-xl border border-slate-200 px-1 py-2 text-center text-[10px] font-semibold text-slate-600">{item} GMD</div>)}</div>
              <div className="mt-4 flex min-w-0 items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[9px] text-slate-400"><span className="min-w-0 truncate">Dernière sync</span><span className="flex-none font-medium text-slate-600">Aujourd’hui · 06:21</span></div>
            </div>
          </div>
          <div className="absolute -right-1 top-16 hidden w-40 rotate-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-xl backdrop-blur md:block dark:border-slate-700 dark:bg-slate-900/90"><p className="text-[10px] font-semibold text-slate-950 dark:text-white">Voyage préparé</p><p className="mt-1 text-[9px] leading-4 text-slate-500">GMD, XOF, EUR et USD disponibles hors connexion.</p></div>
        </div>
      </div>
    </section>
  );
}
