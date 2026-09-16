---
name: Authentication & API Token Management
slug: authentication-api-token-management
type: concept
sources:
  - path: apps/port-labeler/src/features/map/Map.tsx
    hash: 1f1325ea9db28777c40c01ca2c0ef8750ec5005e930ac30f2cd74e20d4f3b277
  - path: apps/port-labeler/src/features/user/user.slice.ts
    hash: e8698806baeed2f4cf4d3318cb08e3d59d26d7b11f7cca53bb05ce3c59e689eb
sources_digest: b943f747fc937129235430b2c791a89bbc75b600ae5fb6863b169e2d7601f643
links:
  - to: user-authentication-permissions
    relation: depends_on
    description: >-
      Token refresh logic depends on user slice maintaining valid GFWAPI
      credentials
generator:
  version: 1
covers:
  - symbol: transformRequest
    kind: function
    at: 'apps/port-labeler/src/features/map/Map.tsx:L25-L36'
  - symbol: handleError
    kind: function
    at: 'apps/port-labeler/src/features/map/Map.tsx:L38-L42'
  - symbol: MapWrapper
    kind: function
    at: 'apps/port-labeler/src/features/map/Map.tsx:L44-L104'
  - symbol: UserState
    kind: interface
    at: 'apps/port-labeler/src/features/user/user.slice.ts:L14-L18'
  - symbol: selectUserData
    kind: function
    at: 'apps/port-labeler/src/features/user/user.slice.ts:L85-L85'
  - symbol: selectUserStatus
    kind: function
    at: 'apps/port-labeler/src/features/user/user.slice.ts:L86-L86'
  - symbol: selectUserLogged
    kind: function
    at: 'apps/port-labeler/src/features/user/user.slice.ts:L87-L87'
  - symbol: selectIsGFWUser
    kind: function
    at: 'apps/port-labeler/src/features/user/user.slice.ts:L88-L89'
---

<!-- context:generated:start -->

## Summary

Pattern where transformRequest intercepts MapLibre tile requests to inject Bearer token authorization for GFW-hosted tiles; GFWAPI.refreshAPIToken() is called on 401 responses to maintain session validity. Assumes GFWAPI.token is always available and constrains map tile layers to require authentication, with fallback to guest user if login fails.

## Related

- depends on [[user-authentication-permissions]] — Token refresh logic depends on user slice maintaining valid GFWAPI credentials

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
