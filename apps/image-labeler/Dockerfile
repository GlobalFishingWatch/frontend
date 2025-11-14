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


ARG API_GATEWAY
ENV API_GATEWAY=$API_GATEWAY

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

