# Kiwango

**Travel money companion for Africa — conversion, rate checking, budgets and offline tools in one PWA.**

Kiwango is designed for travelers, cross-border workers and anyone who needs to understand and manage money across currencies when connectivity can be unreliable.

Current deployment: https://xof-converter.vercel.app

## Product idea

Kiwango goes beyond a basic currency converter. The product combines reliable rate conversion with practical travel-money workflows:

- currency conversion with clear rate freshness;
- offline Travel Packs;
- Rate Check for evaluating a rate offered by a bureau, hotel or merchant;
- fee-aware “amount actually received” calculator;
- travel budget tracking;
- Cash Wallet for physical cash;
- multi-currency calculator;
- ATM withdrawal estimator;
- local rate alerts;
- Scan & Convert with browser-native OCR when available and manual fallback otherwise;
- locally recorded field rates;
- verified historical trends;
- configurable payment-method comparison;
- nearby ATMs, banks and exchange services using OpenStreetMap data;
- a local contextual summary built from the user’s own budget, cash and alerts.

The application never fabricates a market or historical rate simply to keep a feature looking active.

## Offline-first architecture

```text
Internet available
      │
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

Rate-provider API keys are never embedded in the browser bundle.

## Travel Packs

A Travel Pack prepares a destination before departure. Kiwango stores the useful currency pairs locally and generates a quick offline cheat sheet for common amounts. If reliable data cannot be retrieved, the pack is not falsely marked as synchronized.

## Kiwango Tools

### Rate Check
Compare a rate offered in the real world with Kiwango’s current reference rate and estimate the percentage difference and potential loss.

### Real fees
Add percentage and fixed fees to estimate how much is actually converted and received.

### Budget Voyage
Create a local travel budget, add expenses and track remaining funds.

### Cash Wallet
Track the estimated amount of physical cash still in your pocket without connecting a bank account.

### Calculator & ATM estimator
Calculate expressions such as `450 * 3 + 120`, convert the result, and estimate withdrawals including ATM and bank fees.

### Alerts
Create local rate thresholds. The current implementation evaluates them while Kiwango is open; true background push notifications require a push service.

### Scan & Convert
Use the camera or an image of a price/receipt. Kiwango uses the browser’s native text detector when supported and falls back to assisted manual entry instead of pretending OCR succeeded.

### Field rates
Record rates actually offered by a bureau, hotel or merchant. These observations currently remain private on the device. A shared community layer will require a moderated backend.

## Insights

Kiwango includes verified historical series where the provider has real dated snapshots. It also includes a fee-method comparator and a nearby-services search for ATMs, banks, exchange offices and money-transfer points using OpenStreetMap/Overpass.

## Supported currencies

The registry focuses on Africa and also contains major international currencies, including XOF, XAF, GMD, SLE, GNF, NGN, GHS, MRU, CDF, KES, TZS, UGX, ETB, RWF, BIF, MUR, MGA, SCR, MAD, DZD, TND, EGP, ZAR, BWP, NAD, MZN, ZMW, EUR, USD, GBP, CAD, CHF, JPY, CNY, AED and SAR.

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
- Fawaz exchange-rate dataset
- Frankfurter fallback
- OpenStreetMap / Overpass for nearby financial services

## Development

```bash
git clone https://github.com/njaga/currency-converter.git
cd currency-converter
npm install
npm run dev
```

Optional server-side rate fallback:

```env
EXCHANGE_RATE_API_KEY=your_server_only_key
NEXT_PUBLIC_SITE_URL=https://your-domain.example
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
