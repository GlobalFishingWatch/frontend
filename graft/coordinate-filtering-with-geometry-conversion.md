---
name: coordinate filtering with geometry conversion
slug: coordinate-filtering-with-geometry-conversion
type: concept
sources:
  - path: libs/deck-loaders/src/user/lib/utils.spec.ts
    hash: 4214dcacdc5e7cfe153db645bb6c262a5f783b481a92504eae899865661c5cb5
  - path: libs/deck-loaders/src/user/lib/utils.ts
    hash: 742a7cc5e7e38ddb39dd32c046a6e413fd89264599661672a8211d1b0f99eaa3
sources_digest: a222848b303b2133c0b60f1363d5fd402329804ba9113bcc03af621af4089fc3
links:
  - to: user-tracks-parsing-pipeline
    relation: part_of
    description: >-
      filterTrackByCoordinateProperties implements this pattern when processing
      features before parseUserTrack
generator:
  version: 1
covers:
  - symbol: TrackCoordinatesPropertyFilter
    kind: type
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L11-L17'
  - symbol: FilterTrackByCoordinatePropertiesParams
    kind: type
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L19-L24'
  - symbol: FilterTrackByCoordinatePropertiesArgs
    kind: type
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L26-L28'
  - symbol: FilterTrackByCoordinatePropertiesFn
    kind: type
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L30-L32'
  - symbol: LineCoordinateProperties
    kind: type
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L34-L34'
  - symbol: MultiLineCoordinateProperties
    kind: type
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L35-L35'
  - symbol: CoordinateProperties
    kind: type
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L36-L36'
  - symbol: CoordinatesAccumulator
    kind: type
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L37-L40'
  - symbol: GetCoordinatePropertyValueParams
    kind: type
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L42-L47'
  - symbol: getCoordinatePropertyValue
    kind: function
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L48-L59'
  - symbol: AddPropertyIndexToCoordinateParams
    kind: type
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L61-L66'
  - symbol: addCoordinatePropertyToCoordinate
    kind: function
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L67-L82'
  - symbol: GetFilteredCoordinatesParams
    kind: type
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L84-L90'
  - symbol: getFilteredCoordinates
    kind: function
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L91-L180'
  - symbol: getFilteredLines
    kind: function
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L182-L208'
  - symbol: getCoordinatesFilter
    kind: function
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L210-L233'
  - symbol: filterTrackByCoordinateProperties
    kind: function
    at: 'libs/deck-loaders/src/user/lib/utils.ts:L235-L328'
---

<!-- context:generated:start -->

## Summary

Design pattern in filterTrackByCoordinateProperties where filtering at the coordinate level (via coordinateProperties like timestamps) triggers automatic geometry type conversion from LineString to MultiLineString. Fragmented coordinate results are split into separate line segments, each with leading points prepended to maintain geometric continuity.

## Related

- part of [[user-tracks-parsing-pipeline]] — filterTrackByCoordinateProperties implements this pattern when processing features before parseUserTrack

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
