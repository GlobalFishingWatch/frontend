#################################################################################
# Step to build the application assets
#################################################################################
FROM node:12 AS build
RUN mkdir -p /app
WORKDIR /app

# Config build args
ARG REACT_APP_SPREADSHEET_CLIENT_EMAIL=
ARG REACT_APP_SPREADSHEET_PRIVATE_KEY=
ARG REACT_APP_FEEDBACK_SPREADSHEET_ID=
ARG REACT_APP_GOOGLE_TAG_MANAGER_KEY=GTM-KK5ZFST
ARG REACT_APP_GOOGLE_UNIVERSAL_ANALYTICS_ID=UA-56517380-1
ARG REACT_APP_GOOGLE_MEASUREMENT_ID=G-M5J2ZHDZMV
ARG REACT_APP_USE_LOCAL_DATAVIEWS=false
ARG REACT_APP_USE_LOCAL_DATASETS=false
ARG REACT_APP_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org
ARG REACT_APP_CARRIER_PORTAL_URL=https://carrier-portal.dev.globalfishingwatch.org
ARG REACT_APP_LATEST_CARRIER_DATASET_ID=carriers:latest
ARG REACT_APP_WORKSPACE_ENV=development

# Install build dependencies
COPY ./package.json /app
ENV NODE_ENV=development
ENV REACT_APP_SPREADSHEET_CLIENT_EMAIL=${REACT_APP_SPREADSHEET_CLIENT_EMAIL}
ENV REACT_APP_SPREADSHEET_PRIVATE_KEY=${REACT_APP_SPREADSHEET_PRIVATE_KEY}
ENV REACT_APP_FEEDBACK_SPREADSHEET_ID=${REACT_APP_FEEDBACK_SPREADSHEET_ID}
ENV REACT_APP_GOOGLE_TAG_MANAGER_KEY=${REACT_APP_GOOGLE_TAG_MANAGER_KEY}
ENV REACT_APP_GOOGLE_UNIVERSAL_ANALYTICS_ID=${REACT_APP_GOOGLE_UNIVERSAL_ANALYTICS_ID}
ENV REACT_APP_GOOGLE_MEASUREMENT_ID=${REACT_APP_GOOGLE_MEASUREMENT_ID}
ENV REACT_APP_USE_LOCAL_DATAVIEWS=${REACT_APP_USE_LOCAL_DATAVIEWS}
ENV REACT_APP_USE_LOCAL_DATASETS=${REACT_APP_USE_LOCAL_DATASETS}
ENV REACT_APP_API_GATEWAY=${REACT_APP_API_GATEWAY}
ENV REACT_APP_CARRIER_PORTAL_URL=${REACT_APP_CARRIER_PORTAL_URL}
ENV REACT_APP_LATEST_CARRIER_DATASET_ID=${REACT_APP_LATEST_CARRIER_DATASET_ID}
ENV REACT_APP_WORKSPACE_ENV=${REACT_APP_WORKSPACE_ENV}
RUN yarn install --unsafe-perm --frozen-lockfile

# Build the application assets
ENV NODE_ENV=production
COPY ./src /app/src
COPY ./public /app/public
COPY ./.eslintignore /app/.eslintignore
COPY ./.eslintrc.js /app/.eslintrc.js
COPY ./entrypoint.sh /app/entrypoint.sh
COPY ./tsconfig.json /app/tsconfig.json
COPY ./craco.config.js /app/craco.config.js
RUN yarn build

#################################################################################
# Actual application to run
#################################################################################
FROM nginx as production
ARG BASIC_AUTH_USER=gfw
ARG BASIC_AUTH_PASS=default

RUN apt-get update && apt-get install openssl -y

COPY nginx/nginx.conf /etc/nginx/nginx.template
RUN echo -n ${BASIC_AUTH_USER}: >> /etc/nginx/.htpasswd
RUN echo ${BASIC_AUTH_PASS} | openssl passwd -apr1 -stdin >> /etc/nginx/.htpasswd
COPY entrypoint.sh entrypoint.sh
COPY --from=build /app/build/ /usr/share/nginx/www/
ENTRYPOINT ["./entrypoint.sh"]
