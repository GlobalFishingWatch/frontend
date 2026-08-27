---
name: browser-testing-uses-platform-e2e
description: All browser/Playwright testing in this repo must go through apps/platform-e2e, never an ad-hoc Playwright setup
---

# Browser testing always starts from `apps/platform-e2e`

Any time browser automation is needed — verifying a UI change, driving the map, taking
screenshots, reproducing a bug in a real browser — use the **`platform-e2e`** project as the
base. Do not stand up a standalone Playwright script, a new config, a throwaway `npx playwright`
invocation, or an MCP browser session pointed at a hand-rolled URL.

**Why:** `platform-e2e` already carries the whole setup, and re-deriving it wastes time and gets
details wrong:

- `playwright.config.mts` — `baseURL` is **origin only** (`http://localhost:3003`); tests navigate
  via `src/paths.ts` (`appPath()` / `MAP_PATH`) because absolute paths like `/platform/map`
  replace the URL path, so `/platform` cannot live in `baseURL`.
- `httpCredentials` is set **only** when `BASIC_AUTH_USER` exists. Setting it unconditionally makes
  the context credentialed and breaks the app's cross-origin API-gateway requests and the
  guest/login flow against a local dev server. This trap is already handled here.
- Browser matrix is env-driven (`PLAYWRIGHT_BROWSER=all|chromium,firefox|…`), 3-minute test
  timeout, 30s expect timeout, trace/screenshot/video on failure, `maxDiffPixelRatio: 0.01`,
  `snapshotPathTemplate` → `__screenshots__/`.
- `test:local` has `dependsOn: platform:start`, so Nx boots the dev server (port 3003) for you.
- Existing helpers to reuse instead of rewriting: `src/helpers/hydration.ts` (SSR hydration wait),
  `src/helpers/map.ts`, `src/helpers/modals.ts`, `src/helpers/timeouts.ts`,
  `src/pages/LoginPage.ts`, `src/tags.ts` (`@smoke` / `@extended`).
- `.env` next to the config supplies base URL and basic-auth secrets.

Test files must match `*.e2e.spec.(ts|tsx)` under `src/` or Playwright ignores them.

**How to apply:**

| Need                       | Command                                                    |
| -------------------------- | ---------------------------------------------------------- |
| Full run (server running)  | `pnpm nx test platform-e2e`                                |
| Run + auto-start dev server| `pnpm nx test:local platform-e2e`                          |
| Headed / UI mode           | `pnpm nx test:local:headed platform-e2e` (or `:ui`)        |
| One spec                   | add `--grep "<name>"`                                      |
| Screenshots                | `pnpm nx screenshots platform-e2e` (`:update` to rebaseline)|
| Screenshot report          | `pnpm nx screenshots:report platform-e2e`                  |

New browser check → add a spec under `apps/platform-e2e/src/tests/`, reuse the fixtures and
helpers, tag it. Ad-hoc interactive poking (Playwright MCP) is fine, but point it at the dev server
on 3003 and reuse `src/paths.ts` URL shapes; anything worth keeping becomes a spec here.

Vitest is not an alternative — see [[platform-testing]].
