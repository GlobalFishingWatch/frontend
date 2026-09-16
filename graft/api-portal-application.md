---
name: API Portal Application
slug: api-portal-application
type: system
sources:
  - path: apps/api-portal/eslint.config.js
    hash: 7e22e29146cdc143db6ff08c2f585c9a112e6058fde5483d66cfd203cc13337c
  - path: apps/api-portal/index.d.ts
    hash: cb8404cf28c220e46273d00d2c202e0e8029902c49b6c20d666503b78604804f
  - path: apps/api-portal/src/app.tsx
    hash: 44ccb3911cfdd2000f956a166b963d3a6e4ed808b9f6dd4012a6f161a6f5ec8c
  - path: apps/api-portal/src/index.tsx
    hash: 0653214603fd5729f4ef48303777773753a3d0eea5f3368dbebee07284f63831
sources_digest: c457acbf994e82a1b1f4bc6e5af48ddbef55824eda6fbd43459c72fc2e749444
links:
  - to: access-token-management-ui
    relation: uses
    description: App wraps routed components that render token creation and list interfaces
  - to: api-portal-routing
    relation: uses
    description: >-
      Bootstrap App component configures TanStack Router with routeTree and
      QueryClientProvider
  - to: svg-module-support
    relation: configures
    description: >-
      TypeScript declarations enable SVG imports as React components and raw
      assets
  - to: user-authentication-profile
    relation: depends_on
    description: >-
      useUser hook provides authorization and profile completion state checked
      at entry
generator:
  version: 1
covers:
  - symbol: Register
    kind: interface
    at: 'apps/api-portal/src/app.tsx:L17-L19'
  - symbol: App
    kind: function
    at: 'apps/api-portal/src/app.tsx:L22-L30'
---

<!-- context:generated:start -->

## Summary

A React application for managing Global Fishing Watch API access tokens and user account settings. It provides token creation/deletion workflows, enforces profile completion before API access, and integrates authentication with TanStack Router and React Query.

## Related

- uses [[access-token-management-ui]] — App wraps routed components that render token creation and list interfaces
- uses [[api-portal-routing]] — Bootstrap App component configures TanStack Router with routeTree and QueryClientProvider
- configures [[svg-module-support]] — TypeScript declarations enable SVG imports as React components and raw assets
- depends on [[user-authentication-profile]] — useUser hook provides authorization and profile completion state checked at entry

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
