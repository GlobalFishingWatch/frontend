#################################################################################
# Actual application to run
#################################################################################
FROM us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/dependencies:latest AS builder

WORKDIR /app

ENV NODE_ENV=production

ARG PUBLIC_URL
ARG API_GATEWAY
ARG GOOGLE_MEASUREMENT_ID
ARG GOOGLE_TAG_MANAGER_ID

ENV PUBLIC_URL=$PUBLIC_URL
ENV API_GATEWAY=$API_GATEWAY
ENV GOOGLE_MEASUREMENT_ID=$GOOGLE_MEASUREMENT_ID
ENV GOOGLE_TAG_MANAGER_ID=$GOOGLE_TAG_MANAGER_ID

COPY . .

RUN pnpm install --frozen-lockfile && \
  pnpm exec nx run port-labeler:build

# Using stable version that uses alpine 3.14 to fix build errors
# https://github.com/alpinelinux/docker-alpine/issues/182
FROM nginx:stable-alpine AS production
RUN apk update && apk upgrade libxml2 libexpat
COPY --from=builder /app/dist/apps/port-labeler/nginx.conf /etc/nginx/nginx.template
COPY --from=builder /app/dist/apps/port-labeler/config/entrypoint.sh ./entrypoint.sh
COPY --from=builder /app/dist/apps/port-labeler/ /usr/share/nginx/www/
ENTRYPOINT ["./entrypoint.sh"]
