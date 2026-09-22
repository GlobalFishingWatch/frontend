---
name: Data Types and Type Contracts
slug: data-types-and-type-contracts
type: file
sources:
  - path: libs/data-transforms/src/types.ts
    hash: 2a73fdbc7af5a953429edb2bc2f4664e09bc860a446db03a969f3d133251c6ad
sources_digest: eff89502b5070b82ac3044db721759dd6b0b8ea57dd593be6f533f9fe215d45a
links:
  - to: points-to-geojson-transformation
    relation: implements
    description: PointColumns type defines expected field structure for point features
  - to: segments-to-geojson-conversion
    relation: implements
    description: >-
      SegmentColumns type defines expected field structure for linestring
      segments
generator:
  version: 1
covers:
  - symbol: Bbox
    kind: type
    at: 'libs/data-transforms/src/types.ts:L3-L3'
  - symbol: SegmentColumns
    kind: type
    at: 'libs/data-transforms/src/types.ts:L5-L13'
  - symbol: PointColumns
    kind: type
    at: 'libs/data-transforms/src/types.ts:L15-L22'
---

<!-- context:generated:start -->

## Summary

Defines core TypeScript interfaces for the data-transforms library: Bbox (tuple of four numbers for bounding box), SegmentColumns and PointColumns for linestring and point field structures (supporting latitude/longitude, optional temporal markers, identifiers). Depends on DatasetFilters from @globalfishingwatch/api-types. Serves as contracts for downstream transformation functions ensuring consistent data schemas.

## Related

- implements [[points-to-geojson-transformation]] — PointColumns type defines expected field structure for point features
- implements [[segments-to-geojson-conversion]] — SegmentColumns type defines expected field structure for linestring segments

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
