FROM node:14-alpine

WORKDIR /app
RUN apk add --no-cache git
COPY package.json ./package.json
RUN yarn
COPY .next ./.next
CMD yarn next start -p $PORT
