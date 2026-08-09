import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Download, Share } from 'lucide-react';

export default function AppDownloadSection({ lang = 'fr' }) {
  const fr = lang === 'fr';
  const [promptEvent, setPromptEvent] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone;
    setInstalled(Boolean(standalone));
    setIsIos(/iphone|ipad|ipod/i.test(window.navigator.userAgent));
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

  const help = isIos
    ? (fr ? 'Sur iPhone : Safari → Partager → Sur l’écran d’accueil.' : 'On iPhone: Safari → Share → Add to Home Screen.')
    : (fr ? 'Sur Android ou ordinateur : ouvrez le menu du navigateur puis choisissez « Installer ».' : 'On Android or desktop: open the browser menu, then choose “Install”.');

  return <section id="download" className="border-b border-slate-200/70 bg-[#fffefa] px-4 py-16 md:px-8 md:py-24">
    <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-[.86fr_1.14fr] lg:gap-20">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">{fr ? 'Kiwango partout avec vous' : 'Kiwango everywhere'}</p>
        <h2 className="mt-5 text-3xl font-semibold leading-[1.06] tracking-[-.045em] sm:text-[42px]">{fr ? 'Gardez vos repères à portée de main.' : 'Keep your bearings close at hand.'}</h2>
        <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">{fr ? 'Installez directement la web app. Votre voyage, vos devises et vos repères restent accessibles depuis l’écran d’accueil, sans passer par un store.' : 'Install the web app directly. Your trip, currencies and references stay accessible from your home screen, without an app store.'}</p>
        <div className="mt-7 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">{[
          fr ? 'Installation en quelques secondes' : 'Install in seconds',
          fr ? 'Travel Pack hors connexion' : 'Offline Travel Pack',
          fr ? 'Données conservées localement' : 'Data stays on your device',
          fr ? 'Même expérience sur tous vos écrans' : 'The same experience on every screen',
        ].map((text) => <div key={text} className="flex items-center gap-2"><Check className="h-4 w-4 flex-none text-emerald-700" />{text}</div>)}</div>

        <div className="mt-8">
          {promptEvent && !installed
            ? <button onClick={install} className="inline-flex items-center gap-2 bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"><Download className="h-4 w-4" />{fr ? 'Installer Kiwango' : 'Install Kiwango'}</button>
            : <Link href="/convertisseur" className="inline-flex items-center gap-2 bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700">{installed ? (fr ? 'Ouvrir Kiwango' : 'Open Kiwango') : (fr ? 'Utiliser Kiwango' : 'Use Kiwango')}<ArrowRight className="h-4 w-4" /></Link>}
        </div>

        {!installed && !promptEvent && <div className="mt-5 flex max-w-lg items-start gap-3 border-l-2 border-emerald-500 pl-4 text-sm leading-6 text-slate-500"><Share className="mt-1 h-4 w-4 flex-none text-emerald-700" /><p>{help}</p></div>}
      </div>

      <div className="relative min-h-[430px] overflow-hidden bg-[#eef6f1] sm:min-h-[520px]">
        <Image src="/images/kiwango-install-anywhere.webp" alt={fr ? 'Voyageur utilisant Kiwango dans un terminal' : 'Traveller using Kiwango in a terminal'} fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/18 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 max-w-[250px] border border-white/70 bg-white/94 p-4 shadow-[0_18px_50px_rgba(15,23,42,.16)] backdrop-blur-md sm:bottom-8 sm:left-8 sm:p-5">
          <div className="flex items-center justify-between gap-5"><p className="text-[10px] font-semibold uppercase tracking-[.15em] text-slate-400">Travel Pack</p><span className="h-2 w-2 rounded-full bg-emerald-500" /></div>
          <p className="mt-2 text-base font-semibold text-slate-950">{fr ? 'Prêt pour le voyage' : 'Ready for the journey'}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{fr ? 'Devises, budget et repères disponibles hors connexion.' : 'Currencies, budget and references available offline.'}</p>
        </div>
      </div>
    </div>
  </section>;
}
