---
name: Port Data Transformation
slug: port-data-transformation
type: system
sources:
  - path: libs/ocean-areas/src/scripts/lib/ports-to-geo.ts
    hash: ca68e304119248715536d7d5d8a97d465289095697198ac4beecbb67e61f5311
  - path: libs/ocean-areas/src/scripts/ports-to-list.ts
    hash: c182a523381d390ba67fdc8358366d612ee8cb1e61f70e661c339544772eeede
  - path: libs/ocean-areas/src/scripts/ports.ts
    hash: 688195fddef776a8d0e420ba4bdf0b67e7f5ccfc0c55d4bedea116b71f0c7ce8
sources_digest: f782e859d121a693377ecb19cdd8cb4e8e25c707c3f7ef363c258b6f432d9e69
links:
  - to: data-quality-filtering
    relation: uses
    description: >-
      Filters exclude placeholder names (numeric, hex, ISO codes) and records
      where name is prefixed with flag code
  - to: geojson-validation-and-invariants
    relation: implements
    description: >-
      Port transformation validates required fields (port_id, name, flag, lat,
      lon) and enforces coordinate bounds
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
  - symbol: PortFeature
    kind: type
    at: 'libs/ocean-areas/src/scripts/ports-to-list.ts:L5-L17'
  - symbol: PortListData
    kind: type
    at: 'libs/ocean-areas/src/scripts/ports-to-list.ts:L18-L22'
  - symbol: isPlaceholderName
    kind: function
    at: 'libs/ocean-areas/src/scripts/ports-to-list.ts:L28-L39'
  - symbol: quote
    kind: function
    at: 'libs/ocean-areas/src/scripts/ports-to-list.ts:L41-L43'
  - symbol: toTsModule
    kind: function
    at: 'libs/ocean-areas/src/scripts/ports-to-list.ts:L45-L54'
  - symbol: convertPortsToList
    kind: function
    at: 'libs/ocean-areas/src/scripts/ports-to-list.ts:L56-L89'
---

<!-- context:generated:start -->

## Summary

Multi-stage port data processing pipeline that converts raw port GeoJSON into validated geographic features and TypeScript modules. Includes filtering of placeholder entries, coordinate validation, and code generation for platform consumption.

## Related

- uses [[data-quality-filtering]] — Filters exclude placeholder names (numeric, hex, ISO codes) and records where name is prefixed with flag code
- implements [[geojson-validation-and-invariants]] — Port transformation validates required fields (port_id, name, flag, lat, lon) and enforces coordinate bounds

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
