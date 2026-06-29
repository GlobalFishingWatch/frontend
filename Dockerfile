FROM node:24-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates procps && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NX_DAEMON=false
ENV NX_PARALLEL=1
ENV NX_ISOLATE_PLUGINS=false
ENV CI=true

# Copy only the manifests pnpm needs to resolve the workspace graph.
# pnpm-workspace.yaml declares linting and apps/fishing-map as workspace
# packages, so their package.json files must be present before install.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY linting/package.json linting/
COPY apps/fishing-map/package.json apps/fishing-map/
RUN corepack enable && corepack install

# Install dependencies in a dedicated layer, before copying source.
# This layer is only invalidated when the lockfile or a workspace
# package.json changes — not on every source edit.
# ARGs are declared below so different APP_NAME values across parallel
# matrix jobs do not bust this shared cache entry.
RUN pnpm install --frozen-lockfile

# All possible build args — each app uses what it needs, unused ones are empty
ARG APP_NAME
ARG API_GATEWAY
ARG VITE_API_GATEWAY
ARG VITE_API_VERSION
ARG VITE_GOOGLE_MEASUREMENT_ID
ARG VITE_GOOGLE_TAG_MANAGER_ID
ARG PUBLIC_URL
ARG VITE_USE_LOCAL_DATASETS
ARG VITE_USE_LOCAL_DATAVIEWS
ARG VITE_WORKSPACE_ENV
ARG VITE_REPORT_DAYS_LIMIT
ARG VITE_RANDOM_FOREST_ENABLED
ARG SENTRY_AUTH_TOKEN
ARG COMMIT_SHA

ENV API_GATEWAY=$API_GATEWAY \
    VITE_API_GATEWAY=$VITE_API_GATEWAY \
    VITE_API_VERSION=$VITE_API_VERSION \
    VITE_GOOGLE_MEASUREMENT_ID=$VITE_GOOGLE_MEASUREMENT_ID \
    VITE_GOOGLE_TAG_MANAGER_ID=$VITE_GOOGLE_TAG_MANAGER_ID \
    PUBLIC_URL=$PUBLIC_URL \
    VITE_USE_LOCAL_DATASETS=$VITE_USE_LOCAL_DATASETS \
    VITE_USE_LOCAL_DATAVIEWS=$VITE_USE_LOCAL_DATAVIEWS \
    VITE_WORKSPACE_ENV=$VITE_WORKSPACE_ENV \
    VITE_REPORT_DAYS_LIMIT=$VITE_REPORT_DAYS_LIMIT \
    VITE_RANDOM_FOREST_ENABLED=$VITE_RANDOM_FOREST_ENABLED \
    SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN \
    COMMIT_SHA=$COMMIT_SHA

COPY . .
RUN NODE_OPTIONS='--max-old-space-size=6144' pnpm exec nx run ${APP_NAME}:build


# ── Production: nginx (api-portal, data-download-portal, image-labeler, track-labeler, user-groups-admin) ──
FROM nginx:stable-alpine AS production-nginx

RUN apk update && apk upgrade

ARG APP_NAME
COPY --from=builder /app/dist/apps/${APP_NAME}/nginx.conf           /etc/nginx/nginx.template
COPY --from=builder /app/dist/apps/${APP_NAME}/config/entrypoint.sh ./entrypoint.sh
COPY --from=builder /app/dist/apps/${APP_NAME}/                     /usr/share/nginx/www/

ENTRYPOINT ["./entrypoint.sh"]


# ── Production: node (fishing-map and future SSR apps) ───────────────────────
FROM node:24-alpine AS production-node

RUN apk update && apk upgrade

WORKDIR /app

ARG APP_NAME=fishing-map
COPY --from=builder /app/apps/${APP_NAME}/.output ./output

CMD ["node", "--import", "./output/server/instrument.server.mjs", "--max-http-header-size=40000", "output/server/index.mjs"]
