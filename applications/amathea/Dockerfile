#################################################################################
# Step to build the application assets
#################################################################################
FROM node:12 AS build
RUN mkdir -p /app
WORKDIR /app

# Config build args
ARG REACT_APP_GOOGLE_TAG_MANAGER_KEY=

# Install build dependencies
COPY . /app
ENV NODE_ENV=development
ENV REACT_APP_GOOGLE_TAG_MANAGER_KEY=${REACT_APP_GOOGLE_TAG_MANAGER_KEY}
RUN npm install --unsafe-perm

# Build the application assets
ENV NODE_ENV=production
RUN npm run build

#################################################################################
# Actual application to run
#################################################################################
FROM nginx
ARG BASIC_AUTH_USER=gfw
ARG BASIC_AUTH_PASS=default

RUN apt-get update && apt-get install openssl -y

COPY nginx/nginx.conf /etc/nginx/nginx.template
RUN echo -n ${BASIC_AUTH_USER}: >> /etc/nginx/.htpasswd
RUN echo ${BASIC_AUTH_PASS} | openssl passwd -apr1 -stdin >> /etc/nginx/.htpasswd
COPY entrypoint.sh entrypoint.sh
COPY --from=build /app/build/ /usr/share/nginx/www/
ENTRYPOINT ["./entrypoint.sh"]
