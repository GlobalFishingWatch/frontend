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
- Specs in `LEGACY_SPECS` (`vitest.config.ts`) never run, CI included. As of 2026-11-19 two are
  listed: `HelpHub` (needs `VITE_PLATFORM_MODE=true`; the config pins it to `false`) and
  `UserDatasets` (every test still `it.skip`). Three other tests are `it.skip` with the reason in a
  comment: they need the real backend and belong in platform-e2e.
- A spec that fails with `Unmocked network requests` needs a recording or a handler, not a retry.
  See `apps/platform/test/README.md` for re-recording.
- Anything whose value is the real backend (login, grants, private datasets, writes) belongs in
  `apps/platform-e2e`: `pnpm nx test platform-e2e` ([[browser-testing-uses-platform-e2e]]).
- Typecheck and lint still apply: `pnpm nx typecheck platform`, `pnpm nx lint platform`.
- Real SSR: `pnpm nx run platform:build:app`, then `node apps/platform/scripts/serve-ssr.mjs` and
  curl `http://localhost:3000/platform/...`.
- CI runs the split `integration-ci` tasks only when the repository variable
  `PLATFORM_INTEGRATION_TESTS` is `true` ([[split-e2e-directives]]).

## Component specs next to the code use `renderComponent`, not `render`

`test/appTestUtils.tsx` has two helpers. `render()` boots the whole app, which loads a workspace over
the network, so it needs recorded responses — integration specs only. A component spec
(`features/**/X.test.tsx`) uses `renderComponent(<X />, { store })`: Redux, Jotai and a one-route
memory router, no network.

**Why:** on 2026-11-19 `UserSection.test.tsx` used `render()` and failed on an unrecorded
`/datasets?logged-user=true` request for a workspace it never looked at, and `Timebar.spec.tsx`
mounted with only a Redux Provider and crashed once `useFitAreaInViewport` started calling
`useRouterState` (`37432f092c`). A route's error boundary would hide that kind of crash, so
`renderComponent` re-reports caught errors to the window, where vitest fails the run.

**How to apply:** a component that "needs a RouterProvider" gets `renderComponent`, not the full
app. Other component specs next to the code were not reviewed as of 2026-11-19; check one before
trusting a red result from it.

See [[platform-dist-workspace-link]] for why a typecheck can fail on correct code.
