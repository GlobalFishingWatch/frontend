---
name: Responsive Layout Pattern
slug: responsive-layout-pattern
type: concept
sources:
  - path: apps/platform/hooks/screen.hooks.ts
    hash: dc07070e5b5b07e7d77c8ebb29fe2651140bb998bd9958a963c2c78910f93ba1
sources_digest: a1a7647619570d754148227f1f4ca09c8e8dd66d85877370bf34894219d84a02
links:
  - to: layout-system
    relation: uses
    description: MapLayout and PlatformNav adapt their rendering based on screen size
  - to: navigation-system
    relation: uses
    description: >-
      PlatformNav disables hover expansion and uses toggle button on small
      screens
generator:
  version: 1
covers:
  - symbol: useDownloadDomElementAsImage
    kind: function
    at: 'apps/platform/hooks/screen.hooks.ts:L7-L114'
  - symbol: useOnScreen
    kind: function
    at: 'apps/platform/hooks/screen.hooks.ts:L116-L139'
  - symbol: useScreenDPI
    kind: function
    at: 'apps/platform/hooks/screen.hooks.ts:L141-L159'
---

<!-- context:generated:start -->

## Summary

Conditional UI rendering based on screen breakpoints via useSmallScreen hook. Navigation switches from hover-based expansion to toggle buttons on mobile, modals and panels adapt width/positioning, and content layers adjust spacing for compact screens.

## Related

- uses [[layout-system]] — MapLayout and PlatformNav adapt their rendering based on screen size
- uses [[navigation-system]] — PlatformNav disables hover expansion and uses toggle button on small screens

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
