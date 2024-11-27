import Head from 'next/head';
import { useRouter } from 'next/router';
import CurrencyConverter from '../components/CurrencyConverter';

export default function Home() {
  const router = useRouter();
  const canonicalUrl = `https://xof-converter.vercel.app${router.asPath}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "XOF Converter",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "description": "Convertisseur de devises en temps réel pour le Franc CFA (XOF). Convertissez instantanément entre XOF et d'autres devises comme EUR, USD, GBP.",
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
        <title>Convertisseur Franc CFA (XOF) | Taux de Change en Temps Réel | XOF Converter</title>
        <meta name="description" content="Convertisseur de devises gratuit pour le Franc CFA (XOF). Taux de change en direct, conversion instantanée vers EUR, USD, GBP. Historique des taux et favoris." />
        <meta name="keywords" content="convertisseur XOF, franc CFA, taux de change XOF, conversion FCFA, EUR to XOF, USD to XOF, convertisseur BCEAO, devise africaine" />
        
        {/* Balises Open Graph améliorées */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Convertisseur Franc CFA (XOF) | Taux en Temps Réel" />
        <meta property="og:description" content="Convertisseur de devises gratuit pour le Franc CFA. Taux actualisés, conversion EUR, USD, GBP vers XOF. Interface simple et rapide." />
        <meta property="og:image" content="https://xof-converter.vercel.app/og-image.png" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="XOF Converter" />

        {/* Twitter Card amélioré */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@ndiagandiaye" />
        <meta name="twitter:title" content="Convertisseur Franc CFA (XOF) | Taux en Temps Réel" />
        <meta name="twitter:description" content="Convertissez facilement vos Francs CFA (XOF) vers d'autres devises. Taux actualisés en temps réel." />
        <meta name="twitter:image" content="https://xof-converter.vercel.app/og-image.png" />

        {/* Métadonnées supplémentaires */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="author" content="Ndiaga Ndiaye" />
        <meta name="rating" content="safe for kids" />
        <meta name="copyright" content="Ndiaga Ndiaye" />

        {/* Données structurées JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <CurrencyConverter />
        </div>
      </div>
    </>
  );
}