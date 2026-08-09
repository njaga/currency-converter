# Kiwango — Next.js security upgrade plan

Kiwango V1 currently builds on Next.js 14.2.14, but the production dependency audit reports high/critical advisories affecting the current dependency tree.

The security upgrade is intentionally isolated from the V1 release-candidate branch.

Target:

- Next.js 15.5.21 (Maintenance LTS security release)
- React 19
- React DOM 19
- eslint-config-next 15.5.21

Acceptance criteria before merging the upgrade back into the release candidate:

1. `npm ci` succeeds from the generated lockfile.
2. Production dependency audit no longer reports high/critical findings caused by the old Next.js tree.
3. `npm run lint` succeeds.
4. `npm run build` succeeds.
5. Production smoke tests pass for `/`, `/app`, `/mentions-legales` and API validation paths.
6. No Pages Router runtime behavior is silently migrated to App Router.
7. PWA/service worker behavior remains unchanged.
8. Converter, Travel Pack and all local-storage/IndexedDB tools are manually smoke-tested after the automated checks.

Do not use `npm audit fix --force` on the release-candidate branch.
