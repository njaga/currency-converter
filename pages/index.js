import KiwangoHome from '../components/KiwangoHome';
import SeoHead from '../components/SeoHead';
import { SITE_URL } from '../lib/seo';

const title = 'Kiwango | Votre compagnon financier de voyage';
const description = 'Préparez et gérez votre argent en voyage : conversion de devises, taux réels, budget, cash et Travel Packs disponibles hors connexion.';

export default function Home() {
  const schemas = [
    { '@context':'https://schema.org','@type':'WebSite',name:'Kiwango',url:SITE_URL,inLanguage:['fr','en'],publisher:{'@type':'Person',name:'Ndiaga Ndiaye',url:'https://ndiagandiaye.com'} },
    { '@context':'https://schema.org','@type':'SoftwareApplication',name:'Kiwango',url:`${SITE_URL}/convertisseur`,applicationCategory:'FinanceApplication',operatingSystem:'Web',description,featureList:['Conversion de devises','Travel Packs hors connexion','Vérification de taux','Budget de voyage','Repères financiers locaux'],offers:{'@type':'Offer',price:'0',priceCurrency:'XOF'} },
  ];
  return <>
    <SeoHead title={title} description={description} path="/" schema={schemas} imageAlt="Kiwango — préparez, convertissez et gardez vos repères en voyage" />
    <KiwangoHome />
  </>;
}
