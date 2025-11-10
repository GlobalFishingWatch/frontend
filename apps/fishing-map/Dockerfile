FROM us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/dependencies:latest AS builder

WORKDIR /app

ENV NODE_ENV=production

COPY . .

RUN yarn install --immutable --inline-builds && \
  yarn nx run fishing-map:build

FROM node:24-alpine AS production

WORKDIR /app

ARG APP_NAME=fishing-map

COPY --from=builder /app/apps/$APP_NAME/public ./apps/$APP_NAME/public
COPY --from=builder /app/dist/apps/fishing-map/.next/standalone ./
COPY --from=builder /app/dist/apps/fishing-map/.next/static ./dist/apps/$APP_NAME/.next/static

# Where Next Server Files are palced
WORKDIR /app/apps/$APP_NAME

CMD ["node", "--max-http-header-size=40000", "server.js"]
