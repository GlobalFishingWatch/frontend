---
name: app-dependency-catalog
description: apps/* declare only `workspace:` deps; npm versions live in the root manifest, and the lint rule is relaxed for apps to match
---

# App manifests list workspace deps only

Every `apps/*/package.json` declares **only** `workspace:^` / `workspace:*` entries. No npm
packages. `react`, `lodash`, `luxon` and the rest are declared once in the root
`package.json` and resolve because Node walks up from `apps/<app>/…` to the root
`node_modules/`.

`libs/*` are the opposite and must stay that way: they are published to npm, so they declare
every dependency with their own `"4.x"`-style range.

**Why:** the `workspace:` entries are load-bearing — they are what makes pnpm create
`apps/<app>/node_modules/@globalfishingwatch/*` symlinks. The npm entries were not: they only
duplicated root, and a per-app range let pnpm resolve each spec independently, which can
install a second copy of React and break hooks. One declaration in root is a stronger
guarantee than seven agreeing ranges.

A pnpm `catalog:` block was added on 2026-08-07 to solve the same drift problem and
**removed the same day** in favour of this simpler shape. Don't reintroduce it without a
reason that root-only declaration can't cover.

**How to apply:**

- Adding an npm dep to an app: put it in the **root** `package.json`. Nothing goes in the app
  manifest.
- Adding a lib dep to an app: `"@globalfishingwatch/x": "workspace:^"` in the app manifest,
  then `pnpm install` to create the symlink. Skipping this fails loudly — root
  `node_modules/@globalfishingwatch/` holds only `auth-middleware` and `linting`, so an
  undeclared lib import is an unresolved module, not a silent fallback.
- Two former platform-only deps now live in root: `@fontsource/roboto` `^5.3.0` and
  `@sentry/tanstackstart-react` `^10.69.0`.

## The lint rule is scoped, not disabled

`eslint.config.js` and `@globalfishingwatch/linting/nx` share one `dependencyChecksOptions`
object. `appsPackageJsonDependencyChecksConfig` (root) and `appPackageJsonConfig` (nested app
eslint configs) set `checkMissingDependencies: false` — an undeclared external is expected
there, not a defect. Apps still get `checkObsoleteDependencies`, which is what catches a
`workspace:` entry for a lib the app no longer imports.

`eslint-package-json` (via `packageJsonConfig` in `@globalfishingwatch/linting`) also lints
package.json under `language: json/json`. `@nx/dependency-checks` (via
`@globalfishingwatch/linting/nx`) is wrapped with `eslint-json-compat-utils` so both can run
on the same manifests. Never run `eslint --fix` on package.json with
`checkMissingDependencies: true` for apps — it will dump root npm deps into app manifests.

See [[lib-build-target-name]] for why the rule needs every lib to expose a `build` target,
and [[platform-dist-workspace-link]] for how the symlinks resolve to lib source.
