# AfriChange

**Offline-first African currency converter.**

AfriChange is a Progressive Web App designed for travelers, cross-border workers and anyone who needs to understand prices across African currencies even when connectivity becomes unreliable.

Live app: https://xof-converter.vercel.app

## Why this project exists

Currency conversion is easy when a stable internet connection is available. It becomes less trivial when arriving in another country without a local SIM card, while roaming is unavailable or while the network is intermittent.

AfriChange therefore treats offline use as a product requirement rather than an afterthought:

1. fetch verified exchange-rate data when connectivity is available;
2. normalize and validate it;
3. persist the latest successful snapshot in IndexedDB;
4. perform conversions locally;
5. clearly identify cached or stale data when offline.

The application never fabricates a historical rate or silently presents an undated static estimate as live market data.

## Supported currencies

The registry focuses on Africa and also contains major international currencies. It currently includes XOF, XAF, GMD, SLE, GNF, NGN, GHS, MRU, CDF, KES, TZS, UGX, ETB, RWF, BIF, MUR, MGA, SCR, MAD, DZD, TND, EGP, ZAR, BWP, NAD, MZN, ZMW, EUR, USD, GBP, CAD, CHF, JPY, CNY, AED and SAR.

The official EUR/XOF and EUR/XAF fixed parities are handled explicitly by the conversion engine.

## Rate architecture

```text
Online
  │
  ├── Fawaz open currency dataset
  ├── Frankfurter
  └── optional server-side ExchangeRate-API fallback
          │
          ▼
  normalization + validation
          │
          ▼
       IndexedDB
          │
          ▼
   local conversion engine

Offline
  │
  ├── latest IndexedDB snapshot
  └── official EUR/XOF/XAF fixed parity when applicable
```

API keys are never embedded in the browser bundle. If `EXCHANGE_RATE_API_KEY` is configured on the server, the browser reaches it through `/api/rates`.

## Rate freshness

AfriChange distinguishes between data states instead of using a simple online/offline flag:

- fresh cached data;
- stale cached data;
- very old cached data, shown as indicative;
- official fixed parity;
- unavailable data.

If a user opens the app offline before ever synchronizing a floating currency, AfriChange must report that the rate is unavailable instead of inventing one.

## Local data

IndexedDB stores:

- exchange-rate snapshots;
- recent conversion history;
- favorites.

Theme and language preferences may use lightweight browser preferences. No account is required for the core experience.

## PWA

The app includes a web manifest and a service worker. Static application resources are cached for offline reuse, while `/api/*` responses are deliberately excluded from the service-worker cache because rate freshness is managed explicitly by the exchange-rate layer and IndexedDB.

## Languages

The UI supports French, English, Spanish and Wolof.

## Tech stack

- Next.js (Pages Router)
- React
- Tailwind CSS
- Framer Motion
- IndexedDB
- Service Worker / PWA APIs
- Recharts for verified chart data only

## Local development

```bash
git clone https://github.com/njaga/currency-converter.git
cd currency-converter
npm install
npm run dev
```

Optional server-side fallback:

```env
EXCHANGE_RATE_API_KEY=your_server_only_key
NEXT_PUBLIC_SITE_URL=https://xof-converter.vercel.app
```

Never prefix a secret rate-provider key with `NEXT_PUBLIC_`.

## Data integrity rules

Contributions must respect these rules:

- no random or simulated market/historical data presented as real;
- no secret API key in client-side code;
- no rate without a traceable source or cached timestamp, except an official fixed parity;
- no silent substitution of stale data for live data;
- conversion logic must return `null` when the required floating rate is unavailable.

## Roadmap

- Country / travel preparation mode
- Pre-trip offline readiness check
- Better multi-country metadata for XOF and XAF monetary zones
- Verified historical provider before restoring charts/trends
- Stronger automated tests around provider normalization and stale-rate handling
- Incremental migration of large UI components toward smaller hooks/components and TypeScript

## Author

Ndiaga Ndiaye  
https://ndiagandiaye.com
