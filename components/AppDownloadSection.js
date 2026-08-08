import { useEffect, useState } from 'react';
import { ArrowRight, Check, Download, Smartphone } from 'lucide-react';

function StoreBadge({ store, comingSoon, fr }) {
  const isApple = store === 'apple';
  return <div className="flex min-w-[180px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[.04]">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
      {isApple ? <span className="text-lg font-semibold"></span> : <span className="text-sm font-bold">▶</span>}
    </div>
    <div><p className="text-[10px] font-medium uppercase tracking-[.12em] text-slate-400">{comingSoon ? (fr?'Bientôt disponible':'Coming soon') : (fr?'Disponible sur':'Available on')}</p><p className="mt-0.5 text-sm font-semibold">{isApple ? 'App Store' : 'Google Play'}</p></div>
  </div>;
}

export default function AppDownloadSection({ lang = 'fr' }) {
  const fr = lang === 'fr';
  const [promptEvent, setPromptEvent] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone;
    setInstalled(Boolean(standalone));
    const capture = (event) => { event.preventDefault(); setPromptEvent(event); };
    window.addEventListener('beforeinstallprompt', capture);
    return () => window.removeEventListener('beforeinstallprompt', capture);
  }, []);

  const install = async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice?.outcome === 'accepted') setInstalled(true);
    setPromptEvent(null);
  };

  return <section id="download" className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6">
    <div className="grid overflow-hidden rounded-[34px] border border-slate-200/80 bg-[#fbfcfb] lg:grid-cols-[.95fr_1.05fr] dark:border-white/10 dark:bg-white/[.02]">
      <div className="p-7 sm:p-10 lg:p-12"><p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-700">{fr?'Kiwango sur votre téléphone':'Kiwango on your phone'}</p><h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{fr?'Votre compagnon de voyage, toujours à portée de main.':'Your travel-money companion, always within reach.'}</h2><p className="mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">{fr?'Kiwango est déjà installable comme application web progressive. Les versions natives iOS et Android arriveront ensuite sur les stores.':'Kiwango can already be installed as a progressive web app. Native iOS and Android releases will follow on the stores.'}</p>
        <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">{[(fr?'Accès rapide depuis l’écran d’accueil':'Quick access from your home screen'),(fr?'Travel Packs et taux préparés disponibles hors connexion':'Travel Packs and prepared rates available offline'),(fr?'Même expérience sur mobile, tablette et ordinateur':'One experience across mobile, tablet and desktop')].map((text)=><div key={text} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/>{text}</div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">{promptEvent && !installed ? <button onClick={install} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"><Download className="h-4 w-4"/>{fr?'Installer Kiwango':'Install Kiwango'}</button> : <a href="/app" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">{installed?(fr?'Ouvrir Kiwango':'Open Kiwango'):(fr?'Utiliser la version web':'Use the web app')}<ArrowRight className="h-4 w-4"/></a>}</div>
      </div>
      <div className="relative min-h-[430px] overflow-hidden bg-slate-950 p-6 text-white sm:p-8"><div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl"/><div className="relative mx-auto max-w-[310px]"><div className="rounded-[38px] border border-white/10 bg-white/[.06] p-3 shadow-[0_30px_90px_rgba(0,0,0,.25)]"><div className="rounded-[30px] bg-white p-5 text-slate-950"><div className="mx-auto mb-6 h-1.5 w-16 rounded-full bg-slate-200"/><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-emerald-400"><Smartphone className="h-5 w-5"/></div><div><p className="text-sm font-semibold">Kiwango</p><p className="text-xs text-slate-400">Travel Pack</p></div></div><div className="mt-6 rounded-2xl bg-emerald-50 p-4"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-emerald-700">{fr?'Prêt hors connexion':'Offline ready'}</p><p className="mt-2 text-lg font-semibold">Gambie · GMD</p><p className="mt-1 text-xs text-slate-500">GMD ↔ XOF · EUR · USD</p></div><div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-2xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Cash Wallet</p><p className="mt-1 text-sm font-semibold">3 250 GMD</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Budget</p><p className="mt-1 text-sm font-semibold">78%</p></div></div></div></div></div><div className="relative mt-6 flex flex-wrap justify-center gap-3"><StoreBadge store="apple" comingSoon fr={fr}/><StoreBadge store="play" comingSoon fr={fr}/></div></div>
    </div>
  </section>;
}
