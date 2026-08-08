const SERVICES = {
  flights: 'AFFILIATE_FLIGHTS_URL_TEMPLATE',
  hotels: 'AFFILIATE_HOTELS_URL_TEMPLATE',
  esim: 'AFFILIATE_ESIM_URL_TEMPLATE',
  activities: 'AFFILIATE_ACTIVITIES_URL_TEMPLATE',
  transfer: 'AFFILIATE_TRANSFER_URL_TEMPLATE',
  insurance: 'AFFILIATE_INSURANCE_URL_TEMPLATE',
};

function fillTemplate(template, values) {
  return Object.entries(values).reduce((url, [key, value]) => url.replaceAll(`{${key}}`, encodeURIComponent(value || '')), template);
}

function addCampaign(urlString, campaign) {
  try {
    const url = new URL(urlString);
    if (campaign && !url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', campaign);
    if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'kiwango');
    if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'affiliate');
    return url.toString();
  } catch {
    return urlString;
  }
}

export async function getServerSideProps({ params, query }) {
  const envKey = SERVICES[params.service];
  const template = envKey ? process.env[envKey] : null;

  if (!template) {
    return {
      redirect: {
        destination: `/?tab=travel&affiliate=unavailable&service=${encodeURIComponent(params.service || '')}`,
        permanent: false,
      },
    };
  }

  const destination = fillTemplate(template, {
    countryCode: String(query.countryCode || '').toUpperCase(),
    country: String(query.country || ''),
    currency: String(query.currency || '').toUpperCase(),
    lang: query.lang === 'en' ? 'en' : 'fr',
  });

  return {
    redirect: {
      destination: addCampaign(destination, process.env.AFFILIATE_CAMPAIGN || 'kiwango'),
      permanent: false,
    },
  };
}

export default function AffiliateRedirect() { return null; }
