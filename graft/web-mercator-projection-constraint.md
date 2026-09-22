---
name: Web Mercator Projection Constraint
slug: web-mercator-projection-constraint
type: concept
sources:
  - path: apps/platform/features/_map/map/map-view-state.hooks.ts
    hash: d1dea139e33c00f17c89ff2c412bbfb0a82d666e67c3d81844b3cb8823eb5165
sources_digest: 7371eef77a55209d63823a63f575a19c830dd5e2fa641f71d2d5dc29c810e06d
links:
  - to: map-view-state-management
    relation: implements
    description: Web Mercator constraints are enforced in view state management layer
generator:
  version: 1
covers:
  - symbol: getSafeViewState
    kind: function
    at: 'apps/platform/features/_map/map/map-view-state.hooks.ts:L9-L28'
  - symbol: useMapSetViewState
    kind: function
    at: 'apps/platform/features/_map/map/map-view-state.hooks.ts:L30-L39'
  - symbol: useSetMapCoordinates
    kind: function
    at: 'apps/platform/features/_map/map/map-view-state.hooks.ts:L43-L60'
---

<!-- context:generated:start -->

## Summary

Enforces latitude bounds of ±85.051129° to prevent mathematical singularities at poles in Web Mercator projection. Applied via getSafeViewState utility that clamps viewport coordinates before Jotai/deck.gl updates. Critical invariant: latitude must never exceed these bounds, enforced at every state mutation entry point to maintain map stability.

## Related

- implements [[map-view-state-management]] — Web Mercator constraints are enforced in view state management layer

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
