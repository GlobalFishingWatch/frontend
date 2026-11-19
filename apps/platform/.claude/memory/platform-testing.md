---
name: platform-testing
description: How to verify platform changes — the integration specs run offline against recorded API responses; which specs are excluded and what each check catches
---

# Verifying platform changes

As of 2026-11-19 the vitest integration specs in `apps/platform/test/integration` run **offline**: a
stub on `fetch` answers every API request from handlers or recorded responses, so a run needs no
credentials and no gateway ([[integration-network-stub]]). They are worth running for UI and
data-flow changes. This replaced the 2026-08 state, when 54/54 specs failed against the live API and
the rule was "never run vitest here".

**Why:** the suite used to log in as a real user and assert on production data, so a red run said
nothing about your change. Replayed responses make it deterministic.

**How to apply:**

- Integration specs, Chromium only:
  `TEST_CHROME_ONLY=true pnpm nx test platform -- test/integration/<Spec>.spec.tsx`.
  Needs Node ≥ 24 — under Node 22 the Nx project graph fails to load.
- Specs in `LEGACY_SPECS` (`vitest.config.ts`) never run, CI included. As of 2026-11-19 only
  `HelpHub` is listed: it needs `VITE_PLATFORM_MODE=true`, and the config pins it to `false`.
- A spec that fails with `Unmocked network requests` needs a recording or a handler, not a retry.
  See `apps/platform/test/README.md` for re-recording.
- Anything whose value is the real backend (login, grants, private datasets, writes) belongs in
  `apps/platform-e2e`: `pnpm nx test platform-e2e` ([[browser-testing-uses-platform-e2e]]).
- Typecheck and lint still apply: `pnpm nx typecheck platform`, `pnpm nx lint platform`.
- Real SSR: `pnpm nx run platform:build:app`, then `node apps/platform/scripts/serve-ssr.mjs` and
  curl `http://localhost:3000/platform/...`.
- CI runs the split `integration-ci` tasks only when the repository variable
  `PLATFORM_INTEGRATION_TESTS` is `true` ([[split-e2e-directives]]).

The unit-level vitest specs next to the code were not part of this work; check one before trusting
a red result from it.

See [[platform-dist-workspace-link]] for why a typecheck can fail on correct code.
