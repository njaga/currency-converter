import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  MapPin,
  Menu,
  Plane,
  RefreshCw,
  ShieldCheck,
  WifiOff,
  X,
} from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import AppDownloadSection from './AppDownloadSection';
import CountryQuickSelect from './CountryQuickSelect';
import LanguageMenu from './LanguageMenu';
import Logo from './Logo';
import SiteFooter from './SiteFooter';
import { getCountryDirectory } from '../lib/country-directory-client';
import { TRAVEL_DESTINATIONS } from '../lib/travel';

const NAV_ITEMS = [
  { href: '/convertisseur', fr: 'Convertir', en: 'Convert' },
  { href: '/voyage', fr: 'Préparer un voyage', en: 'Plan a trip' },
  { href: '/outils', fr: 'Outils', en: 'Tools' },
  { href: '/convertisseur#devises', fr: 'Taux', en: 'Rates' },
];

const FALLBACK_COUNTRIES = TRAVEL_DESTINATIONS.map((item) => ({
  code: item.code,
  name: item.country,
  countryEn: item.countryEn,
  flag: item.flag,
  currencies: [{ code: item.currency, name: item.currency }],
  primaryCurrency: { code: item.currency, name: item.currency },
}));

const Flag = ({ code }) => {
  const Component = Flags[code?.toUpperCase()];
  return Component ? <Component className="h-5 w-7 rounded-sm object-cover shadow-sm" /> : <MapPin className="h-4 w-4 text-emerald-600" />;
};

function countryName(country, lang) {
  if (!country) return '';
  try {
    return new Intl.DisplayNames([lang === 'en' ? 'en' : 'fr'], { type: 'region' }).of(country.code) || country.name;
  } catch {
    return lang === 'en' ? (country.countryEn || country.name) : country.name;
  }
}

function CountryField({ label, value, countries, lang, onChange }) {
  const selected = countries.find((country) => country.code === value);
  return (
    <label className="min-w-0 px-4 py-3.5 sm:px-5">
      <span className="block text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">{label}</span>
      <span className="mt-1.5 flex items-center gap-2">
        <Flag code={selected?.flag || selected?.code} />
        <select value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 appearance-none bg-transparent text-sm font-semibold outline-none">
          {countries.map((country) => <option key={country.code} value={country.code}>{countryName(country, lang)}</option>)}
        </select>
        <ChevronDown className="h-4 w-4 flex-none text-slate-400" />
      </span>
    </label>
  );
}

