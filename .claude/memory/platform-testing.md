---
name: platform-testing
description: How to verify platform changes — the vitest suites are broken, don't run them
---

# Don't validate platform changes with vitest

The vitest suites in `apps/platform` are broken — do not run them to validate a change, and do not run them at all unless asked. (2026-08-05: integration specs were 54/54 failing. The app was called `fishing-map` when this was first hit, in 2026-06.)

**Why:** the suites are in a known-broken state, so a red run tells you nothing about your change.

**How to apply:** verify another way.

- Typecheck and lint: `pnpm nx typecheck platform`, `pnpm nx lint platform`
- Playwright e2e: `pnpm nx test platform-e2e` (or `--grep` a single spec)
- Real SSR: `pnpm nx run platform:build:app`, then `node apps/platform/scripts/serve-ssr.mjs` and curl `http://localhost:3000/platform/...`

See [[platform-dist-workspace-link]] for why a typecheck can fail on correct code.
