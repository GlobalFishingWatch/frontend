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

Removing it from `ignoredDependencies` would **not** buy back missing-dependency detection:
`missingDeps` is filtered out of `expectedDependencyNames`, which the same gate already
emptied. The rule is structurally blind to it in both directions.

**pnpm is the real guard, and it is loud.** Verified 2026-08-07: an undeclared
`@platform/config` import in `libs/data-transforms` fails `nx typecheck data-transforms` with
`TS2307: Cannot find module '@platform/config'`, because pnpm only symlinks declared
`workspace:` deps into `libs/<lib>/node_modules/` ([[app-dependency-catalog]]). A lib that
forgets the manifest entry breaks at typecheck, not in production.

`dependency-checks` never runs on `libs/skills`

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

## The rule only ever reads a _cached_ project graph

`@nx/eslint-plugin` calls `readProjectGraph()` — it never computes one. Wipe the cache
(`nx reset`) and every package.json lint emits
`No cached ProjectGraph is available. The rule will be skipped.`, so run manifest lint through
`pnpm nx lint <project>` (which builds the graph) rather than raw `npx eslint --fix` or an IDE
quick-fix.

## A target `outputs` entry naming a source directory erases it from the file map

This is what actually caused `qs` to be deleted from `dataviews-client` on 2026-08-07 — not a
stale cache, which is what it looked like at first. `bundle-url-workspace` declared

```json
"outputs": ["{workspaceRoot}/libs/dataviews-client/src/url-workspace"]
```

Nx excludes a target's declared outputs from the project file map, so all five tracked files in
that directory vanished from `projectFileMap['dataviews-client']` — including
`url-workspace.ts`, the only importer of `qs`. `findNpmDependencies` then legitimately reported
`qs` unused and `--fix` removed it. The intermittency (it sometimes worked) came from which code
path last rebuilt the map.

Fixed by narrowing `outputs` to the single emitted artifact,
`.../src/url-workspace/url-workspace.js` — which is also exactly what
`libs/dataviews-client/.gitignore` lists. **`outputs` must name generated artifacts, never a
directory that also holds source.** Verify with:

```js
readProjectGraph('probe').projectFileMap['<project>'].filter((f) => f.file.includes('<dir>'))
```

If a file you can see on disk and in `git ls-files` is absent there, check every target's
`outputs` before blaming the cache.

## Manifests nested in a source tree get attributed to the parent project

`libs/dataviews-client/src/url-workspace/package.json` (the standalone BigQuery UDF bundle) is
not an Nx project. The rule's `findProject` walks up to `dataviews-client` and lints that file
**as** the lib's manifest, so it reported the lib's whole dependency list as missing and `--fix`
copied all 11 entries in at exact versions. `.nxignore` keeps Nx out but eslint does not read
it, so `packageJsonDependencyChecksConfig` in `linting/nx.js` carries
`ignores: ['**/url-workspace/package.json']`. The leading `**/` is load-bearing: the shared
config is consumed both from the root `eslint.config.js` and from
`libs/dataviews-client/eslint.config.js`, and eslint resolves `ignores` against the base path of
whichever config is running — a workspace-root-relative path silently fails under `nx lint`.

See [[platform-dist-workspace-link]] for why apps resolve libs through `dist` in the first
place, and [[app-dependency-catalog]] for how app versions are pinned.