function TripStarter({ lang, countries }) {
  const router = useRouter();
  const fr = lang === 'fr';
  const [origin, setOrigin] = useState('SN');
  const [destination, setDestination] = useState('KE');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('kiwango_active_trip'));
      if (saved?.originCode) setOrigin(saved.originCode);
      if (saved?.destinationCode) setDestination(saved.destinationCode);
      if (saved?.departureDate) setDepartureDate(saved.departureDate);
      if (saved?.returnDate) setReturnDate(saved.returnDate);
    } catch {}
  }, []);

  useEffect(() => {
    if (!countries.some((country) => country.code === origin)) setOrigin(countries.find((country) => country.code === 'SN')?.code || countries[0]?.code || '');
    if (!countries.some((country) => country.code === destination)) setDestination(countries.find((country) => country.code === 'KE')?.code || countries[1]?.code || countries[0]?.code || '');
  }, [countries, origin, destination]);

  const startTrip = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedDeparture = String(formData.get('departureDate') || departureDate);
    const submittedReturn = String(formData.get('returnDate') || returnDate);
    const originCountry = countries.find((country) => country.code === origin);
    const destinationCountry = countries.find((country) => country.code === destination);
    if (!originCountry || !destinationCountry || origin === destination) return;
    const trip = {
      originCode: originCountry.code,
      originName: countryName(originCountry, lang),
      originCurrency: originCountry.primaryCurrency?.code || originCountry.currencies?.[0]?.code,
      destinationCode: destinationCountry.code,
      destinationName: countryName(destinationCountry, lang),
      destinationCurrency: destinationCountry.primaryCurrency?.code || destinationCountry.currencies?.[0]?.code,
      departureDate: submittedDeparture,
      returnDate: submittedReturn,
      createdAt: Date.now(),
    };
    localStorage.setItem('kiwango_active_trip', JSON.stringify(trip));
    localStorage.setItem('kiwango_quick_destination', destinationCountry.code);
    const params = new URLSearchParams({ country: destinationCountry.code, origin: originCountry.code });
    if (submittedDeparture) params.set('depart', submittedDeparture);
    if (submittedReturn) params.set('return', submittedReturn);
    router.push(`/voyage?${params.toString()}`);
  };

  const canStart = origin && destination && origin !== destination;

  return (
    <form onSubmit={startTrip} className="mt-8 overflow-hidden border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,.08)]">
      <div className="grid divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <CountryField label={fr ? 'Je pars de' : 'Leaving from'} value={origin} countries={countries} lang={lang} onChange={setOrigin} />
        <CountryField label={fr ? 'Je vais à' : 'Going to'} value={destination} countries={countries} lang={lang} onChange={setDestination} />
      </div>
      <div className="grid border-t border-slate-200 sm:grid-cols-[1fr_1fr_auto]">
        <label className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 sm:border-b-0 sm:border-r sm:px-5">
          <CalendarDays className="h-4 w-4 text-emerald-600" />
          <span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">{fr ? 'Départ' : 'Departure'}</span><input name="departureDate" aria-label={fr ? 'Date de départ' : 'Departure date'} type="date" value={departureDate} onChange={(event) => setDepartureDate(event.target.value)} className="mt-1 w-full bg-transparent text-xs font-medium outline-none" /></span>
        </label>
        <label className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 sm:border-b-0 sm:border-r sm:px-5">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          <span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">{fr ? 'Retour' : 'Return'}</span><input name="returnDate" aria-label={fr ? 'Date de retour' : 'Return date'} type="date" min={departureDate} value={returnDate} onChange={(event) => setReturnDate(event.target.value)} className="mt-1 w-full bg-transparent text-xs font-medium outline-none" /></span>
        </label>
        <button type="submit" disabled={!canStart} className="inline-flex min-h-14 items-center justify-center gap-2 bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300">
          {fr ? 'Commencer' : 'Start'}<ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {!canStart && <p className="border-t border-amber-100 bg-amber-50 px-5 py-2 text-xs text-amber-800">{fr ? 'Choisissez deux pays différents pour préparer votre voyage.' : 'Choose two different countries to prepare your trip.'}</p>}
    </form>
  );
}

function HeroGallery({ fr }) {
  return (
    <div className="relative min-h-[500px] lg:min-h-[540px]">
      <div className="absolute left-[11%] right-0 top-0 h-[58%] overflow-hidden">
        <Image src="/images/kiwango-airport-departure.webp" alt={fr ? 'Voyageur devant le tableau des départs' : 'Traveller checking the departures board'} fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
      </div>
      <div className="absolute bottom-0 left-0 h-[48%] w-[43%] overflow-hidden border-8 border-white">
        <Image src="/images/kiwango-traveller-phone.webp" alt={fr ? 'Voyageuse consultant Kiwango' : 'Traveller checking Kiwango'} fill priority sizes="22vw" className="object-cover object-top" />
      </div>
      <div className="absolute bottom-[5%] right-0 h-[39%] w-[50%] overflow-hidden border-8 border-white">
        <Image src="/images/kiwango-market-payment.webp" alt={fr ? 'Paiement en espèces sur un marché' : 'Cash payment at a market'} fill sizes="26vw" className="object-cover" />
      </div>
      <div className="absolute bottom-[2%] left-[37%] z-10 w-[45%] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,.16)]">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400"><span>{fr ? 'Taux en direct' : 'Live rate'}</span><span className="flex items-center gap-1.5 normal-case tracking-normal text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{fr ? 'Synchronisé' : 'Synced'}</span></div>
        <div className="mt-4 flex items-center justify-between text-xl font-semibold tracking-[-.04em] sm:text-2xl"><span>100 EUR</span><ArrowRight className="h-4 w-4 text-emerald-600" /><span>65 596 XOF</span></div>
        <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">1 EUR = 655,96 XOF</p>
      </div>
    </div>
  );
}

