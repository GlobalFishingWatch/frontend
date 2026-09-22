---
name: Server Entry & Request Handling
slug: server-entry-request-handling
type: system
sources:
  - path: apps/platform/server.ts
    hash: a1d4c854b29e94ed3345745308b2c3a92a867ea5254ce467ab4afc7af5b33ccf
sources_digest: b41ddbcc72166c758de16131ae9de843f73abd32b701bcebc9ec2ff7750248bb
links:
  - to: async-local-request-context-pattern
    relation: uses
    description: >-
      Tracks in-flight requests to coordinate with async-local state during hot
      reloads
  - to: server-authentication-token-management
    relation: uses
    description: >-
      Server entry configures GFWAPI client via configureServerGFWAPI for
      per-request token management
generator:
  version: 1
covers:
  - symbol: check
    kind: function
    at: 'apps/platform/server.ts:L25-L31'
  - symbol: fetch
    kind: method
    at: 'apps/platform/server.ts:L38-L52'
---

<!-- context:generated:start -->

## Summary

Production server entry point integrating TanStack React Start's fetch handler with request interception (proxy), Sentry error tracking, and graceful in-flight request handling for dev-mode hot reloads. Coordinates SSR infrastructure and observability.

## Related

- uses [[async-local-request-context-pattern]] — Tracks in-flight requests to coordinate with async-local state during hot reloads
- uses [[server-authentication-token-management]] — Server entry configures GFWAPI client via configureServerGFWAPI for per-request token management

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
