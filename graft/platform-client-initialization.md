---
name: Platform Client Initialization
slug: platform-client-initialization
type: file
sources:
  - path: apps/platform/client.tsx
    hash: d1e8700aab075fe18de07230a9c9dad286d694b2def3d4fac0aa6d429be6f361
sources_digest: 31d08ab543bdc0109d0c27fd35fe7fa8136618ca71c4b45b3bf9f6403532470f
links:
  - to: authentication-session-state
    relation: implements
    description: >-
      Client wires auth token refresh and invalidation functions into GFWAPI to
      support distributed token management
  - to: platform-configuration
    relation: depends_on
    description: >-
      Client may depend on configuration values for Sentry setup (dsn,
      tracesSampleRate) and feature flags set at build time
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

React entry point that hydrates the browser application, configuring authentication via GFWAPI with cookie-based storage and refresh logic, setting up Sentry error tracking with environment-specific sampling and replay, managing versioned localStorage cleanup for auth state migration, and gracefully reloading when dynamic imports fail during deployment.

## Related

- implements [[authentication-session-state]] — Client wires auth token refresh and invalidation functions into GFWAPI to support distributed token management
- depends on [[platform-configuration]] — Client may depend on configuration values for Sentry setup (dsn, tracesSampleRate) and feature flags set at build time

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
