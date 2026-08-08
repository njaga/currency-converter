import Head from 'next/head';
import Link from 'next/link';
import * as Flags from 'country-flag-icons/react/3x2';
import { ArrowRight, Banknote, Globe2, MapPin, Plane, ShieldCheck, WifiOff } from 'lucide-react';
import Logo from '../../components/Logo';
import SiteFooter from '../../components/SiteFooter';
import { fetchCountryDirectory, countrySlug, resolveCountry } from '../../lib/countries-server';
import { TRAVEL_DESTINATIONS } from '../../lib/travel';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://xof-converter.vercel.app').replace(/\/$/, '');

const fallbackDirectory = TRAVEL_DESTINATIONS.map((item) => ({
  code: item.code,
  code3: item.code,
  name: item.country,
  officialName: item.country,
  capital: null,
  region: 'Africa',
  subregion: null,
  currencies: [{ code: item.currency, name: item.currency, symbol: item.currency }],
  primaryCurrency: { code: item.currency, name: item.currency, symbol: item.currency },
}));

function Flag({ code }) {
  const Component = Flags[code?.toUpperCase()];
  return Component ? <Component className="h-10 w-16 rounded-xl border border-black/5 object-cover shadow-sm" /> : <Globe2 className="h-8 w-8 text-slate-400" />;
}

function localCountryName(code, fallback) {
  try { return new Intl.DisplayNames(['fr'], { type: 'region' }).of(code) || fallback; } catch { return fallback; }
}

