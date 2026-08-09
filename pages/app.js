import Head from 'next/head';
import CurrencyConverter from '../components/CurrencyConverter';
import SiteFooter from '../components/SiteFooter';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://xof-converter.vercel.app').replace(/\/$/, '');

export default function AppPage() {
  return <>
    <Head>
      <title>Kiwango App | Convertir, voyager et gérer votre argent</title>
      <meta name="description" content="Ouvrez Kiwango pour convertir, préparer un voyage, vérifier un taux, suivre un budget et utiliser vos outils financiers." />
      <link rel="canonical" href={`${SITE_URL}/app`} />
      <meta name="robots" content="index, follow" />
    </Head>
    <div className="kiwango-app-page">
      <CurrencyConverter />
      <SiteFooter />
    </div>
  </>;
}
