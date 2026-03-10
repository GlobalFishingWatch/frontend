FROM us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/dependencies:latest AS builder

WORKDIR /app

# Install CA certificates for SSL verification (needed for Sentry source map upload)
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/* || \
    apk add --no-cache ca-certificates || \
    true

ENV NODE_ENV=production
ENV NX_DAEMON=false
ENV NX_PARALLEL=1
ENV NX_ISOLATE_PLUGINS=false
ENV CI=true

ARG VITE_API_GATEWAY
ARG VITE_API_VERSION
ARG VITE_GOOGLE_MEASUREMENT_ID
ARG VITE_GOOGLE_TAG_MANAGER_ID
ARG VITE_USE_LOCAL_DATASETS
ARG VITE_USE_LOCAL_DATAVIEWS
ARG VITE_WORKSPACE_ENV
ARG VITE_REPORT_DAYS_LIMIT
ARG VITE_PIPE_DATASET_VERSION
ARG SENTRY_AUTH_TOKEN
ARG COMMIT_SHA

ENV VITE_API_GATEWAY=$VITE_API_GATEWAY
ENV VITE_API_VERSION=$VITE_API_VERSION
ENV VITE_GOOGLE_MEASUREMENT_ID=$VITE_GOOGLE_MEASUREMENT_ID
ENV VITE_GOOGLE_TAG_MANAGER_ID=$VITE_GOOGLE_TAG_MANAGER_ID
ENV VITE_USE_LOCAL_DATASETS=$VITE_USE_LOCAL_DATASETS
ENV VITE_USE_LOCAL_DATAVIEWS=$VITE_USE_LOCAL_DATAVIEWS
ENV VITE_WORKSPACE_ENV=$VITE_WORKSPACE_ENV
ENV VITE_REPORT_DAYS_LIMIT=$VITE_REPORT_DAYS_LIMIT
ENV VITE_PIPE_DATASET_VERSION=$VITE_PIPE_DATASET_VERSION
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV COMMIT_SHA=$COMMIT_SHA

COPY . .

RUN yarn install --immutable --inline-builds && \
  yarn nx reset && \
  NODE_OPTIONS='--max-old-space-size=8192 --max-semi-space-size=1024' yarn nx run fishing-map:build

FROM node:24-alpine AS production

WORKDIR /app

ARG APP_NAME=fishing-map

COPY --from=builder /app/apps/$APP_NAME/.output ./output

CMD ["node", "--max-http-header-size=40000", "output/server/index.mjs"]
