---
name: Dataview Configuration & Layer Rendering
slug: dataview-configuration-layer-rendering
type: concept
sources:
  - path: libs/api-types/src/dataviews.ts
    hash: 8ac5cf4407cfdd56198a347dbe8dd3b5e60c74f10521bda4772fcab13a88459b
sources_digest: 753c78b1f4920d59e7f20ba4db8006939ae837a4ecf5f165a5371ed7fead15e5
links:
  - to: api-types-type-definitions
    relation: part_of
    description: >-
      Dataview configuration schema is central to workspace and visualization
      subsystems
generator:
  version: 1
covers:
  - symbol: ColorCyclingType
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L6-L6'
  - symbol: FilterOperator
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L9-L9'
  - symbol: FilterOperators
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L10-L10'
  - symbol: DataviewType
    kind: enum
    at: 'libs/api-types/src/dataviews.ts:L13-L45'
  - symbol: DataviewContexLayerConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L47-L50'
  - symbol: FourwingsGeolocation
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L52-L52'
  - symbol: ClusterMaxZoomLevelConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L55-L55'
  - symbol: DataviewConfigVessel
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L57-L82'
  - symbol: DataviewConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L84-L169'
  - symbol: DataviewDatasetConfigParam
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L171-L174'
  - symbol: DataviewDatasetFilter
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L178-L178'
  - symbol: DatasetsMigration
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L179-L179'
  - symbol: DataviewDatasetConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L180-L187'
  - symbol: DataviewCreation
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L189-L195'
  - symbol: DataviewInfoConfigField
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L197-L202'
  - symbol: DataviewInfoConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L204-L206'
  - symbol: DataviewEventsConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L208-L212'
  - symbol: IncomatibleFilterConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L214-L219'
  - symbol: DataviewFiltersConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L221-L225'
  - symbol: DataviewCategory
    kind: enum
    at: 'libs/api-types/src/dataviews.ts:L228-L244'
  - symbol: Dataview
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L247-L265'
  - symbol: DataviewInstanceOrigin
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L267-L267'
  - symbol: DataviewInstance
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L270-L279'
---

<!-- context:generated:start -->

## Summary

Dataview types separate canonical server-side definition (Dataview with immutable identity/metadata) from runtime user customization (DataviewInstance with origin provenance: workspace, vesselProfile, report, comparison). DataviewConfig offers 40+ optional properties configuring color ramps, temporal intervals, filters, zoom clustering. DataviewType enum determines deck.gl layer classes (FourwingsTileCluster, HeatmapAnimated, Track, polygon). DataviewCategory enables workspace organization by domain. Filter configuration through DataviewDatasetFilter stores raw filters while filterOperators records semantics. Supports specialized domains: fourwings vector/cluster tiles, animated heatmaps with temporal aggregation, vessel tracks with gap-thresholding, user-generated geometry.

## Related

- part of [[api-types-type-definitions]] — Dataview configuration schema is central to workspace and visualization subsystems

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
