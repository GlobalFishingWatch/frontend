---
name: Login Source Tracking & Analytics
slug: login-source-tracking-analytics
type: concept
sources:
  - path: apps/platform/features/_user/LoginLink.tsx
    hash: f8cb63c2838633f05832b8c0f38794c263ac3652a06f168846f6b37e74b80b5a
  - path: apps/platform/features/_user/user.slice.ts
    hash: dc4628bba5d3ef124fbaad479bbeeed8049e83fe262c682e21b2a048c85118c3
  - path: apps/platform/features/_user/user.types.ts
    hash: fcbd0d5166a5114bce1dc6e11f1d5c493ad2fd8e0847b3f81c4079012cac356b
sources_digest: 79507237eaacb576f80bb5e4d06e008e618704ce974b145e9b664839335a5698
links:
  - to: login-ui-components
    relation: part_of
    description: >-
      LoginSource tracking is embedded in LoginLink click handlers and
      setLoginSource dispatches
generator:
  version: 1
covers:
  - symbol: LoginLinkProps
    kind: type
    at: 'apps/platform/features/_user/LoginLink.tsx:L12-L18'
  - symbol: LoginLink
    kind: function
    at: 'apps/platform/features/_user/LoginLink.tsx:L20-L55'
  - symbol: UserSettings
    kind: interface
    at: 'apps/platform/features/_user/user.slice.ts:L16-L18'
  - symbol: UserState
    kind: interface
    at: 'apps/platform/features/_user/user.slice.ts:L20-L27'
  - symbol: LoginSource
    kind: type
    at: 'apps/platform/features/_user/user.types.ts:L1-L27'
---

<!-- context:generated:start -->

## Summary

LoginSource enum (user.types) enumerates all platform features that can trigger authentication (vessel tracking, reports, layers, drawing, workspace ops, etc). setLoginSource action stores the source in Redux; LoginLink dispatches it before opening popup login; trackEvent records where login attempts originate for UX analytics.

## Related

- part of [[login-ui-components]] — LoginSource tracking is embedded in LoginLink click handlers and setLoginSource dispatches

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
