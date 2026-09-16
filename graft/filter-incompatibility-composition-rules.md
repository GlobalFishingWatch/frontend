---
name: Filter Incompatibility & Composition Rules
slug: filter-incompatibility-composition-rules
type: concept
sources:
  - path: libs/api-types/src/datasets.filters.ts
    hash: f3bee7fdec0cd566ca421c0810362b2312d80bc8fa293be1693bc206ccbafc7a
  - path: libs/api-types/src/dataviews.ts
    hash: 8ac5cf4407cfdd56198a347dbe8dd3b5e60c74f10521bda4772fcab13a88459b
sources_digest: 6eb3d31cea4ce737a6695e9dcac260c3f111f52dbcfed8a9e2653ab3ca8ea17c
links:
  - to: api-types-type-definitions
    relation: part_of
    description: >-
      Filter composition patterns ensure consistency across dataview
      configuration and dataset querying
generator:
  version: 1
covers:
  - symbol: DatasetFilterType
    kind: type
    at: 'libs/api-types/src/datasets.filters.ts:L24-L24'
  - symbol: FilterType
    kind: type
    at: 'libs/api-types/src/datasets.filters.ts:L25-L25'
  - symbol: DatasetFilterFormat
    kind: type
    at: 'libs/api-types/src/datasets.filters.ts:L26-L26'
  - symbol: DatasetFilterUnit
    kind: type
    at: 'libs/api-types/src/datasets.filters.ts:L27-L27'
  - symbol: DatasetFilterEnum
    kind: type
    at: 'libs/api-types/src/datasets.filters.ts:L28-L28'
  - symbol: DatasetFilterOperation
    kind: type
    at: 'libs/api-types/src/datasets.filters.ts:L29-L29'
  - symbol: DatasetFilter
    kind: type
    at: 'libs/api-types/src/datasets.filters.ts:L31-L47'
  - symbol: DatasetFilters
    kind: type
    at: 'libs/api-types/src/datasets.filters.ts:L49-L49'
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

DataviewFiltersConfig defines incompatibility rules between filter combinations, storing raw filter objects in DataviewDatasetFilter while filterOperators records include/exclude semantics. Prevents logically invalid filter expressions (e.g., conflicting spatial boundaries, mutually exclusive vessel types) at composition time. DatasetFilters groups filters by category allowing different dataset types to declare their supported filters in type-safe manner, enabling runtime validation and UI generation.

## Related

- part of [[api-types-type-definitions]] — Filter composition patterns ensure consistency across dataview configuration and dataset querying

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
