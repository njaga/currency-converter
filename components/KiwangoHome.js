import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Banknote, Check, ChevronRight, MapPin, Search, WifiOff } from 'lucide-react';
import AppDownloadSection from './AppDownloadSection';
import CountryQuickSelect from './CountryQuickSelect';
import LanguageMenu from './LanguageMenu';
import Logo from './Logo';
import SiteFooter from './SiteFooter';
import LandingFeatures from './LandingFeatures';
import { OfflinePhoneIllustration, RateCheckIllustration, TravelRouteIllustration } from './HomeIllustrations';

function ConverterPreview({ fr }) {
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-slate-200/80 bg-white shadow-[0_30px_90px_rgba(15,23,42,.1)] dark:border-white/10 dark:bg-slate-900">
      <div className="grid md:grid-cols-2">
        <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r dark:border-white/10">
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">{fr ? 'Vous envoyez' : 'You send'}</p>
          <p className="mt-5 text-5xl font-semibold tracking-[-.055em]">100</p>
          <div className="mt-7 flex items-center justify-between rounded-[18px] border border-slate-200 px-4 py-3.5 dark:border-white/10">
            <div><p className="text-sm font-semibold">EUR</p><p className="text-xs text-slate-400">Euro</p></div><span className="text-2xl">🇪🇺</span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">{fr ? 'Vous recevez' : 'You receive'}</p>
          <p className="mt-5 text-5xl font-semibold tracking-[-.055em]">65 596</p>
          <div className="mt-7 flex items-center justify-between rounded-[18px] border border-slate-200 px-4 py-3.5 dark:border-white/10">
            <div><p className="text-sm font-semibold">XOF</p><p className="text-xs text-slate-400">Franc CFA</p></div><span className="text-2xl">🇸🇳</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-[#fafcfb] px-6 py-4 text-xs dark:border-white/10 dark:bg-white/[.025]">
        <span className="font-semibold">1 EUR = 78,20 XOF</span>
        <span className="inline-flex items-center gap-2 text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />{fr ? 'Taux synchronisé' : 'Rate synced'}</span>
      </div>
    </div>
  );
}

function DestinationLink({ flag, country, currency, code }) {
  return (
    <Link href={`/app?tab=travel&country=${code}`} className="group flex items-center justify-between border-b border-slate-200/80 py-4 transition last:border-0 hover:pl-1 dark:border-white/10">
      <span className="flex min-w-0 items-center gap-3"><span className="text-xl">{flag}</span><span><span className="block text-sm font-semibold">{country}</span><span className="text-xs text-slate-400">{currency}</span></span></span>
      <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
    </Link>
  );
}

