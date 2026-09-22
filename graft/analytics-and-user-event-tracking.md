---
name: Analytics and User Event Tracking
slug: analytics-and-user-event-tracking
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/LayerSwitch.tsx
    hash: 11822d8b30adcdb23d8299bdcc125eb0de393c3dd80fa389b0e3a3b42c792741
  - path: apps/platform/features/_map/workspace/shared/MapLegend.tsx
    hash: 02d795116a2c2e7f245638965d172e7f8a158c187d68876648cb7205389b0799
  - path: apps/platform/features/_map/workspace/vessels/VesselInfoCorrection.tsx
    hash: fefe01582d4133fc9e2b121a5b3d3e59841c08a73eb74f1f8fb06a6e17d8c739
sources_digest: a0aa6d8f9078daae5da05b90d00f8af9f60b555e8c7b89eb5360cc507e70a6c4
links: []
generator:
  version: 1
covers:
  - symbol: LayerSwitchProps
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerSwitch.tsx:L10-L18'
  - symbol: LayerSwitch
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerSwitch.tsx:L20-L57'
  - symbol: onToggleLayerActive
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerSwitch.tsx:L33-L44'
  - symbol: LegendScale
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/MapLegend.tsx:L22-L27'
  - symbol: getLegendLabelTranslated
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/MapLegend.tsx:L29-L55'
  - symbol: MapLegendWrapper
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/MapLegend.tsx:L57-L171'
  - symbol: VesselInfoCorrection
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselInfoCorrection.tsx:L12-L37
---

<!-- context:generated:start -->

## Summary

Hooks and utilities (useRefreshClickedEvent, trackEvent, analytics.hooks) that instrument user interactions across the workspace, emitting events for layer visibility toggles, legend filter brush interactions, vessel group operations, and dataset upload/draw actions. Provides granular tracking labels and integrates with external analytics platform via dispatch.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