function StoryChecklist({ items }) {
  return (
    <div className="mt-7 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
          <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-3 w-3" /></span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function TripPreparationVisual({ fr }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[34px] bg-slate-100 shadow-[0_26px_70px_rgba(15,23,42,.1)] sm:aspect-[4/3]">
      <Image src="/images/kiwango-trip-preparation.webp" alt={fr ? 'Voyageuse préparant sa valise et son itinéraire' : 'Traveller preparing her suitcase and itinerary'} fill loading="eager" sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover object-[67%_center]" />
      <div className="absolute bottom-4 left-4 right-4 max-w-[350px] rounded-[24px] border border-white/80 bg-white/95 p-5 shadow-[0_20px_50px_rgba(15,23,42,.16)] sm:bottom-6 sm:left-6 sm:p-6">
        <div className="flex items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400"><span>{fr ? 'Voyage enregistré' : 'Trip saved'}</span><span className="flex items-center gap-1.5 normal-case tracking-normal text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" />{fr ? 'Sur cet appareil' : 'On this device'}</span></div>
        <p className="mt-4 text-xl font-semibold tracking-[-.04em] sm:text-2xl">Dakar <ArrowRight className="mx-1 inline h-4 w-4 text-emerald-600" /> Nairobi</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600"><span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2"><CalendarDays className="h-3.5 w-3.5 text-emerald-700" />12–19 août</span><span className="rounded-full bg-slate-100 px-3 py-2">6 {fr ? 'essentiels' : 'essentials'}</span></div>
      </div>
    </div>
  );
}

function RateCheckVisual({ fr }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[34px] bg-slate-100 shadow-[0_26px_70px_rgba(15,23,42,.1)] sm:aspect-[4/3]">
      <Image src="/images/kiwango-rate-check.webp" alt={fr ? 'Voyageur vérifiant un taux avant de payer' : 'Traveller checking a rate before paying'} fill loading="eager" sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover object-[35%_center]" />
      <div className="absolute bottom-4 left-4 right-4 ml-auto max-w-[360px] rounded-[24px] border border-white/80 bg-white/95 p-5 shadow-[0_20px_50px_rgba(15,23,42,.16)] sm:bottom-6 sm:right-6 sm:p-6">
        <div className="flex items-center justify-between gap-4"><span className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">Rate Check</span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">{fr ? 'Exemple' : 'Example'}</span></div>
        <div className="mt-4 flex items-end justify-between gap-5"><div><p className="text-xs text-slate-400">{fr ? 'Vous changez' : 'You exchange'}</p><p className="mt-1 text-xl font-semibold">100 EUR</p></div><div className="text-right"><p className="text-xs text-slate-400">{fr ? 'Référence' : 'Reference'}</p><p className="mt-1 text-xl font-semibold">65 596 XOF</p></div></div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs"><span className="text-slate-500">{fr ? 'Offre reçue' : 'Offered rate'} · 64 900 XOF</span><strong className="text-amber-700">−696 XOF</strong></div>
      </div>
    </div>
  );
}

function OfflineTravelVisual({ fr }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[34px] bg-slate-100 shadow-[0_26px_70px_rgba(15,23,42,.1)] sm:aspect-[4/3]">
      <Image src="/images/kiwango-offline-travel.webp" alt={fr ? 'Voyageuse utilisant ses repères Kiwango hors connexion' : 'Traveller using Kiwango references offline'} fill loading="eager" sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover object-[63%_center]" />
      <div className="absolute bottom-4 left-4 right-4 max-w-[350px] rounded-[24px] border border-white/80 bg-white/95 p-5 shadow-[0_20px_50px_rgba(15,23,42,.16)] sm:bottom-6 sm:left-6 sm:p-6">
        <div className="flex items-center justify-between gap-4"><span className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">Travel Pack · Kenya</span><WifiOff className="h-4 w-4 text-emerald-700" /></div>
        <p className="mt-3 text-xl font-semibold tracking-[-.035em]">{fr ? 'Vos repères sont disponibles.' : 'Your references are available.'}</p>
        <p className="mt-2 text-xs leading-5 text-slate-500">{fr ? 'Synchronisé aujourd’hui · Données conservées localement' : 'Synced today · Data stored locally'}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-emerald-800"><span className="rounded-full bg-emerald-50 px-3 py-2">KES ↔ XOF</span><span className="rounded-full bg-emerald-50 px-3 py-2">KES ↔ EUR</span><span className="rounded-full bg-emerald-50 px-3 py-2">KES ↔ USD</span></div>
      </div>
    </div>
  );
}

