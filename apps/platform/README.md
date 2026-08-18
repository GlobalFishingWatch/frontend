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
pnpm nx run platform:check-store-graph  # guards lazy store/slice wiring
pnpm nx run platform:i18n               # extract keys + regenerate types
```

See [i18n.md](apps/platform/i18n.md) for the translation workflow and
[analytics-events-inventory.md](apps/platform/analytics-events-inventory.md) for the GA event
inventory.

## Docker

Two-stage build. First build a local dependencies image, then build the app image.

> **Note:** [Dockerfile](Dockerfile) defaults to the remote base image (CI/production). For local
> builds, swap line 1:
>
> ```dockerfile
> # FROM us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/dependencies:latest AS builder
> FROM dependencies:local AS builder
> ```

```bash
# Step 1 — build base dependencies image
docker build --target deps -t dependencies:local .

# Step 2 — build app image
docker build -f apps/platform/Dockerfile \
  --build-arg VITE_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org \
  --build-arg VITE_WORKSPACE_ENV=development \
  --build-arg COMMIT_SHA=local-test \
  -t platform:local .
```

Other build args the Dockerfile accepts: `VITE_API_VERSION`, `VITE_GOOGLE_MEASUREMENT_ID`,
`VITE_GOOGLE_TAG_MANAGER_ID`, `VITE_USE_LOCAL_DATASETS`, `VITE_USE_LOCAL_DATAVIEWS`,
`VITE_REPORT_DAYS_LIMIT`, `VITE_REALTIME_ENABLED`, `VITE_CHATBOT_ENABLED`, `SENTRY_AUTH_TOKEN`.

### Run

```bash
docker run -p 3003:3000 platform:local
```
