FROM node:14-alpine as production

WORKDIR /app
RUN apk add --no-cache git
COPY package.json ./package.json
RUN yarn
COPY . ./
CMD yarn next start -p $PORT
