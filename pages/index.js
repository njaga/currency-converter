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
      name: 'AfriChange',
      url: SITE_URL,
      inLanguage: ['fr', 'en'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'AfriChange',
      url: SITE_URL,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      description: "Convertisseur de devises africaines offline-first. Les derniers taux synchronisés sont conservés localement pour permettre les conversions lorsque la connexion disparaît.",
      author: {
        '@type': 'Person',
        name: 'Ndiaga Ndiaye',
        url: 'https://ndiagandiaye.com',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'XOF',
      },
    },
  ];

  return (
    <>
      <Head>
        <title>AfriChange | Convertisseur de devises africaines hors connexion</title>
        <meta name="description" content="Convertissez les devises africaines et internationales, préparez vos taux avant un voyage et continuez à convertir hors connexion avec les derniers taux synchronisés." />
        <meta name="theme-color" content="#059669" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AfriChange" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="AfriChange | Devises africaines, même hors connexion" />
        <meta property="og:description" content="Un convertisseur pensé pour les déplacements en Afrique : taux synchronisés, mode voyage et utilisation hors connexion." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:locale" content="fr_FR" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AfriChange | Convertisseur de devises africaines" />
        <meta name="twitter:description" content="Préparez vos taux avant le départ et continuez à convertir quand la connexion disparaît." />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

        <link rel="canonical" href={canonicalUrl} />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="author" content="Ndiaga Ndiaye" />
        {schemas.map((schema, index) => (
          <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}
      </Head>
      <CurrencyConverter />
    </>
  );
}
