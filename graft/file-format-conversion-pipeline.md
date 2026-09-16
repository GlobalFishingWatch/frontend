---
name: File Format Conversion Pipeline
slug: file-format-conversion-pipeline
type: system
sources:
  - path: libs/data-transforms/src/files/geotiff-bands.test.ts
    hash: 565948cfea1449ce3691a7441bd7b65a2313d59ae9a305277a75d3cc32af0f0e
  - path: libs/data-transforms/src/files/geotiff-bands.ts
    hash: b17ef07dc0a20b03546203611ef7f6cd6e9d43030b08cffb7a9d744c8646074f
  - path: libs/data-transforms/src/files/index.ts
    hash: daad52af59473a8e8d28a61e6e24c290956e1657734cc5e45e6f10ba74365ade
  - path: libs/data-transforms/src/files/kml-to-geojson.ts
    hash: 8f66efea441a9e1ba7ef8ce8a737ce9e5c233769bd9c7a9393242c8db9c0508b
  - path: libs/data-transforms/src/files/netcdf-hdf5.worker.client.ts
    hash: fdd112e6aba791c4acdf83c6d25680cbeb049f4ed29837fc98995027cc72ef49
  - path: libs/data-transforms/src/files/netcdf-hdf5.worker.ts
    hash: 52e403ae111df11500cee29b2569ee3bdf5e818bdf2a60767632eb69bfea8a66
  - path: libs/data-transforms/src/files/netcdf-variables.test.ts
    hash: 79c68b7a2d2b75c1d62d51de6398fce02e8dea531321c187ca1b9931ac6a6053
  - path: libs/data-transforms/src/files/netcdf-variables.ts
    hash: 2ba29e695a8c778b0fa87113fe68482f7c66fc1d586d99cf1535e1455d8dae57
  - path: libs/data-transforms/src/files/shp-to-geojson.ts
    hash: 32076fb8375c2e9c0d8b92e813ef0a693f8772e87169c75edb87ce71d6938a0f
  - path: libs/data-transforms/src/files/text-encoding.ts
    hash: 7d4747a3b45e863c14e0884dda64872d51434496e2306aaddb554bb89bf2f5e7
  - path: libs/data-transforms/src/files/zip-to-files.test.ts
    hash: a4b309fa28dde1196533e2136ae93d10d39bb196b7410d5227a9ab0f99cb0e8e
  - path: libs/data-transforms/src/files/zip-to-files.ts
    hash: eaaeb5101ab20711284fef0f5c599fc34a421cef6a5956fa3d9281e9bdc25f2a
sources_digest: 678205c9a76116c97f129fe4f63d744e8c758be298f145cfcf979a9e0d1baf59
links:
  - to: archive-and-encoding-utilities
    relation: uses
    description: >-
      KML/KMZ conversion uses zipToFiles for decompression, and text encoding
      repair via fixTextEncoding handles mojibake in imported data
  - to: defensive-parsing-and-error-normalization
    relation: uses
    description: >-
      All file converters wrap parsing exceptions into canonical error types
      (GEOTIFF_ERRORS, NETCDF_ERRORS) for consistent upstream error handling
  - to: web-worker-offloading-for-heavy-i-o
    relation: uses
    description: >-
      NetCDF4/HDF5 parsing delegates to netcdf-hdf5.worker to avoid main-thread
      blocking for large scientific data files
generator:
  version: 1
covers:
  - symbol: writeTiff
    kind: function
    at: 'libs/data-transforms/src/files/geotiff-bands.test.ts:L11-L22'
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
  - symbol: getNetcdf4VariablesFromFile
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-hdf5.worker.client.ts:L8-L10'
  - symbol: isDataset
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-hdf5.worker.ts:L11-L12'
  - symbol: attributeText
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-hdf5.worker.ts:L15-L19'
  - symbol: rootDatasets
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-hdf5.worker.ts:L21-L25'
  - symbol: isGeospatialHdf5
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-hdf5.worker.ts:L28-L35'
  - symbol: listGriddableHdf5Variables
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-hdf5.worker.ts:L37-L44'
  - symbol: resetWorkMount
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-hdf5.worker.ts:L49-L63'
  - symbol: readVariablesFromFile
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-hdf5.worker.ts:L65-L92'
  - symbol: UnidataExample
    kind: type
    at: 'libs/data-transforms/src/files/netcdf-variables.test.ts:L40-L46'
  - symbol: example
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.test.ts:L53-L59'
  - symbol: header
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.test.ts:L66-L72'
  - symbol: asBlob
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.test.ts:L73-L73'
  - symbol: asFile
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.test.ts:L74-L74'
  - symbol: asHdf5
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.test.ts:L75-L75'
  - symbol: hdf5MagicFile
    kind: function
    at: 'libs/data-transforms/src/files/netcdf-variables.test.ts:L78-L78'
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
  - symbol: fixTextEncoding
    kind: function
    at: 'libs/data-transforms/src/files/text-encoding.ts:L1-L31'
  - symbol: zipContent
    kind: function
    at: 'libs/data-transforms/src/files/zip-to-files.test.ts:L6-L11'
  - symbol: isZipFile
    kind: function
    at: 'libs/data-transforms/src/files/zip-to-files.ts:L5-L9'
  - symbol: isJunkEntry
    kind: function
    at: 'libs/data-transforms/src/files/zip-to-files.ts:L12-L13'
  - symbol: zipToFiles
    kind: function
    at: 'libs/data-transforms/src/files/zip-to-files.ts:L15-L29'
  - symbol: findZipEntries
    kind: function
    at: 'libs/data-transforms/src/files/zip-to-files.ts:L32-L34'
  - symbol: zipEntryToFile
    kind: function
    at: 'libs/data-transforms/src/files/zip-to-files.ts:L36-L39'
---

<!-- context:generated:start -->

## Summary

Modular collection of file parsers and converters that transform external geospatial and scientific data formats (KML, KMZ, Shapefile, GeoTIFF, NetCDF3/4, ZIP, text encodings) into normalized GeoJSON or JavaScript objects for downstream processing. Each converter validates input geometry types against a declared DatasetGeometryType (tracks, points, polygons) and handles format-specific metadata extraction.

## Related

- uses [[archive-and-encoding-utilities]] — KML/KMZ conversion uses zipToFiles for decompression, and text encoding repair via fixTextEncoding handles mojibake in imported data
- uses [[defensive-parsing-and-error-normalization]] — All file converters wrap parsing exceptions into canonical error types (GEOTIFF_ERRORS, NETCDF_ERRORS) for consistent upstream error handling
- uses [[web-worker-offloading-for-heavy-i-o]] — NetCDF4/HDF5 parsing delegates to netcdf-hdf5.worker to avoid main-thread blocking for large scientific data files

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
