---
name: Authentication & Session State
slug: authentication-session-state
type: concept
sources:
  - path: apps/platform-e2e/src/tests/LoginFlow.e2e.spec.ts
    hash: 00af142164291708db8241d71dccbe2870b74daf554f27c3e3d69583e19c8c32
  - path: apps/platform/client.tsx
    hash: d1e8700aab075fe18de07230a9c9dad286d694b2def3d4fac0aa6d429be6f361
sources_digest: 474f91f0d86964ee96119890cbcbc1bdf08cea979196cf21ee94ce83a342b20c
links:
  - to: e2e-test-suite
    relation: validates
    description: >-
      LoginFlow.e2e.spec.ts exercises all major authentication workflows
      including single sign-on, logout, token refresh, cross-tab sync, and
      gateway SSO integration
  - to: platform-client-initialization
    relation: implements
    description: >-
      Client.tsx wires GFWAPI auth functions (refreshTokenServerFn,
      clearAuthCookiesServerFn) to handle storage-based token refresh and cookie
      invalidation
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Multi-tab session synchronization via storage events with access/refresh token lifecycle management. Key invariants: refresh tokens trigger automatic access token rotation when expired; cross-tab logout must clear gateway SSO session; guest-mode fallback when auth state is lost; concurrent token refreshes within a grace window must be serialized to avoid duplication.

## Related

- validates [[e2e-test-suite]] — LoginFlow.e2e.spec.ts exercises all major authentication workflows including single sign-on, logout, token refresh, cross-tab sync, and gateway SSO integration
- implements [[platform-client-initialization]] — Client.tsx wires GFWAPI auth functions (refreshTokenServerFn, clearAuthCookiesServerFn) to handle storage-based token refresh and cookie invalidation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