export default function KiwangoHome() {
  const [lang, setLang] = useState('fr');
  const fr = lang === 'fr';

  useEffect(() => {
    const saved = localStorage.getItem('app_lang');
    if (saved === 'fr' || saved === 'en') setLang(saved);
  }, []);

  const changeLang = (value) => { setLang(value); localStorage.setItem('app_lang', value); };
  const selectCountry = (country) => {
    localStorage.setItem('kiwango_quick_destination', country.code);
    window.location.href = `/app?tab=travel&country=${country.code}`;
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="sticky top-0 z-[140] px-3 pt-3 sm:px-5 sm:pt-4">
        <header className="mx-auto flex h-[64px] w-full max-w-6xl items-center justify-between rounded-[22px] border border-slate-200/70 bg-white/90 px-3 shadow-[0_12px_40px_rgba(15,23,42,.07)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90 sm:px-4">
          <Logo size="md" showText />
          <nav className="hidden items-center gap-1 lg:flex">
            {[[fr ? 'Convertir' : 'Convert', '/app?tab=converter'], [fr ? 'Voyage' : 'Travel', '/app?tab=travel'], [fr ? 'Outils' : 'Tools', '/app?tab=tools'], [fr ? 'Devises' : 'Currencies', '/app?tab=rates']].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white">{label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2"><CountryQuickSelect lang={lang} onSelect={selectCountry} /><LanguageMenu value={lang} onChange={changeLang} /><Link href="/app" className="hidden rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:bg-white dark:text-slate-950 sm:inline-flex">{fr ? 'Ouvrir Kiwango' : 'Open Kiwango'}</Link></div>
        </header>
      </div>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-14 md:px-6 lg:pb-28 lg:pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-[.86fr_1.14fr]">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">{fr ? 'Votre argent en voyage' : 'Your money while travelling'}</p>
              <h1 className="mt-5 text-[46px] font-semibold leading-[.98] tracking-[-.06em] sm:text-6xl lg:text-[68px]">{fr ? 'Gardez vos repères, même quand vous changez de pays.' : 'Keep your bearings, even when the country changes.'}</h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-500 sm:text-lg">{fr ? 'Conversion, taux réels, budget, cash et préparation hors connexion dans une expérience pensée pour le voyage.' : 'Conversion, real rates, budgets, cash and offline preparation in one travel-first experience.'}</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="/app?tab=converter" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700">{fr ? 'Commencer à convertir' : 'Start converting'}<ArrowRight className="h-4 w-4" /></Link><a href="#download" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">{fr ? 'Installer l’application' : 'Get the app'}</a></div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400"><span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" />{fr ? 'Sans compte' : 'No account'}</span><span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" />Offline-first</span><span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" />FR / EN</span></div>
            </div>
            <div className="relative pt-5 lg:pt-0"><div className="absolute -left-12 top-0 h-40 w-40 rounded-full bg-emerald-100 blur-3xl" /><ConverterPreview fr={fr} /><div className="absolute -bottom-6 -left-3 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,.12)] md:block dark:border-white/10 dark:bg-slate-900"><p className="text-[10px] uppercase tracking-[.14em] text-slate-400">Rate Check</p><p className="mt-1 text-sm font-semibold text-emerald-700">{fr ? 'Taux proposé : acceptable' : 'Offered rate: fair'}</p></div></div>
          </div>
        </section>

        <section className="border-y border-slate-200/70 bg-[#fbfcfb] dark:border-white/10 dark:bg-white/[.015]">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 md:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-24">
            <TravelRouteIllustration />
            <div className="max-w-xl lg:pl-6"><p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">01 · Travel Pack</p><h2 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-.05em]">{fr ? 'Avant de partir, préparez la monnaie du pays.' : 'Before departure, prepare the country’s currency.'}</h2><p className="mt-5 text-base leading-7 text-slate-500">{fr ? 'Choisissez une destination. Kiwango identifie sa devise, prépare les paires utiles et les garde disponibles lorsque le réseau disparaît.' : 'Choose a destination. Kiwango identifies its currency, prepares useful pairs and keeps them available when the network disappears.'}</p><div className="mt-7"><DestinationLink flag="🇸🇳" country={fr ? 'Sénégal' : 'Senegal'} currency="XOF · Franc CFA" code="SN" /><DestinationLink flag="🇨🇮" country={fr ? 'Côte d’Ivoire' : 'Ivory Coast'} currency="XOF · Franc CFA" code="CI" /><DestinationLink flag="🇬🇭" country="Ghana" currency="GHS · Cedi" code="GH" /></div><Link href="/app?tab=travel" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">{fr ? 'Explorer toutes les destinations' : 'Explore all destinations'}<ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">02 · Rate Check</p><h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.04] tracking-[-.05em]">{fr ? 'Un taux affiché n’est pas toujours le taux que vous obtenez.' : 'The displayed rate is not always the rate you get.'}</h2></div><p className="max-w-xl text-base leading-7 text-slate-500 lg:justify-self-end">{fr ? 'Entrez ce qu’on vous propose. Kiwango vous montre immédiatement le montant attendu, l’écart et la perte éventuelle.' : 'Enter what you are offered. Kiwango immediately shows the expected amount, the difference and the potential loss.'}</p></div>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.08fr_.92fr]"><RateCheckIllustration /><div className="flex flex-col justify-between rounded-[34px] bg-[#f6f8f7] p-7 sm:p-9 dark:bg-white/[.025]"><div><Banknote className="h-5 w-5 text-emerald-700" /><p className="mt-8 text-sm leading-7 text-slate-500">{fr ? 'À l’aéroport, dans un hôtel ou chez un cambiste, vérifiez l’offre avant de remettre votre argent.' : 'At the airport, hotel or exchange desk, check the offer before handing over your money.'}</p></div><Link href="/app?tab=tools" className="mt-10 inline-flex items-center gap-2 self-start text-sm font-semibold text-slate-950 dark:text-white">{fr ? 'Ouvrir Rate Check' : 'Open Rate Check'}<ArrowRight className="h-4 w-4 text-emerald-600" /></Link></div></div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-20 md:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:pb-28"><div className="max-w-lg"><div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-emerald-700"><WifiOff className="h-4 w-4" />03 · Offline</div><h2 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-.05em]">{fr ? 'Le réseau peut disparaître. Pas vos repères.' : 'The network can disappear. Your references should not.'}</h2><p className="mt-5 text-base leading-7 text-slate-500">{fr ? 'Synchronisez avant le départ et conservez localement vos Travel Packs et derniers taux disponibles, avec leur date de mise à jour.' : 'Sync before departure and keep your Travel Packs and latest available rates locally, with their update time.'}</p></div><OfflinePhoneIllustration /></section>

        <section className="mx-auto w-full max-w-6xl px-4 md:px-6"><LandingFeatures lang={lang} /></section>

        <AppDownloadSection lang={lang} />

        <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6"><div className="grid overflow-hidden rounded-[36px] bg-slate-950 text-white lg:grid-cols-[1.1fr_.9fr]"><div className="p-8 sm:p-10 lg:p-12"><p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-300">{fr ? 'Votre prochain voyage' : 'Your next trip'}</p><h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.05em]">{fr ? 'Commencez par le pays. Kiwango s’occupe de la monnaie.' : 'Start with the country. Kiwango handles the currency.'}</h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">{fr ? 'Recherchez votre destination et ouvrez directement son espace de préparation.' : 'Search your destination and open its preparation workspace directly.'}</p><div className="mt-8 max-w-md rounded-2xl border border-white/10 bg-white/[.06] p-4"><div className="flex items-center gap-3 text-slate-300"><Search className="h-4 w-4" /><span className="text-sm">{fr ? 'Sénégal, Ghana, Kenya…' : 'Senegal, Ghana, Kenya…'}</span></div></div></div><div className="relative min-h-[320px] border-t border-white/10 bg-emerald-500/10 p-8 lg:border-l lg:border-t-0"><div className="absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/15"><MapPin className="h-5 w-5 text-emerald-300" /></div><div className="absolute bottom-8 left-8 right-8 rounded-[24px] border border-white/10 bg-white/[.06] p-5"><p className="text-xs text-slate-400">{fr ? 'Destination active' : 'Active destination'}</p><p className="mt-2 text-xl font-semibold">🇰🇪 Kenya · KES</p><p className="mt-2 text-sm text-emerald-300">Travel Pack · Offline ready</p></div></div></div></section>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
