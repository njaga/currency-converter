import Head from 'next/head';
import CurrencyConverter from './CurrencyConverter';
import SiteFooter from './SiteFooter';
import { APP_ROUTES } from '../lib/app-routes';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kiwango.vercel.app').replace(/\/$/, '');

const META = {
  converter: {
    title: 'Convertisseur de devises pour voyager | Kiwango',
    description: 'Convertissez un montant entre les devises de votre voyage avec des taux horodatés et un fonctionnement hors connexion.',
  },
  travel: {
    title: 'Préparer un voyage et son budget | Kiwango',
    description: 'Préparez votre destination, vos devises, vos dates, votre checklist et votre Travel Pack avant le départ.',
  },
  tools: {
    title: 'Outils financiers de voyage | Kiwango',
    description: 'Vérifiez un taux proposé, calculez les frais, préparez un budget et gérez votre cash pendant le voyage.',
  },
  rates: {
    title: 'Taux et devises internationales | Kiwango',
    description: 'Explorez les devises et les paires de change utiles avec la date de dernière synchronisation.',
  },
};

export default function KiwangoAppPage({ tab = 'converter' }) {
  const meta = META[tab] || META.converter;
  const canonical = `${SITE_URL}${APP_ROUTES[tab] || APP_ROUTES.converter}`;

  return <>
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content="index, follow" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
    </Head>
    <div className="kiwango-app-page">
      <CurrencyConverter initialTab={tab} />
      <SiteFooter />
    </div>
  </>;
}
