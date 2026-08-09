import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, Check, Menu, ShieldCheck, WifiOff, X } from 'lucide-react';
import AppDownloadSection from './AppDownloadSection';
import CountryQuickSelect from './CountryQuickSelect';
import LanguageMenu from './LanguageMenu';
import Logo from './Logo';
import SiteFooter from './SiteFooter';

const NAV_ITEMS = [
  { tab: 'converter', fr: 'Convertir', en: 'Convert' },
  { tab: 'travel', fr: 'Préparer un voyage', en: 'Plan a trip' },
  { tab: 'tools', fr: 'Outils', en: 'Tools' },
  { tab: 'rates', fr: 'Taux', en: 'Rates' },
];

function ConverterPreview({ fr }) {
  return (
    <div className="border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,.09)] dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
        <span className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{fr ? 'Conversion en direct' : 'Live conversion'}</span>
        <span className="flex items-center gap-2 text-xs font-medium text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />{fr ? 'Taux synchronisé' : 'Rate synced'}</span>
      </div>
      <div className="grid sm:grid-cols-2">
        <div className="border-b border-slate-200 p-6 sm:border-b-0 sm:border-r dark:border-white/10">
          <p className="text-xs text-slate-400">{fr ? 'Montant' : 'Amount'}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-.04em]">100 EUR</p>
        </div>
        <div className="p-6">
          <p className="text-xs text-slate-400">{fr ? 'Vous recevez' : 'You receive'}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-.04em]">65 596 XOF</p>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-white/[.03] dark:text-slate-300">1 EUR = 655,957 XOF</div>
    </div>
  );
}

