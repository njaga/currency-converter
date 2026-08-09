import Head from 'next/head';
import { useRouter } from 'next/router';
import CurrencyConverter from '../components/CurrencyConverter';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://xof-converter.vercel.app').replace(/\/$/, '');

export default function Home() {
  const router = useRouter();
  const path = router.asPath === '/' ? '' : router.asPath.split('?')[0];
  const canonicalUrl = `${SITE_URL}${path}`;

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Kiwango',
      url: SITE_URL,
      inLanguage: ['fr', 'en'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Kiwango',
      url: SITE_URL,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      description: "Compagnon financier de voyage conçu pour l’Afrique : conversion, vérification des taux, frais réels, budget, cash wallet et préparation hors connexion.",
      author: { '@type': 'Person', name: 'Ndiaga Ndiaye', url: 'https://ndiagandiaye.com' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'XOF' },
    },
  ];

  return <>
    <Head>
      <title>Kiwango | Convertisseur et compagnon financier de voyage</title>
      <meta name="description" content="Kiwango vous aide à convertir les devises, vérifier un taux proposé, calculer les frais, préparer un voyage et gérer votre budget même hors connexion." />
      <meta name="theme-color" content="#0f172a" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Kiwango" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content="Kiwango | Votre argent, compris partout où vous voyagez" />
      <meta property="og:description" content="Conversion, voyage, frais réels, budget et outils hors connexion dans une seule application." />
      <meta property="og:image" content={`${SITE_URL}/og-image.svg`} />
      <meta property="og:locale" content="fr_FR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Kiwango | Compagnon financier de voyage" />
      <meta name="twitter:description" content="Convertissez, vérifiez les taux et gérez votre argent en voyage, même hors connexion." />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.svg`} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/favicon.svg" />
      <meta name="author" content="Ndiaga Ndiaye" />
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    </Head>
    <CurrencyConverter />
  </>;
}
