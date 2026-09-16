---
name: User State Resolution
slug: user-state-resolution
type: concept
sources:
  - path: apps/platform/server-functions/user.functions.ts
    hash: 3da119fd6c2979c56ffe75157f8fb9af8f2d5a90b5c9d03e2e65963a6067bc2f
sources_digest: cb5c1d72054fbdba340f831c27f847611e37b9c7adcf03c041fbd4a1fbe64a07
links:
  - to: server-authentication-token-management
    relation: uses
    description: Delegates token validation and refresh to auth.functions module
generator:
  version: 1
covers:
  - symbol: resolveUserStateFromRequest
    kind: function
    at: 'apps/platform/server-functions/user.functions.ts:L11-L43'
---

<!-- context:generated:start -->

## Summary

Graceful-degradation strategy during SSR: attempt to restore user session from cookies (access token first, then refresh token), fall back to guest user if all attempts fail. Silently catches exceptions at each stage without re-throwing, ensuring function always returns valid state.

## Related

- uses [[server-authentication-token-management]] — Delegates token validation and refresh to auth.functions module

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
