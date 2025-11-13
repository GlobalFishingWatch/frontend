#################################################################################
# Generate htpasswd file
#################################################################################
# FROM appsoa/docker-alpine-htpasswd as htpasswd
# ARG BASIC_AUTH_USER=gfw
# ARG BASIC_AUTH_PASS=default
# ENV BASIC_AUTH_USER $BASIC_AUTH_USER
# ENV BASIC_AUTH_PASS $BASIC_AUTH_PASS
# RUN htpasswd -Bbn "$BASIC_AUTH_USER" "$BASIC_AUTH_PASS" > /home/.htpasswd

#################################################################################
# Actual application to run
#################################################################################
FROM us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/dependencies:latest AS builder

WORKDIR /app

ENV NODE_ENV=production
ENV NX_DAEMON=false
ENV NX_PARALLEL=1
ENV NX_ISOLATE_PLUGINS=false
ENV NEXT_TELEMETRY_DISABLED=1

ARG API_GATEWAY
ENV API_GATEWAY=$API_GATEWAY

COPY . .

RUN yarn install --immutable --inline-builds && \
  yarn nx run data-download-portal:build

# Using stable version that uses alpine 3.14 to fix build errors
# https://github.com/alpinelinux/docker-alpine/issues/182
FROM nginx:stable-alpine as production

COPY --from=builder /app/dist/apps/data-download-portal/nginx.conf /etc/nginx/nginx.template
# COPY --from=htpasswd /home/.htpasswd /home/.htpasswd
# RUN cat /home/.htpasswd >> /etc/nginx/.htpasswd
COPY --from=builder /app/dist/apps/data-download-portal/entrypoint.sh ./entrypoint.sh
COPY --from=builder /app/dist/apps/data-download-portal/ /usr/share/nginx/www/
ENTRYPOINT ["./entrypoint.sh"]

