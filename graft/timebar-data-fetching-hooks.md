---
name: Timebar Data Fetching Hooks
slug: timebar-data-fetching-hooks
type: system
sources:
  - path: apps/platform/features/_map/timebar/timebar-points.hooks.ts
    hash: af2a673b82e0f9036e2c34fda564e2f29a27a746209aa020d0b83008673c7346
  - path: apps/platform/features/_map/timebar/timebar-realtime.hooks.ts
    hash: 7e0b868ae8e0f10076c5dded8f04a6105a0afa1e3f37e2ec49d4c8b07e865536
  - path: apps/platform/features/_map/timebar/timebar-vessel.hooks.ts
    hash: 9b1135711041abf77b6acdf9061370eb384d73a37e0c1c0d9dea50e60a297540
sources_digest: 1871357aa2fa995958d0858239258a93991e2c0c9b938697aa3785d92588aa0c
links:
  - to: dataviews-datasets-state
    relation: depends_on
    description: >-
      Hooks read selectTimebarUserDataviewsSelected,
      selectActiveActivityDataviewsByVisualisation to filter which datasets to
      fetch and visualize
  - to: deck-layer-integration
    relation: depends_on
    description: >-
      Hooks retrieve VesselLayer, UserTracksLayer, UserPointsTileLayer instances
      via useGetDeckLayers and deck-layer-composer utilities; extract raw
      features and apply transforms
  - to: redux-caching-pattern
    relation: implements
    description: >-
      Hooks export Jotai atoms (vesselTracksAtom, vesselTracksGraphAtom) to
      cache computed data globally, reducing recalculation on re-renders
  - to: time-mode-real-time-state
    relation: depends_on
    description: >-
      useTimebarPoints and useTimebarVesselTracks adapt interval strategies
      based on selectIsRealTimeMode and apply FOURWINGS_REAL_TIME_INTERVALS for
      real-time data
  - to: timebar-component-visualization
    relation: uses
    description: >-
      useTimebarVesselTracks, useTimebarVesselEvents, useTimebarPoints,
      useTimebarVesselTracksGraph provide chart data consumed by Timebar
      component render methods
generator:
  version: 1
covers:
  - symbol: useTimebarPoints
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-points.hooks.ts:L29-L134'
  - symbol: useRealTimeDataUpdates
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-realtime.hooks.ts:L9-L40'
  - symbol: clearTimers
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-realtime.hooks.ts:L15-L24'
  - symbol: tick
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-realtime.hooks.ts:L26-L28'
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

Custom React hooks that extract and aggregate time-series activity data from various deck layer sources (vessel tracks, points, events) into chart-ready formats. They manage data fetching, caching, and interval calculations for real-time and historical modes.

## Related

- depends on [[dataviews-datasets-state]] — Hooks read selectTimebarUserDataviewsSelected, selectActiveActivityDataviewsByVisualisation to filter which datasets to fetch and visualize
- depends on [[deck-layer-integration]] — Hooks retrieve VesselLayer, UserTracksLayer, UserPointsTileLayer instances via useGetDeckLayers and deck-layer-composer utilities; extract raw features and apply transforms
- implements [[redux-caching-pattern]] — Hooks export Jotai atoms (vesselTracksAtom, vesselTracksGraphAtom) to cache computed data globally, reducing recalculation on re-renders
- depends on [[time-mode-real-time-state]] — useTimebarPoints and useTimebarVesselTracks adapt interval strategies based on selectIsRealTimeMode and apply FOURWINGS_REAL_TIME_INTERVALS for real-time data
- uses [[timebar-component-visualization]] — useTimebarVesselTracks, useTimebarVesselEvents, useTimebarPoints, useTimebarVesselTracksGraph provide chart data consumed by Timebar component render methods

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
