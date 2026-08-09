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
import LanguageMenu from './LanguageMenu';
import Logo from './Logo';
import SiteFooter from './SiteFooter';
import { getCountryDirectory } from '../lib/country-directory-client';
import { TRAVEL_DESTINATIONS } from '../lib/travel';

const NAV_ITEMS = [
  { href: '#product', fr: 'Produit', en: 'Product' },
  { href: '#journey', fr: 'Préparer un voyage', en: 'Plan a trip' },
  { href: '/app?tab=tools', fr: 'Outils', en: 'Tools' },
  { href: '/app?tab=travel', fr: 'Destinations', en: 'Destinations' },
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
    const params = new URLSearchParams({ tab: 'travel', country: destinationCountry.code, origin: originCountry.code });
    if (submittedDeparture) params.set('depart', submittedDeparture);
    if (submittedReturn) params.set('return', submittedReturn);
    router.push(`/app?${params.toString()}`);
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

export default function KiwangoHome() {
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

  return (
    <div className="min-h-screen overflow-x-clip bg-[#fffefa] text-slate-950">
      <header className="sticky top-0 z-[140] border-b border-slate-200/80 bg-[#fffefa]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] w-full max-w-[1320px] items-center justify-between px-4 md:px-8">
          <Logo size="md" showText />
          <nav className="hidden items-center gap-8 lg:flex" aria-label={fr ? 'Navigation principale' : 'Main navigation'}>
            {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 transition hover:text-emerald-700">{fr ? item.fr : item.en}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageMenu value={lang} onChange={changeLang} />
            <Link href="/app" className="hidden bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:inline-flex">{fr ? 'Ouvrir Kiwango' : 'Open Kiwango'}</Link>
            <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label={fr ? 'Ouvrir le menu' : 'Open menu'} className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white lg:hidden">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-xl lg:hidden"><nav className="mx-auto grid max-w-6xl" aria-label={fr ? 'Navigation mobile' : 'Mobile navigation'}>{NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-slate-100 py-4 text-base font-semibold">{fr ? item.fr : item.en}<ArrowRight className="h-4 w-4 text-slate-400" /></Link>)}<Link href="/app" onClick={() => setMobileOpen(false)} className="mt-4 bg-emerald-600 px-4 py-3.5 text-center text-sm font-semibold text-white">{fr ? 'Ouvrir Kiwango' : 'Open Kiwango'}</Link></nav></div>}
      </header>

      <main>
        <section id="product" className="border-b border-slate-200 px-4 pb-14 pt-12 md:px-8 md:pb-16 md:pt-12">
          <div className="mx-auto grid w-full max-w-[1320px] gap-10 lg:grid-cols-[.98fr_1.02fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">{fr ? 'Guide de voyage financier' : 'Financial travel guide'}</p>
              <h1 className="mt-6 text-5xl font-semibold leading-[.98] tracking-[-.06em] sm:text-6xl lg:text-[76px]">{fr ? <>Changez de pays,<br />pas de repères<span className="text-emerald-600">.</span></> : <>Change countries,<br />not your bearings<span className="text-emerald-600">.</span></>}</h1>
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

        <section id="journey" className="px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-[1180px]">
            <div className="text-center"><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">{fr ? 'Votre voyage, en toute sérénité' : 'Your trip, with peace of mind'}</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] md:text-5xl">{fr ? 'Trois étapes. Un seul guide.' : 'Three stages. One guide.'}</h2></div>
            <div className="relative mt-14 grid gap-8 md:grid-cols-3 md:gap-0 before:absolute before:left-[16%] before:right-[16%] before:top-5 before:hidden before:h-px before:bg-slate-200 md:before:block">
              {[
                [fr ? 'Avant le départ' : 'Before departure', fr ? 'Renseignez votre trajet, estimez votre budget et enregistrez les informations utiles.' : 'Enter your journey, estimate your budget and save useful information.'],
                [fr ? 'Sur place' : 'At destination', fr ? 'Convertissez, contrôlez un taux proposé et suivez ce que vous dépensez.' : 'Convert, check an offered rate and track what you spend.'],
                [fr ? 'Au retour' : 'After the trip', fr ? 'Retrouvez votre historique et conservez uniquement les repères qui vous servent.' : 'Review your history and keep only the references that remain useful.'],
              ].map(([title, description], index) => <article key={title} className="relative px-5 text-center"><span className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">{index + 1}</span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">{description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-4 py-16 text-white md:px-8 md:py-24">
          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-400">{fr ? 'Une interface qui connaît votre trajet' : 'An interface built around your trip'}</p><h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.045em]">{fr ? 'Dakar → Nairobi change réellement votre expérience.' : 'Dakar → Nairobi genuinely changes your experience.'}</h2><p className="mt-5 max-w-lg text-base leading-7 text-slate-400">{fr ? 'Kiwango sélectionne les bonnes devises, ouvre la destination correspondante et préremplit les dates de préparation. Vous gardez la main sur chaque information.' : 'Kiwango selects the right currencies, opens the matching destination and prefills your preparation dates. You remain in control of every detail.'}</p><Link href="/app?tab=travel" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400">{fr ? 'Voir l’espace voyage' : 'See the travel workspace'}<ArrowRight className="h-4 w-4" /></Link></div>
            <div className="border border-white/10 bg-white/[.04] p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6"><div><span className="text-xs uppercase tracking-[.12em] text-slate-500">{fr ? 'Voyage actif' : 'Active trip'}</span><p className="mt-2 text-2xl font-semibold">Dakar <ArrowRight className="mx-2 inline h-5 w-5 text-emerald-400" /> Nairobi</p></div><span className="flex items-center gap-2 text-xs text-emerald-300"><WifiOff className="h-4 w-4" />{fr ? 'Prêt hors connexion' : 'Offline ready'}</span></div>
              <div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {[[fr ? 'Devise locale' : 'Local currency', 'KES'], [fr ? 'Budget du voyage' : 'Trip budget', fr ? 'À définir' : 'To set'], [fr ? 'Préparation' : 'Preparation', '2 / 6']].map(([label, value]) => <div key={label} className="py-5 sm:px-5 sm:first:pl-0 sm:last:pr-0"><span className="text-xs text-slate-500">{label}</span><strong className="mt-2 block text-lg">{value}</strong></div>)}
              </div>
            </div>
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
