# Kiwango

**Travel money companion — conversion, rate checking, global destination packs, budgets and offline tools in one PWA.**

Kiwango is designed for travelers, cross-border workers and anyone who needs to understand and manage money across currencies when connectivity can be unreliable.

Current deployment: https://xof-converter.vercel.app

## Product idea

Kiwango goes beyond a basic currency converter. The product combines reliable rate conversion with practical travel-money workflows:

- currency conversion with clear rate freshness;
- a global country directory with automatic local-currency discovery;
- offline Travel Packs per destination, even when several countries share one currency;
- Rate Check for evaluating a rate offered by a bureau, hotel or merchant;
- fee-aware “amount actually received” calculator;
- travel budget tracking with categories and progress;
- Cash Wallet for physical cash;
- multi-currency calculator;
- ATM withdrawal estimator;
- local above/below rate alerts;
- Scan & Convert with browser-native OCR when available and manual fallback otherwise;
- locally recorded field rates with comparison to the reference rate;
- verified historical trends over 7, 30 or 90 days;
- configurable payment-method comparison;
- nearby ATMs, banks, exchange services and transfer points;
- a local contextual summary built from the user’s own budget, cash and alerts;
- contextual partner links for flights, hotels, eSIM, transfers, activities and insurance.

The application never fabricates a market or historical rate simply to keep a feature looking active.

## Global destination engine

Kiwango treats a **country as the travel object**, not a currency. Senegal, Côte d’Ivoire, Mali and Benin therefore remain separate destinations even though they share XOF.

The country directory is normalized server-side from REST Countries and includes country code, display name, capital, region and all currencies associated with the destination. The selected country determines the primary local currency used to build the Travel Pack.

## Offline-first architecture

```text
Internet available
      │
      ├── global country directory
      ├── Fawaz exchange-rate dataset
      ├── Frankfurter
      └── optional server-side fallback
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
      ├── latest IndexedDB snapshot
      ├── prepared Travel Packs
      └── official EUR/XOF/XAF fixed parity when applicable
```

Rate-provider and Google Maps API keys are never embedded in the browser bundle.

## Travel Packs

A Travel Pack prepares a destination before departure. Kiwango stores useful currency pairs locally and generates a quick cheat sheet for common amounts. If reliable data cannot be retrieved, the pack is not falsely marked as synchronized.

Each destination also exposes a contextual **Prepare your trip** section. Affiliate destinations are routed through `/go/[service]`, keeping partner URLs and identifiers outside UI components.

## Kiwango Tools

### Rate Check
Compare either an offered rate or the amount actually received with Kiwango’s reference rate. The tool estimates the percentage difference, expected amount and potential loss.

### Real fees
Combine percentage and fixed fees, use quick fee presets, and compare gross, net and final received amounts.

### Budget Voyage
Create a local travel budget, categorize expenses, follow progress and remove incorrect entries.

### Cash Wallet
Track the estimated amount of physical cash still in your pocket, with reversible additions and expenses.

### Calculator & ATM estimator
Calculate expressions such as `450 * 3 + 120`, convert the result, and estimate withdrawals including ATM and bank fees.

### Alerts
Create local rate thresholds above or below a target. True background push notifications still require a push service.

### Scan & Convert
Use the camera or an image of a price/receipt. Kiwango uses the browser’s native text detector when supported and falls back to assisted manual entry instead of pretending OCR succeeded.

### Field rates
Record rates actually offered by a bureau, hotel or merchant, add a note and compare observations with the current reference rate. These observations remain private on the device until a moderated community backend exists.

## Insights

Kiwango includes verified 7/30/90-day historical series where the provider has real dated snapshots. It also includes a customizable payment-method comparator, a contextual local summary, and nearby financial-services discovery.

When `GOOGLE_MAPS_API_KEY` is configured, nearby financial services use **Google Places API (New)**. If Google Places is unavailable or not configured, Kiwango falls back to OpenStreetMap / Overpass so the feature can still remain useful.

## Affiliate architecture

Partner cards are configured with server-only URL templates rather than hard-coded links. Supported placeholders are:

- `{countryCode}`
- `{country}`
- `{currency}`
- `{lang}`

The server fills those values and redirects through `/go/flights`, `/go/hotels`, `/go/esim`, `/go/activities`, `/go/transfer` or `/go/insurance`. This lets Kiwango switch partners without changing the product UI.

Affiliate links use `rel="sponsored"` in the interface and the legal page discloses that Kiwango may receive a commission without increasing the user’s price.

## Supported currencies

The core registry focuses on Africa and major international currencies. The global travel directory can discover additional ISO currencies dynamically; unknown currency codes still receive a safe generic display entry in the converter rather than breaking the interface.

The EUR/XOF and EUR/XAF fixed parities are handled explicitly by the conversion engine.

## Local data

IndexedDB stores exchange-rate snapshots, conversion history, favorites and prepared Travel Packs. Additional personal travel tools such as budget, Cash Wallet, local alerts and field observations are stored locally in the browser. No account is required for the current core experience.

## PWA

The app includes a web manifest and service worker. Application resources are cached for reuse, while `/api/*` responses are excluded from the service-worker cache because exchange-rate freshness is managed explicitly by the rate layer and IndexedDB.

PWA shortcuts open Convert, Voyage and Tools directly.

## Languages

The maintained interface languages are French and English.

## Tech stack

- Next.js Pages Router
- React
- Tailwind CSS
- IndexedDB
- Service Worker / PWA APIs
- REST Countries for the global destination directory
- Fawaz exchange-rate dataset
- Frankfurter fallback
- Google Places API (New)
- OpenStreetMap / Overpass fallback

## Development

```bash
git clone https://github.com/njaga/currency-converter.git
cd currency-converter
cp .env.example .env.local
npm install
npm run dev
```

Main environment variables:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.example
EXCHANGE_RATE_API_KEY=
GOOGLE_MAPS_API_KEY=

AFFILIATE_FLIGHTS_URL_TEMPLATE=
AFFILIATE_HOTELS_URL_TEMPLATE=
AFFILIATE_ESIM_URL_TEMPLATE=
AFFILIATE_ACTIVITIES_URL_TEMPLATE=
AFFILIATE_TRANSFER_URL_TEMPLATE=
AFFILIATE_INSURANCE_URL_TEMPLATE=
AFFILIATE_CAMPAIGN=kiwango
```

Never prefix a secret provider key with `NEXT_PUBLIC_`.

## Data integrity rules

- no random or simulated market/historical data presented as real;
- no secret provider key in client-side code;
- no rate without a traceable source or cached timestamp, except an official fixed parity;
- no silent substitution of stale data for live data;
- unavailable data must remain visibly unavailable;
- community or operator pricing is never presented as live unless a reliable source actually exists.

## Author

Ndiaga Ndiaye  
https://ndiagandiaye.com
