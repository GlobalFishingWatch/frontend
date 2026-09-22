---
name: Router State Integration
slug: router-state-integration
type: concept
sources:
  - path: apps/platform/features/layouts/MapLayout.tsx
    hash: e01e7d45c26fb64ff77f6b186770a86d3f43915173a9da0c40ead387fc69dbb0
  - path: apps/platform/features/layouts/MapMainLayout.tsx
    hash: f26a843e332d5fa5f827decedc626c05e779fbb743bdbf498cd9b2af0d1a8013
  - path: apps/platform/features/nav/nav.hooks.ts
    hash: 0a8ab7b144796e374e1ecc575c140b47b6509d0792df7ba1e1caad964e040770
sources_digest: 4c21d42d6173df07f09bbb098bc3c446eea1f467f9ac6785fc5ff436a9af26a6
links: []
generator:
  version: 1
covers:
  - symbol: Window
    kind: interface
    at: 'apps/platform/features/layouts/MapLayout.tsx:L43-L45'
  - symbol: MapLayout
    kind: function
    at: 'apps/platform/features/layouts/MapLayout.tsx:L50-L151'
  - symbol: Main
    kind: function
    at: 'apps/platform/features/layouts/MapMainLayout.tsx:L29-L78'
  - symbol: useOpenFeedbackModal
    kind: function
    at: 'apps/platform/features/nav/nav.hooks.ts:L38-L47'
  - symbol: useNavLinkContext
    kind: function
    at: 'apps/platform/features/nav/nav.hooks.ts:L50-L112'
  - symbol: useIsNavItemActive
    kind: function
    at: 'apps/platform/features/nav/nav.hooks.ts:L115-L150'
---

<!-- context:generated:start -->

## Summary

TanStack Router-based navigation state (current location, route name, workspace context) determines which UI sections render and which modals display. Route selectors disambiguate landing, user, workspace, search, and report locations to gate layout composition, using getRouteApi and useRouterState for navigation sync.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
