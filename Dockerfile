FROM node:24-slim AS builder
WORKDIR /app
RUN yarn set version 4.13.0
COPY . .
RUN yarn install --immutable --inline-builds

FROM node:24-slim AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.yarn /app/.yarn
