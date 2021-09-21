#################################################################################
# Step to build the application assets
#################################################################################
FROM node:12 AS base
RUN mkdir -p /app
WORKDIR /app

# Config build args
ARG REACT_APP_GOOGLE_TAG_MANAGER_KEY=""
ARG REACT_APP_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org
ARG REACT_APP_WORKSPACE_ENV=development
ARG REACT_APP_LIMITED_ACCESS_USER=false
ARG GENERATE_SOURCEMAP=false

# Install build dependencies
COPY ./package.json /app
ENV NODE_ENV=development
ENV REACT_APP_GOOGLE_TAG_MANAGER_KEY=${REACT_APP_GOOGLE_TAG_MANAGER_KEY}
ENV REACT_APP_API_GATEWAY=${REACT_APP_API_GATEWAY}
RUN npm install --unsafe-perm

COPY ./src /app/src
COPY ./public /app/public
COPY ./.eslintignore /app/.eslintignore
COPY ./.eslintrc.js /app/.eslintrc.js
COPY ./entrypoint.sh /app/entrypoint.sh
COPY ./tsconfig.json /app/tsconfig.json
COPY ./craco.config.js /app/craco.config.js

# Build the application assets
FROM base as build
ARG REACT_APP_GOOGLE_TAG_MANAGER_KEY=""
ARG REACT_APP_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org
ARG REACT_APP_LIMITED_ACCESS_USER=false
ARG REACT_APP_WORKSPACE_ENV=development
ARG GENERATE_SOURCEMAP=false

ENV REACT_APP_GOOGLE_TAG_MANAGER_KEY=${REACT_APP_GOOGLE_TAG_MANAGER_KEY}
ENV REACT_APP_API_GATEWAY=${REACT_APP_API_GATEWAY}
ENV REACT_APP_LIMITED_ACCESS_USER=${REACT_APP_LIMITED_ACCESS_USER}
ENV REACT_APP_WORKSPACE_ENV=${REACT_APP_WORKSPACE_ENV}
ENV NODE_ENV=$REACT_APP_WORKSPACE_ENV

# override node_modules inside image with
# generated versions from the monorepo
COPY ./node_modules/@globalfishingwatch /tmp/@globalfishingwatch
RUN cp -r /tmp/@globalfishingwatch /app/node_modules/
ENV GENERATE_SOURCEMAP=${GENERATE_SOURCEMAP}

RUN yarn build

#################################################################################
# Generate htpasswd file
#################################################################################
FROM appsoa/docker-alpine-htpasswd as htpasswd
ARG BASIC_AUTH_USER=gfw
ARG BASIC_AUTH_PASS=default
ENV BASIC_AUTH_USER $BASIC_AUTH_USER
ENV BASIC_AUTH_PASS $BASIC_AUTH_PASS
RUN htpasswd -Bbn "$BASIC_AUTH_USER" "$BASIC_AUTH_PASS" > /home/.htpasswd

#################################################################################
# Actual application to run
#################################################################################
# Using stable version that uses alpine 3.14 to fix build errors
# https://github.com/alpinelinux/docker-alpine/issues/182
FROM nginx:stable-alpine as production
RUN apk -U upgrade

COPY nginx/nginx.conf /etc/nginx/nginx.template
COPY --from=htpasswd /home/.htpasswd /home/.htpasswd
RUN cat /home/.htpasswd >> /etc/nginx/.htpasswd
COPY entrypoint.sh entrypoint.sh
COPY --from=build /app/build/ /usr/share/nginx/www/
ENTRYPOINT ["./entrypoint.sh"]
