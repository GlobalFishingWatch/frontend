---
name: deck-loaders-parsers-run-in-prebuilt-workers
description: Editing a libs/deck-loaders parser has no effect in dev until the worker bundles are rebuilt and copied to apps/platform/public/workers
---

# deck-loaders parsers run from a prebuilt worker, not from src

Every `libs/deck-loaders` loader (`VesselEventsLoader`, the fourwings and user-track loaders) is
declared with `worker: true` and a `workerUrl` pointing at
`${PATH_BASENAME}workers/<name>-worker.js`. That file is a **bundle**, produced by
`libs/deck-loaders/scripts/build-workers.mjs` into `libs/deck-loaders/dist/workers/` and copied
into `apps/platform/public/workers/` by the app's `prepare-loaders` target.

So editing e.g. `src/vessels/lib/parse-events.ts` and reloading changes **nothing**: loaders.gl
still parses in the old worker bundle. The [[platform-dist-workspace-link]] `development` export
condition does not help here — it makes Vite serve lib _source_ to the app, but the worker is
fetched over HTTP as a static asset, so it never goes through Vite's module graph at all.

**Why:** the symptom is very misleading. The app is running your new code everywhere _except_
inside the parser, so anything derived from the parsed data downstream (a deck layer accessor
reading a raw API field) picks up your change immediately while anything the parser itself writes
(`props.color`, computed attributes) stays stale. It reads as a data problem, not a build problem.
Cost a debugging round-trip on 2026-08-28 adding day/night colors to longline events: the map dots
recolored (layer accessor) but the timebar stayed white (parser-written `props.color`).

**How to apply:** after touching anything under `libs/deck-loaders/src/**/lib/parse-*.ts` or
anything those files import:

```
pnpm nx run deck-loaders:dist:workers
pnpm nx run platform:prepare-loaders
```

Then **hard-reload the browser** — the worker script is cached like any static asset.

Verify the bundle actually carries the change rather than trusting the task:

```
grep -c '<some new identifier or literal>' apps/platform/public/workers/vessel-events-worker.js
```

Note `dist:workers` is deliberately not named `build:workers` — see [[lib-build-target-name]].
`pnpm nx start platform` runs both targets on startup, so a full dev-server restart also fixes it;
the trap is only hitting save and expecting HMR.
