---
name: Dataviews & Datasets State
slug: dataviews-datasets-state
type: concept
sources:
  - path: apps/platform/features/_map/map/popups/user/UserPointsTooltipSection.tsx
    hash: a0b9b55d7ebe8a64f35e4e5bf6fe836ab10fc657c7f306c93660bb4a3dca46a4
  - path: apps/platform/features/_map/map/popups/user/UserTracksTooltipSection.tsx
    hash: 8619bd4e73018a937c0eea57c016bdd1142da37df86b26c76bafc1deec63c536
  - path: >-
      apps/platform/features/_map/map/popups/vessels/VesselEventsTooltipSection.tsx
    hash: 6c7a7f2c3c494f282a88335f97b99548792d9f80ced722cc806cc8b5736e1357
  - path: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx
    hash: 8735f9853eef7c021109c8cd2011809b2d8bc4ef9a15e4d71f68eaaa0110ef57
  - path: apps/platform/features/_map/timebar/timebar-points.hooks.ts
    hash: af2a673b82e0f9036e2c34fda564e2f29a27a746209aa020d0b83008673c7346
  - path: apps/platform/features/_map/timebar/timebar-vessel.hooks.ts
    hash: 9b1135711041abf77b6acdf9061370eb384d73a37e0c1c0d9dea50e60a297540
  - path: apps/platform/features/_map/timebar/timebar.selectors.ts
    hash: d38b0b39534d1bb89876ace8d7d1d2559bda01b4be688235b8fae7f2a10c36cb
sources_digest: 15aa5749c152003d54d17bdce5e52162d4f3b5a40c69e60e0f22ac094c1ef315
links:
  - to: map-popup-system
    relation: uses
    description: >-
      All popup sections query selectCustomUserDataviews,
      selectVesselsDataviews, selectActiveVesselsDataviews to retrieve layer
      metadata and dataset labels via getDatasetLabel
  - to: router-integration-navigation
    relation: depends_on
    description: >-
      Popup and timebar components integrate with Redux store that persists
      dataview instances, allowing them to survive route navigation
  - to: timebar-data-connections
    relation: uses
    description: >-
      Selectors compose dataviews.categories.selectors and
      dataviews.instances.selectors to compute filtered dataviews by type and
      active status
  - to: timebar-data-fetching-hooks
    relation: uses
    description: >-
      Hooks read selectTimebarUserDataviewsSelected and
      selectActiveActivityDataviewsByVisualisation to filter data by category
      and visualization mode
generator:
  version: 1
covers:
  - symbol: UserPointsTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/user/UserPointsTooltipSection.tsx:L16-L19
  - symbol: UserPointsTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/user/UserPointsTooltipSection.tsx:L21-L62
  - symbol: UserTracksTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/user/UserTracksTooltipSection.tsx:L15-L18
  - symbol: UserTracksTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/user/UserTracksTooltipSection.tsx:L20-L58
  - symbol: EventDescription
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselEventsTooltipSection.tsx:L34-L113
  - symbol: VesselEventsTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselEventsTooltipSection.tsx:L115-L118
  - symbol: VesselEventsTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselEventsTooltipSection.tsx:L120-L188
  - symbol: VesselTracksTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx:L44-L47
  - symbol: VesselTracksTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx:L49-L187
  - symbol: VesselTracksTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx:L189-L235
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
  - symbol: selectActiveActivityDataviewsByVisualisation
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.selectors.ts:L39-L89'
---

<!-- context:generated:start -->

## Summary

Redux state management for user dataviews, datasets, and their associations. This concept encapsulates selectors that retrieve active dataviews by category, dataset metadata (labels, extents), and manages the relationship between custom user layers and global visualization state.

## Related

- uses [[map-popup-system]] — All popup sections query selectCustomUserDataviews, selectVesselsDataviews, selectActiveVesselsDataviews to retrieve layer metadata and dataset labels via getDatasetLabel
- depends on [[router-integration-navigation]] — Popup and timebar components integrate with Redux store that persists dataview instances, allowing them to survive route navigation
- uses [[timebar-data-connections]] — Selectors compose dataviews.categories.selectors and dataviews.instances.selectors to compute filtered dataviews by type and active status
- uses [[timebar-data-fetching-hooks]] — Hooks read selectTimebarUserDataviewsSelected and selectActiveActivityDataviewsByVisualisation to filter data by category and visualization mode

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
