---
name: Map Popup System
slug: map-popup-system
type: system
sources:
  - path: apps/platform/features/_map/map/popups/activity/ActivityTooltipRow.tsx
    hash: 507fcb89b1ca5a93f3a1ad6f12bcc6002382483ef6ef8d076e4b2c613829a528
  - path: apps/platform/features/_map/map/popups/activity/ComparisonTooltipRow.tsx
    hash: 0d1dbc9c92470eeeb1a554dd4e87e3fa8798585b31763a6d26b88a59768b2ec6
  - path: apps/platform/features/_map/map/popups/activity/DetectionsTooltipRow.tsx
    hash: fe44cfb6add88f9b7193519b69245723ddfe107f146c5925fe9038d3f96bdcf6
  - path: apps/platform/features/_map/map/popups/activity/DetectionThumbnail.tsx
    hash: 8866274f2118c3dd5dbb1b13e60745656d0c6b5a40634d74eba460b69f3d8165
  - path: apps/platform/features/_map/map/popups/activity/PositionsTooltipRow.tsx
    hash: 19afded1a83f604ea02de89ecde413e683900a03e68b938eea01e51c4b5202ca
  - path: >-
      apps/platform/features/_map/map/popups/activity/PositionsTooltipSection.tsx
    hash: 7aab5d28b485cc7874076054dd1f25a6558b7b43ee4e840b95921d895479acfe
  - path: >-
      apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts
    hash: 0a75d62e5bd5028ecf62a2a282343fef4acc85f392d8ff7a244cacb6db7863bf
  - path: apps/platform/features/_map/map/popups/user/UserPointsTooltipSection.tsx
    hash: a0b9b55d7ebe8a64f35e4e5bf6fe836ab10fc657c7f306c93660bb4a3dca46a4
  - path: apps/platform/features/_map/map/popups/user/UserTracksTooltipSection.tsx
    hash: 8619bd4e73018a937c0eea57c016bdd1142da37df86b26c76bafc1deec63c536
  - path: >-
      apps/platform/features/_map/map/popups/vessels/VesselEventsTooltipSection.tsx
    hash: 6c7a7f2c3c494f282a88335f97b99548792d9f80ced722cc806cc8b5736e1357
  - path: apps/platform/features/_map/map/popups/vessels/VesselGroupTooltipRow.tsx
    hash: 1d62c869165f9a0af80b17cc5d90ab18bd73cb164395c9739dbe993fb8fa8be6
  - path: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx
    hash: 8735f9853eef7c021109c8cd2011809b2d8bc4ef9a15e4d71f68eaaa0110ef57
sources_digest: dd332ae5a3fb8b7ea761c710c9b1d24a8245b99b66c53cf31ff31fbac4b99398
links:
  - to: dataviews-datasets-state
    relation: depends_on
    description: >-
      All popup sections query Redux selectors (selectCustomUserDataviews,
      selectVesselsDataviews, selectActiveVesselsDataviews) to retrieve layer
      metadata and dataset labels
  - to: feature-grouping-pattern
    relation: implements
    description: >-
      All sections use groupBy from es-toolkit to organize features by
      layerId/vesselId, then render PopupSectionLayout +
      ContextTooltipRow/EventDescription rows
  - to: map-interaction-feature-picking
    relation: depends_on
    description: >-
      Displays results from fetchHeatmapInteractionThunk and
      fetchClusterEventThunk
  - to: map-interaction-hooks
    relation: uses
    description: >-
      Popup components integrate with useContextInteractions, useMapFitBounds,
      and useTimerangeConnect to handle click events, navigation, and time
      filtering
  - to: map-view-state-management
    relation: uses
    description: >-
      Area tooltips use viewport projection and bounds checking to fit areas in
      view
  - to: track-correction-workflow
    relation: uses
    description: >-
      VesselTracksTooltipSection integrates 'Log An Issue' button tied to
      track-correction module for issue reporting in Turning Tides workspaces
generator:
  version: 1
