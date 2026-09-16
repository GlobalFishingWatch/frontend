---
name: Defensive Parsing and Error Normalization
slug: defensive-parsing-and-error-normalization
type: concept
sources:
  - path: libs/data-transforms/src/files/geotiff-bands.ts
    hash: b17ef07dc0a20b03546203611ef7f6cd6e9d43030b08cffb7a9d744c8646074f
  - path: libs/data-transforms/src/files/kml-to-geojson.ts
    hash: 8f66efea441a9e1ba7ef8ce8a737ce9e5c233769bd9c7a9393242c8db9c0508b
  - path: libs/data-transforms/src/files/netcdf-variables.ts
    hash: 2ba29e695a8c778b0fa87113fe68482f7c66fc1d586d99cf1535e1455d8dae57
  - path: libs/data-transforms/src/files/shp-to-geojson.ts
    hash: 32076fb8375c2e9c0d8b92e813ef0a693f8772e87169c75edb87ce71d6938a0f
sources_digest: 4c79fe52c181d547e3a2671de2f981fcbd88c2f66832722abd2b90e5e02ce44a
links:
  - to: file-format-conversion-pipeline
    relation: part_of
    description: >-
      Error normalization is a cross-cutting pattern implemented across all file
      format converters
generator:
  version: 1
covers:
  - symbol: GeotiffError
    kind: type
    at: 'libs/data-transforms/src/files/geotiff-bands.ts:L6-L6'
  - symbol: getGeotiffBandsCount
    kind: function
    at: 'libs/data-transforms/src/files/geotiff-bands.ts:L12-L24'
  - symbol: invalidDataErrorHandler
    kind: function
    at: 'libs/data-transforms/src/files/kml-to-geojson.ts:L13-L24'
  - symbol: hasAnyTag
    kind: function
    at: 'libs/data-transforms/src/files/kml-to-geojson.ts:L26-L27'
  - symbol: toMillis
    kind: function
    at: 'libs/data-transforms/src/files/kml-to-geojson.ts:L29-L33'
  - symbol: parseCoordinateTimes
    kind: function
    at: 'libs/data-transforms/src/files/kml-to-geojson.ts:L35-L49'
  - symbol: kmlToGeoJSON
    kind: function
    at: 'libs/data-transforms/src/files/kml-to-geojson.ts:L51-L102'
  - symbol: NetcdfType
    kind: type
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L6-L6'
  - symbol: NetcdfError
    kind: type
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L7-L7'
  - symbol: GeoAxis
    kind: type
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L27-L27'
  - symbol: NetcdfCoordinate
    kind: type
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L28-L28'
  - symbol: geoAxisOf
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L31-L43'
  - symbol: hasLatLonCoordinates
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L49-L52'
  - symbol: startsWith
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L54-L55'
  - symbol: netcdfMagicFromBytes
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L57-L65'
  - symbol: readNetcdfType
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L67-L70'
  - symbol: attributeText
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L72-L77'
  - symbol: netcdf3Coordinates
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L80-L87'
  - symbol: Netcdf3Variable
    kind: type
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L89-L89'
  - symbol: readNetcdf3Header
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L92-L106'
  - symbol: getNetcdf3Variables
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L108-L116'
  - symbol: rejectInvalidNetcdf
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L118-L120'
  - symbol: getNetcdfVariables
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.ts:L128-L159'
  - symbol: invalidDataErrorHandler
    kind: function
    at: 'libs/data-transforms/src/files/shp-to-geojson.ts:L6-L17'
  - symbol: shpToGeoJSON
    kind: function
    at: 'libs/data-transforms/src/files/shp-to-geojson.ts:L19-L48'
---

<!-- context:generated:start -->

## Summary

Design pattern across file format converters (geotiff-bands, netcdf-variables, kml-to-geojson, shp-to-geojson) where all parsing exceptions are caught and re-thrown as canonical error types (GEOTIFF_ERRORS.InvalidData, NETCDF_ERRORS.InvalidData) with the original cause preserved. This allows callers to implement uniform error handling without needing to know internal parsing library exceptions, while preserving diagnostic context for debugging.

## Related

- part of [[file-format-conversion-pipeline]] — Error normalization is a cross-cutting pattern implemented across all file format converters

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
