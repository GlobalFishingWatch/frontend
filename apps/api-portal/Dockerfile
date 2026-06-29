#################################################################################
# Actual application to run
#################################################################################
FROM us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/dependencies:latest AS builder

WORKDIR /app

ENV NODE_ENV=production

ARG PUBLIC_URL
ARG VITE_API_GATEWAY
ARG VITE_GOOGLE_MEASUREMENT_ID
ARG VITE_GOOGLE_TAG_MANAGER_ID

ENV PUBLIC_URL=$PUBLIC_URL
ENV VITE_API_GATEWAY=$VITE_API_GATEWAY
ENV VITE_GOOGLE_MEASUREMENT_ID=$VITE_GOOGLE_MEASUREMENT_ID
ENV VITE_GOOGLE_TAG_MANAGER_ID=$VITE_GOOGLE_TAG_MANAGER_ID

COPY . .

RUN pnpm install --frozen-lockfile && \
  pnpm exec nx run api-portal:build

# Using stable version that uses alpine 3.14 to fix build errors
# https://github.com/alpinelinux/docker-alpine/issues/182
FROM nginx:stable-alpine AS production
RUN apk update && apk upgrade libxml2 libexpat
COPY --from=builder /app/dist/apps/api-portal/nginx.conf /etc/nginx/nginx.template
COPY --from=builder /app/dist/apps/api-portal/config/entrypoint.sh ./entrypoint.sh
COPY --from=builder /app/dist/apps/api-portal/ /usr/share/nginx/www/
ENTRYPOINT ["./entrypoint.sh"]

