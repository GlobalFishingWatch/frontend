#################################################################################
# Step to build the application assets
#################################################################################
FROM node:12 AS build
RUN mkdir -p /app
WORKDIR /app

# Config build args
ARG REACT_APP_DEPLOYED_VERSION=__VERSION__
ARG REACT_APP_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org
ARG REACT_APP_GOOGLE_TAG_MANAGER_KEY=GTM-KK5ZFST
ARG REACT_APP_GOOGLE_TAG_MEASUREMENT_ID=G-M5J2ZHDZMV
ARG REACT_APP_GOOGLE_ANALYTICS_GA4=UA-56517380-1
ARG REACT_APP_TRACK_INSPECTOR_URL=https://track-inspector.dev.globalfishingwatch.org
ARG REACT_APP_DATA_DOWNLOAD_URL=https://data-download-portal.dev.globalfishingwatch.org
ARG REACT_APP_DATASET_ID=carriers:latest
ARG REACT_APP_GEAR_TYPE_READY=true
ARG REACT_APP_VESSEL_WIDTH_READY=true

# Install build dependencies
COPY ./package.json /app
ENV NODE_ENV=development
ENV SKIP_PREFLIGHT_CHECK=true
ENV REACT_APP_DEPLOYED_VERSION=${REACT_APP_DEPLOYED_VERSION}
ENV REACT_APP_API_GATEWAY=${REACT_APP_API_GATEWAY}
ENV REACT_APP_TRACK_INSPECTOR_URL=${REACT_APP_TRACK_INSPECTOR_URL}
ENV REACT_APP_DATA_DOWNLOAD_URL=${REACT_APP_DATA_DOWNLOAD_URL}
ENV REACT_APP_GEAR_TYPE_READY=${REACT_APP_GEAR_TYPE_READY}
ENV REACT_APP_VESSEL_WIDTH_READY=${REACT_APP_VESSEL_WIDTH_READY}
ENV REACT_APP_GOOGLE_TAG_MANAGER_KEY=${REACT_APP_GOOGLE_TAG_MANAGER_KEY}
ENV REACT_APP_GOOGLE_TAG_MEASUREMENT_ID=${REACT_APP_GOOGLE_TAG_MEASUREMENT_ID}
ENV REACT_APP_GOOGLE_ANALYTICS_GA4=${REACT_APP_GOOGLE_ANALYTICS_GA4}
ENV REACT_APP_DATASET_ID=${REACT_APP_DATASET_ID}
RUN yarn install

# Build the application assets
COPY ./src /app/src
COPY ./public /app/public
COPY ./scripts /app/scripts
COPY ./.eslintignore /app
COPY ./.eslintrc.js /app
COPY ./.lintstagedrc /app
COPY ./.prettierrc.js /app
COPY ./.stylelintignore /app
COPY ./.stylelintrc.js /app
COPY ./tsconfig.json /app
ENV NODE_ENV=production
RUN yarn build

#################################################################################
# Actual application to run
#################################################################################
FROM nginx
ARG BASIC_AUTH_USER=gfw
ARG BASIC_AUTH_PASS=default

RUN apt-get update && apt-get install openssl -y

COPY ./entrypoint.sh /app
COPY nginx/nginx.conf /etc/nginx/nginx.template
RUN echo -n ${BASIC_AUTH_USER}: >> /etc/nginx/.htpasswd
RUN echo ${BASIC_AUTH_PASS} | openssl passwd -apr1 -stdin >> /etc/nginx/.htpasswd
COPY entrypoint.sh entrypoint.sh
COPY --from=build /app/build/ /usr/share/nginx/www/
ENTRYPOINT ["./entrypoint.sh"]
