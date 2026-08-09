import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Download, Share, Smartphone } from 'lucide-react';

function AppleLogo() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true"><path d="M17.05 12.54c-.03-3.06 2.5-4.55 2.61-4.62a5.61 5.61 0 0 0-4.42-2.39c-1.86-.19-3.67 1.11-4.62 1.11-.97 0-2.44-1.09-4.02-1.06a5.86 5.86 0 0 0-4.93 3c-2.13 3.69-.54 9.12 1.5 12.1 1.02 1.46 2.2 3.08 3.78 3.02 1.54-.06 2.12-.97 3.98-.97 1.84 0 2.39.97 3.99.93 1.66-.03 2.7-1.46 3.68-2.93a12.1 12.1 0 0 0 1.68-3.43 5.26 5.26 0 0 1-3.23-4.76ZM14.02 3.56A5.33 5.33 0 0 0 15.24 0a5.43 5.43 0 0 0-3.51 1.69 5.07 5.07 0 0 0-1.25 3.42 4.48 4.48 0 0 0 3.54-1.55Z"/></svg>;
}

function GooglePlayLogo() {
  return <svg viewBox="0 0 32 36" className="h-7 w-7" aria-hidden="true"><path fill="#34A853" d="M1.1 1.3A3 3 0 0 0 .3 3.4v29.2c0 .8.3 1.5.8 2.1L17.5 18 1.1 1.3Z"/><path fill="#4285F4" d="m22.9 12.5-5.4 5.5L1.1 1.3c.4-.3.9-.5 1.5-.5.5 0 1 .1 1.5.4l18.8 11.3Z"/><path fill="#FBBC04" d="M22.9 23.5 4.1 34.8c-.5.3-1 .4-1.5.4-.6 0-1.1-.2-1.5-.5L17.5 18l5.4 5.5Z"/><path fill="#EA4335" d="m30 16.8-7.1-4.3-5.4 5.5 5.4 5.5 7.1-4.3c1.2-.7 1.2-1.7 0-2.4Z"/></svg>;
}

function StoreBadge({ store, fr }) {
  const apple = store === 'apple';
  return (
    <div aria-label={apple ? 'App Store — bientôt disponible' : 'Google Play — bientôt disponible'} className="inline-flex min-w-[176px] items-center gap-3 rounded-xl bg-slate-950 px-4 py-2.5 text-white dark:bg-white dark:text-slate-950">
      {apple ? <AppleLogo /> : <GooglePlayLogo />}
      <div>
        <p className="text-[9px] font-medium uppercase tracking-[.08em] opacity-70">{fr ? 'Bientôt sur' : 'Coming soon to'}</p>
        <p className="text-base font-semibold leading-tight">{apple ? 'App Store' : 'Google Play'}</p>
      </div>
    </div>
  );
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
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">{fr?'Kiwango partout avec vous':'Kiwango everywhere'}</p>
        <h2 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-.05em] sm:text-5xl">{fr?'Installez Kiwango sur votre écran d’accueil.':'Install Kiwango on your home screen.'}</h2>
        <p className="mt-6 max-w-lg text-base leading-7 text-slate-500">{fr?'La web app fonctionne dès maintenant sur mobile, tablette et ordinateur. Les versions natives arriveront ensuite sur les stores.':'The web app works now on mobile, tablet and desktop. Native versions will follow on the stores.'}</p>
        <div className="mt-7 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 dark:text-slate-300">{[(fr?'Installation rapide':'Quick installation'),(fr?'Fonctionnement hors connexion':'Works offline'),(fr?'Données conservées localement':'Data stays local'),(fr?'Toujours accessible':'Always available')].map(text=><div key={text} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-700"/>{text}</div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">{promptEvent&&!installed?<button onClick={install} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"><Download className="h-4 w-4"/>{fr?'Installer Kiwango':'Install Kiwango'}</button>:<Link href="/convertisseur" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">{installed?(fr?'Ouvrir Kiwango':'Open Kiwango'):(fr?'Utiliser la web app':'Use the web app')}<ArrowRight className="h-4 w-4"/></Link>}</div>
        {isIos&&!installed&&!promptEvent&&<div className="mt-5 border-l-2 border-emerald-500 pl-4 text-sm text-slate-600 dark:text-slate-300"><div className="flex gap-3"><Share className="mt-0.5 h-4 w-4 flex-none text-emerald-700"/><div><p className="font-semibold text-slate-900 dark:text-white">{fr?'Sur iPhone ou iPad':'On iPhone or iPad'}</p><p className="mt-1 leading-6">{fr?'Dans Safari, touchez Partager puis « Sur l’écran d’accueil ».':'In Safari, tap Share, then “Add to Home Screen”.'}</p></div></div></div>}
        <div className="mt-7 flex flex-wrap gap-2"><StoreBadge store="apple" fr={fr}/><StoreBadge store="play" fr={fr}/></div>
      </div>

      <div className="relative min-h-[500px] overflow-hidden rounded-[38px] bg-[#eef7f2] dark:bg-[#0a1711]">
        <div className="absolute bottom-12 left-8 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900/90"><p className="text-[10px] uppercase tracking-[.14em] text-slate-400">Cash Wallet</p><p className="mt-1 text-base font-semibold">24 500 KES</p></div>
        <div className="absolute right-7 top-16 z-20 rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-sm dark:border-emerald-900 dark:bg-slate-900"><p className="text-[10px] uppercase tracking-[.14em] text-slate-400">Kenya</p><p className="mt-1 text-sm font-semibold text-emerald-700">{fr?'Prêt hors connexion ✓':'Offline ready ✓'}</p></div>
        <div className="absolute bottom-[-34px] left-1/2 w-[270px] -translate-x-1/2 rotate-[2deg] rounded-[44px] border-[8px] border-slate-950 bg-white p-4 shadow-[0_45px_100px_rgba(15,23,42,.2)] dark:bg-slate-900"><div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-slate-200"/><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-emerald-400"><Smartphone className="h-5 w-5"/></div><div><p className="text-sm font-semibold">Kiwango</p><p className="text-xs text-slate-400">Travel Pack</p></div></div><div className="mt-6 rounded-[22px] bg-emerald-50 p-4 dark:bg-emerald-950/20"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-emerald-700">KES ↔ EUR</p><p className="mt-3 text-3xl font-semibold tracking-[-.04em]">10 000 KES</p><p className="mt-1 text-sm text-slate-500">≈ 66,87 EUR</p></div><div className="mt-3 grid grid-cols-3 gap-2">{['1k','5k','10k'].map(v=><div key={v} className="rounded-xl border border-slate-200 py-2 text-center text-xs font-semibold dark:border-white/10">{v} KES</div>)}</div><div className="mt-5 flex justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-400 dark:border-white/10"><span>{fr?'Dernière sync':'Last sync'}</span><span className="font-semibold text-slate-600 dark:text-slate-300">{fr?'Aujourd’hui':'Today'} · 06:21</span></div></div>
      </div>
    </div>
  </section>;
}
