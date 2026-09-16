---
name: File Handling and Upload Utilities
slug: file-handling-and-upload-utilities
type: file
sources:
  - path: apps/platform/utils/files.ts
    hash: fcaaad5ab3c01e7ce2979c55635297daba13f4b52ffdf6fd9fd39a021d62c9c7
sources_digest: f987a2b02a6fab7d4377cdc9fdb5e9c439827db9f5dd0a80c91b7c8fc1af4ff9
links:
  - to: redux-test-store
    relation: uses
    description: File utilities use dataset configuration types from store fixtures
generator:
  version: 1
covers:
  - symbol: getFileName
    kind: function
    at: 'apps/platform/utils/files.ts:L16-L23'
  - symbol: FileType
    kind: type
    at: 'apps/platform/utils/files.ts:L25-L25'
  - symbol: MimeExtention
    kind: type
    at: 'apps/platform/utils/files.ts:L26-L50'
  - symbol: MimeType
    kind: type
    at: 'apps/platform/utils/files.ts:L51-L62'
  - symbol: MimeExtentionWithoutShp
    kind: type
    at: 'apps/platform/utils/files.ts:L64-L64'
  - symbol: DatasetGeometryTypesSupported
    kind: type
    at: 'apps/platform/utils/files.ts:L91-L94'
  - symbol: getFileTypes
    kind: function
    at: 'apps/platform/utils/files.ts:L103-L104'
  - symbol: FileConfig
    kind: type
    at: 'apps/platform/utils/files.ts:L106-L106'
  - symbol: FileTypeResult
    kind: type
    at: 'apps/platform/utils/files.ts:L126-L126'
  - symbol: getFileType
    kind: function
    at: 'apps/platform/utils/files.ts:L127-L145'
  - symbol: getFileFromZipContent
    kind: function
    at: 'apps/platform/utils/files.ts:L147-L161'
  - symbol: getFilesAcceptedByMime
    kind: function
    at: 'apps/platform/utils/files.ts:L163-L183'
  - symbol: readBlobAs
    kind: function
    at: 'apps/platform/utils/files.ts:L187-L207'
  - symbol: getFileFromGeojson
    kind: function
    at: 'apps/platform/utils/files.ts:L209-L221'
---

<!-- context:generated:start -->

## Summary

File validation, format detection, and geospatial data transformation for dataset uploads. Detects file formats (GeoJSON, Shapefile, CSV, KML, GeoTIFF, NetCDF) from File objects and ZIP archives, constructs browser file input accept attributes, provides Promise-based FileReader wrappers, and serializes GeoFeatureCollections to File objects for download.

## Related

- uses [[redux-test-store]] — File utilities use dataset configuration types from store fixtures

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
