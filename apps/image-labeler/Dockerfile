#################################################################################
# Generate htpasswd file
#################################################################################
# FROM appsoa/docker-alpine-htpasswd as htpasswd
# ARG BASIC_AUTH_USER=gfw
# ARG BASIC_AUTH_PASS=default
# ENV BASIC_AUTH_USER $BASIC_AUTH_USER
# ENV BASIC_AUTH_PASS $BASIC_AUTH_PASS
# RUN htpasswd -Bbn "$BASIC_AUTH_USER" "$BASIC_AUTH_PASS" > /home/.htpasswd

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
  yarn nx run image-labeler:build


#################################################################################
# Actual application to run
#################################################################################
# Using stable version that uses alpine 3.14 to fix build errors
# https://github.com/alpinelinux/docker-alpine/issues/182
FROM nginx:stable-alpine as production

COPY --from=builder /app/dist/apps/image-labeler/nginx.conf /etc/nginx/nginx.template
# COPY --from=htpasswd /home/.htpasswd /home/.htpasswd
# RUN cat /home/.htpasswd >> /etc/nginx/.htpasswd
COPY --from=builder /app/dist/apps/image-labeler/entrypoint.sh entrypoint.sh
COPY --from=builder /app/dist/apps/image-labeler/ /usr/share/nginx/www/
ENTRYPOINT ["./entrypoint.sh"]

