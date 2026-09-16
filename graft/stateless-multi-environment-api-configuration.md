---
name: Stateless Multi-Environment API Configuration
slug: stateless-multi-environment-api-configuration
type: concept
sources:
  - path: apps/user-groups-admin/src/data/config.ts
    hash: d39b5868d6f03f537b59c781622fd13add1af5b9e59ad34e440d5e0d0583da75
  - path: config/entrypoint.sh
    hash: e414ca656b70ca511a9798c7c63e06dbbf25f391c941e5f0b8aa897fc2eaa247
  - path: libs/api-client/src/config.ts
    hash: 2f2f172043754b5f3585a5489103772d50351c66f8e8e98a23ebb8e77ab82917
sources_digest: bee5ff2032d874258953104b949c6cf306f86741ab99dcb1ef7058ac03bb5b8b
links:
  - to: configuration-and-build-infrastructure
    relation: implements
    description: >-
      Entrypoint script enables environment-based Nginx configuration; config
      constants expose APPLICATION_ID and IS_PRODUCTION flags
  - to: global-fishing-watch-api-client
    relation: configures
    description: >-
      Config module exports API_GATEWAY and API_VERSION determined by
      environment; client uses these for endpoint construction
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

API client and application configuration adapts to multiple deployment environments (Vite, Next.js, Node.js) via a cascading fallback pattern. Environment variables and framework-specific build-time variables determine API gateway URL, token storage strategy, and debug flags without code changes.

## Related

- implements [[configuration-and-build-infrastructure]] — Entrypoint script enables environment-based Nginx configuration; config constants expose APPLICATION_ID and IS_PRODUCTION flags
- configures [[global-fishing-watch-api-client]] — Config module exports API_GATEWAY and API_VERSION determined by environment; client uses these for endpoint construction

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
