# Kiwango V1 — Release Candidate Checklist

This branch is the stabilization pass for Kiwango V1. Do not add a new product module unless it fixes a release blocker.

## P0 — Release blockers

- [x] `npm ci` completes from a clean checkout in GitHub Actions.
- [x] `npm run lint` completes without errors.
- [x] `npm run build` completes without errors.
- [x] Production smoke test starts `next start` and validates `/`, `/app` and `/mentions-legales`.
- [x] Current branch does not contain the exposed Google Maps key; env files are ignored except templates.
- [ ] Upgrade production dependencies so `npm audit --omit=dev --audit-level=high` has no high/critical findings. Current blocker: legacy Next.js 14.2.14 dependency tree.
- [ ] Converter works for XOF, XAF, GMD, SLE, GHS, NGN, USD, EUR and GBP through manual/automated conversion tests.
- [ ] Swap currencies and quick conversions remain correct.
- [x] Rate freshness/source UI distinguishes unavailable, fixed parity, cached/stale and current data.
- [ ] Country directory handles API success, timeout and full global dataset correctly.
- [x] Missing country-directory key returns a controlled 503 response rather than crashing the app.
- [ ] Country shortcut opens `/app?tab=travel&country=XX` and selects the correct destination in browser QA.
- [ ] Countries sharing XOF/XAF remain distinct destinations in browser QA.
- [ ] Travel Pack never reports “ready offline” when synchronization failed.
- [ ] Multiple prepared destinations can coexist without overwriting each other.
- [ ] Offline navigation to `/app` works after one successful online visit on a real browser/device.
- [x] API routes are excluded from generic service-worker caching.
- [ ] Rate Check, fees, Budget, Cash Wallet, calculator, ATM, alerts, Scan & Convert and Field Rates have verified empty/error states.
- [ ] Google Places failure falls back cleanly to OpenStreetMap in integration QA.
- [x] Affiliate redirect only accepts known services and valid HTTP/HTTPS partner URLs.
- [x] Affiliate route keeps partner secrets/templates server-side.
- [x] FR and EN are the only maintained language choices exposed by the app.
- [x] Unused `/api/hello` starter endpoint removed.

## P1 — Mobile / UX

Test at 320, 375, 390, 430, 768, 1024, 1440 and 1920 px.

- [ ] No horizontal document scroll on any main tab.
- [ ] Floating header remains usable while scrolling.
- [ ] Language and country dropdowns stay inside the viewport and above surrounding content.
- [ ] Mobile dock does not cover actions/content.
- [ ] Safe-area spacing is correct in standalone iOS mode.
- [ ] Inputs remain visible when the mobile keyboard opens.
- [ ] Long currency/country names do not break cards.
- [ ] Large converted values do not overflow.
- [ ] Loading, empty, error and offline states have consistent visual treatment.
- [ ] Focus states are visible for keyboard users.
- [ ] Motion respects `prefers-reduced-motion`.

## P1 — PWA

- [x] App manifest starts installed Kiwango at `/app`.
- [x] Manifest shortcuts target real `/app?tab=...` values.
- [x] Service worker uses network-first navigation and offline app fallback.
- [x] API routes are excluded from generic service-worker caching.
- [ ] Add production 192×192 and 512×512 PNG icons.
- [ ] Add dedicated maskable icon with safe-zone artwork.
- [ ] Add iOS touch icon PNG.
- [ ] Test install on Chrome Android, Chrome desktop and Safari iOS Add to Home Screen.
- [ ] Test service-worker upgrade from the previous cache version.
- [ ] Run Lighthouse PWA/performance/accessibility checks on production build.

## P1 — Data integrity

- [x] Client has Fawaz primary + backup and Frankfurter before server fallback.
- [x] Server fallback can use ExchangeRate-API, then CurrencyAPI when configured.
- [ ] Exercise every configured provider independently with real credentials.
- [ ] Fixed EUR/XOF and EUR/XAF parity remains exact in automated conversion tests.
- [ ] Unsupported currency returns a controlled state instead of a fabricated rate.
- [ ] Historical charts never interpolate fabricated market observations.
- [x] Cached rates display synchronization time and stale warnings.
- [ ] Stale Travel Packs clearly warn the traveler before relying on old data.
- [ ] Multi-currency countries expose the available currencies instead of silently hiding them.

## P1 — Tools

- [ ] Rate Check supports offered-rate and amount-received workflows.
- [ ] Fee presets and custom fixed/percentage fees produce correct net amounts.
- [ ] Budget categories, additions, deletions and remaining balance persist locally.
- [ ] Cash Wallet reversible transactions restore the correct balance.
- [ ] Calculator safely rejects unsupported expressions.
- [ ] ATM estimator distinguishes requested cash, ATM fee and bank fee.
- [ ] Alerts support above/below thresholds and deletion.
- [ ] Scan & Convert has an honest manual fallback when OCR is unavailable.
- [ ] Field Rates can be added/deleted and compare correctly to reference rate.
- [ ] 7/30/90 day insights gracefully handle incomplete historical data.

## P2 — SEO / acquisition

- [ ] Generate indexable destination pages with stable slugs.
- [ ] Generate currency landing pages only where they provide unique useful content.
- [ ] Dynamic sitemap contains only canonical public pages.
- [ ] Add FR/EN hreflang alternates.
- [ ] Add destination-specific title, description and Open Graph metadata.
- [ ] Add appropriate Schema.org structured data.
- [ ] Prevent `/app?tab=...` variants from creating duplicate indexed pages.

## P2 — Monetization / analytics

- [ ] Configure real affiliate templates only from server environment variables.
- [ ] Validate each partner permits the intended traffic/source/country.
- [ ] Track outbound affiliate click by service and destination without storing sensitive traveler data.
- [ ] Add privacy-friendly product analytics for destination search, Travel Pack preparation and tool usage.
- [ ] Add error monitoring for client runtime and server API failures.

## Release definition

Kiwango V1 is releasable when every P0 item is complete and no known P1 issue can cause incorrect money information, lost local travel data, broken offline access, unusable mobile navigation or exposed secrets.
