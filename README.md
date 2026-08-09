# Kiwango

**Travel money companion — conversion, destination Travel Packs, rate checking, budgets, cash tools and offline access in one PWA.**

Kiwango is designed for travelers and cross-border users who need to understand money across currencies, including when connectivity is unreliable.

## What Kiwango includes

- currency conversion with explicit source/freshness states;
- global country directory with automatic local-currency discovery;
- offline Travel Packs per destination;
- multi-currency destination support;
- Rate Check for evaluating an offered exchange rate;
- percentage/fixed-fee calculator;
- travel budget and Cash Wallet;
- multi-currency calculator and ATM estimator;
- local rate alerts;
- Scan & Convert with honest manual fallback when OCR is unavailable;
- private field-rate observations;
- verified historical trends where real dated data exists;
- configurable payment-method comparison;
- nearby ATM/bank/exchange discovery via Google Places with OpenStreetMap fallback;
- contextual partner links for flights, hotels, eSIM, transfers, activities and insurance;
- privacy-first optional analytics and sanitized technical monitoring.

Kiwango never fabricates a market or historical rate simply to keep a feature active.

## Architecture principles

### Country first, currency second

A destination is modeled as a country, not as a currency. Senegal, Côte d’Ivoire, Mali and Benin remain distinct Travel Packs even though they share XOF.

### Offline first

```text
Internet available
      │
      ├── country directory
      ├── exchange-rate providers
      └── optional server fallbacks
               │
               ▼
      validation / normalization
               │
               ▼
            IndexedDB
               │
               ▼
       local conversion engine

Offline
      │
      ├── cached rate snapshot
      ├── prepared Travel Packs
      └── official EUR/XOF/XAF parity when applicable
```

Travel Packs are not marked ready unless the required rate data is valid and successfully persisted.

## Public destination pages

Kiwango exposes indexable guides under:

```text
/voyage/gambie
/voyage/senegal
/voyage/cote-d-ivoire
/voyage/ghana
...
```

The sitemap and robots file are generated dynamically from the configured production domain.

## Privacy analytics

Analytics are optional and environment-driven. Kiwango supports Umami without cookies, excludes URL query/hash values, respects browser Do Not Track and only emits allowlisted product events.

Tracked product events intentionally avoid free-form financial data and user identifiers. Examples include:

- destination selected;
- Travel Pack prepared/refreshed;
- tool opened;
- affiliate service clicked.

No analytics script is loaded when Umami is not configured.

## Error/API monitoring

Client runtime errors pass through a React error boundary and a small first-party telemetry endpoint. Server monitoring hooks cover critical provider failures such as exchange rates, destination directory and nearby financial services.

The monitoring payload is intentionally restricted. Kiwango does not intentionally send API keys, coordinates, monetary amounts, IP addresses, emails or user identifiers to the configured monitoring sink.

## Affiliate architecture

Partner URLs are configured using server-only templates and routed through `/go/[service]`.

Supported placeholders:

- `{countryCode}`
- `{country}`
- `{currency}`
- `{lang}`

Supported services include flights, hotels, eSIM, activities, transfer and insurance. The UI discloses the affiliate relationship and links use `rel="sponsored"`.

## PWA

The installed application starts at `/app` and includes shortcuts for Convertir, Voyage, Outils and Devises.

The service worker uses network-first navigation, keeps `/api/*` out of generic caching and exposes an explicit update action when a new Kiwango version is waiting. iOS users receive Add to Home Screen guidance when no native install prompt is available.

## Tech stack

- Next.js 16 Pages Router
- React 19
- Tailwind CSS
- IndexedDB
- Service Worker / PWA APIs
- REST Countries
- Fawaz exchange-rate dataset
- Frankfurter
- ExchangeRate-API / CurrencyAPI optional server fallbacks
- Google Places API (New)
- OpenStreetMap / Overpass fallback
- Umami optional privacy analytics

## Development

```bash
git clone https://github.com/njaga/currency-converter.git
cd currency-converter
cp .env.example .env.local
npm install
npm run dev
```

## Production environment

```env
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example

NEXT_PUBLIC_UMAMI_SCRIPT_URL=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_DOMAINS=

MONITORING_WEBHOOK_URL=
MONITORING_WEBHOOK_TOKEN=

EXCHANGE_RATE_API_KEY=
CURRENCY_API_KEY=
REST_COUNTRIES_API_KEY=
GOOGLE_MAPS_API_KEY=

AFFILIATE_FLIGHTS_URL_TEMPLATE=
AFFILIATE_HOTELS_URL_TEMPLATE=
AFFILIATE_ESIM_URL_TEMPLATE=
AFFILIATE_ACTIVITIES_URL_TEMPLATE=
AFFILIATE_TRANSFER_URL_TEMPLATE=
AFFILIATE_INSURANCE_URL_TEMPLATE=
AFFILIATE_CAMPAIGN=kiwango
```

Never prefix a provider secret with `NEXT_PUBLIC_`.

## Release validation

GitHub Actions blocks the Release Candidate on:

- production dependency vulnerabilities at high/critical level;
- critical currency-core tests;
- ESLint;
- Next.js production build;
- production smoke tests for public pages, destination SEO, PWA assets and critical APIs.

See [`RELEASE_CHECKLIST.md`](./RELEASE_CHECKLIST.md) for the remaining real-device/provider validation before public V1 release.

## Data integrity rules

- no random or simulated market/historical data presented as real;
- no provider secret in client-side code;
- no market rate without a source or cached timestamp, except official fixed parity;
- stale data must be visibly identified;
- unavailable data remains unavailable rather than being fabricated;
- operator/community pricing is never presented as live without a reliable source.

## Author

Ndiaga Ndiaye  
https://ndiagandiaye.com
