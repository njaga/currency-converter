import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Download, Share, Smartphone } from 'lucide-react';

function StoreBadge({ store, fr }) {
  const apple = store === 'apple';
  return <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[.04]">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">{apple?<span className="text-lg font-semibold"></span>:<span className="text-sm font-bold">▶</span>}</div>
    <div><p className="text-[9px] font-semibold uppercase tracking-[.13em] text-slate-400">{fr?'Bientôt disponible':'Coming soon'}</p><p className="mt-0.5 text-sm font-semibold">{apple?'App Store':'Google Play'}</p></div>
  </div>;
}

export default function AppDownloadSection({ lang='fr' }) {
  const fr=lang==='fr';
  const [promptEvent,setPromptEvent]=useState(null);
  const [installed,setInstalled]=useState(false);
  const [isIos,setIsIos]=useState(false);

  useEffect(()=>{
    const standalone=window.matchMedia?.('(display-mode: standalone)').matches||window.navigator.standalone;
    const ios=/iphone|ipad|ipod/i.test(window.navigator.userAgent);
    setInstalled(Boolean(standalone));
    setIsIos(ios);
    const capture=e=>{e.preventDefault();setPromptEvent(e)};
    window.addEventListener('beforeinstallprompt',capture);
    return()=>window.removeEventListener('beforeinstallprompt',capture);
  },[]);

  const install=async()=>{if(!promptEvent)return;promptEvent.prompt();const choice=await promptEvent.userChoice;if(choice?.outcome==='accepted')setInstalled(true);setPromptEvent(null)};

  return <section id="download" className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 lg:py-28">
    <div className="grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
      <div className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">{fr?'Kiwango partout avec vous':'Kiwango everywhere'}</p><h2 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-.05em] sm:text-5xl">{fr?'Une vraie app dans votre poche. Même avant les stores.':'A real app in your pocket. Even before the stores.'}</h2><p className="mt-6 max-w-lg text-base leading-7 text-slate-500">{fr?'Installez aujourd’hui la PWA Kiwango. Vos Travel Packs, repères de change et outils restent accessibles depuis votre écran d’accueil. Les apps iOS et Android arrivent ensuite.':'Install the Kiwango PWA today. Your Travel Packs, exchange references and tools stay accessible from your home screen. Native iOS and Android apps are next.'}</p>
        <div className="mt-7 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 dark:text-slate-300">{[(fr?'Installation sans store':'Install without a store'),(fr?'Fonctionnement hors connexion':'Works offline'),(fr?'Données conservées localement':'Data stays local'),(fr?'Mobile, tablette et desktop':'Mobile, tablet and desktop')].map(text=><div key={text} className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50"><Check className="h-3.5 w-3.5 text-emerald-700"/></span>{text}</div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">{promptEvent&&!installed?<button onClick={install} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:bg-white dark:text-slate-950"><Download className="h-4 w-4"/>{fr?'Installer Kiwango':'Install Kiwango'}</button>:<Link href="/app" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">{installed?(fr?'Ouvrir Kiwango':'Open Kiwango'):(fr?'Utiliser la web app':'Use the web app')}<ArrowRight className="h-4 w-4"/></Link>}</div>
        {isIos&&!installed&&!promptEvent&&<div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/[.035] dark:text-slate-300"><div className="flex gap-3"><Share className="mt-0.5 h-4 w-4 flex-none text-emerald-700"/><div><p className="font-semibold text-slate-900 dark:text-white">{fr?'Installer sur iPhone ou iPad':'Install on iPhone or iPad'}</p><p className="mt-1 leading-6">{fr?'Dans Safari, touchez Partager puis « Sur l’écran d’accueil ». Kiwango s’ouvrira ensuite comme une application autonome.':'In Safari, tap Share, then “Add to Home Screen”. Kiwango will then open like a standalone app.'}</p></div></div></div>}
        <div className="mt-6 flex flex-wrap gap-2"><StoreBadge store="apple" fr={fr}/><StoreBadge store="play" fr={fr}/></div>
      </div>
      <div className="relative min-h-[520px] overflow-hidden rounded-[38px] bg-[#eef7f2] dark:bg-[#0a1711]">
        <div className="absolute -right-20 -top-16 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl"/><div className="absolute bottom-12 left-8 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-[0_16px_40px_rgba(15,23,42,.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/90"><p className="text-[10px] uppercase tracking-[.14em] text-slate-400">Cash Wallet</p><p className="mt-1 text-base font-semibold">3 250 GMD</p></div>
        <div className="absolute right-7 top-16 z-20 rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,.1)] dark:border-emerald-900 dark:bg-slate-900"><p className="text-[10px] uppercase tracking-[.14em] text-slate-400">Gambie</p><p className="mt-1 text-sm font-semibold text-emerald-700">Prêt hors connexion ✓</p></div>
        <div className="absolute bottom-[-34px] left-1/2 w-[270px] -translate-x-1/2 rotate-[2deg] rounded-[44px] border-[8px] border-slate-950 bg-white p-4 shadow-[0_45px_100px_rgba(15,23,42,.24)] dark:bg-slate-900"><div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-slate-200"/><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-emerald-400"><Smartphone className="h-5 w-5"/></div><div><p className="text-sm font-semibold">Kiwango</p><p className="text-xs text-slate-400">Travel Pack</p></div></div><div className="mt-6 rounded-[22px] bg-emerald-50 p-4 dark:bg-emerald-950/20"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-emerald-700">GMD ↔ XOF</p><p className="mt-3 text-3xl font-semibold tracking-[-.04em]">500 GMD</p><p className="mt-1 text-sm text-slate-500">≈ 4 255 XOF</p></div><div className="mt-3 grid grid-cols-3 gap-2">{['1k','2k','5k'].map(v=><div key={v} className="rounded-xl border border-slate-200 py-2 text-center text-xs font-semibold dark:border-white/10">{v} GMD</div>)}</div><div className="mt-5 flex justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-400 dark:border-white/10"><span>Dernière sync</span><span className="font-semibold text-slate-600 dark:text-slate-300">Aujourd’hui · 06:21</span></div></div>
      </div>
    </div>
  </section>;
}
