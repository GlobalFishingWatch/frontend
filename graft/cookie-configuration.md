---
name: Cookie Configuration
slug: cookie-configuration
type: concept
sources:
  - path: apps/platform/features/app/cookies.config.ts
    hash: fcef71676f24e36a40289708b2004e98e9d9ae4c024096589dac75c72483074c
sources_digest: 899604a845c1ec42e9a14092cebbac5e611910aab6fe12b22df3c46a348751fb
links:
  - to: user-authentication-session
    relation: uses
    description: >-
      USER_TOKEN_COOKIE_KEY and USER_REFRESH_TOKEN_COOKIE_KEY manage
      authentication tokens
generator:
  version: 1
covers:
  - symbol: PanelWidths
    kind: type
    at: 'apps/platform/features/app/cookies.config.ts:L10-L10'
---

<!-- context:generated:start -->

## Summary

Immutable configuration module exporting cookie keys (panel widths, user tokens) and type definitions. Designed as a leaf with no internal imports to remain compatible with Playwright e2e CommonJS transformation, preventing import.meta breakage in test suite.

## Related

- uses [[user-authentication-session]] — USER_TOKEN_COOKIE_KEY and USER_REFRESH_TOKEN_COOKIE_KEY manage authentication tokens

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
