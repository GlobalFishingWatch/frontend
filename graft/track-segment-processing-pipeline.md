---
name: Track Segment Processing Pipeline
slug: track-segment-processing-pipeline
type: system
sources:
  - path: libs/data-transforms/src/filter-tracks-coordinates/index.ts
    hash: ef25ec558e4246c19a36d82aadcca0da8af15119d3108716e8167df9f0cc7077
  - path: libs/data-transforms/src/filter-tracks-coordinates/utils.ts
    hash: e51a0120461dc53ee5ffc8b060ba819d794dfe714d0f40494d349413a4d595e2
  - path: libs/data-transforms/src/list-to-track-segments/check-record-validity.ts
    hash: 884c1bb29fa1dc4ed53578f9f5c4988956568de745479f215263dc60e175709b
  - path: libs/data-transforms/src/list-to-track-segments/index.ts
    hash: be2a19877c146f6d89a278573fdf9a9fdd8a22b9dc5e4b1adf9132d16d9e8d81
  - path: >-
      libs/data-transforms/src/list-to-track-segments/list-to-track-segments.test.ts
    hash: bfd16dcd26987282726b56ce9a86ae8e0b42ce7f747310b6181b846bf68e1ba8
  - path: libs/data-transforms/src/list-to-track-segments/list-to-track-segments.ts
    hash: 3acf223be2a711084c163ec71b7f938d1a86971fea57ff9c7f126c27f98e869e
  - path: libs/data-transforms/src/merge-track-chunks/index.ts
    hash: ef557cf560f0ea8490fa935b5406b699fbf3ac91c6e5e8d930eb14134560eb83
sources_digest: 652dd8b06b38103be054d20c7c67b3bdb4eefe84da7042c7950f8105eb6f26fd
links:
  - to: antimeridian-geometry-handling
    relation: uses
    description: >-
      listToTrackSegments splits segments at ±180° longitude boundaries to
      prevent visual artifacts on world maps
  - to: coordinate-validation-and-normalization
    relation: uses
    description: >-
      listToTrackSegments and checkRecordValidity depend on coordinates module
      for parsing and validating lat/lon values
  - to: temporal-data-handling
    relation: uses
    description: >-
      Track segment conversion uses getUTCDate for flexible timestamp parsing
      and sorting by temporal order
generator:
  version: 1
covers:
  - symbol: TrackCoordinatesPropertyFilter
    kind: type
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L23-L28'
  - symbol: FilterTrackByCoordinatePropertiesParams
    kind: type
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L30-L34'
  - symbol: FilterTrackByCoordinatePropertiesArgs
    kind: type
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L36-L38'
  - symbol: FilterTrackByCoordinatePropertiesFn
    kind: type
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L40-L42'
  - symbol: LineCoordinateProperties
    kind: type
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L44-L44'
  - symbol: MultiLineCoordinateProperties
    kind: type
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L45-L45'
  - symbol: CoordinateProperties
    kind: type
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L46-L46'
  - symbol: CoordinatesAccumulator
    kind: type
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L47-L50'
  - symbol: GetCoordinatePropertyValueParams
    kind: type
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L52-L57'
  - symbol: getCoordinatePropertyValue
    kind: function
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L58-L69'
  - symbol: AddPropertyIndexToCoordinateParams
    kind: type
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L71-L76'
  - symbol: addCoordinatePropertyToCoordinate
    kind: function
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L77-L92'
  - symbol: GetFilteredCoordinatesParams
    kind: type
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L94-L99'
  - symbol: getFilteredCoordinates
    kind: function
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L100-L179'
  - symbol: getFilteredLines
    kind: function
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L181-L204'
  - symbol: FilteredTrackData
    kind: type
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L206-L206'
  - symbol: filterTrackByCoordinateProperties
    kind: function
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L207-L269'
  - symbol: filterByTimerangeMemoizeEqualityCheck
    kind: function
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L271-L280'
  - symbol: getTrackFilters
    kind: function
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L282-L296'
  - symbol: getTimeFilter
    kind: function
    at: 'libs/data-transforms/src/filter-tracks-coordinates/index.ts:L298-L309'
  - symbol: isNumeric
    kind: function
    at: 'libs/data-transforms/src/filter-tracks-coordinates/utils.ts:L1-L6'
  - symbol: Args
    kind: type
    at: >-
      libs/data-transforms/src/list-to-track-segments/check-record-validity.ts:L5-L7
  - symbol: RecordValidationErrors
    kind: type
    at: >-
      libs/data-transforms/src/list-to-track-segments/check-record-validity.ts:L9-L9
  - symbol: checkRecordValidity
    kind: function
    at: >-
      libs/data-transforms/src/list-to-track-segments/check-record-validity.ts:L11-L36
  - symbol: Columns
    kind: type
    at: >-
      libs/data-transforms/src/list-to-track-segments/list-to-track-segments.test.ts:L89-L89
  - symbol: readCsv
    kind: function
    at: >-
      libs/data-transforms/src/list-to-track-segments/list-to-track-segments.test.ts:L94-L104
  - symbol: describeTrackCsv
    kind: function
    at: >-
      libs/data-transforms/src/list-to-track-segments/list-to-track-segments.test.ts:L106-L173
  - symbol: getPointsById
    kind: function
    at: >-
      libs/data-transforms/src/list-to-track-segments/list-to-track-segments.test.ts:L119-L119
  - symbol: getExpectedPoints
    kind: function
    at: >-
      libs/data-transforms/src/list-to-track-segments/list-to-track-segments.test.ts:L121-L129
  - symbol: guess
    kind: function
    at: >-
      libs/data-transforms/src/list-to-track-segments/list-to-track-segments.test.ts:L134-L135
  - symbol: toSegments
    kind: function
    at: >-
      libs/data-transforms/src/list-to-track-segments/list-to-track-segments.test.ts:L191-L196
  - symbol: Args
    kind: type
    at: >-
      libs/data-transforms/src/list-to-track-segments/list-to-track-segments.ts:L11-L14
  - symbol: sortRecordsByTimestamp
    kind: function
    at: >-
      libs/data-transforms/src/list-to-track-segments/list-to-track-segments.ts:L18-L30
  - symbol: splitSegmentAtAntimeridian
    kind: function
    at: >-
      libs/data-transforms/src/list-to-track-segments/list-to-track-segments.ts:L32-L46
  - symbol: listToTrackSegments
    kind: function
    at: >-
      libs/data-transforms/src/list-to-track-segments/list-to-track-segments.ts:L48-L111
  - symbol: mergeTrackChunks
    kind: function
    at: 'libs/data-transforms/src/merge-track-chunks/index.ts:L3-L5'
---

<!-- context:generated:start -->

## Summary

End-to-end pipeline for converting raw CSV/list data into GeoJSON track segments for visualization, including schema inference (guessColumn), record validation (checkRecordValidity), list-to-segment conversion (listToTrackSegments), coordinate filtering (filterTrackByCoordinateProperties), and chunk consolidation (mergeTrackChunks). The system handles antimeridian splitting, temporal sorting, hierarchical grouping by line/segment IDs, and preservation of coordinate-level metadata.

## Related

- uses [[antimeridian-geometry-handling]] — listToTrackSegments splits segments at ±180° longitude boundaries to prevent visual artifacts on world maps
- uses [[coordinate-validation-and-normalization]] — listToTrackSegments and checkRecordValidity depend on coordinates module for parsing and validating lat/lon values
- uses [[temporal-data-handling]] — Track segment conversion uses getUTCDate for flexible timestamp parsing and sorting by temporal order

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
