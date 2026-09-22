---
name: Timebar UI & Data Filtering
slug: timebar-ui-data-filtering
type: system
sources:
  - path: apps/track-labeler/src/features/timebar/selector/Selector.tsx
    hash: a04a0c62f23c900a5f42a64faa0999c6a39a63a7f63575ae4d8e3f701d37ec3f
  - path: apps/track-labeler/src/features/timebar/timebar.hooks.ts
    hash: ff368cee5d1e43e34af9b551176efa2c4fa4ad93d3585f56098bd52e6e398d80
  - path: apps/track-labeler/src/features/timebar/timebar.selectors.ts
    hash: 6a4babe5dda015999ad2079bad04af1a51360078239f6ea47bcea945d571420e
  - path: apps/track-labeler/src/features/timebar/timebar.slice.ts
    hash: ad17a22f1cf387274509d0e3704147242dbcfb3f40a5d926ad90bba818ffeaa7
  - path: apps/track-labeler/src/features/timebar/Timebar.tsx
    hash: 06eb401427cec04a6830e582a105d6cf02a449b32854669413fedc6c6de0e0fd
  - path: apps/track-labeler/src/features/timebar/timebar.utils.tsx
    hash: d57e8eebf16147bfe0820b0814045a238c3052f4c040122cc8fae87e19dd65e7
  - path: apps/track-labeler/src/features/timebar/VesselEventsPointsGraphDeckGL.tsx
    hash: 2133fb84e9730d7a10f953906d038c5011c864a695e08d710cc6a36922217e5a
sources_digest: 3fafc5cfe16d391f60ec627f62ddcf7d74df71006a5669d649cf64f2e559384e
links:
  - to: map-rendering-visualization-layer
    relation: uses
    description: >-
      Map reads selectHighlightedTime to highlight points; timebar updates via
      dispatchHighlightedTime in sidebar interactions.
  - to: segment-labeling-track-annotation
    relation: uses
    description: >-
      useSegmentsLabeledConnect in timebar.hooks implements two-click segment
      creation; click timestamps flow to Redux via
      setSelectedTrack/addSelectedTrack.
  - to: vessel-track-data-loading-transformation
    relation: uses
    description: >-
      Timebar selectors (selectTracksGraphs, selectVesselDirectionPoints) derive
      filtered track data via tracks.selectors.
generator:
  version: 1
covers:
  - symbol: DayNightTimebarLayer
    kind: function
    at: 'apps/track-labeler/src/features/timebar/Timebar.tsx:L38-L72'
  - symbol: TimebarWrapper
    kind: function
    at: 'apps/track-labeler/src/features/timebar/Timebar.tsx:L75-L315'
  - symbol: handleSpeedChange
    kind: function
    at: 'apps/track-labeler/src/features/timebar/Timebar.tsx:L122-L124'
  - symbol: handleElevationChange
    kind: function
    at: 'apps/track-labeler/src/features/timebar/Timebar.tsx:L125-L127'
  - symbol: handleDistanceFromPortChange
    kind: function
    at: 'apps/track-labeler/src/features/timebar/Timebar.tsx:L128-L130'
  - symbol: handleTimeChange
    kind: function
    at: 'apps/track-labeler/src/features/timebar/Timebar.tsx:L131-L133'
  - symbol: getGradientColor
    kind: function
    at: >-
      apps/track-labeler/src/features/timebar/VesselEventsPointsGraphDeckGL.tsx:L27-L52
  - symbol: VesselEventsPointsGraphDeckGL
    kind: function
    at: >-
      apps/track-labeler/src/features/timebar/VesselEventsPointsGraphDeckGL.tsx:L54-L194
  - symbol: getActionColor
    kind: function
    at: >-
      apps/track-labeler/src/features/timebar/VesselEventsPointsGraphDeckGL.tsx:L101-L104
  - symbol: TimebarSelector
    kind: function
    at: 'apps/track-labeler/src/features/timebar/selector/Selector.tsx:L19-L96'
  - symbol: onGearClick
    kind: function
    at: 'apps/track-labeler/src/features/timebar/selector/Selector.tsx:L29-L29'
  - symbol: onSelectColor
    kind: function
    at: 'apps/track-labeler/src/features/timebar/selector/Selector.tsx:L33-L36'
  - symbol: onRemoveColor
    kind: function
    at: 'apps/track-labeler/src/features/timebar/selector/Selector.tsx:L37-L39'
  - symbol: useTimerangeConnect
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L24-L94'
  - symbol: useTimebarModeConnect
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L96-L114'
  - symbol: dispatchTimebarMode
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L101-L102'
  - symbol: dispatchFilterMode
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L103-L104'
  - symbol: dispatchColorMode
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L105-L105'
  - symbol: useSegmentsLabeledConnect
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L116-L294'
  - symbol: createNewSegment
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L128-L166'
  - symbol: handleSegmentOverlap
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L168-L244'
  - symbol: onEventPointClick
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L246-L287'
  - symbol: TimebarSlice
    kind: type
    at: 'apps/track-labeler/src/features/timebar/timebar.slice.ts:L6-L20'
  - symbol: selectHighlightedTime
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.slice.ts:L59-L59'
  - symbol: selectHighlightedEvent
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.slice.ts:L60-L60'
  - symbol: selectTooltip
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.slice.ts:L61-L61'
  - symbol: getIsOutOfFilterRange
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.utils.tsx:L6-L19'
  - symbol: getTimebarPoints
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.utils.tsx:L21-L49'
  - symbol: getMaxMinVesselPointsByProperty
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.utils.tsx:L51-L59'
---

<!-- context:generated:start -->

## Summary

Interactive timeline component with multi-dimensional filtering controls (speed, elevation, distance-from-port, hours-of-day) and day-night cycle visualization overlays. TimebarWrapper orchestrates the @globalfishingwatch/timebar Timebar component with range sliders, vessel event scatterplot layer, and keyboard navigation (Shift+arrows). Filter state is synchronized with query parameters; timebar.slice Redux reducer manages hover highlighting (highlightedTime, highlightedEvent). A critical design: local throttled timerange state decouples UI responsiveness from Redux updates at 200ms intervals.

## Related

- uses [[map-rendering-visualization-layer]] — Map reads selectHighlightedTime to highlight points; timebar updates via dispatchHighlightedTime in sidebar interactions.
- uses [[segment-labeling-track-annotation]] — useSegmentsLabeledConnect in timebar.hooks implements two-click segment creation; click timestamps flow to Redux via setSelectedTrack/addSelectedTrack.
- uses [[vessel-track-data-loading-transformation]] — Timebar selectors (selectTracksGraphs, selectVesselDirectionPoints) derive filtered track data via tracks.selectors.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
