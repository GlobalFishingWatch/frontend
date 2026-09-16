---
name: Map Legend and Color-Ramp Filtering
slug: map-legend-and-color-ramp-filtering
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/MapLegend.tsx
    hash: 02d795116a2c2e7f245638965d172e7f8a158c187d68876648cb7205389b0799
  - path: apps/platform/features/_map/workspace/shared/MapLegendPlaceholder.tsx
    hash: 309fdc8b97a954a98eff3c12fba6d5261de8cb3da50f866a5892a26ffd8357ab
sources_digest: e9b1400ba7474cb542b57857d5d63d1c76dcb6d39274532dc6ca0b5ed9f0270f
links:
  - to: analytics-and-user-event-tracking
    relation: uses
    description: Tracks color-ramp brush interactions via analytics hooks
  - to: value-transformation-and-localization
    relation: uses
    description: Applies grid area formatting and unit conversions for legend labels
  - to: workspace-dataview-instance-management
    relation: uses
    description: >-
      MapLegend calls upsertDataviewInstance to persist color-ramp filter
      minVisibleValue/maxVisibleValue
generator:
  version: 1
covers:
  - symbol: LegendScale
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/MapLegend.tsx:L22-L27'
  - symbol: getLegendLabelTranslated
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/MapLegend.tsx:L29-L55'
  - symbol: MapLegendWrapper
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/MapLegend.tsx:L57-L171'
  - symbol: MapLegendPlaceholder
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/MapLegendPlaceholder.tsx:L3-L17
---

<!-- context:generated:start -->

## Summary

MapLegend and MapLegendPlaceholder components that render interactive legends for map layers fetched from deck-layer-composer. Supports three legend types (Bivariate, Symbols, Continuous) with conditional color-ramp brush UI for non-bivariate legends that filters data via upsertDataviewInstance minVisibleValue/maxVisibleValue constraints. Bivariate legends only render for sublayer index 0. Includes grid area formatting with km² unit conversion when label contains ² symbol, with staleness caching via lastScale.

## Related

- uses [[analytics-and-user-event-tracking]] — Tracks color-ramp brush interactions via analytics hooks
- uses [[value-transformation-and-localization]] — Applies grid area formatting and unit conversions for legend labels
- uses [[workspace-dataview-instance-management]] — MapLegend calls upsertDataviewInstance to persist color-ramp filter minVisibleValue/maxVisibleValue

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
