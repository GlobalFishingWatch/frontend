#################################################################################
# Step to build the application assets
#################################################################################
FROM node:12 AS build
RUN mkdir -p /app
WORKDIR /app

# Config build args
ARG REACT_APP_GOOGLE_TAG_MANAGER_KEY=
ARG REACT_APP_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org

# Install build dependencies
COPY ./package.json /app
ENV NODE_ENV=development
ENV REACT_APP_GOOGLE_TAG_MANAGER_KEY=${REACT_APP_GOOGLE_TAG_MANAGER_KEY}
ENV REACT_APP_API_GATEWAY=${REACT_APP_API_GATEWAY}
RUN npm install --unsafe-perm

# Build the application assets
ENV NODE_ENV=production
COPY ./src /app/src
COPY ./public /app/public
COPY ./.eslintignore /app/.eslintignore
COPY ./entrypoint.sh /app/entrypoint.sh
COPY ./tsconfig.json /app/tsconfig.json
RUN npm run build

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