export default function KiwangoHome() {
  const [lang, setLang] = useState('fr');
  const [mobileOpen, setMobileOpen] = useState(false);
  const fr = lang === 'fr';

  useEffect(() => {
    const saved = localStorage.getItem('app_lang');
    if (saved === 'fr' || saved === 'en') setLang(saved);
  }, []);

  const changeLang = (value) => {
    setLang(value);
    localStorage.setItem('app_lang', value);
  };

  const selectCountry = (country) => {
    localStorage.setItem('kiwango_quick_destination', country.code);
    window.location.href = `/app?tab=travel&country=${country.code}`;
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-[140] border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <Logo size="md" showText />
          <nav className="hidden items-center gap-7 lg:flex" aria-label={fr ? 'Navigation principale' : 'Main navigation'}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.tab} href={`/app?tab=${item.tab}`} className="text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
                {fr ? item.fr : item.en}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden lg:block"><CountryQuickSelect lang={lang} onSelect={selectCountry} /></div>
            <LanguageMenu value={lang} onChange={changeLang} />
            <Link href="/app" className="hidden bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 dark:bg-white dark:text-slate-950 sm:inline-flex">{fr ? 'Ouvrir l’application' : 'Open the app'}</Link>
            <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label={fr ? 'Ouvrir le menu' : 'Open menu'} className="flex h-10 w-10 items-center justify-center border border-slate-200 lg:hidden dark:border-white/10">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-5 shadow-xl lg:hidden dark:border-white/10 dark:bg-slate-950">
            <nav className="mx-auto grid max-w-6xl gap-1" aria-label={fr ? 'Navigation mobile' : 'Mobile navigation'}>
              {NAV_ITEMS.map((item) => (
                <Link key={item.tab} href={`/app?tab=${item.tab}`} onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-slate-100 py-4 text-base font-semibold dark:border-white/10">
                  {fr ? item.fr : item.en}<ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
              <Link href="/app?tab=travel" onClick={() => setMobileOpen(false)} className="mt-3 bg-emerald-600 px-4 py-3.5 text-center text-sm font-semibold text-white">
                {fr ? 'Choisir une destination' : 'Choose a destination'}
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section className="border-b border-slate-200 px-4 py-16 md:px-6 md:py-24 dark:border-white/10">
          <div className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">{fr ? 'Le compagnon financier du voyageur' : 'The traveller’s money companion'}</p>
              <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.06] tracking-[-.045em] sm:text-5xl lg:text-[58px]">
                {fr ? 'Comprenez votre argent, où que vous alliez.' : 'Understand your money, wherever you go.'}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                {fr ? 'Convertissez, vérifiez un taux et préparez vos dépenses avant le départ. Kiwango reste utile même lorsque la connexion disparaît.' : 'Convert currencies, check an offered rate and prepare your spending before departure. Kiwango stays useful even when your connection disappears.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/app?tab=converter" className="inline-flex items-center gap-2 bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700">{fr ? 'Convertir maintenant' : 'Convert now'}<ArrowRight className="h-4 w-4" /></Link>
                <Link href="/app?tab=travel" className="inline-flex items-center gap-2 border border-slate-300 px-5 py-3.5 text-sm font-semibold hover:border-slate-950 dark:border-white/20 dark:hover:border-white">{fr ? 'Préparer un voyage' : 'Plan a trip'}</Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />{fr ? 'Sans compte' : 'No account'}</span>
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />{fr ? 'Données locales' : 'Local data'}</span>
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />{fr ? 'Mode hors connexion' : 'Offline mode'}</span>
              </div>
            </div>
            <ConverterPreview fr={fr} />
          </div>
        </section>

        <section className="px-4 py-16 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end">
              <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">{fr ? 'Une méthode simple' : 'A simple workflow'}</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] md:text-4xl">{fr ? 'Avant, pendant et après le change.' : 'Before, during and after exchange.'}</h2></div>
              <p className="max-w-xl text-base leading-7 text-slate-500 md:justify-self-end">{fr ? 'Kiwango rassemble les informations utiles sans transformer une conversion simple en parcours compliqué.' : 'Kiwango brings useful information together without turning a simple conversion into a complicated journey.'}</p>
            </div>
            <div className="mt-10 grid border-y border-slate-200 md:grid-cols-3 dark:border-white/10">
              {[
                [Calculator, fr ? 'Convertir' : 'Convert', fr ? 'Saisissez un montant et obtenez immédiatement sa valeur avec le dernier taux synchronisé.' : 'Enter an amount and instantly get its value using the latest synced rate.'],
                [ShieldCheck, fr ? 'Vérifier une offre' : 'Check an offer', fr ? 'Comparez le taux proposé par un hôtel, une banque ou un bureau de change.' : 'Compare a rate offered by a hotel, bank or exchange office.'],
                [WifiOff, fr ? 'Préparer le hors connexion' : 'Prepare offline', fr ? 'Enregistrez les taux et repères utiles pour votre destination avant de partir.' : 'Save useful rates and references for your destination before leaving.'],
              ].map(([Icon, title, description], index) => (
                <article key={title} className="border-b border-slate-200 py-7 last:border-0 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 dark:border-white/10">
                  <span className="text-xs font-semibold text-slate-400">0{index + 1}</span>
                  <Icon className="mt-7 h-5 w-5 text-emerald-700" />
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-4 py-16 text-white md:px-6 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-400">{fr ? 'Outils pratiques' : 'Practical tools'}</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] md:text-4xl">{fr ? 'Une fonction claire pour chaque besoin.' : 'One clear function for every need.'}</h2><p className="mt-4 text-sm leading-7 text-slate-400">{fr ? 'Ouvrez uniquement l’outil dont vous avez besoin. Vos informations restent sur cet appareil.' : 'Open only the tool you need. Your information stays on this device.'}</p></div>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {[
                [fr ? 'Vérifier un taux' : 'Check a rate', fr ? 'Mesurer l’écart entre le marché et une offre reçue.' : 'Measure the gap between the market and an offer.'],
                [fr ? 'Calculer les frais' : 'Calculate fees', fr ? 'Voir le montant réellement reçu après commissions.' : 'See the amount actually received after fees.'],
                [fr ? 'Gérer un budget voyage' : 'Manage a travel budget', fr ? 'Suivre les dépenses et le montant restant.' : 'Track spending and the remaining amount.'],
                [fr ? 'Préparer une destination' : 'Prepare a destination', fr ? 'Conserver les taux utiles pour une consultation hors connexion.' : 'Keep useful rates available offline.'],
              ].map(([title, description]) => (
                <Link key={title} href="/app?tab=tools" className="group grid gap-2 py-5 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center">
                  <strong>{title}</strong><span className="text-sm text-slate-400">{description}</span><ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-emerald-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <AppDownloadSection lang={lang} />

        <section className="border-t border-slate-200 px-4 py-16 md:px-6 dark:border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div><h2 className="text-3xl font-semibold tracking-[-.035em]">{fr ? 'Votre prochaine conversion peut commencer ici.' : 'Your next conversion can start here.'}</h2><p className="mt-2 text-slate-500">{fr ? 'Gratuit, sans compte et utilisable immédiatement.' : 'Free, accountless and ready to use.'}</p></div>
            <Link href="/app" className="inline-flex items-center justify-center gap-2 bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">{fr ? 'Ouvrir Kiwango' : 'Open Kiwango'}<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
