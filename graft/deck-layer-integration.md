---
name: Deck Layer Integration
slug: deck-layer-integration
type: concept
sources:
  - path: apps/platform/features/_map/timebar/timebar-points.hooks.ts
    hash: af2a673b82e0f9036e2c34fda564e2f29a27a746209aa020d0b83008673c7346
  - path: apps/platform/features/_map/timebar/timebar-vessel.hooks.ts
    hash: 9b1135711041abf77b6acdf9061370eb384d73a37e0c1c0d9dea50e60a297540
sources_digest: 045acc3596f7672eb81a6f92495eae3dc2c5554df7073c18baafaf1b00b5da15
links:
  - to: time-mode-real-time-state
    relation: depends_on
    description: >-
      Data fetching hooks call getGraphDataFromPoints and
      generateVesselGraphSteps from deck-layers with interval strategies
      dependent on selectIsRealTimeMode
  - to: timebar-component-visualization
    relation: depends_on
    description: >-
      Timebar depends on VesselLayer and UserTracksLayer availability for
      rendering tracks, events, and graph data
  - to: timebar-data-fetching-hooks
    relation: uses
    description: >-
      useTimebarVesselTracks, useTimebarPoints use useGetDeckLayers and
      useVesselTracksLayers to retrieve layer instances; extract segments and
      apply type guards
generator:
  version: 1
covers:
  - symbol: useTimebarPoints
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-points.hooks.ts:L29-L134'
  - symbol: isVesselLayerInstance
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L33-L34'
  - symbol: getUserTrackHighlighterLabel
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L36-L38'
  - symbol: hasUniqueChunks
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L40-L42'
  - symbol: hasTracksWithNoData
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L44-L51'
  - symbol: useVesselTracksLayers
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L53-L60'
  - symbol: useTimebarTracksLayers
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L62-L69'
  - symbol: useTimebarLayers
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L71-L79'
  - symbol: useTimebarVesselTracksData
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L82-L84'
  - symbol: TimebarChartDataProps
    kind: type
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L86-L86'
  - symbol: VesselTrackAtom
    kind: type
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L87-L87'
  - symbol: useTimebarVesselTracks
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L88-L201'
  - symbol: getTrackGraphSpeedHighlighterLabel
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L205-L206'
  - symbol: getTrackGraphElevationighlighterLabel
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L210-L211'
  - symbol: useTimebarVesselTracksGraph
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L213-L344'
  - symbol: getTrackEventHighlighterLabel
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L346-L358'
  - symbol: useTimebarVesselEvents
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-vessel.hooks.ts:L360-L416'
---

<!-- context:generated:start -->

## Summary

Dependency pattern that bridges deck-layers instances (VesselLayer, UserTracksLayer, UserPointsTileLayer from @globalfishingwatch/deck-layer-composer) with React components. Hooks fetch layer instances and extract raw features for transformation into UI data.

## Related

- depends on [[time-mode-real-time-state]] — Data fetching hooks call getGraphDataFromPoints and generateVesselGraphSteps from deck-layers with interval strategies dependent on selectIsRealTimeMode
- depends on [[timebar-component-visualization]] — Timebar depends on VesselLayer and UserTracksLayer availability for rendering tracks, events, and graph data
- uses [[timebar-data-fetching-hooks]] — useTimebarVesselTracks, useTimebarPoints use useGetDeckLayers and useVesselTracksLayers to retrieve layer instances; extract segments and apply type guards

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
