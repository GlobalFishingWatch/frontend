---
name: Redux Caching Pattern
slug: redux-caching-pattern
type: concept
sources:
  - path: apps/platform/features/_map/timebar/timebar-vessel.hooks.ts
    hash: 9b1135711041abf77b6acdf9061370eb384d73a37e0c1c0d9dea50e60a297540
  - path: apps/platform/features/_map/timebar/timebar.hooks.ts
    hash: dedd5e051a654491d75bfd458869e16846c3872006188b89bab928d55840f24c
sources_digest: 910be5ea44e152c86d19d84feb8144425cbe503b7ad68cc0cc54179619f6651d
links:
  - to: timebar-component-visualization
    relation: uses
    description: >-
      Timebar component calls useTimebarVesselTracksData to access cached vessel
      tracks via Jotai atom subscription
  - to: timebar-data-connections
    relation: uses
    description: >-
      Hooks access deckHoverInteractionAtom from Jotai to read deck layer hover
      state without pulling it into Redux
  - to: timebar-data-fetching-hooks
    relation: implements
    description: >-
      useTimebarVesselTracks, useTimebarVesselTracksGraph,
      useTimebarVesselEvents export Jotai atoms and cache computed data to avoid
      recalculation
generator:
  version: 1
covers:
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
  - symbol: useDisableHighlightTimeConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L44-L55'
  - symbol: useHighlightedEventsConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L57-L93'
  - symbol: useTimebarVisualisationConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L95-L116'
  - symbol: useTimebarEnvironmentConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L118-L133'
  - symbol: useTimebarUserPointsConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L135-L150'
  - symbol: useTimebarVesselGroupConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L152-L164'
  - symbol: useTimebarGraphConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L166-L180'
  - symbol: useTimebarVisualisation
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L184-L265'
---

<!-- context:generated:start -->

## Summary

A design pattern using Jotai atoms (vesselTracksAtom, vesselTracksGraphAtom) to cache expensive computation results (vessel track data, graph extents) globally outside Redux. Hooks subscribe to these atoms to avoid recalculating on every re-render while maintaining centralized state.

## Related

- uses [[timebar-component-visualization]] — Timebar component calls useTimebarVesselTracksData to access cached vessel tracks via Jotai atom subscription
- uses [[timebar-data-connections]] — Hooks access deckHoverInteractionAtom from Jotai to read deck layer hover state without pulling it into Redux
- implements [[timebar-data-fetching-hooks]] — useTimebarVesselTracks, useTimebarVesselTracksGraph, useTimebarVesselEvents export Jotai atoms and cache computed data to avoid recalculation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
