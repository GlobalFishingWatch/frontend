FROM us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/dependencies:latest AS builder

WORKDIR /app

ENV NODE_ENV=production
ENV NX_DAEMON=false
ENV NX_PARALLEL=1
ENV NX_ISOLATE_PLUGINS=false
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_API_GATEWAY
ARG NEXT_PUBLIC_API_VERSION
ARG NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID
ARG NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
ARG NEXT_PUBLIC_USE_LOCAL_DATASETS
ARG NEXT_PUBLIC_USE_LOCAL_DATAVIEWS
ARG NEXT_PUBLIC_WORKSPACE_ENV
ARG NEXT_PUBLIC_REPORT_DAYS_LIMIT

ENV NEXT_PUBLIC_API_GATEWAY=$NEXT_PUBLIC_API_GATEWAY
ENV NEXT_PUBLIC_API_VERSION=$NEXT_PUBLIC_API_VERSION
ENV NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=$NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID
ENV NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=$NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
ENV NEXT_PUBLIC_USE_LOCAL_DATASETS=$NEXT_PUBLIC_USE_LOCAL_DATASETS
ENV NEXT_PUBLIC_USE_LOCAL_DATAVIEWS=$NEXT_PUBLIC_USE_LOCAL_DATAVIEWS
ENV NEXT_PUBLIC_WORKSPACE_ENV=$NEXT_PUBLIC_WORKSPACE_ENV
ENV NEXT_PUBLIC_REPORT_DAYS_LIMIT=$NEXT_PUBLIC_REPORT_DAYS_LIMIT

COPY . .

RUN yarn install --immutable --inline-builds && \
  yarn nx run port-labeler:build


#################################################################################
# Actual application to run
#################################################################################

# Production image, copy all the files and run next
FROM node:24-alpine AS production
WORKDIR /app

ARG APP_NAME=port-labeler
ENV APP_NAME $APP_NAME

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# nx/next sets the distDir in the server.js standalone folder to
# a relative folder ./../../dist/apps/{$APP_NAME}/.next on
# build time it's necessary to adjust the dir structure of the
# output to it
COPY --from=builder /app/dist/apps/port-labeler/public ./apps/$APP_NAME/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/dist/apps/port-labeler/.next/standalone ./

# Had to change the dest dir to ./dist/apps/$APP_NAME/.next/static since
# it's there where the server looks for the files
COPY --from=builder --chown=nextjs:nodejs /app/dist/apps/port-labeler/.next/static ./dist/apps/$APP_NAME/.next/static


USER nextjs

EXPOSE 3000

ENV PORT 3000

# this is also customized based on the output where the standalone
# next server files are placed
WORKDIR /app/apps/$APP_NAME

CMD ["node", "server.js"]
