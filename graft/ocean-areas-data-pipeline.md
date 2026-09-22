---
name: Ocean Areas Data Pipeline
slug: ocean-areas-data-pipeline
type: system
sources:
  - path: libs/ocean-areas/src/scripts/lib/prepare.ts
    hash: 93195aa52d803c28338316d621e56047cc2a61958023f7a02485caa77f38bda1
  - path: libs/ocean-areas/src/scripts/lib/simplify.ts
    hash: 2cb57b9d7897b06047092d688e48e4ed0536a3d541ed361a36e94df943aabe1b
  - path: libs/ocean-areas/src/scripts/lib/storage.ts
    hash: 7f7058304c5de799304d2eb8df5888a4e8fa55d76b3b8e61b741bb54bb7b787f
  - path: libs/ocean-areas/src/scripts/lib/types.ts
    hash: 8b5c9fd6b3aec1c6e680542a4f53fc5b4267b178001d7b958d5434172eeee51a
  - path: libs/ocean-areas/src/scripts/lib/utils.ts
    hash: 380ca2fd5dd56bdce37465814bc1f79db31596819d461d44645c448e299f2131
  - path: libs/ocean-areas/src/scripts/mpas.ts
    hash: 0ac62a0de4c95d508557c175cbba4b77129228c033ee10cdceab044fe8d28ea3
  - path: libs/ocean-areas/src/scripts/ports.ts
    hash: 688195fddef776a8d0e420ba4bdf0b67e7f5ccfc0c55d4bedea116b71f0c7ce8
  - path: libs/ocean-areas/src/scripts/rfmos.ts
    hash: c18992b308fc87962d2cc13bd06727ca7a232c47055a0d861993ab0c751b95ff
sources_digest: a1b1fbd1df9fc357c84b7ded74f53957f59108f95181c9c300aa3832409d1570
links:
  - to: cloud-storage-integration
    relation: uses
    description: >-
      Optional downloadFolder call fetches raw GeoJSON datasets from Google
      Cloud Storage buckets
  - to: geojson-validation-and-invariants
    relation: depends_on
    description: >-
      Pipeline enforces required properties (type, area, name, flag), validates
      geometry, and handles missing data gracefully
  - to: geometry-simplification
    relation: uses
    description: >-
      Each dataset transformation depends on simplifyArea to reduce polygon
      complexity and select geometry representation
  - to: port-data-transformation
    relation: uses
    description: >-
      Prepare orchestrates port data ETL including geometry mode selection and
      property mapping
generator:
  version: 1
covers:
  - symbol: existsFilePath
    kind: function
    at: 'libs/ocean-areas/src/scripts/lib/prepare.ts:L13-L18'
  - symbol: prepare
    kind: function
    at: 'libs/ocean-areas/src/scripts/lib/prepare.ts:L20-L139'
  - symbol: simplifyArea
    kind: function
    at: 'libs/ocean-areas/src/scripts/lib/simplify.ts:L6-L66'
  - symbol: downloadFolder
    kind: function
    at: 'libs/ocean-areas/src/scripts/lib/storage.ts:L11-L56'
  - symbol: AreaType
    kind: type
    at: 'libs/ocean-areas/src/scripts/lib/types.ts:L3-L3'
  - symbol: AreaGeometryMode
    kind: type
    at: 'libs/ocean-areas/src/scripts/lib/types.ts:L5-L5'
  - symbol: AreaConfig
    kind: type
    at: 'libs/ocean-areas/src/scripts/lib/types.ts:L6-L20'
  - symbol: renderBar
    kind: function
    at: 'libs/ocean-areas/src/scripts/lib/utils.ts:L1-L8'
---

<!-- context:generated:start -->

## Summary

Transforms raw geographic datasets (EEZ, MPA, RFMO, FAO, ports) into GeoJSON-formatted, simplified features for global ocean area knowledge base. Orchestrates download from cloud storage, validation, geometry simplification, and output formatting with configurable filtering and property mapping.

## Related

- uses [[cloud-storage-integration]] — Optional downloadFolder call fetches raw GeoJSON datasets from Google Cloud Storage buckets
- depends on [[geojson-validation-and-invariants]] — Pipeline enforces required properties (type, area, name, flag), validates geometry, and handles missing data gracefully
- uses [[geometry-simplification]] — Each dataset transformation depends on simplifyArea to reduce polygon complexity and select geometry representation
- uses [[port-data-transformation]] — Prepare orchestrates port data ETL including geometry mode selection and property mapping

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
