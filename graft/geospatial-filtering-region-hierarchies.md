---
name: Geospatial Filtering & Region Hierarchies
slug: geospatial-filtering-region-hierarchies
type: concept
sources:
  - path: libs/api-types/src/datasets.filters.ts
    hash: f3bee7fdec0cd566ca421c0810362b2312d80bc8fa293be1693bc206ccbafc7a
  - path: libs/api-types/src/events.ts
    hash: 9c7da1a5a7b2e3fb22224195e0b2b0150ca311666ef66916d3e57d580db38b57
  - path: libs/api-types/src/geometries.ts
    hash: b2014b4601114c8261740c67f2b2f0440b4ae2b54cdd8674f05d232e89391ace
  - path: libs/api-types/src/stats.ts
    hash: 0d5ecd980182224d882fc2208511c0c67b5cce09d4a7cfae2eb24b960dd667ac
  - path: libs/api-types/src/tracks.ts
    hash: 00b21a7630c581202db8a93056ef47bf583e8c35f5b3be11056cca1340960e99
sources_digest: d1611f3044466bf8ac461b6e2a441e51534a2718881c1c99d5cc5b18bac6900c
links:
  - to: api-types-type-definitions
    relation: part_of
    description: >-
      Geospatial abstractions recur across filtering, events, stats, and track
      modules
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
  - symbol: PointCoordinate
    kind: type
    at: 'libs/api-types/src/events.ts:L1-L4'
  - symbol: RegionType
    kind: enum
    at: 'libs/api-types/src/events.ts:L6-L13'
  - symbol: Regions
    kind: type
    at: 'libs/api-types/src/events.ts:L15-L22'
  - symbol: GapPosition
    kind: type
    at: 'libs/api-types/src/events.ts:L24-L26'
  - symbol: EventTypes
    kind: enum
    at: 'libs/api-types/src/events.ts:L28-L35'
  - symbol: EventType
    kind: type
    at: 'libs/api-types/src/events.ts:L37-L37'
  - symbol: EventNextPort
    kind: type
    at: 'libs/api-types/src/events.ts:L39-L44'
  - symbol: EventVesselTypeEnum
    kind: enum
    at: 'libs/api-types/src/events.ts:L46-L49'
  - symbol: AuthorizationType
    kind: type
    at: 'libs/api-types/src/events.ts:L51-L51'
  - symbol: EventAuthorization
    kind: type
    at: 'libs/api-types/src/events.ts:L53-L56'
  - symbol: EventVesselAuthorization
    kind: type
    at: 'libs/api-types/src/events.ts:L58-L61'
  - symbol: EventVessel
    kind: type
    at: 'libs/api-types/src/events.ts:L63-L72'
  - symbol: RFMOs
    kind: type
    at: 'libs/api-types/src/events.ts:L74-L75'
  - symbol: EncounterEventAuthorizations
    kind: type
    at: 'libs/api-types/src/events.ts:L77-L84'
  - symbol: AuthorizationOptions
    kind: enum
    at: 'libs/api-types/src/events.ts:L86-L90'
  - symbol: EncounterEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L92-L117'
  - symbol: LoiteringEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L119-L124'
  - symbol: PortEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L126-L132'
  - symbol: Anchorage
    kind: type
    at: 'libs/api-types/src/events.ts:L134-L144'
  - symbol: PortVisitEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L146-L153'
  - symbol: GapEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L155-L167'
  - symbol: GapsEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L169-L174'
  - symbol: FishingEventDayNightCategory
    kind: type
    at: 'libs/api-types/src/events.ts:L176-L176'
  - symbol: LonglineFishingFields
    kind: type
    at: 'libs/api-types/src/events.ts:L179-L186'
  - symbol: FishingEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L188-L192'
  - symbol: Distances
    kind: type
    at: 'libs/api-types/src/events.ts:L194-L199'
  - symbol: ApiEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L201-L220'
  - symbol: ApiEvents
    kind: type
    at: 'libs/api-types/src/events.ts:L222-L226'
  - symbol: TileContextAreaFeatureProperties
    kind: type
    at: 'libs/api-types/src/geometries.ts:L3-L6'
  - symbol: TileContextAreaFeature
    kind: type
    at: 'libs/api-types/src/geometries.ts:L8-L18'
  - symbol: StatType
    kind: type
    at: 'libs/api-types/src/stats.ts:L1-L1'
  - symbol: StatsParams
    kind: type
    at: 'libs/api-types/src/stats.ts:L2-L2'
  - symbol: StatsIncludes
    kind: type
    at: 'libs/api-types/src/stats.ts:L3-L3'
  - symbol: StatsGroupBy
    kind: type
    at: 'libs/api-types/src/stats.ts:L4-L15'
  - symbol: StatField
    kind: type
    at: 'libs/api-types/src/stats.ts:L17-L26'
  - symbol: StatFields
    kind: type
    at: 'libs/api-types/src/stats.ts:L28-L30'
  - symbol: StatsByVessel
    kind: type
    at: 'libs/api-types/src/stats.ts:L32-L40'
  - symbol: StatsGroupedBy
    kind: type
    at: 'libs/api-types/src/stats.ts:L42-L47'
  - symbol: TrackField
    kind: enum
    at: 'libs/api-types/src/tracks.ts:L3-L17'
  - symbol: TrackPointProperties
    kind: type
    at: 'libs/api-types/src/tracks.ts:L19-L19'
  - symbol: GeojsonTrackProperties
    kind: type
    at: 'libs/api-types/src/tracks.ts:L20-L23'
  - symbol: TrackPoint
    kind: type
    at: 'libs/api-types/src/tracks.ts:L24-L24'
  - symbol: TrackSegment
    kind: type
    at: 'libs/api-types/src/tracks.ts:L26-L26'
  - symbol: TrackResourceData
    kind: type
    at: 'libs/api-types/src/tracks.ts:L28-L28'
  - symbol: UserTrack
    kind: type
    at: 'libs/api-types/src/tracks.ts:L30-L30'
---

<!-- context:generated:start -->

## Summary

Filtering and region abstraction layered across multiple types. DatasetFilter type describes schema for any filterable field with validation constraints (min/max, length), data types, and optional enums. Regions type uses RegionType enum to map fishing management zones (EEZ, RFMO, MPA, FAO) to identifier lists, enabling multi-level geographic analysis. StatsGroupBy covers geographic dimensions (EEZ, FAO, MPA, RFMO) alongside vessel attributes (FLAG, GEARTYPE), supporting flexible breakdowns of fishing activity. TileContextAreaFeature generic wraps GeoJSON geometries with gfw_id for tile context lookup.

## Related

- part of [[api-types-type-definitions]] — Geospatial abstractions recur across filtering, events, stats, and track modules

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
