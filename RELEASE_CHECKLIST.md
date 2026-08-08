# Kiwango V1 — Release Candidate Checklist

This branch is the stabilization pass for Kiwango V1. Product scope is frozen: only reliability, privacy, security, accessibility, performance, SEO, PWA and release-readiness changes should enter this branch.

## P0 — Release blockers

- [x] `npm ci` completes from a clean checkout in GitHub Actions.
- [x] `npm run lint` completes without errors.
- [x] `npm run build` completes without errors.
- [x] Production smoke tests start `next start` and validate homepage, app, legal page, destination SEO, sitemap, robots, PWA assets and critical API behavior.
- [x] Production dependency audit blocks high/critical vulnerabilities.
- [x] Next.js 16.3.0 / React 19 security migration validated through lint, Turbopack build and production smoke tests.
- [x] No real API secret is committed; `.env`/`.env.local` are ignored and `.env.example` contains placeholders only.
- [x] Automated critical conversion matrix covers XOF, XAF, GMD, SLE, GHS, NGN, USD, EUR and GBP.
- [x] Automated swap/reciprocity tests cover critical cross-currency pairs.
- [x] Unsupported/missing currency data returns `null` instead of a fabricated rate.
- [x] EUR/XOF and EUR/XAF fixed parity remains exact in automated tests.
- [x] Country directory has authenticated, public and local fallback paths.
- [x] Missing/upstream country directory failures return controlled states rather than crashing the app.
- [x] Travel Pack persistence rejects invalid/incomplete packs and IndexedDB write failures.
- [x] Prepared trips are stored by country and invalid records are filtered when reloaded.
- [x] Multi-currency destinations expose a currency selector.
- [x] Travel Packs classify freshness and warn after 24h / 72h while staying usable offline.
- [x] API routes are excluded from generic service-worker caching.
- [x] Affiliate redirects only accept known services and valid HTTP/HTTPS partner URLs.
- [x] Affiliate templates/identifiers remain server-side.
- [x] FR and EN are the only maintained language choices exposed by the app.
- [x] Client runtime errors have an application error boundary and sanitized reporting path.
- [x] Rate-provider, country-directory and nearby-finance outages have sanitized server monitoring hooks.
- [x] Monitoring/telemetry endpoints are covered by production smoke tests.

## P1 — Browser / mobile QA still requiring real devices

Test at 320, 375, 390, 430, 768, 1024, 1440 and 1920 px.

- [ ] No horizontal document scroll on every main tab on real browsers.
- [ ] Floating header remains usable during long scroll sessions.
- [ ] Language and country dropdowns remain inside the viewport.
- [ ] Mobile dock never covers the final interactive control.
- [ ] Safe-area spacing verified in standalone iOS mode.
- [ ] Inputs remain visible when iOS/Android virtual keyboards open.
- [ ] Long country/currency names verified visually.
- [ ] Very large converted values verified visually.
- [ ] Focus states verified with keyboard navigation.
- [x] CSS includes `prefers-reduced-motion` handling and mobile release guards.
- [x] Mobile inputs avoid iOS auto-zoom and the currency modal uses dynamic viewport units.

## P1 — PWA

- [x] Manifest starts installed Kiwango at `/app`.
- [x] Manifest shortcuts target real app tabs.
- [x] Service worker uses network-first navigation and offline app fallback.
- [x] API routes are excluded from generic service-worker caching.
- [x] New service-worker versions wait and surface an explicit “Mettre à jour” action.
- [x] Dedicated maskable SVG uses safe-zone artwork.
- [x] iOS installation guidance explains Share → Add to Home Screen when no native prompt exists.
- [ ] Add production 192×192 PNG icon.
- [ ] Add production 512×512 PNG icon.
- [ ] Add production maskable PNG icon.
- [ ] Add iOS Apple Touch Icon PNG.
- [ ] Test installation on Chrome Android.
- [ ] Test installation on Chrome desktop.
- [ ] Test Safari iOS Add to Home Screen.
- [ ] Test service-worker upgrade on an already-installed production PWA.
- [ ] Run Lighthouse PWA/performance/accessibility checks against the production deployment.

