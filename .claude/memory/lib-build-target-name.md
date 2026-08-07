---
name: lib-build-target-name
description: libs/* build target is named `build` (renamed from `dist` on 2026-08-07) because @nx/dependency-checks matches one target name across the whole graph
---

# Every project's build target is named `build`

`libs/*` emit to `dist/` via a target **named `build`** (`@nx/js:tsc`). It was called `dist`
until 2026-08-07. `libs/skills` is the exception — it bundles with esbuild under `bundle` +
`types` and has no `build` target at all.

**Why:** `@nx/dependency-checks` resolves **one** build-target name from the _consumer_
project and then reuses that same string to decide whether each workspace **dependency** is a
legitimate `package.json` entry:

```js
// @nx/eslint-plugin .../rules/dependency-checks.js
const buildTarget = buildTargets.find((t) => sourceProject.data.targets?.[t]) // app -> 'build'
// @nx/js .../utils/find-npm-dependencies.js
if (workspaceDep.data.targets[buildTarget] && packageJson?.name) {
  /* counted */
}
```

Apps get `build` from `@nx/vite/plugin`. While libs were named `dist`, that lookup missed
every lib, so each `"@globalfishingwatch/x": "workspace:^"` in an app manifest was reported as
`The "@globalfishingwatch/x" package is not used by "<app>" project`. The same mismatch made
the rule silently **inert on libs** — `buildTargets.find` returned `undefined` and it
early-returned.

Adding `dist` to `buildTargets` does **not** fix this: `find()` only inspects the source
project, never the dependency. Aligning the names is the only real fix.

**How to apply:**

- New libs declare `build`, never `dist`. `dist` is the output folder, not a target.
- Cross-project deps are `"dependsOn": ["^build"]`. `^dist` no longer resolves to anything.
- `nx.json` has no `targetDefaults.dist`; `@nx/js:tsc` supplies `outputs` and the tsc options.
  Note Nx applies the _executor-key_ default (`@nx/js:tsc`) in preference to the target-name
  default (`build`), so libs do not pick up `build`'s `inputs`.
- `deck-loaders` keeps a separate `dist:workers` target — that name is about the output
  folder and is intentionally not `build:workers`.

Fallout handled in the same change: with the rule finally live on libs it produced 21 real
findings (mostly `lodash` left declared after the `es-toolkit` migration). Two traps worth
knowing —

- **`protobufjs` and `long` are not obsolete** in `api-client` / `deck-loaders` even though the
  rule says so. The only importers are the generated `*.gen.js` / `*.gen.d.ts` decoders, which
  are **gitignored**, so they are absent from Nx's project file map. Both sit in
  `ignoredDependencies` in `linting/nx.js` for this reason. Never accept `--fix`'s removal.
- Build/test-only imports (`vitest`, `vite`, `esbuild`, `sharp` in an icon-atlas script) belong
  in the root manifest. They are excluded via the rule's `ignoredFiles`, not by declaring them
  as lib dependencies.

## A build-less workspace package can never satisfy the rule

Same `workspaceDep.data.targets[buildTarget]` gate, other direction: `@platform/config` **is** an
Nx project (inferred from its `package.json`; `nx show project '@platform/config'` → root
`apps/platform/config`, targets `['lint']`), but it has no `build` target, so
`findNpmDependencies` drops it and `apps/platform/package.json` gets
`The "@platform/config" package is not used by "platform" project` even though ~20 files import
it. It is source-only on purpose ([[platform-config-package]]) — adding a `build` target to
appease the rule would break that contract. It lives in `ignoredDependencies` instead.

## `--fix` on a lib is not safe to trust blind

`ignoredFiles` makes the rule blind to tests, `scripts/**` and vite/vitest/esbuild configs, so
anything imported **only** from those reads as obsolete and `--fix` deletes it. That is correct
_only if_ the package is declared in the **root** manifest. On 2026-08-07 `nx lint
data-transforms --fix` dropped `papaparse` (imported solely from
`list-to-track-segments.test.ts`) — fine, root already had it — and the same sweep dropped
`sharp` from `deck-layers`, where the sole importer is `scripts/generate-icon-atlas.js` and
root did **not** have it. That silently uninstalled `sharp` from the lockfile and broke the
script. `sharp` `0.34.5` is now a root devDependency.

After any `--fix` on a `libs/*/package.json`, diff the removals and confirm each one either is
genuinely unused or resolves from root. Also normalize versions it writes: `--fix` copies the
exact installed version (`1.50.0`), while libs use `x` ranges (`1.x`).

See [[platform-dist-workspace-link]] for why apps resolve libs through `dist` in the first
place, and [[app-dependency-catalog]] for how app versions are pinned.
