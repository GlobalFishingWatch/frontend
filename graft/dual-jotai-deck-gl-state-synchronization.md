---
name: Dual Jotai + Deck.gl State Synchronization
slug: dual-jotai-deck-gl-state-synchronization
type: concept
sources:
  - path: apps/platform/features/_map/map/map-view-state.hooks.ts
    hash: d1dea139e33c00f17c89ff2c412bbfb0a82d666e67c3d81844b3cb8823eb5165
sources_digest: 7371eef77a55209d63823a63f575a19c830dd5e2fa641f71d2d5dc29c810e06d
links:
  - to: map-view-state-management
    relation: implements
    description: Dual-update pattern is core to view state synchronization strategy
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

View state updates require dual calls: Jotai setter for application state + deck.setProps() for deck.gl internal state. Necessary quirk for correct view propagation despite apparent redundancy. Critical invariant: both must be called in order (Jotai first, then deck.setProps) to maintain consistency—missing either call causes viewport lag or state divergence. Throttled at 1ms intervals to avoid excessive updates.

## Related

- implements [[map-view-state-management]] — Dual-update pattern is core to view state synchronization strategy

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