## P1 — Data integrity / providers

- [x] Client rate layer has primary + backup provider paths and IndexedDB cache fallback.
- [x] Server fallback supports ExchangeRate-API then CurrencyAPI when configured.
- [x] Cached rates expose synchronization time and stale warnings.
- [x] Historical Insights display an unavailable state rather than simulate data.
- [x] Historical chart does not invent a line when there are insufficient real points.
- [ ] Exercise ExchangeRate-API independently with production credentials.
- [ ] Exercise CurrencyAPI independently with production credentials.
- [ ] Exercise REST Countries authenticated source with production credentials.
- [ ] Exercise Google Places with the restricted production key.
- [ ] Confirm Google Places → OpenStreetMap fallback on a real integration failure.

## P1 — Financial tools

Automated lint/build and guarded input logic are green. Final manual functional QA is still required.

- [ ] Rate Check: offered-rate and amount-received workflows manually verified.
- [ ] Fees: percentage, fixed and preset fees manually verified.
- [ ] Budget: add/delete/category/persistence manually verified.
- [ ] Cash Wallet: reversible additions/expenses manually verified.
- [ ] Calculator: valid expressions and rejected invalid/division-by-zero cases manually verified.
- [ ] ATM: cash requested, ATM fee and bank fee manually verified.
- [ ] Alerts: above/below thresholds and deletion manually verified.
- [ ] Scan & Convert: native OCR path and honest manual fallback manually verified.
- [ ] Field Rates: add/delete/reference comparison manually verified.
- [ ] Insights: 7/30/90-day incomplete/complete series manually verified.

## P2 — SEO / acquisition

- [x] Indexable destination pages use stable country slugs under `/voyage/[destination]`.
- [x] Destination pages expose country/currency preparation content and link into the real Travel Pack workspace.
- [x] Dynamic sitemap includes canonical public destination pages.
- [x] Dynamic `robots.txt` uses `NEXT_PUBLIC_SITE_URL`.
- [x] Destination-specific title, description, canonical and Open Graph metadata implemented.
- [x] Destination structured data implemented.
- [x] Popular footer destinations link to public destination guides for internal linking.
- [x] Legacy XOF Converter domain fallback removed from homepage/app metadata.
- [ ] Complete FR/EN public-route strategy and hreflang alternates before claiming localized SEO pages.
- [ ] Add currency landing pages only if each page can provide genuinely unique useful content.

## P2 — Privacy analytics / monitoring / monetization

- [x] Optional Umami integration is environment-driven; no analytics script loads without configuration.
- [x] Analytics excludes URL query/hash values, respects Do Not Track and enables performance metrics.
- [x] Product events are allowlisted and exclude free-form financial/user data.
- [x] Destination selection, Travel Pack preparation/refresh, tool opening and affiliate clicks have privacy-safe event hooks.
- [x] Client error telemetry strips query parameters and limits payload size/fields.
- [x] Server monitoring never intentionally sends coordinates, amounts, API keys, IP addresses or user identifiers.
- [x] Monitoring endpoint/token remain server-only environment variables.
- [ ] Create/configure the production Umami website ID and script URL.
- [ ] Configure a production monitoring webhook/log sink and verify alert delivery.
- [ ] Configure real affiliate templates from approved partner programs.
- [ ] Verify each affiliate partner permits Kiwango’s traffic source and target markets.

## Release-day configuration

Required/recommended production variables:

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

## Release definition

Kiwango V1 is code-ready when the CI is green and no known P0 issue remains. Public release still requires the unchecked real-device/provider checks that can cause incorrect money information, broken offline access, unusable mobile navigation or missing production observability.
