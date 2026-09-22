---
name: Area Tooltip Timeseries Computation
slug: area-tooltip-timeseries-computation
type: concept
sources:
  - path: >-
      apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts
    hash: 0a75d62e5bd5028ecf62a2a282343fef4acc85f392d8ff7a244cacb6db7863bf
sources_digest: ff20eb71c41d26ace2abaabb87f2fa572d0fe25e257fa597f4a401c7271bf8a0
links:
  - to: map-popup-system
    relation: implements
    description: Timeseries computation is specialized feature for area-specific popups
generator:
  version: 1
covers:
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
---

<!-- context:generated:start -->

## Summary

Area tooltips compute sparkline timeseries by filtering deck-layer cells within polygon geometry using polygon-based cell worker. Supports both FourwingsLayer and UserTracksLayer cells, handles longitude wraparound for world-spanning geometries via isLonRangeContained check. Uses closure-flag cancellation to handle concurrent computations and computedAreaRef latch to memoize results—prevents redundant recalculation when layers or time range unchanged. Critical invariant: sparklines must remain visible during map panning but reset when tooltip rows close, requiring careful state lifecycle management.

## Related

- implements [[map-popup-system]] — Timeseries computation is specialized feature for area-specific popups

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
