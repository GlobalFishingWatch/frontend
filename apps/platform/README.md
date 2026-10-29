# platform

Global Fishing Watch interactive map application. TanStack Start (SSR) + Vite + Nitro.

## Development

Use `start` for daily work (Vite dev server with hot reload):

```bash
pnpm nx run platform:start
```

Runs on [http://localhost:3003/platform](http://localhost:3003/platform)

Need HTTPS (OAuth, cookies on `local.globalfishingwatch.org`):

```bash
pnpm nx run platform:start-proxy   # start + local-ssl-proxy 443 → 3003
```

Use `serve` only to test the production SSR build locally. It runs `build:app` first, then
`scripts/serve-ssr.mjs`, which starts the Nitro server from `.output/server/index.mjs`:

```bash
pnpm nx serve platform
```

`serve-ssr.mjs` already kills a stale server on startup and on shutdown. If one survives anyway:

```bash
pkill -f '.output/server/index.mjs' || true
```

## Build

```bash
pnpm nx run platform:build       # typecheck + build:app
pnpm nx run platform:build:app   # skip typecheck
```

Output goes to `apps/platform/dist` (client) and `apps/platform/.output` (Nitro server).
`build` also depends on the `i18n` target, so locale JSON and i18n types are regenerated first.

## Checks

```bash
pnpm nx run platform:typecheck          # tsc --noEmit (depends on i18n:types)
pnpm nx run platform:test               # vitest
pnpm nx run platform:test:watch
pnpm nx run platform:check-load-boundaries  # what each page may load (scripts/load-boundaries)
pnpm nx run platform:i18n               # extract keys + regenerate types
```

See [i18n.md](apps/platform/i18n.md) for the translation workflow and
[analytics-events-inventory.md](apps/platform/analytics-events-inventory.md) for the GA event
inventory.

## Docker

CI builds every app image from the root [Dockerfile](../../Dockerfile). The same command works
locally:

```bash
docker build --target production-node \
  --build-arg APP_NAME=platform \
  --build-arg VITE_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org \
  --build-arg VITE_WORKSPACE_ENV=development \
  --build-arg COMMIT_SHA=local-test \
  -t platform:local .
```

The root Dockerfile lists the other build args it accepts as `ARG` lines.

### Run

```bash
docker run -p 3003:3000 platform:local
```
