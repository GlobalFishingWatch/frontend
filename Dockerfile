# Use official Node.js LTS image
FROM node:24 AS builder

# Set working directory
WORKDIR /dependencies

# Install dependencies using Yarn
RUN yarn set version 4.10.3
COPY . .
RUN yarn install --immutable --inline-builds

FROM alpine AS deps

WORKDIR /dependencies

COPY --from=builder /dependencies/node_modules /dependencies/node_modules