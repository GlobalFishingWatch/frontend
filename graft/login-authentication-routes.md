---
name: Login & Authentication Routes
slug: login-authentication-routes
type: system
sources:
  - path: apps/port-labeler/src/routes/LoginLink.tsx
    hash: 899e80b1833e4325083a94a3ca455578c3f888318f2f293deeabc9dc4f1223b9
  - path: apps/port-labeler/src/routes/routes.hook.ts
    hash: 0b830a5255bf768e610c535e19cfc15e643b3b0acece50c918dcb17c5c95a80b
sources_digest: e099868bfcf2c759d1cc8b71ba31faaf6e5dc925841c9fc9cf96c8f47e40a9d9
links:
  - to: url-routing-query-parameter-synchronization
    relation: uses
    description: >-
      Redirect logic uses saveRedirectUrl and updateLocation to persist state
      across auth flow
  - to: user-authentication-permissions
    relation: produces
    description: >-
      Login flow extracts access tokens and triggers fetchUserThunk to
      authenticate
generator:
  version: 1
covers:
  - symbol: LocalStorageLoginLinkProps
    kind: type
    at: 'apps/port-labeler/src/routes/LoginLink.tsx:L5-L8'
  - symbol: LocalStorageLoginLink
    kind: function
    at: 'apps/port-labeler/src/routes/LoginLink.tsx:L10-L18'
  - symbol: useReplaceLoginUrl
    kind: function
    at: 'apps/port-labeler/src/routes/routes.hook.ts:L19-L50'
  - symbol: useLocationConnect
    kind: function
    at: 'apps/port-labeler/src/routes/routes.hook.ts:L52-L65'
---

<!-- context:generated:start -->

## Summary

LocalStorageLoginLink component preserves user location via saveRedirectUrl before redirecting to auth provider; useReplaceLoginUrl hook handles post-auth redirect by extracting access tokens from URL, merging workspace config into Redux state, and cleaning up temporary storage. Both integrate with @globalfishingwatch/react-hooks for OAuth flow management.

## Related

- uses [[url-routing-query-parameter-synchronization]] — Redirect logic uses saveRedirectUrl and updateLocation to persist state across auth flow
- produces [[user-authentication-permissions]] — Login flow extracts access tokens and triggers fetchUserThunk to authenticate

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
