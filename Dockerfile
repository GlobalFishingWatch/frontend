FROM nginx:stable-alpine AS production-nginx

RUN apk update && apk upgrade

ARG APP_NAME
COPY dist/apps/${APP_NAME}/nginx.conf           /etc/nginx/nginx.template
COPY dist/apps/${APP_NAME}/config/entrypoint.sh ./entrypoint.sh
COPY dist/apps/${APP_NAME}/                     /usr/share/nginx/www/

ENTRYPOINT ["./entrypoint.sh"]


FROM node:24-alpine AS production-node

RUN apk update && apk upgrade

WORKDIR /app

ARG APP_NAME=platform
ARG COMMIT_SHA
ARG VITE_WORKSPACE_ENV
ENV SENTRY_RELEASE=$COMMIT_SHA \
    SENTRY_ENVIRONMENT=$VITE_WORKSPACE_ENV

COPY apps/${APP_NAME}/.output ./output

CMD ["node", "--import", "./output/server/instrument.server.mjs", "--max-http-header-size=40000", "output/server/index.mjs"]
