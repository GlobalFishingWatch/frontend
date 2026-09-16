---
name: Configuration and Build Infrastructure
slug: configuration-and-build-infrastructure
type: system
sources:
  - path: apps/user-groups-admin/eslint.config.js
    hash: 7e22e29146cdc143db6ff08c2f585c9a112e6058fde5483d66cfd203cc13337c
  - path: config/entrypoint.sh
    hash: e414ca656b70ca511a9798c7c63e06dbbf25f391c941e5f0b8aa897fc2eaa247
  - path: eslint.config.js
    hash: dd1ce2c783fd1d0d9686b590f31554defb2acbc4dd57693faccf854c21c08ec3
  - path: libs/api-client/eslint.config.js
    hash: f4b8d65ebbc93fe43ef6ba67d31c4a5a7e461dadba54eadb8263a58bea75dc53
sources_digest: 5aff7008dc851734a57f3c7f3bf35acecc601e2446b43ff68fb4e17221a7fbcb
links:
  - to: global-fishing-watch-api-client
    relation: validates
    description: >-
      ESLint verifies package.json dependencies and enforces CommonJS/ESM module
      conventions
  - to: track-labeler-store-and-middleware
    relation: validates
    description: >-
      ESLint enforces module boundaries between features (user, vessels, routes)
      and prevents circular dependencies
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Monorepo-wide ESLint configuration enforcing linting standards, module boundaries, and dependency correctness across all packages and applications. Nginx entrypoint for containerized deployments with environment variable substitution.

## Related

- validates [[global-fishing-watch-api-client]] — ESLint verifies package.json dependencies and enforces CommonJS/ESM module conventions
- validates [[track-labeler-store-and-middleware]] — ESLint enforces module boundaries between features (user, vessels, routes) and prevents circular dependencies

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
