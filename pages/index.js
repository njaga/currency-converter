import Head from 'next/head';
import { useRouter } from 'next/router';
import CurrencyConverter from '../components/CurrencyConverter';

export default function Home() {
  const router = useRouter();
  const canonicalUrl = `https://xof-converter.vercel.app${router.asPath === '/' ? '' : router.asPath}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "XOF Converter",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "description": "Convertisseur de devises en temps réel pour le Franc CFA (XOF). Convertissez instantanément entre XOF et EUR, USD, GBP.",
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
        <title>XOF Converter | Convertisseur Franc CFA en Temps Réel</title>
        <meta name="description" content="Convertisseur de devises gratuit pour le Franc CFA (XOF). Taux de change en direct, conversion instantanée vers EUR, USD, GBP et plus." />
        <meta name="keywords" content="convertisseur XOF, franc CFA, taux de change, conversion FCFA, EUR XOF, USD XOF" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="XOF Converter | Convertisseur Franc CFA" />
        <meta property="og:description" content="Convertisseur de devises gratuit pour le Franc CFA. Taux actualisés en temps réel." />
        <meta property="og:image" content="https://xof-converter.vercel.app/og-image.png" />
        <meta property="og:locale" content="fr_FR" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="XOF Converter | Convertisseur Franc CFA" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.svg?v=3" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=3" />
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