export default function KiwangoHome() {
  const router = useRouter();
  const [lang, setLang] = useState('fr');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countries, setCountries] = useState(FALLBACK_COUNTRIES);
  const fr = lang === 'fr';

  useEffect(() => {
    const saved = localStorage.getItem('app_lang');
    if (saved === 'fr' || saved === 'en') setLang(saved);
    let cancelled = false;
    getCountryDirectory(FALLBACK_COUNTRIES).then(({ countries: directory }) => {
      if (!cancelled && directory?.length) setCountries(directory);
    });
    return () => { cancelled = true; };
  }, []);

  const orderedCountries = useMemo(() => [...countries].sort((a, b) => countryName(a, lang).localeCompare(countryName(b, lang))), [countries, lang]);
  const changeLang = (value) => { setLang(value); localStorage.setItem('app_lang', value); };
  const selectCountry = (country) => {
    localStorage.setItem('kiwango_quick_destination', country.code);
    router.push(`/voyage?country=${country.code}`);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#fffefa] text-slate-950">
      <header className="sticky top-0 z-[140] border-b border-slate-200/80 bg-[#fffefa]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <Logo size="md" showText />
          <nav className="hidden items-center gap-7 lg:flex" aria-label={fr ? 'Navigation principale' : 'Main navigation'}>
            {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 transition hover:text-emerald-700">{fr ? item.fr : item.en}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden lg:block"><CountryQuickSelect lang={lang} onSelect={selectCountry} /></div>
            <LanguageMenu value={lang} onChange={changeLang} />
            <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label={fr ? 'Ouvrir le menu' : 'Open menu'} className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white lg:hidden">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-xl lg:hidden"><nav className="mx-auto grid max-w-6xl" aria-label={fr ? 'Navigation mobile' : 'Mobile navigation'}>{NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-slate-100 py-4 text-base font-semibold">{fr ? item.fr : item.en}<ArrowRight className="h-4 w-4 text-slate-400" /></Link>)}<Link href="/voyage" onClick={() => setMobileOpen(false)} className="mt-4 bg-emerald-600 px-4 py-3.5 text-center text-sm font-semibold text-white">{fr ? 'Choisir une destination' : 'Choose a destination'}</Link></nav></div>}
      </header>

      <main>
        <section id="product" className="border-b border-slate-200 px-4 pb-14 pt-12 md:px-8 md:pb-16 md:pt-12">
          <div className="mx-auto grid w-full max-w-[1320px] gap-10 lg:grid-cols-[.98fr_1.02fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">{fr ? 'Guide de voyage financier' : 'Financial travel guide'}</p>
              <h1 className="mt-6 text-[42px] font-semibold leading-[1] tracking-[-.055em] sm:text-[52px] lg:text-[64px]">{fr ? <>Changez de pays,<br />pas de repères<span className="text-emerald-600">.</span></> : <>Change countries,<br />not your bearings<span className="text-emerald-600">.</span></>}</h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">{fr ? 'Kiwango prépare votre espace selon votre trajet. Devises, taux, budget et essentiels du séjour restent réunis, même hors connexion.' : 'Kiwango prepares your space around your journey. Currencies, rates, budget and trip essentials stay together, even offline.'}</p>
              <TripStarter lang={lang} countries={orderedCountries} />
              <div className="mt-6 grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
                <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 text-emerald-600" />{fr ? 'Conversions à jour' : 'Current conversions'}</span>
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" />{fr ? 'Sans compte' : 'No account'}</span>
                <span className="flex items-center gap-2"><WifiOff className="h-4 w-4 text-emerald-600" />{fr ? 'Fonctionne hors connexion' : 'Works offline'}</span>
              </div>
            </div>
            <HeroGallery fr={fr} />
          </div>
        </section>

        <section id="journey" className="border-b border-slate-200/70 bg-[#fffefa] px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-[1180px] text-center">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">{fr ? 'Kiwango, du départ au retour' : 'Kiwango, from departure to return'}</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold leading-[1.06] tracking-[-.045em] md:text-[46px]">{fr ? 'Votre argent suit le voyage. Vos repères aussi.' : 'Your money follows the trip. Your bearings do too.'}</h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600">{fr ? 'Kiwango réunit les décisions financières utiles avant de partir, pendant le séjour et lorsque la connexion devient incertaine.' : 'Kiwango brings together the financial decisions that matter before departure, during the trip and when connectivity becomes uncertain.'}</p>
          </div>
        </section>

        <section className="border-b border-slate-200/70 bg-[#fffefa] px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[1.12fr_.88fr] lg:items-center lg:gap-20">
            <TripPreparationVisual fr={fr} />
            <div className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">01 · {fr ? 'Avant de partir' : 'Before departure'}</p><h2 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-.05em] md:text-5xl">{fr ? 'Un voyage renseigné, une expérience déjà prête.' : 'Enter one trip. Start with a ready experience.'}</h2><p className="mt-6 text-base leading-7 text-slate-600">{fr ? 'Indiquez votre départ, votre destination et vos dates. Kiwango prépare automatiquement les devises, les repères et les informations utiles pour ce trajet.' : 'Enter your origin, destination and dates. Kiwango automatically prepares the currencies, references and useful information for that journey.'}</p><StoryChecklist items={fr ? ['Itinéraire réellement personnalisé', 'Checklist claire avant le départ', 'Informations conservées sur votre appareil', 'Interface adaptée à la destination'] : ['A genuinely personalized itinerary', 'A clear pre-departure checklist', 'Information kept on your device', 'An interface adapted to the destination']} /><Link href="/voyage" className="mt-8 inline-flex items-center gap-2 bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700">{fr ? 'Préparer mon voyage' : 'Plan my trip'}<ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </section>

        <section className="border-b border-emerald-100 bg-[#eef6f1] px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.88fr_1.12fr] lg:items-center lg:gap-20">
            <div className="max-w-xl lg:order-1"><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">02 · {fr ? 'Au moment de payer' : 'When it is time to pay'}</p><h2 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-.05em] md:text-5xl">{fr ? 'Sachez ce que vaut votre argent, avant de le remettre.' : 'Know what your money is worth before handing it over.'}</h2><p className="mt-6 text-base leading-7 text-slate-600">{fr ? 'Convertissez un montant, comparez un taux proposé et visualisez immédiatement l’écart. Vous décidez avec une référence claire, sans transformer chaque paiement en calcul mental.' : 'Convert an amount, compare an offered rate and see the difference immediately. Make decisions with a clear reference instead of doing mental maths for every payment.'}</p><StoryChecklist items={fr ? ['Taux horodatés et source visible', 'Rate Check pour contrôler une offre', 'Écart affiché en montant et en pourcentage', 'Outils simples, sans jargon financier'] : ['Timestamped rates with a visible source', 'Rate Check to review an offer', 'Difference shown as an amount and percentage', 'Simple tools without financial jargon']} /><Link href="/outils" className="mt-8 inline-flex items-center gap-2 bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700">{fr ? 'Vérifier un taux' : 'Check a rate'}<ArrowRight className="h-4 w-4" /></Link></div>
            <div className="lg:order-2"><RateCheckVisual fr={fr} /></div>
          </div>
        </section>

        <section className="border-b border-slate-200/70 bg-[#fffefa] px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[1.12fr_.88fr] lg:items-center lg:gap-20">
            <OfflineTravelVisual fr={fr} />
            <div className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">03 · {fr ? 'Même sans réseau' : 'Even without a network'}</p><h2 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-.05em] md:text-5xl">{fr ? 'Vos repères restent avec vous quand la connexion disparaît.' : 'Your bearings stay with you when the connection disappears.'}</h2><p className="mt-6 text-base leading-7 text-slate-600">{fr ? 'Préparez un Travel Pack avant le départ. Les conversions utiles, votre budget et les informations de destination restent accessibles localement, avec la date de dernière synchronisation toujours visible.' : 'Prepare a Travel Pack before departure. Useful conversions, your budget and destination information remain locally available, with the last sync date always visible.'}</p><StoryChecklist items={fr ? ['Paires de devises choisies pour le trajet', 'Dernière synchronisation toujours indiquée', 'Budget et historique accessibles localement', 'Aucune création de compte obligatoire'] : ['Currency pairs selected for the journey', 'Last synchronization always displayed', 'Budget and history available locally', 'No account creation required']} /><Link href="/voyage" className="mt-8 inline-flex items-center gap-2 bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700">{fr ? 'Préparer le mode hors connexion' : 'Prepare offline mode'}<ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </section>

        <AppDownloadSection lang={lang} />

        <section className="border-t border-slate-200 px-4 py-16 md:px-8">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><h2 className="text-3xl font-semibold tracking-[-.04em]">{fr ? 'Votre prochain voyage commence par les bons repères.' : 'Your next trip starts with the right bearings.'}</h2><p className="mt-2 text-slate-500">{fr ? 'Gratuit, sans compte et utilisable immédiatement.' : 'Free, accountless and ready now.'}</p></div><Link href="#product" className="inline-flex items-center justify-center gap-2 bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white">{fr ? 'Renseigner mon voyage' : 'Enter my trip'}<Plane className="h-4 w-4" /></Link></div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
