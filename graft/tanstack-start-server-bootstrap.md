---
name: TanStack Start Server Bootstrap
slug: tanstack-start-server-bootstrap
type: system
sources:
  - path: apps/platform/start.ts
    hash: da5d26659f95ef05789d0deea3e6db9ed6d3181a2a3b349b59a90f1800f7e520
sources_digest: 16e99c86b6b9e8543661de86ecd9d8333ecc43e64a23fe1feef4f2e7a067bf5e
links:
  - to: server-side-internationalization-i18n
    relation: uses
    description: i18nRequestMiddleware depends on runRequestWithI18n for context setup
  - to: session-expiration-handling
    relation: uses
    description: >-
      authTokenRequestMiddleware manages auth token lifecycle via
      runRequestWithAuthToken
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Configures request and function-level middleware for the Start application, chaining i18n context injection, auth token management, and CSRF protection in a specific order. Conditionally enables Sentry instrumentation in production to monitor request handling and function execution.

## Related

- uses [[server-side-internationalization-i18n]] — i18nRequestMiddleware depends on runRequestWithI18n for context setup
- uses [[session-expiration-handling]] — authTokenRequestMiddleware manages auth token lifecycle via runRequestWithAuthToken

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
