FROM node:24-slim AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.0.9 --activate
COPY . .
RUN pnpm install --frozen-lockfile

FROM node:24-slim AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.0.9 --activate
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules /app/node_modules
