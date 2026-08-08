import Head from 'next/head';
import KiwangoHome from '../components/KiwangoHome';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export default function Home() {
  const schemas = [
    { '@context':'https://schema.org','@type':'WebSite',name:'Kiwango',url:SITE_URL,inLanguage:['fr','en'] },
    { '@context':'https://schema.org','@type':'WebApplication',name:'Kiwango',url:`${SITE_URL}/app`,applicationCategory:'FinanceApplication',operatingSystem:'Any',description:'Compagnon financier de voyage : conversion, taux, budget, cash, destinations et outils hors connexion.',offers:{'@type':'Offer',price:'0',priceCurrency:'XOF'} },
  ];
  return <>
    <Head>
      <title>Kiwango | Votre compagnon financier de voyage</title>
      <meta name="description" content="Kiwango vous aide à comprendre et gérer votre argent en voyage : devises, taux réels, budgets, cash, destinations et préparation hors connexion." />
      <link rel="canonical" href={SITE_URL} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:title" content="Kiwango | Comprenez votre argent partout où vous allez" />
      <meta property="og:description" content="Conversion, voyage, taux réels, budget, cash et outils hors connexion dans une seule expérience." />
      <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
      {schemas.map((schema,index)=><script key={index} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>)}
    </Head>
    <KiwangoHome />
  </>;
}
