#################################################################################
# Actual application to run
#################################################################################

# Production image, copy all the files and run next
FROM us-central1-docker.pkg.dev/gfw-int-infrastructure/devops/frontend-dependencies:latest AS builder

WORKDIR /app

ENV APP_NAME $APP_NAME
ENV NODE_ENV production
ENV NODE_ENV production

COPY . .

RUN yarn install --immutable --inline-builds && \
  yarn nx run fishing-map:build

FROM node:24-alpine AS production

WORKDIR /app

ARG APP_NAME=fishing-map

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
COPY --from=builder /app/apps/$APP_NAME/public ./apps/$APP_NAME/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/dist/apps/fishing-map/.next/standalone ./

# Had to change the dest dir to ./dist/apps/$APP_NAME/.next/static since
# it's there where the server looks for the files
COPY --from=builder --chown=nextjs:nodejs /app/dist/apps/fishing-map/.next/static ./dist/apps/$APP_NAME/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# this is also customized based on the output where the standalone
# next server files are placed
WORKDIR /app/apps/$APP_NAME

CMD ["node", "--max-http-header-size=40000", "server.js"]