---
name: Web Worker Offloading for Heavy I/O
slug: web-worker-offloading-for-heavy-i-o
type: concept
sources:
  - path: libs/data-transforms/src/files/netcdf-hdf5.worker.client.ts
    hash: fdd112e6aba791c4acdf83c6d25680cbeb049f4ed29837fc98995027cc72ef49
  - path: libs/data-transforms/src/files/netcdf-hdf5.worker.ts
    hash: 52e403ae111df11500cee29b2569ee3bdf5e818bdf2a60767632eb69bfea8a66
  - path: libs/data-transforms/src/files/netcdf-variables.ts
    hash: 2ba29e695a8c778b0fa87113fe68482f7c66fc1d586d99cf1535e1455d8dae57
sources_digest: f2968c1e649bdd831feb880653f7db2a8c46f46163d4c524df45a3a8675bc14d
links:
  - to: file-format-conversion-pipeline
    relation: part_of
    description: >-
      Web worker offloading is a performance optimization for heavy file parsing
      within the file conversion pipeline
generator:
  version: 1
covers:
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
---

<!-- context:generated:start -->

## Summary

Pattern where heavy I/O and parsing work (NetCDF4/HDF5 analysis via h5wasm, ZIP extraction via JSZip) is delegated to dedicated Web Worker threads via a worker client factory (createWorkerClient). The main thread instantiates the client with a worker URL, sends File objects for processing, and receives parsed results via Promise, avoiding main-thread blocking for large files. Worker state (Emscripten WORKERFS mount) is carefully reset between invocations to prevent state leakage.

## Related

- part of [[file-format-conversion-pipeline]] — Web worker offloading is a performance optimization for heavy file parsing within the file conversion pipeline

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
