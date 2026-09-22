---
name: Token Refresh Deduplication
slug: token-refresh-deduplication
type: concept
sources:
  - path: apps/platform/server-functions/auth.functions.ts
    hash: 0c82baad58c192ad0a99e2fb1bca0aa62fe36f89b374f15e172c0fc4d1842912
sources_digest: 832767f9a94d8968a7486fc39f7c7b5a32d72320b129aa0633ad9d6d38fb5b9e
links: []
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
---

<!-- context:generated:start -->

## Summary

Pattern to prevent thundering herd during token expiration: track in-flight refresh promises per refresh-token in a deduplication map, return existing promise to concurrent callers, delete entry after resolution. Ensures only one refresh RPC fires for N concurrent requests.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
