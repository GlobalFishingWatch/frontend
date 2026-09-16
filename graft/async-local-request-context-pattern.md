---
name: Async-Local Request Context Pattern
slug: async-local-request-context-pattern
type: concept
sources:
  - path: apps/platform/server-functions/gfw-api.server-config.ts
    hash: 5335a9abdb54e9ec2a43261995daf1a7a08c84d5266e28f1ab296a2b810a90f8
  - path: apps/platform/server-functions/screen-size.functions.ts
    hash: 363038102f6d758a497118ce06d98a2e20b8bb9ffff354127e6bca309dad4b0e
sources_digest: 7688b26795bf1faf2e4804ebf0af735deaf590ffebbf985ea4591a6842c0c729
links: []
generator:
  version: 1
covers:
  - symbol: Tokens
    kind: type
    at: 'apps/platform/server-functions/gfw-api.server-config.ts:L11-L11'
  - symbol: AuthTokenHolder
    kind: type
    at: 'apps/platform/server-functions/gfw-api.server-config.ts:L12-L12'
  - symbol: runRequestWithAuthToken
    kind: function
    at: 'apps/platform/server-functions/gfw-api.server-config.ts:L15-L19'
  - symbol: configureServerGFWAPI
    kind: function
    at: 'apps/platform/server-functions/gfw-api.server-config.ts:L26-L74'
  - symbol: clampAsidePct
    kind: function
    at: 'apps/platform/server-functions/screen-size.functions.ts:L7-L7'
  - symbol: clampContentPanelWidth
    kind: function
    at: 'apps/platform/server-functions/screen-size.functions.ts:L11-L12'
  - symbol: detectPanelWidthsFromRequest
    kind: function
    at: 'apps/platform/server-functions/screen-size.functions.ts:L14-L33'
  - symbol: getPanelWidthsFromRequest
    kind: function
    at: 'apps/platform/server-functions/screen-size.functions.ts:L35-L38'
---

<!-- context:generated:start -->

## Summary

Uses Node AsyncLocalStorage to isolate per-request state (auth tokens, panel widths) from concurrent requests, enabling server functions to access request-scoped data without passing it through function parameters. Critical for SSR where multiple requests run concurrently.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
