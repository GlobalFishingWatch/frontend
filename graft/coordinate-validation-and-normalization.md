---
name: Coordinate Validation and Normalization
slug: coordinate-validation-and-normalization
type: concept
sources:
  - path: libs/data-transforms/src/coordinates/coordinates.ts
    hash: cecaec64992e381abddf4cc885583bd24ea73dcdb6c941d975c86cb9eaa9b923
  - path: libs/data-transforms/src/list-to-track-segments/check-record-validity.ts
    hash: 884c1bb29fa1dc4ed53578f9f5c4988956568de745479f215263dc60e175709b
sources_digest: 6ec10d418dfc66262a7192647eae3f39647324e3f99d678d2794d66397440e4d
links:
  - to: track-segment-processing-pipeline
    relation: part_of
    description: >-
      Coordinate validation is enforced at record validation and coordinate
      filtering stages within the track pipeline
generator:
  version: 1
covers:
  - symbol: isValidCoordinate
    kind: function
    at: 'libs/data-transforms/src/coordinates/coordinates.ts:L9-L11'
  - symbol: isValidLngLat
    kind: function
    at: 'libs/data-transforms/src/coordinates/coordinates.ts:L13-L20'
  - symbol: toLngLatCoordinates
    kind: function
    at: 'libs/data-transforms/src/coordinates/coordinates.ts:L22-L27'
  - symbol: parseCoords
    kind: function
    at: 'libs/data-transforms/src/coordinates/coordinates.ts:L29-L45'
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
---

<!-- context:generated:start -->

## Summary

Core validation and parsing logic enforced consistently across the system: latitude must fall within [-90, 90], longitude within [-180, 180]; null/undefined/empty strings are invalid (returning null gracefully) while zero is valid; string coordinates are parsed via geo-coordinates-parser to support DMS and other formats alongside numeric values. This constraint is enforced in coordinates.ts (isValidLngLat, toLngLatCoordinates, parseCoords) and reused by checkRecordValidity and filterTrackByCoordinateProperties.

## Related

- part of [[track-segment-processing-pipeline]] — Coordinate validation is enforced at record validation and coordinate filtering stages within the track pipeline

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
