#################################################################################
# Actual application to run
#################################################################################

# Production image, copy all the files and run next
FROM node:24-alpine AS production
WORKDIR /app

ARG APP_NAME=vessel-info-tool

ENV APP_NAME $APP_NAME
ENV NODE_ENV production

COPY .output ./

EXPOSE 3000
ENV PORT 3000

CMD ["node", "--max-http-header-size=40000", "server/index.mjs"]
