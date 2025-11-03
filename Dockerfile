# Use official Node.js LTS image
FROM node:24-slim AS builder

# Set working directory
WORKDIR /app

# Install dependencies using Yarn
RUN yarn set version 4.10.3
COPY . .
RUN yarn install --immutable --inline-builds

FROM node:24-slim AS deps

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.yarn /app/.yarn