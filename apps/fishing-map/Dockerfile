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
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true

ARG NEXT_PUBLIC_API_GATEWAY
ARG NEXT_PUBLIC_API_VERSION
ARG NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID
ARG NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
ARG NEXT_PUBLIC_USE_LOCAL_DATASETS
ARG NEXT_PUBLIC_USE_LOCAL_DATAVIEWS
ARG NEXT_PUBLIC_WORKSPACE_ENV
ARG NEXT_PUBLIC_REPORT_DAYS_LIMIT
ARG NEXT_PUBLIC_PIPE_DATASET_VERSION
ARG SENTRY_AUTH_TOKEN
ARG COMMIT_SHA

ENV NEXT_PUBLIC_API_GATEWAY=$NEXT_PUBLIC_API_GATEWAY
ENV NEXT_PUBLIC_API_VERSION=$NEXT_PUBLIC_API_VERSION
ENV NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=$NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID
ENV NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=$NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
ENV NEXT_PUBLIC_USE_LOCAL_DATASETS=$NEXT_PUBLIC_USE_LOCAL_DATASETS
ENV NEXT_PUBLIC_USE_LOCAL_DATAVIEWS=$NEXT_PUBLIC_USE_LOCAL_DATAVIEWS
ENV NEXT_PUBLIC_WORKSPACE_ENV=$NEXT_PUBLIC_WORKSPACE_ENV
ENV NEXT_PUBLIC_REPORT_DAYS_LIMIT=$NEXT_PUBLIC_REPORT_DAYS_LIMIT
ENV NEXT_PUBLIC_PIPE_DATASET_VERSION=$NEXT_PUBLIC_PIPE_DATASET_VERSION
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV COMMIT_SHA=$COMMIT_SHA

COPY . .

RUN yarn install --immutable --inline-builds && \
  yarn nx reset && \
  NODE_OPTIONS='--max-old-space-size=8192 --max-semi-space-size=1024' yarn nx run fishing-map:build

FROM node:24-alpine AS production

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ARG APP_NAME=fishing-map

COPY --from=builder /app/apps/$APP_NAME/public ./apps/$APP_NAME/public
COPY --from=builder /app/dist/apps/fishing-map/.next/standalone ./
COPY --from=builder /app/dist/apps/fishing-map/.next/static ./dist/apps/$APP_NAME/.next/static

# Where Next Server Files are palced
WORKDIR /app/apps/$APP_NAME

CMD ["node", "--max-http-header-size=40000", "server.js"]
