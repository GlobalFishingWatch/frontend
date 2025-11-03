#################################################################################
# Actual application to run
#################################################################################

# Production image, copy all the files and run next
FROM us-central1-docker.pkg.dev/gfw-int-infrastructure/devops/frontend-dependencies:latest

WORKDIR /app

ARG APP_NAME=fishing-map
ENV APP_NAME $APP_NAME
ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY . .

RUN yarn install --immutable --inline-builds && \
  yarn nx run $APP_NAME:build

WORKDIR /app/dist/apps/fishing-map/.next/standalone/apps/fishing-map

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "--max-http-header-size=40000", "server.js"]