export default function DestinationPage({ country }) {
  const name = localCountryName(country.code, country.name);
  const slug = countrySlug(name || country.name);
  const canonical = `${SITE_URL}/voyage/${slug}`;
  const currencies = country.currencies || [];
  const primary = country.primaryCurrency || currencies[0];
  const currencyCodes = currencies.map((currency) => currency.code).join(', ');
  const title = `${name} : devise, change et Travel Pack | Kiwango`;
  const description = `Préparez votre voyage en ${name} : devise ${currencyCodes || primary?.code || ''}, repères de change, Travel Pack hors connexion et outils financiers Kiwango.`;
  const appHref = `/app?tab=travel&country=${country.code}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonical,
    about: {
      '@type': 'Country',
      name,
      identifier: country.code,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Kiwango', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Voyage', item: `${SITE_URL}/app?tab=travel` },
        { '@type': 'ListItem', position: 3, name, item: canonical },
      ],
    },
  };

  return <div className="min-h-screen overflow-x-clip bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="fr" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </Head>

    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Logo size="md" />
        <div className="flex items-center gap-2">
          <Link href="/" className="hidden rounded-full px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 sm:inline-flex dark:hover:bg-white/5">Accueil</Link>
          <Link href={appHref} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">Préparer ce voyage<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </header>

    <main>
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-12 md:px-6 md:pb-20 md:pt-20">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_.7fr]">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-4"><Flag code={country.code} /><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-700">Guide financier de voyage</p><p className="mt-1 text-sm text-slate-500">{country.region}{country.subregion ? ` · ${country.subregion}` : ''}</p></div></div>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-5xl lg:text-6xl">Votre argent en {name}, sans improviser sur place.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">Identifiez la devise locale, préparez vos repères de conversion et gardez les informations essentielles disponibles hors connexion avec votre Travel Pack Kiwango.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href={appHref} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(5,150,105,.18)] hover:bg-emerald-700"><Plane className="h-4 w-4" />Préparer {name}</Link><Link href="/app?tab=converter" className="inline-flex items-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold hover:border-emerald-300 dark:border-white/10">Ouvrir le convertisseur</Link></div>
          </div>
          <div className="rounded-[30px] bg-[#f2f8f4] p-6 dark:bg-white/[.04] sm:p-8"><p className="text-[11px] font-semibold uppercase tracking-[.15em] text-slate-400">À retenir</p><div className="mt-6 space-y-5"><div className="flex items-start gap-4"><span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-900"><Banknote className="h-5 w-5" /></span><div><p className="text-sm text-slate-500">Devise{currencies.length > 1 ? 's' : ''}</p><p className="mt-1 text-lg font-semibold">{currencies.map((currency) => `${currency.code}${currency.symbol && currency.symbol !== currency.code ? ` · ${currency.symbol}` : ''}`).join(' / ')}</p></div></div>{country.capital && <div className="flex items-start gap-4"><span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-900"><MapPin className="h-5 w-5" /></span><div><p className="text-sm text-slate-500">Capitale</p><p className="mt-1 text-lg font-semibold">{country.capital}</p></div></div>}<div className="flex items-start gap-4"><span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-900"><WifiOff className="h-5 w-5" /></span><div><p className="text-sm text-slate-500">Travel Pack</p><p className="mt-1 text-lg font-semibold">Préparable hors connexion</p></div></div></div></div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-slate-50/70 dark:border-white/10 dark:bg-white/[.025]"><div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 md:grid-cols-3 md:px-6 md:py-16"><article className="rounded-[26px] bg-white p-6 dark:bg-slate-900"><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-emerald-700">01 — Avant de partir</p><h2 className="mt-4 text-xl font-semibold">Synchronisez votre Travel Pack.</h2><p className="mt-3 text-sm leading-6 text-slate-500">Téléchargez les paires utiles et la dernière date de synchronisation avant de perdre votre connexion.</p></article><article className="rounded-[26px] bg-white p-6 dark:bg-slate-900"><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-emerald-700">02 — Sur place</p><h2 className="mt-4 text-xl font-semibold">Vérifiez ce qu’on vous propose.</h2><p className="mt-3 text-sm leading-6 text-slate-500">Utilisez Rate Check pour comparer un taux de bureau de change ou un montant reçu à votre référence.</p></article><article className="rounded-[26px] bg-white p-6 dark:bg-slate-900"><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-emerald-700">03 — Pendant le séjour</p><h2 className="mt-4 text-xl font-semibold">Gardez la maîtrise du cash.</h2><p className="mt-3 text-sm leading-6 text-slate-500">Budget, Cash Wallet, ATM et taux terrain restent regroupés dans le même espace Kiwango.</p></article></div></section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-700">Devise locale</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em]">Ce que Kiwango prépare pour {name}.</h2></div><div className="grid gap-3 sm:grid-cols-2">{currencies.map((currency) => <div key={currency.code} className="rounded-[26px] border border-slate-200 p-5 dark:border-white/10"><p className="text-xs text-slate-400">Code ISO</p><p className="mt-2 text-2xl font-semibold">{currency.code}</p><p className="mt-2 text-sm text-slate-500">{currency.name || 'Devise locale'}{currency.symbol ? ` · symbole ${currency.symbol}` : ''}</p></div>)}<div className="rounded-[26px] border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20"><ShieldCheck className="h-5 w-5 text-emerald-700" /><p className="mt-5 font-semibold">Taux horodatés</p><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Kiwango indique la dernière synchronisation et vous avertit lorsque votre Travel Pack devient ancien.</p></div></div></div></section>

      <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6"><div className="overflow-hidden rounded-[34px] bg-[#07130f] p-7 text-white sm:p-10"><div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-300">Prêt à partir ?</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em]">Préparez {name} avant le départ.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Ouvrez le mode Voyage, sélectionnez votre devise si nécessaire et synchronisez les données utiles sur cet appareil.</p></div><Link href={appHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">Créer mon Travel Pack<ArrowRight className="h-4 w-4" /></Link></div></div></section>
    </main>
    <SiteFooter />
  </div>;
}

export async function getServerSideProps({ params, res }) {
  const remote = await fetchCountryDirectory();
  const countries = remote.countries.length ? remote.countries : fallbackDirectory;
  const country = resolveCountry(countries, params.destination);
  if (!country) return { notFound: true };

  const localizedName = localCountryName(country.code, country.name);
  const canonicalSlug = countrySlug(localizedName || country.name);
  if (params.destination !== canonicalSlug) {
    return { redirect: { destination: `/voyage/${canonicalSlug}`, permanent: true } };
  }

  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  return { props: { country } };
}
