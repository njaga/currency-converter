import CurrencyConverter from './CurrencyConverter';
import SiteFooter from './SiteFooter';
import SeoHead from './SeoHead';
import { APP_ROUTES } from '../lib/app-routes';
import { absoluteUrl } from '../lib/seo';

const META = {
  converter: {
    title: 'Convertisseur de devises pour voyager | Kiwango',
    description: 'Convertissez vos devises de voyage avec des taux horodatés, des paires favorites, un historique local et un fonctionnement hors connexion.',
    schemaType: 'WebApplication',
  },
  travel: {
    title: 'Travel Pack : préparer son argent en voyage | Kiwango',
    description: 'Préparez votre destination, vos devises, vos dates, votre checklist, vos DAB et bureaux de change pour les consulter hors connexion.',
    schemaType: 'WebPage',
  },
  advisor: {
    title: 'Comment payer moins cher en voyage | Kiwango',
    description: 'Comparez carte, DAB, bureau de change et conversion dynamique pour choisir le moyen de paiement au coût réel le plus faible.',
    schemaType: 'WebApplication',
  },
  tools: {
    title: 'Outils financiers de voyage | Kiwango',
    description: 'Vérifiez un taux proposé, calculez les frais, préparez un budget et gérez votre cash pendant le voyage.',
    schemaType: 'CollectionPage',
  },
};

export default function KiwangoAppPage({ tab = 'converter' }) {
  const meta = META[tab] || META.converter;
  const path = APP_ROUTES[tab] || APP_ROUTES.converter;
  const canonical = absoluteUrl(path);
  const schema = {
    '@context': 'https://schema.org',
    '@type': meta.schemaType,
    name: meta.title,
    description: meta.description,
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'Kiwango', url: absoluteUrl('/') },
  };

  return <>
    <SeoHead title={meta.title} description={meta.description} path={path} schema={schema} />
    <div className="kiwango-app-page">
      <CurrencyConverter initialTab={tab} />
      <SiteFooter />
    </div>
  </>;
}
