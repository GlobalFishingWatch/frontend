# fishing-map

Global Fishing Watch interactive map application.

## Development

Use `start` for daily work (Vite dev server with hot reload):

```bash
pnpm nx run fishing-map:start
```

Runs on [http://localhost:3003](http://localhost:3003). Automatically prepares loaders and starts i18n watchers before serving.

Use `serve` only when you need to test the production SSR build locally. It runs a full build first, then starts the Nitro server from `.output/server/index.mjs`:

```bash
pnpm nx serve fishing-map
```

If a server is left running after Ctrl+C, kill it with:

```bash
pkill -f '.output/server/index.mjs' || true
```

## Build

```bash
pnpm nx run fishing-map:build
```

Output goes to `dist/apps/fishing-map`.

## Docker

Two-stage build. First build a local dependencies image, then build the app image.

> **Note:** [Dockerfile](Dockerfile) defaults to the remote base image (CI/production). For local builds, swap line 1:
>
> ```dockerfile
> # FROM us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/dependencies:latest AS builder
> FROM dependencies:local AS builder
> ```

```bash
# Step 1 — build base dependencies image
docker build --target deps -t dependencies:local .

# Step 2 — build app image
docker build -f apps/fishing-map/Dockerfile \
  --build-arg NEXT_PUBLIC_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org \
  --build-arg COMMIT_SHA=local-test \
  -t fishing-map:local .
```

### Run

```bash
docker run -p 3003:3000 fishing-map:local
```

