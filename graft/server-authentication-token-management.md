---
name: Server Authentication & Token Management
slug: server-authentication-token-management
type: system
sources:
  - path: apps/platform/server-functions/auth.functions.ts
    hash: 0c82baad58c192ad0a99e2fb1bca0aa62fe36f89b374f15e172c0fc4d1842912
  - path: apps/platform/server-functions/gfw-api.server-config.ts
    hash: 5335a9abdb54e9ec2a43261995daf1a7a08c84d5266e28f1ab296a2b810a90f8
  - path: apps/platform/server-functions/user.functions.ts
    hash: 3da119fd6c2979c56ffe75157f8fb9af8f2d5a90b5c9d03e2e65963a6067bc2f
sources_digest: c73b25613fc1564d027034dc8bf826ee3146e40dfd2f052dbfcd2e6796a3d709
links:
  - to: async-local-request-context-pattern
    relation: uses
    description: >-
      gfw-api.server-config uses AsyncLocalStorage for per-request token
      isolation
  - to: token-refresh-deduplication
    relation: implements
    description: >-
      auth.functions maintains refreshInFlight map to coalesce concurrent token
      refresh calls
generator:
  version: 1
covers:
  - symbol: Tokens
    kind: type
    at: 'apps/platform/server-functions/auth.functions.ts:L12-L12'
  - symbol: CookieSetter
    kind: type
    at: 'apps/platform/server-functions/auth.functions.ts:L13-L13'
  - symbol: setAuthCookies
    kind: function
    at: 'apps/platform/server-functions/auth.functions.ts:L26-L29'
  - symbol: clearAuthCookies
    kind: function
    at: 'apps/platform/server-functions/auth.functions.ts:L31-L34'
  - symbol: refreshAuthTokens
    kind: function
    at: 'apps/platform/server-functions/auth.functions.ts:L56-L82'
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
  - symbol: resolveUserStateFromRequest
    kind: function
    at: 'apps/platform/server-functions/user.functions.ts:L11-L43'
---

<!-- context:generated:start -->

## Summary

Server-side auth orchestration coordinating GFWAPI token exchange and refresh, with deduplication of concurrent token refresh requests via AsyncLocalStorage to prevent thundering herd. Manages HTTP-only cookie storage of refresh tokens and access token lifecycle.

## Related

- uses [[async-local-request-context-pattern]] — gfw-api.server-config uses AsyncLocalStorage for per-request token isolation
- implements [[token-refresh-deduplication]] — auth.functions maintains refreshInFlight map to coalesce concurrent token refresh calls

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
