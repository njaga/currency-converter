import Head from 'next/head';
import { useRouter } from 'next/router';
import CurrencyConverter from '../components/CurrencyConverter';

export default function Home() {
  const router = useRouter();
  const canonicalUrl = `https://africhange.vercel.app${router.asPath === '/' ? '' : router.asPath}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AfriChange",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "description": "Convertisseur de devises africaines (Franc CFA XOF/XAF, Naira NGN, Dalasi GMD, Cedi GHS, Shilling KES, Dirham MAD, Rand ZAR, Birr ETB) fonctionnant en temps réel et hors-ligne (PWA).",
    "author": {
      "@type": "Person",
      "name": "Ndiaga Ndiaye",
      "url": "https://ndiagandiaye.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "XOF"
    }
  };

  return (
    <>
      <Head>
        <title>AfriChange | Convertisseur de Devises Africaines (PWA Offline)</title>
        <meta name="description" content="Convertisseur PWA gratuit de devises africaines et internationales (CFA, Naira, Dalasi, Cedi, Shilling, Dirham, Euro, Dollar). Taux en direct et mode hors-ligne sans connexion." />
        <meta name="keywords" content="convertisseur devises africaines, PWA offline, franc CFA, XOF, XAF, naira NGN, dalasi GMD, cedi GHS, shilling KES, dirham MAD, rand ZAR" />
        
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AfriChange" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="AfriChange | Convertisseur de Devises Africaines (PWA)" />
        <meta property="og:description" content="Convertisseur PWA offline pour monnaies africaines. Calculez les taux de change même sans réseau." />
        <meta property="og:image" content="https://africhange.vercel.app/og-image.png" />
        <meta property="og:locale" content="fr_FR" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AfriChange | Convertisseur Devises Africaines PWA" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="author" content="Ndiaga Ndiaye" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      
      <CurrencyConverter />
    </>
  );
}