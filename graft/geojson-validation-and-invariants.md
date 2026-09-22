---
name: GeoJSON Validation and Invariants
slug: geojson-validation-and-invariants
type: concept
sources:
  - path: libs/ocean-areas/src/scripts/lib/ports-to-geo.ts
    hash: ca68e304119248715536d7d5d8a97d465289095697198ac4beecbb67e61f5311
  - path: libs/ocean-areas/src/scripts/lib/prepare.ts
    hash: 93195aa52d803c28338316d621e56047cc2a61958023f7a02485caa77f38bda1
  - path: libs/ocean-areas/src/scripts/lib/types.ts
    hash: 8b5c9fd6b3aec1c6e680542a4f53fc5b4267b178001d7b958d5434172eeee51a
sources_digest: 683c03a7d7582d476c01e9ee28d89ce6699fb56cab455a47eae29eeb0c89711a
links: []
generator:
  version: 1
covers:
  - symbol: PortData
    kind: type
    at: 'libs/ocean-areas/src/scripts/lib/ports-to-geo.ts:L3-L9'
  - symbol: GeoJSONFeature
    kind: type
    at: 'libs/ocean-areas/src/scripts/lib/ports-to-geo.ts:L11-L23'
  - symbol: GeoJSON
    kind: type
    at: 'libs/ocean-areas/src/scripts/lib/ports-to-geo.ts:L25-L28'
  - symbol: convertPortsToGeoJSON
    kind: function
    at: 'libs/ocean-areas/src/scripts/lib/ports-to-geo.ts:L30-L93'
  - symbol: existsFilePath
    kind: function
    at: 'libs/ocean-areas/src/scripts/lib/prepare.ts:L13-L18'
  - symbol: prepare
    kind: function
    at: 'libs/ocean-areas/src/scripts/lib/prepare.ts:L20-L139'
  - symbol: AreaType
    kind: type
    at: 'libs/ocean-areas/src/scripts/lib/types.ts:L3-L3'
  - symbol: AreaGeometryMode
    kind: type
    at: 'libs/ocean-areas/src/scripts/lib/types.ts:L5-L5'
  - symbol: AreaConfig
    kind: type
    at: 'libs/ocean-areas/src/scripts/lib/types.ts:L6-L20'
---

<!-- context:generated:start -->

## Summary

Central validation contract across all area types: required properties (type, area, name, flag for some types), coordinate bounds enforcement (lat [-90,90], lon [-180,180]), RFC 7946 compliance, and graceful handling of invalid/missing geometry. Failed records are logged but don't halt pipeline.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
