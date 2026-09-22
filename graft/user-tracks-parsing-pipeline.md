---
name: user-tracks parsing pipeline
slug: user-tracks-parsing-pipeline
type: system
sources:
  - path: libs/deck-loaders/src/user/lib/parse-user-tracks.spec.ts
    hash: 8c71c4de41f67f415b9add92b48b334d5a90444b8607433a5234f05192aaa16b
  - path: libs/deck-loaders/src/user/lib/parse-user-tracks.ts
    hash: 7e7f6d50ae2fe1b93ea1b926048bd6167fbef25255ccd05ead8b43971e58aa29
  - path: libs/deck-loaders/src/user/lib/types.ts
    hash: d2d4b4bb7e49883f281ccb5387f6249adbd35c9aad3631f183551b7f8b9a4ee8
  - path: libs/deck-loaders/src/user/lib/utils.spec.ts
    hash: 4214dcacdc5e7cfe153db645bb6c262a5f783b481a92504eae899865661c5cb5
  - path: libs/deck-loaders/src/user/lib/utils.ts
    hash: 742a7cc5e7e38ddb39dd32c046a6e413fd89264599661672a8211d1b0f99eaa3
sources_digest: 688c003e295c8e2e6fe1350db37dae16668c73e903a6e6d03b79cfd226822535
links:
  - to: feature-filtering-system
    relation: uses
    description: >-
      filterTrackByCoordinateProperties uses isFeatureInFilters to evaluate
      feature-level properties, delegating categorical/range matching logic
  - to: user-tracks-loaders-loaders-gl
    relation: produces
    description: >-
      parseUserTrack is the backend invoked by UserTrackLoader and
      UserTrackWorkerLoader to transform binary data into parsed UserTrackData
  - to: user-tracks-simplification-and-lod-selection
    relation: uses
    description: >-
      parseUserTrack calls buildUserTrackLods to generate pyramid of simplified
      representations; buildUserTrackLods calls simplifyUserTrackBinary to
      create coarser levels
generator:
  version: 1
covers:
  - symbol: fullBinary
    kind: function
    at: 'libs/deck-loaders/src/user/lib/parse-user-tracks.spec.ts:L6-L7'
  - symbol: createLineStringFeature
    kind: function
    at: 'libs/deck-loaders/src/user/lib/parse-user-tracks.spec.ts:L18-L38'
  - symbol: createUserTrack
    kind: function
    at: 'libs/deck-loaders/src/user/lib/parse-user-tracks.spec.ts:L40-L43'
  - symbol: toArrayBuffer
    kind: function
    at: 'libs/deck-loaders/src/user/lib/parse-user-tracks.spec.ts:L45-L48'
  - symbol: arrayBufferToJson
    kind: function
    at: 'libs/deck-loaders/src/user/lib/parse-user-tracks.ts:L8-L17'
  - symbol: ParseUserTrackParams
    kind: type
    at: 'libs/deck-loaders/src/user/lib/parse-user-tracks.ts:L19-L24'
  - symbol: parseUserTrack
    kind: function
    at: 'libs/deck-loaders/src/user/lib/parse-user-tracks.ts:L28-L102'
  - symbol: UserTrackBinaryData
    kind: type
    at: 'libs/deck-loaders/src/user/lib/types.ts:L3-L15'
  - symbol: UserTrackFeatureProperties
    kind: type
    at: 'libs/deck-loaders/src/user/lib/types.ts:L17-L20'
  - symbol: UserTrackFeature
    kind: type
    at: 'libs/deck-loaders/src/user/lib/types.ts:L21-L21'
  - symbol: UserTrackRawData
    kind: type
    at: 'libs/deck-loaders/src/user/lib/types.ts:L22-L25'
  - symbol: UserTrackLod
    kind: type
    at: 'libs/deck-loaders/src/user/lib/types.ts:L27-L31'
  - symbol: UserTrackData
    kind: type
    at: 'libs/deck-loaders/src/user/lib/types.ts:L33-L38'
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

Parses ArrayBuffer-encoded user GPS track data into GeoJSON with level-of-detail (LOD) binary representations for efficient deck.gl rendering. Chains filterTrackByCoordinateProperties → buildUserTrackLods → parseUserTrack, handling both LineString and MultiLineString geometries while maintaining timestamp alignment.

## Related

- uses [[feature-filtering-system]] — filterTrackByCoordinateProperties uses isFeatureInFilters to evaluate feature-level properties, delegating categorical/range matching logic
- produces [[user-tracks-loaders-loaders-gl]] — parseUserTrack is the backend invoked by UserTrackLoader and UserTrackWorkerLoader to transform binary data into parsed UserTrackData
- uses [[user-tracks-simplification-and-lod-selection]] — parseUserTrack calls buildUserTrackLods to generate pyramid of simplified representations; buildUserTrackLods calls simplifyUserTrackBinary to create coarser levels

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