covers:
  - symbol: ActivityTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/activity/ActivityTooltipRow.tsx:L17-L23
  - symbol: FeatureUnit
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/activity/ActivityTooltipRow.tsx:L25-L25
  - symbol: ActivityTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/ActivityTooltipRow.tsx:L27-L86
  - symbol: ComparisonTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/activity/ComparisonTooltipRow.tsx:L12-L15
  - symbol: ComparisonTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/ComparisonTooltipRow.tsx:L16-L42
  - symbol: DetectionThumbnailProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/activity/DetectionThumbnail.tsx:L10-L15
  - symbol: stretchHistogram
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/DetectionThumbnail.tsx:L19-L60
  - symbol: drawEnhancedImageToCanvas
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/DetectionThumbnail.tsx:L62-L197
  - symbol: DetectionThumbnail
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/DetectionThumbnail.tsx:L199-L253
  - symbol: draw
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/DetectionThumbnail.tsx:L205-L211
  - symbol: DetectionsTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/activity/DetectionsTooltipRow.tsx:L19-L24
  - symbol: DetectionsTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/DetectionsTooltipRow.tsx:L26-L104
  - symbol: PositionsTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/activity/PositionsTooltipRow.tsx:L45-L52
  - symbol: getThumbnailBand
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/PositionsTooltipRow.tsx:L55-L59
  - symbol: isRGBThumbnail
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/PositionsTooltipRow.tsx:L61-L61
  - symbol: DetectionThumbnails
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/PositionsTooltipRow.tsx:L63-L112
  - symbol: PositionsTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/PositionsTooltipRow.tsx:L114-L317
  - symbol: renderShipname
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/PositionsTooltipRow.tsx:L185-L221
  - symbol: renderVesselPin
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/PositionsTooltipRow.tsx:L223-L245
  - symbol: renderSearchLink
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/PositionsTooltipRow.tsx:L247-L273
  - symbol: PositionsTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/activity/PositionsTooltipSection.tsx:L19-L24
  - symbol: PositionsTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/PositionsTooltipSection.tsx:L26-L100
  - symbol: getIconProps
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/PositionsTooltipSection.tsx:L40-L47
  - symbol: getTitle
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/activity/PositionsTooltipSection.tsx:L50-L55
  - symbol: TooltipCategory
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts:L49-L49
  - symbol: TooltipSparklineOption
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts:L51-L56
  - symbol: useAreaTooltipSparklineCategory
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts:L58-L95
  - symbol: useAreaRowExpansion
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts:L97-L115
  - symbol: isLonRangeContained
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts:L117-L125
  - symbol: useAreaDetail
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts:L127-L148
  - symbol: useAreaInViewport
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts:L150-L180
  - symbol: useFitAreaBounds
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts:L182-L221
  - symbol: AreaTooltipTimeseries
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts:L223-L228
  - symbol: useAreaTooltipTimeseries
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts:L230-L317
  - symbol: run
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts:L281-L302
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
  - symbol: VesselGroupTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselGroupTooltipRow.tsx:L13-L17
  - symbol: VesselGroupTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselGroupTooltipRow.tsx:L19-L47
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
---

<!-- context:generated:start -->

## Summary

Renders context-aware popups and tooltips showing activity, detection, position, and area-based information when users interact with map features. Populates from picking-object enrichment (fetchHeatmapInteractionThunk, fetchClusterEventThunk), displays vessel tables with filtered matches, handles image thumbnail rendering with histogram stretching for 8-bit and 16-bit PNG decoding, and manages expansion state for detailed views. Structures tooltips via PopupSectionLayout with specialized row components (ActivityTooltipRow, DetectionsTooltipRow, PositionsTooltipRow, ComparisonTooltipRow). Includes area tooltip timeseries sparklines computed by polygon-based cell filtering.

## Related

- depends on [[dataviews-datasets-state]] — All popup sections query Redux selectors (selectCustomUserDataviews, selectVesselsDataviews, selectActiveVesselsDataviews) to retrieve layer metadata and dataset labels
- implements [[feature-grouping-pattern]] — All sections use groupBy from es-toolkit to organize features by layerId/vesselId, then render PopupSectionLayout + ContextTooltipRow/EventDescription rows
- depends on [[map-interaction-feature-picking]] — Displays results from fetchHeatmapInteractionThunk and fetchClusterEventThunk
- uses [[map-interaction-hooks]] — Popup components integrate with useContextInteractions, useMapFitBounds, and useTimerangeConnect to handle click events, navigation, and time filtering
- uses [[map-view-state-management]] — Area tooltips use viewport projection and bounds checking to fit areas in view
- uses [[track-correction-workflow]] — VesselTracksTooltipSection integrates 'Log An Issue' button tied to track-correction module for issue reporting in Turning Tides workspaces

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
