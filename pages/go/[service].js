const SERVICES = {
  flights: 'AFFILIATE_FLIGHTS_URL_TEMPLATE',
  hotels: 'AFFILIATE_HOTELS_URL_TEMPLATE',
  esim: 'AFFILIATE_ESIM_URL_TEMPLATE',
  activities: 'AFFILIATE_ACTIVITIES_URL_TEMPLATE',
  transfer: 'AFFILIATE_TRANSFER_URL_TEMPLATE',
  insurance: 'AFFILIATE_INSURANCE_URL_TEMPLATE',
};

const clean = (value, max = 120) => String(value || '').trim().slice(0, max);

function fillTemplate(template, values) {
  return Object.entries(values).reduce(
    (url, [key, value]) => url.replaceAll(`{${key}}`, encodeURIComponent(value || '')),
    template
  );
}

function validatedPartnerUrl(urlString, campaign) {
  try {
    const url = new URL(urlString);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (!url.hostname) return null;
    if (campaign && !url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', clean(campaign, 80));
    if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'kiwango');
    if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'affiliate');
    return url.toString();
  } catch {
    return null;
  }
}

const fallbackDestination = (service, reason) =>
  `/app?tab=travel&affiliate=${encodeURIComponent(reason)}&service=${encodeURIComponent(clean(service, 40))}`;

export async function getServerSideProps({ params, query }) {
  const service = clean(params?.service, 40).toLowerCase();
  const envKey = SERVICES[service];

  if (!envKey) {
    return {
      redirect: {
        destination: fallbackDestination(service, 'invalid-service'),
        permanent: false,
      },
    };
  }

  const template = process.env[envKey];
  if (!template) {
    return {
      redirect: {
        destination: fallbackDestination(service, 'unavailable'),
        permanent: false,
      },
    };
  }

  const destination = fillTemplate(template, {
    countryCode: clean(query.countryCode, 3).toUpperCase(),
    country: clean(query.country),
    currency: clean(query.currency, 8).toUpperCase(),
    lang: query.lang === 'en' ? 'en' : 'fr',
  });

  const safeUrl = validatedPartnerUrl(destination, process.env.AFFILIATE_CAMPAIGN || 'kiwango');
  if (!safeUrl) {
    return {
      redirect: {
        destination: fallbackDestination(service, 'invalid-partner-url'),
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: safeUrl,
      permanent: false,
    },
  };
}

export default function AffiliateRedirect() { return null; }
