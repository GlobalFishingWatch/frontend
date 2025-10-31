# Use official Node.js LTS image
FROM node:24

# Set working directory
WORKDIR /dependencies

# Copy package.json and yarn.lock (if it exists)

# Install dependencies using Yarn
RUN yarn set version 4.10.3

COPY . .

RUN yarn install --immutable --inline-builds

